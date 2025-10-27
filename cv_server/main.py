from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from ultralytics import YOLO
import cv2
import numpy as np
from pathlib import Path
import torch

# --- YOLO internals ---
from ultralytics.nn.tasks import DetectionModel
from torch.nn.modules.container import Sequential, ModuleList, ModuleDict
import ultralytics.nn.modules.conv as conv
import ultralytics.nn.modules.block as block
from torch.nn.modules.conv import Conv2d
from torch.nn.modules.batchnorm import BatchNorm2d
from torch.nn.modules.pooling import MaxPool2d, AvgPool2d, AdaptiveAvgPool2d
from torch.nn.modules.upsampling import Upsample
from torch.nn.modules.activation import SiLU
from ultralytics.nn.modules.conv import Concat
from ultralytics.nn.modules.head import Detect  # ✅ added for this exact error

# ✅ Allow YOLO-related modules for safe PyTorch loading (PyTorch 2.6+ fix)
torch.serialization.add_safe_globals([
    DetectionModel,
    Sequential,
    conv.Conv,
    block.C2f,
    block.Bottleneck,
    block.SPPF,
    block.C3,
    block.C3x,
    ModuleList,
    ModuleDict,
    Conv2d,
    BatchNorm2d,
    MaxPool2d,
    AvgPool2d,
    AdaptiveAvgPool2d,
    Upsample,
    SiLU,
    Concat,
    Detect,  # ✅ new addition to fix your latest error
])

# --- FastAPI setup ---
app = FastAPI()

# Allow frontend requests (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Load YOLO model ---
MODEL_PATH = Path(__file__).resolve().parent.parent / "overcrowd-model.pt"
import torch
from torch.serialization import add_safe_globals
import ultralytics.nn.modules.block as block
import ultralytics.nn.modules.head as head

# Allow YOLO custom layers to be loaded safely
add_safe_globals([block.DFL, head.Detect])
model = YOLO(str(MODEL_PATH))

# --- Constants ---
DENSITY_THRESHOLD = 0.25


# --- Response model ---
class CountResponse(BaseModel):
    person_count: int
    density: float
    overcrowded: bool
    width: int
    height: int


# --- API route ---
@app.post("/count", response_model=CountResponse)
async def count_people(file: UploadFile = File(...)):
    data = await file.read()
    image_array = np.frombuffer(data, np.uint8)
    frame = cv2.imdecode(image_array, cv2.IMREAD_COLOR)

    if frame is None:
        return CountResponse(person_count=0, density=0.0, overcrowded=False, width=0, height=0)

    h, w = frame.shape[:2]
    results = model(frame, verbose=False)[0]

    total_person_area = 0
    person_count = 0

    for box in results.boxes:
        if int(box.cls[0]) == 0:  # person class
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            total_person_area += max(0, (x2 - x1)) * max(0, (y2 - y1))
            person_count += 1

    frame_area = max(1, w * h)
    density = float(total_person_area) / float(frame_area)
    overcrowded = density > DENSITY_THRESHOLD

    return CountResponse(
        person_count=person_count,
        density=round(density, 4),
        overcrowded=overcrowded,
        width=w,
        height=h,
    )


# --- Server start ---
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=False)

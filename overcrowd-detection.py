from ultralytics import YOLO
import cv2


model = YOLO('overcrowd-model.pt')  


DENSITY_THRESHOLD = 0.25  
SCALE = 0.75  


video_path = 'sample1.mp4'
cap = cv2.VideoCapture(video_path)

if not cap.isOpened():
    print("Error: Could not open video.")
    exit()


orig_width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
orig_height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
fps = cap.get(cv2.CAP_PROP_FPS)


resized_width = int(orig_width * SCALE)
resized_height = int(orig_height * SCALE)
frame_area = resized_width * resized_height


out = cv2.VideoWriter('output_density_based.mp4',
                      cv2.VideoWriter_fourcc(*'mp4v'),
                      fps, (resized_width, resized_height))

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        print("❌ No frame received — video might have ended or path is wrong.")
        break

    print("✅ Frame read successfully")

    frame_resized = cv2.resize(frame, (resized_width, resized_height))
    results = model(frame_resized, verbose=False)[0]

    person_count = 0
    total_person_area = 0

    for box in results.boxes:
        if int(box.cls[0]) == 0:  
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            total_person_area += (x2 - x1) * (y2 - y1)
            person_count += 1
            cv2.rectangle(frame_resized, (x1, y1), (x2, y2), (0, 255, 0), 2)

    density = total_person_area / frame_area if frame_area > 0 else 0
    is_overcrowded = density > DENSITY_THRESHOLD

    label = f"People: {person_count} {'OVER-CROWDED' if is_overcrowded else 'SAFE'} | Density: {density:.2f}"
    color = (0, 0, 255) if is_overcrowded else (0, 255, 0)
    cv2.putText(frame_resized, label, (30, 50), cv2.FONT_HERSHEY_SIMPLEX, 1.0, color, 3)

    cv2.imshow("Overcrowd Detection", frame_resized)

    if cv2.waitKey(25) & 0xFF == ord('q'):
        print("🛑 Exiting loop on key press.")
        break

cap.release()
out.release()
cv2.destroyAllWindows()

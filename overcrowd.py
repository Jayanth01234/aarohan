from ultralytics import YOLO
import cv2
import pygame 
pygame.mixer.init()
# pygame.mixer.music.load("siren.wav")

model=YOLO("yolov8n.pt")
from fastapi import FastAPI
import base64
import face_recognition
import numpy as np
import cv2

app = FastAPI()

@app.post("/recognize")
async def recognize(data: dict):

    image_base64 = data["image"]

    image_bytes = base64.b64decode(image_base64.split(",")[1])
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    face_locations = face_recognition.face_locations(img)

    return {
        "faces_detected": len(face_locations)
    }
from fastapi import FastAPI
import base64
import face_recognition
import numpy as np
import cv2

app = FastAPI()

@app.post("/recognize")
async def recognize(data: dict):

    try:
        img_base64 = data["image"]

        

        img_bytes = base64.b64decode(img_base64)

        np_arr = np.frombuffer(img_bytes, np.uint8)

        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if image is None:
            return {"success": False, "error": "image decode failed"}

        rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        face_locations = face_recognition.face_locations(rgb)

        if len(face_locations) == 0:
            return {"success": False}

        encoding = face_recognition.face_encodings(rgb, face_locations)[0]

        return {
            "success": True,
            "encoding": encoding.tolist()
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
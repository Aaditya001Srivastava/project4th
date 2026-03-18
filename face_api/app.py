from fastapi import FastAPI
import base64
import face_recognition
import numpy as np
import cv2

app = FastAPI()


# 🔹 COMMON FUNCTION (reuse for both)
def process_image(img_base64):
    # Handle data:image/... format OR raw base64
    if "," in img_base64:
        img_base64 = img_base64.split(",")[1]

    img_bytes = base64.b64decode(img_base64)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        return None, "image decode failed"

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # Resize for better detection
    rgb = cv2.resize(rgb, (0, 0), fx=0.5, fy=0.5)

    return rgb, None


# 🔹 NEW: ENCODE API (USE THIS WHILE ADDING STUDENT)
@app.post("/encode")
async def encode(data: dict):
    try:
        img_base64 = data["image"]

        rgb, error = process_image(img_base64)
        if error:
            return {"success": False, "error": error}

        face_locations = face_recognition.face_locations(
            rgb,
            number_of_times_to_upsample=2,
            model="hog"
        )

        if len(face_locations) == 0:
            return {"success": False, "error": "no face detected"}

        encoding = face_recognition.face_encodings(rgb, face_locations)[0]

        return {
            "success": True,
            "encoding": encoding.tolist()
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


# 🔹 EXISTING: RECOGNIZE API (UNCHANGED LOGIC)
@app.post("/recognize")
async def recognize(data: dict):

    try:
        img_base64 = data["image"]
        print("IMAGE LENGTH:", len(img_base64))

        rgb, error = process_image(img_base64)
        if error:
            return {"success": False, "error": error}

        face_locations = face_recognition.face_locations(
            rgb,
            number_of_times_to_upsample=2,
            model="hog"
        )

        if len(face_locations) == 0:
            return {"success": False}

        encoding = face_recognition.face_encodings(rgb, face_locations)[0]

        return {
            "success": True,
            "encoding": encoding.tolist()
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
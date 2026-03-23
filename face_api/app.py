from fastapi import FastAPI
import base64
import face_recognition
import numpy as np
import cv2
from datetime import datetime
import pytz   # ✅ ADDED (timezone fix)

app = FastAPI()


# 🔹 COMMON FUNCTION
def process_image(img_base64):
    if "," in img_base64:
        img_base64 = img_base64.split(",")[1]

    try:
        img_bytes = base64.b64decode(img_base64)
    except Exception:
        return None, "base64 decode failed"

    np_arr = np.frombuffer(img_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # ✅ DEBUG
    print("Image shape:", image.shape if image is not None else None)

    if image is None or image.size == 0:
        return None, "image decode failed"

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    return rgb, None


# 🔹 ENCODE API
@app.post("/encode")
async def encode(data: dict):
    try:
        img_base64 = data["image"]

        rgb, error = process_image(img_base64)
        if error:
            return {"success": False, "error": error}

        if rgb is None:
            return {"success": False, "error": "invalid image"}

        face_locations = face_recognition.face_locations(
            rgb,
            number_of_times_to_upsample=2,   # ✅ FIXED
            model="hog"
        )

        print("ENCODE - Faces found:", len(face_locations))  # ✅ DEBUG

        if len(face_locations) == 0:
            return {"success": False, "error": "no face detected"}

        encoding = face_recognition.face_encodings(rgb, face_locations)[0]

        return {
            "success": True,
            "encoding": encoding.tolist()
        }

    except Exception as e:
        return {"success": False, "error": str(e)}


# 🔹 RECOGNIZE API
@app.post("/recognize")
async def recognize(data: dict):
    try:
        # ✅ TIMEZONE FIX (IMPORTANT)
        ist = pytz.timezone("Asia/Kolkata")
        today = datetime.now(ist).weekday()  # Monday=0 ... Sunday=6

        # ✅ SUNDAY CHECK
        if today == 6:
            return {
                "success": False,
                "status": "sunday"
            }

        img_base64 = data["image"]

        rgb, error = process_image(img_base64)
        if error:
            return {"success": False, "error": error}

        if rgb is None:
            return {"success": False, "error": "invalid image"}

        face_locations = face_recognition.face_locations(
            rgb,
            number_of_times_to_upsample=2,   # ✅ FIXED (WAS 0 ❌)
            model="hog"
        )

        print("RECOGNIZE - Faces found:", len(face_locations))  # ✅ DEBUG

        if len(face_locations) == 0:
            return {"success": False, "status": "no_face"}

        encoding = face_recognition.face_encodings(rgb, face_locations)[0]

        return {
            "success": True,
            "encoding": encoding.tolist()
        }

    except Exception as e:
        return {"success": False, "error": str(e)}
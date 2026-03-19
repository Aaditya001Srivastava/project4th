from fastapi import FastAPI
import base64
import face_recognition
import numpy as np
import cv2
# ..
import pickle

with open("encodings.pkl", "rb") as f:
    data = pickle.load(f)

known_encodings = data["encodings"]
known_names = data["names"]
# ..
app = FastAPI()


# 🔹 COMMON FUNCTION
def process_image(img_base64):
    if "," in img_base64:
        img_base64 = img_base64.split(",")[1]

    img_bytes = base64.b64decode(img_base64)
    np_arr = np.frombuffer(img_bytes, np.uint8)
    image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if image is None:
        return None, "image decode failed"

    rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    # 🔥 Faster resize
    rgb = cv2.resize(rgb, (320, 240))

    return rgb, None


# 🔹 ENCODE API
@app.post("/encode")
async def encode(data: dict):
    try:
        img_base64 = data["image"]

        rgb, error = process_image(img_base64)
        if error:
            return {"success": False, "error": error}

        face_locations = face_recognition.face_locations(
            rgb,
            number_of_times_to_upsample=0,   # 🔥 FIXED
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


# 🔹 RECOGNIZE API
# @app.post("/recognize")
# async def recognize(data: dict):
#     try:
#         img_base64 = data["image"]

#         rgb, error = process_image(img_base64)
#         if error:
#             return {"success": False, "error": error}

#         face_locations = face_recognition.face_locations(
#             rgb,
#             number_of_times_to_upsample=0,   # 🔥 FIXED
#             model="hog"
#         )

#         if len(face_locations) == 0:
#             return {"success": False}

#         encoding = face_recognition.face_encodings(rgb, face_locations)[0]

#         return {
#             "success": True,
#             "encoding": encoding.tolist()
#         }

#     except Exception as e:
#         return {"success": False, "error": str(e)}

@app.post("/recognize")
async def recognize(data: dict):
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
            return {"status": "no_face"}

        encoding = face_recognition.face_encodings(rgb, face_locations)[0]

        # 🔥 COMPARE WITH STORED ENCODINGS
        matches = face_recognition.compare_faces(known_encodings, encoding)
        face_distances = face_recognition.face_distance(known_encodings, encoding)

        if len(face_distances) == 0:
            return {"status": "unknown"}

        best_match_index = np.argmin(face_distances)

        if matches[best_match_index]:
            name = known_names[best_match_index]

            return {
                "status": "matched",
                "name": name
            }
        else:
            return {"status": "unknown"}

    except Exception as e:
        return {"status": "error", "error": str(e)}
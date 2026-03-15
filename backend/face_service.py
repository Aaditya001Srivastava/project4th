import sys
import base64
import face_recognition
import numpy as np
import json
from pymongo import MongoClient
from bson import ObjectId
import cv2

# Mongo connection
client = MongoClient("mongodb+srv://admin:Admin1234@smartattendance.9cwhzs7.mongodb.net/smart-attendance")
db = client["smart-attendance"]
students = db["students"]

# Get image from Node
image_data = sys.stdin.read()
image_data = image_data.split(",")[1]
image_bytes = base64.b64decode(image_data)

np_arr = np.frombuffer(image_bytes, np.uint8)
img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

encodings = face_recognition.face_encodings(img)

if len(encodings) == 0:
    print(json.dumps({"status": "no_face"}))
    sys.exit()

unknown_encoding = encodings[0]

all_students = students.find()

for student in all_students:
    known_encoding = np.array(student["faceEncoding"])
    match = face_recognition.compare_faces([known_encoding], unknown_encoding)

    if match[0]:
        print(json.dumps({
            "status": "matched",
            "studentId": str(student["_id"]),
            "name": student["first_name"] + " " + student["last_name"]
        }))
        sys.exit()

print(json.dumps({"status": "not_matched"}))
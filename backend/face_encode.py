import sys
import base64
import face_recognition
import numpy as np
import json
import cv2

try:
    image_data = sys.stdin.read().strip()

    if not image_data:
        print(json.dumps({"success": False}))
        sys.exit()

    if "," in image_data:
        image_data = image_data.split(",")[1]

    image_bytes = base64.b64decode(image_data)
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        print(json.dumps({"success": False}))
        sys.exit()

    # IMPORTANT: Convert BGR → RGB
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    boxes = face_recognition.face_locations(rgb, model="hog")
    encodings = face_recognition.face_encodings(rgb, boxes)

    if len(encodings) == 0:
        print(json.dumps({"success": False}))
        sys.exit()

    print(json.dumps({
        "success": True,
        "encoding": encodings[0].tolist()
    }))

except Exception as e:
    print(json.dumps({"success": False}))
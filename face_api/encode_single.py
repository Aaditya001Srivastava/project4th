import sys
import face_recognition
import base64
import numpy as np
import cv2
import json

# Read base64 image from stdin
image_base64 = sys.stdin.read()

try:
    img_data = base64.b64decode(image_base64.split(",")[1])
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    encodings = face_recognition.face_encodings(rgb)

    if len(encodings) > 0:
        print(json.dumps(encodings[0].tolist()))
    else:
        print("null")

except Exception as e:
    print("null")
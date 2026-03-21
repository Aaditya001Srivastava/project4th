import face_recognition
import os
import pickle

dataset_path = "dataset"   # folder where images are stored

known_encodings = []
known_names = []

for filename in os.listdir(dataset_path):
    if filename.endswith(".jpg") or filename.endswith(".png"):
        path = os.path.join(dataset_path, filename)

        image = face_recognition.load_image_file(path)

        # ✅ Ensure consistent processing
        rgb = image

        # ✅ Detect face first (IMPORTANT)
        face_locations = face_recognition.face_locations(rgb)

        if len(face_locations) > 0:
            encodings = face_recognition.face_encodings(rgb, face_locations)
            known_encodings.append(encodings[0])
            known_names.append(filename.split(".")[0])
        else:
            print(f"No face found in {filename}")

print("Encoding complete")

data = {
    "encodings": known_encodings,
    "names": known_names
}

with open("encodings.pkl", "wb") as f:
    pickle.dump(data, f)

print("encodings.pkl saved")
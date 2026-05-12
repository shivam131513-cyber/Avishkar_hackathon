# safety-object-detection
We built a YOLO-based object detection system trained on 2,100+ synthetic images simulating real space station conditions—varying lighting, occlusions, and camera angles. Our model detects 7 critical object categories with high accuracy, enabling real-time autonomous monitoring.


# Overview:
This project uses AI-powered real-time object detection to automate the monitoring of critical safety equipment in simulated space station environments.

We use the YOLOv8 model, trained on a synthetic dataset that simulates a range of challenging real-world conditions (lighting, occlusion, camera angles).


# Features:
Detects 7 critical safety objects: OxygenTank, NitrogenTank, FirstAidBox, FireAlarm, SafetySwitchPanel, EmergencyPhone, FireExtinguisher

Trained and evaluated on >2100 labeled synthetic images

Achieved mAP@0.5 of 0.76 (76%)—robust results (10 epochs)

Includes interactive dashboard frontend hosted on Vercel


# Getting Started
Requirements
Python 3.8+

Ultralytics YOLO (pip install ultralytics)

NumPy, pandas, matplotlib 

Git LFS (if cloning large model weights)


# Training
 Run training for N epochs (adjust yaml/weights as needed)
yolo train model=yolov8s.pt data=yolo_params.yaml epochs=10


# Evaluation & Prediction
 Run validation
yolo val model=runs/detect/train7/weights/best.pt data=yolo_params.yaml

 Predict/test on new images
python predict.py --weights runs/detect/train7/weights/best.pt --img your_test_image.jpg
See output graphs (confusion matrix, mAP, precision-recall) in runs/detect/train7/.


# Visualizations
All plots (results.png, confusion_matrix.png, labels.jpg, etc.) found in the latest runs/detect/trainX/ folder
View detection examples and evaluation metrics by opening these images.


# Frontend (Dashboard)
The interactive results dashboard is built with React/Next.js and deployed on Vercel: [your-demo-link]

To run locally, see the /frontend folder (if included) and follow its README.



# Folder Structure
├── train.py                # Model training script
├── predict.py              # Inference script
├── yolo_params.yaml        # YOLO config file for dataset/classes
├── requirements.txt        # Python dependencies
├── runs/                   # Training output and results
│   └── detect/
│       └── trainX/         # Latest model run with logs, weights, plots
├── visualise.py            # (optional) Data/results visualization script
├── README.md



# Results & Benchmarking
Final mAP@0.5: 0.76

Detailed results and failure case analysis in confusion matrix and visual outputs

All trained weights, scripts, and outputs included for full reproducibility




from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
import io
import os
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Load the YOLO model
MODEL_PATH = Path(__file__).parent.parent / "safety-object-detection-main" / "best.pt"
CLASSES_PATH = Path(__file__).parent.parent / "safety-object-detection-main" / "classes.txt"

print(f"Loading YOLO model from: {MODEL_PATH}")

# Check if model exists
if not MODEL_PATH.exists():
    print(f"ERROR: Model file not found at {MODEL_PATH}")
    print("Please ensure the model file exists at the specified location")
    model = None
else:
    try:
        model = YOLO(str(MODEL_PATH))
        print("✓ YOLO model loaded successfully!")
    except Exception as e:
        print(f"ERROR loading model: {e}")
        model = None

# Load class names
class_names = []
if CLASSES_PATH.exists():
    with open(CLASSES_PATH, 'r') as f:
        class_names = [line.strip() for line in f.readlines() if line.strip()]
    print(f"✓ Loaded {len(class_names)} class names: {class_names}")
else:
    print(f"WARNING: Classes file not found at {CLASSES_PATH}")


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'classes': class_names
    })


@app.route('/detect', methods=['POST'])
def detect_objects():
    """
    Detect objects in an uploaded image using YOLO model
    
    Expected: multipart/form-data with 'image' field
    Returns: JSON with detections array
    """
    if model is None:
        return jsonify({
            'error': 'Model not loaded. Please check server logs.'
        }), 500
    
    # Check if image file is present
    if 'image' not in request.files:
        return jsonify({
            'error': 'No image file provided. Please upload an image.'
        }), 400
    
    file = request.files['image']
    
    if file.filename == '':
        return jsonify({
            'error': 'No image file selected'
        }), 400
    
    try:
        # Read image file
        image_bytes = file.read()
        
        # Convert to PIL Image
        pil_image = Image.open(io.BytesIO(image_bytes))
        
        # Convert PIL Image to numpy array (OpenCV format)
        img_array = np.array(pil_image)
        
        # Convert RGB to BGR if needed (OpenCV uses BGR)
        if len(img_array.shape) == 3 and img_array.shape[2] == 3:
            img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)
        
        print(f"Processing image: {file.filename}, shape: {img_array.shape}")
        
        # Run YOLO detection with confidence threshold
        results = model.predict(img_array, conf=0.5, verbose=False)
        
        # Extract detections
        detections = []
        
        if len(results) > 0:
            result = results[0]
            
            # Get image dimensions for normalization
            img_height, img_width = img_array.shape[:2]
            
            # Process each detection
            for box in result.boxes:
                # Get bounding box coordinates (xyxy format)
                x1, y1, x2, y2 = box.xyxy[0].tolist()
                
                # Convert to percentage-based coordinates for frontend
                left = (x1 / img_width) * 100
                top = (y1 / img_height) * 100
                width = ((x2 - x1) / img_width) * 100
                height = ((y2 - y1) / img_height) * 100
                
                # Get class ID and confidence
                cls_id = int(box.cls[0])
                confidence = float(box.conf[0])
                
                # Get class name
                if cls_id < len(class_names):
                    label = class_names[cls_id]
                else:
                    label = f"Class_{cls_id}"
                
                detection = {
                    'top': round(top, 2),
                    'left': round(left, 2),
                    'width': round(width, 2),
                    'height': round(height, 2),
                    'label': label,
                    'score': round(confidence * 100, 1),  # Convert to percentage
                    'class_id': cls_id
                }
                
                detections.append(detection)
        
        print(f"✓ Found {len(detections)} objects: {[d['label'] for d in detections]}")
        
        return jsonify({
            'success': True,
            'detections': detections,
            'image_size': {
                'width': img_width,
                'height': img_height
            }
        })
    
    except Exception as e:
        print(f"ERROR during detection: {e}")
        traceback.print_exc()
        return jsonify({
            'error': f'Error processing image: {str(e)}'
        }), 500


@app.route('/', methods=['GET'])
def index():
    """Root endpoint"""
    return jsonify({
        'name': 'Space Station Safety Monitor API',
        'version': '1.0.0',
        'endpoints': {
            '/health': 'GET - Health check',
            '/detect': 'POST - Detect objects in image'
        }
    })


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🚀 Space Station Safety Monitor - Flask Backend API")
    print("="*60)
    print(f"Model Path: {MODEL_PATH}")
    print(f"Model Loaded: {'✓ Yes' if model else '✗ No'}")
    print(f"Classes: {len(class_names)} - {class_names}")
    print("="*60)
    print("\nStarting server on http://localhost:5000")
    print("API Endpoints:")
    print("  GET  /health  - Check API health")
    print("  POST /detect  - Detect objects in image")
    print("\nPress CTRL+C to stop the server")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)

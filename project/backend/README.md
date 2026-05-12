# Space Station Safety Monitor - Flask Backend API

A Flask-based backend API that serves the trained YOLO object detection model for real-time safety equipment detection.

## Features

- Load and serve YOLOv8 model for object detection
- RESTful API endpoints for image processing
- CORS support for React frontend
- Error handling and validation
- Health check endpoint

## Installation

1. **Create a virtual environment** (recommended):
```bash
cd backend
python -m venv venv
```

2. **Activate the virtual environment**:
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Install dependencies**:
```bash
pip install -r requirements.txt
```

## Running the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### `GET /`
Root endpoint with API information.

**Response**:
```json
{
  "name": "Space Station Safety Monitor API",
  "version": "1.0.0",
  "endpoints": {...}
}
```

### `GET /health`
Health check endpoint to verify model is loaded.

**Response**:
```json
{
  "status": "healthy",
  "model_loaded": true,
  "classes": ["OxygenTank", "NitrogenTank", ...]
}
```

### `POST /detect`
Detect objects in an uploaded image.

**Request**:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form field `image` with image file

**Response**:
```json
{
  "success": true,
  "detections": [
    {
      "top": 15.5,
      "left": 25.3,
      "width": 18.2,
      "height": 22.1,
      "label": "FireExtinguisher",
      "score": 94.2,
      "class_id": 6
    }
  ],
  "image_size": {
    "width": 1920,
    "height": 1080
  }
}
```

## Testing

### Using curl
```bash
curl -X POST -F "image=@path/to/test_image.jpg" http://localhost:5000/detect
```

### Using Python
```python
import requests

url = "http://localhost:5000/detect"
files = {'image': open('test_image.jpg', 'rb')}
response = requests.post(url, files=files)
print(response.json())
```

## Model Details

- **Model Location**: `../safety-object-detection-main/best.pt`
- **Classes**: 7 safety equipment types
- **Confidence Threshold**: 0.5 (50%)

## Troubleshooting

**Model not loading:**
- Verify `best.pt` exists in `safety-object-detection-main/` folder
- Check file path is correct
- Ensure YOLO dependencies are installed

**CORS errors:**
- Ensure `flask-cors` is installed
- Backend must be running before frontend requests

**Image processing errors:**
- Verify image format (JPG, PNG supported)
- Check image is not corrupted
- Ensure sufficient memory for large images

# Dualityity AI // Space Station Safety Monitor

A futuristic AI-powered safety equipment detection system for space station environments, featuring real-time YOLO object detection with a command center interface.

## 🚀 Overview

This application integrates a trained YOLOv8 model with a React frontend to detect 7 types of safety equipment in space station images. It consists of:

- **Backend**: Flask API serving YOLO model predictions
- **Frontend**: React/TypeScript UI with drag-and-drop image upload
- **Model**: Trained YOLOv8 on 2,100+ synthetic images (mAP@0.5: 76%)

## 🎯 Features

- **Real-Time Object Detection**: Upload images and get instant safety equipment detections
- **Futuristic UI**: Dark mode with glowing cyan accents, animated backgrounds, and smooth transitions
- **7 Safety Classes**: OxygenTank, NitrogenTank, FirstAidBox, FireAlarm, SafetySwitchPanel, EmergencyPhone, FireExtinguisher
- **Visual Analysis**: Bounding boxes with confidence scores overlaid on uploaded images
- **Detection Reports**: Structured list view of all detected objects with status indicators
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 📋 Prerequisites

- **Node.js** 16+ and npm
- **Python** 3.8+
- **Git** (for cloning)

## 🛠️ Installation

### 1. Clone and Setup

```bash
cd D:\project\avishkar\project
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
cd ..
```

## 🎮 Running the Application

### Option 1: Run Both Servers Automatically (Recommended)

```bash
npm run dev:all
```

This starts both frontend (port 5173) and backend (port 5000) concurrently.

### Option 2: Run Manually

**Terminal 1 - Backend:**
```bash
cd backend
venv\Scripts\activate
python app.py
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Access the Application

Open your browser to: **http://localhost:5173**

## 📁 Project Structure

```
D:\project\avishkar\project\
├── backend/
│   ├── app.py                  # Flask API server
│   ├── requirements.txt        # Python dependencies
│   └── README.md              # Backend documentation
├── safety-object-detection-main/
│   ├── best.pt                # Trained YOLO model weights
│   ├── classes.txt            # Class names
│   └── ...                    # Training artifacts
├── src/
│   ├── App.tsx                # Main React component
│   ├── types.ts               # TypeScript type definitions
│   ├── config.ts              # API configuration
│   └── index.css              # Styles and animations
├── index.html                 # HTML entry point
├── package.json               # Node dependencies
└── README.md                  # This file
```

## 🔌 API Endpoints

### `GET /health`
Check API health and model status

### `POST /detect`
Upload image for object detection

**Request:**
- Content-Type: `multipart/form-data`
- Field: `image` (file)

**Response:**
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

## 🧪 Testing

1. **Start the servers** using `npm run dev:all`
2. **Open browser** to http://localhost:5173
3. **Upload an image** with safety equipment (drag & drop or click to browse)
4. **Viewresults** with bounding boxes and detection report
5. **Try different images** to test various equipment types

## 🎨 Technology Stack

**Frontend:**
- React 18 + TypeScript
- Vite 5 (build tool)
- Tailwind CSS
- Custom CSS animations

**Backend:**
- Flask 3.0
- Ultralytics YOLO v8
- OpenCV
- Pillow

**Model:**
- YOLOv8s architecture
- Trained on 2,100+ synthetic images
- 7 safety equipment classes
- mAP@0.5: 76%

## 📝 Usage Instructions

1. **Upload Image**: Drag and drop or click to select a space station image
2. **Processing**: Watch the animated neural network scanner (2-3 seconds)
3. **View Results**: 
   - Left panel: Image with green bounding boxes
   - Right panel: Detection report with confidence scores
4. **Reset**: Click "Reset & Analyze New Image" to try another

## ⚠️ Troubleshooting

**Frontend shows connection error:**
- Ensure backend is running on port 5000
- Check `http://localhost:5000/health` in browser
- Verify no firewall blocking

**Backend fails to start:**
- Check Python virtual environment is activated
- Verify `best.pt` model file exists in `safety-object-detection-main/`
- Install all requirements: `pip install -r backend/requirements.txt`

**No detections shown:**
- Upload images containing safety equipment
- Check confidence threshold (currently 0.5 / 50%)
- Verify model supports the objects in your image

**"Model not loaded" error:**
- Verify model path in `backend/app.py`
- Ensure `best.pt` exists at `D:\project\avishkar\project\safety-object-detection-main\best.pt`

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Cloud Services)
- Deploy Flask app to Heroku, Railway, or similar
- Update `VITE_API_URL` environment variable with production API URL
- Ensure model weights are included in deployment

## 📊 Model Information

- **Architecture**: YOLOv8s (small variant)
- **Training Dataset**: 2,100+ synthetic images
- **Classes**: 7 safety equipment types
- **Performance**: mAP@0.5 = 76%
- **Confidence Threshold**: 50%

**Detected Classes:**
1. OxygenTank
2. NitrogenTank
3. FirstAidBox
4. FireAlarm
5. SafetySwitchPanel
6. EmergencyPhone
7. FireExtinguisher

## 🔧 Development

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend && pip install -r requirements.txt

# Run frontend in development mode
npm run dev

# Run backend in development mode
npm run dev:backend

# Run both simultaneously
npm run dev:all

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

## 🤝 Contributing

This project was created for the Duality AI Space Station Challenge.

## 📄 License

See individual component licenses.

---

**Version**: 2.0.0  
**Last Updated**: 2025-11-26  
**Status**: Production Ready with Real YOLO Integration

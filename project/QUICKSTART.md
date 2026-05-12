# Quick Start Guide - YOLO Model Integration

## What Was Built

Your trained YOLO model has been integrated with a full-stack web application:

- ✅ **Flask Backend API** - Serves your YOLO model on `http://localhost:5000`
- ✅ **React Frontend** - Beautiful space-themed UI on `http://localhost:5173`
- ✅ **Real-time Detection** - Upload images and get instant bounding box results
- ✅ **Concurrent Scripts** - Run both servers with one command

## 🚀 Running the Application

### Step 1: Install Backend Dependencies

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Run Both Servers

```bash
npm run dev:all
```

This starts:
- **Frontend** on http://localhost:5173 (cyan)
- **Backend** on http://localhost:5000 (green)

### Step 4: Test the Application

1. Open http://localhost:5173 in your browser
2. Drag & drop or upload an image with safety equipment
3. Watch the AI analyze your image
4. View bounding boxes and detection reports!

## 📋 Manual Setup (Alternative)

If `npm run dev:all` doesn't work, run servers separately:

**Terminal 1:**
```bash
cd backend
venv\Scripts\activate
python app.py
```

**Terminal 2:**
```bash
npm run dev
```

## 🔍 Testing the Backend Directly

Check if backend is working:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test detection (Windows PowerShell)
$form = @{
    image = Get-Item -Path "path\to\your\test\image.jpg"
}
Invoke-RestMethod -Uri "http://localhost:5000/detect" -Method Post -Form $form
```

## 📁 File Structure

```
project/
├── backend/
│   ├── app.py              # Flask server with YOLO model
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend docs
├── safety-object-detection-main/
│   └── best.pt            # Your trained model
├── src/
│   ├── App.tsx            # React UI component
│   ├── config.ts          # API endpoints
│   └── types.ts           # TypeScript types
└── README.md              # Full documentation
```

## ⚠️ Common Issues

### "Model not loaded"
- Check that `best.pt` exists in `safety-object-detection-main/`
- Verify path in `backend/app.py` line 16

### "Connection refused"
- Ensure backend is running on port 5000
- Visit http://localhost:5000/health to verify

### "No detections"
- Try images with clear safety equipment
- Model confidence threshold is set to 50%
- Check that your image contains the 7 trained classes

## 🎯 What You Can Do Now

1. **Upload Images**: Test with space station images containing safety equipment
2. **View Real Detections**: See your trained YOLO model's actual predictions
3. **Check Confidence**: Each detection shows confidence percentage
4. **Export**: Share the web app by deploying frontend + backend

## 📚 Next Steps

- Deploy backend to a cloud service (Heroku, Railway)
- Deploy frontend to Vercel/Netlify
- Add more training data to improve model
- Customize UI colors and animations in `src/index.css`

---

**Need Help?** Check the full README.md or backend/README.md for detailed documentation.

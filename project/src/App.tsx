import { useState, useRef } from 'react';
import { Detection, DetectionResponse, AppState } from './types';
import { API_ENDPOINTS } from './config';

function App() {
  const [appState, setAppState] = useState<AppState>('upload');
  const [detections, setDetections] = useState<Detection[]>([]);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG)');
      return;
    }

    // Create a local URL for the image
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    // Start processing
    setAppState('processing');
    setError('');

    // Upload to backend API
    uploadImageToAPI(file);
  };

  const uploadImageToAPI = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(API_ENDPOINTS.DETECT, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process image');
      }

      const data: DetectionResponse = await response.json();

      // Simulate minimum processing time for better UX
      setTimeout(() => {
        setDetections(data.detections);
        setAppState('results');
      }, 1500);

    } catch (err) {
      console.error('Detection error:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to detection server. Please ensure the backend is running on http://localhost:5000');
      setAppState('error');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleReset = () => {
    setAppState('upload');
    setDetections([]);
    setImageUrl('');
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <div className="starfield"></div>
      <div className="grid-bg"></div>

      <div className="content-wrapper">
        <header className="py-8 border-b border-cyan-500/20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center gap-4">
              <span className="logo">🛰️</span>
              <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200">
                Duality AI // Space Station Safety Monitor
              </h1>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-cyan-400">
                Safety Detection Interface
              </h2>
              <p className="text-gray-400">
                Advanced AI-powered safety equipment monitoring system
              </p>
            </div>

            {/* Upload Module */}
            {appState === 'upload' && (
              <div className="max-w-2xl mx-auto">
                <div className="card rounded-lg p-8">
                  <div
                    className="glow-border rounded-lg p-16 text-center cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg className="mx-auto h-16 w-16 text-cyan-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xl font-medium mb-2">Drag & Drop Test Image</p>
                    <p className="text-gray-400 mb-4">or click to upload</p>
                    <p className="text-sm text-cyan-400">Supported formats: JPG, PNG</p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>
              </div>
            )}

            {/* Processing Module */}
            {appState === 'processing' && (
              <div className="max-w-2xl mx-auto">
                <div className="card rounded-lg p-16 text-center">
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    <div className="pulse-ring" style={{ width: '100%', height: '100%' }}></div>
                    <div className="pulse-ring" style={{ width: '100%', height: '100%', animationDelay: '0.5s' }}></div>
                    <div className="pulse-ring" style={{ width: '100%', height: '100%', animationDelay: '1s' }}></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center">
                        <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="relative h-1 w-64 mx-auto bg-gray-800 rounded-full overflow-hidden mb-4">
                    <div className="scanner-line"></div>
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-cyan-400">Analyzing...</h3>
                  <p className="text-gray-400">Detecting safety assets using YOLO neural network</p>
                </div>
              </div>
            )}

            {/* Error Module */}
            {appState === 'error' && (
              <div className="max-w-2xl mx-auto">
                <div className="card rounded-lg p-8 border-red-500/50">
                  <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-semibold mb-2 text-red-400">Error</h3>
                    <p className="text-gray-300 mb-6">{error}</p>
                    <button
                      onClick={handleReset}
                      className="btn-primary py-3 px-6 rounded-lg font-semibold text-white"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results Module */}
            {appState === 'results' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="card rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Visual Analysis
                  </h3>
                  <div className="relative overflow-auto">
                    <div className="image-container">
                      <img
                        src={imageUrl}
                        alt="Uploaded"
                        className="max-w-full h-auto rounded-lg"
                        id="uploadedImage"
                      />
                      {/* Bounding Boxes */}
                      {detections.map((detection, index) => (
                        <div
                          key={index}
                          className="bbox"
                          style={{
                            top: `${detection.top}%`,
                            left: `${detection.left}%`,
                            width: `${detection.width}%`,
                            height: `${detection.height}%`,
                            animationDelay: `${index * 0.3}s`,
                          }}
                        >
                          <div className="bbox-label">
                            {detection.label}: {detection.score}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="card rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-400 flex items-center gap-2">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Detection Report
                  </h3>
                  <div className="space-y-3 mb-6">
                    {detections.length === 0 ? (
                      <div className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4 text-center">
                        <p className="text-gray-400">No safety equipment detected in this image</p>
                      </div>
                    ) : (
                      detections.map((detection, index) => (
                        <div
                          key={index}
                          className="bg-gray-800/50 border border-cyan-500/30 rounded-lg p-4"
                          style={{
                            animation: 'bbox-appear 0.5s ease-out',
                            animationDelay: `${index * 0.3}s`,
                          }}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className="status-dot"></div>
                                <span className="font-semibold text-cyan-400">{detection.label}</span>
                              </div>
                              <div className="text-sm text-gray-400 space-y-1">
                                <p>
                                  Confidence: <span className="text-lime-400 font-semibold">{detection.score}%</span>
                                </p>
                                <p>
                                  Status: <span className="text-lime-400">OPERATIONAL</span>
                                </p>
                              </div>
                            </div>
                            <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <button
                    onClick={handleReset}
                    className="btn-primary w-full py-3 px-6 rounded-lg font-semibold text-white"
                  >
                    Reset & Analyze New Image
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* Model Maintenance Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-2 text-cyan-400">
                Model Maintenance via Falcon
              </h2>
              <p className="text-gray-400 max-w-3xl mx-auto">
                Ensuring our model stays up-to-date with the evolving space station environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="card rounded-lg p-6 hover:border-cyan-500/50 transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-cyan-400 text-center">Monitor & Identify</h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  We continuously monitor for model 'drift.' When the real-world environment changes, we identify these new 'failure cases.'
                </p>
              </div>

              <div className="card rounded-lg p-6 hover:border-cyan-500/50 transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-cyan-400 text-center">Simulate & Generate</h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  Using Duality AI's Falcon platform, we create high-fidelity digital twins and generate thousands of perfectly-labeled synthetic images.
                </p>
              </div>

              <div className="card rounded-lg p-6 hover:border-cyan-500/50 transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl font-bold text-white">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-cyan-400 text-center">Retrain & Deploy</h3>
                <p className="text-gray-400 text-center leading-relaxed">
                  The new synthetic dataset retrains and fine-tunes the YOLO model, improving accuracy and ensuring 100% operational safety.
                </p>
              </div>
            </div>
          </section>
        </main>

        <footer className="py-8 border-t border-cyan-500/20 text-center text-gray-400">
          <p>&copy; 2025 Duality AI // Space Station Safety Monitor</p>
        </footer>
      </div>
    </>
  );
}

export default App;


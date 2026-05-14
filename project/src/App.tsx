import { useState, useRef, useEffect } from 'react';
import { Detection, DetectionResponse, AppState } from './types';
import { API_ENDPOINTS } from './config';

/* ─── Theme hook ──────────────────────────────── */
function useTheme() {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  return { isDark, toggle: () => setIsDark(p => !p) };
}

/* ─── Sun icon ────────────────────────────────── */
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707
         M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707
         M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

/* ─── Moon icon ───────────────────────────────── */
const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646
         9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

/* ─── Theme Toggle Button ─────────────────────── */
function ThemeToggle({ isDark, onToggle }: { isDark: boolean; onToggle: () => void }) {
  return (
    <button
      id="theme-toggle-btn"
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium
                 transition-all duration-300 cursor-pointer select-none"
      style={{
        background: 'var(--accent-cyan-soft)',
        borderColor: 'var(--border-normal)',
        color: 'var(--accent-cyan)',
        boxShadow: '0 0 12px var(--accent-cyan-glow)',
      }}
    >
      <span className="transition-transform duration-300"
            style={{ transform: isDark ? 'rotate(0deg)' : 'rotate(180deg)' }}>
        {isDark ? <MoonIcon /> : <SunIcon />}
      </span>
      <span>{isDark ? 'Dark' : 'Light'}</span>
    </button>
  );
}

/* ─── Confidence Bar ──────────────────────────── */
function ConfidenceBar({ score }: { score: number }) {
  return (
    <div className="confidence-bar-track">
      <div
        className="confidence-bar-fill"
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

/* ─── Detection List Item ─────────────────────── */
function DetectionItem({ detection, index }: { detection: Detection; index: number }) {
  return (
    <div
      className="detection-item animate-fade-up"
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="status-dot" />
            <span className="font-semibold" style={{ color: 'var(--accent-cyan)' }}>
              {detection.label}
            </span>
          </div>
          <div className="text-sm space-y-1" style={{ color: 'var(--text-secondary)' }}>
            <p>
              Confidence:{' '}
              <span className="font-semibold" style={{ color: 'var(--accent-lime)' }}>
                {detection.score}%
              </span>
            </p>
            <ConfidenceBar score={detection.score} />
            <p className="pt-1">
              Status:{' '}
              <span className="font-semibold" style={{ color: 'var(--accent-lime)' }}>
                OPERATIONAL
              </span>
            </p>
          </div>
        </div>
        <svg
          className="w-6 h-6 ml-3 flex-shrink-0"
          style={{ color: 'var(--accent-lime)' }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>
  );
}

/* ─── Main App ────────────────────────────────── */
function App() {
  const { isDark, toggle } = useTheme();

  const [appState, setAppState]     = useState<AppState>('upload');
  const [detections, setDetections] = useState<Detection[]>([]);
  const [imageUrl, setImageUrl]     = useState<string>('');
  const [error, setError]           = useState<string>('');
  const fileInputRef                = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG)');
      return;
    }
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setAppState('processing');
    setError('');
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
      setTimeout(() => {
        setDetections(data.detections);
        setAppState('results');
      }, 1500);
    } catch (err) {
      console.error('Detection error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to connect to detection server. Please ensure the backend is running on http://localhost:5000'
      );
      setAppState('error');
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleReset = () => {
    setAppState('upload');
    setDetections([]);
    setImageUrl('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <>
      <div className="starfield" />
      <div className="grid-bg" />

      <div className="content-wrapper">
        {/* ── Header ── */}
        <header className="py-6 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="logo">🛰️</span>
                <h1
                  className="text-2xl md:text-3xl font-bold heading-gradient"
                  style={{ lineHeight: 1.2 }}
                >
                  Duality AI // Space Station Safety Monitor
                </h1>
              </div>

              <ThemeToggle isDark={isDark} onToggle={toggle} />
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-12">
          {/* ── Detection Interface Section ── */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-accent">
                Safety Detection Interface
              </h2>
              <p className="text-sub max-w-xl mx-auto">
                Advanced AI-powered safety equipment monitoring system using YOLO neural networks
              </p>
            </div>

            {/* Upload */}
            {appState === 'upload' && (
              <div className="max-w-2xl mx-auto animate-fade-up">
                <div className="card rounded-xl p-8">
                  <div
                    className="glow-border rounded-xl p-16 text-center cursor-pointer"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <svg
                      className="mx-auto h-14 w-14 mb-5"
                      style={{ color: 'var(--accent-cyan)' }}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                      Drag &amp; Drop Test Image
                    </p>
                    <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
                      or click to browse
                    </p>
                    <span
                      className="inline-block text-sm px-3 py-1 rounded-full border font-medium"
                      style={{
                        color: 'var(--accent-cyan)',
                        borderColor: 'var(--border-normal)',
                        background: 'var(--accent-cyan-soft)',
                      }}
                    >
                      JPG · PNG · WEBP
                    </span>
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

            {/* Processing */}
            {appState === 'processing' && (
              <div className="max-w-2xl mx-auto animate-fade-up">
                <div className="card rounded-xl p-16 text-center">
                  <div className="relative w-44 h-44 mx-auto mb-8">
                    <div className="pulse-ring" style={{ width: '100%', height: '100%' }} />
                    <div className="pulse-ring" style={{ width: '100%', height: '100%', animationDelay: '0.6s' }} />
                    <div className="pulse-ring" style={{ width: '100%', height: '100%', animationDelay: '1.2s' }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className="w-28 h-28 rounded-full flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, var(--accent-cyan), #0891b2)' }}
                      >
                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3
                               m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547
                               A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531
                               c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div
                    className="relative h-1 w-64 mx-auto rounded-full overflow-hidden mb-6"
                    style={{ background: 'var(--border-subtle)' }}
                  >
                    <div className="scanner-line" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 text-accent">Analyzing…</h3>
                  <p style={{ color: 'var(--text-secondary)' }}>
                    Detecting safety assets using YOLO neural network
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {appState === 'error' && (
              <div className="max-w-2xl mx-auto animate-fade-up">
                <div className="card rounded-xl p-8 border-error">
                  <div className="text-center">
                    <svg className="mx-auto h-14 w-14 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-2xl font-semibold mb-2 text-red-400">Error</h3>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>{error}</p>
                    <button
                      onClick={handleReset}
                      className="btn-primary py-3 px-8 rounded-lg font-semibold text-white"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {appState === 'results' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-up">
                {/* Image Panel */}
                <div className="card rounded-xl p-6">
                  <h3
                    className="text-xl font-semibold mb-4 flex items-center gap-2 text-accent"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7
                           -1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
                      {detections.map((detection, index) => (
                        <div
                          key={index}
                          className="bbox"
                          style={{
                            top:    `${detection.top}%`,
                            left:   `${detection.left}%`,
                            width:  `${detection.width}%`,
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

                {/* Report Panel */}
                <div className="card rounded-xl p-6 flex flex-col">
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-accent">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586
                           a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Detection Report
                    <span
                      className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: 'var(--accent-cyan-soft)',
                        color: 'var(--accent-cyan)',
                        border: '1px solid var(--border-normal)',
                      }}
                    >
                      {detections.length} found
                    </span>
                  </h3>

                  <div className="space-y-3 mb-6 flex-1 overflow-auto">
                    {detections.length === 0 ? (
                      <div
                        className="rounded-lg p-4 text-center"
                        style={{
                          background: 'var(--bg-input)',
                          border: '1px solid var(--border-subtle)',
                        }}
                      >
                        <p style={{ color: 'var(--text-secondary)' }}>
                          No safety equipment detected in this image
                        </p>
                      </div>
                    ) : (
                      detections.map((d, i) => (
                        <DetectionItem key={i} detection={d} index={i} />
                      ))
                    )}
                  </div>

                  <button
                    onClick={handleReset}
                    className="btn-primary w-full py-3 px-6 rounded-lg font-semibold text-white"
                  >
                    Reset &amp; Analyze New Image
                  </button>
                </div>
              </div>
            )}
          </section>

          {/* ── Model Maintenance Section ── */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-semibold mb-3 text-accent">
                Model Maintenance via Falcon
              </h2>
              <p className="text-sub max-w-2xl mx-auto">
                Ensuring our model stays up-to-date with the evolving space station environment
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  num: '1',
                  title: 'Monitor & Identify',
                  body: "We continuously monitor for model 'drift.' When the real-world environment changes, we identify these new 'failure cases.'",
                },
                {
                  num: '2',
                  title: 'Simulate & Generate',
                  body: "Using Duality AI's Falcon platform, we create high-fidelity digital twins and generate thousands of perfectly-labeled synthetic images.",
                },
                {
                  num: '3',
                  title: 'Retrain & Deploy',
                  body: "The new synthetic dataset retrains and fine-tunes the YOLO model, improving accuracy and ensuring 100% operational safety.",
                },
              ].map((step, i) => (
                <div key={i} className="step-card rounded-xl p-6 animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div
                    className="step-number w-14 h-14 rounded-full flex items-center justify-center mb-5 mx-auto"
                  >
                    <span className="text-xl font-bold text-white">{step.num}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-accent text-center">
                    {step.title}
                  </h3>
                  <p className="text-sub text-center leading-relaxed text-sm">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer
          className="py-8 border-t text-center"
          style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
        >
          <p>© 2025 Duality AI // Space Station Safety Monitor</p>
        </footer>
      </div>
    </>
  );
}

export default App;

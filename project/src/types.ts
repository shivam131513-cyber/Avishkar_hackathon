export interface Detection {
  top: number;
  left: number;
  width: number;
  height: number;
  label: string;
  score: number;
  class_id: number;
}

export interface DetectionResponse {
  success: boolean;
  detections: Detection[];
  image_size: {
    width: number;
    height: number;
  };
}

export interface ErrorResponse {
  error: string;
}

export type AppState = 'upload' | 'processing' | 'results' | 'error';

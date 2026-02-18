
export enum DesignType {
  INTERIOR = 'Interior',
  LANDSCAPE = 'Landscape'
}

export interface DesignStyle {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface DesignResult {
  id: string;
  originalImage: string;
  resultImage: string;
  prompt: string;
  style: string;
  timestamp: number;
}

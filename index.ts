export interface PDFFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: ArrayBuffer;
  url?: string;
  pageCount?: number;
}

export interface ToolCategory {
  id: string;
  name: string;
  icon: string;
  tools: PDFTool[];
}

export interface PDFTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  color: string;
  path: string;
  supportsBatch: boolean;
  maxFileSize: number; // in MB
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'user' | 'admin';
  createdAt: string;
  language: string;
  theme: 'light' | 'dark';
}

export interface AnalyticsData {
  visitors: number;
  downloads: number;
  activeUsers: number;
  toolUsage: { name: string; count: number }[];
}

export interface UploadProgress {
  fileId: string;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

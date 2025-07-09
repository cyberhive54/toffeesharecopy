export interface FileItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'transferring' | 'completed' | 'failed';
}

export interface WebRTCConnection {
  peerConnection: RTCPeerConnection;
  dataChannel: RTCDataChannel | null;
  isConnected: boolean;
}

export interface TransferProgress {
  fileId: string;
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
  status: 'pending' | 'transferring' | 'completed' | 'failed';
}

export interface ShareSession {
  id: string;
  files: FileItem[];
  shareUrl: string;
  isActive: boolean;
  connectionStatus: 'waiting' | 'connected' | 'disconnected';
}

export interface ReceivedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  data: ArrayBuffer;
  progress: number;
  status: 'pending' | 'receiving' | 'completed' | 'failed';
}

export const CHUNK_SIZE = 16384; // 16KB chunks

export interface FileChunk {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  data: ArrayBuffer;
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  totalChunks: number;
}

export class FileTransferManager {
  private receivedChunks: Map<string, Map<number, ArrayBuffer>> = new Map();
  private fileMetadata: Map<string, FileMetadata> = new Map();

  async sendFile(file: File, onProgress: (progress: number) => void, sendChunk: (chunk: FileChunk) => void): Promise<void> {
    const fileId = this.generateFileId();
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    
    const metadata: FileMetadata = {
      id: fileId,
      name: file.name,
      size: file.size,
      type: file.type,
      totalChunks,
    };

    // Send metadata first
    sendChunk({
      fileId,
      chunkIndex: -1, // Special index for metadata
      totalChunks,
      data: new TextEncoder().encode(JSON.stringify(metadata)).buffer,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    // Send file chunks
    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, file.size);
      const chunk = file.slice(start, end);
      
      const arrayBuffer = await chunk.arrayBuffer();
      
      const fileChunk: FileChunk = {
        fileId,
        chunkIndex,
        totalChunks,
        data: arrayBuffer,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      };

      sendChunk(fileChunk);
      
      const progress = ((chunkIndex + 1) / totalChunks) * 100;
      onProgress(progress);
      
      // Small delay to prevent overwhelming the data channel
      await this.delay(10);
    }
  }

  receiveChunk(chunk: FileChunk, onProgress: (fileId: string, progress: number) => void): File | null {
    const { fileId, chunkIndex, totalChunks } = chunk;

    // Handle metadata
    if (chunkIndex === -1) {
      const metadataStr = new TextDecoder().decode(chunk.data);
      const metadata: FileMetadata = JSON.parse(metadataStr);
      this.fileMetadata.set(fileId, metadata);
      this.receivedChunks.set(fileId, new Map());
      return null;
    }

    // Store chunk
    const fileChunks = this.receivedChunks.get(fileId);
    if (!fileChunks) {
      console.error(`No metadata found for file ${fileId}`);
      return null;
    }

    fileChunks.set(chunkIndex, chunk.data);

    // Calculate progress
    const progress = (fileChunks.size / totalChunks) * 100;
    onProgress(fileId, progress);

    // Check if all chunks received
    if (fileChunks.size === totalChunks) {
      return this.assembleFile(fileId);
    }

    return null;
  }

  private assembleFile(fileId: string): File | null {
    const metadata = this.fileMetadata.get(fileId);
    const chunks = this.receivedChunks.get(fileId);

    if (!metadata || !chunks) {
      return null;
    }

    // Assemble chunks in order
    const assembledChunks: ArrayBuffer[] = [];
    for (let i = 0; i < metadata.totalChunks; i++) {
      const chunk = chunks.get(i);
      if (!chunk) {
        console.error(`Missing chunk ${i} for file ${fileId}`);
        return null;
      }
      assembledChunks.push(chunk);
    }

    const blob = new Blob(assembledChunks, { type: metadata.type });
    const file = new File([blob], metadata.name, { type: metadata.type });

    // Cleanup
    this.receivedChunks.delete(fileId);
    this.fileMetadata.delete(fileId);

    return file;
  }

  private generateFileId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getFileMetadata(fileId: string): FileMetadata | undefined {
    return this.fileMetadata.get(fileId);
  }

  getProgress(fileId: string): number {
    const metadata = this.fileMetadata.get(fileId);
    const chunks = this.receivedChunks.get(fileId);
    
    if (!metadata || !chunks) {
      return 0;
    }

    return (chunks.size / metadata.totalChunks) * 100;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getFileIcon(fileType: string): string {
  if (fileType.startsWith('image/')) return 'fas fa-file-image';
  if (fileType.startsWith('video/')) return 'fas fa-file-video';
  if (fileType.startsWith('audio/')) return 'fas fa-file-audio';
  if (fileType.includes('pdf')) return 'fas fa-file-pdf';
  if (fileType.includes('word') || fileType.includes('document')) return 'fas fa-file-word';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'fas fa-file-excel';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'fas fa-file-powerpoint';
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return 'fas fa-file-archive';
  return 'fas fa-file-alt';
}

export async function downloadFile(file: File): Promise<void> {
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

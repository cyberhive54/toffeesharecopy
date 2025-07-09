import { SignalingRoom, FileMetadata, TransferStatus } from "@shared/schema";

// Storage interface for file sharing coordination
export interface IStorage {
  // Signaling room methods
  getSignalingRoom(roomId: string): Promise<SignalingRoom | undefined>;
  createSignalingRoom(room: Omit<SignalingRoom, 'createdAt'>): Promise<SignalingRoom>;
  updateSignalingRoom(roomId: string, updates: Partial<SignalingRoom>): Promise<SignalingRoom | undefined>;
  deleteSignalingRoom(roomId: string): Promise<boolean>;
  
  // File metadata methods
  getFileMetadata(fileId: string): Promise<FileMetadata | undefined>;
  setFileMetadata(metadata: FileMetadata): Promise<FileMetadata>;
  deleteFileMetadata(fileId: string): Promise<boolean>;
  
  // Transfer status methods
  getTransferStatus(fileId: string): Promise<TransferStatus | undefined>;
  updateTransferStatus(status: TransferStatus): Promise<TransferStatus>;
  deleteTransferStatus(fileId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private signalingRooms: Map<string, SignalingRoom> = new Map();
  private fileMetadata: Map<string, FileMetadata> = new Map();
  private transferStatuses: Map<string, TransferStatus> = new Map();

  constructor() {
    // Auto-cleanup old signaling rooms every 5 minutes
    setInterval(() => {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      
      this.signalingRooms.forEach((room, roomId) => {
        if (room.createdAt < oneHourAgo) {
          this.deleteSignalingRoom(roomId);
        }
      });
    }, 5 * 60 * 1000);
  }

  // Signaling room methods
  async getSignalingRoom(roomId: string): Promise<SignalingRoom | undefined> {
    return this.signalingRooms.get(roomId);
  }

  async createSignalingRoom(room: Omit<SignalingRoom, 'createdAt'>): Promise<SignalingRoom> {
    const newRoom: SignalingRoom = {
      ...room,
      createdAt: Date.now(),
    };
    this.signalingRooms.set(room.id, newRoom);
    return newRoom;
  }

  async updateSignalingRoom(roomId: string, updates: Partial<SignalingRoom>): Promise<SignalingRoom | undefined> {
    const room = this.signalingRooms.get(roomId);
    if (!room) return undefined;

    const updatedRoom = { ...room, ...updates };
    this.signalingRooms.set(roomId, updatedRoom);
    return updatedRoom;
  }

  async deleteSignalingRoom(roomId: string): Promise<boolean> {
    return this.signalingRooms.delete(roomId);
  }

  // File metadata methods
  async getFileMetadata(fileId: string): Promise<FileMetadata | undefined> {
    return this.fileMetadata.get(fileId);
  }

  async setFileMetadata(metadata: FileMetadata): Promise<FileMetadata> {
    this.fileMetadata.set(metadata.id, metadata);
    return metadata;
  }

  async deleteFileMetadata(fileId: string): Promise<boolean> {
    return this.fileMetadata.delete(fileId);
  }

  // Transfer status methods
  async getTransferStatus(fileId: string): Promise<TransferStatus | undefined> {
    return this.transferStatuses.get(fileId);
  }

  async updateTransferStatus(status: TransferStatus): Promise<TransferStatus> {
    this.transferStatuses.set(status.fileId, status);
    return status;
  }

  async deleteTransferStatus(fileId: string): Promise<boolean> {
    return this.transferStatuses.delete(fileId);
  }
}

export const storage = new MemStorage();

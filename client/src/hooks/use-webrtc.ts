import { useState, useEffect, useCallback } from 'react';
import { WebRTCManager } from '@/lib/webrtc';
import { FileTransferManager, FileChunk } from '@/lib/file-utils';
import { FileItem, TransferProgress } from '@/types';

export function useWebRTC() {
  const [webrtc, setWebRTC] = useState<WebRTCManager | null>(null);
  const [fileManager] = useState(() => new FileTransferManager());
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState>('new');
  const [isDataChannelOpen, setIsDataChannelOpen] = useState(false);
  const [transferProgress, setTransferProgress] = useState<Map<string, TransferProgress>>(new Map());

  const handleReceivedChunk = useCallback((data: ArrayBuffer) => {
    // This would need to be properly implemented to deserialize chunk data
    // For now, this is a placeholder
    console.log('Received chunk data:', data.byteLength);
  }, []);

  const handleReceivedMessage = useCallback((message: any) => {
    try {
      console.log('Processing received message:', message);
      if (message.type === 'fileChunk') {
        const chunk: FileChunk = message.chunk;
        console.log('Received file chunk:', chunk.fileName, `${chunk.chunkIndex + 1}/${chunk.totalChunks}`);
        
        const file = fileManager.receiveChunk(chunk, (fileId, progress) => {
          console.log(`File ${fileId} progress: ${progress}%`);
          setTransferProgress(prev => {
            const newMap = new Map(prev);
            newMap.set(fileId, {
              fileId,
              progress,
              bytesTransferred: (progress / 100) * chunk.fileSize,
              totalBytes: chunk.fileSize,
              status: progress === 100 ? 'completed' : 'transferring',
            });
            return newMap;
          });
        });

        if (file) {
          // File transfer completed
          console.log('File transfer completed:', file.name);
          // Trigger download or add to received files list
        }
      }
    } catch (error) {
      console.error('Error handling received message:', error);
    }
  }, [fileManager]);

  useEffect(() => {
    const manager = new WebRTCManager();
    
    manager.setConnectionStateChangeHandler((state) => {
      console.log('WebRTC connection state:', state);
      setConnectionState(state);
    });

    manager.setDataChannelOpenHandler(() => {
      console.log('Data channel is open, ready for transfers');
      setIsDataChannelOpen(true);
    });

    manager.setDataChannelCloseHandler(() => {
      console.log('Data channel closed');
      setIsDataChannelOpen(false);
    });

    manager.setDataChannelMessageHandler((data) => {
      console.log('Received data:', typeof data);
      if (data instanceof ArrayBuffer) {
        // Handle binary chunk data
        handleReceivedChunk(data);
      } else {
        // Handle JSON messages
        handleReceivedMessage(data);
      }
    });

    setWebRTC(manager);

    return () => {
      manager.close();
    };
  }, [handleReceivedMessage, handleReceivedChunk]);

  const sendFile = useCallback(async (file: File) => {
    if (!webrtc || !isDataChannelOpen) {
      throw new Error('WebRTC connection not established');
    }

    const fileId = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    setTransferProgress(prev => {
      const newMap = new Map(prev);
      newMap.set(fileId, {
        fileId,
        progress: 0,
        bytesTransferred: 0,
        totalBytes: file.size,
        status: 'transferring',
      });
      return newMap;
    });

    await fileManager.sendFile(
      file,
      (progress) => {
        setTransferProgress(prev => {
          const newMap = new Map(prev);
          const current = newMap.get(fileId);
          if (current) {
            newMap.set(fileId, {
              ...current,
              progress,
              bytesTransferred: (progress / 100) * file.size,
              status: progress === 100 ? 'completed' : 'transferring',
            });
          }
          return newMap;
        });
      },
      (chunk) => {
        webrtc.sendMessage({
          type: 'fileChunk',
          chunk,
        });
      }
    );
  }, [webrtc, isDataChannelOpen, fileManager]);

  const createDataChannel = useCallback((label: string) => {
    if (!webrtc) return null;
    try {
      return webrtc.createDataChannel(label);
    } catch (error) {
      console.error('Error setting up transfer:', error);
      throw error;
    }
  }, [webrtc]);

  const createOffer = useCallback(async () => {
    if (!webrtc) throw new Error('WebRTC not initialized');
    return await webrtc.createOffer();
  }, [webrtc]);

  const createAnswer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    if (!webrtc) throw new Error('WebRTC not initialized');
    return await webrtc.createAnswer(offer);
  }, [webrtc]);

  const setRemoteDescription = useCallback(async (description: RTCSessionDescriptionInit) => {
    if (!webrtc) throw new Error('WebRTC not initialized');
    await webrtc.setRemoteDescription(description);
  }, [webrtc]);

  const addIceCandidate = useCallback(async (candidate: RTCIceCandidate) => {
    if (!webrtc) throw new Error('WebRTC not initialized');
    await webrtc.addIceCandidate(candidate);
  }, [webrtc]);

  const onIceCandidate = useCallback((callback: (candidate: RTCIceCandidate) => void) => {
    if (!webrtc) return;
    webrtc.onIceCandidate(callback);
  }, [webrtc]);

  const close = useCallback(() => {
    if (webrtc) {
      webrtc.close();
    }
  }, [webrtc]);

  return {
    webrtc,
    connectionState,
    isDataChannelOpen,
    transferProgress,
    sendFile,
    createDataChannel,
    createOffer,
    createAnswer,
    setRemoteDescription,
    addIceCandidate,
    onIceCandidate,
    close,
  };
}

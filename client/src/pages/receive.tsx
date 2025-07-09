import { useState, useEffect, useCallback } from 'react';
import { useRoute } from 'wouter';
import { ReceiveSection } from '@/components/receive-section';
import { useWebRTC } from '@/hooks/use-webrtc';
import { useFirebaseSignaling } from '@/hooks/use-firebase-signaling';
import { useToast } from '@/hooks/use-toast';
import { downloadFile } from '@/lib/file-utils';

interface ReceivePageParams {
  roomId: string;
}

interface ReceivedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'receiving' | 'completed' | 'failed';
  data?: File;
}

export default function ReceivePage() {
  const [, params] = useRoute<ReceivePageParams>('/r/:roomId');
  const [receivedFiles, setReceivedFiles] = useState<ReceivedFile[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'waiting' | 'connecting' | 'connected' | 'disconnected' | 'failed'>('waiting');
  
  const { toast } = useToast();
  
  const { signaling, setAnswer, addIceCandidate, onOffer, onIceCandidates, cleanup } = useFirebaseSignaling(params?.roomId);
  const { 
    webrtc, 
    connectionState, 
    isDataChannelOpen,
    transferProgress,
    createAnswer, 
    setRemoteDescription, 
    addIceCandidate: addWebRTCIceCandidate,
    onIceCandidate,
    close: closeWebRTC 
  } = useWebRTC();

  // Handle WebRTC connection state changes
  useEffect(() => {
    switch (connectionState) {
      case 'connecting':
        setConnectionStatus('connecting');
        break;
      case 'connected':
        setConnectionStatus('connected');
        break;
      case 'disconnected':
        setConnectionStatus('disconnected');
        break;
      case 'failed':
        setConnectionStatus('failed');
        break;
      default:
        setConnectionStatus('waiting');
    }
  }, [connectionState]);

  // Setup WebRTC signaling for receiver
  useEffect(() => {
    if (!signaling || !webrtc) return;

    // Setup ICE candidate handling
    onIceCandidate((candidate) => {
      addIceCandidate(candidate);
    });

    // Listen for offers
    onOffer(async (offer) => {
      try {
        setConnectionStatus('connecting');
        await setRemoteDescription(offer);
        const answer = await createAnswer(offer);
        await setAnswer(answer);
      } catch (error) {
        console.error('Error handling offer:', error);
        setConnectionStatus('failed');
        toast({
          title: "Connection failed",
          description: "Unable to connect to sender. Please try again.",
          variant: "destructive",
        });
      }
    });

    // Listen for ICE candidates
    onIceCandidates(async (candidate) => {
      try {
        await addWebRTCIceCandidate(candidate);
      } catch (error) {
        console.error('Error adding ICE candidate:', error);
      }
    });

    return () => {
      cleanup();
    };
  }, [signaling, webrtc]);

  // Show connection success and handle file transfers
  useEffect(() => {
    if (isDataChannelOpen) {
      toast({
        title: "Connected!",
        description: "Ready to receive files from sender",
      });
    }
  }, [isDataChannelOpen, toast]);

  // Monitor transfer progress and update received files
  useEffect(() => {
    const newFiles: ReceivedFile[] = [];
    
    transferProgress.forEach((progress, fileId) => {
      const existingFile = receivedFiles.find(f => f.id === fileId);
      
      if (!existingFile) {
        // Add new file to the list
        newFiles.push({
          id: fileId,
          name: `File_${fileId}`,
          size: progress.totalBytes,
          type: 'application/octet-stream',
          progress: progress.progress,
          status: progress.status === 'completed' ? 'completed' : 
                  progress.status === 'transferring' ? 'receiving' : 'pending'
        });
      } else {
        // Update existing file progress
        setReceivedFiles(prev => 
          prev.map(f => 
            f.id === fileId 
              ? {
                  ...f,
                  progress: progress.progress,
                  status: progress.status === 'completed' ? 'completed' : 
                          progress.status === 'transferring' ? 'receiving' : 'pending'
                }
              : f
          )
        );
      }
    });

    if (newFiles.length > 0) {
      setReceivedFiles(prev => [...prev, ...newFiles]);
    }
  }, [transferProgress, receivedFiles]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeWebRTC();
      cleanup();
    };
  }, []);

  const handleDownloadFile = useCallback(async (fileId: string) => {
    const file = receivedFiles.find(f => f.id === fileId);
    if (file && file.data) {
      try {
        await downloadFile(file.data);
        toast({
          title: "Download started",
          description: `${file.name} is being downloaded`,
        });
      } catch (error) {
        toast({
          title: "Download failed",
          description: `Unable to download ${file.name}`,
          variant: "destructive",
        });
      }
    }
  }, [receivedFiles, toast]);

  const handleDownloadAll = useCallback(async () => {
    const completedFiles = receivedFiles.filter(f => f.status === 'completed' && f.data);
    
    try {
      for (const file of completedFiles) {
        if (file.data) {
          await downloadFile(file.data);
        }
      }
      
      toast({
        title: "Downloads started",
        description: `${completedFiles.length} files are being downloaded`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Some files could not be downloaded",
        variant: "destructive",
      });
    }
  }, [receivedFiles, toast]);

  if (!params?.roomId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Invalid Link</h1>
          <p className="text-slate-600">This sharing link is not valid or has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ReceiveSection
        files={receivedFiles}
        connectionStatus={connectionStatus}
        onDownloadFile={handleDownloadFile}
        onDownloadAll={handleDownloadAll}
      />
    </div>
  );
}

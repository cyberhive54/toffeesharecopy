import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'wouter';
import { FileUploadZone } from '@/components/file-upload-zone';
import { SharingSection } from '@/components/sharing-section';
import { LeaderboardAd, MobileBannerAd } from '@/components/ad-container';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWebRTC } from '@/hooks/use-webrtc';
import { useFirebaseSignaling } from '@/hooks/use-firebase-signaling';
import { useToast } from '@/hooks/use-toast';
import { FileItem } from '@/types';

export default function Home() {
  const [, setLocation] = useLocation();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [showSharingSection, setShowSharingSection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'waiting' | 'connecting' | 'connected' | 'disconnected' | 'failed'>('waiting');
  
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  const { signaling, shareUrl, roomId, setOffer, addIceCandidate, onAnswer, onIceCandidates, cleanup } = useFirebaseSignaling();
  const { 
    webrtc, 
    connectionState, 
    isDataChannelOpen, 
    transferProgress,
    createDataChannel, 
    createOffer, 
    setRemoteDescription, 
    addIceCandidate: addWebRTCIceCandidate,
    onIceCandidate,
    sendFile,
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

  // Setup WebRTC signaling
  useEffect(() => {
    if (!signaling || !webrtc) return;

    // Setup ICE candidate handling
    onIceCandidate((candidate) => {
      addIceCandidate(candidate);
    });

    // Listen for answers
    onAnswer(async (answer) => {
      try {
        await setRemoteDescription(answer);
        setConnectionStatus('connected');
      } catch (error) {
        console.error('Error setting remote description:', error);
        setConnectionStatus('failed');
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      closeWebRTC();
      cleanup();
    };
  }, []);

  const handleFilesSelected = useCallback(async (selectedFiles: File[]) => {
    const fileItems: FileItem[] = selectedFiles.map((file) => ({
      id: Date.now().toString(36) + Math.random().toString(36).substring(2),
      file,
      progress: 0,
      status: 'pending',
    }));

    setFiles(fileItems);
    setShowSharingSection(true);

    try {
      // Create data channel
      createDataChannel('fileTransfer');
      
      // Create and set offer
      const offer = await createOffer();
      await setOffer(offer);
      
      setConnectionStatus('waiting');
      
      toast({
        title: "Files ready!",
        description: "Share the link or QR code to start the transfer",
      });
    } catch (error) {
      console.error('Error setting up transfer:', error);
      toast({
        title: "Setup failed",
        description: "Unable to prepare files for sharing. Please try again.",
        variant: "destructive",
      });
    }
  }, [createDataChannel, createOffer, setOffer, toast]);

  const handleRemoveFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  const handleAddMoreFiles = useCallback(() => {
    // Trigger file selection
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const newFiles = Array.from(target.files || []);
      if (newFiles.length > 0) {
        const fileItems: FileItem[] = newFiles.map((file) => ({
          id: Date.now().toString(36) + Math.random().toString(36).substring(2),
          file,
          progress: 0,
          status: 'pending',
        }));
        setFiles(prev => [...prev, ...fileItems]);
      }
    };
    input.click();
  }, []);

  const handleCancelTransfer = useCallback(async () => {
    setFiles([]);
    setShowSharingSection(false);
    setConnectionStatus('waiting');
    closeWebRTC();
    await cleanup();
    
    toast({
      title: "Transfer cancelled",
      description: "File sharing session has been ended",
    });
  }, [closeWebRTC, cleanup, toast]);

  // Start file transfers when connected
  useEffect(() => {
    if (isDataChannelOpen && connectionStatus === 'connected') {
      files.forEach(async (fileItem) => {
        if (fileItem.status === 'pending') {
          try {
            await sendFile(fileItem.file);
          } catch (error) {
            console.error('Error sending file:', error);
            toast({
              title: "Transfer failed",
              description: `Failed to send ${fileItem.file.name}`,
              variant: "destructive",
            });
          }
        }
      });
    }
  }, [isDataChannelOpen, connectionStatus, files, sendFile, toast]);

  return (
    <div className="min-h-screen">
      {!showSharingSection ? (
        // Hero Section with Upload Zone
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Top Ad Container */}
            <div className="mb-8 flex justify-center">
              <LeaderboardAd />
            </div>

            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                Share Files <span className="text-brand-blue">Securely</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Send large files directly between browsers with end-to-end encryption. No uploads, no storage, just pure peer-to-peer transfer.
              </p>
            </div>

            <FileUploadZone onFilesSelected={handleFilesSelected} />

            {/* Mobile Ad Container */}
            {isMobile && (
              <div className="mt-8 flex justify-center">
                <MobileBannerAd />
              </div>
            )}
          </div>
        </section>
      ) : (
        // Sharing Section
        <SharingSection
          files={files}
          shareUrl={shareUrl}
          connectionStatus={connectionStatus}
          transferProgress={transferProgress}
          onRemoveFile={handleRemoveFile}
          onAddMoreFiles={handleAddMoreFiles}
          onCancelTransfer={handleCancelTransfer}
        />
      )}

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Why Choose ShareWave?</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">Experience the future of file sharing with our secure, fast, and private platform.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue bg-opacity-10 rounded-full mb-4">
                <i className="fas fa-shield-alt text-2xl text-brand-blue" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">End-to-End Encrypted</h3>
              <p className="text-slate-600">Your files are encrypted during transfer. No one can intercept or access your data.</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                <i className="fas fa-server text-2xl text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Server Storage</h3>
              <p className="text-slate-600">Files transfer directly between devices. Nothing is ever stored on our servers.</p>
            </div>

            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-violet-100 rounded-full mb-4">
                <i className="fas fa-infinity text-2xl text-brand-violet" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No Size Limits</h3>
              <p className="text-slate-600">Share files of any size. No restrictions on file types or transfer amounts.</p>
            </div>
          </div>

          {/* Bottom Ad Container */}
          {!isMobile && (
            <div className="flex justify-center">
              <LeaderboardAd />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

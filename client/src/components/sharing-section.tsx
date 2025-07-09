import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { FileList } from './file-list';
import { QRCode } from './qr-code';
import { ConnectionStatus } from './connection-status';
import { MediumRectangleAd, MobileBannerAd } from './ad-container';
import { useIsMobile } from '@/hooks/use-mobile';
import { FileItem, TransferProgress } from '@/types';

interface SharingSectionProps {
  files: FileItem[];
  shareUrl: string;
  connectionStatus: 'waiting' | 'connecting' | 'connected' | 'disconnected' | 'failed';
  transferProgress?: Map<string, TransferProgress>;
  onRemoveFile: (fileId: string) => void;
  onAddMoreFiles: () => void;
  onCancelTransfer: () => void;
  className?: string;
}

export function SharingSection({
  files,
  shareUrl,
  connectionStatus,
  transferProgress,
  onRemoveFile,
  onAddMoreFiles,
  onCancelTransfer,
  className = '',
}: SharingSectionProps) {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Please manually copy the link",
        variant: "destructive",
      });
    }
  };

  const handleSocialShare = (platform: 'facebook' | 'twitter' | 'whatsapp') => {
    const text = "Check out these files I'm sharing with you securely!";
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(text);

    let shareUrl_final = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl_final = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        shareUrl_final = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl_final = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
    }

    window.open(shareUrl_final, '_blank', 'width=600,height=400');
  };

  return (
    <section className={`py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <i className="fas fa-check text-2xl text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Files Ready to Share!</h2>
            <p className="text-slate-600">Your files are prepared for secure transfer. Share the link or QR code with the recipient.</p>
          </div>

          {/* File List */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Files to Share</h3>
            <FileList
              files={files}
              transferProgress={transferProgress}
              onRemoveFile={onRemoveFile}
              showProgress={connectionStatus === 'connected'}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Share Link */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Share Link</h3>
              <div className="bg-slate-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-3">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="flex-1 bg-transparent text-slate-700 font-mono text-sm mr-2 border-none p-0 h-auto"
                  />
                  <Button
                    onClick={handleCopyLink}
                    size="sm"
                    className="bg-brand-blue hover:bg-blue-600 text-white"
                  >
                    <i className="fas fa-copy mr-1" />
                    Copy
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => handleSocialShare('facebook')}
                    size="sm"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <i className="fab fa-facebook-f mr-1" />
                    Facebook
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('twitter')}
                    size="sm"
                    className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
                  >
                    <i className="fab fa-twitter mr-1" />
                    Twitter
                  </Button>
                  <Button
                    onClick={() => handleSocialShare('whatsapp')}
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    <i className="fab fa-whatsapp mr-1" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-4">QR Code</h3>
              <div className="bg-slate-50 rounded-lg p-4 border text-center">
                <QRCode 
                  value={shareUrl} 
                  size={128} 
                  className="mx-auto mb-3" 
                />
                <p className="text-sm text-slate-600">Scan to download files</p>
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <ConnectionStatus
            status={connectionStatus}
            className="mb-6"
          />

          {/* Desktop Ad Container */}
          {!isMobile && (
            <div className="hidden md:flex justify-center mb-6">
              <MediumRectangleAd />
            </div>
          )}

          {/* Mobile Ad Container */}
          {isMobile && (
            <div className="flex justify-center md:hidden mb-6">
              <MobileBannerAd />
            </div>
          )}

          <div className="text-center">
            <Button
              onClick={onAddMoreFiles}
              variant="secondary"
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium py-2 px-6 rounded-lg transition-colors mr-4"
            >
              <i className="fas fa-plus mr-2" />
              Add More Files
            </Button>
            <Button
              onClick={onCancelTransfer}
              variant="destructive"
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              <i className="fas fa-times mr-2" />
              Cancel Transfer
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

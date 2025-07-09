import { Button } from '@/components/ui/button';
import { ConnectionStatus } from './connection-status';
import { ReceivedFileList } from './file-list';
import { MobileBannerAd } from './ad-container';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReceivedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'pending' | 'receiving' | 'completed' | 'failed';
}

interface ReceiveSectionProps {
  files: ReceivedFile[];
  connectionStatus: 'waiting' | 'connecting' | 'connected' | 'disconnected' | 'failed';
  onDownloadFile: (fileId: string) => void;
  onDownloadAll: () => void;
  className?: string;
}

export function ReceiveSection({
  files,
  connectionStatus,
  onDownloadFile,
  onDownloadAll,
  className = '',
}: ReceiveSectionProps) {
  const isMobile = useIsMobile();

  return (
    <section className={`py-12 px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue bg-opacity-10 rounded-full mb-4">
              <i className="fas fa-download text-2xl text-brand-blue" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Files Shared With You</h2>
            <p className="text-slate-600">The sender is sharing these files with you. Download them before the connection closes.</p>
          </div>

          {/* Connection Status */}
          <ConnectionStatus
            status={connectionStatus}
            className="mb-6"
          />

          {/* Available Files for Download */}
          <div className="mb-8">
            <ReceivedFileList
              files={files}
              onDownload={onDownloadFile}
              onDownloadAll={onDownloadAll}
            />
          </div>

          {/* Mobile Ad Container */}
          {isMobile && (
            <div className="flex justify-center md:hidden mb-6">
              <MobileBannerAd />
            </div>
          )}

          {/* Warning Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
            <p className="text-amber-800 font-medium">⚠️ Connection will close when you or the sender leaves this page</p>
            <p className="text-amber-700 text-sm mt-1">Download all files you need before closing</p>
          </div>
        </div>
      </div>
    </section>
  );
}

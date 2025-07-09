import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize, getFileIcon } from '@/lib/file-utils';
import { FileItem, TransferProgress } from '@/types';
import { cn } from '@/lib/utils';

interface FileListProps {
  files: FileItem[];
  onRemoveFile?: (fileId: string) => void;
  transferProgress?: Map<string, TransferProgress>;
  showProgress?: boolean;
  className?: string;
}

export function FileList({ 
  files, 
  onRemoveFile, 
  transferProgress,
  showProgress = false,
  className 
}: FileListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {files.map((fileItem) => {
        const progress = transferProgress?.get(fileItem.id);
        const progressValue = progress?.progress || fileItem.progress || 0;
        const status = progress?.status || fileItem.status;
        
        return (
          <FileListItem
            key={fileItem.id}
            fileItem={fileItem}
            progress={progressValue}
            status={status}
            showProgress={showProgress}
            onRemove={() => onRemoveFile?.(fileItem.id)}
          />
        );
      })}
    </div>
  );
}

interface FileListItemProps {
  fileItem: FileItem;
  progress: number;
  status: 'pending' | 'transferring' | 'completed' | 'failed';
  showProgress: boolean;
  onRemove?: () => void;
}

function FileListItem({ 
  fileItem, 
  progress, 
  status, 
  showProgress, 
  onRemove 
}: FileListItemProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'pending': return 'text-slate-600';
      case 'transferring': return 'text-blue-600';
      case 'completed': return 'text-emerald-600';
      case 'failed': return 'text-red-600';
      default: return 'text-slate-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'pending': return 'fas fa-clock';
      case 'transferring': return 'fas fa-spinner fa-spin';
      case 'completed': return 'fas fa-check';
      case 'failed': return 'fas fa-times';
      default: return 'fas fa-clock';
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors">
      <div className="flex items-center flex-1">
        <div className="flex-shrink-0 mr-3">
          <i className={cn(
            getFileIcon(fileItem.file.type),
            "text-2xl",
            getIconColor(fileItem.file.type)
          )} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="font-medium text-slate-800 truncate">
              {fileItem.file.name}
            </p>
            {showProgress && (
              <div className="flex items-center ml-4">
                <i className={cn(getStatusIcon(), "text-sm mr-2", getStatusColor())} />
                <span className={cn("text-sm font-medium", getStatusColor())}>
                  {status === 'transferring' ? `${Math.round(progress)}%` : status}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center mt-1">
            <p className="text-sm text-slate-600">
              {formatFileSize(fileItem.file.size)}
            </p>
            {showProgress && status === 'transferring' && (
              <div className="ml-4 flex-1 max-w-xs">
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </div>
      </div>

      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="ml-2 text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <i className="fas fa-times" />
        </Button>
      )}
    </div>
  );
}

function getIconColor(fileType: string): string {
  if (fileType.startsWith('image/')) return 'text-blue-500';
  if (fileType.startsWith('video/')) return 'text-purple-500';
  if (fileType.startsWith('audio/')) return 'text-green-500';
  if (fileType.includes('pdf')) return 'text-red-500';
  if (fileType.includes('word') || fileType.includes('document')) return 'text-blue-600';
  if (fileType.includes('excel') || fileType.includes('spreadsheet')) return 'text-green-600';
  if (fileType.includes('powerpoint') || fileType.includes('presentation')) return 'text-orange-500';
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return 'text-yellow-600';
  return 'text-slate-400';
}

interface ReceivedFileListProps {
  files: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: 'pending' | 'receiving' | 'completed' | 'failed';
  }>;
  onDownload?: (fileId: string) => void;
  onDownloadAll?: () => void;
  className?: string;
}

export function ReceivedFileList({ 
  files, 
  onDownload, 
  onDownloadAll,
  className 
}: ReceivedFileListProps) {
  const completedFiles = files.filter(f => f.status === 'completed');
  const hasCompletedFiles = completedFiles.length > 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800">Available Files</h3>
        {hasCompletedFiles && onDownloadAll && (
          <Button onClick={onDownloadAll} className="bg-brand-blue hover:bg-blue-600">
            <i className="fas fa-download mr-2" />
            Download All ({completedFiles.length})
          </Button>
        )}
      </div>
      
      <div className="space-y-3">
        {files.map((file) => (
          <ReceivedFileItem
            key={file.id}
            file={file}
            onDownload={() => onDownload?.(file.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface ReceivedFileItemProps {
  file: {
    id: string;
    name: string;
    size: number;
    type: string;
    progress: number;
    status: 'pending' | 'receiving' | 'completed' | 'failed';
  };
  onDownload?: () => void;
}

function ReceivedFileItem({ file, onDownload }: ReceivedFileItemProps) {
  const getStatusDisplay = () => {
    switch (file.status) {
      case 'pending':
        return <span className="text-sm text-slate-600 font-medium">Waiting</span>;
      case 'receiving':
        return (
          <div className="flex items-center space-x-2">
            <div className="w-16 bg-slate-200 rounded-full h-2">
              <div 
                className="bg-brand-blue h-2 rounded-full transition-all duration-300" 
                style={{ width: `${file.progress}%` }}
              />
            </div>
            <span className="text-sm text-slate-600">{Math.round(file.progress)}%</span>
          </div>
        );
      case 'completed':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-emerald-600 font-medium">Ready</span>
            <Button
              size="sm"
              onClick={onDownload}
              className="bg-brand-blue hover:bg-blue-600 text-white"
            >
              <i className="fas fa-download mr-1" />
              Download
            </Button>
          </div>
        );
      case 'failed':
        return <span className="text-sm text-red-600 font-medium">Failed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border hover:bg-slate-100 transition-colors">
      <div className="flex items-center">
        <i className={cn(
          getFileIcon(file.type),
          "text-2xl mr-3",
          getIconColor(file.type)
        )} />
        <div>
          <p className="font-medium text-slate-800">{file.name}</p>
          <p className="text-sm text-slate-600">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {getStatusDisplay()}
      </div>
    </div>
  );
}

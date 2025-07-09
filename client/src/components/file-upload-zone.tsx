import { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FileUploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  className?: string;
  disabled?: boolean;
}

export function FileUploadZone({ onFilesSelected, className, disabled = false }: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  }, [onFilesSelected, disabled]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [onFilesSelected, disabled]);

  const handleClick = useCallback(() => {
    if (disabled) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    };
    input.click();
  }, [onFilesSelected, disabled]);

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border-2 border-dashed transition-all duration-200 p-8 md:p-12 text-center cursor-pointer",
        {
          "border-slate-300 hover:border-brand-blue": !disabled && !isDragOver,
          "border-brand-blue bg-blue-50": !disabled && isDragOver,
          "border-slate-200 bg-slate-50 cursor-not-allowed opacity-60": disabled,
        },
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="mb-6">
        <i className={cn(
          "fas fa-cloud-upload-alt text-6xl mb-4",
          {
            "text-slate-400": !isDragOver && !disabled,
            "text-brand-blue": isDragOver && !disabled,
            "text-slate-300": disabled,
          }
        )} />
        <h3 className={cn(
          "text-2xl font-semibold mb-2",
          {
            "text-slate-800": !disabled,
            "text-slate-500": disabled,
          }
        )}>
          {isDragOver ? 'Drop your files here' : 'Drop your files here'}
        </h3>
        <p className={cn(
          "mb-6",
          {
            "text-slate-600": !disabled,
            "text-slate-400": disabled,
          }
        )}>
          or click to browse and select files
        </p>
      </div>
      
      <div className="space-y-4">
        <Button
          disabled={disabled}
          className={cn(
            "font-semibold py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center",
            {
              "bg-brand-blue hover:bg-blue-600 text-white": !disabled,
              "bg-slate-300 text-slate-500 cursor-not-allowed": disabled,
            }
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
        >
          <i className="fas fa-plus mr-2" />
          Select Files
        </Button>
        
        <div className={cn(
          "text-sm",
          {
            "text-slate-500": !disabled,
            "text-slate-400": disabled,
          }
        )}>
          <p>✓ No file size limits</p>
          <p>✓ End-to-end encrypted</p>
          <p>✓ No server storage</p>
        </div>
      </div>

      {/* Hidden file input for programmatic access */}
      <input
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInput}
        disabled={disabled}
      />
    </div>
  );
}

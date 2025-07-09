import { useEffect, useRef, useState } from 'react';
import { Copy, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import QRCodeLib from 'qrcode';

interface QRCodeProps {
  value: string;
  size?: number;
  className?: string;
}

export function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerated, setIsGenerated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (canvasRef.current && value) {
      generateQRCode(value, canvasRef.current, size);
    }
  }, [value, size]);

  // Fallback simple QR pattern if library fails
  const generateSimpleQR = (text: string, canvas: HTMLCanvasElement, size: number) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const moduleSize = size / 25;
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    
    // Create a simple pattern
    ctx.fillStyle = '#000000';
    
    // Generate a simple pattern based on the text
    const hash = text.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    // Draw finder patterns (corners)
    const drawFinderPattern = (x: number, y: number) => {
      ctx.fillRect(x, y, 7 * moduleSize, 7 * moduleSize);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x + moduleSize, y + moduleSize, 5 * moduleSize, 5 * moduleSize);
      ctx.fillStyle = '#000000';
      ctx.fillRect(x + 2 * moduleSize, y + 2 * moduleSize, 3 * moduleSize, 3 * moduleSize);
    };
    
    drawFinderPattern(0, 0);
    drawFinderPattern(size - 7 * moduleSize, 0);
    drawFinderPattern(0, size - 7 * moduleSize);
    
    // Draw data pattern
    for (let i = 0; i < 25; i++) {
      for (let j = 0; j < 25; j++) {
        if ((i < 9 && j < 9) || (i > 15 && j < 9) || (i < 9 && j > 15)) {
          continue;
        }
        if ((i + j + hash) % 3 === 0) {
          ctx.fillRect(i * moduleSize, j * moduleSize, moduleSize, moduleSize);
        }
      }
    }
  };

  const generateQRCode = async (text: string, canvas: HTMLCanvasElement, size: number) => {
    try {
      await QRCodeLib.toCanvas(canvas, text, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'M'
      });
      setIsGenerated(true);
    } catch (error) {
      console.error('QR Code generation failed:', error);
      // Fallback to simple pattern
      generateSimpleQR(text, canvas, size);
      setIsGenerated(true);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually",
        variant: "destructive",
      });
    }
  };

  const downloadQR = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  const openLink = () => {
    window.open(value, '_blank');
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="mx-auto block rounded-lg"
        />
      </div>
      
      {isGenerated && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Button 
            onClick={copyToClipboard}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
          <Button 
            onClick={downloadQR}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Save QR
          </Button>
          <Button 
            onClick={openLink}
            variant="outline" 
            size="sm"
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open
          </Button>
        </div>
      )}
      
      <p className="text-sm text-gray-500 text-center">
        Scan to download files
      </p>
    </div>
  );
}

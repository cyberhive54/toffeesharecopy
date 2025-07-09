import { useEffect, useRef } from 'react';

interface AdContainerProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  style?: React.CSSProperties;
  className?: string;
}

export function AdContainer({ 
  slot = "0000000000", 
  format = "auto", 
  style,
  className = "" 
}: AdContainerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      // Check if adsbygoogle is available
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (error) {
      console.log('AdSense not loaded');
    }
  }, []);

  return (
    <div className={`ad-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', ...style }}
        data-ad-client="ca-pub-0000000000000000"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        ref={adRef}
      />
    </div>
  );
}

// Predefined ad sizes for common placements
export function LeaderboardAd({ className }: { className?: string }) {
  return (
    <AdContainer
      className={className}
      style={{ width: '728px', height: '90px' }}
      format="horizontal"
    />
  );
}

export function MediumRectangleAd({ className }: { className?: string }) {
  return (
    <AdContainer
      className={className}
      style={{ width: '300px', height: '250px' }}
      format="rectangle"
    />
  );
}

export function MobileBannerAd({ className }: { className?: string }) {
  return (
    <AdContainer
      className={className}
      style={{ width: '320px', height: '50px' }}
      format="horizontal"
    />
  );
}

export function SkyscraperAd({ className }: { className?: string }) {
  return (
    <AdContainer
      className={className}
      style={{ width: '160px', height: '600px' }}
      format="vertical"
    />
  );
}

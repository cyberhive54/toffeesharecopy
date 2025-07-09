import { useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';

interface SharePageParams {
  roomId: string;
}

export default function SharePage() {
  const [, params] = useRoute<SharePageParams>('/s/:roomId');
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (params?.roomId) {
      // Redirect to home with room context
      setLocation(`/?room=${params.roomId}`);
      
      toast({
        title: "Joining sharing session",
        description: "Loading your shared files...",
      });
    }
  }, [params, setLocation, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue mx-auto mb-4"></div>
        <p className="text-slate-600">Loading sharing session...</p>
      </div>
    </div>
  );
}

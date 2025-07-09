import { cn } from '@/lib/utils';

interface ConnectionStatusProps {
  status: 'waiting' | 'connecting' | 'connected' | 'disconnected' | 'failed';
  message?: string;
  className?: string;
}

export function ConnectionStatus({ status, message, className }: ConnectionStatusProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'waiting':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          iconColor: 'text-blue-500',
          textColor: 'text-blue-800',
          subTextColor: 'text-blue-600',
          icon: 'fas fa-clock',
          defaultMessage: 'Waiting for receiver to connect...',
          subMessage: 'Connection will be established instantly when someone opens your link',
          animate: 'animate-pulse-slow',
        };
      case 'connecting':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          iconColor: 'text-yellow-500',
          textColor: 'text-yellow-800',
          subTextColor: 'text-yellow-600',
          icon: 'fas fa-sync-alt',
          defaultMessage: 'Establishing connection...',
          subMessage: 'Setting up secure peer-to-peer connection',
          animate: 'animate-spin',
        };
      case 'connected':
        return {
          bgColor: 'bg-emerald-50 border-emerald-200',
          iconColor: 'text-emerald-500',
          textColor: 'text-emerald-800',
          subTextColor: 'text-emerald-600',
          icon: 'fas fa-check-circle',
          defaultMessage: 'Connected to receiver',
          subMessage: 'Files are ready for transfer',
          animate: '',
        };
      case 'disconnected':
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          iconColor: 'text-gray-500',
          textColor: 'text-gray-800',
          subTextColor: 'text-gray-600',
          icon: 'fas fa-unlink',
          defaultMessage: 'Connection closed',
          subMessage: 'The transfer session has ended',
          animate: '',
        };
      case 'failed':
        return {
          bgColor: 'bg-red-50 border-red-200',
          iconColor: 'text-red-500',
          textColor: 'text-red-800',
          subTextColor: 'text-red-600',
          icon: 'fas fa-exclamation-triangle',
          defaultMessage: 'Connection failed',
          subMessage: 'Unable to establish connection. Please try again.',
          animate: '',
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          iconColor: 'text-gray-500',
          textColor: 'text-gray-800',
          subTextColor: 'text-gray-600',
          icon: 'fas fa-question',
          defaultMessage: 'Unknown status',
          subMessage: '',
          animate: '',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={cn(
      `border rounded-lg p-4`,
      config.bgColor,
      className
    )}>
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={cn(
            "w-3 h-3 rounded-full",
            config.iconColor.replace('text-', 'bg-'),
            config.animate
          )} />
        </div>
        <div className="ml-3 flex-1">
          <p className={cn("text-sm font-medium", config.textColor)}>
            {message || config.defaultMessage}
          </p>
          {config.subMessage && (
            <p className={cn("text-xs mt-1", config.subTextColor)}>
              {config.subMessage}
            </p>
          )}
        </div>
        <div className="ml-3">
          <i className={cn(config.icon, config.iconColor, config.animate)} />
        </div>
      </div>
    </div>
  );
}

interface DetailedConnectionStatusProps extends ConnectionStatusProps {
  peerCount?: number;
  transferRate?: string;
  showDetails?: boolean;
}

export function DetailedConnectionStatus({ 
  status, 
  message, 
  peerCount = 0,
  transferRate,
  showDetails = false,
  className 
}: DetailedConnectionStatusProps) {
  const config = getStatusConfig(status);

  return (
    <div className={cn(
      `border rounded-lg p-4`,
      config.bgColor,
      className
    )}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <div className={cn(
            "w-4 h-4 rounded-full flex items-center justify-center",
            config.iconColor.replace('text-', 'bg-'),
            config.animate
          )}>
            <i className={cn(config.icon, "text-xs text-white")} />
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className={cn("text-sm font-medium", config.textColor)}>
            {message || config.defaultMessage}
          </p>
          {config.subMessage && (
            <p className={cn("text-xs mt-1", config.subTextColor)}>
              {config.subMessage}
            </p>
          )}
          
          {showDetails && status === 'connected' && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs">
                <span className={config.subTextColor}>Connected peers:</span>
                <span className={config.textColor}>{peerCount}</span>
              </div>
              {transferRate && (
                <div className="flex justify-between text-xs">
                  <span className={config.subTextColor}>Transfer rate:</span>
                  <span className={config.textColor}>{transferRate}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusConfig(status: string) {
  // Helper function to avoid duplication
  switch (status) {
    case 'waiting':
      return {
        bgColor: 'bg-blue-50 border-blue-200',
        iconColor: 'text-blue-500',
        textColor: 'text-blue-800',
        subTextColor: 'text-blue-600',
        icon: 'fas fa-clock',
        defaultMessage: 'Waiting for receiver to connect...',
        subMessage: 'Connection will be established instantly when someone opens your link',
        animate: 'animate-pulse-slow',
      };
    case 'connecting':
      return {
        bgColor: 'bg-yellow-50 border-yellow-200',
        iconColor: 'text-yellow-500',
        textColor: 'text-yellow-800',
        subTextColor: 'text-yellow-600',
        icon: 'fas fa-sync-alt',
        defaultMessage: 'Establishing connection...',
        subMessage: 'Setting up secure peer-to-peer connection',
        animate: 'animate-spin',
      };
    case 'connected':
      return {
        bgColor: 'bg-emerald-50 border-emerald-200',
        iconColor: 'text-emerald-500',
        textColor: 'text-emerald-800',
        subTextColor: 'text-emerald-600',
        icon: 'fas fa-check-circle',
        defaultMessage: 'Connected to receiver',
        subMessage: 'Files are ready for transfer',
        animate: '',
      };
    case 'disconnected':
      return {
        bgColor: 'bg-gray-50 border-gray-200',
        iconColor: 'text-gray-500',
        textColor: 'text-gray-800',
        subTextColor: 'text-gray-600',
        icon: 'fas fa-unlink',
        defaultMessage: 'Connection closed',
        subMessage: 'The transfer session has ended',
        animate: '',
      };
    case 'failed':
      return {
        bgColor: 'bg-red-50 border-red-200',
        iconColor: 'text-red-500',
        textColor: 'text-red-800',
        subTextColor: 'text-red-600',
        icon: 'fas fa-exclamation-triangle',
        defaultMessage: 'Connection failed',
        subMessage: 'Unable to establish connection. Please try again.',
        animate: '',
      };
    default:
      return {
        bgColor: 'bg-gray-50 border-gray-200',
        iconColor: 'text-gray-500',
        textColor: 'text-gray-800',
        subTextColor: 'text-gray-600',
        icon: 'fas fa-question',
        defaultMessage: 'Unknown status',
        subMessage: '',
        animate: '',
      };
  }
}

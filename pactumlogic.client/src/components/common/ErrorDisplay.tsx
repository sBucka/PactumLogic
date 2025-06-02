import { useNavigate } from "react-router-dom";

interface ErrorDisplayProps {
  error?: string | null;
  fallbackMessage?: string;
  onRetry?: () => void;
  showBackButton?: boolean;
}

export const ErrorDisplay = ({ 
  error, 
  fallbackMessage = "Nastala chyba",
  onRetry,
  showBackButton = true 
}: ErrorDisplayProps) => {
  const navigate = useNavigate();

  return (
    <div className='text-center py-8'>
      <p className='text-red-600'>{error || fallbackMessage}</p>
      <div className='mt-4 space-x-4'>
        {onRetry && (
          <button
            onClick={onRetry}
            className='text-teal-600 hover:text-teal-800'
          >
            Skúsiť znovu
          </button>
        )}
        {showBackButton && (
          <button
            onClick={() => navigate(-1)}
            className='text-teal-600 hover:text-teal-800'
          >
            Späť
          </button>
        )}
      </div>
    </div>
  );
};
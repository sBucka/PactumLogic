import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// src/components/layout/PageLayout.tsx
interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  backButton?: boolean;
  onBack?: () => void;
}

const PageFormLayout = ({ 
  title, 
  subtitle, 
  children, 
  actions, 
  backButton = false,
  onBack 
}: PageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          {backButton && (
            <button
              onClick={onBack || (() => navigate(-1))}
              className='p-2 rounded-md hover:bg-gray-100'
            >
              <ArrowLeftIcon className='h-5 w-5' />
            </button>
          )}
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>{title}</h1>
            {subtitle && <p className='text-gray-600'>{subtitle}</p>}
          </div>
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
};
export default PageFormLayout;
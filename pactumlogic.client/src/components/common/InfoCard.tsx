interface InfoCardProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const InfoCard = ({ title, icon, children }: InfoCardProps) => (
  <div className='bg-white p-6 rounded-lg shadow'>
    <h2 className='text-lg font-semibold mb-4 flex items-center'>
      {icon && <span className='mr-2'>{icon}</span>}
      {title}
    </h2>
    {children}
  </div>
);

// src/components/display/InfoRow.tsx
interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

const InfoRow = ({ label, value }: InfoRowProps) => (
  <div>
    <span className='text-sm font-medium text-gray-500'>{label}:</span>
    <p className='text-gray-900'>{value}</p>
  </div>
);

export { InfoCard, InfoRow };
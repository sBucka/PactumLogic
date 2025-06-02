interface CellStatusProps {
  isActive: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

const CellStatus = ({ 
  isActive, 
  activeLabel = 'Aktívna', 
  inactiveLabel = 'Ukončená' 
}: CellStatusProps) => {
  return (
    <span
      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }`}
    >
      {isActive ? activeLabel : inactiveLabel}
    </span>
  );
};

export default CellStatus;
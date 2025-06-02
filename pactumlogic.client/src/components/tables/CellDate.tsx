import { formatDateUtil } from "../../utils/formatDateUtil";

interface CellDateProps {
  dateString: string;
  locale?: string;
}

const CellDate = ({ dateString, locale = "sk-SK" }: CellDateProps) => {
  return (
    <span className='text-sm text-gray-900'>
      {formatDateUtil(dateString, locale)}
    </span>
  );
};

export default CellDate;

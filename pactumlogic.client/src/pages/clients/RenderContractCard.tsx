import { Link } from "react-router-dom";
import type { ContractSummary } from "../../models/Contract";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { formatDateUtil } from "../../utils/formatDateUtil";

interface RenderContractCardProps {
  title: string;
  contracts: ContractSummary[];
  icon: React.ReactNode;
  emptyMessage: string;
}

const RenderContractCard = ({
  title,
  contracts,
  icon,
  emptyMessage,
}: RenderContractCardProps) => {
  return (
    <div className='bg-white p-6 rounded-lg shadow'>
      <h2 className='text-lg font-semibold mb-4 flex items-center'>
        {icon}
        {title} ({contracts?.length || 0})
      </h2>

      {!contracts || contracts.length === 0 ? (
        <div className='text-center py-8'>
          <p className='text-gray-500'>{emptyMessage}</p>
          <Link
            to='/contracts/new'
            className='mt-2 text-teal-600 hover:text-teal-800'
          >
            Vytvoriť novú zmluvu
          </Link>
        </div>
      ) : (
        <div className='space-y-3'>
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              to={`/contracts/${contract.id}`}
              className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900'>
                    {contract.referenceNumber}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {contract.institution}
                  </p>
                  <div className='flex items-center mt-1 text-xs text-gray-500'>
                    <CalendarIcon className='h-3 w-3 mr-1' />
                    Uzavretá: {formatDateUtil(contract.contractDate)}
                  </div>
                </div>
                <div className='text-right'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      contract.terminationDate
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {contract.terminationDate ? "Ukončená" : "Aktívna"}
                  </span>
                  {contract.terminationDate && (
                    <p className='text-xs text-gray-500 mt-1'>
                      {formatDateUtil(contract.terminationDate)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RenderContractCard;
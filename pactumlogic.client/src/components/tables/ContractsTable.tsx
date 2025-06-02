import { Link } from "react-router-dom";
import type { ContractWithDetails } from "../../models/Contract";
import CellDate from "./CellDate";
import CellStatus from "./CellStatus";
import GenericTable, { type TableColumn, type TableAction } from "./GenericTable";
import { useDelete } from "../../hooks/useDelete";

interface ContractsTableProps {
  contracts: ContractWithDetails[];
  showActions?: boolean;
  className?: string;
  delete?: boolean;
  onContractDeleted?: (contractId: number) => void;
}

const ContractsTable = ({
  contracts,
  showActions = true,
  className = "",
  delete: showDelete = false,
  onContractDeleted,
}: ContractsTableProps) => {
  const { openDeleteModal, Modal } = useDelete();

  const isContractActive = (contract: ContractWithDetails): boolean => {
    const validityDate = new Date(contract.validityDate);
    const currentDate = new Date();
    return validityDate > currentDate;
  };

  const columns: TableColumn<ContractWithDetails>[] = [
    {
      header: "Zmluva",
      accessor: (contract) => (
        <div>
          <Link
            to={`/contracts/${contract.id}`}
            className='text-teal-600 hover:text-teal-900 font-medium'
          >
            {contract.referenceNumber}
          </Link>
          <div className='text-sm text-gray-500'>{contract.institution}</div>
        </div>
      ),
    },
    {
      header: "Klient",
      accessor: (contract) => (
        <div>
          <div className='text-sm font-medium text-gray-900'>
            {contract.client.firstName} {contract.client.lastName}
          </div>
          <div className='text-sm text-gray-500'>{contract.client.email}</div>
        </div>
      ),
    },
    {
      header: "Správca",
      accessor: (contract) => (
        <div>
          <div className='text-sm font-medium text-gray-900'>
            {contract.administrator.firstName} {contract.administrator.lastName}
          </div>
          <div className='text-sm text-gray-500'>
            {contract.administrator.email}
          </div>
        </div>
      ),
    },
    {
      header: "Dátum uzavretia",
      accessor: (contract) => (
        <span className='text-sm text-gray-900'>
          <CellDate dateString={contract.contractDate} />
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (contract) => (
        <CellStatus
          isActive={isContractActive(contract)}
          activeLabel='Aktívna'
          inactiveLabel='Ukončená'
        />
      ),
    },
  ];

  const actions: TableAction<ContractWithDetails>[] = showActions
    ? [
        {
          label: "Detail",
          href: (contract) => `/contracts/${contract.id}`,
          className: "text-teal-600 hover:text-teal-900",
        },
        ...(showDelete ? [{
          label: "Zmazať",
          onClick: (contract: ContractWithDetails) => {
            openDeleteModal(
              'contract',
              contract.id,
              contract.referenceNumber,
              () => onContractDeleted?.(contract.id)
            );
          },
          className: "text-red-600 hover:text-red-900",
        }] : []),
      ]
    : [];

  return (
    <>
      <GenericTable
        data={contracts}
        columns={columns}
        actions={actions}
        keyExtractor={(contract) => contract.id}
        emptyMessage='Žiadne zmluvy neboli nájdené'
        className={className}
      />
      <Modal />
    </>
  );
};

export default ContractsTable;
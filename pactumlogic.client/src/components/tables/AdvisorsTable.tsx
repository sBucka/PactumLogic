import { Link } from "react-router-dom";
import type { Advisor } from "../../models/Advisor";
import GenericTable, { type TableColumn, type TableAction } from "./GenericTable";
import { useDelete } from "../../hooks/useDelete";

interface AdvisorsTableProps {
  advisors: Advisor[];
  showActions?: boolean;
  className?: string;
  delete?: boolean;
  onAdvisorDeleted?: (advisorId: number) => void;
}

const AdvisorsTable = ({
  advisors,
  showActions = true,
  className = "",
  delete: showDelete = false,
  onAdvisorDeleted,
}: AdvisorsTableProps) => {
  const { openDeleteModal, Modal } = useDelete();

  const columns: TableColumn<Advisor>[] = [
    {
      header: "Meno",
      accessor: (advisor) => (
        <div>
          <Link
            to={`/advisors/${advisor.id}`}
            className='text-teal-600 hover:text-teal-900 font-medium'
          >
            {advisor.firstName} {advisor.lastName}
          </Link>
          <div className='text-sm text-gray-500'>{advisor.email}</div>
        </div>
      ),
    },
    {
      header: "Telefón",
      accessor: (advisor) => advisor.phone,
    },
    {
      header: "Vek",
      accessor: (advisor) => advisor.age,
    },
  ];

  const actions: TableAction<Advisor>[] = showActions
    ? [
        {
          label: "Detail",
          href: (advisor) => `/advisors/${advisor.id}`,
          className: "text-teal-600 hover:text-teal-900",
        },
        ...(showDelete ? [{
          label: "Zmazať",
          onClick: (advisor: Advisor) => {
            openDeleteModal(
              'advisor',
              advisor.id,
              `${advisor.firstName} ${advisor.lastName}`,
              () => onAdvisorDeleted?.(advisor.id)
            );
          },
          className: "text-red-600 hover:text-red-900",
        }] : []),
      ]
    : [];

  return (
    <>
      <GenericTable
        data={advisors}
        columns={columns}
        actions={actions}
        keyExtractor={(advisor) => advisor.id}
        emptyMessage='Žiadni klienti neboli nájdení'
        className={className}
      />
      <Modal />
    </>
  );
};

export default AdvisorsTable;
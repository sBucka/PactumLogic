import { Link } from "react-router-dom";
import type { Client } from "../../models/Client";
import GenericTable, { type TableColumn, type TableAction } from "./GenericTable";
import { useDelete } from "../../hooks/useDelete";

interface ClientsTableProps {
  clients: Client[];
  showActions?: boolean;
  className?: string;
  delete?: boolean;
  onClientDeleted?: (clientId: number) => void;
}

const ClientsTable = ({
  clients,
  showActions = true,
  className = "",
  delete: showDelete = false,
  onClientDeleted,
}: ClientsTableProps) => {
  const { openDeleteModal, Modal } = useDelete();

  const columns: TableColumn<Client>[] = [
    {
      header: "Meno",
      accessor: (client) => (
        <div>
          <Link
            to={`/clients/${client.id}`}
            className='text-teal-600 hover:text-teal-900 font-medium'
          >
            {client.firstName} {client.lastName}
          </Link>
          <div className='text-sm text-gray-500'>{client.email}</div>
        </div>
      ),
    },
    {
      header: "Telefón",
      accessor: (client) => client.phone,
    },
    {
      header: "Vek",
      accessor: (client) => client.age,
    },
  ];

  const actions: TableAction<Client>[] = showActions
    ? [
        {
          label: "Detail",
          href: (client) => `/clients/${client.id}`,
          className: "text-teal-600 hover:text-teal-900",
        },
        ...(showDelete ? [{
          label: "Zmazať",
          onClick: (client: Client) => {
            openDeleteModal(
              'client',
              client.id,
              `${client.firstName} ${client.lastName}`,
              () => onClientDeleted?.(client.id)
            );
          },
          className: "text-red-600 hover:text-red-900",
        }] : []),
      ]
    : [];

  return (
    <>
      <GenericTable
        data={clients}
        columns={columns}
        actions={actions}
        keyExtractor={(client) => client.id}
        emptyMessage='Žiadni klienti neboli nájdení'
        className={className}
      />
      <Modal />
    </>
  );
};

export default ClientsTable;
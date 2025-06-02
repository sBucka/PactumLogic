import { Link } from "react-router-dom";
import type { ClientWithContracts } from "../../models/Client";
import GenericTable, {
  type TableColumn,
  type TableAction,
} from "./GenericTable";
import { useDelete } from "../../hooks/useDelete";

interface ClientsTableProps {
  clients: ClientWithContracts[];
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

  const columns: TableColumn<ClientWithContracts>[] = [
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
      header: "Osobné číslo",
      accessor: (client) => client.personalIdNumber || "N/A",
    },
    {
      header: "Počet zmlúv",
      accessor: (client) => {
        const contractsLength = client.contracts.length;
        
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              contractsLength > 0
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {contractsLength}
          </span>
        );
      },
    },
  ];

  const actions: TableAction<ClientWithContracts>[] = showActions
    ? [
        {
          label: "Detail",
          href: (client) => `/clients/${client.id}`,
          className: "text-teal-600 hover:text-teal-900",
        },
        ...(showDelete
          ? [
              {
                label: "Zmazať",
                onClick: (client: ClientWithContracts) => {
                  openDeleteModal(
                    "client",
                    client.id,
                    `${client.firstName} ${client.lastName}`,
                    () => onClientDeleted?.(client.id)
                  );
                },
                className: "text-red-600 hover:text-red-900",
              },
            ]
          : []),
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
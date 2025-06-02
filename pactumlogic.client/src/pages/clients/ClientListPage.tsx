import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ClientWithContracts } from "../../models/Client";
import { clientService } from "../../services/clientService";
import CSVExport from "../../components/common/CSVExport";
import { CSVExportUtil } from "../../utils/csvExportUtil";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ClientsTable from "../../components/tables/ClientsTable";
import { PlusIcon } from "@heroicons/react/24/outline";

const ClientListPage = () => {
  const [allClients, setAllClients] = useState<ClientWithContracts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getAll();
      setAllClients(response);
    } catch {
      setError("Chyba pri načítavaní klientov");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientDeleted = (clientId: number) => {
    setAllClients((prevClients) =>
      prevClients.filter((client) => client.id !== clientId)
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const csvData = CSVExportUtil.exportClients(allClients);
  const csvFilename = CSVExportUtil.generateFilename("klienti-export");

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Zoznam klientov</h1>
      </div>
      <div className='flex items-center justify-between mb-4'>
        <Link
          to='/clients/new'
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors'
        >
          <PlusIcon className='h-4 w-4 mr-2' />
          Nový klient
        </Link>
        <CSVExport csvData={csvData} csvFilename={csvFilename} />
      </div>

      {error && <div className='text-red-500 mb-4'>{error}</div>}

      {isLoading ? (
        <div className='flex justify-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className='flex items-center gap-4 mb-4'></div>
          <ClientsTable
            clients={allClients}
            delete={true}
            onClientDeleted={handleClientDeleted}
          />
        </>
      )}
    </div>
  );
};

export default ClientListPage;

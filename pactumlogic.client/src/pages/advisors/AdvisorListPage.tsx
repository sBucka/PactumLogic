import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { clientService } from "../../services/clientService";
import ClientsTable from "../../components/tables/ClientsTable";
import type { AdvisorWithContracts } from "../../models/Client";
import { ClientType } from "../../models/Client";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PlusIcon } from "@heroicons/react/24/outline";
import CSVExport from "../../components/common/CSVExport";
import { CSVExportUtil } from "../../utils/csvExportUtil";

const AdvisorListPage = () => {
  const [advisors, setAdvisors] = useState<AdvisorWithContracts[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const advisorData = await clientService.getAllAdvisorsWithContracts();
      setAdvisors(advisorData);
    } catch (err) {
      setError("Chyba pri načítavaní dát");
      console.error("Error fetching advisors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvisorDeleted = (advisorId: number) => {
    setAdvisors((prevAdvisors) =>
      prevAdvisors.filter((advisor) => advisor.id !== advisorId)
    );
  };

  const csvData = CSVExportUtil.exportClients(advisors);
  const csvFilename = CSVExportUtil.generateFilename("poradcovia-export");

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Zoznam Poradcov</h1>
      </div>
      <div className='flex items-center justify-between mb-4'>
        <Link
          to='/clients/new'
          state={{ defaultType: ClientType.Advisor }}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors'
        >
          <PlusIcon className='h-4 w-4 mr-2' />
          Nový Poradca
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
            clients={advisors}
            delete={true}
            onClientDeleted={handleAdvisorDeleted}
          />
        </>
      )}
    </div>
  );
};

export default AdvisorListPage;

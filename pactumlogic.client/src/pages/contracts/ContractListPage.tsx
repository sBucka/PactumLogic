import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contractService } from "../../services/contractService";
import ContractsTable from "./../../components/tables/ContractsTable";
import CSVExport from "../../components/common/CSVExport";
import { CSVExportUtil } from "../../utils/csvExportUtil";
import type { ContractWithDetails } from "../../models/Contract";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PlusIcon } from "@heroicons/react/24/outline";

const ContractListPage = () => {
  const [recentContracts, setRecentContracts] = useState<ContractWithDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const contracts = await contractService.getAll();
      setRecentContracts(contracts);
    } catch (err) {
      setError("Chyba pri načítavaní dát");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContractDeleted = (contractId: number) => {
    setRecentContracts((prevContracts) =>
      prevContracts.filter((contract) => contract.id !== contractId)
    );
  };

  const csvData = CSVExportUtil.exportContracts(recentContracts);
  const csvFilename = CSVExportUtil.generateFilename("zmluvy-export");

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Zoznam zmlúv</h1>
      </div>

      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {isLoading ? (
        <div className='flex justify-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className='flex items-center gap-4 mb-4'>
            <CSVExport csvData={csvData} csvFilename={csvFilename} />
            <Link
              to='/contracts/new'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors'
            >
              <PlusIcon className='h-4 w-4 mr-2' />
              Nová zmluva
            </Link>
          </div>
          <ContractsTable
            contracts={recentContracts}
            delete={true}
            onContractDeleted={handleContractDeleted}
          />
        </>
      )}
    </div>
  );
};

export default ContractListPage;

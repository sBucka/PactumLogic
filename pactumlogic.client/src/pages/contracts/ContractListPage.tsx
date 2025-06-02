import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contractService } from "../../services/contractService";
import ContractsTable from "./../../components/tables/ContractsTable";
import CSVExport from "../../components/common/CSVExport";
import { CSVExportUtil } from "../../utils/csvExportUtil";
import type { ContractWithDetails } from "../../models/Contract";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PlusIcon, FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import FormField from "../../components/forms/FormField";

type StatusFilter = "all" | "active" | "inactive";

const ContractListPage = () => {
  const [allContracts, setAllContracts] = useState<ContractWithDetails[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<
    ContractWithDetails[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateFromFilter, setDateFromFilter] = useState<string>("");
  const [dateToFilter, setDateToFilter] = useState<string>("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allContracts, statusFilter, dateFromFilter, dateToFilter]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await contractService.getAll();
      setAllContracts(response);
    } catch (err) {
      setError("Chyba pri načítavaní dát");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const isContractActive = (contract: ContractWithDetails): boolean => {
    const validityDate = new Date(contract.validityDate);
    const currentDate = new Date();
    return validityDate > currentDate && !contract.terminationDate;
  };

  const applyFilters = () => {
    let filtered = [...allContracts];

    // Status filter
    if (statusFilter === "active") {
      filtered = filtered.filter((contract) => isContractActive(contract));
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((contract) => !isContractActive(contract));
    }

    // Date range filter
    if (dateFromFilter) {
      const fromDate = new Date(dateFromFilter);
      filtered = filtered.filter((contract) => {
        const contractValidityDate = new Date(contract.validityDate);
        return contractValidityDate >= fromDate;
      });
    }

    if (dateToFilter) {
      const toDate = new Date(dateToFilter);
      filtered = filtered.filter((contract) => {
        const contractValidityDate = new Date(contract.validityDate);
        return contractValidityDate <= toDate;
      });
    }

    setFilteredContracts(filtered);
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setDateFromFilter("");
    setDateToFilter("");
  };

  const hasActiveFilters =
    statusFilter !== "all" || dateFromFilter || dateToFilter;

  const handleContractDeleted = (contractId: number) => {
    setAllContracts((prevContracts) =>
      prevContracts.filter((contract) => contract.id !== contractId)
    );
  };

  const csvData = CSVExportUtil.exportContracts(filteredContracts);
  const csvFilename = CSVExportUtil.generateFilename("zmluvy-export");

  return (
    <div className='space-y-6'>
      {/* Header with filters */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <h1 className='text-2xl font-bold'>Zoznam zmlúv</h1>
          <div className='flex items-center space-x-2'>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className='inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500'
            >
              <FunnelIcon className='h-4 w-4 mr-1' />
              Filtre
              {hasActiveFilters && (
                <span className='ml-1 inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800'>
                  {[
                    statusFilter !== "all" ? 1 : 0,
                    dateFromFilter ? 1 : 0,
                    dateToFilter ? 1 : 0,
                  ].reduce((a, b) => a + b)}
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className='inline-flex items-center px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700'
                title='Zrušiť filtre'
              >
                <XMarkIcon className='h-4 w-4' />
              </button>
            )}
          </div>
        </div>
        <div className='text-sm text-gray-500'>
          Zobrazených: {filteredContracts.length} z {allContracts.length} zmlúv
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className='bg-gray-50 p-4 rounded-lg border border-gray-200'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {/* Status Filter */}
            <FormField
              label='Status'
              name='statusFilter'
              type='select'
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              options={[
                { value: "all", label: "Všetky" },
                { value: "active", label: "Aktívne" },
                { value: "inactive", label: "Neaktívne" },
              ]}
              className='w-full'
            />
            {/* Date From Filter */}
            <FormField
              label='Dátum platnosti od'
              name='dateFromFilter'
              type='date'
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className='w-full'
            />

            {/* Date To Filter */}
            <FormField
              label='Dátum platnosti do'
              name='dateToFilter'
              type='date'
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className='w-full'
            />
          </div>

          {/* Filter Summary */}
          {hasActiveFilters && (
            <div className='mt-3 pt-3 border-t border-gray-200'>
              <div className='flex flex-wrap gap-2'>
                {statusFilter !== "all" && (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800'>
                    Status:{" "}
                    {statusFilter === "active" ? "Aktívne" : "Neaktívne"}
                    <button
                      onClick={() => setStatusFilter("all")}
                      className='ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-teal-200'
                    >
                      <XMarkIcon className='h-3 w-3' />
                    </button>
                  </span>
                )}
                {dateFromFilter && (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    Od: {new Date(dateFromFilter).toLocaleDateString("sk-SK")}
                    <button
                      onClick={() => setDateFromFilter("")}
                      className='ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200'
                    >
                      <XMarkIcon className='h-3 w-3' />
                    </button>
                  </span>
                )}
                {dateToFilter && (
                  <span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800'>
                    Do: {new Date(dateToFilter).toLocaleDateString("sk-SK")}
                    <button
                      onClick={() => setDateToFilter("")}
                      className='ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200'
                    >
                      <XMarkIcon className='h-3 w-3' />
                    </button>
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {isLoading ? (
        <div className='flex justify-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className='flex items-center mb-4 justify-between'>
            <Link
              to='/contracts/new'
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors'
            >
              <PlusIcon className='h-4 w-4 mr-2' />
              Nová zmluva
            </Link>
            <CSVExport csvData={csvData} csvFilename={csvFilename} />
          </div>
          <ContractsTable
            contracts={filteredContracts}
            delete={true}
            onContractDeleted={handleContractDeleted}
          />
        </>
      )}
    </div>
  );
};

export default ContractListPage;

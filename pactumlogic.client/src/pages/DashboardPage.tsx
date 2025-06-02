import { useEffect, useState } from "react";
import { contractService } from "../services/contractService";
import { CSVExportUtil } from "../utils/csvExportUtil";
import ContractsTable from "../components/tables/ContractsTable";
import StatsGrid from "../components/dashboard/StatsGrid";
import {
  DocumentTextIcon,
  UserIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import CSVExport from "../components/common/CSVExport";
import LoadingSpinner from "../components/common/LoadingSpinner";
import type { ContractWithDetails } from "../models/Contract";

interface DashboardStats {
  contractCount: number;
  clientCount: number;
  advisorCount: number;
}

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>({
    contractCount: 0,
    clientCount: 0,
    advisorCount: 0,
  });
  const [recentContracts, setRecentContracts] = useState<ContractWithDetails[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [contracts, statsData] = await Promise.all([
          contractService.getRecentContracts(10),
          contractService.getStats(),
        ]);

        setRecentContracts(contracts);
        setStats(statsData);
      } catch (err) {
        setError("Chyba pri načítavaní dát");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare stats for StatsGrid component
  const statsData = [
    {
      label: "Celkový počet zmlúv",
      value: stats.contractCount,
      icon: <DocumentTextIcon className='h-8 w-8' />,
      link: "/contracts",
    },
    {
      label: "Klienti",
      value: stats.clientCount,
      icon: <UserIcon className='h-8 w-8' />,
      link: "/clients",
    },
    {
      label: "Poradcovia",
      value: stats.advisorCount,
      icon: <UsersIcon className='h-8 w-8' />,
      link: "/advisors",
    },
  ];

  // Generate CSV data
  const csvData = CSVExportUtil.exportContracts(recentContracts);
  const csvFilename = CSVExportUtil.generateFilename("zmluvy-export");

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h2 className='text-xl sm:text-2xl lg:text-3xl font-semibold'>Prehľad</h2>

      {/* Stats Grid */}
      <StatsGrid stats={statsData} />

      {/* Recent Contracts Section */}
      <div className='bg-white p-4 sm:p-6 rounded-lg lg:rounded-xl shadow'>
        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4'>
          <h4 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-0'>
            Posledné zmluvy
          </h4>
          {recentContracts.length > 0 && (
            <CSVExport csvData={csvData} csvFilename={csvFilename} />
          )}
        </div>

        <ContractsTable contracts={recentContracts} showActions={false} />
      </div>
    </div>
  );
};

export default DashboardPage;

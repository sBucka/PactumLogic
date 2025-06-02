import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { advisorService } from "../../services/advisorService";
import AdvisorsTable from "../../components/tables/AdvisorsTable";
import type { Advisor } from "../../models/Advisor";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { PlusIcon } from "@heroicons/react/24/outline";

const AdvisorListPage = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const advisorData = await advisorService.getAll();
      setAdvisors(advisorData);
    } catch (err) {
      setError("Chyba pri načítavaní dát");
      console.error("Error fetching advisors:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvisorDeleted = (advisorId: number) => {
    setAdvisors(prevAdvisors => 
      prevAdvisors.filter(advisor => advisor.id !== advisorId)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className='text-2xl font-bold'>Zoznam Klientov</h1>
        <Link
          to="/advisors/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Nový klient
        </Link>
      </div>

      {error && <div className='text-red-500 mb-4'>{error}</div>}
      {isLoading ? (
        <div className='flex justify-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <AdvisorsTable 
          advisors={advisors} 
          delete={true}
          onAdvisorDeleted={handleAdvisorDeleted}
        />
      )}
    </div>
  );
};

export default AdvisorListPage;
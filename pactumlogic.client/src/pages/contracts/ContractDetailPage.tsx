import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { contractService } from "../../services/contractService";
import type { ContractWithDetails } from "../../models/Contract";
import type { Client } from "../../models/Client";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  UserIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import CellDate from "../../components/tables/CellDate";

const ContractDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isContractActive = (contract: ContractWithDetails): boolean => {
    const validityDate = new Date(contract.validityDate);
    const currentDate = new Date();
    return validityDate > currentDate && !contract.terminationDate;
  };

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const contractData = await contractService.getById(parseInt(id));
        setContract(contractData);
      } catch (err) {
        setError("Chyba pri načítavaní zmluvy");
        console.error("Error fetching contract:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [id]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Načítavam zmluvu...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600'>{error || "Zmluva nebola nájdená"}</p>
        <button
          onClick={() => navigate("/contracts")}
          className='mt-4 text-teal-600 hover:text-teal-800'
        >
          Späť na zoznam zmlúv
        </button>
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-4'>
          <button
            onClick={() => navigate(-1)}
            className='p-2 rounded-md hover:bg-gray-100 transition-colors'
          >
            <ArrowLeftIcon className='h-5 w-5' />
          </button>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold text-gray-900'>
              Zmluva {contract.referenceNumber}
            </h1>
            <p className='text-gray-600 mt-1'>Detail zmluvy</p>
          </div>
        </div>
        {/* Edit Button */}
        <Link
          to={`/contracts/${contract.id}/edit`}
          className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors'
        >
          <PencilIcon className='h-4 w-4 mr-2' />
          Upraviť
        </Link>
      </div>

      {/* Rest of the component remains the same */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Basic Information */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <BuildingOfficeIcon className='h-5 w-5 mr-2 text-gray-600' />
            Základné informácie
          </h2>
          <div className='space-y-3'>
            <div>
              <span className='text-sm font-medium text-gray-500'>
                Evidenčné číslo:
              </span>
              <p className='text-gray-900'>{contract.referenceNumber}</p>
            </div>
            <div>
              <span className='text-sm font-medium text-gray-500'>
                Inštitúcia:
              </span>
              <p className='text-gray-900'>{contract.institution}</p>
            </div>
            <div>
              <span className='text-sm font-medium text-gray-500'>Status:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  isContractActive(contract)
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isContractActive(contract) ? "Aktívna" : "Neaktívna"}
              </span>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <CalendarIcon className='h-5 w-5 mr-2 text-gray-600' />
            Dátumy
          </h2>
          <div className='space-y-3'>
            <div>
              <span className='text-sm font-medium text-gray-500'>
                Dátum uzavretia:
              </span>
              <p className='text-gray-900'>
                <CellDate dateString={contract.contractDate} />
              </p>
            </div>
            <div>
              <span className='text-sm font-medium text-gray-500'>
                Dátum platnosti:
              </span>
              <p className='text-gray-900'>
                <CellDate dateString={contract.validityDate} />
              </p>
            </div>
            {contract.terminationDate && (
              <div>
                <span className='text-sm font-medium text-gray-500'>
                  Dátum ukončenia:
                </span>
                <p className='text-gray-900'>
                  <CellDate dateString={contract.terminationDate} />
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Client Information */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <UserIcon className='h-5 w-5 mr-2 text-gray-600' />
            Klient
          </h2>
          <Link
            to={`/clients/${contract.client.id}`}
            className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium text-gray-900'>
                  {contract.client.firstName} {contract.client.lastName}
                </h3>
                <p className='text-sm text-gray-500'>{contract.client.email}</p>
              </div>
              <ArrowLeftIcon className='h-4 w-4 text-gray-400 rotate-180' />
            </div>
          </Link>
        </div>

        {/* Administrator */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Správca zmluvy</h2>
          <Link
            to={`/clients/${contract.administrator.id}`}
            className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='font-medium text-gray-900'>
                  {contract.administrator.firstName}{" "}
                  {contract.administrator.lastName}
                </h3>
                <p className='text-sm text-gray-500'>
                  {contract.administrator.email}
                </p>
              </div>
              <ArrowLeftIcon className='h-4 w-4 text-gray-400 rotate-180' />
            </div>
          </Link>
        </div>
      </div>

      {/* Advisors */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4'>Poradcovia</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {contract.advisors.map((advisor: Client) => (
            <Link
              key={advisor.id}
              to={`/clients/${advisor.id}`}
              className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='font-medium text-gray-900'>
                    {advisor.firstName} {advisor.lastName}
                  </h3>
                  <p className='text-sm text-gray-500'>{advisor.email}</p>
                </div>
                <ArrowLeftIcon className='h-4 w-4 text-gray-400 rotate-180' />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractDetailPage;

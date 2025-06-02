import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  contractService,
  type ContractWithDetails,
} from "../../services/contractService";
import {
  ArrowLeftIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { formatDateUtil } from "../../utils/formatDateUtil";

const ContractDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [contract, setContract] = useState<ContractWithDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <span
          className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
            contract.terminationDate
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {contract.terminationDate ? "Ukončená" : "Aktívna"}
        </span>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        {/* Basic Information */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4 flex items-center'>
            <BuildingOfficeIcon className='h-5 w-5 mr-2 text-gray-600' />
            Základné informácie
          </h2>
          <div className='space-y-3'>
            <div>
              <label className='text-sm font-medium text-gray-500'>
                Evidenčné číslo
              </label>
              <p className='text-gray-900'>{contract.referenceNumber}</p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-500'>
                Inštitúcia
              </label>
              <p className='text-gray-900'>{contract.institution}</p>
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
              <label className='text-sm font-medium text-gray-500'>
                Dátum uzavretia
              </label>
              <p className='text-gray-900'>
                {formatDateUtil(contract.contractDate)}
              </p>
            </div>
            <div>
              <label className='text-sm font-medium text-gray-500'>
                Dátum platnosti
              </label>
              <p className='text-gray-900'>
                {formatDateUtil(contract.validityDate)}
              </p>
            </div>
            {contract.terminationDate && (
              <div>
                <label className='text-sm font-medium text-gray-500'>
                  Dátum ukončenia
                </label>
                <p className='text-gray-900'>
                  {formatDateUtil(contract.terminationDate)}
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
                <p className='font-medium text-gray-900'>
                  {contract.client.firstName} {contract.client.lastName}
                </p>
                <p className='text-sm text-gray-600'>{contract.client.email}</p>
              </div>
              <ArrowLeftIcon className='h-4 w-4 text-gray-400 rotate-180' />
            </div>
          </Link>
        </div>

        {/* Administrator */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <h2 className='text-lg font-semibold mb-4'>Správca zmluvy</h2>
          <Link
            to={`/advisors/${contract.administrator.id}`}
            className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
          >
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-medium text-gray-900'>
                  {contract.administrator.firstName}{" "}
                  {contract.administrator.lastName}
                </p>
                <p className='text-sm text-gray-600'>
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
        <h2 className='text-lg font-semibold mb-4'>Účastníci (Poradci)</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {contract.advisors.map((advisor) => (
            <Link
              key={advisor.id}
              to={`/advisors/${advisor.id}`}
              className='block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors'
            >
              <div className='flex items-center justify-between'>
                <div>
                  <p className='font-medium text-gray-900'>
                    {advisor.firstName} {advisor.lastName}
                  </p>
                  <p className='text-sm text-gray-600'>{advisor.email}</p>
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

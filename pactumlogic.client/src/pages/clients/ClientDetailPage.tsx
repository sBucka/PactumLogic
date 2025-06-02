import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { clientService } from "../../services/clientService";
import type { ClientWithAllContracts } from "../../models/Client";
import {
  ArrowLeftIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import RenderContractCard from "./RenderContractCard";

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [client, setClient] = useState<ClientWithAllContracts | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClient = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const clientData = await clientService.getById(parseInt(id));
        setClient(clientData);
      } catch (err) {
        setError("Chyba pri načítavaní klienta");
        console.error("Error fetching client:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [id]);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <LoadingSpinner />
          <p className='mt-4 text-gray-600'>Načítavam klienta...</p>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600'>{error || "Klient nebol nájdený"}</p>
        <button
          onClick={() => navigate("/clients")}
          className='mt-4 text-teal-600 hover:text-teal-800'
        >
          Späť na zoznam klientov
        </button>
      </div>
    );
  }

  // Filter contracts to avoid duplicates with priority: Client > Administrator > Advisor
  const clientContracts = client.clientContracts || [];
  const administratorContracts = (client.administratorContracts || []).filter(
    (contract) => !clientContracts.some((cc) => cc.id === contract.id)
  );
  const advisorContracts = (client.advisorContracts || []).filter(
    (contract) =>
      !clientContracts.some((cc) => cc.id === contract.id) &&
      !administratorContracts.some((ac) => ac.id === contract.id)
  );

  const totalContracts =
    clientContracts.length +
    administratorContracts.length +
    advisorContracts.length;

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
              {client.firstName} {client.lastName}
            </h1>
            <p className='text-gray-600 mt-1'>
              Detail klienta • Celkom {totalContracts} zmlúv
            </p>
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <h2 className='text-lg font-semibold mb-4 flex items-center'>
          <UserIcon className='h-5 w-5 mr-2 text-gray-600' />
          Informácie o klientovi
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          <div>
            <label className='text-sm font-medium text-gray-500'>
              Meno a priezvisko
            </label>
            <p className='text-gray-900'>
              {client.firstName} {client.lastName}
            </p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-500'>Email</label>
            <p className='text-gray-900 flex items-center'>
              <EnvelopeIcon className='h-4 w-4 mr-2 text-gray-400' />
              {client.email}
            </p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-500'>Telefón</label>
            <p className='text-gray-900 flex items-center'>
              <PhoneIcon className='h-4 w-4 mr-2 text-gray-400' />
              {client.phone}
            </p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-500'>
              Osobné číslo
            </label>
            <p className='text-gray-900'>{client.personalIdNumber}</p>
          </div>
          <div>
            <label className='text-sm font-medium text-gray-500'>Vek</label>
            <p className='text-gray-900'>{client.age} rokov</p>
          </div>
        </div>
      </div>

      {/* Contract Cards */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {/* Client Contracts */}
        <RenderContractCard
          title='Zmluvy ako klient'
          contracts={clientContracts}
          icon={<DocumentTextIcon className='h-5 w-5 mr-2 text-blue-600' />}
          emptyMessage='Žiadne zmluvy ako klient'
        />

        {/* Administrator Contracts */}
        <RenderContractCard
          title='Zmluvy ako správca'
          contracts={administratorContracts}
          icon={<ShieldCheckIcon className='h-5 w-5 mr-2 text-green-600' />}
          emptyMessage='Žiadne zmluvy ako správca'
        />

        {/* Advisor Contracts */}
        <RenderContractCard
          title='Zmluvy ako poradca'
          contracts={advisorContracts}
          icon={<UsersIcon className='h-5 w-5 mr-2 text-purple-600' />}
          emptyMessage='Žiadne zmluvy ako poradca'
        />
      </div>
    </div>
  );
};

export default ClientDetailPage;

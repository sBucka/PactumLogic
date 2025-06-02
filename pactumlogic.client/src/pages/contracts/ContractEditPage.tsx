import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { contractService } from "../../services/contractService";
import { clientService } from "../../services/clientService";
import { PlusIcon } from "@heroicons/react/24/outline";
import type {
  CreateContractRequest,
  ContractWithDetails,
} from "../../models/Contract";
import type { Client } from "../../models/Client";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import FormField from "../../components/forms/FormField";
import PageFormLayout from "../../components/layout/PageFormLayoutProps";
import { INSTITUTIONS } from "../../constants/institutions";

const ContractEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data loading states
  const [clients, setClients] = useState<Client[]>([]);
  const [advisors, setAdvisors] = useState<Client[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [contract, setContract] = useState<ContractWithDetails | null>(null);

  const [formData, setFormData] = useState<CreateContractRequest>({
    referenceNumber: "",
    institution: "",
    clientEmail: "",
    administratorEmail: "",
    advisorEmails: [],
    contractDate: "",
    validityDate: "",
    terminationDate: "",
  });

  // ...existing useEffect and handler functions remain the same...
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        setIsLoadingData(true);
        const [contractData, clientsData, advisorsData] = await Promise.all([
          contractService.getById(parseInt(id)),
          clientService.getAll(),
          clientService.getAllAdvisors(),
        ]);

        setContract(contractData);

        const clientsBasic = clientsData.map((client) => ({
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          personalIdNumber: client.personalIdNumber,
          age: client.age,
          type: client.type,
        }));

        setClients(clientsBasic);
        setAdvisors(advisorsData);

        setFormData({
          referenceNumber: contractData.referenceNumber,
          institution: contractData.institution,
          clientEmail: contractData.client.email,
          administratorEmail: contractData.administrator.email,
          advisorEmails: contractData.advisors.map((advisor) => advisor.email),
          contractDate: contractData.contractDate,
          validityDate: contractData.validityDate,
          terminationDate: contractData.terminationDate || "",
        });
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Chyba pri načítavaní dát");
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdvisorChange = (advisorEmail: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      advisorEmails: checked
        ? [...prev.advisorEmails, advisorEmail]
        : prev.advisorEmails.filter((email) => email !== advisorEmail),
    }));
  };

  const getPersonDisplayText = (person: Client) => {
    return `${person.firstName} ${person.lastName} (${person.email})`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setError(null);

    // Basic validation
    if (!formData.referenceNumber.trim()) {
      setError("Evidenčné číslo je povinné");
      return;
    }
    if (!formData.institution.trim()) {
      setError("Inštitúcia je povinná");
      return;
    }
    if (!formData.clientEmail.trim()) {
      setError("Klient je povinný");
      return;
    }
    if (!formData.administratorEmail.trim()) {
      setError("Správca je povinný");
      return;
    }
    if (!formData.contractDate) {
      setError("Dátum uzavretia je povinný");
      return;
    }
    if (!formData.validityDate) {
      setError("Dátum platnosti je povinný");
      return;
    }

    if (!formData.advisorEmails.includes(formData.administratorEmail)) {
      setFormData((prev) => ({
        ...prev,
        advisorEmails: [...prev.advisorEmails, prev.administratorEmail],
      }));
    }

    const contractDate = new Date(formData.contractDate);
    const validityDate = new Date(formData.validityDate);

    if (validityDate <= contractDate) {
      setError("Dátum platnosti musí byť neskôr ako dátum uzavretia");
      return;
    }

    try {
      setIsLoading(true);
      await contractService.update(parseInt(id), formData);
      navigate(`/contracts/${id}`);
    } catch {
      console.error("Error updating contract:");
      setError("Chyba pri aktualizácii zmluvy. Skúste to znova.");
    } finally {
      setIsLoading(false);
    }
  };

  const institutions = INSTITUTIONS;

  if (isLoadingData) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <LoadingSpinner />
          <p className='mt-4 text-gray-600'>Načítavam dáta...</p>
        </div>
      </div>
    );
  }

  if (error && !contract) {
    return (
      <div className='text-center py-8'>
        <p className='text-red-600'>{error}</p>
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
    <PageFormLayout
      title={`Upraviť zmluvu ${contract?.referenceNumber}`}
      subtitle='Upravte údaje zmluvy'
      backButton={true}
    >
      <div className='max-w-4xl mx-auto'>
        {/* Form */}
        <div className='bg-white p-6 rounded-lg shadow'>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {error && (
              <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm'>
                {error}
              </div>
            )}

            {/* Reference Number & Institution */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Evidenčné číslo'
                name='referenceNumber'
                type='text'
                value={formData.referenceNumber}
                onChange={handleInputChange}
                placeholder='Evidenčné číslo zmluvy'
                required
              />

              <FormField
                label='Inštitúcia'
                name='institution'
                type='select'
                options={institutions.map((inst) => ({
                  value: inst,
                  label: inst,
                }))}
                value={formData.institution}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Client Selection */}
            <div>
              <FormField
                label='Klient'
                name='clientEmail'
                type='select'
                options={clients.map((client) => ({
                  value: client.email,
                  label: getPersonDisplayText(client),
                }))}
                value={formData.clientEmail}
                onChange={handleInputChange}
                required
              />
              <Link
                to='/clients/new'
                className='inline-flex items-center text-sm text-teal-600 hover:text-teal-800'
              >
                <PlusIcon className='h-4 w-4 mr-1' />
                Pridať novú osobu
              </Link>
            </div>

            {/* Administrator Selection */}
            <div>
              <FormField
                label='Správca zmluvy '
                name='administratorEmail'
                type='select'
                options={clients.map((client) => ({
                  value: client.email,
                  label: getPersonDisplayText(client),
                }))}
                value={formData.administratorEmail}
                onChange={handleInputChange}
                required
              />{" "}
              <Link
                to='/clients/new'
                className='inline-flex items-center text-sm text-teal-600 hover:text-teal-800'
              >
                <PlusIcon className='h-4 w-4 mr-1' />
                Pridať novú osobu
              </Link>
            </div>

            {/* Additional Advisors */}
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-3'>
                Ďalší poradcovia (voliteľné)
              </label>
              <div className='space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3'>
                {advisors
                  .filter(
                    (advisor) => advisor.email !== formData.administratorEmail
                  )
                  .map((advisor) => (
                    <div key={advisor.id} className='flex items-center'>
                      <input
                        type='checkbox'
                        id={`advisor-${advisor.id}`}
                        checked={formData.advisorEmails.includes(advisor.email)}
                        onChange={(e) =>
                          handleAdvisorChange(advisor.email, e.target.checked)
                        }
                        className='h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded'
                      />
                      <label
                        htmlFor={`advisor-${advisor.id}`}
                        className='ml-2 text-sm text-gray-700 cursor-pointer'
                      >
                        {advisor.firstName} {advisor.lastName} ({advisor.email})
                      </label>
                    </div>
                  ))}
                {advisors.filter(
                  (advisor) => advisor.email !== formData.administratorEmail
                ).length === 0 && (
                  <p className='text-sm text-gray-500 italic'>
                    {formData.administratorEmail
                      ? "Žiadni ďalší poradcovia k dispozícii"
                      : "Najprv vyberte správcu zmluvy"}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <FormField
                label='Dátum uzavretia zmluvy'
                name='contractDate'
                type='date'
                value={formData.contractDate}
                onChange={handleInputChange}
                required
              />

              <FormField
                label='Dátum platnosti zmluvy'
                name='validityDate'
                type='date'
                value={formData.validityDate}
                onChange={handleInputChange}
                required
              />

              <FormField
                label='Dátum ukončenia zmluvy'
                name='terminationDate'
                type='date'
                value={formData.terminationDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Submit Buttons */}
            <div className='flex justify-end space-x-3 pt-4 border-t'>
              <button
                type='button'
                onClick={() => navigate(-1)}
                className='px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50'
                disabled={isLoading}
              >
                Zrušiť
              </button>
              <button
                type='submit'
                disabled={isLoading || isLoadingData}
                className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50'
              >
                {isLoading ? "Ukladám..." : "Uložiť zmeny"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageFormLayout>
  );
};

export default ContractEditPage;

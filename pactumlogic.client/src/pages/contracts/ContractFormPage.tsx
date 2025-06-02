import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { contractService } from "../../services/contractService";
import { clientService } from "../../services/clientService";
import { ArrowLeftIcon, PlusIcon } from "@heroicons/react/24/outline";
import type { CreateContractRequest } from "../../models/Contract";
import type { Client } from "../../models/Client";
import { ClientType } from "../../models/Client";
import FormField from "../../components/forms/FormField";
import { INSTITUTIONS } from "../../constants/institutions";
import { useFormValidation } from "../../hooks/useFormValidation";

const ContractFormPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Data loading states
  const [clients, setClients] = useState<Client[]>([]);
  const [advisors, setAdvisors] = useState<Client[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const initialData: CreateContractRequest = {
    referenceNumber: "",
    institution: "",
    clientEmail: "",
    administratorEmail: "",
    advisorEmails: [],
    contractDate: "",
    validityDate: "",
    terminationDate: "",
  };

  const validationRules = {
    referenceNumber: [
      { required: true },
      { minLength: 3, custom: (value: string) => value.length < 3 ? "Evidenčné číslo musí mať aspoň 3 znaky" : null }
    ],
    institution: [{ required: true }],
    clientEmail: [{ required: true }],
    administratorEmail: [{ required: true }],
    contractDate: [
      { required: true },
      { custom: (value: string) => !value ? "Dátum uzavretia je povinný" : null }
    ],
    validityDate: [
      { required: true },
      { custom: (value: string) => !value ? "Dátum platnosti je povinný" : null }
    ]
  };

  const { formData, errors, handleChange, validate, setFormData } = useFormValidation(
    initialData,
    validationRules
  );

  // Load clients and advisors on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingData(true);
        const [clientsData, advisorsData] = await Promise.all([
          clientService.getAll(),
          clientService.getAllAdvisors(),
        ]);

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
      } catch (err) {
        console.error("Error loading data:", err);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    handleChange(e);
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
    const typeText =
      person.type === ClientType.Both
        ? " (Klient & Poradca)"
        : person.type === ClientType.Client
        ? " (Klient)"
        : " (Poradca)";
    return `${person.firstName} ${person.lastName} (${person.email})${typeText}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Additional validation for dates
    const contractDate = new Date(formData.contractDate);
    const validityDate = new Date(formData.validityDate);

    if (validityDate <= contractDate) {
      setFormData(prev => ({ ...prev, validityDate: "" }));
      return;
    }

    // Ensure at least administrator is selected as advisor
    if (!formData.advisorEmails.includes(formData.administratorEmail)) {
      setFormData((prev) => ({
        ...prev,
        advisorEmails: [...prev.advisorEmails, prev.administratorEmail],
      }));
    }

    try {
      setIsLoading(true);
      const createdContract = await contractService.create(formData);
      navigate(`/contracts/${createdContract.id}`);
    } catch (err) {
      console.error("Error creating contract:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const institutions = INSTITUTIONS;

  if (isLoadingData) {
    return (
      <div className='flex items-center justify-center min-h-96'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto'></div>
          <p className='mt-4 text-gray-600'>Načítavam dáta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto space-y-6'>
      {/* Header */}
      <div className='flex items-center space-x-4'>
        <button
          onClick={() => navigate(-1)}
          className='p-2 rounded-md hover:bg-gray-100'
        >
          <ArrowLeftIcon className='h-5 w-5' />
        </button>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Nová zmluva</h1>
          <p className='text-gray-600'>Vytvorte novú zmluvu</p>
        </div>
      </div>

      {/* Form */}
      <div className='bg-white p-6 rounded-lg shadow'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Reference Number & Institution */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <FormField
              label='Evidenčné číslo'
              name='referenceNumber'
              value={formData.referenceNumber}
              onChange={handleInputChange}
              required
              type='text'
              placeholder='Zadajte evidenčné číslo zmluvy'
              error={errors.referenceNumber}
            />

            <FormField
              label='Inštitúcia'
              name='institution'
              value={formData.institution}
              onChange={handleInputChange}
              required
              type='select'
              options={institutions.map((inst) => ({
                value: inst,
                label: inst,
              }))}
              placeholder='Vyberte inštitúciu'
              error={errors.institution}
            />
          </div>

          {/* Client Selection */}
          <div>
            <FormField
              label='Klient'
              name='clientEmail'
              value={formData.clientEmail}
              onChange={handleInputChange}
              required
              type='select'
              options={clients.map((client) => ({
                value: client.email,
                label: getPersonDisplayText(client),
              }))}
              placeholder='Vyberte klienta'
              error={errors.clientEmail}
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
              label='Správca zmluvy'
              name='administratorEmail'
              value={formData.administratorEmail}
              onChange={handleInputChange}
              required
              type='select'
              options={advisors.map((advisor) => ({
                value: advisor.email,
                label: getPersonDisplayText(advisor),
              }))}
              placeholder='Vyberte správcu'
              error={errors.administratorEmail}
            />
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
              label='Dátum uzavretia'
              name='contractDate'
              type='date'
              value={formData.contractDate}
              onChange={handleInputChange}
              required
              error={errors.contractDate}
            />

            <FormField
              label='Dátum platnosti'
              name='validityDate'
              type='date'
              value={formData.validityDate}
              onChange={handleInputChange}
              required
              error={errors.validityDate}
            />

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Dátum ukončenia
              </label>
              <input
                type='date'
                name='terminationDate'
                value={formData.terminationDate}
                onChange={handleInputChange}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500'
              />
            </div>
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
              disabled={isLoading}
              className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50'
            >
              {isLoading ? "Vytváram..." : "Vytvoriť zmluvu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractFormPage;
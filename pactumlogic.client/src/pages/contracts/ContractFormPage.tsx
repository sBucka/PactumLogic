import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { contractService, type CreateContractRequest } from '../../services/contractService';
import { ArrowLeftIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

const ContractFormPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advisorEmails, setAdvisorEmails] = useState<string[]>(['']);

  const [formData, setFormData] = useState<CreateContractRequest>({
    referenceNumber: '',
    institution: '',
    clientEmail: '',
    administratorEmail: '',
    advisorEmails: [''],
    contractDate: '',
    validityDate: '',
    terminationDate: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAdvisorEmailChange = (index: number, value: string) => {
    const newEmails = [...advisorEmails];
    newEmails[index] = value;
    setAdvisorEmails(newEmails);
    setFormData(prev => ({
      ...prev,
      advisorEmails: newEmails.filter(email => email.trim() !== '')
    }));
  };

  const addAdvisorEmail = () => {
    setAdvisorEmails([...advisorEmails, '']);
  };

  const removeAdvisorEmail = (index: number) => {
    if (advisorEmails.length > 1) {
      const newEmails = advisorEmails.filter((_, i) => i !== index);
      setAdvisorEmails(newEmails);
      setFormData(prev => ({
        ...prev,
        advisorEmails: newEmails.filter(email => email.trim() !== '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.referenceNumber.trim()) {
      setError('Evidenčné číslo je povinné');
      return;
    }
    if (!formData.institution.trim()) {
      setError('Inštitúcia je povinná');
      return;
    }
    if (!formData.clientEmail.trim()) {
      setError('Email klienta je povinný');
      return;
    }
    if (!formData.administratorEmail.trim()) {
      setError('Email správcu je povinný');
      return;
    }
    if (!formData.contractDate) {
      setError('Dátum uzavretia je povinný');
      return;
    }
    if (!formData.validityDate) {
      setError('Dátum platnosti je povinný');
      return;
    }

    // Check if contract date is not in the future
    const contractDate = new Date(formData.contractDate);
    const validityDate = new Date(formData.validityDate);
    
    if (validityDate <= contractDate) {
      setError('Dátum platnosti musí byť neskôr ako dátum uzavretia');
      return;
    }

    try {
      setIsLoading(true);
      
      // Filter out empty advisor emails
      const filteredAdvisorEmails = advisorEmails.filter(email => email.trim() !== '');
      
      const contractData: CreateContractRequest = {
        ...formData,
        advisorEmails: filteredAdvisorEmails,
        terminationDate: formData.terminationDate || undefined
      };

      const createdContract = await contractService.create(contractData);
      
      // Redirect to contract detail page
      navigate(`/contracts/${createdContract.id}`);
    } catch (err: any) {
      console.error('Error creating contract:', err);
      setError(err.response?.data?.message || 'Chyba pri vytváraní zmluvy. Skúste to znova.');
    } finally {
      setIsLoading(false);
    }
  };

  const institutions = [
    'ČSOB',
    'AEGON',
    'AXA',
    'Allianz',
    'Generali',
    'MetLife',
    'Kooperativa',
    'Union',
    'Iná'
  ];

  const inputClasses = "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Nová zmluva
          </h1>
          <p className="text-gray-600 mt-1">Vytvorte novú zmluvu</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Základné informácie
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="referenceNumber" className={labelClasses}>
                  Evidenčné číslo *
                </label>
                <input
                  type="text"
                  id="referenceNumber"
                  name="referenceNumber"
                  value={formData.referenceNumber}
                  onChange={handleInputChange}
                  placeholder="napr. CSOB-2024-001"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="institution" className={labelClasses}>
                  Inštitúcia *
                </label>
                <select
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                >
                  <option value="">Vyberte inštitúciu</option>
                  {institutions.map((inst) => (
                    <option key={inst} value={inst}>
                      {inst}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Účastníci
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="clientEmail" className={labelClasses}>
                  Email klienta *
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  placeholder="klient@email.com"
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="administratorEmail" className={labelClasses}>
                  Email správcu *
                </label>
                <input
                  type="email"
                  id="administratorEmail"
                  name="administratorEmail"
                  value={formData.administratorEmail}
                  onChange={handleInputChange}
                  placeholder="spravca@email.com"
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            {/* Advisor Emails */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className={labelClasses}>
                  Dodatočné emaily účasníkov (poradcov)
                </label>
                <button
                  type="button"
                  onClick={addAdvisorEmail}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-100 hover:bg-teal-200 transition-colors"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Pridať
                </button>
              </div>
              <div className="space-y-2">
                {advisorEmails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleAdvisorEmailChange(index, e.target.value)}
                      placeholder={`klient${index + 1}@email.com`}
                      className={inputClasses}
                    />
                    {advisorEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeAdvisorEmail(index)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div>
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Dátumy
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="contractDate" className={labelClasses}>
                  Dátum uzavretia *
                </label>
                <input
                  type="date"
                  id="contractDate"
                  name="contractDate"
                  value={formData.contractDate}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="validityDate" className={labelClasses}>
                  Dátum platnosti *
                </label>
                <input
                  type="date"
                  id="validityDate"
                  name="validityDate"
                  value={formData.validityDate}
                  onChange={handleInputChange}
                  className={inputClasses}
                  required
                />
              </div>

              <div>
                <label htmlFor="terminationDate" className={labelClasses}>
                  Dátum ukončenia
                </label>
                <input
                  type="date"
                  id="terminationDate"
                  name="terminationDate"
                  value={formData.terminationDate}
                  onChange={handleInputChange}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
              disabled={isLoading}
            >
              Zrušiť
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Vytváram...' : 'Vytvoriť zmluvu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContractFormPage;
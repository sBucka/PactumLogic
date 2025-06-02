import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clientService } from "../../services/clientService";
import type { CreateClientRequest } from "../../models/Client";
import { ClientType } from "../../models/Client";
import FormField from "../../components/forms/FormField";
import PageFormLayout from "../../components/layout/PageFormLayoutProps";
import { CLIENT_TYPE_LABELS } from "../../constants/clientTypes";
import { useFormValidation } from "../../hooks/useFormValidation";

const ClientFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // Get default type from navigation state (for advisor creation)
  const defaultType = location.state?.defaultType || ClientType.Client;

  const initialData: CreateClientRequest = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    personalIdNumber: "",
    age: 0,
    type: defaultType,
  };

  const validationRules = {
    firstName: [
      { required: true, message: "Meno je povinné" },
      {
        minLength: 2,
        message: "Meno musí mať aspoň 2 znaky",
      },
    ],
    lastName: [
      { required: true, message: "Priezvisko je povinné" },
      {
        minLength: 2,
        message: "Priezvisko musí mať aspoň 2 znaky",
      },
    ],
    email: [
      { required: true, message: "Email je povinný" },
      {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Email má nesprávny formát",
      },
    ],
    phone: [
      { required: true, message: "Telefón je povinný" },
      {
        minLength: 9,
        message: "Telefón musí mať aspoň 9 znakov",
      },
    ],
    personalIdNumber: [
      { required: true, message: "Osobné číslo je povinné" },
      {
        minLength: 10,
        maxLength: 10,
        message: "Osobné číslo musí mať presne 10 znakov",
      },
    ],
    age: [
      { required: true, message: "Vek je povinný" },
      {
        custom: (value: number) =>
          value <= 0 || value > 120 ? "Vek musí byť medzi 1 a 120" : null,
      },
    ],
  };

  const { formData, errors, handleChange, validate, setFormData } =
    useFormValidation(initialData, validationRules);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle special cases for number and select inputs
    if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else if (name === "type") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) as ClientType,
      }));
    } else {
      handleChange(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsLoading(true);
      await clientService.create(formData);

      // Navigate back based on the created type
      if (formData.type === ClientType.Advisor) {
        navigate("/advisors");
      } else {
        navigate("/clients");
      }
    } catch (err: any) {
      // Handle server errors
      console.error("Error creating client:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPageTitle = () => {
    switch (formData.type) {
      case ClientType.Advisor:
        return "Nový poradca";
      case ClientType.Both:
        return "Nová osoba (klient & poradca)";
      default:
        return "Nový klient";
    }
  };

  const getButtonText = () => {
    switch (formData.type) {
      case ClientType.Advisor:
        return "Vytvoriť poradcu";
      case ClientType.Both:
        return "Vytvoriť osobu";
      default:
        return "Vytvoriť klienta";
    }
  };

  return (
    <PageFormLayout title={getPageTitle()} backButton={true}>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white p-6 rounded-lg shadow'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            {/* Type Selection */}
            <FormField
              label='Typ osoby'
              name='type'
              type='select'
              value={formData.type}
              onChange={handleInputChange}
              options={[
                {
                  value: ClientType.Client.toString(),
                  label: CLIENT_TYPE_LABELS[ClientType.Client],
                },
                {
                  value: ClientType.Advisor.toString(),
                  label: CLIENT_TYPE_LABELS[ClientType.Advisor],
                },
                {
                  value: ClientType.Both.toString(),
                  label: CLIENT_TYPE_LABELS[ClientType.Both],
                },
              ]}
              required
              error={errors.type}
            />

            {/* Name Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Meno'
                name='firstName'
                type='text'
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder='Meno'
                required
                error={errors.firstName}
              />
              <FormField
                label='Priezvisko'
                name='lastName'
                type='text'
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder='Priezvisko'
                required
                error={errors.lastName}
              />
            </div>

            {/* Contact Fields */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleInputChange}
                placeholder='osoba@email.com'
                required
                error={errors.email}
              />
              <FormField
                label='Telefón'
                name='phone'
                type='tel'
                value={formData.phone}
                onChange={handleInputChange}
                placeholder='+421 123 456 789'
                required
                error={errors.phone}
              />
            </div>

            {/* Personal Info */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <FormField
                label='Osobné číslo'
                name='personalIdNumber'
                type='text'
                value={formData.personalIdNumber}
                onChange={handleInputChange}
                placeholder='1234567890'
                required
                error={errors.personalIdNumber}
              />
              <FormField
                label='Vek'
                name='age'
                type='number'
                value={formData.age || ""}
                onChange={handleInputChange}
                placeholder='25'
                min={1}
                max={120}
                required
                error={errors.age}
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
                disabled={isLoading}
                className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50'
              >
                {isLoading ? "Vytváram..." : getButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageFormLayout>
  );
};

export default ClientFormPage;

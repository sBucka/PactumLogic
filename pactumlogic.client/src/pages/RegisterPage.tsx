import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PactumLogic from "../assets/PactumLogic.svg";

const RegisterPage = () => {
  const { register, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to='/' replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
        formData.confirmPassword
      );
    } catch (err) {
      setError(
        "Registrácia zlyhala. Skontrolujte svoje údaje a skúste to znova."
      );
      console.error("Registration error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const inputClasses =
    "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm";

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-lg w-full space-y-8 bg-teal-50 rounded-lg shadow-lg shadow-black/70 p-3 sm:p-4 lg:p-6'>
        {/* Logo */}
        <div className='text-center'>
          <img
            src={PactumLogic}
            alt='PactumLogic Logo'
            className='mx-auto h-16 sm:h-24 lg:h-28 w-auto'
          />
          <h2 className='mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900 hidden sm:block'>
            Registrácia do Pactum Logic
          </h2>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 sm:hidden'>
            Registrácia
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Zadajte svoje registračné údaje
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {error && (
            <div className='bg-red-100 text-red-700 p-4 rounded-md'>
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor='firstName'
              className='block text-sm font-medium text-gray-700'
            >
              Meno
            </label>
            <input
              type='text'
              name='firstName'
              id='firstName'
              placeholder='Vaše meno'
              required
              value={formData.firstName}
              onChange={handleChange}
              className={`${inputClasses} mb-4`}
            />
          </div>
          <div>
            <label
              htmlFor='lastName'
              className='block text-sm font-medium text-gray-700'
            >
              Priezvisko
            </label>
            <input
              type='text'
              name='lastName'
              id='lastName'
              placeholder='Vaše priezvisko'
              required
              value={formData.lastName}
              onChange={handleChange}
              className={`${inputClasses} mb-4`}
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='vas@email.com'
              required
              value={formData.email}
              onChange={handleChange}
              className={`${inputClasses} mb-4`}
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium text-gray-700'
            >
              Heslo
            </label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Zadajte vaše heslo'
              required
              value={formData.password}
              onChange={handleChange}
              className={`${inputClasses} mb-4`}
            />
          </div>
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium text-gray-700'
            >
              Potvrďte heslo
            </label>
            <input
              type='password'
              name='confirmPassword'
              id='confirmPassword'
              placeholder='Potvrďte vaše heslo'
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`${inputClasses} mb-4`}
            />
          </div>
          <div>
            <button
              type='submit'
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Registrujem..." : "Registrovať sa"}
            </button>
          </div>
        </form>
        <div className='text-center mt-4'>
          <p className='text-sm text-gray-600'>
            Už máte účet?{" "}
            <a
              href='/login'
              className='text-teal-600 hover:text-teal-500 font-medium'
            >
              Prihlásiť sa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;

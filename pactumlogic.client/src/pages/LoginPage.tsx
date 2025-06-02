import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import PactumLogic from "../assets/PactumLogic.svg";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      await login(formData.email, formData.password);
    } catch (err) {
      setError(
        "Prihlásenie zlyhalo. Skontrolujte svoje údaje a skúste to znova."
      );
      console.error("Login error:", err);
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
            Prihlásenie do Pactum Logic
          </h2>
          <h2 className='mt-6 text-3xl font-extrabold text-gray-900 sm:hidden'>
            Prihlásenie
          </h2>
          <p className='mt-2 text-sm text-gray-600'>
            Zadajte svoje prihlasovacie údaje
          </p>
        </div>

        {/* Form */}
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          {error && (
            <div className='bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm'>
              {error}
            </div>
          )}

          <div className='space-y-4'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Email
              </label>
              <input
                id='email'
                name='email'
                type='email'
                required
                className='appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:z-10 sm:text-sm transition-colors'
                placeholder='vas@email.com'
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Heslo
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                className='appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 focus:z-10 sm:text-sm transition-colors'
                placeholder='Vaše heslo'
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type='submit'
              disabled={isLoading}
              className='group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isLoading ? (
                <div className='h-6 w-full flex items-center justify-center relative'>
                  <span className='absolute left-50 inset-y-0 flex items-center pl-3 -translate-x-1/2'>
                    Prihlasovanie...
                  </span>
                  <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-teal-100 mx-auto absolute right-20'></div>
                </div>
              ) : (
                "Prihlásiť sa"
              )}
            </button>
          </div>
        </form>
        <div className='text-center mt-4'>
          <p className='text-sm text-gray-600'>
            Nemáte účet?{" "}
            <a
              href='/register'
              className='text-teal-600 hover:text-teal-500 font-medium'
            >
              Zaregistrujte sa
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

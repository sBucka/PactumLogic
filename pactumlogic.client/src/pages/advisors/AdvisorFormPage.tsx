import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClientType } from '../../models/Client';

const AdvisorFormPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to client form page with advisor default type
    navigate('/clients/new', { 
      replace: true, 
      state: { defaultType: ClientType.Advisor } 
    });
  }, [navigate]);

  return null; // This component just redirects
};

export default AdvisorFormPage;
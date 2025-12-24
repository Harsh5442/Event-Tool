import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AzureAdCallback: React.FC = () => {
  const navigate = useNavigate();
  const { exchangeAzureAdToken } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');

        if (!token) {
          console.error('No token received from Azure AD');
          navigate('/login');
          return;
        }

        await exchangeAzureAdToken(token);
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate('/home');
      } catch (error) {
        console.error('Azure AD callback error:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [exchangeAzureAdToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 to-accent-500">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mx-auto mb-4"></div>
        <h1 className="text-2xl font-bold text-white">Authenticating...</h1>
        <p className="text-white/80 mt-2">Please wait while we complete your login.</p>
      </div>
    </div>
  );
};

export default AzureAdCallback;
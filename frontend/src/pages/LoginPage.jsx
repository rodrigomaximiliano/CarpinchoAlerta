import React from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();

  const handleSuccess = () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }
    navigate('/dashboard');
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center text-primary mb-4">Iniciar Sesión</h1>
        <p className="text-center text-muted mb-4">
          Accede a tu cuenta para gestionar tus datos y alertas.
        </p>
        <LoginForm onLoginSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default LoginPage;
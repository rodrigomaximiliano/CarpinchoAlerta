import React from 'react';
import RegisterForm from '../components/RegisterForm';

function RegisterPage() {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h1 className="text-center text-success mb-4">Crear Cuenta</h1>
        <p className="text-center text-muted mb-4">
          Regístrate para acceder a todas las funcionalidades del sistema.
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}

export default RegisterPage;
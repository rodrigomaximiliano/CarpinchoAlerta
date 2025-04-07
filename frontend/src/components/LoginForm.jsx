import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap'; // Importar componentes de react-bootstrap
import { login } from '../api/authService';

function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await login(email, password);
      console.log('Login exitoso:', data);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al iniciar sesión. Verifica tus credenciales.');
      console.error("Error en handleSubmit login:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Usar el componente Form de react-bootstrap
    <Form onSubmit={handleSubmit}>
      {/* Campo Email */}
      <Form.Group className="mb-3" controlId="login-email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading} // Deshabilitar mientras carga
        />
      </Form.Group>

      {/* Campo Contraseña */}
      <Form.Group className="mb-3" controlId="login-password">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading} // Deshabilitar mientras carga
        />
      </Form.Group>

      {/* Mensaje de Error */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* Botón de Envío */}
      <div className="d-grid"> {/* Para que el botón ocupe todo el ancho */}
        <Button variant="primary" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Iniciando...
            </>
          ) : (
            'Iniciar Sesión'
          )}
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;
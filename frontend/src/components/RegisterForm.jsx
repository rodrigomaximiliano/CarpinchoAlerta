import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap'; // Importar componentes de react-bootstrap
import { register } from '../api/authService';

function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const userData = {
      email: email,
      password: password,
      full_name: fullName
    };

    try {
      const data = await register(userData);
      console.log('Registro exitoso:', data);
      setSuccess('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
      setEmail('');
      setPassword('');
      setFullName('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al registrar el usuario. Intenta de nuevo.');
      console.error("Error en handleSubmit register:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Usar el componente Form de react-bootstrap
    <Form onSubmit={handleSubmit}>
      {/* Campo Nombre Completo */}
      <Form.Group className="mb-3" controlId="register-fullname">
        <Form.Label>Nombre Completo</Form.Label>
        <Form.Control
          type="text"
          placeholder="Ingresa tu nombre completo"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          disabled={loading}
        />
      </Form.Group>

      {/* Campo Email */}
      <Form.Group className="mb-3" controlId="register-email">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Ingresa tu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </Form.Group>

      {/* Campo Contraseña */}
      <Form.Group className="mb-3" controlId="register-password">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </Form.Group>

      {/* Mensaje de Error */}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

      {/* Mensaje de Éxito */}
      {success && <Alert variant="success" className="mt-3">{success}</Alert>}

      {/* Botón de Envío */}
      <div className="d-grid">
        <Button variant="success" type="submit" disabled={loading}>
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
              Registrando...
            </>
          ) : (
            'Registrar'
          )}
        </Button>
      </div>
    </Form>
  );
}

export default RegisterForm;
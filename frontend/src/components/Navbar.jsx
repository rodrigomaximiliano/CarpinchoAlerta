import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap'; // Importar componentes de react-bootstrap
import { logout } from '../api/authService';

// Recibe isAuthenticated y onLogout como props desde App
function AppNavbar({ isAuthenticated, onLogout }) { // Renombrado para evitar conflicto con Navbar de react-bootstrap
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    // Usar el componente Navbar de react-bootstrap
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-md">
      <Container>
        {/* Brand/Logo */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          Guardián del Iberá
        </Navbar.Brand>

        {/* Toggle button para pantallas pequeñas */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {/* Contenido colapsable del Navbar */}
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center"> {/* ms-auto para alinear a la derecha */}
            {/* Enlace Inicio siempre visible */}
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>

            {/* Enlaces condicionales según autenticación */}
            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
                {/* Botón Cerrar Sesión */}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleLogoutClick}
                  className="ms-lg-2 mt-2 mt-lg-0" // Margen izquierdo en pantallas grandes, margen superior en pequeñas
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                {/* Enlace Iniciar Sesión */}
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                {/* Botón Registrarse */}
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  to="/register"
                  className="ms-lg-2 mt-2 mt-lg-0" // Margen izquierdo en pantallas grandes, margen superior en pequeñas
                >
                  Registrarse
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar; // Exportar el componente renombrado
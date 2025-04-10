import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { logout } from '../api/authService';

// Ruta del logo desde la carpeta public
const logoPath = "/carpinchex.png";

function AppNavbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    if (onLogout) {
      onLogout();
    }
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm py-3">
      <Container>
        {/* Logo alineado a la izquierda */}
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-3">
          <img
            src={logoPath}
            alt="Logo"
            height="50"
            className="d-inline-block rounded-circle"
            style={{ objectFit: 'cover' }}
          />
          <span className="fw-bold text-uppercase" style={{ fontSize: '1.4rem', letterSpacing: '0.05rem' }}>
            Guardián de Corrientes
          </span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center gap-4">
            <Nav.Link as={Link} to="/" className="text-light fw-semibold fs-6">
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/awareness" className="text-light fw-semibold fs-6">
              Prevención
            </Nav.Link>

            {isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/dashboard" className="text-light fw-semibold fs-6">
                  Dashboard
                </Nav.Link>
                {/* Añadir enlace para reportar */}
                <Nav.Link as={Link} to="/report" className="text-light fw-semibold fs-6">
                  Reportar Foco
                </Nav.Link>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogoutClick}
                  className="fw-semibold px-3"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-light fw-semibold fs-6">
                  Iniciar Sesión
                </Nav.Link>
                <Button
                  variant="primary"
                  size="sm"
                  as={Link}
                  to="/register"
                  className="fw-semibold px-3"
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

export default AppNavbar;

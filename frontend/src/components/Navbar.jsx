import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { logout } from '../api/authService';
import { FaShieldAlt, FaHome, FaFire, FaBuilding, FaChartBar, FaSignInAlt, FaUserPlus, FaSignOutAlt, FaClipboardList } from 'react-icons/fa';

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
      <Container className="px-3">
        {/* Logo y nombre con icono y gradiente */}
        <div className="d-flex align-items-center flex-grow-1" style={{ minWidth: 0 }}>
          <Navbar.Brand
            as={Link}
            to="/"
            className="d-flex align-items-center gap-2 gap-md-3 me-4"
            style={{ minWidth: 0 }}
          >
            <img
              src={logoPath}
              alt="Logo"
              height="56"
              width="56"
              className="d-inline-block rounded-circle border-3"
              style={{
                objectFit: 'cover',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(25,135,84,0.10), 0 1px 4px rgba(0,0,0,0.10)',
                borderColor: '#198754',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,135,84,0.18), 0 2px 8px rgba(0,0,0,0.12)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(25,135,84,0.10), 0 1px 4px rgba(0,0,0,0.10)';
              }}
            />
            <span
              className="fw-bold d-flex align-items-center"
              style={{
                fontSize: '1.5rem',
                letterSpacing: '0.05rem',
                background: 'linear-gradient(90deg, #198754 40%, #ffc107 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '1px 1px 8px rgba(25,135,84,0.10), 0 2px 8px rgba(0,0,0,0.08)',
                whiteSpace: 'nowrap'
              }}
            >
              <FaShieldAlt className="me-2" style={{ filter: 'drop-shadow(0 1px 2px #19875444)' }} />
              Carpincho Alerta
            </span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="ms-auto" />
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <Nav.Link
                as={Link}
                to="/"
                className="fw-semibold fs-6 nav-link-custom d-flex align-items-center gap-1"
                style={{ color: '#f8f9fa' }}
              >
                <FaHome /> Inicio
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/awareness"
                className="fw-semibold fs-6 nav-link-custom d-flex align-items-center gap-1"
                style={{ color: '#f8f9fa' }}
              >
                <FaFire /> Prevención
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/fire-stations"
                className="fw-semibold fs-6 nav-link-custom d-flex align-items-center gap-1"
                style={{ color: '#f8f9fa' }}
              >
                <FaBuilding /> Cuarteles
              </Nav.Link>
              {isAuthenticated && (
                <>
                  <Nav.Link
                    as={Link}
                    to="/dashboard"
                    className="fw-semibold fs-6 nav-link-custom d-flex align-items-center gap-1"
                    style={{ color: '#f8f9fa' }}
                  >
                    <FaChartBar /> Dashboard
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/report"
                    className="fw-semibold fs-6 nav-link-custom d-flex align-items-center gap-1"
                    style={{ color: '#f8f9fa' }}
                  >
                    <FaClipboardList /> Reportar Foco
                  </Nav.Link>
                </>
              )}
            </div>
            {/* Separador visual entre navegación y acciones de usuario */}
            <span className="vr mx-3 d-none d-lg-inline" style={{ opacity: 0.15, height: 32 }} />
            <div className="d-flex align-items-center gap-2">
              {isAuthenticated ? (
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={handleLogoutClick}
                  className="fw-semibold px-3 d-flex align-items-center gap-1"
                >
                  <FaSignOutAlt /> Cerrar Sesión
                </Button>
              ) : (
                <>
                  <Button
                    variant="primary"
                    size="sm"
                    as={Link}
                    to="/login"
                    className="fw-semibold px-3 d-flex align-items-center gap-1"
                    style={{ minWidth: 110 }}
                  >
                    <FaSignInAlt /> Iniciar Sesión
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    as={Link}
                    to="/register"
                    className="fw-semibold px-3 ms-2 d-flex align-items-center gap-1"
                    style={{ minWidth: 110 }}
                  >
                    <FaUserPlus /> Registrarse
                  </Button>
                </>
              )}
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
      {/* Estilos para efecto hover en los links */}
      <style>
        {`
          .nav-link-custom:hover, .nav-link-custom.active {
            color: #ffc107 !important;
            text-decoration: underline;
            transition: color 0.2s;
          }
        `}
      </style>
    </Navbar>
  );
}

export default AppNavbar;

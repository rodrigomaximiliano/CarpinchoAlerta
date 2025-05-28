import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaShieldAlt, FaEnvelopeOpenText, FaGithub, FaLinkedin } from 'react-icons/fa';

function Footer() {
  return (
    <footer
      className="bg-dark text-light py-4 mt-auto"
      style={{
        borderTop: '3px solid #198754',
        boxShadow: '0 -2px 16px 0 rgba(25,135,84,0.10)',
        fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', Arial, sans-serif"
      }}
    >
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="mb-2 mb-md-0 d-flex align-items-center gap-2">
            <span
              className="d-flex align-items-center gap-2"
              style={{
                fontSize: 20,
                fontWeight: 600,
                background: 'linear-gradient(90deg, #198754 40%, #ffc107 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '1px 1px 8px rgba(25,135,84,0.10)'
              }}
            >
              <FaShieldAlt className="mb-1" size={22} />
              Carpincho Alerta
            </span>
            <span className="ms-2 text-secondary" style={{ fontSize: 14 }}>
              &copy; {new Date().getFullYear()} - Todos los derechos reservados.
            </span>
          </Col>
          <Col md={6} className="text-md-end d-flex justify-content-md-end align-items-center gap-3">
            <a
              href="mailto:contacto@guardiandelibera.org"
              className="text-light text-decoration-none fw-semibold d-flex align-items-center gap-2"
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                background: 'rgba(25,135,84,0.13)',
                transition: 'background 0.18s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#19875422'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(25,135,84,0.13)'; }}
            >
              <FaEnvelopeOpenText size={18} className="mb-1 text-success" />
              <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: 15 }}>
                contacto@guardiandelibera.org
              </span>
            </a>
            <span className="mx-2 d-none d-md-inline text-secondary">|</span>
            <a
              href="https://github.com/tu-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light text-decoration-none d-flex align-items-center gap-2"
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                background: 'rgba(25,135,84,0.13)',
                transition: 'background 0.18s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#19875422'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(25,135,84,0.13)'; }}
            >
              <FaGithub size={18} className="mb-1" /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/tu-linkedin"
              target="_blank"
              rel="noopener noreferrer"
              className="text-light text-decoration-none d-flex align-items-center gap-2"
              style={{
                padding: '6px 14px',
                borderRadius: 6,
                background: 'rgba(25,135,84,0.13)',
                transition: 'background 0.18s'
              }}
              onMouseOver={e => { e.currentTarget.style.background = '#19875422'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(25,135,84,0.13)'; }}
            >
              <FaLinkedin size={18} className="mb-1 text-info" /> LinkedIn
            </a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <span className="text-secondary" style={{ fontSize: 13 }}>
              Plataforma para la prevención y monitoreo de incendios en Corrientes, Argentina.
            </span>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;

import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaShieldAlt, FaFireAlt, FaBookOpen, FaPhoneAlt } from 'react-icons/fa'; // Iconos profesionales

function HomePage({ isAuthenticated }) {
  return (
    <Container className="my-5">
      {/* Encabezado principal profesional */}
      <Row className="mb-4">
        <Col className="text-center">
          <div className="d-flex flex-column align-items-center">
            <FaShieldAlt size={48} className="mb-2 text-success" />
            <h1
              className="display-4 fw-bold mb-1"
              style={{
                letterSpacing: '0.02em',
                fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', Arial, sans-serif",
                background: 'linear-gradient(90deg, #198754 40%, #ffc107 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '1px 1px 8px rgba(25,135,84,0.10), 0 2px 8px rgba(0,0,0,0.08)'
              }}
            >
              Carpincho Alerta
            </h1>
            <div
              className="mb-2"
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "#495057",
                fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', Arial, sans-serif"
              }}
            >
              Protección y respuesta ante incendios en Corrientes
            </div>
            <h2
              className="h5 fw-normal text-secondary mb-3"
              style={{
                maxWidth: 600,
                fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', Arial, sans-serif"
              }}
            >
              Plataforma avanzada para la prevención, monitoreo y gestión de incendios en Corrientes, Argentina.
            </h2>
            <div className="mb-2" style={{ height: 3, width: 80, background: 'linear-gradient(90deg, #198754 40%, #ffc107 100%)', borderRadius: 2 }} />
          </div>
        </Col>
      </Row>

      {/* Acciones principales */}
      <Row className="mb-4 g-4">
        <Col md={4}>
          <Card
            className="h-100 custom-home-card"
            style={{
              border: '2.5px solid #198754',
              boxShadow: '0 4px 24px 0 rgba(25,135,84,0.18), 0 2px 12px rgba(0,0,0,0.10)',
              borderRadius: 22,
              background: '#f8fafb',
              transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.035)';
              e.currentTarget.style.boxShadow = '0 12px 36px 0 rgba(25,135,84,0.28), 0 4px 16px rgba(0,0,0,0.14)';
              e.currentTarget.style.borderColor = '#145c32';
              e.currentTarget.style.background = '#e8fbe9';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(25,135,84,0.18), 0 2px 12px rgba(0,0,0,0.10)';
              e.currentTarget.style.borderColor = '#198754';
              e.currentTarget.style.background = '#f8fafb';
            }}
          >
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#e6f4ea',
                  boxShadow: '0 4px 16px rgba(25,135,84,0.13)'
                }}
              >
                <FaFireAlt size={32} style={{ color: '#198754' }} />
              </div>
              <Card.Title className="fw-semibold mb-2 fs-5">Reportar Incendio</Card.Title>
              <Card.Text className="mb-3" style={{ minHeight: 60 }}>
                Si observaste un foco de incendio, notifícalo de manera segura y rápida. Tu reporte es fundamental para la respuesta temprana.
              </Card.Text>
              <Button
                as={Link}
                to={isAuthenticated ? "/report" : "/login"}
                variant="outline-success"
                className="w-100 fw-semibold custom-home-btn"
                style={{
                  borderRadius: 8,
                  color: "#198754",
                  borderColor: "#198754",
                  background: "#f8fafb",
                  boxShadow: '0 2px 8px rgba(25,135,84,0.10)',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#198754";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,135,84,0.18)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "#f8fafb";
                  e.currentTarget.style.color = "#198754";
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(25,135,84,0.10)';
                }}
              >
                {isAuthenticated ? "Reportar Incendio" : "Iniciar Sesión para Reportar"}
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="h-100 custom-home-card"
            style={{
              border: '2.5px solid #198754',
              boxShadow: '0 4px 24px 0 rgba(25,135,84,0.18), 0 2px 12px rgba(0,0,0,0.10)',
              borderRadius: 22,
              background: '#f8fafb',
              transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.035)';
              e.currentTarget.style.boxShadow = '0 12px 36px 0 rgba(25,135,84,0.28), 0 4px 16px rgba(0,0,0,0.14)';
              e.currentTarget.style.borderColor = '#145c32';
              e.currentTarget.style.background = '#e8fbe9';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(25,135,84,0.18), 0 2px 12px rgba(0,0,0,0.10)';
              e.currentTarget.style.borderColor = '#198754';
              e.currentTarget.style.background = '#f8fafb';
            }}
          >
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#e6f4ea',
                  boxShadow: '0 4px 16px rgba(25,135,84,0.13)'
                }}
              >
                <FaBookOpen size={32} style={{ color: '#198754' }} />
              </div>
              <Card.Title className="fw-semibold mb-2 fs-5">Prevención y Protocolos</Card.Title>
              <Card.Text className="mb-3" style={{ minHeight: 60 }}>
                Información actualizada sobre prevención de incendios y procedimientos recomendados ante emergencias.
              </Card.Text>
              <Button
                as={Link}
                to="/awareness"
                variant="outline-success"
                className="w-100 fw-semibold custom-home-btn"
                style={{
                  borderRadius: 8,
                  color: "#198754",
                  borderColor: "#198754",
                  background: "#f8fafb",
                  boxShadow: '0 2px 8px rgba(25,135,84,0.10)',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#198754";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,135,84,0.18)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "#f8fafb";
                  e.currentTarget.style.color = "#198754";
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(25,135,84,0.10)';
                }}
              >
                Ver Información
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="h-100 custom-home-card"
            style={{
              border: '2.5px solid #198754',
              boxShadow: '0 4px 24px 0 rgba(25,135,84,0.18), 0 2px 12px rgba(0,0,0,0.10)',
              borderRadius: 22,
              background: '#f8fafb',
              transition: 'transform 0.18s, box-shadow 0.18s, border-color 0.18s, background 0.18s',
            }}
            onMouseOver={e => {
              e.currentTarget.style.transform = 'translateY(-6px) scale(1.035)';
              e.currentTarget.style.boxShadow = '0 12px 36px 0 rgba(25,135,84,0.28), 0 4px 16px rgba(0,0,0,0.14)';
              e.currentTarget.style.borderColor = '#145c32';
              e.currentTarget.style.background = '#e8fbe9';
            }}
            onMouseOut={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 24px 0 rgba(25,135,84,0.18), 0 2px 12px rgba(0,0,0,0.10)';
              e.currentTarget.style.borderColor = '#198754';
              e.currentTarget.style.background = '#f8fafb';
            }}
          >
            <Card.Body className="d-flex flex-column align-items-center text-center">
              <div
                className="mb-3 d-flex align-items-center justify-content-center"
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: '#e6f4ea',
                  boxShadow: '0 4px 16px rgba(25,135,84,0.13)'
                }}
              >
                <FaPhoneAlt size={28} style={{ color: '#198754' }} />
              </div>
              <Card.Title className="fw-semibold mb-2 fs-5">Contactos de Emergencia</Card.Title>
              <Card.Text className="mb-3" style={{ minHeight: 60 }}>
                Accede a los contactos de cuarteles de bomberos y organismos de respuesta en tu zona.
              </Card.Text>
              <Button
                as={Link}
                to="/fire-stations"
                variant="outline-success"
                className="w-100 fw-semibold custom-home-btn"
                style={{
                  borderRadius: 8,
                  color: "#198754",
                  borderColor: "#198754",
                  background: "#f8fafb",
                  boxShadow: '0 2px 8px rgba(25,135,84,0.10)',
                  transition: 'background 0.18s, color 0.18s, box-shadow 0.18s'
                }}
                onMouseOver={e => {
                  e.currentTarget.style.background = "#198754";
                  e.currentTarget.style.color = "#fff";
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(25,135,84,0.18)';
                }}
                onMouseOut={e => {
                  e.currentTarget.style.background = "#f8fafb";
                  e.currentTarget.style.color = "#198754";
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(25,135,84,0.10)';
                }}
              >
                Ver Contactos
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estadísticas rápidas y enlaces */}
      <Row className="mb-4 g-4">
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-semibold mb-2">
                Focos de calor recientes <Badge bg="danger">Satélite</Badge>
              </Card.Title>
              <Card.Text>
                Consulta los focos de calor activos detectados en Corrientes.
              </Card.Text>
              <Button as={Link} to="/dashboard" variant="outline-secondary" className="w-100">
                Ver Detalles
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <Card.Title className="fw-semibold mb-2">
                Análisis ambiental <Badge bg="success">NDVI</Badge>
              </Card.Title>
              <Card.Text>
                Visualiza la evolución de la vegetación y el historial de incendios.
              </Card.Text>
              <Button as={Link} to="/dashboard" variant="outline-success" className="w-100">
                Ver Análisis
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Sección institucional y contacto */}
      <Row className="mt-5">
        <Col>
          <Card className="border-0 bg-white shadow-sm">
            <Card.Body>
              <h5 className="fw-bold mb-2">Sobre Carpincho Alerta</h5>
              <p className="mb-1">
                Carpincho alerta es una plataforma colaborativa orientada a la protección de los ecosistemas de Corrientes, facilitando la detección temprana y la gestión eficiente de incendios.
              </p>
              <p className="mb-0">
                <span className="fw-semibold">¿Consultas o sugerencias?</span>
                <a href="mailto:contacto@guardiandelibera.org" className="ms-2 text-primary">Contáctanos</a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
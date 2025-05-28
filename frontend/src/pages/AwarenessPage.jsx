import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaShieldAlt, FaFireAlt, FaBookOpen, FaPhoneAlt } from 'react-icons/fa';

function AwarenessPage() {
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
              Prevención de Incendios
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
              Consejos y recursos para la prevención y gestión de incendios en Corrientes.
            </div>
            <h2
              className="h5 fw-normal text-secondary mb-3"
              style={{
                maxWidth: 600,
                fontFamily: "'Montserrat', 'Segoe UI', 'Roboto', Arial, sans-serif"
              }}
            >
              Aprende cómo proteger los Esteros del Iberá y tu comunidad.
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
              <Card.Title className="fw-semibold mb-2 fs-5">Evita Quemas</Card.Title>
              <Card.Text className="mb-3" style={{ minHeight: 60 }}>
                No realices quemas de basura o pastizales, especialmente en épocas de sequía. Las quemas descontroladas son una de las principales causas de incendios.
              </Card.Text>
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
              <Card.Title className="fw-semibold mb-2 fs-5">Reporta Focos</Card.Title>
              <Card.Text className="mb-3" style={{ minHeight: 60 }}>
                Si ves humo o llamas, repórtalo de inmediato a las autoridades o utiliza nuestra plataforma para alertar sobre posibles incendios.
              </Card.Text>
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
              <Card.Title className="fw-semibold mb-2 fs-5">Protege la Naturaleza</Card.Title>
              <Card.Text className="mb-3" style={{ minHeight: 60 }}>
                No arrojes colillas de cigarrillos ni vidrios en áreas naturales. Estos pueden iniciar incendios bajo el sol.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recursos adicionales */}
      <div className="text-center mt-5">
        <h2 className="h4 fw-bold" style={{ color: '#198754' }}>Recursos Adicionales</h2>
        <p className="text-secondary">
          Consulta guías y materiales educativos sobre la prevención de incendios.
        </p>
        <Button
          as="a"
          href="https://www.argentina.gob.ar/ambiente/incendios"
          target="_blank"
          rel="noopener noreferrer"
          variant="outline-success"
          className="fw-semibold"
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
          Más Información
        </Button>
      </div>
    </Container>
  );
}

export default AwarenessPage;

import React from 'react';
import FirmsFireList from '../components/FirmsFireList';
import AlertList from '../components/AlertList';
import GeeDataDisplay from '../components/GeeDataDisplay';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';

function DashboardPage() {
  return (
    <div className="bg-light py-5 min-vh-100">
      <Container>
        {/* Encabezado principal */}
        <div className="text-center mb-5">
          <h1 className="fw-bold text-primary mb-2" style={{ letterSpacing: '0.03em' }}>
            <i className="bi bi-bar-chart-line-fill me-2"></i>
            Dashboard Satelital
          </h1>
          <p className="lead text-muted mb-0">
            Visualiza focos de calor activos, alertas y análisis históricos de incendios y vegetación en Corrientes.
          </p>
        </div>

        <Row className="g-4">
          {/* Focos Activos */}
          <Col md={6}>
            <Card className="shadow-sm h-100 border-0">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-fire text-danger fs-2 me-2"></i>
                  <div>
                    <Card.Title className="mb-0 fw-bold">Focos de Calor Activos</Card.Title>
                    <Badge bg="danger" className="ms-2">Satélite</Badge>
                  </div>
                </div>
                <FirmsFireList />
              </Card.Body>
            </Card>
          </Col>

          {/* Alertas */}
          <Col md={6}>
            <Card className="shadow-sm h-100 border-0">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-exclamation-triangle-fill text-warning fs-2 me-2"></i>
                  <div>
                    <Card.Title className="mb-0 fw-bold">Alertas del Sistema</Card.Title>
                    <Badge bg="warning" text="dark" className="ms-2">Automático</Badge>
                  </div>
                </div>
                <AlertList />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Análisis Histórico */}
        <Row className="mt-4">
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <i className="bi bi-clock-history text-success fs-2 me-2"></i>
                  <div>
                    <Card.Title className="mb-0 fw-bold">Análisis Histórico</Card.Title>
                    <Badge bg="success" className="ms-2">GEE</Badge>
                  </div>
                </div>
                <GeeDataDisplay />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default DashboardPage;
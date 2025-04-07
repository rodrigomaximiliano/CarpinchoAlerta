import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap'; // Importar componentes de react-bootstrap

function HomePage() {
  return (
    // Usar clases de Bootstrap para el fondo y padding
    <div className="bg-light py-5 text-center min-vh-100 d-flex flex-column">
      <Container className="flex-grow-1">
        {/* Título y descripción */}
        <h1 className="display-4 fw-bold mb-3 text-primary">
          Bienvenido a Guardián del Iberá
        </h1>
        <p className="lead mb-4 text-muted">
          Tu sistema de monitoreo y prevención de incendios en los Esteros del Iberá.
        </p>
        <p className="mb-5">
          Utilizamos datos satelitales de FIRMS (NASA) para detectar focos de calor activos
          y análisis de Google Earth Engine para visualizar tendencias históricas y condiciones
          actuales del terreno (como el NDVI).
        </p>

        {/* Sección de tarjetas */}
        <Row className="justify-content-center g-4 mb-5">
          {/* Tarjeta Focos Activos */}
          <Col md={6} lg={5}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h2" className="mb-3 text-danger">Focos Activos (FIRMS)</Card.Title>
                <Card.Text className="text-muted mb-4 flex-grow-1">
                  Visualiza los últimos focos de calor detectados por satélites en tiempo casi real.
                </Card.Text>
                {/* Usar Button con as={Link} para la navegación */}
                <Button variant="outline-primary" as={Link} to="/dashboard">
                  Ver mapa (requiere inicio de sesión)
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* Tarjeta Análisis Histórico */}
          <Col md={6} lg={5}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h2" className="mb-3 text-success">Análisis Histórico (GEE)</Card.Title>
                <Card.Text className="text-muted mb-4 flex-grow-1">
                  Explora datos históricos de incendios y vegetación (NDVI) para entender patrones y riesgos.
                </Card.Text>
                <Button variant="outline-primary" as={Link} to="/dashboard">
                  Ver análisis (requiere inicio de sesión)
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Sección de botones de acción */}
        <p className="lead text-muted mb-4">
          Regístrate o inicia sesión para acceder a todas las funcionalidades.
        </p>
        <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
          <Button variant="primary" size="lg" as={Link} to="/login" className="px-4 me-sm-3">
            Iniciar Sesión
          </Button>
          <Button variant="success" size="lg" as={Link} to="/register" className="px-4">
            Registrarse
          </Button>
        </div>
      </Container>
    </div>
  );
}

export default HomePage;
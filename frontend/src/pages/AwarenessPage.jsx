import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

function AwarenessPage() {
  return (
    <div className="bg-light py-5">
      <Container>
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold text-danger">Prevención de Incendios</h1>
          <p className="lead text-muted">
            Aprende cómo prevenir incendios y proteger los Esteros del Iberá.
          </p>
        </div>

        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="text-warning">Evita Quemas</Card.Title>
                <Card.Text>
                  No realices quemas de basura o pastizales, especialmente en épocas de sequía.
                  Las quemas descontroladas son una de las principales causas de incendios.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="text-success">Reporta Focos</Card.Title>
                <Card.Text>
                  Si ves humo o llamas, repórtalo de inmediato a las autoridades o utiliza nuestra
                  plataforma para alertar sobre posibles incendios.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={6} lg={4}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="text-primary">Protege la Naturaleza</Card.Title>
                <Card.Text>
                  No arrojes colillas de cigarrillos ni vidrios en áreas naturales. Estos pueden
                  iniciar incendios bajo el sol.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="text-center mt-5">
          <h2 className="h4">Recursos Adicionales</h2>
          <p className="text-muted">
            Consulta guías y materiales educativos sobre la prevención de incendios.
          </p>
          <a
            href="https://www.argentina.gob.ar/ambiente/incendios"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-danger"
          >
            Más Información
          </a>
        </div>
      </Container>
    </div>
  );
}

export default AwarenessPage;

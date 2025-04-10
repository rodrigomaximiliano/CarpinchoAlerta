import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ReportForm from '../components/ReportForm'; // Importaremos el formulario que crearemos a continuación

function ReportPage() {
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8} lg={6}> {/* Ajustar ancho según preferencia */}
          <h1 className="text-center mb-4">Reportar Foco Ígneo</h1>
          <p className="text-center text-muted mb-4">
            Utiliza el mapa para marcar la ubicación aproximada del foco ígneo
            y añade una descripción si es posible. Tu reporte ayuda a mantener
            segura nuestra comunidad.
          </p>
          <ReportForm /> {/* Aquí irá el componente del formulario */}
        </Col>
      </Row>
    </Container>
  );
}

export default ReportPage;
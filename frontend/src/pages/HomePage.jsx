import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Importar useNavigate
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import InteractiveMapDisplay from '../components/InteractiveMapDisplay'; // Importar el mapa

// Recibir isAuthenticated como prop
function HomePage({ isAuthenticated }) {
  const navigate = useNavigate();

  const handleReportClick = () => {
    if (isAuthenticated) {
      navigate('/report'); // Ir a la página de reporte si está logueado
    } else {
      // Redirigir al login, opcionalmente con un mensaje
      navigate('/login', { state: { message: 'Debes iniciar sesión para poder reportar un foco ígneo.' } });
    }
  };

  return (
    <div className="bg-light py-5">
      <Container>
        {/* Sección Superior: Bienvenida */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-3 text-primary">
            Bienvenido a Guardián del Iberá
          </h1>
          <p className="lead mb-4 text-muted">
            Tu sistema de monitoreo y prevención de incendios en los Esteros del Iberá.
          </p>
          <p className="mb-4">
            Utilizamos datos satelitales y análisis geoespaciales para visualizar focos de calor,
            tendencias históricas y condiciones del terreno.
          </p>
        </div>

        {/* Sección Mapa y Reporte */}
        <Row className="g-4 mb-5 align-items-center bg-white p-4 rounded shadow-sm border">
          <Col lg={7} className="mb-4 mb-lg-0">
            <h2 className="h4 mb-3">Mapa de la Región de Monitoreo</h2>
            <p className="text-muted small mb-3">
              Visualización general de los Esteros del Iberá y alrededores. Haz clic en "Reportar Foco"
              si detectas un posible incendio.
            </p>
            <InteractiveMapDisplay
              center={[-28.5, -58.0]} // Centro aproximado de Corrientes
              zoom={7}
              style={{ height: '450px', width: '100%' }} // Ajustar altura
              // Podríamos pasar marcadores aquí en el futuro
            />
          </Col>
          <Col lg={5}>
            <div className="text-center">
              <img src="/carpinchex_alert.png" alt="Carpincho alerta" style={{ maxWidth: '150px', marginBottom: '1rem' }} /> {/* Imagen ilustrativa */}
              <h3 className="mb-3 text-warning fw-bold">¡Tu Colaboración es Clave!</h3>
              <p className="mb-4">
                ¿Detectaste humo o llamas? Tu reporte ciudadano ayuda a activar
                alertas tempranas y proteger nuestro valioso ecosistema.
              </p>
              <Button variant="warning" size="lg" onClick={handleReportClick} className="w-100 fw-bold shadow-sm">
                <i className="bi bi-fire me-2"></i> {/* Icono opcional si usas bootstrap-icons */}
                Reportar Foco Ígneo
              </Button>
              {!isAuthenticated && (
                <p className="mt-3 mb-0 text-danger small">
                  <strong>Nota:</strong> Debes <Link to="/login">iniciar sesión</Link> o <Link to="/register">registrarte</Link> para poder enviar un reporte.
                </p>
              )}
            </div>
          </Col>
        </Row>

        {/* Sección Funcionalidades (Tarjetas ajustadas) */}
        <div className="text-center mb-4">
           <h2 className="h3">Explora los Datos</h2>
           <p className="text-muted">Accede a la información detallada en nuestro dashboard.</p>
        </div>
        <Row className="justify-content-center g-4">
          {/* Tarjeta Dashboard */}
          <Col md={6} lg={5}>
            <Card className="shadow-sm h-100">
              <Card.Body className="d-flex flex-column align-items-center text-center">
                 <i className="bi bi-speedometer2 fs-1 text-primary mb-3"></i> {/* Icono */}
                <Card.Title as="h4" className="mb-3">Dashboard Interactivo</Card.Title>
                <Card.Text className="text-muted mb-4 flex-grow-1">
                  Visualiza focos activos (FIRMS), alertas del sistema y análisis históricos (GEE) en un solo lugar.
                </Card.Text>
                <Button variant="outline-primary" as={Link} to="/dashboard">
                  Ir al Dashboard
                </Button>
                 <p className="mt-2 mb-0 text-muted small">(Acceso público)</p>
              </Card.Body>
            </Card>
          </Col>

          {/* Podríamos añadir más tarjetas si fuera necesario */}

        </Row>

        {/* Sección Acceso (si no está autenticado) */}
        {!isAuthenticated && (
          <div className="text-center mt-5 pt-4 border-top">
             <p className="lead text-muted mb-4">
               Regístrate o inicia sesión para reportar focos y acceder a futuras funcionalidades personalizadas.
             </p>
             <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
               <Button variant="primary" size="lg" as={Link} to="/login" className="px-4 me-sm-3">
                 Iniciar Sesión
               </Button>
               <Button variant="success" size="lg" as={Link} to="/register" className="px-4">
                 Registrarse
               </Button>
             </div>
          </div>
        )}

      </Container>
    </div>
  );
}

export default HomePage;
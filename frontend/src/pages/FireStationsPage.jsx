import React from 'react';
import { Container } from 'react-bootstrap';
import FireStationsList from '../components/FireStationsList'; // Importar el componente de la lista

function FireStationsPage() {
  return (
    <div className="py-5 bg-light">
      <Container>
        {/* Renderiza el componente de la lista de cuarteles */}
        <FireStationsList />
      </Container>
    </div>
  );
}

export default FireStationsPage;
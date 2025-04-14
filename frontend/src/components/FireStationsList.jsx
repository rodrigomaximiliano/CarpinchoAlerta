import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Form, InputGroup, ListGroup, Badge } from 'react-bootstrap';

// Datos reales de los cuarteles de bomberos de Corrientes
const initialStations = [
  { id: 2, name: 'Asociación Bomberos Voluntarios de Bella Vista', address: 'Padre Jorge Kloster y Catamarca S/N', city: 'Bella Vista', zip: '3432', phone: '3777451761', email: 'bomberovolbellavista@gmail.com', type: 'Voluntarios' },
  { id: 3, name: 'Asociación Bomberos Voluntarios de Goya', address: '25 de Mayo 1003', city: 'Goya', zip: '3450', phone: '3777422000', email: 'bomberos.goya@hotmail.com', type: 'Voluntarios' },
  { id: 1, name: 'Asociación Bomberos Voluntarios de Mocoretá', address: 'Calle Bomberos Voluntarios Nº 201', city: 'Mocoretá', zip: '3226', phone: '(03775)498914', email: 'bomberosmocoreta@hotmail.com', type: 'Voluntarios' },
  { id: 11, name: 'Asociación de Bomberos Voluntarios 9 de Julio', address: 'San Martín y Pio II S/N', city: '9 de Julio', zip: '3445', phone: '03777 - 15280872', email: 'bomberosvoluntarios9dejulio@gmail.com', type: 'Voluntarios' },
  { id: 9, name: 'Asociación de Bomberos Voluntarios Colonia Pando', address: 'S/N', city: 'Colonia Pando', zip: '3449', phone: '3794777953', email: 'bomberosvol.coloniapando@gmail.com', type: 'Voluntarios' },
  { id: 12, name: 'Asociación de Bomberos Voluntarios de Alvear', address: '9 de julio 1046', city: 'Alvear', zip: '3344', phone: '03772 - 470398', email: 'bomberos.alvear@hotmail.com', type: 'Voluntarios' },
  { id: 51, name: 'Asociación de Bomberos Voluntarios de Apipé Grande', address: 'San Antonio S/N', city: 'Apipé Grande', zip: '3302', phone: '3786 - 612001', email: 'asociaciondebomberosvoluntarios@gmail.com', type: 'Voluntarios' },
  { id: 50, name: 'Asociación de Bomberos Voluntarios de Berón de Astrada', address: 'Mitre S/N', city: 'Berón de Astrada', zip: '3481', phone: '3794 - 922579', email: 'bomberosdeberondeastrada@gmail.com', type: 'Voluntarios' },
  { id: 13, name: 'Asociación de Bomberos Voluntarios de Bonpland', address: 'San Martín S/N', city: 'Bonpland', zip: '3234', phone: '03772 - 15465989', email: 'bomberosbonplandctes@gmail.com', type: 'Voluntarios' },
  { id: 14, name: 'Asociación de Bomberos Voluntarios de Caa Catí', address: 'Brunel Pruyas 655', city: 'Caa Catí', zip: '3407', phone: '03781 - 420211', email: 'caa-cati@hotmail.com', type: 'Voluntarios' },
  { id: 53, name: 'Asociación de Bomberos Voluntarios de Carlos Pellegrini', address: 'Ruta 40 S/N', city: 'Carlos Pellegrini', zip: '3471', phone: '3773 - 461124', email: 'bomberosibera@gmail.com', type: 'Voluntarios' },
  { id: 15, name: 'Asociación de Bomberos Voluntarios de Carolina', address: 'Avenida San Antonio S/N', city: 'Carolina', zip: '3451', phone: '03777 - 15558290', email: 'carolinabomberosvoluntarios@gmail.com', type: 'Voluntarios' },
  { id: 6, name: 'Asociación de Bomberos Voluntarios de Chavarría', address: 'Juan Vicente Pampin S/N', city: 'Chavarría', zip: '3474', phone: '3775 -591077', email: 'bomberos.chavarria@hotmail.com.ar', type: 'Voluntarios' },
  { id: 16, name: 'Asociación de Bomberos Voluntarios de Colonia Libertad', address: 'Ruta provincial N° 25', city: 'Colonia Libertad', zip: '3224', phone: '03775 -15437540', email: 'bomberoscolonialibertad@gmail.com', type: 'Voluntarios' },
  { id: 17, name: 'Asociación de Bomberos Voluntarios de Colonia Liebig', address: 'San Martín S/N', city: 'Colonia Liebig', zip: '3358', phone: '03758 - 15488701', email: 'bomberosliebig@yahoo.com.ar', type: 'Voluntarios' },
  { id: 18, name: 'Asociación de Bomberos Voluntarios de Concepción', address: 'Belgrano S/N', city: 'Concepción', zip: '3423', phone: '03782 - 497169', email: 'bomberosdeconcepcion@hotmail.com.ar', type: 'Voluntarios' },
  { id: 46, name: 'Asociación de Bomberos Voluntarios de Corrientes', address: 'Gutemberg 2600', city: 'Corrientes', zip: '3400', phone: '3794 - 694150', email: 'bvctescap@hotmail.com', type: 'Voluntarios' },
  { id: 19, name: 'Asociación de Bomberos Voluntarios de Curuzú Cuatiá', address: 'Irastorza 425', city: 'Curuzú Cuatiá', zip: '3460', phone: '03774 - 422811', email: 'bomberosczc@yahoo.com.ar', type: 'Voluntarios' },
  { id: 8, name: 'Asociación de Bomberos Voluntarios de Empedrado', address: 'Sarmiento y Mayo S/N', city: 'Empedrado', zip: '3418', phone: '0379 - 4491400', email: 'bvempedradoctes@outlook.com', type: 'Voluntarios' },
  { id: 20, name: 'Asociación de Bomberos Voluntarios de Esquina', address: 'Lamela y Sdor. Mancini', city: 'Esquina', zip: '3196', phone: '03777 - 460181', email: 'bomberosvesquina@gmail.com', type: 'Voluntarios' },
  { id: 52, name: 'Asociación de Bomberos Voluntarios de Garaví', address: 'Amarilla S/N', city: 'Garaví', zip: '3342', phone: '3794 - 724781', email: 'bomberosvoluntariosdegaravi@gmail.com', type: 'Voluntarios' },
  { id: 21, name: 'Asociación de Bomberos Voluntarios de Gobernador Martinez', address: 'Cabildo S/N', city: 'Gobernador Martinez', zip: '3445', phone: '03777 - 15411752', email: 'bomberosgm@hotmail.com', type: 'Voluntarios' },
  { id: 22, name: 'Asociación de Bomberos Voluntarios de Gobernador Virasoro', address: 'San Martín S/N', city: 'Gobernador Virasoro', zip: '3342', phone: '03756 - 482024', email: 'bomberosvirasoro@hotmail.com', type: 'Voluntarios' },
  { id: 47, name: 'Asociación de Bomberos Voluntarios de Ita Ibaté', address: '9 de julio entre calles San Martín y 25 de Mayo', city: 'Ita Ibaté', zip: '3480', phone: '3794 - 155252', email: 'bomberosdeitaibate@gmail.com', type: 'Voluntarios' },
  { id: 23, name: 'Asociación de Bomberos Voluntarios de Itatí', address: 'Los Benedictinos y S. Zanches', city: 'Itatí', zip: '3416', phone: '0379 - 4493205', email: 'bomberosvolitati@yahoo.com.ar', type: 'Voluntarios' },
  { id: 24, name: 'Asociación de Bomberos Voluntarios de Ituzaingó', address: 'Libertador 1470', city: 'Ituzaingó', zip: '3302', phone: '03786 - 421179', email: 'bomberositu@gmail.com', type: 'Voluntarios' },
  { id: 4, name: 'Asociación de Bomberos Voluntarios de Juan Pujol', address: 'Luis T. Ledesma S/N', city: 'Juan Pujol', zip: '3222', phone: '03775 - 499362', email: 'bv_juanpujol@yahoo.com.ar', type: 'Voluntarios' },
  { id: 25, name: 'Asociación de Bomberos Voluntarios de La Cruz', address: 'Zelmira de Luca S/N o (B. Mitre y San Martín)', city: 'La Cruz', zip: '3346', phone: '03772 - 491390', email: 'bomberosvoluntarioslacruz@hotmail.com', type: 'Voluntarios' },
  { id: 48, name: 'Asociación de Bomberos Voluntarios de Loreto', address: '25 de Mayo 637', city: 'Loreto', zip: '3483', phone: '3781 - 484783', email: 'bomberosloretocorrientes@gmail.com', type: 'Voluntarios' },
  { id: 10, name: 'Asociación de Bomberos Voluntarios de Mantilla', address: 'Héroes de Malvinas Martín Pereyra S/N', city: 'Mantilla', zip: '3446', phone: '3777551273', email: 'bomberosdemantilla@gmail.com', type: 'Voluntarios' },
  { id: 26, name: 'Asociación de Bomberos Voluntarios de Mburucuyá', address: 'Belgrano 1056', city: 'Mburucuyá', zip: '3427', phone: '03782 - 498247', email: 'abomvolmbya@hotmail.com', type: 'Voluntarios' },
  { id: 27, name: 'Asociación de Bomberos Voluntarios de Mercedes', address: 'Fray Luis Beltrán 865', city: 'Mercedes', zip: '3470', phone: '03773 - 420091', email: 'bvmercedes01@gmail.com', type: 'Voluntarios' },
  { id: 28, name: 'Asociación de Bomberos Voluntarios de Monte Caseros', address: 'Colón 643', city: 'Monte Caseros', zip: '3220', phone: '03775 - 422207', email: 'bomberosmontecaseros@hotmail.com.ar', type: 'Voluntarios' },
  { id: 29, name: 'Asociación de Bomberos Voluntarios de Parada Pucheta', address: 'Luis Beltrán Esq. Güemes S/N', city: 'Parada Pucheta', zip: '3232', phone: '03772 - 15631292', email: 'bvppucheta@hotmail.com', type: 'Voluntarios' },
  { id: 30, name: 'Asociación de Bomberos Voluntarios de Paso de la Patria', address: 'La Rioja 845', city: 'Paso de la Patria', zip: '3409', phone: '0379 - 4494345', email: 'bomberospasopatria@gmail.com', type: 'Voluntarios' },
  { id: 31, name: 'Asociación de Bomberos Voluntarios de Paso de los Libres', address: 'Amado Bonpland 1050', city: 'Paso de los Libres', zip: '3230', phone: '03772 - 425333', email: 'bbvvplibres@gmail.com', type: 'Voluntarios' },
  { id: 32, name: 'Asociación de Bomberos Voluntarios de Perugorria', address: 'Genaro Perugorria S/N', city: 'Perugorria', zip: '3461', phone: '03773 - 494122', email: 'bomberosperugorria@hotmail.com', type: 'Voluntarios' },
  { id: 33, name: 'Asociación de Bomberos Voluntarios de Pueblo Libertador', address: 'Avenida Manzini S/N', city: 'Pueblo Libertador', zip: '3196', phone: '03777 - 15403306', email: 'oficialbomberoslibertador@gmail.com', type: 'Voluntarios' },
  { id: 34, name: 'Asociación de Bomberos Voluntarios de Puerto Lavalle', address: 'Sgto. Cabral y Juan Ramón Vidal', city: 'Puerto Lavalle', zip: '3443', phone: '03777 - 15640297', email: 'bomberosvoluntarioslavalle@hotmail.com', type: 'Voluntarios' },
  { id: 54, name: 'Asociación de Bomberos Voluntarios de Ramada Paso', address: 'Ruta 12 Km 1082', city: 'Ramada Paso', zip: '3414', phone: '3794 - 579042', email: 'bomberosvoluntariosramadapaso@gmail.com', type: 'Voluntarios' },
  { id: 35, name: 'Asociación de Bomberos Voluntarios de Riachuelo', address: 'Pago Largo 91', city: 'Riachuelo', zip: '3416', phone: '379 - 154571584', email: 'riachuelobomberosvoluntarios@gmail.com', type: 'Voluntarios' },
  { id: 7, name: 'Asociación de Bomberos Voluntarios de Saladas', address: 'Independencia 920', city: 'Saladas', zip: '3420', phone: '03782 - 421681', email: 'bvsaladas@yahoo.com.ar', type: 'Voluntarios' },
  { id: 55, name: 'Asociación de Bomberos Voluntarios de San Carlos', address: 'Mitre entre Avenida Corrientes y Caaguayu', city: 'San Carlos', zip: '3472', phone: '3764 - 481321', email: 'bomberosdesancarlos@gmail.com', type: 'Voluntarios' },
  { id: 49, name: 'Asociación de Bomberos Voluntarios de San Cosme', address: 'Ruta Nac.12 Km 1058', city: 'San Cosme', zip: '3412', phone: '3794 - 769528', email: 'bomberossancosme@gmail.com', type: 'Voluntarios' },
  { id: 45, name: 'Asociación de Bomberos Voluntarios de San Lorenzo', address: 'Sarmiento S/N', city: 'San Lorenzo', zip: '3416', phone: '03782 - 492755', email: 'lyalirox@hotmail.com', type: 'Voluntarios' },
  { id: 36, name: 'Asociación de Bomberos Voluntarios de San Luis del Palmar', address: 'Buenos Aires 1298', city: 'San Luis del Palmar', zip: '3403', phone: '0379 - 4492094', email: 'bbvvsanluisdelpalmar@hotmail.com.ar', type: 'Voluntarios' },
  { id: 37, name: 'Asociación de Bomberos Voluntarios de San Miguel', address: 'Melchor Julio Meza 1537', city: 'San Miguel', zip: '3485', phone: '03781 - 15402211', email: 'bomberos.sanmiguel2005@gmail.com', type: 'Voluntarios' },
  { id: 5, name: 'Asociación de Bomberos Voluntarios de San Roque', address: 'Acceso Presbítero Jorge Esteban Romero', city: 'San Roque', zip: '3448', phone: '03777 - 478172', email: 'bomberosdesanroque@yahoo.com.ar', type: 'Voluntarios' },
  { id: 38, name: 'Asociación de Bomberos Voluntarios de Santa Ana', address: 'Virasoro y Berón de Astrada', city: 'Santa Ana', zip: '3401', phone: '3794 - 497752', email: 'bomberos.santaanactes@gmail.com', type: 'Voluntarios' },
  { id: 39, name: 'Asociación de Bomberos Voluntarios de Santa Lucía', address: 'Santa Fe 971', city: 'Santa Lucía', zip: '3440', phone: '03777 - 480681', email: 'cdbomberos_santalucia@hotmail.com', type: 'Voluntarios' },
  { id: 40, name: 'Asociación de Bomberos Voluntarios de Santa Rosa', address: 'Nicolás Avellaneda 012', city: 'Santa Rosa', zip: '3421', phone: '03782 - 494367', email: 'bomberossantarosacorrientes@gmail.com', type: 'Voluntarios' },
  { id: 41, name: 'Asociación de Bomberos Voluntarios de Santo Tomé', address: '9 de julio 504', city: 'Santo Tomé', zip: '3340', phone: '03756 - 420534', email: 'bbvvsantotome@hotmail.com', type: 'Voluntarios' },
  { id: 42, name: 'Asociación de Bomberos Voluntarios de Sauce', address: 'Rivadavia entre San Martín y Sarmiento', city: 'Sauce', zip: '3463', phone: '03774 - 15404627', email: 'comisionbomberossauce@gmail.com', type: 'Voluntarios' },
  { id: 43, name: 'Asociación de Bomberos Voluntarios de Tatacuá', address: 'Ruta 118 - Km. 42', city: 'Tatacuá', zip: '3421', phone: '03782 - 499347', email: 'bomberostatacua@hotmail.com', type: 'Voluntarios' },
  { id: 44, name: 'Asociación de Bomberos Voluntarios de Yapeyú', address: 'Avenida Libertador S/N', city: 'Yapeyú', zip: '3231', phone: '03772 - 493047', email: 'bomberosvoluntariosyapeyuctes@gmail.com', type: 'Voluntarios' },
];

// Ordenar alfabéticamente por ciudad y luego por nombre para consistencia
initialStations.sort((a, b) => {
  if (a.city < b.city) return -1;
  if (a.city > b.city) return 1;
  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;
  return 0;
});


function FireStationsList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState(''); // Estado para filtrar por ciudad

  // Obtener lista única de ciudades para el filtro
  const cities = useMemo(() => {
    const citySet = new Set(initialStations.map(station => station.city));
    return ['', ...Array.from(citySet).sort()]; // Añadir opción "Todas"
  }, []); // Se calcula solo una vez

  // Filtrar cuarteles según búsqueda y ciudad
  const filteredStations = useMemo(() => {
    return initialStations.filter(station => {
      const nameMatch = station.name.toLowerCase().includes(searchTerm.toLowerCase());
      const cityMatch = filterCity === '' || station.city === filterCity;
      return nameMatch && cityMatch;
    });
  }, [searchTerm, filterCity]); // Se recalcula si cambia el término o la ciudad

  return (
    <Container className="my-5 p-4 bg-white rounded shadow-sm border">
      <h2 className="mb-4 text-center">Cuarteles de Bomberos en Corrientes</h2>

      <Row className="mb-4 g-3">
        {/* Buscador */}
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>

        {/* Filtro por Ciudad */}
        <Col md={6}>
          <InputGroup>
             <InputGroup.Text><i className="bi bi-geo-alt-fill"></i></InputGroup.Text>
            <Form.Select
              aria-label="Filtrar por ciudad"
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
            >
              {cities.map(city => (
                <option key={city || 'all'} value={city}>
                  {city === '' ? 'Todas las ciudades' : city}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </Col>
      </Row>

      {/* Lista de Cuarteles */}
      <ListGroup variant="flush">
        {filteredStations.length > 0 ? (
          filteredStations.map(station => (
            <ListGroup.Item key={station.id} className="d-flex justify-content-between align-items-start flex-wrap">
              <div className="ms-2 me-auto mb-2">
                <div className="fw-bold">{station.name}</div>
                <span className="text-muted small d-block">{station.address}, {station.city} ({station.zip})</span>
                {station.phone && <span className="text-muted small d-block">Tel: {station.phone}</span>}
                {station.email && <span className="text-muted small d-block">Email: {station.email}</span>}
              </div>
              <Badge bg={station.type === 'Policía' ? 'secondary' : 'info'} pill className="align-self-center">
                {station.type}
              </Badge>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className="text-center text-muted">
            No se encontraron cuarteles que coincidan con los criterios de búsqueda.
          </ListGroup.Item>
        )}
      </ListGroup>
       <p className="text-center text-muted mt-3 small">
         Mostrando {filteredStations.length} de {initialStations.length} cuarteles.
       </p>
    </Container>
  );
}

export default FireStationsList;
import React from 'react'; // Importar React
import ReactDOM from 'react-dom/client'; // Importar ReactDOM
import { BrowserRouter } from 'react-router-dom'; // Importar BrowserRouter
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar estilos de Bootstrap
import 'leaflet/dist/leaflet.css'; // <-- Añadir CSS de Leaflet

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Envolver App con BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

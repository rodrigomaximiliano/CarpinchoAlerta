import './App.css'
import AlertList from './components/AlertList';
import FirmsFireList from './components/FirmsFireList'; // Importamos el componente FIRMS
import './App.css' // Mover importación de CSS aquí si no está ya

function App() {

  return (
    <>
      <h1>Guardián del Iberá</h1>
      <hr /> {/* Separador visual */}
      <FirmsFireList /> {/* Renderizamos el componente de incendios FIRMS */}
      <hr /> {/* Separador visual */}
      <AlertList /> {/* Renderizamos el componente de lista de alertas */}
    </>
  )
}

export default App

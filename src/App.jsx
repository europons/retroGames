import { useNavigate, Outlet } from "react-router-dom";

import './App.css'
import portadaInvaders from './imagenes/space-invaders.png'
import portadaHopper from './imagenes/super-hopper.png'
import BotonJuego from './componentes/boton-juego.jsx'

function App() {
  const navigate = useNavigate();

  return (
    <div className="app">
      <h1 className="titulo-principal">RetroGames García</h1>

      <div className="botones-juegos">
        <BotonJuego
          image={portadaInvaders}
          title="Space Invaders"
          onClick={() => navigate("/space-invaders")}
        />
        <BotonJuego
          image={portadaHopper}
          title="Super Hopper"
          onClick={() => navigate("super-hopper")}
        />
      </div>
      <Outlet />
    </div>

  )
}

export default App

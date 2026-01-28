import './App.css'
import SpaceInvaders from './juegos/space-invaders/space-invaders.jsx'
import portadaInvaders from '../imagenes/space-invaders.png'
import portadaHopper from '../imagenes/super-hopper.png'
import BotonJuego from './componentes/boton-juego.jsx'

function App() {
  

  return (
    <div className="app">
      <h1 className="titulo-principal">Plataforma de Videojuegos</h1>

      <div className="botones-juegos">
        <BotonJuego
          image={portadaInvaders}
          title="Space Invaders"
          onClick={() => console.log('Space Invaders')}
        />
        <BotonJuego
          image={portadaHopper}
          title="Super Hopper"
          onClick={() => console.log('Super Hopper')}
        />
      </div>
    </div>

  )
}

export default App

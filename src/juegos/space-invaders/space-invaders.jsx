import { useState } from 'react'
import './space-invaders.css'
import Inicio from './pantallas/inicio.jsx'
import GameOver from './pantallas/game-over.jsx'
import Juego from './pantallas/juego.jsx'

export default function SpaceInvaders() {

  const [partidaEmpezada, setPartidaEmpezada] = useState(false);
  const [puntos, setPuntos] = useState(0);
  const [vidas, setVidas] = useState(3);
  
  // Cargar mejor puntuación desde localStorage al iniciar la app
  const [mejorPuntuacion, setMejorPuntuacion] = useState(() => {
    const guardada = localStorage.getItem("mejorPuntuacion");
    return guardada ? Number(guardada) : 0;
  });

  // Funciones para manejar el estado del juego
  function iniciarPartida() {
    setPartidaEmpezada(true);
  }

  function reiniciarPartida() {
    setPuntos(0);
    setVidas(3);
    setPartidaEmpezada(false);
  }

  function aumentarPuntos(cantidad) {
    setPuntos(prevPuntos => prevPuntos + cantidad);
  }

  function restarVida() {
    setVidas(prevVidas => Math.max(prevVidas - 1, 0));
  }

  function guardarMejorPuntuacion(puntos) {
    if (puntos > mejorPuntuacion) {
      localStorage.setItem("mejorPuntuacion", String(puntos));
      setMejorPuntuacion(puntos);
    }
  }

  // PANTALLA INICIAL
  if (!partidaEmpezada) {
    return <Inicio iniciarPartida={iniciarPartida} />
  }

  // PANTALLA GAME OVER
  if (partidaEmpezada && vidas === 0) {
    guardarMejorPuntuacion(puntos);

    return <GameOver puntos={puntos} reiniciarPartida={reiniciarPartida} mejorPuntuacion={mejorPuntuacion} />
  }

  // PANTALLA DEL JUEGO
  return (
    <Juego
      puntos={puntos}
      vidas={vidas}
      aumentarPuntos={aumentarPuntos}
      restarVida={restarVida}
    />
  ); 
}

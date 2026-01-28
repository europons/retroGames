import { useState } from 'react';
import './super-hopper.css'
import GameOver from './pantallas/game-over';
import PantallaInicio from './pantallas/pantalla-inicio.jsx';
import Instrucciones from './componentes/instruciones.jsx';
import PantallaJuego from './pantallas/pantalla-juego.jsx';

export default function SuperHopper() {

    const [partidaEmpezada, setPartidaEmpezada] = useState(false);
    const [score, setScore] = useState(0);
    const [finPartida, setFinPartida] = useState(false);

    // Funciones para manejar el estado del juego
    function iniciarPartida() {
        setPartidaEmpezada(true);
    }

    function reiniciarPartida() {
        setScore(0);
        setPartidaEmpezada(false);
        setFinPartida(false);
    }

    // PANTALLA INICIAL
    if (!partidaEmpezada) {
        return(
            <>
                <PantallaInicio score={score} iniciarPartida={iniciarPartida} />
                <Instrucciones />
            </>
        );
    }

    // PANTALLA GAME OVER
    if (partidaEmpezada && finPartida) {
        return (
            <>
                <GameOver score={score} reiniciarPartida={reiniciarPartida} />
                <Instrucciones />
            </>
        );
    }

    // PANTALLA DEL JUEGO
    return (
        <>
            <PantallaJuego score={score} />
            <Instrucciones />
        </>
    );
}
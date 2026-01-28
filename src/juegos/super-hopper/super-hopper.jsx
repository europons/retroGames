import { useState } from 'react';
import './super-hopper.css'
import GameOver from './pantallas/game-over';
import PantallaInicio from './pantallas/pantalla-inicio.jsx';
import Instrucciones from './componentes/instruciones.jsx';

export default function SuperHopper() {

    const [partidaEmpezada, setPartidaEmpezada] = useState(false);
    const [score, setScore] = useState(0);

    // Funciones para manejar el estado del juego
    function iniciarPartida() {
        setPartidaEmpezada(true);
    }

    function reiniciarPartida() {
        setScore(0);
        setPartidaEmpezada(false);
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
    if (partidaEmpezada && score === 0) {
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


        </>
    );
}
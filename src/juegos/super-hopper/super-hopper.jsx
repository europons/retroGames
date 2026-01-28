import { useState } from 'react';
import './super-hopper.css'
import GameOver from './pantallas/game-over';
import Juego from './pantallas/juego.jsx';

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

    // PANTALLA GAME OVER
    if (partidaEmpezada && score === 0) {
        return <GameOver score={score} reiniciarPartida={reiniciarPartida} />
    }

    // PANTALLA DEL JUEGO
    return (
        <>
            <Juego score={score} />

            <div id="ui-layer">
                <div id="instructions">
                    STEPS:
                    <span className="key">←</span> <span className="key">→</span> MOVE
                    <span className="key">↑</span> JUMP
                </div>
            </div>
        </>
    );
}
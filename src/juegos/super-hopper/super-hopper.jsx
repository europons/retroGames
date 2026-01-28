import { useState } from 'react';
import './super-hopper.css'
import GameOver from './pantallas/game-over';
import PantallaInicio from './pantallas/pantalla-inicio.jsx';
import Instrucciones from './componentes/instruciones.jsx';
import PantallaJuego from './pantallas/pantalla-juego.jsx';
import BotonVolver from '../../componentes/boton-volver.jsx';
import { useNavigate } from 'react-router-dom';

export default function SuperHopper() {

    const [partidaEmpezada, setPartidaEmpezada] = useState(false);
    const [score, setScore] = useState(0);
    const [finPartida, setFinPartida] = useState(false);
    const navigate = useNavigate();

    // Funciones para manejar el estado del juego
    function iniciarPartida() {
        setPartidaEmpezada(true);
    }

    function reiniciarPartida() {
        setScore(0);
        setPartidaEmpezada(false);
        setFinPartida(false);
    }

    function gameOver(scoreFinal) {
        setScore(scoreFinal);
        setFinPartida(true);
    }

    // PANTALLA INICIAL
    if (!partidaEmpezada) {
        return(
            <>
                <PantallaInicio score={score} iniciarPartida={iniciarPartida} />
                <Instrucciones />
                <BotonVolver onClick={() => navigate("/")} />
            </>
        );
    }

    // PANTALLA GAME OVER
    if (partidaEmpezada && finPartida) {
        return (
            <>
                <GameOver score={score} reiniciarPartida={reiniciarPartida} />
                <Instrucciones />
                <BotonVolver onClick={() => navigate("/")} />
            </>
        );
    }

    // PANTALLA DEL JUEGO
    return (
        <>
            <PantallaJuego score={score} gameOver={gameOver} />
            <Instrucciones />
        </>
    );
}
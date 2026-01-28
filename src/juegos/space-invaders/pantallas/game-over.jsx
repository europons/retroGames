import { useEffect, useState } from "react";
import naveRota from '../imagenes/nave-rota2.webp';
import sonidoGameOver from '../sonidos/sonido-game-over.mp3';

export default function GameOver( props) {

    // Estado para controlar la animación de la nave
    const [animarNave, setAnimarNave] = useState(false);    

    // Efecto para iniciar la animación de la nave cada 5 segundos
    useEffect(() => {
        const cadaMs = 5000;
        let timeoutId = null;

        const id = setInterval(() => {
            setAnimarNave(true);
        }, cadaMs);

        return () => {
            clearInterval(id);
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, []);      

    useEffect(() => {
        const audio = new Audio(sonidoGameOver);
        audio.volume = 0.3;
        audio.play().catch(() => {});

        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    return (
        <div className="pagina-gameover">
            <h1 className="texto-gameover">Game Over</h1>

            <div className="info-gameover">
                <p className="puntos-finales">Puntos conseguidos: {props.puntos}</p>
                <p className="record-puntos">Record: {props.mejorPuntuacion}</p>
            </div>

            <img
                src={naveRota}
                alt="Nave"
                className={`nave-inicio ${animarNave ? "nave-inicio-animar" : ""}`}
                onAnimationEnd={() => setAnimarNave(false)}
            />

            <button className="button" onClick={props.reiniciarPartida}>
                <div className="button-outer">
                    <div className="button-inner">
                        <span>Reiniciar</span>
                    </div>
                </div>
            </button>
        </div>
    );
}

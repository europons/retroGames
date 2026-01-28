import { useEffect, useState } from "react";

export default function Inicio({ iniciarPartida }) {

    const añoActual = new Date().getFullYear();

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

    return (
        <div className="pagina-inicial">
            <div className="contenedor-inicial">
               <h1 className="titulo-inicial">Space Invaders</h1>
                <img
                    src="/imagenes/nave.webp"
                    alt="Nave"
                    className={`nave-inicio ${animarNave ? "nave-inicio-animar" : ""}`}
                    onAnimationEnd={() => setAnimarNave(false)}
                />
                <button className="button" onClick={iniciarPartida}>
                    <div className="button-outer">
                        <div className="button-inner">
                        <span>Jugar</span>
                        </div>
                    </div>
                </button>                
            </div>

            <div className="info-inicial">
                <div className="controles">
                    <p>Controles</p>
                    <p>Mover nave: {'<--'} {'-->'}</p>
                    <p>Disparar:   Espacio</p>
                </div>
                <div className="contenedor-aliens">
                    <div className="tipo-alien">
                        <p className="puntos-por-alien">10 puntos</p>
                        <img src="/imagenes/alien1.webp" alt="Alien tipo 1" />
                    </div>
                    
                    <div className="tipo-alien">
                        <p className="puntos-por-alien">20 puntos</p>
                        <img src="/imagenes/alien2.webp" alt="Alien tipo 2" />
                    </div>

                    <div className="tipo-alien">
                        <p className="puntos-por-alien">30 puntos</p>
                        <img src="/imagenes/alien3.webp" alt="Alien tipo 3" />
                    </div>

                    <div className="tipo-alien">
                        <p className="puntos-por-alien">100 puntos</p>
                        <img src="/imagenes/alien-especial.webp" alt="Alien especial" id="alien-especial" />
                    </div>
                </div>
            </div>

            <footer>
                <p className="texto-footer">Desarrollado por Javier García - {añoActual}</p>
            </footer>
        </div>
    );
}

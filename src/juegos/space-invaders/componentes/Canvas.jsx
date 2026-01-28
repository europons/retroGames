import { useRef, useEffect } from 'react';
import naveNormal from '../imagenes/nave.webp';
import naveRota1 from '../imagenes/nave-rota1.webp';
import naveRota2 from '../imagenes/nave-rota2.webp';
import alien1 from '../imagenes/alien1.webp';
import alien2 from '../imagenes/alien2.webp';
import alien3 from '../imagenes/alien3.webp';
import balaNave from '../imagenes/bala-nave.webp';
import balaAlien from '../imagenes/bala-alien.webp';
import alienEspecial from '../imagenes/alien-especial.webp';
import sonidoDisparo from '../sonidos/disparo.mp3';
import sonidoAlienMuere from '../sonidos/alien-muere.mp3';
import sonidoRestaVida from '../sonidos/resta-vida.mp3';
import sonidoVictoria from '../sonidos/victoria.mp3';
import sonidoExplosion from '../sonidos/explosion.mp3';
import sonidoFondo from '../sonidos/musica-fondo.mp3';

export function Canvas(props) {

    //********************************//
    //REFERENCIAS//
    const canvasRef = useRef(null);
    const naveXRef = useRef(props.width / 2 - 50); // posición inicial de la nave
    const velocidadRef = useRef(1);
    const naveImgRef = useRef(null);
    const naveNormalRef = useRef(null);
    const naveRota1Ref = useRef(null);
    const naveRota2Ref = useRef(null);
    const alien1ImgRef = useRef(null);
    const alien2ImgRef = useRef(null);
    const alien3ImgRef = useRef(null);
    const balaNaveImgRef = useRef(null);
    const balaAlienImgRef = useRef(null);
    const aliensRef = useRef([]); 
    const izquierdaPulsadaRef = useRef(false);
    const derechaPulsadaRef = useRef(false);
    const balasRef = useRef([]);
    const ultimoDisparoMsRef = useRef(0);
    const cadenciaMsRef = useRef(500); // 1 disparo por segundo
    const balasAliensRef = useRef([]);
    const ultimoDisparoAlienMsRef = useRef(0);
    const cadenciaDisparoAlienMsRef = useRef(1500); // 1 disparo cada 1.5 segundos
    const escudosRef = useRef([]);
    const sonidoDisparoRef = useRef(null);
    const sonidoAlienMuereRef = useRef(null);
    const sonidoRestarVidaRef = useRef(null);
    const alienEspecialRef = useRef(null);    
    const ultimoSpawnEspecialMsRef = useRef(0);
    const alienEspecialImgRef = useRef(null);    
    const sonidoAlienEspecialRef = useRef(null);
    const sonidoExplosionRef = useRef(null);
    const sonidoFondoRef = useRef(null);


    //********************************//
    //CONSTANTES DEL JUEGO//
    const FILAS_ALIENS = 4;
    const COLUMNAS_ALIENS = 10;
    const ANCHO_ALIEN = 50;
    const ALTURA_ALIEN = 60;
    const ESPACIO_ENTRE_ALIENS_X = 10;
    const ESPACIO_ENTRE_ALIENS_Y = 10;
    const MARGEN_SUPERIOR_ALIENS = 25;
    const MARGEN_LATERAL_ALIENS = 25;
    const VELOCIDAD_INICIAL_ALIENS = 0.3;
    const AUMENTO_VELOCIDAD_ALIENS = 0.005;
    const BAJADA_ALIENS = 50;
    const ANCHO_BALA = 12;
    const ALTURA_BALA = 26;
    const ANCHO_NAVE = 100;
    const ALTURA_NAVE = 80;
    const CANTIDAD_ESCUDOS = 3;
    const BLOQUE_ESCUDO = 20;
    const ESCUDO_COLUMNAS = 8;
    const ESCUDO_FILAS = 4;
    const ANCHO_ESCUDO = 160;
    const ESPACIO_ESCUDOS = 180;
    const Y_ESCUDOS = props.height - 220;
    const VIDA_BLOQUE_ESCUDO = 2; 

    const ALIEN_ESPECIAL_ANCHO = 120;
    const ALIEN_ESPECIAL_ALTO = 80;
    const ALIEN_ESPECIAL_Y = 30;
    const ALIEN_ESPECIAL_VELOCIDAD = 1;
    const ALIEN_ESPECIAL_CADA_MS = 12000;     

    //********************************//
    //SONIDOS//
    if (!sonidoDisparoRef.current) {
        sonidoDisparoRef.current = new Audio(sonidoDisparo);
        sonidoDisparoRef.current.volume = 0.3  ;
    }

    if (!sonidoAlienMuereRef.current) {
        sonidoAlienMuereRef.current = new Audio(sonidoAlienMuere);
        sonidoAlienMuereRef.current.volume = 0.3;
    }

    if (!sonidoRestarVidaRef.current) {
        sonidoRestarVidaRef.current = new Audio(sonidoRestaVida);
        sonidoRestarVidaRef.current.volume = 0.3;
    }

    if (!sonidoAlienEspecialRef.current) {
        sonidoAlienEspecialRef.current = new Audio(sonidoVictoria);
        sonidoAlienEspecialRef.current.volume = 0.5;
    }

    if (!sonidoExplosionRef.current) {
        sonidoExplosionRef.current = new Audio(sonidoExplosion);
        sonidoExplosionRef.current.volume = 0.5;
    }

    if (!sonidoFondoRef.current) {
        sonidoFondoRef.current = new Audio(sonidoFondo);
        sonidoFondoRef.current.volume = 0.2;
        sonidoFondoRef.current.loop = true;
    }

    // Función para reproducir un sonido
    const reproducir = (ref) => {
        const a = ref.current;
        if (!a) return;
        a.currentTime = 0;
        a.play().catch(() => {});
    };


    //*********************************//
    //FUNCIONES DE DIBUJO EN EL CANVAS//
    const dibujarRectangulo = ctx => {
        ctx.fillStyle = "#0b1020ac";
        ctx.beginPath();
        ctx.fillRect(0, 0, props.width, props.height);
    }

    const dibujarNave = ctx => {
        const img = naveImgRef.current;
        if (!img) return;
        ctx.drawImage(img, naveXRef.current, props.height - ALTURA_NAVE, ANCHO_NAVE, ALTURA_NAVE);
    };

    const dibujarAlien1 = (ctx, x, y) => {
        const img = alien1ImgRef.current;
        if (!img) return;
        ctx.drawImage(img, x, y, ANCHO_ALIEN, ALTURA_ALIEN);
    };

    const dibujarAlien2 = (ctx, x, y) => {
        const img = alien2ImgRef.current;
        if (!img) return;
        ctx.drawImage(img, x, y, ANCHO_ALIEN, ALTURA_ALIEN);
    };

    const dibujarAlien3 = (ctx, x, y) => {
        const img = alien3ImgRef.current;
        if (!img) return;
        ctx.drawImage(img, x, y, ANCHO_ALIEN, ALTURA_ALIEN);
    };

    const dibujarAliens = (ctx) => {
        for (const alien of aliensRef.current) {
            if (!alien.vivo) continue;

            if (alien.tipo === 1) dibujarAlien1(ctx, alien.x, alien.y);
            if (alien.tipo === 2) dibujarAlien2(ctx, alien.x, alien.y);
            if (alien.tipo === 3) dibujarAlien3(ctx, alien.x, alien.y);
        }
    };

    const dibujarBalas = (ctx) => {
        const img = balaNaveImgRef.current;
        if (!img) return;
        for (const bala of balasRef.current) {
            ctx.drawImage(img, bala.x, bala.y, ANCHO_BALA, ALTURA_BALA);
        }
    };

    const dibujarBalasAliens = (ctx) => {
        const img = balaAlienImgRef.current;
        if (!img) return;
        for (const bala of balasAliensRef.current) {
            ctx.drawImage(img, bala.x, bala.y, ANCHO_BALA, ALTURA_BALA);
        }
    };

    const dibujarEscudos = (ctx) => {
        for (const bloque of escudosRef.current) {
            if (bloque.vida <= 0) continue;

            if (bloque.vida === 2) {
                ctx.fillStyle = "rgba(0, 255, 255, 1)";
            } else if (bloque.vida === 1) {
                ctx.fillStyle = "rgba(0, 255, 255, 0.4)";
            }
            ctx.beginPath();
            ctx.roundRect(
                bloque.x,
                bloque.y,
                BLOQUE_ESCUDO,
                BLOQUE_ESCUDO,
                5 // radio de las esquinas
            );
            ctx.fill();

        }
    };

    const dibujarAlienEspecial = (ctx) => {
        const a = alienEspecialRef.current;
        if (!a) return;
        const img = alienEspecialImgRef.current;
        if (!img) return;

        ctx.drawImage(img, a.x, a.y, ALIEN_ESPECIAL_ANCHO, ALIEN_ESPECIAL_ALTO);
    };


    //******************************//
    //FUNCIONES DE LÓGICA DEL JUEGO//
    function iniciarAliens() {
        aliensRef.current = [];

        for (let i = 0; i < COLUMNAS_ALIENS; i++) {
            for (let j = 0; j < FILAS_ALIENS; j++) {
                let tipo = 1;
                if (j === 0) tipo = 3;
                if (j === 1) tipo = 2;
                if (j === 2 || j === 3) tipo = 1;

                aliensRef.current.push({
                    x: MARGEN_LATERAL_ALIENS + i * (ANCHO_ALIEN + ESPACIO_ENTRE_ALIENS_X), // espaciado entre columnas
                    y: MARGEN_SUPERIOR_ALIENS + j * (ALTURA_ALIEN + ESPACIO_ENTRE_ALIENS_Y), // espaciado entre filas
                    tipo, // 1, 2 o 3 (dibuja el alien correspondiente)
                    vivo: true
                });
            }
        }
    }

    function iniciarEscudos() {
        escudosRef.current = [];

        for (let i = 0; i < CANTIDAD_ESCUDOS; i++) {
            const baseX = ESPACIO_ESCUDOS + i * (ANCHO_ESCUDO + ESPACIO_ESCUDOS);

            for (let fila = 0; fila < ESCUDO_FILAS; fila++) {
                for (let col = 0; col < ESCUDO_COLUMNAS; col++) {
                    escudosRef.current.push({
                        x: baseX + col * BLOQUE_ESCUDO,
                        y: Y_ESCUDOS + fila * BLOQUE_ESCUDO,
                        vida: VIDA_BLOQUE_ESCUDO,
                    });
                }
            }
        }
    }

    const comprobarColisionesBalasConAliens = () => {
        // Nos quedamos con las balas que NO hayan chocado
        balasRef.current = balasRef.current.filter((bala) => {
            for (const alien of aliensRef.current) {
            if (!alien.vivo) continue;

                const choque =
                    bala.x < alien.x + ANCHO_ALIEN &&
                    bala.x + ANCHO_BALA > alien.x &&
                    bala.y < alien.y + ALTURA_ALIEN &&
                    bala.y + ALTURA_BALA > alien.y;

                if (choque) {
                    reproducir(sonidoAlienMuereRef);
                    alien.vivo = false;   // matamos el alien
                    if (alien.tipo === 1) { props.aumentarPuntos(10); }
                    if (alien.tipo === 2) { props.aumentarPuntos(20); }
                    if (alien.tipo === 3) { props.aumentarPuntos(30); }
                    return false;         // borramos la bala 
                }
            }
            return true; // la bala sigue viva
        });
    };

    const alienDispara = () => {
        const ahora = Date.now();

        // ¿ha pasado suficiente tiempo?
        if (ahora - ultimoDisparoAlienMsRef.current < cadenciaDisparoAlienMsRef.current) {
            return;
        }

        ultimoDisparoAlienMsRef.current = ahora;

        // elegir aliens vivos
        const aliensVivos = aliensRef.current.filter(a => a.vivo);
        if (aliensVivos.length === 0) return;

        // elegir uno al azar
        const alien = aliensVivos[Math.floor(Math.random() * aliensVivos.length)];

        // crear la bala (sale desde el centro del alien)
        balasAliensRef.current.push({
            x: alien.x + ANCHO_ALIEN / 2 - ANCHO_BALA / 2,
            y: alien.y + ALTURA_ALIEN
        });
    };


    const comprobarImpactoBalasAliensConNave = () => {
        const naveX = naveXRef.current;
        const naveY = props.height - ALTURA_NAVE;

        balasAliensRef.current = balasAliensRef.current.filter((bala) => {
            const choque =
            bala.x < naveX + ANCHO_NAVE &&
            bala.x + ANCHO_BALA > naveX &&
            bala.y < naveY + ALTURA_NAVE &&
            bala.y + ALTURA_BALA > naveY;

            if (choque) {
            if (typeof props.restarVida === "function") {
                reproducir(sonidoRestarVidaRef);
                props.restarVida(); // restar vida en App
            }
            return false; // borrar bala
            }

            return true; // la bala sigue
        });
    };

    function resetearAliensVivosArriba() {
        const vivos = aliensRef.current.filter(a => a.vivo);

        let idx = 0;
        for (let j = 0; j < FILAS_ALIENS; j++) {
            for (let i = 0; i < COLUMNAS_ALIENS; i++) {
                if (idx >= vivos.length) return;

                const alien = vivos[idx];
                alien.x = MARGEN_LATERAL_ALIENS + i * (ANCHO_ALIEN + ESPACIO_ENTRE_ALIENS_X);
                alien.y = MARGEN_SUPERIOR_ALIENS + j * (ALTURA_ALIEN + ESPACIO_ENTRE_ALIENS_Y);
                idx++;
            }
        }
    }


    const comprobarColisionAliensConNave = () => {
        const naveY = props.height - ALTURA_NAVE;
        for (const alien of aliensRef.current) {
            if (!alien.vivo) continue;
            if (alien.y + ALTURA_ALIEN >= naveY) {
                if (typeof props.restarVida === "function") {
                    reproducir(sonidoRestarVidaRef);
                    props.restarVida(); // restar vida en App
                    resetearAliensVivosArriba(); // vuelven los aliens arriba
                }
                break;
            }
        }
    };

    const comprobarColisionesBalasConEscudos = () => {
        // nos quedamos solo con las balas que NO chocan
        balasRef.current = balasRef.current.filter((bala) => {
            for (const bloque of escudosRef.current) {
                if (bloque.vida <= 0) continue;

                    const choque =
                        bala.x < bloque.x + BLOQUE_ESCUDO &&
                        bala.x + ANCHO_BALA > bloque.x &&
                        bala.y < bloque.y + BLOQUE_ESCUDO &&
                        bala.y + ALTURA_BALA > bloque.y;

                if (choque) {
                    bloque.vida -= 1;   // dañamos el bloque
                    return false;       // borramos la bala
                }
            }
            return true; // bala sigue
        });
    };

    const comprobarColisionesBalasAliensConEscudos = () => {

        balasAliensRef.current = balasAliensRef.current.filter((bala) => {
            for (const bloque of escudosRef.current) {
                if (bloque.vida <= 0) continue;

                    const choque =
                        bala.x < bloque.x + BLOQUE_ESCUDO &&
                        bala.x + ANCHO_BALA > bloque.x &&
                        bala.y < bloque.y + BLOQUE_ESCUDO &&
                        bala.y + ALTURA_BALA > bloque.y;

                if (choque) {
                    bloque.vida -= 1;  // dañamos el bloque
                    return false;      // borramos la bala alien
                }
            }
            return true;
        });
    };

    let velocidadAliens = VELOCIDAD_INICIAL_ALIENS;// velocidad inicial de los aliens

    const comprobarSiNoQuedanAliens = () => {
        const quedanVivos = aliensRef.current.some(alien => alien.vivo);
        if (!quedanVivos) {
            iniciarAliens();
            velocidadAliens = VELOCIDAD_INICIAL_ALIENS;
            balasRef.current = []; // borrar balas
            balasAliensRef.current = []; // borrar balas aliens
            cadenciaDisparoAlienMsRef.current = Math.max(200, cadenciaDisparoAlienMsRef.current - 100); //Tardan 100 ms menos en volver a disparar hasta minimo 200ms
        }
    };

    function intentarSacarAlienEspecial() {
        const ahora = Date.now();

        // si ya hay uno en pantalla, no sacamos otro
        if (alienEspecialRef.current) return;

        // si aún no toca por tiempo, no hacemos nada
        if (ahora - ultimoSpawnEspecialMsRef.current < ALIEN_ESPECIAL_CADA_MS) return;

        ultimoSpawnEspecialMsRef.current = ahora;

        // elegir si entra por la izquierda o por la derecha
        const entraPorIzquierda = Math.random() < 0.5;

        alienEspecialRef.current = {
            x: entraPorIzquierda ? -ALIEN_ESPECIAL_ANCHO : props.width + ALIEN_ESPECIAL_ANCHO,
            y: ALIEN_ESPECIAL_Y,
            dir: entraPorIzquierda ? 1 : -1, // 1 = derecha, -1 = izquierda
        };
    }

    function comprobarColisionBalaConAlienEspecial() {
        const a = alienEspecialRef.current;
        if (!a) return;

        balasRef.current = balasRef.current.filter((bala) => {
            const choque =
            bala.x < a.x + ALIEN_ESPECIAL_ANCHO &&
            bala.x + ANCHO_BALA > a.x &&
            bala.y < a.y + ALIEN_ESPECIAL_ALTO &&
            bala.y + ALTURA_BALA > a.y;

            if (choque) {
            // eliminar alien especial
            alienEspecialRef.current = null;

            // sumar puntos
            if (typeof props.aumentarPuntos === "function") {
                reproducir(sonidoExplosionRef);
                reproducir(sonidoAlienEspecialRef);
                props.aumentarPuntos(100);
            }

            return false; // borrar bala
            }

            return true; // bala sigue
        });
        }



    // useEffect → cargar imágenes 
    useEffect(() => {
        naveNormalRef.current = new Image();
        naveNormalRef.current.src = naveNormal;

        naveRota1Ref.current = new Image();
        naveRota1Ref.current.src = naveRota1;

        naveRota2Ref.current = new Image();
        naveRota2Ref.current.src = naveRota2;

        naveImgRef.current = naveNormalRef.current;

        alien1ImgRef.current = new Image();
        alien1ImgRef.current.src = alien1;

        alien2ImgRef.current = new Image();
        alien2ImgRef.current.src = alien2;

        alien3ImgRef.current = new Image();
        alien3ImgRef.current.src = alien3;

        balaNaveImgRef.current = new Image();
        balaNaveImgRef.current.src = balaNave;

        balaAlienImgRef.current = new Image();
        balaAlienImgRef.current.src = balaAlien;

        alienEspecialImgRef.current = new Image();
        alienEspecialImgRef.current.src = alienEspecial;
    }, []);

    useEffect(() => {
        const a = sonidoFondoRef.current;
        if (!a) return;
        a.play().catch(() => {});
        return () => {
            a.pause();
            a.currentTime = 0;
        };
    }, []);



    // useEffect → actualizar imagen de la nave según vidas
    useEffect(() => {
        if (props.vidas === 3) {
            naveImgRef.current = naveNormalRef.current;
        } else if (props.vidas === 2) {
            naveImgRef.current = naveRota1Ref.current;
        } else if (props.vidas === 1) {
            naveImgRef.current = naveRota2Ref.current;
        }
    }, [props.vidas]);



    //*******************************************************//
    //EFECTO PARA INICIALIZAR EL CANVAS Y GESTIONAR EL JUEGO//
    useEffect(() => {

        // Constantes para el juego
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Variable para controlar la actualización automática del canvas
        let actualizacionCanvasAutomatico = null;


        // Funcion para manejar las teclas pulsadas derecha e izquierda
        const keyDownHandler = (e) => {
            if (e.key === "ArrowLeft") izquierdaPulsadaRef.current = true;
            if (e.key === "ArrowRight") derechaPulsadaRef.current = true;

            if (e.key === " ") {
                const ahora = Date.now();

                // si no ha pasado suficiente tiempo, no disparo
                if (ahora - ultimoDisparoMsRef.current < cadenciaMsRef.current) return;

                // guardo el momento del disparo
                ultimoDisparoMsRef.current = ahora;

                // creo la bala
                const balaX = naveXRef.current + ANCHO_NAVE / 2 - 2;
                const balaY = props.height - ALTURA_NAVE;

                // añado la bala al array de balas
                balasRef.current.push({ x: balaX, y: balaY });

                // reproducir sonido disparo
                reproducir(sonidoDisparoRef);
            }
        };


        // Funcion para manejar las teclas soltadas derecha e izquierda
        const keyUpHandler = (e) => {
            if (e.key === "ArrowLeft") izquierdaPulsadaRef.current = false;
            if (e.key === "ArrowRight") derechaPulsadaRef.current = false;
        };

        window.addEventListener('keydown', keyDownHandler); // Agregar listener para cuando se presiona una tecla
        window.addEventListener('keyup', keyUpHandler); // Agregar listener para cuando se suelta una tecla

        // Función para actualizar la posición de la nave y redibujar el canvas
        const moverNave = () => {
            if (izquierdaPulsadaRef.current && naveXRef.current > 0) {
                naveXRef.current -= velocidadRef.current;
            }
            if (derechaPulsadaRef.current && naveXRef.current < props.width - ANCHO_NAVE) {
                naveXRef.current += velocidadRef.current;
            }
            dibujarNave(context);
        }

        // Función para actualizar la posición de las balas
        const actualizarBalas = () => {
            // subir cada bala
            for (const bala of balasRef.current) {
                bala.y -= 1; // velocidad de la bala 
            }

            // quedarnos solo con las que siguen dentro del canvas
            balasRef.current = balasRef.current.filter((bala) => bala.y > -20);
        };

        const actualizarBalasAliens = () => {
            for (const bala of balasAliensRef.current) {
                bala.y += 1; // velocidad hacia abajo 
            }

            // borrar las que salen por abajo
            balasAliensRef.current = balasAliensRef.current.filter(
                (bala) => bala.y < props.height + 20
            );
        };

        //Movimiento de los aliens
        let direccionX = 1; // 1: derecha, -1: izquierda
        const moverAliens = () => {
            let cambiarDireccion = false;
            for (const alien of aliensRef.current) {
                if (!alien.vivo) continue;
                alien.x += direccionX * velocidadAliens;
                // Comprobar si algún alien ha llegado al borde del canvas
                if (alien.x + ANCHO_ALIEN >= props.width || alien.x <= 0) {
                    cambiarDireccion = true;
                }
            }
            // Si algún alien ha llegado al borde, cambiar dirección y bajar
            if (cambiarDireccion) {
                direccionX *= -1;
                for (const alien of aliensRef.current) {
                    alien.y += BAJADA_ALIENS; // Bajar los aliens al cambiar de dirección
                    velocidadAliens += AUMENTO_VELOCIDAD_ALIENS; // Aumentar la velocidad de los aliens
                }
            }
        }

        function moverAlienEspecial() {
            const a = alienEspecialRef.current;
            if (!a) return;

            a.x += a.dir * ALIEN_ESPECIAL_VELOCIDAD;

            // si sale completamente, lo quitamos
            if (a.dir === 1 && a.x > props.width + ALIEN_ESPECIAL_ANCHO) {
                alienEspecialRef.current = null;
            }
            if (a.dir === -1 && a.x < -ALIEN_ESPECIAL_ANCHO * 2) {
                alienEspecialRef.current = null;
            }
        }



        iniciarAliens(); // Inicializar los aliens al montar el componente
        iniciarEscudos(); // Inicializar los escudos al montar el componente

        // Funcion para actualizar el canvas continuamente
            const actualizarCanvas = () => {
            context.clearRect(0, 0, props.width, props.height);
            dibujarRectangulo(context);

            // movimiento de nave y aliens
            moverNave();
            moverAliens();

            // alien especial            
            intentarSacarAlienEspecial();
            moverAlienEspecial();

            // disparos y movimiento de balas
            alienDispara();
            actualizarBalas();        // balas jugador suben
            actualizarBalasAliens();  // balas aliens bajan

            // colisiones
            comprobarColisionesBalasConEscudos();
            comprobarColisionesBalasAliensConEscudos();

            // colisiones con objetivos finales
            comprobarColisionesBalasConAliens();
            comprobarImpactoBalasAliensConNave();
            comprobarColisionAliensConNave();
            comprobarColisionBalaConAlienEspecial();
            comprobarSiNoQuedanAliens();

            // dibujar todo
            dibujarEscudos(context);
            dibujarAliens(context);
            dibujarBalas(context);
            dibujarBalasAliens(context);
            dibujarAlienEspecial(context);

            actualizacionCanvasAutomatico = requestAnimationFrame(actualizarCanvas);
        };


        actualizarCanvas(); // Iniciar la actualización automática del canvas

        // Limpiar los event listeners cuando el componente se desmonte
        return () => {
            window.removeEventListener("keydown", keyDownHandler);
            window.removeEventListener("keyup", keyUpHandler);
            if (actualizacionCanvasAutomatico) { cancelAnimationFrame(actualizacionCanvasAutomatico) };
        };
    }, []);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />; // Devolvemos el canvas con todo listo para usarse
}

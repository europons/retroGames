import { Canvas } from "../componentes/Canvas";

export default function Juego({ puntos, vidas, aumentarPuntos, restarVida }) {
  return (
    <div className="pagina-juego">
      <div className="info-juego">
        <p className="puntos">Puntos: {puntos}</p>
        <p className="puntos">Vidas: {vidas}</p>
      </div>

      <Canvas
        width={1200}
        height={800}
        aumentarPuntos={aumentarPuntos}
        restarVida={restarVida}
        vidas={vidas}
      />
    </div>
  );
}

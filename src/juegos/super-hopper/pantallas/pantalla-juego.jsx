export default function PantallaJuego(props) {
    return (
        <div id="game-screen">
            <div id="score-display">SCORE: <span id="score">{props.score}</span></div>
            <div id="game-container">Hola</div>
        </div>
    );
}
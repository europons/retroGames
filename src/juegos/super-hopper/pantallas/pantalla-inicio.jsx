export default function PantallaInicio(props) {
    return (
        <div id="game-screen">
            <div id="score-display" class="hidden">SCORE: <span id="score">{props.score}</span></div>
            <div id="start-screen" class="center-screen">
                <h1 class="title">SUPER HOPPER</h1>
                <p class="subtitle">MY CUTE ADVENTURE</p>
                <button id="start-btn" onClick={props.iniciarPartida}>PRESS START</button>
            </div>
            <div id="game-container"></div>
        </div>
    );
}
export default function PantallaInicio(props) {
    return (
        <div>
            <div id="score-display" className="hidden">SCORE: <span id="score">{props.score}</span></div>
            <div id="start-screen" className="center-screen">
                <h1 className="title">SUPER HOPPER</h1>
                <p className="subtitle">MY CUTE ADVENTURE</p>
                <button id="start-btn" onClick={props.iniciarPartida}>PRESS START</button>
            </div>
        </div>
    );
}
export default function GameOver(props) {
    return (
        <div id="game-over-screen" className="center-screen">
            <h1 className="title">GAME OVER</h1>
            <p className="subtitle">SCORE: <span id="final-score">{props.score}</span></p>
            <button id="restart-btn">TRY AGAIN</button>
        </div>
    );
}
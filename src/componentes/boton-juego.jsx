export default function BotonJuego(props) {
  return (
    <button type="button" onClick={props.onClick}>
      <img src={props.image} alt={props.title} />
    </button>
  );
}
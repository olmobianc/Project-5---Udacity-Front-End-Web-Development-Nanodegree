import { addTrip } from "./js/app.js"
import './styles/style.scss'

document.getElementById("button-trip").addEventListener('click', addTrip);

export { addTrip }
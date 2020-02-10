import Beeper from './beep.mod.js';
import ArrowCanvas from './canvas.mod.js';
import PositionHandler from './position.mod.js';

const FAIL_COLOUR = '#C62828';
const SUCCESS_COLOUR = '#4CAF50';
const DISABLED_COLOUR = '#90A4AE';

window.onload = () => {
  console.log('loaded');

  // Initialise beeper
  const beeper = new Beeper({ duration: 0.5, updateRate: 10 });

  // Vibration needs at least one user interaction to activate
  document.body.addEventListener('mouseup', () => {
    beeper.started ? beeper.setPointer() : beeper.start();
    document.getElementById('beep-indicator').style.color = SUCCESS_COLOUR;
    arrowDrawer.setPointer(beeper.pointer);
  });

  // Initialise drawing stuff
  const canvas = document.getElementById('arrow-canvas');
  const arrowDrawer = new ArrowCanvas({
    canvas,
    colour: '#FFFFFF',
    shadow: 'rgba(0, 0, 0, 0.7)',
    proportional: 4,
  });

  // Init position handler
  const positionHandler = new PositionHandler(window, (angle) => {
    arrowDrawer.setAngle(angle);
    beeper.setBearing(angle);
  });

  // Everything is contingent on position handler working
  if(!positionHandler.initSuccess) {
    document.getElementById('compass-indicator').style.color = FAIL_COLOUR;
    document.body.style.backgroundColor = DISABLED_COLOUR;
    canvas.style.display = 'none';
  }
};

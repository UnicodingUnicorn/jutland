export default class PositionHandler {
  constructor(window, cb) {
    this.alphas = [];
    const eventHandler = (event) => {
      const alpha = event.alpha; //Yaw (The one we want)
      this.alphas.push(alpha);
      const diff = alpha - this.alphas[this.alphas.length - 2];
      if(diff >= 180)
        this.alphas = [alpha];
      if(this.alphas.length > 10)
        this.alphas.shift();
      const angle = this.alphas.reduce((a, x) => a + x) / this.alphas.length;
      cb(angle);
    };

    // if (window.DeviceOrientationEvent && 'ontouchstart' in window) {
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', eventHandler);
      this.initSuccess = true;
    } else if ('ondeviceorientation' in window) {
      window.addEventListener('deviceorientation', eventHandler);
      this.initSuccess = true;
    } else {
      this.initSuccess = false;
    }
  }
}

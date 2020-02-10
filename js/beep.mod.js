export default class Beeper {
  constructor({ duration, updateRate }) {
    this.context = new AudioContext();
    this.duration = duration;
    this.updateRate = updateRate;

    this.bearing = 0;
    this.pointer = 0;
    this.started = false;

    this.posX = window.innerWidth / 2;
    this.posY = window.innerHeight / 2;
    this.posZ = 0;

    this.context.listener.positionX.value = this.posX;
    this.context.listener.positionY.value = this.posY;
    this.context.listener.positionZ.value = this.posZ;

    this.context.listener.forwardX.value = 0;
    this.context.listener.forwardY.value = 0;
    this.context.listener.forwardZ.value = -1;
    this.context.listener.upX.value = 0;
    this.context.listener.upY.value = 1;
    this.context.listener.upZ.value = 0;

    this.pannerNode = new PannerNode(this.context, {
      pannerModel: 'HRTF',
      coneInnerAngle: 360,
      coneOuterAngle: 0,
      coneOuterGain: 1.0,
      distanceModel: 'linear',
      maxDistance: 10000,
      refDistance: 1,
      rolloffFactor: 10,
      positionX: this.posX,
      positionY: this.posY,
      positionZ: this.posZ,
      orientationX: 0.0,
      orientationY: 0.0,
      orientationZ: -1.0,
    });
  }

  setBearing(bearing) {
    this.bearing = bearing;
  }

  setPointer() {
    this.pointer = this.bearing;
  }

  start() {
    this.started = true;

    const run = () => {
      const radians = (this.bearing - this.pointer) * Math.PI / 180.0;
      this.pannerNode.positionX.value = this.posX + Math.sin(radians) * 300;
      this.pannerNode.positionZ.value = this.posZ + Math.cos(radians) * 300;

      setTimeout(run, this.updateRate);
    };

    const beepOnce = () => {
      this.beep(this.duration);
      setTimeout(beepOnce, this.duration * 1000);
    };

    beepOnce();
    run();
  }

  beep(duration) {
    const o = this.context.createOscillator();
    const g = this.context.createGain();

    o.connect(g).connect(this.pannerNode).connect(this.context.destination);
    o.type = 'sine';
    o.onended = () => {
      g.disconnect(this.pannerNode);
      o.disconnect(g);
    };

    g.gain.setValueAtTime(g.gain.value, this.context.currentTime);
    g.gain.exponentialRampToValueAtTime(0.00001, this.context.currentTime + duration);

    o.start(this.context.currentTime);
    o.stop(this.context.currentTime + duration);
  }
}

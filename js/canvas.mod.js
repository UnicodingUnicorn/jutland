const rad30 = 60 * Math.PI / 180;
const rad60 = 30 * Math.PI / 180;

export default class ArrowCanvas {
  constructor({ canvas, colour, shadow, proportional, height }) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.colour = colour;
    this.shadow = shadow;
    this.angle = 0;
    this.pointer = 0;
    this.height = height || (proportional ? this.canvas.height / proportional : 0);

    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight - 5;
    window.addEventListener('resize', () => {
      this.canvas.width = document.body.clientWidth;
      this.canvas.height = document.body.clientHeight - 5;
      this.draw();
    });
  }

  setHeightProportional(divisor) {
    this.height = this.canvas.height / divisor;
  }

  setHeight(height) {
    this.height = height;
  }

  setAngle(angle) {
    this.angle = angle;
    this.draw();
  }

  setPointer(pointer) {
    this.pointer = pointer;
    this.draw();
  }

  draw() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawArrow();
    this.drawPointer();
  }

  drawPointer() {
    const radians = (this.pointer - 90) * Math.PI / 180.0;
    const x = (this.canvas.width / 2) + Math.cos(radians) * (this.height + 25);
    const y = (this.canvas.height / 2) + Math.sin(radians) * (this.height + 25);

    this.context.beginPath();
    this.context.fillStyle = '#FF0000';
    this.context.arc(x, y, 2, 0, 2 * Math.PI, false);
    this.context.fill();
  }

  drawArrow() {
    const canvas_half_width = this.canvas.width / 2;
    const canvas_half_height = this.canvas.height / 2;

    const radians = this.angle * Math.PI / 180;

    const short_length = (this.height / 4) / Math.cos(rad30);
    const half_width = (this.height / 4) * Math.tan(rad30);
    const long_length = Math.sqrt(half_width * half_width + this.height * this.height);

    this.context.beginPath();
    this.context.fillStyle = this.colour;
    this.context.strokeStyle = this.colour;
    this.context.lineWidth = 5;

    this.context.shadowColor = this.shadow;
    this.context.shadowBlur = 7;
    this.context.shadowOffsetX = 7;
    this.context.shadowOffsetY = 7;

    let x = canvas_half_width;
    let y = canvas_half_height;
    this.context.moveTo(x, y);

    x += short_length * Math.cos(radians + rad60);
    y += short_length * Math.sin(radians + rad60);
    this.context.lineTo(x, y);

    const long_angle = Math.atan(this.height / half_width);
    x += long_length * Math.cos((Math.PI + long_angle) + radians);
    y += long_length * Math.sin((Math.PI + long_angle) + radians);
    this.context.lineTo(x, y);

    const top_angle = Math.PI - long_angle;
    x += long_length * Math.cos(top_angle + radians);
    y += long_length * Math.sin(top_angle + radians);
    this.context.lineTo(x, y);

    this.context.lineTo(canvas_half_width, canvas_half_height);

    this.context.fill();

    //Reset shadow
    this.context.shadowBlur = 0;
    this.context.shadowOffsetX = 0;
    this.context.shadowOffsetY = 0;

    this.context.stroke();
  }
}

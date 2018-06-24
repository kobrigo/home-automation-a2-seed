var config = require('../config');
var gpio

if (config.developmentMode) {
  gpio = require("../onoff-mock").Gpio;
} else {
  gpio = require("onoff").Gpio;
}

function StepperMotorController(stepperPinsNumbers, homePin) {
  this.homePin = homePin;
  this.pins = [];

  this.homePosition = 0;
  this.currentPosition = 0;
  this.homePositionReached = false;

  this.stepCounter = 0;
  this.stepTimeout = 0.01;
  this.stepCount = 8;

  this.Seq = [];
  this.Seq[0] = [1,0,0,0];
  this.Seq[1] = [1,1,0,0];
  this.Seq[2] = [0,1,0,0];
  this.Seq[3] = [0,1,1,0];
  this.Seq[4] = [0,0,1,0];
  this.Seq[5] = [0,0,1,1];
  this.Seq[6] = [0,0,0,1];
  this.Seq[7] = [1,0,0,1];

  if (!stepperPinsNumbers || stepperPinsNumbers.length != 4 || !homePin) {
    throw new Error('stepperPinsNumbers or homePin was not defined');
  }

  this.setupPins(stepperPinsNumbers);
}

StepperMotorController.prototype.setupPins = function (pinsNumbers) {
  pinsNumbers.forEach(function (pin) {
    this.pins.push(new gpio(pin, 'out'));
  }.bind(this));
};

StepperMotorController.prototype.step = function () {

  for (let pin = 0; pin < 4; pin++) {
    if (this.Seq[this.stepCounter][pin] !== 0) {
      this.pins[pin].writeSync(1);
    } else {
      this.pins[pin].writeSync(0);
    }
  }
  this.stepCounter += 1
  if (this.stepCounter === this.stepCount) {
    this.stepCounter = 0;
  }
  if (this.stepCounter < 0) {
    this.stepCounter = this.stepCount;
  }
};

StepperMotorController.prototype.calibrate = function (clockWise) {
  clockWise = clockWise || true;
  this._calibrateLoop(clockWise);
};

StepperMotorController.prototype._calibrateLoop = function (clockWise) {
  if (!this.homePositionReached)  {
    this.step();
  }

  setTimeout(function() {
    this._calibrateLoop();
  }.bind(this), this.stepTimeout);
};

module.exports = StepperMotorController;

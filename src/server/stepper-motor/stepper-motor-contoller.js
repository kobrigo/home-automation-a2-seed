var config = require('../config');
var gpio

if (config.developmentMode) {
  gpio = require("../onoff-mock").Gpio;
} else {
  gpio = require("onoff").Gpio;
}

function StepperMotorController(stepperPinsNumbers, homePin) {
  this.homePin = homePin; //the actual gpio pin
  this.pins = []; //the actual gpio pin
  this.homePosition = 0;
  this.currentPosition = undefined;
  this.reachedHomePosition = false;
  this.offsetFromHomeInSteps = 0;
  this.numberOfStepsToMoveAwayFromHomeWhenReached = 3;
  this.calibrating = false;
  this.calibrated = false;
  this.inMotion = false;
  this.pendingStop = false;
  this.maxPosition = 90;

  this.stepCounter = 0;
  this.stepTimeout = 0.01;
  this.stepCount = 8;

  this.Seq = [];
  this.Seq[0] = [1, 0, 0, 0];
  this.Seq[1] = [1, 1, 0, 0];
  this.Seq[2] = [0, 1, 0, 0];
  this.Seq[3] = [0, 1, 1, 0];
  this.Seq[4] = [0, 0, 1, 0];
  this.Seq[5] = [0, 0, 1, 1];
  this.Seq[6] = [0, 0, 0, 1];
  this.Seq[7] = [1, 0, 0, 1];

  if (!stepperPinsNumbers || stepperPinsNumbers.length != 4 || !homePin) {
    throw new Error('stepperPinsNumbers or homePin was not defined');
  }

  this.stepperPinsNumbers = stepperPinsNumbers;
  this.homePin = homePin;

  this.setupPins(this.stepperPinsNumbers);
}

StepperMotorController.prototype.setupPins = function (pinsNumbers) {
  pinsNumbers.forEach(function (pin) {
    this.pins.push(new gpio(pin, 'out'));
  }.bind(this));
};

StepperMotorController.prototype.init = function () {
  this.sendSignalToPins();
}

StepperMotorController.prototype.sendSignalToPins = function () {
  for (let pin = 0; pin < 4; pin++) {
    if (this.Seq[this.stepCounter][pin] !== 0) {
      //set the pin that needs to be set as 1 as 1;
      this.pins[pin].writeSync(1);
    } else {
      //the rest of the pins should be set to 0
      this.pins[pin].writeSync(0);
    }
  }
}

StepperMotorController.prototype.step = function (clockWise) {
  if (clockWise === undefined || clockWise === null) {
    clockWise = true;
  }

  var incrementDirection = clockWise ? 1 : -1;
  this.stepCounter += incrementDirection

  //make it cyclic
  if (clockWise) {
    if (this.stepCounter === this.stepCount) {
      this.stepCounter = 0;
    }
  } else {
    if (this.stepCounter < 0) {
      this.stepCounter = this.stepCount - 1;
    }
  }

  this.sendSignalToPins();
};

StepperMotorController.prototype.calibrate = function (clockWise, callbackFunction) {
  this.calibrating = true;
  if (clockWise === undefined || clockWise === null) {
    clockWise = true;
  }

  this._calibrateLoop(clockWise, callbackFunction);
};

StepperMotorController.prototype._moveAwayFromHomeLoop = function (clockWise, callbackFunction) {
  var incrementDirection = clockWise ? 1 : -1;
  if (this.offsetFromHomeInSteps !== this.numberOfStepsToMoveAwayFromHomeWhenReached) {
    this.homePosition += incrementDirection;
    this.offsetFromHomeInSteps++;
    this.step(clockWise);

    setTimeout(function () {
      this._moveAwayFromHomeLoop(clockWise, callbackFunction);
    }.bind(this), this.stepTimeout);
  } else {
    console.log('calibrated successfully'); //TODO add logging
    this.calibrating = false;
    this.calibrated = true;
    this.currentPosition = 0;

    if (typeof callbackFunction == 'function') {
      callbackFunction();
    }
  }
};

StepperMotorController.prototype._calibrateLoop = function (clockWise, callbackFunction) {
  if (!this.reachedHomePosition) {
    this.homePosition++;
    this.step(clockWise);

    //continue the loop
    setTimeout(function () {
      this._calibrateLoop(clockWise, callbackFunction);
    }.bind(this), this.stepTimeout);

  } else {
    //stop the calibrate loop and start a sequence of moving away from the home position just a little bit.
    this.offsetFromHomeInSteps = 0;
    this._moveAwayFromHomeLoop(!clockWise, callbackFunction);
  }
};


StepperMotorController.prototype._moveToPositionLoop = function (positionToMoveTo, finishedCallback) {
  var directionToGoToIsClockWise = this.currentPosition < positionToMoveTo;
  var positionIncement = directionToGoToIsClockWise ? 1 : -1;

  if (this.currentPosition === positionToMoveTo) {
    this.inMotion = false;
    finishedCallback();
  } else {
    this.step(directionToGoToIsClockWise);
    this.currentPosition += positionIncement;

    if (this.currentPosition < 0 || this.currentPosition > this.maxPosition) {
      throw new Error('position to move to is out of bounds. This should not have happened')
    }

    setTimeout(function () {
      this._moveToPositionLoop(positionToMoveTo, finishedCallback);
    }.bind(this), this.stepTimeout);
  }
};

StepperMotorController.prototype.moveToPosition = function (positionToMoveTo, finishedCallback) {
  if (!this.calibrated) {
    throw new Error('Tried to move to a position before calibrating');
  }

  this.inMotion = true;

  this._moveToPositionLoop(positionToMoveTo, finishedCallback);
};

StepperMotorController.prototype.startMoving = function (clockWise) {
  this.inMotion = true;
};


StepperMotorController.prototype._moveLoop = function (clockWise, stoppedCallback) {
  var positionIncement = clockWise ? 1 : -1;

  if (this.currentPosition < 0 || this.currentPosition > this.maxPosition || this.pendingStop) {
    this.pendingStop = false;
    this.inMotion = false;
    if (typeof stoppedCallback == 'function') {
      stoppedCallback();
    }
    return;
  } else {
    this.currentPosition += positionIncement;
    this.step(clockWise);

    setTimeout(function() {
      this._moveLoop(clockWise);
    })
  }
}

StepperMotorController.prototype.stopMoving = function (clockWise) {
  this.pendingStop = true;
};

module.exports = StepperMotorController;

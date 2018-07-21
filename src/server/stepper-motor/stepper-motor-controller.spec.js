const StepperMotorController = require('./stepper-motor-contoller').StepperMotorController;
var sinon = require('sinon');
var expect = require('chai').expect;

describe('StepperMotorController', function () {
  var stepperMotorController;
  var clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    stepperMotorController = new StepperMotorController([1, 2, 3, 4], 5);
    stepperMotorController.stepTimeout = 1; //this is done just for testing since the tick will not accept floats.
    stepperMotorController.pins.forEach(function (pin) {
      sinon.spy(pin, 'writeSync')
    });
    stepperMotorController.init();

    sinon.spy(stepperMotorController, 'step');
  });

  afterEach(function () {
    clock.restore();
  });

  it('should throw an exception if the pins or the homepin was not supplied', () => {
    expect(function () {
      stepperMotorController = new StepperMotorController([1, 2, 3, 4]);
    }).to.throw();

    expect(function () {
      stepperMotorController = new StepperMotorController();
    }).to.throw();
  });

  it('should instantiate all the pins given to it on the constructor', function () {
    expect(stepperMotorController.pins.length).to.equal(4);
  });

  it('should call the initial signal to the pins when starting up', function () {
    expect(stepperMotorController.pins[0].writeSync.calledOnce).to.equal(true);
    expect(stepperMotorController.pins[1].writeSync.calledOnce).to.equal(true);
    expect(stepperMotorController.pins[2].writeSync.calledOnce).to.equal(true);
    expect(stepperMotorController.pins[3].writeSync.calledOnce).to.equal(true);
    expect(stepperMotorController.pins[0].writeSync.withArgs(1).calledOnce).to.equal(true);
    expect(stepperMotorController.pins[1].writeSync.withArgs(0).calledOnce).to.equal(true);
    expect(stepperMotorController.pins[2].writeSync.withArgs(0).calledOnce).to.equal(true);
    expect(stepperMotorController.pins[3].writeSync.withArgs(0).calledOnce).to.equal(true);
  });

  describe('step', function () {
    it('should move the stepper motor one step at a time', function () {
      stepperMotorController.step();
      expect(stepperMotorController.pins[0].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[0].writeSync.withArgs(1).calledTwice).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.withArgs(1).calledOnce).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.withArgs(0).calledTwice).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.withArgs(0).calledTwice).to.equal(true);

      stepperMotorController.step();
      expect(stepperMotorController.pins[0].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.lastCall.calledWith(1)).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.lastCall.calledWith(0)).to.equal(true);

      stepperMotorController.step();
      expect(stepperMotorController.pins[0].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.lastCall.calledWith(1)).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.lastCall.calledWith(1)).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.lastCall.calledWith(0)).to.equal(true);
    });

    it('should go back to the beginning of the sequence once it reached the end of it', function () {
      for (var i = 0; i < stepperMotorController.stepCount - 1; i++) { //minus 1 since in the init we set the pins to the initial sequence
        stepperMotorController.step();
      }
      //by now the last step on the sequence have been sent to the pins

      stepperMotorController.step(); //this step should go back the the beginning of the sequence
      expect(stepperMotorController.pins[0].writeSync.lastCall.calledWith(1)).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.lastCall.calledWith(0)).to.equal(true);
    });

    it('should set counter clockwise if clockwise parameter is set to false', function () {
      stepperMotorController.step(false);
      expect(stepperMotorController.pins[0].writeSync.lastCall.calledWith(1)).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.lastCall.calledWith(1)).to.equal(true);

      stepperMotorController.step(false);
      expect(stepperMotorController.pins[0].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.lastCall.calledWith(0)).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.lastCall.calledWith(1)).to.equal(true);
    });

  });

  describe('calibrate', function () {
    it('should start to move towards the home position and stop when the home position triggers', function () {
      stepperMotorController.stepTimeout = 1; //this is done just for testing since the tick will not accept floats.
      stepperMotorController.calibrate(false);
      expect(stepperMotorController.step.calledOnce).to.equal(true);

      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(2);

      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(3);

      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(4);

      //simulate that we have reached the home position
      //TODO simulate this with the output from the pin not by changing the internal state
      stepperMotorController.reachedHomePosition = true;
      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(5);
      expect(stepperMotorController.step.lastCall.calledWith(true)).to.equal(true);

      //now it should start the small sequence of moving away from the home stopping pin 3 steps //TODO make 3 a parameter
      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(6);
      expect(stepperMotorController.step.lastCall.calledWith(true)).to.equal(true);
      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(7);
      expect(stepperMotorController.step.lastCall.calledWith(true)).to.equal(true);
      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(7);
    });

    it('should call the calibration callback function to signal it is done', function (done) {
      stepperMotorController.calibrate(false, function () {
        done();
      });
      clock.tick(stepperMotorController.stepTimeout);
      stepperMotorController.reachedHomePosition = true;
      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
    });

    it('should calibrate also when the home position is right from the start', function (done) {
      stepperMotorController.reachedHomePosition = true;
      stepperMotorController.calibrate(false, function () {
        done();
      });

      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
    });
  });

  describe('moveToPosition', function () {
    beforeEach(function (done) {
      stepperMotorController.calibrate(false, function () {
        done();
      });
      clock.tick(stepperMotorController.stepTimeout);
      stepperMotorController.reachedHomePosition = true;
      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
      clock.tick(stepperMotorController.stepTimeout);
    });

    it('should throw an exception if it is called before a calibration is done', function () {
      stepperMotorController = new StepperMotorController([1, 2, 3, 4], 5);

      expect(function () {
        stepperMotorController.moveToPosition(45, function () {
        });
      }).to.throw();
    });

    it('should move to the requested position and call the given callback when done', function (done) {
      expect(stepperMotorController.inMotion).to.equal(false);

      stepperMotorController.moveToPosition(45, function () {
        expect(stepperMotorController.currentPosition).to.equal(45);
        expect(stepperMotorController.inMotion).to.equal(false);
        done();
      });

      expect(stepperMotorController.inMotion).to.equal(true);

      clock.tick(stepperMotorController.stepTimeout * 45);
    });

    it('should return error if the request to move to position is out of bounds in the first place', function () {
      // expect(true).to.equal(false);
    });
  });

  describe('startMoveing and stopMoveing', function (done) {
    it('startMove should start the movement to the direction that is asked, continuing till stopMoved is called', function () {
      stepperMotorController.startMoving(true, function() {
        done();
      });
      let positionAtStart = stepperMotorController.currentPosition;
      expect(positionAtStart).to.equal(1); //since it was not calibrated it should start as 0 and immediately run one iteration of the move;

      expect(stepperMotorController.inMotion).to.equal(true);
      expect(stepperMotorController.pendingStop).to.equal(false);

      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.currentPosition).to.equal(positionAtStart + 1);

      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.currentPosition).to.equal(positionAtStart + 2);

      stepperMotorController.stopMoving();
    });

    it('should stop of it reaches the right limit', function () {

    });

    it('should stop if it reaches the left limit', function () {

    });

  });

});
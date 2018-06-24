const StepperMotorController = require('./stepper-motor-contoller');
var sinon = require('sinon');
var expect = require('chai').expect;

describe('StepperMotorController', function () {
  var stepperMotorController;
  var clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    stepperMotorController = new StepperMotorController([1, 2, 3, 4], 5);
    stepperMotorController.pins.forEach(function(pin) {
      sinon.spy(pin, 'writeSync')
    });

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

  describe('step', function () {
    it('should move the stepper motor one step at a time', function () {
      stepperMotorController.step();
      expect(stepperMotorController.pins[0].writeSync.calledOnce).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.calledOnce).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.calledOnce).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.calledOnce).to.equal(true);
      expect(stepperMotorController.pins[0].writeSync.withArgs(1).calledOnce).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.withArgs(0).calledOnce).to.equal(true);

      stepperMotorController.step();
      expect(stepperMotorController.pins[0].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[2].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[3].writeSync.calledTwice).to.equal(true);
      expect(stepperMotorController.pins[0].writeSync.withArgs(1).calledTwice).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.withArgs(1).calledOnce).to.equal(true);
      expect(stepperMotorController.pins[1].writeSync.withArgs(0).calledOnce).to.equal(true);
    });

  });

  describe('calibrate', function () {
    it('should start to move towards the home position and stop when the home position triggers', function () {
      stepperMotorController.calibrate();
      expect(stepperMotorController.step.calledOnce).to.equal(true);

      clock.tick(stepperMotorController.stepTimeout);
      expect(stepperMotorController.step.callCount).to.equal(2);

      clock.tick(stepperMotorController.stepTimeout * 6);
      expect(stepperMotorController.step.callCount).to.equal(3);
    });
  });

});
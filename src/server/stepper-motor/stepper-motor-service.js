var SetpperMotoroController = require('./stepper-motor-contoller').StepperMotorController;
var logger = require('../logger').createPrefixedLogger('StepperMotorService:');
logger.log('starting up');
var yawController = new SetpperMotoroController([24,25,8,7], 16, 'YawController:');
yawController.debugMode = true;
// yawController.stepTimeout = 1;

module.exports = {
  yawController: yawController
};


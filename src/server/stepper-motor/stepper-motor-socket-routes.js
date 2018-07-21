var stepperMotorService = require('./stepper-motor-service');
var logger = require('../logger').createPrefixedLogger('StepperMotorRouter:');

module.exports.init = function (socketio) {
  socketio.on('connection', function (socket) {

    socket.on('yaw:startMoveRight', function () {
      logger.log('yaw:startMoveRight');
      stepperMotorService.yawController.startMoving(true);
    });

    socket.on('yaw:stopMove', function () {
      logger.log('yaw:stopMove');
      stepperMotorService.yawController.stopMoving();
    });

    socket.on('yaw:startMoveLeft', function () {
      logger.log('yaw:startMoveLeft');
      stepperMotorService.yawController.startMoving(false);
    });
  });
}

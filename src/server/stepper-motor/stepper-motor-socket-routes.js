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

    socket.on('yaw:moveToPosition', function (event) {
      logger.log('yaw:moveToPosition');
      if (!event.position || isNaN(event.position)) {
        logger.error('yaw:moveToPosition position was not supplied on the event, or it`s not a number');
        return;
      }

      stepperMotorService.yawController.moveToPosition(event.position);
    });

    socket.on('yaw:calibrate', function (event) {
      logger.log('yaw:calibrate');
      var calibrateClockwise = false;
      stepperMotorService.yawController.calibrate(calibrateClockwise, function() {
        logger.log('calibration ' + (calibrateClockwise? 'clockwise': 'counterclockwise') + ' has finished');
        socket.emit('yaw:calibrate finished');
      });
    });

  });
}

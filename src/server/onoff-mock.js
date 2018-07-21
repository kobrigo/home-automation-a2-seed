var logger = require('./logger').createPrefixedLogger('OnOffMock:');
logger.disable(true);

module.exports = {
  Gpio: function (pin, config) {
    var _pin = pin;
    this.writeSync = function (value) {
      logger.log('writeSync pin:' + _pin  + ' value: ' + value);
    };
  }
};

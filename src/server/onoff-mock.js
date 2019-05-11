var logger = require('./logger').createPrefixedLogger('OnOffMock:');
logger.disable(false);

module.exports = {
  Gpio: function (pin, config) {
    var _pin = pin;
    this._watchCallback = null;
    this.writeSync = function (value) {
      logger.log('writeSync pin:' + _pin  + ' value: ' + value);
    };

    this.watch = function(callback) {
      logger.log('watching pin:' + _pin);
      this.watchCallback = callback;
    };
  }
};

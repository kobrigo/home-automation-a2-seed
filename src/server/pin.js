/* global require,console,module */
module.exports = (function () {
    'use strict';
    var config = require('./config');
    var logger = require('./logger');
    var when = require('when');

    var gpio;
    if(config.developmentMode){
        gpio = require('./rpi-gpio-mock');
    } else {
        gpio = require('rpi-gpio');
    }

    function Pin(pinConfig) {
        this.id = pinConfig.id;
        this.workMode = pinConfig.workMode;
        this.state = 0;
    }

    Pin.prototype.open = function () {
        var defer = when.defer();
        var that = this;
        logger.log('Opening pin: ' + this.id);
        var gpioWorkMode = this.workMode === 'output' ? gpio.DIR_OUT : gpio.DIR_IN;
        gpio.setup(this.id, gpioWorkMode, function (error) {
            if (error) {
                defer.reject(new Error('Could not open pin: ' + that.id + 'for work model: ' + that.workMode + ' error: ' + error));
                return;
            }

            defer.resolve(that);
        });

        return defer.promise;
    };

    Pin.prototype.write = function (value) {
        var defer = when.defer();
        var that = this;
        logger.log('Writing to pin: ' + this.id + ' value: ' + value);
        gpio.write(this.id, value, function (error) {
            if (error) {
                defer.reject(new Error('Could not write to pin: ' + that.id + 'with value: ' + value + ' error: ' + error));
                return;
            }

            defer.resolve(value);
        });

        return defer.promise;
    };

    Pin.prototype.read = function () {
        var defer = when.defer();
        var that = this;
        gpio.read(this.id, function (error, value) {
            if (error) {
                defer.reject(new Error('Could not read from pin: ' + that.id + ' error: ' + error));
                return;
            }

            defer.resolve(value);
        });

        return defer.promise;
    };

    return Pin;
})();



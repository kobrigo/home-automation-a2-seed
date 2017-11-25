var logger = require('./logger');

module.exports = (function () {
    'use strict';
    var CONSTANTS = {
        DIR_IN: 'DIR_IN',
        DIR_OUT: 'DIR_OUT',
    };

    var _pins = [
        {value: false, direction: 'output', state: 'close'},//2
        {value: false, direction: 'output', state: 'close'},//1
        {value: false, direction: 'output', state: 'close'},//3
        {value: false, direction: 'output', state: 'close'},//4
        {value: false, direction: 'output', state: 'close'},//5
        {value: false, direction: 'output', state: 'close'},//6
        {value: false, direction: 'output', state: 'close'},//7
        {value: false, direction: 'output', state: 'close'},//8
        {value: false, direction: 'output', state: 'close'},//9
        {value: false, direction: 'output', state: 'close'},//10
        {value: false, direction: 'output', state: 'close'},//11
        {value: false, direction: 'output', state: 'close'},//12
        {value: false, direction: 'output', state: 'close'},//13
        {value: false, direction: 'output', state: 'close'},//14
        {value: false, direction: 'output', state: 'close'},//15
        {value: false, direction: 'output', state: 'close'},//16
        {value: false, direction: 'output', state: 'close'},//17
        {value: false, direction: 'output', state: 'close'},//18
    ];

    function checkPinNumber(pinNumber, callback) {
        if (pinNumber < 0 && pinNumber > 18) {
            callback('emulator: pinNumber not supported: ' + pinNumber);
            return false;
        }

        return true;
    }

    function checkDirection(direction, callback) {
        if (direction !== CONSTANTS.DIR_IN && direction !== CONSTANTS.DIR_OUT) {
            callback('emulator: wrong direction: ' + direction);
            return false;
        }

        return true;
    }

    logger.log('loadin pi-gpio-mock module');

    return {

        DIR_IN: CONSTANTS.DIR_IN,
        DIR_OUT: CONSTANTS.DIR_OUT,

        setup: function (pinNumber, direction, callback) {
            if (!checkPinNumber(pinNumber, callback)) {
                return;
            }

            if (!checkDirection(direction, callback)) {
                return;
            }

            //this is a mock just store the state so we can query for it later
            _pins[pinNumber].direction = direction;
            _pins[pinNumber].state = 'open';
            callback();
        },

        destroy: function (callback) {
           if (callback && typeof callback === 'function') {
               callback();
           }
        },

        close: function (pinNumber, callback) {
            if (!checkPinNumber(pinNumber, callback)) {
                return;
            }

            _pins[pinNumber].state = 'close';
            callback();

        },

        read: function (pinNumber, callback) {
            if (!checkPinNumber(pinNumber, callback)) {
                return;
            }

            callback(null, _pins[pinNumber].value);

        },

        write: function (pinNumber, value, callback) {
            if (!checkPinNumber(pinNumber, callback)) {
                return;
            }

            _pins[pinNumber].value = value;
            callback();
        }
    };
})();

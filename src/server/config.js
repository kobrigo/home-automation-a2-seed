var argv = require('optimist').argv;

module.exports = (function () {
    'use strict';

    return  {
        portToListenTo : argv.port || 4000,
        // developmentMode: argv.development !== undefined? argv.development : false,
        developmentMode: false,
        gpioPins: [
            {
                id: 7,
                workMode: 'output',
                initialState: 1,
                endingState: 1
            },
            {
                id: 11,
                workMode: 'output',
                initialState: 1,
                endingState: 1
            }
        ]
    };
})();


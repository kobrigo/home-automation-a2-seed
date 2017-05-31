/* global require,console,__dirname,process */
var express = require('express');
var httpModule = require('http');
var socketio = require('socket.io');
var logger = require('./logger');
var bodyParser = require('body-parser');
var middleWares = require('./middleware');
var routes = require('./routes');
var socketApiManager = require('./socket-api-manager');
var schedulerService = require('./scheduler-service');
var shaderService = require('./shader/shader-service');
var config = require('./config');

var gpioService = require('./gpio-service');
var app = express();
var server = httpModule.Server(app);

var io = socketio(server);
//Middleware
var publicDirToServeStaticConent = __dirname + '/../../dist/dev/';
logger.log('serving satic content from:' + publicDirToServeStaticConent);
app.use(middleWares.requestLogger);
app.use(express.static(publicDirToServeStaticConent, {index: 'index.html'}));
app.use(bodyParser.json());

//initate the routes for this server
routes.init(app);
socketApiManager.init(io);

server.listen(config.portToListenTo, function () {
    'use strict';

    logger.log('listening on port: ' + config.portToListenTo);

    schedulerService.init();
    shaderService.init();
    //shaderService.calculateOpenShaderSequence();
});

function stopServer() {
    'use strict';

    logger.log('Closing the server:');
    schedulerService.stop();
    shaderService.stop();
    //turning off all the pins
    logger.log('Turning off all the pins');
    gpioService.closeAllPins()
        .then(function success() {
            logger.log('Turning off all the pins success');
        })
        .catch(function error() {
            logger.log('Turning off all the pins failed');
        })
        .finally(function () {
            logger.log('Closing the server');
            server = null;
            process.exit(0);
        });
}

function onSignaledToStop(signalName) {
    'use strict';

    logger.log('Got ' + signalName + ' terminating.');
    stopServer();
}

process.on('SIGTERM', function () {
    'use strict';

    onSignaledToStop('SIGTERM');
});

process.on('SIGBREAK', function () {
    'use strict';

    onSignaledToStop('SIGBREAK');
});

process.on('SIGINT', function () {
    'use strict';

    onSignaledToStop('SIGINT');
});

process.on('uncaughtException', function (error) {
    'use strict';

    // handle the error safely
    logger.log('handling uncaughtException:');

    logger.log(error);
    if (error.stack) {
        logger.log(error.stack);
    }

    stopServer();
});


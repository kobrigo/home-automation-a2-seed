var fs = require('fs');
var logger = require('./logger');

var resources = {
    'shader': './src/server/resources/shader.json'
};

module.exports.read = function (resource) {
    if (resource === 'shader') {
        logger.log('Reading shader resource');
        var shaderAsString = fs.readFileSync(resources['shader']);
        logger.log('Reading shader resource. Done');
        if (shaderAsString && shaderAsString !== '') {
            return JSON.parse(shaderAsString);
        } else {
            throw new Error('could not read the shader resource');
        }
    }

    throw new Error('unknown resource: ' + resource);
};

module.exports.save = function (resource, data) {
    if (resource === 'shader') {
        logger.debug('saving shader resource', 4);
        var stringToWrite = JSON.stringify(data, null, '    ');
        var shaderAsString = fs.writeFileSync(resources['shader'], stringToWrite);
    }
};


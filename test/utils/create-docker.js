'use strict';
var dockerode = require('dockerode');

module.exports = function createDocker(opts) {
  var dockerhost = opts.dockerhost
    , parts      = dockerhost.split(':')
    , host       = parts.slice(0, -1).join(':').replace(/^tcp/, 'http')
    , port       = parts[parts.length - 1]

  return dockerode({ host: host, port: port });
}

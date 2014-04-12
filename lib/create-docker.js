'use strict';
var dockerode = require('dockerode');

function httphost(dockerhost) {
  var parts      = dockerhost.split(':')
    , host       = parts.slice(0, -1).join(':').replace(/^tcp/, 'http')
    , port       = parts[parts.length - 1]

  return dockerode({ host: host, port: port });
}

function sockethost(dockerhost) {
  var socketPath = dockerhost.slice('unix://'.length);
  return dockerode({ socketPath: socketPath });
}

module.exports = function createDocker(opts) {
  var dockerhost = opts.dockerhost || 'unix:///var/run/docker.sock';

  if ((/^(http|tcp)/).test(dockerhost)) return httphost(dockerhost);
  if ((/^unix\:\/\//).test(dockerhost)) return sockethost(dockerhost);

  throw new Error('Cannot parse dockerhost ' + dockerhost);
}

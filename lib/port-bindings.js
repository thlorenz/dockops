'use strict';

module.exports = 

/**
 * Helper function to creat a proper tcp portbinding for the given ports
 * 
 * @name dockops::portBindings
 * @function
 * @param {number} exposePort the port of the docker container to expose to the host
 * @param {number=} hostPort (default: `0` which causes docker to pick a port) the host port to which to bind the exposed port 
 * @return {Object} the port binding to pass to docker when creating a container
 */
function portBindings(exposePort, hostPort) {
  var pb = {};
  pb[exposePort + '/tcp'] = [ { "HostPort": '' + (hostPort || 0 ) } ];
  return pb;
}

'use strict';

var log = require('npmlog');

var go = module.exports = 

/**
 * Logs events emitted with npm log at the given level.
 *
 * `debug` events are logged as `verbose`.
 * 
 * @name spinupTarstreams::logEvents 
 * @function
 * @param {EventEmitter} events events that should be logged
 * @param {string}       level  (default: verbose) level of logging `error|warn|info|verbose|silly`
 */
function logEvents(events, level) {
  log.level = level || 'verbose';
  [ 'error', 'info', 'warn' ].forEach(function (x) { 
    events.on(x, log[x].bind(log))
  });
  events.on('debug', log.verbose.bind(log))
};

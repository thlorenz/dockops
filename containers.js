'use strict';

var util   = require('util')
  , EE     = require('events').EventEmitter
  , xtend  = require('xtend')
  , runnel = require('runnel')
  , images = require('./images')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

module.exports = Containers;

util.inherits(Containers, EE);

/**
 * Creates a new containers instance that will use the given docker instance to communicate with docker.
 * 
 * @name dockops::Containers
 * @function
 * @param {Object} docker dockerode instance to communicate with docker
 * @return {Object} initialized containers
 */
function Containers(docker) {
  if (!(this instanceof Containers)) return new Containers(docker);

  this.docker = docker;
  this.timeToStop = 500; 
  this.timeToCreate = 500;
}

var proto = Containers.prototype;

/**
 * Creates a docker container according to given opts.
 * 
 * @name dockops::Containers::create
 * @function
 * @param {Object} opts creation options passed to dockerode
 * @param {function} cb called back when container was created
 */
proto.create = function createContainer(opts, cb) {
  var self = this;

  self.emit('verbose', 'creating', inspect(opts));
  self.docker.createContainer(opts, function (err, info) {
    if (err) return cb(err);
    self.emit('verbose', 'created', inspect(opts));
    setTimeout(cb.bind(null, null, info), self.timeToCreate);
  });
}

/**
 * Creates and starts a container.
 * 
 * @name dockops::Containers::run
 * @function
 * @param {Object}  opts              container creation and start options
 * @param {Object}  opts.create       creation options passed to dockerode
 * @param {Object}  opts.start        start options passed to `container.start`
 * @param {Object=} opts.startRetries (default: 0) determines how many times we retry to start the container in case it fails
 * @param {function} cb called when the container was started - with an error if it failed
 */
proto.run = function(opts, cb) {
  var self = this;
  opts = xtend({ startRetries: 0 }, opts);

  (function createNstart(retries) {
    self.create(opts.create, function (err, container) {
      if (err) return cb(err);

      container.start(opts.start, function (err, started) {
        if (err) { 
          self.emit(
              'warn'
            , 'failed to start container ' + inspect(opts.start) + ' as ' + container.id + '\nError: ' + err + ', retrying'
          );
          return retries > opts.startRetries  
            ? cb(new Error('Exceeded max retries trying to start container'))
            : self.clean(container.id, createNstart.bind(null, retries + 1))
        }

        cb(null, container);    
      });
    });
  })(0);
}

/**
 * Stops and/or kills and then removes a container.
 *
 * Heavy machinery clean operation.
 * It was useful when running on arch with docker not always working as promised.
 * This may not be needed anymore as docker got more stable.
 * 
 * @name dockops::Containers::clean
 * @function
 * @param {string} id container id
 * @param {function} cb called back after container was cleaned or maximum attempts were exceeded
 */
proto.clean = function (id, cb) {
  var maxAttempts = 5;
  var self = this;
  var stopAttempts = 0
    , killAttempts = 0;

  var container = self.docker.getContainer(id);
  
  function stop() {
    stopAttempts++;
    if (stopAttempts > maxAttempts) {
      self.emit('warn', 'exceeded max stop attempts for [' + id + '], giving up')
      return remove();
    }

    self.emit('verbose', 'stopping', id);
    container.stop(function (err, body) {
      if (err) return kill();
      self.emit('info', 'stopped', inspect({ id: id, attempts: stopAttempts }));
      setTimeout(remove, self.timeToStop);
    })
  }

  function kill() {
    killAttempts++;
    if (killAttempts > maxAttempts) {
      self.emit('warn', 'exceeded max kill attempts for [' + id + '], giving up')
      return remove();
    }

    self.emit('verbose', 'killing', id);

    container.kill(function (err, data) {
      if (err) return stop();
      self.emit('info', 'killed', inspect({ id: id, attempts: killAttempts }));
      setTimeout(remove, self.timeToStop);
    }) 
  }

  function remove() {
    self.emit('verbose', 'removing', id);
    container.remove(function (err, data) {
      if (err) return stopAttempts < maxAttempts ? stop() : cb();
      self.emit('info', 'removed', id);
      cb();
    })
  }
  stop();
}

//
// Multi container ops
//

/**
 * Lists docker containers.
 * 
 * @name dockops::Containers::list
 * @function
 * @param {boolean} all if true, all containers are listed
 * @param {function} cb called back with list of containers
 */
proto.list = function (all, cb) {
  if (typeof all === 'function') {
    cb = all;
    all = false;
  }
  this.docker.listContainers({ all: all }, cb);
}

/**
 * Lists all docker containers.
 * 
 * @name dockops::Containers::list
 * @function
 * @param {function} cb called back with list of containers
 */
proto.listAll = function (cb) { 
  this.list(true, cb);
}

/**
 * Lists all stopped docker containers
 * 
 * @name dockops::Containers::listStopped
 * @function
 * @param {function} cb called back with list of stopped containers
 */
proto.listStopped = function (cb) {
  this.listAll(function (err, res) {
    if (err) return cb(err);
    var dead = res.filter(function(x) { 
      return (/^Exit/).test(x.Status) 
    })
    cb(null, dead);
  });
}

/**
 * Lists all containers that were created from images belonging to a given group.
 * 
 * @name listGroup
 * @function
 * @param {string} group group for which to list containers
 * @param {function} cb 
 */
proto.listGroup = function (group, cb) {
  var self = this;

  self.listAll(function (err, res) {
    if (err) return cb(err);

    var matches = res.filter(function (x) { 
      return images.deserializeImageName(x.Image).group === group 
    });

    cb(null, matches);
  });
}

/**
 * Lists all running docker containers
 * 
 * @name dockops::Containers::listRunning
 * @function
 * @param {function} cb called back with list of running containers
 */
proto.listRunning = function (cb) {
  this.listAll(function (err, res) {
    if (err) return cb(err);
    var alive = res.filter(function(x) { 
      return !(/^Exit/).test(x.Status) 
    })
    cb(null, alive);
  });
}

/**
 * Lists all running containers by the ports they expose.
 * 
 * @name dockops::Containers::activePorts
 * @function
 * @param {function} cb called back with list of containers hashed by their port number
 */
proto.activePorts = function (cb) {
  this.listRunning(function (err, res) {
    if (err) return cb(err);

    var byPort = res
      .reduce(function (acc, cont) {
        var ports = cont.Ports;
        if (ports && ports.length) {
          ports.forEach(function (p) { acc[p.PublicPort] = cont })
        }
        return acc;
      }, {});
    cb(null, byPort);
  });
}

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

/**
 * Stops the container with the given id
 * 
 * @name stop
 * @function
 * @param {string} id id of the container to stop
 * @param {function} cb called back when container was stopd
 */
proto.stop = function (id, cb) {
  var self = this;

  var container = self.docker.getContainer(id);
  self.emit('debug', 'containers', 'stopping', id);
  container.stop(function (err, data) {
    if (err) return cb(err);
    self.emit('info', 'containers', 'stopped', id);
    cb();
  })
}

/**
 * Stops all containers that were created from images belonging to a given group.
 * 
 * @name stopGroup
 * @function
 * @param {string} group group for which to stop containers
 * @param {function} cb 
 */
proto.stopGroup = function (group, cb) {
  var self = this;
  self.listGroup(group, function (err, res) {
    if (err) return cb(err);
    var tasks = res
      .filter(function (x) {
        return !(/^Exit/).test(x.Status) 
      })
      .map(function (x) {
        return function (cb_) {
          self.emit('debug', 'containers', 'stopping', inspect(x));
          self.stop(x.Id, cb_);
        }
      });

    if (!tasks.length) {
      self.emit('debug', 'containers', 'no running containers found for group %s, not stopping any', group);
      return cb();
    }

    runnel(tasks.concat(cb));
  });
}

/**
 * Removes the container with the given id
 * 
 * @name remove
 * @function
 * @param {string} id id of the container to remove
 * @param {function} cb called back when container was removed
 */
proto.remove = function (id, cb) {
  var self = this;

  var container = self.docker.getContainer(id);
  self.emit('verbose', 'containers', 'removing', id);

  container.remove(function (err, data) {
    if (err) return cb(err);
    self.emit('info', 'containers', 'removed', id);
    cb();
  })
}

/**
 * Removes all stopped containers.
 * 
 * @name dockops::Containers::removeStopped
 * @function
 * @param {function} cb called back when all stopped containers where removed.
 */
proto.removeStopped = function (cb) {
  var self = this;

  this.listStopped(function (err, res) {
    if (err) return cb(err);

    var tasks = res
      .map(function (x) { 
        return self.remove.bind(self,x.Id);
      })

    runnel(tasks.concat(function (err) {
      if (err) return cb(err);
      cb(res);   
    }))
  })
}

/**
 * Removes all containers that were created from images belonging to a given group.
 * 
 * @name removeGroup
 * @function
 * @param {string} group group for which to remove containers
 * @param {function} cb 
 */
proto.removeGroup = function (group, cb) {
  var self = this;
  self.listGroup(group, function (err, res) {
    if (err) return cb(err);

    if (!res.length) {
      self.emit('debug', 'containers', 'no containers found for group %s, not removing any', group);
      return cb();
    }

    var tasks = res
      .map(function (x) {
        return function (cb_) {
          self.emit('debug', 'containers', 'removing', inspect(x));
          self.remove(x.Id, cb_);
        }
      });

    runnel(tasks.concat(cb));
  });
}

/**
 * Stops and then removes all containers created from images belonging to a given group.
 * 
 * @name stopRemoveGroup
 * @function
 * @param {string} group group for which to remove containers
 * @param {function} cb 
 */
proto.stopRemoveGroup = function (group, cb) {
  var self = this;
  self.stopGroup(group, function (err) {
    if (err) return cb(err);
    self.removeGroup(group, cb);  
  });
}

//
// NOT USED
//

/**
 * Starts a given container that has been created before.
 * Note: NOT USED
 * 
 * @name start
 * @function
 * @private
 * @param {string} id the container id
 * @param {Object} opts passed to dockerode when starting the container
 * @param {function} cb called back when container was started
 */
proto.start = function (id, opts, cb) {
  var self = this;

  self.emit('verbose', 'starting', inspect(opts));
  self.docker
    .getContainer(id)
    .start(opts,  function (err) {
      if (err) return cb(err);
      self.emit('verbose', 'started', inspect({ id: id, opts: opts }));
      cb();
    });
}

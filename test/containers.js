'use strict';

var test       = require('tap').test
var setup      = require('./utils/setup')
var portBindings = require('../').portBindings;
var images     = setup.images
var containers = setup.containers
var findImage  = setup.findImage


test('\nsetup: when I create images named test:uno, test:dos and toast:uno from 3 different tars', setup.testToastImages)

/*test('\nsetup: just wiping containers', function (t) {
  containers.stopRemoveGroup('test', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    containers.stopRemoveGroup('toast', function (err, res) {
      if (err) { t.fail(err); return t.end(); }
      t.end();
    })
  })
});*/

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

test('\nsetup: and then I run test:uno', function (t) {
  var exposePort = 1337;
  var hostPort = 49222;
  var imageName = 'test:uno';
  var pb = portBindings(exposePort, hostPort)
  var exposedPorts = {};
  exposedPorts[exposePort + '/tcp'] = {};

  containers.run({  
      create : { Image : imageName, ExposedPorts: exposedPorts, Cmd: ['node', '/src/index.js'] }
    , start  : { PortBindings: pb }
    }
  , function (err, container) {
      if (err) { t.fail(err); return t.end(); }
      t.ok(container, 'runs test:uno')
      t.end()
    })
})

test('\nsetup: and then I run test:dos', function (t) {
  var exposePort = 1338;
  var hostPort = 49223;
  var imageName = 'test:dos';
  var pb = portBindings(exposePort, hostPort)
  var exposedPorts = {};
  exposedPorts[exposePort + '/tcp'] = {};

  containers.run({  
      create : { Image : imageName, ExposedPorts: exposedPorts, Cmd: ['node', '/src/index.js'] }
    , start  : { PortBindings: pb }
    }
  , function (err, container) {
      if (err) { t.fail(err); return t.end(); }
      t.ok(container, 'runs test:dos')
      t.end()
    })
})

test('\nsetup: and then I run toast:uno', function (t) {
  var exposePort = 1339;
  var hostPort = 49224;
  var imageName = 'toast:uno';
  var pb = portBindings(exposePort, hostPort)
  var exposedPorts = {};
  exposedPorts[exposePort + '/tcp'] = {};

  containers.run({  
      create : { Image : imageName, ExposedPorts: exposedPorts, Cmd: ['node', '/src/index.js'] }
    , start  : { PortBindings: pb }
    }
  , function (err, container) {
      if (err) { t.fail(err); return t.end(); }
      t.ok(container, 'runs toast:uno')
      t.end()
    })
})

'use strict';
var dockops      = require('../')
  , Images       = dockops.Images
  , Containers   = dockops.Containers
  , createDocker = dockops.createDocker
  , logEvents    = dockops.logEvents
  , portBindings = dockops.portBindings
  , fs           = require('fs')
  , dockerhost   = process.env.DOCKER_HOST
  , testUnoTar   = __dirname + '/../test/fixtures/test-uno.tar'
  , toastUnoTar  = __dirname + '/../test/fixtures/toast-uno.tar'

var docker = createDocker({ dockerhost: dockerhost });

var images = new Images(docker);
logEvents(images, 'info');

var containers = new Containers(docker);
logEvents(containers, 'info');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function build(img, tar, cb) {
  images.build(fs.createReadStream(tar), img, cb); 
}

// staircase style and omitted error handling for brevity
build('test:uno', testUnoTar, function () {
  build('toast:uno', toastUnoTar, function () {
    // run test:uno container and expose port 1337 on host port 49222 
    containers.run({  
        create : { Image : 'test:uno', ExposedPorts: { '1337/tcp': {} }, Cmd: ['node', '/src/index.js'] }
      , start  : { PortBindings: portBindings(49222, 1337) }
      }
    , function (err, container) {
        // run toast:uno container and expose port 1339 on host port 49223 
        containers.run({  
            create : { Image : 'toast:uno', ExposedPorts: { '1339/tcp': {} }, Cmd: ['node', '/src/index.js'] }
          , start  : { PortBindings: portBindings(49222, 1339) }
          }
        , function (err, container) {
            containers.listRunning(function (err, res) {
              inspect(res);
              containers.stopRemoveGroup('test', function (err, res) {
                containers.listRunning(function (err, res) {
                  inspect(res);
                }) 
              })
            })
        })
    })
  })
})

'use strict';
var dockops     = require('../')
  , http        = require('http')
  , fs          = require('fs')
  , dockerhost  = process.env.DOCKER_HOST
  , testUnoTar  = __dirname + '/../test/fixtures/test-uno.tar'
  , toastUnoTar = __dirname + '/../test/fixtures/toast-uno.tar'

var docker = dockops.createDocker(dockerhost);

var images = new dockops.Images(docker);
dockops.logEvents(images, 'silly');

var containers = new dockops.Containers(docker);
dockops.logEvents(containers, 'silly');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function build(img, tar, cb) {
  images.build(fs.createReadStream(tar), img, cb); 
}

// staircase style and omitted error handling for brevity
build('test:uno', testUnoTar, function () {
  build('toast:uno', toastUnoTar, function () {
    // run test:uno container and expose port 1339 and let docker pick the host port 
    var pb = dockops.portBindings(1339);
    containers.run({  
        create : { Image : 'test:uno', ExposedPorts: pb, Cmd: ['node', '/src/index.js'] }
      , start  : { PortBindings: pb }
      }
    , function (err, container) {
        // run toast:uno container and expose port 1337 on host port 49222 
       var pb = dockops.portBindings(1339, 49222);
        containers.run({  
            create : { Image : 'toast:uno', ExposedPorts: pb, Cmd: ['node', '/src/index.js'] }
          , start  : { PortBindings: pb  }
          }
        , function (err, container) {
            containers.listRunning(function (err, res) {
              inspect(res);
              containers.stopRemoveGroup('test', function (err, res) {
                containers.listRunning(function (err, res) {
                  inspect(res);

                  http.request({ port: 49222 }, function (res) {
                    console.log('--------------------------')
                    inspect({ status: res.statusCode, headers: res.headers })
                    res.pipe(process.stdout)
                  }).end()
                }) 
              })
            })
        })
    })
  })
})

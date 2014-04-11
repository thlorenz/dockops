'use strict';

var test         = require('tap').test
  , fs           = require('fs')
  , createDocker = require('../lib/create-docker')
  , logEvents    = require('../lib/log-events')
  , Images       = require('../lib/images')
  , Containers   = require('../lib/containers')
  , dockerhost   = 'tcp://127.0.0.1:4243'
  , group        = 'test'
// TODO this needs to be a tar that contains a valid project that starts a server or something to keep running for container tests
  , testUnoTar   = __dirname + '/fixtures/test-uno.tar'

var docker = createDocker({ dockerhost: dockerhost });

var images = new Images(docker);
logEvents(images, 'silly');

var containers = new Containers(docker);
logEvents(containers, 'silly');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function setup(cb) {
  containers
    .stopRemoveGroup(group, function (err, res) {
      if (err) return cb(err);
      images.removeGroup(group, cb);
    });
}

test('\nwhen I create an image named test:uno', function (t) {
  setup(function (err) {
    if (err) { t.fail(err); return t.end(); }
    console.error('building');
    images.build(fs.createReadStream(testUnoTar), 'test:uno', function (err) {
      if (err) { t.fail(err); return t.end(); }
      t.end();  
    });
  });
  
})

function createStreams() {
  // TODO:
}

function createImages() {
  createStreams('', function (err, streams) {
    if (err) return console.error(err);

    images.build(streams[0], 'bmarkdown', function (err, res) {
      if (err) return console.error(err);
      console.log(res);
    });
  });
}

// TODO; test
// - remove all images
// - create images multi group
// - list images for group
// - remove images for group (needs impl as well)

/*var opts = xtend(defaultOpts, {});
var images = new Images(createDocker(opts));
images.listGroup('bmarkdown', function (err, res) {
  if (err) return console.error(err);
  console.log(res);  
});*/

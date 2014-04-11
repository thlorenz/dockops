'use strict';

var test         = require('tap').test
  , fs           = require('fs')
  , createDocker = require('./utils/create-docker')
  , logEvents    = require('../lib/log-events')
  , Images       = require('../').Images
  , Containers   = require('../').Containers
  , dockerhost   = 'tcp://127.0.0.1:4243'
  , testUnoTar   = __dirname + '/fixtures/test-uno.tar'
  , testDosTar   = __dirname + '/fixtures/test-dos.tar'
  , toastUnoTar  = __dirname + '/fixtures/toast-uno.tar'

var docker = createDocker({ dockerhost: dockerhost });

var images = new Images(docker);
logEvents(images, 'silly');

var containers = new Containers(docker);
logEvents(containers, 'silly');

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function wipeGroup(group, cb) {
  containers
    .stopRemoveGroup('test', function (err, res) {
      if (err) return cb(err);
      images.removeGroup(group, cb);
    });
}

function setup(cb) {
  wipeGroup('test', function (err) {
    if (err) return cb(err);
    wipeGroup('toast', cb);
  });
}

test('\nwhen I create images named test:uno, test:dos and toast:uno from 3 different tars', function (t) {

  function build(img, tar, cb) {
    images.build(fs.createReadStream(tar), img, function (err) {
      if (err) { t.fail(err); return t.end(); }
      cb();
    })
  }

  function findImage(img, name) {
    for (var i  = 0; i < img.length; i++) {
      if (img[i].RepoTags[0] === name) return img[i];
    }
  }

  /*t.plan(6)
  setup(function (err) {
    if (err) { t.fail(err); return t.end(); }

    build('test:uno', testUnoTar, function () {
      t.pass('built test:uno')
      build('test:dos', testDosTar, function () {
        t.pass('built test:dos')
        build('toast:uno', toastUnoTar, runTest)
      })
    })
  })*/

  runTest()
  function runTest() {
    t.plan(4)

    images.list(function (err, res) {
      if (err) { t.fail(err); return t.end(); }
      t.ok(res.length >= 3, 'images.list returns at least 3 images')
      t.ok(findImage(res, 'test:uno'), 'list contains test:uno')
      t.ok(findImage(res, 'test:dos'), 'list contains test:dos')
      t.ok(findImage(res, 'toast:uno'), 'list contains toast:uno')
    });
  }

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

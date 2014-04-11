'use strict';

var fs           = require('fs')
  , createDocker = require('./create-docker')
  , logEvents    = require('../../lib/log-events')
  , Images       = require('../../').Images
  , Containers   = require('../../').Containers
  , dockerhost   = 'tcp://127.0.0.1:4243'
  , testUnoTar   = __dirname + '/../fixtures/test-uno.tar'
  , testDosTar   = __dirname + '/../fixtures/test-dos.tar'
  , toastUnoTar  = __dirname + '/../fixtures/toast-uno.tar'

var docker = createDocker({ dockerhost: dockerhost });

var images = new Images(docker);
logEvents(images, 'silly');

var containers = new Containers(docker);
logEvents(containers, 'silly');

function wipeGroup(group, cb) {
  containers
    .stopRemoveGroup('test', function (err, res) {
      if (err) return cb(err);
      images.removeGroup(group, cb);
    });
}

function build(img, tar, cb) {
  images.build(fs.createReadStream(tar), img, function (err) {
    if (err) { t.fail(err); return t.end(); }
    cb();
  })
}

function setup(cb) {
  wipeGroup('test', function (err) {
    if (err) return cb(err);
    wipeGroup('toast', cb);
  });
}

exports.findImage = function findImage(img, name) {
  for (var i  = 0; i < img.length; i++) {
    if (img[i].RepoTags[0] === name) return img[i];
  }
}

exports.testToastImages = function setupTestToast(t) {
  setup(function (err) {
    if (err) { t.fail(err); return t.end(); }

    build('test:uno', testUnoTar, function () {
      // prevent timeout by talking to tap a bit
      t.pass('built test:uno')
      build('test:dos', testDosTar, function () {
        // prevent timeout by talking to tap a bit more
        t.pass('built test:dos')
        build('toast:uno', toastUnoTar, t.end.bind(t))
      })
    })
  })
}

exports.images = images;
exports.containers = containers;

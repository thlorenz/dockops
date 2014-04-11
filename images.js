'use strict';

var util         = require('util')
  , EE           = require('events').EventEmitter
  , stringifyMsg = require('./lib/stringify-msg')
  , runnel       = require('runnel')

function inspect(obj, depth) {
  return require('util').inspect(obj, false, depth || 5, true);
}

module.exports = Images; 

/**
 * Creates a new images instance that will use the given docker instance to communicate with docker.
 * 
 * @name dockops::Images
 * @function
 * @param {Object} docker dockerode instance to communicate with docker
 * @return {Object} initialized images
 */
function Images(docker) {
  if (!(this instanceof Images)) return new Images(docker);

  this.docker = docker;
}

util.inherits(Images, EE);
 
var proto = Images.prototype;

/**
 * Builds an image from the stream provided.
 * All intermediate containers are removed after the image was created.
 * 
 * Note: if you want all events from the tar stream to be propagated, i.e. if it was created with dockerify, use `build` instead.
 *
 * @name dockops::Images::buildStream
 * @function
 * @param {Stream} tarStream the tar stream that contains the project files and a `Dockerfile`
 * @param {string} image     then name under which to tag the created image
 * @param {function} cb      called back when image is created or with an error if one occurred
 */
proto.buildStream = function (tarStream, image, cb) {
  var self = this;

  self.docker.buildImage(
      tarStream
    , { t: image, rm: 1 }
    , function (err, res) {
        if (err) return cb(err);
        res
          .on('error', cb)
          .on('end', function () {
            self.emit('info', 'images', 'built', image);   
            cb();
          })
          .on('data', function (d) { 
            self.emit('debug', 'images', stringifyMsg(d)) 
          });
      }
  );
}

/**
 * Builds an image from the stream provided.
 * All intermediate containers are removed after the image was created.
 * 
 * All events from the tar stream are re-emitted, especially useful if it was created with dockerify.
 *
 * @name dockops::Images::build
 * @function
 * @param {Stream} tarStream the tar stream that contains the project files and a `Dockerfile`
 * @param {string} image     then name under which to tag the created image
 * @param {function} cb      called back when image is created or with an error if one occurred
 */
proto.build = function (tarStream, image, cb) {
  var self = this;

  self.emit('debug', 'images', 'building', image);

  // some of these events are only emitted by streams that have been dockerified
  // @see https://github.com/thlorenz/dockerify
  tarStream
    .on('error', cb)
    .on('entry', function (x) { 
      self.emit('silly', 'images', 'processing', inspect(x)) 
    })
    .on('overriding-dockerfile', function (x) { 
      self.emit('debug', 'images', 'overriding existing dockerfile') 
    })
    .on('existing-dockerfile', function (x) { 
      self.emit('debug', 'images', 'using dockerfile found inside the tarball instead of the one provided, use opts.override:true to change that') 
    })
    .on('info', self.emit.bind('info'))
    .on('debug', self.emit.bind('debug'))
    .on('end', function () {
      self.emit('debug', 'images', 'processed tar for', image);
    });

  self.buildStream(tarStream, image, cb);
}

/**
 * Deserializes the given image name into an object. 
 * 
 * @name dockops::Images::deserializeImageName
 * @function
 * @param {string} name the name of the image, expected to be in the format: `'group:tag'`.
 * @return {Object} object of the format: `{ group: 'group', tag: 'tag' }` 
 */
Images.deserializeImageName = 
proto.deserializeImageName = function (name) {
  if (!name) return null;
  var parts = name.split(':');
  if (parts.length < 2) return null;
  return { group: parts[0], tag: parts[1] };
}

/**
 * Lists docker images.
 * 
 * @name dockops::Images::list
 * @function
 * @param {function} cb called back with list of images
 */
proto.list = function (cb) {
  this.docker.listImages(cb);
}

/**
 * Lists docker images for given group.
 * 
 * @name dockops::Images::listGroup
 * @function
 * @param {string} group name of the group of images to list
 * @param {function} cb called back with list of images
 */
proto.listGroup = function (group, cb) {
  var self = this;

  function groupFromRepoTag(t) {
    var ds = self.deserializeImageName(t);
    return ds && ds.group;
  }

  self.list(function (err, res) {
    if (err) return cb(err);

    var matches = res
      .filter(function (x) {
        return x.RepoTags.some(function (t) { return groupFromRepoTag(t) === group });
      })

    cb(null, matches);
  });
}

/**
 * Removes all images for the given group
 * 
 * @name removeGroup
 * @function
 * @param {string} group name of the group of images to remove
 * @param {function} cb called back when the images were removed
 */
proto.removeGroup = function (group, cb) {
  var self = this;

  self.listGroup(group, function (err, res) {
    if (err) return cb(err);
    if (!res.length) { 
      self.emit('debug', 'images', 'no images found for group %s, not removing any', group);
      return cb();
    }

    var tasks = res.map(function (x) { 
      var img = self.docker.getImage(x.Id);
      return function (cb_) {
        self.emit('debug', 'images', 'removing', inspect(x));
        img.remove(function (err) {
          if (err) return cb_(err);
          self.emit('info', 'images', 'removed', inspect({ name: x.RepoTags, id: x.Id }));
          cb_();
        })
      }
    });

    runnel(tasks.concat(cb));
  });
}

'use strict';

var test       = require('tap').test
var setup      = require('./utils/setup')
var images     = setup.images
var containers = setup.containers
var findImage  = setup.findImage

test('\nsetup: when I create images named test:uno, test:dos and toast:uno from 3 different tars', setup.testToastImages)

test('\nand then list them', function (t) {

  t.plan(6)

  images.list(function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    t.ok(res.length >= 3, 'images.list returns at least 3 images')
    t.ok(findImage(res, 'test:uno'), 'list contains test:uno')
    t.ok(findImage(res, 'test:dos'), 'list contains test:dos')
    t.ok(findImage(res, 'toast:uno'), 'list contains toast:uno')
  })

  images.listGroup('test', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(res.length, 2, 'images.listGroup test returns 2 images')
  })
  
  images.listGroup('toast', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(res.length, 1, 'images.listGroup toast returns 1 image')
  })

})

test('\nand then I remove group test', function (t) {
  t.plan(2)
  images.removeGroup('test', function (err) {
    if (err) { t.fail(err); return t.end(); }

    images.listGroup('test', function (err, res) {
      if (err) { t.fail(err); return t.end(); }
      t.equal(res.length, 0, 'images.listGroup test returns 0 images')
    })
    
    images.listGroup('toast', function (err, res) {
      if (err) { t.fail(err); return t.end(); }
      t.equal(res.length, 1, 'images.listGroup toast returns 1 image')
    })
  })
})

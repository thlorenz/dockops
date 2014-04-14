'use strict';

// containers don't seem to properly start up, so most of the list and stop tests fail
if (process.env.TRAVIS) return;

var test         = require('tap').test
var setup        = require('./utils/setup')
var http         = require('http')
var portBindings = require('../').portBindings;
var images       = setup.images
var containers   = setup.containers
var findImage    = setup.findImage

test('\nsetup: when I create images named test:uno, test:dos and toast:uno from 3 different tars', setup.testToastImages)

/*test('\nsetup: just wiping containers', function (t) {
  containers.stopRemoveGroup('test', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    containers.stopRemoveGroup('toast', function (err, res) {
      if (err) { t.fail(err); return t.end(); }
      t.end();
    })
  })
})*/

function inspect(obj, depth) {
  console.error(require('util').inspect(obj, false, depth || 5, true));
}

function runContainer(name, expose, host) {
  test('\nsetup: and then I run test:uno', function (t) {
    var pb = portBindings(expose, host)

    containers.run({  
        create : { Image : name, ExposedPorts: pb, Cmd: ['node', '/src/index.js'] }
      , start  : { PortBindings: pb }
      }
    , function (err, container) {
        if (err) { t.fail(err); return t.end(); }
        t.ok(container, 'runs ' + name)
        t.end()
      })
  })
}

runContainer('test:uno', 1337, 49222);
runContainer('test:dos', 1338, 49223);
runContainer('toast:uno', 1339, 49224);

test('\ninteract with containers via host port', function (t) {
  t.plan(3)
  http.request({ port: 49222 }, function (res) {
    t.equal(res.statusCode, 200, 'test:uno responds with status 200')  
  }).end()
  http.request({ port: 49223 }, function (res) {
    t.equal(res.statusCode, 200, 'test:dos responds with status 200')  
  }).end()
  http.request({ port: 49224 }, function (res) {
    t.equal(res.statusCode, 200, 'toast:uno responds with status 200')  
  }).end()
})

test('\nlist', function (t) {

  t.plan(19)

  containers.listImage('test:uno', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    
    t.equal(res.length, 1, 'listImage test:uno lists one container')
    t.ok(setup.findContainer(res, 'test:uno'), 'which is test:uno')
  })

  containers.listAll(function (err, res) {
    var all, stopped, running;

    if (err) { t.fail(err); return t.end(); }
    all = res.length;

    t.ok(setup.findContainer(res, 'test:uno'), 'listAll includes test:uno container')
    t.ok(setup.findContainer(res, 'test:dos'), 'listAll includes test:dos container')
    t.ok(setup.findContainer(res, 'toast:uno'), 'listAll includes toast:uno container')

    containers.listRunning(function (err, res) {
      if (err) { t.fail(err); return t.end(); }
      running = res.length;

      t.ok(setup.findContainer(res, 'test:uno'), 'listRunning includes test:uno container')
      t.ok(setup.findContainer(res, 'test:dos'), 'listRunning includes test:dos container')
      t.ok(setup.findContainer(res, 'toast:uno'), 'listRunning includes toast:uno container')

      containers.listStopped(function (err, res) {
        if (err) { t.fail(err); return t.end(); }
        stopped = res.length;
        t.ok(!setup.findContainer(res, 'test:uno'), 'listStopped does not include test:uno container')
        t.ok(!setup.findContainer(res, 'test:dos'), 'listStopped does not include test:dos container')
        t.ok(!setup.findContainer(res, 'toast:uno'), 'listStopped does not include toast:uno container')

        t.ok(all >= 3, 'listAll lists at least 3 containers')
        t.ok(running >= 3, 'listRunning lists at least 3 containers')
        t.equal(all, running + stopped, 'all containers are running or stopped')
      })
    })
  })  

  containers.listGroup('test', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(res.length, 2, 'listGroup test lists 2')  
    t.ok(setup.findContainer(res, 'test:uno'), 'including test:uno container')
    t.ok(setup.findContainer(res, 'test:dos'), 'including test:dos container')
  })

  containers.listGroup('toast', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(res.length, 1, 'listGroup toast lists 1')  
    t.ok(setup.findContainer(res, 'toast:uno'), 'including toast:uno container')
  })
})

test('\nactivePorts', function (t) {
  containers.activePorts(function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    t.equal(res['49222'].Image, 'test:uno', 'test:uno container is exposed on port 49222')
    t.equal(res['49223'].Image, 'test:dos', 'test:dos container is exposed on port 49223')
    t.equal(res['49224'].Image, 'toast:uno', 'toast:uno container is exposed on port 49224')
    t.end()
  })  
})

test('\nstop group test', function (t) {
  t.plan(6)
  containers.stopGroup('test', function (err) {
    if (err) { t.fail(err); return t.end(); }

    containers.listStopped(function (err, res) {
      if (err) { t.fail(err); return t.end(); }

      t.ok(setup.findContainer(res, 'test:uno'), 'listStopped includes test:uno container')
      t.ok(setup.findContainer(res, 'test:dos'), 'listStopped includes does not include test:dos container')
      t.ok(!setup.findContainer(res, 'toast:uno'), 'listStopped does not include toast:uno container')
    })

    containers.listRunning(function (err, res) {
      if (err) { t.fail(err); return t.end(); }

      t.ok(!setup.findContainer(res, 'test:uno'), 'listRunning does not include test:uno container')
      t.ok(!setup.findContainer(res, 'test:dos'), 'listRunning does not include test:dos container')
      t.ok(setup.findContainer(res, 'toast:uno'), 'listRunning includes toast:uno container')
    })
  })
})

test('\nstop toast:uno', function (t) {
  t.plan(3)

  containers.listImage('toast:uno', function (err, res) {
    if (err) { t.fail(err); return t.end(); }
    var cont = res[0];
    containers.stop(cont.Id, function (err) {
      if (err) { t.fail(err); return t.end(); }
      
      containers.listStopped(function (err, res) {
        if (err) { t.fail(err); return t.end(); }

        t.ok(setup.findContainer(res, 'test:uno'), 'listStopped includes test:uno container')
        t.ok(setup.findContainer(res, 'test:dos'), 'listStopped includes test:dos container')
        t.ok(setup.findContainer(res, 'toast:uno'), 'listStopped includes toast:uno container')
      })
    })
  })
})

test('\nremove group test', function (t) {
  t.plan(3)

  containers.removeGroup('test', function (err) {
    if (err) { t.fail(err); return t.end(); }
    
    containers.listStopped(function (err, res) {
      if (err) { t.fail(err); return t.end(); }

      t.ok(!setup.findContainer(res, 'test:uno'), 'listStopped does not include test:uno container')
      t.ok(!setup.findContainer(res, 'test:dos'), 'listStopped does not include test:dos container')
      t.ok(setup.findContainer(res, 'toast:uno'), 'listStopped includes toast:uno container')
    })
  })
})

test('\nremove stopped', function (t) {
  t.plan(7)
  
  containers.removeStopped(function (err, res) {
    if (err) { t.fail(err); return t.end(); }

    t.ok(res.length >= 1, 'stops at least one container')
    t.ok(setup.findContainer(res, 'toast:uno'), 'one of them is toast:uno')

    t.ok(!setup.findContainer(res, 'test:uno'), 'test:uno container was stopped before and is not included')
    t.ok(!setup.findContainer(res, 'test:dos'), 'test:dos container was stopped before and is not included')
    
    containers.listStopped(function (err, res) {
      if (err) { t.fail(err); return t.end(); }

      t.ok(!setup.findContainer(res, 'test:uno'), 'listStopped does not include test:uno container')
      t.ok(!setup.findContainer(res, 'test:dos'), 'listStopped does not include test:dos container')
      t.ok(!setup.findContainer(res, 'toast:uno'), 'listStopped does not include toast:uno container')
    })
  })
})

runContainer('test:uno', 1337, 49222);
runContainer('test:dos', 1338, 49223);
runContainer('toast:uno', 1339, 49224);

test('\nwhen I stop remove group test', function (t) {
  containers.stopRemoveGroup('test', function (err) {
    if (err) { t.fail(err); return t.end(); }
    containers.listAll(function (err, res) {
      if (err) { t.fail(err); return t.end(); }
      
      t.ok(res.length >= 1, 'lists at least one container')
      t.ok(!setup.findContainer(res, 'test:uno'), 'listAll does not include test:uno container')
      t.ok(!setup.findContainer(res, 'test:dos'), 'listAll does not include test:dos container')
      t.ok(setup.findContainer(res, 'toast:uno'), 'one of them is toast:uno')

      containers.stopRemoveImage('toast:uno', function (err) {
        if (err) { t.fail(err); return t.end(); }
        t.pass('and after I remove toast:uno via image name')
        containers.listAll(function (err, res) {
          if (err) { t.fail(err); return t.end(); }
          
          t.ok(!setup.findContainer(res, 'test:uno'), 'listAll does not include test:uno container')
          t.ok(!setup.findContainer(res, 'test:dos'), 'listAll does not include test:dos container')
          t.ok(!setup.findContainer(res, 'toast:uno'), 'listAll does not include toast:uno container')
          t.end()
        })
      })
    })  
  })  
})

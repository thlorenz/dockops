# dockops [![build status](https://secure.travis-ci.org/thlorenz/dockops.png)](http://travis-ci.org/thlorenz/dockops)

docker convenience functions on top of dockerode

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](http://doctoc.herokuapp.com/)*

- [Installation](#installation)
- [API](#api)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

```js
var dockops = require('dockops')
var docker = createDocker({ dockerhost: dockerhost });

var images = new dockops.Images(docker);
dockops.logEvents(images, 'info');

var containers = new dockops.Containers(docker);
dockops.logEvents(containers, 'info');

build('test:uno', testUnoTar, function () {
  build('toast:uno', toastUnoTar, function () {

    containers.run(.. // run test:uno and toast:uno containers

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
```

[full example](https://github.com/thlorenz/dockops/blob/master/example/create-wipe.js)

![output](https://github.com/thlorenz/dockops/raw/master/assets/output.png)

## Installation

    npm install dockops

## API

<!-- START docme generated API please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN docme TO UPDATE -->

<div>
<div class="jsdoc-githubify">
<section>
<article>
<div class="container-overview">
<dl class="details">
</dl>
</div>
<dl>
<dt>
<h4 class="name" id="dockops::Containers"><span class="type-signature"></span>dockops::Containers<span class="signature">(docker)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a new containers instance that will use the given docker instance to communicate with docker.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>docker</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>dockerode instance to communicate with docker</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L17">lineno 17</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>initialized containers</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::activePorts"><span class="type-signature"></span>dockops::Containers::activePorts<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all running containers by the ports they expose.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of containers hashed by their port number</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L262">lineno 262</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::clean"><span class="type-signature"></span>dockops::Containers::clean<span class="signature">(id, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Stops and/or kills and then removes a container.</p>
<p>Heavy machinery clean operation.
It was useful when running on arch with docker not always working as promised.
This may not be needed anymore as docker got more stable.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>id</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>container id</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back after container was cleaned or maximum attempts were exceeded</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L90">lineno 90</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::create"><span class="type-signature"></span>dockops::Containers::create<span class="signature">(opts, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a docker container according to given opts.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>creation options passed to dockerode</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when container was created</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L35">lineno 35</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::list"><span class="type-signature"></span>dockops::Containers::list<span class="signature">(all, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists docker containers.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>all</code></td>
<td class="type">
<span class="param-type">boolean</span>
</td>
<td class="description last"><p>if true, all containers are listed</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L156">lineno 156</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::listAll"><span class="type-signature"></span>dockops::Containers::listAll<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all docker containers.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L172">lineno 172</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::listGroup"><span class="type-signature"></span>dockops::Containers::listGroup<span class="signature">(group, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all containers that were created from images belonging to a given group.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>group for which to list containers</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L200">lineno 200</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::listImage"><span class="type-signature"></span>dockops::Containers::listImage<span class="signature">(imageName, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all containers that were created from a particular image.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>imageName</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>name of image for which to list containers</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L240">lineno 240</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::listRunning"><span class="type-signature"></span>dockops::Containers::listRunning<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all running docker containers</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of running containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L223">lineno 223</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::listStopped"><span class="type-signature"></span>dockops::Containers::listStopped<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists all stopped docker containers</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of stopped containers</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L183">lineno 183</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::remove"><span class="type-signature"></span>dockops::Containers::remove<span class="signature">(id, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Removes the container with the given id</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>id</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>id of the container to remove</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when container was removed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L341">lineno 341</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::removeGroup"><span class="type-signature"></span>dockops::Containers::removeGroup<span class="signature">(group, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Removes all containers that were created from images belonging to a given group.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>group for which to remove containers</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L387">lineno 387</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::removeStopped"><span class="type-signature"></span>dockops::Containers::removeStopped<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Removes all stopped containers.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when all stopped containers where removed.</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L362">lineno 362</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::run"><span class="type-signature"></span>dockops::Containers::run<span class="signature">(opts, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Creates and starts a container.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>opts</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>container creation and start options</p>
<h6>Properties</h6>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>create</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>creation options passed to dockerode</p></td>
</tr>
<tr>
<td class="name"><code>start</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
</td>
<td class="description last"><p>start options passed to <code>container.start</code></p></td>
</tr>
<tr>
<td class="name"><code>startRetries</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: 0) determines how many times we retry to start the container in case it fails</p></td>
</tr>
</tbody>
</table>
</td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called when the container was started - with an error if it failed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L54">lineno 54</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::stop"><span class="type-signature"></span>dockops::Containers::stop<span class="signature">(id, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Stops the container with the given id</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>id</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>id of the container to stop</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when container was stopd</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L289">lineno 289</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::stopGroup"><span class="type-signature"></span>dockops::Containers::stopGroup<span class="signature">(group, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Stops all containers that were created from images belonging to a given group.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>group for which to stop containers</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L309">lineno 309</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Containers::stopRemoveGroup"><span class="type-signature"></span>dockops::Containers::stopRemoveGroup<span class="signature">(group, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Stops and then removes all containers created from images belonging to a given group.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>group for which to remove containers</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js">containers.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/containers.js#L417">lineno 417</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::createDocker"><span class="type-signature"></span>dockops::createDocker<span class="signature">(<span class="optional">dockerhost</span>)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Convenience function to create a <a href="https://github.com/apocas/dockerode">dockerode</a> instance.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th>Argument</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>dockerhost</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="attributes">
&lt;optional><br>
</td>
<td class="description last"><p>(default: <code>'unix:///var/run/docker.sock'</code>) the docker host can also be <code>http</code> or <code>tcp</code></p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/lib/create-docker.js">lib/create-docker.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/lib/create-docker.js#L19">lineno 19</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>dockerode instance</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Images"><span class="type-signature"></span>dockops::Images<span class="signature">(docker)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Creates a new images instance that will use the given docker instance to communicate with docker.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>docker</code></td>
<td class="type">
<span class="param-type">Object</span>
</td>
<td class="description last"><p>dockerode instance to communicate with docker</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js">images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js#L14">lineno 14</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>initialized images</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Images::build"><span class="type-signature"></span>dockops::Images::build<span class="signature">(tarStream, image, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Builds an image from the stream provided.
All intermediate containers are removed after the image was created.</p>
<p>All events from the tar stream are re-emitted, especially useful if it was created with dockerify.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>tarStream</code></td>
<td class="type">
<span class="param-type">Stream</span>
</td>
<td class="description last"><p>the tar stream that contains the project files and a <code>Dockerfile</code></p></td>
</tr>
<tr>
<td class="name"><code>image</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>then name under which to tag the created image</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when image is created or with an error if one occurred</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js">images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js#L65">lineno 65</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Images::buildStream"><span class="type-signature"></span>dockops::Images::buildStream<span class="signature">(tarStream, image, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Builds an image from the stream provided.
All intermediate containers are removed after the image was created.</p>
<p>Note: if you want all events from the tar stream to be propagated, i.e. if it was created with dockerify, use <code>build</code> instead.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>tarStream</code></td>
<td class="type">
<span class="param-type">Stream</span>
</td>
<td class="description last"><p>the tar stream that contains the project files and a <code>Dockerfile</code></p></td>
</tr>
<tr>
<td class="name"><code>image</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>then name under which to tag the created image</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when image is created or with an error if one occurred</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js">images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js#L32">lineno 32</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Images::deserializeImageName"><span class="type-signature"></span>dockops::Images::deserializeImageName<span class="signature">(name)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Deserializes the given image name into an object.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>name</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>the name of the image, expected to be in the format: <code>'group:tag'</code>.</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js">images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js#L104">lineno 104</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>object of the format: <code>{ group: 'group', tag: 'tag' }</code></p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Images::list"><span class="type-signature"></span>dockops::Images::list<span class="signature">(cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists docker images.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of images</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js">images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js#L120">lineno 120</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::Images::listGroup"><span class="type-signature"></span>dockops::Images::listGroup<span class="signature">(group, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Lists docker images for given group.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>name of the group of images to list</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back with list of images</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js">images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js#L131">lineno 131</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::logEvents"><span class="type-signature"></span>dockops::logEvents<span class="signature">(events, level)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Logs events emitted with npm log at the given level.</p>
<p><code>debug</code> events are logged as <code>verbose</code>.</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>events</code></td>
<td class="type">
<span class="param-type">EventEmitter</span>
</td>
<td class="description last"><p>events that should be logged</p></td>
</tr>
<tr>
<td class="name"><code>level</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>(default: verbose) level of logging <code>error|warn|info|verbose|silly</code></p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/lib/log-events.js">lib/log-events.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/lib/log-events.js#L7">lineno 7</a>
</li>
</ul></dd>
</dl>
</dd>
<dt>
<h4 class="name" id="dockops::portBindings"><span class="type-signature"></span>dockops::portBindings<span class="signature">(exposePort, hostPort)</span><span class="type-signature"> &rarr; {Object}</span></h4>
</dt>
<dd>
<div class="description">
<p>Helper function to creat a proper tcp portbinding for the given ports</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>exposePort</code></td>
<td class="type">
<span class="param-type">number</span>
</td>
<td class="description last"><p>the port of the docker container to expose to the host</p></td>
</tr>
<tr>
<td class="name"><code>hostPort</code></td>
<td class="type">
<span class="param-type">number</span>
</td>
<td class="description last"><p>the host port to which to bind the exposed port</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/lib/port-bindings.js">lib/port-bindings.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/lib/port-bindings.js#L5">lineno 5</a>
</li>
</ul></dd>
</dl>
<h5>Returns:</h5>
<div class="param-desc">
<p>the port binding to pass to docker when creating a container</p>
</div>
<dl>
<dt>
Type
</dt>
<dd>
<span class="param-type">Object</span>
</dd>
</dl>
</dd>
<dt>
<h4 class="name" id="removeGroup"><span class="type-signature"></span>removeGroup<span class="signature">(group, cb)</span><span class="type-signature"></span></h4>
</dt>
<dd>
<div class="description">
<p>Removes all images for the given group</p>
</div>
<h5>Parameters:</h5>
<table class="params">
<thead>
<tr>
<th>Name</th>
<th>Type</th>
<th class="last">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td class="name"><code>group</code></td>
<td class="type">
<span class="param-type">string</span>
</td>
<td class="description last"><p>name of the group of images to remove</p></td>
</tr>
<tr>
<td class="name"><code>cb</code></td>
<td class="type">
<span class="param-type">function</span>
</td>
<td class="description last"><p>called back when the images were removed</p></td>
</tr>
</tbody>
</table>
<dl class="details">
<dt class="tag-source">Source:</dt>
<dd class="tag-source"><ul class="dummy">
<li>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js">images.js</a>
<span>, </span>
<a href="https://github.com/thlorenz/dockops/blob/master/images.js#L159">lineno 159</a>
</li>
</ul></dd>
</dl>
</dd>
</dl>
</article>
</section>
</div>

*generated with [docme](https://github.com/thlorenz/docme)*
</div>
<!-- END docme generated API please keep comment here to allow auto update -->

## License

MIT

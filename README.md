# ecsy-three

We created ecsy-three to facilitate developing applications using ECSY and three.js. It is a set of components, systems, and helpers that will (eventually) include a large number of reusable components for the most commonly used patterns when developing 3D applications.

# example tutorial

We are going to create a simple example of a textured cube rotating on the screen [(see it in action)](https://mixedreality.mozilla.org/ecsy-three/examples/webgl_geometry_cube.html)

We start by importing the required modules from three.js and ECSY
```javascript
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Component, System, World } from 'https://unpkg.com/ecsy/build/ecsy.module.js';
```

Now we import some components and systems exported by `ecsy-three`:
```javascript
import {
  initialize,
  // Components
  Parent,
  Camera,
  Transform,
  Object3D,
  // Systems
  WebGLRendererSystem
} from '../build/ecsy-three.module-unpkg.js';
```

Let's create a component to tag the objects that will rotate:
```javascript
class Rotating extends Component {}
```

The following system will query for the entities that has a `Rotating` and a `Transform` components and will update the `rotation` from the `Transform` component to rotate the object:
```javascript
class RotationSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach(entity => {
      var rotation = entity.getMutableComponent(Transform).rotation;
      rotation.x += 0.5 * delta;
      rotation.y += 0.1 * delta;
    });
  }
}

RotationSystem.queries = {
  entities: {
    components: [Rotating, Transform]
  }
};
```

Now let's create a new world and register our custom system:
```javascript
// Create a new world to hold all our entities and systems
world = new World();

// Register our custom sytem
world.registerSystem(RotationSystem);
```

By calling `initialize()` we will initialize the default three.js systems and it will create also a set of commonly used entities in all three.js applications as `scene`, `camera` and `renderer`:
```javascript
// Initialize the default sets of entities and systems
let data = initialize(world);
```

We can easily grab the initialized entities:
```javascript
let {scene, renderer, camera} = data.entities;
```

Let's modify the camera position:
```javascript
// Modify the position for the default camera
let transform = camera.getMutableComponent(Transform);
transform.position.z = 40;
```

Now we are going to create a simple `three.js` textured cube:
```
// Create a three.js textured box
var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
var material = new THREE.MeshBasicMaterial( { map: texture } );
mesh = new THREE.Mesh( geometry, material );
```

We will include the cube into the `ECSY` world by creating and entity and adding the following components to it:
```javascript
// Create an entity to handle our rotating box
var rotatingBox = world.createEntity()
  .addComponent(Object3D, { value: mesh })
  .addComponent(Transform)
  .addComponent(Parent, { value: scene })
  .addComponent(Rotating);
```

And we are ready to go, let's the fun begin!
```
world.execute();
```

# example full code
```javascript
import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { Component, System, World } from 'https://unpkg.com/ecsy/build/ecsy.module.js';

class Rotating extends Component {}

class RotationSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach(entity => {
      var rotation = entity.getMutableComponent(Transform).rotation;
      rotation.x += 0.5 * delta;
      rotation.y += 0.1 * delta;
    });
  }
}

RotationSystem.queries = {
  entities: {
    components: [Rotating, Transform]
  }
};

import {
  initialize,
  // Components
  Parent,
  Camera,
  Transform,
  Object3D,
  // Systems
  WebGLRendererSystem
} from '../build/ecsy-three.module-unpkg.js';

var world, scene, camera, mesh, renderer;

init();

function init() {

  // Create a new world to hold all our entities and systems
  world = new World();

  // Register our custom sytem
  world.registerSystem(RotationSystem);

  // Initialize the default sets of entities and systems
  let data = initialize(world);

  // Grab the initialized entities
  let {scene, renderer, camera} = data.entities;

  // Modify the position for the default camera
  let transform = camera.getMutableComponent(Transform);
  transform.position.z = 40;

  // Create a three.js textured box
  var texture = new THREE.TextureLoader().load( 'textures/crate.gif' );
  var geometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
  var material = new THREE.MeshBasicMaterial( { map: texture } );
  mesh = new THREE.Mesh( geometry, material );

  // Create an entity to handle our rotating box
  var rotatingBox = world.createEntity()
    .addComponent(Object3D, { value: mesh })
    .addComponent(Transform)
    .addComponent(Parent, { value: scene })
    .addComponent(Rotating);

  // Let's begin
  world.execute();
}
```

# examples

Find more info on the examples folder: https://github.com/MozillaReality/ecsy-three/tree/master/examples

# ecsy-three

We created ecsy-three to facilitate developing applications using [ECSY](https://ecsy.io) and [three.js](https://threejs.org). It is a set of components and systems for interacting with ThreeJS from ECSY. Right now, we have a core API design that we are iterating on and we hope to build higher level abstractions against.

# Getting Started

If you aren't familiar with the ECSY API, you should read the [ECSY Documentation](https://ecsy.io/docs) first.

[View Demo on Glitch](https://glitch.com/~ecsy-three-spinning-cube)

## ECSY Three Core

The core API for ecsy-three is just a few additional concepts on top of ECSY.

First, you must create an instance of `ECSYThreeWorld` instead of `World`.

```javascript
import { ECSYThreeWorld } from "ecsy-three";

const world = new ECSYThreeWorld();
```

`ECSYThreeWorld` registers a custom `ECSYThreeEntity` class with some helper methods for working with ThreeJS.

You can add any `Object3D` to an `ECSYThreeEntity` using `addObject3DComponent(object3D, parentEntity)`

```javascript
import { Scene, Mesh, BoxBufferGeometry, MeshBasicMaterial, TextureLoader } from "three";

const scene = world
  .createEntity()
  .addObject3DComponent(new Scene()); // scene is the root Object3d and has no parent

const geometry = new BoxBufferGeometry(20, 20, 20);

const material = new MeshBasicMaterial({
  map: new TextureLoader().load("./textures/crate.gif")
});

const mesh = new Mesh(geometry, material);

const box = world
  .createEntity()
  .addObject3DComponent(mesh, scene); // mesh is parented to the scene entity
```

`addObject3DComponent()` will add the `Object3DComponent` as well as a series of `ThreeTagComponent`s. For example, when adding a `Scene` object3d to an entity, it will also add the `SceneTagComponent`. For the `Mesh` object3d, a `MeshTagComponent` will be added. These tag components can be used in `System` queries to get instances of certain object3ds. You can then use `entity.getObject3D()` to get the object3d for that entity.

```javascript
import { MeshTagComponent, Object3DComponent } from "ecsy-three";
import { System } from "ecsy";

class RandomColorSystem extends System {
  execute(delta) {
    this.queries.entities.results.forEach(entity => {
      // This will always return a Mesh since we are querying for the MeshTagComponent
      const mesh = entity.getObject3D();
      mesh.material.color.setHex(Math.random() * 0xffffff);
    });
  }
}

RandomColorSystem.queries = {
  entities: {
    components: [MeshTagComponent, Object3DComponent]
  }
};
```

There are `ThreeTagComponent`s defined for all of the `Object3D` classes in the core three.js library (excluding helpers). If you want to add `ThreeTagComponent`s for another `Object3D` class, register a new `ThreeTagComponent` and implement the `matchesObject3D(object3D)` function.

```javascript
import { ThreeTagComponent } from "ecsy-three";
import { Sky } from "three/examples/jsm/objects/Sky";

class SkyTagComponent extends ThreeTagComponent {
  static matchesObject3D(object3D) {
    return object3D instanceof Sky;
  }
}

world.registerComponent(SkyTagComponent);
```

If you want to remove an Object3D from an entity, you can call `entity.removeObject3DComponent()` which will remove the object3D from the entity and detach it from its current parent as well as removing any `ThreeTagComponent`s.

Finally, if you want to get the entity for a give object3d you can use `object3D.entity`. This property is added to the object3D when calling `entity.addObject3DComponent` and removed when calling `entity.removeObject3DComponent()`.

That is essentially all there is to the ecsy-three core API at this time. With just these few additional components you can write most ThreeJS code against ECSY.

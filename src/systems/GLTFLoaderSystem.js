import { GLTFLoader as GLTFLoaderThree } from "three/examples/jsm/loaders/GLTFLoader.js";
import { System, SystemStateComponent, Not } from "ecsy";
import { GLTFModel } from "../components/GLTFModel.js";
import { GLTFLoader } from "../components/GLTFLoader.js";
import { Object3DComponent } from "../components/index.js";

// @todo Use parameter and loader manager
var loader = new GLTFLoaderThree(); //.setPath("/assets/models/");

class GLTFLoaderState extends SystemStateComponent {}

export class GLTFLoaderSystem extends System {
  init() {
    this.loaded = [];
  }

  execute() {
    const toLoad = this.queries.toLoad.results;
    while (toLoad.length) {
      const entity = toLoad[0];
      entity.addComponent(GLTFLoaderState);
      loader.load(entity.getComponent(GLTFLoader).url, gltf =>
        this.loaded.push([entity, gltf])
      );
    }

    // Do the actual entity creation inside the system tick not in the loader callback
    for (let i = 0; i < this.loaded.length; i++) {
      const [entity, gltf] = this.loaded[i];
      const component = entity.getComponent(GLTFLoader);
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.receiveShadow = component.receiveShadow;
          child.castShadow = component.castShadow;

          if (component.envMapOverride) {
            child.material.envMap = component.envMapOverride;
          }
        }
      });

      entity.addComponent(GLTFModel, { value: gltf });

      if (component.append && entity.hasComponent(Object3DComponent)) {
        entity.getObject3D().add(gltf.scene);
      } else {
        entity.addObject3DComponents(gltf.scene, component.parent);
      }

      if (component.onLoaded) {
        component.onLoaded(gltf.scene, gltf);
      }
    }
    this.loaded.length = 0;

    const toUnload = this.queries.toUnload.results;
    while (toUnload.length) {
      const entity = toUnload[0];
      entity.removeComponent(GLTFLoaderState);
      entity.removeObject3DComponents();
    }
  }
}

GLTFLoaderSystem.queries = {
  toLoad: {
    components: [GLTFLoader, Not(GLTFLoaderState)]
  },
  toUnload: {
    components: [GLTFLoaderState, Not(GLTFLoader)]
  }
};

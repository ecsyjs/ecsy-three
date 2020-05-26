import { GLTFLoader as GLTFLoaderThree } from "three/examples/jsm/loaders/GLTFLoader.js";
import { System, SystemStateComponent, Not } from "ecsy";
import { GLTFModel } from "../components/GLTFModel.js";
import { GLTFLoader } from "../components/GLTFLoader.js";

// @todo Use parameter and loader manager
var loader = new GLTFLoaderThree(); //.setPath("/assets/models/");

class GLTFLoaderState extends SystemStateComponent {}

export class GLTFLoaderSystem extends System {
  execute() {
    const toLoad = this.queries.toLoad.results;
    while (toLoad.length) {
      const entity = toLoad[0];
      entity.addComponent(GLTFLoaderState);

      loader.load(component.url, gltf => {
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            child.receiveShadow = component.receiveShadow;
            child.castShadow = component.castShadow;

            if (component.envMapOverride) {
              child.material.envMap = component.envMapOverride;
            }
          }
        });

        this.world
          .createEntity()
          .addComponent(GLTFModel, { value: gltf })
          .addObject3DComponents(gltf.scene, component.append && entity);

        if (component.onLoaded) {
          component.onLoaded(gltf.scene, gltf);
        }
      });

    }
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

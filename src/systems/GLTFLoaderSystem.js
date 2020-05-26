import { GLTFLoader as GLTFLoaderThree } from "three/examples/jsm/loaders/GLTFLoader.js";
import { System } from "ecsy";
import { Parent } from "../components/Parent.js";
import { Object3D } from "../components/Object3D.js";
import { GLTFModel } from "../components/GLTFModel.js";
import { GLTFLoader } from "../components/GLTFLoader.js";

// @todo Use parameter and loader manager
var loader = new GLTFLoaderThree(); //.setPath("/assets/models/");

export class GLTFLoaderSystem extends System {
  execute() {
    this.queries.entities.added.forEach(entity => {
      var component = entity.getComponent(GLTFLoader);

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
    });

    this.queries.entities.removed.forEach(entity => {
      entity.removeObject3DComponents();
    });
  }
}

GLTFLoaderSystem.queries = {
  entities: {
    components: [GLTFLoader],
    listen: {
      added: true,
      removed: true
    }
  }
};

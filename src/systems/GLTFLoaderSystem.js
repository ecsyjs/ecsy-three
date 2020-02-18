import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { System } from "ecsy";
import { Parent } from "../components/Parent.js";
import { Object3D } from "../components/Object3D.js";
import { GLTFModel } from "../components/GLTFModel.js";

// @todo Use parameter and loader manager
var loader = new GLTFLoader().setPath("/assets/");

export class GLTFLoaderSystem extends System {
  execute() {
    this.queries.entities.added.forEach(entity => {
      var component = entity.getComponent(GLTFModel);

      loader.load(component.url, gltf => {
        /*
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            child.material.envMap = envMap;
          }
        });
*/
        entity.addComponent(Object3D, { value: gltf.scene });
        if (component.onLoaded) {
          component.onLoaded(gltf.scene);
        }
      });
    });

    this.queries.entities.removed.forEach(entity => {
      var object = entity.getComponent(Object3D, true).value;
      var parent = entity.getComponent(Parent, true).value;
      parent.getComponent(Object3D).value.remove(object);
    });

  }
}

GLTFLoaderSystem.queries = {
  entities: {
    components: [GLTFModel],
    listen: {
      added: true,
      removed: true
    }
  }
};

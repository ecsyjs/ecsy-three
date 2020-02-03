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
      });
    });
  }
}

GLTFLoaderSystem.queries = {
  entities: {
    components: [GLTFModel],
    listen: {
      added: true
    }
  }
};

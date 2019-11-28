import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import { System } from "ecsy";
import { Parent } from "../components/Parent.js";
import { Object3D } from "../components/Object3D.js";
import { GLTFModel } from "../components/GLTFModel.js";

// @todo Use parameter and loader manager
var loader = new GLTFLoader().setPath("/assets/");

export class GLTFLoaderSystem extends System {
  execute() {
    var entities = this.queries.entities.added;

    //Queries
    for (let i = 0; i < entities.length; i++) {
      var entity = entities[i];
      var component = entity.getComponent(GLTFModel);

      loader.load(component.url, gltf => {
        /*
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            child.material.envMap = envMap;
          }
        });
*/
        // @todo Remove, hierarchy will take care of it
        if (entity.hasComponent(Parent)) {
          entity.getComponent(Parent).value.add(gltf.scene);
        }
        entity.addComponent(Object3D, { value: gltf.scene });
      });
    }
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

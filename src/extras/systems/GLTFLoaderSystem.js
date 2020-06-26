import {GLTFLoader as GLTFLoaderThree} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three/examples/jsm/loaders/GLTFLoader.js";
import {System, SystemStateComponent, Not} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import {GLTFModel as GLTFModel2} from "../components/GLTFModel.js";
import {GLTFLoader as GLTFLoader3} from "../components/GLTFLoader.js";
import {Object3DComponent} from "../../core/components.js";
var loader = new GLTFLoaderThree();
class GLTFLoaderState extends SystemStateComponent {
}
export class GLTFLoaderSystem extends System {
  init() {
    this.world.registerComponent(GLTFLoaderState).registerComponent(GLTFModel2);
    this.loaded = [];
  }
  execute() {
    const toLoad = this.queries.toLoad.results;
    while (toLoad.length) {
      const entity = toLoad[0];
      entity.addComponent(GLTFLoaderState);
      loader.load(entity.getComponent(GLTFLoader3).url, (gltf) => this.loaded.push([entity, gltf]));
    }
    for (let i = 0; i < this.loaded.length; i++) {
      const [entity, gltf] = this.loaded[i];
      const component = entity.getComponent(GLTFLoader3);
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.receiveShadow = component.receiveShadow;
          child.castShadow = component.castShadow;
          if (component.envMapOverride) {
            child.material.envMap = component.envMapOverride;
          }
        }
      });
      if (entity.hasComponent(Object3DComponent)) {
        if (component.append) {
          entity.getObject3D().add(gltf.scene);
        }
      } else {
        entity.addComponent(GLTFModel2, {
          value: gltf
        }).addObject3DComponent(gltf.scene, component.parent);
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
      entity.removeObject3DComponent();
    }
  }
}
GLTFLoaderSystem.queries = {
  toLoad: {
    components: [GLTFLoader3, Not(GLTFLoaderState)]
  },
  toUnload: {
    components: [GLTFLoaderState, Not(GLTFLoader3)]
  }
};

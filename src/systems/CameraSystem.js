import { System, Not } from "../../ecsy.module.js";
import { Camera, Object3D } from "../components/index.js";
import * as THREE from "../../three.module.js";

export class CameraSystem extends System {
  init() {
    window.addEventListener( 'resize', () => {
      this.queries.cameras.results.forEach(camera => {
        var component = camera.getComponent(Camera);
        if (component.handleResize) {
          camera.getMutableComponent(Camera).aspect = window.innerWidth / window.innerHeight;
        }
      });
    }, false );
  }

  execute(delta) {
    let changed = this.queries.cameras.changed;
    for (var i = 0; i < changed.length; i++) {
      var entity = changed[i];

      var component = entity.getComponent(Camera);
      var camera3d = entity.getMutableComponent(Object3D).object;

      if (camera3d.aspect !== component.aspect) {
        camera3d.aspect = component.aspect;
        camera3d.updateProjectionMatrix();
      }
      // @todo Do it for the rest of the values
    }


    let camerasUninitialized = this.queries.camerasUninitialized.results;
    for (var i = 0; i < camerasUninitialized.length; i++) {
      var entity = camerasUninitialized[i];

      var component = entity.getComponent(Camera);

      var camera = new THREE.PerspectiveCamera(
        component.fov,
        component.aspect,
        component.near,
        component.far );

      camera.layers.enable( component.layers );

      entity.addComponent(Object3D, { object: camera });
    }
  }
}

CameraSystem.queries = {
  camerasUninitialized: {
    components: [Camera, Not(Object3D)]
  },
  cameras: {
    components: [Camera, Object3D],
    listen: {
      changed: [Camera]
    }
  }
};

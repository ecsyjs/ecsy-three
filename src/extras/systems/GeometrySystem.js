import * as THREE from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three.js";
import {System} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import {Geometry, Transform, Parent} from "../components/index.js";
import {Object3DComponent as Object3DComponent2} from "../../core/Object3DComponent.js";
export class GeometrySystem extends System {
  execute() {
    this.queries.entities.removed.forEach((entity) => {
      var object = entity.getRemovedComponent(Object3DComponent2).value;
      var parent = entity.getComponent(Parent, true).value;
      parent.getObject3D().remove(object);
    });
    this.queries.entities.added.forEach((entity) => {
      var component = entity.getComponent(Geometry);
      var geometry;
      switch (component.primitive) {
        case "torus":
          {
            geometry = new THREE.TorusBufferGeometry(component.radius, component.tube, component.radialSegments, component.tubularSegments);
          }
          break;
        case "sphere":
          {
            geometry = new THREE.IcosahedronBufferGeometry(component.radius, 1);
          }
          break;
        case "box":
          {
            geometry = new THREE.BoxBufferGeometry(component.width, component.height, component.depth);
          }
          break;
      }
      var color = component.primitive === "torus" ? 10066176 : Math.random() * 16777215;
      var material = new THREE.MeshLambertMaterial({
        color,
        flatShading: true
      });
      var object = new THREE.Mesh(geometry, material);
      object.castShadow = true;
      object.receiveShadow = true;
      if (entity.hasComponent(Transform)) {
        var transform = entity.getComponent(Transform);
        object.position.copy(transform.position);
        if (transform.rotation) {
          object.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
        }
      }
      entity.addComponent(Object3DComponent2, {
        value: object
      });
    });
  }
}
GeometrySystem.queries = {
  entities: {
    components: [Geometry],
    listen: {
      added: true,
      removed: true
    }
  }
};

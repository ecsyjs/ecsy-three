import * as THREE from "three";
import { System } from "ecsy";
import {
  Geometry,
  Object3D,
  Transform,
  //  Element,
  //  Draggable,
  Parent
} from "../components/index.js";

/**
 * Create a Mesh based on the [Geometry] component and attach it to the entity using a [Object3D] component
 */
export class GeometrySystem extends System {
  execute() {
    // Removed
    this.queries.entities.removed.forEach((/*entity*/) => {
      /*
      var object = entity.getRemovedComponent(Object3D).value;
      var parent = entity.getComponent(Parent, true).value;
      parent.getComponent(Object3D).value.remove(object);
      */
    });

    // Added
    this.queries.entities.added.forEach(entity => {
      var component = entity.getComponent(Geometry);

      var geometry;
      switch (component.primitive) {
        case "torus":
          {
            geometry = new THREE.TorusBufferGeometry(
              component.radius,
              component.tube,
              component.radialSegments,
              component.tubularSegments
            );
          }
          break;
        case "sphere":
          {
            geometry = new THREE.IcosahedronBufferGeometry(component.radius, 1);
          }
          break;
        case "box":
          {
            geometry = new THREE.BoxBufferGeometry(
              component.width,
              component.height,
              component.depth
            );
          }
          break;
      }

      var color =
        component.primitive === "torus" ? 0x999900 : Math.random() * 0xffffff;

      var material = new THREE.MeshLambertMaterial({
        color: color,
        flatShading: true
      });

      /*
      var material = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.0,
        flatShading: true
      });
*/

      var object = new THREE.Mesh(geometry, material);
      object.castShadow = true;
      object.receiveShadow = true;

      if (entity.hasComponent(Transform)) {
        var transform = entity.getComponent(Transform);
        object.position.copy(transform.position);
        if (transform.rotation) {
          object.rotation.set(
            transform.rotation.x,
            transform.rotation.y,
            transform.rotation.z
          );
        }
      }

      //      if (entity.hasComponent(Element) && !entity.hasComponent(Draggable)) {
      //        object.material.color.set(0x333333);
      //      }

      entity.addComponent(Object3D, { value: object });

      // @todo Remove it! hierarchy system will take care of it
      if (entity.hasComponent(Parent)) {
        entity
          .getComponent(Parent)
          .value.getComponent(Object3D)
          .value.add(object);
      }
    });
  }
}

GeometrySystem.queries = {
  entities: {
    components: [Geometry], // @todo Transform: As optional, how to define it?
    listen: {
      added: true,
      removed: true
    }
  }
};

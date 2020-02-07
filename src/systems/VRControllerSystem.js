import * as THREE from "three";
import { System } from "ecsy";
import { WebGLRendererContext, VRController, Object3D } from "../index.js";
import { XRControllerModelFactory } from "three/examples/jsm/webxr/XRControllerModelFactory.js";

var controllerModelFactory = new XRControllerModelFactory();

export class VRControllerSystem extends System {
  execute() {
    let renderer = this.queries.rendererContext.results[0].getComponent(
      WebGLRendererContext
    ).value;

    this.queries.controllers.added.forEach(entity => {
      let controllerId = entity.getComponent(VRController).id;
      var controller = renderer.xr.getController(controllerId);

      var group = new THREE.Group();
      group.add(controller);
      entity.addComponent(Object3D, { value: group });

      // controller.addEventListener("selectstart", this.onSelectStart.bind(this));
      // controller.addEventListener("selectend", this.onSelectEnd.bind(this));
      // controller.addEventListener("connected", this.onConnected.bind(this));
      // controller.addEventListener("squeeze", this.onSqueeze.bind(this));

      // The XRControllerModelFactory will automatically fetch controller models
      // that match what the user is holding as closely as possible. The models
      // should be attached to the object returned from getControllerGrip in
      // order to match the orientation of the held device.

      let controllerGrip = renderer.xr.getControllerGrip(controllerId);
      controllerGrip.add(
        controllerModelFactory.createControllerModel(controllerGrip)
      );
      group.add(controllerGrip);
/*
      let geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
      );

      var line = new THREE.Line(geometry);
      line.name = "line";
      line.scale.z = 5;
      group.add(line);

      let geometry2 = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
      let material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let cube = new THREE.Mesh(geometry2, material2);
      group.name = "VRController";
      group.add(cube);
*/
    });

    // this.cleanIntersected();
  }
}

VRControllerSystem.queries = {
  controllers: {
    components: [VRController],
    listen: {
      added: true
      //changed: [Visible]
    }
  },
  rendererContext: {
    components: [WebGLRendererContext],
    mandatory: true
  }
};

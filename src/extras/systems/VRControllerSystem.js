import * as THREE from "/web_modules/three.js";
import {System} from "/web_modules/ecsy.js";
import {VRControllerBasicBehaviour, VRController, ControllerConnected} from "../components/index.js";
import {WebGLRendererContext} from "./WebGLRendererSystem.js";
import {Object3DComponent as Object3DComponent2} from "../../core/Object3DComponent.js";
import {XRControllerModelFactory as XRControllerModelFactory2} from "/web_modules/three/examples/jsm/webxr/XRControllerModelFactory.js";
var controllerModelFactory = new XRControllerModelFactory2();
export class VRControllerSystem extends System {
  init() {
    this.world.registerComponent(VRController).registerComponent(VRControllerBasicBehaviour).registerComponent(ControllerConnected);
  }
  execute() {
    let renderer = this.queries.rendererContext.results[0].getComponent(WebGLRendererContext).value;
    this.queries.controllers.added.forEach((entity) => {
      let controllerId = entity.getComponent(VRController).id;
      var controller = renderer.xr.getController(controllerId);
      controller.name = "controller";
      var group = new THREE.Group();
      group.add(controller);
      entity.addComponent(Object3DComponent2, {
        value: group
      });
      controller.addEventListener("connected", () => {
        entity.addComponent(ControllerConnected);
      });
      controller.addEventListener("disconnected", () => {
        entity.removeComponent(ControllerConnected);
      });
      if (entity.hasComponent(VRControllerBasicBehaviour)) {
        var behaviour = entity.getComponent(VRControllerBasicBehaviour);
        Object.keys(behaviour).forEach((eventName) => {
          if (behaviour[eventName]) {
            controller.addEventListener(eventName, behaviour[eventName]);
          }
        });
      }
      let controllerGrip = renderer.xr.getControllerGrip(controllerId);
      controllerGrip.add(controllerModelFactory.createControllerModel(controllerGrip));
      controllerGrip.name = "model";
      group.add(controllerGrip);
    });
  }
}
VRControllerSystem.queries = {
  controllers: {
    components: [VRController],
    listen: {
      added: true
    }
  },
  rendererContext: {
    components: [WebGLRendererContext],
    mandatory: true
  }
};

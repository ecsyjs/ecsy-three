import {System} from "/web_modules/ecsy.js";
import {UpdateAspectOnResizeTag} from "../components/index.js";
import {CameraTagComponent, Object3DComponent} from "../../core/components.js";
export class UpdateAspectOnResizeSystem extends System {
  init() {
    this.aspect = window.innerWidth / window.innerHeight;
    window.addEventListener("resize", () => {
      this.aspect = window.innerWidth / window.innerHeight;
      console.log("resize", this.aspect);
    }, false);
  }
  execute() {
    let cameras = this.queries.cameras.results;
    for (let i = 0; i < cameras.length; i++) {
      let cameraObj = cameras[i].getObject3D();
      if (cameraObj.aspect !== this.aspect) {
        cameraObj.aspect = this.aspect;
        cameraObj.updateProjectionMatrix();
      }
    }
  }
}
UpdateAspectOnResizeSystem.queries = {
  cameras: {
    components: [CameraTagComponent, UpdateAspectOnResizeTag, Object3DComponent]
  }
};

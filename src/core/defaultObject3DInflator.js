import {MeshTagComponent, SceneTagComponent, CameraTagComponent} from "./Object3DTags.js";
export const defaultObject3DInflator = {
  inflate: (entity, obj) => {
    if (obj.isMesh) {
      entity.addComponent(MeshTagComponent);
    } else if (obj.isScene) {
      entity.addComponent(SceneTagComponent);
    } else if (obj.isCamera) {
      entity.addComponent(CameraTagComponent);
    }
  },
  deflate: (entity, obj) => {
    if (obj.isMesh) {
      entity.removeComponent(MeshTagComponent);
    } else if (obj.isScene) {
      entity.removeComponent(SceneTagComponent);
    } else if (obj.isCamera) {
      entity.removeComponent(CameraTagComponent);
    }
  }
};

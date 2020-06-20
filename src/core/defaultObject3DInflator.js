import {
  MeshTagComponent,
  SceneTagComponent,
  CameraTagComponent
} from "./Object3DTags.js";

export const defaultObject3DInflator = {
  inflate: (entity, obj) => {
    // TODO support more tags and probably a way to add user defined ones
    if (obj.isMesh) {
      entity.addComponent(MeshTagComponent);
    } else if (obj.isScene) {
      entity.addComponent(SceneTagComponent);
    } else if (obj.isCamera) {
      entity.addComponent(CameraTagComponent);
    }
  },
  deflate: (entity, obj) => {
    // TODO support more tags and probably a way to add user defined ones
    if (obj.isMesh) {
      entity.removeComponent(MeshTagComponent);
    } else if (obj.isScene) {
      entity.removeComponent(SceneTagComponent);
    } else if (obj.isCamera) {
      entity.removeComponent(CameraTagComponent);
    }
  }
};

import {
  MeshTagComponent,
  SceneTagComponent,
  CameraTagComponent
} from "./components/index.js";

export const defaultObject3DInflator = (entity, obj) => {
  // TODO support more tags and probably a way to add user defined ones
  if (obj.isMesh) {
    entity.addComponent(MeshTagComponent);
  } else if (obj.isScene) {
    entity.addComponent(SceneTagComponent);
  } else if (obj.isCamera) {
    entity.addComponent(CameraTagComponent);
  }
};

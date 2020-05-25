import {
  Object3D,
  MeshTagComponent,
  SceneTagComponent,
  CameraTagComponent
} from "./components/index.js";

function tagClassForObject3D(obj) {
  // TODO support more tags and probably a way to add user defined ones
  if (obj.isMesh) {
    return MeshTagComponent;
  } else if (obj.isScene) {
    return SceneTagComponent;
  } else if (obj.isCamera) {
    return CameraTagComponent;
  }
}

export function addObject3DComponents(entity, obj, parentEntity) {
  obj.entity = entity;
  entity.addComponent(Object3D, { value: obj });
  const Tag = tagClassForObject3D(obj);
  if (Tag) {
    entity.addComponent(Tag);
  }
  if (parentEntity) {
    parentEntity.getComponent(Object3D).value.add(obj);
  }
  return entity;
}
export function removeObject3DComponents(entity, unparent = true) {
  if (unparent) {
    const obj = entity.getComponent(Object3D).value;
    obj.parent && obj.parent.remove(obj);
  }
  entity.removeComponent(Object3D);
  const Tag = tagClassForObject3D(obj);
  if (Tag) {
    entity.removeComponent(Tag);
  }
  obj.entity = null;
}

import { Object3D } from "./components/index.js";

export function addObject3DComponents(entity, obj, parentEntity) {
  obj.entity = entity;
  entity.addComponent(Object3D, { value: obj });
  // TODO add actual tag components based on type
  // entity.addComponent(MeshTagComponent);
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
  // TODO remove actual tag components based on type, or maybe just all of the ecsy-three ones
  // entity.removeComponent(MeshTagComponent);
  obj.entity = null;
}

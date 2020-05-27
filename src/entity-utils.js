import {
  Object3DComponent,
  MeshTagComponent,
  SceneTagComponent,
  CameraTagComponent,
  ParentOnAdd
} from "./components/index.js";
import { ECSYThreeWorld } from "./world.js";

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
  entity.addComponent(Object3DComponent, { value: obj });
  const Tag = tagClassForObject3D(obj);
  if (Tag) {
    entity.addComponent(Tag);
  }

  if (parentEntity === undefined) {
    // warn
    console.warn(
      "addObject3DComponents: `parentEntity` must be explicitly set to an Entity or null"
    );
  }

  // @todo which one should have preference? or parentEntity?
  if (parentEntity) {
    parentEntity.getObject3D().add(obj);
    if (entity.hasComponent(ParentOnAdd)) {
      // warn
    }
  } else if (entity.hasComponent(ParentOnAdd)) {
    entity
      .getComponent(ParentOnAdd)
      .value.getObject3D()
      .add(obj);
    entity.removeComponent(ParentOnAdd); // @todo ,true ?
  }

  return entity;
}

export function removeObject3DComponents(entity, unparent = true) {
  const obj = entity.getComponent(Object3DComponent, true).value;
  if (unparent) {
    // Using "true" as the entity could be removed somewhere else
    obj.parent && obj.parent.remove(obj);
  }
  entity.removeComponent(Object3DComponent);
  const Tag = tagClassForObject3D(obj);
  if (Tag) {
    entity.removeComponent(Tag);
  }
  obj.entity = null;
}

export function getObject3D(entity) {
  return entity.getComponent(Object3DComponent).value;
}

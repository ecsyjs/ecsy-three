import {
  Object3DComponent,
  MeshTagComponent,
  SceneTagComponent,
  CameraTagComponent,
  ParentOnAdd,
  Position,
  Rotation,
  Scale
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

export function addObject3DComponents(entity, object3D, parentEntity) {
  object3D.entity = entity;
  entity.addComponent(Object3DComponent, { value: object3D });
  const Tag = tagClassForObject3D(object3D);
  if (Tag) {
    entity.addComponent(Tag);
  }

  // Transforms
  let position;
  if (entity.hasComponent(Position)) {
    position = entity.getMutableComponent(Position);
    object3D.position.copy(position.value);
    position.value = object3D.position;
  } else {
    entity.addComponent(Position, object3D.position);
  }

  let rotation;
  if (entity.hasComponent(Rotation)) {
    rotation = entity.getMutableComponent(Rotation);
    object3D.rotation.copy(rotation.value);
    rotation.value = object3D.rotation;
  } else {
    entity.addComponent(Rotation, object3D.rotation);
  }

  let scale;
  if (entity.hasComponent(Scale)) {
    scale = entity.getMutableComponent(Scale);
    object3D.scale.copy(scale.value);
    scale.value = object3D.scale;
  } else {
    entity.addComponent(Scale, object3D.scale);
  }

  // Hierarchy
  if (parentEntity === undefined) {
    // warn
    console.warn(
      "addObject3DComponents: `parentEntity` must be explicitly set to an Entity or null"
    );
  }

  // @todo which one should have preference? or parentEntity?
  if (parentEntity) {
    parentEntity.getObject3D().add(object3D);
    if (entity.hasComponent(ParentOnAdd)) {
      // warn
    }
  } else if (entity.hasComponent(ParentOnAdd)) {
    entity
      .getComponent(ParentOnAdd)
      .value.getObject3D()
      .add(object3D);
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

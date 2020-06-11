import { _Entity } from "ecsy";
import {
  Object3DComponent,
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

export class ECSYThreeEntity extends _Entity {
  addObject3DComponent(obj, parentEntity) {
    obj.entity = this;
    this.addComponent(Object3DComponent, { value: obj });
    const Tag = tagClassForObject3D(obj);
    if (Tag) {
      this.addComponent(Tag);
    }
    if (parentEntity) {
      parentEntity.getObject3D().add(obj);
    }
    return this;
  }

  removeObject3DComponent(unparent = true) {
    const obj = this.getComponent(Object3DComponent, true).value;
    if (unparent) {
      // Using "true" as the entity could be removed somewhere else
      obj.parent && obj.parent.remove(obj);
    }
    this.removeComponent(Object3DComponent);
    const Tag = tagClassForObject3D(obj);
    if (Tag) {
      this.removeComponent(Tag);
    }
    obj.entity = null;
  }

  remove(forceImmediate) {
    if (this.hasComponent(Object3DComponent)) {
      const obj = this.getObject3D();
      obj.traverse(o => {
        this.entityManager.removeEntity(o.entity, forceImmediate);
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    } else {
      this.entityManager.removeEntity(this, forceImmediate);
    }
  }

  getObject3D() {
    return this.getComponent(Object3DComponent).value;
  }
}

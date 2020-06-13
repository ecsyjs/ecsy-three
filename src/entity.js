import { _Entity } from "ecsy";
import { Object3DComponent } from "./components/index.js";

export class ECSYThreeEntity extends _Entity {
  addObject3DComponent(obj, parentEntity) {
    obj.entity = this;
    this.addComponent(Object3DComponent, { value: obj });
    this._world.world.object3DInflator.addTagClassesForObject3D(this, obj);
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
    this._world.world.object3DInflator.removeTagClassesForObject3D(this, obj);
    obj.entity = null;
  }

  remove(forceImmediate) {
    if (this.hasComponent(Object3DComponent)) {
      const obj = this.getObject3D();
      obj.traverse(o => {
        this._world.removeEntity(o.entity, forceImmediate);
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    } else {
      this._world.removeEntity(this, forceImmediate);
    }
  }

  getObject3D() {
    return this.getComponent(Object3DComponent).value;
  }
}

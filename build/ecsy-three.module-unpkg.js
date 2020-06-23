import { Component, Types, _Entity, TagComponent, World, createType, copyCopyable, cloneClonable } from 'https://unpkg.com/ecsy@0.2.6/build/ecsy.module.js';
export { Types } from 'https://unpkg.com/ecsy@0.2.6/build/ecsy.module.js';
import { Vector3 } from 'https://unpkg.com/three@0.117.1/build/three.module.js';

class Object3DComponent extends Component {}

Object3DComponent.schema = {
  value: { default: null, type: Types.Object }
};

class ECSYThreeEntity extends _Entity {
  addObject3DComponent(obj, parentEntity) {
    obj.entity = this;
    this.addComponent(Object3DComponent, { value: obj });
    this._entityManager.world.object3DInflator.inflate(this, obj);
    if (parentEntity && parentEntity.hasComponent(Object3DComponent)) {
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
    this._entityManager.world.object3DInflator.deflate(this, obj);
    obj.entity = null;
  }

  remove(forceImmediate) {
    if (this.hasComponent(Object3DComponent)) {
      const obj = this.getObject3D();
      obj.traverse(o => {
        if (o.entity) {
          this._entityManager.removeEntity(o.entity, forceImmediate);
        }
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    }
    this._entityManager.removeEntity(this, forceImmediate);
  }

  getObject3D() {
    return this.getComponent(Object3DComponent).value;
  }
}

class SceneTagComponent extends TagComponent {}
class CameraTagComponent extends TagComponent {}
class MeshTagComponent extends TagComponent {}

const defaultObject3DInflator = {
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

class ECSYThreeWorld extends World {
  constructor(options) {
    super(Object.assign({}, { entityClass: ECSYThreeEntity }, options));
    this.object3DInflator = defaultObject3DInflator;
  }
}

const Vector3Type = createType({
  name: "Vector3",
  default: new Vector3(),
  copy: copyCopyable,
  clone: cloneClonable
});

const ThreeTypes = {
  Vector3Type
};

export { CameraTagComponent, ECSYThreeWorld, MeshTagComponent, Object3DComponent, SceneTagComponent, ThreeTypes, Vector3Type, defaultObject3DInflator };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUtdW5wa2cuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL09iamVjdDNEQ29tcG9uZW50LmpzIiwiLi4vc3JjL2NvcmUvZW50aXR5LmpzIiwiLi4vc3JjL2NvcmUvT2JqZWN0M0RUYWdzLmpzIiwiLi4vc3JjL2NvcmUvZGVmYXVsdE9iamVjdDNESW5mbGF0b3IuanMiLCIuLi9zcmMvY29yZS93b3JsZC5qcyIsIi4uL3NyYy9jb3JlL1R5cGVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgT2JqZWN0M0RDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge31cblxuT2JqZWN0M0RDb21wb25lbnQuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IF9FbnRpdHkgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi9PYmplY3QzRENvbXBvbmVudC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlRW50aXR5IGV4dGVuZHMgX0VudGl0eSB7XG4gIGFkZE9iamVjdDNEQ29tcG9uZW50KG9iaiwgcGFyZW50RW50aXR5KSB7XG4gICAgb2JqLmVudGl0eSA9IHRoaXM7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IG9iaiB9KTtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLndvcmxkLm9iamVjdDNESW5mbGF0b3IuaW5mbGF0ZSh0aGlzLCBvYmopO1xuICAgIGlmIChwYXJlbnRFbnRpdHkgJiYgcGFyZW50RW50aXR5Lmhhc0NvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkpIHtcbiAgICAgIHBhcmVudEVudGl0eS5nZXRPYmplY3QzRCgpLmFkZChvYmopO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbW92ZU9iamVjdDNEQ29tcG9uZW50KHVucGFyZW50ID0gdHJ1ZSkge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuZ2V0Q29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB0cnVlKS52YWx1ZTtcbiAgICBpZiAodW5wYXJlbnQpIHtcbiAgICAgIC8vIFVzaW5nIFwidHJ1ZVwiIGFzIHRoZSBlbnRpdHkgY291bGQgYmUgcmVtb3ZlZCBzb21ld2hlcmUgZWxzZVxuICAgICAgb2JqLnBhcmVudCAmJiBvYmoucGFyZW50LnJlbW92ZShvYmopO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCk7XG4gICAgdGhpcy5fZW50aXR5TWFuYWdlci53b3JsZC5vYmplY3QzREluZmxhdG9yLmRlZmxhdGUodGhpcywgb2JqKTtcbiAgICBvYmouZW50aXR5ID0gbnVsbDtcbiAgfVxuXG4gIHJlbW92ZShmb3JjZUltbWVkaWF0ZSkge1xuICAgIGlmICh0aGlzLmhhc0NvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkpIHtcbiAgICAgIGNvbnN0IG9iaiA9IHRoaXMuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIG9iai50cmF2ZXJzZShvID0+IHtcbiAgICAgICAgaWYgKG8uZW50aXR5KSB7XG4gICAgICAgICAgdGhpcy5fZW50aXR5TWFuYWdlci5yZW1vdmVFbnRpdHkoby5lbnRpdHksIGZvcmNlSW1tZWRpYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBvLmVudGl0eSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIG9iai5wYXJlbnQgJiYgb2JqLnBhcmVudC5yZW1vdmUob2JqKTtcbiAgICB9XG4gICAgdGhpcy5fZW50aXR5TWFuYWdlci5yZW1vdmVFbnRpdHkodGhpcywgZm9yY2VJbW1lZGlhdGUpO1xuICB9XG5cbiAgZ2V0T2JqZWN0M0QoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KS52YWx1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNjZW5lVGFnQ29tcG9uZW50IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQ2FtZXJhVGFnQ29tcG9uZW50IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTWVzaFRhZ0NvbXBvbmVudCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHtcbiAgTWVzaFRhZ0NvbXBvbmVudCxcbiAgU2NlbmVUYWdDb21wb25lbnQsXG4gIENhbWVyYVRhZ0NvbXBvbmVudFxufSBmcm9tIFwiLi9PYmplY3QzRFRhZ3MuanNcIjtcblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRPYmplY3QzREluZmxhdG9yID0ge1xuICBpbmZsYXRlOiAoZW50aXR5LCBvYmopID0+IHtcbiAgICAvLyBUT0RPIHN1cHBvcnQgbW9yZSB0YWdzIGFuZCBwcm9iYWJseSBhIHdheSB0byBhZGQgdXNlciBkZWZpbmVkIG9uZXNcbiAgICBpZiAob2JqLmlzTWVzaCkge1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChNZXNoVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc1NjZW5lKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFNjZW5lVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc0NhbWVyYSkge1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChDYW1lcmFUYWdDb21wb25lbnQpO1xuICAgIH1cbiAgfSxcbiAgZGVmbGF0ZTogKGVudGl0eSwgb2JqKSA9PiB7XG4gICAgLy8gVE9ETyBzdXBwb3J0IG1vcmUgdGFncyBhbmQgcHJvYmFibHkgYSB3YXkgdG8gYWRkIHVzZXIgZGVmaW5lZCBvbmVzXG4gICAgaWYgKG9iai5pc01lc2gpIHtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoTWVzaFRhZ0NvbXBvbmVudCk7XG4gICAgfSBlbHNlIGlmIChvYmouaXNTY2VuZSkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChTY2VuZVRhZ0NvbXBvbmVudCk7XG4gICAgfSBlbHNlIGlmIChvYmouaXNDYW1lcmEpIHtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoQ2FtZXJhVGFnQ29tcG9uZW50KTtcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBFQ1NZVGhyZWVFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHkuanNcIjtcbmltcG9ydCB7IGRlZmF1bHRPYmplY3QzREluZmxhdG9yIH0gZnJvbSBcIi4vZGVmYXVsdE9iamVjdDNESW5mbGF0b3JcIjtcblxuZXhwb3J0IGNsYXNzIEVDU1lUaHJlZVdvcmxkIGV4dGVuZHMgV29ybGQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgc3VwZXIoT2JqZWN0LmFzc2lnbih7fSwgeyBlbnRpdHlDbGFzczogRUNTWVRocmVlRW50aXR5IH0sIG9wdGlvbnMpKTtcbiAgICB0aGlzLm9iamVjdDNESW5mbGF0b3IgPSBkZWZhdWx0T2JqZWN0M0RJbmZsYXRvcjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVmVjdG9yMyB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgY3JlYXRlVHlwZSwgY29weUNvcHlhYmxlLCBjbG9uZUNsb25hYmxlIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNvbnN0IFZlY3RvcjNUeXBlID0gY3JlYXRlVHlwZSh7XG4gIG5hbWU6IFwiVmVjdG9yM1wiLFxuICBkZWZhdWx0OiBuZXcgVmVjdG9yMygpLFxuICBjb3B5OiBjb3B5Q29weWFibGUsXG4gIGNsb25lOiBjbG9uZUNsb25hYmxlXG59KTtcblxuZXhwb3J0IGNvbnN0IFRocmVlVHlwZXMgPSB7XG4gIFZlY3RvcjNUeXBlXG59O1xuXG5leHBvcnQgeyBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG4i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

import { Matrix4 } from "three";
import { _wrapImmutableComponent } from "ecsy";

const DEBUG = false;

const _m1 = new Matrix4();
const _removedEvent = { type: "removed" };

export function EntityMixin(Object3DClass) {
  const Mixin = class extends Object3DClass {
    constructor(world, ...args) {
      super(...args);

      if (!world.isThreeWorld) {
        throw new Error(
          "The first argument to an Object3D entity must be an instance of ThreeWorld"
        );
      }

      this.world = world;

      // Unique ID for this entity
      this._id = this.world.nextEntityId++;

      // List of components types the entity has
      this.componentTypes = [];

      // Instance of the components
      this.components = {};

      this._componentsToRemove = {};

      // Queries where the entity is added
      this.queries = [];

      // Used for deferred removal
      this._componentTypesToRemove = [];

      this._alive = false;

      this._numSystemStateComponents = 0;

      this.isEntity = true;
      this.isECSYThreeEntity = true;
    }

    get alive() {
      return this._alive;
    }

    // COMPONENTS

    getComponent(Component, includeRemoved) {
      var component = this.components[Component.name];

      if (!component && includeRemoved === true) {
        component = this._componentsToRemove[Component.name];
      }

      return DEBUG ? _wrapImmutableComponent(Component, component) : component;
    }

    getRemovedComponent(Component) {
      return this._componentsToRemove[Component.name];
    }

    getComponents() {
      return this.components;
    }

    getComponentsToRemove() {
      return this._componentsToRemove;
    }

    getComponentTypes() {
      return this.componentTypes;
    }

    getMutableComponent(Component) {
      var component = this.components[Component.name];

      if (this._alive) {
        this.world.onComponentChanged(this, Component, component);
      }

      return component;
    }

    attachComponent(component) {
      const Component = component.constructor;

      if (~this.componentTypes.indexOf(Component)) return;

      this.componentTypes.push(Component);

      if (Component.isSystemStateComponent) {
        this._numSystemStateComponents++;
      }

      this.components[Component.name] = component;

      if (this._alive) {
        this.world.onComponentAdded(this, Component);
      }

      return this;
    }

    addComponent(Component, props) {
      if (~this.componentTypes.indexOf(Component)) return;

      this.componentTypes.push(Component);

      if (Component.isSystemStateComponent) {
        this._numSystemStateComponents++;
      }

      var componentPool = this.world.getComponentPool(Component);

      var component =
        componentPool === undefined
          ? new Component(props)
          : componentPool.acquire();

      if (componentPool && props) {
        component.copy(props);
      }

      this.components[Component.name] = component;

      if (this._alive) {
        this.world.onComponentAdded(this, Component);
      }

      return this;
    }

    hasComponent(Component, includeRemoved) {
      return (
        !!~this.componentTypes.indexOf(Component) ||
        (includeRemoved === true && this.hasRemovedComponent(Component))
      );
    }

    hasRemovedComponent(Component) {
      return !!~this._componentTypesToRemove.indexOf(Component);
    }

    hasAllComponents(Components) {
      for (var i = 0; i < Components.length; i++) {
        if (!this.hasComponent(Components[i])) return false;
      }
      return true;
    }

    hasAnyComponents(Components) {
      for (var i = 0; i < Components.length; i++) {
        if (this.hasComponent(Components[i])) return true;
      }
      return false;
    }

    removeComponent(Component, immediately) {
      const componentName = Component.name;
      const component = this.components[componentName];

      if (!this._componentsToRemove[componentName]) {
        delete this.components[componentName];

        const index = this.componentTypes.indexOf(Component);
        this.componentTypes.splice(index, 1);

        if (this._alive) {
          this.world.onRemoveComponent(this, Component);
        }
      }

      if (immediately) {
        if (component) {
          component.dispose();
        }

        if (this._componentsToRemove[componentName]) {
          delete this._componentsToRemove[componentName];
          const index = this._componentTypesToRemove.indexOf(Component);

          if (index !== -1) {
            this._componentTypesToRemove.splice(index, 1);
          }
        }
      } else if (this._alive) {
        this._componentTypesToRemove.push(Component);
        this._componentsToRemove[componentName] = component;
        this.world.queueComponentRemoval(this, Component);
      }

      if (Component.isSystemStateComponent) {
        this._numSystemStateComponents--;

        // Check if the entity was a ghost waiting for the last system state component to be removed
        if (this._numSystemStateComponents === 0 && !this._alive) {
          this.dispose();
        }
      }

      return true;
    }

    processRemovedComponents() {
      while (this._componentTypesToRemove.length > 0) {
        let Component = this._componentTypesToRemove.pop();
        this.removeComponent(Component, true);
      }
    }

    // TODO: Optimize this
    removeAllComponents(immediately) {
      let Components = this.componentTypes;

      for (let j = Components.length - 1; j >= 0; j--) {
        this.removeComponent(Components[j], immediately);
      }
    }

    add(...objects) {
      super.add(...objects);

      if (this.alive) {
        for (let i = 0; i < objects.length; i++) {
          const object = objects[i];

          if (object.isECSYThreeEntity) {
            this.world.addEntity(object);
          }
        }
      }

      return this;
    }

    remove(...objects) {
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];

        if (object.isECSYThreeEntity) {
          object.dispose();
        } else {
          super.remove(object);
        }
      }

      return this;
    }

    removeImmediately(...objects) {
      super.remove(...objects);

      if (this.alive) {
        for (let i = 0; i < objects.length; i++) {
          objects[i].dispose(true);
        }
      }

      return this;
    }

    attach(object) {
      // adds object as a child of this, while maintaining the object's world transform
      // Avoids entity being removed/added to world.

      this.updateWorldMatrix(true, false);

      _m1.getInverse(this.matrixWorld);

      if (object.parent !== null) {
        object.parent.updateWorldMatrix(true, false);

        _m1.multiply(object.parent.matrixWorld);
      }

      object.applyMatrix4(_m1);

      object.updateWorldMatrix(false, false);

      super.add(object);

      return this;
    }

    traverseEntities(callback) {
      this.traverse(child => {
        if (child.isECSYThreeEntity) {
          callback(child);
        }
      });
    }

    copy(source, recursive) {
      super.copy(source, recursive);

      // DISCUSS: Should we reset ComponentTypes and components here or in dispose?
      for (const componentName in source.components) {
        const sourceComponent = source.components[componentName];
        this.components[componentName] = sourceComponent.clone();
        this.componentTypes.push(sourceComponent.constructor);
      }

      return this;
    }

    clone(recursive) {
      return new this.constructor(this.world).copy(this, recursive);
    }

    dispose(immediately) {
      const parent = this.parent;

      if (parent) {
        const index = parent.children.indexOf(this);

        if (index !== -1) {
          this.parent = null;
          parent.children.splice(index, 1);
          this.dispatchEvent(_removedEvent);
        }
      }

      this.traverseEntities(child => {
        if (child._alive) {
          child.removeAllComponents(immediately);
          child.queries.length = 0;
        }

        child._alive = false;

        if (immediately) {
          child._id = child.world.nextEntityId++;

          child.world.onEntityDisposed(child);

          if (child._pool) {
            child._pool.release(child);
          }
        } else {
          child.world.queueEntityDisposal(child);
        }
      });
    }
  };

  Mixin.tagComponents = [];

  return Mixin;
}

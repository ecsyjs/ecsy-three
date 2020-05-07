import { World, ObjectPool } from "ecsy";

export class ThreeWorld extends World {
  constructor() {
    super();

    this.entityTypes = {};
    this.entityPools = {};
  }

  registerEntityType(EntityType, entityPool) {
    if (this.entityTypes[EntityType.name]) {
      console.warn(`Entity type: '${EntityType.name}' already registered.`);
      return this;
    }

    this.entityTypes[EntityType.name] = EntityType;

    if (entityPool === false) {
      entityPool = null;
    } else if (entityPool === undefined) {
      entityPool = new ObjectPool(new EntityType(this));
    }

    this.entityPools[EntityType.name] = entityPool;

    const tagComponents = EntityType.tagComponents;

    for (let i = 0; i < tagComponents.length; i++) {
      const tagComponent = tagComponents[i];
      if (!this.componentTypes[tagComponent.name]) {
        this.registerComponent(tagComponent);
      }
    }

    return this;
  }

  createEntity(EntityType) {
    const entity = this.createDetachedEntity(EntityType);
    return this.addEntity(entity);
  }

  createDetachedEntity(EntityType) {
    const entityPool =
      EntityType === undefined
        ? this.entityPool
        : this.entityPools[EntityType.name];

    const entity = entityPool ? entityPool.acquire() : new EntityType(this);

    return entity;
  }

  addEntity(entity) {
    if (entity.isObject3D) {
      entity.traverseEntities(child => {
        if (this.entitiesByUUID[entity.uuid]) {
          console.warn(`Entity ${entity.uuid} already added.`);
        }

        this.entitiesByUUID[entity.uuid] = child;
        this.entities.push(child);
        child.alive = true;

        for (let i = 0; i < child.componentTypes.length; i++) {
          const Component = child.componentTypes[i];
          this.onComponentAdded(child, Component);
        }
      });
    } else {
      if (this.entitiesByUUID[entity.uuid]) {
        console.warn(`Entity ${entity.uuid} already added.`);
        return entity;
      }

      this.entitiesByUUID[entity.uuid] = entity;
      this.entities.push(entity);
      entity.alive = true;

      for (let i = 0; i < entity.componentTypes.length; i++) {
        const Component = entity.componentTypes[i];
        this.onComponentAdded(entity, Component);
      }
    }

    return entity;
  }
}

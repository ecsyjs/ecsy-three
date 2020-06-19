import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, AnimationMixer, LoopOnce, Object3D, PositionalAudio, AudioListener, AudioLoader, Clock, Scene as Scene$1, PerspectiveCamera } from 'https://unpkg.com/three@0.117.1/build/three.module.js';
import * as THREE from 'https://unpkg.com/three@0.117.1/build/three.module.js';
export { THREE };
import { GLTFLoader as GLTFLoader$1 } from 'https://unpkg.com/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'https://unpkg.com/troika-3d-text@0.28.1/dist/textmesh-standalone.esm.js?module';
import { VRButton } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/XRControllerModelFactory.js';

/**
 * Return the name of a component
 * @param {Component} Component
 * @private
 */
function getName(Component) {
  return Component.name;
}

/**
 * Return a valid property name for the Component
 * @param {Component} Component
 * @private
 */
function componentPropertyName(Component) {
  return getName(Component);
}

/**
 * Get a key from a list of components
 * @param {Array(Component)} Components Array of components to generate the key
 * @private
 */
function queryKey(Components) {
  var names = [];
  for (var n = 0; n < Components.length; n++) {
    var T = Components[n];
    if (typeof T === "object") {
      var operator = T.operator === "not" ? "!" : T.operator;
      names.push(operator + getName(T.Component));
    } else {
      names.push(getName(T));
    }
  }

  return names.sort().join("-");
}

// Detector for browser's "window"
const hasWindow = typeof window !== "undefined";

// performance.now() "polyfill"
const now =
  hasWindow && typeof window.performance !== "undefined"
    ? performance.now.bind(performance)
    : Date.now.bind(Date);

/**
 * @private
 * @class EventDispatcher
 */
class EventDispatcher {
  constructor() {
    this._listeners = {};
    this.stats = {
      fired: 0,
      handled: 0
    };
  }

  /**
   * Add an event listener
   * @param {String} eventName Name of the event to listen
   * @param {Function} listener Callback to trigger when the event is fired
   */
  addEventListener(eventName, listener) {
    let listeners = this._listeners;
    if (listeners[eventName] === undefined) {
      listeners[eventName] = [];
    }

    if (listeners[eventName].indexOf(listener) === -1) {
      listeners[eventName].push(listener);
    }
  }

  /**
   * Check if an event listener is already added to the list of listeners
   * @param {String} eventName Name of the event to check
   * @param {Function} listener Callback for the specified event
   */
  hasEventListener(eventName, listener) {
    return (
      this._listeners[eventName] !== undefined &&
      this._listeners[eventName].indexOf(listener) !== -1
    );
  }

  /**
   * Remove an event listener
   * @param {String} eventName Name of the event to remove
   * @param {Function} listener Callback for the specified event
   */
  removeEventListener(eventName, listener) {
    var listenerArray = this._listeners[eventName];
    if (listenerArray !== undefined) {
      var index = listenerArray.indexOf(listener);
      if (index !== -1) {
        listenerArray.splice(index, 1);
      }
    }
  }

  /**
   * Dispatch an event
   * @param {String} eventName Name of the event to dispatch
   * @param {Entity} entity (Optional) Entity to emit
   * @param {Component} component
   */
  dispatchEvent(eventName, entity, component) {
    this.stats.fired++;

    var listenerArray = this._listeners[eventName];
    if (listenerArray !== undefined) {
      var array = listenerArray.slice(0);

      for (var i = 0; i < array.length; i++) {
        array[i].call(this, entity, component);
      }
    }
  }

  /**
   * Reset stats counters
   */
  resetCounters() {
    this.stats.fired = this.stats.handled = 0;
  }
}

class Query {
  /**
   * @param {Array(Component)} Components List of types of components to query
   */
  constructor(Components, manager) {
    this.Components = [];
    this.NotComponents = [];

    Components.forEach(component => {
      if (typeof component === "object") {
        this.NotComponents.push(component.Component);
      } else {
        this.Components.push(component);
      }
    });

    if (this.Components.length === 0) {
      throw new Error("Can't create a query without components");
    }

    this.entities = [];

    this.eventDispatcher = new EventDispatcher();

    // This query is being used by a reactive system
    this.reactive = false;

    this.key = queryKey(Components);

    // Fill the query with the existing entities
    for (var i = 0; i < manager._entities.length; i++) {
      var entity = manager._entities[i];
      if (this.match(entity)) {
        // @todo ??? this.addEntity(entity); => preventing the event to be generated
        entity.queries.push(this);
        this.entities.push(entity);
      }
    }
  }

  /**
   * Add entity to this query
   * @param {Entity} entity
   */
  addEntity(entity) {
    entity.queries.push(this);
    this.entities.push(entity);

    this.eventDispatcher.dispatchEvent(Query.prototype.ENTITY_ADDED, entity);
  }

  /**
   * Remove entity from this query
   * @param {Entity} entity
   */
  removeEntity(entity) {
    let index = this.entities.indexOf(entity);
    if (~index) {
      this.entities.splice(index, 1);

      index = entity.queries.indexOf(this);
      entity.queries.splice(index, 1);

      this.eventDispatcher.dispatchEvent(
        Query.prototype.ENTITY_REMOVED,
        entity
      );
    }
  }

  match(entity) {
    return (
      entity.hasAllComponents(this.Components) &&
      !entity.hasAnyComponents(this.NotComponents)
    );
  }

  toJSON() {
    return {
      key: this.key,
      reactive: this.reactive,
      components: {
        included: this.Components.map(C => C.name),
        not: this.NotComponents.map(C => C.name)
      },
      numEntities: this.entities.length
    };
  }

  /**
   * Return stats for this query
   */
  stats() {
    return {
      numComponents: this.Components.length,
      numEntities: this.entities.length
    };
  }
}

Query.prototype.ENTITY_ADDED = "Query#ENTITY_ADDED";
Query.prototype.ENTITY_REMOVED = "Query#ENTITY_REMOVED";
Query.prototype.COMPONENT_CHANGED = "Query#COMPONENT_CHANGED";

class System {
  canExecute() {
    if (this._mandatoryQueries.length === 0) return true;

    for (let i = 0; i < this._mandatoryQueries.length; i++) {
      var query = this._mandatoryQueries[i];
      if (query.entities.length === 0) {
        return false;
      }
    }

    return true;
  }

  constructor(world, attributes) {
    this.world = world;
    this.enabled = true;

    // @todo Better naming :)
    this._queries = {};
    this.queries = {};

    this.priority = 0;

    // Used for stats
    this.executeTime = 0;

    if (attributes && attributes.priority) {
      this.priority = attributes.priority;
    }

    this._mandatoryQueries = [];

    this.initialized = true;

    if (this.constructor.queries) {
      for (var queryName in this.constructor.queries) {
        var queryConfig = this.constructor.queries[queryName];
        var Components = queryConfig.components;
        if (!Components || Components.length === 0) {
          throw new Error("'components' attribute can't be empty in a query");
        }
        var query = this.world.entityManager.queryComponents(Components);
        this._queries[queryName] = query;
        if (queryConfig.mandatory === true) {
          this._mandatoryQueries.push(query);
        }
        this.queries[queryName] = {
          results: query.entities
        };

        // Reactive configuration added/removed/changed
        var validEvents = ["added", "removed", "changed"];

        const eventMapping = {
          added: Query.prototype.ENTITY_ADDED,
          removed: Query.prototype.ENTITY_REMOVED,
          changed: Query.prototype.COMPONENT_CHANGED // Query.prototype.ENTITY_CHANGED
        };

        if (queryConfig.listen) {
          validEvents.forEach(eventName => {
            if (!this.execute) {
              console.warn(
                `System '${
                  this.constructor.name
                }' has defined listen events (${validEvents.join(
                  ", "
                )}) for query '${queryName}' but it does not implement the 'execute' method.`
              );
            }

            // Is the event enabled on this system's query?
            if (queryConfig.listen[eventName]) {
              let event = queryConfig.listen[eventName];

              if (eventName === "changed") {
                query.reactive = true;
                if (event === true) {
                  // Any change on the entity from the components in the query
                  let eventList = (this.queries[queryName][eventName] = []);
                  query.eventDispatcher.addEventListener(
                    Query.prototype.COMPONENT_CHANGED,
                    entity => {
                      // Avoid duplicates
                      if (eventList.indexOf(entity) === -1) {
                        eventList.push(entity);
                      }
                    }
                  );
                } else if (Array.isArray(event)) {
                  let eventList = (this.queries[queryName][eventName] = []);
                  query.eventDispatcher.addEventListener(
                    Query.prototype.COMPONENT_CHANGED,
                    (entity, changedComponent) => {
                      // Avoid duplicates
                      if (
                        event.indexOf(changedComponent.constructor) !== -1 &&
                        eventList.indexOf(entity) === -1
                      ) {
                        eventList.push(entity);
                      }
                    }
                  );
                }
              } else {
                let eventList = (this.queries[queryName][eventName] = []);

                query.eventDispatcher.addEventListener(
                  eventMapping[eventName],
                  entity => {
                    // @fixme overhead?
                    if (eventList.indexOf(entity) === -1)
                      eventList.push(entity);
                  }
                );
              }
            }
          });
        }
      }
    }
  }

  stop() {
    this.executeTime = 0;
    this.enabled = false;
  }

  play() {
    this.enabled = true;
  }

  // @question rename to clear queues?
  clearEvents() {
    for (let queryName in this.queries) {
      var query = this.queries[queryName];
      if (query.added) {
        query.added.length = 0;
      }
      if (query.removed) {
        query.removed.length = 0;
      }
      if (query.changed) {
        if (Array.isArray(query.changed)) {
          query.changed.length = 0;
        } else {
          for (let name in query.changed) {
            query.changed[name].length = 0;
          }
        }
      }
    }
  }

  toJSON() {
    var json = {
      name: this.constructor.name,
      enabled: this.enabled,
      executeTime: this.executeTime,
      priority: this.priority,
      queries: {}
    };

    if (this.constructor.queries) {
      var queries = this.constructor.queries;
      for (let queryName in queries) {
        let query = this.queries[queryName];
        let queryDefinition = queries[queryName];
        let jsonQuery = (json.queries[queryName] = {
          key: this._queries[queryName].key
        });

        jsonQuery.mandatory = queryDefinition.mandatory === true;
        jsonQuery.reactive =
          queryDefinition.listen &&
          (queryDefinition.listen.added === true ||
            queryDefinition.listen.removed === true ||
            queryDefinition.listen.changed === true ||
            Array.isArray(queryDefinition.listen.changed));

        if (jsonQuery.reactive) {
          jsonQuery.listen = {};

          const methods = ["added", "removed", "changed"];
          methods.forEach(method => {
            if (query[method]) {
              jsonQuery.listen[method] = {
                entities: query[method].length
              };
            }
          });
        }
      }
    }

    return json;
  }
}

function Not(Component) {
  return {
    operator: "not",
    Component: Component
  };
}

class SystemManager {
  constructor(world) {
    this._systems = [];
    this._executeSystems = []; // Systems that have `execute` method
    this.world = world;
    this.lastExecutedSystem = null;
  }

  registerSystem(SystemClass, attributes) {
    if (!(SystemClass.prototype instanceof System)) {
      throw new Error(
        `System '${SystemClass.name}' does not extends 'System' class`
      );
    }
    if (this.getSystem(SystemClass) !== undefined) {
      console.warn(`System '${SystemClass.name}' already registered.`);
      return this;
    }

    var system = new SystemClass(this.world, attributes);
    if (system.init) system.init(attributes);
    system.order = this._systems.length;
    this._systems.push(system);
    if (system.execute) {
      this._executeSystems.push(system);
      this.sortSystems();
    }
    return this;
  }

  unregisterSystem(SystemClass) {
    let system = this.getSystem(SystemClass);
    if (system === undefined) {
      console.warn(
        `Can unregister system '${SystemClass.name}'. It doesn't exist.`
      );
      return this;
    }

    this._systems.splice(this._systems.indexOf(system), 1);

    if (system.execute) {
      this._executeSystems.splice(this._executeSystems.indexOf(system), 1);
    }

    // @todo Add system.unregister() call to free resources
    return this;
  }

  sortSystems() {
    this._executeSystems.sort((a, b) => {
      return a.priority - b.priority || a.order - b.order;
    });
  }

  getSystem(SystemClass) {
    return this._systems.find(s => s instanceof SystemClass);
  }

  getSystems() {
    return this._systems;
  }

  removeSystem(SystemClass) {
    var index = this._systems.indexOf(SystemClass);
    if (!~index) return;

    this._systems.splice(index, 1);
  }

  executeSystem(system, delta, time) {
    if (system.initialized) {
      if (system.canExecute()) {
        let startTime = now();
        system.execute(delta, time);
        system.executeTime = now() - startTime;
        this.lastExecutedSystem = system;
        system.clearEvents();
      }
    }
  }

  stop() {
    this._executeSystems.forEach(system => system.stop());
  }

  execute(delta, time, forcePlay) {
    this._executeSystems.forEach(
      system =>
        (forcePlay || system.enabled) && this.executeSystem(system, delta, time)
    );
  }

  stats() {
    var stats = {
      numSystems: this._systems.length,
      systems: {}
    };

    for (var i = 0; i < this._systems.length; i++) {
      var system = this._systems[i];
      var systemStats = (stats.systems[system.constructor.name] = {
        queries: {},
        executeTime: system.executeTime
      });
      for (var name in system.ctx) {
        systemStats.queries[name] = system.ctx[name].stats();
      }
    }

    return stats;
  }
}

class ObjectPool {
  // @todo Add initial size
  constructor(baseObject, initialSize) {
    this.freeList = [];
    this.count = 0;
    this.baseObject = baseObject;
    this.isObjectPool = true;

    if (typeof initialSize !== "undefined") {
      this.expand(initialSize);
    }
  }

  acquire() {
    // Grow the list by 20%ish if we're out
    if (this.freeList.length <= 0) {
      this.expand(Math.round(this.count * 0.2) + 1);
    }

    var item = this.freeList.pop();

    return item;
  }

  release(item) {
    item.reset();
    this.freeList.push(item);
  }

  expand(count) {
    for (var n = 0; n < count; n++) {
      var clone = new this.baseObject();
      clone._pool = this;
      this.freeList.push(clone);
    }
    this.count += count;
  }

  totalSize() {
    return this.count;
  }

  totalFree() {
    return this.freeList.length;
  }

  totalUsed() {
    return this.count - this.freeList.length;
  }
}

/**
 * @private
 * @class QueryManager
 */
class QueryManager {
  constructor(world) {
    this._world = world;

    // Queries indexed by a unique identifier for the components it has
    this._queries = {};
  }

  onEntityRemoved(entity) {
    for (var queryName in this._queries) {
      var query = this._queries[queryName];
      if (entity.queries.indexOf(query) !== -1) {
        query.removeEntity(entity);
      }
    }
  }

  /**
   * Callback when a component is added to an entity
   * @param {Entity} entity Entity that just got the new component
   * @param {Component} Component Component added to the entity
   */
  onEntityComponentAdded(entity, Component) {
    // @todo Use bitmask for checking components?

    // Check each indexed query to see if we need to add this entity to the list
    for (var queryName in this._queries) {
      var query = this._queries[queryName];

      if (
        !!~query.NotComponents.indexOf(Component) &&
        ~query.entities.indexOf(entity)
      ) {
        query.removeEntity(entity);
        continue;
      }

      // Add the entity only if:
      // Component is in the query
      // and Entity has ALL the components of the query
      // and Entity is not already in the query
      if (
        !~query.Components.indexOf(Component) ||
        !query.match(entity) ||
        ~query.entities.indexOf(entity)
      )
        continue;

      query.addEntity(entity);
    }
  }

  /**
   * Callback when a component is removed from an entity
   * @param {Entity} entity Entity to remove the component from
   * @param {Component} Component Component to remove from the entity
   */
  onEntityComponentRemoved(entity, Component) {
    for (var queryName in this._queries) {
      var query = this._queries[queryName];

      if (
        !!~query.NotComponents.indexOf(Component) &&
        !~query.entities.indexOf(entity) &&
        query.match(entity)
      ) {
        query.addEntity(entity);
        continue;
      }

      if (
        !!~query.Components.indexOf(Component) &&
        !!~query.entities.indexOf(entity) &&
        !query.match(entity)
      ) {
        query.removeEntity(entity);
        continue;
      }
    }
  }

  /**
   * Get a query for the specified components
   * @param {Component} Components Components that the query should have
   */
  getQuery(Components) {
    var key = queryKey(Components);
    var query = this._queries[key];
    if (!query) {
      this._queries[key] = query = new Query(Components, this._world);
    }
    return query;
  }

  /**
   * Return some stats from this class
   */
  stats() {
    var stats = {};
    for (var queryName in this._queries) {
      stats[queryName] = this._queries[queryName].stats();
    }
    return stats;
  }
}

class Component {
  constructor(props) {
    if (props !== false) {
      const schema = this.constructor.schema;

      for (const key in schema) {
        if (props && props.hasOwnProperty(key)) {
          this[key] = props[key];
        } else {
          const schemaProp = schema[key];
          if (schemaProp.hasOwnProperty("default")) {
            this[key] = schemaProp.type.clone(schemaProp.default);
          } else {
            const type = schemaProp.type;
            this[key] = type.clone(type.default);
          }
        }
      }
    }

    this._pool = null;
  }

  copy(source) {
    const schema = this.constructor.schema;

    for (const key in schema) {
      const prop = schema[key];

      if (source.hasOwnProperty(key)) {
        prop.type.copy(source, this, key);
      }
    }

    return this;
  }

  clone() {
    return new this.constructor().copy(this);
  }

  reset() {
    const schema = this.constructor.schema;

    for (const key in schema) {
      const schemaProp = schema[key];

      if (schemaProp.hasOwnProperty("default")) {
        this[key] = schemaProp.type.clone(schemaProp.default);
      } else {
        const type = schemaProp.type;
        this[key] = type.clone(type.default);
      }
    }
  }

  dispose() {
    if (this._pool) {
      this._pool.release(this);
    }
  }
}

Component.schema = {};
Component.isComponent = true;

class SystemStateComponent extends Component {}

SystemStateComponent.isSystemStateComponent = true;

class EntityPool extends ObjectPool {
  constructor(entityManager, entityClass, initialSize) {
    super(entityClass, undefined);
    this.entityManager = entityManager;

    if (typeof initialSize !== "undefined") {
      this.expand(initialSize);
    }
  }

  expand(count) {
    for (var n = 0; n < count; n++) {
      var clone = new this.baseObject(this.entityManager);
      clone._pool = this;
      this.freeList.push(clone);
    }
    this.count += count;
  }
}

/**
 * @private
 * @class EntityManager
 */
class EntityManager {
  constructor(world) {
    this.world = world;
    this.componentsManager = world.componentsManager;

    // All the entities in this instance
    this._entities = [];
    this._nextEntityId = 0;

    this._entitiesByNames = {};

    this._queryManager = new QueryManager(this);
    this.eventDispatcher = new EventDispatcher();
    this._entityPool = new EntityPool(
      this,
      this.world.options.entityClass,
      this.world.options.entityPoolSize
    );

    // Deferred deletion
    this.entitiesWithComponentsToRemove = [];
    this.entitiesToRemove = [];
    this.deferredRemovalEnabled = true;
  }

  getEntityByName(name) {
    return this._entitiesByNames[name];
  }

  /**
   * Create a new entity
   */
  createEntity(name) {
    var entity = this._entityPool.acquire();
    entity.alive = true;
    entity.name = name || "";
    if (name) {
      if (this._entitiesByNames[name]) {
        console.warn(`Entity name '${name}' already exist`);
      } else {
        this._entitiesByNames[name] = entity;
      }
    }

    this._entities.push(entity);
    this.eventDispatcher.dispatchEvent(ENTITY_CREATED, entity);
    return entity;
  }

  // COMPONENTS

  /**
   * Add a component to an entity
   * @param {Entity} entity Entity where the component will be added
   * @param {Component} Component Component to be added to the entity
   * @param {Object} values Optional values to replace the default attributes
   */
  entityAddComponent(entity, Component, values) {
    if (!this.world.componentsManager.Components[Component.name]) {
      throw new Error(
        `Attempted to add unregistered component "${Component.name}"`
      );
    }

    if (~entity._ComponentTypes.indexOf(Component)) {
      // @todo Just on debug mode
      console.warn(
        "Component type already exists on entity.",
        entity,
        Component.name
      );
      return;
    }

    entity._ComponentTypes.push(Component);

    if (Component.__proto__ === SystemStateComponent) {
      entity.numStateComponents++;
    }

    var componentPool = this.world.componentsManager.getComponentsPool(
      Component
    );

    var component = componentPool
      ? componentPool.acquire()
      : new Component(values);

    if (componentPool && values) {
      component.copy(values);
    }

    entity._components[Component.name] = component;

    this._queryManager.onEntityComponentAdded(entity, Component);
    this.world.componentsManager.componentAddedToEntity(Component);

    this.eventDispatcher.dispatchEvent(COMPONENT_ADDED, entity, Component);
  }

  /**
   * Remove a component from an entity
   * @param {Entity} entity Entity which will get removed the component
   * @param {*} Component Component to remove from the entity
   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
   */
  entityRemoveComponent(entity, Component, immediately) {
    var index = entity._ComponentTypes.indexOf(Component);
    if (!~index) return;

    this.eventDispatcher.dispatchEvent(COMPONENT_REMOVE, entity, Component);

    if (immediately) {
      this._entityRemoveComponentSync(entity, Component, index);
    } else {
      if (entity._ComponentTypesToRemove.length === 0)
        this.entitiesWithComponentsToRemove.push(entity);

      entity._ComponentTypes.splice(index, 1);
      entity._ComponentTypesToRemove.push(Component);

      var componentName = getName(Component);
      entity._componentsToRemove[componentName] =
        entity._components[componentName];
      delete entity._components[componentName];
    }

    // Check each indexed query to see if we need to remove it
    this._queryManager.onEntityComponentRemoved(entity, Component);

    if (Component.__proto__ === SystemStateComponent) {
      entity.numStateComponents--;

      // Check if the entity was a ghost waiting for the last system state component to be removed
      if (entity.numStateComponents === 0 && !entity.alive) {
        entity.remove();
      }
    }
  }

  _entityRemoveComponentSync(entity, Component, index) {
    // Remove T listing on entity and property ref, then free the component.
    entity._ComponentTypes.splice(index, 1);
    var componentName = getName(Component);
    var component = entity._components[componentName];
    delete entity._components[componentName];
    component.dispose();
    this.world.componentsManager.componentRemovedFromEntity(Component);
  }

  /**
   * Remove all the components from an entity
   * @param {Entity} entity Entity from which the components will be removed
   */
  entityRemoveAllComponents(entity, immediately) {
    let Components = entity._ComponentTypes;

    for (let j = Components.length - 1; j >= 0; j--) {
      if (Components[j].__proto__ !== SystemStateComponent)
        this.entityRemoveComponent(entity, Components[j], immediately);
    }
  }

  /**
   * Remove the entity from this manager. It will clear also its components
   * @param {Entity} entity Entity to remove from the manager
   * @param {Bool} immediately If you want to remove the component immediately instead of deferred (Default is false)
   */
  removeEntity(entity, immediately) {
    var index = this._entities.indexOf(entity);

    if (!~index) throw new Error("Tried to remove entity not in list");

    entity.alive = false;

    if (entity.numStateComponents === 0) {
      // Remove from entity list
      this.eventDispatcher.dispatchEvent(ENTITY_REMOVED, entity);
      this._queryManager.onEntityRemoved(entity);
      if (immediately === true) {
        this._releaseEntity(entity, index);
      } else {
        this.entitiesToRemove.push(entity);
      }
    }

    this.entityRemoveAllComponents(entity, immediately);
  }

  _releaseEntity(entity, index) {
    this._entities.splice(index, 1);

    if (this._entitiesByNames[entity.name]) {
      delete this._entitiesByNames[entity.name];
    }
    entity._pool.release(entity);
  }

  /**
   * Remove all entities from this manager
   */
  removeAllEntities() {
    for (var i = this._entities.length - 1; i >= 0; i--) {
      this.removeEntity(this._entities[i]);
    }
  }

  processDeferredRemoval() {
    if (!this.deferredRemovalEnabled) {
      return;
    }

    for (let i = 0; i < this.entitiesToRemove.length; i++) {
      let entity = this.entitiesToRemove[i];
      let index = this._entities.indexOf(entity);
      this._releaseEntity(entity, index);
    }
    this.entitiesToRemove.length = 0;

    for (let i = 0; i < this.entitiesWithComponentsToRemove.length; i++) {
      let entity = this.entitiesWithComponentsToRemove[i];
      while (entity._ComponentTypesToRemove.length > 0) {
        let Component = entity._ComponentTypesToRemove.pop();

        var componentName = getName(Component);
        var component = entity._componentsToRemove[componentName];
        delete entity._componentsToRemove[componentName];
        component.dispose();
        this.world.componentsManager.componentRemovedFromEntity(Component);

        //this._entityRemoveComponentSync(entity, Component, index);
      }
    }

    this.entitiesWithComponentsToRemove.length = 0;
  }

  /**
   * Get a query based on a list of components
   * @param {Array(Component)} Components List of components that will form the query
   */
  queryComponents(Components) {
    return this._queryManager.getQuery(Components);
  }

  // EXTRAS

  /**
   * Return number of entities
   */
  count() {
    return this._entities.length;
  }

  /**
   * Return some stats
   */
  stats() {
    var stats = {
      numEntities: this._entities.length,
      numQueries: Object.keys(this._queryManager._queries).length,
      queries: this._queryManager.stats(),
      numComponentPool: Object.keys(this.componentsManager._componentPool)
        .length,
      componentPool: {},
      eventDispatcher: this.eventDispatcher.stats
    };

    for (var cname in this.componentsManager._componentPool) {
      var pool = this.componentsManager._componentPool[cname];
      stats.componentPool[cname] = {
        used: pool.totalUsed(),
        size: pool.count
      };
    }

    return stats;
  }
}

const ENTITY_CREATED = "EntityManager#ENTITY_CREATE";
const ENTITY_REMOVED = "EntityManager#ENTITY_REMOVED";
const COMPONENT_ADDED = "EntityManager#COMPONENT_ADDED";
const COMPONENT_REMOVE = "EntityManager#COMPONENT_REMOVE";

class ComponentManager {
  constructor() {
    this.Components = {};
    this._componentPool = {};
    this.numComponents = {};
  }

  registerComponent(Component, objectPool) {
    if (this.Components[Component.name]) {
      console.warn(`Component type: '${Component.name}' already registered.`);
      return;
    }

    const schema = Component.schema;

    if (!schema) {
      throw new Error(`Component "${Component.name}" has no schema property.`);
    }

    for (const propName in schema) {
      const prop = schema[propName];

      if (!prop.type) {
        throw new Error(
          `Invalid schema for component "${Component.name}". Missing type for "${propName}" property.`
        );
      }
    }

    this.Components[Component.name] = Component;
    this.numComponents[Component.name] = 0;

    if (objectPool === undefined) {
      objectPool = new ObjectPool(Component);
    } else if (objectPool === false) {
      objectPool = undefined;
    }

    this._componentPool[Component.name] = objectPool;
  }

  componentAddedToEntity(Component) {
    if (!this.Components[Component.name]) {
      this.registerComponent(Component);
    }

    this.numComponents[Component.name]++;
  }

  componentRemovedFromEntity(Component) {
    this.numComponents[Component.name]--;
  }

  getComponentsPool(Component) {
    var componentName = componentPropertyName(Component);
    return this._componentPool[componentName];
  }
}

var name = "ecsy";
var version = "0.2.6";
var description = "Entity Component System in JS";
var main = "build/ecsy.js";
var module = "build/ecsy.module.js";
var types = "src/index.d.ts";
var scripts = {
	build: "rollup -c && npm run docs",
	docs: "rm docs/api/_sidebar.md; typedoc --readme none --mode file --excludeExternals --plugin typedoc-plugin-markdown  --theme docs/theme --hideSources --hideBreadcrumbs --out docs/api/ --includeDeclarations --includes 'src/**/*.d.ts' src; touch docs/api/_sidebar.md",
	"dev:docs": "nodemon -e ts -x 'npm run docs' -w src",
	dev: "concurrently --names 'ROLLUP,DOCS,HTTP' -c 'bgBlue.bold,bgYellow.bold,bgGreen.bold' 'rollup -c -w -m inline' 'npm run dev:docs' 'npm run dev:server'",
	"dev:server": "http-server -c-1 -p 8080 --cors",
	lint: "eslint src test examples",
	start: "npm run dev",
	benchmarks: "node -r esm --expose-gc benchmarks/index.js",
	test: "ava",
	travis: "npm run lint && npm run test && npm run build",
	"watch:test": "ava --watch"
};
var repository = {
	type: "git",
	url: "git+https://github.com/fernandojsg/ecsy.git"
};
var keywords = [
	"ecs",
	"entity component system"
];
var author = "Fernando Serrano <fernandojsg@gmail.com> (http://fernandojsg.com)";
var license = "MIT";
var bugs = {
	url: "https://github.com/fernandojsg/ecsy/issues"
};
var ava = {
	files: [
		"test/**/*.test.js"
	],
	sources: [
		"src/**/*.js"
	],
	require: [
		"babel-register",
		"esm"
	]
};
var jspm = {
	files: [
		"package.json",
		"LICENSE",
		"README.md",
		"build/ecsy.js",
		"build/ecsy.min.js",
		"build/ecsy.module.js"
	],
	directories: {
	}
};
var homepage = "https://github.com/fernandojsg/ecsy#readme";
var devDependencies = {
	ava: "^1.4.1",
	"babel-cli": "^6.26.0",
	"babel-core": "^6.26.3",
	"babel-eslint": "^10.0.3",
	"babel-loader": "^8.0.6",
	"benchmarker-js": "0.0.3",
	concurrently: "^4.1.2",
	"docsify-cli": "^4.4.0",
	eslint: "^5.16.0",
	"eslint-config-prettier": "^4.3.0",
	"eslint-plugin-prettier": "^3.1.2",
	"http-server": "^0.11.1",
	nodemon: "^1.19.4",
	prettier: "^1.19.1",
	rollup: "^1.29.0",
	"rollup-plugin-json": "^4.0.0",
	"rollup-plugin-terser": "^5.2.0",
	typedoc: "^0.15.8",
	"typedoc-plugin-markdown": "^2.2.16",
	typescript: "^3.7.5"
};
var pjson = {
	name: name,
	version: version,
	description: description,
	main: main,
	"jsnext:main": "build/ecsy.module.js",
	module: module,
	types: types,
	scripts: scripts,
	repository: repository,
	keywords: keywords,
	author: author,
	license: license,
	bugs: bugs,
	ava: ava,
	jspm: jspm,
	homepage: homepage,
	devDependencies: devDependencies
};

const Version = pjson.version;

class Entity {
  constructor(entityManager) {
    this._entityManager = entityManager || null;

    // Unique ID for this entity
    this.id = entityManager._nextEntityId++;

    // List of components types the entity has
    this._ComponentTypes = [];

    // Instance of the components
    this._components = {};

    this._componentsToRemove = {};

    // Queries where the entity is added
    this.queries = [];

    // Used for deferred removal
    this._ComponentTypesToRemove = [];

    this.alive = false;

    //if there are state components on a entity, it can't be removed completely
    this.numStateComponents = 0;
  }

  // COMPONENTS

  getComponent(Component, includeRemoved) {
    var component = this._components[Component.name];

    if (!component && includeRemoved === true) {
      component = this._componentsToRemove[Component.name];
    }

    return  component;
  }

  getRemovedComponent(Component) {
    return this._componentsToRemove[Component.name];
  }

  getComponents() {
    return this._components;
  }

  getComponentsToRemove() {
    return this._componentsToRemove;
  }

  getComponentTypes() {
    return this._ComponentTypes;
  }

  getMutableComponent(Component) {
    var component = this._components[Component.name];
    for (var i = 0; i < this.queries.length; i++) {
      var query = this.queries[i];
      // @todo accelerate this check. Maybe having query._Components as an object
      // @todo add Not components
      if (query.reactive && query.Components.indexOf(Component) !== -1) {
        query.eventDispatcher.dispatchEvent(
          Query.prototype.COMPONENT_CHANGED,
          this,
          component
        );
      }
    }
    return component;
  }

  addComponent(Component, values) {
    this._entityManager.entityAddComponent(this, Component, values);
    return this;
  }

  removeComponent(Component, forceImmediate) {
    this._entityManager.entityRemoveComponent(this, Component, forceImmediate);
    return this;
  }

  hasComponent(Component, includeRemoved) {
    return (
      !!~this._ComponentTypes.indexOf(Component) ||
      (includeRemoved === true && this.hasRemovedComponent(Component))
    );
  }

  hasRemovedComponent(Component) {
    return !!~this._ComponentTypesToRemove.indexOf(Component);
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

  removeAllComponents(forceImmediate) {
    return this._entityManager.entityRemoveAllComponents(this, forceImmediate);
  }

  copy(src) {
    // TODO: This can definitely be optimized
    for (var componentName in src._components) {
      var srcComponent = src._components[componentName];
      this.addComponent(srcComponent.constructor);
      var component = this.getComponent(srcComponent.constructor);
      component.copy(srcComponent);
    }

    return this;
  }

  clone() {
    return new Entity(this._entityManager).copy(this);
  }

  reset() {
    this.id = this._entityManager._nextEntityId++;
    this._ComponentTypes.length = 0;
    this.queries.length = 0;

    for (var componentName in this.components) {
      delete this._components[componentName];
    }
  }

  remove(forceImmediate) {
    return this._entityManager.removeEntity(this, forceImmediate);
  }
}

const DEFAULT_OPTIONS = {
  entityPoolSize: 0,
  entityClass: Entity
};

class World {
  constructor(options = {}) {
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.componentsManager = new ComponentManager(this);
    this.entityManager = new EntityManager(this);
    this.systemManager = new SystemManager(this);

    this.enabled = true;

    this.eventQueues = {};

    if (hasWindow && typeof CustomEvent !== "undefined") {
      var event = new CustomEvent("ecsy-world-created", {
        detail: { world: this, version: Version }
      });
      window.dispatchEvent(event);
    }

    this.lastTime = now();
  }

  registerComponent(Component, objectPool) {
    this.componentsManager.registerComponent(Component, objectPool);
    return this;
  }

  registerSystem(System, attributes) {
    this.systemManager.registerSystem(System, attributes);
    return this;
  }

  unregisterSystem(System) {
    this.systemManager.unregisterSystem(System);
    return this;
  }

  getSystem(SystemClass) {
    return this.systemManager.getSystem(SystemClass);
  }

  getSystems() {
    return this.systemManager.getSystems();
  }

  execute(delta, time) {
    if (!delta) {
      time = now();
      delta = time - this.lastTime;
      this.lastTime = time;
    }

    if (this.enabled) {
      this.systemManager.execute(delta, time);
      this.entityManager.processDeferredRemoval();
    }
  }

  stop() {
    this.enabled = false;
  }

  play() {
    this.enabled = true;
  }

  createEntity(name) {
    return this.entityManager.createEntity(name);
  }

  stats() {
    var stats = {
      entities: this.entityManager.stats(),
      system: this.systemManager.stats()
    };

    console.log(JSON.stringify(stats, null, 2));
  }
}

class TagComponent extends Component {
  constructor() {
    super(false);
  }
}

TagComponent.isTagComponent = true;

const copyValue = (src, dest, key) => (dest[key] = src[key]);

const cloneValue = src => src;

const copyArray = (src, dest, key) => {
  const srcArray = src[key];
  const destArray = dest[key];

  destArray.length = 0;

  for (let i = 0; i < srcArray.length; i++) {
    destArray.push(srcArray[i]);
  }

  return destArray;
};

const cloneArray = src => src.slice();

const copyJSON = (src, dest, key) =>
  (dest[key] = JSON.parse(JSON.stringify(src[key])));

const cloneJSON = src => JSON.parse(JSON.stringify(src));

const copyCopyable = (src, dest, key) => dest[key].copy(src[key]);

const cloneClonable = src => src.clone();

function createType(typeDefinition) {
  var mandatoryProperties = ["name", "default", "copy", "clone"];

  var undefinedProperties = mandatoryProperties.filter(p => {
    return !typeDefinition.hasOwnProperty(p);
  });

  if (undefinedProperties.length > 0) {
    throw new Error(
      `createType expects a type definition with the following properties: ${undefinedProperties.join(
        ", "
      )}`
    );
  }

  typeDefinition.isType = true;

  return typeDefinition;
}

/**
 * Standard types
 */
const Types = {
  Number: createType({
    name: "Number",
    default: 0,
    copy: copyValue,
    clone: cloneValue
  }),

  Boolean: createType({
    name: "Boolean",
    default: false,
    copy: copyValue,
    clone: cloneValue
  }),

  String: createType({
    name: "String",
    default: "",
    copy: copyValue,
    clone: cloneValue
  }),

  Array: createType({
    name: "Array",
    default: [],
    copy: copyArray,
    clone: cloneArray
  }),

  Object: createType({
    name: "Object",
    default: undefined,
    copy: copyValue,
    clone: cloneValue
  }),

  JSON: createType({
    name: "JSON",
    default: null,
    copy: copyJSON,
    clone: cloneJSON
  })
};

function generateId(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function injectScript(src, onLoad) {
  var script = document.createElement("script");
  // @todo Use link to the ecsy-devtools repo?
  script.src = src;
  script.onload = onLoad;
  (document.head || document.documentElement).appendChild(script);
}

/* global Peer */

function hookConsoleAndErrors(connection) {
  var wrapFunctions = ["error", "warning", "log"];
  wrapFunctions.forEach(key => {
    if (typeof console[key] === "function") {
      var fn = console[key].bind(console);
      console[key] = (...args) => {
        connection.send({
          method: "console",
          type: key,
          args: JSON.stringify(args)
        });
        return fn.apply(null, args);
      };
    }
  });

  window.addEventListener("error", error => {
    connection.send({
      method: "error",
      error: JSON.stringify({
        message: error.error.message,
        stack: error.error.stack
      })
    });
  });
}

function includeRemoteIdHTML(remoteId) {
  let infoDiv = document.createElement("div");
  infoDiv.style.cssText = `
    align-items: center;
    background-color: #333;
    color: #aaa;
    display:flex;
    font-family: Arial;
    font-size: 1.1em;
    height: 40px;
    justify-content: center;
    left: 0;
    opacity: 0.9;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  `;

  infoDiv.innerHTML = `Open ECSY devtools to connect to this page using the code:&nbsp;<b style="color: #fff">${remoteId}</b>&nbsp;<button onClick="generateNewCode()">Generate new code</button>`;
  document.body.appendChild(infoDiv);

  return infoDiv;
}

function enableRemoteDevtools(remoteId) {
  if (!hasWindow) {
    console.warn("Remote devtools not available outside the browser");
    return;
  }

  window.generateNewCode = () => {
    window.localStorage.clear();
    remoteId = generateId(6);
    window.localStorage.setItem("ecsyRemoteId", remoteId);
    window.location.reload(false);
  };

  remoteId = remoteId || window.localStorage.getItem("ecsyRemoteId");
  if (!remoteId) {
    remoteId = generateId(6);
    window.localStorage.setItem("ecsyRemoteId", remoteId);
  }

  let infoDiv = includeRemoteIdHTML(remoteId);

  window.__ECSY_REMOTE_DEVTOOLS_INJECTED = true;
  window.__ECSY_REMOTE_DEVTOOLS = {};

  let Version = "";

  // This is used to collect the worlds created before the communication is being established
  let worldsBeforeLoading = [];
  let onWorldCreated = e => {
    var world = e.detail.world;
    Version = e.detail.version;
    worldsBeforeLoading.push(world);
  };
  window.addEventListener("ecsy-world-created", onWorldCreated);

  let onLoaded = () => {
    var peer = new Peer(remoteId);
    peer.on("open", (/* id */) => {
      peer.on("connection", connection => {
        window.__ECSY_REMOTE_DEVTOOLS.connection = connection;
        connection.on("open", function() {
          // infoDiv.style.visibility = "hidden";
          infoDiv.innerHTML = "Connected";

          // Receive messages
          connection.on("data", function(data) {
            if (data.type === "init") {
              var script = document.createElement("script");
              script.setAttribute("type", "text/javascript");
              script.onload = () => {
                script.parentNode.removeChild(script);

                // Once the script is injected we don't need to listen
                window.removeEventListener(
                  "ecsy-world-created",
                  onWorldCreated
                );
                worldsBeforeLoading.forEach(world => {
                  var event = new CustomEvent("ecsy-world-created", {
                    detail: { world: world, version: Version }
                  });
                  window.dispatchEvent(event);
                });
              };
              script.innerHTML = data.script;
              (document.head || document.documentElement).appendChild(script);
              script.onload();

              hookConsoleAndErrors(connection);
            } else if (data.type === "executeScript") {
              let value = eval(data.script);
              if (data.returnEval) {
                connection.send({
                  method: "evalReturn",
                  value: value
                });
              }
            }
          });
        });
      });
    });
  };

  // Inject PeerJS script
  injectScript(
    "https://cdn.jsdelivr.net/npm/peerjs@0.3.20/dist/peer.min.js",
    onLoaded
  );
}

if (hasWindow) {
  const urlParams = new URLSearchParams(window.location.search);

  // @todo Provide a way to disable it if needed
  if (urlParams.has("enable-remote-devtools")) {
    enableRemoteDevtools();
  }
}

var ecsy_module = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Component: Component,
	Not: Not,
	ObjectPool: ObjectPool,
	System: System,
	SystemStateComponent: SystemStateComponent,
	TagComponent: TagComponent,
	Types: Types,
	Version: Version,
	World: World,
	_Entity: Entity,
	cloneArray: cloneArray,
	cloneClonable: cloneClonable,
	cloneJSON: cloneJSON,
	cloneValue: cloneValue,
	copyArray: copyArray,
	copyCopyable: copyCopyable,
	copyJSON: copyJSON,
	copyValue: copyValue,
	createType: createType,
	enableRemoteDevtools: enableRemoteDevtools
});

class Active extends TagComponent {}

class Animation {
  constructor() {
    this.animations = [];
    this.duration = -1;
  }

  reset() {
    this.animations.length = 0;
    this.duration = -1;
  }
}

class Camera extends Component {}

Camera.schema = {
  fov: { default: 45, type: Types.Number },
  aspect: { default: 1, type: Types.Number },
  near: { default: 0.1, type: Types.Number },
  far: { default: 1000, type: Types.Number },
  layers: { default: 0, type: Types.Number },
  handleResize: { default: true, type: Types.Boolean }
};

class CameraRig {
  constructor() {
    this.reset();
  }

  reset() {
    this.leftHand = null;
    this.rightHand = null;
    this.camera = null;
  }
}

class Colliding {
  constructor() {
    this.collidingWith = [];
    this.collidingFrame = 0;
  }
  reset() {
    this.collidingWith.length = 0;
    this.collidingFrame = 0;
  }
}

class CollisionStart {
  constructor() {
    this.collidingWith = [];
  }
  reset() {
    this.collidingWith.length = 0;
  }
}

class CollisionStop {
  constructor() {
    this.collidingWith = [];
  }
  reset() {
    this.collidingWith.length = 0;
  }
}

class Draggable {
  constructor() {
    this.reset();
  }

  reset() {
    this.value = false;
  }
}

class Dragging extends TagComponent {}

class Environment {
  reset() {}
  constructor() {
    this.active = false;
    this.preset = "default";
    this.seed = 1;
    this.skyType = "atmosphere";
    this.skyColor = "";
    this.horizonColor = "";
    this.lighting = "distant";
    this.shadow = false;
    this.shadowSize = 10;
    this.lightPosition = { x: 0, y: 1, z: -0.2 };
    this.fog = 0;

    this.flatShading = false;
    this.playArea = 1;

    this.ground = "flat";
    this.groundYScale = 3;
    this.groundTexture = "none";
    this.groundColor = "#553e35";
    this.groundColor2 = "#694439";

    this.dressing = "none";
    this.dressingAmount = 10;
    this.dressingColor = "#795449";
    this.dressingScale = 5;
    this.dressingVariance = { x: 1, y: 1, z: 1 };
    this.dressingUniformScale = true;
    this.dressingOnPlayArea = 0;

    this.grid = "none";
    this.gridColor = "#ccc";
  }
}

class Geometry {
  constructor() {
    this.primitive = "box";
  }

  reset() {
    this.primitive = "box";
  }
}

class GLTFLoader extends Component {}

GLTFLoader.schema = {
  url: { default: "", type: Types.String },
  receiveShadow: { default: false, type: Types.Boolean },
  castShadow: { default: false, type: Types.Boolean },
  envMapOverride: { default: null, type: Types.Object },
  append: { default: true, type: Types.Boolean },
  onLoaded: { default: null, type: Types.Object },
  parent: { default: null, type: Types.Object }
};

class GLTFModel extends Component {}

GLTFModel.schema = {
  value: { default: null, type: Types.Object }
};

class InputState extends Component {}

InputState.schema = {
  vrcontrollers: { default: new Map(), type: Types.Object },
  keyboard: { default: {}, type: Types.Object },
  mouse: { default: {}, type: Types.Object },
  gamepads: { default: {}, type: Types.Object }
};

const SIDES = {
  front: 0,
  back: 1,
  double: 2
};

const SHADERS = {
  standard: 0,
  flat: 1
};

const BLENDING = {
  normal: 0,
  additive: 1,
  subtractive: 2,
  multiply: 3
};

const VERTEX_COLORS = {
  none: 0,
  face: 1,
  vertex: 2
};

class Material {
  constructor() {
    this.color = 0xff0000;
    this.alphaTest = 0;
    this.depthTest = true;
    this.depthWrite = true;
    this.flatShading = false;
    this.npot = false;
    this.offset = new Vector2();
    this.opacity = 1.0;
    this.repeat = new Vector2(1, 1);
    this.shader = SHADERS.standard;
    this.side = SIDES.front;
    this.transparent = false;
    this.vertexColors = VERTEX_COLORS.none;
    this.visible = true;
    this.blending = BLENDING.normal;
  }

  reset() {
    this.color = 0xff0000;
    this.alphaTest = 0;
    this.depthTest = true;
    this.depthWrite = true;
    this.flatShading = false;
    this.npot = false;
    this.offset.set(0, 0);
    this.opacity = 1.0;
    this.repeat.set(1, 1);
    this.shader = SHADERS.standard;
    this.side = SIDES.front;
    this.transparent = false;
    this.vertexColors = VERTEX_COLORS.none;
    this.visible = true;
    this.blending = BLENDING.normal;
  }
}

class Object3DComponent extends Component {}

Object3DComponent.schema = {
  value: { default: null, type: Types.Object }
};

class Parent extends Component {}
Parent.schema = {
  value: { default: null, type: Types.Object }
};

class ParentObject3D {
  constructor() {
    this.value = null;
  }

  reset() {
    this.value = null;
  }
}

class Play extends TagComponent {}

const Vector3Type = createType({
  name: "Vector3",
  default: new Vector3(),
  copy: copyCopyable,
  clone: cloneClonable
});

class Position extends Component {}

Position.schema = {
  value: { default: new Vector3(), type: Vector3Type }
};

class RenderPass extends Component {}

RenderPass.schema = {
  scene: { default: null, type: Types.Object },
  camera: { default: null, type: Types.Object }
};

class RigidBody {
  constructor() {
    this.reset();
  }
  reset() {
    this.object = null;
    this.weight = 0;
    this.restitution = 1;
    this.friction = 1;
    this.linearDamping = 0;
    this.angularDamping = 0;
    this.linearVelocity = { x: 0, y: 0, z: 0 };
  }
}

class Rotation {
  constructor() {
    this.rotation = new Vector3();
  }

  reset() {
    this.rotation.set(0, 0, 0);
  }
}

class Scale {
  constructor() {
    this.value = new Vector3();
  }

  reset() {
    this.value.set(0, 0, 0);
  }
}

class Scene extends Component {}
Scene.schema = {
  value: { default: null, type: Types.Object }
};

class Shape extends Component {}
Shape.schema = {
  primitive: { default: "", type: Types.String },
  width: { default: 0, type: Types.Number },
  height: { default: 0, type: Types.Number },
  depth: { default: 0, type: Types.Number }
};

class Sky {
  constructor() {}
  reset() {}
}

class SkyBox {
  constructor() {
    this.texture = "";
    this.type = "";
  }
  reset() {
    this.texture = "";
    this.type = "";
  }
}

class Sound extends Component {}

Sound.schema = {
  sound: { default: null, type: Types.Object },
  url: { default: "", type: Types.String }
};

class Stop extends TagComponent {}

class Text extends Component {}
Text.schema = {
  text: { default: "", type: Types.String },
  textAlign: { default: "left", type: Types.String }, // ['left', 'right', 'center']
  anchor: { default: "center", type: Types.String }, // ['left', 'right', 'center', 'align']
  baseline: { default: "center", type: Types.String }, // ['top', 'center', 'bottom']
  color: { default: "#FFF", type: Types.String },
  font: { default: "", type: Types.String }, //"https://code.cdn.mozilla.net/fonts/ttf/ZillaSlab-SemiBold.ttf"
  fontSize: { default: 0.2, type: Types.Number },
  letterSpacing: { default: 0, type: Types.Number },
  lineHeight: { default: 0, type: Types.Number },
  maxWidth: { default: Infinity, type: Types.Number },
  overflowWrap: { default: "normal", type: Types.String }, // ['normal', 'break-word']
  whiteSpace: { default: "normal", type: Types.String }, // ['normal', 'nowrap']
  opacity: { default: 1, type: Types.Number }
};

class TextGeometry {
  reset() {}
}

class Transform extends Component {}

Transform.schema = {
  position: { default: new Vector3(), type: Vector3Type },
  rotation: { default: new Vector3(), type: Vector3Type }
};

class Visible extends Component {}
Visible.schema = {
  value: { default: true, type: Types.Boolean }
};

class VRController {
  constructor() {
    this.id = 0;
    this.controller = null;
  }
  reset() {}
}

class VRControllerBasicBehaviour {
  constructor() {
    this.reset();
  }

  reset() {
    this.select = null;
    this.selectstart = null;
    this.selectend = null;

    this.connected = null;

    this.squeeze = null;
    this.squeezestart = null;
    this.squeezeend = null;
  }
}

class WebGLRenderer extends Component {}

WebGLRenderer.schema = {
  vr: { default: false, type: Types.Boolean },
  ar: { default: false, type: Types.Boolean },
  antialias: { default: true, type: Types.Boolean },
  handleResize: { default: true, type: Types.Boolean },
  shadowMap: { default: true, type: Types.Boolean },
  animationLoop: { default: null, type: Types.Object }
};

class ControllerConnected extends TagComponent {}

class SceneTagComponent extends TagComponent {}
class CameraTagComponent extends TagComponent {}
class MeshTagComponent extends TagComponent {}

class UpdateAspectOnResizeTag extends TagComponent {}

class MaterialInstance extends SystemStateComponent {
  constructor() {
    super();
    this.value = new MeshStandardMaterial();
  }

  reset() {}
}

class MaterialSystem extends System {
  execute() {
    this.queries.new.results.forEach(entity => {
      const component = entity.getComponent(Material);
    });
  }
}

MaterialSystem.queries = {
  new: {
    components: [Material, Not(MaterialInstance)]
  }
};

/**
 * Create a Mesh based on the [Geometry] component and attach it to the entity using a [Object3D] component
 */
class GeometrySystem extends System {
  execute() {
    // Removed
    this.queries.entities.removed.forEach(entity => {
      var object = entity.getRemovedComponent(Object3DComponent).value;
      var parent = entity.getComponent(Parent, true).value;
      parent.getObject3D().remove(object);
    });

    // Added
    this.queries.entities.added.forEach(entity => {
      var component = entity.getComponent(Geometry);

      var geometry;
      switch (component.primitive) {
        case "torus":
          {
            geometry = new TorusBufferGeometry(
              component.radius,
              component.tube,
              component.radialSegments,
              component.tubularSegments
            );
          }
          break;
        case "sphere":
          {
            geometry = new IcosahedronBufferGeometry(component.radius, 1);
          }
          break;
        case "box":
          {
            geometry = new BoxBufferGeometry(
              component.width,
              component.height,
              component.depth
            );
          }
          break;
      }

      var color =
        component.primitive === "torus" ? 0x999900 : Math.random() * 0xffffff;

        /*
        if (entity.hasComponent(Material)) {

        } else {

        }
*/

      var material = new MeshLambertMaterial({
        color: color,
        flatShading: true
      });

      var object = new Mesh(geometry, material);
      object.castShadow = true;
      object.receiveShadow = true;

      if (entity.hasComponent(Transform)) {
        var transform = entity.getComponent(Transform);
        object.position.copy(transform.position);
        if (transform.rotation) {
          object.rotation.set(
            transform.rotation.x,
            transform.rotation.y,
            transform.rotation.z
          );
        }
      }

      //      if (entity.hasComponent(Element) && !entity.hasComponent(Draggable)) {
      //        object.material.color.set(0x333333);
      //      }

      entity.addComponent(Object3DComponent, { value: object });
    });
  }
}

GeometrySystem.queries = {
  entities: {
    components: [Geometry], // @todo Transform: As optional, how to define it?
    listen: {
      added: true,
      removed: true
    }
  }
};

// @todo Use parameter and loader manager
var loader = new GLTFLoader$1(); //.setPath("/assets/models/");

class GLTFLoaderState extends SystemStateComponent {}

class GLTFLoaderSystem extends System {
  init() {
    this.world.registerComponent(GLTFLoaderState).registerComponent(GLTFModel);
    this.loaded = [];
  }

  execute() {
    const toLoad = this.queries.toLoad.results;
    while (toLoad.length) {
      const entity = toLoad[0];
      entity.addComponent(GLTFLoaderState);
      loader.load(entity.getComponent(GLTFLoader).url, gltf =>
        this.loaded.push([entity, gltf])
      );
    }

    // Do the actual entity creation inside the system tick not in the loader callback
    for (let i = 0; i < this.loaded.length; i++) {
      const [entity, gltf] = this.loaded[i];
      const component = entity.getComponent(GLTFLoader);
      gltf.scene.traverse(function(child) {
        if (child.isMesh) {
          child.receiveShadow = component.receiveShadow;
          child.castShadow = component.castShadow;

          if (component.envMapOverride) {
            child.material.envMap = component.envMapOverride;
          }
        }
      });
      /*
      this.world
        .createEntity()
        .addComponent(GLTFModel, { value: gltf })
        .addObject3DComponent(gltf.scene, component.append && entity);
*/

      entity
        .addComponent(GLTFModel, { value: gltf })
        .addObject3DComponent(gltf.scene, component.parent);

      if (component.onLoaded) {
        component.onLoaded(gltf.scene, gltf);
      }
    }
    this.loaded.length = 0;

    const toUnload = this.queries.toUnload.results;
    while (toUnload.length) {
      const entity = toUnload[0];
      entity.removeComponent(GLTFLoaderState);
      entity.removeObject3DComponent();
    }
  }
}

GLTFLoaderSystem.queries = {
  toLoad: {
    components: [GLTFLoader, Not(GLTFLoaderState)]
  },
  toUnload: {
    components: [GLTFLoaderState, Not(GLTFLoader)]
  }
};

class SkyBoxSystem extends System {
  execute() {
    let entities = this.queries.entities.results;
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];

      let skybox = entity.getComponent(SkyBox);

      let group = new Group();
      let geometry = new BoxBufferGeometry(100, 100, 100);
      geometry.scale(1, 1, -1);

      if (skybox.type === "cubemap-stereo") {
        let textures = getTexturesFromAtlasFile(skybox.textureUrl, 12);

        let materials = [];

        for (let j = 0; j < 6; j++) {
          materials.push(new MeshBasicMaterial({ map: textures[j] }));
        }

        let skyBox = new Mesh(geometry, materials);
        skyBox.layers.set(1);
        group.add(skyBox);

        let materialsR = [];

        for (let j = 6; j < 12; j++) {
          materialsR.push(new MeshBasicMaterial({ map: textures[j] }));
        }

        let skyBoxR = new Mesh(geometry, materialsR);
        skyBoxR.layers.set(2);
        group.add(skyBoxR);

        entity.addObject3DComponent(group, false);
      } else {
        console.warn("Unknown skybox type: ", skybox.type);
      }
    }
  }
}

function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
  let textures = [];

  for (let i = 0; i < tilesNum; i++) {
    textures[i] = new Texture();
  }

  let loader = new ImageLoader();
  loader.load(atlasImgUrl, function(imageObj) {
    let canvas, context;
    let tileWidth = imageObj.height;

    for (let i = 0; i < textures.length; i++) {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.height = tileWidth;
      canvas.width = tileWidth;
      context.drawImage(
        imageObj,
        tileWidth * i,
        0,
        tileWidth,
        tileWidth,
        0,
        0,
        tileWidth,
        tileWidth
      );
      textures[i].image = canvas;
      textures[i].needsUpdate = true;
    }
  });

  return textures;
}

SkyBoxSystem.queries = {
  entities: {
    components: [SkyBox, Not(Object3DComponent)]
  }
};

class VisibilitySystem extends System {
  processVisibility(entities) {
    entities.forEach(entity => {
      entity.getObject3D().visible = entity.getComponent(Visible).value;
    });
  }

  execute() {
    this.processVisibility(this.queries.entities.added);
    this.processVisibility(this.queries.entities.changed);
  }
}

VisibilitySystem.queries = {
  entities: {
    components: [Visible, Object3DComponent],
    listen: {
      added: true,
      changed: [Visible]
    }
  }
};

const anchorMapping = {
  left: 0,
  center: 0.5,
  right: 1
};
const baselineMapping = {
  top: 0,
  center: 0.5,
  bottom: 1
};

class SDFTextSystem extends System {
  updateText(textMesh, textComponent) {
    textMesh.text = textComponent.text;
    textMesh.textAlign = textComponent.textAlign;
    textMesh.anchor[0] = anchorMapping[textComponent.anchor];
    textMesh.anchor[1] = baselineMapping[textComponent.baseline];
    textMesh.color = textComponent.color;
    textMesh.font = textComponent.font;
    textMesh.fontSize = textComponent.fontSize;
    textMesh.letterSpacing = textComponent.letterSpacing || 0;
    textMesh.lineHeight = textComponent.lineHeight || null;
    textMesh.overflowWrap = textComponent.overflowWrap;
    textMesh.whiteSpace = textComponent.whiteSpace;
    textMesh.maxWidth = textComponent.maxWidth;
    textMesh.material.opacity = textComponent.opacity;
    textMesh.sync();
  }

  execute() {
    var entities = this.queries.entities;

    entities.added.forEach(e => {
      var textComponent = e.getComponent(Text);

      const textMesh = new TextMesh();
      textMesh.name = "textMesh";
      textMesh.anchor = [0, 0];
      textMesh.renderOrder = 10; //brute-force fix for ugly antialiasing, see issue #67
      this.updateText(textMesh, textComponent);
      e.addComponent(Object3DComponent, { value: textMesh });
    });

    entities.removed.forEach(e => {
      var object3D = e.getObject3D();
      var textMesh = object3D.getObjectByName("textMesh");
      textMesh.dispose();
      object3D.remove(textMesh);
    });

    entities.changed.forEach(e => {
      var object3D = e.getObject3D();
      if (object3D instanceof TextMesh) {
        var textComponent = e.getComponent(Text);
        this.updateText(object3D, textComponent);
      }
    });
  }
}

SDFTextSystem.queries = {
  entities: {
    components: [Text],
    listen: {
      added: true,
      removed: true,
      changed: [Text]
    }
  }
};

class WebGLRendererContext extends Component {}
WebGLRendererContext.schema = {
  value: { default: null, type: Types.Object }
};

class WebGLRendererSystem extends System {
  init() {
    this.world.registerComponent(WebGLRendererContext);

    window.addEventListener(
      "resize",
      () => {
        this.queries.renderers.results.forEach(entity => {
          var component = entity.getMutableComponent(WebGLRenderer);
          component.width = window.innerWidth;
          component.height = window.innerHeight;
        });
      },
      false
    );
  }

  execute() {
    let renderers = this.queries.renderers.results;
    renderers.forEach(rendererEntity => {
      var renderer = rendererEntity.getComponent(WebGLRendererContext).value;
      this.queries.renderPasses.results.forEach(entity => {
        var pass = entity.getComponent(RenderPass);
        var scene = pass.scene.getObject3D();

        this.queries.activeCameras.results.forEach(cameraEntity => {
          var camera = cameraEntity.getObject3D();

          renderer.render(scene, camera);
        });
      });
    });

    // Uninitialized renderers
    this.queries.uninitializedRenderers.results.forEach(entity => {
      var component = entity.getComponent(WebGLRenderer);

      var renderer = new WebGLRenderer$1({
        antialias: component.antialias
      });

      if (component.animationLoop) {
        renderer.setAnimationLoop(component.animationLoop);
      }

      renderer.setPixelRatio(window.devicePixelRatio);
      if (component.handleResize) {
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      renderer.shadowMap.enabled = component.shadowMap;

      document.body.appendChild(renderer.domElement);

      if (component.vr || component.ar) {
        renderer.xr.enabled = true;

        if (component.vr) {
          document.body.appendChild(VRButton.createButton(renderer));
        }

        if (component.ar) {
          document.body.appendChild(ARButton.createButton(renderer));
        }
      }

      entity.addComponent(WebGLRendererContext, { value: renderer });
    });

    this.queries.renderers.changed.forEach(entity => {
      var component = entity.getComponent(WebGLRenderer);
      var renderer = entity.getComponent(WebGLRendererContext).value;
      if (
        component.width !== renderer.width ||
        component.height !== renderer.height
      ) {
        renderer.setSize(component.width, component.height);
        // innerWidth/innerHeight
      }
    });
  }
}

WebGLRendererSystem.queries = {
  uninitializedRenderers: {
    components: [WebGLRenderer, Not(WebGLRendererContext)]
  },
  renderers: {
    components: [WebGLRenderer, WebGLRendererContext],
    listen: {
      changed: [WebGLRenderer]
    }
  },
  renderPasses: {
    components: [RenderPass]
  },
  activeCameras: {
    components: [CameraTagComponent, Active],
    listen: {
      added: true
    }
  }
};

class TransformSystem extends System {
  execute() {
    // Hierarchy
    let added = this.queries.parent.added;
    for (var i = 0; i < added.length; i++) {
      var entity = added[i];
      if (!entity.alive) {
        return;
      }

      var parentEntity = entity.getComponent(Parent).value;
      if (parentEntity.hasComponent(Object3DComponent)) {
        var parentObject3D = parentEntity.getObject3D();
        var childObject3D = entity.getObject3D();
        parentObject3D.add(childObject3D);
      }
    }

    // Hierarchy
    this.queries.parentObject3D.added.forEach(entity => {
      var parentObject3D = entity.getComponent(ParentObject3D).value;
      var childObject3D = entity.getObject3D();
      parentObject3D.add(childObject3D);
    });

    // Transforms
    var transforms = this.queries.transforms;
    for (let i = 0; i < transforms.added.length; i++) {
      let entity = transforms.added[i];
      let transform = entity.getComponent(Transform);
      let object = entity.getObject3D();

      object.position.copy(transform.position);
      object.rotation.set(
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z
      );
    }

    for (let i = 0; i < transforms.changed.length; i++) {
      let entity = transforms.changed[i];
      if (!entity.alive) {
        continue;
      }

      let transform = entity.getComponent(Transform);
      let object = entity.getObject3D();

      object.position.copy(transform.position);
      object.rotation.set(
        transform.rotation.x,
        transform.rotation.y,
        transform.rotation.z
      );
    }

    // Position
    let positions = this.queries.positions;
    for (let i = 0; i < positions.added.length; i++) {
      let entity = positions.added[i];
      let position = entity.getComponent(Position).value;

      let object = entity.getObject3D();

      object.position.copy(position);

      // Link them
      entity.getComponent(Position).value = object.position;
    }
/*
    for (let i = 0; i < positions.changed.length; i++) {
      let entity = positions.changed[i];
      let position = entity.getComponent(Position).value;
      let object = entity.getObject3D();

      object.position.copy(position);
    }
*/
    // Scale
    let scales = this.queries.scales;
    for (let i = 0; i < scales.added.length; i++) {
      let entity = scales.added[i];
      let scale = entity.getComponent(Scale).value;

      let object = entity.getObject3D();

      object.scale.copy(scale);
    }

    for (let i = 0; i < scales.changed.length; i++) {
      let entity = scales.changed[i];
      let scale = entity.getComponent(Scale).value;
      let object = entity.getObject3D();

      object.scale.copy(scale);
    }
  }
}

TransformSystem.queries = {
  parentObject3D: {
    components: [ParentObject3D, Object3DComponent],
    listen: {
      added: true
    }
  },
  parent: {
    components: [Parent, Object3DComponent],
    listen: {
      added: true
    }
  },
  transforms: {
    components: [Object3DComponent, Transform],
    listen: {
      added: true,
      changed: [Transform]
    }
  },
  positions: {
    components: [Object3DComponent, Position],
    listen: {
      added: true,
      changed: [Position]
    }
  },
  scales: {
    components: [Object3DComponent, Scale],
    listen: {
      added: true,
      changed: [Scale]
    }
  }
};

class UpdateAspectOnResizeSystem extends System {
  init() {
    this.aspect = window.innerWidth / window.innerHeight;
    window.addEventListener(
      "resize",
      () => {
        this.aspect = window.innerWidth / window.innerHeight;
        console.log("resize", this.aspect);
      },
      false
    );
  }

  execute() {
    let cameras = this.queries.cameras.results;
    for (let i = 0; i < cameras.length; i++) {
      let cameraObj = cameras[i].getObject3D();
      if (cameraObj.aspect !== this.aspect) {
        cameraObj.aspect = this.aspect;
        cameraObj.updateProjectionMatrix();
      }
    }
  }
}

UpdateAspectOnResizeSystem.queries = {
  cameras: {
    components: [CameraTagComponent, UpdateAspectOnResizeTag, Object3DComponent]
  }
};

class TextGeometrySystem extends System {
  init() {
    this.initialized = false;
    var loader = new FontLoader();
    this.font = null;
    /*
    loader.load("/assets/fonts/helvetiker_regular.typeface.json", font => {
      this.font = font;
      this.initialized = true;
    });
    */
  }

  execute() {
    if (!this.font) return;

    var changed = this.queries.entities.changed;
    changed.forEach(entity => {
      var textComponent = entity.getComponent(TextGeometry);
      var geometry = new TextGeometry$1(textComponent.text, {
        font: this.font,
        size: 1,
        height: 0.1,
        curveSegments: 3,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 3
      });
      entity.getObject3D().geometry = geometry;
    });

    var added = this.queries.entities.added;
    added.forEach(entity => {
      var textComponent = entity.getComponent(TextGeometry);
      var geometry = new TextGeometry$1(textComponent.text, {
        font: this.font,
        size: 1,
        height: 0.1,
        curveSegments: 3,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.03,
        bevelOffset: 0,
        bevelSegments: 3
      });

      var color = Math.random() * 0xffffff;
      color = 0xffffff;
      var material = new MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.0
      });

      var mesh = new Mesh(geometry, material);

      entity.addComponent(Object3DComponent, { value: mesh });
    });
  }
}

TextGeometrySystem.queries = {
  entities: {
    components: [TextGeometry],
    listen: {
      added: true,
      changed: true
    }
  }
};

class EnvironmentSystem extends System {
  execute() {
    this.queries.environments.added.forEach(entity => {
      // stage ground diameter (and sky radius)
      var STAGE_SIZE = 200;

      // create ground
      // update ground, playarea and grid textures.
      var groundResolution = 2048;
      var texMeters = 20; // ground texture of 20 x 20 meters
      var texRepeat = STAGE_SIZE / texMeters;

      var resolution = 64; // number of divisions of the ground mesh

      var groundCanvas = document.createElement("canvas");
      groundCanvas.width = groundResolution;
      groundCanvas.height = groundResolution;
      var groundTexture = new Texture(groundCanvas);
      groundTexture.wrapS = RepeatWrapping;
      groundTexture.wrapT = RepeatWrapping;
      groundTexture.repeat.set(texRepeat, texRepeat);

      this.environmentData = {
        groundColor: "#454545",
        groundColor2: "#5d5d5d"
      };

      var groundctx = groundCanvas.getContext("2d");

      var size = groundResolution;
      groundctx.fillStyle = this.environmentData.groundColor;
      groundctx.fillRect(0, 0, size, size);
      groundctx.fillStyle = this.environmentData.groundColor2;
      var num = Math.floor(texMeters / 2);
      var step = size / (texMeters / 2); // 2 meters == <step> pixels
      for (var i = 0; i < num + 1; i += 2) {
        for (var j = 0; j < num + 1; j++) {
          groundctx.fillRect(
            Math.floor((i + (j % 2)) * step),
            Math.floor(j * step),
            Math.floor(step),
            Math.floor(step)
          );
        }
      }

      groundTexture.needsUpdate = true;

      var groundMaterial = new MeshLambertMaterial({
        map: groundTexture
      });

      let scene = entity.getObject3D();
      //scene.add(mesh);
      var geometry = new PlaneBufferGeometry(
        STAGE_SIZE + 2,
        STAGE_SIZE + 2,
        resolution - 1,
        resolution - 1
      );

      let object = new Mesh(geometry, groundMaterial);
      object.rotation.x = -Math.PI / 2;
      object.receiveShadow = true;

      entity.addComponent(Object3DComponent, { value: object });
      entity.addComponent(Parent, { value: window.entityScene });

      const color = 0x333333;
      const near = 20;
      const far = 100;
      scene.fog = new Fog(color, near, far);
      scene.background = new Color(color);
    });
  }
}

EnvironmentSystem.queries = {
  environments: {
    components: [Scene, Environment],
    listen: {
      added: true
    }
  }
};

var controllerModelFactory = new XRControllerModelFactory();

class VRControllerSystem extends System {
  execute() {
    let renderer = this.queries.rendererContext.results[0].getComponent(
      WebGLRendererContext
    ).value;

    this.queries.controllers.added.forEach(entity => {
      let controllerId = entity.getComponent(VRController).id;
      var controller = renderer.xr.getController(controllerId);
      controller.name = "controller";

      var group = new Group();
      group.add(controller);
      entity.addComponent(Object3DComponent, { value: group });

      controller.addEventListener("connected", () => {
        entity.addComponent(ControllerConnected);
      });

      controller.addEventListener("disconnected", () => {
        entity.removeComponent(ControllerConnected);
      });

      if (entity.hasComponent(VRControllerBasicBehaviour)) {
        var behaviour = entity.getComponent(VRControllerBasicBehaviour);
        Object.keys(behaviour).forEach(eventName => {
          if (behaviour[eventName]) {
            controller.addEventListener(eventName, behaviour[eventName]);
          }
        });
      }

      // The XRControllerModelFactory will automatically fetch controller models
      // that match what the user is holding as closely as possible. The models
      // should be attached to the object returned from getControllerGrip in
      // order to match the orientation of the held device.
      let controllerGrip = renderer.xr.getControllerGrip(controllerId);
      controllerGrip.add(
        controllerModelFactory.createControllerModel(controllerGrip)
      );
      group.add(controllerGrip);
      /*
      let geometry = new THREE.BufferGeometry();
      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, -1], 3)
      );

      var line = new THREE.Line(geometry);
      line.name = "line";
      line.scale.z = 5;
      group.add(line);

      let geometry2 = new THREE.BoxBufferGeometry(0.1, 0.1, 0.1);
      let material2 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      let cube = new THREE.Mesh(geometry2, material2);
      group.name = "VRController";
      group.add(cube);
*/
    });

    // this.cleanIntersected();
  }
}

VRControllerSystem.queries = {
  controllers: {
    components: [VRController],
    listen: {
      added: true
      //changed: [Visible]
    }
  },
  rendererContext: {
    components: [WebGLRendererContext],
    mandatory: true
  }
};

class AnimationMixerComponent {
  constructor() {}
  reset() {}
}

class AnimationActionsComponent {
  constructor() {
    this.animations = [];
  }
  reset() {}
}

class AnimationSystem extends System {
  execute(delta) {
    this.queries.entities.added.forEach(entity => {
      let gltf = entity.getComponent(GLTFModel).value;
      let mixer = new AnimationMixer(gltf.scene);
      entity.addComponent(AnimationMixerComponent, {
        value: mixer
      });

      let animations = [];
      gltf.animations.forEach(animationClip => {
        const action = mixer.clipAction(animationClip, gltf.scene);
        action.loop = LoopOnce;
        animations.push(action);
      });

      entity.addComponent(AnimationActionsComponent, {
        animations: animations,
        duration: entity.getComponent(Animation).duration
      });
    });

    this.queries.mixers.results.forEach(entity => {
      entity.getComponent(AnimationMixerComponent).value.update(delta);
    });

    this.queries.playClips.results.forEach(entity => {
      let component = entity.getComponent(AnimationActionsComponent);
      component.animations.forEach(actionClip => {
        if (component.duration !== -1) {
          actionClip.setDuration(component.duration);
        }

        actionClip.clampWhenFinished = true;
        actionClip.reset();
        actionClip.play();
      });
      entity.removeComponent(Play);
    });

    this.queries.stopClips.results.forEach(entity => {
      let animations = entity.getComponent(AnimationActionsComponent)
        .animations;
      animations.forEach(actionClip => {
        actionClip.reset();
        actionClip.stop();
      });
      entity.removeComponent(Stop);
    });
  }
}

AnimationSystem.queries = {
  entities: {
    components: [Animation, GLTFModel],
    listen: {
      added: true
    }
  },
  mixers: {
    components: [AnimationMixerComponent]
  },
  playClips: {
    components: [AnimationActionsComponent, Play]
  },
  stopClips: {
    components: [AnimationActionsComponent, Stop]
  }
};

class InputSystem extends System {
  init() {
    //!!!!!!!!!!!!!
    this.world.registerComponent(InputState);

    let entity = this.world.createEntity().addComponent(InputState);
    this.inputStateComponent = entity.getMutableComponent(InputState);
  }

  execute() {
    this.processVRControllers();
    // this.processKeyboard();
    // this.processMouse();
    // this.processGamepads();
  }

  processVRControllers() {
    // Process recently added controllers
    this.queries.vrcontrollers.added.forEach(entity => {
      entity.addComponent(VRControllerBasicBehaviour, {
        selectstart: event => {
          let state = this.inputStateComponent.vrcontrollers.get(event.target);
          state.selected = true;
          state.prevSelected = false;
        },
        selectend: event => {
          let state = this.inputStateComponent.vrcontrollers.get(event.target);
          state.selected = false;
          state.prevSelected = true;
        },
        connected: event => {
          this.inputStateComponent.vrcontrollers.set(event.target, {});
        },
        disconnected: event => {
          this.inputStateComponent.vrcontrollers.delete(event.target);
        }
      });
    });

    // Update state
    this.inputStateComponent.vrcontrollers.forEach(state => {
      state.selectStart = state.selected && !state.prevSelected;
      state.selectEnd = !state.selected && state.prevSelected;
      state.prevSelected = state.selected;
    });
  }
}

InputSystem.queries = {
  vrcontrollers: {
    components: [VRController],
    listen: {
      added: true
    }
  }
};

class PositionalAudioPolyphonic extends Object3D {
  constructor(listener, poolSize) {
    super();
    this.listener = listener;
    this.context = listener.context;

    this.poolSize = poolSize || 5;
    for (var i = 0; i < this.poolSize; i++) {
      this.children.push(new PositionalAudio(listener));
    }
  }

  setBuffer(buffer) {
    this.children.forEach(sound => {
      sound.setBuffer(buffer);
    });
  }

  play() {
    var found = false;
    for (let i = 0; i < this.children.length; i++) {
      let sound = this.children[i];
      if (!sound.isPlaying && sound.buffer && !found) {
        sound.play();
        sound.isPaused = false;
        found = true;
        continue;
      }
    }

    if (!found) {
      console.warn(
        "All the sounds are playing. If you need to play more sounds simultaneously consider increasing the pool size"
      );
      return;
    }
  }
}

class SoundSystem extends System {
  init() {
    this.listener = new AudioListener();
  }
  execute() {
    this.queries.sounds.added.forEach(entity => {
      const component = entity.getMutableComponent(Sound);
      const sound = new PositionalAudioPolyphonic(this.listener, 10);
      const audioLoader = new AudioLoader();
      audioLoader.load(component.url, buffer => {
        sound.setBuffer(buffer);
      });
      component.sound = sound;
    });
  }
}

SoundSystem.queries = {
  sounds: {
    components: [Sound],
    listen: {
      added: true,
      removed: true,
      changed: true // [Sound]
    }
  }
};

class ECSYThreeEntity extends Entity {
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
        this._entityManager.removeEntity(o.entity, forceImmediate);
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    } else {
      this._entityManager.removeEntity(this, forceImmediate);
    }
  }

  getObject3D() {
    return this.getComponent(Object3DComponent).value;
  }
}

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

function initialize(world = new ECSYThreeWorld(), options) {
  if (!(world instanceof ECSYThreeWorld)) {
    throw new Error(
      "The provided 'world' paremeter is not an instance of 'ECSYThreeWorld'"
    );
  }

  world
    .registerSystem(UpdateAspectOnResizeSystem)
    .registerSystem(WebGLRendererSystem, { priority: 1 });

  world
    .registerComponent(WebGLRenderer)
    .registerComponent(Scene)
    .registerComponent(Active)
    .registerComponent(Object3DComponent)
    .registerComponent(RenderPass)
//    .registerComponent(Transform)
    .registerComponent(Camera)
    // Tags
    .registerComponent(SceneTagComponent)
    .registerComponent(CameraTagComponent)
    .registerComponent(MeshTagComponent)

    .registerComponent(UpdateAspectOnResizeTag);


  const DEFAULT_OPTIONS = {
    vr: false,
    defaults: true
  };

  options = Object.assign({}, DEFAULT_OPTIONS, options);

  if (!options.defaults) {
    return { world };
  }

  let animationLoop = options.animationLoop;
  if (!animationLoop) {
    const clock = new Clock();
    animationLoop = () => {
      world.execute(clock.getDelta(), clock.elapsedTime);
    };
  }

  let scene = world
    .createEntity()
    .addComponent(Scene)
    .addObject3DComponent(new Scene$1());

  let renderer = world.createEntity().addComponent(WebGLRenderer, {
    ar: options.ar,
    vr: options.vr,
    animationLoop: animationLoop
  });

  // camera rig & controllers
  var camera = null,
    cameraRig = null;

  // if (options.ar || options.vr) {
  //   cameraRig = world
  //     .createEntity()
  //     .addComponent(CameraRig)
  //     .addComponent(Parent, { value: scene });
  // }

  {
    camera = world
      .createEntity()
      .addComponent(Camera)
      .addComponent(UpdateAspectOnResizeTag)
      .addObject3DComponent(
        new PerspectiveCamera(
          90,
          window.innerWidth / window.innerHeight,
          0.1,
          100
        ),
        scene
      )
      .addComponent(Active);
  }

  let renderPass = world.createEntity().addComponent(RenderPass, {
    scene: scene,
    camera: camera
  });

  return {
    world,
    entities: {
      scene,
      camera,
      cameraRig,
      renderer,
      renderPass
    }
  };
}

// components

var index = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Active: Active,
	Animation: Animation,
	Camera: Camera,
	CameraRig: CameraRig,
	Colliding: Colliding,
	CollisionStart: CollisionStart,
	CollisionStop: CollisionStop,
	Draggable: Draggable,
	Dragging: Dragging,
	Environment: Environment,
	Geometry: Geometry,
	GLTFLoader: GLTFLoader,
	GLTFModel: GLTFModel,
	InputState: InputState,
	Material: Material,
	Object3DComponent: Object3DComponent,
	Parent: Parent,
	ParentObject3D: ParentObject3D,
	Play: Play,
	Position: Position,
	RenderPass: RenderPass,
	RigidBody: RigidBody,
	Rotation: Rotation,
	Scale: Scale,
	Scene: Scene,
	Shape: Shape,
	Sky: Sky,
	SkyBox: SkyBox,
	Sound: Sound,
	Stop: Stop,
	Text: Text,
	TextGeometry: TextGeometry,
	ControllerConnected: ControllerConnected,
	Transform: Transform,
	Visible: Visible,
	VRController: VRController,
	VRControllerBasicBehaviour: VRControllerBasicBehaviour,
	MaterialSystem: MaterialSystem,
	GeometrySystem: GeometrySystem,
	GLTFLoaderSystem: GLTFLoaderSystem,
	SkyBoxSystem: SkyBoxSystem,
	VisibilitySystem: VisibilitySystem,
	SDFTextSystem: SDFTextSystem,
	WebGLRendererSystem: WebGLRendererSystem,
	WebGLRendererContext: WebGLRendererContext,
	TransformSystem: TransformSystem,
	UpdateAspectOnResizeSystem: UpdateAspectOnResizeSystem,
	TextGeometrySystem: TextGeometrySystem,
	EnvironmentSystem: EnvironmentSystem,
	VRControllerSystem: VRControllerSystem,
	AnimationSystem: AnimationSystem,
	InputSystem: InputSystem,
	SoundSystem: SoundSystem,
	initialize: initialize,
	ECSYThreeWorld: ECSYThreeWorld,
	Vector3Type: Vector3Type,
	Types: Types
});

export { ecsy_module as ECSY, index as ECSYTHREE };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuYWxsLmpzIiwic291cmNlcyI6WyIuLi8uLi9jb3JlL2J1aWxkL2Vjc3kubW9kdWxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQWN0aXZlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQW5pbWF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29sbGlkaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RhcnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Db2xsaXNpb25TdG9wLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9FbnZpcm9ubWVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvR0xURkxvYWRlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0lucHV0U3RhdGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYXRlcmlhbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNEQ29tcG9uZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50T2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QbGF5LmpzIiwiLi4vc3JjL1R5cGVzLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUG9zaXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9SZW5kZXJQYXNzLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmlnaWRCb2R5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUm90YXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9TY2FsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2hhcGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3kuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvY29tcG9uZW50cy9Tb3VuZC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1N0b3AuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UZXh0LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Db250cm9sbGVyQ29ubmVjdGVkLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0RUYWdzLmpzIiwiLi4vc3JjL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU0RGVGV4dFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9VcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0Vudmlyb25tZW50U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVlJDb250cm9sbGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvQW5pbWF0aW9uU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvSW5wdXRTeXN0ZW0uanMiLCIuLi9zcmMvbGliL1Bvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMuanMiLCIuLi9zcmMvc3lzdGVtcy9Tb3VuZFN5c3RlbS5qcyIsIi4uL3NyYy9lbnRpdHkuanMiLCIuLi9zcmMvZGVmYXVsdE9iamVjdDNESW5mbGF0b3IuanMiLCIuLi9zcmMvd29ybGQuanMiLCIuLi9zcmMvaW5pdGlhbGl6ZS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFJldHVybiB0aGUgbmFtZSBvZiBhIGNvbXBvbmVudFxuICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gZ2V0TmFtZShDb21wb25lbnQpIHtcbiAgcmV0dXJuIENvbXBvbmVudC5uYW1lO1xufVxuXG4vKipcbiAqIFJldHVybiBhIHZhbGlkIHByb3BlcnR5IG5hbWUgZm9yIHRoZSBDb21wb25lbnRcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnRcbiAqIEBwcml2YXRlXG4gKi9cbmZ1bmN0aW9uIGNvbXBvbmVudFByb3BlcnR5TmFtZShDb21wb25lbnQpIHtcbiAgcmV0dXJuIGdldE5hbWUoQ29tcG9uZW50KTtcbn1cblxuLyoqXG4gKiBHZXQgYSBrZXkgZnJvbSBhIGxpc3Qgb2YgY29tcG9uZW50c1xuICogQHBhcmFtIHtBcnJheShDb21wb25lbnQpfSBDb21wb25lbnRzIEFycmF5IG9mIGNvbXBvbmVudHMgdG8gZ2VuZXJhdGUgdGhlIGtleVxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gcXVlcnlLZXkoQ29tcG9uZW50cykge1xuICB2YXIgbmFtZXMgPSBbXTtcbiAgZm9yICh2YXIgbiA9IDA7IG4gPCBDb21wb25lbnRzLmxlbmd0aDsgbisrKSB7XG4gICAgdmFyIFQgPSBDb21wb25lbnRzW25dO1xuICAgIGlmICh0eXBlb2YgVCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgdmFyIG9wZXJhdG9yID0gVC5vcGVyYXRvciA9PT0gXCJub3RcIiA/IFwiIVwiIDogVC5vcGVyYXRvcjtcbiAgICAgIG5hbWVzLnB1c2gob3BlcmF0b3IgKyBnZXROYW1lKFQuQ29tcG9uZW50KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWVzLnB1c2goZ2V0TmFtZShUKSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIG5hbWVzLnNvcnQoKS5qb2luKFwiLVwiKTtcbn1cblxuLy8gRGV0ZWN0b3IgZm9yIGJyb3dzZXIncyBcIndpbmRvd1wiXG5jb25zdCBoYXNXaW5kb3cgPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiO1xuXG4vLyBwZXJmb3JtYW5jZS5ub3coKSBcInBvbHlmaWxsXCJcbmNvbnN0IG5vdyA9XG4gIGhhc1dpbmRvdyAmJiB0eXBlb2Ygd2luZG93LnBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiXG4gICAgPyBwZXJmb3JtYW5jZS5ub3cuYmluZChwZXJmb3JtYW5jZSlcbiAgICA6IERhdGUubm93LmJpbmQoRGF0ZSk7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzcyBFdmVudERpc3BhdGNoZXJcbiAqL1xuY2xhc3MgRXZlbnREaXNwYXRjaGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5fbGlzdGVuZXJzID0ge307XG4gICAgdGhpcy5zdGF0cyA9IHtcbiAgICAgIGZpcmVkOiAwLFxuICAgICAgaGFuZGxlZDogMFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gbGlzdGVuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIHRvIHRyaWdnZXIgd2hlbiB0aGUgZXZlbnQgaXMgZmlyZWRcbiAgICovXG4gIGFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnM7XG4gICAgaWYgKGxpc3RlbmVyc1tldmVudE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGxpc3RlbmVyc1tldmVudE5hbWVdID0gW107XG4gICAgfVxuXG4gICAgaWYgKGxpc3RlbmVyc1tldmVudE5hbWVdLmluZGV4T2YobGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0ucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENoZWNrIGlmIGFuIGV2ZW50IGxpc3RlbmVyIGlzIGFscmVhZHkgYWRkZWQgdG8gdGhlIGxpc3Qgb2YgbGlzdGVuZXJzXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gY2hlY2tcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgQ2FsbGJhY2sgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgICovXG4gIGhhc0V2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIHJldHVybiAoXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXSAhPT0gdW5kZWZpbmVkICYmXG4gICAgICB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXS5pbmRleE9mKGxpc3RlbmVyKSAhPT0gLTFcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbiBldmVudCBsaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJlbW92ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBDYWxsYmFjayBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgKi9cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgdmFyIGxpc3RlbmVyQXJyYXkgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAobGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgaW5kZXggPSBsaXN0ZW5lckFycmF5LmluZGV4T2YobGlzdGVuZXIpO1xuICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICBsaXN0ZW5lckFycmF5LnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIERpc3BhdGNoIGFuIGV2ZW50XG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gZGlzcGF0Y2hcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSAoT3B0aW9uYWwpIEVudGl0eSB0byBlbWl0XG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBjb21wb25lbnRcbiAgICovXG4gIGRpc3BhdGNoRXZlbnQoZXZlbnROYW1lLCBlbnRpdHksIGNvbXBvbmVudCkge1xuICAgIHRoaXMuc3RhdHMuZmlyZWQrKztcblxuICAgIHZhciBsaXN0ZW5lckFycmF5ID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGFycmF5ID0gbGlzdGVuZXJBcnJheS5zbGljZSgwKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBhcnJheVtpXS5jYWxsKHRoaXMsIGVudGl0eSwgY29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgc3RhdHMgY291bnRlcnNcbiAgICovXG4gIHJlc2V0Q291bnRlcnMoKSB7XG4gICAgdGhpcy5zdGF0cy5maXJlZCA9IHRoaXMuc3RhdHMuaGFuZGxlZCA9IDA7XG4gIH1cbn1cblxuY2xhc3MgUXVlcnkge1xuICAvKipcbiAgICogQHBhcmFtIHtBcnJheShDb21wb25lbnQpfSBDb21wb25lbnRzIExpc3Qgb2YgdHlwZXMgb2YgY29tcG9uZW50cyB0byBxdWVyeVxuICAgKi9cbiAgY29uc3RydWN0b3IoQ29tcG9uZW50cywgbWFuYWdlcikge1xuICAgIHRoaXMuQ29tcG9uZW50cyA9IFtdO1xuICAgIHRoaXMuTm90Q29tcG9uZW50cyA9IFtdO1xuXG4gICAgQ29tcG9uZW50cy5mb3JFYWNoKGNvbXBvbmVudCA9PiB7XG4gICAgICBpZiAodHlwZW9mIGNvbXBvbmVudCA9PT0gXCJvYmplY3RcIikge1xuICAgICAgICB0aGlzLk5vdENvbXBvbmVudHMucHVzaChjb21wb25lbnQuQ29tcG9uZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuQ29tcG9uZW50cy5wdXNoKGNvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAodGhpcy5Db21wb25lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY3JlYXRlIGEgcXVlcnkgd2l0aG91dCBjb21wb25lbnRzXCIpO1xuICAgIH1cblxuICAgIHRoaXMuZW50aXRpZXMgPSBbXTtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyID0gbmV3IEV2ZW50RGlzcGF0Y2hlcigpO1xuXG4gICAgLy8gVGhpcyBxdWVyeSBpcyBiZWluZyB1c2VkIGJ5IGEgcmVhY3RpdmUgc3lzdGVtXG4gICAgdGhpcy5yZWFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgdGhpcy5rZXkgPSBxdWVyeUtleShDb21wb25lbnRzKTtcblxuICAgIC8vIEZpbGwgdGhlIHF1ZXJ5IHdpdGggdGhlIGV4aXN0aW5nIGVudGl0aWVzXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtYW5hZ2VyLl9lbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IG1hbmFnZXIuX2VudGl0aWVzW2ldO1xuICAgICAgaWYgKHRoaXMubWF0Y2goZW50aXR5KSkge1xuICAgICAgICAvLyBAdG9kbyA/Pz8gdGhpcy5hZGRFbnRpdHkoZW50aXR5KTsgPT4gcHJldmVudGluZyB0aGUgZXZlbnQgdG8gYmUgZ2VuZXJhdGVkXG4gICAgICAgIGVudGl0eS5xdWVyaWVzLnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgZW50aXR5IHRvIHRoaXMgcXVlcnlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eVxuICAgKi9cbiAgYWRkRW50aXR5KGVudGl0eSkge1xuICAgIGVudGl0eS5xdWVyaWVzLnB1c2godGhpcyk7XG4gICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG5cbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KFF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfQURERUQsIGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGVudGl0eSBmcm9tIHRoaXMgcXVlcnlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eVxuICAgKi9cbiAgcmVtb3ZlRW50aXR5KGVudGl0eSkge1xuICAgIGxldCBpbmRleCA9IHRoaXMuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpO1xuICAgIGlmICh+aW5kZXgpIHtcbiAgICAgIHRoaXMuZW50aXRpZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgaW5kZXggPSBlbnRpdHkucXVlcmllcy5pbmRleE9mKHRoaXMpO1xuICAgICAgZW50aXR5LnF1ZXJpZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgUXVlcnkucHJvdG90eXBlLkVOVElUWV9SRU1PVkVELFxuICAgICAgICBlbnRpdHlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgbWF0Y2goZW50aXR5KSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGVudGl0eS5oYXNBbGxDb21wb25lbnRzKHRoaXMuQ29tcG9uZW50cykgJiZcbiAgICAgICFlbnRpdHkuaGFzQW55Q29tcG9uZW50cyh0aGlzLk5vdENvbXBvbmVudHMpXG4gICAgKTtcbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICByZXR1cm4ge1xuICAgICAga2V5OiB0aGlzLmtleSxcbiAgICAgIHJlYWN0aXZlOiB0aGlzLnJlYWN0aXZlLFxuICAgICAgY29tcG9uZW50czoge1xuICAgICAgICBpbmNsdWRlZDogdGhpcy5Db21wb25lbnRzLm1hcChDID0+IEMubmFtZSksXG4gICAgICAgIG5vdDogdGhpcy5Ob3RDb21wb25lbnRzLm1hcChDID0+IEMubmFtZSlcbiAgICAgIH0sXG4gICAgICBudW1FbnRpdGllczogdGhpcy5lbnRpdGllcy5sZW5ndGhcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzdGF0cyBmb3IgdGhpcyBxdWVyeVxuICAgKi9cbiAgc3RhdHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG51bUNvbXBvbmVudHM6IHRoaXMuQ29tcG9uZW50cy5sZW5ndGgsXG4gICAgICBudW1FbnRpdGllczogdGhpcy5lbnRpdGllcy5sZW5ndGhcbiAgICB9O1xuICB9XG59XG5cblF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfQURERUQgPSBcIlF1ZXJ5I0VOVElUWV9BRERFRFwiO1xuUXVlcnkucHJvdG90eXBlLkVOVElUWV9SRU1PVkVEID0gXCJRdWVyeSNFTlRJVFlfUkVNT1ZFRFwiO1xuUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VEID0gXCJRdWVyeSNDT01QT05FTlRfQ0hBTkdFRFwiO1xuXG5jbGFzcyBTeXN0ZW0ge1xuICBjYW5FeGVjdXRlKCkge1xuICAgIGlmICh0aGlzLl9tYW5kYXRvcnlRdWVyaWVzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHRydWU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21hbmRhdG9yeVF1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMuX21hbmRhdG9yeVF1ZXJpZXNbaV07XG4gICAgICBpZiAocXVlcnkuZW50aXRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAvLyBAdG9kbyBCZXR0ZXIgbmFtaW5nIDopXG4gICAgdGhpcy5fcXVlcmllcyA9IHt9O1xuICAgIHRoaXMucXVlcmllcyA9IHt9O1xuXG4gICAgdGhpcy5wcmlvcml0eSA9IDA7XG5cbiAgICAvLyBVc2VkIGZvciBzdGF0c1xuICAgIHRoaXMuZXhlY3V0ZVRpbWUgPSAwO1xuXG4gICAgaWYgKGF0dHJpYnV0ZXMgJiYgYXR0cmlidXRlcy5wcmlvcml0eSkge1xuICAgICAgdGhpcy5wcmlvcml0eSA9IGF0dHJpYnV0ZXMucHJpb3JpdHk7XG4gICAgfVxuXG4gICAgdGhpcy5fbWFuZGF0b3J5UXVlcmllcyA9IFtdO1xuXG4gICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG5cbiAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzKSB7XG4gICAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzKSB7XG4gICAgICAgIHZhciBxdWVyeUNvbmZpZyA9IHRoaXMuY29uc3RydWN0b3IucXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgICB2YXIgQ29tcG9uZW50cyA9IHF1ZXJ5Q29uZmlnLmNvbXBvbmVudHM7XG4gICAgICAgIGlmICghQ29tcG9uZW50cyB8fCBDb21wb25lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIidjb21wb25lbnRzJyBhdHRyaWJ1dGUgY2FuJ3QgYmUgZW1wdHkgaW4gYSBxdWVyeVwiKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcXVlcnkgPSB0aGlzLndvcmxkLmVudGl0eU1hbmFnZXIucXVlcnlDb21wb25lbnRzKENvbXBvbmVudHMpO1xuICAgICAgICB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV0gPSBxdWVyeTtcbiAgICAgICAgaWYgKHF1ZXJ5Q29uZmlnLm1hbmRhdG9yeSA9PT0gdHJ1ZSkge1xuICAgICAgICAgIHRoaXMuX21hbmRhdG9yeVF1ZXJpZXMucHVzaChxdWVyeSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV0gPSB7XG4gICAgICAgICAgcmVzdWx0czogcXVlcnkuZW50aXRpZXNcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBSZWFjdGl2ZSBjb25maWd1cmF0aW9uIGFkZGVkL3JlbW92ZWQvY2hhbmdlZFxuICAgICAgICB2YXIgdmFsaWRFdmVudHMgPSBbXCJhZGRlZFwiLCBcInJlbW92ZWRcIiwgXCJjaGFuZ2VkXCJdO1xuXG4gICAgICAgIGNvbnN0IGV2ZW50TWFwcGluZyA9IHtcbiAgICAgICAgICBhZGRlZDogUXVlcnkucHJvdG90eXBlLkVOVElUWV9BRERFRCxcbiAgICAgICAgICByZW1vdmVkOiBRdWVyeS5wcm90b3R5cGUuRU5USVRZX1JFTU9WRUQsXG4gICAgICAgICAgY2hhbmdlZDogUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VEIC8vIFF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfQ0hBTkdFRFxuICAgICAgICB9O1xuXG4gICAgICAgIGlmIChxdWVyeUNvbmZpZy5saXN0ZW4pIHtcbiAgICAgICAgICB2YWxpZEV2ZW50cy5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXhlY3V0ZSkge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICAgYFN5c3RlbSAnJHtcbiAgICAgICAgICAgICAgICAgIHRoaXMuY29uc3RydWN0b3IubmFtZVxuICAgICAgICAgICAgICAgIH0nIGhhcyBkZWZpbmVkIGxpc3RlbiBldmVudHMgKCR7dmFsaWRFdmVudHMuam9pbihcbiAgICAgICAgICAgICAgICAgIFwiLCBcIlxuICAgICAgICAgICAgICAgICl9KSBmb3IgcXVlcnkgJyR7cXVlcnlOYW1lfScgYnV0IGl0IGRvZXMgbm90IGltcGxlbWVudCB0aGUgJ2V4ZWN1dGUnIG1ldGhvZC5gXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElzIHRoZSBldmVudCBlbmFibGVkIG9uIHRoaXMgc3lzdGVtJ3MgcXVlcnk/XG4gICAgICAgICAgICBpZiAocXVlcnlDb25maWcubGlzdGVuW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgICAgbGV0IGV2ZW50ID0gcXVlcnlDb25maWcubGlzdGVuW2V2ZW50TmFtZV07XG5cbiAgICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gXCJjaGFuZ2VkXCIpIHtcbiAgICAgICAgICAgICAgICBxdWVyeS5yZWFjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAvLyBBbnkgY2hhbmdlIG9uIHRoZSBlbnRpdHkgZnJvbSB0aGUgY29tcG9uZW50cyBpbiB0aGUgcXVlcnlcbiAgICAgICAgICAgICAgICAgIGxldCBldmVudExpc3QgPSAodGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV1bZXZlbnROYW1lXSA9IFtdKTtcbiAgICAgICAgICAgICAgICAgIHF1ZXJ5LmV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgICBRdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQsXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KGV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50TGlzdCA9ICh0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXVtldmVudE5hbWVdID0gW10pO1xuICAgICAgICAgICAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICAgIFF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCxcbiAgICAgICAgICAgICAgICAgICAgKGVudGl0eSwgY2hhbmdlZENvbXBvbmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIC8vIEF2b2lkIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5pbmRleE9mKGNoYW5nZWRDb21wb25lbnQuY29uc3RydWN0b3IpICE9PSAtMSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LmluZGV4T2YoZW50aXR5KSA9PT0gLTFcbiAgICAgICAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKHRoaXMucXVlcmllc1txdWVyeU5hbWVdW2V2ZW50TmFtZV0gPSBbXSk7XG5cbiAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgIGV2ZW50TWFwcGluZ1tldmVudE5hbWVdLFxuICAgICAgICAgICAgICAgICAgZW50aXR5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQGZpeG1lIG92ZXJoZWFkP1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRMaXN0LmluZGV4T2YoZW50aXR5KSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZXhlY3V0ZVRpbWUgPSAwO1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gQHF1ZXN0aW9uIHJlbmFtZSB0byBjbGVhciBxdWV1ZXM/XG4gIGNsZWFyRXZlbnRzKCkge1xuICAgIGZvciAobGV0IHF1ZXJ5TmFtZSBpbiB0aGlzLnF1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgaWYgKHF1ZXJ5LmFkZGVkKSB7XG4gICAgICAgIHF1ZXJ5LmFkZGVkLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAocXVlcnkucmVtb3ZlZCkge1xuICAgICAgICBxdWVyeS5yZW1vdmVkLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAocXVlcnkuY2hhbmdlZCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShxdWVyeS5jaGFuZ2VkKSkge1xuICAgICAgICAgIHF1ZXJ5LmNoYW5nZWQubGVuZ3RoID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIHF1ZXJ5LmNoYW5nZWQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LmNoYW5nZWRbbmFtZV0ubGVuZ3RoID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgdmFyIGpzb24gPSB7XG4gICAgICBuYW1lOiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgICBlbmFibGVkOiB0aGlzLmVuYWJsZWQsXG4gICAgICBleGVjdXRlVGltZTogdGhpcy5leGVjdXRlVGltZSxcbiAgICAgIHByaW9yaXR5OiB0aGlzLnByaW9yaXR5LFxuICAgICAgcXVlcmllczoge31cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IucXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJpZXMgPSB0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXM7XG4gICAgICBmb3IgKGxldCBxdWVyeU5hbWUgaW4gcXVlcmllcykge1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXTtcbiAgICAgICAgbGV0IHF1ZXJ5RGVmaW5pdGlvbiA9IHF1ZXJpZXNbcXVlcnlOYW1lXTtcbiAgICAgICAgbGV0IGpzb25RdWVyeSA9IChqc29uLnF1ZXJpZXNbcXVlcnlOYW1lXSA9IHtcbiAgICAgICAgICBrZXk6IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXS5rZXlcbiAgICAgICAgfSk7XG5cbiAgICAgICAganNvblF1ZXJ5Lm1hbmRhdG9yeSA9IHF1ZXJ5RGVmaW5pdGlvbi5tYW5kYXRvcnkgPT09IHRydWU7XG4gICAgICAgIGpzb25RdWVyeS5yZWFjdGl2ZSA9XG4gICAgICAgICAgcXVlcnlEZWZpbml0aW9uLmxpc3RlbiAmJlxuICAgICAgICAgIChxdWVyeURlZmluaXRpb24ubGlzdGVuLmFkZGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICBxdWVyeURlZmluaXRpb24ubGlzdGVuLnJlbW92ZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHF1ZXJ5RGVmaW5pdGlvbi5saXN0ZW4uY2hhbmdlZCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShxdWVyeURlZmluaXRpb24ubGlzdGVuLmNoYW5nZWQpKTtcblxuICAgICAgICBpZiAoanNvblF1ZXJ5LnJlYWN0aXZlKSB7XG4gICAgICAgICAganNvblF1ZXJ5Lmxpc3RlbiA9IHt9O1xuXG4gICAgICAgICAgY29uc3QgbWV0aG9kcyA9IFtcImFkZGVkXCIsIFwicmVtb3ZlZFwiLCBcImNoYW5nZWRcIl07XG4gICAgICAgICAgbWV0aG9kcy5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gICAgICAgICAgICBpZiAocXVlcnlbbWV0aG9kXSkge1xuICAgICAgICAgICAgICBqc29uUXVlcnkubGlzdGVuW21ldGhvZF0gPSB7XG4gICAgICAgICAgICAgICAgZW50aXRpZXM6IHF1ZXJ5W21ldGhvZF0ubGVuZ3RoXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ganNvbjtcbiAgfVxufVxuXG5mdW5jdGlvbiBOb3QoQ29tcG9uZW50KSB7XG4gIHJldHVybiB7XG4gICAgb3BlcmF0b3I6IFwibm90XCIsXG4gICAgQ29tcG9uZW50OiBDb21wb25lbnRcbiAgfTtcbn1cblxuY2xhc3MgU3lzdGVtTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgdGhpcy5fc3lzdGVtcyA9IFtdO1xuICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zID0gW107IC8vIFN5c3RlbXMgdGhhdCBoYXZlIGBleGVjdXRlYCBtZXRob2RcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5sYXN0RXhlY3V0ZWRTeXN0ZW0gPSBudWxsO1xuICB9XG5cbiAgcmVnaXN0ZXJTeXN0ZW0oU3lzdGVtQ2xhc3MsIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoIShTeXN0ZW1DbGFzcy5wcm90b3R5cGUgaW5zdGFuY2VvZiBTeXN0ZW0pKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIGBTeXN0ZW0gJyR7U3lzdGVtQ2xhc3MubmFtZX0nIGRvZXMgbm90IGV4dGVuZHMgJ1N5c3RlbScgY2xhc3NgXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAodGhpcy5nZXRTeXN0ZW0oU3lzdGVtQ2xhc3MpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybihgU3lzdGVtICcke1N5c3RlbUNsYXNzLm5hbWV9JyBhbHJlYWR5IHJlZ2lzdGVyZWQuYCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB2YXIgc3lzdGVtID0gbmV3IFN5c3RlbUNsYXNzKHRoaXMud29ybGQsIGF0dHJpYnV0ZXMpO1xuICAgIGlmIChzeXN0ZW0uaW5pdCkgc3lzdGVtLmluaXQoYXR0cmlidXRlcyk7XG4gICAgc3lzdGVtLm9yZGVyID0gdGhpcy5fc3lzdGVtcy5sZW5ndGg7XG4gICAgdGhpcy5fc3lzdGVtcy5wdXNoKHN5c3RlbSk7XG4gICAgaWYgKHN5c3RlbS5leGVjdXRlKSB7XG4gICAgICB0aGlzLl9leGVjdXRlU3lzdGVtcy5wdXNoKHN5c3RlbSk7XG4gICAgICB0aGlzLnNvcnRTeXN0ZW1zKCk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5yZWdpc3RlclN5c3RlbShTeXN0ZW1DbGFzcykge1xuICAgIGxldCBzeXN0ZW0gPSB0aGlzLmdldFN5c3RlbShTeXN0ZW1DbGFzcyk7XG4gICAgaWYgKHN5c3RlbSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIGBDYW4gdW5yZWdpc3RlciBzeXN0ZW0gJyR7U3lzdGVtQ2xhc3MubmFtZX0nLiBJdCBkb2Vzbid0IGV4aXN0LmBcbiAgICAgICk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLl9zeXN0ZW1zLnNwbGljZSh0aGlzLl9zeXN0ZW1zLmluZGV4T2Yoc3lzdGVtKSwgMSk7XG5cbiAgICBpZiAoc3lzdGVtLmV4ZWN1dGUpIHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLnNwbGljZSh0aGlzLl9leGVjdXRlU3lzdGVtcy5pbmRleE9mKHN5c3RlbSksIDEpO1xuICAgIH1cblxuICAgIC8vIEB0b2RvIEFkZCBzeXN0ZW0udW5yZWdpc3RlcigpIGNhbGwgdG8gZnJlZSByZXNvdXJjZXNcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHNvcnRTeXN0ZW1zKCkge1xuICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIHJldHVybiBhLnByaW9yaXR5IC0gYi5wcmlvcml0eSB8fCBhLm9yZGVyIC0gYi5vcmRlcjtcbiAgICB9KTtcbiAgfVxuXG4gIGdldFN5c3RlbShTeXN0ZW1DbGFzcykge1xuICAgIHJldHVybiB0aGlzLl9zeXN0ZW1zLmZpbmQocyA9PiBzIGluc3RhbmNlb2YgU3lzdGVtQ2xhc3MpO1xuICB9XG5cbiAgZ2V0U3lzdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5fc3lzdGVtcztcbiAgfVxuXG4gIHJlbW92ZVN5c3RlbShTeXN0ZW1DbGFzcykge1xuICAgIHZhciBpbmRleCA9IHRoaXMuX3N5c3RlbXMuaW5kZXhPZihTeXN0ZW1DbGFzcyk7XG4gICAgaWYgKCF+aW5kZXgpIHJldHVybjtcblxuICAgIHRoaXMuX3N5c3RlbXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgfVxuXG4gIGV4ZWN1dGVTeXN0ZW0oc3lzdGVtLCBkZWx0YSwgdGltZSkge1xuICAgIGlmIChzeXN0ZW0uaW5pdGlhbGl6ZWQpIHtcbiAgICAgIGlmIChzeXN0ZW0uY2FuRXhlY3V0ZSgpKSB7XG4gICAgICAgIGxldCBzdGFydFRpbWUgPSBub3coKTtcbiAgICAgICAgc3lzdGVtLmV4ZWN1dGUoZGVsdGEsIHRpbWUpO1xuICAgICAgICBzeXN0ZW0uZXhlY3V0ZVRpbWUgPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgICAgdGhpcy5sYXN0RXhlY3V0ZWRTeXN0ZW0gPSBzeXN0ZW07XG4gICAgICAgIHN5c3RlbS5jbGVhckV2ZW50cygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuZm9yRWFjaChzeXN0ZW0gPT4gc3lzdGVtLnN0b3AoKSk7XG4gIH1cblxuICBleGVjdXRlKGRlbHRhLCB0aW1lLCBmb3JjZVBsYXkpIHtcbiAgICB0aGlzLl9leGVjdXRlU3lzdGVtcy5mb3JFYWNoKFxuICAgICAgc3lzdGVtID0+XG4gICAgICAgIChmb3JjZVBsYXkgfHwgc3lzdGVtLmVuYWJsZWQpICYmIHRoaXMuZXhlY3V0ZVN5c3RlbShzeXN0ZW0sIGRlbHRhLCB0aW1lKVxuICAgICk7XG4gIH1cblxuICBzdGF0cygpIHtcbiAgICB2YXIgc3RhdHMgPSB7XG4gICAgICBudW1TeXN0ZW1zOiB0aGlzLl9zeXN0ZW1zLmxlbmd0aCxcbiAgICAgIHN5c3RlbXM6IHt9XG4gICAgfTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5fc3lzdGVtcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHN5c3RlbSA9IHRoaXMuX3N5c3RlbXNbaV07XG4gICAgICB2YXIgc3lzdGVtU3RhdHMgPSAoc3RhdHMuc3lzdGVtc1tzeXN0ZW0uY29uc3RydWN0b3IubmFtZV0gPSB7XG4gICAgICAgIHF1ZXJpZXM6IHt9LFxuICAgICAgICBleGVjdXRlVGltZTogc3lzdGVtLmV4ZWN1dGVUaW1lXG4gICAgICB9KTtcbiAgICAgIGZvciAodmFyIG5hbWUgaW4gc3lzdGVtLmN0eCkge1xuICAgICAgICBzeXN0ZW1TdGF0cy5xdWVyaWVzW25hbWVdID0gc3lzdGVtLmN0eFtuYW1lXS5zdGF0cygpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0cztcbiAgfVxufVxuXG5jbGFzcyBPYmplY3RQb29sIHtcbiAgLy8gQHRvZG8gQWRkIGluaXRpYWwgc2l6ZVxuICBjb25zdHJ1Y3RvcihiYXNlT2JqZWN0LCBpbml0aWFsU2l6ZSkge1xuICAgIHRoaXMuZnJlZUxpc3QgPSBbXTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmJhc2VPYmplY3QgPSBiYXNlT2JqZWN0O1xuICAgIHRoaXMuaXNPYmplY3RQb29sID0gdHJ1ZTtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFNpemUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuZXhwYW5kKGluaXRpYWxTaXplKTtcbiAgICB9XG4gIH1cblxuICBhY3F1aXJlKCkge1xuICAgIC8vIEdyb3cgdGhlIGxpc3QgYnkgMjAlaXNoIGlmIHdlJ3JlIG91dFxuICAgIGlmICh0aGlzLmZyZWVMaXN0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICB0aGlzLmV4cGFuZChNYXRoLnJvdW5kKHRoaXMuY291bnQgKiAwLjIpICsgMSk7XG4gICAgfVxuXG4gICAgdmFyIGl0ZW0gPSB0aGlzLmZyZWVMaXN0LnBvcCgpO1xuXG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICByZWxlYXNlKGl0ZW0pIHtcbiAgICBpdGVtLnJlc2V0KCk7XG4gICAgdGhpcy5mcmVlTGlzdC5wdXNoKGl0ZW0pO1xuICB9XG5cbiAgZXhwYW5kKGNvdW50KSB7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCBjb3VudDsgbisrKSB7XG4gICAgICB2YXIgY2xvbmUgPSBuZXcgdGhpcy5iYXNlT2JqZWN0KCk7XG4gICAgICBjbG9uZS5fcG9vbCA9IHRoaXM7XG4gICAgICB0aGlzLmZyZWVMaXN0LnB1c2goY2xvbmUpO1xuICAgIH1cbiAgICB0aGlzLmNvdW50ICs9IGNvdW50O1xuICB9XG5cbiAgdG90YWxTaXplKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50O1xuICB9XG5cbiAgdG90YWxGcmVlKCkge1xuICAgIHJldHVybiB0aGlzLmZyZWVMaXN0Lmxlbmd0aDtcbiAgfVxuXG4gIHRvdGFsVXNlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudCAtIHRoaXMuZnJlZUxpc3QubGVuZ3RoO1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzcyBRdWVyeU1hbmFnZXJcbiAqL1xuY2xhc3MgUXVlcnlNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICB0aGlzLl93b3JsZCA9IHdvcmxkO1xuXG4gICAgLy8gUXVlcmllcyBpbmRleGVkIGJ5IGEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjb21wb25lbnRzIGl0IGhhc1xuICAgIHRoaXMuX3F1ZXJpZXMgPSB7fTtcbiAgfVxuXG4gIG9uRW50aXR5UmVtb3ZlZChlbnRpdHkpIHtcbiAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5fcXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgaWYgKGVudGl0eS5xdWVyaWVzLmluZGV4T2YocXVlcnkpICE9PSAtMSkge1xuICAgICAgICBxdWVyeS5yZW1vdmVFbnRpdHkoZW50aXR5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgd2hlbiBhIGNvbXBvbmVudCBpcyBhZGRlZCB0byBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgdGhhdCBqdXN0IGdvdCB0aGUgbmV3IGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50IENvbXBvbmVudCBhZGRlZCB0byB0aGUgZW50aXR5XG4gICAqL1xuICBvbkVudGl0eUNvbXBvbmVudEFkZGVkKGVudGl0eSwgQ29tcG9uZW50KSB7XG4gICAgLy8gQHRvZG8gVXNlIGJpdG1hc2sgZm9yIGNoZWNraW5nIGNvbXBvbmVudHM/XG5cbiAgICAvLyBDaGVjayBlYWNoIGluZGV4ZWQgcXVlcnkgdG8gc2VlIGlmIHdlIG5lZWQgdG8gYWRkIHRoaXMgZW50aXR5IHRvIHRoZSBsaXN0XG4gICAgZm9yICh2YXIgcXVlcnlOYW1lIGluIHRoaXMuX3F1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXTtcblxuICAgICAgaWYgKFxuICAgICAgICAhIX5xdWVyeS5Ob3RDb21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAmJlxuICAgICAgICB+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpXG4gICAgICApIHtcbiAgICAgICAgcXVlcnkucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIGVudGl0eSBvbmx5IGlmOlxuICAgICAgLy8gQ29tcG9uZW50IGlzIGluIHRoZSBxdWVyeVxuICAgICAgLy8gYW5kIEVudGl0eSBoYXMgQUxMIHRoZSBjb21wb25lbnRzIG9mIHRoZSBxdWVyeVxuICAgICAgLy8gYW5kIEVudGl0eSBpcyBub3QgYWxyZWFkeSBpbiB0aGUgcXVlcnlcbiAgICAgIGlmIChcbiAgICAgICAgIX5xdWVyeS5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSB8fFxuICAgICAgICAhcXVlcnkubWF0Y2goZW50aXR5KSB8fFxuICAgICAgICB+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpXG4gICAgICApXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBxdWVyeS5hZGRFbnRpdHkoZW50aXR5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgd2hlbiBhIGNvbXBvbmVudCBpcyByZW1vdmVkIGZyb20gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IHRvIHJlbW92ZSB0aGUgY29tcG9uZW50IGZyb21cbiAgICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudCBDb21wb25lbnQgdG8gcmVtb3ZlIGZyb20gdGhlIGVudGl0eVxuICAgKi9cbiAgb25FbnRpdHlDb21wb25lbnRSZW1vdmVkKGVudGl0eSwgQ29tcG9uZW50KSB7XG4gICAgZm9yICh2YXIgcXVlcnlOYW1lIGluIHRoaXMuX3F1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXTtcblxuICAgICAgaWYgKFxuICAgICAgICAhIX5xdWVyeS5Ob3RDb21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAmJlxuICAgICAgICAhfnF1ZXJ5LmVudGl0aWVzLmluZGV4T2YoZW50aXR5KSAmJlxuICAgICAgICBxdWVyeS5tYXRjaChlbnRpdHkpXG4gICAgICApIHtcbiAgICAgICAgcXVlcnkuYWRkRW50aXR5KGVudGl0eSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgICEhfnF1ZXJ5LkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICYmXG4gICAgICAgICEhfnF1ZXJ5LmVudGl0aWVzLmluZGV4T2YoZW50aXR5KSAmJlxuICAgICAgICAhcXVlcnkubWF0Y2goZW50aXR5KVxuICAgICAgKSB7XG4gICAgICAgIHF1ZXJ5LnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgcXVlcnkgZm9yIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50c1xuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50cyBDb21wb25lbnRzIHRoYXQgdGhlIHF1ZXJ5IHNob3VsZCBoYXZlXG4gICAqL1xuICBnZXRRdWVyeShDb21wb25lbnRzKSB7XG4gICAgdmFyIGtleSA9IHF1ZXJ5S2V5KENvbXBvbmVudHMpO1xuICAgIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJpZXNba2V5XTtcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aGlzLl9xdWVyaWVzW2tleV0gPSBxdWVyeSA9IG5ldyBRdWVyeShDb21wb25lbnRzLCB0aGlzLl93b3JsZCk7XG4gICAgfVxuICAgIHJldHVybiBxdWVyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc29tZSBzdGF0cyBmcm9tIHRoaXMgY2xhc3NcbiAgICovXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHt9O1xuICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLl9xdWVyaWVzKSB7XG4gICAgICBzdGF0c1txdWVyeU5hbWVdID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdLnN0YXRzKCk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfVxufVxuXG5jbGFzcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIGlmIChwcm9wcyAhPT0gZmFsc2UpIHtcbiAgICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgICAgaWYgKHByb3BzICYmIHByb3BzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICB0aGlzW2tleV0gPSBwcm9wc1trZXldO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnN0IHNjaGVtYVByb3AgPSBzY2hlbWFba2V5XTtcbiAgICAgICAgICBpZiAoc2NoZW1hUHJvcC5oYXNPd25Qcm9wZXJ0eShcImRlZmF1bHRcIikpIHtcbiAgICAgICAgICAgIHRoaXNba2V5XSA9IHNjaGVtYVByb3AudHlwZS5jbG9uZShzY2hlbWFQcm9wLmRlZmF1bHQpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB0eXBlID0gc2NoZW1hUHJvcC50eXBlO1xuICAgICAgICAgICAgdGhpc1trZXldID0gdHlwZS5jbG9uZSh0eXBlLmRlZmF1bHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX3Bvb2wgPSBudWxsO1xuICB9XG5cbiAgY29weShzb3VyY2UpIHtcbiAgICBjb25zdCBzY2hlbWEgPSB0aGlzLmNvbnN0cnVjdG9yLnNjaGVtYTtcblxuICAgIGZvciAoY29uc3Qga2V5IGluIHNjaGVtYSkge1xuICAgICAgY29uc3QgcHJvcCA9IHNjaGVtYVtrZXldO1xuXG4gICAgICBpZiAoc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgcHJvcC50eXBlLmNvcHkoc291cmNlLCB0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKCkuY29weSh0aGlzKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICBjb25zdCBzY2hlbWFQcm9wID0gc2NoZW1hW2tleV07XG5cbiAgICAgIGlmIChzY2hlbWFQcm9wLmhhc093blByb3BlcnR5KFwiZGVmYXVsdFwiKSkge1xuICAgICAgICB0aGlzW2tleV0gPSBzY2hlbWFQcm9wLnR5cGUuY2xvbmUoc2NoZW1hUHJvcC5kZWZhdWx0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSBzY2hlbWFQcm9wLnR5cGU7XG4gICAgICAgIHRoaXNba2V5XSA9IHR5cGUuY2xvbmUodHlwZS5kZWZhdWx0KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBkaXNwb3NlKCkge1xuICAgIGlmICh0aGlzLl9wb29sKSB7XG4gICAgICB0aGlzLl9wb29sLnJlbGVhc2UodGhpcyk7XG4gICAgfVxuICB9XG59XG5cbkNvbXBvbmVudC5zY2hlbWEgPSB7fTtcbkNvbXBvbmVudC5pc0NvbXBvbmVudCA9IHRydWU7XG5cbmNsYXNzIFN5c3RlbVN0YXRlQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cblN5c3RlbVN0YXRlQ29tcG9uZW50LmlzU3lzdGVtU3RhdGVDb21wb25lbnQgPSB0cnVlO1xuXG5jbGFzcyBFbnRpdHlQb29sIGV4dGVuZHMgT2JqZWN0UG9vbCB7XG4gIGNvbnN0cnVjdG9yKGVudGl0eU1hbmFnZXIsIGVudGl0eUNsYXNzLCBpbml0aWFsU2l6ZSkge1xuICAgIHN1cGVyKGVudGl0eUNsYXNzLCB1bmRlZmluZWQpO1xuICAgIHRoaXMuZW50aXR5TWFuYWdlciA9IGVudGl0eU1hbmFnZXI7XG5cbiAgICBpZiAodHlwZW9mIGluaXRpYWxTaXplICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLmV4cGFuZChpbml0aWFsU2l6ZSk7XG4gICAgfVxuICB9XG5cbiAgZXhwYW5kKGNvdW50KSB7XG4gICAgZm9yICh2YXIgbiA9IDA7IG4gPCBjb3VudDsgbisrKSB7XG4gICAgICB2YXIgY2xvbmUgPSBuZXcgdGhpcy5iYXNlT2JqZWN0KHRoaXMuZW50aXR5TWFuYWdlcik7XG4gICAgICBjbG9uZS5fcG9vbCA9IHRoaXM7XG4gICAgICB0aGlzLmZyZWVMaXN0LnB1c2goY2xvbmUpO1xuICAgIH1cbiAgICB0aGlzLmNvdW50ICs9IGNvdW50O1xuICB9XG59XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzcyBFbnRpdHlNYW5hZ2VyXG4gKi9cbmNsYXNzIEVudGl0eU1hbmFnZXIge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xuICAgIHRoaXMud29ybGQgPSB3b3JsZDtcbiAgICB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyID0gd29ybGQuY29tcG9uZW50c01hbmFnZXI7XG5cbiAgICAvLyBBbGwgdGhlIGVudGl0aWVzIGluIHRoaXMgaW5zdGFuY2VcbiAgICB0aGlzLl9lbnRpdGllcyA9IFtdO1xuICAgIHRoaXMuX25leHRFbnRpdHlJZCA9IDA7XG5cbiAgICB0aGlzLl9lbnRpdGllc0J5TmFtZXMgPSB7fTtcblxuICAgIHRoaXMuX3F1ZXJ5TWFuYWdlciA9IG5ldyBRdWVyeU1hbmFnZXIodGhpcyk7XG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKCk7XG4gICAgdGhpcy5fZW50aXR5UG9vbCA9IG5ldyBFbnRpdHlQb29sKFxuICAgICAgdGhpcyxcbiAgICAgIHRoaXMud29ybGQub3B0aW9ucy5lbnRpdHlDbGFzcyxcbiAgICAgIHRoaXMud29ybGQub3B0aW9ucy5lbnRpdHlQb29sU2l6ZVxuICAgICk7XG5cbiAgICAvLyBEZWZlcnJlZCBkZWxldGlvblxuICAgIHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlID0gW107XG4gICAgdGhpcy5lbnRpdGllc1RvUmVtb3ZlID0gW107XG4gICAgdGhpcy5kZWZlcnJlZFJlbW92YWxFbmFibGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGdldEVudGl0eUJ5TmFtZShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzQnlOYW1lc1tuYW1lXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgYSBuZXcgZW50aXR5XG4gICAqL1xuICBjcmVhdGVFbnRpdHkobmFtZSkge1xuICAgIHZhciBlbnRpdHkgPSB0aGlzLl9lbnRpdHlQb29sLmFjcXVpcmUoKTtcbiAgICBlbnRpdHkuYWxpdmUgPSB0cnVlO1xuICAgIGVudGl0eS5uYW1lID0gbmFtZSB8fCBcIlwiO1xuICAgIGlmIChuYW1lKSB7XG4gICAgICBpZiAodGhpcy5fZW50aXRpZXNCeU5hbWVzW25hbWVdKSB7XG4gICAgICAgIGNvbnNvbGUud2FybihgRW50aXR5IG5hbWUgJyR7bmFtZX0nIGFscmVhZHkgZXhpc3RgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2VudGl0aWVzQnlOYW1lc1tuYW1lXSA9IGVudGl0eTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLl9lbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChFTlRJVFlfQ1JFQVRFRCwgZW50aXR5KTtcbiAgICByZXR1cm4gZW50aXR5O1xuICB9XG5cbiAgLy8gQ09NUE9ORU5UU1xuXG4gIC8qKlxuICAgKiBBZGQgYSBjb21wb25lbnQgdG8gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IHdoZXJlIHRoZSBjb21wb25lbnQgd2lsbCBiZSBhZGRlZFxuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50IENvbXBvbmVudCB0byBiZSBhZGRlZCB0byB0aGUgZW50aXR5XG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgT3B0aW9uYWwgdmFsdWVzIHRvIHJlcGxhY2UgdGhlIGRlZmF1bHQgYXR0cmlidXRlc1xuICAgKi9cbiAgZW50aXR5QWRkQ29tcG9uZW50KGVudGl0eSwgQ29tcG9uZW50LCB2YWx1ZXMpIHtcbiAgICBpZiAoIXRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuQ29tcG9uZW50c1tDb21wb25lbnQubmFtZV0pIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYEF0dGVtcHRlZCB0byBhZGQgdW5yZWdpc3RlcmVkIGNvbXBvbmVudCBcIiR7Q29tcG9uZW50Lm5hbWV9XCJgXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICh+ZW50aXR5Ll9Db21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCkpIHtcbiAgICAgIC8vIEB0b2RvIEp1c3Qgb24gZGVidWcgbW9kZVxuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIkNvbXBvbmVudCB0eXBlIGFscmVhZHkgZXhpc3RzIG9uIGVudGl0eS5cIixcbiAgICAgICAgZW50aXR5LFxuICAgICAgICBDb21wb25lbnQubmFtZVxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBlbnRpdHkuX0NvbXBvbmVudFR5cGVzLnB1c2goQ29tcG9uZW50KTtcblxuICAgIGlmIChDb21wb25lbnQuX19wcm90b19fID09PSBTeXN0ZW1TdGF0ZUNvbXBvbmVudCkge1xuICAgICAgZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cysrO1xuICAgIH1cblxuICAgIHZhciBjb21wb25lbnRQb29sID0gdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5nZXRDb21wb25lbnRzUG9vbChcbiAgICAgIENvbXBvbmVudFxuICAgICk7XG5cbiAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50UG9vbFxuICAgICAgPyBjb21wb25lbnRQb29sLmFjcXVpcmUoKVxuICAgICAgOiBuZXcgQ29tcG9uZW50KHZhbHVlcyk7XG5cbiAgICBpZiAoY29tcG9uZW50UG9vbCAmJiB2YWx1ZXMpIHtcbiAgICAgIGNvbXBvbmVudC5jb3B5KHZhbHVlcyk7XG4gICAgfVxuXG4gICAgZW50aXR5Ll9jb21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSA9IGNvbXBvbmVudDtcblxuICAgIHRoaXMuX3F1ZXJ5TWFuYWdlci5vbkVudGl0eUNvbXBvbmVudEFkZGVkKGVudGl0eSwgQ29tcG9uZW50KTtcbiAgICB0aGlzLndvcmxkLmNvbXBvbmVudHNNYW5hZ2VyLmNvbXBvbmVudEFkZGVkVG9FbnRpdHkoQ29tcG9uZW50KTtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoQ09NUE9ORU5UX0FEREVELCBlbnRpdHksIENvbXBvbmVudCk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGEgY29tcG9uZW50IGZyb20gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IHdoaWNoIHdpbGwgZ2V0IHJlbW92ZWQgdGhlIGNvbXBvbmVudFxuICAgKiBAcGFyYW0geyp9IENvbXBvbmVudCBDb21wb25lbnQgdG8gcmVtb3ZlIGZyb20gdGhlIGVudGl0eVxuICAgKiBAcGFyYW0ge0Jvb2x9IGltbWVkaWF0ZWx5IElmIHlvdSB3YW50IHRvIHJlbW92ZSB0aGUgY29tcG9uZW50IGltbWVkaWF0ZWx5IGluc3RlYWQgb2YgZGVmZXJyZWQgKERlZmF1bHQgaXMgZmFsc2UpXG4gICAqL1xuICBlbnRpdHlSZW1vdmVDb21wb25lbnQoZW50aXR5LCBDb21wb25lbnQsIGltbWVkaWF0ZWx5KSB7XG4gICAgdmFyIGluZGV4ID0gZW50aXR5Ll9Db21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCk7XG4gICAgaWYgKCF+aW5kZXgpIHJldHVybjtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoQ09NUE9ORU5UX1JFTU9WRSwgZW50aXR5LCBDb21wb25lbnQpO1xuXG4gICAgaWYgKGltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLl9lbnRpdHlSZW1vdmVDb21wb25lbnRTeW5jKGVudGl0eSwgQ29tcG9uZW50LCBpbmRleCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlbnRpdHkuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUubGVuZ3RoID09PSAwKVxuICAgICAgICB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZS5wdXNoKGVudGl0eSk7XG5cbiAgICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5wdXNoKENvbXBvbmVudCk7XG5cbiAgICAgIHZhciBjb21wb25lbnROYW1lID0gZ2V0TmFtZShDb21wb25lbnQpO1xuICAgICAgZW50aXR5Ll9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV0gPVxuICAgICAgICBlbnRpdHkuX2NvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgICBkZWxldGUgZW50aXR5Ll9jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGVhY2ggaW5kZXhlZCBxdWVyeSB0byBzZWUgaWYgd2UgbmVlZCB0byByZW1vdmUgaXRcbiAgICB0aGlzLl9xdWVyeU1hbmFnZXIub25FbnRpdHlDb21wb25lbnRSZW1vdmVkKGVudGl0eSwgQ29tcG9uZW50KTtcblxuICAgIGlmIChDb21wb25lbnQuX19wcm90b19fID09PSBTeXN0ZW1TdGF0ZUNvbXBvbmVudCkge1xuICAgICAgZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cy0tO1xuXG4gICAgICAvLyBDaGVjayBpZiB0aGUgZW50aXR5IHdhcyBhIGdob3N0IHdhaXRpbmcgZm9yIHRoZSBsYXN0IHN5c3RlbSBzdGF0ZSBjb21wb25lbnQgdG8gYmUgcmVtb3ZlZFxuICAgICAgaWYgKGVudGl0eS5udW1TdGF0ZUNvbXBvbmVudHMgPT09IDAgJiYgIWVudGl0eS5hbGl2ZSkge1xuICAgICAgICBlbnRpdHkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KSB7XG4gICAgLy8gUmVtb3ZlIFQgbGlzdGluZyBvbiBlbnRpdHkgYW5kIHByb3BlcnR5IHJlZiwgdGhlbiBmcmVlIHRoZSBjb21wb25lbnQuXG4gICAgZW50aXR5Ll9Db21wb25lbnRUeXBlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHZhciBjb21wb25lbnROYW1lID0gZ2V0TmFtZShDb21wb25lbnQpO1xuICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuX2NvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgZGVsZXRlIGVudGl0eS5fY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICBjb21wb25lbnQuZGlzcG9zZSgpO1xuICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkoQ29tcG9uZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYWxsIHRoZSBjb21wb25lbnRzIGZyb20gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IGZyb20gd2hpY2ggdGhlIGNvbXBvbmVudHMgd2lsbCBiZSByZW1vdmVkXG4gICAqL1xuICBlbnRpdHlSZW1vdmVBbGxDb21wb25lbnRzKGVudGl0eSwgaW1tZWRpYXRlbHkpIHtcbiAgICBsZXQgQ29tcG9uZW50cyA9IGVudGl0eS5fQ29tcG9uZW50VHlwZXM7XG5cbiAgICBmb3IgKGxldCBqID0gQ29tcG9uZW50cy5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgaWYgKENvbXBvbmVudHNbal0uX19wcm90b19fICE9PSBTeXN0ZW1TdGF0ZUNvbXBvbmVudClcbiAgICAgICAgdGhpcy5lbnRpdHlSZW1vdmVDb21wb25lbnQoZW50aXR5LCBDb21wb25lbnRzW2pdLCBpbW1lZGlhdGVseSk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZW50aXR5IGZyb20gdGhpcyBtYW5hZ2VyLiBJdCB3aWxsIGNsZWFyIGFsc28gaXRzIGNvbXBvbmVudHNcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgdG8gcmVtb3ZlIGZyb20gdGhlIG1hbmFnZXJcbiAgICogQHBhcmFtIHtCb29sfSBpbW1lZGlhdGVseSBJZiB5b3Ugd2FudCB0byByZW1vdmUgdGhlIGNvbXBvbmVudCBpbW1lZGlhdGVseSBpbnN0ZWFkIG9mIGRlZmVycmVkIChEZWZhdWx0IGlzIGZhbHNlKVxuICAgKi9cbiAgcmVtb3ZlRW50aXR5KGVudGl0eSwgaW1tZWRpYXRlbHkpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLl9lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XG5cbiAgICBpZiAoIX5pbmRleCkgdGhyb3cgbmV3IEVycm9yKFwiVHJpZWQgdG8gcmVtb3ZlIGVudGl0eSBub3QgaW4gbGlzdFwiKTtcblxuICAgIGVudGl0eS5hbGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKGVudGl0eS5udW1TdGF0ZUNvbXBvbmVudHMgPT09IDApIHtcbiAgICAgIC8vIFJlbW92ZSBmcm9tIGVudGl0eSBsaXN0XG4gICAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KEVOVElUWV9SRU1PVkVELCBlbnRpdHkpO1xuICAgICAgdGhpcy5fcXVlcnlNYW5hZ2VyLm9uRW50aXR5UmVtb3ZlZChlbnRpdHkpO1xuICAgICAgaWYgKGltbWVkaWF0ZWx5ID09PSB0cnVlKSB7XG4gICAgICAgIHRoaXMuX3JlbGVhc2VFbnRpdHkoZW50aXR5LCBpbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVudGl0aWVzVG9SZW1vdmUucHVzaChlbnRpdHkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZW50aXR5UmVtb3ZlQWxsQ29tcG9uZW50cyhlbnRpdHksIGltbWVkaWF0ZWx5KTtcbiAgfVxuXG4gIF9yZWxlYXNlRW50aXR5KGVudGl0eSwgaW5kZXgpIHtcbiAgICB0aGlzLl9lbnRpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgaWYgKHRoaXMuX2VudGl0aWVzQnlOYW1lc1tlbnRpdHkubmFtZV0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9lbnRpdGllc0J5TmFtZXNbZW50aXR5Lm5hbWVdO1xuICAgIH1cbiAgICBlbnRpdHkuX3Bvb2wucmVsZWFzZShlbnRpdHkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgZW50aXRpZXMgZnJvbSB0aGlzIG1hbmFnZXJcbiAgICovXG4gIHJlbW92ZUFsbEVudGl0aWVzKCkge1xuICAgIGZvciAodmFyIGkgPSB0aGlzLl9lbnRpdGllcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgdGhpcy5yZW1vdmVFbnRpdHkodGhpcy5fZW50aXRpZXNbaV0pO1xuICAgIH1cbiAgfVxuXG4gIHByb2Nlc3NEZWZlcnJlZFJlbW92YWwoKSB7XG4gICAgaWYgKCF0aGlzLmRlZmVycmVkUmVtb3ZhbEVuYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXNUb1JlbW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRoaXMuZW50aXRpZXNUb1JlbW92ZVtpXTtcbiAgICAgIGxldCBpbmRleCA9IHRoaXMuX2VudGl0aWVzLmluZGV4T2YoZW50aXR5KTtcbiAgICAgIHRoaXMuX3JlbGVhc2VFbnRpdHkoZW50aXR5LCBpbmRleCk7XG4gICAgfVxuICAgIHRoaXMuZW50aXRpZXNUb1JlbW92ZS5sZW5ndGggPSAwO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZS5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlW2ldO1xuICAgICAgd2hpbGUgKGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGxldCBDb21wb25lbnQgPSBlbnRpdHkuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUucG9wKCk7XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXROYW1lKENvbXBvbmVudCk7XG4gICAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuX2NvbXBvbmVudHNUb1JlbW92ZVtjb21wb25lbnROYW1lXTtcbiAgICAgICAgZGVsZXRlIGVudGl0eS5fY29tcG9uZW50c1RvUmVtb3ZlW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICBjb21wb25lbnQuZGlzcG9zZSgpO1xuICAgICAgICB0aGlzLndvcmxkLmNvbXBvbmVudHNNYW5hZ2VyLmNvbXBvbmVudFJlbW92ZWRGcm9tRW50aXR5KENvbXBvbmVudCk7XG5cbiAgICAgICAgLy90aGlzLl9lbnRpdHlSZW1vdmVDb21wb25lbnRTeW5jKGVudGl0eSwgQ29tcG9uZW50LCBpbmRleCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbnRpdGllc1dpdGhDb21wb25lbnRzVG9SZW1vdmUubGVuZ3RoID0gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBxdWVyeSBiYXNlZCBvbiBhIGxpc3Qgb2YgY29tcG9uZW50c1xuICAgKiBAcGFyYW0ge0FycmF5KENvbXBvbmVudCl9IENvbXBvbmVudHMgTGlzdCBvZiBjb21wb25lbnRzIHRoYXQgd2lsbCBmb3JtIHRoZSBxdWVyeVxuICAgKi9cbiAgcXVlcnlDb21wb25lbnRzKENvbXBvbmVudHMpIHtcbiAgICByZXR1cm4gdGhpcy5fcXVlcnlNYW5hZ2VyLmdldFF1ZXJ5KENvbXBvbmVudHMpO1xuICB9XG5cbiAgLy8gRVhUUkFTXG5cbiAgLyoqXG4gICAqIFJldHVybiBudW1iZXIgb2YgZW50aXRpZXNcbiAgICovXG4gIGNvdW50KCkge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdGllcy5sZW5ndGg7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHNvbWUgc3RhdHNcbiAgICovXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHtcbiAgICAgIG51bUVudGl0aWVzOiB0aGlzLl9lbnRpdGllcy5sZW5ndGgsXG4gICAgICBudW1RdWVyaWVzOiBPYmplY3Qua2V5cyh0aGlzLl9xdWVyeU1hbmFnZXIuX3F1ZXJpZXMpLmxlbmd0aCxcbiAgICAgIHF1ZXJpZXM6IHRoaXMuX3F1ZXJ5TWFuYWdlci5zdGF0cygpLFxuICAgICAgbnVtQ29tcG9uZW50UG9vbDogT2JqZWN0LmtleXModGhpcy5jb21wb25lbnRzTWFuYWdlci5fY29tcG9uZW50UG9vbClcbiAgICAgICAgLmxlbmd0aCxcbiAgICAgIGNvbXBvbmVudFBvb2w6IHt9LFxuICAgICAgZXZlbnREaXNwYXRjaGVyOiB0aGlzLmV2ZW50RGlzcGF0Y2hlci5zdGF0c1xuICAgIH07XG5cbiAgICBmb3IgKHZhciBjbmFtZSBpbiB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLl9jb21wb25lbnRQb29sKSB7XG4gICAgICB2YXIgcG9vbCA9IHRoaXMuY29tcG9uZW50c01hbmFnZXIuX2NvbXBvbmVudFBvb2xbY25hbWVdO1xuICAgICAgc3RhdHMuY29tcG9uZW50UG9vbFtjbmFtZV0gPSB7XG4gICAgICAgIHVzZWQ6IHBvb2wudG90YWxVc2VkKCksXG4gICAgICAgIHNpemU6IHBvb2wuY291bnRcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRzO1xuICB9XG59XG5cbmNvbnN0IEVOVElUWV9DUkVBVEVEID0gXCJFbnRpdHlNYW5hZ2VyI0VOVElUWV9DUkVBVEVcIjtcbmNvbnN0IEVOVElUWV9SRU1PVkVEID0gXCJFbnRpdHlNYW5hZ2VyI0VOVElUWV9SRU1PVkVEXCI7XG5jb25zdCBDT01QT05FTlRfQURERUQgPSBcIkVudGl0eU1hbmFnZXIjQ09NUE9ORU5UX0FEREVEXCI7XG5jb25zdCBDT01QT05FTlRfUkVNT1ZFID0gXCJFbnRpdHlNYW5hZ2VyI0NPTVBPTkVOVF9SRU1PVkVcIjtcblxuY2xhc3MgQ29tcG9uZW50TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuQ29tcG9uZW50cyA9IHt9O1xuICAgIHRoaXMuX2NvbXBvbmVudFBvb2wgPSB7fTtcbiAgICB0aGlzLm51bUNvbXBvbmVudHMgPSB7fTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tcG9uZW50KENvbXBvbmVudCwgb2JqZWN0UG9vbCkge1xuICAgIGlmICh0aGlzLkNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdKSB7XG4gICAgICBjb25zb2xlLndhcm4oYENvbXBvbmVudCB0eXBlOiAnJHtDb21wb25lbnQubmFtZX0nIGFscmVhZHkgcmVnaXN0ZXJlZC5gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzY2hlbWEgPSBDb21wb25lbnQuc2NoZW1hO1xuXG4gICAgaWYgKCFzY2hlbWEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQ29tcG9uZW50IFwiJHtDb21wb25lbnQubmFtZX1cIiBoYXMgbm8gc2NoZW1hIHByb3BlcnR5LmApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgcHJvcE5hbWUgaW4gc2NoZW1hKSB7XG4gICAgICBjb25zdCBwcm9wID0gc2NoZW1hW3Byb3BOYW1lXTtcblxuICAgICAgaWYgKCFwcm9wLnR5cGUpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBJbnZhbGlkIHNjaGVtYSBmb3IgY29tcG9uZW50IFwiJHtDb21wb25lbnQubmFtZX1cIi4gTWlzc2luZyB0eXBlIGZvciBcIiR7cHJvcE5hbWV9XCIgcHJvcGVydHkuYFxuICAgICAgICApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuQ29tcG9uZW50c1tDb21wb25lbnQubmFtZV0gPSBDb21wb25lbnQ7XG4gICAgdGhpcy5udW1Db21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSA9IDA7XG5cbiAgICBpZiAob2JqZWN0UG9vbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvYmplY3RQb29sID0gbmV3IE9iamVjdFBvb2woQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iamVjdFBvb2wgPT09IGZhbHNlKSB7XG4gICAgICBvYmplY3RQb29sID0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHRoaXMuX2NvbXBvbmVudFBvb2xbQ29tcG9uZW50Lm5hbWVdID0gb2JqZWN0UG9vbDtcbiAgfVxuXG4gIGNvbXBvbmVudEFkZGVkVG9FbnRpdHkoQ29tcG9uZW50KSB7XG4gICAgaWYgKCF0aGlzLkNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdKSB7XG4gICAgICB0aGlzLnJlZ2lzdGVyQ29tcG9uZW50KENvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5udW1Db21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSsrO1xuICB9XG5cbiAgY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkoQ29tcG9uZW50KSB7XG4gICAgdGhpcy5udW1Db21wb25lbnRzW0NvbXBvbmVudC5uYW1lXS0tO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50c1Bvb2woQ29tcG9uZW50KSB7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnRQcm9wZXJ0eU5hbWUoQ29tcG9uZW50KTtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50UG9vbFtjb21wb25lbnROYW1lXTtcbiAgfVxufVxuXG52YXIgbmFtZSA9IFwiZWNzeVwiO1xudmFyIHZlcnNpb24gPSBcIjAuMi42XCI7XG52YXIgZGVzY3JpcHRpb24gPSBcIkVudGl0eSBDb21wb25lbnQgU3lzdGVtIGluIEpTXCI7XG52YXIgbWFpbiA9IFwiYnVpbGQvZWNzeS5qc1wiO1xudmFyIG1vZHVsZSA9IFwiYnVpbGQvZWNzeS5tb2R1bGUuanNcIjtcbnZhciB0eXBlcyA9IFwic3JjL2luZGV4LmQudHNcIjtcbnZhciBzY3JpcHRzID0ge1xuXHRidWlsZDogXCJyb2xsdXAgLWMgJiYgbnBtIHJ1biBkb2NzXCIsXG5cdGRvY3M6IFwicm0gZG9jcy9hcGkvX3NpZGViYXIubWQ7IHR5cGVkb2MgLS1yZWFkbWUgbm9uZSAtLW1vZGUgZmlsZSAtLWV4Y2x1ZGVFeHRlcm5hbHMgLS1wbHVnaW4gdHlwZWRvYy1wbHVnaW4tbWFya2Rvd24gIC0tdGhlbWUgZG9jcy90aGVtZSAtLWhpZGVTb3VyY2VzIC0taGlkZUJyZWFkY3J1bWJzIC0tb3V0IGRvY3MvYXBpLyAtLWluY2x1ZGVEZWNsYXJhdGlvbnMgLS1pbmNsdWRlcyAnc3JjLyoqLyouZC50cycgc3JjOyB0b3VjaCBkb2NzL2FwaS9fc2lkZWJhci5tZFwiLFxuXHRcImRldjpkb2NzXCI6IFwibm9kZW1vbiAtZSB0cyAteCAnbnBtIHJ1biBkb2NzJyAtdyBzcmNcIixcblx0ZGV2OiBcImNvbmN1cnJlbnRseSAtLW5hbWVzICdST0xMVVAsRE9DUyxIVFRQJyAtYyAnYmdCbHVlLmJvbGQsYmdZZWxsb3cuYm9sZCxiZ0dyZWVuLmJvbGQnICdyb2xsdXAgLWMgLXcgLW0gaW5saW5lJyAnbnBtIHJ1biBkZXY6ZG9jcycgJ25wbSBydW4gZGV2OnNlcnZlcidcIixcblx0XCJkZXY6c2VydmVyXCI6IFwiaHR0cC1zZXJ2ZXIgLWMtMSAtcCA4MDgwIC0tY29yc1wiLFxuXHRsaW50OiBcImVzbGludCBzcmMgdGVzdCBleGFtcGxlc1wiLFxuXHRzdGFydDogXCJucG0gcnVuIGRldlwiLFxuXHRiZW5jaG1hcmtzOiBcIm5vZGUgLXIgZXNtIC0tZXhwb3NlLWdjIGJlbmNobWFya3MvaW5kZXguanNcIixcblx0dGVzdDogXCJhdmFcIixcblx0dHJhdmlzOiBcIm5wbSBydW4gbGludCAmJiBucG0gcnVuIHRlc3QgJiYgbnBtIHJ1biBidWlsZFwiLFxuXHRcIndhdGNoOnRlc3RcIjogXCJhdmEgLS13YXRjaFwiXG59O1xudmFyIHJlcG9zaXRvcnkgPSB7XG5cdHR5cGU6IFwiZ2l0XCIsXG5cdHVybDogXCJnaXQraHR0cHM6Ly9naXRodWIuY29tL2Zlcm5hbmRvanNnL2Vjc3kuZ2l0XCJcbn07XG52YXIga2V5d29yZHMgPSBbXG5cdFwiZWNzXCIsXG5cdFwiZW50aXR5IGNvbXBvbmVudCBzeXN0ZW1cIlxuXTtcbnZhciBhdXRob3IgPSBcIkZlcm5hbmRvIFNlcnJhbm8gPGZlcm5hbmRvanNnQGdtYWlsLmNvbT4gKGh0dHA6Ly9mZXJuYW5kb2pzZy5jb20pXCI7XG52YXIgbGljZW5zZSA9IFwiTUlUXCI7XG52YXIgYnVncyA9IHtcblx0dXJsOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9mZXJuYW5kb2pzZy9lY3N5L2lzc3Vlc1wiXG59O1xudmFyIGF2YSA9IHtcblx0ZmlsZXM6IFtcblx0XHRcInRlc3QvKiovKi50ZXN0LmpzXCJcblx0XSxcblx0c291cmNlczogW1xuXHRcdFwic3JjLyoqLyouanNcIlxuXHRdLFxuXHRyZXF1aXJlOiBbXG5cdFx0XCJiYWJlbC1yZWdpc3RlclwiLFxuXHRcdFwiZXNtXCJcblx0XVxufTtcbnZhciBqc3BtID0ge1xuXHRmaWxlczogW1xuXHRcdFwicGFja2FnZS5qc29uXCIsXG5cdFx0XCJMSUNFTlNFXCIsXG5cdFx0XCJSRUFETUUubWRcIixcblx0XHRcImJ1aWxkL2Vjc3kuanNcIixcblx0XHRcImJ1aWxkL2Vjc3kubWluLmpzXCIsXG5cdFx0XCJidWlsZC9lY3N5Lm1vZHVsZS5qc1wiXG5cdF0sXG5cdGRpcmVjdG9yaWVzOiB7XG5cdH1cbn07XG52YXIgaG9tZXBhZ2UgPSBcImh0dHBzOi8vZ2l0aHViLmNvbS9mZXJuYW5kb2pzZy9lY3N5I3JlYWRtZVwiO1xudmFyIGRldkRlcGVuZGVuY2llcyA9IHtcblx0YXZhOiBcIl4xLjQuMVwiLFxuXHRcImJhYmVsLWNsaVwiOiBcIl42LjI2LjBcIixcblx0XCJiYWJlbC1jb3JlXCI6IFwiXjYuMjYuM1wiLFxuXHRcImJhYmVsLWVzbGludFwiOiBcIl4xMC4wLjNcIixcblx0XCJiYWJlbC1sb2FkZXJcIjogXCJeOC4wLjZcIixcblx0XCJiZW5jaG1hcmtlci1qc1wiOiBcIjAuMC4zXCIsXG5cdGNvbmN1cnJlbnRseTogXCJeNC4xLjJcIixcblx0XCJkb2NzaWZ5LWNsaVwiOiBcIl40LjQuMFwiLFxuXHRlc2xpbnQ6IFwiXjUuMTYuMFwiLFxuXHRcImVzbGludC1jb25maWctcHJldHRpZXJcIjogXCJeNC4zLjBcIixcblx0XCJlc2xpbnQtcGx1Z2luLXByZXR0aWVyXCI6IFwiXjMuMS4yXCIsXG5cdFwiaHR0cC1zZXJ2ZXJcIjogXCJeMC4xMS4xXCIsXG5cdG5vZGVtb246IFwiXjEuMTkuNFwiLFxuXHRwcmV0dGllcjogXCJeMS4xOS4xXCIsXG5cdHJvbGx1cDogXCJeMS4yOS4wXCIsXG5cdFwicm9sbHVwLXBsdWdpbi1qc29uXCI6IFwiXjQuMC4wXCIsXG5cdFwicm9sbHVwLXBsdWdpbi10ZXJzZXJcIjogXCJeNS4yLjBcIixcblx0dHlwZWRvYzogXCJeMC4xNS44XCIsXG5cdFwidHlwZWRvYy1wbHVnaW4tbWFya2Rvd25cIjogXCJeMi4yLjE2XCIsXG5cdHR5cGVzY3JpcHQ6IFwiXjMuNy41XCJcbn07XG52YXIgcGpzb24gPSB7XG5cdG5hbWU6IG5hbWUsXG5cdHZlcnNpb246IHZlcnNpb24sXG5cdGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbixcblx0bWFpbjogbWFpbixcblx0XCJqc25leHQ6bWFpblwiOiBcImJ1aWxkL2Vjc3kubW9kdWxlLmpzXCIsXG5cdG1vZHVsZTogbW9kdWxlLFxuXHR0eXBlczogdHlwZXMsXG5cdHNjcmlwdHM6IHNjcmlwdHMsXG5cdHJlcG9zaXRvcnk6IHJlcG9zaXRvcnksXG5cdGtleXdvcmRzOiBrZXl3b3Jkcyxcblx0YXV0aG9yOiBhdXRob3IsXG5cdGxpY2Vuc2U6IGxpY2Vuc2UsXG5cdGJ1Z3M6IGJ1Z3MsXG5cdGF2YTogYXZhLFxuXHRqc3BtOiBqc3BtLFxuXHRob21lcGFnZTogaG9tZXBhZ2UsXG5cdGRldkRlcGVuZGVuY2llczogZGV2RGVwZW5kZW5jaWVzXG59O1xuXG5jb25zdCBWZXJzaW9uID0gcGpzb24udmVyc2lvbjtcblxuY2xhc3MgRW50aXR5IHtcbiAgY29uc3RydWN0b3IoZW50aXR5TWFuYWdlcikge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIgPSBlbnRpdHlNYW5hZ2VyIHx8IG51bGw7XG5cbiAgICAvLyBVbmlxdWUgSUQgZm9yIHRoaXMgZW50aXR5XG4gICAgdGhpcy5pZCA9IGVudGl0eU1hbmFnZXIuX25leHRFbnRpdHlJZCsrO1xuXG4gICAgLy8gTGlzdCBvZiBjb21wb25lbnRzIHR5cGVzIHRoZSBlbnRpdHkgaGFzXG4gICAgdGhpcy5fQ29tcG9uZW50VHlwZXMgPSBbXTtcblxuICAgIC8vIEluc3RhbmNlIG9mIHRoZSBjb21wb25lbnRzXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlID0ge307XG5cbiAgICAvLyBRdWVyaWVzIHdoZXJlIHRoZSBlbnRpdHkgaXMgYWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMgPSBbXTtcblxuICAgIC8vIFVzZWQgZm9yIGRlZmVycmVkIHJlbW92YWxcbiAgICB0aGlzLl9Db21wb25lbnRUeXBlc1RvUmVtb3ZlID0gW107XG5cbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG5cbiAgICAvL2lmIHRoZXJlIGFyZSBzdGF0ZSBjb21wb25lbnRzIG9uIGEgZW50aXR5LCBpdCBjYW4ndCBiZSByZW1vdmVkIGNvbXBsZXRlbHlcbiAgICB0aGlzLm51bVN0YXRlQ29tcG9uZW50cyA9IDA7XG4gIH1cblxuICAvLyBDT01QT05FTlRTXG5cbiAgZ2V0Q29tcG9uZW50KENvbXBvbmVudCwgaW5jbHVkZVJlbW92ZWQpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tDb21wb25lbnQubmFtZV07XG5cbiAgICBpZiAoIWNvbXBvbmVudCAmJiBpbmNsdWRlUmVtb3ZlZCA9PT0gdHJ1ZSkge1xuICAgICAgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5uYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gIGNvbXBvbmVudDtcbiAgfVxuXG4gIGdldFJlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZVtDb21wb25lbnQubmFtZV07XG4gIH1cblxuICBnZXRDb21wb25lbnRzKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50c1RvUmVtb3ZlKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmU7XG4gIH1cblxuICBnZXRDb21wb25lbnRUeXBlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fQ29tcG9uZW50VHlwZXM7XG4gIH1cblxuICBnZXRNdXRhYmxlQ29tcG9uZW50KENvbXBvbmVudCkge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW0NvbXBvbmVudC5uYW1lXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgLy8gQHRvZG8gYWNjZWxlcmF0ZSB0aGlzIGNoZWNrLiBNYXliZSBoYXZpbmcgcXVlcnkuX0NvbXBvbmVudHMgYXMgYW4gb2JqZWN0XG4gICAgICAvLyBAdG9kbyBhZGQgTm90IGNvbXBvbmVudHNcbiAgICAgIGlmIChxdWVyeS5yZWFjdGl2ZSAmJiBxdWVyeS5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAhPT0gLTEpIHtcbiAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgY29tcG9uZW50XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnQ7XG4gIH1cblxuICBhZGRDb21wb25lbnQoQ29tcG9uZW50LCB2YWx1ZXMpIHtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLmVudGl0eUFkZENvbXBvbmVudCh0aGlzLCBDb21wb25lbnQsIHZhbHVlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW1vdmVDb21wb25lbnQoQ29tcG9uZW50LCBmb3JjZUltbWVkaWF0ZSkge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5UmVtb3ZlQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudCwgZm9yY2VJbW1lZGlhdGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaGFzQ29tcG9uZW50KENvbXBvbmVudCwgaW5jbHVkZVJlbW92ZWQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgISF+dGhpcy5fQ29tcG9uZW50VHlwZXMuaW5kZXhPZihDb21wb25lbnQpIHx8XG4gICAgICAoaW5jbHVkZVJlbW92ZWQgPT09IHRydWUgJiYgdGhpcy5oYXNSZW1vdmVkQ29tcG9uZW50KENvbXBvbmVudCkpXG4gICAgKTtcbiAgfVxuXG4gIGhhc1JlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUuaW5kZXhPZihDb21wb25lbnQpO1xuICB9XG5cbiAgaGFzQWxsQ29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzQ29tcG9uZW50KENvbXBvbmVudHNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaGFzQW55Q29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5oYXNDb21wb25lbnQoQ29tcG9uZW50c1tpXSkpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZW1vdmVBbGxDb21wb25lbnRzKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5UmVtb3ZlQWxsQ29tcG9uZW50cyh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cblxuICBjb3B5KHNyYykge1xuICAgIC8vIFRPRE86IFRoaXMgY2FuIGRlZmluaXRlbHkgYmUgb3B0aW1pemVkXG4gICAgZm9yICh2YXIgY29tcG9uZW50TmFtZSBpbiBzcmMuX2NvbXBvbmVudHMpIHtcbiAgICAgIHZhciBzcmNDb21wb25lbnQgPSBzcmMuX2NvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgICB0aGlzLmFkZENvbXBvbmVudChzcmNDb21wb25lbnQuY29uc3RydWN0b3IpO1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KHNyY0NvbXBvbmVudC5jb25zdHJ1Y3Rvcik7XG4gICAgICBjb21wb25lbnQuY29weShzcmNDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnRpdHkodGhpcy5fZW50aXR5TWFuYWdlcikuY29weSh0aGlzKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuaWQgPSB0aGlzLl9lbnRpdHlNYW5hZ2VyLl9uZXh0RW50aXR5SWQrKztcbiAgICB0aGlzLl9Db21wb25lbnRUeXBlcy5sZW5ndGggPSAwO1xuICAgIHRoaXMucXVlcmllcy5sZW5ndGggPSAwO1xuXG4gICAgZm9yICh2YXIgY29tcG9uZW50TmFtZSBpbiB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShmb3JjZUltbWVkaWF0ZSkge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eSh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cbn1cblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBlbnRpdHlQb29sU2l6ZTogMCxcbiAgZW50aXR5Q2xhc3M6IEVudGl0eVxufTtcblxuY2xhc3MgV29ybGQge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLm9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5jb21wb25lbnRzTWFuYWdlciA9IG5ldyBDb21wb25lbnRNYW5hZ2VyKHRoaXMpO1xuICAgIHRoaXMuZW50aXR5TWFuYWdlciA9IG5ldyBFbnRpdHlNYW5hZ2VyKHRoaXMpO1xuICAgIHRoaXMuc3lzdGVtTWFuYWdlciA9IG5ldyBTeXN0ZW1NYW5hZ2VyKHRoaXMpO1xuXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIHRoaXMuZXZlbnRRdWV1ZXMgPSB7fTtcblxuICAgIGlmIChoYXNXaW5kb3cgJiYgdHlwZW9mIEN1c3RvbUV2ZW50ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJlY3N5LXdvcmxkLWNyZWF0ZWRcIiwge1xuICAgICAgICBkZXRhaWw6IHsgd29ybGQ6IHRoaXMsIHZlcnNpb246IFZlcnNpb24gfVxuICAgICAgfSk7XG4gICAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gICAgfVxuXG4gICAgdGhpcy5sYXN0VGltZSA9IG5vdygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50LCBvYmplY3RQb29sKSB7XG4gICAgdGhpcy5jb21wb25lbnRzTWFuYWdlci5yZWdpc3RlckNvbXBvbmVudChDb21wb25lbnQsIG9iamVjdFBvb2wpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVnaXN0ZXJTeXN0ZW0oU3lzdGVtLCBhdHRyaWJ1dGVzKSB7XG4gICAgdGhpcy5zeXN0ZW1NYW5hZ2VyLnJlZ2lzdGVyU3lzdGVtKFN5c3RlbSwgYXR0cmlidXRlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bnJlZ2lzdGVyU3lzdGVtKFN5c3RlbSkge1xuICAgIHRoaXMuc3lzdGVtTWFuYWdlci51bnJlZ2lzdGVyU3lzdGVtKFN5c3RlbSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBnZXRTeXN0ZW0oU3lzdGVtQ2xhc3MpIHtcbiAgICByZXR1cm4gdGhpcy5zeXN0ZW1NYW5hZ2VyLmdldFN5c3RlbShTeXN0ZW1DbGFzcyk7XG4gIH1cblxuICBnZXRTeXN0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLnN5c3RlbU1hbmFnZXIuZ2V0U3lzdGVtcygpO1xuICB9XG5cbiAgZXhlY3V0ZShkZWx0YSwgdGltZSkge1xuICAgIGlmICghZGVsdGEpIHtcbiAgICAgIHRpbWUgPSBub3coKTtcbiAgICAgIGRlbHRhID0gdGltZSAtIHRoaXMubGFzdFRpbWU7XG4gICAgICB0aGlzLmxhc3RUaW1lID0gdGltZTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5lbmFibGVkKSB7XG4gICAgICB0aGlzLnN5c3RlbU1hbmFnZXIuZXhlY3V0ZShkZWx0YSwgdGltZSk7XG4gICAgICB0aGlzLmVudGl0eU1hbmFnZXIucHJvY2Vzc0RlZmVycmVkUmVtb3ZhbCgpO1xuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICBjcmVhdGVFbnRpdHkobmFtZSkge1xuICAgIHJldHVybiB0aGlzLmVudGl0eU1hbmFnZXIuY3JlYXRlRW50aXR5KG5hbWUpO1xuICB9XG5cbiAgc3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0ge1xuICAgICAgZW50aXRpZXM6IHRoaXMuZW50aXR5TWFuYWdlci5zdGF0cygpLFxuICAgICAgc3lzdGVtOiB0aGlzLnN5c3RlbU1hbmFnZXIuc3RhdHMoKVxuICAgIH07XG5cbiAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShzdGF0cywgbnVsbCwgMikpO1xuICB9XG59XG5cbmNsYXNzIFRhZ0NvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKGZhbHNlKTtcbiAgfVxufVxuXG5UYWdDb21wb25lbnQuaXNUYWdDb21wb25lbnQgPSB0cnVlO1xuXG5jb25zdCBjb3B5VmFsdWUgPSAoc3JjLCBkZXN0LCBrZXkpID0+IChkZXN0W2tleV0gPSBzcmNba2V5XSk7XG5cbmNvbnN0IGNsb25lVmFsdWUgPSBzcmMgPT4gc3JjO1xuXG5jb25zdCBjb3B5QXJyYXkgPSAoc3JjLCBkZXN0LCBrZXkpID0+IHtcbiAgY29uc3Qgc3JjQXJyYXkgPSBzcmNba2V5XTtcbiAgY29uc3QgZGVzdEFycmF5ID0gZGVzdFtrZXldO1xuXG4gIGRlc3RBcnJheS5sZW5ndGggPSAwO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3JjQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICBkZXN0QXJyYXkucHVzaChzcmNBcnJheVtpXSk7XG4gIH1cblxuICByZXR1cm4gZGVzdEFycmF5O1xufTtcblxuY29uc3QgY2xvbmVBcnJheSA9IHNyYyA9PiBzcmMuc2xpY2UoKTtcblxuY29uc3QgY29weUpTT04gPSAoc3JjLCBkZXN0LCBrZXkpID0+XG4gIChkZXN0W2tleV0gPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNyY1trZXldKSkpO1xuXG5jb25zdCBjbG9uZUpTT04gPSBzcmMgPT4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzcmMpKTtcblxuY29uc3QgY29weUNvcHlhYmxlID0gKHNyYywgZGVzdCwga2V5KSA9PiBkZXN0W2tleV0uY29weShzcmNba2V5XSk7XG5cbmNvbnN0IGNsb25lQ2xvbmFibGUgPSBzcmMgPT4gc3JjLmNsb25lKCk7XG5cbmZ1bmN0aW9uIGNyZWF0ZVR5cGUodHlwZURlZmluaXRpb24pIHtcbiAgdmFyIG1hbmRhdG9yeVByb3BlcnRpZXMgPSBbXCJuYW1lXCIsIFwiZGVmYXVsdFwiLCBcImNvcHlcIiwgXCJjbG9uZVwiXTtcblxuICB2YXIgdW5kZWZpbmVkUHJvcGVydGllcyA9IG1hbmRhdG9yeVByb3BlcnRpZXMuZmlsdGVyKHAgPT4ge1xuICAgIHJldHVybiAhdHlwZURlZmluaXRpb24uaGFzT3duUHJvcGVydHkocCk7XG4gIH0pO1xuXG4gIGlmICh1bmRlZmluZWRQcm9wZXJ0aWVzLmxlbmd0aCA+IDApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBgY3JlYXRlVHlwZSBleHBlY3RzIGEgdHlwZSBkZWZpbml0aW9uIHdpdGggdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOiAke3VuZGVmaW5lZFByb3BlcnRpZXMuam9pbihcbiAgICAgICAgXCIsIFwiXG4gICAgICApfWBcbiAgICApO1xuICB9XG5cbiAgdHlwZURlZmluaXRpb24uaXNUeXBlID0gdHJ1ZTtcblxuICByZXR1cm4gdHlwZURlZmluaXRpb247XG59XG5cbi8qKlxuICogU3RhbmRhcmQgdHlwZXNcbiAqL1xuY29uc3QgVHlwZXMgPSB7XG4gIE51bWJlcjogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJOdW1iZXJcIixcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvcHk6IGNvcHlWYWx1ZSxcbiAgICBjbG9uZTogY2xvbmVWYWx1ZVxuICB9KSxcblxuICBCb29sZWFuOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIkJvb2xlYW5cIixcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb3B5OiBjb3B5VmFsdWUsXG4gICAgY2xvbmU6IGNsb25lVmFsdWVcbiAgfSksXG5cbiAgU3RyaW5nOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIlN0cmluZ1wiLFxuICAgIGRlZmF1bHQ6IFwiXCIsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlXG4gIH0pLFxuXG4gIEFycmF5OiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIkFycmF5XCIsXG4gICAgZGVmYXVsdDogW10sXG4gICAgY29weTogY29weUFycmF5LFxuICAgIGNsb25lOiBjbG9uZUFycmF5XG4gIH0pLFxuXG4gIE9iamVjdDogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJPYmplY3RcIixcbiAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlXG4gIH0pLFxuXG4gIEpTT046IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiSlNPTlwiLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29weTogY29weUpTT04sXG4gICAgY2xvbmU6IGNsb25lSlNPTlxuICB9KVxufTtcblxuZnVuY3Rpb24gZ2VuZXJhdGVJZChsZW5ndGgpIHtcbiAgdmFyIHJlc3VsdCA9IFwiXCI7XG4gIHZhciBjaGFyYWN0ZXJzID0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWjAxMjM0NTY3ODlcIjtcbiAgdmFyIGNoYXJhY3RlcnNMZW5ndGggPSBjaGFyYWN0ZXJzLmxlbmd0aDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHJlc3VsdCArPSBjaGFyYWN0ZXJzLmNoYXJBdChNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjaGFyYWN0ZXJzTGVuZ3RoKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gaW5qZWN0U2NyaXB0KHNyYywgb25Mb2FkKSB7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAvLyBAdG9kbyBVc2UgbGluayB0byB0aGUgZWNzeS1kZXZ0b29scyByZXBvP1xuICBzY3JpcHQuc3JjID0gc3JjO1xuICBzY3JpcHQub25sb2FkID0gb25Mb2FkO1xuICAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG5cbi8qIGdsb2JhbCBQZWVyICovXG5cbmZ1bmN0aW9uIGhvb2tDb25zb2xlQW5kRXJyb3JzKGNvbm5lY3Rpb24pIHtcbiAgdmFyIHdyYXBGdW5jdGlvbnMgPSBbXCJlcnJvclwiLCBcIndhcm5pbmdcIiwgXCJsb2dcIl07XG4gIHdyYXBGdW5jdGlvbnMuZm9yRWFjaChrZXkgPT4ge1xuICAgIGlmICh0eXBlb2YgY29uc29sZVtrZXldID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciBmbiA9IGNvbnNvbGVba2V5XS5iaW5kKGNvbnNvbGUpO1xuICAgICAgY29uc29sZVtrZXldID0gKC4uLmFyZ3MpID0+IHtcbiAgICAgICAgY29ubmVjdGlvbi5zZW5kKHtcbiAgICAgICAgICBtZXRob2Q6IFwiY29uc29sZVwiLFxuICAgICAgICAgIHR5cGU6IGtleSxcbiAgICAgICAgICBhcmdzOiBKU09OLnN0cmluZ2lmeShhcmdzKVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGZuLmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgZXJyb3IgPT4ge1xuICAgIGNvbm5lY3Rpb24uc2VuZCh7XG4gICAgICBtZXRob2Q6IFwiZXJyb3JcIixcbiAgICAgIGVycm9yOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgIG1lc3NhZ2U6IGVycm9yLmVycm9yLm1lc3NhZ2UsXG4gICAgICAgIHN0YWNrOiBlcnJvci5lcnJvci5zdGFja1xuICAgICAgfSlcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluY2x1ZGVSZW1vdGVJZEhUTUwocmVtb3RlSWQpIHtcbiAgbGV0IGluZm9EaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICBpbmZvRGl2LnN0eWxlLmNzc1RleHQgPSBgXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xuICAgIGNvbG9yOiAjYWFhO1xuICAgIGRpc3BsYXk6ZmxleDtcbiAgICBmb250LWZhbWlseTogQXJpYWw7XG4gICAgZm9udC1zaXplOiAxLjFlbTtcbiAgICBoZWlnaHQ6IDQwcHg7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gICAgbGVmdDogMDtcbiAgICBvcGFjaXR5OiAwLjk7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAwO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB0b3A6IDA7XG4gIGA7XG5cbiAgaW5mb0Rpdi5pbm5lckhUTUwgPSBgT3BlbiBFQ1NZIGRldnRvb2xzIHRvIGNvbm5lY3QgdG8gdGhpcyBwYWdlIHVzaW5nIHRoZSBjb2RlOiZuYnNwOzxiIHN0eWxlPVwiY29sb3I6ICNmZmZcIj4ke3JlbW90ZUlkfTwvYj4mbmJzcDs8YnV0dG9uIG9uQ2xpY2s9XCJnZW5lcmF0ZU5ld0NvZGUoKVwiPkdlbmVyYXRlIG5ldyBjb2RlPC9idXR0b24+YDtcbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbmZvRGl2KTtcblxuICByZXR1cm4gaW5mb0Rpdjtcbn1cblxuZnVuY3Rpb24gZW5hYmxlUmVtb3RlRGV2dG9vbHMocmVtb3RlSWQpIHtcbiAgaWYgKCFoYXNXaW5kb3cpIHtcbiAgICBjb25zb2xlLndhcm4oXCJSZW1vdGUgZGV2dG9vbHMgbm90IGF2YWlsYWJsZSBvdXRzaWRlIHRoZSBicm93c2VyXCIpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdpbmRvdy5nZW5lcmF0ZU5ld0NvZGUgPSAoKSA9PiB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICAgIHJlbW90ZUlkID0gZ2VuZXJhdGVJZCg2KTtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJlY3N5UmVtb3RlSWRcIiwgcmVtb3RlSWQpO1xuICAgIHdpbmRvdy5sb2NhdGlvbi5yZWxvYWQoZmFsc2UpO1xuICB9O1xuXG4gIHJlbW90ZUlkID0gcmVtb3RlSWQgfHwgd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKFwiZWNzeVJlbW90ZUlkXCIpO1xuICBpZiAoIXJlbW90ZUlkKSB7XG4gICAgcmVtb3RlSWQgPSBnZW5lcmF0ZUlkKDYpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImVjc3lSZW1vdGVJZFwiLCByZW1vdGVJZCk7XG4gIH1cblxuICBsZXQgaW5mb0RpdiA9IGluY2x1ZGVSZW1vdGVJZEhUTUwocmVtb3RlSWQpO1xuXG4gIHdpbmRvdy5fX0VDU1lfUkVNT1RFX0RFVlRPT0xTX0lOSkVDVEVEID0gdHJ1ZTtcbiAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFMgPSB7fTtcblxuICBsZXQgVmVyc2lvbiA9IFwiXCI7XG5cbiAgLy8gVGhpcyBpcyB1c2VkIHRvIGNvbGxlY3QgdGhlIHdvcmxkcyBjcmVhdGVkIGJlZm9yZSB0aGUgY29tbXVuaWNhdGlvbiBpcyBiZWluZyBlc3RhYmxpc2hlZFxuICBsZXQgd29ybGRzQmVmb3JlTG9hZGluZyA9IFtdO1xuICBsZXQgb25Xb3JsZENyZWF0ZWQgPSBlID0+IHtcbiAgICB2YXIgd29ybGQgPSBlLmRldGFpbC53b3JsZDtcbiAgICBWZXJzaW9uID0gZS5kZXRhaWwudmVyc2lvbjtcbiAgICB3b3JsZHNCZWZvcmVMb2FkaW5nLnB1c2god29ybGQpO1xuICB9O1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImVjc3ktd29ybGQtY3JlYXRlZFwiLCBvbldvcmxkQ3JlYXRlZCk7XG5cbiAgbGV0IG9uTG9hZGVkID0gKCkgPT4ge1xuICAgIHZhciBwZWVyID0gbmV3IFBlZXIocmVtb3RlSWQpO1xuICAgIHBlZXIub24oXCJvcGVuXCIsICgvKiBpZCAqLykgPT4ge1xuICAgICAgcGVlci5vbihcImNvbm5lY3Rpb25cIiwgY29ubmVjdGlvbiA9PiB7XG4gICAgICAgIHdpbmRvdy5fX0VDU1lfUkVNT1RFX0RFVlRPT0xTLmNvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgICBjb25uZWN0aW9uLm9uKFwib3BlblwiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyBpbmZvRGl2LnN0eWxlLnZpc2liaWxpdHkgPSBcImhpZGRlblwiO1xuICAgICAgICAgIGluZm9EaXYuaW5uZXJIVE1MID0gXCJDb25uZWN0ZWRcIjtcblxuICAgICAgICAgIC8vIFJlY2VpdmUgbWVzc2FnZXNcbiAgICAgICAgICBjb25uZWN0aW9uLm9uKFwiZGF0YVwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICBpZiAoZGF0YS50eXBlID09PSBcImluaXRcIikge1xuICAgICAgICAgICAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgc2NyaXB0LnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJ0ZXh0L2phdmFzY3JpcHRcIik7XG4gICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcblxuICAgICAgICAgICAgICAgIC8vIE9uY2UgdGhlIHNjcmlwdCBpcyBpbmplY3RlZCB3ZSBkb24ndCBuZWVkIHRvIGxpc3RlblxuICAgICAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgXCJlY3N5LXdvcmxkLWNyZWF0ZWRcIixcbiAgICAgICAgICAgICAgICAgIG9uV29ybGRDcmVhdGVkXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB3b3JsZHNCZWZvcmVMb2FkaW5nLmZvckVhY2god29ybGQgPT4ge1xuICAgICAgICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZWNzeS13b3JsZC1jcmVhdGVkXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgZGV0YWlsOiB7IHdvcmxkOiB3b3JsZCwgdmVyc2lvbjogVmVyc2lvbiB9XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgc2NyaXB0LmlubmVySFRNTCA9IGRhdGEuc2NyaXB0O1xuICAgICAgICAgICAgICAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgICAgICAgICAgIHNjcmlwdC5vbmxvYWQoKTtcblxuICAgICAgICAgICAgICBob29rQ29uc29sZUFuZEVycm9ycyhjb25uZWN0aW9uKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS50eXBlID09PSBcImV4ZWN1dGVTY3JpcHRcIikge1xuICAgICAgICAgICAgICBsZXQgdmFsdWUgPSBldmFsKGRhdGEuc2NyaXB0KTtcbiAgICAgICAgICAgICAgaWYgKGRhdGEucmV0dXJuRXZhbCkge1xuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24uc2VuZCh7XG4gICAgICAgICAgICAgICAgICBtZXRob2Q6IFwiZXZhbFJldHVyblwiLFxuICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBJbmplY3QgUGVlckpTIHNjcmlwdFxuICBpbmplY3RTY3JpcHQoXG4gICAgXCJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL3BlZXJqc0AwLjMuMjAvZGlzdC9wZWVyLm1pbi5qc1wiLFxuICAgIG9uTG9hZGVkXG4gICk7XG59XG5cbmlmIChoYXNXaW5kb3cpIHtcbiAgY29uc3QgdXJsUGFyYW1zID0gbmV3IFVSTFNlYXJjaFBhcmFtcyh3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcblxuICAvLyBAdG9kbyBQcm92aWRlIGEgd2F5IHRvIGRpc2FibGUgaXQgaWYgbmVlZGVkXG4gIGlmICh1cmxQYXJhbXMuaGFzKFwiZW5hYmxlLXJlbW90ZS1kZXZ0b29sc1wiKSkge1xuICAgIGVuYWJsZVJlbW90ZURldnRvb2xzKCk7XG4gIH1cbn1cblxuZXhwb3J0IHsgQ29tcG9uZW50LCBOb3QsIE9iamVjdFBvb2wsIFN5c3RlbSwgU3lzdGVtU3RhdGVDb21wb25lbnQsIFRhZ0NvbXBvbmVudCwgVHlwZXMsIFZlcnNpb24sIFdvcmxkLCBFbnRpdHkgYXMgX0VudGl0eSwgY2xvbmVBcnJheSwgY2xvbmVDbG9uYWJsZSwgY2xvbmVKU09OLCBjbG9uZVZhbHVlLCBjb3B5QXJyYXksIGNvcHlDb3B5YWJsZSwgY29weUpTT04sIGNvcHlWYWx1ZSwgY3JlYXRlVHlwZSwgZW5hYmxlUmVtb3RlRGV2dG9vbHMgfTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgQWN0aXZlIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgQW5pbWF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gICAgdGhpcy5kdXJhdGlvbiA9IC0xO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5hbmltYXRpb25zLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5kdXJhdGlvbiA9IC0xO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5DYW1lcmEuc2NoZW1hID0ge1xuICBmb3Y6IHsgZGVmYXVsdDogNDUsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBhc3BlY3Q6IHsgZGVmYXVsdDogMSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIG5lYXI6IHsgZGVmYXVsdDogMC4xLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZmFyOiB7IGRlZmF1bHQ6IDEwMDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsYXllcnM6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGhhbmRsZVJlc2l6ZTogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH1cbn07XG4iLCJleHBvcnQgY2xhc3MgQ2FtZXJhUmlnIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5sZWZ0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5yaWdodEhhbmQgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENvbGxpZGluZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aCA9IFtdO1xuICAgIHRoaXMuY29sbGlkaW5nRnJhbWUgPSAwO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aC5sZW5ndGggPSAwO1xuICAgIHRoaXMuY29sbGlkaW5nRnJhbWUgPSAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ29sbGlzaW9uU3RhcnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbGxpZGluZ1dpdGggPSBbXTtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvbGxpZGluZ1dpdGgubGVuZ3RoID0gMDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENvbGxpc2lvblN0b3Age1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbGxpZGluZ1dpdGggPSBbXTtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvbGxpZGluZ1dpdGgubGVuZ3RoID0gMDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIERyYWdnYWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBEcmFnZ2luZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiZXhwb3J0IGNsYXNzIEVudmlyb25tZW50IHtcbiAgcmVzZXQoKSB7fVxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMucHJlc2V0ID0gXCJkZWZhdWx0XCI7XG4gICAgdGhpcy5zZWVkID0gMTtcbiAgICB0aGlzLnNreVR5cGUgPSBcImF0bW9zcGhlcmVcIjtcbiAgICB0aGlzLnNreUNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmhvcml6b25Db2xvciA9IFwiXCI7XG4gICAgdGhpcy5saWdodGluZyA9IFwiZGlzdGFudFwiO1xuICAgIHRoaXMuc2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5zaGFkb3dTaXplID0gMTA7XG4gICAgdGhpcy5saWdodFBvc2l0aW9uID0geyB4OiAwLCB5OiAxLCB6OiAtMC4yIH07XG4gICAgdGhpcy5mb2cgPSAwO1xuXG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucGxheUFyZWEgPSAxO1xuXG4gICAgdGhpcy5ncm91bmQgPSBcImZsYXRcIjtcbiAgICB0aGlzLmdyb3VuZFlTY2FsZSA9IDM7XG4gICAgdGhpcy5ncm91bmRUZXh0dXJlID0gXCJub25lXCI7XG4gICAgdGhpcy5ncm91bmRDb2xvciA9IFwiIzU1M2UzNVwiO1xuICAgIHRoaXMuZ3JvdW5kQ29sb3IyID0gXCIjNjk0NDM5XCI7XG5cbiAgICB0aGlzLmRyZXNzaW5nID0gXCJub25lXCI7XG4gICAgdGhpcy5kcmVzc2luZ0Ftb3VudCA9IDEwO1xuICAgIHRoaXMuZHJlc3NpbmdDb2xvciA9IFwiIzc5NTQ0OVwiO1xuICAgIHRoaXMuZHJlc3NpbmdTY2FsZSA9IDU7XG4gICAgdGhpcy5kcmVzc2luZ1ZhcmlhbmNlID0geyB4OiAxLCB5OiAxLCB6OiAxIH07XG4gICAgdGhpcy5kcmVzc2luZ1VuaWZvcm1TY2FsZSA9IHRydWU7XG4gICAgdGhpcy5kcmVzc2luZ09uUGxheUFyZWEgPSAwO1xuXG4gICAgdGhpcy5ncmlkID0gXCJub25lXCI7XG4gICAgdGhpcy5ncmlkQ29sb3IgPSBcIiNjY2NcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdlb21ldHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXIgZXh0ZW5kcyBDb21wb25lbnQge31cblxuR0xURkxvYWRlci5zY2hlbWEgPSB7XG4gIHVybDogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgcmVjZWl2ZVNoYWRvdzogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBjYXN0U2hhZG93OiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGVudk1hcE92ZXJyaWRlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBhcHBlbmQ6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBvbkxvYWRlZDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgcGFyZW50OiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBHTFRGTW9kZWwgZXh0ZW5kcyBDb21wb25lbnQge31cblxuR0xURk1vZGVsLnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIElucHV0U3RhdGUgZXh0ZW5kcyBDb21wb25lbnQge31cblxuSW5wdXRTdGF0ZS5zY2hlbWEgPSB7XG4gIHZyY29udHJvbGxlcnM6IHsgZGVmYXVsdDogbmV3IE1hcCgpLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAga2V5Ym9hcmQ6IHsgZGVmYXVsdDoge30sIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBtb3VzZTogeyBkZWZhdWx0OiB7fSwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGdhbWVwYWRzOiB7IGRlZmF1bHQ6IHt9LCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY29uc3QgU0lERVMgPSB7XG4gIGZyb250OiAwLFxuICBiYWNrOiAxLFxuICBkb3VibGU6IDJcbn07XG5cbmV4cG9ydCBjb25zdCBTSEFERVJTID0ge1xuICBzdGFuZGFyZDogMCxcbiAgZmxhdDogMVxufTtcblxuZXhwb3J0IGNvbnN0IEJMRU5ESU5HID0ge1xuICBub3JtYWw6IDAsXG4gIGFkZGl0aXZlOiAxLFxuICBzdWJ0cmFjdGl2ZTogMixcbiAgbXVsdGlwbHk6IDNcbn07XG5cbmV4cG9ydCBjb25zdCBWRVJURVhfQ09MT1JTID0ge1xuICBub25lOiAwLFxuICBmYWNlOiAxLFxuICB2ZXJ0ZXg6IDJcbn07XG5cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sb3IgPSAweGZmMDAwMDtcbiAgICB0aGlzLmFscGhhVGVzdCA9IDA7XG4gICAgdGhpcy5kZXB0aFRlc3QgPSB0cnVlO1xuICAgIHRoaXMuZGVwdGhXcml0ZSA9IHRydWU7XG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubnBvdCA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG4gICAgdGhpcy5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLCAxKTtcbiAgICB0aGlzLnNoYWRlciA9IFNIQURFUlMuc3RhbmRhcmQ7XG4gICAgdGhpcy5zaWRlID0gU0lERVMuZnJvbnQ7XG4gICAgdGhpcy50cmFuc3BhcmVudCA9IGZhbHNlO1xuICAgIHRoaXMudmVydGV4Q29sb3JzID0gVkVSVEVYX0NPTE9SUy5ub25lO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5ibGVuZGluZyA9IEJMRU5ESU5HLm5vcm1hbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sb3IgPSAweGZmMDAwMDtcbiAgICB0aGlzLmFscGhhVGVzdCA9IDA7XG4gICAgdGhpcy5kZXB0aFRlc3QgPSB0cnVlO1xuICAgIHRoaXMuZGVwdGhXcml0ZSA9IHRydWU7XG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubnBvdCA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0LnNldCgwLCAwKTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG4gICAgdGhpcy5yZXBlYXQuc2V0KDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIE9iamVjdDNEQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbk9iamVjdDNEQ29tcG9uZW50LnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFBhcmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuUGFyZW50LnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50T2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59IiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBQbGF5IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBjcmVhdGVUeXBlLCBjb3B5Q29weWFibGUsIGNsb25lQ2xvbmFibGUgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY29uc3QgVmVjdG9yM1R5cGUgPSBjcmVhdGVUeXBlKHtcbiAgbmFtZTogXCJWZWN0b3IzXCIsXG4gIGRlZmF1bHQ6IG5ldyBWZWN0b3IzKCksXG4gIGNvcHk6IGNvcHlDb3B5YWJsZSxcbiAgY2xvbmU6IGNsb25lQ2xvbmFibGVcbn0pO1xuXG5leHBvcnQgeyBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVGhyZWVUeXBlcyBmcm9tIFwiLi4vVHlwZXMuanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24gZXh0ZW5kcyBDb21wb25lbnQge31cblxuUG9zaXRpb24uc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFJlbmRlclBhc3MgZXh0ZW5kcyBDb21wb25lbnQge31cblxuUmVuZGVyUGFzcy5zY2hlbWEgPSB7XG4gIHNjZW5lOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBjYW1lcmE6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJleHBvcnQgY2xhc3MgUmlnaWRCb2R5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMub2JqZWN0ID0gbnVsbDtcbiAgICB0aGlzLndlaWdodCA9IDA7XG4gICAgdGhpcy5yZXN0aXR1dGlvbiA9IDE7XG4gICAgdGhpcy5mcmljdGlvbiA9IDE7XG4gICAgdGhpcy5saW5lYXJEYW1waW5nID0gMDtcbiAgICB0aGlzLmFuZ3VsYXJEYW1waW5nID0gMDtcbiAgICB0aGlzLmxpbmVhclZlbG9jaXR5ID0geyB4OiAwLCB5OiAwLCB6OiAwIH07XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNjYWxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb21wb25lbnQge31cblNjZW5lLnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNoYXBlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5TaGFwZS5zY2hlbWEgPSB7XG4gIHByaW1pdGl2ZTogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgd2lkdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGhlaWdodDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZGVwdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG4iLCJleHBvcnQgY2xhc3MgU2t5IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5Qm94IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBTb3VuZCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5Tb3VuZC5zY2hlbWEgPSB7XG4gIHNvdW5kOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICB1cmw6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH1cbn07XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFN0b3AgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIENvbXBvbmVudCB7fVxuVGV4dC5zY2hlbWEgPSB7XG4gIHRleHQ6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHRleHRBbGlnbjogeyBkZWZhdWx0OiBcImxlZnRcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInXVxuICBhbmNob3I6IHsgZGVmYXVsdDogXCJjZW50ZXJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICBiYXNlbGluZTogeyBkZWZhdWx0OiBcImNlbnRlclwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWyd0b3AnLCAnY2VudGVyJywgJ2JvdHRvbSddXG4gIGNvbG9yOiB7IGRlZmF1bHQ6IFwiI0ZGRlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgZm9udDogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy9cImh0dHBzOi8vY29kZS5jZG4ubW96aWxsYS5uZXQvZm9udHMvdHRmL1ppbGxhU2xhYi1TZW1pQm9sZC50dGZcIlxuICBmb250U2l6ZTogeyBkZWZhdWx0OiAwLjIsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsZXR0ZXJTcGFjaW5nOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsaW5lSGVpZ2h0OiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBtYXhXaWR0aDogeyBkZWZhdWx0OiBJbmZpbml0eSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIG92ZXJmbG93V3JhcDogeyBkZWZhdWx0OiBcIm5vcm1hbFwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWydub3JtYWwnLCAnYnJlYWstd29yZCddXG4gIHdoaXRlU3BhY2U6IHsgZGVmYXVsdDogXCJub3JtYWxcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbm9ybWFsJywgJ25vd3JhcCddXG4gIG9wYWNpdHk6IHsgZGVmYXVsdDogMSwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uL1R5cGVzLmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5UcmFuc2Zvcm0uc2NoZW1hID0ge1xuICBwb3NpdGlvbjogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH0sXG4gIHJvdGF0aW9uOiB7IGRlZmF1bHQ6IG5ldyBUSFJFRS5WZWN0b3IzKCksIHR5cGU6IFRocmVlVHlwZXMuVmVjdG9yM1R5cGUgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJsZSBleHRlbmRzIENvbXBvbmVudCB7fVxuVmlzaWJsZS5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfVxufTtcbiIsImV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlkID0gMDtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zZWxlY3QgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0c3RhcnQgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0ZW5kID0gbnVsbDtcblxuICAgIHRoaXMuY29ubmVjdGVkID0gbnVsbDtcblxuICAgIHRoaXMuc3F1ZWV6ZSA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplc3RhcnQgPSBudWxsO1xuICAgIHRoaXMuc3F1ZWV6ZWVuZCA9IG51bGw7XG4gIH1cbn0iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXIgZXh0ZW5kcyBDb21wb25lbnQge31cblxuV2ViR0xSZW5kZXJlci5zY2hlbWEgPSB7XG4gIHZyOiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGFyOiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGFudGlhbGlhczogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGhhbmRsZVJlc2l6ZTogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIHNoYWRvd01hcDogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGFuaW1hdGlvbkxvb3A6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJDb25uZWN0ZWQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBTY2VuZVRhZ0NvbXBvbmVudCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIENhbWVyYVRhZ0NvbXBvbmVudCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIE1lc2hUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cblxuZXhwb3J0IGNsYXNzIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSwgTm90LCBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBNYXRlcmlhbCxcbiAgT2JqZWN0M0RDb21wb25lbnQsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5jbGFzcyBNYXRlcmlhbEluc3RhbmNlIGV4dGVuZHMgU3lzdGVtU3RhdGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoKTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMubmV3LnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChNYXRlcmlhbCk7XG4gICAgfSk7XG4gIH1cbn1cblxuTWF0ZXJpYWxTeXN0ZW0ucXVlcmllcyA9IHtcbiAgbmV3OiB7XG4gICAgY29tcG9uZW50czogW01hdGVyaWFsLCBOb3QoTWF0ZXJpYWxJbnN0YW5jZSldXG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBHZW9tZXRyeSxcbiAgT2JqZWN0M0RDb21wb25lbnQsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG4vKipcbiAqIENyZWF0ZSBhIE1lc2ggYmFzZWQgb24gdGhlIFtHZW9tZXRyeV0gY29tcG9uZW50IGFuZCBhdHRhY2ggaXQgdG8gdGhlIGVudGl0eSB1c2luZyBhIFtPYmplY3QzRF0gY29tcG9uZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gUmVtb3ZlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0UmVtb3ZlZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldE9iamVjdDNEKCkucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIHZhciBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoTWF0ZXJpYWwpKSB7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4qL1xuXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVHJhbnNmb3JtKSkge1xuICAgICAgICB2YXIgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0aW9uKSB7XG4gICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChFbGVtZW50KSAmJiAhZW50aXR5Lmhhc0NvbXBvbmVudChEcmFnZ2FibGUpKSB7XG4gICAgICAvLyAgICAgICAgb2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweDMzMzMzMyk7XG4gICAgICAvLyAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dlb21ldHJ5XSwgLy8gQHRvZG8gVHJhbnNmb3JtOiBBcyBvcHRpb25hbCwgaG93IHRvIGRlZmluZSBpdD9cbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IEdMVEZMb2FkZXIgYXMgR0xURkxvYWRlclRocmVlIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbSwgU3lzdGVtU3RhdGVDb21wb25lbnQsIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcbmltcG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTG9hZGVyLmpzXCI7XG5cbi8vIEB0b2RvIFVzZSBwYXJhbWV0ZXIgYW5kIGxvYWRlciBtYW5hZ2VyXG52YXIgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXJUaHJlZSgpOyAvLy5zZXRQYXRoKFwiL2Fzc2V0cy9tb2RlbHMvXCIpO1xuXG5jbGFzcyBHTFRGTG9hZGVyU3RhdGUgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7fVxuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy53b3JsZC5yZWdpc3RlckNvbXBvbmVudChHTFRGTG9hZGVyU3RhdGUpLnJlZ2lzdGVyQ29tcG9uZW50KEdMVEZNb2RlbCk7XG4gICAgdGhpcy5sb2FkZWQgPSBbXTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgY29uc3QgdG9Mb2FkID0gdGhpcy5xdWVyaWVzLnRvTG9hZC5yZXN1bHRzO1xuICAgIHdoaWxlICh0b0xvYWQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0b0xvYWRbMF07XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEdMVEZMb2FkZXJTdGF0ZSk7XG4gICAgICBsb2FkZXIubG9hZChlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZMb2FkZXIpLnVybCwgZ2x0ZiA9PlxuICAgICAgICB0aGlzLmxvYWRlZC5wdXNoKFtlbnRpdHksIGdsdGZdKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBEbyB0aGUgYWN0dWFsIGVudGl0eSBjcmVhdGlvbiBpbnNpZGUgdGhlIHN5c3RlbSB0aWNrIG5vdCBpbiB0aGUgbG9hZGVyIGNhbGxiYWNrXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvYWRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgW2VudGl0eSwgZ2x0Zl0gPSB0aGlzLmxvYWRlZFtpXTtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURkxvYWRlcik7XG4gICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICBjaGlsZC5yZWNlaXZlU2hhZG93ID0gY29tcG9uZW50LnJlY2VpdmVTaGFkb3c7XG4gICAgICAgICAgY2hpbGQuY2FzdFNoYWRvdyA9IGNvbXBvbmVudC5jYXN0U2hhZG93O1xuXG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZSkge1xuICAgICAgICAgICAgY2hpbGQubWF0ZXJpYWwuZW52TWFwID0gY29tcG9uZW50LmVudk1hcE92ZXJyaWRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvKlxuICAgICAgdGhpcy53b3JsZFxuICAgICAgICAuY3JlYXRlRW50aXR5KClcbiAgICAgICAgLmFkZENvbXBvbmVudChHTFRGTW9kZWwsIHsgdmFsdWU6IGdsdGYgfSlcbiAgICAgICAgLmFkZE9iamVjdDNEQ29tcG9uZW50KGdsdGYuc2NlbmUsIGNvbXBvbmVudC5hcHBlbmQgJiYgZW50aXR5KTtcbiovXG5cbiAgICAgIGVudGl0eVxuICAgICAgICAuYWRkQ29tcG9uZW50KEdMVEZNb2RlbCwgeyB2YWx1ZTogZ2x0ZiB9KVxuICAgICAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQoZ2x0Zi5zY2VuZSwgY29tcG9uZW50LnBhcmVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQub25Mb2FkZWQpIHtcbiAgICAgICAgY29tcG9uZW50Lm9uTG9hZGVkKGdsdGYuc2NlbmUsIGdsdGYpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxvYWRlZC5sZW5ndGggPSAwO1xuXG4gICAgY29uc3QgdG9VbmxvYWQgPSB0aGlzLnF1ZXJpZXMudG9VbmxvYWQucmVzdWx0cztcbiAgICB3aGlsZSAodG9VbmxvYWQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0b1VubG9hZFswXTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoR0xURkxvYWRlclN0YXRlKTtcbiAgICAgIGVudGl0eS5yZW1vdmVPYmplY3QzRENvbXBvbmVudCgpO1xuICAgIH1cbiAgfVxufVxuXG5HTFRGTG9hZGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHRvTG9hZDoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyLCBOb3QoR0xURkxvYWRlclN0YXRlKV1cbiAgfSxcbiAgdG9VbmxvYWQ6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURkxvYWRlclN0YXRlLCBOb3QoR0xURkxvYWRlcildXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTa3lCb3gsIE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGxldCBza3lib3ggPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNreUJveCk7XG5cbiAgICAgIGxldCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICAgZ2VvbWV0cnkuc2NhbGUoMSwgMSwgLTEpO1xuXG4gICAgICBpZiAoc2t5Ym94LnR5cGUgPT09IFwiY3ViZW1hcC1zdGVyZW9cIikge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoc2t5Ym94LnRleHR1cmVVcmwsIDEyKTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzKTtcbiAgICAgICAgc2t5Qm94LmxheWVycy5zZXQoMSk7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3gpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzUi5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveFIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICAgIHNreUJveFIubGF5ZXJzLnNldCgyKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveFIpO1xuXG4gICAgICAgIGVudGl0eS5hZGRPYmplY3QzRENvbXBvbmVudChncm91cCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biBza3lib3ggdHlwZTogXCIsIHNreWJveC50eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5Ta3lCb3hTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbU2t5Qm94LCBOb3QoT2JqZWN0M0RDb21wb25lbnQpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZpc2libGUsIE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2liaWxpdHlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBwcm9jZXNzVmlzaWJpbGl0eShlbnRpdGllcykge1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRPYmplY3QzRCgpLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZpc2libGUpLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRENvbXBvbmVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRNZXNoIH0gZnJvbSBcInRyb2lrYS0zZC10ZXh0L2Rpc3QvdGV4dG1lc2gtc3RhbmRhbG9uZS5lc20uanNcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50LCBUZXh0IH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5cbmNvbnN0IGFuY2hvck1hcHBpbmcgPSB7XG4gIGxlZnQ6IDAsXG4gIGNlbnRlcjogMC41LFxuICByaWdodDogMVxufTtcbmNvbnN0IGJhc2VsaW5lTWFwcGluZyA9IHtcbiAgdG9wOiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgYm90dG9tOiAxXG59O1xuXG5leHBvcnQgY2xhc3MgU0RGVGV4dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpIHtcbiAgICB0ZXh0TWVzaC50ZXh0ID0gdGV4dENvbXBvbmVudC50ZXh0O1xuICAgIHRleHRNZXNoLnRleHRBbGlnbiA9IHRleHRDb21wb25lbnQudGV4dEFsaWduO1xuICAgIHRleHRNZXNoLmFuY2hvclswXSA9IGFuY2hvck1hcHBpbmdbdGV4dENvbXBvbmVudC5hbmNob3JdO1xuICAgIHRleHRNZXNoLmFuY2hvclsxXSA9IGJhc2VsaW5lTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmJhc2VsaW5lXTtcbiAgICB0ZXh0TWVzaC5jb2xvciA9IHRleHRDb21wb25lbnQuY29sb3I7XG4gICAgdGV4dE1lc2guZm9udCA9IHRleHRDb21wb25lbnQuZm9udDtcbiAgICB0ZXh0TWVzaC5mb250U2l6ZSA9IHRleHRDb21wb25lbnQuZm9udFNpemU7XG4gICAgdGV4dE1lc2gubGV0dGVyU3BhY2luZyA9IHRleHRDb21wb25lbnQubGV0dGVyU3BhY2luZyB8fCAwO1xuICAgIHRleHRNZXNoLmxpbmVIZWlnaHQgPSB0ZXh0Q29tcG9uZW50LmxpbmVIZWlnaHQgfHwgbnVsbDtcbiAgICB0ZXh0TWVzaC5vdmVyZmxvd1dyYXAgPSB0ZXh0Q29tcG9uZW50Lm92ZXJmbG93V3JhcDtcbiAgICB0ZXh0TWVzaC53aGl0ZVNwYWNlID0gdGV4dENvbXBvbmVudC53aGl0ZVNwYWNlO1xuICAgIHRleHRNZXNoLm1heFdpZHRoID0gdGV4dENvbXBvbmVudC5tYXhXaWR0aDtcbiAgICB0ZXh0TWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gdGV4dENvbXBvbmVudC5vcGFjaXR5O1xuICAgIHRleHRNZXNoLnN5bmMoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzO1xuXG4gICAgZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG5cbiAgICAgIGNvbnN0IHRleHRNZXNoID0gbmV3IFRleHRNZXNoKCk7XG4gICAgICB0ZXh0TWVzaC5uYW1lID0gXCJ0ZXh0TWVzaFwiO1xuICAgICAgdGV4dE1lc2guYW5jaG9yID0gWzAsIDBdO1xuICAgICAgdGV4dE1lc2gucmVuZGVyT3JkZXIgPSAxMDsgLy9icnV0ZS1mb3JjZSBmaXggZm9yIHVnbHkgYW50aWFsaWFzaW5nLCBzZWUgaXNzdWUgIzY3XG4gICAgICB0aGlzLnVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpO1xuICAgICAgZS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IHRleHRNZXNoIH0pO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRPYmplY3QzRCgpO1xuICAgICAgdmFyIHRleHRNZXNoID0gb2JqZWN0M0QuZ2V0T2JqZWN0QnlOYW1lKFwidGV4dE1lc2hcIik7XG4gICAgICB0ZXh0TWVzaC5kaXNwb3NlKCk7XG4gICAgICBvYmplY3QzRC5yZW1vdmUodGV4dE1lc2gpO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMuY2hhbmdlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRPYmplY3QzRCgpO1xuICAgICAgaWYgKG9iamVjdDNEIGluc3RhbmNlb2YgVGV4dE1lc2gpIHtcbiAgICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KG9iamVjdDNELCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5TREZUZXh0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RleHRdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcywgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhVGFnQ29tcG9uZW50LFxuICBBY3RpdmUsXG4gIFdlYkdMUmVuZGVyZXJcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgVlJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1ZSQnV0dG9uLmpzXCI7XG5pbXBvcnQgeyBBUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvQVJCdXR0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJDb250ZXh0IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5XZWJHTFJlbmRlcmVyQ29udGV4dC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy53b3JsZC5yZWdpc3RlckNvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVycyA9IHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cztcbiAgICByZW5kZXJlcnMuZm9yRWFjaChyZW5kZXJlckVudGl0eSA9PiB7XG4gICAgICB2YXIgcmVuZGVyZXIgPSByZW5kZXJlckVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlclBhc3Nlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIHBhc3MgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFJlbmRlclBhc3MpO1xuICAgICAgICB2YXIgc2NlbmUgPSBwYXNzLnNjZW5lLmdldE9iamVjdDNEKCk7XG5cbiAgICAgICAgdGhpcy5xdWVyaWVzLmFjdGl2ZUNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYUVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNhbWVyYSA9IGNhbWVyYUVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGNvbXBvbmVudC5zaGFkb3dNYXA7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIgfHwgY29tcG9uZW50LmFyKSB7XG4gICAgICAgIHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFZSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhVGFnQ29tcG9uZW50LCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUGFyZW50T2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgUG9zaXRpb24sXG4gIFNjYWxlLFxuICBQYXJlbnQsXG4gIE9iamVjdDNEQ29tcG9uZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgaWYgKCFlbnRpdHkuYWxpdmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGllcmFyY2h5XG4gICAgdGhpcy5xdWVyaWVzLnBhcmVudE9iamVjdDNELmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50T2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICB9KTtcblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGlmICghZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGxldCBwb3NpdGlvbnMgPSB0aGlzLnF1ZXJpZXMucG9zaXRpb25zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmFkZGVkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuXG4gICAgICAvLyBMaW5rIHRoZW1cbiAgICAgIGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlID0gb2JqZWN0LnBvc2l0aW9uO1xuICAgIH1cbi8qXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHBvc2l0aW9ucy5jaGFuZ2VkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcbiAgICB9XG4qL1xuICAgIC8vIFNjYWxlXG4gICAgbGV0IHNjYWxlcyA9IHRoaXMucXVlcmllcy5zY2FsZXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2FsZXMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBzY2FsZXMuYWRkZWRbaV07XG4gICAgICBsZXQgc2NhbGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjYWxlKS52YWx1ZTtcblxuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3Quc2NhbGUuY29weShzY2FsZSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzY2FsZXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHNjYWxlcy5jaGFuZ2VkW2ldO1xuICAgICAgbGV0IHNjYWxlID0gZW50aXR5LmdldENvbXBvbmVudChTY2FsZSkudmFsdWU7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5zY2FsZS5jb3B5KHNjYWxlKTtcbiAgICB9XG4gIH1cbn1cblxuVHJhbnNmb3JtU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHBhcmVudE9iamVjdDNEOiB7XG4gICAgY29tcG9uZW50czogW1BhcmVudE9iamVjdDNELCBPYmplY3QzRENvbXBvbmVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgcGFyZW50OiB7XG4gICAgY29tcG9uZW50czogW1BhcmVudCwgT2JqZWN0M0RDb21wb25lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIHRyYW5zZm9ybXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0RDb21wb25lbnQsIFRyYW5zZm9ybV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtUcmFuc2Zvcm1dXG4gICAgfVxuICB9LFxuICBwb3NpdGlvbnM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0RDb21wb25lbnQsIFBvc2l0aW9uXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Bvc2l0aW9uXVxuICAgIH1cbiAgfSxcbiAgc2NhbGVzOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNEQ29tcG9uZW50LCBTY2FsZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtTY2FsZV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgQ2FtZXJhVGFnQ29tcG9uZW50LFxuICBVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZyxcbiAgT2JqZWN0M0RDb21wb25lbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFVwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgY29uc29sZS5sb2coXCJyZXNpemVcIiwgdGhpcy5hc3BlY3QpO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNhbWVyYXMgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FtZXJhcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGNhbWVyYU9iaiA9IGNhbWVyYXNbaV0uZ2V0T2JqZWN0M0QoKTtcbiAgICAgIGlmIChjYW1lcmFPYmouYXNwZWN0ICE9PSB0aGlzLmFzcGVjdCkge1xuICAgICAgICBjYW1lcmFPYmouYXNwZWN0ID0gdGhpcy5hc3BlY3Q7XG4gICAgICAgIGNhbWVyYU9iai51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cblVwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhVGFnQ29tcG9uZW50LCBVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZywgT2JqZWN0M0RDb21wb25lbnRdXG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNEQ29tcG9uZW50XCI7XG5pbXBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9UZXh0R2VvbWV0cnlcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgLypcbiAgICBsb2FkZXIubG9hZChcIi9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIiwgZm9udCA9PiB7XG4gICAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gICAgKi9cbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHJldHVybjtcblxuICAgIHZhciBjaGFuZ2VkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQ7XG4gICAgY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuICAgICAgZW50aXR5LmdldE9iamVjdDNEKCkuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcbiAgICB9KTtcblxuICAgIHZhciBhZGRlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcbiAgICBhZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29sb3IgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG4gICAgICBjb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICByb3VnaG5lc3M6IDAuNyxcbiAgICAgICAgbWV0YWxuZXNzOiAwLjBcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IG1lc2ggfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRHZW9tZXRyeV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQsIFNjZW5lLCBPYmplY3QzRENvbXBvbmVudCwgRW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5lbnZpcm9ubWVudHMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgLy8gc3RhZ2UgZ3JvdW5kIGRpYW1ldGVyIChhbmQgc2t5IHJhZGl1cylcbiAgICAgIHZhciBTVEFHRV9TSVpFID0gMjAwO1xuXG4gICAgICAvLyBjcmVhdGUgZ3JvdW5kXG4gICAgICAvLyB1cGRhdGUgZ3JvdW5kLCBwbGF5YXJlYSBhbmQgZ3JpZCB0ZXh0dXJlcy5cbiAgICAgIHZhciBncm91bmRSZXNvbHV0aW9uID0gMjA0ODtcbiAgICAgIHZhciB0ZXhNZXRlcnMgPSAyMDsgLy8gZ3JvdW5kIHRleHR1cmUgb2YgMjAgeCAyMCBtZXRlcnNcbiAgICAgIHZhciB0ZXhSZXBlYXQgPSBTVEFHRV9TSVpFIC8gdGV4TWV0ZXJzO1xuXG4gICAgICB2YXIgcmVzb2x1dGlvbiA9IDY0OyAvLyBudW1iZXIgb2YgZGl2aXNpb25zIG9mIHRoZSBncm91bmQgbWVzaFxuXG4gICAgICB2YXIgZ3JvdW5kQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGdyb3VuZENhbnZhcy53aWR0aCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRDYW52YXMuaGVpZ2h0ID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIHZhciBncm91bmRUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoZ3JvdW5kQ2FudmFzKTtcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUucmVwZWF0LnNldCh0ZXhSZXBlYXQsIHRleFJlcGVhdCk7XG5cbiAgICAgIHRoaXMuZW52aXJvbm1lbnREYXRhID0ge1xuICAgICAgICBncm91bmRDb2xvcjogXCIjNDU0NTQ1XCIsXG4gICAgICAgIGdyb3VuZENvbG9yMjogXCIjNWQ1ZDVkXCJcbiAgICAgIH07XG5cbiAgICAgIHZhciBncm91bmRjdHggPSBncm91bmRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICB2YXIgc2l6ZSA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3I7XG4gICAgICBncm91bmRjdHguZmlsbFJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSk7XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3IyO1xuICAgICAgdmFyIG51bSA9IE1hdGguZmxvb3IodGV4TWV0ZXJzIC8gMik7XG4gICAgICB2YXIgc3RlcCA9IHNpemUgLyAodGV4TWV0ZXJzIC8gMik7IC8vIDIgbWV0ZXJzID09IDxzdGVwPiBwaXhlbHNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtICsgMTsgaSArPSAyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtICsgMTsgaisrKSB7XG4gICAgICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgTWF0aC5mbG9vcigoaSArIChqICUgMikpICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKGogKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBncm91bmRUZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgdmFyIGdyb3VuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBtYXA6IGdyb3VuZFRleHR1cmVcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgc2NlbmUgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIC8vc2NlbmUuYWRkKG1lc2gpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICBTVEFHRV9TSVpFICsgMixcbiAgICAgICAgcmVzb2x1dGlvbiAtIDEsXG4gICAgICAgIHJlc29sdXRpb24gLSAxXG4gICAgICApO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIGdyb3VuZE1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogd2luZG93LmVudGl0eVNjZW5lIH0pO1xuXG4gICAgICBjb25zdCBjb2xvciA9IDB4MzMzMzMzO1xuICAgICAgY29uc3QgbmVhciA9IDIwO1xuICAgICAgY29uc3QgZmFyID0gMTAwO1xuICAgICAgc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZyhjb2xvciwgbmVhciwgZmFyKTtcbiAgICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoY29sb3IpO1xuICAgIH0pO1xuICB9XG59XG5cbkVudmlyb25tZW50U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudmlyb25tZW50czoge1xuICAgIGNvbXBvbmVudHM6IFtTY2VuZSwgRW52aXJvbm1lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyQ29udGV4dCxcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgQ29udHJvbGxlckNvbm5lY3RlZCxcbiAgT2JqZWN0M0RDb21wb25lbnRcbn0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1hSQ29udHJvbGxlck1vZGVsRmFjdG9yeS5qc1wiO1xuXG52YXIgY29udHJvbGxlck1vZGVsRmFjdG9yeSA9IG5ldyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkoKTtcblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVyID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVyQ29udGV4dC5yZXN1bHRzWzBdLmdldENvbXBvbmVudChcbiAgICAgIFdlYkdMUmVuZGVyZXJDb250ZXh0XG4gICAgKS52YWx1ZTtcblxuICAgIHRoaXMucXVlcmllcy5jb250cm9sbGVycy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29udHJvbGxlcklkID0gZW50aXR5LmdldENvbXBvbmVudChWUkNvbnRyb2xsZXIpLmlkO1xuICAgICAgdmFyIGNvbnRyb2xsZXIgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyLm5hbWUgPSBcImNvbnRyb2xsZXJcIjtcblxuICAgICAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlcik7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiBncm91cCB9KTtcblxuICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwiY29ubmVjdGVkXCIsICgpID0+IHtcbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChDb250cm9sbGVyQ29ubmVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJkaXNjb25uZWN0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KENvbnRyb2xsZXJDb25uZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKSkge1xuICAgICAgICB2YXIgYmVoYXZpb3VyID0gZW50aXR5LmdldENvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cik7XG4gICAgICAgIE9iamVjdC5rZXlzKGJlaGF2aW91cikuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgICAgIGlmIChiZWhhdmlvdXJbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgYmVoYXZpb3VyW2V2ZW50TmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBYUkNvbnRyb2xsZXJNb2RlbEZhY3Rvcnkgd2lsbCBhdXRvbWF0aWNhbGx5IGZldGNoIGNvbnRyb2xsZXIgbW9kZWxzXG4gICAgICAvLyB0aGF0IG1hdGNoIHdoYXQgdGhlIHVzZXIgaXMgaG9sZGluZyBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlLiBUaGUgbW9kZWxzXG4gICAgICAvLyBzaG91bGQgYmUgYXR0YWNoZWQgdG8gdGhlIG9iamVjdCByZXR1cm5lZCBmcm9tIGdldENvbnRyb2xsZXJHcmlwIGluXG4gICAgICAvLyBvcmRlciB0byBtYXRjaCB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGhlbGQgZGV2aWNlLlxuICAgICAgbGV0IGNvbnRyb2xsZXJHcmlwID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlckdyaXAoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXJHcmlwLmFkZChcbiAgICAgICAgY29udHJvbGxlck1vZGVsRmFjdG9yeS5jcmVhdGVDb250cm9sbGVyTW9kZWwoY29udHJvbGxlckdyaXApXG4gICAgICApO1xuICAgICAgZ3JvdXAuYWRkKGNvbnRyb2xsZXJHcmlwKTtcbiAgICAgIC8qXG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcbiAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZShcbiAgICAgICAgXCJwb3NpdGlvblwiLFxuICAgICAgICBuZXcgVEhSRUUuRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZShbMCwgMCwgMCwgMCwgMCwgLTFdLCAzKVxuICAgICAgKTtcblxuICAgICAgdmFyIGxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSk7XG4gICAgICBsaW5lLm5hbWUgPSBcImxpbmVcIjtcbiAgICAgIGxpbmUuc2NhbGUueiA9IDU7XG4gICAgICBncm91cC5hZGQobGluZSk7XG5cbiAgICAgIGxldCBnZW9tZXRyeTIgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMC4xLCAwLjEsIDAuMSk7XG4gICAgICBsZXQgbWF0ZXJpYWwyID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4MDBmZjAwIH0pO1xuICAgICAgbGV0IGN1YmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeTIsIG1hdGVyaWFsMik7XG4gICAgICBncm91cC5uYW1lID0gXCJWUkNvbnRyb2xsZXJcIjtcbiAgICAgIGdyb3VwLmFkZChjdWJlKTtcbiovXG4gICAgfSk7XG5cbiAgICAvLyB0aGlzLmNsZWFuSW50ZXJzZWN0ZWQoKTtcbiAgfVxufVxuXG5WUkNvbnRyb2xsZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY29udHJvbGxlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbVlJDb250cm9sbGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgICAvL2NoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyZXJDb250ZXh0OiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBtYW5kYXRvcnk6IHRydWVcbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFBsYXksIFN0b3AsIEdMVEZNb2RlbCwgQW5pbWF0aW9uIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuY2xhc3MgQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cblxuY2xhc3MgQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYW5pbWF0aW9ucyA9IFtdO1xuICB9XG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvblN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoZGVsdGEpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGdsdGYgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZNb2RlbCkudmFsdWU7XG4gICAgICBsZXQgbWl4ZXIgPSBuZXcgVEhSRUUuQW5pbWF0aW9uTWl4ZXIoZ2x0Zi5zY2VuZSk7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEFuaW1hdGlvbk1peGVyQ29tcG9uZW50LCB7XG4gICAgICAgIHZhbHVlOiBtaXhlclxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhbmltYXRpb25zID0gW107XG4gICAgICBnbHRmLmFuaW1hdGlvbnMuZm9yRWFjaChhbmltYXRpb25DbGlwID0+IHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gbWl4ZXIuY2xpcEFjdGlvbihhbmltYXRpb25DbGlwLCBnbHRmLnNjZW5lKTtcbiAgICAgICAgYWN0aW9uLmxvb3AgPSBUSFJFRS5Mb29wT25jZTtcbiAgICAgICAgYW5pbWF0aW9ucy5wdXNoKGFjdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50LCB7XG4gICAgICAgIGFuaW1hdGlvbnM6IGFuaW1hdGlvbnMsXG4gICAgICAgIGR1cmF0aW9uOiBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbikuZHVyYXRpb25cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLm1peGVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQpLnZhbHVlLnVwZGF0ZShkZWx0YSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucGxheUNsaXBzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCk7XG4gICAgICBjb21wb25lbnQuYW5pbWF0aW9ucy5mb3JFYWNoKGFjdGlvbkNsaXAgPT4ge1xuICAgICAgICBpZiAoY29tcG9uZW50LmR1cmF0aW9uICE9PSAtMSkge1xuICAgICAgICAgIGFjdGlvbkNsaXAuc2V0RHVyYXRpb24oY29tcG9uZW50LmR1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjdGlvbkNsaXAuY2xhbXBXaGVuRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBhY3Rpb25DbGlwLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkNsaXAucGxheSgpO1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFBsYXkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLnN0b3BDbGlwcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBhbmltYXRpb25zID0gZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50KVxuICAgICAgICAuYW5pbWF0aW9ucztcbiAgICAgIGFuaW1hdGlvbnMuZm9yRWFjaChhY3Rpb25DbGlwID0+IHtcbiAgICAgICAgYWN0aW9uQ2xpcC5yZXNldCgpO1xuICAgICAgICBhY3Rpb25DbGlwLnN0b3AoKTtcbiAgICAgIH0pO1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChTdG9wKTtcbiAgICB9KTtcbiAgfVxufVxuXG5BbmltYXRpb25TeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uLCBHTFRGTW9kZWxdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIG1peGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb25NaXhlckNvbXBvbmVudF1cbiAgfSxcbiAgcGxheUNsaXBzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIFBsYXldXG4gIH0sXG4gIHN0b3BDbGlwczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50LCBTdG9wXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLFxuICBWUkNvbnRyb2xsZXIsXG4gIElucHV0U3RhdGVcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIElucHV0U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICAvLyEhISEhISEhISEhISFcbiAgICB0aGlzLndvcmxkLnJlZ2lzdGVyQ29tcG9uZW50KElucHV0U3RhdGUpO1xuXG4gICAgbGV0IGVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KElucHV0U3RhdGUpO1xuICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KElucHV0U3RhdGUpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWUkNvbnRyb2xsZXJzKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzS2V5Ym9hcmQoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NNb3VzZSgpO1xuICAgIC8vIHRoaXMucHJvY2Vzc0dhbWVwYWRzKCk7XG4gIH1cblxuICBwcm9jZXNzVlJDb250cm9sbGVycygpIHtcbiAgICAvLyBQcm9jZXNzIHJlY2VudGx5IGFkZGVkIGNvbnRyb2xsZXJzXG4gICAgdGhpcy5xdWVyaWVzLnZyY29udHJvbGxlcnMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ciwge1xuICAgICAgICBzZWxlY3RzdGFydDogZXZlbnQgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmdldChldmVudC50YXJnZXQpO1xuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0ZW5kOiBldmVudCA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZ2V0KGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBjb25uZWN0ZWQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5zZXQoZXZlbnQudGFyZ2V0LCB7fSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRpc2Nvbm5lY3RlZDogZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmRlbGV0ZShldmVudC50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmZvckVhY2goc3RhdGUgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0U3RhcnQgPSBzdGF0ZS5zZWxlY3RlZCAmJiAhc3RhdGUucHJldlNlbGVjdGVkO1xuICAgICAgc3RhdGUuc2VsZWN0RW5kID0gIXN0YXRlLnNlbGVjdGVkICYmIHN0YXRlLnByZXZTZWxlY3RlZDtcbiAgICAgIHN0YXRlLnByZXZTZWxlY3RlZCA9IHN0YXRlLnNlbGVjdGVkO1xuICAgIH0pO1xuICB9XG59XG5cbklucHV0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHZyY29udHJvbGxlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbVlJDb250cm9sbGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKGxpc3RlbmVyLCBwb29sU2l6ZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIHRoaXMuY29udGV4dCA9IGxpc3RlbmVyLmNvbnRleHQ7XG5cbiAgICB0aGlzLnBvb2xTaXplID0gcG9vbFNpemUgfHwgNTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9vbFNpemU7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKG5ldyBUSFJFRS5Qb3NpdGlvbmFsQXVkaW8obGlzdGVuZXIpKTtcbiAgICB9XG4gIH1cblxuICBzZXRCdWZmZXIoYnVmZmVyKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKHNvdW5kID0+IHtcbiAgICAgIHNvdW5kLnNldEJ1ZmZlcihidWZmZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzb3VuZCA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICBpZiAoIXNvdW5kLmlzUGxheWluZyAmJiBzb3VuZC5idWZmZXIgJiYgIWZvdW5kKSB7XG4gICAgICAgIHNvdW5kLnBsYXkoKTtcbiAgICAgICAgc291bmQuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiQWxsIHRoZSBzb3VuZHMgYXJlIHBsYXlpbmcuIElmIHlvdSBuZWVkIHRvIHBsYXkgbW9yZSBzb3VuZHMgc2ltdWx0YW5lb3VzbHkgY29uc2lkZXIgaW5jcmVhc2luZyB0aGUgcG9vbCBzaXplXCJcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTb3VuZCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyBmcm9tIFwiLi4vbGliL1Bvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMuanNcIjtcblxuZXhwb3J0IGNsYXNzIFNvdW5kU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmxpc3RlbmVyID0gbmV3IFRIUkVFLkF1ZGlvTGlzdGVuZXIoKTtcbiAgfVxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5zb3VuZHMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoU291bmQpO1xuICAgICAgY29uc3Qgc291bmQgPSBuZXcgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyh0aGlzLmxpc3RlbmVyLCAxMCk7XG4gICAgICBjb25zdCBhdWRpb0xvYWRlciA9IG5ldyBUSFJFRS5BdWRpb0xvYWRlcigpO1xuICAgICAgYXVkaW9Mb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBidWZmZXIgPT4ge1xuICAgICAgICBzb3VuZC5zZXRCdWZmZXIoYnVmZmVyKTtcbiAgICAgIH0pO1xuICAgICAgY29tcG9uZW50LnNvdW5kID0gc291bmQ7XG4gICAgfSk7XG4gIH1cbn1cblxuU291bmRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgc291bmRzOiB7XG4gICAgY29tcG9uZW50czogW1NvdW5kXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWUgLy8gW1NvdW5kXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IF9FbnRpdHkgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFQ1NZVGhyZWVFbnRpdHkgZXh0ZW5kcyBfRW50aXR5IHtcbiAgYWRkT2JqZWN0M0RDb21wb25lbnQob2JqLCBwYXJlbnRFbnRpdHkpIHtcbiAgICBvYmouZW50aXR5ID0gdGhpcztcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogb2JqIH0pO1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIud29ybGQub2JqZWN0M0RJbmZsYXRvci5pbmZsYXRlKHRoaXMsIG9iaik7XG4gICAgaWYgKHBhcmVudEVudGl0eSAmJiBwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgcGFyZW50RW50aXR5LmdldE9iamVjdDNEKCkuYWRkKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlT2JqZWN0M0RDb21wb25lbnQodW5wYXJlbnQgPSB0cnVlKSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5nZXRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHRydWUpLnZhbHVlO1xuICAgIGlmICh1bnBhcmVudCkge1xuICAgICAgLy8gVXNpbmcgXCJ0cnVlXCIgYXMgdGhlIGVudGl0eSBjb3VsZCBiZSByZW1vdmVkIHNvbWV3aGVyZSBlbHNlXG4gICAgICBvYmoucGFyZW50ICYmIG9iai5wYXJlbnQucmVtb3ZlKG9iaik7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KTtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLndvcmxkLm9iamVjdDNESW5mbGF0b3IuZGVmbGF0ZSh0aGlzLCBvYmopO1xuICAgIG9iai5lbnRpdHkgPSBudWxsO1xuICB9XG5cbiAgcmVtb3ZlKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgaWYgKHRoaXMuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgY29uc3Qgb2JqID0gdGhpcy5nZXRPYmplY3QzRCgpO1xuICAgICAgb2JqLnRyYXZlcnNlKG8gPT4ge1xuICAgICAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eShvLmVudGl0eSwgZm9yY2VJbW1lZGlhdGUpO1xuICAgICAgICBvLmVudGl0eSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIG9iai5wYXJlbnQgJiYgb2JqLnBhcmVudC5yZW1vdmUob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZW50aXR5TWFuYWdlci5yZW1vdmVFbnRpdHkodGhpcywgZm9yY2VJbW1lZGlhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGdldE9iamVjdDNEKCkge1xuICAgIHJldHVybiB0aGlzLmdldENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkudmFsdWU7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIE1lc2hUYWdDb21wb25lbnQsXG4gIFNjZW5lVGFnQ29tcG9uZW50LFxuICBDYW1lcmFUYWdDb21wb25lbnRcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgPSB7XG4gIGluZmxhdGU6IChlbnRpdHksIG9iaikgPT4ge1xuICAgIC8vIFRPRE8gc3VwcG9ydCBtb3JlIHRhZ3MgYW5kIHByb2JhYmx5IGEgd2F5IHRvIGFkZCB1c2VyIGRlZmluZWQgb25lc1xuICAgIGlmIChvYmouaXNNZXNoKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE1lc2hUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzU2NlbmUpIHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoU2NlbmVUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzQ2FtZXJhKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KENhbWVyYVRhZ0NvbXBvbmVudCk7XG4gICAgfVxuICB9LFxuICBkZWZsYXRlOiAoZW50aXR5LCBvYmopID0+IHtcbiAgICAvLyBUT0RPIHN1cHBvcnQgbW9yZSB0YWdzIGFuZCBwcm9iYWJseSBhIHdheSB0byBhZGQgdXNlciBkZWZpbmVkIG9uZXNcbiAgICBpZiAob2JqLmlzTWVzaCkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChNZXNoVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc1NjZW5lKSB7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFNjZW5lVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc0NhbWVyYSkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChDYW1lcmFUYWdDb21wb25lbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IEVDU1lUaHJlZUVudGl0eSB9IGZyb20gXCIuL2VudGl0eS5qc1wiO1xuaW1wb3J0IHsgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgfSBmcm9tIFwiLi9kZWZhdWx0T2JqZWN0M0RJbmZsYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlV29ybGQgZXh0ZW5kcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCB7IGVudGl0eUNsYXNzOiBFQ1NZVGhyZWVFbnRpdHkgfSwgb3B0aW9ucykpO1xuICAgIHRoaXMub2JqZWN0M0RJbmZsYXRvciA9IGRlZmF1bHRPYmplY3QzREluZmxhdG9yO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1VwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtLmpzXCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyLFxuICBTY2VuZSxcbiAgQWN0aXZlLFxuICBSZW5kZXJQYXNzLFxuICBPYmplY3QzRENvbXBvbmVudCxcbiAgQ2FtZXJhLFxuICBTY2VuZVRhZ0NvbXBvbmVudCxcbiAgQ2FtZXJhVGFnQ29tcG9uZW50LFxuICBNZXNoVGFnQ29tcG9uZW50LFxuICBVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZ1xufSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmltcG9ydCB7IEVDU1lUaHJlZVdvcmxkIH0gZnJvbSBcIi4vd29ybGQuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUod29ybGQgPSBuZXcgRUNTWVRocmVlV29ybGQoKSwgb3B0aW9ucykge1xuICBpZiAoISh3b3JsZCBpbnN0YW5jZW9mIEVDU1lUaHJlZVdvcmxkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiVGhlIHByb3ZpZGVkICd3b3JsZCcgcGFyZW1ldGVyIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiAnRUNTWVRocmVlV29ybGQnXCJcbiAgICApO1xuICB9XG5cbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFdlYkdMUmVuZGVyZXJTeXN0ZW0sIHsgcHJpb3JpdHk6IDEgfSk7XG5cbiAgd29ybGRcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoV2ViR0xSZW5kZXJlcilcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoU2NlbmUpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KEFjdGl2ZSlcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFJlbmRlclBhc3MpXG4vLyAgICAucmVnaXN0ZXJDb21wb25lbnQoVHJhbnNmb3JtKVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChDYW1lcmEpXG4gICAgLy8gVGFnc1xuICAgIC5yZWdpc3RlckNvbXBvbmVudChTY2VuZVRhZ0NvbXBvbmVudClcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoQ2FtZXJhVGFnQ29tcG9uZW50KVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChNZXNoVGFnQ29tcG9uZW50KVxuXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnKVxuXG5cbiAgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHZyOiBmYWxzZSxcbiAgICBkZWZhdWx0czogdHJ1ZVxuICB9O1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuXG4gIGlmICghb3B0aW9ucy5kZWZhdWx0cykge1xuICAgIHJldHVybiB7IHdvcmxkIH07XG4gIH1cblxuICBsZXQgYW5pbWF0aW9uTG9vcCA9IG9wdGlvbnMuYW5pbWF0aW9uTG9vcDtcbiAgaWYgKCFhbmltYXRpb25Mb29wKSB7XG4gICAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcbiAgICBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xuICAgICAgd29ybGQuZXhlY3V0ZShjbG9jay5nZXREZWx0YSgpLCBjbG9jay5lbGFwc2VkVGltZSk7XG4gICAgfTtcbiAgfVxuXG4gIGxldCBzY2VuZSA9IHdvcmxkXG4gICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgLmFkZENvbXBvbmVudChTY2VuZSlcbiAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQobmV3IFRIUkVFLlNjZW5lKCkpO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgYXI6IG9wdGlvbnMuYXIsXG4gICAgdnI6IG9wdGlvbnMudnIsXG4gICAgYW5pbWF0aW9uTG9vcDogYW5pbWF0aW9uTG9vcFxuICB9KTtcblxuICAvLyBjYW1lcmEgcmlnICYgY29udHJvbGxlcnNcbiAgdmFyIGNhbWVyYSA9IG51bGwsXG4gICAgY2FtZXJhUmlnID0gbnVsbDtcblxuICAvLyBpZiAob3B0aW9ucy5hciB8fCBvcHRpb25zLnZyKSB7XG4gIC8vICAgY2FtZXJhUmlnID0gd29ybGRcbiAgLy8gICAgIC5jcmVhdGVFbnRpdHkoKVxuICAvLyAgICAgLmFkZENvbXBvbmVudChDYW1lcmFSaWcpXG4gIC8vICAgICAuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogc2NlbmUgfSk7XG4gIC8vIH1cblxuICB7XG4gICAgY2FtZXJhID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmEpXG4gICAgICAuYWRkQ29tcG9uZW50KFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnKVxuICAgICAgLmFkZE9iamVjdDNEQ29tcG9uZW50KFxuICAgICAgICBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgICAgOTAsXG4gICAgICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgMC4xLFxuICAgICAgICAgIDEwMFxuICAgICAgICApLFxuICAgICAgICBzY2VuZVxuICAgICAgKVxuICAgICAgLmFkZENvbXBvbmVudChBY3RpdmUpO1xuICB9XG5cbiAgbGV0IHJlbmRlclBhc3MgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoUmVuZGVyUGFzcywge1xuICAgIHNjZW5lOiBzY2VuZSxcbiAgICBjYW1lcmE6IGNhbWVyYVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIGNhbWVyYVJpZyxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgcmVuZGVyUGFzc1xuICAgIH1cbiAgfTtcbn1cbiIsIi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7XG4gIEFjdGl2ZSxcbiAgQW5pbWF0aW9uLFxuICBDYW1lcmEsXG4gIENhbWVyYVJpZyxcbiAgQ29sbGlkaW5nLFxuICBDb2xsaXNpb25TdGFydCxcbiAgQ29sbGlzaW9uU3RvcCxcbiAgRHJhZ2dhYmxlLFxuICBEcmFnZ2luZyxcbiAgRW52aXJvbm1lbnQsXG4gIEdlb21ldHJ5LFxuICBHTFRGTG9hZGVyLFxuICBHTFRGTW9kZWwsXG4gIElucHV0U3RhdGUsXG4gIE1hdGVyaWFsLFxuICBPYmplY3QzRENvbXBvbmVudCxcbiAgUGFyZW50LFxuICBQYXJlbnRPYmplY3QzRCxcbiAgUGxheSxcbiAgUG9zaXRpb24sXG4gIFJlbmRlclBhc3MsXG4gIFJpZ2lkQm9keSxcbiAgUm90YXRpb24sXG4gIFNjYWxlLFxuICBTY2VuZSxcbiAgU2hhcGUsXG4gIFNreSxcbiAgU2t5Qm94LFxuICBTb3VuZCxcbiAgU3RvcCxcbiAgVGV4dCxcbiAgVGV4dEdlb21ldHJ5LFxuICBDb250cm9sbGVyQ29ubmVjdGVkLFxuICBUcmFuc2Zvcm0sXG4gIFZpc2libGUsXG4gIFZSQ29udHJvbGxlcixcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXJcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG4vLyBzeXN0ZW1zXG5leHBvcnQgeyBNYXRlcmlhbFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IEdlb21ldHJ5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgR0xURkxvYWRlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvR0xURkxvYWRlclN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgU2t5Qm94U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFZpc2liaWxpdHlTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1Zpc2liaWxpdHlTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFNERlRleHRTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1NERlRleHRTeXN0ZW0uanNcIjtcbmV4cG9ydCB7XG4gIFdlYkdMUmVuZGVyZXJTeXN0ZW0sXG4gIFdlYkdMUmVuZGVyZXJDb250ZXh0XG59IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFVwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9VcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVGV4dEdlb21ldHJ5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IEVudmlyb25tZW50U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVlJDb250cm9sbGVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9WUkNvbnRyb2xsZXJTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IEFuaW1hdGlvblN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQW5pbWF0aW9uU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBJbnB1dFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvSW5wdXRTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFNvdW5kU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9Tb3VuZFN5c3RlbS5qc1wiO1xuXG4vLyBJbml0aWFsaXplXG5leHBvcnQgeyBpbml0aWFsaXplIH0gZnJvbSBcIi4vaW5pdGlhbGl6ZS5qc1wiO1xuZXhwb3J0IHsgRUNTWVRocmVlV29ybGQgfSBmcm9tIFwiLi93b3JsZC5qc1wiO1xuZXhwb3J0ICogZnJvbSBcIi4vVHlwZXNcIjtcbiJdLCJuYW1lcyI6WyJUSFJFRS5WZWN0b3IyIiwiVEhSRUUuVmVjdG9yMyIsIlRocmVlVHlwZXMuVmVjdG9yM1R5cGUiLCJUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIkdMVEZMb2FkZXJUaHJlZSIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiVEhSRUUuRm9udExvYWRlciIsIlRIUkVFLlRleHRHZW9tZXRyeSIsIlRIUkVFLlJlcGVhdFdyYXBwaW5nIiwiVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkZvZyIsIlRIUkVFLkNvbG9yIiwiVEhSRUUuQW5pbWF0aW9uTWl4ZXIiLCJUSFJFRS5Mb29wT25jZSIsIlRIUkVFLk9iamVjdDNEIiwiVEhSRUUuUG9zaXRpb25hbEF1ZGlvIiwiVEhSRUUuQXVkaW9MaXN0ZW5lciIsIlRIUkVFLkF1ZGlvTG9hZGVyIiwiX0VudGl0eSIsIlRI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

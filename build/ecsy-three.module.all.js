import * as THREE from 'https://unpkg.com/three@0.117.1/build/three.module.js';
import { Vector2, Vector3 as Vector3$1, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, AnimationMixer, LoopOnce, Object3D as Object3D$1, PositionalAudio, AudioListener, AudioLoader, Clock, Scene as Scene$1 } from 'https://unpkg.com/three@0.117.1/build/three.module.js';
import { GLTFLoader as GLTFLoader$1 } from 'https://unpkg.com/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'https://unpkg.com/troika-3d-text@0.28.0/dist/textmesh-standalone.esm.js?module';
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
var version = "0.2.4";
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
	"@rollup/plugin-node-resolve": "^8.0.1",
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9VdGlscy5qcyIsIi4uL3NyYy9FdmVudERpc3BhdGNoZXIuanMiLCIuLi9zcmMvUXVlcnkuanMiLCIuLi9zcmMvU3lzdGVtLmpzIiwiLi4vc3JjL1N5c3RlbU1hbmFnZXIuanMiLCIuLi9zcmMvT2JqZWN0UG9vbC5qcyIsIi4uL3NyYy9RdWVyeU1hbmFnZXIuanMiLCIuLi9zcmMvQ29tcG9uZW50LmpzIiwiLi4vc3JjL1N5c3RlbVN0YXRlQ29tcG9uZW50LmpzIiwiLi4vc3JjL0VudGl0eU1hbmFnZXIuanMiLCIuLi9zcmMvQ29tcG9uZW50TWFuYWdlci5qcyIsIi4uL3NyYy9WZXJzaW9uLmpzIiwiLi4vc3JjL0VudGl0eS5qcyIsIi4uL3NyYy9Xb3JsZC5qcyIsIi4uL3NyYy9UYWdDb21wb25lbnQuanMiLCIuLi9zcmMvVHlwZXMuanMiLCIuLi9zcmMvUmVtb3RlRGV2VG9vbHMvdXRpbHMuanMiLCIuLi9zcmMvUmVtb3RlRGV2VG9vbHMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBSZXR1cm4gdGhlIG5hbWUgb2YgYSBjb21wb25lbnRcbiAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnRcbiAqIEBwcml2YXRlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXROYW1lKENvbXBvbmVudCkge1xuICByZXR1cm4gQ29tcG9uZW50Lm5hbWU7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgdmFsaWQgcHJvcGVydHkgbmFtZSBmb3IgdGhlIENvbXBvbmVudFxuICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudFxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbXBvbmVudFByb3BlcnR5TmFtZShDb21wb25lbnQpIHtcbiAgcmV0dXJuIGdldE5hbWUoQ29tcG9uZW50KTtcbn1cblxuLyoqXG4gKiBHZXQgYSBrZXkgZnJvbSBhIGxpc3Qgb2YgY29tcG9uZW50c1xuICogQHBhcmFtIHtBcnJheShDb21wb25lbnQpfSBDb21wb25lbnRzIEFycmF5IG9mIGNvbXBvbmVudHMgdG8gZ2VuZXJhdGUgdGhlIGtleVxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHF1ZXJ5S2V5KENvbXBvbmVudHMpIHtcbiAgdmFyIG5hbWVzID0gW107XG4gIGZvciAodmFyIG4gPSAwOyBuIDwgQ29tcG9uZW50cy5sZW5ndGg7IG4rKykge1xuICAgIHZhciBUID0gQ29tcG9uZW50c1tuXTtcbiAgICBpZiAodHlwZW9mIFQgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgIHZhciBvcGVyYXRvciA9IFQub3BlcmF0b3IgPT09IFwibm90XCIgPyBcIiFcIiA6IFQub3BlcmF0b3I7XG4gICAgICBuYW1lcy5wdXNoKG9wZXJhdG9yICsgZ2V0TmFtZShULkNvbXBvbmVudCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lcy5wdXNoKGdldE5hbWUoVCkpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBuYW1lcy5zb3J0KCkuam9pbihcIi1cIik7XG59XG5cbi8vIERldGVjdG9yIGZvciBicm93c2VyJ3MgXCJ3aW5kb3dcIlxuZXhwb3J0IGNvbnN0IGhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI7XG5cbi8vIHBlcmZvcm1hbmNlLm5vdygpIFwicG9seWZpbGxcIlxuZXhwb3J0IGNvbnN0IG5vdyA9XG4gIGhhc1dpbmRvdyAmJiB0eXBlb2Ygd2luZG93LnBlcmZvcm1hbmNlICE9PSBcInVuZGVmaW5lZFwiXG4gICAgPyBwZXJmb3JtYW5jZS5ub3cuYmluZChwZXJmb3JtYW5jZSlcbiAgICA6IERhdGUubm93LmJpbmQoRGF0ZSk7XG4iLCIvKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3MgRXZlbnREaXNwYXRjaGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50RGlzcGF0Y2hlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2xpc3RlbmVycyA9IHt9O1xuICAgIHRoaXMuc3RhdHMgPSB7XG4gICAgICBmaXJlZDogMCxcbiAgICAgIGhhbmRsZWQ6IDBcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBhbiBldmVudCBsaXN0ZW5lclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGxpc3RlblxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBDYWxsYmFjayB0byB0cmlnZ2VyIHdoZW4gdGhlIGV2ZW50IGlzIGZpcmVkXG4gICAqL1xuICBhZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzO1xuICAgIGlmIChsaXN0ZW5lcnNbZXZlbnROYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBsaXN0ZW5lcnNbZXZlbnROYW1lXSA9IFtdO1xuICAgIH1cblxuICAgIGlmIChsaXN0ZW5lcnNbZXZlbnROYW1lXS5pbmRleE9mKGxpc3RlbmVyKSA9PT0gLTEpIHtcbiAgICAgIGxpc3RlbmVyc1tldmVudE5hbWVdLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayBpZiBhbiBldmVudCBsaXN0ZW5lciBpcyBhbHJlYWR5IGFkZGVkIHRvIHRoZSBsaXN0IG9mIGxpc3RlbmVyc1xuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGNoZWNrXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gICAqL1xuICBoYXNFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICByZXR1cm4gKFxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0gIT09IHVuZGVmaW5lZCAmJlxuICAgICAgdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV0uaW5kZXhPZihsaXN0ZW5lcikgIT09IC0xXG4gICAgKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmVcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgQ2FsbGJhY2sgZm9yIHRoZSBzcGVjaWZpZWQgZXZlbnRcbiAgICovXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBsaXN0ZW5lcikge1xuICAgIHZhciBsaXN0ZW5lckFycmF5ID0gdGhpcy5fbGlzdGVuZXJzW2V2ZW50TmFtZV07XG4gICAgaWYgKGxpc3RlbmVyQXJyYXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdmFyIGluZGV4ID0gbGlzdGVuZXJBcnJheS5pbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgbGlzdGVuZXJBcnJheS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwYXRjaCBhbiBldmVudFxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXZlbnROYW1lIE5hbWUgb2YgdGhlIGV2ZW50IHRvIGRpc3BhdGNoXG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgKE9wdGlvbmFsKSBFbnRpdHkgdG8gZW1pdFxuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gY29tcG9uZW50XG4gICAqL1xuICBkaXNwYXRjaEV2ZW50KGV2ZW50TmFtZSwgZW50aXR5LCBjb21wb25lbnQpIHtcbiAgICB0aGlzLnN0YXRzLmZpcmVkKys7XG5cbiAgICB2YXIgbGlzdGVuZXJBcnJheSA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBhcnJheSA9IGxpc3RlbmVyQXJyYXkuc2xpY2UoMCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgYXJyYXlbaV0uY2FsbCh0aGlzLCBlbnRpdHksIGNvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IHN0YXRzIGNvdW50ZXJzXG4gICAqL1xuICByZXNldENvdW50ZXJzKCkge1xuICAgIHRoaXMuc3RhdHMuZmlyZWQgPSB0aGlzLnN0YXRzLmhhbmRsZWQgPSAwO1xuICB9XG59XG4iLCJpbXBvcnQgRXZlbnREaXNwYXRjaGVyIGZyb20gXCIuL0V2ZW50RGlzcGF0Y2hlci5qc1wiO1xuaW1wb3J0IHsgcXVlcnlLZXkgfSBmcm9tIFwiLi9VdGlscy5qc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBRdWVyeSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5KENvbXBvbmVudCl9IENvbXBvbmVudHMgTGlzdCBvZiB0eXBlcyBvZiBjb21wb25lbnRzIHRvIHF1ZXJ5XG4gICAqL1xuICBjb25zdHJ1Y3RvcihDb21wb25lbnRzLCBtYW5hZ2VyKSB7XG4gICAgdGhpcy5Db21wb25lbnRzID0gW107XG4gICAgdGhpcy5Ob3RDb21wb25lbnRzID0gW107XG5cbiAgICBDb21wb25lbnRzLmZvckVhY2goY29tcG9uZW50ID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHRoaXMuTm90Q29tcG9uZW50cy5wdXNoKGNvbXBvbmVudC5Db21wb25lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5Db21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLkNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjcmVhdGUgYSBxdWVyeSB3aXRob3V0IGNvbXBvbmVudHNcIik7XG4gICAgfVxuXG4gICAgdGhpcy5lbnRpdGllcyA9IFtdO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKCk7XG5cbiAgICAvLyBUaGlzIHF1ZXJ5IGlzIGJlaW5nIHVzZWQgYnkgYSByZWFjdGl2ZSBzeXN0ZW1cbiAgICB0aGlzLnJlYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLmtleSA9IHF1ZXJ5S2V5KENvbXBvbmVudHMpO1xuXG4gICAgLy8gRmlsbCB0aGUgcXVlcnkgd2l0aCB0aGUgZXhpc3RpbmcgZW50aXRpZXNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hbmFnZXIuX2VudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gbWFuYWdlci5fZW50aXRpZXNbaV07XG4gICAgICBpZiAodGhpcy5tYXRjaChlbnRpdHkpKSB7XG4gICAgICAgIC8vIEB0b2RvID8/PyB0aGlzLmFkZEVudGl0eShlbnRpdHkpOyA9PiBwcmV2ZW50aW5nIHRoZSBldmVudCB0byBiZSBnZW5lcmF0ZWRcbiAgICAgICAgZW50aXR5LnF1ZXJpZXMucHVzaCh0aGlzKTtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBlbnRpdHkgdG8gdGhpcyBxdWVyeVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5XG4gICAqL1xuICBhZGRFbnRpdHkoZW50aXR5KSB7XG4gICAgZW50aXR5LnF1ZXJpZXMucHVzaCh0aGlzKTtcbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoUXVlcnkucHJvdG90eXBlLkVOVElUWV9BRERFRCwgZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZW50aXR5IGZyb20gdGhpcyBxdWVyeVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5XG4gICAqL1xuICByZW1vdmVFbnRpdHkoZW50aXR5KSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XG4gICAgaWYgKH5pbmRleCkge1xuICAgICAgdGhpcy5lbnRpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICBpbmRleCA9IGVudGl0eS5xdWVyaWVzLmluZGV4T2YodGhpcyk7XG4gICAgICBlbnRpdHkucXVlcmllcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBRdWVyeS5wcm90b3R5cGUuRU5USVRZX1JFTU9WRUQsXG4gICAgICAgIGVudGl0eVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBtYXRjaChlbnRpdHkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZW50aXR5Lmhhc0FsbENvbXBvbmVudHModGhpcy5Db21wb25lbnRzKSAmJlxuICAgICAgIWVudGl0eS5oYXNBbnlDb21wb25lbnRzKHRoaXMuTm90Q29tcG9uZW50cylcbiAgICApO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgcmVhY3RpdmU6IHRoaXMucmVhY3RpdmUsXG4gICAgICBjb21wb25lbnRzOiB7XG4gICAgICAgIGluY2x1ZGVkOiB0aGlzLkNvbXBvbmVudHMubWFwKEMgPT4gQy5uYW1lKSxcbiAgICAgICAgbm90OiB0aGlzLk5vdENvbXBvbmVudHMubWFwKEMgPT4gQy5uYW1lKVxuICAgICAgfSxcbiAgICAgIG51bUVudGl0aWVzOiB0aGlzLmVudGl0aWVzLmxlbmd0aFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHN0YXRzIGZvciB0aGlzIHF1ZXJ5XG4gICAqL1xuICBzdGF0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbnVtQ29tcG9uZW50czogdGhpcy5Db21wb25lbnRzLmxlbmd0aCxcbiAgICAgIG51bUVudGl0aWVzOiB0aGlzLmVudGl0aWVzLmxlbmd0aFxuICAgIH07XG4gIH1cbn1cblxuUXVlcnkucHJvdG90eXBlLkVOVElUWV9BRERFRCA9IFwiUXVlcnkjRU5USVRZX0FEREVEXCI7XG5RdWVyeS5wcm90b3R5cGUuRU5USVRZX1JFTU9WRUQgPSBcIlF1ZXJ5I0VOVElUWV9SRU1PVkVEXCI7XG5RdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQgPSBcIlF1ZXJ5I0NPTVBPTkVOVF9DSEFOR0VEXCI7XG4iLCJpbXBvcnQgUXVlcnkgZnJvbSBcIi4vUXVlcnkuanNcIjtcblxuZXhwb3J0IGNsYXNzIFN5c3RlbSB7XG4gIGNhbkV4ZWN1dGUoKSB7XG4gICAgaWYgKHRoaXMuX21hbmRhdG9yeVF1ZXJpZXMubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbWFuZGF0b3J5UXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fbWFuZGF0b3J5UXVlcmllc1tpXTtcbiAgICAgIGlmIChxdWVyeS5lbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3RydWN0b3Iod29ybGQsIGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIC8vIEB0b2RvIEJldHRlciBuYW1pbmcgOilcbiAgICB0aGlzLl9xdWVyaWVzID0ge307XG4gICAgdGhpcy5xdWVyaWVzID0ge307XG5cbiAgICB0aGlzLnByaW9yaXR5ID0gMDtcblxuICAgIC8vIFVzZWQgZm9yIHN0YXRzXG4gICAgdGhpcy5leGVjdXRlVGltZSA9IDA7XG5cbiAgICBpZiAoYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLnByaW9yaXR5KSB7XG4gICAgICB0aGlzLnByaW9yaXR5ID0gYXR0cmlidXRlcy5wcmlvcml0eTtcbiAgICB9XG5cbiAgICB0aGlzLl9tYW5kYXRvcnlRdWVyaWVzID0gW107XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXMpIHtcbiAgICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXMpIHtcbiAgICAgICAgdmFyIHF1ZXJ5Q29uZmlnID0gdGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzW3F1ZXJ5TmFtZV07XG4gICAgICAgIHZhciBDb21wb25lbnRzID0gcXVlcnlDb25maWcuY29tcG9uZW50cztcbiAgICAgICAgaWYgKCFDb21wb25lbnRzIHx8IENvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2NvbXBvbmVudHMnIGF0dHJpYnV0ZSBjYW4ndCBiZSBlbXB0eSBpbiBhIHF1ZXJ5XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBxdWVyeSA9IHRoaXMud29ybGQuZW50aXR5TWFuYWdlci5xdWVyeUNvbXBvbmVudHMoQ29tcG9uZW50cyk7XG4gICAgICAgIHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXSA9IHF1ZXJ5O1xuICAgICAgICBpZiAocXVlcnlDb25maWcubWFuZGF0b3J5ID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5fbWFuZGF0b3J5UXVlcmllcy5wdXNoKHF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXSA9IHtcbiAgICAgICAgICByZXN1bHRzOiBxdWVyeS5lbnRpdGllc1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlYWN0aXZlIGNvbmZpZ3VyYXRpb24gYWRkZWQvcmVtb3ZlZC9jaGFuZ2VkXG4gICAgICAgIHZhciB2YWxpZEV2ZW50cyA9IFtcImFkZGVkXCIsIFwicmVtb3ZlZFwiLCBcImNoYW5nZWRcIl07XG5cbiAgICAgICAgY29uc3QgZXZlbnRNYXBwaW5nID0ge1xuICAgICAgICAgIGFkZGVkOiBRdWVyeS5wcm90b3R5cGUuRU5USVRZX0FEREVELFxuICAgICAgICAgIHJlbW92ZWQ6IFF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfUkVNT1ZFRCxcbiAgICAgICAgICBjaGFuZ2VkOiBRdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQgLy8gUXVlcnkucHJvdG90eXBlLkVOVElUWV9DSEFOR0VEXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHF1ZXJ5Q29uZmlnLmxpc3Rlbikge1xuICAgICAgICAgIHZhbGlkRXZlbnRzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5leGVjdXRlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICBgU3lzdGVtICcke1xuICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICAgICAgICAgICAgfScgaGFzIGRlZmluZWQgbGlzdGVuIGV2ZW50cyAoJHt2YWxpZEV2ZW50cy5qb2luKFxuICAgICAgICAgICAgICAgICAgXCIsIFwiXG4gICAgICAgICAgICAgICAgKX0pIGZvciBxdWVyeSAnJHtxdWVyeU5hbWV9JyBidXQgaXQgZG9lcyBub3QgaW1wbGVtZW50IHRoZSAnZXhlY3V0ZScgbWV0aG9kLmBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSXMgdGhlIGV2ZW50IGVuYWJsZWQgb24gdGhpcyBzeXN0ZW0ncyBxdWVyeT9cbiAgICAgICAgICAgIGlmIChxdWVyeUNvbmZpZy5saXN0ZW5bZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBxdWVyeUNvbmZpZy5saXN0ZW5bZXZlbnROYW1lXTtcblxuICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lID09PSBcImNoYW5nZWRcIikge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LnJlYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgIC8vIEFueSBjaGFuZ2Ugb24gdGhlIGVudGl0eSBmcm9tIHRoZSBjb21wb25lbnRzIGluIHRoZSBxdWVyeVxuICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50TGlzdCA9ICh0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXVtldmVudE5hbWVdID0gW10pO1xuICAgICAgICAgICAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICAgIFF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCxcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBkdXBsaWNhdGVzXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50TGlzdC5pbmRleE9mKGVudGl0eSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKHRoaXMucXVlcmllc1txdWVyeU5hbWVdW2V2ZW50TmFtZV0gPSBbXSk7XG4gICAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELFxuICAgICAgICAgICAgICAgICAgICAoZW50aXR5LCBjaGFuZ2VkQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmluZGV4T2YoY2hhbmdlZENvbXBvbmVudC5jb25zdHJ1Y3RvcikgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgIC8qXG4gICAgICAgICAgICAgICAgICAvLyBDaGVja2luZyBqdXN0IHNwZWNpZmljIGNvbXBvbmVudHNcbiAgICAgICAgICAgICAgICAgIGxldCBjaGFuZ2VkTGlzdCA9ICh0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXVtldmVudE5hbWVdID0ge30pO1xuICAgICAgICAgICAgICAgICAgZXZlbnQuZm9yRWFjaChjb21wb25lbnQgPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKGNoYW5nZWRMaXN0W1xuICAgICAgICAgICAgICAgICAgICAgIGNvbXBvbmVudFByb3BlcnR5TmFtZShjb21wb25lbnQpXG4gICAgICAgICAgICAgICAgICAgIF0gPSBbXSk7XG4gICAgICAgICAgICAgICAgICAgIHF1ZXJ5LmV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgICAgIFF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCxcbiAgICAgICAgICAgICAgICAgICAgICAoZW50aXR5LCBjaGFuZ2VkQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZWRDb21wb25lbnQuY29uc3RydWN0b3IgPT09IGNvbXBvbmVudCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGlzdC5wdXNoKGVudGl0eSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKHRoaXMucXVlcmllc1txdWVyeU5hbWVdW2V2ZW50TmFtZV0gPSBbXSk7XG5cbiAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgIGV2ZW50TWFwcGluZ1tldmVudE5hbWVdLFxuICAgICAgICAgICAgICAgICAgZW50aXR5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gQGZpeG1lIG92ZXJoZWFkP1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRMaXN0LmluZGV4T2YoZW50aXR5KSA9PT0gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZXhlY3V0ZVRpbWUgPSAwO1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgLy8gQHF1ZXN0aW9uIHJlbmFtZSB0byBjbGVhciBxdWV1ZXM/XG4gIGNsZWFyRXZlbnRzKCkge1xuICAgIGZvciAobGV0IHF1ZXJ5TmFtZSBpbiB0aGlzLnF1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMucXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgaWYgKHF1ZXJ5LmFkZGVkKSB7XG4gICAgICAgIHF1ZXJ5LmFkZGVkLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAocXVlcnkucmVtb3ZlZCkge1xuICAgICAgICBxdWVyeS5yZW1vdmVkLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgICBpZiAocXVlcnkuY2hhbmdlZCkge1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShxdWVyeS5jaGFuZ2VkKSkge1xuICAgICAgICAgIHF1ZXJ5LmNoYW5nZWQubGVuZ3RoID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBmb3IgKGxldCBuYW1lIGluIHF1ZXJ5LmNoYW5nZWQpIHtcbiAgICAgICAgICAgIHF1ZXJ5LmNoYW5nZWRbbmFtZV0ubGVuZ3RoID0gMDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0b0pTT04oKSB7XG4gICAgdmFyIGpzb24gPSB7XG4gICAgICBuYW1lOiB0aGlzLmNvbnN0cnVjdG9yLm5hbWUsXG4gICAgICBlbmFibGVkOiB0aGlzLmVuYWJsZWQsXG4gICAgICBleGVjdXRlVGltZTogdGhpcy5leGVjdXRlVGltZSxcbiAgICAgIHByaW9yaXR5OiB0aGlzLnByaW9yaXR5LFxuICAgICAgcXVlcmllczoge31cbiAgICB9O1xuXG4gICAgaWYgKHRoaXMuY29uc3RydWN0b3IucXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJpZXMgPSB0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXM7XG4gICAgICBmb3IgKGxldCBxdWVyeU5hbWUgaW4gcXVlcmllcykge1xuICAgICAgICBsZXQgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXTtcbiAgICAgICAgbGV0IHF1ZXJ5RGVmaW5pdGlvbiA9IHF1ZXJpZXNbcXVlcnlOYW1lXTtcbiAgICAgICAgbGV0IGpzb25RdWVyeSA9IChqc29uLnF1ZXJpZXNbcXVlcnlOYW1lXSA9IHtcbiAgICAgICAgICBrZXk6IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXS5rZXlcbiAgICAgICAgfSk7XG5cbiAgICAgICAganNvblF1ZXJ5Lm1hbmRhdG9yeSA9IHF1ZXJ5RGVmaW5pdGlvbi5tYW5kYXRvcnkgPT09IHRydWU7XG4gICAgICAgIGpzb25RdWVyeS5yZWFjdGl2ZSA9XG4gICAgICAgICAgcXVlcnlEZWZpbml0aW9uLmxpc3RlbiAmJlxuICAgICAgICAgIChxdWVyeURlZmluaXRpb24ubGlzdGVuLmFkZGVkID09PSB0cnVlIHx8XG4gICAgICAgICAgICBxdWVyeURlZmluaXRpb24ubGlzdGVuLnJlbW92ZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHF1ZXJ5RGVmaW5pdGlvbi5saXN0ZW4uY2hhbmdlZCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgQXJyYXkuaXNBcnJheShxdWVyeURlZmluaXRpb24ubGlzdGVuLmNoYW5nZWQpKTtcblxuICAgICAgICBpZiAoanNvblF1ZXJ5LnJlYWN0aXZlKSB7XG4gICAgICAgICAganNvblF1ZXJ5Lmxpc3RlbiA9IHt9O1xuXG4gICAgICAgICAgY29uc3QgbWV0aG9kcyA9IFtcImFkZGVkXCIsIFwicmVtb3ZlZFwiLCBcImNoYW5nZWRcIl07XG4gICAgICAgICAgbWV0aG9kcy5mb3JFYWNoKG1ldGhvZCA9PiB7XG4gICAgICAgICAgICBpZiAocXVlcnlbbWV0aG9kXSkge1xuICAgICAgICAgICAgICBqc29uUXVlcnkubGlzdGVuW21ldGhvZF0gPSB7XG4gICAgICAgICAgICAgICAgZW50aXRpZXM6IHF1ZXJ5W21ldGhvZF0ubGVuZ3RoXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ganNvbjtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gTm90KENvbXBvbmVudCkge1xuICByZXR1cm4ge1xuICAgIG9wZXJhdG9yOiBcIm5vdFwiLFxuICAgIENvbXBvbmVudDogQ29tcG9uZW50XG4gIH07XG59XG4iLCJpbXBvcnQgeyBub3cgfSBmcm9tIFwiLi9VdGlscy5qc1wiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcIi4vU3lzdGVtLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTeXN0ZW1NYW5hZ2VyIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICB0aGlzLl9zeXN0ZW1zID0gW107XG4gICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMgPSBbXTsgLy8gU3lzdGVtcyB0aGF0IGhhdmUgYGV4ZWN1dGVgIG1ldGhvZFxuICAgIHRoaXMud29ybGQgPSB3b3JsZDtcbiAgICB0aGlzLmxhc3RFeGVjdXRlZFN5c3RlbSA9IG51bGw7XG4gIH1cblxuICByZWdpc3RlclN5c3RlbShTeXN0ZW1DbGFzcywgYXR0cmlidXRlcykge1xuICAgIGlmICghKFN5c3RlbUNsYXNzLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN5c3RlbSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFN5c3RlbSAnJHtTeXN0ZW1DbGFzcy5uYW1lfScgZG9lcyBub3QgZXh0ZW5kcyAnU3lzdGVtJyBjbGFzc2BcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLmdldFN5c3RlbShTeXN0ZW1DbGFzcykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS53YXJuKGBTeXN0ZW0gJyR7U3lzdGVtQ2xhc3MubmFtZX0nIGFscmVhZHkgcmVnaXN0ZXJlZC5gKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBzeXN0ZW0gPSBuZXcgU3lzdGVtQ2xhc3ModGhpcy53b3JsZCwgYXR0cmlidXRlcyk7XG4gICAgaWYgKHN5c3RlbS5pbml0KSBzeXN0ZW0uaW5pdChhdHRyaWJ1dGVzKTtcbiAgICBzeXN0ZW0ub3JkZXIgPSB0aGlzLl9zeXN0ZW1zLmxlbmd0aDtcbiAgICB0aGlzLl9zeXN0ZW1zLnB1c2goc3lzdGVtKTtcbiAgICBpZiAoc3lzdGVtLmV4ZWN1dGUpIHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLnB1c2goc3lzdGVtKTtcbiAgICAgIHRoaXMuc29ydFN5c3RlbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bnJlZ2lzdGVyU3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgbGV0IHN5c3RlbSA9IHRoaXMuZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKTtcbiAgICBpZiAoc3lzdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYENhbiB1bnJlZ2lzdGVyIHN5c3RlbSAnJHtTeXN0ZW1DbGFzcy5uYW1lfScuIEl0IGRvZXNuJ3QgZXhpc3QuYFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuX3N5c3RlbXMuc3BsaWNlKHRoaXMuX3N5c3RlbXMuaW5kZXhPZihzeXN0ZW0pLCAxKTtcblxuICAgIGlmIChzeXN0ZW0uZXhlY3V0ZSkge1xuICAgICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuc3BsaWNlKHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLmluZGV4T2Yoc3lzdGVtKSwgMSk7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gQWRkIHN5c3RlbS51bnJlZ2lzdGVyKCkgY2FsbCB0byBmcmVlIHJlc291cmNlc1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc29ydFN5c3RlbXMoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEucHJpb3JpdHkgLSBiLnByaW9yaXR5IHx8IGEub3JkZXIgLSBiLm9yZGVyO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5c3RlbXMuZmluZChzID0+IHMgaW5zdGFuY2VvZiBTeXN0ZW1DbGFzcyk7XG4gIH1cblxuICBnZXRTeXN0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9zeXN0ZW1zO1xuICB9XG5cbiAgcmVtb3ZlU3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5fc3lzdGVtcy5pbmRleE9mKFN5c3RlbUNsYXNzKTtcbiAgICBpZiAoIX5pbmRleCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fc3lzdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgZXhlY3V0ZVN5c3RlbShzeXN0ZW0sIGRlbHRhLCB0aW1lKSB7XG4gICAgaWYgKHN5c3RlbS5pbml0aWFsaXplZCkge1xuICAgICAgaWYgKHN5c3RlbS5jYW5FeGVjdXRlKCkpIHtcbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IG5vdygpO1xuICAgICAgICBzeXN0ZW0uZXhlY3V0ZShkZWx0YSwgdGltZSk7XG4gICAgICAgIHN5c3RlbS5leGVjdXRlVGltZSA9IG5vdygpIC0gc3RhcnRUaW1lO1xuICAgICAgICB0aGlzLmxhc3RFeGVjdXRlZFN5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgc3lzdGVtLmNsZWFyRXZlbnRzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9leGVjdXRlU3lzdGVtcy5mb3JFYWNoKHN5c3RlbSA9PiBzeXN0ZW0uc3RvcCgpKTtcbiAgfVxuXG4gIGV4ZWN1dGUoZGVsdGEsIHRpbWUsIGZvcmNlUGxheSkge1xuICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLmZvckVhY2goXG4gICAgICBzeXN0ZW0gPT5cbiAgICAgICAgKGZvcmNlUGxheSB8fCBzeXN0ZW0uZW5hYmxlZCkgJiYgdGhpcy5leGVjdXRlU3lzdGVtKHN5c3RlbSwgZGVsdGEsIHRpbWUpXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHtcbiAgICAgIG51bVN5c3RlbXM6IHRoaXMuX3N5c3RlbXMubGVuZ3RoLFxuICAgICAgc3lzdGVtczoge31cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zeXN0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3lzdGVtID0gdGhpcy5fc3lzdGVtc1tpXTtcbiAgICAgIHZhciBzeXN0ZW1TdGF0cyA9IChzdGF0cy5zeXN0ZW1zW3N5c3RlbS5jb25zdHJ1Y3Rvci5uYW1lXSA9IHtcbiAgICAgICAgcXVlcmllczoge30sXG4gICAgICAgIGV4ZWN1dGVUaW1lOiBzeXN0ZW0uZXhlY3V0ZVRpbWVcbiAgICAgIH0pO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBzeXN0ZW0uY3R4KSB7XG4gICAgICAgIHN5c3RlbVN0YXRzLnF1ZXJpZXNbbmFtZV0gPSBzeXN0ZW0uY3R4W25hbWVdLnN0YXRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRzO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgT2JqZWN0UG9vbCB7XG4gIC8vIEB0b2RvIEFkZCBpbml0aWFsIHNpemVcbiAgY29uc3RydWN0b3IoYmFzZU9iamVjdCwgaW5pdGlhbFNpemUpIHtcbiAgICB0aGlzLmZyZWVMaXN0ID0gW107XG4gICAgdGhpcy5jb3VudCA9IDA7XG4gICAgdGhpcy5iYXNlT2JqZWN0ID0gYmFzZU9iamVjdDtcbiAgICB0aGlzLmlzT2JqZWN0UG9vbCA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIGluaXRpYWxTaXplICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICB0aGlzLmV4cGFuZChpbml0aWFsU2l6ZSk7XG4gICAgfVxuICB9XG5cbiAgYWNxdWlyZSgpIHtcbiAgICAvLyBHcm93IHRoZSBsaXN0IGJ5IDIwJWlzaCBpZiB3ZSdyZSBvdXRcbiAgICBpZiAodGhpcy5mcmVlTGlzdC5sZW5ndGggPD0gMCkge1xuICAgICAgdGhpcy5leHBhbmQoTWF0aC5yb3VuZCh0aGlzLmNvdW50ICogMC4yKSArIDEpO1xuICAgIH1cblxuICAgIHZhciBpdGVtID0gdGhpcy5mcmVlTGlzdC5wb3AoKTtcblxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgcmVsZWFzZShpdGVtKSB7XG4gICAgaXRlbS5yZXNldCgpO1xuICAgIHRoaXMuZnJlZUxpc3QucHVzaChpdGVtKTtcbiAgfVxuXG4gIGV4cGFuZChjb3VudCkge1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgY291bnQ7IG4rKykge1xuICAgICAgdmFyIGNsb25lID0gbmV3IHRoaXMuYmFzZU9iamVjdCgpO1xuICAgICAgY2xvbmUuX3Bvb2wgPSB0aGlzO1xuICAgICAgdGhpcy5mcmVlTGlzdC5wdXNoKGNsb25lKTtcbiAgICB9XG4gICAgdGhpcy5jb3VudCArPSBjb3VudDtcbiAgfVxuXG4gIHRvdGFsU2l6ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jb3VudDtcbiAgfVxuXG4gIHRvdGFsRnJlZSgpIHtcbiAgICByZXR1cm4gdGhpcy5mcmVlTGlzdC5sZW5ndGg7XG4gIH1cblxuICB0b3RhbFVzZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQgLSB0aGlzLmZyZWVMaXN0Lmxlbmd0aDtcbiAgfVxufVxuIiwiaW1wb3J0IFF1ZXJ5IGZyb20gXCIuL1F1ZXJ5LmpzXCI7XG5pbXBvcnQgeyBxdWVyeUtleSB9IGZyb20gXCIuL1V0aWxzLmpzXCI7XG5cbi8qKlxuICogQHByaXZhdGVcbiAqIEBjbGFzcyBRdWVyeU1hbmFnZXJcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVlcnlNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICB0aGlzLl93b3JsZCA9IHdvcmxkO1xuXG4gICAgLy8gUXVlcmllcyBpbmRleGVkIGJ5IGEgdW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoZSBjb21wb25lbnRzIGl0IGhhc1xuICAgIHRoaXMuX3F1ZXJpZXMgPSB7fTtcbiAgfVxuXG4gIG9uRW50aXR5UmVtb3ZlZChlbnRpdHkpIHtcbiAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5fcXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgaWYgKGVudGl0eS5xdWVyaWVzLmluZGV4T2YocXVlcnkpICE9PSAtMSkge1xuICAgICAgICBxdWVyeS5yZW1vdmVFbnRpdHkoZW50aXR5KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgd2hlbiBhIGNvbXBvbmVudCBpcyBhZGRlZCB0byBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgdGhhdCBqdXN0IGdvdCB0aGUgbmV3IGNvbXBvbmVudFxuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50IENvbXBvbmVudCBhZGRlZCB0byB0aGUgZW50aXR5XG4gICAqL1xuICBvbkVudGl0eUNvbXBvbmVudEFkZGVkKGVudGl0eSwgQ29tcG9uZW50KSB7XG4gICAgLy8gQHRvZG8gVXNlIGJpdG1hc2sgZm9yIGNoZWNraW5nIGNvbXBvbmVudHM/XG5cbiAgICAvLyBDaGVjayBlYWNoIGluZGV4ZWQgcXVlcnkgdG8gc2VlIGlmIHdlIG5lZWQgdG8gYWRkIHRoaXMgZW50aXR5IHRvIHRoZSBsaXN0XG4gICAgZm9yICh2YXIgcXVlcnlOYW1lIGluIHRoaXMuX3F1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXTtcblxuICAgICAgaWYgKFxuICAgICAgICAhIX5xdWVyeS5Ob3RDb21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAmJlxuICAgICAgICB+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpXG4gICAgICApIHtcbiAgICAgICAgcXVlcnkucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICAvLyBBZGQgdGhlIGVudGl0eSBvbmx5IGlmOlxuICAgICAgLy8gQ29tcG9uZW50IGlzIGluIHRoZSBxdWVyeVxuICAgICAgLy8gYW5kIEVudGl0eSBoYXMgQUxMIHRoZSBjb21wb25lbnRzIG9mIHRoZSBxdWVyeVxuICAgICAgLy8gYW5kIEVudGl0eSBpcyBub3QgYWxyZWFkeSBpbiB0aGUgcXVlcnlcbiAgICAgIGlmIChcbiAgICAgICAgIX5xdWVyeS5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSB8fFxuICAgICAgICAhcXVlcnkubWF0Y2goZW50aXR5KSB8fFxuICAgICAgICB+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpXG4gICAgICApXG4gICAgICAgIGNvbnRpbnVlO1xuXG4gICAgICBxdWVyeS5hZGRFbnRpdHkoZW50aXR5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgd2hlbiBhIGNvbXBvbmVudCBpcyByZW1vdmVkIGZyb20gYW4gZW50aXR5XG4gICAqIEBwYXJhbSB7RW50aXR5fSBlbnRpdHkgRW50aXR5IHRvIHJlbW92ZSB0aGUgY29tcG9uZW50IGZyb21cbiAgICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudCBDb21wb25lbnQgdG8gcmVtb3ZlIGZyb20gdGhlIGVudGl0eVxuICAgKi9cbiAgb25FbnRpdHlDb21wb25lbnRSZW1vdmVkKGVudGl0eSwgQ29tcG9uZW50KSB7XG4gICAgZm9yICh2YXIgcXVlcnlOYW1lIGluIHRoaXMuX3F1ZXJpZXMpIHtcbiAgICAgIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXTtcblxuICAgICAgaWYgKFxuICAgICAgICAhIX5xdWVyeS5Ob3RDb21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAmJlxuICAgICAgICAhfnF1ZXJ5LmVudGl0aWVzLmluZGV4T2YoZW50aXR5KSAmJlxuICAgICAgICBxdWVyeS5tYXRjaChlbnRpdHkpXG4gICAgICApIHtcbiAgICAgICAgcXVlcnkuYWRkRW50aXR5KGVudGl0eSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoXG4gICAgICAgICEhfnF1ZXJ5LkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICYmXG4gICAgICAgICEhfnF1ZXJ5LmVudGl0aWVzLmluZGV4T2YoZW50aXR5KSAmJlxuICAgICAgICAhcXVlcnkubWF0Y2goZW50aXR5KVxuICAgICAgKSB7XG4gICAgICAgIHF1ZXJ5LnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IGEgcXVlcnkgZm9yIHRoZSBzcGVjaWZpZWQgY29tcG9uZW50c1xuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50cyBDb21wb25lbnRzIHRoYXQgdGhlIHF1ZXJ5IHNob3VsZCBoYXZlXG4gICAqL1xuICBnZXRRdWVyeShDb21wb25lbnRzKSB7XG4gICAgdmFyIGtleSA9IHF1ZXJ5S2V5KENvbXBvbmVudHMpO1xuICAgIHZhciBxdWVyeSA9IHRoaXMuX3F1ZXJpZXNba2V5XTtcbiAgICBpZiAoIXF1ZXJ5KSB7XG4gICAgICB0aGlzLl9xdWVyaWVzW2tleV0gPSBxdWVyeSA9IG5ldyBRdWVyeShDb21wb25lbnRzLCB0aGlzLl93b3JsZCk7XG4gICAgfVxuICAgIHJldHVybiBxdWVyeTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc29tZSBzdGF0cyBmcm9tIHRoaXMgY2xhc3NcbiAgICovXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHt9O1xuICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLl9xdWVyaWVzKSB7XG4gICAgICBzdGF0c1txdWVyeU5hbWVdID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdLnN0YXRzKCk7XG4gICAgfVxuICAgIHJldHVybiBzdGF0cztcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgaWYgKHByb3BzICE9PSBmYWxzZSkge1xuICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHNjaGVtYSkge1xuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHByb3BzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgc2NoZW1hUHJvcCA9IHNjaGVtYVtrZXldO1xuICAgICAgICAgIGlmIChzY2hlbWFQcm9wLmhhc093blByb3BlcnR5KFwiZGVmYXVsdFwiKSkge1xuICAgICAgICAgICAgdGhpc1trZXldID0gc2NoZW1hUHJvcC50eXBlLmNsb25lKHNjaGVtYVByb3AuZGVmYXVsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBzY2hlbWFQcm9wLnR5cGU7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSB0eXBlLmNsb25lKHR5cGUuZGVmYXVsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcG9vbCA9IG51bGw7XG4gIH1cblxuICBjb3B5KHNvdXJjZSkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICBjb25zdCBwcm9wID0gc2NoZW1hW2tleV07XG5cbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBwcm9wLnR5cGUuY29weShzb3VyY2UsIHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoKS5jb3B5KHRoaXMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgIGNvbnN0IHNjaGVtYVByb3AgPSBzY2hlbWFba2V5XTtcblxuICAgICAgaWYgKHNjaGVtYVByb3AuaGFzT3duUHJvcGVydHkoXCJkZWZhdWx0XCIpKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHNjaGVtYVByb3AudHlwZS5jbG9uZShzY2hlbWFQcm9wLmRlZmF1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHNjaGVtYVByb3AudHlwZTtcbiAgICAgICAgdGhpc1trZXldID0gdHlwZS5jbG9uZSh0eXBlLmRlZmF1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuX3Bvb2wpIHtcbiAgICAgIHRoaXMuX3Bvb2wucmVsZWFzZSh0aGlzKTtcbiAgICB9XG4gIH1cbn1cblxuQ29tcG9uZW50LnNjaGVtYSA9IHt9O1xuQ29tcG9uZW50LmlzQ29tcG9uZW50ID0gdHJ1ZTtcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCIuL0NvbXBvbmVudFwiO1xuXG5leHBvcnQgY2xhc3MgU3lzdGVtU3RhdGVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge31cblxuU3lzdGVtU3RhdGVDb21wb25lbnQuaXNTeXN0ZW1TdGF0ZUNvbXBvbmVudCA9IHRydWU7XG4iLCJpbXBvcnQgeyBPYmplY3RQb29sIH0gZnJvbSBcIi4vT2JqZWN0UG9vbC5qc1wiO1xuaW1wb3J0IFF1ZXJ5TWFuYWdlciBmcm9tIFwiLi9RdWVyeU1hbmFnZXIuanNcIjtcbmltcG9ydCBFdmVudERpc3BhdGNoZXIgZnJvbSBcIi4vRXZlbnREaXNwYXRjaGVyLmpzXCI7XG5pbXBvcnQgeyBnZXROYW1lIH0gZnJvbSBcIi4vVXRpbHMuanNcIjtcbmltcG9ydCB7IFN5c3RlbVN0YXRlQ29tcG9uZW50IH0gZnJvbSBcIi4vU3lzdGVtU3RhdGVDb21wb25lbnQuanNcIjtcblxuY2xhc3MgRW50aXR5UG9vbCBleHRlbmRzIE9iamVjdFBvb2wge1xuICBjb25zdHJ1Y3RvcihlbnRpdHlNYW5hZ2VyLCBlbnRpdHlDbGFzcywgaW5pdGlhbFNpemUpIHtcbiAgICBzdXBlcihlbnRpdHlDbGFzcywgdW5kZWZpbmVkKTtcbiAgICB0aGlzLmVudGl0eU1hbmFnZXIgPSBlbnRpdHlNYW5hZ2VyO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU2l6ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5leHBhbmQoaW5pdGlhbFNpemUpO1xuICAgIH1cbiAgfVxuXG4gIGV4cGFuZChjb3VudCkge1xuICAgIGZvciAodmFyIG4gPSAwOyBuIDwgY291bnQ7IG4rKykge1xuICAgICAgdmFyIGNsb25lID0gbmV3IHRoaXMuYmFzZU9iamVjdCh0aGlzLmVudGl0eU1hbmFnZXIpO1xuICAgICAgY2xvbmUuX3Bvb2wgPSB0aGlzO1xuICAgICAgdGhpcy5mcmVlTGlzdC5wdXNoKGNsb25lKTtcbiAgICB9XG4gICAgdGhpcy5jb3VudCArPSBjb3VudDtcbiAgfVxufVxuXG4vKipcbiAqIEBwcml2YXRlXG4gKiBAY2xhc3MgRW50aXR5TWFuYWdlclxuICovXG5leHBvcnQgY2xhc3MgRW50aXR5TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICAgIHRoaXMuY29tcG9uZW50c01hbmFnZXIgPSB3b3JsZC5jb21wb25lbnRzTWFuYWdlcjtcblxuICAgIC8vIEFsbCB0aGUgZW50aXRpZXMgaW4gdGhpcyBpbnN0YW5jZVxuICAgIHRoaXMuX2VudGl0aWVzID0gW107XG4gICAgdGhpcy5fbmV4dEVudGl0eUlkID0gMDtcblxuICAgIHRoaXMuX2VudGl0aWVzQnlOYW1lcyA9IHt9O1xuXG4gICAgdGhpcy5fcXVlcnlNYW5hZ2VyID0gbmV3IFF1ZXJ5TWFuYWdlcih0aGlzKTtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIoKTtcbiAgICB0aGlzLl9lbnRpdHlQb29sID0gbmV3IEVudGl0eVBvb2woXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy53b3JsZC5vcHRpb25zLmVudGl0eUNsYXNzLFxuICAgICAgdGhpcy53b3JsZC5vcHRpb25zLmVudGl0eVBvb2xTaXplXG4gICAgKTtcblxuICAgIC8vIERlZmVycmVkIGRlbGV0aW9uXG4gICAgdGhpcy5lbnRpdGllc1dpdGhDb21wb25lbnRzVG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmVudGl0aWVzVG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmRlZmVycmVkUmVtb3ZhbEVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgZ2V0RW50aXR5QnlOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRpZXNCeU5hbWVzW25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBlbnRpdHlcbiAgICovXG4gIGNyZWF0ZUVudGl0eShuYW1lKSB7XG4gICAgdmFyIGVudGl0eSA9IHRoaXMuX2VudGl0eVBvb2wuYWNxdWlyZSgpO1xuICAgIGVudGl0eS5hbGl2ZSA9IHRydWU7XG4gICAgZW50aXR5Lm5hbWUgPSBuYW1lIHx8IFwiXCI7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGlmICh0aGlzLl9lbnRpdGllc0J5TmFtZXNbbmFtZV0pIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBFbnRpdHkgbmFtZSAnJHtuYW1lfScgYWxyZWFkeSBleGlzdGApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZW50aXRpZXNCeU5hbWVzW25hbWVdID0gZW50aXR5O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2VudGl0aWVzLnB1c2goZW50aXR5KTtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KEVOVElUWV9DUkVBVEVELCBlbnRpdHkpO1xuICAgIHJldHVybiBlbnRpdHk7XG4gIH1cblxuICAvLyBDT01QT05FTlRTXG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbXBvbmVudCB0byBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgd2hlcmUgdGhlIGNvbXBvbmVudCB3aWxsIGJlIGFkZGVkXG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnQgQ29tcG9uZW50IHRvIGJlIGFkZGVkIHRvIHRoZSBlbnRpdHlcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBPcHRpb25hbCB2YWx1ZXMgdG8gcmVwbGFjZSB0aGUgZGVmYXVsdCBhdHRyaWJ1dGVzXG4gICAqL1xuICBlbnRpdHlBZGRDb21wb25lbnQoZW50aXR5LCBDb21wb25lbnQsIHZhbHVlcykge1xuICAgIGlmICghdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5Db21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQXR0ZW1wdGVkIHRvIGFkZCB1bnJlZ2lzdGVyZWQgY29tcG9uZW50IFwiJHtDb21wb25lbnQubmFtZX1cImBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKH5lbnRpdHkuX0NvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KSkge1xuICAgICAgLy8gQHRvZG8gSnVzdCBvbiBkZWJ1ZyBtb2RlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiQ29tcG9uZW50IHR5cGUgYWxyZWFkeSBleGlzdHMgb24gZW50aXR5LlwiLFxuICAgICAgICBlbnRpdHksXG4gICAgICAgIENvbXBvbmVudC5uYW1lXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXMucHVzaChDb21wb25lbnQpO1xuXG4gICAgaWYgKENvbXBvbmVudC5fX3Byb3RvX18gPT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KSB7XG4gICAgICBlbnRpdHkubnVtU3RhdGVDb21wb25lbnRzKys7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBvbmVudFBvb2wgPSB0aGlzLndvcmxkLmNvbXBvbmVudHNNYW5hZ2VyLmdldENvbXBvbmVudHNQb29sKFxuICAgICAgQ29tcG9uZW50XG4gICAgKTtcblxuICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnRQb29sXG4gICAgICA/IGNvbXBvbmVudFBvb2wuYWNxdWlyZSgpXG4gICAgICA6IG5ldyBDb21wb25lbnQodmFsdWVzKTtcblxuICAgIGlmIChjb21wb25lbnRQb29sICYmIHZhbHVlcykge1xuICAgICAgY29tcG9uZW50LmNvcHkodmFsdWVzKTtcbiAgICB9XG5cbiAgICBlbnRpdHkuX2NvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdID0gY29tcG9uZW50O1xuXG4gICAgdGhpcy5fcXVlcnlNYW5hZ2VyLm9uRW50aXR5Q29tcG9uZW50QWRkZWQoZW50aXR5LCBDb21wb25lbnQpO1xuICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50QWRkZWRUb0VudGl0eShDb21wb25lbnQpO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChDT01QT05FTlRfQURERUQsIGVudGl0eSwgQ29tcG9uZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb21wb25lbnQgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgd2hpY2ggd2lsbCBnZXQgcmVtb3ZlZCB0aGUgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7Kn0gQ29tcG9uZW50IENvbXBvbmVudCB0byByZW1vdmUgZnJvbSB0aGUgZW50aXR5XG4gICAqIEBwYXJhbSB7Qm9vbH0gaW1tZWRpYXRlbHkgSWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wb25lbnQgaW1tZWRpYXRlbHkgaW5zdGVhZCBvZiBkZWZlcnJlZCAoRGVmYXVsdCBpcyBmYWxzZSlcbiAgICovXG4gIGVudGl0eVJlbW92ZUNvbXBvbmVudChlbnRpdHksIENvbXBvbmVudCwgaW1tZWRpYXRlbHkpIHtcbiAgICB2YXIgaW5kZXggPSBlbnRpdHkuX0NvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KTtcbiAgICBpZiAoIX5pbmRleCkgcmV0dXJuO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChDT01QT05FTlRfUkVNT1ZFLCBlbnRpdHksIENvbXBvbmVudCk7XG5cbiAgICBpZiAoaW1tZWRpYXRlbHkpIHtcbiAgICAgIHRoaXMuX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5sZW5ndGggPT09IDApXG4gICAgICAgIHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlLnB1c2goZW50aXR5KTtcblxuICAgICAgZW50aXR5Ll9Db21wb25lbnRUeXBlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgZW50aXR5Ll9Db21wb25lbnRUeXBlc1RvUmVtb3ZlLnB1c2goQ29tcG9uZW50KTtcblxuICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXROYW1lKENvbXBvbmVudCk7XG4gICAgICBlbnRpdHkuX2NvbXBvbmVudHNUb1JlbW92ZVtjb21wb25lbnROYW1lXSA9XG4gICAgICAgIGVudGl0eS5fY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICAgIGRlbGV0ZSBlbnRpdHkuX2NvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZWFjaCBpbmRleGVkIHF1ZXJ5IHRvIHNlZSBpZiB3ZSBuZWVkIHRvIHJlbW92ZSBpdFxuICAgIHRoaXMuX3F1ZXJ5TWFuYWdlci5vbkVudGl0eUNvbXBvbmVudFJlbW92ZWQoZW50aXR5LCBDb21wb25lbnQpO1xuXG4gICAgaWYgKENvbXBvbmVudC5fX3Byb3RvX18gPT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KSB7XG4gICAgICBlbnRpdHkubnVtU3RhdGVDb21wb25lbnRzLS07XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBlbnRpdHkgd2FzIGEgZ2hvc3Qgd2FpdGluZyBmb3IgdGhlIGxhc3Qgc3lzdGVtIHN0YXRlIGNvbXBvbmVudCB0byBiZSByZW1vdmVkXG4gICAgICBpZiAoZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cyA9PT0gMCAmJiAhZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIGVudGl0eS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZW50aXR5UmVtb3ZlQ29tcG9uZW50U3luYyhlbnRpdHksIENvbXBvbmVudCwgaW5kZXgpIHtcbiAgICAvLyBSZW1vdmUgVCBsaXN0aW5nIG9uIGVudGl0eSBhbmQgcHJvcGVydHkgcmVmLCB0aGVuIGZyZWUgdGhlIGNvbXBvbmVudC5cbiAgICBlbnRpdHkuX0NvbXBvbmVudFR5cGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXROYW1lKENvbXBvbmVudCk7XG4gICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5fY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICBkZWxldGUgZW50aXR5Ll9jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgIGNvbXBvbmVudC5kaXNwb3NlKCk7XG4gICAgdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5jb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShDb21wb25lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIGNvbXBvbmVudHMgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgZnJvbSB3aGljaCB0aGUgY29tcG9uZW50cyB3aWxsIGJlIHJlbW92ZWRcbiAgICovXG4gIGVudGl0eVJlbW92ZUFsbENvbXBvbmVudHMoZW50aXR5LCBpbW1lZGlhdGVseSkge1xuICAgIGxldCBDb21wb25lbnRzID0gZW50aXR5Ll9Db21wb25lbnRUeXBlcztcblxuICAgIGZvciAobGV0IGogPSBDb21wb25lbnRzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICBpZiAoQ29tcG9uZW50c1tqXS5fX3Byb3RvX18gIT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KVxuICAgICAgICB0aGlzLmVudGl0eVJlbW92ZUNvbXBvbmVudChlbnRpdHksIENvbXBvbmVudHNbal0sIGltbWVkaWF0ZWx5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBlbnRpdHkgZnJvbSB0aGlzIG1hbmFnZXIuIEl0IHdpbGwgY2xlYXIgYWxzbyBpdHMgY29tcG9uZW50c1xuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IEVudGl0eSB0byByZW1vdmUgZnJvbSB0aGUgbWFuYWdlclxuICAgKiBAcGFyYW0ge0Jvb2x9IGltbWVkaWF0ZWx5IElmIHlvdSB3YW50IHRvIHJlbW92ZSB0aGUgY29tcG9uZW50IGltbWVkaWF0ZWx5IGluc3RlYWQgb2YgZGVmZXJyZWQgKERlZmF1bHQgaXMgZmFsc2UpXG4gICAqL1xuICByZW1vdmVFbnRpdHkoZW50aXR5LCBpbW1lZGlhdGVseSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuX2VudGl0aWVzLmluZGV4T2YoZW50aXR5KTtcblxuICAgIGlmICghfmluZGV4KSB0aHJvdyBuZXcgRXJyb3IoXCJUcmllZCB0byByZW1vdmUgZW50aXR5IG5vdCBpbiBsaXN0XCIpO1xuXG4gICAgZW50aXR5LmFsaXZlID0gZmFsc2U7XG5cbiAgICBpZiAoZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cyA9PT0gMCkge1xuICAgICAgLy8gUmVtb3ZlIGZyb20gZW50aXR5IGxpc3RcbiAgICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoRU5USVRZX1JFTU9WRUQsIGVudGl0eSk7XG4gICAgICB0aGlzLl9xdWVyeU1hbmFnZXIub25FbnRpdHlSZW1vdmVkKGVudGl0eSk7XG4gICAgICBpZiAoaW1tZWRpYXRlbHkgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fcmVsZWFzZUVudGl0eShlbnRpdHksIGluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXNUb1JlbW92ZS5wdXNoKGVudGl0eSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbnRpdHlSZW1vdmVBbGxDb21wb25lbnRzKGVudGl0eSwgaW1tZWRpYXRlbHkpO1xuICB9XG5cbiAgX3JlbGVhc2VFbnRpdHkoZW50aXR5LCBpbmRleCkge1xuICAgIHRoaXMuX2VudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBpZiAodGhpcy5fZW50aXRpZXNCeU5hbWVzW2VudGl0eS5uYW1lXSkge1xuICAgICAgZGVsZXRlIHRoaXMuX2VudGl0aWVzQnlOYW1lc1tlbnRpdHkubmFtZV07XG4gICAgfVxuICAgIGVudGl0eS5fcG9vbC5yZWxlYXNlKGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBlbnRpdGllcyBmcm9tIHRoaXMgbWFuYWdlclxuICAgKi9cbiAgcmVtb3ZlQWxsRW50aXRpZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IHRoaXMuX2VudGl0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLnJlbW92ZUVudGl0eSh0aGlzLl9lbnRpdGllc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc0RlZmVycmVkUmVtb3ZhbCgpIHtcbiAgICBpZiAoIXRoaXMuZGVmZXJyZWRSZW1vdmFsRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllc1RvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdGhpcy5lbnRpdGllc1RvUmVtb3ZlW2ldO1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5fZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpO1xuICAgICAgdGhpcy5fcmVsZWFzZUVudGl0eShlbnRpdHksIGluZGV4KTtcbiAgICB9XG4gICAgdGhpcy5lbnRpdGllc1RvUmVtb3ZlLmxlbmd0aCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdGhpcy5lbnRpdGllc1dpdGhDb21wb25lbnRzVG9SZW1vdmVbaV07XG4gICAgICB3aGlsZSAoZW50aXR5Ll9Db21wb25lbnRUeXBlc1RvUmVtb3ZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IENvbXBvbmVudCA9IGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5wb3AoKTtcblxuICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldE5hbWUoQ29tcG9uZW50KTtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5fY29tcG9uZW50c1RvUmVtb3ZlW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICBkZWxldGUgZW50aXR5Ll9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV07XG4gICAgICAgIGNvbXBvbmVudC5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkoQ29tcG9uZW50KTtcblxuICAgICAgICAvL3RoaXMuX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZS5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHF1ZXJ5IGJhc2VkIG9uIGEgbGlzdCBvZiBjb21wb25lbnRzXG4gICAqIEBwYXJhbSB7QXJyYXkoQ29tcG9uZW50KX0gQ29tcG9uZW50cyBMaXN0IG9mIGNvbXBvbmVudHMgdGhhdCB3aWxsIGZvcm0gdGhlIHF1ZXJ5XG4gICAqL1xuICBxdWVyeUNvbXBvbmVudHMoQ29tcG9uZW50cykge1xuICAgIHJldHVybiB0aGlzLl9xdWVyeU1hbmFnZXIuZ2V0UXVlcnkoQ29tcG9uZW50cyk7XG4gIH1cblxuICAvLyBFWFRSQVNcblxuICAvKipcbiAgICogUmV0dXJuIG51bWJlciBvZiBlbnRpdGllc1xuICAgKi9cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc29tZSBzdGF0c1xuICAgKi9cbiAgc3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0ge1xuICAgICAgbnVtRW50aXRpZXM6IHRoaXMuX2VudGl0aWVzLmxlbmd0aCxcbiAgICAgIG51bVF1ZXJpZXM6IE9iamVjdC5rZXlzKHRoaXMuX3F1ZXJ5TWFuYWdlci5fcXVlcmllcykubGVuZ3RoLFxuICAgICAgcXVlcmllczogdGhpcy5fcXVlcnlNYW5hZ2VyLnN0YXRzKCksXG4gICAgICBudW1Db21wb25lbnRQb29sOiBPYmplY3Qua2V5cyh0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLl9jb21wb25lbnRQb29sKVxuICAgICAgICAubGVuZ3RoLFxuICAgICAgY29tcG9uZW50UG9vbDoge30sXG4gICAgICBldmVudERpc3BhdGNoZXI6IHRoaXMuZXZlbnREaXNwYXRjaGVyLnN0YXRzXG4gICAgfTtcblxuICAgIGZvciAodmFyIGNuYW1lIGluIHRoaXMuY29tcG9uZW50c01hbmFnZXIuX2NvbXBvbmVudFBvb2wpIHtcbiAgICAgIHZhciBwb29sID0gdGhpcy5jb21wb25lbnRzTWFuYWdlci5fY29tcG9uZW50UG9vbFtjbmFtZV07XG4gICAgICBzdGF0cy5jb21wb25lbnRQb29sW2NuYW1lXSA9IHtcbiAgICAgICAgdXNlZDogcG9vbC50b3RhbFVzZWQoKSxcbiAgICAgICAgc2l6ZTogcG9vbC5jb3VudFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHM7XG4gIH1cbn1cblxuY29uc3QgRU5USVRZX0NSRUFURUQgPSBcIkVudGl0eU1hbmFnZXIjRU5USVRZX0NSRUFURVwiO1xuY29uc3QgRU5USVRZX1JFTU9WRUQgPSBcIkVudGl0eU1hbmFnZXIjRU5USVRZX1JFTU9WRURcIjtcbmNvbnN0IENPTVBPTkVOVF9BRERFRCA9IFwiRW50aXR5TWFuYWdlciNDT01QT05FTlRfQURERURcIjtcbmNvbnN0IENPTVBPTkVOVF9SRU1PVkUgPSBcIkVudGl0eU1hbmFnZXIjQ09NUE9ORU5UX1JFTU9WRVwiO1xuIiwiaW1wb3J0IHsgT2JqZWN0UG9vbCB9IGZyb20gXCIuL09iamVjdFBvb2wuanNcIjtcbmltcG9ydCB7IGNvbXBvbmVudFByb3BlcnR5TmFtZSB9IGZyb20gXCIuL1V0aWxzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBDb21wb25lbnRNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5Db21wb25lbnRzID0ge307XG4gICAgdGhpcy5fY29tcG9uZW50UG9vbCA9IHt9O1xuICAgIHRoaXMubnVtQ29tcG9uZW50cyA9IHt9O1xuICB9XG5cbiAgcmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50LCBvYmplY3RQb29sKSB7XG4gICAgaWYgKHRoaXMuQ29tcG9uZW50c1tDb21wb25lbnQubmFtZV0pIHtcbiAgICAgIGNvbnNvbGUud2FybihgQ29tcG9uZW50IHR5cGU6ICcke0NvbXBvbmVudC5uYW1lfScgYWxyZWFkeSByZWdpc3RlcmVkLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjaGVtYSA9IENvbXBvbmVudC5zY2hlbWE7XG5cbiAgICBpZiAoIXNjaGVtYSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb21wb25lbnQgXCIke0NvbXBvbmVudC5uYW1lfVwiIGhhcyBubyBzY2hlbWEgcHJvcGVydHkuYCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wTmFtZSBpbiBzY2hlbWEpIHtcbiAgICAgIGNvbnN0IHByb3AgPSBzY2hlbWFbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoIXByb3AudHlwZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgc2NoZW1hIGZvciBjb21wb25lbnQgXCIke0NvbXBvbmVudC5uYW1lfVwiLiBNaXNzaW5nIHR5cGUgZm9yIFwiJHtwcm9wTmFtZX1cIiBwcm9wZXJ0eS5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5Db21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSA9IENvbXBvbmVudDtcbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdID0gMDtcblxuICAgIGlmIChvYmplY3RQb29sID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9iamVjdFBvb2wgPSBuZXcgT2JqZWN0UG9vbChDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqZWN0UG9vbCA9PT0gZmFsc2UpIHtcbiAgICAgIG9iamVjdFBvb2wgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29tcG9uZW50UG9vbFtDb21wb25lbnQubmFtZV0gPSBvYmplY3RQb29sO1xuICB9XG5cbiAgY29tcG9uZW50QWRkZWRUb0VudGl0eShDb21wb25lbnQpIHtcbiAgICBpZiAoIXRoaXMuQ29tcG9uZW50c1tDb21wb25lbnQubmFtZV0pIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdKys7XG4gIH1cblxuICBjb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShDb21wb25lbnQpIHtcbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdLS07XG4gIH1cblxuICBnZXRDb21wb25lbnRzUG9vbChDb21wb25lbnQpIHtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudFByb3BlcnR5TmFtZShDb21wb25lbnQpO1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRQb29sW2NvbXBvbmVudE5hbWVdO1xuICB9XG59XG4iLCJpbXBvcnQgcGpzb24gZnJvbSBcIi4uL3BhY2thZ2UuanNvblwiO1xuZXhwb3J0IGNvbnN0IFZlcnNpb24gPSBwanNvbi52ZXJzaW9uO1xuIiwiaW1wb3J0IFF1ZXJ5IGZyb20gXCIuL1F1ZXJ5LmpzXCI7XG5pbXBvcnQgd3JhcEltbXV0YWJsZUNvbXBvbmVudCBmcm9tIFwiLi9XcmFwSW1tdXRhYmxlQ29tcG9uZW50LmpzXCI7XG5cbi8vIEB0b2RvIFRha2UgdGhpcyBvdXQgZnJvbSB0aGVyZSBvciB1c2UgRU5WXG5jb25zdCBERUJVRyA9IGZhbHNlO1xuXG5leHBvcnQgY2xhc3MgRW50aXR5IHtcbiAgY29uc3RydWN0b3IoZW50aXR5TWFuYWdlcikge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIgPSBlbnRpdHlNYW5hZ2VyIHx8IG51bGw7XG5cbiAgICAvLyBVbmlxdWUgSUQgZm9yIHRoaXMgZW50aXR5XG4gICAgdGhpcy5pZCA9IGVudGl0eU1hbmFnZXIuX25leHRFbnRpdHlJZCsrO1xuXG4gICAgLy8gTGlzdCBvZiBjb21wb25lbnRzIHR5cGVzIHRoZSBlbnRpdHkgaGFzXG4gICAgdGhpcy5fQ29tcG9uZW50VHlwZXMgPSBbXTtcblxuICAgIC8vIEluc3RhbmNlIG9mIHRoZSBjb21wb25lbnRzXG4gICAgdGhpcy5fY29tcG9uZW50cyA9IHt9O1xuXG4gICAgdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlID0ge307XG5cbiAgICAvLyBRdWVyaWVzIHdoZXJlIHRoZSBlbnRpdHkgaXMgYWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMgPSBbXTtcblxuICAgIC8vIFVzZWQgZm9yIGRlZmVycmVkIHJlbW92YWxcbiAgICB0aGlzLl9Db21wb25lbnRUeXBlc1RvUmVtb3ZlID0gW107XG5cbiAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG5cbiAgICAvL2lmIHRoZXJlIGFyZSBzdGF0ZSBjb21wb25lbnRzIG9uIGEgZW50aXR5LCBpdCBjYW4ndCBiZSByZW1vdmVkIGNvbXBsZXRlbHlcbiAgICB0aGlzLm51bVN0YXRlQ29tcG9uZW50cyA9IDA7XG4gIH1cblxuICAvLyBDT01QT05FTlRTXG5cbiAgZ2V0Q29tcG9uZW50KENvbXBvbmVudCwgaW5jbHVkZVJlbW92ZWQpIHtcbiAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1tDb21wb25lbnQubmFtZV07XG5cbiAgICBpZiAoIWNvbXBvbmVudCAmJiBpbmNsdWRlUmVtb3ZlZCA9PT0gdHJ1ZSkge1xuICAgICAgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5uYW1lXTtcbiAgICB9XG5cbiAgICByZXR1cm4gREVCVUcgPyB3cmFwSW1tdXRhYmxlQ29tcG9uZW50KENvbXBvbmVudCwgY29tcG9uZW50KSA6IGNvbXBvbmVudDtcbiAgfVxuXG4gIGdldFJlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZVtDb21wb25lbnQubmFtZV07XG4gIH1cblxuICBnZXRDb21wb25lbnRzKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzO1xuICB9XG5cbiAgZ2V0Q29tcG9uZW50c1RvUmVtb3ZlKCkge1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmU7XG4gIH1cblxuICBnZXRDb21wb25lbnRUeXBlcygpIHtcbiAgICByZXR1cm4gdGhpcy5fQ29tcG9uZW50VHlwZXM7XG4gIH1cblxuICBnZXRNdXRhYmxlQ29tcG9uZW50KENvbXBvbmVudCkge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW0NvbXBvbmVudC5uYW1lXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW2ldO1xuICAgICAgLy8gQHRvZG8gYWNjZWxlcmF0ZSB0aGlzIGNoZWNrLiBNYXliZSBoYXZpbmcgcXVlcnkuX0NvbXBvbmVudHMgYXMgYW4gb2JqZWN0XG4gICAgICAvLyBAdG9kbyBhZGQgTm90IGNvbXBvbmVudHNcbiAgICAgIGlmIChxdWVyeS5yZWFjdGl2ZSAmJiBxdWVyeS5Db21wb25lbnRzLmluZGV4T2YoQ29tcG9uZW50KSAhPT0gLTEpIHtcbiAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoXG4gICAgICAgICAgUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELFxuICAgICAgICAgIHRoaXMsXG4gICAgICAgICAgY29tcG9uZW50XG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb21wb25lbnQ7XG4gIH1cblxuICBhZGRDb21wb25lbnQoQ29tcG9uZW50LCB2YWx1ZXMpIHtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLmVudGl0eUFkZENvbXBvbmVudCh0aGlzLCBDb21wb25lbnQsIHZhbHVlcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW1vdmVDb21wb25lbnQoQ29tcG9uZW50LCBmb3JjZUltbWVkaWF0ZSkge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5UmVtb3ZlQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudCwgZm9yY2VJbW1lZGlhdGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgaGFzQ29tcG9uZW50KENvbXBvbmVudCwgaW5jbHVkZVJlbW92ZWQpIHtcbiAgICByZXR1cm4gKFxuICAgICAgISF+dGhpcy5fQ29tcG9uZW50VHlwZXMuaW5kZXhPZihDb21wb25lbnQpIHx8XG4gICAgICAoaW5jbHVkZVJlbW92ZWQgPT09IHRydWUgJiYgdGhpcy5oYXNSZW1vdmVkQ29tcG9uZW50KENvbXBvbmVudCkpXG4gICAgKTtcbiAgfVxuXG4gIGhhc1JlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuICEhfnRoaXMuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUuaW5kZXhPZihDb21wb25lbnQpO1xuICB9XG5cbiAgaGFzQWxsQ29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzQ29tcG9uZW50KENvbXBvbmVudHNbaV0pKSByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaGFzQW55Q29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5oYXNDb21wb25lbnQoQ29tcG9uZW50c1tpXSkpIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZW1vdmVBbGxDb21wb25lbnRzKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5UmVtb3ZlQWxsQ29tcG9uZW50cyh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cblxuICBjb3B5KHNyYykge1xuICAgIC8vIFRPRE86IFRoaXMgY2FuIGRlZmluaXRlbHkgYmUgb3B0aW1pemVkXG4gICAgZm9yICh2YXIgY29tcG9uZW50TmFtZSBpbiBzcmMuX2NvbXBvbmVudHMpIHtcbiAgICAgIHZhciBzcmNDb21wb25lbnQgPSBzcmMuX2NvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgICB0aGlzLmFkZENvbXBvbmVudChzcmNDb21wb25lbnQuY29uc3RydWN0b3IpO1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuZ2V0Q29tcG9uZW50KHNyY0NvbXBvbmVudC5jb25zdHJ1Y3Rvcik7XG4gICAgICBjb21wb25lbnQuY29weShzcmNDb21wb25lbnQpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBFbnRpdHkodGhpcy5fZW50aXR5TWFuYWdlcikuY29weSh0aGlzKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuaWQgPSB0aGlzLl9lbnRpdHlNYW5hZ2VyLl9uZXh0RW50aXR5SWQrKztcbiAgICB0aGlzLl9Db21wb25lbnRUeXBlcy5sZW5ndGggPSAwO1xuICAgIHRoaXMucXVlcmllcy5sZW5ndGggPSAwO1xuXG4gICAgZm9yICh2YXIgY29tcG9uZW50TmFtZSBpbiB0aGlzLmNvbXBvbmVudHMpIHtcbiAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShmb3JjZUltbWVkaWF0ZSkge1xuICAgIHJldHVybiB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eSh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IFN5c3RlbU1hbmFnZXIgfSBmcm9tIFwiLi9TeXN0ZW1NYW5hZ2VyLmpzXCI7XG5pbXBvcnQgeyBFbnRpdHlNYW5hZ2VyIH0gZnJvbSBcIi4vRW50aXR5TWFuYWdlci5qc1wiO1xuaW1wb3J0IHsgQ29tcG9uZW50TWFuYWdlciB9IGZyb20gXCIuL0NvbXBvbmVudE1hbmFnZXIuanNcIjtcbmltcG9ydCB7IFZlcnNpb24gfSBmcm9tIFwiLi9WZXJzaW9uLmpzXCI7XG5pbXBvcnQgeyBoYXNXaW5kb3csIG5vdyB9IGZyb20gXCIuL1V0aWxzLmpzXCI7XG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tIFwiLi9FbnRpdHkuanNcIjtcblxuY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICBlbnRpdHlQb29sU2l6ZTogMCxcbiAgZW50aXR5Q2xhc3M6IEVudGl0eVxufTtcblxuZXhwb3J0IGNsYXNzIFdvcmxkIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKTtcblxuICAgIHRoaXMuY29tcG9uZW50c01hbmFnZXIgPSBuZXcgQ29tcG9uZW50TWFuYWdlcih0aGlzKTtcbiAgICB0aGlzLmVudGl0eU1hbmFnZXIgPSBuZXcgRW50aXR5TWFuYWdlcih0aGlzKTtcbiAgICB0aGlzLnN5c3RlbU1hbmFnZXIgPSBuZXcgU3lzdGVtTWFuYWdlcih0aGlzKTtcblxuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG5cbiAgICB0aGlzLmV2ZW50UXVldWVzID0ge307XG5cbiAgICBpZiAoaGFzV2luZG93ICYmIHR5cGVvZiBDdXN0b21FdmVudCAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdmFyIGV2ZW50ID0gbmV3IEN1c3RvbUV2ZW50KFwiZWNzeS13b3JsZC1jcmVhdGVkXCIsIHtcbiAgICAgICAgZGV0YWlsOiB7IHdvcmxkOiB0aGlzLCB2ZXJzaW9uOiBWZXJzaW9uIH1cbiAgICAgIH0pO1xuICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgIH1cblxuICAgIHRoaXMubGFzdFRpbWUgPSBub3coKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tcG9uZW50KENvbXBvbmVudCwgb2JqZWN0UG9vbCkge1xuICAgIHRoaXMuY29tcG9uZW50c01hbmFnZXIucmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50LCBvYmplY3RQb29sKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlZ2lzdGVyU3lzdGVtKFN5c3RlbSwgYXR0cmlidXRlcykge1xuICAgIHRoaXMuc3lzdGVtTWFuYWdlci5yZWdpc3RlclN5c3RlbShTeXN0ZW0sIGF0dHJpYnV0ZXMpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdW5yZWdpc3RlclN5c3RlbShTeXN0ZW0pIHtcbiAgICB0aGlzLnN5c3RlbU1hbmFnZXIudW5yZWdpc3RlclN5c3RlbShTeXN0ZW0pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuc3lzdGVtTWFuYWdlci5nZXRTeXN0ZW0oU3lzdGVtQ2xhc3MpO1xuICB9XG5cbiAgZ2V0U3lzdGVtcygpIHtcbiAgICByZXR1cm4gdGhpcy5zeXN0ZW1NYW5hZ2VyLmdldFN5c3RlbXMoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoZGVsdGEsIHRpbWUpIHtcbiAgICBpZiAoIWRlbHRhKSB7XG4gICAgICB0aW1lID0gbm93KCk7XG4gICAgICBkZWx0YSA9IHRpbWUgLSB0aGlzLmxhc3RUaW1lO1xuICAgICAgdGhpcy5sYXN0VGltZSA9IHRpbWU7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZW5hYmxlZCkge1xuICAgICAgdGhpcy5zeXN0ZW1NYW5hZ2VyLmV4ZWN1dGUoZGVsdGEsIHRpbWUpO1xuICAgICAgdGhpcy5lbnRpdHlNYW5hZ2VyLnByb2Nlc3NEZWZlcnJlZFJlbW92YWwoKTtcbiAgICB9XG4gIH1cblxuICBzdG9wKCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IGZhbHNlO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgY3JlYXRlRW50aXR5KG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5lbnRpdHlNYW5hZ2VyLmNyZWF0ZUVudGl0eShuYW1lKTtcbiAgfVxuXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHtcbiAgICAgIGVudGl0aWVzOiB0aGlzLmVudGl0eU1hbmFnZXIuc3RhdHMoKSxcbiAgICAgIHN5c3RlbTogdGhpcy5zeXN0ZW1NYW5hZ2VyLnN0YXRzKClcbiAgICB9O1xuXG4gICAgY29uc29sZS5sb2coSlNPTi5zdHJpbmdpZnkoc3RhdHMsIG51bGwsIDIpKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcIi4vQ29tcG9uZW50XCI7XG5cbmV4cG9ydCBjbGFzcyBUYWdDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcihmYWxzZSk7XG4gIH1cbn1cblxuVGFnQ29tcG9uZW50LmlzVGFnQ29tcG9uZW50ID0gdHJ1ZTtcbiIsImV4cG9ydCBjb25zdCBjb3B5VmFsdWUgPSAoc3JjLCBkZXN0LCBrZXkpID0+IChkZXN0W2tleV0gPSBzcmNba2V5XSk7XG5cbmV4cG9ydCBjb25zdCBjbG9uZVZhbHVlID0gc3JjID0+IHNyYztcblxuZXhwb3J0IGNvbnN0IGNvcHlBcnJheSA9IChzcmMsIGRlc3QsIGtleSkgPT4ge1xuICBjb25zdCBzcmNBcnJheSA9IHNyY1trZXldO1xuICBjb25zdCBkZXN0QXJyYXkgPSBkZXN0W2tleV07XG5cbiAgZGVzdEFycmF5Lmxlbmd0aCA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGRlc3RBcnJheS5wdXNoKHNyY0FycmF5W2ldKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0QXJyYXk7XG59O1xuXG5leHBvcnQgY29uc3QgY2xvbmVBcnJheSA9IHNyYyA9PiBzcmMuc2xpY2UoKTtcblxuZXhwb3J0IGNvbnN0IGNvcHlKU09OID0gKHNyYywgZGVzdCwga2V5KSA9PlxuICAoZGVzdFtrZXldID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShzcmNba2V5XSkpKTtcblxuZXhwb3J0IGNvbnN0IGNsb25lSlNPTiA9IHNyYyA9PiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNyYykpO1xuXG5leHBvcnQgY29uc3QgY29weUNvcHlhYmxlID0gKHNyYywgZGVzdCwga2V5KSA9PiBkZXN0W2tleV0uY29weShzcmNba2V5XSk7XG5cbmV4cG9ydCBjb25zdCBjbG9uZUNsb25hYmxlID0gc3JjID0+IHNyYy5jbG9uZSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlVHlwZSh0eXBlRGVmaW5pdGlvbikge1xuICB2YXIgbWFuZGF0b3J5UHJvcGVydGllcyA9IFtcIm5hbWVcIiwgXCJkZWZhdWx0XCIsIFwiY29weVwiLCBcImNsb25lXCJdO1xuXG4gIHZhciB1bmRlZmluZWRQcm9wZXJ0aWVzID0gbWFuZGF0b3J5UHJvcGVydGllcy5maWx0ZXIocCA9PiB7XG4gICAgcmV0dXJuICF0eXBlRGVmaW5pdGlvbi5oYXNPd25Qcm9wZXJ0eShwKTtcbiAgfSk7XG5cbiAgaWYgKHVuZGVmaW5lZFByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBjcmVhdGVUeXBlIGV4cGVjdHMgYSB0eXBlIGRlZmluaXRpb24gd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6ICR7dW5kZWZpbmVkUHJvcGVydGllcy5qb2luKFxuICAgICAgICBcIiwgXCJcbiAgICAgICl9YFxuICAgICk7XG4gIH1cblxuICB0eXBlRGVmaW5pdGlvbi5pc1R5cGUgPSB0cnVlO1xuXG4gIHJldHVybiB0eXBlRGVmaW5pdGlvbjtcbn1cblxuLyoqXG4gKiBTdGFuZGFyZCB0eXBlc1xuICovXG5leHBvcnQgY29uc3QgVHlwZXMgPSB7XG4gIE51bWJlcjogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJOdW1iZXJcIixcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvcHk6IGNvcHlWYWx1ZSxcbiAgICBjbG9uZTogY2xvbmVWYWx1ZVxuICB9KSxcblxuICBCb29sZWFuOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIkJvb2xlYW5cIixcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb3B5OiBjb3B5VmFsdWUsXG4gICAgY2xvbmU6IGNsb25lVmFsdWVcbiAgfSksXG5cbiAgU3RyaW5nOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIlN0cmluZ1wiLFxuICAgIGRlZmF1bHQ6IFwiXCIsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlXG4gIH0pLFxuXG4gIEFycmF5OiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIkFycmF5XCIsXG4gICAgZGVmYXVsdDogW10sXG4gICAgY29weTogY29weUFycmF5LFxuICAgIGNsb25lOiBjbG9uZUFycmF5XG4gIH0pLFxuXG4gIE9iamVjdDogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJPYmplY3RcIixcbiAgICBkZWZhdWx0OiB1bmRlZmluZWQsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlXG4gIH0pLFxuXG4gIEpTT046IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiSlNPTlwiLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgY29weTogY29weUpTT04sXG4gICAgY2xvbmU6IGNsb25lSlNPTlxuICB9KVxufTtcbiIsImV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZUlkKGxlbmd0aCkge1xuICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgdmFyIGNoYXJhY3RlcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OVwiO1xuICB2YXIgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5qZWN0U2NyaXB0KHNyYywgb25Mb2FkKSB7XG4gIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAvLyBAdG9kbyBVc2UgbGluayB0byB0aGUgZWNzeS1kZXZ0b29scyByZXBvP1xuICBzY3JpcHQuc3JjID0gc3JjO1xuICBzY3JpcHQub25sb2FkID0gb25Mb2FkO1xuICAoZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHNjcmlwdCk7XG59XG4iLCIvKiBnbG9iYWwgUGVlciAqL1xuaW1wb3J0IHsgaW5qZWN0U2NyaXB0LCBnZW5lcmF0ZUlkIH0gZnJvbSBcIi4vdXRpbHMuanNcIjtcbmltcG9ydCB7IGhhc1dpbmRvdyB9IGZyb20gXCIuLi9VdGlscy5qc1wiO1xuXG5mdW5jdGlvbiBob29rQ29uc29sZUFuZEVycm9ycyhjb25uZWN0aW9uKSB7XG4gIHZhciB3cmFwRnVuY3Rpb25zID0gW1wiZXJyb3JcIiwgXCJ3YXJuaW5nXCIsIFwibG9nXCJdO1xuICB3cmFwRnVuY3Rpb25zLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAodHlwZW9mIGNvbnNvbGVba2V5XSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgZm4gPSBjb25zb2xlW2tleV0uYmluZChjb25zb2xlKTtcbiAgICAgIGNvbnNvbGVba2V5XSA9ICguLi5hcmdzKSA9PiB7XG4gICAgICAgIGNvbm5lY3Rpb24uc2VuZCh7XG4gICAgICAgICAgbWV0aG9kOiBcImNvbnNvbGVcIixcbiAgICAgICAgICB0eXBlOiBrZXksXG4gICAgICAgICAgYXJnczogSlNPTi5zdHJpbmdpZnkoYXJncylcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBmbi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImVycm9yXCIsIGVycm9yID0+IHtcbiAgICBjb25uZWN0aW9uLnNlbmQoe1xuICAgICAgbWV0aG9kOiBcImVycm9yXCIsXG4gICAgICBlcnJvcjogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICBtZXNzYWdlOiBlcnJvci5lcnJvci5tZXNzYWdlLFxuICAgICAgICBzdGFjazogZXJyb3IuZXJyb3Iuc3RhY2tcbiAgICAgIH0pXG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbmNsdWRlUmVtb3RlSWRIVE1MKHJlbW90ZUlkKSB7XG4gIGxldCBpbmZvRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgaW5mb0Rpdi5zdHlsZS5jc3NUZXh0ID0gYFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcbiAgICBjb2xvcjogI2FhYTtcbiAgICBkaXNwbGF5OmZsZXg7XG4gICAgZm9udC1mYW1pbHk6IEFyaWFsO1xuICAgIGZvbnQtc2l6ZTogMS4xZW07XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGxlZnQ6IDA7XG4gICAgb3BhY2l0eTogMC45O1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICByaWdodDogMDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgdG9wOiAwO1xuICBgO1xuXG4gIGluZm9EaXYuaW5uZXJIVE1MID0gYE9wZW4gRUNTWSBkZXZ0b29scyB0byBjb25uZWN0IHRvIHRoaXMgcGFnZSB1c2luZyB0aGUgY29kZTombmJzcDs8YiBzdHlsZT1cImNvbG9yOiAjZmZmXCI+JHtyZW1vdGVJZH08L2I+Jm5ic3A7PGJ1dHRvbiBvbkNsaWNrPVwiZ2VuZXJhdGVOZXdDb2RlKClcIj5HZW5lcmF0ZSBuZXcgY29kZTwvYnV0dG9uPmA7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5mb0Rpdik7XG5cbiAgcmV0dXJuIGluZm9EaXY7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbmFibGVSZW1vdGVEZXZ0b29scyhyZW1vdGVJZCkge1xuICBpZiAoIWhhc1dpbmRvdykge1xuICAgIGNvbnNvbGUud2FybihcIlJlbW90ZSBkZXZ0b29scyBub3QgYXZhaWxhYmxlIG91dHNpZGUgdGhlIGJyb3dzZXJcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd2luZG93LmdlbmVyYXRlTmV3Q29kZSA9ICgpID0+IHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmVtb3RlSWQgPSBnZW5lcmF0ZUlkKDYpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImVjc3lSZW1vdGVJZFwiLCByZW1vdGVJZCk7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZChmYWxzZSk7XG4gIH07XG5cbiAgcmVtb3RlSWQgPSByZW1vdGVJZCB8fCB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJlY3N5UmVtb3RlSWRcIik7XG4gIGlmICghcmVtb3RlSWQpIHtcbiAgICByZW1vdGVJZCA9IGdlbmVyYXRlSWQoNik7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZWNzeVJlbW90ZUlkXCIsIHJlbW90ZUlkKTtcbiAgfVxuXG4gIGxldCBpbmZvRGl2ID0gaW5jbHVkZVJlbW90ZUlkSFRNTChyZW1vdGVJZCk7XG5cbiAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFNfSU5KRUNURUQgPSB0cnVlO1xuICB3aW5kb3cuX19FQ1NZX1JFTU9URV9ERVZUT09MUyA9IHt9O1xuXG4gIGxldCBWZXJzaW9uID0gXCJcIjtcblxuICAvLyBUaGlzIGlzIHVzZWQgdG8gY29sbGVjdCB0aGUgd29ybGRzIGNyZWF0ZWQgYmVmb3JlIHRoZSBjb21tdW5pY2F0aW9uIGlzIGJlaW5nIGVzdGFibGlzaGVkXG4gIGxldCB3b3JsZHNCZWZvcmVMb2FkaW5nID0gW107XG4gIGxldCBvbldvcmxkQ3JlYXRlZCA9IGUgPT4ge1xuICAgIHZhciB3b3JsZCA9IGUuZGV0YWlsLndvcmxkO1xuICAgIFZlcnNpb24gPSBlLmRldGFpbC52ZXJzaW9uO1xuICAgIHdvcmxkc0JlZm9yZUxvYWRpbmcucHVzaCh3b3JsZCk7XG4gIH07XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZWNzeS13b3JsZC1jcmVhdGVkXCIsIG9uV29ybGRDcmVhdGVkKTtcblxuICBsZXQgb25Mb2FkZWQgPSAoKSA9PiB7XG4gICAgdmFyIHBlZXIgPSBuZXcgUGVlcihyZW1vdGVJZCk7XG4gICAgcGVlci5vbihcIm9wZW5cIiwgKC8qIGlkICovKSA9PiB7XG4gICAgICBwZWVyLm9uKFwiY29ubmVjdGlvblwiLCBjb25uZWN0aW9uID0+IHtcbiAgICAgICAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICAgIGNvbm5lY3Rpb24ub24oXCJvcGVuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIGluZm9EaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgaW5mb0Rpdi5pbm5lckhUTUwgPSBcIkNvbm5lY3RlZFwiO1xuXG4gICAgICAgICAgLy8gUmVjZWl2ZSBtZXNzYWdlc1xuICAgICAgICAgIGNvbm5lY3Rpb24ub24oXCJkYXRhXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFwiaW5pdFwiKSB7XG4gICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvamF2YXNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXG4gICAgICAgICAgICAgICAgLy8gT25jZSB0aGUgc2NyaXB0IGlzIGluamVjdGVkIHdlIGRvbid0IG5lZWQgdG8gbGlzdGVuXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICBcImVjc3ktd29ybGQtY3JlYXRlZFwiLFxuICAgICAgICAgICAgICAgICAgb25Xb3JsZENyZWF0ZWRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHdvcmxkc0JlZm9yZUxvYWRpbmcuZm9yRWFjaCh3b3JsZCA9PiB7XG4gICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJlY3N5LXdvcmxkLWNyZWF0ZWRcIiwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgd29ybGQ6IHdvcmxkLCB2ZXJzaW9uOiBWZXJzaW9uIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY3JpcHQuaW5uZXJIVE1MID0gZGF0YS5zY3JpcHQ7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCgpO1xuXG4gICAgICAgICAgICAgIGhvb2tDb25zb2xlQW5kRXJyb3JzKGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnR5cGUgPT09IFwiZXhlY3V0ZVNjcmlwdFwiKSB7XG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGV2YWwoZGF0YS5zY3JpcHQpO1xuICAgICAgICAgICAgICBpZiAoZGF0YS5yZXR1cm5FdmFsKSB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5zZW5kKHtcbiAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJldmFsUmV0dXJuXCIsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEluamVjdCBQZWVySlMgc2NyaXB0XG4gIGluamVjdFNjcmlwdChcbiAgICBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcGVlcmpzQDAuMy4yMC9kaXN0L3BlZXIubWluLmpzXCIsXG4gICAgb25Mb2FkZWRcbiAgKTtcbn1cblxuaWYgKGhhc1dpbmRvdykge1xuICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuXG4gIC8vIEB0b2RvIFByb3ZpZGUgYSB3YXkgdG8gZGlzYWJsZSBpdCBpZiBuZWVkZWRcbiAgaWYgKHVybFBhcmFtcy5oYXMoXCJlbmFibGUtcmVtb3RlLWRldnRvb2xzXCIpKSB7XG4gICAgZW5hYmxlUmVtb3RlRGV2dG9vbHMoKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDTyxTQUFTLE9BQU8sQ0FBQyxTQUFTLEVBQUU7QUFDbkMsRUFBRSxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUM7QUFDeEIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMscUJBQXFCLENBQUMsU0FBUyxFQUFFO0FBQ2pELEVBQUUsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDNUIsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPLFNBQVMsUUFBUSxDQUFDLFVBQVUsRUFBRTtBQUNyQyxFQUFFLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNqQixFQUFFLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzlDLElBQUksSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzFCLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLEVBQUU7QUFDL0IsTUFBTSxJQUFJLFFBQVEsR0FBRyxDQUFDLENB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

var ECSY = /*#__PURE__*/Object.freeze({
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

class GLTFLoader {
  constructor() {
    this.reset();
  }

  reset() {
    this.url = "";
    this.receiveShadow = false;
    this.castShadow = false;
    this.envMapOverride = null;
  }
}

class GLTFModel {
  constructor() {
    this.reset();
  }

  reset() {}
}

class InputState {
  constructor() {
    this.vrcontrollers = new Map();
    this.keyboard = {};
    this.mouse = {};
    this.gamepads = {};
  }

  reset() {}
}

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

class Object3D {
  constructor() {
    this.value = null;
  }

  reset() {
    this.value = null;
  }
}

class Parent {
  constructor() {
    this.value = null;
  }

  reset() {
    this.value = null;
  }
}

class ParentObject3D {
  constructor() {
    this.value = null;
  }

  reset() {
    this.value = null;
  }
}

class Play extends TagComponent {}

class Position {
  constructor() {
    this.value = new Vector3$1();
  }

  reset() {
    this.value.set(0, 0, 0);
  }
}

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
    this.rotation = new Vector3$1();
  }

  reset() {
    this.rotation.set(0, 0, 0);
  }
}

class Scale {
  constructor() {
    this.value = new Vector3$1();
  }

  reset() {
    this.value.set(0, 0, 0);
  }
}

class Scene extends TagComponent {}

class Shape {
  reset() {}
}

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

class Sound {
  constructor() {
    this.reset();
  }

  reset() {
    this.sound = null;
    this.url = "";
  }
}

class Stop extends TagComponent {}

class Text {
  constructor() {
    this.text = "";
    this.textAlign = "left"; // ['left', 'right', 'center']
    this.anchor = "center"; // ['left', 'right', 'center', 'align']
    this.baseline = "center"; // ['top', 'center', 'bottom']
    this.color = "#FFF";
    this.font = ""; //"https://code.cdn.mozilla.net/fonts/ttf/ZillaSlab-SemiBold.ttf";
    this.fontSize = 0.2;
    this.letterSpacing = 0;
    this.lineHeight = 0;
    this.maxWidth = Infinity;
    this.overflowWrap = "normal"; // ['normal', 'break-word']
    this.whiteSpace = "normal"; // ['normal', 'nowrap']
    this.opacity = 1;
  }

  reset() {
    this.text = "";
  }
}

class TextGeometry {
  reset() {}
}

class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.set(x, y, z);
  }

  set(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  copy(source) {
    this.x = source.x;
    this.y = source.y;
    return this;
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }
}

const Vector3Type = createType({
  name: "Vector3",
  default: new Vector3(),
  copy: copyCopyable,
  clone: cloneClonable
});

class Transform extends Component {}

Transform.schema = {
  position: { default: new Vector3$1(), type: Vector3 },
  rotation: { default: new Vector3$1(), type: Vector3 }
};

class Visible {
  constructor() {
    this.reset();
  }

  reset() {
    this.value = false;
  }
}

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
  shadowMap: { default: true, type: Types.Boolean }
};

class ControllerConnected extends TagComponent {}

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
      var object = entity.getRemovedComponent(Object3D).value;
      var parent = entity.getComponent(Parent, true).value;
      parent.getComponent(Object3D).value.remove(object);
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

      entity.addComponent(Object3D, { value: object });
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

class GLTFLoaderSystem extends System {
  execute() {
    this.queries.entities.added.forEach(entity => {
      var component = entity.getComponent(GLTFLoader);

      loader.load(component.url, gltf => {
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            child.receiveShadow = component.receiveShadow;
            child.castShadow = component.castShadow;

            if (component.envMapOverride) {
              child.material.envMap = component.envMapOverride;
            }
          }
        });
        entity.addComponent(GLTFModel, { value: gltf });

        if (component.append) {
          entity.getMutableComponent(Object3D).value.add(gltf.scene);
        } else {
          entity.addComponent(Object3D, { value: gltf.scene });
        }
        if (component.onLoaded) {
          component.onLoaded(gltf.scene, gltf);
        }
      });
    });

    this.queries.entities.removed.forEach(entity => {
      var object = entity.getComponent(Object3D, true).value;
      var parent = entity.getComponent(Parent, true).value;
      parent.getComponent(Object3D).value.remove(object);
    });
  }
}

GLTFLoaderSystem.queries = {
  entities: {
    components: [GLTFLoader],
    listen: {
      added: true,
      removed: true
    }
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

        entity.addComponent(Object3D, { value: group });
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
    components: [SkyBox, Not(Object3D)]
  }
};

class VisibilitySystem extends System {
  processVisibility(entities) {
    entities.forEach(entity => {
      entity.getMutableComponent(Object3D).value.visible = entity.getComponent(
        Visible
      ).value;
    });
  }

  execute() {
    this.processVisibility(this.queries.entities.added);
    this.processVisibility(this.queries.entities.changed);
  }
}

VisibilitySystem.queries = {
  entities: {
    components: [Visible, Object3D],
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
      e.addComponent(Object3D, { value: textMesh });
    });

    entities.removed.forEach(e => {
      var object3D = e.getComponent(Object3D).value;
      var textMesh = object3D.getObjectByName("textMesh");
      textMesh.dispose();
      object3D.remove(textMesh);
    });

    entities.changed.forEach(e => {
      var object3D = e.getComponent(Object3D).value;
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

class WebGLRendererContext {
  constructor() {
    this.value = null;
  }
  reset() {
    this.value = null;
  }
}

class WebGLRendererSystem extends System {
  init() {
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
        var scene = pass.scene.getComponent(Object3D).value;

        this.queries.activeCameras.results.forEach(cameraEntity => {
          var camera = cameraEntity.getComponent(Object3D).value;

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
    components: [Camera, Active],
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
      if (parentEntity.hasComponent(Object3D)) {
        var parentObject3D = parentEntity.getComponent(Object3D).value;
        var childObject3D = entity.getComponent(Object3D).value;
        parentObject3D.add(childObject3D);
      }
    }

    // Hierarchy
    this.queries.parentObject3D.added.forEach(entity => {
      var parentObject3D = entity.getComponent(ParentObject3D).value;
      var childObject3D = entity.getComponent(Object3D).value;
      parentObject3D.add(childObject3D);
    });

    // Transforms
    var transforms = this.queries.transforms;
    for (let i = 0; i < transforms.added.length; i++) {
      let entity = transforms.added[i];
      let transform = entity.getComponent(Transform);
      let object = entity.getComponent(Object3D).value;

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
      let object = entity.getComponent(Object3D).value;

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

      let object = entity.getComponent(Object3D).value;

      object.position.copy(position);
    }

    for (let i = 0; i < positions.changed.length; i++) {
      let entity = positions.changed[i];
      let position = entity.getComponent(Position).value;
      let object = entity.getComponent(Object3D).value;

      object.position.copy(position);
    }

    // Scale
    let scales = this.queries.scales;
    for (let i = 0; i < scales.added.length; i++) {
      let entity = scales.added[i];
      let scale = entity.getComponent(Scale).value;

      let object = entity.getComponent(Object3D).value;

      object.scale.copy(scale);
    }

    for (let i = 0; i < scales.changed.length; i++) {
      let entity = scales.changed[i];
      let scale = entity.getComponent(Scale).value;
      let object = entity.getComponent(Object3D).value;

      object.scale.copy(scale);
    }
  }
}

TransformSystem.queries = {
  parentObject3D: {
    components: [ParentObject3D, Object3D],
    listen: {
      added: true
    }
  },
  parent: {
    components: [Parent, Object3D],
    listen: {
      added: true
    }
  },
  transforms: {
    components: [Object3D, Transform],
    listen: {
      added: true,
      changed: [Transform]
    }
  },
  positions: {
    components: [Object3D, Position],
    listen: {
      added: true,
      changed: [Position]
    }
  },
  scales: {
    components: [Object3D, Scale],
    listen: {
      added: true,
      changed: [Scale]
    }
  }
};

class CameraSystem extends System {
  init() {
    window.addEventListener(
      "resize",
      () => {
        this.queries.cameras.results.forEach(camera => {
          let component = camera.getComponent(Camera);
          if (component.handleResize) {
            camera.getMutableComponent(Camera).aspect =
              window.innerWidth / window.innerHeight;
          }
        });
      },
      false
    );
  }

  execute() {
    let changed = this.queries.cameras.changed;
    for (let i = 0; i < changed.length; i++) {
      let entity = changed[i];

      let component = entity.getComponent(Camera);
      let camera3d = entity.getMutableComponent(Object3D).value;

      if (camera3d.aspect !== component.aspect) {
        camera3d.aspect = component.aspect;
        camera3d.updateProjectionMatrix();
      }
      // @todo Do it for the rest of the values
    }

    this.queries.camerasUninitialized.results.forEach(entity => {
      let component = entity.getComponent(Camera);

      let camera = new PerspectiveCamera(
        component.fov,
        component.aspect,
        component.near,
        component.far
      );

      camera.layers.enable(component.layers);

      entity.addComponent(Object3D, { value: camera });
    });
  }
}

CameraSystem.queries = {
  camerasUninitialized: {
    components: [Camera, Not(Object3D)]
  },
  cameras: {
    components: [Camera, Object3D],
    listen: {
      changed: [Camera]
    }
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
      var object = entity.getMutableComponent(Object3D).value;
      object.geometry = geometry;
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

      entity.addComponent(Object3D, { value: mesh });
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

      let scene = entity.getComponent(Scene).value.getComponent(Object3D).value;
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

      entity.addComponent(Object3D, { value: object });
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
      entity.addComponent(Object3D, { value: group });

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

class PositionalAudioPolyphonic extends Object3D$1 {
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

function initialize(world = new World(), options) {
  world
    .registerSystem(TransformSystem)
    .registerSystem(CameraSystem)
    .registerSystem(MaterialSystem)
    .registerSystem(WebGLRendererSystem, { priority: 1 });

  world
    .registerComponent(WebGLRenderer)
    .registerComponent(Scene)
    .registerComponent(Active)
    .registerComponent(RenderPass)
    .registerComponent(Transform)
    .registerComponent(Camera);

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
    .addComponent(Object3D, { value: new Scene$1() });

  let renderer = world.createEntity().addComponent(WebGLRenderer, {
    ar: options.ar,
    vr: options.vr,
    animationLoop: animationLoop
  });

  // camera rig & controllers
  var camera = null,
    cameraRig = null;

  if (options.ar || options.vr) {
    cameraRig = world
      .createEntity()
      .addComponent(CameraRig)
      .addComponent(Parent, { value: scene });
  }

  {
    camera = world
      .createEntity()
      .addComponent(Camera, {
        fov: 90,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 100,
        layers: 1,
        handleResize: true
      })
      .addComponent(Transform)
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

var ECSYTHREE = /*#__PURE__*/Object.freeze({
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
	Object3D: Object3D,
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
	CameraSystem: CameraSystem,
	TextGeometrySystem: TextGeometrySystem,
	EnvironmentSystem: EnvironmentSystem,
	VRControllerSystem: VRControllerSystem,
	AnimationSystem: AnimationSystem,
	InputSystem: InputSystem,
	SoundSystem: SoundSystem,
	initialize: initialize
});

var indexBundled = {
  THREE: THREE,
  ECSY: ECSY,
  ECSYTHREE: ECSYTHREE
};

export default indexBundled;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuYWxsLmpzIiwic291cmNlcyI6WyIuLi8uLi9jb3JlL2J1aWxkL2Vjc3kubW9kdWxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQWN0aXZlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQW5pbWF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29sbGlkaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RhcnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Db2xsaXNpb25TdG9wLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9FbnZpcm9ubWVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvR0xURkxvYWRlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0lucHV0U3RhdGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYXRlcmlhbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50T2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QbGF5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUG9zaXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9SZW5kZXJQYXNzLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmlnaWRCb2R5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUm90YXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9TY2FsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2hhcGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3kuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvY29tcG9uZW50cy9Tb3VuZC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1N0b3AuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UZXh0LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL1R5cGVzLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Db250cm9sbGVyQ29ubmVjdGVkLmpzIiwiLi4vc3JjL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU0RGVGV4dFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1ZSQ29udHJvbGxlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0FuaW1hdGlvblN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0lucHV0U3lzdGVtLmpzIiwiLi4vc3JjL2xpYi9Qb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljLmpzIiwiLi4vc3JjL3N5c3RlbXMvU291bmRTeXN0ZW0uanMiLCIuLi9zcmMvaW5pdGlhbGl6ZS5qcyIsIi4uL3NyYy9pbmRleC5qcyIsIi4uL3NyYy9pbmRleC1idW5kbGVkLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogUmV0dXJuIHRoZSBuYW1lIG9mIGEgY29tcG9uZW50XG4gKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBnZXROYW1lKENvbXBvbmVudCkge1xuICByZXR1cm4gQ29tcG9uZW50Lm5hbWU7XG59XG5cbi8qKlxuICogUmV0dXJuIGEgdmFsaWQgcHJvcGVydHkgbmFtZSBmb3IgdGhlIENvbXBvbmVudFxuICogQHBhcmFtIHtDb21wb25lbnR9IENvbXBvbmVudFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY29tcG9uZW50UHJvcGVydHlOYW1lKENvbXBvbmVudCkge1xuICByZXR1cm4gZ2V0TmFtZShDb21wb25lbnQpO1xufVxuXG4vKipcbiAqIEdldCBhIGtleSBmcm9tIGEgbGlzdCBvZiBjb21wb25lbnRzXG4gKiBAcGFyYW0ge0FycmF5KENvbXBvbmVudCl9IENvbXBvbmVudHMgQXJyYXkgb2YgY29tcG9uZW50cyB0byBnZW5lcmF0ZSB0aGUga2V5XG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBxdWVyeUtleShDb21wb25lbnRzKSB7XG4gIHZhciBuYW1lcyA9IFtdO1xuICBmb3IgKHZhciBuID0gMDsgbiA8IENvbXBvbmVudHMubGVuZ3RoOyBuKyspIHtcbiAgICB2YXIgVCA9IENvbXBvbmVudHNbbl07XG4gICAgaWYgKHR5cGVvZiBUID09PSBcIm9iamVjdFwiKSB7XG4gICAgICB2YXIgb3BlcmF0b3IgPSBULm9wZXJhdG9yID09PSBcIm5vdFwiID8gXCIhXCIgOiBULm9wZXJhdG9yO1xuICAgICAgbmFtZXMucHVzaChvcGVyYXRvciArIGdldE5hbWUoVC5Db21wb25lbnQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmFtZXMucHVzaChnZXROYW1lKFQpKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gbmFtZXMuc29ydCgpLmpvaW4oXCItXCIpO1xufVxuXG4vLyBEZXRlY3RvciBmb3IgYnJvd3NlcidzIFwid2luZG93XCJcbmNvbnN0IGhhc1dpbmRvdyA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCI7XG5cbi8vIHBlcmZvcm1hbmNlLm5vdygpIFwicG9seWZpbGxcIlxuY29uc3Qgbm93ID1cbiAgaGFzV2luZG93ICYmIHR5cGVvZiB3aW5kb3cucGVyZm9ybWFuY2UgIT09IFwidW5kZWZpbmVkXCJcbiAgICA/IHBlcmZvcm1hbmNlLm5vdy5iaW5kKHBlcmZvcm1hbmNlKVxuICAgIDogRGF0ZS5ub3cuYmluZChEYXRlKTtcblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzIEV2ZW50RGlzcGF0Y2hlclxuICovXG5jbGFzcyBFdmVudERpc3BhdGNoZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLl9saXN0ZW5lcnMgPSB7fTtcbiAgICB0aGlzLnN0YXRzID0ge1xuICAgICAgZmlyZWQ6IDAsXG4gICAgICBoYW5kbGVkOiAwXG4gICAgfTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBsaXN0ZW5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgQ2FsbGJhY2sgdG8gdHJpZ2dlciB3aGVuIHRoZSBldmVudCBpcyBmaXJlZFxuICAgKi9cbiAgYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycztcbiAgICBpZiAobGlzdGVuZXJzW2V2ZW50TmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgbGlzdGVuZXJzW2V2ZW50TmFtZV0gPSBbXTtcbiAgICB9XG5cbiAgICBpZiAobGlzdGVuZXJzW2V2ZW50TmFtZV0uaW5kZXhPZihsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICBsaXN0ZW5lcnNbZXZlbnROYW1lXS5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgYW4gZXZlbnQgbGlzdGVuZXIgaXMgYWxyZWFkeSBhZGRlZCB0byB0aGUgbGlzdCBvZiBsaXN0ZW5lcnNcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBjaGVja1xuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBDYWxsYmFjayBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgKi9cbiAgaGFzRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGxpc3RlbmVyKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdICE9PSB1bmRlZmluZWQgJiZcbiAgICAgIHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdLmluZGV4T2YobGlzdGVuZXIpICE9PSAtMVxuICAgICk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFuIGV2ZW50IGxpc3RlbmVyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBldmVudE5hbWUgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIENhbGxiYWNrIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gICAqL1xuICByZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgbGlzdGVuZXIpIHtcbiAgICB2YXIgbGlzdGVuZXJBcnJheSA9IHRoaXMuX2xpc3RlbmVyc1tldmVudE5hbWVdO1xuICAgIGlmIChsaXN0ZW5lckFycmF5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVyQXJyYXkuaW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgIGxpc3RlbmVyQXJyYXkuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggYW4gZXZlbnRcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50TmFtZSBOYW1lIG9mIHRoZSBldmVudCB0byBkaXNwYXRjaFxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IChPcHRpb25hbCkgRW50aXR5IHRvIGVtaXRcbiAgICogQHBhcmFtIHtDb21wb25lbnR9IGNvbXBvbmVudFxuICAgKi9cbiAgZGlzcGF0Y2hFdmVudChldmVudE5hbWUsIGVudGl0eSwgY29tcG9uZW50KSB7XG4gICAgdGhpcy5zdGF0cy5maXJlZCsrO1xuXG4gICAgdmFyIGxpc3RlbmVyQXJyYXkgPSB0aGlzLl9saXN0ZW5lcnNbZXZlbnROYW1lXTtcbiAgICBpZiAobGlzdGVuZXJBcnJheSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgYXJyYXkgPSBsaXN0ZW5lckFycmF5LnNsaWNlKDApO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGFycmF5W2ldLmNhbGwodGhpcywgZW50aXR5LCBjb21wb25lbnQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBzdGF0cyBjb3VudGVyc1xuICAgKi9cbiAgcmVzZXRDb3VudGVycygpIHtcbiAgICB0aGlzLnN0YXRzLmZpcmVkID0gdGhpcy5zdGF0cy5oYW5kbGVkID0gMDtcbiAgfVxufVxuXG5jbGFzcyBRdWVyeSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge0FycmF5KENvbXBvbmVudCl9IENvbXBvbmVudHMgTGlzdCBvZiB0eXBlcyBvZiBjb21wb25lbnRzIHRvIHF1ZXJ5XG4gICAqL1xuICBjb25zdHJ1Y3RvcihDb21wb25lbnRzLCBtYW5hZ2VyKSB7XG4gICAgdGhpcy5Db21wb25lbnRzID0gW107XG4gICAgdGhpcy5Ob3RDb21wb25lbnRzID0gW107XG5cbiAgICBDb21wb25lbnRzLmZvckVhY2goY29tcG9uZW50ID0+IHtcbiAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50ID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIHRoaXMuTm90Q29tcG9uZW50cy5wdXNoKGNvbXBvbmVudC5Db21wb25lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5Db21wb25lbnRzLnB1c2goY29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICh0aGlzLkNvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjcmVhdGUgYSBxdWVyeSB3aXRob3V0IGNvbXBvbmVudHNcIik7XG4gICAgfVxuXG4gICAgdGhpcy5lbnRpdGllcyA9IFtdO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIgPSBuZXcgRXZlbnREaXNwYXRjaGVyKCk7XG5cbiAgICAvLyBUaGlzIHF1ZXJ5IGlzIGJlaW5nIHVzZWQgYnkgYSByZWFjdGl2ZSBzeXN0ZW1cbiAgICB0aGlzLnJlYWN0aXZlID0gZmFsc2U7XG5cbiAgICB0aGlzLmtleSA9IHF1ZXJ5S2V5KENvbXBvbmVudHMpO1xuXG4gICAgLy8gRmlsbCB0aGUgcXVlcnkgd2l0aCB0aGUgZXhpc3RpbmcgZW50aXRpZXNcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hbmFnZXIuX2VudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gbWFuYWdlci5fZW50aXRpZXNbaV07XG4gICAgICBpZiAodGhpcy5tYXRjaChlbnRpdHkpKSB7XG4gICAgICAgIC8vIEB0b2RvID8/PyB0aGlzLmFkZEVudGl0eShlbnRpdHkpOyA9PiBwcmV2ZW50aW5nIHRoZSBldmVudCB0byBiZSBnZW5lcmF0ZWRcbiAgICAgICAgZW50aXR5LnF1ZXJpZXMucHVzaCh0aGlzKTtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5wdXNoKGVudGl0eSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFkZCBlbnRpdHkgdG8gdGhpcyBxdWVyeVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5XG4gICAqL1xuICBhZGRFbnRpdHkoZW50aXR5KSB7XG4gICAgZW50aXR5LnF1ZXJpZXMucHVzaCh0aGlzKTtcbiAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcblxuICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoUXVlcnkucHJvdG90eXBlLkVOVElUWV9BRERFRCwgZW50aXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgZW50aXR5IGZyb20gdGhpcyBxdWVyeVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5XG4gICAqL1xuICByZW1vdmVFbnRpdHkoZW50aXR5KSB7XG4gICAgbGV0IGluZGV4ID0gdGhpcy5lbnRpdGllcy5pbmRleE9mKGVudGl0eSk7XG4gICAgaWYgKH5pbmRleCkge1xuICAgICAgdGhpcy5lbnRpdGllcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICBpbmRleCA9IGVudGl0eS5xdWVyaWVzLmluZGV4T2YodGhpcyk7XG4gICAgICBlbnRpdHkucXVlcmllcy5zcGxpY2UoaW5kZXgsIDEpO1xuXG4gICAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KFxuICAgICAgICBRdWVyeS5wcm90b3R5cGUuRU5USVRZX1JFTU9WRUQsXG4gICAgICAgIGVudGl0eVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBtYXRjaChlbnRpdHkpIHtcbiAgICByZXR1cm4gKFxuICAgICAgZW50aXR5Lmhhc0FsbENvbXBvbmVudHModGhpcy5Db21wb25lbnRzKSAmJlxuICAgICAgIWVudGl0eS5oYXNBbnlDb21wb25lbnRzKHRoaXMuTm90Q29tcG9uZW50cylcbiAgICApO1xuICB9XG5cbiAgdG9KU09OKCkge1xuICAgIHJldHVybiB7XG4gICAgICBrZXk6IHRoaXMua2V5LFxuICAgICAgcmVhY3RpdmU6IHRoaXMucmVhY3RpdmUsXG4gICAgICBjb21wb25lbnRzOiB7XG4gICAgICAgIGluY2x1ZGVkOiB0aGlzLkNvbXBvbmVudHMubWFwKEMgPT4gQy5uYW1lKSxcbiAgICAgICAgbm90OiB0aGlzLk5vdENvbXBvbmVudHMubWFwKEMgPT4gQy5uYW1lKVxuICAgICAgfSxcbiAgICAgIG51bUVudGl0aWVzOiB0aGlzLmVudGl0aWVzLmxlbmd0aFxuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHN0YXRzIGZvciB0aGlzIHF1ZXJ5XG4gICAqL1xuICBzdGF0cygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbnVtQ29tcG9uZW50czogdGhpcy5Db21wb25lbnRzLmxlbmd0aCxcbiAgICAgIG51bUVudGl0aWVzOiB0aGlzLmVudGl0aWVzLmxlbmd0aFxuICAgIH07XG4gIH1cbn1cblxuUXVlcnkucHJvdG90eXBlLkVOVElUWV9BRERFRCA9IFwiUXVlcnkjRU5USVRZX0FEREVEXCI7XG5RdWVyeS5wcm90b3R5cGUuRU5USVRZX1JFTU9WRUQgPSBcIlF1ZXJ5I0VOVElUWV9SRU1PVkVEXCI7XG5RdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQgPSBcIlF1ZXJ5I0NPTVBPTkVOVF9DSEFOR0VEXCI7XG5cbmNsYXNzIFN5c3RlbSB7XG4gIGNhbkV4ZWN1dGUoKSB7XG4gICAgaWYgKHRoaXMuX21hbmRhdG9yeVF1ZXJpZXMubGVuZ3RoID09PSAwKSByZXR1cm4gdHJ1ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbWFuZGF0b3J5UXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fbWFuZGF0b3J5UXVlcmllc1tpXTtcbiAgICAgIGlmIChxdWVyeS5lbnRpdGllcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgY29uc3RydWN0b3Iod29ybGQsIGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLndvcmxkID0gd29ybGQ7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcblxuICAgIC8vIEB0b2RvIEJldHRlciBuYW1pbmcgOilcbiAgICB0aGlzLl9xdWVyaWVzID0ge307XG4gICAgdGhpcy5xdWVyaWVzID0ge307XG5cbiAgICB0aGlzLnByaW9yaXR5ID0gMDtcblxuICAgIC8vIFVzZWQgZm9yIHN0YXRzXG4gICAgdGhpcy5leGVjdXRlVGltZSA9IDA7XG5cbiAgICBpZiAoYXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzLnByaW9yaXR5KSB7XG4gICAgICB0aGlzLnByaW9yaXR5ID0gYXR0cmlidXRlcy5wcmlvcml0eTtcbiAgICB9XG5cbiAgICB0aGlzLl9tYW5kYXRvcnlRdWVyaWVzID0gW107XG5cbiAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXMpIHtcbiAgICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLmNvbnN0cnVjdG9yLnF1ZXJpZXMpIHtcbiAgICAgICAgdmFyIHF1ZXJ5Q29uZmlnID0gdGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzW3F1ZXJ5TmFtZV07XG4gICAgICAgIHZhciBDb21wb25lbnRzID0gcXVlcnlDb25maWcuY29tcG9uZW50cztcbiAgICAgICAgaWYgKCFDb21wb25lbnRzIHx8IENvbXBvbmVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2NvbXBvbmVudHMnIGF0dHJpYnV0ZSBjYW4ndCBiZSBlbXB0eSBpbiBhIHF1ZXJ5XCIpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBxdWVyeSA9IHRoaXMud29ybGQuZW50aXR5TWFuYWdlci5xdWVyeUNvbXBvbmVudHMoQ29tcG9uZW50cyk7XG4gICAgICAgIHRoaXMuX3F1ZXJpZXNbcXVlcnlOYW1lXSA9IHF1ZXJ5O1xuICAgICAgICBpZiAocXVlcnlDb25maWcubWFuZGF0b3J5ID09PSB0cnVlKSB7XG4gICAgICAgICAgdGhpcy5fbWFuZGF0b3J5UXVlcmllcy5wdXNoKHF1ZXJ5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXSA9IHtcbiAgICAgICAgICByZXN1bHRzOiBxdWVyeS5lbnRpdGllc1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIFJlYWN0aXZlIGNvbmZpZ3VyYXRpb24gYWRkZWQvcmVtb3ZlZC9jaGFuZ2VkXG4gICAgICAgIHZhciB2YWxpZEV2ZW50cyA9IFtcImFkZGVkXCIsIFwicmVtb3ZlZFwiLCBcImNoYW5nZWRcIl07XG5cbiAgICAgICAgY29uc3QgZXZlbnRNYXBwaW5nID0ge1xuICAgICAgICAgIGFkZGVkOiBRdWVyeS5wcm90b3R5cGUuRU5USVRZX0FEREVELFxuICAgICAgICAgIHJlbW92ZWQ6IFF1ZXJ5LnByb3RvdHlwZS5FTlRJVFlfUkVNT1ZFRCxcbiAgICAgICAgICBjaGFuZ2VkOiBRdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQgLy8gUXVlcnkucHJvdG90eXBlLkVOVElUWV9DSEFOR0VEXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHF1ZXJ5Q29uZmlnLmxpc3Rlbikge1xuICAgICAgICAgIHZhbGlkRXZlbnRzLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICAgIGlmICghdGhpcy5leGVjdXRlKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgICBgU3lzdGVtICcke1xuICAgICAgICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICAgICAgICAgICAgfScgaGFzIGRlZmluZWQgbGlzdGVuIGV2ZW50cyAoJHt2YWxpZEV2ZW50cy5qb2luKFxuICAgICAgICAgICAgICAgICAgXCIsIFwiXG4gICAgICAgICAgICAgICAgKX0pIGZvciBxdWVyeSAnJHtxdWVyeU5hbWV9JyBidXQgaXQgZG9lcyBub3QgaW1wbGVtZW50IHRoZSAnZXhlY3V0ZScgbWV0aG9kLmBcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSXMgdGhlIGV2ZW50IGVuYWJsZWQgb24gdGhpcyBzeXN0ZW0ncyBxdWVyeT9cbiAgICAgICAgICAgIGlmIChxdWVyeUNvbmZpZy5saXN0ZW5bZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgICBsZXQgZXZlbnQgPSBxdWVyeUNvbmZpZy5saXN0ZW5bZXZlbnROYW1lXTtcblxuICAgICAgICAgICAgICBpZiAoZXZlbnROYW1lID09PSBcImNoYW5nZWRcIikge1xuICAgICAgICAgICAgICAgIHF1ZXJ5LnJlYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgIC8vIEFueSBjaGFuZ2Ugb24gdGhlIGVudGl0eSBmcm9tIHRoZSBjb21wb25lbnRzIGluIHRoZSBxdWVyeVxuICAgICAgICAgICAgICAgICAgbGV0IGV2ZW50TGlzdCA9ICh0aGlzLnF1ZXJpZXNbcXVlcnlOYW1lXVtldmVudE5hbWVdID0gW10pO1xuICAgICAgICAgICAgICAgICAgcXVlcnkuZXZlbnREaXNwYXRjaGVyLmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICAgIFF1ZXJ5LnByb3RvdHlwZS5DT01QT05FTlRfQ0hBTkdFRCxcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAvLyBBdm9pZCBkdXBsaWNhdGVzXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50TGlzdC5pbmRleE9mKGVudGl0eSkgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoZXZlbnQpKSB7XG4gICAgICAgICAgICAgICAgICBsZXQgZXZlbnRMaXN0ID0gKHRoaXMucXVlcmllc1txdWVyeU5hbWVdW2V2ZW50TmFtZV0gPSBbXSk7XG4gICAgICAgICAgICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgICAgICAgICAgICAgICAgUXVlcnkucHJvdG90eXBlLkNPTVBPTkVOVF9DSEFOR0VELFxuICAgICAgICAgICAgICAgICAgICAoZW50aXR5LCBjaGFuZ2VkQ29tcG9uZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gQXZvaWQgZHVwbGljYXRlc1xuICAgICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LmluZGV4T2YoY2hhbmdlZENvbXBvbmVudC5jb25zdHJ1Y3RvcikgIT09IC0xICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMVxuICAgICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRMaXN0LnB1c2goZW50aXR5KTtcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBldmVudExpc3QgPSAodGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV1bZXZlbnROYW1lXSA9IFtdKTtcblxuICAgICAgICAgICAgICAgIHF1ZXJ5LmV2ZW50RGlzcGF0Y2hlci5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgICAgICAgICAgICAgZXZlbnRNYXBwaW5nW2V2ZW50TmFtZV0sXG4gICAgICAgICAgICAgICAgICBlbnRpdHkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBAZml4bWUgb3ZlcmhlYWQ/XG4gICAgICAgICAgICAgICAgICAgIGlmIChldmVudExpc3QuaW5kZXhPZihlbnRpdHkpID09PSAtMSlcbiAgICAgICAgICAgICAgICAgICAgICBldmVudExpc3QucHVzaChlbnRpdHkpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5leGVjdXRlVGltZSA9IDA7XG4gICAgdGhpcy5lbmFibGVkID0gZmFsc2U7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHRoaXMuZW5hYmxlZCA9IHRydWU7XG4gIH1cblxuICAvLyBAcXVlc3Rpb24gcmVuYW1lIHRvIGNsZWFyIHF1ZXVlcz9cbiAgY2xlYXJFdmVudHMoKSB7XG4gICAgZm9yIChsZXQgcXVlcnlOYW1lIGluIHRoaXMucXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5xdWVyaWVzW3F1ZXJ5TmFtZV07XG4gICAgICBpZiAocXVlcnkuYWRkZWQpIHtcbiAgICAgICAgcXVlcnkuYWRkZWQubGVuZ3RoID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChxdWVyeS5yZW1vdmVkKSB7XG4gICAgICAgIHF1ZXJ5LnJlbW92ZWQubGVuZ3RoID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChxdWVyeS5jaGFuZ2VkKSB7XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KHF1ZXJ5LmNoYW5nZWQpKSB7XG4gICAgICAgICAgcXVlcnkuY2hhbmdlZC5sZW5ndGggPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gcXVlcnkuY2hhbmdlZCkge1xuICAgICAgICAgICAgcXVlcnkuY2hhbmdlZFtuYW1lXS5sZW5ndGggPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHRvSlNPTigpIHtcbiAgICB2YXIganNvbiA9IHtcbiAgICAgIG5hbWU6IHRoaXMuY29uc3RydWN0b3IubmFtZSxcbiAgICAgIGVuYWJsZWQ6IHRoaXMuZW5hYmxlZCxcbiAgICAgIGV4ZWN1dGVUaW1lOiB0aGlzLmV4ZWN1dGVUaW1lLFxuICAgICAgcHJpb3JpdHk6IHRoaXMucHJpb3JpdHksXG4gICAgICBxdWVyaWVzOiB7fVxuICAgIH07XG5cbiAgICBpZiAodGhpcy5jb25zdHJ1Y3Rvci5xdWVyaWVzKSB7XG4gICAgICB2YXIgcXVlcmllcyA9IHRoaXMuY29uc3RydWN0b3IucXVlcmllcztcbiAgICAgIGZvciAobGV0IHF1ZXJ5TmFtZSBpbiBxdWVyaWVzKSB7XG4gICAgICAgIGxldCBxdWVyeSA9IHRoaXMucXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgICBsZXQgcXVlcnlEZWZpbml0aW9uID0gcXVlcmllc1txdWVyeU5hbWVdO1xuICAgICAgICBsZXQganNvblF1ZXJ5ID0gKGpzb24ucXVlcmllc1txdWVyeU5hbWVdID0ge1xuICAgICAgICAgIGtleTogdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdLmtleVxuICAgICAgICB9KTtcblxuICAgICAgICBqc29uUXVlcnkubWFuZGF0b3J5ID0gcXVlcnlEZWZpbml0aW9uLm1hbmRhdG9yeSA9PT0gdHJ1ZTtcbiAgICAgICAganNvblF1ZXJ5LnJlYWN0aXZlID1cbiAgICAgICAgICBxdWVyeURlZmluaXRpb24ubGlzdGVuICYmXG4gICAgICAgICAgKHF1ZXJ5RGVmaW5pdGlvbi5saXN0ZW4uYWRkZWQgPT09IHRydWUgfHxcbiAgICAgICAgICAgIHF1ZXJ5RGVmaW5pdGlvbi5saXN0ZW4ucmVtb3ZlZCA9PT0gdHJ1ZSB8fFxuICAgICAgICAgICAgcXVlcnlEZWZpbml0aW9uLmxpc3Rlbi5jaGFuZ2VkID09PSB0cnVlIHx8XG4gICAgICAgICAgICBBcnJheS5pc0FycmF5KHF1ZXJ5RGVmaW5pdGlvbi5saXN0ZW4uY2hhbmdlZCkpO1xuXG4gICAgICAgIGlmIChqc29uUXVlcnkucmVhY3RpdmUpIHtcbiAgICAgICAgICBqc29uUXVlcnkubGlzdGVuID0ge307XG5cbiAgICAgICAgICBjb25zdCBtZXRob2RzID0gW1wiYWRkZWRcIiwgXCJyZW1vdmVkXCIsIFwiY2hhbmdlZFwiXTtcbiAgICAgICAgICBtZXRob2RzLmZvckVhY2gobWV0aG9kID0+IHtcbiAgICAgICAgICAgIGlmIChxdWVyeVttZXRob2RdKSB7XG4gICAgICAgICAgICAgIGpzb25RdWVyeS5saXN0ZW5bbWV0aG9kXSA9IHtcbiAgICAgICAgICAgICAgICBlbnRpdGllczogcXVlcnlbbWV0aG9kXS5sZW5ndGhcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBqc29uO1xuICB9XG59XG5cbmZ1bmN0aW9uIE5vdChDb21wb25lbnQpIHtcbiAgcmV0dXJuIHtcbiAgICBvcGVyYXRvcjogXCJub3RcIixcbiAgICBDb21wb25lbnQ6IENvbXBvbmVudFxuICB9O1xufVxuXG5jbGFzcyBTeXN0ZW1NYW5hZ2VyIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICB0aGlzLl9zeXN0ZW1zID0gW107XG4gICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMgPSBbXTsgLy8gU3lzdGVtcyB0aGF0IGhhdmUgYGV4ZWN1dGVgIG1ldGhvZFxuICAgIHRoaXMud29ybGQgPSB3b3JsZDtcbiAgICB0aGlzLmxhc3RFeGVjdXRlZFN5c3RlbSA9IG51bGw7XG4gIH1cblxuICByZWdpc3RlclN5c3RlbShTeXN0ZW1DbGFzcywgYXR0cmlidXRlcykge1xuICAgIGlmICghKFN5c3RlbUNsYXNzLnByb3RvdHlwZSBpbnN0YW5jZW9mIFN5c3RlbSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgYFN5c3RlbSAnJHtTeXN0ZW1DbGFzcy5uYW1lfScgZG9lcyBub3QgZXh0ZW5kcyAnU3lzdGVtJyBjbGFzc2BcbiAgICAgICk7XG4gICAgfVxuICAgIGlmICh0aGlzLmdldFN5c3RlbShTeXN0ZW1DbGFzcykgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc29sZS53YXJuKGBTeXN0ZW0gJyR7U3lzdGVtQ2xhc3MubmFtZX0nIGFscmVhZHkgcmVnaXN0ZXJlZC5gKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHZhciBzeXN0ZW0gPSBuZXcgU3lzdGVtQ2xhc3ModGhpcy53b3JsZCwgYXR0cmlidXRlcyk7XG4gICAgaWYgKHN5c3RlbS5pbml0KSBzeXN0ZW0uaW5pdChhdHRyaWJ1dGVzKTtcbiAgICBzeXN0ZW0ub3JkZXIgPSB0aGlzLl9zeXN0ZW1zLmxlbmd0aDtcbiAgICB0aGlzLl9zeXN0ZW1zLnB1c2goc3lzdGVtKTtcbiAgICBpZiAoc3lzdGVtLmV4ZWN1dGUpIHtcbiAgICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLnB1c2goc3lzdGVtKTtcbiAgICAgIHRoaXMuc29ydFN5c3RlbXMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB1bnJlZ2lzdGVyU3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgbGV0IHN5c3RlbSA9IHRoaXMuZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKTtcbiAgICBpZiAoc3lzdGVtID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgYENhbiB1bnJlZ2lzdGVyIHN5c3RlbSAnJHtTeXN0ZW1DbGFzcy5uYW1lfScuIEl0IGRvZXNuJ3QgZXhpc3QuYFxuICAgICAgKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuX3N5c3RlbXMuc3BsaWNlKHRoaXMuX3N5c3RlbXMuaW5kZXhPZihzeXN0ZW0pLCAxKTtcblxuICAgIGlmIChzeXN0ZW0uZXhlY3V0ZSkge1xuICAgICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuc3BsaWNlKHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLmluZGV4T2Yoc3lzdGVtKSwgMSk7XG4gICAgfVxuXG4gICAgLy8gQHRvZG8gQWRkIHN5c3RlbS51bnJlZ2lzdGVyKCkgY2FsbCB0byBmcmVlIHJlc291cmNlc1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc29ydFN5c3RlbXMoKSB7XG4gICAgdGhpcy5fZXhlY3V0ZVN5c3RlbXMuc29ydCgoYSwgYikgPT4ge1xuICAgICAgcmV0dXJuIGEucHJpb3JpdHkgLSBiLnByaW9yaXR5IHx8IGEub3JkZXIgLSBiLm9yZGVyO1xuICAgIH0pO1xuICB9XG5cbiAgZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N5c3RlbXMuZmluZChzID0+IHMgaW5zdGFuY2VvZiBTeXN0ZW1DbGFzcyk7XG4gIH1cblxuICBnZXRTeXN0ZW1zKCkge1xuICAgIHJldHVybiB0aGlzLl9zeXN0ZW1zO1xuICB9XG5cbiAgcmVtb3ZlU3lzdGVtKFN5c3RlbUNsYXNzKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5fc3lzdGVtcy5pbmRleE9mKFN5c3RlbUNsYXNzKTtcbiAgICBpZiAoIX5pbmRleCkgcmV0dXJuO1xuXG4gICAgdGhpcy5fc3lzdGVtcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9XG5cbiAgZXhlY3V0ZVN5c3RlbShzeXN0ZW0sIGRlbHRhLCB0aW1lKSB7XG4gICAgaWYgKHN5c3RlbS5pbml0aWFsaXplZCkge1xuICAgICAgaWYgKHN5c3RlbS5jYW5FeGVjdXRlKCkpIHtcbiAgICAgICAgbGV0IHN0YXJ0VGltZSA9IG5vdygpO1xuICAgICAgICBzeXN0ZW0uZXhlY3V0ZShkZWx0YSwgdGltZSk7XG4gICAgICAgIHN5c3RlbS5leGVjdXRlVGltZSA9IG5vdygpIC0gc3RhcnRUaW1lO1xuICAgICAgICB0aGlzLmxhc3RFeGVjdXRlZFN5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgc3lzdGVtLmNsZWFyRXZlbnRzKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9leGVjdXRlU3lzdGVtcy5mb3JFYWNoKHN5c3RlbSA9PiBzeXN0ZW0uc3RvcCgpKTtcbiAgfVxuXG4gIGV4ZWN1dGUoZGVsdGEsIHRpbWUsIGZvcmNlUGxheSkge1xuICAgIHRoaXMuX2V4ZWN1dGVTeXN0ZW1zLmZvckVhY2goXG4gICAgICBzeXN0ZW0gPT5cbiAgICAgICAgKGZvcmNlUGxheSB8fCBzeXN0ZW0uZW5hYmxlZCkgJiYgdGhpcy5leGVjdXRlU3lzdGVtKHN5c3RlbSwgZGVsdGEsIHRpbWUpXG4gICAgKTtcbiAgfVxuXG4gIHN0YXRzKCkge1xuICAgIHZhciBzdGF0cyA9IHtcbiAgICAgIG51bVN5c3RlbXM6IHRoaXMuX3N5c3RlbXMubGVuZ3RoLFxuICAgICAgc3lzdGVtczoge31cbiAgICB9O1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLl9zeXN0ZW1zLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc3lzdGVtID0gdGhpcy5fc3lzdGVtc1tpXTtcbiAgICAgIHZhciBzeXN0ZW1TdGF0cyA9IChzdGF0cy5zeXN0ZW1zW3N5c3RlbS5jb25zdHJ1Y3Rvci5uYW1lXSA9IHtcbiAgICAgICAgcXVlcmllczoge30sXG4gICAgICAgIGV4ZWN1dGVUaW1lOiBzeXN0ZW0uZXhlY3V0ZVRpbWVcbiAgICAgIH0pO1xuICAgICAgZm9yICh2YXIgbmFtZSBpbiBzeXN0ZW0uY3R4KSB7XG4gICAgICAgIHN5c3RlbVN0YXRzLnF1ZXJpZXNbbmFtZV0gPSBzeXN0ZW0uY3R4W25hbWVdLnN0YXRzKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRzO1xuICB9XG59XG5cbmNsYXNzIE9iamVjdFBvb2wge1xuICAvLyBAdG9kbyBBZGQgaW5pdGlhbCBzaXplXG4gIGNvbnN0cnVjdG9yKGJhc2VPYmplY3QsIGluaXRpYWxTaXplKSB7XG4gICAgdGhpcy5mcmVlTGlzdCA9IFtdO1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMuYmFzZU9iamVjdCA9IGJhc2VPYmplY3Q7XG4gICAgdGhpcy5pc09iamVjdFBvb2wgPSB0cnVlO1xuXG4gICAgaWYgKHR5cGVvZiBpbml0aWFsU2l6ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgdGhpcy5leHBhbmQoaW5pdGlhbFNpemUpO1xuICAgIH1cbiAgfVxuXG4gIGFjcXVpcmUoKSB7XG4gICAgLy8gR3JvdyB0aGUgbGlzdCBieSAyMCVpc2ggaWYgd2UncmUgb3V0XG4gICAgaWYgKHRoaXMuZnJlZUxpc3QubGVuZ3RoIDw9IDApIHtcbiAgICAgIHRoaXMuZXhwYW5kKE1hdGgucm91bmQodGhpcy5jb3VudCAqIDAuMikgKyAxKTtcbiAgICB9XG5cbiAgICB2YXIgaXRlbSA9IHRoaXMuZnJlZUxpc3QucG9wKCk7XG5cbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIHJlbGVhc2UoaXRlbSkge1xuICAgIGl0ZW0ucmVzZXQoKTtcbiAgICB0aGlzLmZyZWVMaXN0LnB1c2goaXRlbSk7XG4gIH1cblxuICBleHBhbmQoY291bnQpIHtcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IGNvdW50OyBuKyspIHtcbiAgICAgIHZhciBjbG9uZSA9IG5ldyB0aGlzLmJhc2VPYmplY3QoKTtcbiAgICAgIGNsb25lLl9wb29sID0gdGhpcztcbiAgICAgIHRoaXMuZnJlZUxpc3QucHVzaChjbG9uZSk7XG4gICAgfVxuICAgIHRoaXMuY291bnQgKz0gY291bnQ7XG4gIH1cblxuICB0b3RhbFNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY291bnQ7XG4gIH1cblxuICB0b3RhbEZyZWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZnJlZUxpc3QubGVuZ3RoO1xuICB9XG5cbiAgdG90YWxVc2VkKCkge1xuICAgIHJldHVybiB0aGlzLmNvdW50IC0gdGhpcy5mcmVlTGlzdC5sZW5ndGg7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzIFF1ZXJ5TWFuYWdlclxuICovXG5jbGFzcyBRdWVyeU1hbmFnZXIge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xuICAgIHRoaXMuX3dvcmxkID0gd29ybGQ7XG5cbiAgICAvLyBRdWVyaWVzIGluZGV4ZWQgYnkgYSB1bmlxdWUgaWRlbnRpZmllciBmb3IgdGhlIGNvbXBvbmVudHMgaXQgaGFzXG4gICAgdGhpcy5fcXVlcmllcyA9IHt9O1xuICB9XG5cbiAgb25FbnRpdHlSZW1vdmVkKGVudGl0eSkge1xuICAgIGZvciAodmFyIHF1ZXJ5TmFtZSBpbiB0aGlzLl9xdWVyaWVzKSB7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV07XG4gICAgICBpZiAoZW50aXR5LnF1ZXJpZXMuaW5kZXhPZihxdWVyeSkgIT09IC0xKSB7XG4gICAgICAgIHF1ZXJ5LnJlbW92ZUVudGl0eShlbnRpdHkpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB3aGVuIGEgY29tcG9uZW50IGlzIGFkZGVkIHRvIGFuIGVudGl0eVxuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IEVudGl0eSB0aGF0IGp1c3QgZ290IHRoZSBuZXcgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnQgQ29tcG9uZW50IGFkZGVkIHRvIHRoZSBlbnRpdHlcbiAgICovXG4gIG9uRW50aXR5Q29tcG9uZW50QWRkZWQoZW50aXR5LCBDb21wb25lbnQpIHtcbiAgICAvLyBAdG9kbyBVc2UgYml0bWFzayBmb3IgY2hlY2tpbmcgY29tcG9uZW50cz9cblxuICAgIC8vIENoZWNrIGVhY2ggaW5kZXhlZCBxdWVyeSB0byBzZWUgaWYgd2UgbmVlZCB0byBhZGQgdGhpcyBlbnRpdHkgdG8gdGhlIGxpc3RcbiAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5fcXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdO1xuXG4gICAgICBpZiAoXG4gICAgICAgICEhfnF1ZXJ5Lk5vdENvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICYmXG4gICAgICAgIH5xdWVyeS5lbnRpdGllcy5pbmRleE9mKGVudGl0eSlcbiAgICAgICkge1xuICAgICAgICBxdWVyeS5yZW1vdmVFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIC8vIEFkZCB0aGUgZW50aXR5IG9ubHkgaWY6XG4gICAgICAvLyBDb21wb25lbnQgaXMgaW4gdGhlIHF1ZXJ5XG4gICAgICAvLyBhbmQgRW50aXR5IGhhcyBBTEwgdGhlIGNvbXBvbmVudHMgb2YgdGhlIHF1ZXJ5XG4gICAgICAvLyBhbmQgRW50aXR5IGlzIG5vdCBhbHJlYWR5IGluIHRoZSBxdWVyeVxuICAgICAgaWYgKFxuICAgICAgICAhfnF1ZXJ5LkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpIHx8XG4gICAgICAgICFxdWVyeS5tYXRjaChlbnRpdHkpIHx8XG4gICAgICAgIH5xdWVyeS5lbnRpdGllcy5pbmRleE9mKGVudGl0eSlcbiAgICAgIClcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHF1ZXJ5LmFkZEVudGl0eShlbnRpdHkpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayB3aGVuIGEgY29tcG9uZW50IGlzIHJlbW92ZWQgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgdG8gcmVtb3ZlIHRoZSBjb21wb25lbnQgZnJvbVxuICAgKiBAcGFyYW0ge0NvbXBvbmVudH0gQ29tcG9uZW50IENvbXBvbmVudCB0byByZW1vdmUgZnJvbSB0aGUgZW50aXR5XG4gICAqL1xuICBvbkVudGl0eUNvbXBvbmVudFJlbW92ZWQoZW50aXR5LCBDb21wb25lbnQpIHtcbiAgICBmb3IgKHZhciBxdWVyeU5hbWUgaW4gdGhpcy5fcXVlcmllcykge1xuICAgICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1txdWVyeU5hbWVdO1xuXG4gICAgICBpZiAoXG4gICAgICAgICEhfnF1ZXJ5Lk5vdENvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICYmXG4gICAgICAgICF+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpICYmXG4gICAgICAgIHF1ZXJ5Lm1hdGNoKGVudGl0eSlcbiAgICAgICkge1xuICAgICAgICBxdWVyeS5hZGRFbnRpdHkoZW50aXR5KTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChcbiAgICAgICAgISF+cXVlcnkuQ29tcG9uZW50cy5pbmRleE9mKENvbXBvbmVudCkgJiZcbiAgICAgICAgISF+cXVlcnkuZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpICYmXG4gICAgICAgICFxdWVyeS5tYXRjaChlbnRpdHkpXG4gICAgICApIHtcbiAgICAgICAgcXVlcnkucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYSBxdWVyeSBmb3IgdGhlIHNwZWNpZmllZCBjb21wb25lbnRzXG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnRzIENvbXBvbmVudHMgdGhhdCB0aGUgcXVlcnkgc2hvdWxkIGhhdmVcbiAgICovXG4gIGdldFF1ZXJ5KENvbXBvbmVudHMpIHtcbiAgICB2YXIga2V5ID0gcXVlcnlLZXkoQ29tcG9uZW50cyk7XG4gICAgdmFyIHF1ZXJ5ID0gdGhpcy5fcXVlcmllc1trZXldO1xuICAgIGlmICghcXVlcnkpIHtcbiAgICAgIHRoaXMuX3F1ZXJpZXNba2V5XSA9IHF1ZXJ5ID0gbmV3IFF1ZXJ5KENvbXBvbmVudHMsIHRoaXMuX3dvcmxkKTtcbiAgICB9XG4gICAgcmV0dXJuIHF1ZXJ5O1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBzb21lIHN0YXRzIGZyb20gdGhpcyBjbGFzc1xuICAgKi9cbiAgc3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0ge307XG4gICAgZm9yICh2YXIgcXVlcnlOYW1lIGluIHRoaXMuX3F1ZXJpZXMpIHtcbiAgICAgIHN0YXRzW3F1ZXJ5TmFtZV0gPSB0aGlzLl9xdWVyaWVzW3F1ZXJ5TmFtZV0uc3RhdHMoKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0YXRzO1xuICB9XG59XG5cbmNsYXNzIENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgaWYgKHByb3BzICE9PSBmYWxzZSkge1xuICAgICAgY29uc3Qgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHNjaGVtYSkge1xuICAgICAgICBpZiAocHJvcHMgJiYgcHJvcHMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHRoaXNba2V5XSA9IHByb3BzW2tleV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc3Qgc2NoZW1hUHJvcCA9IHNjaGVtYVtrZXldO1xuICAgICAgICAgIGlmIChzY2hlbWFQcm9wLmhhc093blByb3BlcnR5KFwiZGVmYXVsdFwiKSkge1xuICAgICAgICAgICAgdGhpc1trZXldID0gc2NoZW1hUHJvcC50eXBlLmNsb25lKHNjaGVtYVByb3AuZGVmYXVsdCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHR5cGUgPSBzY2hlbWFQcm9wLnR5cGU7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSB0eXBlLmNsb25lKHR5cGUuZGVmYXVsdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcG9vbCA9IG51bGw7XG4gIH1cblxuICBjb3B5KHNvdXJjZSkge1xuICAgIGNvbnN0IHNjaGVtYSA9IHRoaXMuY29uc3RydWN0b3Iuc2NoZW1hO1xuXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2NoZW1hKSB7XG4gICAgICBjb25zdCBwcm9wID0gc2NoZW1hW2tleV07XG5cbiAgICAgIGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICBwcm9wLnR5cGUuY29weShzb3VyY2UsIHRoaXMsIGtleSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoKS5jb3B5KHRoaXMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgY29uc3Qgc2NoZW1hID0gdGhpcy5jb25zdHJ1Y3Rvci5zY2hlbWE7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzY2hlbWEpIHtcbiAgICAgIGNvbnN0IHNjaGVtYVByb3AgPSBzY2hlbWFba2V5XTtcblxuICAgICAgaWYgKHNjaGVtYVByb3AuaGFzT3duUHJvcGVydHkoXCJkZWZhdWx0XCIpKSB7XG4gICAgICAgIHRoaXNba2V5XSA9IHNjaGVtYVByb3AudHlwZS5jbG9uZShzY2hlbWFQcm9wLmRlZmF1bHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdHlwZSA9IHNjaGVtYVByb3AudHlwZTtcbiAgICAgICAgdGhpc1trZXldID0gdHlwZS5jbG9uZSh0eXBlLmRlZmF1bHQpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGRpc3Bvc2UoKSB7XG4gICAgaWYgKHRoaXMuX3Bvb2wpIHtcbiAgICAgIHRoaXMuX3Bvb2wucmVsZWFzZSh0aGlzKTtcbiAgICB9XG4gIH1cbn1cblxuQ29tcG9uZW50LnNjaGVtYSA9IHt9O1xuQ29tcG9uZW50LmlzQ29tcG9uZW50ID0gdHJ1ZTtcblxuY2xhc3MgU3lzdGVtU3RhdGVDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge31cblxuU3lzdGVtU3RhdGVDb21wb25lbnQuaXNTeXN0ZW1TdGF0ZUNvbXBvbmVudCA9IHRydWU7XG5cbmNsYXNzIEVudGl0eVBvb2wgZXh0ZW5kcyBPYmplY3RQb29sIHtcbiAgY29uc3RydWN0b3IoZW50aXR5TWFuYWdlciwgZW50aXR5Q2xhc3MsIGluaXRpYWxTaXplKSB7XG4gICAgc3VwZXIoZW50aXR5Q2xhc3MsIHVuZGVmaW5lZCk7XG4gICAgdGhpcy5lbnRpdHlNYW5hZ2VyID0gZW50aXR5TWFuYWdlcjtcblxuICAgIGlmICh0eXBlb2YgaW5pdGlhbFNpemUgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHRoaXMuZXhwYW5kKGluaXRpYWxTaXplKTtcbiAgICB9XG4gIH1cblxuICBleHBhbmQoY291bnQpIHtcbiAgICBmb3IgKHZhciBuID0gMDsgbiA8IGNvdW50OyBuKyspIHtcbiAgICAgIHZhciBjbG9uZSA9IG5ldyB0aGlzLmJhc2VPYmplY3QodGhpcy5lbnRpdHlNYW5hZ2VyKTtcbiAgICAgIGNsb25lLl9wb29sID0gdGhpcztcbiAgICAgIHRoaXMuZnJlZUxpc3QucHVzaChjbG9uZSk7XG4gICAgfVxuICAgIHRoaXMuY291bnQgKz0gY291bnQ7XG4gIH1cbn1cblxuLyoqXG4gKiBAcHJpdmF0ZVxuICogQGNsYXNzIEVudGl0eU1hbmFnZXJcbiAqL1xuY2xhc3MgRW50aXR5TWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuICAgIHRoaXMuY29tcG9uZW50c01hbmFnZXIgPSB3b3JsZC5jb21wb25lbnRzTWFuYWdlcjtcblxuICAgIC8vIEFsbCB0aGUgZW50aXRpZXMgaW4gdGhpcyBpbnN0YW5jZVxuICAgIHRoaXMuX2VudGl0aWVzID0gW107XG4gICAgdGhpcy5fbmV4dEVudGl0eUlkID0gMDtcblxuICAgIHRoaXMuX2VudGl0aWVzQnlOYW1lcyA9IHt9O1xuXG4gICAgdGhpcy5fcXVlcnlNYW5hZ2VyID0gbmV3IFF1ZXJ5TWFuYWdlcih0aGlzKTtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlciA9IG5ldyBFdmVudERpc3BhdGNoZXIoKTtcbiAgICB0aGlzLl9lbnRpdHlQb29sID0gbmV3IEVudGl0eVBvb2woXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy53b3JsZC5vcHRpb25zLmVudGl0eUNsYXNzLFxuICAgICAgdGhpcy53b3JsZC5vcHRpb25zLmVudGl0eVBvb2xTaXplXG4gICAgKTtcblxuICAgIC8vIERlZmVycmVkIGRlbGV0aW9uXG4gICAgdGhpcy5lbnRpdGllc1dpdGhDb21wb25lbnRzVG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmVudGl0aWVzVG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmRlZmVycmVkUmVtb3ZhbEVuYWJsZWQgPSB0cnVlO1xuICB9XG5cbiAgZ2V0RW50aXR5QnlOYW1lKG5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXRpZXNCeU5hbWVzW25hbWVdO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIG5ldyBlbnRpdHlcbiAgICovXG4gIGNyZWF0ZUVudGl0eShuYW1lKSB7XG4gICAgdmFyIGVudGl0eSA9IHRoaXMuX2VudGl0eVBvb2wuYWNxdWlyZSgpO1xuICAgIGVudGl0eS5hbGl2ZSA9IHRydWU7XG4gICAgZW50aXR5Lm5hbWUgPSBuYW1lIHx8IFwiXCI7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIGlmICh0aGlzLl9lbnRpdGllc0J5TmFtZXNbbmFtZV0pIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBFbnRpdHkgbmFtZSAnJHtuYW1lfScgYWxyZWFkeSBleGlzdGApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fZW50aXRpZXNCeU5hbWVzW25hbWVdID0gZW50aXR5O1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuX2VudGl0aWVzLnB1c2goZW50aXR5KTtcbiAgICB0aGlzLmV2ZW50RGlzcGF0Y2hlci5kaXNwYXRjaEV2ZW50KEVOVElUWV9DUkVBVEVELCBlbnRpdHkpO1xuICAgIHJldHVybiBlbnRpdHk7XG4gIH1cblxuICAvLyBDT01QT05FTlRTXG5cbiAgLyoqXG4gICAqIEFkZCBhIGNvbXBvbmVudCB0byBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgd2hlcmUgdGhlIGNvbXBvbmVudCB3aWxsIGJlIGFkZGVkXG4gICAqIEBwYXJhbSB7Q29tcG9uZW50fSBDb21wb25lbnQgQ29tcG9uZW50IHRvIGJlIGFkZGVkIHRvIHRoZSBlbnRpdHlcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBPcHRpb25hbCB2YWx1ZXMgdG8gcmVwbGFjZSB0aGUgZGVmYXVsdCBhdHRyaWJ1dGVzXG4gICAqL1xuICBlbnRpdHlBZGRDb21wb25lbnQoZW50aXR5LCBDb21wb25lbnQsIHZhbHVlcykge1xuICAgIGlmICghdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5Db21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICBgQXR0ZW1wdGVkIHRvIGFkZCB1bnJlZ2lzdGVyZWQgY29tcG9uZW50IFwiJHtDb21wb25lbnQubmFtZX1cImBcbiAgICAgICk7XG4gICAgfVxuXG4gICAgaWYgKH5lbnRpdHkuX0NvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KSkge1xuICAgICAgLy8gQHRvZG8gSnVzdCBvbiBkZWJ1ZyBtb2RlXG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiQ29tcG9uZW50IHR5cGUgYWxyZWFkeSBleGlzdHMgb24gZW50aXR5LlwiLFxuICAgICAgICBlbnRpdHksXG4gICAgICAgIENvbXBvbmVudC5uYW1lXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGVudGl0eS5fQ29tcG9uZW50VHlwZXMucHVzaChDb21wb25lbnQpO1xuXG4gICAgaWYgKENvbXBvbmVudC5fX3Byb3RvX18gPT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KSB7XG4gICAgICBlbnRpdHkubnVtU3RhdGVDb21wb25lbnRzKys7XG4gICAgfVxuXG4gICAgdmFyIGNvbXBvbmVudFBvb2wgPSB0aGlzLndvcmxkLmNvbXBvbmVudHNNYW5hZ2VyLmdldENvbXBvbmVudHNQb29sKFxuICAgICAgQ29tcG9uZW50XG4gICAgKTtcblxuICAgIHZhciBjb21wb25lbnQgPSBjb21wb25lbnRQb29sXG4gICAgICA/IGNvbXBvbmVudFBvb2wuYWNxdWlyZSgpXG4gICAgICA6IG5ldyBDb21wb25lbnQodmFsdWVzKTtcblxuICAgIGlmIChjb21wb25lbnRQb29sICYmIHZhbHVlcykge1xuICAgICAgY29tcG9uZW50LmNvcHkodmFsdWVzKTtcbiAgICB9XG5cbiAgICBlbnRpdHkuX2NvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdID0gY29tcG9uZW50O1xuXG4gICAgdGhpcy5fcXVlcnlNYW5hZ2VyLm9uRW50aXR5Q29tcG9uZW50QWRkZWQoZW50aXR5LCBDb21wb25lbnQpO1xuICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50QWRkZWRUb0VudGl0eShDb21wb25lbnQpO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChDT01QT05FTlRfQURERUQsIGVudGl0eSwgQ29tcG9uZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYSBjb21wb25lbnQgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgd2hpY2ggd2lsbCBnZXQgcmVtb3ZlZCB0aGUgY29tcG9uZW50XG4gICAqIEBwYXJhbSB7Kn0gQ29tcG9uZW50IENvbXBvbmVudCB0byByZW1vdmUgZnJvbSB0aGUgZW50aXR5XG4gICAqIEBwYXJhbSB7Qm9vbH0gaW1tZWRpYXRlbHkgSWYgeW91IHdhbnQgdG8gcmVtb3ZlIHRoZSBjb21wb25lbnQgaW1tZWRpYXRlbHkgaW5zdGVhZCBvZiBkZWZlcnJlZCAoRGVmYXVsdCBpcyBmYWxzZSlcbiAgICovXG4gIGVudGl0eVJlbW92ZUNvbXBvbmVudChlbnRpdHksIENvbXBvbmVudCwgaW1tZWRpYXRlbHkpIHtcbiAgICB2YXIgaW5kZXggPSBlbnRpdHkuX0NvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KTtcbiAgICBpZiAoIX5pbmRleCkgcmV0dXJuO1xuXG4gICAgdGhpcy5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChDT01QT05FTlRfUkVNT1ZFLCBlbnRpdHksIENvbXBvbmVudCk7XG5cbiAgICBpZiAoaW1tZWRpYXRlbHkpIHtcbiAgICAgIHRoaXMuX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5sZW5ndGggPT09IDApXG4gICAgICAgIHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlLnB1c2goZW50aXR5KTtcblxuICAgICAgZW50aXR5Ll9Db21wb25lbnRUeXBlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgZW50aXR5Ll9Db21wb25lbnRUeXBlc1RvUmVtb3ZlLnB1c2goQ29tcG9uZW50KTtcblxuICAgICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXROYW1lKENvbXBvbmVudCk7XG4gICAgICBlbnRpdHkuX2NvbXBvbmVudHNUb1JlbW92ZVtjb21wb25lbnROYW1lXSA9XG4gICAgICAgIGVudGl0eS5fY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICAgIGRlbGV0ZSBlbnRpdHkuX2NvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZWFjaCBpbmRleGVkIHF1ZXJ5IHRvIHNlZSBpZiB3ZSBuZWVkIHRvIHJlbW92ZSBpdFxuICAgIHRoaXMuX3F1ZXJ5TWFuYWdlci5vbkVudGl0eUNvbXBvbmVudFJlbW92ZWQoZW50aXR5LCBDb21wb25lbnQpO1xuXG4gICAgaWYgKENvbXBvbmVudC5fX3Byb3RvX18gPT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KSB7XG4gICAgICBlbnRpdHkubnVtU3RhdGVDb21wb25lbnRzLS07XG5cbiAgICAgIC8vIENoZWNrIGlmIHRoZSBlbnRpdHkgd2FzIGEgZ2hvc3Qgd2FpdGluZyBmb3IgdGhlIGxhc3Qgc3lzdGVtIHN0YXRlIGNvbXBvbmVudCB0byBiZSByZW1vdmVkXG4gICAgICBpZiAoZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cyA9PT0gMCAmJiAhZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIGVudGl0eS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZW50aXR5UmVtb3ZlQ29tcG9uZW50U3luYyhlbnRpdHksIENvbXBvbmVudCwgaW5kZXgpIHtcbiAgICAvLyBSZW1vdmUgVCBsaXN0aW5nIG9uIGVudGl0eSBhbmQgcHJvcGVydHkgcmVmLCB0aGVuIGZyZWUgdGhlIGNvbXBvbmVudC5cbiAgICBlbnRpdHkuX0NvbXBvbmVudFR5cGVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgdmFyIGNvbXBvbmVudE5hbWUgPSBnZXROYW1lKENvbXBvbmVudCk7XG4gICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5fY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICBkZWxldGUgZW50aXR5Ll9jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgIGNvbXBvbmVudC5kaXNwb3NlKCk7XG4gICAgdGhpcy53b3JsZC5jb21wb25lbnRzTWFuYWdlci5jb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShDb21wb25lbnQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBhbGwgdGhlIGNvbXBvbmVudHMgZnJvbSBhbiBlbnRpdHlcbiAgICogQHBhcmFtIHtFbnRpdHl9IGVudGl0eSBFbnRpdHkgZnJvbSB3aGljaCB0aGUgY29tcG9uZW50cyB3aWxsIGJlIHJlbW92ZWRcbiAgICovXG4gIGVudGl0eVJlbW92ZUFsbENvbXBvbmVudHMoZW50aXR5LCBpbW1lZGlhdGVseSkge1xuICAgIGxldCBDb21wb25lbnRzID0gZW50aXR5Ll9Db21wb25lbnRUeXBlcztcblxuICAgIGZvciAobGV0IGogPSBDb21wb25lbnRzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICBpZiAoQ29tcG9uZW50c1tqXS5fX3Byb3RvX18gIT09IFN5c3RlbVN0YXRlQ29tcG9uZW50KVxuICAgICAgICB0aGlzLmVudGl0eVJlbW92ZUNvbXBvbmVudChlbnRpdHksIENvbXBvbmVudHNbal0sIGltbWVkaWF0ZWx5KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBlbnRpdHkgZnJvbSB0aGlzIG1hbmFnZXIuIEl0IHdpbGwgY2xlYXIgYWxzbyBpdHMgY29tcG9uZW50c1xuICAgKiBAcGFyYW0ge0VudGl0eX0gZW50aXR5IEVudGl0eSB0byByZW1vdmUgZnJvbSB0aGUgbWFuYWdlclxuICAgKiBAcGFyYW0ge0Jvb2x9IGltbWVkaWF0ZWx5IElmIHlvdSB3YW50IHRvIHJlbW92ZSB0aGUgY29tcG9uZW50IGltbWVkaWF0ZWx5IGluc3RlYWQgb2YgZGVmZXJyZWQgKERlZmF1bHQgaXMgZmFsc2UpXG4gICAqL1xuICByZW1vdmVFbnRpdHkoZW50aXR5LCBpbW1lZGlhdGVseSkge1xuICAgIHZhciBpbmRleCA9IHRoaXMuX2VudGl0aWVzLmluZGV4T2YoZW50aXR5KTtcblxuICAgIGlmICghfmluZGV4KSB0aHJvdyBuZXcgRXJyb3IoXCJUcmllZCB0byByZW1vdmUgZW50aXR5IG5vdCBpbiBsaXN0XCIpO1xuXG4gICAgZW50aXR5LmFsaXZlID0gZmFsc2U7XG5cbiAgICBpZiAoZW50aXR5Lm51bVN0YXRlQ29tcG9uZW50cyA9PT0gMCkge1xuICAgICAgLy8gUmVtb3ZlIGZyb20gZW50aXR5IGxpc3RcbiAgICAgIHRoaXMuZXZlbnREaXNwYXRjaGVyLmRpc3BhdGNoRXZlbnQoRU5USVRZX1JFTU9WRUQsIGVudGl0eSk7XG4gICAgICB0aGlzLl9xdWVyeU1hbmFnZXIub25FbnRpdHlSZW1vdmVkKGVudGl0eSk7XG4gICAgICBpZiAoaW1tZWRpYXRlbHkgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fcmVsZWFzZUVudGl0eShlbnRpdHksIGluZGV4KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZW50aXRpZXNUb1JlbW92ZS5wdXNoKGVudGl0eSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5lbnRpdHlSZW1vdmVBbGxDb21wb25lbnRzKGVudGl0eSwgaW1tZWRpYXRlbHkpO1xuICB9XG5cbiAgX3JlbGVhc2VFbnRpdHkoZW50aXR5LCBpbmRleCkge1xuICAgIHRoaXMuX2VudGl0aWVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICBpZiAodGhpcy5fZW50aXRpZXNCeU5hbWVzW2VudGl0eS5uYW1lXSkge1xuICAgICAgZGVsZXRlIHRoaXMuX2VudGl0aWVzQnlOYW1lc1tlbnRpdHkubmFtZV07XG4gICAgfVxuICAgIGVudGl0eS5fcG9vbC5yZWxlYXNlKGVudGl0eSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBlbnRpdGllcyBmcm9tIHRoaXMgbWFuYWdlclxuICAgKi9cbiAgcmVtb3ZlQWxsRW50aXRpZXMoKSB7XG4gICAgZm9yICh2YXIgaSA9IHRoaXMuX2VudGl0aWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICB0aGlzLnJlbW92ZUVudGl0eSh0aGlzLl9lbnRpdGllc1tpXSk7XG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc0RlZmVycmVkUmVtb3ZhbCgpIHtcbiAgICBpZiAoIXRoaXMuZGVmZXJyZWRSZW1vdmFsRW5hYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lbnRpdGllc1RvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdGhpcy5lbnRpdGllc1RvUmVtb3ZlW2ldO1xuICAgICAgbGV0IGluZGV4ID0gdGhpcy5fZW50aXRpZXMuaW5kZXhPZihlbnRpdHkpO1xuICAgICAgdGhpcy5fcmVsZWFzZUVudGl0eShlbnRpdHksIGluZGV4KTtcbiAgICB9XG4gICAgdGhpcy5lbnRpdGllc1RvUmVtb3ZlLmxlbmd0aCA9IDA7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZW50aXRpZXNXaXRoQ29tcG9uZW50c1RvUmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdGhpcy5lbnRpdGllc1dpdGhDb21wb25lbnRzVG9SZW1vdmVbaV07XG4gICAgICB3aGlsZSAoZW50aXR5Ll9Db21wb25lbnRUeXBlc1RvUmVtb3ZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IENvbXBvbmVudCA9IGVudGl0eS5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5wb3AoKTtcblxuICAgICAgICB2YXIgY29tcG9uZW50TmFtZSA9IGdldE5hbWUoQ29tcG9uZW50KTtcbiAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5fY29tcG9uZW50c1RvUmVtb3ZlW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICBkZWxldGUgZW50aXR5Ll9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV07XG4gICAgICAgIGNvbXBvbmVudC5kaXNwb3NlKCk7XG4gICAgICAgIHRoaXMud29ybGQuY29tcG9uZW50c01hbmFnZXIuY29tcG9uZW50UmVtb3ZlZEZyb21FbnRpdHkoQ29tcG9uZW50KTtcblxuICAgICAgICAvL3RoaXMuX2VudGl0eVJlbW92ZUNvbXBvbmVudFN5bmMoZW50aXR5LCBDb21wb25lbnQsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmVudGl0aWVzV2l0aENvbXBvbmVudHNUb1JlbW92ZS5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCBhIHF1ZXJ5IGJhc2VkIG9uIGEgbGlzdCBvZiBjb21wb25lbnRzXG4gICAqIEBwYXJhbSB7QXJyYXkoQ29tcG9uZW50KX0gQ29tcG9uZW50cyBMaXN0IG9mIGNvbXBvbmVudHMgdGhhdCB3aWxsIGZvcm0gdGhlIHF1ZXJ5XG4gICAqL1xuICBxdWVyeUNvbXBvbmVudHMoQ29tcG9uZW50cykge1xuICAgIHJldHVybiB0aGlzLl9xdWVyeU1hbmFnZXIuZ2V0UXVlcnkoQ29tcG9uZW50cyk7XG4gIH1cblxuICAvLyBFWFRSQVNcblxuICAvKipcbiAgICogUmV0dXJuIG51bWJlciBvZiBlbnRpdGllc1xuICAgKi9cbiAgY291bnQoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0aWVzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gc29tZSBzdGF0c1xuICAgKi9cbiAgc3RhdHMoKSB7XG4gICAgdmFyIHN0YXRzID0ge1xuICAgICAgbnVtRW50aXRpZXM6IHRoaXMuX2VudGl0aWVzLmxlbmd0aCxcbiAgICAgIG51bVF1ZXJpZXM6IE9iamVjdC5rZXlzKHRoaXMuX3F1ZXJ5TWFuYWdlci5fcXVlcmllcykubGVuZ3RoLFxuICAgICAgcXVlcmllczogdGhpcy5fcXVlcnlNYW5hZ2VyLnN0YXRzKCksXG4gICAgICBudW1Db21wb25lbnRQb29sOiBPYmplY3Qua2V5cyh0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLl9jb21wb25lbnRQb29sKVxuICAgICAgICAubGVuZ3RoLFxuICAgICAgY29tcG9uZW50UG9vbDoge30sXG4gICAgICBldmVudERpc3BhdGNoZXI6IHRoaXMuZXZlbnREaXNwYXRjaGVyLnN0YXRzXG4gICAgfTtcblxuICAgIGZvciAodmFyIGNuYW1lIGluIHRoaXMuY29tcG9uZW50c01hbmFnZXIuX2NvbXBvbmVudFBvb2wpIHtcbiAgICAgIHZhciBwb29sID0gdGhpcy5jb21wb25lbnRzTWFuYWdlci5fY29tcG9uZW50UG9vbFtjbmFtZV07XG4gICAgICBzdGF0cy5jb21wb25lbnRQb29sW2NuYW1lXSA9IHtcbiAgICAgICAgdXNlZDogcG9vbC50b3RhbFVzZWQoKSxcbiAgICAgICAgc2l6ZTogcG9vbC5jb3VudFxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdHM7XG4gIH1cbn1cblxuY29uc3QgRU5USVRZX0NSRUFURUQgPSBcIkVudGl0eU1hbmFnZXIjRU5USVRZX0NSRUFURVwiO1xuY29uc3QgRU5USVRZX1JFTU9WRUQgPSBcIkVudGl0eU1hbmFnZXIjRU5USVRZX1JFTU9WRURcIjtcbmNvbnN0IENPTVBPTkVOVF9BRERFRCA9IFwiRW50aXR5TWFuYWdlciNDT01QT05FTlRfQURERURcIjtcbmNvbnN0IENPTVBPTkVOVF9SRU1PVkUgPSBcIkVudGl0eU1hbmFnZXIjQ09NUE9ORU5UX1JFTU9WRVwiO1xuXG5jbGFzcyBDb21wb25lbnRNYW5hZ2VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5Db21wb25lbnRzID0ge307XG4gICAgdGhpcy5fY29tcG9uZW50UG9vbCA9IHt9O1xuICAgIHRoaXMubnVtQ29tcG9uZW50cyA9IHt9O1xuICB9XG5cbiAgcmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50LCBvYmplY3RQb29sKSB7XG4gICAgaWYgKHRoaXMuQ29tcG9uZW50c1tDb21wb25lbnQubmFtZV0pIHtcbiAgICAgIGNvbnNvbGUud2FybihgQ29tcG9uZW50IHR5cGU6ICcke0NvbXBvbmVudC5uYW1lfScgYWxyZWFkeSByZWdpc3RlcmVkLmApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjaGVtYSA9IENvbXBvbmVudC5zY2hlbWE7XG5cbiAgICBpZiAoIXNjaGVtYSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb21wb25lbnQgXCIke0NvbXBvbmVudC5uYW1lfVwiIGhhcyBubyBzY2hlbWEgcHJvcGVydHkuYCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wTmFtZSBpbiBzY2hlbWEpIHtcbiAgICAgIGNvbnN0IHByb3AgPSBzY2hlbWFbcHJvcE5hbWVdO1xuXG4gICAgICBpZiAoIXByb3AudHlwZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgYEludmFsaWQgc2NoZW1hIGZvciBjb21wb25lbnQgXCIke0NvbXBvbmVudC5uYW1lfVwiLiBNaXNzaW5nIHR5cGUgZm9yIFwiJHtwcm9wTmFtZX1cIiBwcm9wZXJ0eS5gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5Db21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSA9IENvbXBvbmVudDtcbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdID0gMDtcblxuICAgIGlmIChvYmplY3RQb29sID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9iamVjdFBvb2wgPSBuZXcgT2JqZWN0UG9vbChDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqZWN0UG9vbCA9PT0gZmFsc2UpIHtcbiAgICAgIG9iamVjdFBvb2wgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY29tcG9uZW50UG9vbFtDb21wb25lbnQubmFtZV0gPSBvYmplY3RQb29sO1xuICB9XG5cbiAgY29tcG9uZW50QWRkZWRUb0VudGl0eShDb21wb25lbnQpIHtcbiAgICBpZiAoIXRoaXMuQ29tcG9uZW50c1tDb21wb25lbnQubmFtZV0pIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJDb21wb25lbnQoQ29tcG9uZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdKys7XG4gIH1cblxuICBjb21wb25lbnRSZW1vdmVkRnJvbUVudGl0eShDb21wb25lbnQpIHtcbiAgICB0aGlzLm51bUNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdLS07XG4gIH1cblxuICBnZXRDb21wb25lbnRzUG9vbChDb21wb25lbnQpIHtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudFByb3BlcnR5TmFtZShDb21wb25lbnQpO1xuICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRQb29sW2NvbXBvbmVudE5hbWVdO1xuICB9XG59XG5cbnZhciBuYW1lID0gXCJlY3N5XCI7XG52YXIgdmVyc2lvbiA9IFwiMC4yLjRcIjtcbnZhciBkZXNjcmlwdGlvbiA9IFwiRW50aXR5IENvbXBvbmVudCBTeXN0ZW0gaW4gSlNcIjtcbnZhciBtYWluID0gXCJidWlsZC9lY3N5LmpzXCI7XG52YXIgbW9kdWxlID0gXCJidWlsZC9lY3N5Lm1vZHVsZS5qc1wiO1xudmFyIHR5cGVzID0gXCJzcmMvaW5kZXguZC50c1wiO1xudmFyIHNjcmlwdHMgPSB7XG5cdGJ1aWxkOiBcInJvbGx1cCAtYyAmJiBucG0gcnVuIGRvY3NcIixcblx0ZG9jczogXCJybSBkb2NzL2FwaS9fc2lkZWJhci5tZDsgdHlwZWRvYyAtLXJlYWRtZSBub25lIC0tbW9kZSBmaWxlIC0tZXhjbHVkZUV4dGVybmFscyAtLXBsdWdpbiB0eXBlZG9jLXBsdWdpbi1tYXJrZG93biAgLS10aGVtZSBkb2NzL3RoZW1lIC0taGlkZVNvdXJjZXMgLS1oaWRlQnJlYWRjcnVtYnMgLS1vdXQgZG9jcy9hcGkvIC0taW5jbHVkZURlY2xhcmF0aW9ucyAtLWluY2x1ZGVzICdzcmMvKiovKi5kLnRzJyBzcmM7IHRvdWNoIGRvY3MvYXBpL19zaWRlYmFyLm1kXCIsXG5cdFwiZGV2OmRvY3NcIjogXCJub2RlbW9uIC1lIHRzIC14ICducG0gcnVuIGRvY3MnIC13IHNyY1wiLFxuXHRkZXY6IFwiY29uY3VycmVudGx5IC0tbmFtZXMgJ1JPTExVUCxET0NTLEhUVFAnIC1jICdiZ0JsdWUuYm9sZCxiZ1llbGxvdy5ib2xkLGJnR3JlZW4uYm9sZCcgJ3JvbGx1cCAtYyAtdyAtbSBpbmxpbmUnICducG0gcnVuIGRldjpkb2NzJyAnbnBtIHJ1biBkZXY6c2VydmVyJ1wiLFxuXHRcImRldjpzZXJ2ZXJcIjogXCJodHRwLXNlcnZlciAtYy0xIC1wIDgwODAgLS1jb3JzXCIsXG5cdGxpbnQ6IFwiZXNsaW50IHNyYyB0ZXN0IGV4YW1wbGVzXCIsXG5cdHN0YXJ0OiBcIm5wbSBydW4gZGV2XCIsXG5cdGJlbmNobWFya3M6IFwibm9kZSAtciBlc20gLS1leHBvc2UtZ2MgYmVuY2htYXJrcy9pbmRleC5qc1wiLFxuXHR0ZXN0OiBcImF2YVwiLFxuXHR0cmF2aXM6IFwibnBtIHJ1biBsaW50ICYmIG5wbSBydW4gdGVzdCAmJiBucG0gcnVuIGJ1aWxkXCIsXG5cdFwid2F0Y2g6dGVzdFwiOiBcImF2YSAtLXdhdGNoXCJcbn07XG52YXIgcmVwb3NpdG9yeSA9IHtcblx0dHlwZTogXCJnaXRcIixcblx0dXJsOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZmVybmFuZG9qc2cvZWNzeS5naXRcIlxufTtcbnZhciBrZXl3b3JkcyA9IFtcblx0XCJlY3NcIixcblx0XCJlbnRpdHkgY29tcG9uZW50IHN5c3RlbVwiXG5dO1xudmFyIGF1dGhvciA9IFwiRmVybmFuZG8gU2VycmFubyA8ZmVybmFuZG9qc2dAZ21haWwuY29tPiAoaHR0cDovL2Zlcm5hbmRvanNnLmNvbSlcIjtcbnZhciBsaWNlbnNlID0gXCJNSVRcIjtcbnZhciBidWdzID0ge1xuXHR1cmw6IFwiaHR0cHM6Ly9naXRodWIuY29tL2Zlcm5hbmRvanNnL2Vjc3kvaXNzdWVzXCJcbn07XG52YXIgYXZhID0ge1xuXHRmaWxlczogW1xuXHRcdFwidGVzdC8qKi8qLnRlc3QuanNcIlxuXHRdLFxuXHRzb3VyY2VzOiBbXG5cdFx0XCJzcmMvKiovKi5qc1wiXG5cdF0sXG5cdHJlcXVpcmU6IFtcblx0XHRcImJhYmVsLXJlZ2lzdGVyXCIsXG5cdFx0XCJlc21cIlxuXHRdXG59O1xudmFyIGpzcG0gPSB7XG5cdGZpbGVzOiBbXG5cdFx0XCJwYWNrYWdlLmpzb25cIixcblx0XHRcIkxJQ0VOU0VcIixcblx0XHRcIlJFQURNRS5tZFwiLFxuXHRcdFwiYnVpbGQvZWNzeS5qc1wiLFxuXHRcdFwiYnVpbGQvZWNzeS5taW4uanNcIixcblx0XHRcImJ1aWxkL2Vjc3kubW9kdWxlLmpzXCJcblx0XSxcblx0ZGlyZWN0b3JpZXM6IHtcblx0fVxufTtcbnZhciBob21lcGFnZSA9IFwiaHR0cHM6Ly9naXRodWIuY29tL2Zlcm5hbmRvanNnL2Vjc3kjcmVhZG1lXCI7XG52YXIgZGV2RGVwZW5kZW5jaWVzID0ge1xuXHRcIkByb2xsdXAvcGx1Z2luLW5vZGUtcmVzb2x2ZVwiOiBcIl44LjAuMVwiLFxuXHRhdmE6IFwiXjEuNC4xXCIsXG5cdFwiYmFiZWwtY2xpXCI6IFwiXjYuMjYuMFwiLFxuXHRcImJhYmVsLWNvcmVcIjogXCJeNi4yNi4zXCIsXG5cdFwiYmFiZWwtZXNsaW50XCI6IFwiXjEwLjAuM1wiLFxuXHRcImJhYmVsLWxvYWRlclwiOiBcIl44LjAuNlwiLFxuXHRcImJlbmNobWFya2VyLWpzXCI6IFwiMC4wLjNcIixcblx0Y29uY3VycmVudGx5OiBcIl40LjEuMlwiLFxuXHRcImRvY3NpZnktY2xpXCI6IFwiXjQuNC4wXCIsXG5cdGVzbGludDogXCJeNS4xNi4wXCIsXG5cdFwiZXNsaW50LWNvbmZpZy1wcmV0dGllclwiOiBcIl40LjMuMFwiLFxuXHRcImVzbGludC1wbHVnaW4tcHJldHRpZXJcIjogXCJeMy4xLjJcIixcblx0XCJodHRwLXNlcnZlclwiOiBcIl4wLjExLjFcIixcblx0bm9kZW1vbjogXCJeMS4xOS40XCIsXG5cdHByZXR0aWVyOiBcIl4xLjE5LjFcIixcblx0cm9sbHVwOiBcIl4xLjI5LjBcIixcblx0XCJyb2xsdXAtcGx1Z2luLWpzb25cIjogXCJeNC4wLjBcIixcblx0XCJyb2xsdXAtcGx1Z2luLXRlcnNlclwiOiBcIl41LjIuMFwiLFxuXHR0eXBlZG9jOiBcIl4wLjE1LjhcIixcblx0XCJ0eXBlZG9jLXBsdWdpbi1tYXJrZG93blwiOiBcIl4yLjIuMTZcIixcblx0dHlwZXNjcmlwdDogXCJeMy43LjVcIlxufTtcbnZhciBwanNvbiA9IHtcblx0bmFtZTogbmFtZSxcblx0dmVyc2lvbjogdmVyc2lvbixcblx0ZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLFxuXHRtYWluOiBtYWluLFxuXHRcImpzbmV4dDptYWluXCI6IFwiYnVpbGQvZWNzeS5tb2R1bGUuanNcIixcblx0bW9kdWxlOiBtb2R1bGUsXG5cdHR5cGVzOiB0eXBlcyxcblx0c2NyaXB0czogc2NyaXB0cyxcblx0cmVwb3NpdG9yeTogcmVwb3NpdG9yeSxcblx0a2V5d29yZHM6IGtleXdvcmRzLFxuXHRhdXRob3I6IGF1dGhvcixcblx0bGljZW5zZTogbGljZW5zZSxcblx0YnVnczogYnVncyxcblx0YXZhOiBhdmEsXG5cdGpzcG06IGpzcG0sXG5cdGhvbWVwYWdlOiBob21lcGFnZSxcblx0ZGV2RGVwZW5kZW5jaWVzOiBkZXZEZXBlbmRlbmNpZXNcbn07XG5cbmNvbnN0IFZlcnNpb24gPSBwanNvbi52ZXJzaW9uO1xuXG5jbGFzcyBFbnRpdHkge1xuICBjb25zdHJ1Y3RvcihlbnRpdHlNYW5hZ2VyKSB7XG4gICAgdGhpcy5fZW50aXR5TWFuYWdlciA9IGVudGl0eU1hbmFnZXIgfHwgbnVsbDtcblxuICAgIC8vIFVuaXF1ZSBJRCBmb3IgdGhpcyBlbnRpdHlcbiAgICB0aGlzLmlkID0gZW50aXR5TWFuYWdlci5fbmV4dEVudGl0eUlkKys7XG5cbiAgICAvLyBMaXN0IG9mIGNvbXBvbmVudHMgdHlwZXMgdGhlIGVudGl0eSBoYXNcbiAgICB0aGlzLl9Db21wb25lbnRUeXBlcyA9IFtdO1xuXG4gICAgLy8gSW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudHNcbiAgICB0aGlzLl9jb21wb25lbnRzID0ge307XG5cbiAgICB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmUgPSB7fTtcblxuICAgIC8vIFF1ZXJpZXMgd2hlcmUgdGhlIGVudGl0eSBpcyBhZGRlZFxuICAgIHRoaXMucXVlcmllcyA9IFtdO1xuXG4gICAgLy8gVXNlZCBmb3IgZGVmZXJyZWQgcmVtb3ZhbFxuICAgIHRoaXMuX0NvbXBvbmVudFR5cGVzVG9SZW1vdmUgPSBbXTtcblxuICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcblxuICAgIC8vaWYgdGhlcmUgYXJlIHN0YXRlIGNvbXBvbmVudHMgb24gYSBlbnRpdHksIGl0IGNhbid0IGJlIHJlbW92ZWQgY29tcGxldGVseVxuICAgIHRoaXMubnVtU3RhdGVDb21wb25lbnRzID0gMDtcbiAgfVxuXG4gIC8vIENPTVBPTkVOVFNcblxuICBnZXRDb21wb25lbnQoQ29tcG9uZW50LCBpbmNsdWRlUmVtb3ZlZCkge1xuICAgIHZhciBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzW0NvbXBvbmVudC5uYW1lXTtcblxuICAgIGlmICghY29tcG9uZW50ICYmIGluY2x1ZGVSZW1vdmVkID09PSB0cnVlKSB7XG4gICAgICBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmVbQ29tcG9uZW50Lm5hbWVdO1xuICAgIH1cblxuICAgIHJldHVybiAgY29tcG9uZW50O1xuICB9XG5cbiAgZ2V0UmVtb3ZlZENvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5uYW1lXTtcbiAgfVxuXG4gIGdldENvbXBvbmVudHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHM7XG4gIH1cblxuICBnZXRDb21wb25lbnRzVG9SZW1vdmUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZTtcbiAgfVxuXG4gIGdldENvbXBvbmVudFR5cGVzKCkge1xuICAgIHJldHVybiB0aGlzLl9Db21wb25lbnRUeXBlcztcbiAgfVxuXG4gIGdldE11dGFibGVDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgcXVlcnkgPSB0aGlzLnF1ZXJpZXNbaV07XG4gICAgICAvLyBAdG9kbyBhY2NlbGVyYXRlIHRoaXMgY2hlY2suIE1heWJlIGhhdmluZyBxdWVyeS5fQ29tcG9uZW50cyBhcyBhbiBvYmplY3RcbiAgICAgIC8vIEB0b2RvIGFkZCBOb3QgY29tcG9uZW50c1xuICAgICAgaWYgKHF1ZXJ5LnJlYWN0aXZlICYmIHF1ZXJ5LkNvbXBvbmVudHMuaW5kZXhPZihDb21wb25lbnQpICE9PSAtMSkge1xuICAgICAgICBxdWVyeS5ldmVudERpc3BhdGNoZXIuZGlzcGF0Y2hFdmVudChcbiAgICAgICAgICBRdWVyeS5wcm90b3R5cGUuQ09NUE9ORU5UX0NIQU5HRUQsXG4gICAgICAgICAgdGhpcyxcbiAgICAgICAgICBjb21wb25lbnRcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgfVxuXG4gIGFkZENvbXBvbmVudChDb21wb25lbnQsIHZhbHVlcykge1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIuZW50aXR5QWRkQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudCwgdmFsdWVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbW92ZUNvbXBvbmVudChDb21wb25lbnQsIGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgdGhpcy5fZW50aXR5TWFuYWdlci5lbnRpdHlSZW1vdmVDb21wb25lbnQodGhpcywgQ29tcG9uZW50LCBmb3JjZUltbWVkaWF0ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBoYXNDb21wb25lbnQoQ29tcG9uZW50LCBpbmNsdWRlUmVtb3ZlZCkge1xuICAgIHJldHVybiAoXG4gICAgICAhIX50aGlzLl9Db21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCkgfHxcbiAgICAgIChpbmNsdWRlUmVtb3ZlZCA9PT0gdHJ1ZSAmJiB0aGlzLmhhc1JlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSlcbiAgICApO1xuICB9XG5cbiAgaGFzUmVtb3ZlZENvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICByZXR1cm4gISF+dGhpcy5fQ29tcG9uZW50VHlwZXNUb1JlbW92ZS5pbmRleE9mKENvbXBvbmVudCk7XG4gIH1cblxuICBoYXNBbGxDb21wb25lbnRzKENvbXBvbmVudHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IENvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICghdGhpcy5oYXNDb21wb25lbnQoQ29tcG9uZW50c1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBoYXNBbnlDb21wb25lbnRzKENvbXBvbmVudHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IENvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLmhhc0NvbXBvbmVudChDb21wb25lbnRzW2ldKSkgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJlbW92ZUFsbENvbXBvbmVudHMoZm9yY2VJbW1lZGlhdGUpIHtcbiAgICByZXR1cm4gdGhpcy5fZW50aXR5TWFuYWdlci5lbnRpdHlSZW1vdmVBbGxDb21wb25lbnRzKHRoaXMsIGZvcmNlSW1tZWRpYXRlKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgLy8gVE9ETzogVGhpcyBjYW4gZGVmaW5pdGVseSBiZSBvcHRpbWl6ZWRcbiAgICBmb3IgKHZhciBjb21wb25lbnROYW1lIGluIHNyYy5fY29tcG9uZW50cykge1xuICAgICAgdmFyIHNyY0NvbXBvbmVudCA9IHNyYy5fY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICAgIHRoaXMuYWRkQ29tcG9uZW50KHNyY0NvbXBvbmVudC5jb25zdHJ1Y3Rvcik7XG4gICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5nZXRDb21wb25lbnQoc3JjQ29tcG9uZW50LmNvbnN0cnVjdG9yKTtcbiAgICAgIGNvbXBvbmVudC5jb3B5KHNyY0NvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEVudGl0eSh0aGlzLl9lbnRpdHlNYW5hZ2VyKS5jb3B5KHRoaXMpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5pZCA9IHRoaXMuX2VudGl0eU1hbmFnZXIuX25leHRFbnRpdHlJZCsrO1xuICAgIHRoaXMuX0NvbXBvbmVudFR5cGVzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5xdWVyaWVzLmxlbmd0aCA9IDA7XG5cbiAgICBmb3IgKHZhciBjb21wb25lbnROYW1lIGluIHRoaXMuY29tcG9uZW50cykge1xuICAgICAgZGVsZXRlIHRoaXMuX2NvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2VudGl0eU1hbmFnZXIucmVtb3ZlRW50aXR5KHRoaXMsIGZvcmNlSW1tZWRpYXRlKTtcbiAgfVxufVxuXG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gIGVudGl0eVBvb2xTaXplOiAwLFxuICBlbnRpdHlDbGFzczogRW50aXR5XG59O1xuXG5jbGFzcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMub3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyID0gbmV3IENvbXBvbmVudE1hbmFnZXIodGhpcyk7XG4gICAgdGhpcy5lbnRpdHlNYW5hZ2VyID0gbmV3IEVudGl0eU1hbmFnZXIodGhpcyk7XG4gICAgdGhpcy5zeXN0ZW1NYW5hZ2VyID0gbmV3IFN5c3RlbU1hbmFnZXIodGhpcyk7XG5cbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgdGhpcy5ldmVudFF1ZXVlcyA9IHt9O1xuXG4gICAgaWYgKGhhc1dpbmRvdyAmJiB0eXBlb2YgQ3VzdG9tRXZlbnQgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHZhciBldmVudCA9IG5ldyBDdXN0b21FdmVudChcImVjc3ktd29ybGQtY3JlYXRlZFwiLCB7XG4gICAgICAgIGRldGFpbDogeyB3b3JsZDogdGhpcywgdmVyc2lvbjogVmVyc2lvbiB9XG4gICAgICB9KTtcbiAgICAgIHdpbmRvdy5kaXNwYXRjaEV2ZW50KGV2ZW50KTtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RUaW1lID0gbm93KCk7XG4gIH1cblxuICByZWdpc3RlckNvbXBvbmVudChDb21wb25lbnQsIG9iamVjdFBvb2wpIHtcbiAgICB0aGlzLmNvbXBvbmVudHNNYW5hZ2VyLnJlZ2lzdGVyQ29tcG9uZW50KENvbXBvbmVudCwgb2JqZWN0UG9vbCk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZWdpc3RlclN5c3RlbShTeXN0ZW0sIGF0dHJpYnV0ZXMpIHtcbiAgICB0aGlzLnN5c3RlbU1hbmFnZXIucmVnaXN0ZXJTeXN0ZW0oU3lzdGVtLCBhdHRyaWJ1dGVzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHVucmVnaXN0ZXJTeXN0ZW0oU3lzdGVtKSB7XG4gICAgdGhpcy5zeXN0ZW1NYW5hZ2VyLnVucmVnaXN0ZXJTeXN0ZW0oU3lzdGVtKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldFN5c3RlbShTeXN0ZW1DbGFzcykge1xuICAgIHJldHVybiB0aGlzLnN5c3RlbU1hbmFnZXIuZ2V0U3lzdGVtKFN5c3RlbUNsYXNzKTtcbiAgfVxuXG4gIGdldFN5c3RlbXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuc3lzdGVtTWFuYWdlci5nZXRTeXN0ZW1zKCk7XG4gIH1cblxuICBleGVjdXRlKGRlbHRhLCB0aW1lKSB7XG4gICAgaWYgKCFkZWx0YSkge1xuICAgICAgdGltZSA9IG5vdygpO1xuICAgICAgZGVsdGEgPSB0aW1lIC0gdGhpcy5sYXN0VGltZTtcbiAgICAgIHRoaXMubGFzdFRpbWUgPSB0aW1lO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcbiAgICAgIHRoaXMuc3lzdGVtTWFuYWdlci5leGVjdXRlKGRlbHRhLCB0aW1lKTtcbiAgICAgIHRoaXMuZW50aXR5TWFuYWdlci5wcm9jZXNzRGVmZXJyZWRSZW1vdmFsKCk7XG4gICAgfVxuICB9XG5cbiAgc3RvcCgpIHtcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcbiAgfVxuXG4gIHBsYXkoKSB7XG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcbiAgfVxuXG4gIGNyZWF0ZUVudGl0eShuYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50aXR5TWFuYWdlci5jcmVhdGVFbnRpdHkobmFtZSk7XG4gIH1cblxuICBzdGF0cygpIHtcbiAgICB2YXIgc3RhdHMgPSB7XG4gICAgICBlbnRpdGllczogdGhpcy5lbnRpdHlNYW5hZ2VyLnN0YXRzKCksXG4gICAgICBzeXN0ZW06IHRoaXMuc3lzdGVtTWFuYWdlci5zdGF0cygpXG4gICAgfTtcblxuICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHN0YXRzLCBudWxsLCAyKSk7XG4gIH1cbn1cblxuY2xhc3MgVGFnQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoZmFsc2UpO1xuICB9XG59XG5cblRhZ0NvbXBvbmVudC5pc1RhZ0NvbXBvbmVudCA9IHRydWU7XG5cbmNvbnN0IGNvcHlWYWx1ZSA9IChzcmMsIGRlc3QsIGtleSkgPT4gKGRlc3Rba2V5XSA9IHNyY1trZXldKTtcblxuY29uc3QgY2xvbmVWYWx1ZSA9IHNyYyA9PiBzcmM7XG5cbmNvbnN0IGNvcHlBcnJheSA9IChzcmMsIGRlc3QsIGtleSkgPT4ge1xuICBjb25zdCBzcmNBcnJheSA9IHNyY1trZXldO1xuICBjb25zdCBkZXN0QXJyYXkgPSBkZXN0W2tleV07XG5cbiAgZGVzdEFycmF5Lmxlbmd0aCA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzcmNBcnJheS5sZW5ndGg7IGkrKykge1xuICAgIGRlc3RBcnJheS5wdXNoKHNyY0FycmF5W2ldKTtcbiAgfVxuXG4gIHJldHVybiBkZXN0QXJyYXk7XG59O1xuXG5jb25zdCBjbG9uZUFycmF5ID0gc3JjID0+IHNyYy5zbGljZSgpO1xuXG5jb25zdCBjb3B5SlNPTiA9IChzcmMsIGRlc3QsIGtleSkgPT5cbiAgKGRlc3Rba2V5XSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoc3JjW2tleV0pKSk7XG5cbmNvbnN0IGNsb25lSlNPTiA9IHNyYyA9PiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHNyYykpO1xuXG5jb25zdCBjb3B5Q29weWFibGUgPSAoc3JjLCBkZXN0LCBrZXkpID0+IGRlc3Rba2V5XS5jb3B5KHNyY1trZXldKTtcblxuY29uc3QgY2xvbmVDbG9uYWJsZSA9IHNyYyA9PiBzcmMuY2xvbmUoKTtcblxuZnVuY3Rpb24gY3JlYXRlVHlwZSh0eXBlRGVmaW5pdGlvbikge1xuICB2YXIgbWFuZGF0b3J5UHJvcGVydGllcyA9IFtcIm5hbWVcIiwgXCJkZWZhdWx0XCIsIFwiY29weVwiLCBcImNsb25lXCJdO1xuXG4gIHZhciB1bmRlZmluZWRQcm9wZXJ0aWVzID0gbWFuZGF0b3J5UHJvcGVydGllcy5maWx0ZXIocCA9PiB7XG4gICAgcmV0dXJuICF0eXBlRGVmaW5pdGlvbi5oYXNPd25Qcm9wZXJ0eShwKTtcbiAgfSk7XG5cbiAgaWYgKHVuZGVmaW5lZFByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIGBjcmVhdGVUeXBlIGV4cGVjdHMgYSB0eXBlIGRlZmluaXRpb24gd2l0aCB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6ICR7dW5kZWZpbmVkUHJvcGVydGllcy5qb2luKFxuICAgICAgICBcIiwgXCJcbiAgICAgICl9YFxuICAgICk7XG4gIH1cblxuICB0eXBlRGVmaW5pdGlvbi5pc1R5cGUgPSB0cnVlO1xuXG4gIHJldHVybiB0eXBlRGVmaW5pdGlvbjtcbn1cblxuLyoqXG4gKiBTdGFuZGFyZCB0eXBlc1xuICovXG5jb25zdCBUeXBlcyA9IHtcbiAgTnVtYmVyOiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIk51bWJlclwiLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29weTogY29weVZhbHVlLFxuICAgIGNsb25lOiBjbG9uZVZhbHVlXG4gIH0pLFxuXG4gIEJvb2xlYW46IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiQm9vbGVhblwiLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvcHk6IGNvcHlWYWx1ZSxcbiAgICBjbG9uZTogY2xvbmVWYWx1ZVxuICB9KSxcblxuICBTdHJpbmc6IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiU3RyaW5nXCIsXG4gICAgZGVmYXVsdDogXCJcIixcbiAgICBjb3B5OiBjb3B5VmFsdWUsXG4gICAgY2xvbmU6IGNsb25lVmFsdWVcbiAgfSksXG5cbiAgQXJyYXk6IGNyZWF0ZVR5cGUoe1xuICAgIG5hbWU6IFwiQXJyYXlcIixcbiAgICBkZWZhdWx0OiBbXSxcbiAgICBjb3B5OiBjb3B5QXJyYXksXG4gICAgY2xvbmU6IGNsb25lQXJyYXlcbiAgfSksXG5cbiAgT2JqZWN0OiBjcmVhdGVUeXBlKHtcbiAgICBuYW1lOiBcIk9iamVjdFwiLFxuICAgIGRlZmF1bHQ6IHVuZGVmaW5lZCxcbiAgICBjb3B5OiBjb3B5VmFsdWUsXG4gICAgY2xvbmU6IGNsb25lVmFsdWVcbiAgfSksXG5cbiAgSlNPTjogY3JlYXRlVHlwZSh7XG4gICAgbmFtZTogXCJKU09OXCIsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBjb3B5OiBjb3B5SlNPTixcbiAgICBjbG9uZTogY2xvbmVKU09OXG4gIH0pXG59O1xuXG5mdW5jdGlvbiBnZW5lcmF0ZUlkKGxlbmd0aCkge1xuICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgdmFyIGNoYXJhY3RlcnMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaMDEyMzQ1Njc4OVwiO1xuICB2YXIgY2hhcmFjdGVyc0xlbmd0aCA9IGNoYXJhY3RlcnMubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgcmVzdWx0ICs9IGNoYXJhY3RlcnMuY2hhckF0KE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIGNoYXJhY3RlcnNMZW5ndGgpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpbmplY3RTY3JpcHQoc3JjLCBvbkxvYWQpIHtcbiAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIik7XG4gIC8vIEB0b2RvIFVzZSBsaW5rIHRvIHRoZSBlY3N5LWRldnRvb2xzIHJlcG8/XG4gIHNjcmlwdC5zcmMgPSBzcmM7XG4gIHNjcmlwdC5vbmxvYWQgPSBvbkxvYWQ7XG4gIChkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbn1cblxuLyogZ2xvYmFsIFBlZXIgKi9cblxuZnVuY3Rpb24gaG9va0NvbnNvbGVBbmRFcnJvcnMoY29ubmVjdGlvbikge1xuICB2YXIgd3JhcEZ1bmN0aW9ucyA9IFtcImVycm9yXCIsIFwid2FybmluZ1wiLCBcImxvZ1wiXTtcbiAgd3JhcEZ1bmN0aW9ucy5mb3JFYWNoKGtleSA9PiB7XG4gICAgaWYgKHR5cGVvZiBjb25zb2xlW2tleV0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIGZuID0gY29uc29sZVtrZXldLmJpbmQoY29uc29sZSk7XG4gICAgICBjb25zb2xlW2tleV0gPSAoLi4uYXJncykgPT4ge1xuICAgICAgICBjb25uZWN0aW9uLnNlbmQoe1xuICAgICAgICAgIG1ldGhvZDogXCJjb25zb2xlXCIsXG4gICAgICAgICAgdHlwZToga2V5LFxuICAgICAgICAgIGFyZ3M6IEpTT04uc3RyaW5naWZ5KGFyZ3MpXG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkobnVsbCwgYXJncyk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBlcnJvciA9PiB7XG4gICAgY29ubmVjdGlvbi5zZW5kKHtcbiAgICAgIG1ldGhvZDogXCJlcnJvclwiLFxuICAgICAgZXJyb3I6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgbWVzc2FnZTogZXJyb3IuZXJyb3IubWVzc2FnZSxcbiAgICAgICAgc3RhY2s6IGVycm9yLmVycm9yLnN0YWNrXG4gICAgICB9KVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5jbHVkZVJlbW90ZUlkSFRNTChyZW1vdGVJZCkge1xuICBsZXQgaW5mb0RpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gIGluZm9EaXYuc3R5bGUuY3NzVGV4dCA9IGBcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGJhY2tncm91bmQtY29sb3I6ICMzMzM7XG4gICAgY29sb3I6ICNhYWE7XG4gICAgZGlzcGxheTpmbGV4O1xuICAgIGZvbnQtZmFtaWx5OiBBcmlhbDtcbiAgICBmb250LXNpemU6IDEuMWVtO1xuICAgIGhlaWdodDogNDBweDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBsZWZ0OiAwO1xuICAgIG9wYWNpdHk6IDAuOTtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgcmlnaHQ6IDA7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHRvcDogMDtcbiAgYDtcblxuICBpbmZvRGl2LmlubmVySFRNTCA9IGBPcGVuIEVDU1kgZGV2dG9vbHMgdG8gY29ubmVjdCB0byB0aGlzIHBhZ2UgdXNpbmcgdGhlIGNvZGU6Jm5ic3A7PGIgc3R5bGU9XCJjb2xvcjogI2ZmZlwiPiR7cmVtb3RlSWR9PC9iPiZuYnNwOzxidXR0b24gb25DbGljaz1cImdlbmVyYXRlTmV3Q29kZSgpXCI+R2VuZXJhdGUgbmV3IGNvZGU8L2J1dHRvbj5gO1xuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGluZm9EaXYpO1xuXG4gIHJldHVybiBpbmZvRGl2O1xufVxuXG5mdW5jdGlvbiBlbmFibGVSZW1vdGVEZXZ0b29scyhyZW1vdGVJZCkge1xuICBpZiAoIWhhc1dpbmRvdykge1xuICAgIGNvbnNvbGUud2FybihcIlJlbW90ZSBkZXZ0b29scyBub3QgYXZhaWxhYmxlIG91dHNpZGUgdGhlIGJyb3dzZXJcIik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd2luZG93LmdlbmVyYXRlTmV3Q29kZSA9ICgpID0+IHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLmNsZWFyKCk7XG4gICAgcmVtb3RlSWQgPSBnZW5lcmF0ZUlkKDYpO1xuICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Uuc2V0SXRlbShcImVjc3lSZW1vdGVJZFwiLCByZW1vdGVJZCk7XG4gICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZChmYWxzZSk7XG4gIH07XG5cbiAgcmVtb3RlSWQgPSByZW1vdGVJZCB8fCB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oXCJlY3N5UmVtb3RlSWRcIik7XG4gIGlmICghcmVtb3RlSWQpIHtcbiAgICByZW1vdGVJZCA9IGdlbmVyYXRlSWQoNik7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKFwiZWNzeVJlbW90ZUlkXCIsIHJlbW90ZUlkKTtcbiAgfVxuXG4gIGxldCBpbmZvRGl2ID0gaW5jbHVkZVJlbW90ZUlkSFRNTChyZW1vdGVJZCk7XG5cbiAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFNfSU5KRUNURUQgPSB0cnVlO1xuICB3aW5kb3cuX19FQ1NZX1JFTU9URV9ERVZUT09MUyA9IHt9O1xuXG4gIGxldCBWZXJzaW9uID0gXCJcIjtcblxuICAvLyBUaGlzIGlzIHVzZWQgdG8gY29sbGVjdCB0aGUgd29ybGRzIGNyZWF0ZWQgYmVmb3JlIHRoZSBjb21tdW5pY2F0aW9uIGlzIGJlaW5nIGVzdGFibGlzaGVkXG4gIGxldCB3b3JsZHNCZWZvcmVMb2FkaW5nID0gW107XG4gIGxldCBvbldvcmxkQ3JlYXRlZCA9IGUgPT4ge1xuICAgIHZhciB3b3JsZCA9IGUuZGV0YWlsLndvcmxkO1xuICAgIFZlcnNpb24gPSBlLmRldGFpbC52ZXJzaW9uO1xuICAgIHdvcmxkc0JlZm9yZUxvYWRpbmcucHVzaCh3b3JsZCk7XG4gIH07XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZWNzeS13b3JsZC1jcmVhdGVkXCIsIG9uV29ybGRDcmVhdGVkKTtcblxuICBsZXQgb25Mb2FkZWQgPSAoKSA9PiB7XG4gICAgdmFyIHBlZXIgPSBuZXcgUGVlcihyZW1vdGVJZCk7XG4gICAgcGVlci5vbihcIm9wZW5cIiwgKC8qIGlkICovKSA9PiB7XG4gICAgICBwZWVyLm9uKFwiY29ubmVjdGlvblwiLCBjb25uZWN0aW9uID0+IHtcbiAgICAgICAgd2luZG93Ll9fRUNTWV9SRU1PVEVfREVWVE9PTFMuY29ubmVjdGlvbiA9IGNvbm5lY3Rpb247XG4gICAgICAgIGNvbm5lY3Rpb24ub24oXCJvcGVuXCIsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIC8vIGluZm9EaXYuc3R5bGUudmlzaWJpbGl0eSA9IFwiaGlkZGVuXCI7XG4gICAgICAgICAgaW5mb0Rpdi5pbm5lckhUTUwgPSBcIkNvbm5lY3RlZFwiO1xuXG4gICAgICAgICAgLy8gUmVjZWl2ZSBtZXNzYWdlc1xuICAgICAgICAgIGNvbm5lY3Rpb24ub24oXCJkYXRhXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnR5cGUgPT09IFwiaW5pdFwiKSB7XG4gICAgICAgICAgICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpO1xuICAgICAgICAgICAgICBzY3JpcHQuc2V0QXR0cmlidXRlKFwidHlwZVwiLCBcInRleHQvamF2YXNjcmlwdFwiKTtcbiAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXG4gICAgICAgICAgICAgICAgLy8gT25jZSB0aGUgc2NyaXB0IGlzIGluamVjdGVkIHdlIGRvbid0IG5lZWQgdG8gbGlzdGVuXG4gICAgICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXG4gICAgICAgICAgICAgICAgICBcImVjc3ktd29ybGQtY3JlYXRlZFwiLFxuICAgICAgICAgICAgICAgICAgb25Xb3JsZENyZWF0ZWRcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgIHdvcmxkc0JlZm9yZUxvYWRpbmcuZm9yRWFjaCh3b3JsZCA9PiB7XG4gICAgICAgICAgICAgICAgICB2YXIgZXZlbnQgPSBuZXcgQ3VzdG9tRXZlbnQoXCJlY3N5LXdvcmxkLWNyZWF0ZWRcIiwge1xuICAgICAgICAgICAgICAgICAgICBkZXRhaWw6IHsgd29ybGQ6IHdvcmxkLCB2ZXJzaW9uOiBWZXJzaW9uIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgd2luZG93LmRpc3BhdGNoRXZlbnQoZXZlbnQpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBzY3JpcHQuaW5uZXJIVE1MID0gZGF0YS5zY3JpcHQ7XG4gICAgICAgICAgICAgIChkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICAgICAgICAgICAgc2NyaXB0Lm9ubG9hZCgpO1xuXG4gICAgICAgICAgICAgIGhvb2tDb25zb2xlQW5kRXJyb3JzKGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChkYXRhLnR5cGUgPT09IFwiZXhlY3V0ZVNjcmlwdFwiKSB7XG4gICAgICAgICAgICAgIGxldCB2YWx1ZSA9IGV2YWwoZGF0YS5zY3JpcHQpO1xuICAgICAgICAgICAgICBpZiAoZGF0YS5yZXR1cm5FdmFsKSB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbi5zZW5kKHtcbiAgICAgICAgICAgICAgICAgIG1ldGhvZDogXCJldmFsUmV0dXJuXCIsXG4gICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIC8vIEluamVjdCBQZWVySlMgc2NyaXB0XG4gIGluamVjdFNjcmlwdChcbiAgICBcImh0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9ucG0vcGVlcmpzQDAuMy4yMC9kaXN0L3BlZXIubWluLmpzXCIsXG4gICAgb25Mb2FkZWRcbiAgKTtcbn1cblxuaWYgKGhhc1dpbmRvdykge1xuICBjb25zdCB1cmxQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuXG4gIC8vIEB0b2RvIFByb3ZpZGUgYSB3YXkgdG8gZGlzYWJsZSBpdCBpZiBuZWVkZWRcbiAgaWYgKHVybFBhcmFtcy5oYXMoXCJlbmFibGUtcmVtb3RlLWRldnRvb2xzXCIpKSB7XG4gICAgZW5hYmxlUmVtb3RlRGV2dG9vbHMoKTtcbiAgfVxufVxuXG5leHBvcnQgeyBDb21wb25lbnQsIE5vdCwgT2JqZWN0UG9vbCwgU3lzdGVtLCBTeXN0ZW1TdGF0ZUNvbXBvbmVudCwgVGFnQ29tcG9uZW50LCBUeXBlcywgVmVyc2lvbiwgV29ybGQsIEVudGl0eSBhcyBfRW50aXR5LCBjbG9uZUFycmF5LCBjbG9uZUNsb25hYmxlLCBjbG9uZUpTT04sIGNsb25lVmFsdWUsIGNvcHlBcnJheSwgY29weUNvcHlhYmxlLCBjb3B5SlNPTiwgY29weVZhbHVlLCBjcmVhdGVUeXBlLCBlbmFibGVSZW1vdGVEZXZ0b29scyB9O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0ptYVd4bElqb2laV056ZVM1dGIyUjFiR1V1YW5NaUxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OVZkR2xzY3k1cWN5SXNJaTR1TDNOeVl5OUZkbVZ1ZEVScGMzQmhkR05vWlhJdWFuTWlMQ0l1TGk5emNtTXZVWFZsY25rdWFuTWlMQ0l1TGk5emNtTXZVM2x6ZEdWdExtcHpJaXdpTGk0dmMzSmpMMU41YzNSbGJVMWhibUZuWlhJdWFuTWlMQ0l1TGk5emNtTXZUMkpxWldOMFVHOXZiQzVxY3lJc0lpNHVMM055WXk5UmRXVnllVTFoYm1GblpYSXVhbk1pTENJdUxpOXpjbU12UTI5dGNHOXVaVzUwTG1weklpd2lMaTR2YzNKakwxTjVjM1JsYlZOMFlYUmxRMjl0Y0c5dVpXNTBMbXB6SWl3aUxpNHZjM0pqTDBWdWRHbDBlVTFoYm1GblpYSXVhbk1pTENJdUxpOXpjbU12UTI5dGNHOXVaVzUwVFdGdVlXZGxjaTVxY3lJc0lpNHVMM055WXk5V1pYSnphVzl1TG1weklpd2lMaTR2YzNKakwwVnVkR2wwZVM1cWN5SXNJaTR1TDNOeVl5OVhiM0pzWkM1cWN5SXNJaTR1TDNOeVl5OVVZV2REYjIxd2IyNWxiblF1YW5NaUxDSXVMaTl6Y21NdlZIbHdaWE11YW5NaUxDSXVMaTl6Y21NdlVtVnRiM1JsUkdWMlZHOXZiSE12ZFhScGJITXVhbk1pTENJdUxpOXpjbU12VW1WdGIzUmxSR1YyVkc5dmJITXZhVzVrWlhndWFuTWlYU3dpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpTHlvcVhHNGdLaUJTWlhSMWNtNGdkR2hsSUc1aGJXVWdiMllnWVNCamIyMXdiMjVsYm5SY2JpQXFJRUJ3WVhKaGJTQjdRMjl0Y0c5dVpXNTBmU0JEYjIxd2IyNWxiblJjYmlBcUlFQndjbWwyWVhSbFhHNGdLaTljYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJuWlhST1lXMWxLRU52YlhCdmJtVnVkQ2tnZTF4dUlDQnlaWFIxY200Z1EyOXRjRzl1Wlc1MExtNWhiV1U3WEc1OVhHNWNiaThxS2x4dUlDb2dVbVYwZFhKdUlHRWdkbUZzYVdRZ2NISnZjR1Z5ZEhrZ2JtRnRaU0JtYjNJZ2RHaGxJRU52YlhCdmJtVnVkRnh1SUNvZ1FIQmhjbUZ0SUh0RGIyMXdiMjVsYm5SOUlFTnZiWEJ2Ym1WdWRGeHVJQ29nUUhCeWFYWmhkR1ZjYmlBcUwxeHVaWGh3YjNKMElHWjFibU4wYVc5dUlHTnZiWEJ2Ym1WdWRGQnliM0JsY25SNVRtRnRaU2hEYjIxd2IyNWxiblFwSUh0Y2JpQWdjbVYwZFhKdUlHZGxkRTVoYldVb1EyOXRjRzl1Wlc1MEtUdGNibjFjYmx4dUx5b3FYRzRnS2lCSFpYUWdZU0JyWlhrZ1puSnZiU0JoSUd4cGMzUWdiMllnWTI5dGNHOXVaVzUwYzF4dUlDb2dRSEJoY21GdElIdEJjbkpoZVNoRGIyMXdiMjVsYm5RcGZTQkRiMjF3YjI1bGJuUnpJRUZ5Y21GNUlHOW1JR052YlhCdmJtVnVkSE1nZEc4Z1oyVnVaWEpoZEdVZ2RHaGxJR3RsZVZ4dUlDb2dRSEJ5YVhaaGRHVmNiaUFxTDF4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUhGMVpYSjVTMlY1S0VOdmJYQnZibVZ1ZEhNcElIdGNiaUFnZG1GeUlHNWhiV1Z6SUQwZ1cxMDdYRzRnSUdadmNpQW9kbUZ5SUc0Z1BTQXdPeUJ1SUR3Z1EyOXRjRzl1Wlc1MGN5NXNaVzVuZEdnN0lHNHJLeWtnZTF4dUlDQWdJSFpoY2lCVUlEMGdRMjl0Y0c5dVpXNTBjMXR1WFR0Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUZRZ1BUMDlJRndpYjJKcVpXTjBYQ0lwSUh0Y2JpQWdJQ0FnSUhaaGNpQnZjR1Z5WVhSdmNpQTlJRlF1YjNCbGNtRjBiM0lnUFQwOUlGd2libTkwWENJZ1B5QmNJaUZjSWlBNklGUXViM0JsY21GMGIzSTdYRzRnSUNBZ0lDQnVZVzFsY3k1d2RYTm9LRzl3WlhKaGRHOXlJQ3NnWjJWMFRtRnRaU2hVTGtOdmJYQnZibVZ1ZENrcE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0J1WVcxbGN5NXdkWE5vS0dkbGRFNWhiV1VvVkNrcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCdVlXMWxjeTV6YjNKMEtDa3VhbTlwYmloY0lpMWNJaWs3WEc1OVhHNWNiaTh2SUVSbGRHVmpkRzl5SUdadmNpQmljbTkzYzJWeUozTWdYQ0ozYVc1a2IzZGNJbHh1Wlhod2IzSjBJR052Ym5OMElHaGhjMWRwYm1SdmR5QTlJSFI1Y0dWdlppQjNhVzVrYjNjZ0lUMDlJRndpZFc1a1pXWnBibVZrWENJN1hHNWNiaTh2SUhCbGNtWnZjbTFoYm1ObExtNXZkeWdwSUZ3aWNHOXNlV1pwYkd4Y0lseHVaWGh3YjNKMElHTnZibk4wSUc1dmR5QTlYRzRnSUdoaGMxZHBibVJ2ZHlBbUppQjBlWEJsYjJZZ2QybHVaRzkzTG5CbGNtWnZjbTFoYm1ObElDRTlQU0JjSW5WdVpHVm1hVzVsWkZ3aVhHNGdJQ0FnUHlCd1pYSm1iM0p0WVc1alpTNXViM2N1WW1sdVpDaHdaWEptYjNKdFlXNWpaU2xjYmlBZ0lDQTZJRVJoZEdVdWJtOTNMbUpwYm1Rb1JHRjBaU2s3WEc0aUxDSXZLaXBjYmlBcUlFQndjbWwyWVhSbFhHNGdLaUJBWTJ4aGMzTWdSWFpsYm5SRWFYTndZWFJqYUdWeVhHNGdLaTljYm1WNGNHOXlkQ0JrWldaaGRXeDBJR05zWVhOeklFVjJaVzUwUkdsemNHRjBZMmhsY2lCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0NrZ2UxeHVJQ0FnSUhSb2FYTXVYMnhwYzNSbGJtVnljeUE5SUh0OU8xeHVJQ0FnSUhSb2FYTXVjM1JoZEhNZ1BTQjdYRzRnSUNBZ0lDQm1hWEpsWkRvZ01DeGNiaUFnSUNBZ0lHaGhibVJzWldRNklEQmNiaUFnSUNCOU8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUZrWkNCaGJpQmxkbVZ1ZENCc2FYTjBaVzVsY2x4dUlDQWdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdaWFpsYm5ST1lXMWxJRTVoYldVZ2IyWWdkR2hsSUdWMlpXNTBJSFJ2SUd4cGMzUmxibHh1SUNBZ0tpQkFjR0Z5WVcwZ2UwWjFibU4wYVc5dWZTQnNhWE4wWlc1bGNpQkRZV3hzWW1GamF5QjBieUIwY21sbloyVnlJSGRvWlc0Z2RHaGxJR1YyWlc1MElHbHpJR1pwY21Wa1hHNGdJQ0FxTDF4dUlDQmhaR1JGZG1WdWRFeHBjM1JsYm1WeUtHVjJaVzUwVG1GdFpTd2diR2x6ZEdWdVpYSXBJSHRjYmlBZ0lDQnNaWFFnYkdsemRHVnVaWEp6SUQwZ2RHaHBjeTVmYkdsemRHVnVaWEp6TzF4dUlDQWdJR2xtSUNoc2FYTjBaVzVsY25OYlpYWmxiblJPWVcxbFhTQTlQVDBnZFc1a1pXWnBibVZrS1NCN1hHNGdJQ0FnSUNCc2FYTjBaVzVsY25OYlpYWmxiblJPWVcxbFhTQTlJRnRkTzF4dUlDQWdJSDFjYmx4dUlDQWdJR2xtSUNoc2FYTjBaVzVsY25OYlpYWmxiblJPWVcxbFhTNXBibVJsZUU5bUtHeHBjM1JsYm1WeUtTQTlQVDBnTFRFcElIdGNiaUFnSUNBZ0lHeHBjM1JsYm1WeWMxdGxkbVZ1ZEU1aGJXVmRMbkIxYzJnb2JHbHpkR1Z1WlhJcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkRhR1ZqYXlCcFppQmhiaUJsZG1WdWRDQnNhWE4wWlc1bGNpQnBjeUJoYkhKbFlXUjVJR0ZrWkdWa0lIUnZJSFJvWlNCc2FYTjBJRzltSUd4cGMzUmxibVZ5YzF4dUlDQWdLaUJBY0dGeVlXMGdlMU4wY21sdVozMGdaWFpsYm5ST1lXMWxJRTVoYldVZ2IyWWdkR2hsSUdWMlpXNTBJSFJ2SUdOb1pXTnJYRzRnSUNBcUlFQndZWEpoYlNCN1JuVnVZM1JwYjI1OUlHeHBjM1JsYm1WeUlFTmhiR3hpWVdOcklHWnZjaUIwYUdVZ2MzQmxZMmxtYVdWa0lHVjJaVzUwWEc0Z0lDQXFMMXh1SUNCb1lYTkZkbVZ1ZEV4cGMzUmxibVZ5S0dWMlpXNTBUbUZ0WlN3Z2JHbHpkR1Z1WlhJcElIdGNiaUFnSUNCeVpYUjFjbTRnS0Z4dUlDQWdJQ0FnZEdocGN5NWZiR2x6ZEdWdVpYSnpXMlYyWlc1MFRtRnRaVjBnSVQwOUlIVnVaR1ZtYVc1bFpDQW1KbHh1SUNBZ0lDQWdkR2hwY3k1ZmJHbHpkR1Z1WlhKelcyVjJaVzUwVG1GdFpWMHVhVzVrWlhoUFppaHNhWE4wWlc1bGNpa2dJVDA5SUMweFhHNGdJQ0FnS1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlNaVzF2ZG1VZ1lXNGdaWFpsYm5RZ2JHbHpkR1Z1WlhKY2JpQWdJQ29nUUhCaGNtRnRJSHRUZEhKcGJtZDlJR1YyWlc1MFRtRnRaU0JPWVcxbElHOW1JSFJvWlNCbGRtVnVkQ0IwYnlCeVpXMXZkbVZjYmlBZ0lDb2dRSEJoY21GdElIdEdkVzVqZEdsdmJuMGdiR2x6ZEdWdVpYSWdRMkZzYkdKaFkyc2dabTl5SUhSb1pTQnpjR1ZqYVdacFpXUWdaWFpsYm5SY2JpQWdJQ292WEc0Z0lISmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9aWFpsYm5ST1lXMWxMQ0JzYVhOMFpXNWxjaWtnZTF4dUlDQWdJSFpoY2lCc2FYTjBaVzVsY2tGeWNtRjVJRDBnZEdocGN5NWZiR2x6ZEdWdVpYSnpXMlYyWlc1MFRtRnRaVjA3WEc0Z0lDQWdhV1lnS0d4cGMzUmxibVZ5UVhKeVlYa2dJVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUNBZ2RtRnlJR2x1WkdWNElEMGdiR2x6ZEdWdVpYSkJjbkpoZVM1cGJtUmxlRTltS0d4cGMzUmxibVZ5S1R0Y2JpQWdJQ0FnSUdsbUlDaHBibVJsZUNBaFBUMGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ2JHbHpkR1Z1WlhKQmNuSmhlUzV6Y0d4cFkyVW9hVzVrWlhnc0lERXBPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJFYVhOd1lYUmphQ0JoYmlCbGRtVnVkRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UxTjBjbWx1WjMwZ1pYWmxiblJPWVcxbElFNWhiV1VnYjJZZ2RHaGxJR1YyWlc1MElIUnZJR1JwYzNCaGRHTm9YRzRnSUNBcUlFQndZWEpoYlNCN1JXNTBhWFI1ZlNCbGJuUnBkSGtnS0U5d2RHbHZibUZzS1NCRmJuUnBkSGtnZEc4Z1pXMXBkRnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwTnZiWEJ2Ym1WdWRIMGdZMjl0Y0c5dVpXNTBYRzRnSUNBcUwxeHVJQ0JrYVhOd1lYUmphRVYyWlc1MEtHVjJaVzUwVG1GdFpTd2daVzUwYVhSNUxDQmpiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQjBhR2x6TG5OMFlYUnpMbVpwY21Wa0t5czdYRzVjYmlBZ0lDQjJZWElnYkdsemRHVnVaWEpCY25KaGVTQTlJSFJvYVhNdVgyeHBjM1JsYm1WeWMxdGxkbVZ1ZEU1aGJXVmRPMXh1SUNBZ0lHbG1JQ2hzYVhOMFpXNWxja0Z5Y21GNUlDRTlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUhaaGNpQmhjbkpoZVNBOUlHeHBjM1JsYm1WeVFYSnlZWGt1YzJ4cFkyVW9NQ2s3WEc1Y2JpQWdJQ0FnSUdadmNpQW9kbUZ5SUdrZ1BTQXdPeUJwSUR3Z1lYSnlZWGt1YkdWdVozUm9PeUJwS3lzcElIdGNiaUFnSUNBZ0lDQWdZWEp5WVhsYmFWMHVZMkZzYkNoMGFHbHpMQ0JsYm5ScGRIa3NJR052YlhCdmJtVnVkQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNCOVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUZKbGMyVjBJSE4wWVhSeklHTnZkVzUwWlhKelhHNGdJQ0FxTDF4dUlDQnlaWE5sZEVOdmRXNTBaWEp6S0NrZ2UxeHVJQ0FnSUhSb2FYTXVjM1JoZEhNdVptbHlaV1FnUFNCMGFHbHpMbk4wWVhSekxtaGhibVJzWldRZ1BTQXdPMXh1SUNCOVhHNTlYRzRpTENKcGJYQnZjblFnUlhabGJuUkVhWE53WVhSamFHVnlJR1p5YjIwZ1hDSXVMMFYyWlc1MFJHbHpjR0YwWTJobGNpNXFjMXdpTzF4dWFXMXdiM0owSUhzZ2NYVmxjbmxMWlhrZ2ZTQm1jbTl0SUZ3aUxpOVZkR2xzY3k1cWMxd2lPMXh1WEc1bGVIQnZjblFnWkdWbVlYVnNkQ0JqYkdGemN5QlJkV1Z5ZVNCN1hHNGdJQzhxS2x4dUlDQWdLaUJBY0dGeVlXMGdlMEZ5Y21GNUtFTnZiWEJ2Ym1WdWRDbDlJRU52YlhCdmJtVnVkSE1nVEdsemRDQnZaaUIwZVhCbGN5QnZaaUJqYjIxd2IyNWxiblJ6SUhSdklIRjFaWEo1WEc0Z0lDQXFMMXh1SUNCamIyNXpkSEoxWTNSdmNpaERiMjF3YjI1bGJuUnpMQ0J0WVc1aFoyVnlLU0I3WEc0Z0lDQWdkR2hwY3k1RGIyMXdiMjVsYm5SeklEMGdXMTA3WEc0Z0lDQWdkR2hwY3k1T2IzUkRiMjF3YjI1bGJuUnpJRDBnVzEwN1hHNWNiaUFnSUNCRGIyMXdiMjVsYm5SekxtWnZja1ZoWTJnb1kyOXRjRzl1Wlc1MElEMCtJSHRjYmlBZ0lDQWdJR2xtSUNoMGVYQmxiMllnWTI5dGNHOXVaVzUwSUQwOVBTQmNJbTlpYW1WamRGd2lLU0I3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVUbTkwUTI5dGNHOXVaVzUwY3k1d2RYTm9LR052YlhCdmJtVnVkQzVEYjIxd2IyNWxiblFwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NURiMjF3YjI1bGJuUnpMbkIxYzJnb1kyOXRjRzl1Wlc1MEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOUtUdGNibHh1SUNBZ0lHbG1JQ2gwYUdsekxrTnZiWEJ2Ym1WdWRITXViR1Z1WjNSb0lEMDlQU0F3S1NCN1hHNGdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWENKRFlXNG5kQ0JqY21WaGRHVWdZU0J4ZFdWeWVTQjNhWFJvYjNWMElHTnZiWEJ2Ym1WdWRITmNJaWs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1bGJuUnBkR2xsY3lBOUlGdGRPMXh1WEc0Z0lDQWdkR2hwY3k1bGRtVnVkRVJwYzNCaGRHTm9aWElnUFNCdVpYY2dSWFpsYm5SRWFYTndZWFJqYUdWeUtDazdYRzVjYmlBZ0lDQXZMeUJVYUdseklIRjFaWEo1SUdseklHSmxhVzVuSUhWelpXUWdZbmtnWVNCeVpXRmpkR2wyWlNCemVYTjBaVzFjYmlBZ0lDQjBhR2x6TG5KbFlXTjBhWFpsSUQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0IwYUdsekxtdGxlU0E5SUhGMVpYSjVTMlY1S0VOdmJYQnZibVZ1ZEhNcE8xeHVYRzRnSUNBZ0x5OGdSbWxzYkNCMGFHVWdjWFZsY25rZ2QybDBhQ0IwYUdVZ1pYaHBjM1JwYm1jZ1pXNTBhWFJwWlhOY2JpQWdJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUcxaGJtRm5aWEl1WDJWdWRHbDBhV1Z6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQjJZWElnWlc1MGFYUjVJRDBnYldGdVlXZGxjaTVmWlc1MGFYUnBaWE5iYVYwN1hHNGdJQ0FnSUNCcFppQW9kR2hwY3k1dFlYUmphQ2hsYm5ScGRIa3BLU0I3WEc0Z0lDQWdJQ0FnSUM4dklFQjBiMlJ2SUQ4L1B5QjBhR2x6TG1Ga1pFVnVkR2wwZVNobGJuUnBkSGtwT3lBOVBpQndjbVYyWlc1MGFXNW5JSFJvWlNCbGRtVnVkQ0IwYnlCaVpTQm5aVzVsY21GMFpXUmNiaUFnSUNBZ0lDQWdaVzUwYVhSNUxuRjFaWEpwWlhNdWNIVnphQ2gwYUdsektUdGNiaUFnSUNBZ0lDQWdkR2hwY3k1bGJuUnBkR2xsY3k1d2RYTm9LR1Z1ZEdsMGVTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUZrWkNCbGJuUnBkSGtnZEc4Z2RHaHBjeUJ4ZFdWeWVWeHVJQ0FnS2lCQWNHRnlZVzBnZTBWdWRHbDBlWDBnWlc1MGFYUjVYRzRnSUNBcUwxeHVJQ0JoWkdSRmJuUnBkSGtvWlc1MGFYUjVLU0I3WEc0Z0lDQWdaVzUwYVhSNUxuRjFaWEpwWlhNdWNIVnphQ2gwYUdsektUdGNiaUFnSUNCMGFHbHpMbVZ1ZEdsMGFXVnpMbkIxYzJnb1pXNTBhWFI1S1R0Y2JseHVJQ0FnSUhSb2FYTXVaWFpsYm5SRWFYTndZWFJqYUdWeUxtUnBjM0JoZEdOb1JYWmxiblFvVVhWbGNua3VjSEp2ZEc5MGVYQmxMa1ZPVkVsVVdWOUJSRVJGUkN3Z1pXNTBhWFI1S1R0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlNaVzF2ZG1VZ1pXNTBhWFI1SUdaeWIyMGdkR2hwY3lCeGRXVnllVnh1SUNBZ0tpQkFjR0Z5WVcwZ2UwVnVkR2wwZVgwZ1pXNTBhWFI1WEc0Z0lDQXFMMXh1SUNCeVpXMXZkbVZGYm5ScGRIa29aVzUwYVhSNUtTQjdYRzRnSUNBZ2JHVjBJR2x1WkdWNElEMGdkR2hwY3k1bGJuUnBkR2xsY3k1cGJtUmxlRTltS0dWdWRHbDBlU2s3WEc0Z0lDQWdhV1lnS0g1cGJtUmxlQ2tnZTF4dUlDQWdJQ0FnZEdocGN5NWxiblJwZEdsbGN5NXpjR3hwWTJVb2FXNWtaWGdzSURFcE8xeHVYRzRnSUNBZ0lDQnBibVJsZUNBOUlHVnVkR2wwZVM1eGRXVnlhV1Z6TG1sdVpHVjRUMllvZEdocGN5azdYRzRnSUNBZ0lDQmxiblJwZEhrdWNYVmxjbWxsY3k1emNHeHBZMlVvYVc1a1pYZ3NJREVwTzF4dVhHNGdJQ0FnSUNCMGFHbHpMbVYyWlc1MFJHbHpjR0YwWTJobGNpNWthWE53WVhSamFFVjJaVzUwS0Z4dUlDQWdJQ0FnSUNCUmRXVnllUzV3Y205MGIzUjVjR1V1UlU1VVNWUlpYMUpGVFU5V1JVUXNYRzRnSUNBZ0lDQWdJR1Z1ZEdsMGVWeHVJQ0FnSUNBZ0tUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnRZWFJqYUNobGJuUnBkSGtwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdLRnh1SUNBZ0lDQWdaVzUwYVhSNUxtaGhjMEZzYkVOdmJYQnZibVZ1ZEhNb2RHaHBjeTVEYjIxd2IyNWxiblJ6S1NBbUpseHVJQ0FnSUNBZ0lXVnVkR2wwZVM1b1lYTkJibmxEYjIxd2IyNWxiblJ6S0hSb2FYTXVUbTkwUTI5dGNHOXVaVzUwY3lsY2JpQWdJQ0FwTzF4dUlDQjlYRzVjYmlBZ2RHOUtVMDlPS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUI3WEc0Z0lDQWdJQ0JyWlhrNklIUm9hWE11YTJWNUxGeHVJQ0FnSUNBZ2NtVmhZM1JwZG1VNklIUm9hWE11Y21WaFkzUnBkbVVzWEc0Z0lDQWdJQ0JqYjIxd2IyNWxiblJ6T2lCN1hHNGdJQ0FnSUNBZ0lHbHVZMngxWkdWa09pQjBhR2x6TGtOdmJYQnZibVZ1ZEhNdWJXRndLRU1nUFQ0Z1F5NXVZVzFsS1N4Y2JpQWdJQ0FnSUNBZ2JtOTBPaUIwYUdsekxrNXZkRU52YlhCdmJtVnVkSE11YldGd0tFTWdQVDRnUXk1dVlXMWxLVnh1SUNBZ0lDQWdmU3hjYmlBZ0lDQWdJRzUxYlVWdWRHbDBhV1Z6T2lCMGFHbHpMbVZ1ZEdsMGFXVnpMbXhsYm1kMGFGeHVJQ0FnSUgwN1hHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVYwZFhKdUlITjBZWFJ6SUdadmNpQjBhR2x6SUhGMVpYSjVYRzRnSUNBcUwxeHVJQ0J6ZEdGMGN5Z3BJSHRjYmlBZ0lDQnlaWFIxY200Z2UxeHVJQ0FnSUNBZ2JuVnRRMjl0Y0c5dVpXNTBjem9nZEdocGN5NURiMjF3YjI1bGJuUnpMbXhsYm1kMGFDeGNiaUFnSUNBZ0lHNTFiVVZ1ZEdsMGFXVnpPaUIwYUdsekxtVnVkR2wwYVdWekxteGxibWQwYUZ4dUlDQWdJSDA3WEc0Z0lIMWNibjFjYmx4dVVYVmxjbmt1Y0hKdmRHOTBlWEJsTGtWT1ZFbFVXVjlCUkVSRlJDQTlJRndpVVhWbGNua2pSVTVVU1ZSWlgwRkVSRVZFWENJN1hHNVJkV1Z5ZVM1d2NtOTBiM1I1Y0dVdVJVNVVTVlJaWDFKRlRVOVdSVVFnUFNCY0lsRjFaWEo1STBWT1ZFbFVXVjlTUlUxUFZrVkVYQ0k3WEc1UmRXVnllUzV3Y205MGIzUjVjR1V1UTA5TlVFOU9SVTVVWDBOSVFVNUhSVVFnUFNCY0lsRjFaWEo1STBOUFRWQlBUa1ZPVkY5RFNFRk9SMFZFWENJN1hHNGlMQ0pwYlhCdmNuUWdVWFZsY25rZ1puSnZiU0JjSWk0dlVYVmxjbmt1YW5OY0lqdGNibHh1Wlhod2IzSjBJR05zWVhOeklGTjVjM1JsYlNCN1hHNGdJR05oYmtWNFpXTjFkR1VvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11WDIxaGJtUmhkRzl5ZVZGMVpYSnBaWE11YkdWdVozUm9JRDA5UFNBd0tTQnlaWFIxY200Z2RISjFaVHRjYmx4dUlDQWdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnZEdocGN5NWZiV0Z1WkdGMGIzSjVVWFZsY21sbGN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJQ0FnZG1GeUlIRjFaWEo1SUQwZ2RHaHBjeTVmYldGdVpHRjBiM0o1VVhWbGNtbGxjMXRwWFR0Y2JpQWdJQ0FnSUdsbUlDaHhkV1Z5ZVM1bGJuUnBkR2xsY3k1c1pXNW5kR2dnUFQwOUlEQXBJSHRjYmlBZ0lDQWdJQ0FnY21WMGRYSnVJR1poYkhObE8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0I5WEc1Y2JpQWdZMjl1YzNSeWRXTjBiM0lvZDI5eWJHUXNJR0YwZEhKcFluVjBaWE1wSUh0Y2JpQWdJQ0IwYUdsekxuZHZjbXhrSUQwZ2QyOXliR1E3WEc0Z0lDQWdkR2hwY3k1bGJtRmliR1ZrSUQwZ2RISjFaVHRjYmx4dUlDQWdJQzh2SUVCMGIyUnZJRUpsZEhSbGNpQnVZVzFwYm1jZ09pbGNiaUFnSUNCMGFHbHpMbDl4ZFdWeWFXVnpJRDBnZTMwN1hHNGdJQ0FnZEdocGN5NXhkV1Z5YVdWeklEMGdlMzA3WEc1Y2JpQWdJQ0IwYUdsekxuQnlhVzl5YVhSNUlEMGdNRHRjYmx4dUlDQWdJQzh2SUZWelpXUWdabTl5SUhOMFlYUnpYRzRnSUNBZ2RHaHBjeTVsZUdWamRYUmxWR2x0WlNBOUlEQTdYRzVjYmlBZ0lDQnBaaUFvWVhSMGNtbGlkWFJsY3lBbUppQmhkSFJ5YVdKMWRHVnpMbkJ5YVc5eWFYUjVLU0I3WEc0Z0lDQWdJQ0IwYUdsekxuQnlhVzl5YVhSNUlEMGdZWFIwY21saWRYUmxjeTV3Y21sdmNtbDBlVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQjBhR2x6TGw5dFlXNWtZWFJ2Y25sUmRXVnlhV1Z6SUQwZ1cxMDdYRzVjYmlBZ0lDQjBhR2x6TG1sdWFYUnBZV3hwZW1Wa0lEMGdkSEoxWlR0Y2JseHVJQ0FnSUdsbUlDaDBhR2x6TG1OdmJuTjBjblZqZEc5eUxuRjFaWEpwWlhNcElIdGNiaUFnSUNBZ0lHWnZjaUFvZG1GeUlIRjFaWEo1VG1GdFpTQnBiaUIwYUdsekxtTnZibk4wY25WamRHOXlMbkYxWlhKcFpYTXBJSHRjYmlBZ0lDQWdJQ0FnZG1GeUlIRjFaWEo1UTI5dVptbG5JRDBnZEdocGN5NWpiMjV6ZEhKMVkzUnZjaTV4ZFdWeWFXVnpXM0YxWlhKNVRtRnRaVjA3WEc0Z0lDQWdJQ0FnSUhaaGNpQkRiMjF3YjI1bGJuUnpJRDBnY1hWbGNubERiMjVtYVdjdVkyOXRjRzl1Wlc1MGN6dGNiaUFnSUNBZ0lDQWdhV1lnS0NGRGIyMXdiMjVsYm5SeklIeDhJRU52YlhCdmJtVnVkSE11YkdWdVozUm9JRDA5UFNBd0tTQjdYRzRnSUNBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLRndpSjJOdmJYQnZibVZ1ZEhNbklHRjBkSEpwWW5WMFpTQmpZVzRuZENCaVpTQmxiWEIwZVNCcGJpQmhJSEYxWlhKNVhDSXBPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUhaaGNpQnhkV1Z5ZVNBOUlIUm9hWE11ZDI5eWJHUXVaVzUwYVhSNVRXRnVZV2RsY2k1eGRXVnllVU52YlhCdmJtVnVkSE1vUTI5dGNHOXVaVzUwY3lrN1hHNGdJQ0FnSUNBZ0lIUm9hWE11WDNGMVpYSnBaWE5iY1hWbGNubE9ZVzFsWFNBOUlIRjFaWEo1TzF4dUlDQWdJQ0FnSUNCcFppQW9jWFZsY25sRGIyNW1hV2N1YldGdVpHRjBiM0o1SUQwOVBTQjBjblZsS1NCN1hHNGdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZmJXRnVaR0YwYjNKNVVYVmxjbWxsY3k1d2RYTm9LSEYxWlhKNUtUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0IwYUdsekxuRjFaWEpwWlhOYmNYVmxjbmxPWVcxbFhTQTlJSHRjYmlBZ0lDQWdJQ0FnSUNCeVpYTjFiSFJ6T2lCeGRXVnllUzVsYm5ScGRHbGxjMXh1SUNBZ0lDQWdJQ0I5TzF4dVhHNGdJQ0FnSUNBZ0lDOHZJRkpsWVdOMGFYWmxJR052Ym1acFozVnlZWFJwYjI0Z1lXUmtaV1F2Y21WdGIzWmxaQzlqYUdGdVoyVmtYRzRnSUNBZ0lDQWdJSFpoY2lCMllXeHBaRVYyWlc1MGN5QTlJRnRjSW1Ga1pHVmtYQ0lzSUZ3aWNtVnRiM1psWkZ3aUxDQmNJbU5vWVc1blpXUmNJbDA3WEc1Y2JpQWdJQ0FnSUNBZ1kyOXVjM1FnWlhabGJuUk5ZWEJ3YVc1bklEMGdlMXh1SUNBZ0lDQWdJQ0FnSUdGa1pHVmtPaUJSZFdWeWVTNXdjbTkwYjNSNWNHVXVSVTVVU1ZSWlgwRkVSRVZFTEZ4dUlDQWdJQ0FnSUNBZ0lISmxiVzkyWldRNklGRjFaWEo1TG5CeWIzUnZkSGx3WlM1RlRsUkpWRmxmVWtWTlQxWkZSQ3hjYmlBZ0lDQWdJQ0FnSUNCamFHRnVaMlZrT2lCUmRXVnllUzV3Y205MGIzUjVjR1V1UTA5TlVFOU9SVTVVWDBOSVFVNUhSVVFnTHk4Z1VYVmxjbmt1Y0hKdmRHOTBlWEJsTGtWT1ZFbFVXVjlEU0VGT1IwVkVYRzRnSUNBZ0lDQWdJSDA3WEc1Y2JpQWdJQ0FnSUNBZ2FXWWdLSEYxWlhKNVEyOXVabWxuTG14cGMzUmxiaWtnZTF4dUlDQWdJQ0FnSUNBZ0lIWmhiR2xrUlhabGJuUnpMbVp2Y2tWaFkyZ29aWFpsYm5ST1lXMWxJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR2xtSUNnaGRHaHBjeTVsZUdWamRYUmxLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR052Ym5OdmJHVXVkMkZ5YmloY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCZ1UzbHpkR1Z0SUNja2UxeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1amIyNXpkSEoxWTNSdmNpNXVZVzFsWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnZlNjZ2FHRnpJR1JsWm1sdVpXUWdiR2x6ZEdWdUlHVjJaVzUwY3lBb0pIdDJZV3hwWkVWMlpXNTBjeTVxYjJsdUtGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdYQ0lzSUZ3aVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0tYMHBJR1p2Y2lCeGRXVnllU0FuSkh0eGRXVnllVTVoYldWOUp5QmlkWFFnYVhRZ1pHOWxjeUJ1YjNRZ2FXMXdiR1Z0Wlc1MElIUm9aU0FuWlhobFkzVjBaU2NnYldWMGFHOWtMbUJjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lIMWNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdTWE1nZEdobElHVjJaVzUwSUdWdVlXSnNaV1FnYjI0Z2RHaHBjeUJ6ZVhOMFpXMG5jeUJ4ZFdWeWVUOWNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaHhkV1Z5ZVVOdmJtWnBaeTVzYVhOMFpXNWJaWFpsYm5ST1lXMWxYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ1pYWmxiblFnUFNCeGRXVnllVU52Ym1acFp5NXNhWE4wWlc1YlpYWmxiblJPWVcxbFhUdGNibHh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvWlhabGJuUk9ZVzFsSUQwOVBTQmNJbU5vWVc1blpXUmNJaWtnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhGMVpYSjVMbkpsWVdOMGFYWmxJRDBnZEhKMVpUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvWlhabGJuUWdQVDA5SUhSeWRXVXBJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklFRnVlU0JqYUdGdVoyVWdiMjRnZEdobElHVnVkR2wwZVNCbWNtOXRJSFJvWlNCamIyMXdiMjVsYm5SeklHbHVJSFJvWlNCeGRXVnllVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnYkdWMElHVjJaVzUwVEdsemRDQTlJQ2gwYUdsekxuRjFaWEpwWlhOYmNYVmxjbmxPWVcxbFhWdGxkbVZ1ZEU1aGJXVmRJRDBnVzEwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjWFZsY25rdVpYWmxiblJFYVhOd1lYUmphR1Z5TG1Ga1pFVjJaVzUwVEdsemRHVnVaWElvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGRjFaWEo1TG5CeWIzUnZkSGx3WlM1RFQwMVFUMDVGVGxSZlEwaEJUa2RGUkN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaVzUwYVhSNUlEMCtJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQXZMeUJCZG05cFpDQmtkWEJzYVdOaGRHVnpYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2FXWWdLR1YyWlc1MFRHbHpkQzVwYm1SbGVFOW1LR1Z1ZEdsMGVTa2dQVDA5SUMweEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmxkbVZ1ZEV4cGMzUXVjSFZ6YUNobGJuUnBkSGtwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0VGeWNtRjVMbWx6UVhKeVlYa29aWFpsYm5RcEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ1pYWmxiblJNYVhOMElEMGdLSFJvYVhNdWNYVmxjbWxsYzF0eGRXVnllVTVoYldWZFcyVjJaVzUwVG1GdFpWMGdQU0JiWFNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnhkV1Z5ZVM1bGRtVnVkRVJwYzNCaGRHTm9aWEl1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1VYVmxjbmt1Y0hKdmRHOTBlWEJsTGtOUFRWQlBUa1ZPVkY5RFNFRk9SMFZFTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQW9aVzUwYVhSNUxDQmphR0Z1WjJWa1EyOXRjRzl1Wlc1MEtTQTlQaUI3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUVhadmFXUWdaSFZ3YkdsallYUmxjMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2hjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJR1YyWlc1MExtbHVaR1Y0VDJZb1kyaGhibWRsWkVOdmJYQnZibVZ1ZEM1amIyNXpkSEoxWTNSdmNpa2dJVDA5SUMweElDWW1YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmxkbVZ1ZEV4cGMzUXVhVzVrWlhoUFppaGxiblJwZEhrcElEMDlQU0F0TVZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWlhabGJuUk1hWE4wTG5CMWMyZ29aVzUwYVhSNUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDOHFYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCRGFHVmphMmx1WnlCcWRYTjBJSE53WldOcFptbGpJR052YlhCdmJtVnVkSE5jYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUd4bGRDQmphR0Z1WjJWa1RHbHpkQ0E5SUNoMGFHbHpMbkYxWlhKcFpYTmJjWFZsY25sT1lXMWxYVnRsZG1WdWRFNWhiV1ZkSUQwZ2UzMHBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWlhabGJuUXVabTl5UldGamFDaGpiMjF3YjI1bGJuUWdQVDRnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnNaWFFnWlhabGJuUk1hWE4wSUQwZ0tHTm9ZVzVuWldSTWFYTjBXMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHTnZiWEJ2Ym1WdWRGQnliM0JsY25SNVRtRnRaU2hqYjIxd2IyNWxiblFwWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lGMGdQU0JiWFNrN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSEYxWlhKNUxtVjJaVzUwUkdsemNHRjBZMmhsY2k1aFpHUkZkbVZ1ZEV4cGMzUmxibVZ5S0Z4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRkYxWlhKNUxuQnliM1J2ZEhsd1pTNURUMDFRVDA1RlRsUmZRMGhCVGtkRlJDeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBb1pXNTBhWFI1TENCamFHRnVaMlZrUTI5dGNHOXVaVzUwS1NBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnBaaUFvWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdOb1lXNW5aV1JEYjIxd2IyNWxiblF1WTI5dWMzUnlkV04wYjNJZ1BUMDlJR052YlhCdmJtVnVkQ0FtSmx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbGRtVnVkRXhwYzNRdWFXNWtaWGhQWmlobGJuUnBkSGtwSUQwOVBTQXRNVnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdWMlpXNTBUR2x6ZEM1d2RYTm9LR1Z1ZEdsMGVTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FxTDF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JzWlhRZ1pYWmxiblJNYVhOMElEMGdLSFJvYVhNdWNYVmxjbWxsYzF0eGRXVnllVTVoYldWZFcyVjJaVzUwVG1GdFpWMGdQU0JiWFNrN1hHNWNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQnhkV1Z5ZVM1bGRtVnVkRVJwYzNCaGRHTm9aWEl1WVdSa1JYWmxiblJNYVhOMFpXNWxjaWhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdWMlpXNTBUV0Z3Y0dsdVoxdGxkbVZ1ZEU1aGJXVmRMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWlc1MGFYUjVJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnUUdacGVHMWxJRzkyWlhKb1pXRmtQMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCcFppQW9aWFpsYm5STWFYTjBMbWx1WkdWNFQyWW9aVzUwYVhSNUtTQTlQVDBnTFRFcFhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWlhabGJuUk1hWE4wTG5CMWMyZ29aVzUwYVhSNUtUdGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lIMWNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnpkRzl3S0NrZ2UxeHVJQ0FnSUhSb2FYTXVaWGhsWTNWMFpWUnBiV1VnUFNBd08xeHVJQ0FnSUhSb2FYTXVaVzVoWW14bFpDQTlJR1poYkhObE8xeHVJQ0I5WEc1Y2JpQWdjR3hoZVNncElIdGNiaUFnSUNCMGFHbHpMbVZ1WVdKc1pXUWdQU0IwY25WbE8xeHVJQ0I5WEc1Y2JpQWdMeThnUUhGMVpYTjBhVzl1SUhKbGJtRnRaU0IwYnlCamJHVmhjaUJ4ZFdWMVpYTS9YRzRnSUdOc1pXRnlSWFpsYm5SektDa2dlMXh1SUNBZ0lHWnZjaUFvYkdWMElIRjFaWEo1VG1GdFpTQnBiaUIwYUdsekxuRjFaWEpwWlhNcElIdGNiaUFnSUNBZ0lIWmhjaUJ4ZFdWeWVTQTlJSFJvYVhNdWNYVmxjbWxsYzF0eGRXVnllVTVoYldWZE8xeHVJQ0FnSUNBZ2FXWWdLSEYxWlhKNUxtRmtaR1ZrS1NCN1hHNGdJQ0FnSUNBZ0lIRjFaWEo1TG1Ga1pHVmtMbXhsYm1kMGFDQTlJREE3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JwWmlBb2NYVmxjbmt1Y21WdGIzWmxaQ2tnZTF4dUlDQWdJQ0FnSUNCeGRXVnllUzV5WlcxdmRtVmtMbXhsYm1kMGFDQTlJREE3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdJQ0JwWmlBb2NYVmxjbmt1WTJoaGJtZGxaQ2tnZTF4dUlDQWdJQ0FnSUNCcFppQW9RWEp5WVhrdWFYTkJjbkpoZVNoeGRXVnllUzVqYUdGdVoyVmtLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIRjFaWEo1TG1Ob1lXNW5aV1F1YkdWdVozUm9JRDBnTUR0Y2JpQWdJQ0FnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUNBZ0lDQm1iM0lnS0d4bGRDQnVZVzFsSUdsdUlIRjFaWEo1TG1Ob1lXNW5aV1FwSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJSEYxWlhKNUxtTm9ZVzVuWldSYmJtRnRaVjB1YkdWdVozUm9JRDBnTUR0Y2JpQWdJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0IwYjBwVFQwNG9LU0I3WEc0Z0lDQWdkbUZ5SUdwemIyNGdQU0I3WEc0Z0lDQWdJQ0J1WVcxbE9pQjBhR2x6TG1OdmJuTjBjblZqZEc5eUxtNWhiV1VzWEc0Z0lDQWdJQ0JsYm1GaWJHVmtPaUIwYUdsekxtVnVZV0pzWldRc1hHNGdJQ0FnSUNCbGVHVmpkWFJsVkdsdFpUb2dkR2hwY3k1bGVHVmpkWFJsVkdsdFpTeGNiaUFnSUNBZ0lIQnlhVzl5YVhSNU9pQjBhR2x6TG5CeWFXOXlhWFI1TEZ4dUlDQWdJQ0FnY1hWbGNtbGxjem9nZTMxY2JpQWdJQ0I5TzF4dVhHNGdJQ0FnYVdZZ0tIUm9hWE11WTI5dWMzUnlkV04wYjNJdWNYVmxjbWxsY3lrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEYxWlhKcFpYTWdQU0IwYUdsekxtTnZibk4wY25WamRHOXlMbkYxWlhKcFpYTTdYRzRnSUNBZ0lDQm1iM0lnS0d4bGRDQnhkV1Z5ZVU1aGJXVWdhVzRnY1hWbGNtbGxjeWtnZTF4dUlDQWdJQ0FnSUNCc1pYUWdjWFZsY25rZ1BTQjBhR2x6TG5GMVpYSnBaWE5iY1hWbGNubE9ZVzFsWFR0Y2JpQWdJQ0FnSUNBZ2JHVjBJSEYxWlhKNVJHVm1hVzVwZEdsdmJpQTlJSEYxWlhKcFpYTmJjWFZsY25sT1lXMWxYVHRjYmlBZ0lDQWdJQ0FnYkdWMElHcHpiMjVSZFdWeWVTQTlJQ2hxYzI5dUxuRjFaWEpwWlhOYmNYVmxjbmxPWVcxbFhTQTlJSHRjYmlBZ0lDQWdJQ0FnSUNCclpYazZJSFJvYVhNdVgzRjFaWEpwWlhOYmNYVmxjbmxPWVcxbFhTNXJaWGxjYmlBZ0lDQWdJQ0FnZlNrN1hHNWNiaUFnSUNBZ0lDQWdhbk52YmxGMVpYSjVMbTFoYm1SaGRHOXllU0E5SUhGMVpYSjVSR1ZtYVc1cGRHbHZiaTV0WVc1a1lYUnZjbmtnUFQwOUlIUnlkV1U3WEc0Z0lDQWdJQ0FnSUdwemIyNVJkV1Z5ZVM1eVpXRmpkR2wyWlNBOVhHNGdJQ0FnSUNBZ0lDQWdjWFZsY25sRVpXWnBibWwwYVc5dUxteHBjM1JsYmlBbUpseHVJQ0FnSUNBZ0lDQWdJQ2h4ZFdWeWVVUmxabWx1YVhScGIyNHViR2x6ZEdWdUxtRmtaR1ZrSUQwOVBTQjBjblZsSUh4OFhHNGdJQ0FnSUNBZ0lDQWdJQ0J4ZFdWeWVVUmxabWx1YVhScGIyNHViR2x6ZEdWdUxuSmxiVzkyWldRZ1BUMDlJSFJ5ZFdVZ2ZIeGNiaUFnSUNBZ0lDQWdJQ0FnSUhGMVpYSjVSR1ZtYVc1cGRHbHZiaTVzYVhOMFpXNHVZMmhoYm1kbFpDQTlQVDBnZEhKMVpTQjhmRnh1SUNBZ0lDQWdJQ0FnSUNBZ1FYSnlZWGt1YVhOQmNuSmhlU2h4ZFdWeWVVUmxabWx1YVhScGIyNHViR2x6ZEdWdUxtTm9ZVzVuWldRcEtUdGNibHh1SUNBZ0lDQWdJQ0JwWmlBb2FuTnZibEYxWlhKNUxuSmxZV04wYVhabEtTQjdYRzRnSUNBZ0lDQWdJQ0FnYW5OdmJsRjFaWEo1TG14cGMzUmxiaUE5SUh0OU8xeHVYRzRnSUNBZ0lDQWdJQ0FnWTI5dWMzUWdiV1YwYUc5a2N5QTlJRnRjSW1Ga1pHVmtYQ0lzSUZ3aWNtVnRiM1psWkZ3aUxDQmNJbU5vWVc1blpXUmNJbDA3WEc0Z0lDQWdJQ0FnSUNBZ2JXVjBhRzlrY3k1bWIzSkZZV05vS0cxbGRHaHZaQ0E5UGlCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb2NYVmxjbmxiYldWMGFHOWtYU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JxYzI5dVVYVmxjbmt1YkdsemRHVnVXMjFsZEdodlpGMGdQU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWlc1MGFYUnBaWE02SUhGMVpYSjVXMjFsZEdodlpGMHViR1Z1WjNSb1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUgwN1hHNGdJQ0FnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUNBZ2ZTazdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2FuTnZianRjYmlBZ2ZWeHVmVnh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnVG05MEtFTnZiWEJ2Ym1WdWRDa2dlMXh1SUNCeVpYUjFjbTRnZTF4dUlDQWdJRzl3WlhKaGRHOXlPaUJjSW01dmRGd2lMRnh1SUNBZ0lFTnZiWEJ2Ym1WdWREb2dRMjl0Y0c5dVpXNTBYRzRnSUgwN1hHNTlYRzRpTENKcGJYQnZjblFnZXlCdWIzY2dmU0JtY205dElGd2lMaTlWZEdsc2N5NXFjMXdpTzF4dWFXMXdiM0owSUhzZ1UzbHpkR1Z0SUgwZ1puSnZiU0JjSWk0dlUzbHpkR1Z0TG1welhDSTdYRzVjYm1WNGNHOXlkQ0JqYkdGemN5QlRlWE4wWlcxTllXNWhaMlZ5SUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvZDI5eWJHUXBJSHRjYmlBZ0lDQjBhR2x6TGw5emVYTjBaVzF6SUQwZ1cxMDdYRzRnSUNBZ2RHaHBjeTVmWlhobFkzVjBaVk41YzNSbGJYTWdQU0JiWFRzZ0x5OGdVM2x6ZEdWdGN5QjBhR0YwSUdoaGRtVWdZR1Y0WldOMWRHVmdJRzFsZEdodlpGeHVJQ0FnSUhSb2FYTXVkMjl5YkdRZ1BTQjNiM0pzWkR0Y2JpQWdJQ0IwYUdsekxteGhjM1JGZUdWamRYUmxaRk41YzNSbGJTQTlJRzUxYkd3N1hHNGdJSDFjYmx4dUlDQnlaV2RwYzNSbGNsTjVjM1JsYlNoVGVYTjBaVzFEYkdGemN5d2dZWFIwY21saWRYUmxjeWtnZTF4dUlDQWdJR2xtSUNnaEtGTjVjM1JsYlVOc1lYTnpMbkJ5YjNSdmRIbHdaU0JwYm5OMFlXNWpaVzltSUZONWMzUmxiU2twSUh0Y2JpQWdJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjYmlBZ0lDQWdJQ0FnWUZONWMzUmxiU0FuSkh0VGVYTjBaVzFEYkdGemN5NXVZVzFsZlNjZ1pHOWxjeUJ1YjNRZ1pYaDBaVzVrY3lBblUzbHpkR1Z0SnlCamJHRnpjMkJjYmlBZ0lDQWdJQ2s3WEc0Z0lDQWdmVnh1SUNBZ0lHbG1JQ2gwYUdsekxtZGxkRk41YzNSbGJTaFRlWE4wWlcxRGJHRnpjeWtnSVQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lDQWdZMjl1YzI5c1pTNTNZWEp1S0dCVGVYTjBaVzBnSnlSN1UzbHpkR1Z0UTJ4aGMzTXVibUZ0WlgwbklHRnNjbVZoWkhrZ2NtVm5hWE4wWlhKbFpDNWdLVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TzF4dUlDQWdJSDFjYmx4dUlDQWdJSFpoY2lCemVYTjBaVzBnUFNCdVpYY2dVM2x6ZEdWdFEyeGhjM01vZEdocGN5NTNiM0pzWkN3Z1lYUjBjbWxpZFhSbGN5azdYRzRnSUNBZ2FXWWdLSE41YzNSbGJTNXBibWwwS1NCemVYTjBaVzB1YVc1cGRDaGhkSFJ5YVdKMWRHVnpLVHRjYmlBZ0lDQnplWE4wWlcwdWIzSmtaWElnUFNCMGFHbHpMbDl6ZVhOMFpXMXpMbXhsYm1kMGFEdGNiaUFnSUNCMGFHbHpMbDl6ZVhOMFpXMXpMbkIxYzJnb2MzbHpkR1Z0S1R0Y2JpQWdJQ0JwWmlBb2MzbHpkR1Z0TG1WNFpXTjFkR1VwSUh0Y2JpQWdJQ0FnSUhSb2FYTXVYMlY0WldOMWRHVlRlWE4wWlcxekxuQjFjMmdvYzNsemRHVnRLVHRjYmlBZ0lDQWdJSFJvYVhNdWMyOXlkRk41YzNSbGJYTW9LVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0IxYm5KbFoybHpkR1Z5VTNsemRHVnRLRk41YzNSbGJVTnNZWE56S1NCN1hHNGdJQ0FnYkdWMElITjVjM1JsYlNBOUlIUm9hWE11WjJWMFUzbHpkR1Z0S0ZONWMzUmxiVU5zWVhOektUdGNiaUFnSUNCcFppQW9jM2x6ZEdWdElEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUdOdmJuTnZiR1V1ZDJGeWJpaGNiaUFnSUNBZ0lDQWdZRU5oYmlCMWJuSmxaMmx6ZEdWeUlITjVjM1JsYlNBbkpIdFRlWE4wWlcxRGJHRnpjeTV1WVcxbGZTY3VJRWwwSUdSdlpYTnVKM1FnWlhocGMzUXVZRnh1SUNBZ0lDQWdLVHRjYmlBZ0lDQWdJSEpsZEhWeWJpQjBhR2x6TzF4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdVgzTjVjM1JsYlhNdWMzQnNhV05sS0hSb2FYTXVYM041YzNSbGJYTXVhVzVrWlhoUFppaHplWE4wWlcwcExDQXhLVHRjYmx4dUlDQWdJR2xtSUNoemVYTjBaVzB1WlhobFkzVjBaU2tnZTF4dUlDQWdJQ0FnZEdocGN5NWZaWGhsWTNWMFpWTjVjM1JsYlhNdWMzQnNhV05sS0hSb2FYTXVYMlY0WldOMWRHVlRlWE4wWlcxekxtbHVaR1Y0VDJZb2MzbHpkR1Z0S1N3Z01TazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ0x5OGdRSFJ2Wkc4Z1FXUmtJSE41YzNSbGJTNTFibkpsWjJsemRHVnlLQ2tnWTJGc2JDQjBieUJtY21WbElISmxjMjkxY21ObGMxeHVJQ0FnSUhKbGRIVnliaUIwYUdsek8xeHVJQ0I5WEc1Y2JpQWdjMjl5ZEZONWMzUmxiWE1vS1NCN1hHNGdJQ0FnZEdocGN5NWZaWGhsWTNWMFpWTjVjM1JsYlhNdWMyOXlkQ2dvWVN3Z1lpa2dQVDRnZTF4dUlDQWdJQ0FnY21WMGRYSnVJR0V1Y0hKcGIzSnBkSGtnTFNCaUxuQnlhVzl5YVhSNUlIeDhJR0V1YjNKa1pYSWdMU0JpTG05eVpHVnlPMXh1SUNBZ0lIMHBPMXh1SUNCOVhHNWNiaUFnWjJWMFUzbHpkR1Z0S0ZONWMzUmxiVU5zWVhOektTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYM041YzNSbGJYTXVabWx1WkNoeklEMCtJSE1nYVc1emRHRnVZMlZ2WmlCVGVYTjBaVzFEYkdGemN5azdYRzRnSUgxY2JseHVJQ0JuWlhSVGVYTjBaVzF6S0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOXplWE4wWlcxek8xeHVJQ0I5WEc1Y2JpQWdjbVZ0YjNabFUzbHpkR1Z0S0ZONWMzUmxiVU5zWVhOektTQjdYRzRnSUNBZ2RtRnlJR2x1WkdWNElEMGdkR2hwY3k1ZmMzbHpkR1Z0Y3k1cGJtUmxlRTltS0ZONWMzUmxiVU5zWVhOektUdGNiaUFnSUNCcFppQW9JWDVwYm1SbGVDa2djbVYwZFhKdU8xeHVYRzRnSUNBZ2RHaHBjeTVmYzNsemRHVnRjeTV6Y0d4cFkyVW9hVzVrWlhnc0lERXBPMXh1SUNCOVhHNWNiaUFnWlhobFkzVjBaVk41YzNSbGJTaHplWE4wWlcwc0lHUmxiSFJoTENCMGFXMWxLU0I3WEc0Z0lDQWdhV1lnS0hONWMzUmxiUzVwYm1sMGFXRnNhWHBsWkNrZ2UxeHVJQ0FnSUNBZ2FXWWdLSE41YzNSbGJTNWpZVzVGZUdWamRYUmxLQ2twSUh0Y2JpQWdJQ0FnSUNBZ2JHVjBJSE4wWVhKMFZHbHRaU0E5SUc1dmR5Z3BPMXh1SUNBZ0lDQWdJQ0J6ZVhOMFpXMHVaWGhsWTNWMFpTaGtaV3gwWVN3Z2RHbHRaU2s3WEc0Z0lDQWdJQ0FnSUhONWMzUmxiUzVsZUdWamRYUmxWR2x0WlNBOUlHNXZkeWdwSUMwZ2MzUmhjblJVYVcxbE8xeHVJQ0FnSUNBZ0lDQjBhR2x6TG14aGMzUkZlR1ZqZFhSbFpGTjVjM1JsYlNBOUlITjVjM1JsYlR0Y2JpQWdJQ0FnSUNBZ2MzbHpkR1Z0TG1Oc1pXRnlSWFpsYm5SektDazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjM1J2Y0NncElIdGNiaUFnSUNCMGFHbHpMbDlsZUdWamRYUmxVM2x6ZEdWdGN5NW1iM0pGWVdOb0tITjVjM1JsYlNBOVBpQnplWE4wWlcwdWMzUnZjQ2dwS1R0Y2JpQWdmVnh1WEc0Z0lHVjRaV04xZEdVb1pHVnNkR0VzSUhScGJXVXNJR1p2Y21ObFVHeGhlU2tnZTF4dUlDQWdJSFJvYVhNdVgyVjRaV04xZEdWVGVYTjBaVzF6TG1admNrVmhZMmdvWEc0Z0lDQWdJQ0J6ZVhOMFpXMGdQVDVjYmlBZ0lDQWdJQ0FnS0dadmNtTmxVR3hoZVNCOGZDQnplWE4wWlcwdVpXNWhZbXhsWkNrZ0ppWWdkR2hwY3k1bGVHVmpkWFJsVTNsemRHVnRLSE41YzNSbGJTd2daR1ZzZEdFc0lIUnBiV1VwWEc0Z0lDQWdLVHRjYmlBZ2ZWeHVYRzRnSUhOMFlYUnpLQ2tnZTF4dUlDQWdJSFpoY2lCemRHRjBjeUE5SUh0Y2JpQWdJQ0FnSUc1MWJWTjVjM1JsYlhNNklIUm9hWE11WDNONWMzUmxiWE11YkdWdVozUm9MRnh1SUNBZ0lDQWdjM2x6ZEdWdGN6b2dlMzFjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdabTl5SUNoMllYSWdhU0E5SURBN0lHa2dQQ0IwYUdsekxsOXplWE4wWlcxekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2MzbHpkR1Z0SUQwZ2RHaHBjeTVmYzNsemRHVnRjMXRwWFR0Y2JpQWdJQ0FnSUhaaGNpQnplWE4wWlcxVGRHRjBjeUE5SUNoemRHRjBjeTV6ZVhOMFpXMXpXM041YzNSbGJTNWpiMjV6ZEhKMVkzUnZjaTV1WVcxbFhTQTlJSHRjYmlBZ0lDQWdJQ0FnY1hWbGNtbGxjem9nZTMwc1hHNGdJQ0FnSUNBZ0lHVjRaV04xZEdWVWFXMWxPaUJ6ZVhOMFpXMHVaWGhsWTNWMFpWUnBiV1ZjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnWm05eUlDaDJZWElnYm1GdFpTQnBiaUJ6ZVhOMFpXMHVZM1I0S1NCN1hHNGdJQ0FnSUNBZ0lITjVjM1JsYlZOMFlYUnpMbkYxWlhKcFpYTmJibUZ0WlYwZ1BTQnplWE4wWlcwdVkzUjRXMjVoYldWZExuTjBZWFJ6S0NrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnY21WMGRYSnVJSE4wWVhSek8xeHVJQ0I5WEc1OVhHNGlMQ0psZUhCdmNuUWdZMnhoYzNNZ1QySnFaV04wVUc5dmJDQjdYRzRnSUM4dklFQjBiMlJ2SUVGa1pDQnBibWwwYVdGc0lITnBlbVZjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9ZbUZ6WlU5aWFtVmpkQ3dnYVc1cGRHbGhiRk5wZW1VcElIdGNiaUFnSUNCMGFHbHpMbVp5WldWTWFYTjBJRDBnVzEwN1hHNGdJQ0FnZEdocGN5NWpiM1Z1ZENBOUlEQTdYRzRnSUNBZ2RHaHBjeTVpWVhObFQySnFaV04wSUQwZ1ltRnpaVTlpYW1WamREdGNiaUFnSUNCMGFHbHpMbWx6VDJKcVpXTjBVRzl2YkNBOUlIUnlkV1U3WEc1Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUdsdWFYUnBZV3hUYVhwbElDRTlQU0JjSW5WdVpHVm1hVzVsWkZ3aUtTQjdYRzRnSUNBZ0lDQjBhR2x6TG1WNGNHRnVaQ2hwYm1sMGFXRnNVMmw2WlNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ1lXTnhkV2x5WlNncElIdGNiaUFnSUNBdkx5QkhjbTkzSUhSb1pTQnNhWE4wSUdKNUlESXdKV2x6YUNCcFppQjNaU2R5WlNCdmRYUmNiaUFnSUNCcFppQW9kR2hwY3k1bWNtVmxUR2x6ZEM1c1pXNW5kR2dnUEQwZ01Da2dlMXh1SUNBZ0lDQWdkR2hwY3k1bGVIQmhibVFvVFdGMGFDNXliM1Z1WkNoMGFHbHpMbU52ZFc1MElDb2dNQzR5S1NBcklERXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIWmhjaUJwZEdWdElEMGdkR2hwY3k1bWNtVmxUR2x6ZEM1d2IzQW9LVHRjYmx4dUlDQWdJSEpsZEhWeWJpQnBkR1Z0TzF4dUlDQjlYRzVjYmlBZ2NtVnNaV0Z6WlNocGRHVnRLU0I3WEc0Z0lDQWdhWFJsYlM1eVpYTmxkQ2dwTzF4dUlDQWdJSFJvYVhNdVpuSmxaVXhwYzNRdWNIVnphQ2hwZEdWdEtUdGNiaUFnZlZ4dVhHNGdJR1Y0Y0dGdVpDaGpiM1Z1ZENrZ2UxeHVJQ0FnSUdadmNpQW9kbUZ5SUc0Z1BTQXdPeUJ1SUR3Z1kyOTFiblE3SUc0ckt5a2dlMXh1SUNBZ0lDQWdkbUZ5SUdOc2IyNWxJRDBnYm1WM0lIUm9hWE11WW1GelpVOWlhbVZqZENncE8xeHVJQ0FnSUNBZ1kyeHZibVV1WDNCdmIyd2dQU0IwYUdsek8xeHVJQ0FnSUNBZ2RHaHBjeTVtY21WbFRHbHpkQzV3ZFhOb0tHTnNiMjVsS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdkR2hwY3k1amIzVnVkQ0FyUFNCamIzVnVkRHRjYmlBZ2ZWeHVYRzRnSUhSdmRHRnNVMmw2WlNncElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWpiM1Z1ZER0Y2JpQWdmVnh1WEc0Z0lIUnZkR0ZzUm5KbFpTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVtY21WbFRHbHpkQzVzWlc1bmRHZzdYRzRnSUgxY2JseHVJQ0IwYjNSaGJGVnpaV1FvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVkyOTFiblFnTFNCMGFHbHpMbVp5WldWTWFYTjBMbXhsYm1kMGFEdGNiaUFnZlZ4dWZWeHVJaXdpYVcxd2IzSjBJRkYxWlhKNUlHWnliMjBnWENJdUwxRjFaWEo1TG1welhDSTdYRzVwYlhCdmNuUWdleUJ4ZFdWeWVVdGxlU0I5SUdaeWIyMGdYQ0l1TDFWMGFXeHpMbXB6WENJN1hHNWNiaThxS2x4dUlDb2dRSEJ5YVhaaGRHVmNiaUFxSUVCamJHRnpjeUJSZFdWeWVVMWhibUZuWlhKY2JpQXFMMXh1Wlhod2IzSjBJR1JsWm1GMWJIUWdZMnhoYzNNZ1VYVmxjbmxOWVc1aFoyVnlJSHRjYmlBZ1kyOXVjM1J5ZFdOMGIzSW9kMjl5YkdRcElIdGNiaUFnSUNCMGFHbHpMbDkzYjNKc1pDQTlJSGR2Y214a08xeHVYRzRnSUNBZ0x5OGdVWFZsY21sbGN5QnBibVJsZUdWa0lHSjVJR0VnZFc1cGNYVmxJR2xrWlc1MGFXWnBaWElnWm05eUlIUm9aU0JqYjIxd2IyNWxiblJ6SUdsMElHaGhjMXh1SUNBZ0lIUm9hWE11WDNGMVpYSnBaWE1nUFNCN2ZUdGNiaUFnZlZ4dVhHNGdJRzl1Ulc1MGFYUjVVbVZ0YjNabFpDaGxiblJwZEhrcElIdGNiaUFnSUNCbWIzSWdLSFpoY2lCeGRXVnllVTVoYldVZ2FXNGdkR2hwY3k1ZmNYVmxjbWxsY3lrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEYxWlhKNUlEMGdkR2hwY3k1ZmNYVmxjbWxsYzF0eGRXVnllVTVoYldWZE8xeHVJQ0FnSUNBZ2FXWWdLR1Z1ZEdsMGVTNXhkV1Z5YVdWekxtbHVaR1Y0VDJZb2NYVmxjbmtwSUNFOVBTQXRNU2tnZTF4dUlDQWdJQ0FnSUNCeGRXVnllUzV5WlcxdmRtVkZiblJwZEhrb1pXNTBhWFI1S1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNBdktpcGNiaUFnSUNvZ1EyRnNiR0poWTJzZ2QyaGxiaUJoSUdOdmJYQnZibVZ1ZENCcGN5QmhaR1JsWkNCMGJ5QmhiaUJsYm5ScGRIbGNiaUFnSUNvZ1FIQmhjbUZ0SUh0RmJuUnBkSGw5SUdWdWRHbDBlU0JGYm5ScGRIa2dkR2hoZENCcWRYTjBJR2R2ZENCMGFHVWdibVYzSUdOdmJYQnZibVZ1ZEZ4dUlDQWdLaUJBY0dGeVlXMGdlME52YlhCdmJtVnVkSDBnUTI5dGNHOXVaVzUwSUVOdmJYQnZibVZ1ZENCaFpHUmxaQ0IwYnlCMGFHVWdaVzUwYVhSNVhHNGdJQ0FxTDF4dUlDQnZia1Z1ZEdsMGVVTnZiWEJ2Ym1WdWRFRmtaR1ZrS0dWdWRHbDBlU3dnUTI5dGNHOXVaVzUwS1NCN1hHNGdJQ0FnTHk4Z1FIUnZaRzhnVlhObElHSnBkRzFoYzJzZ1ptOXlJR05vWldOcmFXNW5JR052YlhCdmJtVnVkSE0vWEc1Y2JpQWdJQ0F2THlCRGFHVmpheUJsWVdOb0lHbHVaR1Y0WldRZ2NYVmxjbmtnZEc4Z2MyVmxJR2xtSUhkbElHNWxaV1FnZEc4Z1lXUmtJSFJvYVhNZ1pXNTBhWFI1SUhSdklIUm9aU0JzYVhOMFhHNGdJQ0FnWm05eUlDaDJZWElnY1hWbGNubE9ZVzFsSUdsdUlIUm9hWE11WDNGMVpYSnBaWE1wSUh0Y2JpQWdJQ0FnSUhaaGNpQnhkV1Z5ZVNBOUlIUm9hWE11WDNGMVpYSnBaWE5iY1hWbGNubE9ZVzFsWFR0Y2JseHVJQ0FnSUNBZ2FXWWdLRnh1SUNBZ0lDQWdJQ0FoSVg1eGRXVnllUzVPYjNSRGIyMXdiMjVsYm5SekxtbHVaR1Y0VDJZb1EyOXRjRzl1Wlc1MEtTQW1KbHh1SUNBZ0lDQWdJQ0IrY1hWbGNua3VaVzUwYVhScFpYTXVhVzVrWlhoUFppaGxiblJwZEhrcFhHNGdJQ0FnSUNBcElIdGNiaUFnSUNBZ0lDQWdjWFZsY25rdWNtVnRiM1psUlc1MGFYUjVLR1Z1ZEdsMGVTazdYRzRnSUNBZ0lDQWdJR052Ym5ScGJuVmxPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCQlpHUWdkR2hsSUdWdWRHbDBlU0J2Ym14NUlHbG1PbHh1SUNBZ0lDQWdMeThnUTI5dGNHOXVaVzUwSUdseklHbHVJSFJvWlNCeGRXVnllVnh1SUNBZ0lDQWdMeThnWVc1a0lFVnVkR2wwZVNCb1lYTWdRVXhNSUhSb1pTQmpiMjF3YjI1bGJuUnpJRzltSUhSb1pTQnhkV1Z5ZVZ4dUlDQWdJQ0FnTHk4Z1lXNWtJRVZ1ZEdsMGVTQnBjeUJ1YjNRZ1lXeHlaV0ZrZVNCcGJpQjBhR1VnY1hWbGNubGNiaUFnSUNBZ0lHbG1JQ2hjYmlBZ0lDQWdJQ0FnSVg1eGRXVnllUzVEYjIxd2IyNWxiblJ6TG1sdVpHVjRUMllvUTI5dGNHOXVaVzUwS1NCOGZGeHVJQ0FnSUNBZ0lDQWhjWFZsY25rdWJXRjBZMmdvWlc1MGFYUjVLU0I4ZkZ4dUlDQWdJQ0FnSUNCK2NYVmxjbmt1Wlc1MGFYUnBaWE11YVc1a1pYaFBaaWhsYm5ScGRIa3BYRzRnSUNBZ0lDQXBYRzRnSUNBZ0lDQWdJR052Ym5ScGJuVmxPMXh1WEc0Z0lDQWdJQ0J4ZFdWeWVTNWhaR1JGYm5ScGRIa29aVzUwYVhSNUtUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRMkZzYkdKaFkyc2dkMmhsYmlCaElHTnZiWEJ2Ym1WdWRDQnBjeUJ5WlcxdmRtVmtJR1p5YjIwZ1lXNGdaVzUwYVhSNVhHNGdJQ0FxSUVCd1lYSmhiU0I3Ulc1MGFYUjVmU0JsYm5ScGRIa2dSVzUwYVhSNUlIUnZJSEpsYlc5MlpTQjBhR1VnWTI5dGNHOXVaVzUwSUdaeWIyMWNiaUFnSUNvZ1FIQmhjbUZ0SUh0RGIyMXdiMjVsYm5SOUlFTnZiWEJ2Ym1WdWRDQkRiMjF3YjI1bGJuUWdkRzhnY21WdGIzWmxJR1p5YjIwZ2RHaGxJR1Z1ZEdsMGVWeHVJQ0FnS2k5Y2JpQWdiMjVGYm5ScGRIbERiMjF3YjI1bGJuUlNaVzF2ZG1Wa0tHVnVkR2wwZVN3Z1EyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ1ptOXlJQ2gyWVhJZ2NYVmxjbmxPWVcxbElHbHVJSFJvYVhNdVgzRjFaWEpwWlhNcElIdGNiaUFnSUNBZ0lIWmhjaUJ4ZFdWeWVTQTlJSFJvYVhNdVgzRjFaWEpwWlhOYmNYVmxjbmxPWVcxbFhUdGNibHh1SUNBZ0lDQWdhV1lnS0Z4dUlDQWdJQ0FnSUNBaElYNXhkV1Z5ZVM1T2IzUkRiMjF3YjI1bGJuUnpMbWx1WkdWNFQyWW9RMjl0Y0c5dVpXNTBLU0FtSmx4dUlDQWdJQ0FnSUNBaGZuRjFaWEo1TG1WdWRHbDBhV1Z6TG1sdVpHVjRUMllvWlc1MGFYUjVLU0FtSmx4dUlDQWdJQ0FnSUNCeGRXVnllUzV0WVhSamFDaGxiblJwZEhrcFhHNGdJQ0FnSUNBcElIdGNiaUFnSUNBZ0lDQWdjWFZsY25rdVlXUmtSVzUwYVhSNUtHVnVkR2wwZVNrN1hHNGdJQ0FnSUNBZ0lHTnZiblJwYm5WbE8xeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQnBaaUFvWEc0Z0lDQWdJQ0FnSUNFaGZuRjFaWEo1TGtOdmJYQnZibVZ1ZEhNdWFXNWtaWGhQWmloRGIyMXdiMjVsYm5RcElDWW1YRzRnSUNBZ0lDQWdJQ0VoZm5GMVpYSjVMbVZ1ZEdsMGFXVnpMbWx1WkdWNFQyWW9aVzUwYVhSNUtTQW1KbHh1SUNBZ0lDQWdJQ0FoY1hWbGNua3ViV0YwWTJnb1pXNTBhWFI1S1Z4dUlDQWdJQ0FnS1NCN1hHNGdJQ0FnSUNBZ0lIRjFaWEo1TG5KbGJXOTJaVVZ1ZEdsMGVTaGxiblJwZEhrcE8xeHVJQ0FnSUNBZ0lDQmpiMjUwYVc1MVpUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dSMlYwSUdFZ2NYVmxjbmtnWm05eUlIUm9aU0J6Y0dWamFXWnBaV1FnWTI5dGNHOXVaVzUwYzF4dUlDQWdLaUJBY0dGeVlXMGdlME52YlhCdmJtVnVkSDBnUTI5dGNHOXVaVzUwY3lCRGIyMXdiMjVsYm5SeklIUm9ZWFFnZEdobElIRjFaWEo1SUhOb2IzVnNaQ0JvWVhabFhHNGdJQ0FxTDF4dUlDQm5aWFJSZFdWeWVTaERiMjF3YjI1bGJuUnpLU0I3WEc0Z0lDQWdkbUZ5SUd0bGVTQTlJSEYxWlhKNVMyVjVLRU52YlhCdmJtVnVkSE1wTzF4dUlDQWdJSFpoY2lCeGRXVnllU0E5SUhSb2FYTXVYM0YxWlhKcFpYTmJhMlY1WFR0Y2JpQWdJQ0JwWmlBb0lYRjFaWEo1S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbDl4ZFdWeWFXVnpXMnRsZVYwZ1BTQnhkV1Z5ZVNBOUlHNWxkeUJSZFdWeWVTaERiMjF3YjI1bGJuUnpMQ0IwYUdsekxsOTNiM0pzWkNrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnhkV1Z5ZVR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlNaWFIxY200Z2MyOXRaU0J6ZEdGMGN5Qm1jbTl0SUhSb2FYTWdZMnhoYzNOY2JpQWdJQ292WEc0Z0lITjBZWFJ6S0NrZ2UxeHVJQ0FnSUhaaGNpQnpkR0YwY3lBOUlIdDlPMXh1SUNBZ0lHWnZjaUFvZG1GeUlIRjFaWEo1VG1GdFpTQnBiaUIwYUdsekxsOXhkV1Z5YVdWektTQjdYRzRnSUNBZ0lDQnpkR0YwYzF0eGRXVnllVTVoYldWZElEMGdkR2hwY3k1ZmNYVmxjbWxsYzF0eGRXVnllVTVoYldWZExuTjBZWFJ6S0NrN1hHNGdJQ0FnZlZ4dUlDQWdJSEpsZEhWeWJpQnpkR0YwY3p0Y2JpQWdmVnh1ZlZ4dUlpd2laWGh3YjNKMElHTnNZWE56SUVOdmJYQnZibVZ1ZENCN1hHNGdJR052Ym5OMGNuVmpkRzl5S0hCeWIzQnpLU0I3WEc0Z0lDQWdhV1lnS0hCeWIzQnpJQ0U5UFNCbVlXeHpaU2tnZTF4dUlDQWdJQ0FnWTI5dWMzUWdjMk5vWlcxaElEMGdkR2hwY3k1amIyNXpkSEoxWTNSdmNpNXpZMmhsYldFN1hHNWNiaUFnSUNBZ0lHWnZjaUFvWTI5dWMzUWdhMlY1SUdsdUlITmphR1Z0WVNrZ2UxeHVJQ0FnSUNBZ0lDQnBaaUFvY0hKdmNITWdKaVlnY0hKdmNITXVhR0Z6VDNkdVVISnZjR1Z5ZEhrb2EyVjVLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lIUm9hWE5iYTJWNVhTQTlJSEJ5YjNCelcydGxlVjA3WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ1kyOXVjM1FnYzJOb1pXMWhVSEp2Y0NBOUlITmphR1Z0WVZ0clpYbGRPMXh1SUNBZ0lDQWdJQ0FnSUdsbUlDaHpZMmhsYldGUWNtOXdMbWhoYzA5M2JsQnliM0JsY25SNUtGd2laR1ZtWVhWc2RGd2lLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdkR2hwYzF0clpYbGRJRDBnYzJOb1pXMWhVSEp2Y0M1MGVYQmxMbU5zYjI1bEtITmphR1Z0WVZCeWIzQXVaR1ZtWVhWc2RDazdYRzRnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnSUNBZ0lHTnZibk4wSUhSNWNHVWdQU0J6WTJobGJXRlFjbTl3TG5SNWNHVTdYRzRnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpXMnRsZVYwZ1BTQjBlWEJsTG1Oc2IyNWxLSFI1Y0dVdVpHVm1ZWFZzZENrN1hHNGdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdkR2hwY3k1ZmNHOXZiQ0E5SUc1MWJHdzdYRzRnSUgxY2JseHVJQ0JqYjNCNUtITnZkWEpqWlNrZ2UxeHVJQ0FnSUdOdmJuTjBJSE5qYUdWdFlTQTlJSFJvYVhNdVkyOXVjM1J5ZFdOMGIzSXVjMk5vWlcxaE8xeHVYRzRnSUNBZ1ptOXlJQ2hqYjI1emRDQnJaWGtnYVc0Z2MyTm9aVzFoS1NCN1hHNGdJQ0FnSUNCamIyNXpkQ0J3Y205d0lEMGdjMk5vWlcxaFcydGxlVjA3WEc1Y2JpQWdJQ0FnSUdsbUlDaHpiM1Z5WTJVdWFHRnpUM2R1VUhKdmNHVnlkSGtvYTJWNUtTa2dlMXh1SUNBZ0lDQWdJQ0J3Y205d0xuUjVjR1V1WTI5d2VTaHpiM1Z5WTJVc0lIUm9hWE1zSUd0bGVTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTTdYRzRnSUgxY2JseHVJQ0JqYkc5dVpTZ3BJSHRjYmlBZ0lDQnlaWFIxY200Z2JtVjNJSFJvYVhNdVkyOXVjM1J5ZFdOMGIzSW9LUzVqYjNCNUtIUm9hWE1wTzF4dUlDQjlYRzVjYmlBZ2NtVnpaWFFvS1NCN1hHNGdJQ0FnWTI5dWMzUWdjMk5vWlcxaElEMGdkR2hwY3k1amIyNXpkSEoxWTNSdmNpNXpZMmhsYldFN1hHNWNiaUFnSUNCbWIzSWdLR052Ym5OMElHdGxlU0JwYmlCelkyaGxiV0VwSUh0Y2JpQWdJQ0FnSUdOdmJuTjBJSE5qYUdWdFlWQnliM0FnUFNCelkyaGxiV0ZiYTJWNVhUdGNibHh1SUNBZ0lDQWdhV1lnS0hOamFHVnRZVkJ5YjNBdWFHRnpUM2R1VUhKdmNHVnlkSGtvWENKa1pXWmhkV3gwWENJcEtTQjdYRzRnSUNBZ0lDQWdJSFJvYVhOYmEyVjVYU0E5SUhOamFHVnRZVkJ5YjNBdWRIbHdaUzVqYkc5dVpTaHpZMmhsYldGUWNtOXdMbVJsWm1GMWJIUXBPMXh1SUNBZ0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lDQWdZMjl1YzNRZ2RIbHdaU0E5SUhOamFHVnRZVkJ5YjNBdWRIbHdaVHRjYmlBZ0lDQWdJQ0FnZEdocGMxdHJaWGxkSUQwZ2RIbHdaUzVqYkc5dVpTaDBlWEJsTG1SbFptRjFiSFFwTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdScGMzQnZjMlVvS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11WDNCdmIyd3BJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzQnZiMnd1Y21Wc1pXRnpaU2gwYUdsektUdGNiaUFnSUNCOVhHNGdJSDFjYm4xY2JseHVRMjl0Y0c5dVpXNTBMbk5qYUdWdFlTQTlJSHQ5TzF4dVEyOXRjRzl1Wlc1MExtbHpRMjl0Y0c5dVpXNTBJRDBnZEhKMVpUdGNiaUlzSW1sdGNHOXlkQ0I3SUVOdmJYQnZibVZ1ZENCOUlHWnliMjBnWENJdUwwTnZiWEJ2Ym1WdWRGd2lPMXh1WEc1bGVIQnZjblFnWTJ4aGMzTWdVM2x6ZEdWdFUzUmhkR1ZEYjIxd2IyNWxiblFnWlhoMFpXNWtjeUJEYjIxd2IyNWxiblFnZTMxY2JseHVVM2x6ZEdWdFUzUmhkR1ZEYjIxd2IyNWxiblF1YVhOVGVYTjBaVzFUZEdGMFpVTnZiWEJ2Ym1WdWRDQTlJSFJ5ZFdVN1hHNGlMQ0pwYlhCdmNuUWdleUJQWW1wbFkzUlFiMjlzSUgwZ1puSnZiU0JjSWk0dlQySnFaV04wVUc5dmJDNXFjMXdpTzF4dWFXMXdiM0owSUZGMVpYSjVUV0Z1WVdkbGNpQm1jbTl0SUZ3aUxpOVJkV1Z5ZVUxaGJtRm5aWEl1YW5OY0lqdGNibWx0Y0c5eWRDQkZkbVZ1ZEVScGMzQmhkR05vWlhJZ1puSnZiU0JjSWk0dlJYWmxiblJFYVhOd1lYUmphR1Z5TG1welhDSTdYRzVwYlhCdmNuUWdleUJuWlhST1lXMWxJSDBnWm5KdmJTQmNJaTR2VlhScGJITXVhbk5jSWp0Y2JtbHRjRzl5ZENCN0lGTjVjM1JsYlZOMFlYUmxRMjl0Y0c5dVpXNTBJSDBnWm5KdmJTQmNJaTR2VTNsemRHVnRVM1JoZEdWRGIyMXdiMjVsYm5RdWFuTmNJanRjYmx4dVkyeGhjM01nUlc1MGFYUjVVRzl2YkNCbGVIUmxibVJ6SUU5aWFtVmpkRkJ2YjJ3Z2UxeHVJQ0JqYjI1emRISjFZM1J2Y2lobGJuUnBkSGxOWVc1aFoyVnlMQ0JsYm5ScGRIbERiR0Z6Y3l3Z2FXNXBkR2xoYkZOcGVtVXBJSHRjYmlBZ0lDQnpkWEJsY2lobGJuUnBkSGxEYkdGemN5d2dkVzVrWldacGJtVmtLVHRjYmlBZ0lDQjBhR2x6TG1WdWRHbDBlVTFoYm1GblpYSWdQU0JsYm5ScGRIbE5ZVzVoWjJWeU8xeHVYRzRnSUNBZ2FXWWdLSFI1Y0dWdlppQnBibWwwYVdGc1UybDZaU0FoUFQwZ1hDSjFibVJsWm1sdVpXUmNJaWtnZTF4dUlDQWdJQ0FnZEdocGN5NWxlSEJoYm1Rb2FXNXBkR2xoYkZOcGVtVXBPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJR1Y0Y0dGdVpDaGpiM1Z1ZENrZ2UxeHVJQ0FnSUdadmNpQW9kbUZ5SUc0Z1BTQXdPeUJ1SUR3Z1kyOTFiblE3SUc0ckt5a2dlMXh1SUNBZ0lDQWdkbUZ5SUdOc2IyNWxJRDBnYm1WM0lIUm9hWE11WW1GelpVOWlhbVZqZENoMGFHbHpMbVZ1ZEdsMGVVMWhibUZuWlhJcE8xeHVJQ0FnSUNBZ1kyeHZibVV1WDNCdmIyd2dQU0IwYUdsek8xeHVJQ0FnSUNBZ2RHaHBjeTVtY21WbFRHbHpkQzV3ZFhOb0tHTnNiMjVsS1R0Y2JpQWdJQ0I5WEc0Z0lDQWdkR2hwY3k1amIzVnVkQ0FyUFNCamIzVnVkRHRjYmlBZ2ZWeHVmVnh1WEc0dktpcGNiaUFxSUVCd2NtbDJZWFJsWEc0Z0tpQkFZMnhoYzNNZ1JXNTBhWFI1VFdGdVlXZGxjbHh1SUNvdlhHNWxlSEJ2Y25RZ1kyeGhjM01nUlc1MGFYUjVUV0Z1WVdkbGNpQjdYRzRnSUdOdmJuTjBjblZqZEc5eUtIZHZjbXhrS1NCN1hHNGdJQ0FnZEdocGN5NTNiM0pzWkNBOUlIZHZjbXhrTzF4dUlDQWdJSFJvYVhNdVkyOXRjRzl1Wlc1MGMwMWhibUZuWlhJZ1BTQjNiM0pzWkM1amIyMXdiMjVsYm5SelRXRnVZV2RsY2p0Y2JseHVJQ0FnSUM4dklFRnNiQ0IwYUdVZ1pXNTBhWFJwWlhNZ2FXNGdkR2hwY3lCcGJuTjBZVzVqWlZ4dUlDQWdJSFJvYVhNdVgyVnVkR2wwYVdWeklEMGdXMTA3WEc0Z0lDQWdkR2hwY3k1ZmJtVjRkRVZ1ZEdsMGVVbGtJRDBnTUR0Y2JseHVJQ0FnSUhSb2FYTXVYMlZ1ZEdsMGFXVnpRbmxPWVcxbGN5QTlJSHQ5TzF4dVhHNGdJQ0FnZEdocGN5NWZjWFZsY25sTllXNWhaMlZ5SUQwZ2JtVjNJRkYxWlhKNVRXRnVZV2RsY2loMGFHbHpLVHRjYmlBZ0lDQjBhR2x6TG1WMlpXNTBSR2x6Y0dGMFkyaGxjaUE5SUc1bGR5QkZkbVZ1ZEVScGMzQmhkR05vWlhJb0tUdGNiaUFnSUNCMGFHbHpMbDlsYm5ScGRIbFFiMjlzSUQwZ2JtVjNJRVZ1ZEdsMGVWQnZiMndvWEc0Z0lDQWdJQ0IwYUdsekxGeHVJQ0FnSUNBZ2RHaHBjeTUzYjNKc1pDNXZjSFJwYjI1ekxtVnVkR2wwZVVOc1lYTnpMRnh1SUNBZ0lDQWdkR2hwY3k1M2IzSnNaQzV2Y0hScGIyNXpMbVZ1ZEdsMGVWQnZiMnhUYVhwbFhHNGdJQ0FnS1R0Y2JseHVJQ0FnSUM4dklFUmxabVZ5Y21Wa0lHUmxiR1YwYVc5dVhHNGdJQ0FnZEdocGN5NWxiblJwZEdsbGMxZHBkR2hEYjIxd2IyNWxiblJ6Vkc5U1pXMXZkbVVnUFNCYlhUdGNiaUFnSUNCMGFHbHpMbVZ1ZEdsMGFXVnpWRzlTWlcxdmRtVWdQU0JiWFR0Y2JpQWdJQ0IwYUdsekxtUmxabVZ5Y21Wa1VtVnRiM1poYkVWdVlXSnNaV1FnUFNCMGNuVmxPMXh1SUNCOVhHNWNiaUFnWjJWMFJXNTBhWFI1UW5sT1lXMWxLRzVoYldVcElIdGNiaUFnSUNCeVpYUjFjbTRnZEdocGN5NWZaVzUwYVhScFpYTkNlVTVoYldWelcyNWhiV1ZkTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFTnlaV0YwWlNCaElHNWxkeUJsYm5ScGRIbGNiaUFnSUNvdlhHNGdJR055WldGMFpVVnVkR2wwZVNodVlXMWxLU0I3WEc0Z0lDQWdkbUZ5SUdWdWRHbDBlU0E5SUhSb2FYTXVYMlZ1ZEdsMGVWQnZiMnd1WVdOeGRXbHlaU2dwTzF4dUlDQWdJR1Z1ZEdsMGVTNWhiR2wyWlNBOUlIUnlkV1U3WEc0Z0lDQWdaVzUwYVhSNUxtNWhiV1VnUFNCdVlXMWxJSHg4SUZ3aVhDSTdYRzRnSUNBZ2FXWWdLRzVoYldVcElIdGNiaUFnSUNBZ0lHbG1JQ2gwYUdsekxsOWxiblJwZEdsbGMwSjVUbUZ0WlhOYmJtRnRaVjBwSUh0Y2JpQWdJQ0FnSUNBZ1kyOXVjMjlzWlM1M1lYSnVLR0JGYm5ScGRIa2dibUZ0WlNBbkpIdHVZVzFsZlNjZ1lXeHlaV0ZrZVNCbGVHbHpkR0FwTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZaVzUwYVhScFpYTkNlVTVoYldWelcyNWhiV1ZkSUQwZ1pXNTBhWFI1TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdVgyVnVkR2wwYVdWekxuQjFjMmdvWlc1MGFYUjVLVHRjYmlBZ0lDQjBhR2x6TG1WMlpXNTBSR2x6Y0dGMFkyaGxjaTVrYVhOd1lYUmphRVYyWlc1MEtFVk9WRWxVV1Y5RFVrVkJWRVZFTENCbGJuUnBkSGtwTzF4dUlDQWdJSEpsZEhWeWJpQmxiblJwZEhrN1hHNGdJSDFjYmx4dUlDQXZMeUJEVDAxUVQwNUZUbFJUWEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUZrWkNCaElHTnZiWEJ2Ym1WdWRDQjBieUJoYmlCbGJuUnBkSGxjYmlBZ0lDb2dRSEJoY21GdElIdEZiblJwZEhsOUlHVnVkR2wwZVNCRmJuUnBkSGtnZDJobGNtVWdkR2hsSUdOdmJYQnZibVZ1ZENCM2FXeHNJR0psSUdGa1pHVmtYRzRnSUNBcUlFQndZWEpoYlNCN1EyOXRjRzl1Wlc1MGZTQkRiMjF3YjI1bGJuUWdRMjl0Y0c5dVpXNTBJSFJ2SUdKbElHRmtaR1ZrSUhSdklIUm9aU0JsYm5ScGRIbGNiaUFnSUNvZ1FIQmhjbUZ0SUh0UFltcGxZM1I5SUhaaGJIVmxjeUJQY0hScGIyNWhiQ0IyWVd4MVpYTWdkRzhnY21Wd2JHRmpaU0IwYUdVZ1pHVm1ZWFZzZENCaGRIUnlhV0oxZEdWelhHNGdJQ0FxTDF4dUlDQmxiblJwZEhsQlpHUkRiMjF3YjI1bGJuUW9aVzUwYVhSNUxDQkRiMjF3YjI1bGJuUXNJSFpoYkhWbGN5a2dlMXh1SUNBZ0lHbG1JQ2doZEdocGN5NTNiM0pzWkM1amIyMXdiMjVsYm5SelRXRnVZV2RsY2k1RGIyMXdiMjVsYm5SelcwTnZiWEJ2Ym1WdWRDNXVZVzFsWFNrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0Z4dUlDQWdJQ0FnSUNCZ1FYUjBaVzF3ZEdWa0lIUnZJR0ZrWkNCMWJuSmxaMmx6ZEdWeVpXUWdZMjl0Y0c5dVpXNTBJRndpSkh0RGIyMXdiMjVsYm5RdWJtRnRaWDFjSW1CY2JpQWdJQ0FnSUNrN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tINWxiblJwZEhrdVgwTnZiWEJ2Ym1WdWRGUjVjR1Z6TG1sdVpHVjRUMllvUTI5dGNHOXVaVzUwS1NrZ2UxeHVJQ0FnSUNBZ0x5OGdRSFJ2Wkc4Z1NuVnpkQ0J2YmlCa1pXSjFaeUJ0YjJSbFhHNGdJQ0FnSUNCamIyNXpiMnhsTG5kaGNtNG9YRzRnSUNBZ0lDQWdJRndpUTI5dGNHOXVaVzUwSUhSNWNHVWdZV3h5WldGa2VTQmxlR2x6ZEhNZ2IyNGdaVzUwYVhSNUxsd2lMRnh1SUNBZ0lDQWdJQ0JsYm5ScGRIa3NYRzRnSUNBZ0lDQWdJRU52YlhCdmJtVnVkQzV1WVcxbFhHNGdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1TzF4dUlDQWdJSDFjYmx4dUlDQWdJR1Z1ZEdsMGVTNWZRMjl0Y0c5dVpXNTBWSGx3WlhNdWNIVnphQ2hEYjIxd2IyNWxiblFwTzF4dVhHNGdJQ0FnYVdZZ0tFTnZiWEJ2Ym1WdWRDNWZYM0J5YjNSdlgxOGdQVDA5SUZONWMzUmxiVk4wWVhSbFEyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ0lDQmxiblJwZEhrdWJuVnRVM1JoZEdWRGIyMXdiMjVsYm5Sekt5czdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RtRnlJR052YlhCdmJtVnVkRkJ2YjJ3Z1BTQjBhR2x6TG5kdmNteGtMbU52YlhCdmJtVnVkSE5OWVc1aFoyVnlMbWRsZEVOdmJYQnZibVZ1ZEhOUWIyOXNLRnh1SUNBZ0lDQWdRMjl0Y0c5dVpXNTBYRzRnSUNBZ0tUdGNibHh1SUNBZ0lIWmhjaUJqYjIxd2IyNWxiblFnUFNCamIyMXdiMjVsYm5SUWIyOXNYRzRnSUNBZ0lDQS9JR052YlhCdmJtVnVkRkJ2YjJ3dVlXTnhkV2x5WlNncFhHNGdJQ0FnSUNBNklHNWxkeUJEYjIxd2IyNWxiblFvZG1Gc2RXVnpLVHRjYmx4dUlDQWdJR2xtSUNoamIyMXdiMjVsYm5SUWIyOXNJQ1ltSUhaaGJIVmxjeWtnZTF4dUlDQWdJQ0FnWTI5dGNHOXVaVzUwTG1OdmNIa29kbUZzZFdWektUdGNiaUFnSUNCOVhHNWNiaUFnSUNCbGJuUnBkSGt1WDJOdmJYQnZibVZ1ZEhOYlEyOXRjRzl1Wlc1MExtNWhiV1ZkSUQwZ1kyOXRjRzl1Wlc1ME8xeHVYRzRnSUNBZ2RHaHBjeTVmY1hWbGNubE5ZVzVoWjJWeUxtOXVSVzUwYVhSNVEyOXRjRzl1Wlc1MFFXUmtaV1FvWlc1MGFYUjVMQ0JEYjIxd2IyNWxiblFwTzF4dUlDQWdJSFJvYVhNdWQyOXliR1F1WTI5dGNHOXVaVzUwYzAxaGJtRm5aWEl1WTI5dGNHOXVaVzUwUVdSa1pXUlViMFZ1ZEdsMGVTaERiMjF3YjI1bGJuUXBPMXh1WEc0Z0lDQWdkR2hwY3k1bGRtVnVkRVJwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmhGZG1WdWRDaERUMDFRVDA1RlRsUmZRVVJFUlVRc0lHVnVkR2wwZVN3Z1EyOXRjRzl1Wlc1MEtUdGNiaUFnZlZ4dVhHNGdJQzhxS2x4dUlDQWdLaUJTWlcxdmRtVWdZU0JqYjIxd2IyNWxiblFnWm5KdmJTQmhiaUJsYm5ScGRIbGNiaUFnSUNvZ1FIQmhjbUZ0SUh0RmJuUnBkSGw5SUdWdWRHbDBlU0JGYm5ScGRIa2dkMmhwWTJnZ2QybHNiQ0JuWlhRZ2NtVnRiM1psWkNCMGFHVWdZMjl0Y0c5dVpXNTBYRzRnSUNBcUlFQndZWEpoYlNCN0tuMGdRMjl0Y0c5dVpXNTBJRU52YlhCdmJtVnVkQ0IwYnlCeVpXMXZkbVVnWm5KdmJTQjBhR1VnWlc1MGFYUjVYRzRnSUNBcUlFQndZWEpoYlNCN1FtOXZiSDBnYVcxdFpXUnBZWFJsYkhrZ1NXWWdlVzkxSUhkaGJuUWdkRzhnY21WdGIzWmxJSFJvWlNCamIyMXdiMjVsYm5RZ2FXMXRaV1JwWVhSbGJIa2dhVzV6ZEdWaFpDQnZaaUJrWldabGNuSmxaQ0FvUkdWbVlYVnNkQ0JwY3lCbVlXeHpaU2xjYmlBZ0lDb3ZYRzRnSUdWdWRHbDBlVkpsYlc5MlpVTnZiWEJ2Ym1WdWRDaGxiblJwZEhrc0lFTnZiWEJ2Ym1WdWRDd2dhVzF0WldScFlYUmxiSGtwSUh0Y2JpQWdJQ0IyWVhJZ2FXNWtaWGdnUFNCbGJuUnBkSGt1WDBOdmJYQnZibVZ1ZEZSNWNHVnpMbWx1WkdWNFQyWW9RMjl0Y0c5dVpXNTBLVHRjYmlBZ0lDQnBaaUFvSVg1cGJtUmxlQ2tnY21WMGRYSnVPMXh1WEc0Z0lDQWdkR2hwY3k1bGRtVnVkRVJwYzNCaGRHTm9aWEl1WkdsemNHRjBZMmhGZG1WdWRDaERUMDFRVDA1RlRsUmZVa1ZOVDFaRkxDQmxiblJwZEhrc0lFTnZiWEJ2Ym1WdWRDazdYRzVjYmlBZ0lDQnBaaUFvYVcxdFpXUnBZWFJsYkhrcElIdGNiaUFnSUNBZ0lIUm9hWE11WDJWdWRHbDBlVkpsYlc5MlpVTnZiWEJ2Ym1WdWRGTjVibU1vWlc1MGFYUjVMQ0JEYjIxd2IyNWxiblFzSUdsdVpHVjRLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2FXWWdLR1Z1ZEdsMGVTNWZRMjl0Y0c5dVpXNTBWSGx3WlhOVWIxSmxiVzkyWlM1c1pXNW5kR2dnUFQwOUlEQXBYRzRnSUNBZ0lDQWdJSFJvYVhNdVpXNTBhWFJwWlhOWGFYUm9RMjl0Y0c5dVpXNTBjMVJ2VW1WdGIzWmxMbkIxYzJnb1pXNTBhWFI1S1R0Y2JseHVJQ0FnSUNBZ1pXNTBhWFI1TGw5RGIyMXdiMjVsYm5SVWVYQmxjeTV6Y0d4cFkyVW9hVzVrWlhnc0lERXBPMXh1SUNBZ0lDQWdaVzUwYVhSNUxsOURiMjF3YjI1bGJuUlVlWEJsYzFSdlVtVnRiM1psTG5CMWMyZ29RMjl0Y0c5dVpXNTBLVHRjYmx4dUlDQWdJQ0FnZG1GeUlHTnZiWEJ2Ym1WdWRFNWhiV1VnUFNCblpYUk9ZVzFsS0VOdmJYQnZibVZ1ZENrN1hHNGdJQ0FnSUNCbGJuUnBkSGt1WDJOdmJYQnZibVZ1ZEhOVWIxSmxiVzkyWlZ0amIyMXdiMjVsYm5ST1lXMWxYU0E5WEc0Z0lDQWdJQ0FnSUdWdWRHbDBlUzVmWTI5dGNHOXVaVzUwYzF0amIyMXdiMjVsYm5ST1lXMWxYVHRjYmlBZ0lDQWdJR1JsYkdWMFpTQmxiblJwZEhrdVgyTnZiWEJ2Ym1WdWRITmJZMjl0Y0c5dVpXNTBUbUZ0WlYwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnTHk4Z1EyaGxZMnNnWldGamFDQnBibVJsZUdWa0lIRjFaWEo1SUhSdklITmxaU0JwWmlCM1pTQnVaV1ZrSUhSdklISmxiVzkyWlNCcGRGeHVJQ0FnSUhSb2FYTXVYM0YxWlhKNVRXRnVZV2RsY2k1dmJrVnVkR2wwZVVOdmJYQnZibVZ1ZEZKbGJXOTJaV1FvWlc1MGFYUjVMQ0JEYjIxd2IyNWxiblFwTzF4dVhHNGdJQ0FnYVdZZ0tFTnZiWEJ2Ym1WdWRDNWZYM0J5YjNSdlgxOGdQVDA5SUZONWMzUmxiVk4wWVhSbFEyOXRjRzl1Wlc1MEtTQjdYRzRnSUNBZ0lDQmxiblJwZEhrdWJuVnRVM1JoZEdWRGIyMXdiMjVsYm5SekxTMDdYRzVjYmlBZ0lDQWdJQzh2SUVOb1pXTnJJR2xtSUhSb1pTQmxiblJwZEhrZ2QyRnpJR0VnWjJodmMzUWdkMkZwZEdsdVp5Qm1iM0lnZEdobElHeGhjM1FnYzNsemRHVnRJSE4wWVhSbElHTnZiWEJ2Ym1WdWRDQjBieUJpWlNCeVpXMXZkbVZrWEc0Z0lDQWdJQ0JwWmlBb1pXNTBhWFI1TG01MWJWTjBZWFJsUTI5dGNHOXVaVzUwY3lBOVBUMGdNQ0FtSmlBaFpXNTBhWFI1TG1Gc2FYWmxLU0I3WEc0Z0lDQWdJQ0FnSUdWdWRHbDBlUzV5WlcxdmRtVW9LVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0JmWlc1MGFYUjVVbVZ0YjNabFEyOXRjRzl1Wlc1MFUzbHVZeWhsYm5ScGRIa3NJRU52YlhCdmJtVnVkQ3dnYVc1a1pYZ3BJSHRjYmlBZ0lDQXZMeUJTWlcxdmRtVWdWQ0JzYVhOMGFXNW5JRzl1SUdWdWRHbDBlU0JoYm1RZ2NISnZjR1Z5ZEhrZ2NtVm1MQ0IwYUdWdUlHWnlaV1VnZEdobElHTnZiWEJ2Ym1WdWRDNWNiaUFnSUNCbGJuUnBkSGt1WDBOdmJYQnZibVZ1ZEZSNWNHVnpMbk53YkdsalpTaHBibVJsZUN3Z01TazdYRzRnSUNBZ2RtRnlJR052YlhCdmJtVnVkRTVoYldVZ1BTQm5aWFJPWVcxbEtFTnZiWEJ2Ym1WdWRDazdYRzRnSUNBZ2RtRnlJR052YlhCdmJtVnVkQ0E5SUdWdWRHbDBlUzVmWTI5dGNHOXVaVzUwYzF0amIyMXdiMjVsYm5ST1lXMWxYVHRjYmlBZ0lDQmtaV3hsZEdVZ1pXNTBhWFI1TGw5amIyMXdiMjVsYm5SelcyTnZiWEJ2Ym1WdWRFNWhiV1ZkTzF4dUlDQWdJR052YlhCdmJtVnVkQzVrYVhOd2IzTmxLQ2s3WEc0Z0lDQWdkR2hwY3k1M2IzSnNaQzVqYjIxd2IyNWxiblJ6VFdGdVlXZGxjaTVqYjIxd2IyNWxiblJTWlcxdmRtVmtSbkp2YlVWdWRHbDBlU2hEYjIxd2IyNWxiblFwTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGSmxiVzkyWlNCaGJHd2dkR2hsSUdOdmJYQnZibVZ1ZEhNZ1puSnZiU0JoYmlCbGJuUnBkSGxjYmlBZ0lDb2dRSEJoY21GdElIdEZiblJwZEhsOUlHVnVkR2wwZVNCRmJuUnBkSGtnWm5KdmJTQjNhR2xqYUNCMGFHVWdZMjl0Y0c5dVpXNTBjeUIzYVd4c0lHSmxJSEpsYlc5MlpXUmNiaUFnSUNvdlhHNGdJR1Z1ZEdsMGVWSmxiVzkyWlVGc2JFTnZiWEJ2Ym1WdWRITW9aVzUwYVhSNUxDQnBiVzFsWkdsaGRHVnNlU2tnZTF4dUlDQWdJR3hsZENCRGIyMXdiMjVsYm5SeklEMGdaVzUwYVhSNUxsOURiMjF3YjI1bGJuUlVlWEJsY3p0Y2JseHVJQ0FnSUdadmNpQW9iR1YwSUdvZ1BTQkRiMjF3YjI1bGJuUnpMbXhsYm1kMGFDQXRJREU3SUdvZ1BqMGdNRHNnYWkwdEtTQjdYRzRnSUNBZ0lDQnBaaUFvUTI5dGNHOXVaVzUwYzF0cVhTNWZYM0J5YjNSdlgxOGdJVDA5SUZONWMzUmxiVk4wWVhSbFEyOXRjRzl1Wlc1MEtWeHVJQ0FnSUNBZ0lDQjBhR2x6TG1WdWRHbDBlVkpsYlc5MlpVTnZiWEJ2Ym1WdWRDaGxiblJwZEhrc0lFTnZiWEJ2Ym1WdWRITmJhbDBzSUdsdGJXVmthV0YwWld4NUtUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZLaXBjYmlBZ0lDb2dVbVZ0YjNabElIUm9aU0JsYm5ScGRIa2dabkp2YlNCMGFHbHpJRzFoYm1GblpYSXVJRWwwSUhkcGJHd2dZMnhsWVhJZ1lXeHpieUJwZEhNZ1kyOXRjRzl1Wlc1MGMxeHVJQ0FnS2lCQWNHRnlZVzBnZTBWdWRHbDBlWDBnWlc1MGFYUjVJRVZ1ZEdsMGVTQjBieUJ5WlcxdmRtVWdabkp2YlNCMGFHVWdiV0Z1WVdkbGNseHVJQ0FnS2lCQWNHRnlZVzBnZTBKdmIyeDlJR2x0YldWa2FXRjBaV3g1SUVsbUlIbHZkU0IzWVc1MElIUnZJSEpsYlc5MlpTQjBhR1VnWTI5dGNHOXVaVzUwSUdsdGJXVmthV0YwWld4NUlHbHVjM1JsWVdRZ2IyWWdaR1ZtWlhKeVpXUWdLRVJsWm1GMWJIUWdhWE1nWm1Gc2MyVXBYRzRnSUNBcUwxeHVJQ0J5WlcxdmRtVkZiblJwZEhrb1pXNTBhWFI1TENCcGJXMWxaR2xoZEdWc2VTa2dlMXh1SUNBZ0lIWmhjaUJwYm1SbGVDQTlJSFJvYVhNdVgyVnVkR2wwYVdWekxtbHVaR1Y0VDJZb1pXNTBhWFI1S1R0Y2JseHVJQ0FnSUdsbUlDZ2hmbWx1WkdWNEtTQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb1hDSlVjbWxsWkNCMGJ5QnlaVzF2ZG1VZ1pXNTBhWFI1SUc1dmRDQnBiaUJzYVhOMFhDSXBPMXh1WEc0Z0lDQWdaVzUwYVhSNUxtRnNhWFpsSUQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0JwWmlBb1pXNTBhWFI1TG01MWJWTjBZWFJsUTI5dGNHOXVaVzUwY3lBOVBUMGdNQ2tnZTF4dUlDQWdJQ0FnTHk4Z1VtVnRiM1psSUdaeWIyMGdaVzUwYVhSNUlHeHBjM1JjYmlBZ0lDQWdJSFJvYVhNdVpYWmxiblJFYVhOd1lYUmphR1Z5TG1ScGMzQmhkR05vUlhabGJuUW9SVTVVU1ZSWlgxSkZUVTlXUlVRc0lHVnVkR2wwZVNrN1hHNGdJQ0FnSUNCMGFHbHpMbDl4ZFdWeWVVMWhibUZuWlhJdWIyNUZiblJwZEhsU1pXMXZkbVZrS0dWdWRHbDBlU2s3WEc0Z0lDQWdJQ0JwWmlBb2FXMXRaV1JwWVhSbGJIa2dQVDA5SUhSeWRXVXBJSHRjYmlBZ0lDQWdJQ0FnZEdocGN5NWZjbVZzWldGelpVVnVkR2wwZVNobGJuUnBkSGtzSUdsdVpHVjRLVHRjYmlBZ0lDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQWdJSFJvYVhNdVpXNTBhWFJwWlhOVWIxSmxiVzkyWlM1d2RYTm9LR1Z1ZEdsMGVTazdYRzRnSUNBZ0lDQjlYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2RHaHBjeTVsYm5ScGRIbFNaVzF2ZG1WQmJHeERiMjF3YjI1bGJuUnpLR1Z1ZEdsMGVTd2dhVzF0WldScFlYUmxiSGtwTzF4dUlDQjlYRzVjYmlBZ1gzSmxiR1ZoYzJWRmJuUnBkSGtvWlc1MGFYUjVMQ0JwYm1SbGVDa2dlMXh1SUNBZ0lIUm9hWE11WDJWdWRHbDBhV1Z6TG5Od2JHbGpaU2hwYm1SbGVDd2dNU2s3WEc1Y2JpQWdJQ0JwWmlBb2RHaHBjeTVmWlc1MGFYUnBaWE5DZVU1aGJXVnpXMlZ1ZEdsMGVTNXVZVzFsWFNrZ2UxeHVJQ0FnSUNBZ1pHVnNaWFJsSUhSb2FYTXVYMlZ1ZEdsMGFXVnpRbmxPWVcxbGMxdGxiblJwZEhrdWJtRnRaVjA3WEc0Z0lDQWdmVnh1SUNBZ0lHVnVkR2wwZVM1ZmNHOXZiQzV5Wld4bFlYTmxLR1Z1ZEdsMGVTazdYRzRnSUgxY2JseHVJQ0F2S2lwY2JpQWdJQ29nVW1WdGIzWmxJR0ZzYkNCbGJuUnBkR2xsY3lCbWNtOXRJSFJvYVhNZ2JXRnVZV2RsY2x4dUlDQWdLaTljYmlBZ2NtVnRiM1psUVd4c1JXNTBhWFJwWlhNb0tTQjdYRzRnSUNBZ1ptOXlJQ2gyWVhJZ2FTQTlJSFJvYVhNdVgyVnVkR2wwYVdWekxteGxibWQwYUNBdElERTdJR2tnUGowZ01Ec2dhUzB0S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbkpsYlc5MlpVVnVkR2wwZVNoMGFHbHpMbDlsYm5ScGRHbGxjMXRwWFNrN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ2NISnZZMlZ6YzBSbFptVnljbVZrVW1WdGIzWmhiQ2dwSUh0Y2JpQWdJQ0JwWmlBb0lYUm9hWE11WkdWbVpYSnlaV1JTWlcxdmRtRnNSVzVoWW14bFpDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z2RHaHBjeTVsYm5ScGRHbGxjMVJ2VW1WdGIzWmxMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNCc1pYUWdaVzUwYVhSNUlEMGdkR2hwY3k1bGJuUnBkR2xsYzFSdlVtVnRiM1psVzJsZE8xeHVJQ0FnSUNBZ2JHVjBJR2x1WkdWNElEMGdkR2hwY3k1ZlpXNTBhWFJwWlhNdWFXNWtaWGhQWmlobGJuUnBkSGtwTzF4dUlDQWdJQ0FnZEdocGN5NWZjbVZzWldGelpVVnVkR2wwZVNobGJuUnBkSGtzSUdsdVpHVjRLVHRjYmlBZ0lDQjlYRzRnSUNBZ2RHaHBjeTVsYm5ScGRHbGxjMVJ2VW1WdGIzWmxMbXhsYm1kMGFDQTlJREE3WEc1Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JwSUQwZ01Ec2dhU0E4SUhSb2FYTXVaVzUwYVhScFpYTlhhWFJvUTI5dGNHOXVaVzUwYzFSdlVtVnRiM1psTG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ0lDQnNaWFFnWlc1MGFYUjVJRDBnZEdocGN5NWxiblJwZEdsbGMxZHBkR2hEYjIxd2IyNWxiblJ6Vkc5U1pXMXZkbVZiYVYwN1hHNGdJQ0FnSUNCM2FHbHNaU0FvWlc1MGFYUjVMbDlEYjIxd2IyNWxiblJVZVhCbGMxUnZVbVZ0YjNabExteGxibWQwYUNBK0lEQXBJSHRjYmlBZ0lDQWdJQ0FnYkdWMElFTnZiWEJ2Ym1WdWRDQTlJR1Z1ZEdsMGVTNWZRMjl0Y0c5dVpXNTBWSGx3WlhOVWIxSmxiVzkyWlM1d2IzQW9LVHRjYmx4dUlDQWdJQ0FnSUNCMllYSWdZMjl0Y0c5dVpXNTBUbUZ0WlNBOUlHZGxkRTVoYldVb1EyOXRjRzl1Wlc1MEtUdGNiaUFnSUNBZ0lDQWdkbUZ5SUdOdmJYQnZibVZ1ZENBOUlHVnVkR2wwZVM1ZlkyOXRjRzl1Wlc1MGMxUnZVbVZ0YjNabFcyTnZiWEJ2Ym1WdWRFNWhiV1ZkTzF4dUlDQWdJQ0FnSUNCa1pXeGxkR1VnWlc1MGFYUjVMbDlqYjIxd2IyNWxiblJ6Vkc5U1pXMXZkbVZiWTI5dGNHOXVaVzUwVG1GdFpWMDdYRzRnSUNBZ0lDQWdJR052YlhCdmJtVnVkQzVrYVhOd2IzTmxLQ2s3WEc0Z0lDQWdJQ0FnSUhSb2FYTXVkMjl5YkdRdVkyOXRjRzl1Wlc1MGMwMWhibUZuWlhJdVkyOXRjRzl1Wlc1MFVtVnRiM1psWkVaeWIyMUZiblJwZEhrb1EyOXRjRzl1Wlc1MEtUdGNibHh1SUNBZ0lDQWdJQ0F2TDNSb2FYTXVYMlZ1ZEdsMGVWSmxiVzkyWlVOdmJYQnZibVZ1ZEZONWJtTW9aVzUwYVhSNUxDQkRiMjF3YjI1bGJuUXNJR2x1WkdWNEtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCMGFHbHpMbVZ1ZEdsMGFXVnpWMmwwYUVOdmJYQnZibVZ1ZEhOVWIxSmxiVzkyWlM1c1pXNW5kR2dnUFNBd08xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRWRsZENCaElIRjFaWEo1SUdKaGMyVmtJRzl1SUdFZ2JHbHpkQ0J2WmlCamIyMXdiMjVsYm5SelhHNGdJQ0FxSUVCd1lYSmhiU0I3UVhKeVlYa29RMjl0Y0c5dVpXNTBLWDBnUTI5dGNHOXVaVzUwY3lCTWFYTjBJRzltSUdOdmJYQnZibVZ1ZEhNZ2RHaGhkQ0IzYVd4c0lHWnZjbTBnZEdobElIRjFaWEo1WEc0Z0lDQXFMMXh1SUNCeGRXVnllVU52YlhCdmJtVnVkSE1vUTI5dGNHOXVaVzUwY3lrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOXhkV1Z5ZVUxaGJtRm5aWEl1WjJWMFVYVmxjbmtvUTI5dGNHOXVaVzUwY3lrN1hHNGdJSDFjYmx4dUlDQXZMeUJGV0ZSU1FWTmNibHh1SUNBdktpcGNiaUFnSUNvZ1VtVjBkWEp1SUc1MWJXSmxjaUJ2WmlCbGJuUnBkR2xsYzF4dUlDQWdLaTljYmlBZ1kyOTFiblFvS1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdVgyVnVkR2wwYVdWekxteGxibWQwYUR0Y2JpQWdmVnh1WEc0Z0lDOHFLbHh1SUNBZ0tpQlNaWFIxY200Z2MyOXRaU0J6ZEdGMGMxeHVJQ0FnS2k5Y2JpQWdjM1JoZEhNb0tTQjdYRzRnSUNBZ2RtRnlJSE4wWVhSeklEMGdlMXh1SUNBZ0lDQWdiblZ0Ulc1MGFYUnBaWE02SUhSb2FYTXVYMlZ1ZEdsMGFXVnpMbXhsYm1kMGFDeGNiaUFnSUNBZ0lHNTFiVkYxWlhKcFpYTTZJRTlpYW1WamRDNXJaWGx6S0hSb2FYTXVYM0YxWlhKNVRXRnVZV2RsY2k1ZmNYVmxjbWxsY3lrdWJHVnVaM1JvTEZ4dUlDQWdJQ0FnY1hWbGNtbGxjem9nZEdocGN5NWZjWFZsY25sTllXNWhaMlZ5TG5OMFlYUnpLQ2tzWEc0Z0lDQWdJQ0J1ZFcxRGIyMXdiMjVsYm5SUWIyOXNPaUJQWW1wbFkzUXVhMlY1Y3loMGFHbHpMbU52YlhCdmJtVnVkSE5OWVc1aFoyVnlMbDlqYjIxd2IyNWxiblJRYjI5c0tWeHVJQ0FnSUNBZ0lDQXViR1Z1WjNSb0xGeHVJQ0FnSUNBZ1kyOXRjRzl1Wlc1MFVHOXZiRG9nZTMwc1hHNGdJQ0FnSUNCbGRtVnVkRVJwYzNCaGRHTm9aWEk2SUhSb2FYTXVaWFpsYm5SRWFYTndZWFJqYUdWeUxuTjBZWFJ6WEc0Z0lDQWdmVHRjYmx4dUlDQWdJR1p2Y2lBb2RtRnlJR051WVcxbElHbHVJSFJvYVhNdVkyOXRjRzl1Wlc1MGMwMWhibUZuWlhJdVgyTnZiWEJ2Ym1WdWRGQnZiMndwSUh0Y2JpQWdJQ0FnSUhaaGNpQndiMjlzSUQwZ2RHaHBjeTVqYjIxd2IyNWxiblJ6VFdGdVlXZGxjaTVmWTI5dGNHOXVaVzUwVUc5dmJGdGpibUZ0WlYwN1hHNGdJQ0FnSUNCemRHRjBjeTVqYjIxd2IyNWxiblJRYjI5c1cyTnVZVzFsWFNBOUlIdGNiaUFnSUNBZ0lDQWdkWE5sWkRvZ2NHOXZiQzUwYjNSaGJGVnpaV1FvS1N4Y2JpQWdJQ0FnSUNBZ2MybDZaVG9nY0c5dmJDNWpiM1Z1ZEZ4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0J5WlhSMWNtNGdjM1JoZEhNN1hHNGdJSDFjYm4xY2JseHVZMjl1YzNRZ1JVNVVTVlJaWDBOU1JVRlVSVVFnUFNCY0lrVnVkR2wwZVUxaGJtRm5aWElqUlU1VVNWUlpYME5TUlVGVVJWd2lPMXh1WTI5dWMzUWdSVTVVU1ZSWlgxSkZUVTlXUlVRZ1BTQmNJa1Z1ZEdsMGVVMWhibUZuWlhJalJVNVVTVlJaWDFKRlRVOVdSVVJjSWp0Y2JtTnZibk4wSUVOUFRWQlBUa1ZPVkY5QlJFUkZSQ0E5SUZ3aVJXNTBhWFI1VFdGdVlXZGxjaU5EVDAxUVQwNUZUbFJmUVVSRVJVUmNJanRjYm1OdmJuTjBJRU5QVFZCUFRrVk9WRjlTUlUxUFZrVWdQU0JjSWtWdWRHbDBlVTFoYm1GblpYSWpRMDlOVUU5T1JVNVVYMUpGVFU5V1JWd2lPMXh1SWl3aWFXMXdiM0owSUhzZ1QySnFaV04wVUc5dmJDQjlJR1p5YjIwZ1hDSXVMMDlpYW1WamRGQnZiMnd1YW5OY0lqdGNibWx0Y0c5eWRDQjdJR052YlhCdmJtVnVkRkJ5YjNCbGNuUjVUbUZ0WlNCOUlHWnliMjBnWENJdUwxVjBhV3h6TG1welhDSTdYRzVjYm1WNGNHOXlkQ0JqYkdGemN5QkRiMjF3YjI1bGJuUk5ZVzVoWjJWeUlIdGNiaUFnWTI5dWMzUnlkV04wYjNJb0tTQjdYRzRnSUNBZ2RHaHBjeTVEYjIxd2IyNWxiblJ6SUQwZ2UzMDdYRzRnSUNBZ2RHaHBjeTVmWTI5dGNHOXVaVzUwVUc5dmJDQTlJSHQ5TzF4dUlDQWdJSFJvYVhNdWJuVnRRMjl0Y0c5dVpXNTBjeUE5SUh0OU8xeHVJQ0I5WEc1Y2JpQWdjbVZuYVhOMFpYSkRiMjF3YjI1bGJuUW9RMjl0Y0c5dVpXNTBMQ0J2WW1wbFkzUlFiMjlzS1NCN1hHNGdJQ0FnYVdZZ0tIUm9hWE11UTI5dGNHOXVaVzUwYzF0RGIyMXdiMjVsYm5RdWJtRnRaVjBwSUh0Y2JpQWdJQ0FnSUdOdmJuTnZiR1V1ZDJGeWJpaGdRMjl0Y0c5dVpXNTBJSFI1Y0dVNklDY2tlME52YlhCdmJtVnVkQzV1WVcxbGZTY2dZV3h5WldGa2VTQnlaV2RwYzNSbGNtVmtMbUFwTzF4dUlDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTnZibk4wSUhOamFHVnRZU0E5SUVOdmJYQnZibVZ1ZEM1elkyaGxiV0U3WEc1Y2JpQWdJQ0JwWmlBb0lYTmphR1Z0WVNrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0dCRGIyMXdiMjVsYm5RZ1hDSWtlME52YlhCdmJtVnVkQzV1WVcxbGZWd2lJR2hoY3lCdWJ5QnpZMmhsYldFZ2NISnZjR1Z5ZEhrdVlDazdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ1ptOXlJQ2hqYjI1emRDQndjbTl3VG1GdFpTQnBiaUJ6WTJobGJXRXBJSHRjYmlBZ0lDQWdJR052Ym5OMElIQnliM0FnUFNCelkyaGxiV0ZiY0hKdmNFNWhiV1ZkTzF4dVhHNGdJQ0FnSUNCcFppQW9JWEJ5YjNBdWRIbHdaU2tnZTF4dUlDQWdJQ0FnSUNCMGFISnZkeUJ1WlhjZ1JYSnliM0lvWEc0Z0lDQWdJQ0FnSUNBZ1lFbHVkbUZzYVdRZ2MyTm9aVzFoSUdadmNpQmpiMjF3YjI1bGJuUWdYQ0lrZTBOdmJYQnZibVZ1ZEM1dVlXMWxmVndpTGlCTmFYTnphVzVuSUhSNWNHVWdabTl5SUZ3aUpIdHdjbTl3VG1GdFpYMWNJaUJ3Y205d1pYSjBlUzVnWEc0Z0lDQWdJQ0FnSUNrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NURiMjF3YjI1bGJuUnpXME52YlhCdmJtVnVkQzV1WVcxbFhTQTlJRU52YlhCdmJtVnVkRHRjYmlBZ0lDQjBhR2x6TG01MWJVTnZiWEJ2Ym1WdWRITmJRMjl0Y0c5dVpXNTBMbTVoYldWZElEMGdNRHRjYmx4dUlDQWdJR2xtSUNodlltcGxZM1JRYjI5c0lEMDlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUc5aWFtVmpkRkJ2YjJ3Z1BTQnVaWGNnVDJKcVpXTjBVRzl2YkNoRGIyMXdiMjVsYm5RcE8xeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb2IySnFaV04wVUc5dmJDQTlQVDBnWm1Gc2MyVXBJSHRjYmlBZ0lDQWdJRzlpYW1WamRGQnZiMndnUFNCMWJtUmxabWx1WldRN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnZEdocGN5NWZZMjl0Y0c5dVpXNTBVRzl2YkZ0RGIyMXdiMjVsYm5RdWJtRnRaVjBnUFNCdlltcGxZM1JRYjI5c08xeHVJQ0I5WEc1Y2JpQWdZMjl0Y0c5dVpXNTBRV1JrWldSVWIwVnVkR2wwZVNoRGIyMXdiMjVsYm5RcElIdGNiaUFnSUNCcFppQW9JWFJvYVhNdVEyOXRjRzl1Wlc1MGMxdERiMjF3YjI1bGJuUXVibUZ0WlYwcElIdGNiaUFnSUNBZ0lIUm9hWE11Y21WbmFYTjBaWEpEYjIxd2IyNWxiblFvUTI5dGNHOXVaVzUwS1R0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0IwYUdsekxtNTFiVU52YlhCdmJtVnVkSE5iUTI5dGNHOXVaVzUwTG01aGJXVmRLeXM3WEc0Z0lIMWNibHh1SUNCamIyMXdiMjVsYm5SU1pXMXZkbVZrUm5KdmJVVnVkR2wwZVNoRGIyMXdiMjVsYm5RcElIdGNiaUFnSUNCMGFHbHpMbTUxYlVOdmJYQnZibVZ1ZEhOYlEyOXRjRzl1Wlc1MExtNWhiV1ZkTFMwN1hHNGdJSDFjYmx4dUlDQm5aWFJEYjIxd2IyNWxiblJ6VUc5dmJDaERiMjF3YjI1bGJuUXBJSHRjYmlBZ0lDQjJZWElnWTI5dGNHOXVaVzUwVG1GdFpTQTlJR052YlhCdmJtVnVkRkJ5YjNCbGNuUjVUbUZ0WlNoRGIyMXdiMjVsYm5RcE8xeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWpiMjF3YjI1bGJuUlFiMjlzVzJOdmJYQnZibVZ1ZEU1aGJXVmRPMXh1SUNCOVhHNTlYRzRpTENKcGJYQnZjblFnY0dwemIyNGdabkp2YlNCY0lpNHVMM0JoWTJ0aFoyVXVhbk52Ymx3aU8xeHVaWGh3YjNKMElHTnZibk4wSUZabGNuTnBiMjRnUFNCd2FuTnZiaTUyWlhKemFXOXVPMXh1SWl3aWFXMXdiM0owSUZGMVpYSjVJR1p5YjIwZ1hDSXVMMUYxWlhKNUxtcHpYQ0k3WEc1cGJYQnZjblFnZDNKaGNFbHRiWFYwWVdKc1pVTnZiWEJ2Ym1WdWRDQm1jbTl0SUZ3aUxpOVhjbUZ3U1cxdGRYUmhZbXhsUTI5dGNHOXVaVzUwTG1welhDSTdYRzVjYmk4dklFQjBiMlJ2SUZSaGEyVWdkR2hwY3lCdmRYUWdabkp2YlNCMGFHVnlaU0J2Y2lCMWMyVWdSVTVXWEc1amIyNXpkQ0JFUlVKVlJ5QTlJR1poYkhObE8xeHVYRzVsZUhCdmNuUWdZMnhoYzNNZ1JXNTBhWFI1SUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvWlc1MGFYUjVUV0Z1WVdkbGNpa2dlMXh1SUNBZ0lIUm9hWE11WDJWdWRHbDBlVTFoYm1GblpYSWdQU0JsYm5ScGRIbE5ZVzVoWjJWeUlIeDhJRzUxYkd3N1hHNWNiaUFnSUNBdkx5QlZibWx4ZFdVZ1NVUWdabTl5SUhSb2FYTWdaVzUwYVhSNVhHNGdJQ0FnZEdocGN5NXBaQ0E5SUdWdWRHbDBlVTFoYm1GblpYSXVYMjVsZUhSRmJuUnBkSGxKWkNzck8xeHVYRzRnSUNBZ0x5OGdUR2x6ZENCdlppQmpiMjF3YjI1bGJuUnpJSFI1Y0dWeklIUm9aU0JsYm5ScGRIa2dhR0Z6WEc0Z0lDQWdkR2hwY3k1ZlEyOXRjRzl1Wlc1MFZIbHdaWE1nUFNCYlhUdGNibHh1SUNBZ0lDOHZJRWx1YzNSaGJtTmxJRzltSUhSb1pTQmpiMjF3YjI1bGJuUnpYRzRnSUNBZ2RHaHBjeTVmWTI5dGNHOXVaVzUwY3lBOUlIdDlPMXh1WEc0Z0lDQWdkR2hwY3k1ZlkyOXRjRzl1Wlc1MGMxUnZVbVZ0YjNabElEMGdlMzA3WEc1Y2JpQWdJQ0F2THlCUmRXVnlhV1Z6SUhkb1pYSmxJSFJvWlNCbGJuUnBkSGtnYVhNZ1lXUmtaV1JjYmlBZ0lDQjBhR2x6TG5GMVpYSnBaWE1nUFNCYlhUdGNibHh1SUNBZ0lDOHZJRlZ6WldRZ1ptOXlJR1JsWm1WeWNtVmtJSEpsYlc5MllXeGNiaUFnSUNCMGFHbHpMbDlEYjIxd2IyNWxiblJVZVhCbGMxUnZVbVZ0YjNabElEMGdXMTA3WEc1Y2JpQWdJQ0IwYUdsekxtRnNhWFpsSUQwZ1ptRnNjMlU3WEc1Y2JpQWdJQ0F2TDJsbUlIUm9aWEpsSUdGeVpTQnpkR0YwWlNCamIyMXdiMjVsYm5SeklHOXVJR0VnWlc1MGFYUjVMQ0JwZENCallXNG5kQ0JpWlNCeVpXMXZkbVZrSUdOdmJYQnNaWFJsYkhsY2JpQWdJQ0IwYUdsekxtNTFiVk4wWVhSbFEyOXRjRzl1Wlc1MGN5QTlJREE3WEc0Z0lIMWNibHh1SUNBdkx5QkRUMDFRVDA1RlRsUlRYRzVjYmlBZ1oyVjBRMjl0Y0c5dVpXNTBLRU52YlhCdmJtVnVkQ3dnYVc1amJIVmtaVkpsYlc5MlpXUXBJSHRjYmlBZ0lDQjJZWElnWTI5dGNHOXVaVzUwSUQwZ2RHaHBjeTVmWTI5dGNHOXVaVzUwYzF0RGIyMXdiMjVsYm5RdWJtRnRaVjA3WEc1Y2JpQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDQW1KaUJwYm1Oc2RXUmxVbVZ0YjNabFpDQTlQVDBnZEhKMVpTa2dlMXh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBJRDBnZEdocGN5NWZZMjl0Y0c5dVpXNTBjMVJ2VW1WdGIzWmxXME52YlhCdmJtVnVkQzV1WVcxbFhUdGNiaUFnSUNCOVhHNWNiaUFnSUNCeVpYUjFjbTRnUkVWQ1ZVY2dQeUIzY21Gd1NXMXRkWFJoWW14bFEyOXRjRzl1Wlc1MEtFTnZiWEJ2Ym1WdWRDd2dZMjl0Y0c5dVpXNTBLU0E2SUdOdmJYQnZibVZ1ZER0Y2JpQWdmVnh1WEc0Z0lHZGxkRkpsYlc5MlpXUkRiMjF3YjI1bGJuUW9RMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE11WDJOdmJYQnZibVZ1ZEhOVWIxSmxiVzkyWlZ0RGIyMXdiMjVsYm5RdWJtRnRaVjA3WEc0Z0lIMWNibHh1SUNCblpYUkRiMjF3YjI1bGJuUnpLQ2tnZTF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TGw5amIyMXdiMjVsYm5Sek8xeHVJQ0I5WEc1Y2JpQWdaMlYwUTI5dGNHOXVaVzUwYzFSdlVtVnRiM1psS0NrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWpiMjF3YjI1bGJuUnpWRzlTWlcxdmRtVTdYRzRnSUgxY2JseHVJQ0JuWlhSRGIyMXdiMjVsYm5SVWVYQmxjeWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1ZlEyOXRjRzl1Wlc1MFZIbHdaWE03WEc0Z0lIMWNibHh1SUNCblpYUk5kWFJoWW14bFEyOXRjRzl1Wlc1MEtFTnZiWEJ2Ym1WdWRDa2dlMXh1SUNBZ0lIWmhjaUJqYjIxd2IyNWxiblFnUFNCMGFHbHpMbDlqYjIxd2IyNWxiblJ6VzBOdmJYQnZibVZ1ZEM1dVlXMWxYVHRjYmlBZ0lDQm1iM0lnS0haaGNpQnBJRDBnTURzZ2FTQThJSFJvYVhNdWNYVmxjbWxsY3k1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lDQWdkbUZ5SUhGMVpYSjVJRDBnZEdocGN5NXhkV1Z5YVdWelcybGRPMXh1SUNBZ0lDQWdMeThnUUhSdlpHOGdZV05qWld4bGNtRjBaU0IwYUdseklHTm9aV05yTGlCTllYbGlaU0JvWVhacGJtY2djWFZsY25rdVgwTnZiWEJ2Ym1WdWRITWdZWE1nWVc0Z2IySnFaV04wWEc0Z0lDQWdJQ0F2THlCQWRHOWtieUJoWkdRZ1RtOTBJR052YlhCdmJtVnVkSE5jYmlBZ0lDQWdJR2xtSUNoeGRXVnllUzV5WldGamRHbDJaU0FtSmlCeGRXVnllUzVEYjIxd2IyNWxiblJ6TG1sdVpHVjRUMllvUTI5dGNHOXVaVzUwS1NBaFBUMGdMVEVwSUh0Y2JpQWdJQ0FnSUNBZ2NYVmxjbmt1WlhabGJuUkVhWE53WVhSamFHVnlMbVJwYzNCaGRHTm9SWFpsYm5Rb1hHNGdJQ0FnSUNBZ0lDQWdVWFZsY25rdWNISnZkRzkwZVhCbExrTlBUVkJQVGtWT1ZGOURTRUZPUjBWRUxGeHVJQ0FnSUNBZ0lDQWdJSFJvYVhNc1hHNGdJQ0FnSUNBZ0lDQWdZMjl0Y0c5dVpXNTBYRzRnSUNBZ0lDQWdJQ2s3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCamIyMXdiMjVsYm5RN1hHNGdJSDFjYmx4dUlDQmhaR1JEYjIxd2IyNWxiblFvUTI5dGNHOXVaVzUwTENCMllXeDFaWE1wSUh0Y2JpQWdJQ0IwYUdsekxsOWxiblJwZEhsTllXNWhaMlZ5TG1WdWRHbDBlVUZrWkVOdmJYQnZibVZ1ZENoMGFHbHpMQ0JEYjIxd2IyNWxiblFzSUhaaGJIVmxjeWs3WEc0Z0lDQWdjbVYwZFhKdUlIUm9hWE03WEc0Z0lIMWNibHh1SUNCeVpXMXZkbVZEYjIxd2IyNWxiblFvUTI5dGNHOXVaVzUwTENCbWIzSmpaVWx0YldWa2FXRjBaU2tnZTF4dUlDQWdJSFJvYVhNdVgyVnVkR2wwZVUxaGJtRm5aWEl1Wlc1MGFYUjVVbVZ0YjNabFEyOXRjRzl1Wlc1MEtIUm9hWE1zSUVOdmJYQnZibVZ1ZEN3Z1ptOXlZMlZKYlcxbFpHbGhkR1VwTzF4dUlDQWdJSEpsZEhWeWJpQjBhR2x6TzF4dUlDQjlYRzVjYmlBZ2FHRnpRMjl0Y0c5dVpXNTBLRU52YlhCdmJtVnVkQ3dnYVc1amJIVmtaVkpsYlc5MlpXUXBJSHRjYmlBZ0lDQnlaWFIxY200Z0tGeHVJQ0FnSUNBZ0lTRitkR2hwY3k1ZlEyOXRjRzl1Wlc1MFZIbHdaWE11YVc1a1pYaFBaaWhEYjIxd2IyNWxiblFwSUh4OFhHNGdJQ0FnSUNBb2FXNWpiSFZrWlZKbGJXOTJaV1FnUFQwOUlIUnlkV1VnSmlZZ2RHaHBjeTVvWVhOU1pXMXZkbVZrUTI5dGNHOXVaVzUwS0VOdmJYQnZibVZ1ZENrcFhHNGdJQ0FnS1R0Y2JpQWdmVnh1WEc0Z0lHaGhjMUpsYlc5MlpXUkRiMjF3YjI1bGJuUW9RMjl0Y0c5dVpXNTBLU0I3WEc0Z0lDQWdjbVYwZFhKdUlDRWhmblJvYVhNdVgwTnZiWEJ2Ym1WdWRGUjVjR1Z6Vkc5U1pXMXZkbVV1YVc1a1pYaFBaaWhEYjIxd2IyNWxiblFwTzF4dUlDQjlYRzVjYmlBZ2FHRnpRV3hzUTI5dGNHOXVaVzUwY3loRGIyMXdiMjVsYm5SektTQjdYRzRnSUNBZ1ptOXlJQ2gyWVhJZ2FTQTlJREE3SUdrZ1BDQkRiMjF3YjI1bGJuUnpMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNCcFppQW9JWFJvYVhNdWFHRnpRMjl0Y0c5dVpXNTBLRU52YlhCdmJtVnVkSE5iYVYwcEtTQnlaWFIxY200Z1ptRnNjMlU3WEc0Z0lDQWdmVnh1SUNBZ0lISmxkSFZ5YmlCMGNuVmxPMXh1SUNCOVhHNWNiaUFnYUdGelFXNTVRMjl0Y0c5dVpXNTBjeWhEYjIxd2IyNWxiblJ6S1NCN1hHNGdJQ0FnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCRGIyMXdiMjVsYm5SekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdJQ0JwWmlBb2RHaHBjeTVvWVhORGIyMXdiMjVsYm5Rb1EyOXRjRzl1Wlc1MGMxdHBYU2twSUhKbGRIVnliaUIwY25WbE8xeHVJQ0FnSUgxY2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmx4dUlDQnlaVzF2ZG1WQmJHeERiMjF3YjI1bGJuUnpLR1p2Y21ObFNXMXRaV1JwWVhSbEtTQjdYRzRnSUNBZ2NtVjBkWEp1SUhSb2FYTXVYMlZ1ZEdsMGVVMWhibUZuWlhJdVpXNTBhWFI1VW1WdGIzWmxRV3hzUTI5dGNHOXVaVzUwY3loMGFHbHpMQ0JtYjNKalpVbHRiV1ZrYVdGMFpTazdYRzRnSUgxY2JseHVJQ0JqYjNCNUtITnlZeWtnZTF4dUlDQWdJQzh2SUZSUFJFODZJRlJvYVhNZ1kyRnVJR1JsWm1sdWFYUmxiSGtnWW1VZ2IzQjBhVzFwZW1Wa1hHNGdJQ0FnWm05eUlDaDJZWElnWTI5dGNHOXVaVzUwVG1GdFpTQnBiaUJ6Y21NdVgyTnZiWEJ2Ym1WdWRITXBJSHRjYmlBZ0lDQWdJSFpoY2lCemNtTkRiMjF3YjI1bGJuUWdQU0J6Y21NdVgyTnZiWEJ2Ym1WdWRITmJZMjl0Y0c5dVpXNTBUbUZ0WlYwN1hHNGdJQ0FnSUNCMGFHbHpMbUZrWkVOdmJYQnZibVZ1ZENoemNtTkRiMjF3YjI1bGJuUXVZMjl1YzNSeWRXTjBiM0lwTzF4dUlDQWdJQ0FnZG1GeUlHTnZiWEJ2Ym1WdWRDQTlJSFJvYVhNdVoyVjBRMjl0Y0c5dVpXNTBLSE55WTBOdmJYQnZibVZ1ZEM1amIyNXpkSEoxWTNSdmNpazdYRzRnSUNBZ0lDQmpiMjF3YjI1bGJuUXVZMjl3ZVNoemNtTkRiMjF3YjI1bGJuUXBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpPMXh1SUNCOVhHNWNiaUFnWTJ4dmJtVW9LU0I3WEc0Z0lDQWdjbVYwZFhKdUlHNWxkeUJGYm5ScGRIa29kR2hwY3k1ZlpXNTBhWFI1VFdGdVlXZGxjaWt1WTI5d2VTaDBhR2x6S1R0Y2JpQWdmVnh1WEc0Z0lISmxjMlYwS0NrZ2UxeHVJQ0FnSUhSb2FYTXVhV1FnUFNCMGFHbHpMbDlsYm5ScGRIbE5ZVzVoWjJWeUxsOXVaWGgwUlc1MGFYUjVTV1FyS3p0Y2JpQWdJQ0IwYUdsekxsOURiMjF3YjI1bGJuUlVlWEJsY3k1c1pXNW5kR2dnUFNBd08xeHVJQ0FnSUhSb2FYTXVjWFZsY21sbGN5NXNaVzVuZEdnZ1BTQXdPMXh1WEc0Z0lDQWdabTl5SUNoMllYSWdZMjl0Y0c5dVpXNTBUbUZ0WlNCcGJpQjBhR2x6TG1OdmJYQnZibVZ1ZEhNcElIdGNiaUFnSUNBZ0lHUmxiR1YwWlNCMGFHbHpMbDlqYjIxd2IyNWxiblJ6VzJOdmJYQnZibVZ1ZEU1aGJXVmRPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsYlc5MlpTaG1iM0pqWlVsdGJXVmthV0YwWlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxsOWxiblJwZEhsTllXNWhaMlZ5TG5KbGJXOTJaVVZ1ZEdsMGVTaDBhR2x6TENCbWIzSmpaVWx0YldWa2FXRjBaU2s3WEc0Z0lIMWNibjFjYmlJc0ltbHRjRzl5ZENCN0lGTjVjM1JsYlUxaGJtRm5aWElnZlNCbWNtOXRJRndpTGk5VGVYTjBaVzFOWVc1aFoyVnlMbXB6WENJN1hHNXBiWEJ2Y25RZ2V5QkZiblJwZEhsTllXNWhaMlZ5SUgwZ1puSnZiU0JjSWk0dlJXNTBhWFI1VFdGdVlXZGxjaTVxYzF3aU8xeHVhVzF3YjNKMElIc2dRMjl0Y0c5dVpXNTBUV0Z1WVdkbGNpQjlJR1p5YjIwZ1hDSXVMME52YlhCdmJtVnVkRTFoYm1GblpYSXVhbk5jSWp0Y2JtbHRjRzl5ZENCN0lGWmxjbk5wYjI0Z2ZTQm1jbTl0SUZ3aUxpOVdaWEp6YVc5dUxtcHpYQ0k3WEc1cGJYQnZjblFnZXlCb1lYTlhhVzVrYjNjc0lHNXZkeUI5SUdaeWIyMGdYQ0l1TDFWMGFXeHpMbXB6WENJN1hHNXBiWEJ2Y25RZ2V5QkZiblJwZEhrZ2ZTQm1jbTl0SUZ3aUxpOUZiblJwZEhrdWFuTmNJanRjYmx4dVkyOXVjM1FnUkVWR1FWVk1WRjlQVUZSSlQwNVRJRDBnZTF4dUlDQmxiblJwZEhsUWIyOXNVMmw2WlRvZ01DeGNiaUFnWlc1MGFYUjVRMnhoYzNNNklFVnVkR2wwZVZ4dWZUdGNibHh1Wlhod2IzSjBJR05zWVhOeklGZHZjbXhrSUh0Y2JpQWdZMjl1YzNSeWRXTjBiM0lvYjNCMGFXOXVjeUE5SUh0OUtTQjdYRzRnSUNBZ2RHaHBjeTV2Y0hScGIyNXpJRDBnVDJKcVpXTjBMbUZ6YzJsbmJpaDdmU3dnUkVWR1FWVk1WRjlQVUZSSlQwNVRMQ0J2Y0hScGIyNXpLVHRjYmx4dUlDQWdJSFJvYVhNdVkyOXRjRzl1Wlc1MGMwMWhibUZuWlhJZ1BTQnVaWGNnUTI5dGNHOXVaVzUwVFdGdVlXZGxjaWgwYUdsektUdGNiaUFnSUNCMGFHbHpMbVZ1ZEdsMGVVMWhibUZuWlhJZ1BTQnVaWGNnUlc1MGFYUjVUV0Z1WVdkbGNpaDBhR2x6S1R0Y2JpQWdJQ0IwYUdsekxuTjVjM1JsYlUxaGJtRm5aWElnUFNCdVpYY2dVM2x6ZEdWdFRXRnVZV2RsY2loMGFHbHpLVHRjYmx4dUlDQWdJSFJvYVhNdVpXNWhZbXhsWkNBOUlIUnlkV1U3WEc1Y2JpQWdJQ0IwYUdsekxtVjJaVzUwVVhWbGRXVnpJRDBnZTMwN1hHNWNiaUFnSUNCcFppQW9hR0Z6VjJsdVpHOTNJQ1ltSUhSNWNHVnZaaUJEZFhOMGIyMUZkbVZ1ZENBaFBUMGdYQ0oxYm1SbFptbHVaV1JjSWlrZ2UxeHVJQ0FnSUNBZ2RtRnlJR1YyWlc1MElEMGdibVYzSUVOMWMzUnZiVVYyWlc1MEtGd2laV056ZVMxM2IzSnNaQzFqY21WaGRHVmtYQ0lzSUh0Y2JpQWdJQ0FnSUNBZ1pHVjBZV2xzT2lCN0lIZHZjbXhrT2lCMGFHbHpMQ0IyWlhKemFXOXVPaUJXWlhKemFXOXVJSDFjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnZDJsdVpHOTNMbVJwYzNCaGRHTm9SWFpsYm5Rb1pYWmxiblFwTzF4dUlDQWdJSDFjYmx4dUlDQWdJSFJvYVhNdWJHRnpkRlJwYldVZ1BTQnViM2NvS1R0Y2JpQWdmVnh1WEc0Z0lISmxaMmx6ZEdWeVEyOXRjRzl1Wlc1MEtFTnZiWEJ2Ym1WdWRDd2diMkpxWldOMFVHOXZiQ2tnZTF4dUlDQWdJSFJvYVhNdVkyOXRjRzl1Wlc1MGMwMWhibUZuWlhJdWNtVm5hWE4wWlhKRGIyMXdiMjVsYm5Rb1EyOXRjRzl1Wlc1MExDQnZZbXBsWTNSUWIyOXNLVHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjenRjYmlBZ2ZWeHVYRzRnSUhKbFoybHpkR1Z5VTNsemRHVnRLRk41YzNSbGJTd2dZWFIwY21saWRYUmxjeWtnZTF4dUlDQWdJSFJvYVhNdWMzbHpkR1Z0VFdGdVlXZGxjaTV5WldkcGMzUmxjbE41YzNSbGJTaFRlWE4wWlcwc0lHRjBkSEpwWW5WMFpYTXBPMXh1SUNBZ0lISmxkSFZ5YmlCMGFHbHpPMXh1SUNCOVhHNWNiaUFnZFc1eVpXZHBjM1JsY2xONWMzUmxiU2hUZVhOMFpXMHBJSHRjYmlBZ0lDQjBhR2x6TG5ONWMzUmxiVTFoYm1GblpYSXVkVzV5WldkcGMzUmxjbE41YzNSbGJTaFRlWE4wWlcwcE8xeHVJQ0FnSUhKbGRIVnliaUIwYUdsek8xeHVJQ0I5WEc1Y2JpQWdaMlYwVTNsemRHVnRLRk41YzNSbGJVTnNZWE56S1NCN1hHNGdJQ0FnY21WMGRYSnVJSFJvYVhNdWMzbHpkR1Z0VFdGdVlXZGxjaTVuWlhSVGVYTjBaVzBvVTNsemRHVnRRMnhoYzNNcE8xeHVJQ0I5WEc1Y2JpQWdaMlYwVTNsemRHVnRjeWdwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdkR2hwY3k1emVYTjBaVzFOWVc1aFoyVnlMbWRsZEZONWMzUmxiWE1vS1R0Y2JpQWdmVnh1WEc0Z0lHVjRaV04xZEdVb1pHVnNkR0VzSUhScGJXVXBJSHRjYmlBZ0lDQnBaaUFvSVdSbGJIUmhLU0I3WEc0Z0lDQWdJQ0IwYVcxbElEMGdibTkzS0NrN1hHNGdJQ0FnSUNCa1pXeDBZU0E5SUhScGJXVWdMU0IwYUdsekxteGhjM1JVYVcxbE8xeHVJQ0FnSUNBZ2RHaHBjeTVzWVhOMFZHbHRaU0E5SUhScGJXVTdYRzRnSUNBZ2ZWeHVYRzRnSUNBZ2FXWWdLSFJvYVhNdVpXNWhZbXhsWkNrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTV6ZVhOMFpXMU5ZVzVoWjJWeUxtVjRaV04xZEdVb1pHVnNkR0VzSUhScGJXVXBPMXh1SUNBZ0lDQWdkR2hwY3k1bGJuUnBkSGxOWVc1aFoyVnlMbkJ5YjJObGMzTkVaV1psY25KbFpGSmxiVzkyWVd3b0tUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQnpkRzl3S0NrZ2UxeHVJQ0FnSUhSb2FYTXVaVzVoWW14bFpDQTlJR1poYkhObE8xeHVJQ0I5WEc1Y2JpQWdjR3hoZVNncElIdGNiaUFnSUNCMGFHbHpMbVZ1WVdKc1pXUWdQU0IwY25WbE8xeHVJQ0I5WEc1Y2JpQWdZM0psWVhSbFJXNTBhWFI1S0c1aGJXVXBJSHRjYmlBZ0lDQnlaWFIxY200Z2RHaHBjeTVsYm5ScGRIbE5ZVzVoWjJWeUxtTnlaV0YwWlVWdWRHbDBlU2h1WVcxbEtUdGNiaUFnZlZ4dVhHNGdJSE4wWVhSektDa2dlMXh1SUNBZ0lIWmhjaUJ6ZEdGMGN5QTlJSHRjYmlBZ0lDQWdJR1Z1ZEdsMGFXVnpPaUIwYUdsekxtVnVkR2wwZVUxaGJtRm5aWEl1YzNSaGRITW9LU3hjYmlBZ0lDQWdJSE41YzNSbGJUb2dkR2hwY3k1emVYTjBaVzFOWVc1aFoyVnlMbk4wWVhSektDbGNiaUFnSUNCOU8xeHVYRzRnSUNBZ1kyOXVjMjlzWlM1c2IyY29TbE5QVGk1emRISnBibWRwWm5rb2MzUmhkSE1zSUc1MWJHd3NJRElwS1R0Y2JpQWdmVnh1ZlZ4dUlpd2lhVzF3YjNKMElIc2dRMjl0Y0c5dVpXNTBJSDBnWm5KdmJTQmNJaTR2UTI5dGNHOXVaVzUwWENJN1hHNWNibVY0Y0c5eWRDQmpiR0Z6Y3lCVVlXZERiMjF3YjI1bGJuUWdaWGgwWlc1a2N5QkRiMjF3YjI1bGJuUWdlMXh1SUNCamIyNXpkSEoxWTNSdmNpZ3BJSHRjYmlBZ0lDQnpkWEJsY2lobVlXeHpaU2s3WEc0Z0lIMWNibjFjYmx4dVZHRm5RMjl0Y0c5dVpXNTBMbWx6VkdGblEyOXRjRzl1Wlc1MElEMGdkSEoxWlR0Y2JpSXNJbVY0Y0c5eWRDQmpiMjV6ZENCamIzQjVWbUZzZFdVZ1BTQW9jM0pqTENCa1pYTjBMQ0JyWlhrcElEMCtJQ2hrWlhOMFcydGxlVjBnUFNCemNtTmJhMlY1WFNrN1hHNWNibVY0Y0c5eWRDQmpiMjV6ZENCamJHOXVaVlpoYkhWbElEMGdjM0pqSUQwK0lITnlZenRjYmx4dVpYaHdiM0owSUdOdmJuTjBJR052Y0hsQmNuSmhlU0E5SUNoemNtTXNJR1JsYzNRc0lHdGxlU2tnUFQ0Z2UxeHVJQ0JqYjI1emRDQnpjbU5CY25KaGVTQTlJSE55WTF0clpYbGRPMXh1SUNCamIyNXpkQ0JrWlhOMFFYSnlZWGtnUFNCa1pYTjBXMnRsZVYwN1hHNWNiaUFnWkdWemRFRnljbUY1TG14bGJtZDBhQ0E5SURBN1hHNWNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCemNtTkJjbkpoZVM1c1pXNW5kR2c3SUdrckt5a2dlMXh1SUNBZ0lHUmxjM1JCY25KaGVTNXdkWE5vS0hOeVkwRnljbUY1VzJsZEtUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQmtaWE4wUVhKeVlYazdYRzU5TzF4dVhHNWxlSEJ2Y25RZ1kyOXVjM1FnWTJ4dmJtVkJjbkpoZVNBOUlITnlZeUE5UGlCemNtTXVjMnhwWTJVb0tUdGNibHh1Wlhod2IzSjBJR052Ym5OMElHTnZjSGxLVTA5T0lEMGdLSE55WXl3Z1pHVnpkQ3dnYTJWNUtTQTlQbHh1SUNBb1pHVnpkRnRyWlhsZElEMGdTbE5QVGk1d1lYSnpaU2hLVTA5T0xuTjBjbWx1WjJsbWVTaHpjbU5iYTJWNVhTa3BLVHRjYmx4dVpYaHdiM0owSUdOdmJuTjBJR05zYjI1bFNsTlBUaUE5SUhOeVl5QTlQaUJLVTA5T0xuQmhjbk5sS0VwVFQwNHVjM1J5YVc1bmFXWjVLSE55WXlrcE8xeHVYRzVsZUhCdmNuUWdZMjl1YzNRZ1kyOXdlVU52Y0hsaFlteGxJRDBnS0hOeVl5d2daR1Z6ZEN3Z2EyVjVLU0E5UGlCa1pYTjBXMnRsZVYwdVkyOXdlU2h6Y21OYmEyVjVYU2s3WEc1Y2JtVjRjRzl5ZENCamIyNXpkQ0JqYkc5dVpVTnNiMjVoWW14bElEMGdjM0pqSUQwK0lITnlZeTVqYkc5dVpTZ3BPMXh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWTNKbFlYUmxWSGx3WlNoMGVYQmxSR1ZtYVc1cGRHbHZiaWtnZTF4dUlDQjJZWElnYldGdVpHRjBiM0o1VUhKdmNHVnlkR2xsY3lBOUlGdGNJbTVoYldWY0lpd2dYQ0prWldaaGRXeDBYQ0lzSUZ3aVkyOXdlVndpTENCY0ltTnNiMjVsWENKZE8xeHVYRzRnSUhaaGNpQjFibVJsWm1sdVpXUlFjbTl3WlhKMGFXVnpJRDBnYldGdVpHRjBiM0o1VUhKdmNHVnlkR2xsY3k1bWFXeDBaWElvY0NBOVBpQjdYRzRnSUNBZ2NtVjBkWEp1SUNGMGVYQmxSR1ZtYVc1cGRHbHZiaTVvWVhOUGQyNVFjbTl3WlhKMGVTaHdLVHRjYmlBZ2ZTazdYRzVjYmlBZ2FXWWdLSFZ1WkdWbWFXNWxaRkJ5YjNCbGNuUnBaWE11YkdWdVozUm9JRDRnTUNrZ2UxeHVJQ0FnSUhSb2NtOTNJRzVsZHlCRmNuSnZjaWhjYmlBZ0lDQWdJR0JqY21WaGRHVlVlWEJsSUdWNGNHVmpkSE1nWVNCMGVYQmxJR1JsWm1sdWFYUnBiMjRnZDJsMGFDQjBhR1VnWm05c2JHOTNhVzVuSUhCeWIzQmxjblJwWlhNNklDUjdkVzVrWldacGJtVmtVSEp2Y0dWeWRHbGxjeTVxYjJsdUtGeHVJQ0FnSUNBZ0lDQmNJaXdnWENKY2JpQWdJQ0FnSUNsOVlGeHVJQ0FnSUNrN1hHNGdJSDFjYmx4dUlDQjBlWEJsUkdWbWFXNXBkR2x2Ymk1cGMxUjVjR1VnUFNCMGNuVmxPMXh1WEc0Z0lISmxkSFZ5YmlCMGVYQmxSR1ZtYVc1cGRHbHZianRjYm4xY2JseHVMeW9xWEc0Z0tpQlRkR0Z1WkdGeVpDQjBlWEJsYzF4dUlDb3ZYRzVsZUhCdmNuUWdZMjl1YzNRZ1ZIbHdaWE1nUFNCN1hHNGdJRTUxYldKbGNqb2dZM0psWVhSbFZIbHdaU2g3WEc0Z0lDQWdibUZ0WlRvZ1hDSk9kVzFpWlhKY0lpeGNiaUFnSUNCa1pXWmhkV3gwT2lBd0xGeHVJQ0FnSUdOdmNIazZJR052Y0hsV1lXeDFaU3hjYmlBZ0lDQmpiRzl1WlRvZ1kyeHZibVZXWVd4MVpWeHVJQ0I5S1N4Y2JseHVJQ0JDYjI5c1pXRnVPaUJqY21WaGRHVlVlWEJsS0h0Y2JpQWdJQ0J1WVcxbE9pQmNJa0p2YjJ4bFlXNWNJaXhjYmlBZ0lDQmtaV1poZFd4ME9pQm1ZV3h6WlN4Y2JpQWdJQ0JqYjNCNU9pQmpiM0I1Vm1Gc2RXVXNYRzRnSUNBZ1kyeHZibVU2SUdOc2IyNWxWbUZzZFdWY2JpQWdmU2tzWEc1Y2JpQWdVM1J5YVc1bk9pQmpjbVZoZEdWVWVYQmxLSHRjYmlBZ0lDQnVZVzFsT2lCY0lsTjBjbWx1WjF3aUxGeHVJQ0FnSUdSbFptRjFiSFE2SUZ3aVhDSXNYRzRnSUNBZ1kyOXdlVG9nWTI5d2VWWmhiSFZsTEZ4dUlDQWdJR05zYjI1bE9pQmpiRzl1WlZaaGJIVmxYRzRnSUgwcExGeHVYRzRnSUVGeWNtRjVPaUJqY21WaGRHVlVlWEJsS0h0Y2JpQWdJQ0J1WVcxbE9pQmNJa0Z5Y21GNVhDSXNYRzRnSUNBZ1pHVm1ZWFZzZERvZ1cxMHNYRzRnSUNBZ1kyOXdlVG9nWTI5d2VVRnljbUY1TEZ4dUlDQWdJR05zYjI1bE9pQmpiRzl1WlVGeWNtRjVYRzRnSUgwcExGeHVYRzRnSUU5aWFtVmpkRG9nWTNKbFlYUmxWSGx3WlNoN1hHNGdJQ0FnYm1GdFpUb2dYQ0pQWW1wbFkzUmNJaXhjYmlBZ0lDQmtaV1poZFd4ME9pQjFibVJsWm1sdVpXUXNYRzRnSUNBZ1kyOXdlVG9nWTI5d2VWWmhiSFZsTEZ4dUlDQWdJR05zYjI1bE9pQmpiRzl1WlZaaGJIVmxYRzRnSUgwcExGeHVYRzRnSUVwVFQwNDZJR055WldGMFpWUjVjR1VvZTF4dUlDQWdJRzVoYldVNklGd2lTbE5QVGx3aUxGeHVJQ0FnSUdSbFptRjFiSFE2SUc1MWJHd3NYRzRnSUNBZ1kyOXdlVG9nWTI5d2VVcFRUMDRzWEc0Z0lDQWdZMnh2Ym1VNklHTnNiMjVsU2xOUFRseHVJQ0I5S1Z4dWZUdGNiaUlzSW1WNGNHOXlkQ0JtZFc1amRHbHZiaUJuWlc1bGNtRjBaVWxrS0d4bGJtZDBhQ2tnZTF4dUlDQjJZWElnY21WemRXeDBJRDBnWENKY0lqdGNiaUFnZG1GeUlHTm9ZWEpoWTNSbGNuTWdQU0JjSWtGQ1EwUkZSa2RJU1VwTFRFMU9UMUJSVWxOVVZWWlhXRmxhTURFeU16UTFOamM0T1Z3aU8xeHVJQ0IyWVhJZ1kyaGhjbUZqZEdWeWMweGxibWQwYUNBOUlHTm9ZWEpoWTNSbGNuTXViR1Z1WjNSb08xeHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Ec2dhU0E4SUd4bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ2NtVnpkV3gwSUNzOUlHTm9ZWEpoWTNSbGNuTXVZMmhoY2tGMEtFMWhkR2d1Wm14dmIzSW9UV0YwYUM1eVlXNWtiMjBvS1NBcUlHTm9ZWEpoWTNSbGNuTk1aVzVuZEdncEtUdGNiaUFnZlZ4dUlDQnlaWFIxY200Z2NtVnpkV3gwTzF4dWZWeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdhVzVxWldOMFUyTnlhWEIwS0hOeVl5d2diMjVNYjJGa0tTQjdYRzRnSUhaaGNpQnpZM0pwY0hRZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Z3aWMyTnlhWEIwWENJcE8xeHVJQ0F2THlCQWRHOWtieUJWYzJVZ2JHbHVheUIwYnlCMGFHVWdaV056ZVMxa1pYWjBiMjlzY3lCeVpYQnZQMXh1SUNCelkzSnBjSFF1YzNKaklEMGdjM0pqTzF4dUlDQnpZM0pwY0hRdWIyNXNiMkZrSUQwZ2IyNU1iMkZrTzF4dUlDQW9aRzlqZFcxbGJuUXVhR1ZoWkNCOGZDQmtiMk4xYldWdWRDNWtiMk4xYldWdWRFVnNaVzFsYm5RcExtRndjR1Z1WkVOb2FXeGtLSE5qY21sd2RDazdYRzU5WEc0aUxDSXZLaUJuYkc5aVlXd2dVR1ZsY2lBcUwxeHVhVzF3YjNKMElIc2dhVzVxWldOMFUyTnlhWEIwTENCblpXNWxjbUYwWlVsa0lIMGdabkp2YlNCY0lpNHZkWFJwYkhNdWFuTmNJanRjYm1sdGNHOXlkQ0I3SUdoaGMxZHBibVJ2ZHlCOUlHWnliMjBnWENJdUxpOVZkR2xzY3k1cWMxd2lPMXh1WEc1bWRXNWpkR2x2YmlCb2IyOXJRMjl1YzI5c1pVRnVaRVZ5Y205eWN5aGpiMjV1WldOMGFXOXVLU0I3WEc0Z0lIWmhjaUIzY21Gd1JuVnVZM1JwYjI1eklEMGdXMXdpWlhKeWIzSmNJaXdnWENKM1lYSnVhVzVuWENJc0lGd2liRzluWENKZE8xeHVJQ0IzY21Gd1JuVnVZM1JwYjI1ekxtWnZja1ZoWTJnb2EyVjVJRDArSUh0Y2JpQWdJQ0JwWmlBb2RIbHdaVzltSUdOdmJuTnZiR1ZiYTJWNVhTQTlQVDBnWENKbWRXNWpkR2x2Ymx3aUtTQjdYRzRnSUNBZ0lDQjJZWElnWm00Z1BTQmpiMjV6YjJ4bFcydGxlVjB1WW1sdVpDaGpiMjV6YjJ4bEtUdGNiaUFnSUNBZ0lHTnZibk52YkdWYmEyVjVYU0E5SUNndUxpNWhjbWR6S1NBOVBpQjdYRzRnSUNBZ0lDQWdJR052Ym01bFkzUnBiMjR1YzJWdVpDaDdYRzRnSUNBZ0lDQWdJQ0FnYldWMGFHOWtPaUJjSW1OdmJuTnZiR1ZjSWl4Y2JpQWdJQ0FnSUNBZ0lDQjBlWEJsT2lCclpYa3NYRzRnSUNBZ0lDQWdJQ0FnWVhKbmN6b2dTbE5QVGk1emRISnBibWRwWm5rb1lYSm5jeWxjYmlBZ0lDQWdJQ0FnZlNrN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCbWJpNWhjSEJzZVNodWRXeHNMQ0JoY21kektUdGNiaUFnSUNBZ0lIMDdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JseHVJQ0IzYVc1a2IzY3VZV1JrUlhabGJuUk1hWE4wWlc1bGNpaGNJbVZ5Y205eVhDSXNJR1Z5Y205eUlEMCtJSHRjYmlBZ0lDQmpiMjV1WldOMGFXOXVMbk5sYm1Rb2UxeHVJQ0FnSUNBZ2JXVjBhRzlrT2lCY0ltVnljbTl5WENJc1hHNGdJQ0FnSUNCbGNuSnZjam9nU2xOUFRpNXpkSEpwYm1kcFpua29lMXh1SUNBZ0lDQWdJQ0J0WlhOellXZGxPaUJsY25KdmNpNWxjbkp2Y2k1dFpYTnpZV2RsTEZ4dUlDQWdJQ0FnSUNCemRHRmphem9nWlhKeWIzSXVaWEp5YjNJdWMzUmhZMnRjYmlBZ0lDQWdJSDBwWEc0Z0lDQWdmU2s3WEc0Z0lIMHBPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnBibU5zZFdSbFVtVnRiM1JsU1dSSVZFMU1LSEpsYlc5MFpVbGtLU0I3WEc0Z0lHeGxkQ0JwYm1adlJHbDJJRDBnWkc5amRXMWxiblF1WTNKbFlYUmxSV3hsYldWdWRDaGNJbVJwZGx3aUtUdGNiaUFnYVc1bWIwUnBkaTV6ZEhsc1pTNWpjM05VWlhoMElEMGdZRnh1SUNBZ0lHRnNhV2R1TFdsMFpXMXpPaUJqWlc1MFpYSTdYRzRnSUNBZ1ltRmphMmR5YjNWdVpDMWpiMnh2Y2pvZ0l6TXpNenRjYmlBZ0lDQmpiMnh2Y2pvZ0kyRmhZVHRjYmlBZ0lDQmthWE53YkdGNU9tWnNaWGc3WEc0Z0lDQWdabTl1ZEMxbVlXMXBiSGs2SUVGeWFXRnNPMXh1SUNBZ0lHWnZiblF0YzJsNlpUb2dNUzR4WlcwN1hHNGdJQ0FnYUdWcFoyaDBPaUEwTUhCNE8xeHVJQ0FnSUdwMWMzUnBabmt0WTI5dWRHVnVkRG9nWTJWdWRHVnlPMXh1SUNBZ0lHeGxablE2SURBN1hHNGdJQ0FnYjNCaFkybDBlVG9nTUM0NU8xeHVJQ0FnSUhCdmMybDBhVzl1T2lCaFluTnZiSFYwWlR0Y2JpQWdJQ0J5YVdkb2REb2dNRHRjYmlBZ0lDQjBaWGgwTFdGc2FXZHVPaUJqWlc1MFpYSTdYRzRnSUNBZ2RHOXdPaUF3TzF4dUlDQmdPMXh1WEc0Z0lHbHVabTlFYVhZdWFXNXVaWEpJVkUxTUlEMGdZRTl3Wlc0Z1JVTlRXU0JrWlhaMGIyOXNjeUIwYnlCamIyNXVaV04wSUhSdklIUm9hWE1nY0dGblpTQjFjMmx1WnlCMGFHVWdZMjlrWlRvbWJtSnpjRHM4WWlCemRIbHNaVDFjSW1OdmJHOXlPaUFqWm1abVhDSStKSHR5WlcxdmRHVkpaSDA4TDJJK0ptNWljM0E3UEdKMWRIUnZiaUJ2YmtOc2FXTnJQVndpWjJWdVpYSmhkR1ZPWlhkRGIyUmxLQ2xjSWo1SFpXNWxjbUYwWlNCdVpYY2dZMjlrWlR3dlluVjBkRzl1UG1BN1hHNGdJR1J2WTNWdFpXNTBMbUp2WkhrdVlYQndaVzVrUTJocGJHUW9hVzVtYjBScGRpazdYRzVjYmlBZ2NtVjBkWEp1SUdsdVptOUVhWFk3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmxibUZpYkdWU1pXMXZkR1ZFWlhaMGIyOXNjeWh5WlcxdmRHVkpaQ2tnZTF4dUlDQnBaaUFvSVdoaGMxZHBibVJ2ZHlrZ2UxeHVJQ0FnSUdOdmJuTnZiR1V1ZDJGeWJpaGNJbEpsYlc5MFpTQmtaWFowYjI5c2N5QnViM1FnWVhaaGFXeGhZbXhsSUc5MWRITnBaR1VnZEdobElHSnliM2R6WlhKY0lpazdYRzRnSUNBZ2NtVjBkWEp1TzF4dUlDQjlYRzVjYmlBZ2QybHVaRzkzTG1kbGJtVnlZWFJsVG1WM1EyOWtaU0E5SUNncElEMCtJSHRjYmlBZ0lDQjNhVzVrYjNjdWJHOWpZV3hUZEc5eVlXZGxMbU5zWldGeUtDazdYRzRnSUNBZ2NtVnRiM1JsU1dRZ1BTQm5aVzVsY21GMFpVbGtLRFlwTzF4dUlDQWdJSGRwYm1SdmR5NXNiMk5oYkZOMGIzSmhaMlV1YzJWMFNYUmxiU2hjSW1WamMzbFNaVzF2ZEdWSlpGd2lMQ0J5WlcxdmRHVkpaQ2s3WEc0Z0lDQWdkMmx1Wkc5M0xteHZZMkYwYVc5dUxuSmxiRzloWkNobVlXeHpaU2s3WEc0Z0lIMDdYRzVjYmlBZ2NtVnRiM1JsU1dRZ1BTQnlaVzF2ZEdWSlpDQjhmQ0IzYVc1a2IzY3ViRzlqWVd4VGRHOXlZV2RsTG1kbGRFbDBaVzBvWENKbFkzTjVVbVZ0YjNSbFNXUmNJaWs3WEc0Z0lHbG1JQ2doY21WdGIzUmxTV1FwSUh0Y2JpQWdJQ0J5WlcxdmRHVkpaQ0E5SUdkbGJtVnlZWFJsU1dRb05pazdYRzRnSUNBZ2QybHVaRzkzTG14dlkyRnNVM1J2Y21GblpTNXpaWFJKZEdWdEtGd2laV056ZVZKbGJXOTBaVWxrWENJc0lISmxiVzkwWlVsa0tUdGNiaUFnZlZ4dVhHNGdJR3hsZENCcGJtWnZSR2wySUQwZ2FXNWpiSFZrWlZKbGJXOTBaVWxrU0ZSTlRDaHlaVzF2ZEdWSlpDazdYRzVjYmlBZ2QybHVaRzkzTGw5ZlJVTlRXVjlTUlUxUFZFVmZSRVZXVkU5UFRGTmZTVTVLUlVOVVJVUWdQU0IwY25WbE8xeHVJQ0IzYVc1a2IzY3VYMTlGUTFOWlgxSkZUVTlVUlY5RVJWWlVUMDlNVXlBOUlIdDlPMXh1WEc0Z0lHeGxkQ0JXWlhKemFXOXVJRDBnWENKY0lqdGNibHh1SUNBdkx5QlVhR2x6SUdseklIVnpaV1FnZEc4Z1kyOXNiR1ZqZENCMGFHVWdkMjl5YkdSeklHTnlaV0YwWldRZ1ltVm1iM0psSUhSb1pTQmpiMjF0ZFc1cFkyRjBhVzl1SUdseklHSmxhVzVuSUdWemRHRmliR2x6YUdWa1hHNGdJR3hsZENCM2IzSnNaSE5DWldadmNtVk1iMkZrYVc1bklEMGdXMTA3WEc0Z0lHeGxkQ0J2YmxkdmNteGtRM0psWVhSbFpDQTlJR1VnUFQ0Z2UxeHVJQ0FnSUhaaGNpQjNiM0pzWkNBOUlHVXVaR1YwWVdsc0xuZHZjbXhrTzF4dUlDQWdJRlpsY25OcGIyNGdQU0JsTG1SbGRHRnBiQzUyWlhKemFXOXVPMXh1SUNBZ0lIZHZjbXhrYzBKbFptOXlaVXh2WVdScGJtY3VjSFZ6YUNoM2IzSnNaQ2s3WEc0Z0lIMDdYRzRnSUhkcGJtUnZkeTVoWkdSRmRtVnVkRXhwYzNSbGJtVnlLRndpWldOemVTMTNiM0pzWkMxamNtVmhkR1ZrWENJc0lHOXVWMjl5YkdSRGNtVmhkR1ZrS1R0Y2JseHVJQ0JzWlhRZ2IyNU1iMkZrWldRZ1BTQW9LU0E5UGlCN1hHNGdJQ0FnZG1GeUlIQmxaWElnUFNCdVpYY2dVR1ZsY2loeVpXMXZkR1ZKWkNrN1hHNGdJQ0FnY0dWbGNpNXZiaWhjSW05d1pXNWNJaXdnS0M4cUlHbGtJQ292S1NBOVBpQjdYRzRnSUNBZ0lDQndaV1Z5TG05dUtGd2lZMjl1Ym1WamRHbHZibHdpTENCamIyNXVaV04wYVc5dUlEMCtJSHRjYmlBZ0lDQWdJQ0FnZDJsdVpHOTNMbDlmUlVOVFdWOVNSVTFQVkVWZlJFVldWRTlQVEZNdVkyOXVibVZqZEdsdmJpQTlJR052Ym01bFkzUnBiMjQ3WEc0Z0lDQWdJQ0FnSUdOdmJtNWxZM1JwYjI0dWIyNG9YQ0p2Y0dWdVhDSXNJR1oxYm1OMGFXOXVLQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJR2x1Wm05RWFYWXVjM1I1YkdVdWRtbHphV0pwYkdsMGVTQTlJRndpYUdsa1pHVnVYQ0k3WEc0Z0lDQWdJQ0FnSUNBZ2FXNW1iMFJwZGk1cGJtNWxja2hVVFV3Z1BTQmNJa052Ym01bFkzUmxaRndpTzF4dVhHNGdJQ0FnSUNBZ0lDQWdMeThnVW1WalpXbDJaU0J0WlhOellXZGxjMXh1SUNBZ0lDQWdJQ0FnSUdOdmJtNWxZM1JwYjI0dWIyNG9YQ0prWVhSaFhDSXNJR1oxYm1OMGFXOXVLR1JoZEdFcElIdGNiaUFnSUNBZ0lDQWdJQ0FnSUdsbUlDaGtZWFJoTG5SNWNHVWdQVDA5SUZ3aWFXNXBkRndpS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhaaGNpQnpZM0pwY0hRZ1BTQmtiMk4xYldWdWRDNWpjbVZoZEdWRmJHVnRaVzUwS0Z3aWMyTnlhWEIwWENJcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCelkzSnBjSFF1YzJWMFFYUjBjbWxpZFhSbEtGd2lkSGx3WlZ3aUxDQmNJblJsZUhRdmFtRjJZWE5qY21sd2RGd2lLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdjMk55YVhCMExtOXViRzloWkNBOUlDZ3BJRDArSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCelkzSnBjSFF1Y0dGeVpXNTBUbTlrWlM1eVpXMXZkbVZEYUdsc1pDaHpZM0pwY0hRcE8xeHVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdMeThnVDI1alpTQjBhR1VnYzJOeWFYQjBJR2x6SUdsdWFtVmpkR1ZrSUhkbElHUnZiaWQwSUc1bFpXUWdkRzhnYkdsemRHVnVYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkMmx1Wkc5M0xuSmxiVzkyWlVWMlpXNTBUR2x6ZEdWdVpYSW9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JjSW1WamMza3RkMjl5YkdRdFkzSmxZWFJsWkZ3aUxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdiMjVYYjNKc1pFTnlaV0YwWldSY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIZHZjbXhrYzBKbFptOXlaVXh2WVdScGJtY3VabTl5UldGamFDaDNiM0pzWkNBOVBpQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWVhJZ1pYWmxiblFnUFNCdVpYY2dRM1Z6ZEc5dFJYWmxiblFvWENKbFkzTjVMWGR2Y214a0xXTnlaV0YwWldSY0lpd2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCa1pYUmhhV3c2SUhzZ2QyOXliR1E2SUhkdmNteGtMQ0IyWlhKemFXOXVPaUJXWlhKemFXOXVJSDFjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUgwcE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkMmx1Wkc5M0xtUnBjM0JoZEdOb1JYWmxiblFvWlhabGJuUXBPMXh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0I5TzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0J6WTNKcGNIUXVhVzV1WlhKSVZFMU1JRDBnWkdGMFlTNXpZM0pwY0hRN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNoa2IyTjFiV1Z1ZEM1b1pXRmtJSHg4SUdSdlkzVnRaVzUwTG1SdlkzVnRaVzUwUld4bGJXVnVkQ2t1WVhCd1pXNWtRMmhwYkdRb2MyTnlhWEIwS1R0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnYzJOeWFYQjBMbTl1Ykc5aFpDZ3BPMXh1WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR2h2YjJ0RGIyNXpiMnhsUVc1a1JYSnliM0p6S0dOdmJtNWxZM1JwYjI0cE8xeHVJQ0FnSUNBZ0lDQWdJQ0FnZlNCbGJITmxJR2xtSUNoa1lYUmhMblI1Y0dVZ1BUMDlJRndpWlhobFkzVjBaVk5qY21sd2RGd2lLU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJR3hsZENCMllXeDFaU0E5SUdWMllXd29aR0YwWVM1elkzSnBjSFFwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JwWmlBb1pHRjBZUzV5WlhSMWNtNUZkbUZzS1NCN1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1kyOXVibVZqZEdsdmJpNXpaVzVrS0h0Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHMWxkR2h2WkRvZ1hDSmxkbUZzVW1WMGRYSnVYQ0lzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMllXeDFaVG9nZG1Gc2RXVmNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjlLVHRjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDBwTzF4dUlDQWdJQ0FnSUNCOUtUdGNiaUFnSUNBZ0lIMHBPMXh1SUNBZ0lIMHBPMXh1SUNCOU8xeHVYRzRnSUM4dklFbHVhbVZqZENCUVpXVnlTbE1nYzJOeWFYQjBYRzRnSUdsdWFtVmpkRk5qY21sd2RDaGNiaUFnSUNCY0ltaDBkSEJ6T2k4dlkyUnVMbXB6WkdWc2FYWnlMbTVsZEM5dWNHMHZjR1ZsY21welFEQXVNeTR5TUM5a2FYTjBMM0JsWlhJdWJXbHVMbXB6WENJc1hHNGdJQ0FnYjI1TWIyRmtaV1JjYmlBZ0tUdGNibjFjYmx4dWFXWWdLR2hoYzFkcGJtUnZkeWtnZTF4dUlDQmpiMjV6ZENCMWNteFFZWEpoYlhNZ1BTQnVaWGNnVlZKTVUyVmhjbU5vVUdGeVlXMXpLSGRwYm1SdmR5NXNiMk5oZEdsdmJpNXpaV0Z5WTJncE8xeHVYRzRnSUM4dklFQjBiMlJ2SUZCeWIzWnBaR1VnWVNCM1lYa2dkRzhnWkdsellXSnNaU0JwZENCcFppQnVaV1ZrWldSY2JpQWdhV1lnS0hWeWJGQmhjbUZ0Y3k1b1lYTW9YQ0psYm1GaWJHVXRjbVZ0YjNSbExXUmxkblJ2YjJ4elhDSXBLU0I3WEc0Z0lDQWdaVzVoWW14bFVtVnRiM1JsUkdWMmRHOXZiSE1vS1R0Y2JpQWdmVnh1ZlZ4dUlsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lKQlFVRkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFR5eFRRVUZUTEU5QlFVOHNRMEZCUXl4VFFVRlRMRVZCUVVVN1FVRkRia01zUlVGQlJTeFBRVUZQTEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNN1FVRkRlRUlzUTBGQlF6dEJRVU5FTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOUExGTkJRVk1zY1VKQlFYRkNMRU5CUVVNc1UwRkJVeXhGUVVGRk8wRkJRMnBFTEVWQlFVVXNUMEZCVHl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE5VSXNRMEZCUXp0QlFVTkVPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5QTEZOQlFWTXNVVUZCVVN4RFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVOeVF5eEZRVUZGTEVsQlFVa3NTMEZCU3l4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOcVFpeEZRVUZGTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRemxETEVsQlFVa3NTVUZCU1N4RFFVRkRMRWRCUVVjc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6RkNMRWxCUVVrc1NVRkJTU3hQUVVGUExFTkJRVU1zUzBGQlN5eFJRVUZSTEVWQlFVVTdRVUZETDBJc1RVRkJUU3hKUVVGSkxGRkJRVkVzUjBGQlJ5eERRVUZETEVOQlFVTXNVVUZCVVN4TFFVRkxMRXRCUVVzc1IwRkJSeXhIUVVGSExFZEJRVWNzUTBGQlF5eERRVUZETEZGQlFWRXNRMEZCUXp0QlFVTTNSQ3hOUVVGTkxFdEJRVXNzUTBGQlF5eEpRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRTlCUVU4c1EwRkJReXhEUVVGRExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTnNSQ3hMUVVGTExFMUJRVTA3UVVGRFdDeE5RVUZOTEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZETjBJc1MwRkJTenRCUVVOTUxFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNUMEZCVHl4TFFVRkxMRU5CUVVNc1NVRkJTU3hGUVVGRkxFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTJoRExFTkJRVU03UVVGRFJEdEJRVU5CTzBGQlEwOHNUVUZCVFN4VFFVRlRMRWRCUVVjc1QwRkJUeXhOUVVGTkxFdEJRVXNzVjBGQlZ5eERRVUZETzBGQlEzWkVPMEZCUTBFN1FVRkRUeXhOUVVGTkxFZEJRVWM3UVVGRGFFSXNSVUZCUlN4VFFVRlRMRWxCUVVrc1QwRkJUeXhOUVVGTkxFTkJRVU1zVjBGQlZ5eExRVUZMTEZkQlFWYzdRVUZEZUVRc1RVRkJUU3hYUVVGWExFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4WFFVRlhMRU5CUVVNN1FVRkRka01zVFVGQlRTeEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRWxCUVVrc1EwRkJReXhKUVVGSkxFTkJRVU03TzBGRE4wTjZRanRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVGQlFXVXNUVUZCVFN4bFFVRmxMRU5CUVVNN1FVRkRja01zUlVGQlJTeFhRVUZYTEVkQlFVYzdRVUZEYUVJc1NVRkJTU3hKUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTjZRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVYzdRVUZEYWtJc1RVRkJUU3hMUVVGTExFVkJRVVVzUTBGQlF6dEJRVU5rTEUxQlFVMHNUMEZCVHl4RlFVRkZMRU5CUVVNN1FVRkRhRUlzUzBGQlN5eERRVUZETzBGQlEwNHNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVWQlFVVXNaMEpCUVdkQ0xFTkJRVU1zVTBGQlV5eEZRVUZGTEZGQlFWRXNSVUZCUlR0QlFVTjRReXhKUVVGSkxFbEJRVWtzVTBGQlV5eEhRVUZITEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNN1FVRkRjRU1zU1VGQlNTeEpRVUZKTEZOQlFWTXNRMEZCUXl4VFFVRlRMRU5CUVVNc1MwRkJTeXhUUVVGVExFVkJRVVU3UVVGRE5VTXNUVUZCVFN4VFFVRlRMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEyaERMRXRCUVVzN1FVRkRURHRCUVVOQkxFbEJRVWtzU1VGQlNTeFRRVUZUTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNc1QwRkJUeXhEUVVGRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXl4RlFVRkZPMEZCUTNaRUxFMUJRVTBzVTBGQlV5eERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU14UXl4TFFVRkxPMEZCUTB3c1IwRkJSenRCUVVOSU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRVZCUVVVc1owSkJRV2RDTEVOQlFVTXNVMEZCVXl4RlFVRkZMRkZCUVZFc1JVRkJSVHRCUVVONFF5eEpRVUZKTzBGQlEwb3NUVUZCVFN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eExRVUZMTEZOQlFWTTdRVUZET1VNc1RVRkJUU3hKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEZWtRc1RVRkJUVHRCUVVOT0xFZEJRVWM3UVVGRFNEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hGUVVGRkxHMUNRVUZ0UWl4RFFVRkRMRk5CUVZNc1JVRkJSU3hSUVVGUkxFVkJRVVU3UVVGRE0wTXNTVUZCU1N4SlFVRkpMR0ZCUVdFc1IwRkJSeXhKUVVGSkxFTkJRVU1zVlVGQlZTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUTI1RUxFbEJRVWtzU1VGQlNTeGhRVUZoTEV0QlFVc3NVMEZCVXl4RlFVRkZPMEZCUTNKRExFMUJRVTBzU1VGQlNTeExRVUZMTEVkQlFVY3NZVUZCWVN4RFFVRkRMRTlCUVU4c1EwRkJReXhSUVVGUkxFTkJRVU1zUTBGQlF6dEJRVU5zUkN4TlFVRk5MRWxCUVVrc1MwRkJTeXhMUVVGTExFTkJRVU1zUTBGQlF5eEZRVUZGTzBGQlEzaENMRkZCUVZFc1lVRkJZU3hEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRka01zVDBGQlR6dEJRVU5RTEV0QlFVczdRVUZEVEN4SFFVRkhPMEZCUTBnN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVN4RlFVRkZMR0ZCUVdFc1EwRkJReXhUUVVGVExFVkJRVVVzVFVGQlRTeEZRVUZGTEZOQlFWTXNSVUZCUlR0QlFVTTVReXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNN1FVRkRka0k3UVVGRFFTeEpRVUZKTEVsQlFVa3NZVUZCWVN4SFFVRkhMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEYmtRc1NVRkJTU3hKUVVGSkxHRkJRV0VzUzBGQlN5eFRRVUZUTEVWQlFVVTdRVUZEY2tNc1RVRkJUU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eGhRVUZoTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM3BETzBGQlEwRXNUVUZCVFN4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTMEZCU3l4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU0zUXl4UlFVRlJMRXRCUVVzc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZMRTFCUVUwc1JVRkJSU3hUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU12UXl4UFFVRlBPMEZCUTFBc1MwRkJTenRCUVVOTUxFZEJRVWM3UVVGRFNEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRVZCUVVVc1lVRkJZU3hIUVVGSE8wRkJRMnhDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRemxETEVkQlFVYzdRVUZEU0N4RFFVRkRPenRCUXpsRll5eE5RVUZOTEV0QlFVc3NRMEZCUXp0QlFVTXpRanRCUVVOQk8wRkJRMEU3UVVGRFFTeEZRVUZGTEZkQlFWY3NRMEZCUXl4VlFVRlZMRVZCUVVVc1QwRkJUeXhGUVVGRk8wRkJRMjVETEVsQlFVa3NTVUZCU1N4RFFVRkRMRlZCUVZVc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGVrSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1lVRkJZU3hIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU0xUWp0QlFVTkJMRWxCUVVrc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eFRRVUZUTEVsQlFVazdRVUZEY0VNc1RVRkJUU3hKUVVGSkxFOUJRVThzVTBGQlV5eExRVUZMTEZGQlFWRXNSVUZCUlR0QlFVTjZReXhSUVVGUkxFbEJRVWtzUTBGQlF5eGhRVUZoTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU55UkN4UFFVRlBMRTFCUVUwN1FVRkRZaXhSUVVGUkxFbEJRVWtzUTBGQlF5eFZRVUZWTEVOQlFVTXNTVUZCU1N4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM2hETEU5QlFVODdRVUZEVUN4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVOUU8wRkJRMEVzU1VGQlNTeEpRVUZKTEVsQlFVa3NRMEZCUXl4VlFVRlZMRU5CUVVNc1RVRkJUU3hMUVVGTExFTkJRVU1zUlVGQlJUdEJRVU4wUXl4TlFVRk5MRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zZVVOQlFYbERMRU5CUVVNc1EwRkJRenRCUVVOcVJTeExRVUZMTzBGQlEwdzdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzWkNPMEZCUTBFc1NVRkJTU3hKUVVGSkxFTkJRVU1zWlVGQlpTeEhRVUZITEVsQlFVa3NaVUZCWlN4RlFVRkZMRU5CUVVNN1FVRkRha1E3UVVGRFFUdEJRVU5CTEVsQlFVa3NTVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhMUVVGTExFTkJRVU03UVVGRE1VSTdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhIUVVGSExFZEJRVWNzVVVGQlVTeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUTNCRE8wRkJRMEU3UVVGRFFTeEpRVUZKTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRTFCUVUwc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU4yUkN4TlFVRk5MRWxCUVVrc1RVRkJUU3hIUVVGSExFOUJRVThzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRlRU1zVFVGQlRTeEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVU3UVVGRE9VSTdRVUZEUVN4UlFVRlJMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUTJ4RExGRkJRVkVzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGJrTXNUMEZCVHp0QlFVTlFMRXRCUVVzN1FVRkRUQ3hIUVVGSE8wRkJRMGc3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRVZCUVVVc1UwRkJVeXhEUVVGRExFMUJRVTBzUlVGQlJUdEJRVU53UWl4SlFVRkpMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRPMEZCUXpsQ0xFbEJRVWtzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGREwwSTdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU1zWVVGQllTeERRVUZETEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1dVRkJXU3hGUVVGRkxFMUJRVTBzUTBGQlF5eERRVUZETzBGQlF6ZEZMRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNSVUZCUlN4WlFVRlpMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRM1pDTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRPVU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZPMEZCUTJoQ0xFMUJRVTBzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzSkRPMEZCUTBFc1RVRkJUU3hMUVVGTExFZEJRVWNzVFVGQlRTeERRVUZETEU5QlFVOHNRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE0wTXNUVUZCVFN4TlFVRk5MRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkRkRU03UVVGRFFTeE5RVUZOTEVsQlFVa3NRMEZCUXl4bFFVRmxMRU5CUVVNc1lVRkJZVHRCUVVONFF5eFJRVUZSTEV0QlFVc3NRMEZCUXl4VFFVRlRMRU5CUVVNc1kwRkJZenRCUVVOMFF5eFJRVUZSTEUxQlFVMDdRVUZEWkN4UFFVRlBMRU5CUVVNN1FVRkRVaXhMUVVGTE8wRkJRMHdzUjBGQlJ6dEJRVU5JTzBGQlEwRXNSVUZCUlN4TFFVRkxMRU5CUVVNc1RVRkJUU3hGUVVGRk8wRkJRMmhDTEVsQlFVazdRVUZEU2l4TlFVRk5MRTFCUVUwc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRE8wRkJRemxETEUxQlFVMHNRMEZCUXl4TlFVRk5MRU5CUVVNc1owSkJRV2RDTEVOQlFVTXNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJRenRCUVVOc1JDeE5RVUZOTzBGQlEwNHNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3hOUVVGTkxFZEJRVWM3UVVGRFdDeEpRVUZKTEU5QlFVODdRVUZEV0N4TlFVRk5MRWRCUVVjc1JVRkJSU3hKUVVGSkxFTkJRVU1zUjBGQlJ6dEJRVU51UWl4TlFVRk5MRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zVVVGQlVUdEJRVU0zUWl4TlFVRk5MRlZCUVZVc1JVRkJSVHRCUVVOc1FpeFJRVUZSTEZGQlFWRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVOc1JDeFJRVUZSTEVkQlFVY3NSVUZCUlN4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExFZEJRVWNzUTBGQlF5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVOb1JDeFBRVUZQTzBGQlExQXNUVUZCVFN4WFFVRlhMRVZCUVVVc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTzBGQlEzWkRMRXRCUVVzc1EwRkJRenRCUVVOT0xFZEJRVWM3UVVGRFNEdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRVZCUVVVc1MwRkJTeXhIUVVGSE8wRkJRMVlzU1VGQlNTeFBRVUZQTzBGQlExZ3NUVUZCVFN4aFFVRmhMRVZCUVVVc1NVRkJTU3hEUVVGRExGVkJRVlVzUTBGQlF5eE5RVUZOTzBGQlF6TkRMRTFCUVUwc1YwRkJWeXhGUVVGRkxFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFR0QlFVTjJReXhMUVVGTExFTkJRVU03UVVGRFRpeEhRVUZITzBGQlEwZ3NRMEZCUXp0QlFVTkVPMEZCUTBFc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eFpRVUZaTEVkQlFVY3NiMEpCUVc5Q0xFTkJRVU03UVVGRGNFUXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhqUVVGakxFZEJRVWNzYzBKQlFYTkNMRU5CUVVNN1FVRkRlRVFzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4cFFrRkJhVUlzUjBGQlJ5eDVRa0ZCZVVJc1EwRkJRenM3UVVOMlIzWkVMRTFCUVUwc1RVRkJUU3hEUVVGRE8wRkJRM0JDTEVWQlFVVXNWVUZCVlN4SFFVRkhPMEZCUTJZc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhOUVVGTkxFdEJRVXNzUTBGQlF5eEZRVUZGTEU5QlFVOHNTVUZCU1N4RFFVRkRPMEZCUTNwRU8wRkJRMEVzU1VGQlNTeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEdsQ1FVRnBRaXhEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTTFSQ3hOUVVGTkxFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eERRVUZETEVOQlFVTXNRMEZCUXp0QlFVTTFReXhOUVVGTkxFbEJRVWtzUzBGQlN5eERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRXRCUVVzc1EwRkJReXhGUVVGRk8wRkJRM1pETEZGQlFWRXNUMEZCVHl4TFFVRkxMRU5CUVVNN1FVRkRja0lzVDBGQlR6dEJRVU5RTEV0QlFVczdRVUZEVER0QlFVTkJMRWxCUVVrc1QwRkJUeXhKUVVGSkxFTkJRVU03UVVGRGFFSXNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3hYUVVGWExFTkJRVU1zUzBGQlN5eEZRVUZGTEZWQlFWVXNSVUZCUlR0QlFVTnFReXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMEZCUTNaQ0xFbEJRVWtzU1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRlRUk3UVVGRFFUdEJRVU5CTEVsQlFVa3NTVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGRrSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU4wUWp0QlFVTkJMRWxCUVVrc1NVRkJTU3hEUVVGRExGRkJRVkVzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEZEVJN1FVRkRRVHRCUVVOQkxFbEJRVWtzU1VGQlNTeERRVUZETEZkQlFWY3NSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRla0k3UVVGRFFTeEpRVUZKTEVsQlFVa3NWVUZCVlN4SlFVRkpMRlZCUVZVc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRE0wTXNUVUZCVFN4SlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExGVkJRVlVzUTBGQlF5eFJRVUZSTEVOQlFVTTdRVUZETVVNc1MwRkJTenRCUVVOTU8wRkJRMEVzU1VGQlNTeEpRVUZKTEVOQlFVTXNhVUpCUVdsQ0xFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEyaERPMEZCUTBFc1NVRkJTU3hKUVVGSkxFTkJRVU1zVjBGQlZ5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTTFRanRCUVVOQkxFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVOc1F5eE5RVUZOTEV0QlFVc3NTVUZCU1N4VFFVRlRMRWxCUVVrc1NVRkJTU3hEUVVGRExGZEJRVmNzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZEZEVRc1VVRkJVU3hKUVVGSkxGZEJRVmNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU01UkN4UlFVRlJMRWxCUVVrc1ZVRkJWU3hIUVVGSExGZEJRVmNzUTBGQlF5eFZRVUZWTEVOQlFVTTdRVUZEYUVRc1VVRkJVU3hKUVVGSkxFTkJRVU1zVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4TlFVRk5MRXRCUVVzc1EwRkJReXhGUVVGRk8wRkJRM0JFTEZWQlFWVXNUVUZCVFN4SlFVRkpMRXRCUVVzc1EwRkJReXhyUkVGQmEwUXNRMEZCUXl4RFFVRkRPMEZCUXpsRkxGTkJRVk03UVVGRFZDeFJRVUZSTEVsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zWVVGQllTeERRVUZETEdWQlFXVXNRMEZCUXl4VlFVRlZMRU5CUVVNc1EwRkJRenRCUVVONlJTeFJRVUZSTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1UwRkJVeXhEUVVGRExFZEJRVWNzUzBGQlN5eERRVUZETzBGQlEzcERMRkZCUVZFc1NVRkJTU3hYUVVGWExFTkJRVU1zVTBGQlV5eExRVUZMTEVsQlFVa3NSVUZCUlR0QlFVTTFReXhWUVVGVkxFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZETjBNc1UwRkJVenRCUVVOVUxGRkJRVkVzU1VGQlNTeERRVUZETEU5QlFVOHNRMEZCUXl4VFFVRlRMRU5CUVVNc1IwRkJSenRCUVVOc1F5eFZRVUZWTEU5QlFVOHNSVUZCUlN4TFFVRkxMRU5CUVVNc1VVRkJVVHRCUVVOcVF5eFRRVUZUTEVOQlFVTTdRVUZEVmp0QlFVTkJPMEZCUTBFc1VVRkJVU3hKUVVGSkxGZEJRVmNzUjBGQlJ5eERRVUZETEU5QlFVOHNSVUZCUlN4VFFVRlRMRVZCUVVVc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE1VUTdRVUZEUVN4UlFVRlJMRTFCUVUwc1dVRkJXU3hIUVVGSE8wRkJRemRDTEZWQlFWVXNTMEZCU3l4RlFVRkZMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zV1VGQldUdEJRVU0zUXl4VlFVRlZMRTlCUVU4c1JVRkJSU3hMUVVGTExFTkJRVU1zVTBGQlV5eERRVUZETEdOQlFXTTdRVUZEYWtRc1ZVRkJWU3hQUVVGUExFVkJRVVVzUzBGQlN5eERRVUZETEZOQlFWTXNRMEZCUXl4cFFrRkJhVUk3UVVGRGNFUXNVMEZCVXl4RFFVRkRPMEZCUTFZN1FVRkRRU3hSUVVGUkxFbEJRVWtzVjBGQlZ5eERRVUZETEUxQlFVMHNSVUZCUlR0QlFVTm9ReXhWUVVGVkxGZEJRVmNzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4SlFVRkpPMEZCUXpORExGbEJRVmtzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4UFFVRlBMRVZCUVVVN1FVRkRMMElzWTBGQll5eFBRVUZQTEVOQlFVTXNTVUZCU1R0QlFVTXhRaXhuUWtGQlowSXNRMEZCUXl4UlFVRlJPMEZCUTNwQ0xHdENRVUZyUWl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExFbEJRVWs3UVVGRGRrTXNhVUpCUVdsQ0xEWkNRVUUyUWl4RlFVRkZMRmRCUVZjc1EwRkJReXhKUVVGSk8wRkJRMmhGTEd0Q1FVRnJRaXhKUVVGSk8wRkJRM1JDTEdsQ1FVRnBRaXhEUVVGRExHRkJRV0VzUlVGQlJTeFRRVUZUTEVOQlFVTXNhVVJCUVdsRUxFTkJRVU03UVVGRE4wWXNaVUZCWlN4RFFVRkRPMEZCUTJoQ0xHRkJRV0U3UVVGRFlqdEJRVU5CTzBGQlEwRXNXVUZCV1N4SlFVRkpMRmRCUVZjc1EwRkJReXhOUVVGTkxFTkJRVU1zVTBGQlV5eERRVUZETEVWQlFVVTdRVUZETDBNc1kwRkJZeXhKUVVGSkxFdEJRVXNzUjBGQlJ5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM2hFTzBGQlEwRXNZMEZCWXl4SlFVRkpMRk5CUVZNc1MwRkJTeXhUUVVGVExFVkJRVVU3UVVGRE0wTXNaMEpCUVdkQ0xFdEJRVXNzUTBGQlF5eFJRVUZSTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNSRExHZENRVUZuUWl4SlFVRkpMRXRCUVVzc1MwRkJTeXhKUVVGSkxFVkJRVVU3UVVGRGNFTTdRVUZEUVN4clFrRkJhMElzU1VGQlNTeFRRVUZUTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVNMVJTeHJRa0ZCYTBJc1MwRkJTeXhEUVVGRExHVkJRV1VzUTBGQlF5eG5Ra0ZCWjBJN1FVRkRlRVFzYjBKQlFXOUNMRXRCUVVzc1EwRkJReXhUUVVGVExFTkJRVU1zYVVKQlFXbENPMEZCUTNKRUxHOUNRVUZ2UWl4TlFVRk5MRWxCUVVrN1FVRkRPVUk3UVVGRFFTeHpRa0ZCYzBJc1NVRkJTU3hUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJReXhGUVVGRk8wRkJRelZFTEhkQ1FVRjNRaXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXk5RExIVkNRVUYxUWp0QlFVTjJRaXh4UWtGQmNVSTdRVUZEY2tJc2JVSkJRVzFDTEVOQlFVTTdRVUZEY0VJc2FVSkJRV2xDTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFdEJRVXNzUTBGQlF5eEZRVUZGTzBGQlEycEVMR3RDUVVGclFpeEpRVUZKTEZOQlFWTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJReXhEUVVGRE8wRkJRelZGTEd0Q1FVRnJRaXhMUVVGTExFTkJRVU1zWlVGQlpTeERRVUZETEdkQ1FVRm5RanRCUVVONFJDeHZRa0ZCYjBJc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eHBRa0ZCYVVJN1FVRkRja1FzYjBKQlFXOUNMRU5CUVVNc1RVRkJUU3hGUVVGRkxHZENRVUZuUWl4TFFVRkxPMEZCUTJ4RU8wRkJRMEVzYzBKQlFYTkNPMEZCUTNSQ0xIZENRVUYzUWl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExHZENRVUZuUWl4RFFVRkRMRmRCUVZjc1EwRkJReXhMUVVGTExFTkJRVU1zUTBGQlF6dEJRVU14UlN4M1FrRkJkMElzVTBGQlV5eERRVUZETEU5QlFVOHNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGVFUXNkMEpCUVhkQ08wRkJRM2hDTEhkQ1FVRjNRaXhUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUXk5RExIVkNRVUYxUWp0QlFVTjJRaXh4UWtGQmNVSTdRVUZEY2tJc2JVSkJRVzFDTEVOQlFVTTdRVUZEY0VJc2FVSkJRV2xDTEVGQmNVSkJPMEZCUTJwQ0xHVkJRV1VzVFVGQlRUdEJRVU55UWl4blFrRkJaMElzU1VGQlNTeFRRVUZUTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RlFVRkZMRU5CUVVNc1EwRkJRenRCUVVNeFJUdEJRVU5CTEdkQ1FVRm5RaXhMUVVGTExFTkJRVU1zWlVGQlpTeERRVUZETEdkQ1FVRm5RanRCUVVOMFJDeHJRa0ZCYTBJc1dVRkJXU3hEUVVGRExGTkJRVk1zUTBGQlF6dEJRVU42UXl4clFrRkJhMElzVFVGQlRTeEpRVUZKTzBGQlF6VkNPMEZCUTBFc2IwSkJRVzlDTEVsQlFVa3NVMEZCVXl4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEZUVRc2MwSkJRWE5DTEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRE4wTXNiVUpCUVcxQ08wRkJRMjVDTEdsQ1FVRnBRaXhEUVVGRE8wRkJRMnhDTEdWQlFXVTdRVUZEWml4aFFVRmhPMEZCUTJJc1YwRkJWeXhEUVVGRExFTkJRVU03UVVGRFlpeFRRVUZUTzBGQlExUXNUMEZCVHp0QlFVTlFMRXRCUVVzN1FVRkRUQ3hIUVVGSE8wRkJRMGc3UVVGRFFTeEZRVUZGTEVsQlFVa3NSMEZCUnp0QlFVTlVMRWxCUVVrc1NVRkJTU3hEUVVGRExGZEJRVmNzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEZWtJc1NVRkJTU3hKUVVGSkxFTkJRVU1zVDBGQlR5eEhRVUZITEV0QlFVc3NRMEZCUXp0QlFVTjZRaXhIUVVGSE8wRkJRMGc3UVVGRFFTeEZRVUZGTEVsQlFVa3NSMEZCUnp0QlFVTlVMRWxCUVVrc1NVRkJTU3hEUVVGRExFOUJRVThzUjBGQlJ5eEpRVUZKTEVOQlFVTTdRVUZEZUVJc1IwRkJSenRCUVVOSU8wRkJRMEU3UVVGRFFTeEZRVUZGTEZkQlFWY3NSMEZCUnp0QlFVTm9RaXhKUVVGSkxFdEJRVXNzU1VGQlNTeFRRVUZUTEVsQlFVa3NTVUZCU1N4RFFVRkRMRTlCUVU4c1JVRkJSVHRCUVVONFF5eE5RVUZOTEVsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZETVVNc1RVRkJUU3hKUVVGSkxFdEJRVXNzUTBGQlF5eExRVUZMTEVWQlFVVTdRVUZEZGtJc1VVRkJVU3hMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRMMElzVDBGQlR6dEJRVU5RTEUxQlFVMHNTVUZCU1N4TFFVRkxMRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRM3BDTEZGQlFWRXNTMEZCU3l4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEycERMRTlCUVU4N1FVRkRVQ3hOUVVGTkxFbEJRVWtzUzBGQlN5eERRVUZETEU5QlFVOHNSVUZCUlR0QlFVTjZRaXhSUVVGUkxFbEJRVWtzUzBGQlN5eERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFVkJRVVU3UVVGRE1VTXNWVUZCVlN4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZEYmtNc1UwRkJVeXhOUVVGTk8wRkJRMllzVlVGQlZTeExRVUZMTEVsQlFVa3NTVUZCU1N4SlFVRkpMRXRCUVVzc1EwRkJReXhQUVVGUExFVkJRVVU3UVVGRE1VTXNXVUZCV1N4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETEUxQlFVMHNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRNME1zVjBGQlZ6dEJRVU5ZTEZOQlFWTTdRVUZEVkN4UFFVRlBPMEZCUTFBc1MwRkJTenRCUVVOTUxFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNUVUZCVFN4SFFVRkhPMEZCUTFnc1NVRkJTU3hKUVVGSkxFbEJRVWtzUjBGQlJ6dEJRVU5tTEUxQlFVMHNTVUZCU1N4RlFVRkZMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zU1VGQlNUdEJRVU5xUXl4TlFVRk5MRTlCUVU4c1JVRkJSU3hKUVVGSkxFTkJRVU1zVDBGQlR6dEJRVU16UWl4TlFVRk5MRmRCUVZjc1JVRkJSU3hKUVVGSkxFTkJRVU1zVjBGQlZ6dEJRVU51UXl4TlFVRk5MRkZCUVZFc1JVRkJSU3hKUVVGSkxFTkJRVU1zVVVGQlVUdEJRVU0zUWl4TlFVRk5MRTlCUVU4c1JVRkJSU3hGUVVGRk8wRkJRMnBDTEV0QlFVc3NRMEZCUXp0QlFVTk9PMEZCUTBFc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNUMEZCVHl4RlFVRkZPMEZCUTJ4RExFMUJRVTBzU1VGQlNTeFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRMRmRCUVZjc1EwRkJReXhQUVVGUExFTkJRVU03UVVGRE4wTXNUVUZCVFN4TFFVRkxMRWxCUVVrc1UwRkJVeXhKUVVGSkxFOUJRVThzUlVGQlJUdEJRVU55UXl4UlFVRlJMRWxCUVVrc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkROVU1zVVVGQlVTeEpRVUZKTEdWQlFXVXNSMEZCUnl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRGFrUXNVVUZCVVN4SlFVRkpMRk5CUVZNc1NVRkJTU3hKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhPMEZCUTI1RUxGVkJRVlVzUjBGQlJ5eEZRVUZGTEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU1zUjBGQlJ6dEJRVU16UXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVOWU8wRkJRMEVzVVVGQlVTeFRRVUZUTEVOQlFVTXNVMEZCVXl4SFFVRkhMR1ZCUVdVc1EwRkJReXhUUVVGVExFdEJRVXNzU1VGQlNTeERRVUZETzBGQlEycEZMRkZCUVZFc1UwRkJVeXhEUVVGRExGRkJRVkU3UVVGRE1VSXNWVUZCVlN4bFFVRmxMRU5CUVVNc1RVRkJUVHRCUVVOb1F5eFhRVUZYTEdWQlFXVXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhMUVVGTExFbEJRVWs3UVVGRGFFUXNXVUZCV1N4bFFVRmxMRU5CUVVNc1RVRkJUU3hEUVVGRExFOUJRVThzUzBGQlN5eEpRVUZKTzBGQlEyNUVMRmxCUVZrc1pVRkJaU3hEUVVGRExFMUJRVTBzUTBGQlF5eFBRVUZQTEV0QlFVc3NTVUZCU1R0QlFVTnVSQ3haUVVGWkxFdEJRVXNzUTBGQlF5eFBRVUZQTEVOQlFVTXNaVUZCWlN4RFFVRkRMRTFCUVUwc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6TkVPMEZCUTBFc1VVRkJVU3hKUVVGSkxGTkJRVk1zUTBGQlF5eFJRVUZSTEVWQlFVVTdRVUZEYUVNc1ZVRkJWU3hUUVVGVExFTkJRVU1zVFVGQlRTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTm9RenRCUVVOQkxGVkJRVlVzVFVGQlRTeFBRVUZQTEVkQlFVY3NRMEZCUXl4UFFVRlBMRVZCUVVVc1UwRkJVeXhGUVVGRkxGTkJRVk1zUTBGQlF5eERRVUZETzBGQlF6RkVMRlZCUVZVc1QwRkJUeXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVsQlFVazdRVUZEY0VNc1dVRkJXU3hKUVVGSkxFdEJRVXNzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlR0QlFVTXZRaXhqUVVGakxGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNUVUZCVFN4RFFVRkRMRWRCUVVjN1FVRkRla01zWjBKQlFXZENMRkZCUVZFc1JVRkJSU3hMUVVGTExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNUVUZCVFR0QlFVTTVReXhsUVVGbExFTkJRVU03UVVGRGFFSXNZVUZCWVR0QlFVTmlMRmRCUVZjc1EwRkJReXhEUVVGRE8wRkJRMklzVTBGQlV6dEJRVU5VTEU5QlFVODdRVUZEVUN4TFFVRkxPMEZCUTB3N1FVRkRRU3hKUVVGSkxFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyaENMRWRCUVVjN1FVRkRTQ3hEUVVGRE8wRkJRMFE3UVVGRFFTeEJRVUZQTEZOQlFWTXNSMEZCUnl4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVNdlFpeEZRVUZGTEU5QlFVODdRVUZEVkN4SlFVRkpMRkZCUVZFc1JVRkJSU3hMUVVGTE8wRkJRMjVDTEVsQlFVa3NVMEZCVXl4RlFVRkZMRk5CUVZNN1FVRkRlRUlzUjBGQlJ5eERRVUZETzBGQlEwb3NRMEZCUXpzN1FVTnFUMDBzVFVGQlRTeGhRVUZoTEVOQlFVTTdRVUZETTBJc1JVRkJSU3hYUVVGWExFTkJRVU1zUzBGQlN5eEZRVUZGTzBGQlEzSkNMRWxCUVVrc1NVRkJTU3hEUVVGRExGRkJRVkVzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEZGtJc1NVRkJTU3hKUVVGSkxFTkJRVU1zWlVGQlpTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTTVRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTMEZCU3l4RFFVRkRPMEZCUTNaQ0xFbEJRVWtzU1VGQlNTeERRVUZETEd0Q1FVRnJRaXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU51UXl4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxHTkJRV01zUTBGQlF5eFhRVUZYTEVWQlFVVXNWVUZCVlN4RlFVRkZPMEZCUXpGRExFbEJRVWtzU1VGQlNTeEZRVUZGTEZkQlFWY3NRMEZCUXl4VFFVRlRMRmxCUVZrc1RVRkJUU3hEUVVGRExFVkJRVVU3UVVGRGNFUXNUVUZCVFN4TlFVRk5MRWxCUVVrc1MwRkJTenRCUVVOeVFpeFJRVUZSTEVOQlFVTXNVVUZCVVN4RlFVRkZMRmRCUVZjc1EwRkJReXhKUVVGSkxFTkJRVU1zYVVOQlFXbERMRU5CUVVNN1FVRkRkRVVzVDBGQlR5eERRVUZETzBGQlExSXNTMEZCU3p0QlFVTk1MRWxCUVVrc1NVRkJTU3hKUVVGSkxFTkJRVU1zVTBGQlV5eERRVUZETEZkQlFWY3NRMEZCUXl4TFFVRkxMRk5CUVZNc1JVRkJSVHRCUVVOdVJDeE5RVUZOTEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhSUVVGUkxFVkJRVVVzVjBGQlZ5eERRVUZETEVsQlFVa3NRMEZCUXl4eFFrRkJjVUlzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEZGtVc1RVRkJUU3hQUVVGUExFbEJRVWtzUTBGQlF6dEJRVU5zUWl4TFFVRkxPMEZCUTB3N1FVRkRRU3hKUVVGSkxFbEJRVWtzVFVGQlRTeEhRVUZITEVsQlFVa3NWMEZCVnl4RFFVRkRMRWxCUVVrc1EwRkJReXhMUVVGTExFVkJRVVVzVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEZWtRc1NVRkJTU3hKUVVGSkxFMUJRVTBzUTBGQlF5eEpRVUZKTEVWQlFVVXNUVUZCVFN4RFFVRkRMRWxCUVVrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF6dEJRVU0zUXl4SlFVRkpMRTFCUVUwc1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRlRU1zU1VGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU12UWl4SlFVRkpMRWxCUVVrc1RVRkJUU3hEUVVGRExFOUJRVThzUlVGQlJUdEJRVU40UWl4TlFVRk5MRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTNoRExFMUJRVTBzU1VGQlNTeERRVUZETEZkQlFWY3NSVUZCUlN4RFFVRkRPMEZCUTNwQ0xFdEJRVXM3UVVGRFRDeEpRVUZKTEU5QlFVOHNTVUZCU1N4RFFVRkRPMEZCUTJoQ0xFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNaMEpCUVdkQ0xFTkJRVU1zVjBGQlZ5eEZRVUZGTzBGQlEyaERMRWxCUVVrc1NVRkJTU3hOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4WFFVRlhMRU5CUVVNc1EwRkJRenRCUVVNM1F5eEpRVUZKTEVsQlFVa3NUVUZCVFN4TFFVRkxMRk5CUVZNc1JVRkJSVHRCUVVNNVFpeE5RVUZOTEU5QlFVOHNRMEZCUXl4SlFVRkpPMEZCUTJ4Q0xGRkJRVkVzUTBGQlF5eDFRa0ZCZFVJc1JVRkJSU3hYUVVGWExFTkJRVU1zU1VGQlNTeERRVUZETEc5Q1FVRnZRaXhEUVVGRE8wRkJRM2hGTEU5QlFVOHNRMEZCUXp0QlFVTlNMRTFCUVUwc1QwRkJUeXhKUVVGSkxFTkJRVU03UVVGRGJFSXNTMEZCU3p0QlFVTk1PMEZCUTBFc1NVRkJTU3hKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNSVUZCUlN4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNelJEdEJRVU5CTEVsQlFVa3NTVUZCU1N4TlFVRk5MRU5CUVVNc1QwRkJUeXhGUVVGRk8wRkJRM2hDTEUxQlFVMHNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZETTBVc1MwRkJTenRCUVVOTU8wRkJRMEU3UVVGRFFTeEpRVUZKTEU5QlFVOHNTVUZCU1N4RFFVRkRPMEZCUTJoQ0xFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNWMEZCVnl4SFFVRkhPMEZCUTJoQ0xFbEJRVWtzU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRExFVkJRVVVzUTBGQlF5eExRVUZMTzBGQlEzaERMRTFCUVUwc1QwRkJUeXhEUVVGRExFTkJRVU1zVVVGQlVTeEhRVUZITEVOQlFVTXNRMEZCUXl4UlFVRlJMRWxCUVVrc1EwRkJReXhEUVVGRExFdEJRVXNzUjBGQlJ5eERRVUZETEVOQlFVTXNTMEZCU3l4RFFVRkRPMEZCUXpGRUxFdEJRVXNzUTBGQlF5eERRVUZETzBGQlExQXNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3hUUVVGVExFTkJRVU1zVjBGQlZ5eEZRVUZGTzBGQlEzcENMRWxCUVVrc1QwRkJUeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxGZEJRVmNzUTBGQlF5eERRVUZETzBGQlF6ZEVMRWRCUVVjN1FVRkRTRHRCUVVOQkxFVkJRVVVzVlVGQlZTeEhRVUZITzBGQlEyWXNTVUZCU1N4UFFVRlBMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU03UVVGRGVrSXNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3haUVVGWkxFTkJRVU1zVjBGQlZ5eEZRVUZGTzBGQlF6VkNMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWeXhEUVVGRExFTkJRVU03UVVGRGJrUXNTVUZCU1N4SlFVRkpMRU5CUVVNc1EwRkJReXhMUVVGTExFVkJRVVVzVDBGQlR6dEJRVU40UWp0QlFVTkJMRWxCUVVrc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTMEZCU3l4RlFVRkZMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMjVETEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc1lVRkJZU3hEUVVGRExFMUJRVTBzUlVGQlJTeExRVUZMTEVWQlFVVXNTVUZCU1N4RlFVRkZPMEZCUTNKRExFbEJRVWtzU1VGQlNTeE5RVUZOTEVOQlFVTXNWMEZCVnl4RlFVRkZPMEZCUXpWQ0xFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNWVUZCVlN4RlFVRkZMRVZCUVVVN1FVRkRMMElzVVVGQlVTeEpRVUZKTEZOQlFWTXNSMEZCUnl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVNNVFpeFJRVUZSTEUxQlFVMHNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhGUVVGRkxFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEzQkRMRkZCUVZFc1RVRkJUU3hEUVVGRExGZEJRVmNzUjBGQlJ5eEhRVUZITEVWQlFVVXNSMEZCUnl4VFFVRlRMRU5CUVVNN1FVRkRMME1zVVVGQlVTeEpRVUZKTEVOQlFVTXNhMEpCUVd0Q0xFZEJRVWNzVFVGQlRTeERRVUZETzBGQlEzcERMRkZCUVZFc1RVRkJUU3hEUVVGRExGZEJRVmNzUlVGQlJTeERRVUZETzBGQlF6ZENMRTlCUVU4N1FVRkRVQ3hMUVVGTE8wRkJRMHdzUjBGQlJ6dEJRVU5JTzBGQlEwRXNSVUZCUlN4SlFVRkpMRWRCUVVjN1FVRkRWQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zU1VGQlNTeEZRVUZGTEVOQlFVTXNRMEZCUXp0QlFVTXhSQ3hIUVVGSE8wRkJRMGc3UVVGRFFTeEZRVUZGTEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hGUVVGRkxGTkJRVk1zUlVGQlJUdEJRVU5zUXl4SlFVRkpMRWxCUVVrc1EwRkJReXhsUVVGbExFTkJRVU1zVDBGQlR6dEJRVU5vUXl4TlFVRk5MRTFCUVUwN1FVRkRXaXhSUVVGUkxFTkJRVU1zVTBGQlV5eEpRVUZKTEUxQlFVMHNRMEZCUXl4UFFVRlBMRXRCUVVzc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eE5RVUZOTEVWQlFVVXNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJRenRCUVVOb1JpeExRVUZMTEVOQlFVTTdRVUZEVGl4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxFdEJRVXNzUjBGQlJ6dEJRVU5XTEVsQlFVa3NTVUZCU1N4TFFVRkxMRWRCUVVjN1FVRkRhRUlzVFVGQlRTeFZRVUZWTEVWQlFVVXNTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTk8wRkJRM1JETEUxQlFVMHNUMEZCVHl4RlFVRkZMRVZCUVVVN1FVRkRha0lzUzBGQlN5eERRVUZETzBGQlEwNDdRVUZEUVN4SlFVRkpMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFMUJRVTBzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTnVSQ3hOUVVGTkxFbEJRVWtzVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRGNFTXNUVUZCVFN4SlFVRkpMRmRCUVZjc1NVRkJTU3hMUVVGTExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4WFFVRlhMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWM3UVVGRGJFVXNVVUZCVVN4UFFVRlBMRVZCUVVVc1JVRkJSVHRCUVVOdVFpeFJRVUZSTEZkQlFWY3NSVUZCUlN4TlFVRk5MRU5CUVVNc1YwRkJWenRCUVVOMlF5eFBRVUZQTEVOQlFVTXNRMEZCUXp0QlFVTlVMRTFCUVUwc1MwRkJTeXhKUVVGSkxFbEJRVWtzU1VGQlNTeE5RVUZOTEVOQlFVTXNSMEZCUnl4RlFVRkZPMEZCUTI1RExGRkJRVkVzVjBGQlZ5eERRVUZETEU5QlFVOHNRMEZCUXl4SlFVRkpMRU5CUVVNc1IwRkJSeXhOUVVGTkxFTkJRVU1zUjBGQlJ5eERRVUZETEVsQlFVa3NRMEZCUXl4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8wRkJRemRFTEU5QlFVODdRVUZEVUN4TFFVRkxPMEZCUTB3N1FVRkRRU3hKUVVGSkxFOUJRVThzUzBGQlN5eERRVUZETzBGQlEycENMRWRCUVVjN1FVRkRTQ3hEUVVGRE96dEJRMjVJVFN4TlFVRk5MRlZCUVZVc1EwRkJRenRCUVVONFFqdEJRVU5CTEVWQlFVVXNWMEZCVnl4RFFVRkRMRlZCUVZVc1JVRkJSU3hYUVVGWExFVkJRVVU3UVVGRGRrTXNTVUZCU1N4SlFVRkpMRU5CUVVNc1VVRkJVU3hIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU4yUWl4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUTBGQlF5eERRVUZETzBGQlEyNUNMRWxCUVVrc1NVRkJTU3hEUVVGRExGVkJRVlVzUjBGQlJ5eFZRVUZWTEVOQlFVTTdRVUZEYWtNc1NVRkJTU3hKUVVGSkxFTkJRVU1zV1VGQldTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTTNRanRCUVVOQkxFbEJRVWtzU1VGQlNTeFBRVUZQTEZkQlFWY3NTMEZCU3l4WFFVRlhMRVZCUVVVN1FVRkROVU1zVFVGQlRTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wRkJReTlDTEV0QlFVczdRVUZEVEN4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxFOUJRVThzUjBGQlJ6dEJRVU5hTzBGQlEwRXNTVUZCU1N4SlFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFTkJRVU1zVFVGQlRTeEpRVUZKTEVOQlFVTXNSVUZCUlR0QlFVTnVReXhOUVVGTkxFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eEhRVUZITEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0JFTEV0QlFVczdRVUZEVER0QlFVTkJMRWxCUVVrc1NVRkJTU3hKUVVGSkxFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOdVF6dEJRVU5CTEVsQlFVa3NUMEZCVHl4SlFVRkpMRU5CUVVNN1FVRkRhRUlzUjBGQlJ6dEJRVU5JTzBGQlEwRXNSVUZCUlN4UFFVRlBMRU5CUVVNc1NVRkJTU3hGUVVGRk8wRkJRMmhDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1JVRkJSU3hEUVVGRE8wRkJRMnBDTEVsQlFVa3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETjBJc1IwRkJSenRCUVVOSU8wRkJRMEVzUlVGQlJTeE5RVUZOTEVOQlFVTXNTMEZCU3l4RlFVRkZPMEZCUTJoQ0xFbEJRVWtzUzBGQlN5eEpRVUZKTEVOQlFVTXNSMEZCUnl4RFFVRkRMRVZCUVVVc1EwRkJReXhIUVVGSExFdEJRVXNzUlVGQlJTeERRVUZETEVWQlFVVXNSVUZCUlR0QlFVTndReXhOUVVGTkxFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NTVUZCU1N4RFFVRkRMRlZCUVZVc1JVRkJSU3hEUVVGRE8wRkJRM2hETEUxQlFVMHNTMEZCU3l4RFFVRkRMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRGVrSXNUVUZCVFN4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTm9ReXhMUVVGTE8wRkJRMHdzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4SlFVRkpMRXRCUVVzc1EwRkJRenRCUVVONFFpeEhRVUZITzBGQlEwZzdRVUZEUVN4RlFVRkZMRk5CUVZNc1IwRkJSenRCUVVOa0xFbEJRVWtzVDBGQlR5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRPMEZCUTNSQ0xFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNVMEZCVXl4SFFVRkhPMEZCUTJRc1NVRkJTU3hQUVVGUExFbEJRVWtzUTBGQlF5eFJRVUZSTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTJoRExFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNVMEZCVXl4SFFVRkhPMEZCUTJRc1NVRkJTU3hQUVVGUExFbEJRVWtzUTBGQlF5eExRVUZMTEVkQlFVY3NTVUZCU1N4RFFVRkRMRkZCUVZFc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRE4wTXNSMEZCUnp0QlFVTklMRU5CUVVNN08wRkRPVU5FTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFc1FVRkJaU3hOUVVGTkxGbEJRVmtzUTBGQlF6dEJRVU5zUXl4RlFVRkZMRmRCUVZjc1EwRkJReXhMUVVGTExFVkJRVVU3UVVGRGNrSXNTVUZCU1N4SlFVRkpMRU5CUVVNc1RVRkJUU3hIUVVGSExFdEJRVXNzUTBGQlF6dEJRVU40UWp0QlFVTkJPMEZCUTBFc1NVRkJTU3hKUVVGSkxFTkJRVU1zVVVGQlVTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTjJRaXhIUVVGSE8wRkJRMGc3UVVGRFFTeEZRVUZGTEdWQlFXVXNRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRNVUlzU1VGQlNTeExRVUZMTEVsQlFVa3NVMEZCVXl4SlFVRkpMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRGVrTXNUVUZCVFN4SlFVRkpMRXRCUVVzc1IwRkJSeXhKUVVGSkxFTkJRVU1zVVVGQlVTeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpORExFMUJRVTBzU1VGQlNTeE5RVUZOTEVOQlFVTXNUMEZCVHl4RFFVRkRMRTlCUVU4c1EwRkJReXhMUVVGTExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNSVUZCUlR0QlFVTm9SQ3hSUVVGUkxFdEJRVXNzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRia01zVDBGQlR6dEJRVU5RTEV0QlFVczdRVUZEVEN4SFFVRkhPMEZCUTBnN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNSVUZCUlN4elFrRkJjMElzUTBGQlF5eE5RVUZOTEVWQlFVVXNVMEZCVXl4RlFVRkZPMEZCUXpWRE8wRkJRMEU3UVVGRFFUdEJRVU5CTEVsQlFVa3NTMEZCU3l4SlFVRkpMRk5CUVZNc1NVRkJTU3hKUVVGSkxFTkJRVU1zVVVGQlVTeEZRVUZGTzBGQlEzcERMRTFCUVUwc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVNelF6dEJRVU5CTEUxQlFVMDdRVUZEVGl4UlFVRlJMRU5CUVVNc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eGhRVUZoTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVOcVJDeFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRkZCUVZFc1EwRkJReXhQUVVGUExFTkJRVU1zVFVGQlRTeERRVUZETzBGQlEzWkRMRkZCUVZFN1FVRkRVaXhSUVVGUkxFdEJRVXNzUTBGQlF5eFpRVUZaTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRia01zVVVGQlVTeFRRVUZUTzBGQlEycENMRTlCUVU4N1FVRkRVRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNUVUZCVFR0QlFVTk9MRkZCUVZFc1EwRkJReXhEUVVGRExFdEJRVXNzUTBGQlF5eFZRVUZWTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVNM1F5eFJRVUZSTEVOQlFVTXNTMEZCU3l4RFFVRkRMRXRCUVVzc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRE5VSXNVVUZCVVN4RFFVRkRMRXRCUVVzc1EwRkJReXhSUVVGUkxFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXp0QlFVTjJRenRCUVVOQkxGRkJRVkVzVTBGQlV6dEJRVU5xUWp0QlFVTkJMRTFCUVUwc1MwRkJTeXhEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTTVRaXhMUVVGTE8wRkJRMHdzUjBGQlJ6dEJRVU5JTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFVkJRVVVzZDBKQlFYZENMRU5CUVVNc1RVRkJUU3hGUVVGRkxGTkJRVk1zUlVGQlJUdEJRVU01UXl4SlFVRkpMRXRCUVVzc1NVRkJTU3hUUVVGVExFbEJRVWtzU1VGQlNTeERRVUZETEZGQlFWRXNSVUZCUlR0QlFVTjZReXhOUVVGTkxFbEJRVWtzUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXl4UlFVRlJMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE0wTTdRVUZEUVN4TlFVRk5PMEZCUTA0c1VVRkJVU3hEUVVGRExFTkJRVU1zUTBGQlF5eExRVUZMTEVOQlFVTXNZVUZCWVN4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU03UVVGRGFrUXNVVUZCVVN4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTNoRExGRkJRVkVzUzBGQlN5eERRVUZETEV0QlFVc3NRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkRNMElzVVVGQlVUdEJRVU5TTEZGQlFWRXNTMEZCU3l4RFFVRkRMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU5vUXl4UlFVRlJMRk5CUVZNN1FVRkRha0lzVDBGQlR6dEJRVU5RTzBGQlEwRXNUVUZCVFR0QlFVTk9MRkZCUVZFc1EwRkJReXhEUVVGRExFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRE8wRkJRemxETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1MwRkJTeXhEUVVGRExGRkJRVkVzUTBGQlF5eFBRVUZQTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUTNwRExGRkJRVkVzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3l4RFFVRkRMRTFCUVUwc1EwRkJRenRCUVVNMVFpeFJRVUZSTzBGQlExSXNVVUZCVVN4TFFVRkxMRU5CUVVNc1dVRkJXU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlEyNURMRkZCUVZFc1UwRkJVenRCUVVOcVFpeFBRVUZQTzBGQlExQXNTMEZCU3p0QlFVTk1MRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNSVUZCUlN4UlFVRlJMRU5CUVVNc1ZVRkJWU3hGUVVGRk8wRkJRM1pDTEVsQlFVa3NTVUZCU1N4SFFVRkhMRWRCUVVjc1VVRkJVU3hEUVVGRExGVkJRVlVzUTBGQlF5eERRVUZETzBGQlEyNURMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOdVF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4TFFVRkxMRVZCUVVVN1FVRkRhRUlzVFVGQlRTeEpRVUZKTEVOQlFVTXNVVUZCVVN4RFFVRkRMRWRCUVVjc1EwRkJReXhIUVVGSExFdEJRVXNzUjBGQlJ5eEpRVUZKTEV0QlFVc3NRMEZCUXl4VlFVRlZMRVZCUVVVc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlEzUkZMRXRCUVVzN1FVRkRUQ3hKUVVGSkxFOUJRVThzUzBGQlN5eERRVUZETzBGQlEycENMRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVWQlFVVXNTMEZCU3l4SFFVRkhPMEZCUTFZc1NVRkJTU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEYmtJc1NVRkJTU3hMUVVGTExFbEJRVWtzVTBGQlV5eEpRVUZKTEVsQlFVa3NRMEZCUXl4UlFVRlJMRVZCUVVVN1FVRkRla01zVFVGQlRTeExRVUZMTEVOQlFVTXNVMEZCVXl4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXl4TFFVRkxMRVZCUVVVc1EwRkJRenRCUVVNeFJDeExRVUZMTzBGQlEwd3NTVUZCU1N4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVOcVFpeEhRVUZITzBGQlEwZ3NRMEZCUXpzN1FVTXZSMDBzVFVGQlRTeFRRVUZUTEVOQlFVTTdRVUZEZGtJc1JVRkJSU3hYUVVGWExFTkJRVU1zUzBGQlN5eEZRVUZGTzBGQlEzSkNMRWxCUVVrc1NVRkJTU3hMUVVGTExFdEJRVXNzUzBGQlN5eEZRVUZGTzBGQlEzcENMRTFCUVUwc1RVRkJUU3hOUVVGTkxFZEJRVWNzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4TlFVRk5MRU5CUVVNN1FVRkROME03UVVGRFFTeE5RVUZOTEV0QlFVc3NUVUZCVFN4SFFVRkhMRWxCUVVrc1RVRkJUU3hGUVVGRk8wRkJRMmhETEZGQlFWRXNTVUZCU1N4TFFVRkxMRWxCUVVrc1MwRkJTeXhEUVVGRExHTkJRV01zUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlR0QlFVTm9SQ3hWUVVGVkxFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSMEZCUnl4TFFVRkxMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFrTXNVMEZCVXl4TlFVRk5PMEZCUTJZc1ZVRkJWU3hOUVVGTkxGVkJRVlVzUjBGQlJ5eE5RVUZOTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNN1FVRkRla01zVlVGQlZTeEpRVUZKTEZWQlFWVXNRMEZCUXl4alFVRmpMRU5CUVVNc1UwRkJVeXhEUVVGRExFVkJRVVU3UVVGRGNFUXNXVUZCV1N4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1ZVRkJWU3hEUVVGRExFOUJRVThzUTBGQlF5eERRVUZETzBGQlEyeEZMRmRCUVZjc1RVRkJUVHRCUVVOcVFpeFpRVUZaTEUxQlFVMHNTVUZCU1N4SFFVRkhMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU03UVVGRGVrTXNXVUZCV1N4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4SlFVRkpMRU5CUVVNc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGFrUXNWMEZCVnp0QlFVTllMRk5CUVZNN1FVRkRWQ3hQUVVGUE8wRkJRMUFzUzBGQlN6dEJRVU5NTzBGQlEwRXNTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhIUVVGSExFbEJRVWtzUTBGQlF6dEJRVU4wUWl4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxFbEJRVWtzUTBGQlF5eE5RVUZOTEVWQlFVVTdRVUZEWml4SlFVRkpMRTFCUVUwc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUXpORE8wRkJRMEVzU1VGQlNTeExRVUZMTEUxQlFVMHNSMEZCUnl4SlFVRkpMRTFCUVUwc1JVRkJSVHRCUVVNNVFpeE5RVUZOTEUxQlFVMHNTVUZCU1N4SFFVRkhMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU12UWp0QlFVTkJMRTFCUVUwc1NVRkJTU3hOUVVGTkxFTkJRVU1zWTBGQll5eERRVUZETEVkQlFVY3NRMEZCUXl4RlFVRkZPMEZCUTNSRExGRkJRVkVzU1VGQlNTeERRVUZETEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1RVRkJUU3hGUVVGRkxFbEJRVWtzUlVGQlJTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTXhReXhQUVVGUE8wRkJRMUFzUzBGQlN6dEJRVU5NTzBGQlEwRXNTVUZCU1N4UFFVRlBMRWxCUVVrc1EwRkJRenRCUVVOb1FpeEhRVUZITzBGQlEwZzdRVUZEUVN4RlFVRkZMRXRCUVVzc1IwRkJSenRCUVVOV0xFbEJRVWtzVDBGQlR5eEpRVUZKTEVsQlFVa3NRMEZCUXl4WFFVRlhMRVZCUVVVc1EwRkJReXhKUVVGSkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZETjBNc1IwRkJSenRCUVVOSU8wRkJRMEVzUlVGQlJTeExRVUZMTEVkQlFVYzdRVUZEVml4SlFVRkpMRTFCUVUwc1RVRkJUU3hIUVVGSExFbEJRVWtzUTBGQlF5eFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRPMEZCUXpORE8wRkJRMEVzU1VGQlNTeExRVUZMTEUxQlFVMHNSMEZCUnl4SlFVRkpMRTFCUVUwc1JVRkJSVHRCUVVNNVFpeE5RVUZOTEUxQlFVMHNWVUZCVlN4SFFVRkhMRTFCUVUwc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU55UXp0QlFVTkJMRTFCUVUwc1NVRkJTU3hWUVVGVkxFTkJRVU1zWTBGQll5eERRVUZETEZOQlFWTXNRMEZCUXl4RlFVRkZPMEZCUTJoRUxGRkJRVkVzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJReXhKUVVGSkxFTkJRVU1zUzBGQlN5eERRVUZETEZWQlFWVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1EwRkJRenRCUVVNNVJDeFBRVUZQTEUxQlFVMDdRVUZEWWl4UlFVRlJMRTFCUVUwc1NVRkJTU3hIUVVGSExGVkJRVlVzUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZEY2tNc1VVRkJVU3hKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZETjBNc1QwRkJUenRCUVVOUUxFdEJRVXM3UVVGRFRDeEhRVUZITzBGQlEwZzdRVUZEUVN4RlFVRkZMRTlCUVU4c1IwRkJSenRCUVVOYUxFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZPMEZCUTNCQ0xFMUJRVTBzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGREwwSXNTMEZCU3p0QlFVTk1MRWRCUVVjN1FVRkRTQ3hEUVVGRE8wRkJRMFE3UVVGRFFTeFRRVUZUTEVOQlFVTXNUVUZCVFN4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVOMFFpeFRRVUZUTEVOQlFVTXNWMEZCVnl4SFFVRkhMRWxCUVVrc1EwRkJRenM3UVVNNVJIUkNMRTFCUVUwc2IwSkJRVzlDTEZOQlFWTXNVMEZCVXl4RFFVRkRMRVZCUVVVN1FVRkRkRVE3UVVGRFFTeHZRa0ZCYjBJc1EwRkJReXh6UWtGQmMwSXNSMEZCUnl4SlFVRkpMRU5CUVVNN08wRkRSVzVFTEUxQlFVMHNWVUZCVlN4VFFVRlRMRlZCUVZVc1EwRkJRenRCUVVOd1F5eEZRVUZGTEZkQlFWY3NRMEZCUXl4aFFVRmhMRVZCUVVVc1YwRkJWeXhGUVVGRkxGZEJRVmNzUlVGQlJUdEJRVU4yUkN4SlFVRkpMRXRCUVVzc1EwRkJReXhYUVVGWExFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEYkVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zWVVGQllTeEhRVUZITEdGQlFXRXNRMEZCUXp0QlFVTjJRenRCUVVOQkxFbEJRVWtzU1VGQlNTeFBRVUZQTEZkQlFWY3NTMEZCU3l4WFFVRlhMRVZCUVVVN1FVRkROVU1zVFVGQlRTeEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wRkJReTlDTEV0QlFVczdRVUZEVEN4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxFMUJRVTBzUTBGQlF5eExRVUZMTEVWQlFVVTdRVUZEYUVJc1NVRkJTU3hMUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1MwRkJTeXhGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEzQkRMRTFCUVUwc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zUTBGQlF6dEJRVU14UkN4TlFVRk5MRXRCUVVzc1EwRkJReXhMUVVGTExFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzcENMRTFCUVUwc1NVRkJTU3hEUVVGRExGRkJRVkVzUTBGQlF5eEpRVUZKTEVOQlFVTXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRhRU1zUzBGQlN6dEJRVU5NTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1NVRkJTU3hMUVVGTExFTkJRVU03UVVGRGVFSXNSMEZCUnp0QlFVTklMRU5CUVVNN1FVRkRSRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNRVUZCVHl4TlFVRk5MR0ZCUVdFc1EwRkJRenRCUVVNelFpeEZRVUZGTEZkQlFWY3NRMEZCUXl4TFFVRkxMRVZCUVVVN1FVRkRja0lzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVOMlFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUjBGQlJ5eExRVUZMTEVOQlFVTXNhVUpCUVdsQ0xFTkJRVU03UVVGRGNrUTdRVUZEUVR0QlFVTkJMRWxCUVVrc1NVRkJTU3hEUVVGRExGTkJRVk1zUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEZUVJc1NVRkJTU3hKUVVGSkxFTkJRVU1zWVVGQllTeEhRVUZITEVOQlFVTXNRMEZCUXp0QlFVTXpRanRCUVVOQkxFbEJRVWtzU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU12UWp0QlFVTkJMRWxCUVVrc1NVRkJTU3hEUVVGRExHRkJRV0VzUjBGQlJ5eEpRVUZKTEZsQlFWa3NRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOb1JDeEpRVUZKTEVsQlFVa3NRMEZCUXl4bFFVRmxMRWRCUVVjc1NVRkJTU3hsUVVGbExFVkJRVVVzUTBGQlF6dEJRVU5xUkN4SlFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzU1VGQlNTeFZRVUZWTzBGQlEzSkRMRTFCUVUwc1NVRkJTVHRCUVVOV0xFMUJRVTBzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1YwRkJWenRCUVVOd1F5eE5RVUZOTEVsQlFVa3NRMEZCUXl4TFFVRkxMRU5CUVVNc1QwRkJUeXhEUVVGRExHTkJRV003UVVGRGRrTXNTMEZCU3l4RFFVRkRPMEZCUTA0N1FVRkRRVHRCUVVOQkxFbEJRVWtzU1VGQlNTeERRVUZETERoQ1FVRTRRaXhIUVVGSExFVkJRVVVzUTBGQlF6dEJRVU0zUXl4SlFVRkpMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNSMEZCUnl4RlFVRkZMRU5CUVVNN1FVRkRMMElzU1VGQlNTeEpRVUZKTEVOQlFVTXNjMEpCUVhOQ0xFZEJRVWNzU1VGQlNTeERRVUZETzBGQlEzWkRMRWRCUVVjN1FVRkRTRHRCUVVOQkxFVkJRVVVzWlVGQlpTeERRVUZETEVsQlFVa3NSVUZCUlR0QlFVTjRRaXhKUVVGSkxFOUJRVThzU1VGQlNTeERRVUZETEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEzWkRMRWRCUVVjN1FVRkRTRHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVWQlFVVXNXVUZCV1N4RFFVRkRMRWxCUVVrc1JVRkJSVHRCUVVOeVFpeEpRVUZKTEVsQlFVa3NUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zVDBGQlR5eEZRVUZGTEVOQlFVTTdRVUZETlVNc1NVRkJTU3hOUVVGTkxFTkJRVU1zUzBGQlN5eEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTjRRaXhKUVVGSkxFMUJRVTBzUTBGQlF5eEpRVUZKTEVkQlFVY3NTVUZCU1N4SlFVRkpMRVZCUVVVc1EwRkJRenRCUVVNM1FpeEpRVUZKTEVsQlFVa3NTVUZCU1N4RlFVRkZPMEZCUTJRc1RVRkJUU3hKUVVGSkxFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdEJRVU4yUXl4UlFVRlJMRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eGhRVUZoTEVWQlFVVXNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJReXhEUVVGRExFTkJRVU03UVVGRE5VUXNUMEZCVHl4TlFVRk5PMEZCUTJJc1VVRkJVU3hKUVVGSkxFTkJRVU1zWjBKQlFXZENMRU5CUVVNc1NVRkJTU3hEUVVGRExFZEJRVWNzVFVGQlRTeERRVUZETzBGQlF6ZERMRTlCUVU4N1FVRkRVQ3hMUVVGTE8wRkJRMHc3UVVGRFFTeEpRVUZKTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFMUJRVTBzUTBGQlF5eERRVUZETzBGQlEyaERMRWxCUVVrc1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eGhRVUZoTEVOQlFVTXNZMEZCWXl4RlFVRkZMRTFCUVUwc1EwRkJReXhEUVVGRE8wRkJReTlFTEVsQlFVa3NUMEZCVHl4TlFVRk5MRU5CUVVNN1FVRkRiRUlzUjBGQlJ6dEJRVU5JTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVWQlFVVXNhMEpCUVd0Q0xFTkJRVU1zVFVGQlRTeEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MRVZCUVVVN1FVRkRhRVFzU1VGQlNTeEpRVUZKTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4VlFVRlZMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eEZRVUZGTzBGQlEyeEZMRTFCUVUwc1RVRkJUU3hKUVVGSkxFdEJRVXM3UVVGRGNrSXNVVUZCVVN4RFFVRkRMSGxEUVVGNVF5eEZRVUZGTEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM0pGTEU5QlFVOHNRMEZCUXp0QlFVTlNMRXRCUVVzN1FVRkRURHRCUVVOQkxFbEJRVWtzU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4bFFVRmxMRU5CUVVNc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eEZRVUZGTzBGQlEzQkVPMEZCUTBFc1RVRkJUU3hQUVVGUExFTkJRVU1zU1VGQlNUdEJRVU5zUWl4UlFVRlJMREJEUVVFd1F6dEJRVU5zUkN4UlFVRlJMRTFCUVUwN1FVRkRaQ3hSUVVGUkxGTkJRVk1zUTBGQlF5eEpRVUZKTzBGQlEzUkNMRTlCUVU4c1EwRkJRenRCUVVOU0xFMUJRVTBzVDBGQlR6dEJRVU5pTEV0QlFVczdRVUZEVER0QlFVTkJMRWxCUVVrc1RVRkJUU3hEUVVGRExHVkJRV1VzUTBGQlF5eEpRVUZKTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRNME03UVVGRFFTeEpRVUZKTEVsQlFVa3NVMEZCVXl4RFFVRkRMRk5CUVZNc1MwRkJTeXh2UWtGQmIwSXNSVUZCUlR0QlFVTjBSQ3hOUVVGTkxFMUJRVTBzUTBGQlF5eHJRa0ZCYTBJc1JVRkJSU3hEUVVGRE8wRkJRMnhETEV0QlFVczdRVUZEVER0QlFVTkJMRWxCUVVrc1NVRkJTU3hoUVVGaExFZEJRVWNzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eHBRa0ZCYVVJN1FVRkRkRVVzVFVGQlRTeFRRVUZUTzBGQlEyWXNTMEZCU3l4RFFVRkRPMEZCUTA0N1FVRkRRU3hKUVVGSkxFbEJRVWtzVTBGQlV5eEhRVUZITEdGQlFXRTdRVUZEYWtNc1VVRkJVU3hoUVVGaExFTkJRVU1zVDBGQlR5eEZRVUZGTzBGQlF5OUNMRkZCUVZFc1NVRkJTU3hUUVVGVExFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTTdRVUZET1VJN1FVRkRRU3hKUVVGSkxFbEJRVWtzWVVGQllTeEpRVUZKTEUxQlFVMHNSVUZCUlR0QlFVTnFReXhOUVVGTkxGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkROMElzUzBGQlN6dEJRVU5NTzBGQlEwRXNTVUZCU1N4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4VFFVRlRMRU5CUVVNN1FVRkRia1E3UVVGRFFTeEpRVUZKTEVsQlFVa3NRMEZCUXl4aFFVRmhMRU5CUVVNc2MwSkJRWE5DTEVOQlFVTXNUVUZCVFN4RlFVRkZMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRMnBGTEVsQlFVa3NTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4elFrRkJjMElzUTBGQlF5eFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTnVSVHRCUVVOQkxFbEJRVWtzU1VGQlNTeERRVUZETEdWQlFXVXNRMEZCUXl4aFFVRmhMRU5CUVVNc1pVRkJaU3hGUVVGRkxFMUJRVTBzUlVGQlJTeFRRVUZUTEVOQlFVTXNRMEZCUXp0QlFVTXpSU3hIUVVGSE8wRkJRMGc3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU3hGUVVGRkxIRkNRVUZ4UWl4RFFVRkRMRTFCUVUwc1JVRkJSU3hUUVVGVExFVkJRVVVzVjBGQlZ5eEZRVUZGTzBGQlEzaEVMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWNzVFVGQlRTeERRVUZETEdWQlFXVXNRMEZCUXl4UFFVRlBMRU5CUVVNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRE1VUXNTVUZCU1N4SlFVRkpMRU5CUVVNc1EwRkJReXhMUVVGTExFVkJRVVVzVDBGQlR6dEJRVU40UWp0QlFVTkJMRWxCUVVrc1NVRkJTU3hEUVVGRExHVkJRV1VzUTBGQlF5eGhRVUZoTEVOQlFVTXNaMEpCUVdkQ0xFVkJRVVVzVFVGQlRTeEZRVUZGTEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpWRk8wRkJRMEVzU1VGQlNTeEpRVUZKTEZkQlFWY3NSVUZCUlR0QlFVTnlRaXhOUVVGTkxFbEJRVWtzUTBGQlF5d3dRa0ZCTUVJc1EwRkJReXhOUVVGTkxFVkJRVVVzVTBGQlV5eEZRVUZGTEV0QlFVc3NRMEZCUXl4RFFVRkRPMEZCUTJoRkxFdEJRVXNzVFVGQlRUdEJRVU5ZTEUxQlFVMHNTVUZCU1N4TlFVRk5MRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNUVUZCVFN4TFFVRkxMRU5CUVVNN1FVRkRja1FzVVVGQlVTeEpRVUZKTEVOQlFVTXNPRUpCUVRoQ0xFTkJRVU1zU1VGQlNTeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTNwRU8wRkJRMEVzVFVGQlRTeE5RVUZOTEVOQlFVTXNaVUZCWlN4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZET1VNc1RVRkJUU3hOUVVGTkxFTkJRVU1zZFVKQlFYVkNMRU5CUVVNc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlEzSkVPMEZCUTBFc1RVRkJUU3hKUVVGSkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkROME1zVFVGQlRTeE5RVUZOTEVOQlFVTXNiVUpCUVcxQ0xFTkJRVU1zWVVGQllTeERRVUZETzBGQlF5OURMRkZCUVZFc1RVRkJUU3hEUVVGRExGZEJRVmNzUTBGQlF5eGhRVUZoTEVOQlFVTXNRMEZCUXp0QlFVTXhReXhOUVVGTkxFOUJRVThzVFVGQlRTeERRVUZETEZkQlFWY3NRMEZCUXl4aFFVRmhMRU5CUVVNc1EwRkJRenRCUVVNdlF5eExRVUZMTzBGQlEwdzdRVUZEUVR0QlFVTkJMRWxCUVVrc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eDNRa0ZCZDBJc1EwRkJReXhOUVVGTkxFVkJRVVVzVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEYmtVN1FVRkRRU3hKUVVGSkxFbEJRVWtzVTBGQlV5eERRVUZETEZOQlFWTXNTMEZCU3l4dlFrRkJiMElzUlVGQlJUdEJRVU4wUkN4TlFVRk5MRTFCUVUwc1EwRkJReXhyUWtGQmEwSXNSVUZCUlN4RFFVRkRPMEZCUTJ4RE8wRkJRMEU3UVVGRFFTeE5RVUZOTEVsQlFVa3NUVUZCVFN4RFFVRkRMR3RDUVVGclFpeExRVUZMTEVOQlFVTXNTVUZCU1N4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVU3UVVGRE5VUXNVVUZCVVN4TlFVRk5MRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03UVVGRGVFSXNUMEZCVHp0QlFVTlFMRXRCUVVzN1FVRkRUQ3hIUVVGSE8wRkJRMGc3UVVGRFFTeEZRVUZGTERCQ1FVRXdRaXhEUVVGRExFMUJRVTBzUlVGQlJTeFRRVUZUTEVWQlFVVXNTMEZCU3l4RlFVRkZPMEZCUTNaRU8wRkJRMEVzU1VGQlNTeE5RVUZOTEVOQlFVTXNaVUZCWlN4RFFVRkRMRTFCUVUwc1EwRkJReXhMUVVGTExFVkJRVVVzUTBGQlF5eERRVUZETEVOQlFVTTdRVUZETlVNc1NVRkJTU3hKUVVGSkxHRkJRV0VzUjBGQlJ5eFBRVUZQTEVOQlFVTXNVMEZCVXl4RFFVRkRMRU5CUVVNN1FVRkRNME1zU1VGQlNTeEpRVUZKTEZOQlFWTXNSMEZCUnl4TlFVRk5MRU5CUVVNc1YwRkJWeXhEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETzBGQlEzUkVMRWxCUVVrc1QwRkJUeXhOUVVGTkxFTkJRVU1zVjBGQlZ5eERRVUZETEdGQlFXRXNRMEZCUXl4RFFVRkRPMEZCUXpkRExFbEJRVWtzVTBGQlV5eERRVUZETEU5QlFVOHNSVUZCUlN4RFFVRkRPMEZCUTNoQ0xFbEJRVWtzU1VGQlNTeERRVUZETEV0QlFVc3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5d3dRa0ZCTUVJc1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU4yUlN4SFFVRkhPMEZCUTBnN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVWQlFVVXNlVUpCUVhsQ0xFTkJRVU1zVFVGQlRTeEZRVUZGTEZkQlFWY3NSVUZCUlR0QlFVTnFSQ3hKUVVGSkxFbEJRVWtzVlVGQlZTeEhRVUZITEUxQlFVMHNRMEZCUXl4bFFVRmxMRU5CUVVNN1FVRkROVU03UVVGRFFTeEpRVUZKTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1ZVRkJWU3hEUVVGRExFMUJRVTBzUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRExFVkJRVVVzUlVGQlJUdEJRVU55UkN4TlFVRk5MRWxCUVVrc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEZOQlFWTXNTMEZCU3l4dlFrRkJiMEk3UVVGRE1VUXNVVUZCVVN4SlFVRkpMRU5CUVVNc2NVSkJRWEZDTEVOQlFVTXNUVUZCVFN4RlFVRkZMRlZCUVZVc1EwRkJReXhEUVVGRExFTkJRVU1zUlVGQlJTeFhRVUZYTEVOQlFVTXNRMEZCUXp0QlFVTjJSU3hMUVVGTE8wRkJRMHdzUjBGQlJ6dEJRVU5JTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFVkJRVVVzV1VGQldTeERRVUZETEUxQlFVMHNSVUZCUlN4WFFVRlhMRVZCUVVVN1FVRkRjRU1zU1VGQlNTeEpRVUZKTEV0QlFVc3NSMEZCUnl4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFOUJRVThzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTXZRenRCUVVOQkxFbEJRVWtzU1VGQlNTeERRVUZETEVOQlFVTXNTMEZCU3l4RlFVRkZMRTFCUVUwc1NVRkJTU3hMUVVGTExFTkJRVU1zYjBOQlFXOURMRU5CUVVNc1EwRkJRenRCUVVOMlJUdEJRVU5CTEVsQlFVa3NUVUZCVFN4RFFVRkRMRXRCUVVzc1IwRkJSeXhMUVVGTExFTkJRVU03UVVGRGVrSTdRVUZEUVN4SlFVRkpMRWxCUVVrc1RVRkJUU3hEUVVGRExHdENRVUZyUWl4TFFVRkxMRU5CUVVNc1JVRkJSVHRCUVVONlF6dEJRVU5CTEUxQlFVMHNTVUZCU1N4RFFVRkRMR1ZCUVdVc1EwRkJReXhoUVVGaExFTkJRVU1zWTBGQll5eEZRVUZGTEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJwRkxFMUJRVTBzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4bFFVRmxMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGFrUXNUVUZCVFN4SlFVRkpMRmRCUVZjc1MwRkJTeXhKUVVGSkxFVkJRVVU3UVVGRGFFTXNVVUZCVVN4SlFVRkpMRU5CUVVNc1kwRkJZeXhEUVVGRExFMUJRVTBzUlVGQlJTeExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTXpReXhQUVVGUExFMUJRVTA3UVVGRFlpeFJRVUZSTEVsQlFVa3NRMEZCUXl4blFrRkJaMElzUTBGQlF5eEpRVUZKTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRNME1zVDBGQlR6dEJRVU5RTEV0QlFVczdRVUZEVER0QlFVTkJMRWxCUVVrc1NVRkJTU3hEUVVGRExIbENRVUY1UWl4RFFVRkRMRTFCUVUwc1JVRkJSU3hYUVVGWExFTkJRVU1zUTBGQlF6dEJRVU40UkN4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxHTkJRV01zUTBGQlF5eE5RVUZOTEVWQlFVVXNTMEZCU3l4RlFVRkZPMEZCUTJoRExFbEJRVWtzU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TlFVRk5MRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzQkRPMEZCUTBFc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVWQlFVVTdRVUZETlVNc1RVRkJUU3hQUVVGUExFbEJRVWtzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhOUVVGTkxFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEYUVRc1MwRkJTenRCUVVOTUxFbEJRVWtzVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRGFrTXNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUlVGQlJTeHBRa0ZCYVVJc1IwRkJSenRCUVVOMFFpeEpRVUZKTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eE5RVUZOTEVkQlFVY3NRMEZCUXl4RlFVRkZMRU5CUVVNc1NVRkJTU3hEUVVGRExFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZEZWtRc1RVRkJUU3hKUVVGSkxFTkJRVU1zV1VGQldTeERRVUZETEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJReXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU16UXl4TFFVRkxPMEZCUTB3c1IwRkJSenRCUVVOSU8wRkJRMEVzUlVGQlJTeHpRa0ZCYzBJc1IwRkJSenRCUVVNelFpeEpRVUZKTEVsQlFVa3NRMEZCUXl4SlFVRkpMRU5CUVVNc2MwSkJRWE5DTEVWQlFVVTdRVUZEZEVNc1RVRkJUU3hQUVVGUE8wRkJRMklzUzBGQlN6dEJRVU5NTzBGQlEwRXNTVUZCU1N4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMR2RDUVVGblFpeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVNelJDeE5RVUZOTEVsQlFVa3NUVUZCVFN4SFFVRkhMRWxCUVVrc1EwRkJReXhuUWtGQlowSXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVNMVF5eE5RVUZOTEVsQlFVa3NTMEZCU3l4SFFVRkhMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU1zVDBGQlR5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJwRUxFMUJRVTBzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4TlFVRk5MRVZCUVVVc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRGVrTXNTMEZCU3p0QlFVTk1MRWxCUVVrc1NVRkJTU3hEUVVGRExHZENRVUZuUWl4RFFVRkRMRTFCUVUwc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGNrTTdRVUZEUVN4SlFVRkpMRXRCUVVzc1NVRkJTU3hEUVVGRExFZEJRVWNzUTBGQlF5eEZRVUZGTEVOQlFVTXNSMEZCUnl4SlFVRkpMRU5CUVVNc09FSkJRVGhDTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRM3BGTEUxQlFVMHNTVUZCU1N4TlFVRk5MRWRCUVVjc1NVRkJTU3hEUVVGRExEaENRVUU0UWl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRekZFTEUxQlFVMHNUMEZCVHl4TlFVRk5MRU5CUVVNc2RVSkJRWFZDTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1JVRkJSVHRCUVVONFJDeFJRVUZSTEVsQlFVa3NVMEZCVXl4SFFVRkhMRTFCUVUwc1EwRkJReXgxUWtGQmRVSXNRMEZCUXl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVNM1JEdEJRVU5CTEZGQlFWRXNTVUZCU1N4aFFVRmhMRWRCUVVjc1QwRkJUeXhEUVVGRExGTkJRVk1zUTBGQlF5eERRVUZETzBGQlF5OURMRkZCUVZFc1NVRkJTU3hUUVVGVExFZEJRVWNzVFVGQlRTeERRVUZETEcxQ1FVRnRRaXhEUVVGRExHRkJRV0VzUTBGQlF5eERRVUZETzBGQlEyeEZMRkZCUVZFc1QwRkJUeXhOUVVGTkxFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1lVRkJZU3hEUVVGRExFTkJRVU03UVVGRGVrUXNVVUZCVVN4VFFVRlRMRU5CUVVNc1QwRkJUeXhGUVVGRkxFTkJRVU03UVVGRE5VSXNVVUZCVVN4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExHbENRVUZwUWl4RFFVRkRMREJDUVVFd1FpeERRVUZETEZOQlFWTXNRMEZCUXl4RFFVRkRPMEZCUXpORk8wRkJRMEU3UVVGRFFTeFBRVUZQTzBGQlExQXNTMEZCU3p0QlFVTk1PMEZCUTBFc1NVRkJTU3hKUVVGSkxFTkJRVU1zT0VKQlFUaENMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU51UkN4SFFVRkhPMEZCUTBnN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTEVWQlFVVXNaVUZCWlN4RFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVNNVFpeEpRVUZKTEU5QlFVOHNTVUZCU1N4RFFVRkRMR0ZCUVdFc1EwRkJReXhSUVVGUkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEYmtRc1IwRkJSenRCUVVOSU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJMRVZCUVVVc1MwRkJTeXhIUVVGSE8wRkJRMVlzU1VGQlNTeFBRVUZQTEVsQlFVa3NRMEZCUXl4VFFVRlRMRU5CUVVNc1RVRkJUU3hEUVVGRE8wRkJRMnBETEVkQlFVYzdRVUZEU0R0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQkxFVkJRVVVzUzBGQlN5eEhRVUZITzBGQlExWXNTVUZCU1N4SlFVRkpMRXRCUVVzc1IwRkJSenRCUVVOb1FpeE5RVUZOTEZkQlFWY3NSVUZCUlN4SlFVRkpMRU5CUVVNc1UwRkJVeXhEUVVGRExFMUJRVTA3UVVGRGVFTXNUVUZCVFN4VlFVRlZMRVZCUVVVc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRkZCUVZFc1EwRkJReXhEUVVGRExFMUJRVTA3UVVGRGFrVXNUVUZCVFN4UFFVRlBMRVZCUVVVc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eExRVUZMTEVWQlFVVTdRVUZEZWtNc1RVRkJUU3huUWtGQlowSXNSVUZCUlN4TlFVRk5MRU5CUVVNc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhqUVVGakxFTkJRVU03UVVGRE1VVXNVMEZCVXl4TlFVRk5PMEZCUTJZc1RVRkJUU3hoUVVGaExFVkJRVVVzUlVGQlJUdEJRVU4yUWl4TlFVRk5MR1ZCUVdVc1JVRkJSU3hKUVVGSkxFTkJRVU1zWlVGQlpTeERRVUZETEV0QlFVczdRVUZEYWtRc1MwRkJTeXhEUVVGRE8wRkJRMDQ3UVVGRFFTeEpRVUZKTEV0QlFVc3NTVUZCU1N4TFFVRkxMRWxCUVVrc1NVRkJTU3hEUVVGRExHbENRVUZwUWl4RFFVRkRMR05CUVdNc1JVRkJSVHRCUVVNM1JDeE5RVUZOTEVsQlFVa3NTVUZCU1N4SFFVRkhMRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4alFVRmpMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRE9VUXNUVUZCVFN4TFFVRkxMRU5CUVVNc1lVRkJZU3hEUVVGRExFdEJRVXNzUTBGQlF5eEhRVUZITzBGQlEyNURMRkZCUVZFc1NVRkJTU3hGUVVGRkxFbEJRVWtzUTBGQlF5eFRRVUZUTEVWQlFVVTdRVUZET1VJc1VVRkJVU3hKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEV0QlFVczdRVUZEZUVJc1QwRkJUeXhEUVVGRE8wRkJRMUlzUzBGQlN6dEJRVU5NTzBGQlEwRXNTVUZCU1N4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVOcVFpeEhRVUZITzBGQlEwZ3NRMEZCUXp0QlFVTkVPMEZCUTBFc1RVRkJUU3hqUVVGakxFZEJRVWNzTmtKQlFUWkNMRU5CUVVNN1FVRkRja1FzVFVGQlRTeGpRVUZqTEVkQlFVY3NPRUpCUVRoQ0xFTkJRVU03UVVGRGRFUXNUVUZCVFN4bFFVRmxMRWRCUVVjc0swSkJRU3RDTEVOQlFVTTdRVUZEZUVRc1RVRkJUU3huUWtGQlowSXNSMEZCUnl4blEwRkJaME1zUTBGQlF6czdRVU4wVkc1RUxFMUJRVTBzWjBKQlFXZENMRU5CUVVNN1FVRkRPVUlzUlVGQlJTeFhRVUZYTEVkQlFVYzdRVUZEYUVJc1NVRkJTU3hKUVVGSkxFTkJRVU1zVlVGQlZTeEhRVUZITEVWQlFVVXNRMEZCUXp0QlFVTjZRaXhKUVVGSkxFbEJRVWtzUTBGQlF5eGpRVUZqTEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUXpkQ0xFbEJRVWtzU1VGQlNTeERRVUZETEdGQlFXRXNSMEZCUnl4RlFVRkZMRU5CUVVNN1FVRkROVUlzUjBGQlJ6dEJRVU5JTzBGQlEwRXNSVUZCUlN4cFFrRkJhVUlzUTBGQlF5eFRRVUZUTEVWQlFVVXNWVUZCVlN4RlFVRkZPMEZCUXpORExFbEJRVWtzU1VGQlNTeEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdEJRVU42UXl4TlFVRk5MRTlCUVU4c1EwRkJReXhKUVVGSkxFTkJRVU1zUTBGQlF5eHBRa0ZCYVVJc1JVRkJSU3hUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEhGQ1FVRnhRaXhEUVVGRExFTkJRVU1zUTBGQlF6dEJRVU01UlN4TlFVRk5MRTlCUVU4N1FVRkRZaXhMUVVGTE8wRkJRMHc3UVVGRFFTeEpRVUZKTEUxQlFVMHNUVUZCVFN4SFFVRkhMRk5CUVZNc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRGNFTTdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhOUVVGTkxFVkJRVVU3UVVGRGFrSXNUVUZCVFN4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExFTkJRVU1zVjBGQlZ5eEZRVUZGTEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc2VVSkJRWGxDTEVOQlFVTXNRMEZCUXl4RFFVRkRPMEZCUXk5RkxFdEJRVXM3UVVGRFREdEJRVU5CTEVsQlFVa3NTMEZCU3l4TlFVRk5MRkZCUVZFc1NVRkJTU3hOUVVGTkxFVkJRVVU3UVVGRGJrTXNUVUZCVFN4TlFVRk5MRWxCUVVrc1IwRkJSeXhOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEY0VNN1FVRkRRU3hOUVVGTkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNTVUZCU1N4RlFVRkZPMEZCUTNSQ0xGRkJRVkVzVFVGQlRTeEpRVUZKTEV0QlFVczdRVUZEZGtJc1ZVRkJWU3hEUVVGRExEaENRVUU0UWl4RlFVRkZMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zY1VKQlFYRkNMRVZCUVVVc1VVRkJVU3hEUVVGRExGZEJRVmNzUTBGQlF6dEJRVU4wUnl4VFFVRlRMRU5CUVVNN1FVRkRWaXhQUVVGUE8wRkJRMUFzUzBGQlN6dEJRVU5NTzBGQlEwRXNTVUZCU1N4SlFVRkpMRU5CUVVNc1ZVRkJWU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNSMEZCUnl4VFFVRlRMRU5CUVVNN1FVRkRhRVFzU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVOQlFVTTdRVUZETTBNN1FVRkRRU3hKUVVGSkxFbEJRVWtzVlVGQlZTeExRVUZMTEZOQlFWTXNSVUZCUlR0QlFVTnNReXhOUVVGTkxGVkJRVlVzUjBGQlJ5eEpRVUZKTEZWQlFWVXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVNM1F5eExRVUZMTEUxQlFVMHNTVUZCU1N4VlFVRlZMRXRCUVVzc1MwRkJTeXhGUVVGRk8wRkJRM0pETEUxQlFVMHNWVUZCVlN4SFFVRkhMRk5CUVZNc1EwRkJRenRCUVVNM1FpeExRVUZMTzBGQlEwdzdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhqUVVGakxFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4SFFVRkhMRlZCUVZVc1EwRkJRenRCUVVOeVJDeEhRVUZITzBGQlEwZzdRVUZEUVN4RlFVRkZMSE5DUVVGelFpeERRVUZETEZOQlFWTXNSVUZCUlR0QlFVTndReXhKUVVGSkxFbEJRVWtzUTBGQlF5eEpRVUZKTEVOQlFVTXNWVUZCVlN4RFFVRkRMRk5CUVZNc1EwRkJReXhKUVVGSkxFTkJRVU1zUlVGQlJUdEJRVU14UXl4TlFVRk5MRWxCUVVrc1EwRkJReXhwUWtGQmFVSXNRMEZCUXl4VFFVRlRMRU5CUVVNc1EwRkJRenRCUVVONFF5eExRVUZMTzBGQlEwdzdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhoUVVGaExFTkJRVU1zVTBGQlV5eERRVUZETEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNN1FVRkRla01zUjBGQlJ6dEJRVU5JTzBGQlEwRXNSVUZCUlN3d1FrRkJNRUlzUTBGQlF5eFRRVUZUTEVWQlFVVTdRVUZEZUVNc1NVRkJTU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEZOQlFWTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1JVRkJSU3hEUVVGRE8wRkJRM3BETEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc2FVSkJRV2xDTEVOQlFVTXNVMEZCVXl4RlFVRkZPMEZCUXk5Q0xFbEJRVWtzU1VGQlNTeGhRVUZoTEVkQlFVY3NjVUpCUVhGQ0xFTkJRVU1zVTBGQlV5eERRVUZETEVOQlFVTTdRVUZEZWtRc1NVRkJTU3hQUVVGUExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNN1FVRkRPVU1zUjBGQlJ6dEJRVU5JTEVOQlFVTTdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenRCUXpORVZ5eE5RVUZETEU5QlFVOHNSMEZCUnl4TFFVRkxMRU5CUVVNc1QwRkJUenM3UVVOTE4wSXNUVUZCVFN4TlFVRk5MRU5CUVVNN1FVRkRjRUlzUlVGQlJTeFhRVUZYTEVOQlFVTXNZVUZCWVN4RlFVRkZPMEZCUXpkQ0xFbEJRVWtzU1VGQlNTeERRVUZETEdOQlFXTXNSMEZCUnl4aFFVRmhMRWxCUVVrc1NVRkJTU3hEUVVGRE8wRkJRMmhFTzBGQlEwRTdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhGUVVGRkxFZEJRVWNzWVVGQllTeERRVUZETEdGQlFXRXNSVUZCUlN4RFFVRkRPMEZCUXpWRE8wRkJRMEU3UVVGRFFTeEpRVUZKTEVsQlFVa3NRMEZCUXl4bFFVRmxMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRemxDTzBGQlEwRTdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhYUVVGWExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlF6RkNPMEZCUTBFc1NVRkJTU3hKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRMnhETzBGQlEwRTdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhQUVVGUExFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzUkNPMEZCUTBFN1FVRkRRU3hKUVVGSkxFbEJRVWtzUTBGQlF5eDFRa0ZCZFVJc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGRGRFTTdRVUZEUVN4SlFVRkpMRWxCUVVrc1EwRkJReXhMUVVGTExFZEJRVWNzUzBGQlN5eERRVUZETzBGQlEzWkNPMEZCUTBFN1FVRkRRU3hKUVVGSkxFbEJRVWtzUTBGQlF5eHJRa0ZCYTBJc1IwRkJSeXhEUVVGRExFTkJRVU03UVVGRGFFTXNSMEZCUnp0QlFVTklPMEZCUTBFN1FVRkRRVHRCUVVOQkxFVkJRVVVzV1VGQldTeERRVUZETEZOQlFWTXNSVUZCUlN4alFVRmpMRVZCUVVVN1FVRkRNVU1zU1VGQlNTeEpRVUZKTEZOQlFWTXNSMEZCUnl4SlFVRkpMRU5CUVVNc1YwRkJWeXhEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnlSRHRCUVVOQkxFbEJRVWtzU1VGQlNTeERRVUZETEZOQlFWTXNTVUZCU1N4alFVRmpMRXRCUVVzc1NVRkJTU3hGUVVGRk8wRkJReTlETEUxQlFVMHNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXh0UWtGQmJVSXNRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE0wUXNTMEZCU3p0QlFVTk1PMEZCUTBFc1NVRkJTU3hQUVVGUExFRkJRWE5FTEVOQlFVTXNVMEZCVXl4RFFVRkRPMEZCUXpWRkxFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNiVUpCUVcxQ0xFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEycERMRWxCUVVrc1QwRkJUeXhKUVVGSkxFTkJRVU1zYlVKQlFXMUNMRU5CUVVNc1UwRkJVeXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEzQkVMRWRCUVVjN1FVRkRTRHRCUVVOQkxFVkJRVVVzWVVGQllTeEhRVUZITzBGQlEyeENMRWxCUVVrc1QwRkJUeXhKUVVGSkxFTkJRVU1zVjBGQlZ5eERRVUZETzBGQlF6VkNMRWRCUVVjN1FVRkRTRHRCUVVOQkxFVkJRVVVzY1VKQlFYRkNMRWRCUVVjN1FVRkRNVUlzU1VGQlNTeFBRVUZQTEVsQlFVa3NRMEZCUXl4dFFrRkJiVUlzUTBGQlF6dEJRVU53UXl4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxHbENRVUZwUWl4SFFVRkhPMEZCUTNSQ0xFbEJRVWtzVDBGQlR5eEpRVUZKTEVOQlFVTXNaVUZCWlN4RFFVRkRPMEZCUTJoRExFZEJRVWM3UVVGRFNEdEJRVU5CTEVWQlFVVXNiVUpCUVcxQ0xFTkJRVU1zVTBGQlV5eEZRVUZGTzBGQlEycERMRWxCUVVrc1NVRkJTU3hUUVVGVExFZEJRVWNzU1VGQlNTeERRVUZETEZkQlFWY3NRMEZCUXl4VFFVRlRMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGNrUXNTVUZCU1N4TFFVRkxMRWxCUVVrc1EwRkJReXhIUVVGSExFTkJRVU1zUlVGQlJTeERRVUZETEVkQlFVY3NTVUZCU1N4RFFVRkRMRTlCUVU4c1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZEYkVRc1RVRkJUU3hKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEVOQlFVTXNUMEZCVHl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMnhETzBGQlEwRTdRVUZEUVN4TlFVRk5MRWxCUVVrc1MwRkJTeXhEUVVGRExGRkJRVkVzU1VGQlNTeExRVUZMTEVOQlFVTXNWVUZCVlN4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTXNSVUZCUlR0QlFVTjRSU3hSUVVGUkxFdEJRVXNzUTBGQlF5eGxRVUZsTEVOQlFVTXNZVUZCWVR0QlFVTXpReXhWUVVGVkxFdEJRVXNzUTBGQlF5eFRRVUZUTEVOQlFVTXNhVUpCUVdsQ08wRkJRek5ETEZWQlFWVXNTVUZCU1R0QlFVTmtMRlZCUVZVc1UwRkJVenRCUVVOdVFpeFRRVUZUTEVOQlFVTTdRVUZEVml4UFFVRlBPMEZCUTFBc1MwRkJTenRCUVVOTUxFbEJRVWtzVDBGQlR5eFRRVUZUTEVOQlFVTTdRVUZEY2tJc1IwRkJSenRCUVVOSU8wRkJRMEVzUlVGQlJTeFpRVUZaTEVOQlFVTXNVMEZCVXl4RlFVRkZMRTFCUVUwc1JVRkJSVHRCUVVOc1F5eEpRVUZKTEVsQlFVa3NRMEZCUXl4alFVRmpMRU5CUVVNc2EwSkJRV3RDTEVOQlFVTXNTVUZCU1N4RlFVRkZMRk5CUVZNc1JVRkJSU3hOUVVGTkxFTkJRVU1zUTBGQlF6dEJRVU53UlN4SlFVRkpMRTlCUVU4c1NVRkJTU3hEUVVGRE8wRkJRMmhDTEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc1pVRkJaU3hEUVVGRExGTkJRVk1zUlVGQlJTeGpRVUZqTEVWQlFVVTdRVUZETjBNc1NVRkJTU3hKUVVGSkxFTkJRVU1zWTBGQll5eERRVUZETEhGQ1FVRnhRaXhEUVVGRExFbEJRVWtzUlVGQlJTeFRRVUZUTEVWQlFVVXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRMMFVzU1VGQlNTeFBRVUZQTEVsQlFVa3NRMEZCUXp0QlFVTm9RaXhIUVVGSE8wRkJRMGc3UVVGRFFTeEZRVUZGTEZsQlFWa3NRMEZCUXl4VFFVRlRMRVZCUVVVc1kwRkJZeXhGUVVGRk8wRkJRekZETEVsQlFVazdRVUZEU2l4TlFVRk5MRU5CUVVNc1EwRkJReXhEUVVGRExFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNUMEZCVHl4RFFVRkRMRk5CUVZNc1EwRkJRenRCUVVOb1JDeFBRVUZQTEdOQlFXTXNTMEZCU3l4SlFVRkpMRWxCUVVrc1NVRkJTU3hEUVVGRExHMUNRVUZ0UWl4RFFVRkRMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRM1JGTEUxQlFVMDdRVUZEVGl4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxHMUNRVUZ0UWl4RFFVRkRMRk5CUVZNc1JVRkJSVHRCUVVOcVF5eEpRVUZKTEU5QlFVOHNRMEZCUXl4RFFVRkRMRU5CUVVNc1NVRkJTU3hEUVVGRExIVkNRVUYxUWl4RFFVRkRMRTlCUVU4c1EwRkJReXhUUVVGVExFTkJRVU1zUTBGQlF6dEJRVU01UkN4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxHZENRVUZuUWl4RFFVRkRMRlZCUVZVc1JVRkJSVHRCUVVNdlFpeEpRVUZKTEV0QlFVc3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhGUVVGRkxFTkJRVU1zUjBGQlJ5eFZRVUZWTEVOQlFVTXNUVUZCVFN4RlFVRkZMRU5CUVVNc1JVRkJSU3hGUVVGRk8wRkJRMmhFTEUxQlFVMHNTVUZCU1N4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zVlVGQlZTeERRVUZETEVOQlFVTXNRMEZCUXl4RFFVRkRMRVZCUVVVc1QwRkJUeXhMUVVGTExFTkJRVU03UVVGRE1VUXNTMEZCU3p0QlFVTk1MRWxCUVVrc1QwRkJUeXhKUVVGSkxFTkJRVU03UVVGRGFFSXNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3huUWtGQlowSXNRMEZCUXl4VlFVRlZMRVZCUVVVN1FVRkRMMElzU1VGQlNTeExRVUZMTEVsQlFVa3NRMEZCUXl4SFFVRkhMRU5CUVVNc1JVRkJSU3hEUVVGRExFZEJRVWNzVlVGQlZTeERRVUZETEUxQlFVMHNSVUZCUlN4RFFVRkRMRVZCUVVVc1JVRkJSVHRCUVVOb1JDeE5RVUZOTEVsQlFVa3NTVUZCU1N4RFFVRkRMRmxCUVZrc1EwRkJReXhWUVVGVkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTXNSVUZCUlN4UFFVRlBMRWxCUVVrc1EwRkJRenRCUVVONFJDeExRVUZMTzBGQlEwd3NTVUZCU1N4UFFVRlBMRXRCUVVzc1EwRkJRenRCUVVOcVFpeEhRVUZITzBGQlEwZzdRVUZEUVN4RlFVRkZMRzFDUVVGdFFpeERRVUZETEdOQlFXTXNSVUZCUlR0QlFVTjBReXhKUVVGSkxFOUJRVThzU1VGQlNTeERRVUZETEdOQlFXTXNRMEZCUXl4NVFrRkJlVUlzUTBGQlF5eEpRVUZKTEVWQlFVVXNZMEZCWXl4RFFVRkRMRU5CUVVNN1FVRkRMMFVzUjBGQlJ6dEJRVU5JTzBGQlEwRXNSVUZCUlN4SlFVRkpMRU5CUVVNc1IwRkJSeXhGUVVGRk8wRkJRMW83UVVGRFFTeEpRVUZKTEV0QlFVc3NTVUZCU1N4aFFVRmhMRWxCUVVrc1IwRkJSeXhEUVVGRExGZEJRVmNzUlVGQlJUdEJRVU12UXl4TlFVRk5MRWxCUVVrc1dVRkJXU3hIUVVGSExFZEJRVWNzUTBGQlF5eFhRVUZYTEVOQlFVTXNZVUZCWVN4RFFVRkRMRU5CUVVNN1FVRkRlRVFzVFVGQlRTeEpRVUZKTEVOQlFVTXNXVUZCV1N4RFFVRkRMRmxCUVZrc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEJRVU5zUkN4TlFVRk5MRWxCUVVrc1UwRkJVeXhIUVVGSExFbEJRVWtzUTBGQlF5eFpRVUZaTEVOQlFVTXNXVUZCV1N4RFFVRkRMRmRCUVZjc1EwRkJReXhEUVVGRE8wRkJRMnhGTEUxQlFVMHNVMEZCVXl4RFFVRkRMRWxCUVVrc1EwRkJReXhaUVVGWkxFTkJRVU1zUTBGQlF6dEJRVU51UXl4TFFVRkxPMEZCUTB3N1FVRkRRU3hKUVVGSkxFOUJRVThzU1VGQlNTeERRVUZETzBGQlEyaENMRWRCUVVjN1FVRkRTRHRCUVVOQkxFVkJRVVVzUzBGQlN5eEhRVUZITzBGQlExWXNTVUZCU1N4UFFVRlBMRWxCUVVrc1RVRkJUU3hEUVVGRExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNRMEZCUXl4SlFVRkpMRU5CUVVNc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRGRFUXNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3hMUVVGTExFZEJRVWM3UVVGRFZpeEpRVUZKTEVsQlFVa3NRMEZCUXl4RlFVRkZMRWRCUVVjc1NVRkJTU3hEUVVGRExHTkJRV01zUTBGQlF5eGhRVUZoTEVWQlFVVXNRMEZCUXp0QlFVTnNSQ3hKUVVGSkxFbEJRVWtzUTBGQlF5eGxRVUZsTEVOQlFVTXNUVUZCVFN4SFFVRkhMRU5CUVVNc1EwRkJRenRCUVVOd1F5eEpRVUZKTEVsQlFVa3NRMEZCUXl4UFFVRlBMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU0xUWp0QlFVTkJMRWxCUVVrc1MwRkJTeXhKUVVGSkxHRkJRV0VzU1VGQlNTeEpRVUZKTEVOQlFVTXNWVUZCVlN4RlFVRkZPMEZCUXk5RExFMUJRVTBzVDBGQlR5eEpRVUZKTEVOQlFVTXNWMEZCVnl4RFFVRkRMR0ZCUVdFc1EwRkJReXhEUVVGRE8wRkJRemRETEV0QlFVczdRVUZEVEN4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxFMUJRVTBzUTBGQlF5eGpRVUZqTEVWQlFVVTdRVUZEZWtJc1NVRkJTU3hQUVVGUExFbEJRVWtzUTBGQlF5eGpRVUZqTEVOQlFVTXNXVUZCV1N4RFFVRkRMRWxCUVVrc1JVRkJSU3hqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU5zUlN4SFFVRkhPMEZCUTBnc1EwRkJRenM3UVVNelNVUXNUVUZCVFN4bFFVRmxMRWRCUVVjN1FVRkRlRUlzUlVGQlJTeGpRVUZqTEVWQlFVVXNRMEZCUXp0QlFVTnVRaXhGUVVGRkxGZEJRVmNzUlVGQlJTeE5RVUZOTzBGQlEzSkNMRU5CUVVNc1EwRkJRenRCUVVOR08wRkJRMEVzUVVGQlR5eE5RVUZOTEV0QlFVc3NRMEZCUXp0QlFVTnVRaXhGUVVGRkxGZEJRVmNzUTBGQlF5eFBRVUZQTEVkQlFVY3NSVUZCUlN4RlFVRkZPMEZCUXpWQ0xFbEJRVWtzU1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4TlFVRk5MRU5CUVVNc1RVRkJUU3hEUVVGRExFVkJRVVVzUlVGQlJTeGxRVUZsTEVWQlFVVXNUMEZCVHl4RFFVRkRMRU5CUVVNN1FVRkRMMFE3UVVGRFFTeEpRVUZKTEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUjBGQlJ5eEpRVUZKTEdkQ1FVRm5RaXhEUVVGRExFbEJRVWtzUTBGQlF5eERRVUZETzBGQlEzaEVMRWxCUVVrc1NVRkJTU3hEUVVGRExHRkJRV0VzUjBGQlJ5eEpRVUZKTEdGQlFXRXNRMEZCUXl4SlFVRkpMRU5CUVVNc1EwRkJRenRCUVVOcVJDeEpRVUZKTEVsQlFVa3NRMEZCUXl4aFFVRmhMRWRCUVVjc1NVRkJTU3hoUVVGaExFTkJRVU1zU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEYWtRN1FVRkRRU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVkQlFVY3NTVUZCU1N4RFFVRkRPMEZCUTNoQ08wRkJRMEVzU1VGQlNTeEpRVUZKTEVOQlFVTXNWMEZCVnl4SFFVRkhMRVZCUVVVc1EwRkJRenRCUVVNeFFqdEJRVU5CTEVsQlFVa3NTVUZCU1N4VFFVRlRMRWxCUVVrc1QwRkJUeXhYUVVGWExFdEJRVXNzVjBGQlZ5eEZRVUZGTzBGQlEzcEVMRTFCUVUwc1NVRkJTU3hMUVVGTExFZEJRVWNzU1VGQlNTeFhRVUZYTEVOQlFVTXNiMEpCUVc5Q0xFVkJRVVU3UVVGRGVFUXNVVUZCVVN4TlFVRk5MRVZCUVVVc1JVRkJSU3hMUVVGTExFVkJRVVVzU1VGQlNTeEZRVUZGTEU5QlFVOHNSVUZCUlN4UFFVRlBMRVZCUVVVN1FVRkRha1FzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEVkN4TlFVRk5MRTFCUVUwc1EwRkJReXhoUVVGaExFTkJRVU1zUzBGQlN5eERRVUZETEVOQlFVTTdRVUZEYkVNc1MwRkJTenRCUVVOTU8wRkJRMEVzU1VGQlNTeEpRVUZKTEVOQlFVTXNVVUZCVVN4SFFVRkhMRWRCUVVjc1JVRkJSU3hEUVVGRE8wRkJRekZDTEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc2FVSkJRV2xDTEVOQlFVTXNVMEZCVXl4RlFVRkZMRlZCUVZVc1JVRkJSVHRCUVVNelF5eEpRVUZKTEVsQlFVa3NRMEZCUXl4cFFrRkJhVUlzUTBGQlF5eHBRa0ZCYVVJc1EwRkJReXhUUVVGVExFVkJRVVVzVlVGQlZTeERRVUZETEVOQlFVTTdRVUZEY0VVc1NVRkJTU3hQUVVGUExFbEJRVWtzUTBGQlF6dEJRVU5vUWl4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxHTkJRV01zUTBGQlF5eE5RVUZOTEVWQlFVVXNWVUZCVlN4RlFVRkZPMEZCUTNKRExFbEJRVWtzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4alFVRmpMRU5CUVVNc1RVRkJUU3hGUVVGRkxGVkJRVlVzUTBGQlF5eERRVUZETzBGQlF6RkVMRWxCUVVrc1QwRkJUeXhKUVVGSkxFTkJRVU03UVVGRGFFSXNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3huUWtGQlowSXNRMEZCUXl4TlFVRk5MRVZCUVVVN1FVRkRNMElzU1VGQlNTeEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMR2RDUVVGblFpeERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTJoRUxFbEJRVWtzVDBGQlR5eEpRVUZKTEVOQlFVTTdRVUZEYUVJc1IwRkJSenRCUVVOSU8wRkJRMEVzUlVGQlJTeFRRVUZUTEVOQlFVTXNWMEZCVnl4RlFVRkZPMEZCUTNwQ0xFbEJRVWtzVDBGQlR5eEpRVUZKTEVOQlFVTXNZVUZCWVN4RFFVRkRMRk5CUVZNc1EwRkJReXhYUVVGWExFTkJRVU1zUTBGQlF6dEJRVU55UkN4SFFVRkhPMEZCUTBnN1FVRkRRU3hGUVVGRkxGVkJRVlVzUjBGQlJ6dEJRVU5tTEVsQlFVa3NUMEZCVHl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExGVkJRVlVzUlVGQlJTeERRVUZETzBGQlF6TkRMRWRCUVVjN1FVRkRTRHRCUVVOQkxFVkJRVVVzVDBGQlR5eERRVUZETEV0QlFVc3NSVUZCUlN4SlFVRkpMRVZCUVVVN1FVRkRka0lzU1VGQlNTeEpRVUZKTEVOQlFVTXNTMEZCU3l4RlFVRkZPMEZCUTJoQ0xFMUJRVTBzU1VGQlNTeEhRVUZITEVkQlFVY3NSVUZCUlN4RFFVRkRPMEZCUTI1Q0xFMUJRVTBzUzBGQlN5eEhRVUZITEVsQlFVa3NSMEZCUnl4SlFVRkpMRU5CUVVNc1VVRkJVU3hEUVVGRE8wRkJRMjVETEUxQlFVMHNTVUZCU1N4RFFVRkRMRkZCUVZFc1IwRkJSeXhKUVVGSkxFTkJRVU03UVVGRE0wSXNTMEZCU3p0QlFVTk1PMEZCUTBFc1NVRkJTU3hKUVVGSkxFbEJRVWtzUTBGQlF5eFBRVUZQTEVWQlFVVTdRVUZEZEVJc1RVRkJUU3hKUVVGSkxFTkJRVU1zWVVGQllTeERRVUZETEU5QlFVOHNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hEUVVGRExFTkJRVU03UVVGRE9VTXNUVUZCVFN4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExITkNRVUZ6UWl4RlFVRkZMRU5CUVVNN1FVRkRiRVFzUzBGQlN6dEJRVU5NTEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc1NVRkJTU3hIUVVGSE8wRkJRMVFzU1VGQlNTeEpRVUZKTEVOQlFVTXNUMEZCVHl4SFFVRkhMRXRCUVVzc1EwRkJRenRCUVVONlFpeEhRVUZITzBGQlEwZzdRVUZEUVN4RlFVRkZMRWxCUVVrc1IwRkJSenRCUVVOVUxFbEJRVWtzU1VGQlNTeERRVUZETEU5QlFVOHNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRlRUlzUjBGQlJ6dEJRVU5JTzBGQlEwRXNSVUZCUlN4WlFVRlpMRU5CUVVNc1NVRkJTU3hGUVVGRk8wRkJRM0pDTEVsQlFVa3NUMEZCVHl4SlFVRkpMRU5CUVVNc1lVRkJZU3hEUVVGRExGbEJRVmtzUTBGQlF5eEpRVUZKTEVOQlFVTXNRMEZCUXp0QlFVTnFSQ3hIUVVGSE8wRkJRMGc3UVVGRFFTeEZRVUZGTEV0QlFVc3NSMEZCUnp0QlFVTldMRWxCUVVrc1NVRkJTU3hMUVVGTExFZEJRVWM3UVVGRGFFSXNUVUZCVFN4UlFVRlJMRVZCUVVVc1NVRkJTU3hEUVVGRExHRkJRV0VzUTBGQlF5eExRVUZMTEVWQlFVVTdRVUZETVVNc1RVRkJUU3hOUVVGTkxFVkJRVVVzU1VGQlNTeERRVUZETEdGQlFXRXNRMEZCUXl4TFFVRkxMRVZCUVVVN1FVRkRlRU1zUzBGQlN5eERRVUZETzBGQlEwNDdRVUZEUVN4SlFVRkpMRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4TFFVRkxMRVZCUVVVc1NVRkJTU3hGUVVGRkxFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEYUVRc1IwRkJSenRCUVVOSUxFTkJRVU03TzBGRGVFWk5MRTFCUVUwc1dVRkJXU3hUUVVGVExGTkJRVk1zUTBGQlF6dEJRVU0xUXl4RlFVRkZMRmRCUVZjc1IwRkJSenRCUVVOb1FpeEpRVUZKTEV0QlFVc3NRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVOcVFpeEhRVUZITzBGQlEwZ3NRMEZCUXp0QlFVTkVPMEZCUTBFc1dVRkJXU3hEUVVGRExHTkJRV01zUjBGQlJ5eEpRVUZKTEVOQlFVTTdPMEZEVW5aQ0xFMUJRVU1zVTBGQlV5eEhRVUZITEVOQlFVTXNSMEZCUnl4RlFVRkZMRWxCUVVrc1JVRkJSU3hIUVVGSExFMUJRVTBzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRWRCUVVjc1EwRkJReXhIUVVGSExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlEzQkZPMEZCUTBFc1FVRkJXU3hOUVVGRExGVkJRVlVzUjBGQlJ5eEhRVUZITEVsQlFVa3NSMEZCUnl4RFFVRkRPMEZCUTNKRE8wRkJRMEVzUVVGQldTeE5RVUZETEZOQlFWTXNSMEZCUnl4RFFVRkRMRWRCUVVjc1JVRkJSU3hKUVVGSkxFVkJRVVVzUjBGQlJ5eExRVUZMTzBGQlF6ZERMRVZCUVVVc1RVRkJUU3hSUVVGUkxFZEJRVWNzUjBGQlJ5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUXpWQ0xFVkJRVVVzVFVGQlRTeFRRVUZUTEVkQlFVY3NTVUZCU1N4RFFVRkRMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRemxDTzBGQlEwRXNSVUZCUlN4VFFVRlRMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUTBGQlF6dEJRVU4yUWp0QlFVTkJMRVZCUVVVc1MwRkJTeXhKUVVGSkxFTkJRVU1zUjBGQlJ5eERRVUZETEVWQlFVVXNRMEZCUXl4SFFVRkhMRkZCUVZFc1EwRkJReXhOUVVGTkxFVkJRVVVzUTBGQlF5eEZRVUZGTEVWQlFVVTdRVUZETlVNc1NVRkJTU3hUUVVGVExFTkJRVU1zU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRMmhETEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc1QwRkJUeXhUUVVGVExFTkJRVU03UVVGRGJrSXNRMEZCUXl4RFFVRkRPMEZCUTBZN1FVRkRRU3hCUVVGWkxFMUJRVU1zVlVGQlZTeEhRVUZITEVkQlFVY3NTVUZCU1N4SFFVRkhMRU5CUVVNc1MwRkJTeXhGUVVGRkxFTkJRVU03UVVGRE4wTTdRVUZEUVN4QlFVRlpMRTFCUVVNc1VVRkJVU3hIUVVGSExFTkJRVU1zUjBGQlJ5eEZRVUZGTEVsQlFVa3NSVUZCUlN4SFFVRkhPMEZCUTNaRExFZEJRVWNzU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRWxCUVVrc1EwRkJReXhMUVVGTExFTkJRVU1zU1VGQlNTeERRVUZETEZOQlFWTXNRMEZCUXl4SFFVRkhMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETEVOQlFVTTdRVUZEY2tRN1FVRkRRU3hCUVVGWkxFMUJRVU1zVTBGQlV5eEhRVUZITEVkQlFVY3NTVUZCU1N4SlFVRkpMRU5CUVVNc1MwRkJTeXhEUVVGRExFbEJRVWtzUTBGQlF5eFRRVUZUTEVOQlFVTXNSMEZCUnl4RFFVRkRMRU5CUVVNc1EwRkJRenRCUVVOb1JUdEJRVU5CTEVGQlFWa3NUVUZCUXl4WlFVRlpMRWRCUVVjc1EwRkJReXhIUVVGSExFVkJRVVVzU1VGQlNTeEZRVUZGTEVkQlFVY3NTMEZCU3l4SlFVRkpMRU5CUVVNc1IwRkJSeXhEUVVGRExFTkJRVU1zU1VGQlNTeERRVUZETEVkQlFVY3NRMEZCUXl4SFFVRkhMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRM3BGTzBGQlEwRXNRVUZCV1N4TlFVRkRMR0ZCUVdFc1IwRkJSeXhIUVVGSExFbEJRVWtzUjBGQlJ5eERRVUZETEV0QlFVc3NSVUZCUlN4RFFVRkRPMEZCUTJoRU8wRkJRMEVzUVVGQlR5eFRRVUZUTEZWQlFWVXNRMEZCUXl4alFVRmpMRVZCUVVVN1FVRkRNME1zUlVGQlJTeEpRVUZKTEcxQ1FVRnRRaXhIUVVGSExFTkJRVU1zVFVGQlRTeEZRVUZGTEZOQlFWTXNSVUZCUlN4TlFVRk5MRVZCUVVVc1QwRkJUeXhEUVVGRExFTkJRVU03UVVGRGFrVTdRVUZEUVN4RlFVRkZMRWxCUVVrc2JVSkJRVzFDTEVkQlFVY3NiVUpCUVcxQ0xFTkJRVU1zVFVGQlRTeERRVUZETEVOQlFVTXNTVUZCU1R0QlFVTTFSQ3hKUVVGSkxFOUJRVThzUTBGQlF5eGpRVUZqTEVOQlFVTXNZMEZCWXl4RFFVRkRMRU5CUVVNc1EwRkJReXhEUVVGRE8wRkJRemRETEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTB3N1FVRkRRU3hGUVVGRkxFbEJRVWtzYlVKQlFXMUNMRU5CUVVNc1RVRkJUU3hIUVVGSExFTkJRVU1zUlVGQlJUdEJRVU4wUXl4SlFVRkpMRTFCUVUwc1NVRkJTU3hMUVVGTE8wRkJRMjVDTEUxQlFVMHNRMEZCUXl4dlJVRkJiMFVzUlVGQlJTeHRRa0ZCYlVJc1EwRkJReXhKUVVGSk8wRkJRM0pITEZGQlFWRXNTVUZCU1R0QlFVTmFMRTlCUVU4c1EwRkJReXhEUVVGRE8wRkJRMVFzUzBGQlN5eERRVUZETzBGQlEwNHNSMEZCUnp0QlFVTklPMEZCUTBFc1JVRkJSU3hqUVVGakxFTkJRVU1zVFVGQlRTeEhRVUZITEVsQlFVa3NRMEZCUXp0QlFVTXZRanRCUVVOQkxFVkJRVVVzVDBGQlR5eGpRVUZqTEVOQlFVTTdRVUZEZUVJc1EwRkJRenRCUVVORU8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNRVUZCV1N4TlFVRkRMRXRCUVVzc1IwRkJSenRCUVVOeVFpeEZRVUZGTEUxQlFVMHNSVUZCUlN4VlFVRlZMRU5CUVVNN1FVRkRja0lzU1VGQlNTeEpRVUZKTEVWQlFVVXNVVUZCVVR0QlFVTnNRaXhKUVVGSkxFOUJRVThzUlVGQlJTeERRVUZETzBGQlEyUXNTVUZCU1N4SlFVRkpMRVZCUVVVc1UwRkJVenRCUVVOdVFpeEpRVUZKTEV0QlFVc3NSVUZCUlN4VlFVRlZPMEZCUTNKQ0xFZEJRVWNzUTBGQlF6dEJRVU5LTzBGQlEwRXNSVUZCUlN4UFFVRlBMRVZCUVVVc1ZVRkJWU3hEUVVGRE8wRkJRM1JDTEVsQlFVa3NTVUZCU1N4RlFVRkZMRk5CUVZNN1FVRkRia0lzU1VGQlNTeFBRVUZQTEVWQlFVVXNTMEZCU3p0QlFVTnNRaXhKUVVGSkxFbEJRVWtzUlVGQlJTeFRRVUZUTzBGQlEyNUNMRWxCUVVrc1MwRkJTeXhGUVVGRkxGVkJRVlU3UVVGRGNrSXNSMEZCUnl4RFFVRkRPMEZCUTBvN1FVRkRRU3hGUVVGRkxFMUJRVTBzUlVGQlJTeFZRVUZWTEVOQlFVTTdRVUZEY2tJc1NVRkJTU3hKUVVGSkxFVkJRVVVzVVVGQlVUdEJRVU5zUWl4SlFVRkpMRTlCUVU4c1JVRkJSU3hGUVVGRk8wRkJRMllzU1VGQlNTeEpRVUZKTEVWQlFVVXNVMEZCVXp0QlFVTnVRaXhKUVVGSkxFdEJRVXNzUlVGQlJTeFZRVUZWTzBGQlEzSkNMRWRCUVVjc1EwRkJRenRCUVVOS08wRkJRMEVzUlVGQlJTeExRVUZMTEVWQlFVVXNWVUZCVlN4RFFVRkRPMEZCUTNCQ0xFbEJRVWtzU1VGQlNTeEZRVUZGTEU5QlFVODdRVUZEYWtJc1NVRkJTU3hQUVVGUExFVkJRVVVzUlVGQlJUdEJRVU5tTEVsQlFVa3NTVUZCU1N4RlFVRkZMRk5CUVZNN1FVRkRia0lzU1VGQlNTeExRVUZMTEVWQlFVVXNWVUZCVlR0QlFVTnlRaXhIUVVGSExFTkJRVU03UVVGRFNqdEJRVU5CTEVWQlFVVXNUVUZCVFN4RlFVRkZMRlZCUVZVc1EwRkJRenRCUVVOeVFpeEpRVUZKTEVsQlFVa3NSVUZCUlN4UlFVRlJPMEZCUTJ4Q0xFbEJRVWtzVDBGQlR5eEZRVUZGTEZOQlFWTTdRVUZEZEVJc1NVRkJTU3hKUVVGSkxFVkJRVVVzVTBGQlV6dEJRVU51UWl4SlFVRkpMRXRCUVVzc1JVRkJSU3hWUVVGVk8wRkJRM0pDTEVkQlFVY3NRMEZCUXp0QlFVTktPMEZCUTBFc1JVRkJSU3hKUVVGSkxFVkJRVVVzVlVGQlZTeERRVUZETzBGQlEyNUNMRWxCUVVrc1NVRkJTU3hGUVVGRkxFMUJRVTA3UVVGRGFFSXNTVUZCU1N4UFFVRlBMRVZCUVVVc1NVRkJTVHRCUVVOcVFpeEpRVUZKTEVsQlFVa3NSVUZCUlN4UlFVRlJPMEZCUTJ4Q0xFbEJRVWtzUzBGQlN5eEZRVUZGTEZOQlFWTTdRVUZEY0VJc1IwRkJSeXhEUVVGRE8wRkJRMG9zUTBGQlF6czdRVU0zUmswc1UwRkJVeXhWUVVGVkxFTkJRVU1zVFVGQlRTeEZRVUZGTzBGQlEyNURMRVZCUVVVc1NVRkJTU3hOUVVGTkxFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEyeENMRVZCUVVVc1NVRkJTU3hWUVVGVkxFZEJRVWNzYzBOQlFYTkRMRU5CUVVNN1FVRkRNVVFzUlVGQlJTeEpRVUZKTEdkQ1FVRm5RaXhIUVVGSExGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTTdRVUZETTBNc1JVRkJSU3hMUVVGTExFbEJRVWtzUTBGQlF5eEhRVUZITEVOQlFVTXNSVUZCUlN4RFFVRkRMRWRCUVVjc1RVRkJUU3hGUVVGRkxFTkJRVU1zUlVGQlJTeEZRVUZGTzBGQlEyNURMRWxCUVVrc1RVRkJUU3hKUVVGSkxGVkJRVlVzUTBGQlF5eE5RVUZOTEVOQlFVTXNTVUZCU1N4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFTkJRVU1zVFVGQlRTeEZRVUZGTEVkQlFVY3NaMEpCUVdkQ0xFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6bEZMRWRCUVVjN1FVRkRTQ3hGUVVGRkxFOUJRVThzVFVGQlRTeERRVUZETzBGQlEyaENMRU5CUVVNN1FVRkRSRHRCUVVOQkxFRkJRVThzVTBGQlV5eFpRVUZaTEVOQlFVTXNSMEZCUnl4RlFVRkZMRTFCUVUwc1JVRkJSVHRCUVVNeFF5eEZRVUZGTEVsQlFVa3NUVUZCVFN4SFFVRkhMRkZCUVZFc1EwRkJReXhoUVVGaExFTkJRVU1zVVVGQlVTeERRVUZETEVOQlFVTTdRVUZEYUVRN1FVRkRRU3hGUVVGRkxFMUJRVTBzUTBGQlF5eEhRVUZITEVkQlFVY3NSMEZCUnl4RFFVRkRPMEZCUTI1Q0xFVkJRVVVzVFVGQlRTeERRVUZETEUxQlFVMHNSMEZCUnl4TlFVRk5MRU5CUVVNN1FVRkRla0lzUlVGQlJTeERRVUZETEZGQlFWRXNRMEZCUXl4SlFVRkpMRWxCUVVrc1VVRkJVU3hEUVVGRExHVkJRV1VzUlVGQlJTeFhRVUZYTEVOQlFVTXNUVUZCVFN4RFFVRkRMRU5CUVVNN1FVRkRiRVVzUTBGQlF6czdRVU5vUWtRN1FVRkRRU3hCUVVWQk8wRkJRMEVzVTBGQlV5eHZRa0ZCYjBJc1EwRkJReXhWUVVGVkxFVkJRVVU3UVVGRE1VTXNSVUZCUlN4SlFVRkpMR0ZCUVdFc1IwRkJSeXhEUVVGRExFOUJRVThzUlVGQlJTeFRRVUZUTEVWQlFVVXNTMEZCU3l4RFFVRkRMRU5CUVVNN1FVRkRiRVFzUlVGQlJTeGhRVUZoTEVOQlFVTXNUMEZCVHl4RFFVRkRMRWRCUVVjc1NVRkJTVHRCUVVNdlFpeEpRVUZKTEVsQlFVa3NUMEZCVHl4UFFVRlBMRU5CUVVNc1IwRkJSeXhEUVVGRExFdEJRVXNzVlVGQlZTeEZRVUZGTzBGQlF6VkRMRTFCUVUwc1NVRkJTU3hGUVVGRkxFZEJRVWNzVDBGQlR5eERRVUZETEVkQlFVY3NRMEZCUXl4RFFVRkRMRWxCUVVrc1EwRkJReXhQUVVGUExFTkJRVU1zUTBGQlF6dEJRVU14UXl4TlFVRk5MRTlCUVU4c1EwRkJReXhIUVVGSExFTkJRVU1zUjBGQlJ5eERRVUZETEVkQlFVY3NTVUZCU1N4TFFVRkxPMEZCUTJ4RExGRkJRVkVzVlVGQlZTeERRVUZETEVsQlFVa3NRMEZCUXp0QlFVTjRRaXhWUVVGVkxFMUJRVTBzUlVGQlJTeFRRVUZUTzBGQlF6TkNMRlZCUVZVc1NVRkJTU3hGUVVGRkxFZEJRVWM3UVVGRGJrSXNWVUZCVlN4SlFVRkpMRVZCUVVVc1NVRkJTU3hEUVVGRExGTkJRVk1zUTBGQlF5eEpRVUZKTEVOQlFVTTdRVUZEY0VNc1UwRkJVeXhEUVVGRExFTkJRVU03UVVGRFdDeFJRVUZSTEU5QlFVOHNSVUZCUlN4RFFVRkRMRXRCUVVzc1EwRkJReXhKUVVGSkxFVkJRVVVzU1VGQlNTeERRVUZETEVOQlFVTTdRVUZEY0VNc1QwRkJUeXhEUVVGRE8wRkJRMUlzUzBGQlN6dEJRVU5NTEVkQlFVY3NRMEZCUXl4RFFVRkRPMEZCUTB3N1FVRkRRU3hGUVVGRkxFMUJRVTBzUTBGQlF5eG5Ra0ZCWjBJc1EwRkJReXhQUVVGUExFVkJRVVVzUzBGQlN5eEpRVUZKTzBGQlF6VkRMRWxCUVVrc1ZVRkJWU3hEUVVGRExFbEJRVWtzUTBGQlF6dEJRVU53UWl4TlFVRk5MRTFCUVUwc1JVRkJSU3hQUVVGUE8wRkJRM0pDTEUxQlFVMHNTMEZCU3l4RlFVRkZMRWxCUVVrc1EwRkJReXhUUVVGVExFTkJRVU03UVVGRE5VSXNVVUZCVVN4UFFVRlBMRVZCUVVVc1MwRkJTeXhEUVVGRExFdEJRVXNzUTBGQlF5eFBRVUZQTzBGQlEzQkRMRkZCUVZFc1MwRkJTeXhGUVVGRkxFdEJRVXNzUTBGQlF5eExRVUZMTEVOQlFVTXNTMEZCU3p0QlFVTm9ReXhQUVVGUExFTkJRVU03UVVGRFVpeExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTlFMRWRCUVVjc1EwRkJReXhEUVVGRE8wRkJRMHdzUTBGQlF6dEJRVU5FTzBGQlEwRXNVMEZCVXl4dFFrRkJiVUlzUTBGQlF5eFJRVUZSTEVWQlFVVTdRVUZEZGtNc1JVRkJSU3hKUVVGSkxFOUJRVThzUjBGQlJ5eFJRVUZSTEVOQlFVTXNZVUZCWVN4RFFVRkRMRXRCUVVzc1EwRkJReXhEUVVGRE8wRkJRemxETEVWQlFVVXNUMEZCVHl4RFFVRkRMRXRCUVVzc1EwRkJReXhQUVVGUExFZEJRVWNzUTBGQlF6dEJRVU16UWp0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEVzUlVGQlJTeERRVUZETEVOQlFVTTdRVUZEU2p0QlFVTkJMRVZCUVVVc1QwRkJUeXhEUVVGRExGTkJRVk1zUjBGQlJ5eERRVUZETEhWR1FVRjFSaXhGUVVGRkxGRkJRVkVzUTBGQlF5eDNSVUZCZDBVc1EwRkJReXhEUVVGRE8wRkJRMjVOTEVWQlFVVXNVVUZCVVN4RFFVRkRMRWxCUVVrc1EwRkJReXhYUVVGWExFTkJRVU1zVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEY2tNN1FVRkRRU3hGUVVGRkxFOUJRVThzVDBGQlR5eERRVUZETzBGQlEycENMRU5CUVVNN1FVRkRSRHRCUVVOQkxFRkJRVThzVTBGQlV5eHZRa0ZCYjBJc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGREwwTXNSVUZCUlN4SlFVRkpMRU5CUVVNc1UwRkJVeXhGUVVGRk8wRkJRMnhDTEVsQlFVa3NUMEZCVHl4RFFVRkRMRWxCUVVrc1EwRkJReXh0UkVGQmJVUXNRMEZCUXl4RFFVRkRPMEZCUTNSRkxFbEJRVWtzVDBGQlR6dEJRVU5ZTEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc1RVRkJUU3hEUVVGRExHVkJRV1VzUjBGQlJ5eE5RVUZOTzBGQlEycERMRWxCUVVrc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eExRVUZMTEVWQlFVVXNRMEZCUXp0QlFVTm9ReXhKUVVGSkxGRkJRVkVzUjBGQlJ5eFZRVUZWTEVOQlFVTXNRMEZCUXl4RFFVRkRMRU5CUVVNN1FVRkROMElzU1VGQlNTeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTlCUVU4c1EwRkJReXhqUVVGakxFVkJRVVVzVVVGQlVTeERRVUZETEVOQlFVTTdRVUZETVVRc1NVRkJTU3hOUVVGTkxFTkJRVU1zVVVGQlVTeERRVUZETEUxQlFVMHNRMEZCUXl4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVOc1F5eEhRVUZITEVOQlFVTTdRVUZEU2p0QlFVTkJMRVZCUVVVc1VVRkJVU3hIUVVGSExGRkJRVkVzU1VGQlNTeE5RVUZOTEVOQlFVTXNXVUZCV1N4RFFVRkRMRTlCUVU4c1EwRkJReXhqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU55UlN4RlFVRkZMRWxCUVVrc1EwRkJReXhSUVVGUkxFVkJRVVU3UVVGRGFrSXNTVUZCU1N4UlFVRlJMRWRCUVVjc1ZVRkJWU3hEUVVGRExFTkJRVU1zUTBGQlF5eERRVUZETzBGQlF6ZENMRWxCUVVrc1RVRkJUU3hEUVVGRExGbEJRVmtzUTBGQlF5eFBRVUZQTEVOQlFVTXNZMEZCWXl4RlFVRkZMRkZCUVZFc1EwRkJReXhEUVVGRE8wRkJRekZFTEVkQlFVYzdRVUZEU0R0QlFVTkJMRVZCUVVVc1NVRkJTU3hQUVVGUExFZEJRVWNzYlVKQlFXMUNMRU5CUVVNc1VVRkJVU3hEUVVGRExFTkJRVU03UVVGRE9VTTdRVUZEUVN4RlFVRkZMRTFCUVUwc1EwRkJReXdyUWtGQkswSXNSMEZCUnl4SlFVRkpMRU5CUVVNN1FVRkRhRVFzUlVGQlJTeE5RVUZOTEVOQlFVTXNjMEpCUVhOQ0xFZEJRVWNzUlVGQlJTeERRVUZETzBGQlEzSkRPMEZCUTBFc1JVRkJSU3hKUVVGSkxFOUJRVThzUjBGQlJ5eEZRVUZGTEVOQlFVTTdRVUZEYmtJN1FVRkRRVHRCUVVOQkxFVkJRVVVzU1VGQlNTeHRRa0ZCYlVJc1IwRkJSeXhGUVVGRkxFTkJRVU03UVVGREwwSXNSVUZCUlN4SlFVRkpMR05CUVdNc1IwRkJSeXhEUVVGRExFbEJRVWs3UVVGRE5VSXNTVUZCU1N4SlFVRkpMRXRCUVVzc1IwRkJSeXhEUVVGRExFTkJRVU1zVFVGQlRTeERRVUZETEV0QlFVc3NRMEZCUXp0QlFVTXZRaXhKUVVGSkxFOUJRVThzUjBGQlJ5eERRVUZETEVOQlFVTXNUVUZCVFN4RFFVRkRMRTlCUVU4c1EwRkJRenRCUVVNdlFpeEpRVUZKTEcxQ1FVRnRRaXhEUVVGRExFbEJRVWtzUTBGQlF5eExRVUZMTEVOQlFVTXNRMEZCUXp0QlFVTndReXhIUVVGSExFTkJRVU03UVVGRFNpeEZRVUZGTEUxQlFVMHNRMEZCUXl4blFrRkJaMElzUTBGQlF5eHZRa0ZCYjBJc1JVRkJSU3hqUVVGakxFTkJRVU1zUTBGQlF6dEJRVU5vUlR0QlFVTkJMRVZCUVVVc1NVRkJTU3hSUVVGUkxFZEJRVWNzVFVGQlRUdEJRVU4yUWl4SlFVRkpMRWxCUVVrc1NVRkJTU3hIUVVGSExFbEJRVWtzU1VGQlNTeERRVUZETEZGQlFWRXNRMEZCUXl4RFFVRkRPMEZCUTJ4RExFbEJRVWtzU1VGQlNTeERRVUZETEVWQlFVVXNRMEZCUXl4TlFVRk5MRVZCUVVVc1kwRkJZenRCUVVOc1F5eE5RVUZOTEVsQlFVa3NRMEZCUXl4RlFVRkZMRU5CUVVNc1dVRkJXU3hGUVVGRkxGVkJRVlVzU1VGQlNUdEJRVU14UXl4UlFVRlJMRTFCUVUwc1EwRkJReXh6UWtGQmMwSXNRMEZCUXl4VlFVRlZMRWRCUVVjc1ZVRkJWU3hEUVVGRE8wRkJRemxFTEZGQlFWRXNWVUZCVlN4RFFVRkRMRVZCUVVVc1EwRkJReXhOUVVGTkxFVkJRVVVzVjBGQlZ6dEJRVU42UXp0QlFVTkJMRlZCUVZVc1QwRkJUeXhEUVVGRExGTkJRVk1zUjBGQlJ5eFhRVUZYTEVOQlFVTTdRVUZETVVNN1FVRkRRVHRCUVVOQkxGVkJRVlVzVlVGQlZTeERRVUZETEVWQlFVVXNRMEZCUXl4TlFVRk5MRVZCUVVVc1UwRkJVeXhKUVVGSkxFVkJRVVU3UVVGREwwTXNXVUZCV1N4SlFVRkpMRWxCUVVrc1EwRkJReXhKUVVGSkxFdEJRVXNzVFVGQlRTeEZRVUZGTzBGQlEzUkRMR05CUVdNc1NVRkJTU3hOUVVGTkxFZEJRVWNzVVVGQlVTeERRVUZETEdGQlFXRXNRMEZCUXl4UlFVRlJMRU5CUVVNc1EwRkJRenRCUVVNMVJDeGpRVUZqTEUxQlFVMHNRMEZCUXl4WlFVRlpMRU5CUVVNc1RVRkJUU3hGUVVGRkxHbENRVUZwUWl4RFFVRkRMRU5CUVVNN1FVRkROMFFzWTBGQll5eE5RVUZOTEVOQlFVTXNUVUZCVFN4SFFVRkhMRTFCUVUwN1FVRkRjRU1zWjBKQlFXZENMRTFCUVUwc1EwRkJReXhWUVVGVkxFTkJRVU1zVjBGQlZ5eERRVUZETEUxQlFVMHNRMEZCUXl4RFFVRkRPMEZCUTNSRU8wRkJRMEU3UVVGRFFTeG5Ra0ZCWjBJc1RVRkJUU3hEUVVGRExHMUNRVUZ0UWp0QlFVTXhReXhyUWtGQmEwSXNiMEpCUVc5Q08wRkJRM1JETEd0Q1FVRnJRaXhqUVVGak8wRkJRMmhETEdsQ1FVRnBRaXhEUVVGRE8wRkJRMnhDTEdkQ1FVRm5RaXh0UWtGQmJVSXNRMEZCUXl4UFFVRlBMRU5CUVVNc1MwRkJTeXhKUVVGSk8wRkJRM0pFTEd0Q1FVRnJRaXhKUVVGSkxFdEJRVXNzUjBGQlJ5eEpRVUZKTEZkQlFWY3NRMEZCUXl4dlFrRkJiMElzUlVGQlJUdEJRVU53UlN4dlFrRkJiMElzVFVGQlRTeEZRVUZGTEVWQlFVVXNTMEZCU3l4RlFVRkZMRXRCUVVzc1JVRkJSU3hQUVVGUExFVkJRVVVzVDBGQlR5eEZRVUZGTzBGQlF6bEVMRzFDUVVGdFFpeERRVUZETEVOQlFVTTdRVUZEY2tJc2EwSkJRV3RDTEUxQlFVMHNRMEZCUXl4aFFVRmhMRU5CUVVNc1MwRkJTeXhEUVVGRExFTkJRVU03UVVGRE9VTXNhVUpCUVdsQ0xFTkJRVU1zUTBGQlF6dEJRVU51UWl4bFFVRmxMRU5CUVVNN1FVRkRhRUlzWTBGQll5eE5RVUZOTEVOQlFVTXNVMEZCVXl4SFFVRkhMRWxCUVVrc1EwRkJReXhOUVVGTkxFTkJRVU03UVVGRE4wTXNZMEZCWXl4RFFVRkRMRkZCUVZFc1EwRkJReXhKUVVGSkxFbEJRVWtzVVVGQlVTeERRVUZETEdWQlFXVXNSVUZCUlN4WFFVRlhMRU5CUVVNc1RVRkJUU3hEUVVGRExFTkJRVU03UVVGRE9VVXNZMEZCWXl4TlFVRk5MRU5CUVVNc1RVRkJUU3hGUVVGRkxFTkJRVU03UVVGRE9VSTdRVUZEUVN4alFVRmpMRzlDUVVGdlFpeERRVUZETEZWQlFWVXNRMEZCUXl4RFFVRkRPMEZCUXk5RExHRkJRV0VzVFVGQlRTeEpRVUZKTEVsQlFVa3NRMEZCUXl4SlFVRkpMRXRCUVVzc1pVRkJaU3hGUVVGRk8wRkJRM1JFTEdOQlFXTXNTVUZCU1N4TFFVRkxMRWRCUVVjc1NVRkJTU3hEUVVGRExFbEJRVWtzUTBGQlF5eE5RVUZOTEVOQlFVTXNRMEZCUXp0QlFVTTFReXhqUVVGakxFbEJRVWtzU1VGQlNTeERRVUZETEZWQlFWVXNSVUZCUlR0QlFVTnVReXhuUWtGQlowSXNWVUZCVlN4RFFVRkRMRWxCUVVrc1EwRkJRenRCUVVOb1F5eHJRa0ZCYTBJc1RVRkJUU3hGUVVGRkxGbEJRVms3UVVGRGRFTXNhMEpCUVd0Q0xFdEJRVXNzUlVGQlJTeExRVUZMTzBGQlF6bENMR2xDUVVGcFFpeERRVUZETEVOQlFVTTdRVUZEYmtJc1pVRkJaVHRCUVVObUxHRkJRV0U3UVVGRFlpeFhRVUZYTEVOQlFVTXNRMEZCUXp0QlFVTmlMRk5CUVZNc1EwRkJReXhEUVVGRE8wRkJRMWdzVDBGQlR5eERRVUZETEVOQlFVTTdRVUZEVkN4TFFVRkxMRU5CUVVNc1EwRkJRenRCUVVOUUxFZEJRVWNzUTBGQlF6dEJRVU5LTzBGQlEwRTdRVUZEUVN4RlFVRkZMRmxCUVZrN1FVRkRaQ3hKUVVGSkxEWkVRVUUyUkR0QlFVTnFSU3hKUVVGSkxGRkJRVkU3UVVGRFdpeEhRVUZITEVOQlFVTTdRVUZEU2l4RFFVRkRPMEZCUTBRN1FVRkRRU3hKUVVGSkxGTkJRVk1zUlVGQlJUdEJRVU5tTEVWQlFVVXNUVUZCVFN4VFFVRlRMRWRCUVVjc1NVRkJTU3hsUVVGbExFTkJRVU1zVFVGQlRTeERRVUZETEZGQlFWRXNRMEZCUXl4TlFVRk5MRU5CUVVNc1EwRkJRenRCUVVOb1JUdEJRVU5CTzBGQlEwRXNSVUZCUlN4SlFVRkpMRk5CUVZNc1EwRkJReXhIUVVGSExFTkJRVU1zZDBKQlFYZENMRU5CUVVNc1JVRkJSVHRCUVVNdlF5eEpRVUZKTEc5Q1FVRnZRaXhGUVVGRkxFTkJRVU03UVVGRE0wSXNSMEZCUnp0QlFVTklMRU5CUVVNN096czdJbjA9XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIEFjdGl2ZSBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYW5pbWF0aW9ucyA9IFtdO1xuICAgIHRoaXMuZHVyYXRpb24gPSAtMTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuYW5pbWF0aW9ucy5sZW5ndGggPSAwO1xuICAgIHRoaXMuZHVyYXRpb24gPSAtMTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmEgZXh0ZW5kcyBDb21wb25lbnQge31cblxuQ2FtZXJhLnNjaGVtYSA9IHtcbiAgZm92OiB7IGRlZmF1bHQ6IDQ1LCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgYXNwZWN0OiB7IGRlZmF1bHQ6IDEsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBuZWFyOiB7IGRlZmF1bHQ6IDAuMSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGZhcjogeyBkZWZhdWx0OiAxMDAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbGF5ZXJzOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9XG59O1xuIiwiZXhwb3J0IGNsYXNzIENhbWVyYVJpZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVmdEhhbmQgPSBudWxsO1xuICAgIHRoaXMucmlnaHRIYW5kID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDb2xsaWRpbmcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbGxpZGluZ1dpdGggPSBbXTtcbiAgICB0aGlzLmNvbGxpZGluZ0ZyYW1lID0gMDtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvbGxpZGluZ1dpdGgubGVuZ3RoID0gMDtcbiAgICB0aGlzLmNvbGxpZGluZ0ZyYW1lID0gMDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENvbGxpc2lvblN0YXJ0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoID0gW107XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoLmxlbmd0aCA9IDA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDb2xsaXNpb25TdG9wIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoID0gW107XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoLmxlbmd0aCA9IDA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEcmFnZ2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgRHJhZ2dpbmcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudCB7XG4gIHJlc2V0KCkge31cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnByZXNldCA9IFwiZGVmYXVsdFwiO1xuICAgIHRoaXMuc2VlZCA9IDE7XG4gICAgdGhpcy5za3lUeXBlID0gXCJhdG1vc3BoZXJlXCI7XG4gICAgdGhpcy5za3lDb2xvciA9IFwiXCI7XG4gICAgdGhpcy5ob3Jpem9uQ29sb3IgPSBcIlwiO1xuICAgIHRoaXMubGlnaHRpbmcgPSBcImRpc3RhbnRcIjtcbiAgICB0aGlzLnNoYWRvdyA9IGZhbHNlO1xuICAgIHRoaXMuc2hhZG93U2l6ZSA9IDEwO1xuICAgIHRoaXMubGlnaHRQb3NpdGlvbiA9IHsgeDogMCwgeTogMSwgejogLTAuMiB9O1xuICAgIHRoaXMuZm9nID0gMDtcblxuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXlBcmVhID0gMTtcblxuICAgIHRoaXMuZ3JvdW5kID0gXCJmbGF0XCI7XG4gICAgdGhpcy5ncm91bmRZU2NhbGUgPSAzO1xuICAgIHRoaXMuZ3JvdW5kVGV4dHVyZSA9IFwibm9uZVwiO1xuICAgIHRoaXMuZ3JvdW5kQ29sb3IgPSBcIiM1NTNlMzVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yMiA9IFwiIzY5NDQzOVwiO1xuXG4gICAgdGhpcy5kcmVzc2luZyA9IFwibm9uZVwiO1xuICAgIHRoaXMuZHJlc3NpbmdBbW91bnQgPSAxMDtcbiAgICB0aGlzLmRyZXNzaW5nQ29sb3IgPSBcIiM3OTU0NDlcIjtcbiAgICB0aGlzLmRyZXNzaW5nU2NhbGUgPSA1O1xuICAgIHRoaXMuZHJlc3NpbmdWYXJpYW5jZSA9IHsgeDogMSwgeTogMSwgejogMSB9O1xuICAgIHRoaXMuZHJlc3NpbmdVbmlmb3JtU2NhbGUgPSB0cnVlO1xuICAgIHRoaXMuZHJlc3NpbmdPblBsYXlBcmVhID0gMDtcblxuICAgIHRoaXMuZ3JpZCA9IFwibm9uZVwiO1xuICAgIHRoaXMuZ3JpZENvbG9yID0gXCIjY2NjXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHZW9tZXRyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnVybCA9IFwiXCI7XG4gICAgdGhpcy5yZWNlaXZlU2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5jYXN0U2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5lbnZNYXBPdmVycmlkZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTW9kZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5wdXRTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudnJjb250cm9sbGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmtleWJvYXJkID0ge307XG4gICAgdGhpcy5tb3VzZSA9IHt9O1xuICAgIHRoaXMuZ2FtZXBhZHMgPSB7fTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY29uc3QgU0lERVMgPSB7XG4gIGZyb250OiAwLFxuICBiYWNrOiAxLFxuICBkb3VibGU6IDJcbn07XG5cbmV4cG9ydCBjb25zdCBTSEFERVJTID0ge1xuICBzdGFuZGFyZDogMCxcbiAgZmxhdDogMVxufTtcblxuZXhwb3J0IGNvbnN0IEJMRU5ESU5HID0ge1xuICBub3JtYWw6IDAsXG4gIGFkZGl0aXZlOiAxLFxuICBzdWJ0cmFjdGl2ZTogMixcbiAgbXVsdGlwbHk6IDNcbn07XG5cbmV4cG9ydCBjb25zdCBWRVJURVhfQ09MT1JTID0ge1xuICBub25lOiAwLFxuICBmYWNlOiAxLFxuICB2ZXJ0ZXg6IDJcbn07XG5cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sb3IgPSAweGZmMDAwMDtcbiAgICB0aGlzLmFscGhhVGVzdCA9IDA7XG4gICAgdGhpcy5kZXB0aFRlc3QgPSB0cnVlO1xuICAgIHRoaXMuZGVwdGhXcml0ZSA9IHRydWU7XG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubnBvdCA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG4gICAgdGhpcy5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLCAxKTtcbiAgICB0aGlzLnNoYWRlciA9IFNIQURFUlMuc3RhbmRhcmQ7XG4gICAgdGhpcy5zaWRlID0gU0lERVMuZnJvbnQ7XG4gICAgdGhpcy50cmFuc3BhcmVudCA9IGZhbHNlO1xuICAgIHRoaXMudmVydGV4Q29sb3JzID0gVkVSVEVYX0NPTE9SUy5ub25lO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5ibGVuZGluZyA9IEJMRU5ESU5HLm5vcm1hbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sb3IgPSAweGZmMDAwMDtcbiAgICB0aGlzLmFscGhhVGVzdCA9IDA7XG4gICAgdGhpcy5kZXB0aFRlc3QgPSB0cnVlO1xuICAgIHRoaXMuZGVwdGhXcml0ZSA9IHRydWU7XG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubnBvdCA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0LnNldCgwLCAwKTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG4gICAgdGhpcy5yZXBlYXQuc2V0KDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmVudE9iamVjdDNEIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufSIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgUGxheSBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZS5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgUmVuZGVyUGFzcyBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5SZW5kZXJQYXNzLnNjaGVtYSA9IHtcbiAgc2NlbmU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGNhbWVyYTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImV4cG9ydCBjbGFzcyBSaWdpZEJvZHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5vYmplY3QgPSBudWxsO1xuICAgIHRoaXMud2VpZ2h0ID0gMDtcbiAgICB0aGlzLnJlc3RpdHV0aW9uID0gMTtcbiAgICB0aGlzLmZyaWN0aW9uID0gMTtcbiAgICB0aGlzLmxpbmVhckRhbXBpbmcgPSAwO1xuICAgIHRoaXMuYW5ndWxhckRhbXBpbmcgPSAwO1xuICAgIHRoaXMubGluZWFyVmVsb2NpdHkgPSB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2NhbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFNjZW5lIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgU2hhcGUge1xuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5Qm94IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNvdW5kIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zb3VuZCA9IG51bGw7XG4gICAgdGhpcy51cmwgPSBcIlwiO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFN0b3AgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBUZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgICB0aGlzLnRleHRBbGlnbiA9IFwibGVmdFwiOyAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ11cbiAgICB0aGlzLmFuY2hvciA9IFwiY2VudGVyXCI7IC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICAgIHRoaXMuYmFzZWxpbmUgPSBcImNlbnRlclwiOyAvLyBbJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJ11cbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgdGhpcy5mb250ID0gXCJcIjsgLy9cImh0dHBzOi8vY29kZS5jZG4ubW96aWxsYS5uZXQvZm9udHMvdHRmL1ppbGxhU2xhYi1TZW1pQm9sZC50dGZcIjtcbiAgICB0aGlzLmZvbnRTaXplID0gMC4yO1xuICAgIHRoaXMubGV0dGVyU3BhY2luZyA9IDA7XG4gICAgdGhpcy5saW5lSGVpZ2h0ID0gMDtcbiAgICB0aGlzLm1heFdpZHRoID0gSW5maW5pdHk7XG4gICAgdGhpcy5vdmVyZmxvd1dyYXAgPSBcIm5vcm1hbFwiOyAvLyBbJ25vcm1hbCcsICdicmVhay13b3JkJ11cbiAgICB0aGlzLndoaXRlU3BhY2UgPSBcIm5vcm1hbFwiOyAvLyBbJ25vcm1hbCcsICdub3dyYXAnXVxuICAgIHRoaXMub3BhY2l0eSA9IDE7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHQgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0IHsgY3JlYXRlVHlwZSwgY29weUNvcHlhYmxlLCBjbG9uZUNsb25hYmxlIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFZlY3RvcjMge1xuICBjb25zdHJ1Y3Rvcih4ID0gMCwgeSA9IDAsIHogPSAwKSB7XG4gICAgdGhpcy5zZXQoeCwgeSwgeik7XG4gIH1cblxuICBzZXQoeCwgeSwgeikge1xuICAgIHRoaXMueCA9IHg7XG4gICAgdGhpcy55ID0geTtcbiAgICB0aGlzLnogPSB6O1xuICB9XG5cbiAgY29weShzb3VyY2UpIHtcbiAgICB0aGlzLnggPSBzb3VyY2UueDtcbiAgICB0aGlzLnkgPSBzb3VyY2UueTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yMyh0aGlzLngsIHRoaXMueSwgdGhpcy56KTtcbiAgfVxufVxuXG5leHBvcnQgY29uc3QgVmVjdG9yM1R5cGUgPSBjcmVhdGVUeXBlKHtcbiAgbmFtZTogXCJWZWN0b3IzXCIsXG4gIGRlZmF1bHQ6IG5ldyBWZWN0b3IzKCksXG4gIGNvcHk6IGNvcHlDb3B5YWJsZSxcbiAgY2xvbmU6IGNsb25lQ2xvbmFibGVcbn0pO1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uL1R5cGVzLmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5UcmFuc2Zvcm0uc2NoZW1hID0ge1xuICBwb3NpdGlvbjogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjMgfSxcbiAgcm90YXRpb246IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzIH1cbn07XG4iLCJleHBvcnQgY2xhc3MgVmlzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNlbGVjdCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RlbmQgPSBudWxsO1xuXG4gICAgdGhpcy5jb25uZWN0ZWQgPSBudWxsO1xuXG4gICAgdGhpcy5zcXVlZXplID0gbnVsbDtcbiAgICB0aGlzLnNxdWVlemVzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplZW5kID0gbnVsbDtcbiAgfVxufSIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5XZWJHTFJlbmRlcmVyLnNjaGVtYSA9IHtcbiAgdnI6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYXI6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgc2hhZG93TWFwOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfVxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgQ29udHJvbGxlckNvbm5lY3RlZCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0sIE5vdCwgU3lzdGVtU3RhdGVDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgTWF0ZXJpYWwsXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuY2xhc3MgTWF0ZXJpYWxJbnN0YW5jZSBleHRlbmRzIFN5c3RlbVN0YXRlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLm5ldy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoTWF0ZXJpYWwpO1xuICAgIH0pO1xuICB9XG59XG5cbk1hdGVyaWFsU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIG5ldzoge1xuICAgIGNvbXBvbmVudHM6IFtNYXRlcmlhbCwgTm90KE1hdGVyaWFsSW5zdGFuY2UpXVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldFJlbW92ZWRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIHBhcmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50LCB0cnVlKS52YWx1ZTtcbiAgICAgIHBhcmVudC5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnJlbW92ZShvYmplY3QpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR2VvbWV0cnkpO1xuXG4gICAgICB2YXIgZ2VvbWV0cnk7XG4gICAgICBzd2l0Y2ggKGNvbXBvbmVudC5wcmltaXRpdmUpIHtcbiAgICAgICAgY2FzZSBcInRvcnVzXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGl1cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YmUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpYWxTZWdtZW50cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YnVsYXJTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzcGhlcmVcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5KGNvbXBvbmVudC5yYWRpdXMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQud2lkdGgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5kZXB0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9XG4gICAgICAgIGNvbXBvbmVudC5wcmltaXRpdmUgPT09IFwidG9ydXNcIiA/IDB4OTk5OTAwIDogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KE1hdGVyaWFsKSkge1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgfVxuKi9cblxuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIGZsYXRTaGFkaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFRyYW5zZm9ybSkpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGlvbikge1xuICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoRWxlbWVudCkgJiYgIWVudGl0eS5oYXNDb21wb25lbnQoRHJhZ2dhYmxlKSkge1xuICAgICAgLy8gICAgICAgIG9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXQoMHgzMzMzMzMpO1xuICAgICAgLy8gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5HZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHZW9tZXRyeV0sIC8vIEB0b2RvIFRyYW5zZm9ybTogQXMgb3B0aW9uYWwsIGhvdyB0byBkZWZpbmUgaXQ/XG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBHTFRGTG9hZGVyIGFzIEdMVEZMb2FkZXJUaHJlZSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcbmltcG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTG9hZGVyLmpzXCI7XG5cbi8vIEB0b2RvIFVzZSBwYXJhbWV0ZXIgYW5kIGxvYWRlciBtYW5hZ2VyXG52YXIgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXJUaHJlZSgpOyAvLy5zZXRQYXRoKFwiL2Fzc2V0cy9tb2RlbHMvXCIpO1xuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZMb2FkZXIpO1xuXG4gICAgICBsb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBnbHRmID0+IHtcbiAgICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICAgIGNoaWxkLnJlY2VpdmVTaGFkb3cgPSBjb21wb25lbnQucmVjZWl2ZVNoYWRvdztcbiAgICAgICAgICAgIGNoaWxkLmNhc3RTaGFkb3cgPSBjb21wb25lbnQuY2FzdFNoYWRvdztcblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZSkge1xuICAgICAgICAgICAgICBjaGlsZC5tYXRlcmlhbC5lbnZNYXAgPSBjb21wb25lbnQuZW52TWFwT3ZlcnJpZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChHTFRGTW9kZWwsIHsgdmFsdWU6IGdsdGYgfSk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcHBlbmQpIHtcbiAgICAgICAgICBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWUuYWRkKGdsdGYuc2NlbmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdsdGYuc2NlbmUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudC5vbkxvYWRlZCkge1xuICAgICAgICAgIGNvbXBvbmVudC5vbkxvYWRlZChnbHRmLnNjZW5lLCBnbHRmKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCwgdHJ1ZSkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn1cblxuR0xURkxvYWRlclN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFNreUJveCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBTa3lCb3hTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgbGV0IHNreWJveCA9IGVudGl0eS5nZXRDb21wb25lbnQoU2t5Qm94KTtcblxuICAgICAgbGV0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMTAwLCAxMDAsIDEwMCk7XG4gICAgICBnZW9tZXRyeS5zY2FsZSgxLCAxLCAtMSk7XG5cbiAgICAgIGlmIChza3lib3gudHlwZSA9PT0gXCJjdWJlbWFwLXN0ZXJlb1wiKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShza3lib3gudGV4dHVyZVVybCwgMTIpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFscy5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgICBza3lCb3gubGF5ZXJzLnNldCgxKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveCk7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFsc1IgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gNjsgaiA8IDEyOyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHNSLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94UiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHNSKTtcbiAgICAgICAgc2t5Qm94Ui5sYXllcnMuc2V0KDIpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94Uik7XG5cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmtub3duIHNreWJveCB0eXBlOiBcIiwgc2t5Ym94LnR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoYXRsYXNJbWdVcmwsIHRpbGVzTnVtKSB7XG4gIGxldCB0ZXh0dXJlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXNOdW07IGkrKykge1xuICAgIHRleHR1cmVzW2ldID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgfVxuXG4gIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoKTtcbiAgbG9hZGVyLmxvYWQoYXRsYXNJbWdVcmwsIGZ1bmN0aW9uKGltYWdlT2JqKSB7XG4gICAgbGV0IGNhbnZhcywgY29udGV4dDtcbiAgICBsZXQgdGlsZVdpZHRoID0gaW1hZ2VPYmouaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRpbGVXaWR0aDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRpbGVXaWR0aDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZU9iaixcbiAgICAgICAgdGlsZVdpZHRoICogaSxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoXG4gICAgICApO1xuICAgICAgdGV4dHVyZXNbaV0uaW1hZ2UgPSBjYW52YXM7XG4gICAgICB0ZXh0dXJlc1tpXS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGV4dHVyZXM7XG59XG5cblNreUJveFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtTa3lCb3gsIE5vdChPYmplY3QzRCldXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVmlzaWJsZSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJpbGl0eVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHByb2Nlc3NWaXNpYmlsaXR5KGVudGl0aWVzKSB7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFxuICAgICAgICBWaXNpYmxlXG4gICAgICApLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRNZXNoIH0gZnJvbSBcInRyb2lrYS0zZC10ZXh0L2Rpc3QvdGV4dG1lc2gtc3RhbmRhbG9uZS5lc20uanNcIjtcbmltcG9ydCB7IE9iamVjdDNELCBUZXh0IH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5cbmNvbnN0IGFuY2hvck1hcHBpbmcgPSB7XG4gIGxlZnQ6IDAsXG4gIGNlbnRlcjogMC41LFxuICByaWdodDogMVxufTtcbmNvbnN0IGJhc2VsaW5lTWFwcGluZyA9IHtcbiAgdG9wOiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgYm90dG9tOiAxXG59O1xuXG5leHBvcnQgY2xhc3MgU0RGVGV4dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpIHtcbiAgICB0ZXh0TWVzaC50ZXh0ID0gdGV4dENvbXBvbmVudC50ZXh0O1xuICAgIHRleHRNZXNoLnRleHRBbGlnbiA9IHRleHRDb21wb25lbnQudGV4dEFsaWduO1xuICAgIHRleHRNZXNoLmFuY2hvclswXSA9IGFuY2hvck1hcHBpbmdbdGV4dENvbXBvbmVudC5hbmNob3JdO1xuICAgIHRleHRNZXNoLmFuY2hvclsxXSA9IGJhc2VsaW5lTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmJhc2VsaW5lXTtcbiAgICB0ZXh0TWVzaC5jb2xvciA9IHRleHRDb21wb25lbnQuY29sb3I7XG4gICAgdGV4dE1lc2guZm9udCA9IHRleHRDb21wb25lbnQuZm9udDtcbiAgICB0ZXh0TWVzaC5mb250U2l6ZSA9IHRleHRDb21wb25lbnQuZm9udFNpemU7XG4gICAgdGV4dE1lc2gubGV0dGVyU3BhY2luZyA9IHRleHRDb21wb25lbnQubGV0dGVyU3BhY2luZyB8fCAwO1xuICAgIHRleHRNZXNoLmxpbmVIZWlnaHQgPSB0ZXh0Q29tcG9uZW50LmxpbmVIZWlnaHQgfHwgbnVsbDtcbiAgICB0ZXh0TWVzaC5vdmVyZmxvd1dyYXAgPSB0ZXh0Q29tcG9uZW50Lm92ZXJmbG93V3JhcDtcbiAgICB0ZXh0TWVzaC53aGl0ZVNwYWNlID0gdGV4dENvbXBvbmVudC53aGl0ZVNwYWNlO1xuICAgIHRleHRNZXNoLm1heFdpZHRoID0gdGV4dENvbXBvbmVudC5tYXhXaWR0aDtcbiAgICB0ZXh0TWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gdGV4dENvbXBvbmVudC5vcGFjaXR5O1xuICAgIHRleHRNZXNoLnN5bmMoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzO1xuXG4gICAgZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG5cbiAgICAgIGNvbnN0IHRleHRNZXNoID0gbmV3IFRleHRNZXNoKCk7XG4gICAgICB0ZXh0TWVzaC5uYW1lID0gXCJ0ZXh0TWVzaFwiO1xuICAgICAgdGV4dE1lc2guYW5jaG9yID0gWzAsIDBdO1xuICAgICAgdGV4dE1lc2gucmVuZGVyT3JkZXIgPSAxMDsgLy9icnV0ZS1mb3JjZSBmaXggZm9yIHVnbHkgYW50aWFsaWFzaW5nLCBzZWUgaXNzdWUgIzY3XG4gICAgICB0aGlzLnVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpO1xuICAgICAgZS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IHRleHRNZXNoIH0pO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIHRleHRNZXNoID0gb2JqZWN0M0QuZ2V0T2JqZWN0QnlOYW1lKFwidGV4dE1lc2hcIik7XG4gICAgICB0ZXh0TWVzaC5kaXNwb3NlKCk7XG4gICAgICBvYmplY3QzRC5yZW1vdmUodGV4dE1lc2gpO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMuY2hhbmdlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgaWYgKG9iamVjdDNEIGluc3RhbmNlb2YgVGV4dE1lc2gpIHtcbiAgICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KG9iamVjdDNELCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5TREZUZXh0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RleHRdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhLFxuICBBY3RpdmUsXG4gIFdlYkdMUmVuZGVyZXIsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFZSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9WUkJ1dHRvbi5qc1wiO1xuaW1wb3J0IHsgQVJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL0FSQnV0dG9uLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVycyA9IHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cztcbiAgICByZW5kZXJlcnMuZm9yRWFjaChyZW5kZXJlckVudGl0eSA9PiB7XG4gICAgICB2YXIgcmVuZGVyZXIgPSByZW5kZXJlckVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlclBhc3Nlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIHBhc3MgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFJlbmRlclBhc3MpO1xuICAgICAgICB2YXIgc2NlbmUgPSBwYXNzLnNjZW5lLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgICAgdGhpcy5xdWVyaWVzLmFjdGl2ZUNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYUVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNhbWVyYSA9IGNhbWVyYUVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGNvbXBvbmVudC5zaGFkb3dNYXA7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIgfHwgY29tcG9uZW50LmFyKSB7XG4gICAgICAgIHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFZSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUGFyZW50T2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgUG9zaXRpb24sXG4gIFNjYWxlLFxuICBQYXJlbnQsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgaWYgKCFlbnRpdHkuYWxpdmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0QpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGllcmFyY2h5XG4gICAgdGhpcy5xdWVyaWVzLnBhcmVudE9iamVjdDNELmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50T2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICB9KTtcblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGlmICghZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGxldCBwb3NpdGlvbnMgPSB0aGlzLnF1ZXJpZXMucG9zaXRpb25zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmFkZGVkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gU2NhbGVcbiAgICBsZXQgc2NhbGVzID0gdGhpcy5xdWVyaWVzLnNjYWxlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHNjYWxlcy5hZGRlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5zY2FsZS5jb3B5KHNjYWxlKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmNoYW5nZWRbaV07XG4gICAgICBsZXQgc2NhbGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjYWxlKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50T2JqZWN0M0Q6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50T2JqZWN0M0QsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3Jtczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgVHJhbnNmb3JtXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RyYW5zZm9ybV1cbiAgICB9XG4gIH0sXG4gIHBvc2l0aW9uczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgUG9zaXRpb25dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbUG9zaXRpb25dXG4gICAgfVxuICB9LFxuICBzY2FsZXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0QsIFNjYWxlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1NjYWxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IENhbWVyYSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYSA9PiB7XG4gICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNhbWVyYS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgY2FtZXJhLmdldE11dGFibGVDb21wb25lbnQoQ2FtZXJhKS5hc3BlY3QgPVxuICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5jaGFuZ2VkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNoYW5nZWRbaV07XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICBsZXQgY2FtZXJhM2QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIGlmIChjYW1lcmEzZC5hc3BlY3QgIT09IGNvbXBvbmVudC5hc3BlY3QpIHtcbiAgICAgICAgY2FtZXJhM2QuYXNwZWN0ID0gY29tcG9uZW50LmFzcGVjdDtcbiAgICAgICAgY2FtZXJhM2QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgICAgLy8gQHRvZG8gRG8gaXQgZm9yIHRoZSByZXN0IG9mIHRoZSB2YWx1ZXNcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhc1VuaW5pdGlhbGl6ZWQucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuXG4gICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICBjb21wb25lbnQuZm92LFxuICAgICAgICBjb21wb25lbnQuYXNwZWN0LFxuICAgICAgICBjb21wb25lbnQubmVhcixcbiAgICAgICAgY29tcG9uZW50LmZhclxuICAgICAgKTtcblxuICAgICAgY2FtZXJhLmxheWVycy5lbmFibGUoY29tcG9uZW50LmxheWVycyk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGNhbWVyYSB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5DYW1lcmFTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhc1VuaW5pdGlhbGl6ZWQ6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBOb3QoT2JqZWN0M0QpXVxuICB9LFxuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW0NhbWVyYV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNEXCI7XG5pbXBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9UZXh0R2VvbWV0cnlcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgLypcbiAgICBsb2FkZXIubG9hZChcIi9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIiwgZm9udCA9PiB7XG4gICAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gICAgKi9cbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHJldHVybjtcblxuICAgIHZhciBjaGFuZ2VkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQ7XG4gICAgY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIG9iamVjdC5nZW9tZXRyeSA9IGdlb21ldHJ5O1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZGVkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkO1xuICAgIGFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb2xvciA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcbiAgICAgIGNvbG9yID0gMHhmZmZmZmY7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogbWVzaCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dEdlb21ldHJ5XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCwgU2NlbmUsIE9iamVjdDNELCBFbnZpcm9ubWVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudmlyb25tZW50cy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAvLyBzdGFnZSBncm91bmQgZGlhbWV0ZXIgKGFuZCBza3kgcmFkaXVzKVxuICAgICAgdmFyIFNUQUdFX1NJWkUgPSAyMDA7XG5cbiAgICAgIC8vIGNyZWF0ZSBncm91bmRcbiAgICAgIC8vIHVwZGF0ZSBncm91bmQsIHBsYXlhcmVhIGFuZCBncmlkIHRleHR1cmVzLlxuICAgICAgdmFyIGdyb3VuZFJlc29sdXRpb24gPSAyMDQ4O1xuICAgICAgdmFyIHRleE1ldGVycyA9IDIwOyAvLyBncm91bmQgdGV4dHVyZSBvZiAyMCB4IDIwIG1ldGVyc1xuICAgICAgdmFyIHRleFJlcGVhdCA9IFNUQUdFX1NJWkUgLyB0ZXhNZXRlcnM7XG5cbiAgICAgIHZhciByZXNvbHV0aW9uID0gNjQ7IC8vIG51bWJlciBvZiBkaXZpc2lvbnMgb2YgdGhlIGdyb3VuZCBtZXNoXG5cbiAgICAgIHZhciBncm91bmRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgZ3JvdW5kQ2FudmFzLndpZHRoID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZENhbnZhcy5oZWlnaHQgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgdmFyIGdyb3VuZFRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShncm91bmRDYW52YXMpO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS5yZXBlYXQuc2V0KHRleFJlcGVhdCwgdGV4UmVwZWF0KTtcblxuICAgICAgdGhpcy5lbnZpcm9ubWVudERhdGEgPSB7XG4gICAgICAgIGdyb3VuZENvbG9yOiBcIiM0NTQ1NDVcIixcbiAgICAgICAgZ3JvdW5kQ29sb3IyOiBcIiM1ZDVkNWRcIlxuICAgICAgfTtcblxuICAgICAgdmFyIGdyb3VuZGN0eCA9IGdyb3VuZENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgIHZhciBzaXplID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjtcbiAgICAgIGdyb3VuZGN0eC5maWxsUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjI7XG4gICAgICB2YXIgbnVtID0gTWF0aC5mbG9vcih0ZXhNZXRlcnMgLyAyKTtcbiAgICAgIHZhciBzdGVwID0gc2l6ZSAvICh0ZXhNZXRlcnMgLyAyKTsgLy8gMiBtZXRlcnMgPT0gPHN0ZXA+IHBpeGVsc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW0gKyAxOyBpICs9IDIpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW0gKyAxOyBqKyspIHtcbiAgICAgICAgICBncm91bmRjdHguZmlsbFJlY3QoXG4gICAgICAgICAgICBNYXRoLmZsb29yKChpICsgKGogJSAyKSkgKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3IoaiAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdyb3VuZFRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICB2YXIgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIG1hcDogZ3JvdW5kVGV4dHVyZVxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzY2VuZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NlbmUpLnZhbHVlLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAvL3NjZW5lLmFkZChtZXNoKTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICBTVEFHRV9TSVpFICsgMixcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIHJlc29sdXRpb24gLSAxLFxuICAgICAgICByZXNvbHV0aW9uIC0gMVxuICAgICAgKTtcblxuICAgICAgbGV0IG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBncm91bmRNYXRlcmlhbCk7XG4gICAgICBvYmplY3Qucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChQYXJlbnQsIHsgdmFsdWU6IHdpbmRvdy5lbnRpdHlTY2VuZSB9KTtcblxuICAgICAgY29uc3QgY29sb3IgPSAweDMzMzMzMztcbiAgICAgIGNvbnN0IG5lYXIgPSAyMDtcbiAgICAgIGNvbnN0IGZhciA9IDEwMDtcbiAgICAgIHNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2coY29sb3IsIG5lYXIsIGZhcik7XG4gICAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKGNvbG9yKTtcbiAgICB9KTtcbiAgfVxufVxuXG5FbnZpcm9ubWVudFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnZpcm9ubWVudHM6IHtcbiAgICBjb21wb25lbnRzOiBbU2NlbmUsIEVudmlyb25tZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlckNvbnRleHQsXG4gIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLFxuICBWUkNvbnRyb2xsZXIsXG4gIENvbnRyb2xsZXJDb25uZWN0ZWQsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuaW1wb3J0IHsgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5IH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9YUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkuanNcIjtcblxudmFyIGNvbnRyb2xsZXJNb2RlbEZhY3RvcnkgPSBuZXcgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5KCk7XG5cbmV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCByZW5kZXJlciA9IHRoaXMucXVlcmllcy5yZW5kZXJlckNvbnRleHQucmVzdWx0c1swXS5nZXRDb21wb25lbnQoXG4gICAgICBXZWJHTFJlbmRlcmVyQ29udGV4dFxuICAgICkudmFsdWU7XG5cbiAgICB0aGlzLnF1ZXJpZXMuY29udHJvbGxlcnMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGNvbnRyb2xsZXJJZCA9IGVudGl0eS5nZXRDb21wb25lbnQoVlJDb250cm9sbGVyKS5pZDtcbiAgICAgIHZhciBjb250cm9sbGVyID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlcihjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlci5uYW1lID0gXCJjb250cm9sbGVyXCI7XG5cbiAgICAgIHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgZ3JvdXAuYWRkKGNvbnRyb2xsZXIpO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG5cbiAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNvbm5lY3RlZFwiLCAoKSA9PiB7XG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQ29udHJvbGxlckNvbm5lY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwiZGlzY29ubmVjdGVkXCIsICgpID0+IHtcbiAgICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChDb250cm9sbGVyQ29ubmVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cikpIHtcbiAgICAgICAgdmFyIGJlaGF2aW91ciA9IGVudGl0eS5nZXRDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpO1xuICAgICAgICBPYmplY3Qua2V5cyhiZWhhdmlvdXIpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICBpZiAoYmVoYXZpb3VyW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGJlaGF2aW91cltldmVudE5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5IHdpbGwgYXV0b21hdGljYWxseSBmZXRjaCBjb250cm9sbGVyIG1vZGVsc1xuICAgICAgLy8gdGhhdCBtYXRjaCB3aGF0IHRoZSB1c2VyIGlzIGhvbGRpbmcgYXMgY2xvc2VseSBhcyBwb3NzaWJsZS4gVGhlIG1vZGVsc1xuICAgICAgLy8gc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSBnZXRDb250cm9sbGVyR3JpcCBpblxuICAgICAgLy8gb3JkZXIgdG8gbWF0Y2ggdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBoZWxkIGRldmljZS5cbiAgICAgIGxldCBjb250cm9sbGVyR3JpcCA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXJHcmlwKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyR3JpcC5hZGQoXG4gICAgICAgIGNvbnRyb2xsZXJNb2RlbEZhY3RvcnkuY3JlYXRlQ29udHJvbGxlck1vZGVsKGNvbnRyb2xsZXJHcmlwKVxuICAgICAgKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyR3JpcCk7XG4gICAgICAvKlxuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIFwicG9zaXRpb25cIixcbiAgICAgICAgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoWzAsIDAsIDAsIDAsIDAsIC0xXSwgMylcbiAgICAgICk7XG5cbiAgICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnkpO1xuICAgICAgbGluZS5uYW1lID0gXCJsaW5lXCI7XG4gICAgICBsaW5lLnNjYWxlLnogPSA1O1xuICAgICAgZ3JvdXAuYWRkKGxpbmUpO1xuXG4gICAgICBsZXQgZ2VvbWV0cnkyID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDAuMSwgMC4xLCAwLjEpO1xuICAgICAgbGV0IG1hdGVyaWFsMiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDAwZmYwMCB9KTtcbiAgICAgIGxldCBjdWJlID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnkyLCBtYXRlcmlhbDIpO1xuICAgICAgZ3JvdXAubmFtZSA9IFwiVlJDb250cm9sbGVyXCI7XG4gICAgICBncm91cC5hZGQoY3ViZSk7XG4qL1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcy5jbGVhbkludGVyc2VjdGVkKCk7XG4gIH1cbn1cblxuVlJDb250cm9sbGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGNvbnRyb2xsZXJzOiB7XG4gICAgY29tcG9uZW50czogW1ZSQ29udHJvbGxlcl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgICAgLy9jaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH0sXG4gIHJlbmRlcmVyQ29udGV4dDoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyQ29udGV4dF0sXG4gICAgbWFuZGF0b3J5OiB0cnVlXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBQbGF5LCBTdG9wLCBHTFRGTW9kZWwsIEFuaW1hdGlvbiB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmNsYXNzIEFuaW1hdGlvbk1peGVyQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICByZXNldCgpIHt9XG59XG5cbmNsYXNzIEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgfVxuICByZXNldCgpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKGRlbHRhKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBnbHRmID0gZW50aXR5LmdldENvbXBvbmVudChHTFRGTW9kZWwpLnZhbHVlO1xuICAgICAgbGV0IG1peGVyID0gbmV3IFRIUkVFLkFuaW1hdGlvbk1peGVyKGdsdGYuc2NlbmUpO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChBbmltYXRpb25NaXhlckNvbXBvbmVudCwge1xuICAgICAgICB2YWx1ZTogbWl4ZXJcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYW5pbWF0aW9ucyA9IFtdO1xuICAgICAgZ2x0Zi5hbmltYXRpb25zLmZvckVhY2goYW5pbWF0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG1peGVyLmNsaXBBY3Rpb24oYW5pbWF0aW9uQ2xpcCwgZ2x0Zi5zY2VuZSk7XG4gICAgICAgIGFjdGlvbi5sb29wID0gVEhSRUUuTG9vcE9uY2U7XG4gICAgICAgIGFuaW1hdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgfSk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwge1xuICAgICAgICBhbmltYXRpb25zOiBhbmltYXRpb25zLFxuICAgICAgICBkdXJhdGlvbjogZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb24pLmR1cmF0aW9uXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5taXhlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbk1peGVyQ29tcG9uZW50KS52YWx1ZS51cGRhdGUoZGVsdGEpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLnBsYXlDbGlwcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQpO1xuICAgICAgY29tcG9uZW50LmFuaW1hdGlvbnMuZm9yRWFjaChhY3Rpb25DbGlwID0+IHtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5kdXJhdGlvbiAhPT0gLTEpIHtcbiAgICAgICAgICBhY3Rpb25DbGlwLnNldER1cmF0aW9uKGNvbXBvbmVudC5kdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBhY3Rpb25DbGlwLmNsYW1wV2hlbkZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgYWN0aW9uQ2xpcC5yZXNldCgpO1xuICAgICAgICBhY3Rpb25DbGlwLnBsYXkoKTtcbiAgICAgIH0pO1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChQbGF5KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5zdG9wQ2xpcHMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgYW5pbWF0aW9ucyA9IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudClcbiAgICAgICAgLmFuaW1hdGlvbnM7XG4gICAgICBhbmltYXRpb25zLmZvckVhY2goYWN0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGFjdGlvbkNsaXAucmVzZXQoKTtcbiAgICAgICAgYWN0aW9uQ2xpcC5zdG9wKCk7XG4gICAgICB9KTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoU3RvcCk7XG4gICAgfSk7XG4gIH1cbn1cblxuQW5pbWF0aW9uU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbiwgR0xURk1vZGVsXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICBtaXhlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uTWl4ZXJDb21wb25lbnRdXG4gIH0sXG4gIHBsYXlDbGlwczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50LCBQbGF5XVxuICB9LFxuICBzdG9wQ2xpcHM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwgU3RvcF1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cixcbiAgVlJDb250cm9sbGVyLFxuICBJbnB1dFN0YXRlXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgbGV0IGVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KElucHV0U3RhdGUpO1xuICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KElucHV0U3RhdGUpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWUkNvbnRyb2xsZXJzKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzS2V5Ym9hcmQoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NNb3VzZSgpO1xuICAgIC8vIHRoaXMucHJvY2Vzc0dhbWVwYWRzKCk7XG4gIH1cblxuICBwcm9jZXNzVlJDb250cm9sbGVycygpIHtcbiAgICAvLyBQcm9jZXNzIHJlY2VudGx5IGFkZGVkIGNvbnRyb2xsZXJzXG4gICAgdGhpcy5xdWVyaWVzLnZyY29udHJvbGxlcnMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ciwge1xuICAgICAgICBzZWxlY3RzdGFydDogZXZlbnQgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmdldChldmVudC50YXJnZXQpO1xuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0ZW5kOiBldmVudCA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZ2V0KGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBjb25uZWN0ZWQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5zZXQoZXZlbnQudGFyZ2V0LCB7fSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRpc2Nvbm5lY3RlZDogZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmRlbGV0ZShldmVudC50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmZvckVhY2goc3RhdGUgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0U3RhcnQgPSBzdGF0ZS5zZWxlY3RlZCAmJiAhc3RhdGUucHJldlNlbGVjdGVkO1xuICAgICAgc3RhdGUuc2VsZWN0RW5kID0gIXN0YXRlLnNlbGVjdGVkICYmIHN0YXRlLnByZXZTZWxlY3RlZDtcbiAgICAgIHN0YXRlLnByZXZTZWxlY3RlZCA9IHN0YXRlLnNlbGVjdGVkO1xuICAgIH0pO1xuICB9XG59XG5cbklucHV0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHZyY29udHJvbGxlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbVlJDb250cm9sbGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKGxpc3RlbmVyLCBwb29sU2l6ZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIHRoaXMuY29udGV4dCA9IGxpc3RlbmVyLmNvbnRleHQ7XG5cbiAgICB0aGlzLnBvb2xTaXplID0gcG9vbFNpemUgfHwgNTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9vbFNpemU7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKG5ldyBUSFJFRS5Qb3NpdGlvbmFsQXVkaW8obGlzdGVuZXIpKTtcbiAgICB9XG4gIH1cblxuICBzZXRCdWZmZXIoYnVmZmVyKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKHNvdW5kID0+IHtcbiAgICAgIHNvdW5kLnNldEJ1ZmZlcihidWZmZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzb3VuZCA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICBpZiAoIXNvdW5kLmlzUGxheWluZyAmJiBzb3VuZC5idWZmZXIgJiYgIWZvdW5kKSB7XG4gICAgICAgIHNvdW5kLnBsYXkoKTtcbiAgICAgICAgc291bmQuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiQWxsIHRoZSBzb3VuZHMgYXJlIHBsYXlpbmcuIElmIHlvdSBuZWVkIHRvIHBsYXkgbW9yZSBzb3VuZHMgc2ltdWx0YW5lb3VzbHkgY29uc2lkZXIgaW5jcmVhc2luZyB0aGUgcG9vbCBzaXplXCJcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTb3VuZCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyBmcm9tIFwiLi4vbGliL1Bvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMuanNcIjtcblxuZXhwb3J0IGNsYXNzIFNvdW5kU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmxpc3RlbmVyID0gbmV3IFRIUkVFLkF1ZGlvTGlzdGVuZXIoKTtcbiAgfVxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5zb3VuZHMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoU291bmQpO1xuICAgICAgY29uc3Qgc291bmQgPSBuZXcgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyh0aGlzLmxpc3RlbmVyLCAxMCk7XG4gICAgICBjb25zdCBhdWRpb0xvYWRlciA9IG5ldyBUSFJFRS5BdWRpb0xvYWRlcigpO1xuICAgICAgYXVkaW9Mb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBidWZmZXIgPT4ge1xuICAgICAgICBzb3VuZC5zZXRCdWZmZXIoYnVmZmVyKTtcbiAgICAgIH0pO1xuICAgICAgY29tcG9uZW50LnNvdW5kID0gc291bmQ7XG4gICAgfSk7XG4gIH1cbn1cblxuU291bmRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgc291bmRzOiB7XG4gICAgY29tcG9uZW50czogW1NvdW5kXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWUgLy8gW1NvdW5kXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIEVDU1kgZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1TeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE1hdGVyaWFsU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9NYXRlcmlhbFN5c3RlbS5qc1wiO1xuXG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IENhbWVyYVJpZyB9IGZyb20gXCIuL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzXCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL1BhcmVudC5qc1wiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIEFjdGl2ZSxcbiAgUmVuZGVyUGFzcyxcbiAgVHJhbnNmb3JtLFxuICBDYW1lcmFcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSh3b3JsZCA9IG5ldyBFQ1NZLldvcmxkKCksIG9wdGlvbnMpIHtcbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVHJhbnNmb3JtU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShDYW1lcmFTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKE1hdGVyaWFsU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xuXG4gIHdvcmxkXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFNjZW5lKVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChBY3RpdmUpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFJlbmRlclBhc3MpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFRyYW5zZm9ybSlcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoQ2FtZXJhKTtcblxuICBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgdnI6IGZhbHNlLFxuICAgIGRlZmF1bHRzOiB0cnVlXG4gIH07XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgaWYgKCFvcHRpb25zLmRlZmF1bHRzKSB7XG4gICAgcmV0dXJuIHsgd29ybGQgfTtcbiAgfVxuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG5ldyBUSFJFRS5TY2VuZSgpIH0pO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgYXI6IG9wdGlvbnMuYXIsXG4gICAgdnI6IG9wdGlvbnMudnIsXG4gICAgYW5pbWF0aW9uTG9vcDogYW5pbWF0aW9uTG9vcFxuICB9KTtcblxuICAvLyBjYW1lcmEgcmlnICYgY29udHJvbGxlcnNcbiAgdmFyIGNhbWVyYSA9IG51bGwsXG4gICAgY2FtZXJhUmlnID0gbnVsbDtcblxuICBpZiAob3B0aW9ucy5hciB8fCBvcHRpb25zLnZyKSB7XG4gICAgY2FtZXJhUmlnID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmFSaWcpXG4gICAgICAuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogc2NlbmUgfSk7XG4gIH1cblxuICB7XG4gICAgY2FtZXJhID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmEsIHtcbiAgICAgICAgZm92OiA5MCxcbiAgICAgICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgbmVhcjogMC4xLFxuICAgICAgICBmYXI6IDEwMCxcbiAgICAgICAgbGF5ZXJzOiAxLFxuICAgICAgICBoYW5kbGVSZXNpemU6IHRydWVcbiAgICAgIH0pXG4gICAgICAuYWRkQ29tcG9uZW50KFRyYW5zZm9ybSlcbiAgICAgIC5hZGRDb21wb25lbnQoQWN0aXZlKTtcbiAgfVxuXG4gIGxldCByZW5kZXJQYXNzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlclBhc3MsIHtcbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICBjYW1lcmFSaWcsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHJlbmRlclBhc3NcbiAgICB9XG4gIH07XG59XG4iLCIvLyBjb21wb25lbnRzXG5leHBvcnQge1xuICBBY3RpdmUsXG4gIEFuaW1hdGlvbixcbiAgQ2FtZXJhLFxuICBDYW1lcmFSaWcsXG4gIENvbGxpZGluZyxcbiAgQ29sbGlzaW9uU3RhcnQsXG4gIENvbGxpc2lvblN0b3AsXG4gIERyYWdnYWJsZSxcbiAgRHJhZ2dpbmcsXG4gIEVudmlyb25tZW50LFxuICBHZW9tZXRyeSxcbiAgR0xURkxvYWRlcixcbiAgR0xURk1vZGVsLFxuICBJbnB1dFN0YXRlLFxuICBNYXRlcmlhbCxcbiAgT2JqZWN0M0QsXG4gIFBhcmVudCxcbiAgUGFyZW50T2JqZWN0M0QsXG4gIFBsYXksXG4gIFBvc2l0aW9uLFxuICBSZW5kZXJQYXNzLFxuICBSaWdpZEJvZHksXG4gIFJvdGF0aW9uLFxuICBTY2FsZSxcbiAgU2NlbmUsXG4gIFNoYXBlLFxuICBTa3ksXG4gIFNreUJveCxcbiAgU291bmQsXG4gIFN0b3AsXG4gIFRleHQsXG4gIFRleHRHZW9tZXRyeSxcbiAgQ29udHJvbGxlckNvbm5lY3RlZCxcbiAgVHJhbnNmb3JtLFxuICBWaXNpYmxlLFxuICBWUkNvbnRyb2xsZXIsXG4gIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLy8gc3lzdGVtc1xuZXhwb3J0IHsgTWF0ZXJpYWxTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL01hdGVyaWFsU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBHZW9tZXRyeVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IEdMVEZMb2FkZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFNreUJveFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzXCI7XG5leHBvcnQgeyBWaXNpYmlsaXR5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzXCI7XG5leHBvcnQgeyBTREZUZXh0U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9TREZUZXh0U3lzdGVtLmpzXCI7XG5leHBvcnQge1xuICBXZWJHTFJlbmRlcmVyU3lzdGVtLFxuICBXZWJHTFJlbmRlcmVyQ29udGV4dFxufSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFRyYW5zZm9ybVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBDYW1lcmFTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVGV4dEdlb21ldHJ5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IEVudmlyb25tZW50U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVlJDb250cm9sbGVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9WUkNvbnRyb2xsZXJTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IEFuaW1hdGlvblN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQW5pbWF0aW9uU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBJbnB1dFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvSW5wdXRTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFNvdW5kU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9Tb3VuZFN5c3RlbS5qc1wiO1xuXG4vLyBJbml0aWFsaXplXG5leHBvcnQgeyBpbml0aWFsaXplIH0gZnJvbSBcIi4vaW5pdGlhbGl6ZS5qc1wiO1xuIiwiaW1wb3J0ICogYXMgVGhyZWUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgKiBhcyBFQ1NZIGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBFQ1NZVEhSRUUgZnJvbSBcIi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBUSFJFRTogVGhyZWUsXG4gIEVDU1k6IEVDU1ksXG4gIEVDU1lUSFJFRTogRUNTWVRIUkVFXG59O1xuIl0sIm5hbWVzIjpbIlRIUkVFLlZlY3RvcjIiLCJUSFJFRS5WZWN0b3IzIiwiVGhyZWVUeXBlcy5WZWN0b3IzIiwiVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwiLCJUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5IiwiVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCIsIlRIUkVFLk1lc2giLCJHTFRGTG9hZGVyVGhyZWUiLCJUSFJFRS5Hcm91cCIsIlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIiwiVEhSRUUuVGV4dHVyZSIsIlRIUkVFLkltYWdlTG9hZGVyIiwiVEhSRUUuV2ViR0xSZW5kZXJlciIsIlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIiwiVEhSRUUuRm9udExvYWRlciIsIlRIUkVFLlRleHRHZW9tZXRyeSIsIlRIUkVFLlJlcGVhdFdyYXBwaW5nIiwiVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkZvZyIsIlRIUkVFLkNvbG9yIiwiVEhSRUUuQW5pbWF0aW9uTWl4ZXIiLCJUSFJFRS5Mb29wT25jZSIsIlRIUkVFLk9iamVjdDNEIiwiVEhSRUUuUG9zaXRpb25hbEF1ZGlvIiwiVEhSRUUuQXVkaW9MaXN0ZW5lciIsIlRIUkVFLkF1ZGlvTG9hZGVyIiwiRUNTWS5Xb3JsZCIsIlRIUkVFLkNsb2NrIiwiVEhSRUUuU2NlbmUiLCJUaHJlZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7QUFLQSxTQUFTLE9BQU8sQ0FBQyxTQUFTLEVBQUU7RUFDMUIsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDO0NBQ3ZCOzs7Ozs7O0FBT0QsU0FBUyxxQkFBcUIsQ0FBQyxTQUFTLEVBQUU7RUFDeEMsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7Q0FDM0I7Ozs7Ozs7QUFPRCxTQUFTLFFBQVEsQ0FBQyxVQUFVLEVBQUU7RUFDNUIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0VBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDMUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxFQUFFO01BQ3pCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQyxRQUFRLEtBQUssS0FBSyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsUUFBUSxDQUFDO01BQ3ZELEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUM3QyxNQUFNO01BQ0wsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN4QjtHQUNGOztFQUVELE9BQU8sS0FBSyxDQUFDLElB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QUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0tBQzFCO0dBQ0Y7O0VBRUQsT0FBTyxHQUFHOztJQUVSLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO01BQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0tBQy9DOztJQUVELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7O0lBRS9CLE9BQU8sSUFBSSxDQUFDO0dBQ2I7O0VBRUQsT0FBTyxDQUFDLElBQUksRUFBRTtJQUNaLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNiLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzFCOztFQUVELE1BQU0sQ0FBQyxLQUFLLEVBQUU7SUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO01BQzlCLElBQUksS0FBSyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO01BQ2xDLEtBQUssQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ25CLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCO0lBQ0QsSUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUM7R0FDckI7O0VBRUQsU0FBUyxHQUFHO0lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0dBQ25COztFQUVELFNBQVMsR0FBRztJQUNWLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7R0FDN0I7O0VBRUQsU0FBUyxHQUFHO0lBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO0dBQzFDO0NBQ0Y7Ozs7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

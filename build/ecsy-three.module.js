import { PropTypes as PropTypes$1, copyCopyable, cloneClonable, World, ObjectPool, Component, System, TagComponent, Not, SystemStateComponent } from 'ecsy';
import { Vector2, Vector3, Vector4, Quaternion, Color, Euler, Matrix3, Matrix4, Math, Object3D, Scene, Group, Mesh, SkinnedMesh, Bone, InstancedMesh, LOD, Line, LineLoop, LineSegments, Points, Sprite, Audio, AudioListener, PositionalAudio, Camera, PerspectiveCamera, OrthographicCamera, ArrayCamera, CubeCamera, Light, LightProbe, AmbientLight, DirectionalLight, HemisphereLight, HemisphereLightProbe, PointLight, RectAreaLight, SpotLight, ImmediateRenderObject, ArrowHelper, AxesHelper, Box3Helper, BoxHelper, CameraHelper, DirectionalLightHelper, GridHelper, HemisphereLightHelper, PlaneHelper, PointLightHelper, PolarGridHelper, SkeletonHelper, SpotLightHelper, BoxBufferGeometry, MeshBasicMaterial, Texture, ImageLoader, Clock, WebGLRenderer as WebGLRenderer$1 } from 'three';

const PropTypes = {
  ...PropTypes$1,
  Vector2: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Vector2()
  },
  Vector3: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Vector3()
  },
  Vector4: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Vector4()
  },
  Quaternion: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Quaternion()
  },
  Color: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Color()
  },
  Euler: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Euler()
  },
  Matrix3: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Matrix3()
  },
  Matrix4: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Matrix4()
  }
};

class ThreeWorld extends World {
  constructor() {
    super();

    this.entityTypes = {};
    this.entityPools = {};

    this.isThreeWorld = true;
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

class StereoPhotoSphere extends Component {}

StereoPhotoSphere.schema = {
  src: { type: PropTypes.String }
};

class WebGLRenderer extends Component {}

WebGLRenderer.schema = {
  renderer: { type: PropTypes.Object },
  scene: { type: PropTypes.Object },
  camera: { type: PropTypes.Object },
  updateCanvasStyle: { type: PropTypes.Boolean }
};

class WebGLRendererSystem extends System {
  init() {
    window.addEventListener(
      "resize",
      () => {
        this.queries.renderers.results.forEach(entity => {
          const component = entity.getMutableComponent(WebGLRenderer);
          const parent = component.renderer.domElement.parentElement;
          const width = parent.clientWidth;
          const height = parent.clientHeight;
          component.renderer.setSize(
            width,
            height,
            component.updateCanvasStyle
          );
          component.camera.aspect = width / height;
          component.camera.updateProjectionMatrix();
        });
      },
      false
    );
  }

  execute() {
    this.queries.renderers.results.forEach(entity => {
      const component = entity.getComponent(WebGLRenderer);
      component.renderer.render(component.scene, component.camera);
    });
  }
}

WebGLRendererSystem.queries = {
  renderers: {
    components: [WebGLRenderer]
  }
};

var _m1 = new Matrix4();

function EntityMixin(Object3DClass) {
  const Mixin = class extends Object3DClass {
    constructor(world, ...args) {
      super(...args);

      if (!world.isThreeWorld) {
        throw new Error(
          "The first argument to an Object3D entity must be an instance of ThreeWorld"
        );
      }

      this.world = world;

      // List of components types the entity has
      this.componentTypes = [];

      // Instance of the components
      this.components = {};

      this._componentsToRemove = {};

      // Queries where the entity is added
      this.queries = [];

      // Used for deferred removal
      this._componentTypesToRemove = [];

      this.alive = false;

      this._numSystemStateComponents = 0;

      this.isEntity = true;
      this.isECSYThreeEntity = true;
    }

    // COMPONENTS

    getComponent(Component, includeRemoved) {
      var component = this.components[Component.name];

      if (!component && includeRemoved === true) {
        component = this._componentsToRemove[Component.name];
      }

      return  component;
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

      if (this.alive) {
        this.world.onComponentChanged(this, Component, component);
      }

      return component;
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

      if (this.alive) {
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

      if (!this._componentsToRemove[componentName]) {
        delete this.components[componentName];

        const index = this.componentTypes.indexOf(Component);
        this.componentTypes.splice(index, 1);

        this.world.onRemoveComponent(this, Component);
      }

      const component = this.components[componentName];

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
      } else {
        this._componentTypesToRemove.push(Component);
        this._componentsToRemove[componentName] = component;
        this.world.queueComponentRemoval(this, Component);
      }

      if (Component.isSystemStateComponent) {
        this._numSystemStateComponents--;

        // Check if the entity was a ghost waiting for the last system state component to be removed
        if (this._numSystemStateComponents === 0 && !this.alive) {
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

          if (object.isEntity) {
            this.world.addEntity(object);
          }
        }
      }

      return this;
    }

    remove(...objects) {
      super.remove(...objects);

      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];

        if (object.isEntity) {
          object.dispose();
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
        if (child.isEntity) {
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
      this.traverseEntities(child => {
        if (child.alive) {
          child.world.onDisposeEntity(this);
        }

        if (immediately) {
          child.uuid = Math.generateUUID();
          child.alive = true;

          for (let i = 0; i < child.queries.length; i++) {
            child.queries[i].removeEntity(this);
          }

          for (const componentName in child.components) {
            child.components[componentName].dispose();
            delete child.components[componentName];
          }

          for (const componentName in child._componentsToRemove) {
            delete child._componentsToRemove[componentName];
          }

          child.queries.length = 0;
          child.componentTypes.length = 0;
          child._componentTypesToRemove.length = 0;

          if (child._pool) {
            child._pool.release(this);
          }

          child.world.onEntityDisposed(this);
        } else {
          child.alive = false;
          child.world.queueEntityDisposal(this);
        }
      });
    }
  };

  Mixin.tagComponents = [];

  return Mixin;
}

class Object3DTag extends TagComponent {}
class SceneTag extends TagComponent {}
class GroupTag extends TagComponent {}
class MeshTag extends TagComponent {}
class SkinnedMeshTag extends TagComponent {}
class BoneTag extends TagComponent {}
class InstancedMeshTag extends TagComponent {}
class LODTag extends TagComponent {}
class LineTag extends TagComponent {}
class LineLoopTag extends TagComponent {}
class LineSegmentsTag extends TagComponent {}
class PointsTag extends TagComponent {}
class SpriteTag extends TagComponent {}
class AudioTag extends TagComponent {}
class AudioListenerTag extends TagComponent {}
class PositionalAudioTag extends TagComponent {}
class CameraTag extends TagComponent {}
class PerspectiveCameraTag extends TagComponent {}
class OrthographicCameraTag extends TagComponent {}
class ArrayCameraTag extends TagComponent {}
class CubeCameraTag extends TagComponent {}
class LightTag extends TagComponent {}
class LightProbeTag extends TagComponent {}
class AmbientLightTag extends TagComponent {}
class DirectionalLightTag extends TagComponent {}
class HemisphereLightTag extends TagComponent {}
class HemisphereLightProbeTag extends TagComponent {}
class PointLightTag extends TagComponent {}
class RectAreaLightTag extends TagComponent {}
class SpotLightTag extends TagComponent {}
class ImmediateRenderObjectTag extends TagComponent {}
class HelperTag extends TagComponent {}
class ArrowHelperTag extends TagComponent {}
class AxesHelperTag extends TagComponent {}
class Box3HelperTag extends TagComponent {}
class BoxHelperTag extends TagComponent {}
class CameraHelperTag extends TagComponent {}
class DirectionalLightHelperTag extends TagComponent {}
class GridHelperTag extends TagComponent {}
class HemisphereLightHelperTag extends TagComponent {}
class PlaneHelperTag extends TagComponent {}
class PointLightHelperTag extends TagComponent {}
class PolarGridHelperTag extends TagComponent {}
class SkeletonHelperTag extends TagComponent {}
class SpotLightHelperTag extends TagComponent {}

class Object3DEntity extends EntityMixin(Object3D) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
  }
}

Object3DEntity.tagComponents = [Object3DTag];

class SceneEntity extends EntityMixin(Scene) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(SceneTag);
  }
}

SceneEntity.tagComponents = [Object3DTag, SceneTag];

class GroupEntity extends EntityMixin(Group) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(GroupTag);
  }
}

GroupEntity.tagComponents = [Object3DTag, GroupTag];

class MeshEntity extends EntityMixin(Mesh) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(MeshTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

MeshEntity.tagComponents = [Object3DTag, MeshTag];

class SkinnedMeshEntity extends EntityMixin(SkinnedMesh) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(MeshTag);
    this.addComponent(SkinnedMeshTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

SkinnedMeshEntity.tagComponents = [Object3DTag, MeshTag, SkinnedMeshTag];

class BoneEntity extends EntityMixin(Bone) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(BoneTag);
  }
}

BoneEntity.tagComponents = [Object3DTag, BoneTag];

class InstancedMeshEntity extends EntityMixin(InstancedMesh) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(MeshTag);
    this.addComponent(InstancedMeshTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

InstancedMeshEntity.tagComponents = [Object3DTag, MeshTag, InstancedMeshTag];

class LODEntity extends EntityMixin(LOD) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(LODTag);
  }
}

LODEntity.tagComponents = [Object3DTag, LODTag];

class LineEntity extends EntityMixin(Line) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(LineTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

LineEntity.tagComponents = [Object3DTag, LineTag];

class LineLoopEntity extends EntityMixin(LineLoop) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(LineTag);
    this.addComponent(LineLoopTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

LineLoopEntity.tagComponents = [Object3DTag, LineTag, LineLoopTag];

class LineSegmentsEntity extends EntityMixin(LineSegments) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

LineSegmentsEntity.tagComponents = [Object3DTag, LineTag, LineSegmentsTag];

class PointsEntity extends EntityMixin(Points) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(PointsTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

PointsEntity.tagComponents = [Object3DTag, PointsTag];

class SpriteEntity extends EntityMixin(Sprite) {
  constructor(world, material) {
    super(world, material);
    this.addComponent(Object3DTag);
    this.addComponent(SpriteTag);
  }

  clone() {
    return new this.constructor(this.world, this.material).copy(this);
  }
}

SpriteEntity.tagComponents = [Object3DTag, SpriteTag];

class AudioEntity extends EntityMixin(Audio) {
  constructor(world, listener) {
    super(world, listener);
    this.addComponent(Object3DTag);
    this.addComponent(AudioTag);
  }
}

AudioEntity.tagComponents = [Object3DTag, AudioTag];

class AudioListenerEntity extends EntityMixin(AudioListener) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(AudioListenerTag);
  }
}

AudioListenerEntity.tagComponents = [Object3DTag, AudioListenerTag];

class PositionalAudioEntity extends EntityMixin(PositionalAudio) {
  constructor(world, listener) {
    super(world, listener);
    this.addComponent(Object3DTag);
    this.addComponent(AudioTag);
    this.addComponent(PositionalAudioTag);
  }
}

PositionalAudioEntity.tagComponents = [
  Object3DTag,
  AudioTag,
  PositionalAudioTag,
];

class CameraEntity extends EntityMixin(Camera) {
  constructor(world, fov, aspect, near, far) {
    super(world, fov, aspect, near, far);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
  }
}

CameraEntity.tagComponents = [Object3DTag, CameraTag];

class PerspectiveCameraEntity extends EntityMixin(PerspectiveCamera) {
  constructor(world, fov, aspect, near, far) {
    super(world, fov, aspect, near, far);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
    this.addComponent(PerspectiveCameraTag);
  }
}

PerspectiveCameraEntity.tagComponents = [
  Object3DTag,
  CameraTag,
  PerspectiveCameraTag,
];

class OrthographicCameraEntity extends EntityMixin(OrthographicCamera) {
  constructor(world, left, right, top, bottom, near, far) {
    super(world, left, right, top, bottom, near, far);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
    this.addComponent(OrthographicCameraTag);
  }
}

OrthographicCameraEntity.tagComponents = [
  Object3DTag,
  CameraTag,
  OrthographicCameraTag,
];

class ArrayCameraEntity extends EntityMixin(ArrayCamera) {
  constructor(world, array) {
    super(world, array);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
    this.addComponent(PerspectiveCameraTag);
    this.addComponent(ArrayCameraTag);
  }
}

ArrayCameraEntity.tagComponents = [
  Object3DTag,
  CameraTag,
  PerspectiveCameraTag,
  ArrayCameraTag,
];

class CubeCameraEntity extends EntityMixin(CubeCamera) {
  constructor(world, near, far, cubeResolution, options) {
    super(world, near, far, cubeResolution, options);
    this.addComponent(Object3DTag);
    this.addComponent(CubeCameraTag);
  }
}

CubeCameraEntity.tagComponents = [Object3DTag, CubeCameraTag];

class LightEntity extends EntityMixin(Light) {
  constructor(world, color, intensity) {
    super(world, color, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
  }
}

LightEntity.tagComponents = [Object3DTag, LightTag];

class LightProbeEntity extends EntityMixin(LightProbe) {
  constructor(world, sh, intensity) {
    super(world, sh, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(LightProbeTag);
  }
}
LightProbeEntity.tagComponents = [Object3DTag, LightTag, LightProbeTag];

class AmbientLightEntity extends EntityMixin(AmbientLight) {
  constructor(world, color, intensity) {
    super(world, color, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(AmbientLightTag);
  }
}

AmbientLightEntity.tagComponents = [Object3DTag, LightTag, AmbientLightTag];

class DirectionalLightEntity extends EntityMixin(DirectionalLight) {
  constructor(world, color, intensity) {
    super(world, color, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(DirectionalLightTag);
  }
}

DirectionalLightEntity.tagComponents = [
  Object3DTag,
  LightTag,
  DirectionalLightTag,
];

class HemisphereLightEntity extends EntityMixin(HemisphereLight) {
  constructor(world, skyColor, groundColor, intensity) {
    super(world, skyColor, groundColor, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(HemisphereLightTag);
  }
}

HemisphereLightEntity.tagComponents = [
  Object3DTag,
  LightTag,
  HemisphereLightTag,
];

class HemisphereLightProbeEntity extends EntityMixin(
  HemisphereLightProbe
) {
  constructor(world, skyColor, groundColor, intensity) {
    super(world, skyColor, groundColor, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(LightProbeTag);
    this.addComponent(HemisphereLightProbeTag);
  }
}

HemisphereLightProbeEntity.tagComponents = [
  Object3DTag,
  LightTag,
  LightProbeTag,
  HemisphereLightProbeTag,
];

class PointLightEntity extends EntityMixin(PointLight) {
  constructor(world, color, intensity, distance, decay) {
    super(world, color, intensity, distance, decay);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(PointLightTag);
  }
}

PointLightEntity.tagComponents = [Object3DTag, LightTag, PointLightTag];

class RectAreaLightEntity extends EntityMixin(RectAreaLight) {
  constructor(world, color, intensity, width, height) {
    super(world, color, intensity, width, height);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(RectAreaLightTag);
  }
}

RectAreaLightEntity.tagComponents = [Object3DTag, LightTag, RectAreaLightTag];

class SpotLightEntity extends EntityMixin(SpotLight) {
  constructor(world, color, intensity, distance, angle, penumbra, decay) {
    super(world, color, intensity, distance, angle, penumbra, decay);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(SpotLightTag);
  }
}

SpotLightEntity.tagComponents = [Object3DTag, LightTag, SpotLightTag];

class ImmediateRenderObjectEntity extends EntityMixin(
  ImmediateRenderObject
) {
  constructor(world, material) {
    super(world, material);
    this.addComponent(Object3DTag);
    this.addComponent(ImmediateRenderObjectTag);
  }
}

ImmediateRenderObjectEntity.tagComponents = [
  Object3DTag,
  ImmediateRenderObjectTag,
];

class ArrowHelperEntity extends EntityMixin(ArrowHelper) {
  constructor(world, dir, origin, length, color, headLength, headWidth) {
    super(world, dir, origin, length, color, headLength, headWidth);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(ArrowHelperTag);
  }
}

ArrowHelperEntity.tagComponents = [Object3DTag, HelperTag, ArrowHelperTag];

class AxesHelperEntity extends EntityMixin(AxesHelper) {
  constructor(world, size) {
    super(world, size);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(AxesHelperTag);
  }
}

AxesHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  AxesHelperTag,
];

class Box3HelperEntity extends EntityMixin(Box3Helper) {
  constructor(world, box, color) {
    super(world, box, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(Box3HelperTag);
  }
}

Box3HelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  Box3HelperTag,
];

class BoxHelperEntity extends EntityMixin(BoxHelper) {
  constructor(world, object, color) {
    super(world, object, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(BoxHelperTag);
  }
}

BoxHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  BoxHelperTag,
];

class CameraHelperEntity extends EntityMixin(CameraHelper) {
  constructor(world, camera) {
    super(world, camera);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(CameraHelperTag);
  }
}

CameraHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  CameraHelperTag,
];

class DirectionalLightHelperEntity extends EntityMixin(
  DirectionalLightHelper
) {
  constructor(world, light, size, color) {
    super(world, light, size, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(DirectionalLightHelperTag);
  }
}

DirectionalLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  DirectionalLightHelperTag,
];

class GridHelperEntity extends EntityMixin(GridHelper) {
  constructor(world, size, divisions, color1, color2) {
    super(world, size, divisions, color1, color2);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(GridHelperTag);
  }
}

GridHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  GridHelperTag,
];

class HemisphereLightHelperEntity extends EntityMixin(
  HemisphereLightHelper
) {
  constructor(world, light, size, color) {
    super(world, light, size, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(HemisphereLightHelperTag);
  }
}

HemisphereLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  HemisphereLightHelperTag,
];

class PlaneHelperEntity extends EntityMixin(PlaneHelper) {
  constructor(world, plane, size, hex) {
    super(world, plane, size, hex);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(PlaneHelperTag);
  }
}

PlaneHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  PlaneHelperTag,
];

class PointLightHelperEntity extends EntityMixin(PointLightHelper) {
  constructor(world, light, sphereSize, color) {
    super(world, light, sphereSize, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(PointLightHelperTag);
    this.addComponent(MeshTag);
  }
}

PointLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  PointLightHelperTag,
  MeshTag,
];

class PolarGridHelperEntity extends EntityMixin(PolarGridHelper) {
  constructor(world, radius, radials, circles, divisions, color1, color2) {
    super(world, radius, radials, circles, divisions, color1, color2);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(PolarGridHelperTag);
  }
}

PolarGridHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  PolarGridHelperTag,
];

class SkeletonHelperEntity extends EntityMixin(SkeletonHelper) {
  constructor(world, object) {
    super(world, object);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(SkeletonHelperTag);
  }
}

SkeletonHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  SkeletonHelperTag,
];

class SpotLightHelperEntity extends EntityMixin(SpotLightHelper) {
  constructor(world, light, color) {
    super(world, light, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(SpotLightHelperTag);
  }
}

SpotLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  SpotLightHelperTag,
];

class StereoPhotoSphereState extends SystemStateComponent {}

StereoPhotoSphereState.schema = {
  photoSphereL: { type: Object },
  photoSphereR: { type: Object }
};

class StereoPhotoSphereSystem extends System {
  init() {
    this.world.registerComponent(StereoPhotoSphereState, false);
  }

  execute() {
    let entities = this.queries.entities.results;
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];

      let photoSphere = entity.getComponent(StereoPhotoSphere);

      let geometry = new BoxBufferGeometry(100, 100, 100);
      geometry.scale(1, 1, -1);

      let textures = getTexturesFromAtlasFile(photoSphere.src, 12);

      let materials = [];

      for (let j = 0; j < 6; j++) {
        materials.push(new MeshBasicMaterial({ map: textures[j] }));
      }

      let photoSphereL = new Mesh(geometry, materials);
      photoSphereL.layers.set(1);
      entity.add(photoSphereL);

      let materialsR = [];

      for (let j = 6; j < 12; j++) {
        materialsR.push(new MeshBasicMaterial({ map: textures[j] }));
      }

      let photoSphereR = new Mesh(geometry, materialsR);
      photoSphereR.layers.set(2);
      entity.add(photoSphereR);

      entity.addComponent(StereoPhotoSphereState, {
        photoSphereL,
        photoSphereR
      });
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

StereoPhotoSphereSystem.queries = {
  entities: {
    components: [StereoPhotoSphere, Object3DTag, Not(StereoPhotoSphereState)]
  }
};

function initialize(world = new ThreeWorld(), options) {
  options = Object.assign({}, options);

  world
    .registerComponent(WebGLRenderer, false)
    .registerEntityType(SceneEntity)
    .registerEntityType(PerspectiveCameraEntity, false)
    .registerSystem(WebGLRendererSystem, { priority: 1 });

  let animationLoop = options.animationLoop;

  if (!animationLoop) {
    const clock = new Clock();

    animationLoop = () => {
      world.execute(clock.getDelta(), clock.elapsedTime);
    };
  }

  const rendererOptions = Object.assign(
    {
      antialias: true
    },
    options.renderer
  );

  const renderer = new WebGLRenderer$1(rendererOptions);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setAnimationLoop(animationLoop);

  const canvas = options.renderer && options.renderer.canvas;
  const width = canvas ? canvas.parentElement.offsetWidth : window.innerWidth;
  const height = canvas
    ? canvas.parentElement.offsetHeight
    : window.innerHeight;

  renderer.setSize(width, height, !!canvas);

  if (!canvas) {
    document.body.appendChild(renderer.domElement);
  }

  let scene = world.addEntity(new SceneEntity(world));

  const camera = new PerspectiveCameraEntity(
    world,
    90,
    width / height,
    0.1,
    100
  );

  scene.add(camera);

  let rendererEntity = world.createEntity().addComponent(WebGLRenderer, {
    renderer,
    scene,
    camera,
    updateCanvasStyle: !!canvas
  });

  return {
    world,
    entities: {
      scene,
      camera,
      renderer: rendererEntity
    }
  };
}

export { AmbientLightEntity, AmbientLightTag, ArrayCameraEntity, ArrayCameraTag, ArrowHelperEntity, ArrowHelperTag, AudioEntity, AudioListenerEntity, AudioListenerTag, AudioTag, AxesHelperEntity, AxesHelperTag, BoneEntity, BoneTag, Box3HelperEntity, Box3HelperTag, BoxHelperEntity, BoxHelperTag, CameraEntity, CameraHelperEntity, CameraHelperTag, CameraTag, CubeCameraEntity, CubeCameraTag, DirectionalLightEntity, DirectionalLightHelperEntity, DirectionalLightHelperTag, DirectionalLightTag, GridHelperEntity, GridHelperTag, GroupEntity, GroupTag, HelperTag, HemisphereLightEntity, HemisphereLightHelperEntity, HemisphereLightHelperTag, HemisphereLightProbeEntity, HemisphereLightProbeTag, HemisphereLightTag, ImmediateRenderObjectEntity, ImmediateRenderObjectTag, InstancedMeshEntity, InstancedMeshTag, LODEntity, LODTag, LightEntity, LightProbeEntity, LightProbeTag, LightTag, LineEntity, LineLoopEntity, LineLoopTag, LineSegmentsEntity, LineSegmentsTag, LineTag, MeshEntity, MeshTag, Object3DEntity, Object3DTag, OrthographicCameraEntity, OrthographicCameraTag, PerspectiveCameraEntity, PerspectiveCameraTag, PlaneHelperEntity, PlaneHelperTag, PointLightEntity, PointLightHelperEntity, PointLightHelperTag, PointLightTag, PointsEntity, PointsTag, PolarGridHelperEntity, PolarGridHelperTag, PositionalAudioEntity, PositionalAudioTag, PropTypes, RectAreaLightEntity, RectAreaLightTag, SceneEntity, SceneTag, SkeletonHelperEntity, SkeletonHelperTag, SkinnedMeshEntity, SkinnedMeshTag, SpotLightEntity, SpotLightHelperEntity, SpotLightHelperTag, SpotLightTag, SpriteEntity, SpriteTag, StereoPhotoSphere, StereoPhotoSphereSystem, ThreeWorld, WebGLRenderer, WebGLRendererSystem, initialize };

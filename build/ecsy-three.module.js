import { PropTypes as PropTypes$1, copyCopyable, cloneClonable, World, ObjectPool, Component, System, TagComponent, Not, SystemStateComponent } from 'ecsy';
import { Vector2, Vector3, Vector4, Quaternion, Color, Euler, Matrix3, Matrix4, MathUtils, Object3D, Scene, Group, Mesh, SkinnedMesh, Bone, InstancedMesh, LOD, Line, LineLoop, LineSegments, Points, Sprite, Audio, AudioListener, PositionalAudio, Camera, PerspectiveCamera, OrthographicCamera, ArrayCamera, CubeCamera, Light, LightProbe, AmbientLight, DirectionalLight, HemisphereLight, HemisphereLightProbe, PointLight, RectAreaLight, SpotLight, ImmediateRenderObject, ArrowHelper, AxesHelper, Box3Helper, BoxHelper, CameraHelper, DirectionalLightHelper, GridHelper, HemisphereLightHelper, PlaneHelper, PointLightHelper, PolarGridHelper, SkeletonHelper, SpotLightHelper, BoxBufferGeometry, MeshBasicMaterial, Texture, ImageLoader, Clock, WebGLRenderer as WebGLRenderer$1 } from 'three';

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
          child.uuid = MathUtils.generateUUID();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9wVHlwZXMuanMiLCIuLi9zcmMvVGhyZWVXb3JsZC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1N0ZXJlb1Bob3RvU3BoZXJlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvV2ViR0xSZW5kZXJlci5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvRW50aXR5TWl4aW4uanMiLCIuLi9zcmMvZW50aXRpZXMvaW5kZXguanMiLCIuLi9zcmMvc3lzdGVtcy9TdGVyZW9QaG90b1NwaGVyZVN5c3RlbS5qcyIsIi4uL3NyYy9pbml0aWFsaXplLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFByb3BUeXBlcyBhcyBFQ1NZUHJvcFR5cGVzLCBjb3B5Q29weWFibGUsIGNsb25lQ2xvbmFibGUgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgVmVjdG9yMixcbiAgVmVjdG9yMyxcbiAgVmVjdG9yNCxcbiAgUXVhdGVybmlvbixcbiAgQ29sb3IsXG4gIEV1bGVyLFxuICBNYXRyaXgzLFxuICBNYXRyaXg0XG59IGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY29uc3QgUHJvcFR5cGVzID0ge1xuICAuLi5FQ1NZUHJvcFR5cGVzLFxuICBWZWN0b3IyOiB7XG4gICAgY29weTogY29weUNvcHlhYmxlLFxuICAgIGNsb25lOiBjbG9uZUNsb25hYmxlLFxuICAgIGRlZmF1bHQ6IG5ldyBWZWN0b3IyKClcbiAgfSxcbiAgVmVjdG9yMzoge1xuICAgIGNvcHk6IGNvcHlDb3B5YWJsZSxcbiAgICBjbG9uZTogY2xvbmVDbG9uYWJsZSxcbiAgICBkZWZhdWx0OiBuZXcgVmVjdG9yMygpXG4gIH0sXG4gIFZlY3RvcjQ6IHtcbiAgICBjb3B5OiBjb3B5Q29weWFibGUsXG4gICAgY2xvbmU6IGNsb25lQ2xvbmFibGUsXG4gICAgZGVmYXVsdDogbmV3IFZlY3RvcjQoKVxuICB9LFxuICBRdWF0ZXJuaW9uOiB7XG4gICAgY29weTogY29weUNvcHlhYmxlLFxuICAgIGNsb25lOiBjbG9uZUNsb25hYmxlLFxuICAgIGRlZmF1bHQ6IG5ldyBRdWF0ZXJuaW9uKClcbiAgfSxcbiAgQ29sb3I6IHtcbiAgICBjb3B5OiBjb3B5Q29weWFibGUsXG4gICAgY2xvbmU6IGNsb25lQ2xvbmFibGUsXG4gICAgZGVmYXVsdDogbmV3IENvbG9yKClcbiAgfSxcbiAgRXVsZXI6IHtcbiAgICBjb3B5OiBjb3B5Q29weWFibGUsXG4gICAgY2xvbmU6IGNsb25lQ2xvbmFibGUsXG4gICAgZGVmYXVsdDogbmV3IEV1bGVyKClcbiAgfSxcbiAgTWF0cml4Mzoge1xuICAgIGNvcHk6IGNvcHlDb3B5YWJsZSxcbiAgICBjbG9uZTogY2xvbmVDbG9uYWJsZSxcbiAgICBkZWZhdWx0OiBuZXcgTWF0cml4MygpXG4gIH0sXG4gIE1hdHJpeDQ6IHtcbiAgICBjb3B5OiBjb3B5Q29weWFibGUsXG4gICAgY2xvbmU6IGNsb25lQ2xvbmFibGUsXG4gICAgZGVmYXVsdDogbmV3IE1hdHJpeDQoKVxuICB9XG59O1xuIiwiaW1wb3J0IHsgV29ybGQsIE9iamVjdFBvb2wgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVGhyZWVXb3JsZCBleHRlbmRzIFdvcmxkIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuZW50aXR5VHlwZXMgPSB7fTtcbiAgICB0aGlzLmVudGl0eVBvb2xzID0ge307XG5cbiAgICB0aGlzLmlzVGhyZWVXb3JsZCA9IHRydWU7XG4gIH1cblxuICByZWdpc3RlckVudGl0eVR5cGUoRW50aXR5VHlwZSwgZW50aXR5UG9vbCkge1xuICAgIGlmICh0aGlzLmVudGl0eVR5cGVzW0VudGl0eVR5cGUubmFtZV0pIHtcbiAgICAgIGNvbnNvbGUud2FybihgRW50aXR5IHR5cGU6ICcke0VudGl0eVR5cGUubmFtZX0nIGFscmVhZHkgcmVnaXN0ZXJlZC5gKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRoaXMuZW50aXR5VHlwZXNbRW50aXR5VHlwZS5uYW1lXSA9IEVudGl0eVR5cGU7XG5cbiAgICBpZiAoZW50aXR5UG9vbCA9PT0gZmFsc2UpIHtcbiAgICAgIGVudGl0eVBvb2wgPSBudWxsO1xuICAgIH0gZWxzZSBpZiAoZW50aXR5UG9vbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbnRpdHlQb29sID0gbmV3IE9iamVjdFBvb2wobmV3IEVudGl0eVR5cGUodGhpcykpO1xuICAgIH1cblxuICAgIHRoaXMuZW50aXR5UG9vbHNbRW50aXR5VHlwZS5uYW1lXSA9IGVudGl0eVBvb2w7XG5cbiAgICBjb25zdCB0YWdDb21wb25lbnRzID0gRW50aXR5VHlwZS50YWdDb21wb25lbnRzO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YWdDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCB0YWdDb21wb25lbnQgPSB0YWdDb21wb25lbnRzW2ldO1xuICAgICAgaWYgKCF0aGlzLmNvbXBvbmVudFR5cGVzW3RhZ0NvbXBvbmVudC5uYW1lXSkge1xuICAgICAgICB0aGlzLnJlZ2lzdGVyQ29tcG9uZW50KHRhZ0NvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBjcmVhdGVFbnRpdHkoRW50aXR5VHlwZSkge1xuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuY3JlYXRlRGV0YWNoZWRFbnRpdHkoRW50aXR5VHlwZSk7XG4gICAgcmV0dXJuIHRoaXMuYWRkRW50aXR5KGVudGl0eSk7XG4gIH1cblxuICBjcmVhdGVEZXRhY2hlZEVudGl0eShFbnRpdHlUeXBlKSB7XG4gICAgY29uc3QgZW50aXR5UG9vbCA9XG4gICAgICBFbnRpdHlUeXBlID09PSB1bmRlZmluZWRcbiAgICAgICAgPyB0aGlzLmVudGl0eVBvb2xcbiAgICAgICAgOiB0aGlzLmVudGl0eVBvb2xzW0VudGl0eVR5cGUubmFtZV07XG5cbiAgICBjb25zdCBlbnRpdHkgPSBlbnRpdHlQb29sID8gZW50aXR5UG9vbC5hY3F1aXJlKCkgOiBuZXcgRW50aXR5VHlwZSh0aGlzKTtcblxuICAgIHJldHVybiBlbnRpdHk7XG4gIH1cblxuICBhZGRFbnRpdHkoZW50aXR5KSB7XG4gICAgaWYgKGVudGl0eS5pc09iamVjdDNEKSB7XG4gICAgICBlbnRpdHkudHJhdmVyc2VFbnRpdGllcyhjaGlsZCA9PiB7XG4gICAgICAgIGlmICh0aGlzLmVudGl0aWVzQnlVVUlEW2VudGl0eS51dWlkXSkge1xuICAgICAgICAgIGNvbnNvbGUud2FybihgRW50aXR5ICR7ZW50aXR5LnV1aWR9IGFscmVhZHkgYWRkZWQuYCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmVudGl0aWVzQnlVVUlEW2VudGl0eS51dWlkXSA9IGNoaWxkO1xuICAgICAgICB0aGlzLmVudGl0aWVzLnB1c2goY2hpbGQpO1xuICAgICAgICBjaGlsZC5hbGl2ZSA9IHRydWU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZC5jb21wb25lbnRUeXBlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IENvbXBvbmVudCA9IGNoaWxkLmNvbXBvbmVudFR5cGVzW2ldO1xuICAgICAgICAgIHRoaXMub25Db21wb25lbnRBZGRlZChjaGlsZCwgQ29tcG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmVudGl0aWVzQnlVVUlEW2VudGl0eS51dWlkXSkge1xuICAgICAgICBjb25zb2xlLndhcm4oYEVudGl0eSAke2VudGl0eS51dWlkfSBhbHJlYWR5IGFkZGVkLmApO1xuICAgICAgICByZXR1cm4gZW50aXR5O1xuICAgICAgfVxuXG4gICAgICB0aGlzLmVudGl0aWVzQnlVVUlEW2VudGl0eS51dWlkXSA9IGVudGl0eTtcbiAgICAgIHRoaXMuZW50aXRpZXMucHVzaChlbnRpdHkpO1xuICAgICAgZW50aXR5LmFsaXZlID0gdHJ1ZTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdHkuY29tcG9uZW50VHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgQ29tcG9uZW50ID0gZW50aXR5LmNvbXBvbmVudFR5cGVzW2ldO1xuICAgICAgICB0aGlzLm9uQ29tcG9uZW50QWRkZWQoZW50aXR5LCBDb21wb25lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBlbnRpdHk7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQcm9wVHlwZXMgfSBmcm9tIFwiLi4vUHJvcFR5cGVzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGVyZW9QaG90b1NwaGVyZSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5TdGVyZW9QaG90b1NwaGVyZS5zY2hlbWEgPSB7XG4gIHNyYzogeyB0eXBlOiBQcm9wVHlwZXMuU3RyaW5nIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUHJvcFR5cGVzIH0gZnJvbSBcIi4uL1Byb3BUeXBlcy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5XZWJHTFJlbmRlcmVyLnNjaGVtYSA9IHtcbiAgcmVuZGVyZXI6IHsgdHlwZTogUHJvcFR5cGVzLk9iamVjdCB9LFxuICBzY2VuZTogeyB0eXBlOiBQcm9wVHlwZXMuT2JqZWN0IH0sXG4gIGNhbWVyYTogeyB0eXBlOiBQcm9wVHlwZXMuT2JqZWN0IH0sXG4gIHVwZGF0ZUNhbnZhc1N0eWxlOiB7IHR5cGU6IFByb3BUeXBlcy5Cb29sZWFuIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gY29tcG9uZW50LnJlbmRlcmVyLmRvbUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICBjb25zdCB3aWR0aCA9IHBhcmVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICBjb25zdCBoZWlnaHQgPSBwYXJlbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgIGNvbXBvbmVudC5yZW5kZXJlci5zZXRTaXplKFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgICBjb21wb25lbnQudXBkYXRlQ2FudmFzU3R5bGVcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbXBvbmVudC5jYW1lcmEuYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XG4gICAgICAgICAgY29tcG9uZW50LmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICBjb21wb25lbnQucmVuZGVyZXIucmVuZGVyKGNvbXBvbmVudC5zY2VuZSwgY29tcG9uZW50LmNhbWVyYSk7XG4gICAgfSk7XG4gIH1cbn1cblxuV2ViR0xSZW5kZXJlclN5c3RlbS5xdWVyaWVzID0ge1xuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlcl1cbiAgfVxufTtcbiIsImltcG9ydCB7IE1hdHJpeDQsIE1hdGhVdGlscyB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgX3dyYXBJbW11dGFibGVDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuXG5jb25zdCBERUJVRyA9IGZhbHNlO1xuXG52YXIgX20xID0gbmV3IE1hdHJpeDQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEVudGl0eU1peGluKE9iamVjdDNEQ2xhc3MpIHtcbiAgY29uc3QgTWl4aW4gPSBjbGFzcyBleHRlbmRzIE9iamVjdDNEQ2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHdvcmxkLCAuLi5hcmdzKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcblxuICAgICAgaWYgKCF3b3JsZC5pc1RocmVlV29ybGQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIFwiVGhlIGZpcnN0IGFyZ3VtZW50IHRvIGFuIE9iamVjdDNEIGVudGl0eSBtdXN0IGJlIGFuIGluc3RhbmNlIG9mIFRocmVlV29ybGRcIlxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICB0aGlzLndvcmxkID0gd29ybGQ7XG5cbiAgICAgIC8vIExpc3Qgb2YgY29tcG9uZW50cyB0eXBlcyB0aGUgZW50aXR5IGhhc1xuICAgICAgdGhpcy5jb21wb25lbnRUeXBlcyA9IFtdO1xuXG4gICAgICAvLyBJbnN0YW5jZSBvZiB0aGUgY29tcG9uZW50c1xuICAgICAgdGhpcy5jb21wb25lbnRzID0ge307XG5cbiAgICAgIHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZSA9IHt9O1xuXG4gICAgICAvLyBRdWVyaWVzIHdoZXJlIHRoZSBlbnRpdHkgaXMgYWRkZWRcbiAgICAgIHRoaXMucXVlcmllcyA9IFtdO1xuXG4gICAgICAvLyBVc2VkIGZvciBkZWZlcnJlZCByZW1vdmFsXG4gICAgICB0aGlzLl9jb21wb25lbnRUeXBlc1RvUmVtb3ZlID0gW107XG5cbiAgICAgIHRoaXMuYWxpdmUgPSBmYWxzZTtcblxuICAgICAgdGhpcy5fbnVtU3lzdGVtU3RhdGVDb21wb25lbnRzID0gMDtcblxuICAgICAgdGhpcy5pc0VudGl0eSA9IHRydWU7XG4gICAgfVxuXG4gICAgLy8gQ09NUE9ORU5UU1xuXG4gICAgZ2V0Q29tcG9uZW50KENvbXBvbmVudCwgaW5jbHVkZVJlbW92ZWQpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdO1xuXG4gICAgICBpZiAoIWNvbXBvbmVudCAmJiBpbmNsdWRlUmVtb3ZlZCA9PT0gdHJ1ZSkge1xuICAgICAgICBjb21wb25lbnQgPSB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmVbQ29tcG9uZW50Lm5hbWVdO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gREVCVUcgPyBfd3JhcEltbXV0YWJsZUNvbXBvbmVudChDb21wb25lbnQsIGNvbXBvbmVudCkgOiBjb21wb25lbnQ7XG4gICAgfVxuXG4gICAgZ2V0UmVtb3ZlZENvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmVbQ29tcG9uZW50Lm5hbWVdO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudHMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRzO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudHNUb1JlbW92ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmU7XG4gICAgfVxuXG4gICAgZ2V0Q29tcG9uZW50VHlwZXMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb21wb25lbnRUeXBlcztcbiAgICB9XG5cbiAgICBnZXRNdXRhYmxlQ29tcG9uZW50KENvbXBvbmVudCkge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tDb21wb25lbnQubmFtZV07XG5cbiAgICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICAgIHRoaXMud29ybGQub25Db21wb25lbnRDaGFuZ2VkKHRoaXMsIENvbXBvbmVudCwgY29tcG9uZW50KTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGNvbXBvbmVudDtcbiAgICB9XG5cbiAgICBhZGRDb21wb25lbnQoQ29tcG9uZW50LCBwcm9wcykge1xuICAgICAgaWYgKH50aGlzLmNvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KSkgcmV0dXJuO1xuXG4gICAgICB0aGlzLmNvbXBvbmVudFR5cGVzLnB1c2goQ29tcG9uZW50KTtcblxuICAgICAgaWYgKENvbXBvbmVudC5pc1N5c3RlbVN0YXRlQ29tcG9uZW50KSB7XG4gICAgICAgIHRoaXMuX251bVN5c3RlbVN0YXRlQ29tcG9uZW50cysrO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29tcG9uZW50UG9vbCA9IHRoaXMud29ybGQuZ2V0Q29tcG9uZW50UG9vbChDb21wb25lbnQpO1xuXG4gICAgICB2YXIgY29tcG9uZW50ID1cbiAgICAgICAgY29tcG9uZW50UG9vbCA9PT0gdW5kZWZpbmVkXG4gICAgICAgICAgPyBuZXcgQ29tcG9uZW50KHByb3BzKVxuICAgICAgICAgIDogY29tcG9uZW50UG9vbC5hY3F1aXJlKCk7XG5cbiAgICAgIGlmIChjb21wb25lbnRQb29sICYmIHByb3BzKSB7XG4gICAgICAgIGNvbXBvbmVudC5jb3B5KHByb3BzKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb21wb25lbnRzW0NvbXBvbmVudC5uYW1lXSA9IGNvbXBvbmVudDtcblxuICAgICAgaWYgKHRoaXMuYWxpdmUpIHtcbiAgICAgICAgdGhpcy53b3JsZC5vbkNvbXBvbmVudEFkZGVkKHRoaXMsIENvbXBvbmVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGhhc0NvbXBvbmVudChDb21wb25lbnQsIGluY2x1ZGVSZW1vdmVkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAhIX50aGlzLmNvbXBvbmVudFR5cGVzLmluZGV4T2YoQ29tcG9uZW50KSB8fFxuICAgICAgICAoaW5jbHVkZVJlbW92ZWQgPT09IHRydWUgJiYgdGhpcy5oYXNSZW1vdmVkQ29tcG9uZW50KENvbXBvbmVudCkpXG4gICAgICApO1xuICAgIH1cblxuICAgIGhhc1JlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgICByZXR1cm4gISF+dGhpcy5fY29tcG9uZW50VHlwZXNUb1JlbW92ZS5pbmRleE9mKENvbXBvbmVudCk7XG4gICAgfVxuXG4gICAgaGFzQWxsQ29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKCF0aGlzLmhhc0NvbXBvbmVudChDb21wb25lbnRzW2ldKSkgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaGFzQW55Q29tcG9uZW50cyhDb21wb25lbnRzKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IENvbXBvbmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHRoaXMuaGFzQ29tcG9uZW50KENvbXBvbmVudHNbaV0pKSByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZW1vdmVDb21wb25lbnQoQ29tcG9uZW50LCBpbW1lZGlhdGVseSkge1xuICAgICAgY29uc3QgY29tcG9uZW50TmFtZSA9IENvbXBvbmVudC5uYW1lO1xuXG4gICAgICBpZiAoIXRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZVtjb21wb25lbnROYW1lXSkge1xuICAgICAgICBkZWxldGUgdGhpcy5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuXG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jb21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCk7XG4gICAgICAgIHRoaXMuY29tcG9uZW50VHlwZXMuc3BsaWNlKGluZGV4LCAxKTtcblxuICAgICAgICB0aGlzLndvcmxkLm9uUmVtb3ZlQ29tcG9uZW50KHRoaXMsIENvbXBvbmVudCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcblxuICAgICAgaWYgKGltbWVkaWF0ZWx5KSB7XG4gICAgICAgIGlmIChjb21wb25lbnQpIHtcbiAgICAgICAgICBjb21wb25lbnQuZGlzcG9zZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX2NvbXBvbmVudHNUb1JlbW92ZVtjb21wb25lbnROYW1lXSkge1xuICAgICAgICAgIGRlbGV0ZSB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV07XG4gICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLl9jb21wb25lbnRUeXBlc1RvUmVtb3ZlLmluZGV4T2YoQ29tcG9uZW50KTtcblxuICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXBvbmVudFR5cGVzVG9SZW1vdmUuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2NvbXBvbmVudFR5cGVzVG9SZW1vdmUucHVzaChDb21wb25lbnQpO1xuICAgICAgICB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV0gPSBjb21wb25lbnQ7XG4gICAgICAgIHRoaXMud29ybGQucXVldWVDb21wb25lbnRSZW1vdmFsKHRoaXMsIENvbXBvbmVudCk7XG4gICAgICB9XG5cbiAgICAgIGlmIChDb21wb25lbnQuaXNTeXN0ZW1TdGF0ZUNvbXBvbmVudCkge1xuICAgICAgICB0aGlzLl9udW1TeXN0ZW1TdGF0ZUNvbXBvbmVudHMtLTtcblxuICAgICAgICAvLyBDaGVjayBpZiB0aGUgZW50aXR5IHdhcyBhIGdob3N0IHdhaXRpbmcgZm9yIHRoZSBsYXN0IHN5c3RlbSBzdGF0ZSBjb21wb25lbnQgdG8gYmUgcmVtb3ZlZFxuICAgICAgICBpZiAodGhpcy5fbnVtU3lzdGVtU3RhdGVDb21wb25lbnRzID09PSAwICYmICF0aGlzLmFsaXZlKSB7XG4gICAgICAgICAgdGhpcy5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJvY2Vzc1JlbW92ZWRDb21wb25lbnRzKCkge1xuICAgICAgd2hpbGUgKHRoaXMuX2NvbXBvbmVudFR5cGVzVG9SZW1vdmUubGVuZ3RoID4gMCkge1xuICAgICAgICBsZXQgQ29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50VHlwZXNUb1JlbW92ZS5wb3AoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnQoQ29tcG9uZW50LCB0cnVlKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVBbGxDb21wb25lbnRzKGltbWVkaWF0ZWx5KSB7XG4gICAgICBsZXQgQ29tcG9uZW50cyA9IHRoaXMuY29tcG9uZW50VHlwZXM7XG5cbiAgICAgIGZvciAobGV0IGogPSBDb21wb25lbnRzLmxlbmd0aCAtIDE7IGogPj0gMDsgai0tKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KENvbXBvbmVudHNbal0sIGltbWVkaWF0ZWx5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhZGQoLi4ub2JqZWN0cykge1xuICAgICAgc3VwZXIuYWRkKC4uLm9iamVjdHMpO1xuXG4gICAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBvYmplY3QgPSBvYmplY3RzW2ldO1xuXG4gICAgICAgICAgaWYgKG9iamVjdC5pc0VudGl0eSkge1xuICAgICAgICAgICAgdGhpcy53b3JsZC5hZGRFbnRpdHkob2JqZWN0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlKC4uLm9iamVjdHMpIHtcbiAgICAgIHN1cGVyLnJlbW92ZSguLi5vYmplY3RzKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IG9iamVjdCA9IG9iamVjdHNbaV07XG5cbiAgICAgICAgaWYgKG9iamVjdC5pc0VudGl0eSkge1xuICAgICAgICAgIG9iamVjdC5kaXNwb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmVtb3ZlSW1tZWRpYXRlbHkoLi4ub2JqZWN0cykge1xuICAgICAgc3VwZXIucmVtb3ZlKC4uLm9iamVjdHMpO1xuXG4gICAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBvYmplY3RzW2ldLmRpc3Bvc2UodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgYXR0YWNoKG9iamVjdCkge1xuICAgICAgLy8gYWRkcyBvYmplY3QgYXMgYSBjaGlsZCBvZiB0aGlzLCB3aGlsZSBtYWludGFpbmluZyB0aGUgb2JqZWN0J3Mgd29ybGQgdHJhbnNmb3JtXG4gICAgICAvLyBBdm9pZHMgZW50aXR5IGJlaW5nIHJlbW92ZWQvYWRkZWQgdG8gd29ybGQuXG5cbiAgICAgIHRoaXMudXBkYXRlV29ybGRNYXRyaXgodHJ1ZSwgZmFsc2UpO1xuXG4gICAgICBfbTEuZ2V0SW52ZXJzZSh0aGlzLm1hdHJpeFdvcmxkKTtcblxuICAgICAgaWYgKG9iamVjdC5wYXJlbnQgIT09IG51bGwpIHtcbiAgICAgICAgb2JqZWN0LnBhcmVudC51cGRhdGVXb3JsZE1hdHJpeCh0cnVlLCBmYWxzZSk7XG5cbiAgICAgICAgX20xLm11bHRpcGx5KG9iamVjdC5wYXJlbnQubWF0cml4V29ybGQpO1xuICAgICAgfVxuXG4gICAgICBvYmplY3QuYXBwbHlNYXRyaXg0KF9tMSk7XG5cbiAgICAgIG9iamVjdC51cGRhdGVXb3JsZE1hdHJpeChmYWxzZSwgZmFsc2UpO1xuXG4gICAgICBzdXBlci5hZGQob2JqZWN0KTtcblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgdHJhdmVyc2VFbnRpdGllcyhjYWxsYmFjaykge1xuICAgICAgdGhpcy50cmF2ZXJzZShjaGlsZCA9PiB7XG4gICAgICAgIGlmIChjaGlsZC5pc0VudGl0eSkge1xuICAgICAgICAgIGNhbGxiYWNrKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29weShzb3VyY2UsIHJlY3Vyc2l2ZSkge1xuICAgICAgc3VwZXIuY29weShzb3VyY2UsIHJlY3Vyc2l2ZSk7XG5cbiAgICAgIC8vIERJU0NVU1M6IFNob3VsZCB3ZSByZXNldCBDb21wb25lbnRUeXBlcyBhbmQgY29tcG9uZW50cyBoZXJlIG9yIGluIGRpc3Bvc2U/XG4gICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudE5hbWUgaW4gc291cmNlLmNvbXBvbmVudHMpIHtcbiAgICAgICAgY29uc3Qgc291cmNlQ29tcG9uZW50ID0gc291cmNlLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgICAgIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXSA9IHNvdXJjZUNvbXBvbmVudC5jbG9uZSgpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudFR5cGVzLnB1c2goc291cmNlQ29tcG9uZW50LmNvbnN0cnVjdG9yKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY2xvbmUocmVjdXJzaXZlKSB7XG4gICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy53b3JsZCkuY29weSh0aGlzLCByZWN1cnNpdmUpO1xuICAgIH1cblxuICAgIGRpc3Bvc2UoaW1tZWRpYXRlbHkpIHtcbiAgICAgIHRoaXMudHJhdmVyc2VFbnRpdGllcyhjaGlsZCA9PiB7XG4gICAgICAgIGlmIChjaGlsZC5hbGl2ZSkge1xuICAgICAgICAgIGNoaWxkLndvcmxkLm9uRGlzcG9zZUVudGl0eSh0aGlzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpbW1lZGlhdGVseSkge1xuICAgICAgICAgIGNoaWxkLnV1aWQgPSBNYXRoVXRpbHMuZ2VuZXJhdGVVVUlEKCk7XG4gICAgICAgICAgY2hpbGQuYWxpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGlsZC5xdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjaGlsZC5xdWVyaWVzW2ldLnJlbW92ZUVudGl0eSh0aGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudE5hbWUgaW4gY2hpbGQuY29tcG9uZW50cykge1xuICAgICAgICAgICAgY2hpbGQuY29tcG9uZW50c1tjb21wb25lbnROYW1lXS5kaXNwb3NlKCk7XG4gICAgICAgICAgICBkZWxldGUgY2hpbGQuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBmb3IgKGNvbnN0IGNvbXBvbmVudE5hbWUgaW4gY2hpbGQuX2NvbXBvbmVudHNUb1JlbW92ZSkge1xuICAgICAgICAgICAgZGVsZXRlIGNoaWxkLl9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2hpbGQucXVlcmllcy5sZW5ndGggPSAwO1xuICAgICAgICAgIGNoaWxkLmNvbXBvbmVudFR5cGVzLmxlbmd0aCA9IDA7XG4gICAgICAgICAgY2hpbGQuX2NvbXBvbmVudFR5cGVzVG9SZW1vdmUubGVuZ3RoID0gMDtcblxuICAgICAgICAgIGlmIChjaGlsZC5fcG9vbCkge1xuICAgICAgICAgICAgY2hpbGQuX3Bvb2wucmVsZWFzZSh0aGlzKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjaGlsZC53b3JsZC5vbkVudGl0eURpc3Bvc2VkKHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNoaWxkLmFsaXZlID0gZmFsc2U7XG4gICAgICAgICAgY2hpbGQud29ybGQucXVldWVFbnRpdHlEaXNwb3NhbCh0aGlzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xuXG4gIE1peGluLnRhZ0NvbXBvbmVudHMgPSBbXTtcblxuICByZXR1cm4gTWl4aW47XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgRW50aXR5TWl4aW4gfSBmcm9tIFwiLi4vRW50aXR5TWl4aW4uanNcIjtcbmltcG9ydCB7XG4gIE9iamVjdDNELFxuICBTY2VuZSxcbiAgR3JvdXAsXG4gIE1lc2gsXG4gIFNraW5uZWRNZXNoLFxuICBCb25lLFxuICBJbnN0YW5jZWRNZXNoLFxuICBMT0QsXG4gIExpbmUsXG4gIExpbmVTZWdtZW50cyxcbiAgTGluZUxvb3AsXG4gIFNwcml0ZSxcbiAgUG9pbnRzLFxuICBBdWRpbyxcbiAgQXVkaW9MaXN0ZW5lcixcbiAgUG9zaXRpb25hbEF1ZGlvLFxuICBBcnJheUNhbWVyYSxcbiAgQ2FtZXJhLFxuICBDdWJlQ2FtZXJhLFxuICBPcnRob2dyYXBoaWNDYW1lcmEsXG4gIFBlcnNwZWN0aXZlQ2FtZXJhLFxuICBBbWJpZW50TGlnaHQsXG4gIExpZ2h0LFxuICBMaWdodFByb2JlLFxuICBEaXJlY3Rpb25hbExpZ2h0LFxuICBIZW1pc3BoZXJlTGlnaHQsXG4gIEhlbWlzcGhlcmVMaWdodFByb2JlLFxuICBQb2ludExpZ2h0LFxuICBSZWN0QXJlYUxpZ2h0LFxuICBTcG90TGlnaHQsXG4gIEltbWVkaWF0ZVJlbmRlck9iamVjdCxcbiAgQXJyb3dIZWxwZXIsXG4gIEF4ZXNIZWxwZXIsXG4gIEJveDNIZWxwZXIsXG4gIEJveEhlbHBlcixcbiAgQ2FtZXJhSGVscGVyLFxuICBEaXJlY3Rpb25hbExpZ2h0SGVscGVyLFxuICBHcmlkSGVscGVyLFxuICBIZW1pc3BoZXJlTGlnaHRIZWxwZXIsXG4gIFBsYW5lSGVscGVyLFxuICBQb2ludExpZ2h0SGVscGVyLFxuICBQb2xhckdyaWRIZWxwZXIsXG4gIFNrZWxldG9uSGVscGVyLFxuICBTcG90TGlnaHRIZWxwZXIsXG59IGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgT2JqZWN0M0RUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBTY2VuZVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEdyb3VwVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTWVzaFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIFNraW5uZWRNZXNoVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQm9uZVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEluc3RhbmNlZE1lc2hUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBMT0RUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBMaW5lVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTGluZUxvb3BUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBMaW5lU2VnbWVudHNUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBQb2ludHNUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBTcHJpdGVUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBBdWRpb1RhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEF1ZGlvTGlzdGVuZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbmFsQXVkaW9UYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBDYW1lcmFUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBQZXJzcGVjdGl2ZUNhbWVyYVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIE9ydGhvZ3JhcGhpY0NhbWVyYVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEFycmF5Q2FtZXJhVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQ3ViZUNhbWVyYVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIExpZ2h0VGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTGlnaHRQcm9iZVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEFtYmllbnRMaWdodFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIERpcmVjdGlvbmFsTGlnaHRUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBIZW1pc3BoZXJlTGlnaHRUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBIZW1pc3BoZXJlTGlnaHRQcm9iZVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIFBvaW50TGlnaHRUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBSZWN0QXJlYUxpZ2h0VGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgU3BvdExpZ2h0VGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgSW1tZWRpYXRlUmVuZGVyT2JqZWN0VGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgSGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQXJyb3dIZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBBeGVzSGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQm94M0hlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEJveEhlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIENhbWVyYUhlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIERpcmVjdGlvbmFsTGlnaHRIZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBHcmlkSGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgSGVtaXNwaGVyZUxpZ2h0SGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgUGxhbmVIZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBQb2ludExpZ2h0SGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgUG9sYXJHcmlkSGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgU2tlbGV0b25IZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBTcG90TGlnaHRIZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cblxuZXhwb3J0IGNsYXNzIE9iamVjdDNERW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oT2JqZWN0M0QpIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICBzdXBlcih3b3JsZCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICB9XG59XG5cbk9iamVjdDNERW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWddO1xuXG5leHBvcnQgY2xhc3MgU2NlbmVFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihTY2VuZSkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xuICAgIHN1cGVyKHdvcmxkKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoU2NlbmVUYWcpO1xuICB9XG59XG5cblNjZW5lRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIFNjZW5lVGFnXTtcblxuZXhwb3J0IGNsYXNzIEdyb3VwRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oR3JvdXApIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICBzdXBlcih3b3JsZCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEdyb3VwVGFnKTtcbiAgfVxufVxuXG5Hcm91cEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBHcm91cFRhZ107XG5cbmV4cG9ydCBjbGFzcyBNZXNoRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oTWVzaCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgc3VwZXIod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE1lc2hUYWcpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMud29ybGQsIHRoaXMuZ2VvbWV0cnksIHRoaXMubWF0ZXJpYWwpLmNvcHkoXG4gICAgICB0aGlzXG4gICAgKTtcbiAgfVxufVxuXG5NZXNoRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIE1lc2hUYWddO1xuXG5leHBvcnQgY2xhc3MgU2tpbm5lZE1lc2hFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihTa2lubmVkTWVzaCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgc3VwZXIod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE1lc2hUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFNraW5uZWRNZXNoVGFnKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLndvcmxkLCB0aGlzLmdlb21ldHJ5LCB0aGlzLm1hdGVyaWFsKS5jb3B5KFxuICAgICAgdGhpc1xuICAgICk7XG4gIH1cbn1cblxuU2tpbm5lZE1lc2hFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTWVzaFRhZywgU2tpbm5lZE1lc2hUYWddO1xuXG5leHBvcnQgY2xhc3MgQm9uZUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEJvbmUpIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICBzdXBlcih3b3JsZCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEJvbmVUYWcpO1xuICB9XG59XG5cbkJvbmVFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgQm9uZVRhZ107XG5cbmV4cG9ydCBjbGFzcyBJbnN0YW5jZWRNZXNoRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oSW5zdGFuY2VkTWVzaCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgc3VwZXIod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE1lc2hUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEluc3RhbmNlZE1lc2hUYWcpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMud29ybGQsIHRoaXMuZ2VvbWV0cnksIHRoaXMubWF0ZXJpYWwpLmNvcHkoXG4gICAgICB0aGlzXG4gICAgKTtcbiAgfVxufVxuXG5JbnN0YW5jZWRNZXNoRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIE1lc2hUYWcsIEluc3RhbmNlZE1lc2hUYWddO1xuXG5leHBvcnQgY2xhc3MgTE9ERW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oTE9EKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgc3VwZXIod29ybGQpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMT0RUYWcpO1xuICB9XG59XG5cbkxPREVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMT0RUYWddO1xuXG5leHBvcnQgY2xhc3MgTGluZUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKExpbmUpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLndvcmxkLCB0aGlzLmdlb21ldHJ5LCB0aGlzLm1hdGVyaWFsKS5jb3B5KFxuICAgICAgdGhpc1xuICAgICk7XG4gIH1cbn1cblxuTGluZUVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaW5lVGFnXTtcblxuZXhwb3J0IGNsYXNzIExpbmVMb29wRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oTGluZUxvb3ApIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lTG9vcFRhZyk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy53b3JsZCwgdGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCkuY29weShcbiAgICAgIHRoaXNcbiAgICApO1xuICB9XG59XG5cbkxpbmVMb29wRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIExpbmVUYWcsIExpbmVMb29wVGFnXTtcblxuZXhwb3J0IGNsYXNzIExpbmVTZWdtZW50c0VudGl0eSBleHRlbmRzIEVudGl0eU1peGluKExpbmVTZWdtZW50cykge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgc3VwZXIod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVTZWdtZW50c1RhZyk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy53b3JsZCwgdGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCkuY29weShcbiAgICAgIHRoaXNcbiAgICApO1xuICB9XG59XG5cbkxpbmVTZWdtZW50c0VudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaW5lVGFnLCBMaW5lU2VnbWVudHNUYWddO1xuXG5leHBvcnQgY2xhc3MgUG9pbnRzRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oUG9pbnRzKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICBzdXBlcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoUG9pbnRzVGFnKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLndvcmxkLCB0aGlzLmdlb21ldHJ5LCB0aGlzLm1hdGVyaWFsKS5jb3B5KFxuICAgICAgdGhpc1xuICAgICk7XG4gIH1cbn1cblxuUG9pbnRzRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIFBvaW50c1RhZ107XG5cbmV4cG9ydCBjbGFzcyBTcHJpdGVFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihTcHJpdGUpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIG1hdGVyaWFsKSB7XG4gICAgc3VwZXIod29ybGQsIG1hdGVyaWFsKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoU3ByaXRlVGFnKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLndvcmxkLCB0aGlzLm1hdGVyaWFsKS5jb3B5KHRoaXMpO1xuICB9XG59XG5cblNwcml0ZUVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBTcHJpdGVUYWddO1xuXG5leHBvcnQgY2xhc3MgQXVkaW9FbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihBdWRpbykge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgbGlzdGVuZXIpIHtcbiAgICBzdXBlcih3b3JsZCwgbGlzdGVuZXIpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChBdWRpb1RhZyk7XG4gIH1cbn1cblxuQXVkaW9FbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgQXVkaW9UYWddO1xuXG5leHBvcnQgY2xhc3MgQXVkaW9MaXN0ZW5lckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEF1ZGlvTGlzdGVuZXIpIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICBzdXBlcih3b3JsZCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEF1ZGlvTGlzdGVuZXJUYWcpO1xuICB9XG59XG5cbkF1ZGlvTGlzdGVuZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgQXVkaW9MaXN0ZW5lclRhZ107XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbmFsQXVkaW9FbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihQb3NpdGlvbmFsQXVkaW8pIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGxpc3RlbmVyKSB7XG4gICAgc3VwZXIod29ybGQsIGxpc3RlbmVyKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQXVkaW9UYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFBvc2l0aW9uYWxBdWRpb1RhZyk7XG4gIH1cbn1cblxuUG9zaXRpb25hbEF1ZGlvRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBBdWRpb1RhZyxcbiAgUG9zaXRpb25hbEF1ZGlvVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIENhbWVyYUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKENhbWVyYSkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgZm92LCBhc3BlY3QsIG5lYXIsIGZhcikge1xuICAgIHN1cGVyKHdvcmxkLCBmb3YsIGFzcGVjdCwgbmVhciwgZmFyKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQ2FtZXJhVGFnKTtcbiAgfVxufVxuXG5DYW1lcmFFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgQ2FtZXJhVGFnXTtcblxuZXhwb3J0IGNsYXNzIFBlcnNwZWN0aXZlQ2FtZXJhRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oUGVyc3BlY3RpdmVDYW1lcmEpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpIHtcbiAgICBzdXBlcih3b3JsZCwgZm92LCBhc3BlY3QsIG5lYXIsIGZhcik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KENhbWVyYVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoUGVyc3BlY3RpdmVDYW1lcmFUYWcpO1xuICB9XG59XG5cblBlcnNwZWN0aXZlQ2FtZXJhRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBDYW1lcmFUYWcsXG4gIFBlcnNwZWN0aXZlQ2FtZXJhVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIE9ydGhvZ3JhcGhpY0NhbWVyYUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKE9ydGhvZ3JhcGhpY0NhbWVyYSkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgbGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIpIHtcbiAgICBzdXBlcih3b3JsZCwgbGVmdCwgcmlnaHQsIHRvcCwgYm90dG9tLCBuZWFyLCBmYXIpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChDYW1lcmFUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9ydGhvZ3JhcGhpY0NhbWVyYVRhZyk7XG4gIH1cbn1cblxuT3J0aG9ncmFwaGljQ2FtZXJhRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBDYW1lcmFUYWcsXG4gIE9ydGhvZ3JhcGhpY0NhbWVyYVRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBBcnJheUNhbWVyYUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEFycmF5Q2FtZXJhKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBhcnJheSkge1xuICAgIHN1cGVyKHdvcmxkLCBhcnJheSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KENhbWVyYVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoUGVyc3BlY3RpdmVDYW1lcmFUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEFycmF5Q2FtZXJhVGFnKTtcbiAgfVxufVxuXG5BcnJheUNhbWVyYUVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgQ2FtZXJhVGFnLFxuICBQZXJzcGVjdGl2ZUNhbWVyYVRhZyxcbiAgQXJyYXlDYW1lcmFUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgQ3ViZUNhbWVyYUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEN1YmVDYW1lcmEpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIG5lYXIsIGZhciwgY3ViZVJlc29sdXRpb24sIG9wdGlvbnMpIHtcbiAgICBzdXBlcih3b3JsZCwgbmVhciwgZmFyLCBjdWJlUmVzb2x1dGlvbiwgb3B0aW9ucyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEN1YmVDYW1lcmFUYWcpO1xuICB9XG59XG5cbkN1YmVDYW1lcmFFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgQ3ViZUNhbWVyYVRhZ107XG5cbmV4cG9ydCBjbGFzcyBMaWdodEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKExpZ2h0KSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5KSB7XG4gICAgc3VwZXIod29ybGQsIGNvbG9yLCBpbnRlbnNpdHkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gIH1cbn1cblxuTGlnaHRFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTGlnaHRUYWddO1xuXG5leHBvcnQgY2xhc3MgTGlnaHRQcm9iZUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKExpZ2h0UHJvYmUpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIHNoLCBpbnRlbnNpdHkpIHtcbiAgICBzdXBlcih3b3JsZCwgc2gsIGludGVuc2l0eSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpZ2h0VGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFByb2JlVGFnKTtcbiAgfVxufVxuTGlnaHRQcm9iZUVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaWdodFRhZywgTGlnaHRQcm9iZVRhZ107XG5cbmV4cG9ydCBjbGFzcyBBbWJpZW50TGlnaHRFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihBbWJpZW50TGlnaHQpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGNvbG9yLCBpbnRlbnNpdHkpIHtcbiAgICBzdXBlcih3b3JsZCwgY29sb3IsIGludGVuc2l0eSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpZ2h0VGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChBbWJpZW50TGlnaHRUYWcpO1xuICB9XG59XG5cbkFtYmllbnRMaWdodEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaWdodFRhZywgQW1iaWVudExpZ2h0VGFnXTtcblxuZXhwb3J0IGNsYXNzIERpcmVjdGlvbmFsTGlnaHRFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihEaXJlY3Rpb25hbExpZ2h0KSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5KSB7XG4gICAgc3VwZXIod29ybGQsIGNvbG9yLCBpbnRlbnNpdHkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoRGlyZWN0aW9uYWxMaWdodFRhZyk7XG4gIH1cbn1cblxuRGlyZWN0aW9uYWxMaWdodEVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgTGlnaHRUYWcsXG4gIERpcmVjdGlvbmFsTGlnaHRUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgSGVtaXNwaGVyZUxpZ2h0RW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oSGVtaXNwaGVyZUxpZ2h0KSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBza3lDb2xvciwgZ3JvdW5kQ29sb3IsIGludGVuc2l0eSkge1xuICAgIHN1cGVyKHdvcmxkLCBza3lDb2xvciwgZ3JvdW5kQ29sb3IsIGludGVuc2l0eSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpZ2h0VGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZW1pc3BoZXJlTGlnaHRUYWcpO1xuICB9XG59XG5cbkhlbWlzcGhlcmVMaWdodEVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgTGlnaHRUYWcsXG4gIEhlbWlzcGhlcmVMaWdodFRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBIZW1pc3BoZXJlTGlnaHRQcm9iZUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFxuICBIZW1pc3BoZXJlTGlnaHRQcm9iZVxuKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBza3lDb2xvciwgZ3JvdW5kQ29sb3IsIGludGVuc2l0eSkge1xuICAgIHN1cGVyKHdvcmxkLCBza3lDb2xvciwgZ3JvdW5kQ29sb3IsIGludGVuc2l0eSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpZ2h0VGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFByb2JlVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZW1pc3BoZXJlTGlnaHRQcm9iZVRhZyk7XG4gIH1cbn1cblxuSGVtaXNwaGVyZUxpZ2h0UHJvYmVFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIExpZ2h0VGFnLFxuICBMaWdodFByb2JlVGFnLFxuICBIZW1pc3BoZXJlTGlnaHRQcm9iZVRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBQb2ludExpZ2h0RW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oUG9pbnRMaWdodCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgY29sb3IsIGludGVuc2l0eSwgZGlzdGFuY2UsIGRlY2F5KSB7XG4gICAgc3VwZXIod29ybGQsIGNvbG9yLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBkZWNheSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpZ2h0VGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChQb2ludExpZ2h0VGFnKTtcbiAgfVxufVxuXG5Qb2ludExpZ2h0RW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIExpZ2h0VGFnLCBQb2ludExpZ2h0VGFnXTtcblxuZXhwb3J0IGNsYXNzIFJlY3RBcmVhTGlnaHRFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihSZWN0QXJlYUxpZ2h0KSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5LCB3aWR0aCwgaGVpZ2h0KSB7XG4gICAgc3VwZXIod29ybGQsIGNvbG9yLCBpbnRlbnNpdHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoUmVjdEFyZWFMaWdodFRhZyk7XG4gIH1cbn1cblxuUmVjdEFyZWFMaWdodEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaWdodFRhZywgUmVjdEFyZWFMaWdodFRhZ107XG5cbmV4cG9ydCBjbGFzcyBTcG90TGlnaHRFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihTcG90TGlnaHQpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGNvbG9yLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBhbmdsZSwgcGVudW1icmEsIGRlY2F5KSB7XG4gICAgc3VwZXIod29ybGQsIGNvbG9yLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBhbmdsZSwgcGVudW1icmEsIGRlY2F5KTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGlnaHRUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFNwb3RMaWdodFRhZyk7XG4gIH1cbn1cblxuU3BvdExpZ2h0RW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIExpZ2h0VGFnLCBTcG90TGlnaHRUYWddO1xuXG5leHBvcnQgY2xhc3MgSW1tZWRpYXRlUmVuZGVyT2JqZWN0RW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oXG4gIEltbWVkaWF0ZVJlbmRlck9iamVjdFxuKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBtYXRlcmlhbCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEltbWVkaWF0ZVJlbmRlck9iamVjdFRhZyk7XG4gIH1cbn1cblxuSW1tZWRpYXRlUmVuZGVyT2JqZWN0RW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBJbW1lZGlhdGVSZW5kZXJPYmplY3RUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgQXJyb3dIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihBcnJvd0hlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgZGlyLCBvcmlnaW4sIGxlbmd0aCwgY29sb3IsIGhlYWRMZW5ndGgsIGhlYWRXaWR0aCkge1xuICAgIHN1cGVyKHdvcmxkLCBkaXIsIG9yaWdpbiwgbGVuZ3RoLCBjb2xvciwgaGVhZExlbmd0aCwgaGVhZFdpZHRoKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChBcnJvd0hlbHBlclRhZyk7XG4gIH1cbn1cblxuQXJyb3dIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgSGVscGVyVGFnLCBBcnJvd0hlbHBlclRhZ107XG5cbmV4cG9ydCBjbGFzcyBBeGVzSGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oQXhlc0hlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgc2l6ZSkge1xuICAgIHN1cGVyKHdvcmxkLCBzaXplKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lU2VnbWVudHNUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEF4ZXNIZWxwZXJUYWcpO1xuICB9XG59XG5cbkF4ZXNIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgTGluZVRhZyxcbiAgTGluZVNlZ21lbnRzVGFnLFxuICBBeGVzSGVscGVyVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIEJveDNIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihCb3gzSGVscGVyKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBib3gsIGNvbG9yKSB7XG4gICAgc3VwZXIod29ybGQsIGJveCwgY29sb3IpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVTZWdtZW50c1RhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQm94M0hlbHBlclRhZyk7XG4gIH1cbn1cblxuQm94M0hlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBMaW5lVGFnLFxuICBMaW5lU2VnbWVudHNUYWcsXG4gIEJveDNIZWxwZXJUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgQm94SGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oQm94SGVscGVyKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBvYmplY3QsIGNvbG9yKSB7XG4gICAgc3VwZXIod29ybGQsIG9iamVjdCwgY29sb3IpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVTZWdtZW50c1RhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQm94SGVscGVyVGFnKTtcbiAgfVxufVxuXG5Cb3hIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgTGluZVRhZyxcbiAgTGluZVNlZ21lbnRzVGFnLFxuICBCb3hIZWxwZXJUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgQ2FtZXJhSGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oQ2FtZXJhSGVscGVyKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBjYW1lcmEpIHtcbiAgICBzdXBlcih3b3JsZCwgY2FtZXJhKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lU2VnbWVudHNUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KENhbWVyYUhlbHBlclRhZyk7XG4gIH1cbn1cblxuQ2FtZXJhSGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBIZWxwZXJUYWcsXG4gIExpbmVUYWcsXG4gIExpbmVTZWdtZW50c1RhZyxcbiAgQ2FtZXJhSGVscGVyVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIERpcmVjdGlvbmFsTGlnaHRIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihcbiAgRGlyZWN0aW9uYWxMaWdodEhlbHBlclxuKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBsaWdodCwgc2l6ZSwgY29sb3IpIHtcbiAgICBzdXBlcih3b3JsZCwgbGlnaHQsIHNpemUsIGNvbG9yKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChEaXJlY3Rpb25hbExpZ2h0SGVscGVyVGFnKTtcbiAgfVxufVxuXG5EaXJlY3Rpb25hbExpZ2h0SGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBIZWxwZXJUYWcsXG4gIERpcmVjdGlvbmFsTGlnaHRIZWxwZXJUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgR3JpZEhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEdyaWRIZWxwZXIpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIHNpemUsIGRpdmlzaW9ucywgY29sb3IxLCBjb2xvcjIpIHtcbiAgICBzdXBlcih3b3JsZCwgc2l6ZSwgZGl2aXNpb25zLCBjb2xvcjEsIGNvbG9yMik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVNlZ21lbnRzVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChHcmlkSGVscGVyVGFnKTtcbiAgfVxufVxuXG5HcmlkSGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBIZWxwZXJUYWcsXG4gIExpbmVUYWcsXG4gIExpbmVTZWdtZW50c1RhZyxcbiAgR3JpZEhlbHBlclRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBIZW1pc3BoZXJlTGlnaHRIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihcbiAgSGVtaXNwaGVyZUxpZ2h0SGVscGVyXG4pIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGxpZ2h0LCBzaXplLCBjb2xvcikge1xuICAgIHN1cGVyKHdvcmxkLCBsaWdodCwgc2l6ZSwgY29sb3IpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbWlzcGhlcmVMaWdodEhlbHBlclRhZyk7XG4gIH1cbn1cblxuSGVtaXNwaGVyZUxpZ2h0SGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBIZWxwZXJUYWcsXG4gIEhlbWlzcGhlcmVMaWdodEhlbHBlclRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBQbGFuZUhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFBsYW5lSGVscGVyKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBwbGFuZSwgc2l6ZSwgaGV4KSB7XG4gICAgc3VwZXIod29ybGQsIHBsYW5lLCBzaXplLCBoZXgpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFBsYW5lSGVscGVyVGFnKTtcbiAgfVxufVxuXG5QbGFuZUhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBMaW5lVGFnLFxuICBQbGFuZUhlbHBlclRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBQb2ludExpZ2h0SGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oUG9pbnRMaWdodEhlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgbGlnaHQsIHNwaGVyZVNpemUsIGNvbG9yKSB7XG4gICAgc3VwZXIod29ybGQsIGxpZ2h0LCBzcGhlcmVTaXplLCBjb2xvcik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoUG9pbnRMaWdodEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTWVzaFRhZyk7XG4gIH1cbn1cblxuUG9pbnRMaWdodEhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBQb2ludExpZ2h0SGVscGVyVGFnLFxuICBNZXNoVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIFBvbGFyR3JpZEhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFBvbGFyR3JpZEhlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgcmFkaXVzLCByYWRpYWxzLCBjaXJjbGVzLCBkaXZpc2lvbnMsIGNvbG9yMSwgY29sb3IyKSB7XG4gICAgc3VwZXIod29ybGQsIHJhZGl1cywgcmFkaWFscywgY2lyY2xlcywgZGl2aXNpb25zLCBjb2xvcjEsIGNvbG9yMik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVNlZ21lbnRzVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChQb2xhckdyaWRIZWxwZXJUYWcpO1xuICB9XG59XG5cblBvbGFyR3JpZEhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBMaW5lVGFnLFxuICBMaW5lU2VnbWVudHNUYWcsXG4gIFBvbGFyR3JpZEhlbHBlclRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBTa2VsZXRvbkhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFNrZWxldG9uSGVscGVyKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBvYmplY3QpIHtcbiAgICBzdXBlcih3b3JsZCwgb2JqZWN0KTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lU2VnbWVudHNUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFNrZWxldG9uSGVscGVyVGFnKTtcbiAgfVxufVxuXG5Ta2VsZXRvbkhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBMaW5lVGFnLFxuICBMaW5lU2VnbWVudHNUYWcsXG4gIFNrZWxldG9uSGVscGVyVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIFNwb3RMaWdodEhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFNwb3RMaWdodEhlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgbGlnaHQsIGNvbG9yKSB7XG4gICAgc3VwZXIod29ybGQsIGxpZ2h0LCBjb2xvcik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoU3BvdExpZ2h0SGVscGVyVGFnKTtcbiAgfVxufVxuXG5TcG90TGlnaHRIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgU3BvdExpZ2h0SGVscGVyVGFnLFxuXTtcbiIsImltcG9ydCB7IFN5c3RlbSwgU3lzdGVtU3RhdGVDb21wb25lbnQsIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTdGVyZW9QaG90b1NwaGVyZSB9IGZyb20gXCIuLi9jb21wb25lbnRzL1N0ZXJlb1Bob3RvU3BoZXJlLmpzXCI7XG5pbXBvcnQge1xuICBCb3hCdWZmZXJHZW9tZXRyeSxcbiAgTWVzaEJhc2ljTWF0ZXJpYWwsXG4gIE1lc2gsXG4gIFRleHR1cmUsXG4gIEltYWdlTG9hZGVyXG59IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgT2JqZWN0M0RUYWcgfSBmcm9tIFwiLi4vZW50aXRpZXMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFN0ZXJlb1Bob3RvU3BoZXJlU3RhdGUgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7fVxuXG5TdGVyZW9QaG90b1NwaGVyZVN0YXRlLnNjaGVtYSA9IHtcbiAgcGhvdG9TcGhlcmVMOiB7IHR5cGU6IE9iamVjdCB9LFxuICBwaG90b1NwaGVyZVI6IHsgdHlwZTogT2JqZWN0IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBTdGVyZW9QaG90b1NwaGVyZVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy53b3JsZC5yZWdpc3RlckNvbXBvbmVudChTdGVyZW9QaG90b1NwaGVyZVN0YXRlLCBmYWxzZSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgbGV0IHBob3RvU3BoZXJlID0gZW50aXR5LmdldENvbXBvbmVudChTdGVyZW9QaG90b1NwaGVyZSk7XG5cbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBCb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHBob3RvU3BoZXJlLnNyYywgMTIpO1xuXG4gICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgIG1hdGVyaWFscy5wdXNoKG5ldyBNZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcGhvdG9TcGhlcmVMID0gbmV3IE1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICBwaG90b1NwaGVyZUwubGF5ZXJzLnNldCgxKTtcbiAgICAgIGVudGl0eS5hZGQocGhvdG9TcGhlcmVMKTtcblxuICAgICAgbGV0IG1hdGVyaWFsc1IgPSBbXTtcblxuICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHBob3RvU3BoZXJlUiA9IG5ldyBNZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHNSKTtcbiAgICAgIHBob3RvU3BoZXJlUi5sYXllcnMuc2V0KDIpO1xuICAgICAgZW50aXR5LmFkZChwaG90b1NwaGVyZVIpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFN0ZXJlb1Bob3RvU3BoZXJlU3RhdGUsIHtcbiAgICAgICAgcGhvdG9TcGhlcmVMLFxuICAgICAgICBwaG90b1NwaGVyZVJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoYXRsYXNJbWdVcmwsIHRpbGVzTnVtKSB7XG4gIGxldCB0ZXh0dXJlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXNOdW07IGkrKykge1xuICAgIHRleHR1cmVzW2ldID0gbmV3IFRleHR1cmUoKTtcbiAgfVxuXG4gIGxldCBsb2FkZXIgPSBuZXcgSW1hZ2VMb2FkZXIoKTtcbiAgbG9hZGVyLmxvYWQoYXRsYXNJbWdVcmwsIGZ1bmN0aW9uKGltYWdlT2JqKSB7XG4gICAgbGV0IGNhbnZhcywgY29udGV4dDtcbiAgICBsZXQgdGlsZVdpZHRoID0gaW1hZ2VPYmouaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRpbGVXaWR0aDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRpbGVXaWR0aDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZU9iaixcbiAgICAgICAgdGlsZVdpZHRoICogaSxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoXG4gICAgICApO1xuICAgICAgdGV4dHVyZXNbaV0uaW1hZ2UgPSBjYW52YXM7XG4gICAgICB0ZXh0dXJlc1tpXS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGV4dHVyZXM7XG59XG5cblN0ZXJlb1Bob3RvU3BoZXJlU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1N0ZXJlb1Bob3RvU3BoZXJlLCBPYmplY3QzRFRhZywgTm90KFN0ZXJlb1Bob3RvU3BoZXJlU3RhdGUpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgQ2xvY2ssIFdlYkdMUmVuZGVyZXIgYXMgVGhyZWVXZWJHTFJlbmRlcmVyIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBUaHJlZVdvcmxkIH0gZnJvbSBcIi4vVGhyZWVXb3JsZFwiO1xuaW1wb3J0IHsgU2NlbmVFbnRpdHksIFBlcnNwZWN0aXZlQ2FtZXJhRW50aXR5IH0gZnJvbSBcIi4vZW50aXRpZXMvaW5kZXguanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIgfSBmcm9tIFwiLi9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUod29ybGQgPSBuZXcgVGhyZWVXb3JsZCgpLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKTtcblxuICB3b3JsZFxuICAgIC5yZWdpc3RlckNvbXBvbmVudChXZWJHTFJlbmRlcmVyLCBmYWxzZSlcbiAgICAucmVnaXN0ZXJFbnRpdHlUeXBlKFNjZW5lRW50aXR5KVxuICAgIC5yZWdpc3RlckVudGl0eVR5cGUoUGVyc3BlY3RpdmVDYW1lcmFFbnRpdHksIGZhbHNlKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuXG4gIGlmICghYW5pbWF0aW9uTG9vcCkge1xuICAgIGNvbnN0IGNsb2NrID0gbmV3IENsb2NrKCk7XG5cbiAgICBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xuICAgICAgd29ybGQuZXhlY3V0ZShjbG9jay5nZXREZWx0YSgpLCBjbG9jay5lbGFwc2VkVGltZSk7XG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IHJlbmRlcmVyT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oXG4gICAge1xuICAgICAgYW50aWFsaWFzOiB0cnVlXG4gICAgfSxcbiAgICBvcHRpb25zLnJlbmRlcmVyXG4gICk7XG5cbiAgY29uc3QgcmVuZGVyZXIgPSBuZXcgVGhyZWVXZWJHTFJlbmRlcmVyKHJlbmRlcmVyT3B0aW9ucyk7XG4gIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGFuaW1hdGlvbkxvb3ApO1xuXG4gIGNvbnN0IGNhbnZhcyA9IG9wdGlvbnMucmVuZGVyZXIgJiYgb3B0aW9ucy5yZW5kZXJlci5jYW52YXM7XG4gIGNvbnN0IHdpZHRoID0gY2FudmFzID8gY2FudmFzLnBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGggOiB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgY29uc3QgaGVpZ2h0ID0gY2FudmFzXG4gICAgPyBjYW52YXMucGFyZW50RWxlbWVudC5vZmZzZXRIZWlnaHRcbiAgICA6IHdpbmRvdy5pbm5lckhlaWdodDtcblxuICByZW5kZXJlci5zZXRTaXplKHdpZHRoLCBoZWlnaHQsICEhY2FudmFzKTtcblxuICBpZiAoIWNhbnZhcykge1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG4gIH1cblxuICBsZXQgc2NlbmUgPSB3b3JsZC5hZGRFbnRpdHkobmV3IFNjZW5lRW50aXR5KHdvcmxkKSk7XG5cbiAgY29uc3QgY2FtZXJhID0gbmV3IFBlcnNwZWN0aXZlQ2FtZXJhRW50aXR5KFxuICAgIHdvcmxkLFxuICAgIDkwLFxuICAgIHdpZHRoIC8gaGVpZ2h0LFxuICAgIDAuMSxcbiAgICAxMDBcbiAgKTtcblxuICBzY2VuZS5hZGQoY2FtZXJhKTtcblxuICBsZXQgcmVuZGVyZXJFbnRpdHkgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlciwge1xuICAgIHJlbmRlcmVyLFxuICAgIHNjZW5lLFxuICAgIGNhbWVyYSxcbiAgICB1cGRhdGVDYW52YXNTdHlsZTogISFjYW52YXNcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICByZW5kZXJlcjogcmVuZGVyZXJFbnRpdHlcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiRUNTWVByb3BUeXBlcyIsIlRocmVlV2ViR0xSZW5kZXJlciJdLCJtYXBwaW5ncyI6Ijs7O0FBWVksTUFBQyxTQUFTLEdBQUc7RUFDdkIsR0FBR0EsV0FBYTtFQUNoQixPQUFPLEVBQUU7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUU7R0FDdkI7RUFDRCxPQUFPLEVBQUU7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUU7R0FDdkI7RUFDRCxPQUFPLEVBQUU7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUU7R0FDdkI7RUFDRCxVQUFVLEVBQUU7SUFDVixJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxVQUFVLEVBQUU7R0FDMUI7RUFDRCxLQUFLLEVBQUU7SUFDTCxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxLQUFLLEVBQUU7R0FDckI7RUFDRCxLQUFLLEVBQUU7SUFDTCxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxLQUFLLEVBQUU7R0FDckI7RUFDRCxPQUFPLEVBQUU7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUU7R0FDdkI7RUFDRCxPQUFPLEVBQUU7SUFDUCxJQUFJLEVBQUUsWUFBWTtJQUNsQixLQUFLLEVBQUUsYUFBYTtJQUNwQixPQUFPLEVBQUUsSUFBSSxPQUFPLEVBQUU7R0FDdkI7Q0FDRjs7QUNwRE0sTUFBTSxVQUFVLFNBQVMsS0FBSyxDQUFDO0VBQ3BDLFdBQVcsR0FBRztJQUNaLEtBQUssRUFBRSxDQUFDOztJQUVSLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0lBQ3RCLElBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztJQUV0QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztHQUMxQjs7RUFFRCxrQkFBa0IsQ0FBQyxVQUFV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

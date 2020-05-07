import { World, ObjectPool, Component, System, TagComponent, Not, SystemStateComponent } from 'ecsy';
import { Matrix4, MathUtils, Object3D, Scene, Group, Mesh, SkinnedMesh, Bone, InstancedMesh, LOD, Line, LineLoop, LineSegments, Points, Sprite, Audio, AudioListener, PositionalAudio, Camera, PerspectiveCamera, OrthographicCamera, ArrayCamera, CubeCamera, Light, LightProbe, AmbientLight, DirectionalLight, HemisphereLight, HemisphereLightProbe, PointLight, RectAreaLight, SpotLight, ImmediateRenderObject, ArrowHelper, AxesHelper, Box3Helper, BoxHelper, CameraHelper, DirectionalLightHelper, GridHelper, HemisphereLightHelper, PlaneHelper, PointLightHelper, PolarGridHelper, SkeletonHelper, SpotLightHelper, BoxBufferGeometry, MeshBasicMaterial, Texture, ImageLoader, Clock, WebGLRenderer as WebGLRenderer$1 } from 'three';

class ThreeWorld extends World {
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

class StereoPhotoSphere extends Component {}

StereoPhotoSphere.schema = {
  src: { type: String }
};

class WebGLRenderer extends Component {}

WebGLRenderer.schema = {
  renderer: { type: Object },
  scene: { type: Object },
  camera: { type: Object },
  updateCanvasStyle: { type: Boolean }
};

class RenderPass {
  constructor() {
    this.scene = null;
    this.camera = null;
  }

  reset() {
    this.scene = null;
    this.camera = null;
  }
}

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

      console.log(entity);

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
    .registerComponent(RenderPass, false)
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

export { AmbientLightEntity, AmbientLightTag, ArrayCameraEntity, ArrayCameraTag, ArrowHelperEntity, ArrowHelperTag, AudioEntity, AudioListenerEntity, AudioListenerTag, AudioTag, AxesHelperEntity, AxesHelperTag, BoneEntity, BoneTag, Box3HelperEntity, Box3HelperTag, BoxHelperEntity, BoxHelperTag, CameraEntity, CameraHelperEntity, CameraHelperTag, CameraTag, CubeCameraEntity, CubeCameraTag, DirectionalLightEntity, DirectionalLightHelperEntity, DirectionalLightHelperTag, DirectionalLightTag, GridHelperEntity, GridHelperTag, GroupEntity, GroupTag, HelperTag, HemisphereLightEntity, HemisphereLightHelperEntity, HemisphereLightHelperTag, HemisphereLightProbeEntity, HemisphereLightProbeTag, HemisphereLightTag, ImmediateRenderObjectEntity, ImmediateRenderObjectTag, InstancedMeshEntity, InstancedMeshTag, LODEntity, LODTag, LightEntity, LightProbeEntity, LightProbeTag, LightTag, LineEntity, LineLoopEntity, LineLoopTag, LineSegmentsEntity, LineSegmentsTag, LineTag, MeshEntity, MeshTag, Object3DEntity, Object3DTag, OrthographicCameraEntity, OrthographicCameraTag, PerspectiveCameraEntity, PerspectiveCameraTag, PlaneHelperEntity, PlaneHelperTag, PointLightEntity, PointLightHelperEntity, PointLightHelperTag, PointLightTag, PointsEntity, PointsTag, PolarGridHelperEntity, PolarGridHelperTag, PositionalAudioEntity, PositionalAudioTag, RectAreaLightEntity, RectAreaLightTag, SceneEntity, SceneTag, SkeletonHelperEntity, SkeletonHelperTag, SkinnedMeshEntity, SkinnedMeshTag, SpotLightEntity, SpotLightHelperEntity, SpotLightHelperTag, SpotLightTag, SpriteEntity, SpriteTag, StereoPhotoSphere, StereoPhotoSphereSystem, ThreeWorld, WebGLRenderer, WebGLRendererSystem, initialize };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9UaHJlZVdvcmxkLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU3RlcmVvUGhvdG9TcGhlcmUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmVuZGVyUGFzcy5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvRW50aXR5TWl4aW4uanMiLCIuLi9zcmMvZW50aXRpZXMvaW5kZXguanMiLCIuLi9zcmMvc3lzdGVtcy9TdGVyZW9QaG90b1NwaGVyZVN5c3RlbS5qcyIsIi4uL3NyYy9pbml0aWFsaXplLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFdvcmxkLCBPYmplY3RQb29sIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFRocmVlV29ybGQgZXh0ZW5kcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG5cbiAgICB0aGlzLmVudGl0eVR5cGVzID0ge307XG4gICAgdGhpcy5lbnRpdHlQb29scyA9IHt9O1xuICB9XG5cbiAgcmVnaXN0ZXJFbnRpdHlUeXBlKEVudGl0eVR5cGUsIGVudGl0eVBvb2wpIHtcbiAgICBpZiAodGhpcy5lbnRpdHlUeXBlc1tFbnRpdHlUeXBlLm5hbWVdKSB7XG4gICAgICBjb25zb2xlLndhcm4oYEVudGl0eSB0eXBlOiAnJHtFbnRpdHlUeXBlLm5hbWV9JyBhbHJlYWR5IHJlZ2lzdGVyZWQuYCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICB0aGlzLmVudGl0eVR5cGVzW0VudGl0eVR5cGUubmFtZV0gPSBFbnRpdHlUeXBlO1xuXG4gICAgaWYgKGVudGl0eVBvb2wgPT09IGZhbHNlKSB7XG4gICAgICBlbnRpdHlQb29sID0gbnVsbDtcbiAgICB9IGVsc2UgaWYgKGVudGl0eVBvb2wgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZW50aXR5UG9vbCA9IG5ldyBPYmplY3RQb29sKG5ldyBFbnRpdHlUeXBlKHRoaXMpKTtcbiAgICB9XG5cbiAgICB0aGlzLmVudGl0eVBvb2xzW0VudGl0eVR5cGUubmFtZV0gPSBlbnRpdHlQb29sO1xuXG4gICAgY29uc3QgdGFnQ29tcG9uZW50cyA9IEVudGl0eVR5cGUudGFnQ29tcG9uZW50cztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFnQ29tcG9uZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgdGFnQ29tcG9uZW50ID0gdGFnQ29tcG9uZW50c1tpXTtcbiAgICAgIGlmICghdGhpcy5jb21wb25lbnRUeXBlc1t0YWdDb21wb25lbnQubmFtZV0pIHtcbiAgICAgICAgdGhpcy5yZWdpc3RlckNvbXBvbmVudCh0YWdDb21wb25lbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgY3JlYXRlRW50aXR5KEVudGl0eVR5cGUpIHtcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmNyZWF0ZURldGFjaGVkRW50aXR5KEVudGl0eVR5cGUpO1xuICAgIHJldHVybiB0aGlzLmFkZEVudGl0eShlbnRpdHkpO1xuICB9XG5cbiAgY3JlYXRlRGV0YWNoZWRFbnRpdHkoRW50aXR5VHlwZSkge1xuICAgIGNvbnN0IGVudGl0eVBvb2wgPVxuICAgICAgRW50aXR5VHlwZSA9PT0gdW5kZWZpbmVkXG4gICAgICAgID8gdGhpcy5lbnRpdHlQb29sXG4gICAgICAgIDogdGhpcy5lbnRpdHlQb29sc1tFbnRpdHlUeXBlLm5hbWVdO1xuXG4gICAgY29uc3QgZW50aXR5ID0gZW50aXR5UG9vbCA/IGVudGl0eVBvb2wuYWNxdWlyZSgpIDogbmV3IEVudGl0eVR5cGUodGhpcyk7XG5cbiAgICByZXR1cm4gZW50aXR5O1xuICB9XG5cbiAgYWRkRW50aXR5KGVudGl0eSkge1xuICAgIGlmIChlbnRpdHkuaXNPYmplY3QzRCkge1xuICAgICAgZW50aXR5LnRyYXZlcnNlRW50aXRpZXMoY2hpbGQgPT4ge1xuICAgICAgICBpZiAodGhpcy5lbnRpdGllc0J5VVVJRFtlbnRpdHkudXVpZF0pIHtcbiAgICAgICAgICBjb25zb2xlLndhcm4oYEVudGl0eSAke2VudGl0eS51dWlkfSBhbHJlYWR5IGFkZGVkLmApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5lbnRpdGllc0J5VVVJRFtlbnRpdHkudXVpZF0gPSBjaGlsZDtcbiAgICAgICAgdGhpcy5lbnRpdGllcy5wdXNoKGNoaWxkKTtcbiAgICAgICAgY2hpbGQuYWxpdmUgPSB0cnVlO1xuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGQuY29tcG9uZW50VHlwZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBDb21wb25lbnQgPSBjaGlsZC5jb21wb25lbnRUeXBlc1tpXTtcbiAgICAgICAgICB0aGlzLm9uQ29tcG9uZW50QWRkZWQoY2hpbGQsIENvbXBvbmVudCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5lbnRpdGllc0J5VVVJRFtlbnRpdHkudXVpZF0pIHtcbiAgICAgICAgY29uc29sZS53YXJuKGBFbnRpdHkgJHtlbnRpdHkudXVpZH0gYWxyZWFkeSBhZGRlZC5gKTtcbiAgICAgICAgcmV0dXJuIGVudGl0eTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5lbnRpdGllc0J5VVVJRFtlbnRpdHkudXVpZF0gPSBlbnRpdHk7XG4gICAgICB0aGlzLmVudGl0aWVzLnB1c2goZW50aXR5KTtcbiAgICAgIGVudGl0eS5hbGl2ZSA9IHRydWU7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXR5LmNvbXBvbmVudFR5cGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IENvbXBvbmVudCA9IGVudGl0eS5jb21wb25lbnRUeXBlc1tpXTtcbiAgICAgICAgdGhpcy5vbkNvbXBvbmVudEFkZGVkKGVudGl0eSwgQ29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZW50aXR5O1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU3RlcmVvUGhvdG9TcGhlcmUgZXh0ZW5kcyBDb21wb25lbnQge31cblxuU3RlcmVvUGhvdG9TcGhlcmUuc2NoZW1hID0ge1xuICBzcmM6IHsgdHlwZTogU3RyaW5nIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5XZWJHTFJlbmRlcmVyLnNjaGVtYSA9IHtcbiAgcmVuZGVyZXI6IHsgdHlwZTogT2JqZWN0IH0sXG4gIHNjZW5lOiB7IHR5cGU6IE9iamVjdCB9LFxuICBjYW1lcmE6IHsgdHlwZTogT2JqZWN0IH0sXG4gIHVwZGF0ZUNhbnZhc1N0eWxlOiB7IHR5cGU6IEJvb2xlYW4gfVxufTtcbiIsImV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29uc3QgcGFyZW50ID0gY29tcG9uZW50LnJlbmRlcmVyLmRvbUVsZW1lbnQucGFyZW50RWxlbWVudDtcbiAgICAgICAgICBjb25zdCB3aWR0aCA9IHBhcmVudC5jbGllbnRXaWR0aDtcbiAgICAgICAgICBjb25zdCBoZWlnaHQgPSBwYXJlbnQuY2xpZW50SGVpZ2h0O1xuICAgICAgICAgIGNvbXBvbmVudC5yZW5kZXJlci5zZXRTaXplKFxuICAgICAgICAgICAgd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQsXG4gICAgICAgICAgICBjb21wb25lbnQudXBkYXRlQ2FudmFzU3R5bGVcbiAgICAgICAgICApO1xuICAgICAgICAgIGNvbXBvbmVudC5jYW1lcmEuYXNwZWN0ID0gd2lkdGggLyBoZWlnaHQ7XG4gICAgICAgICAgY29tcG9uZW50LmNhbWVyYS51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICBjb21wb25lbnQucmVuZGVyZXIucmVuZGVyKGNvbXBvbmVudC5zY2VuZSwgY29tcG9uZW50LmNhbWVyYSk7XG4gICAgfSk7XG4gIH1cbn1cblxuV2ViR0xSZW5kZXJlclN5c3RlbS5xdWVyaWVzID0ge1xuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlcl1cbiAgfVxufTtcbiIsImltcG9ydCB7IE1hdHJpeDQsIE1hdGhVdGlscyB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgX3dyYXBJbW11dGFibGVDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuXG5jb25zdCBERUJVRyA9IGZhbHNlO1xuXG52YXIgX20xID0gbmV3IE1hdHJpeDQoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIEVudGl0eU1peGluKE9iamVjdDNEQ2xhc3MpIHtcbiAgY29uc3QgTWl4aW4gPSBjbGFzcyBleHRlbmRzIE9iamVjdDNEQ2xhc3Mge1xuICAgIGNvbnN0cnVjdG9yKHdvcmxkLCAuLi5hcmdzKSB7XG4gICAgICBzdXBlciguLi5hcmdzKTtcblxuICAgICAgdGhpcy53b3JsZCA9IHdvcmxkO1xuXG4gICAgICAvLyBMaXN0IG9mIGNvbXBvbmVudHMgdHlwZXMgdGhlIGVudGl0eSBoYXNcbiAgICAgIHRoaXMuY29tcG9uZW50VHlwZXMgPSBbXTtcblxuICAgICAgLy8gSW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudHNcbiAgICAgIHRoaXMuY29tcG9uZW50cyA9IHt9O1xuXG4gICAgICB0aGlzLl9jb21wb25lbnRzVG9SZW1vdmUgPSB7fTtcblxuICAgICAgLy8gUXVlcmllcyB3aGVyZSB0aGUgZW50aXR5IGlzIGFkZGVkXG4gICAgICB0aGlzLnF1ZXJpZXMgPSBbXTtcblxuICAgICAgLy8gVXNlZCBmb3IgZGVmZXJyZWQgcmVtb3ZhbFxuICAgICAgdGhpcy5fY29tcG9uZW50VHlwZXNUb1JlbW92ZSA9IFtdO1xuXG4gICAgICB0aGlzLmFsaXZlID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuX251bVN5c3RlbVN0YXRlQ29tcG9uZW50cyA9IDA7XG5cbiAgICAgIHRoaXMuaXNFbnRpdHkgPSB0cnVlO1xuICAgIH1cblxuICAgIC8vIENPTVBPTkVOVFNcblxuICAgIGdldENvbXBvbmVudChDb21wb25lbnQsIGluY2x1ZGVSZW1vdmVkKSB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gdGhpcy5jb21wb25lbnRzW0NvbXBvbmVudC5uYW1lXTtcblxuICAgICAgaWYgKCFjb21wb25lbnQgJiYgaW5jbHVkZVJlbW92ZWQgPT09IHRydWUpIHtcbiAgICAgICAgY29tcG9uZW50ID0gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5uYW1lXTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIERFQlVHID8gX3dyYXBJbW11dGFibGVDb21wb25lbnQoQ29tcG9uZW50LCBjb21wb25lbnQpIDogY29tcG9uZW50O1xuICAgIH1cblxuICAgIGdldFJlbW92ZWRDb21wb25lbnQoQ29tcG9uZW50KSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW0NvbXBvbmVudC5uYW1lXTtcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnRzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50cztcbiAgICB9XG5cbiAgICBnZXRDb21wb25lbnRzVG9SZW1vdmUoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlO1xuICAgIH1cblxuICAgIGdldENvbXBvbmVudFR5cGVzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuY29tcG9uZW50VHlwZXM7XG4gICAgfVxuXG4gICAgZ2V0TXV0YWJsZUNvbXBvbmVudChDb21wb25lbnQpIHtcbiAgICAgIHZhciBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbQ29tcG9uZW50Lm5hbWVdO1xuXG4gICAgICBpZiAodGhpcy5hbGl2ZSkge1xuICAgICAgICB0aGlzLndvcmxkLm9uQ29tcG9uZW50Q2hhbmdlZCh0aGlzLCBDb21wb25lbnQsIGNvbXBvbmVudCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb21wb25lbnQ7XG4gICAgfVxuXG4gICAgYWRkQ29tcG9uZW50KENvbXBvbmVudCwgcHJvcHMpIHtcbiAgICAgIGlmICh+dGhpcy5jb21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCkpIHJldHVybjtcblxuICAgICAgdGhpcy5jb21wb25lbnRUeXBlcy5wdXNoKENvbXBvbmVudCk7XG5cbiAgICAgIGlmIChDb21wb25lbnQuaXNTeXN0ZW1TdGF0ZUNvbXBvbmVudCkge1xuICAgICAgICB0aGlzLl9udW1TeXN0ZW1TdGF0ZUNvbXBvbmVudHMrKztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbXBvbmVudFBvb2wgPSB0aGlzLndvcmxkLmdldENvbXBvbmVudFBvb2woQ29tcG9uZW50KTtcblxuICAgICAgdmFyIGNvbXBvbmVudCA9XG4gICAgICAgIGNvbXBvbmVudFBvb2wgPT09IHVuZGVmaW5lZFxuICAgICAgICAgID8gbmV3IENvbXBvbmVudChwcm9wcylcbiAgICAgICAgICA6IGNvbXBvbmVudFBvb2wuYWNxdWlyZSgpO1xuXG4gICAgICBpZiAoY29tcG9uZW50UG9vbCAmJiBwcm9wcykge1xuICAgICAgICBjb21wb25lbnQuY29weShwcm9wcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuY29tcG9uZW50c1tDb21wb25lbnQubmFtZV0gPSBjb21wb25lbnQ7XG5cbiAgICAgIGlmICh0aGlzLmFsaXZlKSB7XG4gICAgICAgIHRoaXMud29ybGQub25Db21wb25lbnRBZGRlZCh0aGlzLCBDb21wb25lbnQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBoYXNDb21wb25lbnQoQ29tcG9uZW50LCBpbmNsdWRlUmVtb3ZlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgISF+dGhpcy5jb21wb25lbnRUeXBlcy5pbmRleE9mKENvbXBvbmVudCkgfHxcbiAgICAgICAgKGluY2x1ZGVSZW1vdmVkID09PSB0cnVlICYmIHRoaXMuaGFzUmVtb3ZlZENvbXBvbmVudChDb21wb25lbnQpKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICBoYXNSZW1vdmVkQ29tcG9uZW50KENvbXBvbmVudCkge1xuICAgICAgcmV0dXJuICEhfnRoaXMuX2NvbXBvbmVudFR5cGVzVG9SZW1vdmUuaW5kZXhPZihDb21wb25lbnQpO1xuICAgIH1cblxuICAgIGhhc0FsbENvbXBvbmVudHMoQ29tcG9uZW50cykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICghdGhpcy5oYXNDb21wb25lbnQoQ29tcG9uZW50c1tpXSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGhhc0FueUNvbXBvbmVudHMoQ29tcG9uZW50cykge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBDb21wb25lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc0NvbXBvbmVudChDb21wb25lbnRzW2ldKSkgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmVtb3ZlQ29tcG9uZW50KENvbXBvbmVudCwgaW1tZWRpYXRlbHkpIHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudE5hbWUgPSBDb21wb25lbnQubmFtZTtcblxuICAgICAgaWYgKCF0aGlzLl9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV0pIHtcbiAgICAgICAgZGVsZXRlIHRoaXMuY29tcG9uZW50c1tjb21wb25lbnROYW1lXTtcblxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuY29tcG9uZW50VHlwZXMuaW5kZXhPZihDb21wb25lbnQpO1xuICAgICAgICB0aGlzLmNvbXBvbmVudFR5cGVzLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICAgICAgdGhpcy53b3JsZC5vblJlbW92ZUNvbXBvbmVudCh0aGlzLCBDb21wb25lbnQpO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjb21wb25lbnQgPSB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG5cbiAgICAgIGlmIChpbW1lZGlhdGVseSkge1xuICAgICAgICBpZiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgY29tcG9uZW50LmRpc3Bvc2UoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9jb21wb25lbnRzVG9SZW1vdmVbY29tcG9uZW50TmFtZV0pIHtcbiAgICAgICAgICBkZWxldGUgdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5fY29tcG9uZW50VHlwZXNUb1JlbW92ZS5pbmRleE9mKENvbXBvbmVudCk7XG5cbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9jb21wb25lbnRUeXBlc1RvUmVtb3ZlLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb21wb25lbnRUeXBlc1RvUmVtb3ZlLnB1c2goQ29tcG9uZW50KTtcbiAgICAgICAgdGhpcy5fY29tcG9uZW50c1RvUmVtb3ZlW2NvbXBvbmVudE5hbWVdID0gY29tcG9uZW50O1xuICAgICAgICB0aGlzLndvcmxkLnF1ZXVlQ29tcG9uZW50UmVtb3ZhbCh0aGlzLCBDb21wb25lbnQpO1xuICAgICAgfVxuXG4gICAgICBpZiAoQ29tcG9uZW50LmlzU3lzdGVtU3RhdGVDb21wb25lbnQpIHtcbiAgICAgICAgdGhpcy5fbnVtU3lzdGVtU3RhdGVDb21wb25lbnRzLS07XG5cbiAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIGVudGl0eSB3YXMgYSBnaG9zdCB3YWl0aW5nIGZvciB0aGUgbGFzdCBzeXN0ZW0gc3RhdGUgY29tcG9uZW50IHRvIGJlIHJlbW92ZWRcbiAgICAgICAgaWYgKHRoaXMuX251bVN5c3RlbVN0YXRlQ29tcG9uZW50cyA9PT0gMCAmJiAhdGhpcy5hbGl2ZSkge1xuICAgICAgICAgIHRoaXMuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByb2Nlc3NSZW1vdmVkQ29tcG9uZW50cygpIHtcbiAgICAgIHdoaWxlICh0aGlzLl9jb21wb25lbnRUeXBlc1RvUmVtb3ZlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgbGV0IENvbXBvbmVudCA9IHRoaXMuX2NvbXBvbmVudFR5cGVzVG9SZW1vdmUucG9wKCk7XG4gICAgICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KENvbXBvbmVudCwgdHJ1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmVtb3ZlQWxsQ29tcG9uZW50cyhpbW1lZGlhdGVseSkge1xuICAgICAgbGV0IENvbXBvbmVudHMgPSB0aGlzLmNvbXBvbmVudFR5cGVzO1xuXG4gICAgICBmb3IgKGxldCBqID0gQ29tcG9uZW50cy5sZW5ndGggLSAxOyBqID49IDA7IGotLSkge1xuICAgICAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChDb21wb25lbnRzW2pdLCBpbW1lZGlhdGVseSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkKC4uLm9iamVjdHMpIHtcbiAgICAgIHN1cGVyLmFkZCguLi5vYmplY3RzKTtcblxuICAgICAgaWYgKHRoaXMuYWxpdmUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3Qgb2JqZWN0ID0gb2JqZWN0c1tpXTtcblxuICAgICAgICAgIGlmIChvYmplY3QuaXNFbnRpdHkpIHtcbiAgICAgICAgICAgIHRoaXMud29ybGQuYWRkRW50aXR5KG9iamVjdCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlbW92ZSguLi5vYmplY3RzKSB7XG4gICAgICBzdXBlci5yZW1vdmUoLi4ub2JqZWN0cyk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCBvYmplY3QgPSBvYmplY3RzW2ldO1xuXG4gICAgICAgIGlmIChvYmplY3QuaXNFbnRpdHkpIHtcbiAgICAgICAgICBvYmplY3QuZGlzcG9zZSgpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJlbW92ZUltbWVkaWF0ZWx5KC4uLm9iamVjdHMpIHtcbiAgICAgIHN1cGVyLnJlbW92ZSguLi5vYmplY3RzKTtcblxuICAgICAgaWYgKHRoaXMuYWxpdmUpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgb2JqZWN0c1tpXS5kaXNwb3NlKHRydWUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGF0dGFjaChvYmplY3QpIHtcbiAgICAgIC8vIGFkZHMgb2JqZWN0IGFzIGEgY2hpbGQgb2YgdGhpcywgd2hpbGUgbWFpbnRhaW5pbmcgdGhlIG9iamVjdCdzIHdvcmxkIHRyYW5zZm9ybVxuICAgICAgLy8gQXZvaWRzIGVudGl0eSBiZWluZyByZW1vdmVkL2FkZGVkIHRvIHdvcmxkLlxuXG4gICAgICB0aGlzLnVwZGF0ZVdvcmxkTWF0cml4KHRydWUsIGZhbHNlKTtcblxuICAgICAgX20xLmdldEludmVyc2UodGhpcy5tYXRyaXhXb3JsZCk7XG5cbiAgICAgIGlmIChvYmplY3QucGFyZW50ICE9PSBudWxsKSB7XG4gICAgICAgIG9iamVjdC5wYXJlbnQudXBkYXRlV29ybGRNYXRyaXgodHJ1ZSwgZmFsc2UpO1xuXG4gICAgICAgIF9tMS5tdWx0aXBseShvYmplY3QucGFyZW50Lm1hdHJpeFdvcmxkKTtcbiAgICAgIH1cblxuICAgICAgb2JqZWN0LmFwcGx5TWF0cml4NChfbTEpO1xuXG4gICAgICBvYmplY3QudXBkYXRlV29ybGRNYXRyaXgoZmFsc2UsIGZhbHNlKTtcblxuICAgICAgc3VwZXIuYWRkKG9iamVjdCk7XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHRyYXZlcnNlRW50aXRpZXMoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMudHJhdmVyc2UoY2hpbGQgPT4ge1xuICAgICAgICBpZiAoY2hpbGQuaXNFbnRpdHkpIHtcbiAgICAgICAgICBjYWxsYmFjayhjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvcHkoc291cmNlLCByZWN1cnNpdmUpIHtcbiAgICAgIHN1cGVyLmNvcHkoc291cmNlLCByZWN1cnNpdmUpO1xuXG4gICAgICAvLyBESVNDVVNTOiBTaG91bGQgd2UgcmVzZXQgQ29tcG9uZW50VHlwZXMgYW5kIGNvbXBvbmVudHMgaGVyZSBvciBpbiBkaXNwb3NlP1xuICAgICAgZm9yIChjb25zdCBjb21wb25lbnROYW1lIGluIHNvdXJjZS5jb21wb25lbnRzKSB7XG4gICAgICAgIGNvbnN0IHNvdXJjZUNvbXBvbmVudCA9IHNvdXJjZS5jb21wb25lbnRzW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICB0aGlzLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0gPSBzb3VyY2VDb21wb25lbnQuY2xvbmUoKTtcbiAgICAgICAgdGhpcy5jb21wb25lbnRUeXBlcy5wdXNoKHNvdXJjZUNvbXBvbmVudC5jb25zdHJ1Y3Rvcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNsb25lKHJlY3Vyc2l2ZSkge1xuICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMud29ybGQpLmNvcHkodGhpcywgcmVjdXJzaXZlKTtcbiAgICB9XG5cbiAgICBkaXNwb3NlKGltbWVkaWF0ZWx5KSB7XG4gICAgICB0aGlzLnRyYXZlcnNlRW50aXRpZXMoY2hpbGQgPT4ge1xuICAgICAgICBpZiAoY2hpbGQuYWxpdmUpIHtcbiAgICAgICAgICBjaGlsZC53b3JsZC5vbkRpc3Bvc2VFbnRpdHkodGhpcyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaW1tZWRpYXRlbHkpIHtcbiAgICAgICAgICBjaGlsZC51dWlkID0gTWF0aFV0aWxzLmdlbmVyYXRlVVVJRCgpO1xuICAgICAgICAgIGNoaWxkLmFsaXZlID0gdHJ1ZTtcblxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hpbGQucXVlcmllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY2hpbGQucXVlcmllc1tpXS5yZW1vdmVFbnRpdHkodGhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnROYW1lIGluIGNoaWxkLmNvbXBvbmVudHMpIHtcbiAgICAgICAgICAgIGNoaWxkLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV0uZGlzcG9zZSgpO1xuICAgICAgICAgICAgZGVsZXRlIGNoaWxkLmNvbXBvbmVudHNbY29tcG9uZW50TmFtZV07XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgZm9yIChjb25zdCBjb21wb25lbnROYW1lIGluIGNoaWxkLl9jb21wb25lbnRzVG9SZW1vdmUpIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjaGlsZC5fY29tcG9uZW50c1RvUmVtb3ZlW2NvbXBvbmVudE5hbWVdO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNoaWxkLnF1ZXJpZXMubGVuZ3RoID0gMDtcbiAgICAgICAgICBjaGlsZC5jb21wb25lbnRUeXBlcy5sZW5ndGggPSAwO1xuICAgICAgICAgIGNoaWxkLl9jb21wb25lbnRUeXBlc1RvUmVtb3ZlLmxlbmd0aCA9IDA7XG5cbiAgICAgICAgICBpZiAoY2hpbGQuX3Bvb2wpIHtcbiAgICAgICAgICAgIGNoaWxkLl9wb29sLnJlbGVhc2UodGhpcyk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY2hpbGQud29ybGQub25FbnRpdHlEaXNwb3NlZCh0aGlzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjaGlsZC5hbGl2ZSA9IGZhbHNlO1xuICAgICAgICAgIGNoaWxkLndvcmxkLnF1ZXVlRW50aXR5RGlzcG9zYWwodGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcblxuICBNaXhpbi50YWdDb21wb25lbnRzID0gW107XG5cbiAgcmV0dXJuIE1peGluO1xufVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IEVudGl0eU1peGluIH0gZnJvbSBcIi4uL0VudGl0eU1peGluLmpzXCI7XG5pbXBvcnQge1xuICBPYmplY3QzRCxcbiAgU2NlbmUsXG4gIEdyb3VwLFxuICBNZXNoLFxuICBTa2lubmVkTWVzaCxcbiAgQm9uZSxcbiAgSW5zdGFuY2VkTWVzaCxcbiAgTE9ELFxuICBMaW5lLFxuICBMaW5lU2VnbWVudHMsXG4gIExpbmVMb29wLFxuICBTcHJpdGUsXG4gIFBvaW50cyxcbiAgQXVkaW8sXG4gIEF1ZGlvTGlzdGVuZXIsXG4gIFBvc2l0aW9uYWxBdWRpbyxcbiAgQXJyYXlDYW1lcmEsXG4gIENhbWVyYSxcbiAgQ3ViZUNhbWVyYSxcbiAgT3J0aG9ncmFwaGljQ2FtZXJhLFxuICBQZXJzcGVjdGl2ZUNhbWVyYSxcbiAgQW1iaWVudExpZ2h0LFxuICBMaWdodCxcbiAgTGlnaHRQcm9iZSxcbiAgRGlyZWN0aW9uYWxMaWdodCxcbiAgSGVtaXNwaGVyZUxpZ2h0LFxuICBIZW1pc3BoZXJlTGlnaHRQcm9iZSxcbiAgUG9pbnRMaWdodCxcbiAgUmVjdEFyZWFMaWdodCxcbiAgU3BvdExpZ2h0LFxuICBJbW1lZGlhdGVSZW5kZXJPYmplY3QsXG4gIEFycm93SGVscGVyLFxuICBBeGVzSGVscGVyLFxuICBCb3gzSGVscGVyLFxuICBCb3hIZWxwZXIsXG4gIENhbWVyYUhlbHBlcixcbiAgRGlyZWN0aW9uYWxMaWdodEhlbHBlcixcbiAgR3JpZEhlbHBlcixcbiAgSGVtaXNwaGVyZUxpZ2h0SGVscGVyLFxuICBQbGFuZUhlbHBlcixcbiAgUG9pbnRMaWdodEhlbHBlcixcbiAgUG9sYXJHcmlkSGVscGVyLFxuICBTa2VsZXRvbkhlbHBlcixcbiAgU3BvdExpZ2h0SGVscGVyLFxufSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIE9iamVjdDNEVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgU2NlbmVUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBHcm91cFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIE1lc2hUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBTa2lubmVkTWVzaFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEJvbmVUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBJbnN0YW5jZWRNZXNoVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTE9EVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTGluZVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIExpbmVMb29wVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTGluZVNlZ21lbnRzVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgUG9pbnRzVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgU3ByaXRlVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQXVkaW9UYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBBdWRpb0xpc3RlbmVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgUG9zaXRpb25hbEF1ZGlvVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQ2FtZXJhVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgUGVyc3BlY3RpdmVDYW1lcmFUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBPcnRob2dyYXBoaWNDYW1lcmFUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBBcnJheUNhbWVyYVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEN1YmVDYW1lcmFUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBMaWdodFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIExpZ2h0UHJvYmVUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBBbWJpZW50TGlnaHRUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBEaXJlY3Rpb25hbExpZ2h0VGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgSGVtaXNwaGVyZUxpZ2h0VGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgSGVtaXNwaGVyZUxpZ2h0UHJvYmVUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBQb2ludExpZ2h0VGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgUmVjdEFyZWFMaWdodFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIFNwb3RMaWdodFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEltbWVkaWF0ZVJlbmRlck9iamVjdFRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEhlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEFycm93SGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQXhlc0hlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEJveDNIZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBCb3hIZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBDYW1lcmFIZWxwZXJUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgR3JpZEhlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIEhlbWlzcGhlcmVMaWdodEhlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIFBsYW5lSGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgUG9pbnRMaWdodEhlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIFBvbGFyR3JpZEhlbHBlclRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIFNrZWxldG9uSGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgU3BvdExpZ2h0SGVscGVyVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5cbmV4cG9ydCBjbGFzcyBPYmplY3QzREVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKE9iamVjdDNEKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgc3VwZXIod29ybGQpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgfVxufVxuXG5PYmplY3QzREVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnXTtcblxuZXhwb3J0IGNsYXNzIFNjZW5lRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oU2NlbmUpIHtcbiAgY29uc3RydWN0b3Iod29ybGQpIHtcbiAgICBzdXBlcih3b3JsZCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFNjZW5lVGFnKTtcbiAgfVxufVxuXG5TY2VuZUVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBTY2VuZVRhZ107XG5cbmV4cG9ydCBjbGFzcyBHcm91cEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEdyb3VwKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgc3VwZXIod29ybGQpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChHcm91cFRhZyk7XG4gIH1cbn1cblxuR3JvdXBFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgR3JvdXBUYWddO1xuXG5leHBvcnQgY2xhc3MgTWVzaEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKE1lc2gpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChNZXNoVGFnKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLndvcmxkLCB0aGlzLmdlb21ldHJ5LCB0aGlzLm1hdGVyaWFsKS5jb3B5KFxuICAgICAgdGhpc1xuICAgICk7XG4gIH1cbn1cblxuTWVzaEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBNZXNoVGFnXTtcblxuZXhwb3J0IGNsYXNzIFNraW5uZWRNZXNoRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oU2tpbm5lZE1lc2gpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChNZXNoVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChTa2lubmVkTWVzaFRhZyk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy53b3JsZCwgdGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCkuY29weShcbiAgICAgIHRoaXNcbiAgICApO1xuICB9XG59XG5cblNraW5uZWRNZXNoRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIE1lc2hUYWcsIFNraW5uZWRNZXNoVGFnXTtcblxuZXhwb3J0IGNsYXNzIEJvbmVFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihCb25lKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgc3VwZXIod29ybGQpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChCb25lVGFnKTtcbiAgfVxufVxuXG5Cb25lRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIEJvbmVUYWddO1xuXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VkTWVzaEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEluc3RhbmNlZE1lc2gpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChNZXNoVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChJbnN0YW5jZWRNZXNoVGFnKTtcbiAgfVxuXG4gIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3Rvcih0aGlzLndvcmxkLCB0aGlzLmdlb21ldHJ5LCB0aGlzLm1hdGVyaWFsKS5jb3B5KFxuICAgICAgdGhpc1xuICAgICk7XG4gIH1cbn1cblxuSW5zdGFuY2VkTWVzaEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBNZXNoVGFnLCBJbnN0YW5jZWRNZXNoVGFnXTtcblxuZXhwb3J0IGNsYXNzIExPREVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKExPRCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCkge1xuICAgIHN1cGVyKHdvcmxkKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTE9EVGFnKTtcbiAgfVxufVxuXG5MT0RFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTE9EVGFnXTtcblxuZXhwb3J0IGNsYXNzIExpbmVFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihMaW5lKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICBzdXBlcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVRhZyk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy53b3JsZCwgdGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCkuY29weShcbiAgICAgIHRoaXNcbiAgICApO1xuICB9XG59XG5cbkxpbmVFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTGluZVRhZ107XG5cbmV4cG9ydCBjbGFzcyBMaW5lTG9vcEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKExpbmVMb29wKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpIHtcbiAgICBzdXBlcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZUxvb3BUYWcpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMud29ybGQsIHRoaXMuZ2VvbWV0cnksIHRoaXMubWF0ZXJpYWwpLmNvcHkoXG4gICAgICB0aGlzXG4gICAgKTtcbiAgfVxufVxuXG5MaW5lTG9vcEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaW5lVGFnLCBMaW5lTG9vcFRhZ107XG5cbmV4cG9ydCBjbGFzcyBMaW5lU2VnbWVudHNFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihMaW5lU2VnbWVudHMpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lU2VnbWVudHNUYWcpO1xuICB9XG5cbiAgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMud29ybGQsIHRoaXMuZ2VvbWV0cnksIHRoaXMubWF0ZXJpYWwpLmNvcHkoXG4gICAgICB0aGlzXG4gICAgKTtcbiAgfVxufVxuXG5MaW5lU2VnbWVudHNFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTGluZVRhZywgTGluZVNlZ21lbnRzVGFnXTtcblxuZXhwb3J0IGNsYXNzIFBvaW50c0VudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFBvaW50cykge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgZ2VvbWV0cnksIG1hdGVyaWFsKSB7XG4gICAgc3VwZXIod29ybGQsIGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFBvaW50c1RhZyk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy53b3JsZCwgdGhpcy5nZW9tZXRyeSwgdGhpcy5tYXRlcmlhbCkuY29weShcbiAgICAgIHRoaXNcbiAgICApO1xuICB9XG59XG5cblBvaW50c0VudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBQb2ludHNUYWddO1xuXG5leHBvcnQgY2xhc3MgU3ByaXRlRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oU3ByaXRlKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBtYXRlcmlhbCkge1xuICAgIHN1cGVyKHdvcmxkLCBtYXRlcmlhbCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFNwcml0ZVRhZyk7XG4gIH1cblxuICBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IodGhpcy53b3JsZCwgdGhpcy5tYXRlcmlhbCkuY29weSh0aGlzKTtcbiAgfVxufVxuXG5TcHJpdGVFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgU3ByaXRlVGFnXTtcblxuZXhwb3J0IGNsYXNzIEF1ZGlvRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oQXVkaW8pIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGxpc3RlbmVyKSB7XG4gICAgc3VwZXIod29ybGQsIGxpc3RlbmVyKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQXVkaW9UYWcpO1xuICB9XG59XG5cbkF1ZGlvRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIEF1ZGlvVGFnXTtcblxuZXhwb3J0IGNsYXNzIEF1ZGlvTGlzdGVuZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihBdWRpb0xpc3RlbmVyKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkKSB7XG4gICAgc3VwZXIod29ybGQpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChBdWRpb0xpc3RlbmVyVGFnKTtcbiAgfVxufVxuXG5BdWRpb0xpc3RlbmVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIEF1ZGlvTGlzdGVuZXJUYWddO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb25hbEF1ZGlvRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oUG9zaXRpb25hbEF1ZGlvKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBsaXN0ZW5lcikge1xuICAgIHN1cGVyKHdvcmxkLCBsaXN0ZW5lcik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEF1ZGlvVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChQb3NpdGlvbmFsQXVkaW9UYWcpO1xuICB9XG59XG5cblBvc2l0aW9uYWxBdWRpb0VudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgQXVkaW9UYWcsXG4gIFBvc2l0aW9uYWxBdWRpb1RhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihDYW1lcmEpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpIHtcbiAgICBzdXBlcih3b3JsZCwgZm92LCBhc3BlY3QsIG5lYXIsIGZhcik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KENhbWVyYVRhZyk7XG4gIH1cbn1cblxuQ2FtZXJhRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIENhbWVyYVRhZ107XG5cbmV4cG9ydCBjbGFzcyBQZXJzcGVjdGl2ZUNhbWVyYUVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFBlcnNwZWN0aXZlQ2FtZXJhKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBmb3YsIGFzcGVjdCwgbmVhciwgZmFyKSB7XG4gICAgc3VwZXIod29ybGQsIGZvdiwgYXNwZWN0LCBuZWFyLCBmYXIpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChDYW1lcmFUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFBlcnNwZWN0aXZlQ2FtZXJhVGFnKTtcbiAgfVxufVxuXG5QZXJzcGVjdGl2ZUNhbWVyYUVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgQ2FtZXJhVGFnLFxuICBQZXJzcGVjdGl2ZUNhbWVyYVRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBPcnRob2dyYXBoaWNDYW1lcmFFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihPcnRob2dyYXBoaWNDYW1lcmEpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgbmVhciwgZmFyKSB7XG4gICAgc3VwZXIod29ybGQsIGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgbmVhciwgZmFyKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQ2FtZXJhVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPcnRob2dyYXBoaWNDYW1lcmFUYWcpO1xuICB9XG59XG5cbk9ydGhvZ3JhcGhpY0NhbWVyYUVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgQ2FtZXJhVGFnLFxuICBPcnRob2dyYXBoaWNDYW1lcmFUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgQXJyYXlDYW1lcmFFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihBcnJheUNhbWVyYSkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgYXJyYXkpIHtcbiAgICBzdXBlcih3b3JsZCwgYXJyYXkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChDYW1lcmFUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFBlcnNwZWN0aXZlQ2FtZXJhVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChBcnJheUNhbWVyYVRhZyk7XG4gIH1cbn1cblxuQXJyYXlDYW1lcmFFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIENhbWVyYVRhZyxcbiAgUGVyc3BlY3RpdmVDYW1lcmFUYWcsXG4gIEFycmF5Q2FtZXJhVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIEN1YmVDYW1lcmFFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihDdWJlQ2FtZXJhKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBuZWFyLCBmYXIsIGN1YmVSZXNvbHV0aW9uLCBvcHRpb25zKSB7XG4gICAgc3VwZXIod29ybGQsIG5lYXIsIGZhciwgY3ViZVJlc29sdXRpb24sIG9wdGlvbnMpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChDdWJlQ2FtZXJhVGFnKTtcbiAgfVxufVxuXG5DdWJlQ2FtZXJhRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIEN1YmVDYW1lcmFUYWddO1xuXG5leHBvcnQgY2xhc3MgTGlnaHRFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihMaWdodCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgY29sb3IsIGludGVuc2l0eSkge1xuICAgIHN1cGVyKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5KTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGlnaHRUYWcpO1xuICB9XG59XG5cbkxpZ2h0RW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIExpZ2h0VGFnXTtcblxuZXhwb3J0IGNsYXNzIExpZ2h0UHJvYmVFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihMaWdodFByb2JlKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBzaCwgaW50ZW5zaXR5KSB7XG4gICAgc3VwZXIod29ybGQsIHNoLCBpbnRlbnNpdHkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGlnaHRQcm9iZVRhZyk7XG4gIH1cbn1cbkxpZ2h0UHJvYmVFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTGlnaHRUYWcsIExpZ2h0UHJvYmVUYWddO1xuXG5leHBvcnQgY2xhc3MgQW1iaWVudExpZ2h0RW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oQW1iaWVudExpZ2h0KSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5KSB7XG4gICAgc3VwZXIod29ybGQsIGNvbG9yLCBpbnRlbnNpdHkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQW1iaWVudExpZ2h0VGFnKTtcbiAgfVxufVxuXG5BbWJpZW50TGlnaHRFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTGlnaHRUYWcsIEFtYmllbnRMaWdodFRhZ107XG5cbmV4cG9ydCBjbGFzcyBEaXJlY3Rpb25hbExpZ2h0RW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oRGlyZWN0aW9uYWxMaWdodCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgY29sb3IsIGludGVuc2l0eSkge1xuICAgIHN1cGVyKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5KTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGlnaHRUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KERpcmVjdGlvbmFsTGlnaHRUYWcpO1xuICB9XG59XG5cbkRpcmVjdGlvbmFsTGlnaHRFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIExpZ2h0VGFnLFxuICBEaXJlY3Rpb25hbExpZ2h0VGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIEhlbWlzcGhlcmVMaWdodEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEhlbWlzcGhlcmVMaWdodCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgc2t5Q29sb3IsIGdyb3VuZENvbG9yLCBpbnRlbnNpdHkpIHtcbiAgICBzdXBlcih3b3JsZCwgc2t5Q29sb3IsIGdyb3VuZENvbG9yLCBpbnRlbnNpdHkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVtaXNwaGVyZUxpZ2h0VGFnKTtcbiAgfVxufVxuXG5IZW1pc3BoZXJlTGlnaHRFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIExpZ2h0VGFnLFxuICBIZW1pc3BoZXJlTGlnaHRUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgSGVtaXNwaGVyZUxpZ2h0UHJvYmVFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihcbiAgSGVtaXNwaGVyZUxpZ2h0UHJvYmVcbikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgc2t5Q29sb3IsIGdyb3VuZENvbG9yLCBpbnRlbnNpdHkpIHtcbiAgICBzdXBlcih3b3JsZCwgc2t5Q29sb3IsIGdyb3VuZENvbG9yLCBpbnRlbnNpdHkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGlnaHRQcm9iZVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVtaXNwaGVyZUxpZ2h0UHJvYmVUYWcpO1xuICB9XG59XG5cbkhlbWlzcGhlcmVMaWdodFByb2JlRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBMaWdodFRhZyxcbiAgTGlnaHRQcm9iZVRhZyxcbiAgSGVtaXNwaGVyZUxpZ2h0UHJvYmVUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgUG9pbnRMaWdodEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFBvaW50TGlnaHQpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGNvbG9yLCBpbnRlbnNpdHksIGRpc3RhbmNlLCBkZWNheSkge1xuICAgIHN1cGVyKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgZGVjYXkpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaWdodFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoUG9pbnRMaWdodFRhZyk7XG4gIH1cbn1cblxuUG9pbnRMaWdodEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaWdodFRhZywgUG9pbnRMaWdodFRhZ107XG5cbmV4cG9ydCBjbGFzcyBSZWN0QXJlYUxpZ2h0RW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oUmVjdEFyZWFMaWdodCkge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgY29sb3IsIGludGVuc2l0eSwgd2lkdGgsIGhlaWdodCkge1xuICAgIHN1cGVyKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGlnaHRUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFJlY3RBcmVhTGlnaHRUYWcpO1xuICB9XG59XG5cblJlY3RBcmVhTGlnaHRFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtPYmplY3QzRFRhZywgTGlnaHRUYWcsIFJlY3RBcmVhTGlnaHRUYWddO1xuXG5leHBvcnQgY2xhc3MgU3BvdExpZ2h0RW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oU3BvdExpZ2h0KSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgYW5nbGUsIHBlbnVtYnJhLCBkZWNheSkge1xuICAgIHN1cGVyKHdvcmxkLCBjb2xvciwgaW50ZW5zaXR5LCBkaXN0YW5jZSwgYW5nbGUsIHBlbnVtYnJhLCBkZWNheSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpZ2h0VGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChTcG90TGlnaHRUYWcpO1xuICB9XG59XG5cblNwb3RMaWdodEVudGl0eS50YWdDb21wb25lbnRzID0gW09iamVjdDNEVGFnLCBMaWdodFRhZywgU3BvdExpZ2h0VGFnXTtcblxuZXhwb3J0IGNsYXNzIEltbWVkaWF0ZVJlbmRlck9iamVjdEVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFxuICBJbW1lZGlhdGVSZW5kZXJPYmplY3Rcbikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgbWF0ZXJpYWwpIHtcbiAgICBzdXBlcih3b3JsZCwgbWF0ZXJpYWwpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChJbW1lZGlhdGVSZW5kZXJPYmplY3RUYWcpO1xuICB9XG59XG5cbkltbWVkaWF0ZVJlbmRlck9iamVjdEVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSW1tZWRpYXRlUmVuZGVyT2JqZWN0VGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIEFycm93SGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oQXJyb3dIZWxwZXIpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGRpciwgb3JpZ2luLCBsZW5ndGgsIGNvbG9yLCBoZWFkTGVuZ3RoLCBoZWFkV2lkdGgpIHtcbiAgICBzdXBlcih3b3JsZCwgZGlyLCBvcmlnaW4sIGxlbmd0aCwgY29sb3IsIGhlYWRMZW5ndGgsIGhlYWRXaWR0aCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoQXJyb3dIZWxwZXJUYWcpO1xuICB9XG59XG5cbkFycm93SGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbT2JqZWN0M0RUYWcsIEhlbHBlclRhZywgQXJyb3dIZWxwZXJUYWddO1xuXG5leHBvcnQgY2xhc3MgQXhlc0hlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEF4ZXNIZWxwZXIpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIHNpemUpIHtcbiAgICBzdXBlcih3b3JsZCwgc2l6ZSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVNlZ21lbnRzVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChBeGVzSGVscGVyVGFnKTtcbiAgfVxufVxuXG5BeGVzSGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBIZWxwZXJUYWcsXG4gIExpbmVUYWcsXG4gIExpbmVTZWdtZW50c1RhZyxcbiAgQXhlc0hlbHBlclRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBCb3gzSGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oQm94M0hlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgYm94LCBjb2xvcikge1xuICAgIHN1cGVyKHdvcmxkLCBib3gsIGNvbG9yKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lU2VnbWVudHNUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEJveDNIZWxwZXJUYWcpO1xuICB9XG59XG5cbkJveDNIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgTGluZVRhZyxcbiAgTGluZVNlZ21lbnRzVGFnLFxuICBCb3gzSGVscGVyVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIEJveEhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKEJveEhlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgb2JqZWN0LCBjb2xvcikge1xuICAgIHN1cGVyKHdvcmxkLCBvYmplY3QsIGNvbG9yKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lU2VnbWVudHNUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEJveEhlbHBlclRhZyk7XG4gIH1cbn1cblxuQm94SGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBIZWxwZXJUYWcsXG4gIExpbmVUYWcsXG4gIExpbmVTZWdtZW50c1RhZyxcbiAgQm94SGVscGVyVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIENhbWVyYUhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKENhbWVyYUhlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgY2FtZXJhKSB7XG4gICAgc3VwZXIod29ybGQsIGNhbWVyYSk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVNlZ21lbnRzVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChDYW1lcmFIZWxwZXJUYWcpO1xuICB9XG59XG5cbkNhbWVyYUhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBMaW5lVGFnLFxuICBMaW5lU2VnbWVudHNUYWcsXG4gIENhbWVyYUhlbHBlclRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBEaXJlY3Rpb25hbExpZ2h0SGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oXG4gIERpcmVjdGlvbmFsTGlnaHRIZWxwZXJcbikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgbGlnaHQsIHNpemUsIGNvbG9yKSB7XG4gICAgc3VwZXIod29ybGQsIGxpZ2h0LCBzaXplLCBjb2xvcik7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoRGlyZWN0aW9uYWxMaWdodEhlbHBlclRhZyk7XG4gIH1cbn1cblxuRGlyZWN0aW9uYWxMaWdodEhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBEaXJlY3Rpb25hbExpZ2h0SGVscGVyVGFnLFxuXTtcblxuZXhwb3J0IGNsYXNzIEdyaWRIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihHcmlkSGVscGVyKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBzaXplLCBkaXZpc2lvbnMsIGNvbG9yMSwgY29sb3IyKSB7XG4gICAgc3VwZXIod29ybGQsIHNpemUsIGRpdmlzaW9ucywgY29sb3IxLCBjb2xvcjIpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVTZWdtZW50c1RhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoR3JpZEhlbHBlclRhZyk7XG4gIH1cbn1cblxuR3JpZEhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBMaW5lVGFnLFxuICBMaW5lU2VnbWVudHNUYWcsXG4gIEdyaWRIZWxwZXJUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgSGVtaXNwaGVyZUxpZ2h0SGVscGVyRW50aXR5IGV4dGVuZHMgRW50aXR5TWl4aW4oXG4gIEhlbWlzcGhlcmVMaWdodEhlbHBlclxuKSB7XG4gIGNvbnN0cnVjdG9yKHdvcmxkLCBsaWdodCwgc2l6ZSwgY29sb3IpIHtcbiAgICBzdXBlcih3b3JsZCwgbGlnaHQsIHNpemUsIGNvbG9yKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZW1pc3BoZXJlTGlnaHRIZWxwZXJUYWcpO1xuICB9XG59XG5cbkhlbWlzcGhlcmVMaWdodEhlbHBlckVudGl0eS50YWdDb21wb25lbnRzID0gW1xuICBPYmplY3QzRFRhZyxcbiAgSGVscGVyVGFnLFxuICBIZW1pc3BoZXJlTGlnaHRIZWxwZXJUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgUGxhbmVIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihQbGFuZUhlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgcGxhbmUsIHNpemUsIGhleCkge1xuICAgIHN1cGVyKHdvcmxkLCBwbGFuZSwgc2l6ZSwgaGV4KTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRFRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoSGVscGVyVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChMaW5lVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChQbGFuZUhlbHBlclRhZyk7XG4gIH1cbn1cblxuUGxhbmVIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgTGluZVRhZyxcbiAgUGxhbmVIZWxwZXJUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgUG9pbnRMaWdodEhlbHBlckVudGl0eSBleHRlbmRzIEVudGl0eU1peGluKFBvaW50TGlnaHRIZWxwZXIpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGxpZ2h0LCBzcGhlcmVTaXplLCBjb2xvcikge1xuICAgIHN1cGVyKHdvcmxkLCBsaWdodCwgc3BoZXJlU2l6ZSwgY29sb3IpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFBvaW50TGlnaHRIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE1lc2hUYWcpO1xuICB9XG59XG5cblBvaW50TGlnaHRIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgUG9pbnRMaWdodEhlbHBlclRhZyxcbiAgTWVzaFRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBQb2xhckdyaWRIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihQb2xhckdyaWRIZWxwZXIpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIHJhZGl1cywgcmFkaWFscywgY2lyY2xlcywgZGl2aXNpb25zLCBjb2xvcjEsIGNvbG9yMikge1xuICAgIHN1cGVyKHdvcmxkLCByYWRpdXMsIHJhZGlhbHMsIGNpcmNsZXMsIGRpdmlzaW9ucywgY29sb3IxLCBjb2xvcjIpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KExpbmVTZWdtZW50c1RhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoUG9sYXJHcmlkSGVscGVyVGFnKTtcbiAgfVxufVxuXG5Qb2xhckdyaWRIZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgTGluZVRhZyxcbiAgTGluZVNlZ21lbnRzVGFnLFxuICBQb2xhckdyaWRIZWxwZXJUYWcsXG5dO1xuXG5leHBvcnQgY2xhc3MgU2tlbGV0b25IZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihTa2VsZXRvbkhlbHBlcikge1xuICBjb25zdHJ1Y3Rvcih3b3JsZCwgb2JqZWN0KSB7XG4gICAgc3VwZXIod29ybGQsIG9iamVjdCk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KEhlbHBlclRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVRhZyk7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoTGluZVNlZ21lbnRzVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChTa2VsZXRvbkhlbHBlclRhZyk7XG4gIH1cbn1cblxuU2tlbGV0b25IZWxwZXJFbnRpdHkudGFnQ29tcG9uZW50cyA9IFtcbiAgT2JqZWN0M0RUYWcsXG4gIEhlbHBlclRhZyxcbiAgTGluZVRhZyxcbiAgTGluZVNlZ21lbnRzVGFnLFxuICBTa2VsZXRvbkhlbHBlclRhZyxcbl07XG5cbmV4cG9ydCBjbGFzcyBTcG90TGlnaHRIZWxwZXJFbnRpdHkgZXh0ZW5kcyBFbnRpdHlNaXhpbihTcG90TGlnaHRIZWxwZXIpIHtcbiAgY29uc3RydWN0b3Iod29ybGQsIGxpZ2h0LCBjb2xvcikge1xuICAgIHN1cGVyKHdvcmxkLCBsaWdodCwgY29sb3IpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEVGFnKTtcbiAgICB0aGlzLmFkZENvbXBvbmVudChIZWxwZXJUYWcpO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KFNwb3RMaWdodEhlbHBlclRhZyk7XG4gIH1cbn1cblxuU3BvdExpZ2h0SGVscGVyRW50aXR5LnRhZ0NvbXBvbmVudHMgPSBbXG4gIE9iamVjdDNEVGFnLFxuICBIZWxwZXJUYWcsXG4gIFNwb3RMaWdodEhlbHBlclRhZyxcbl07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIFN5c3RlbVN0YXRlQ29tcG9uZW50LCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgU3RlcmVvUGhvdG9TcGhlcmUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9TdGVyZW9QaG90b1NwaGVyZS5qc1wiO1xuaW1wb3J0IHtcbiAgQm94QnVmZmVyR2VvbWV0cnksXG4gIE1lc2hCYXNpY01hdGVyaWFsLFxuICBNZXNoLFxuICBUZXh0dXJlLFxuICBJbWFnZUxvYWRlclxufSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IE9iamVjdDNEVGFnIH0gZnJvbSBcIi4uL2VudGl0aWVzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTdGVyZW9QaG90b1NwaGVyZVN0YXRlIGV4dGVuZHMgU3lzdGVtU3RhdGVDb21wb25lbnQge31cblxuU3RlcmVvUGhvdG9TcGhlcmVTdGF0ZS5zY2hlbWEgPSB7XG4gIHBob3RvU3BoZXJlTDogeyB0eXBlOiBPYmplY3QgfSxcbiAgcGhvdG9TcGhlcmVSOiB7IHR5cGU6IE9iamVjdCB9XG59O1xuXG5leHBvcnQgY2xhc3MgU3RlcmVvUGhvdG9TcGhlcmVTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMud29ybGQucmVnaXN0ZXJDb21wb25lbnQoU3RlcmVvUGhvdG9TcGhlcmVTdGF0ZSwgZmFsc2UpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGNvbnNvbGUubG9nKGVudGl0eSk7XG5cbiAgICAgIGxldCBwaG90b1NwaGVyZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU3RlcmVvUGhvdG9TcGhlcmUpO1xuXG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgQm94QnVmZmVyR2VvbWV0cnkoMTAwLCAxMDAsIDEwMCk7XG4gICAgICBnZW9tZXRyeS5zY2FsZSgxLCAxLCAtMSk7XG5cbiAgICAgIGxldCB0ZXh0dXJlcyA9IGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShwaG90b1NwaGVyZS5zcmMsIDEyKTtcblxuICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHBob3RvU3BoZXJlTCA9IG5ldyBNZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgcGhvdG9TcGhlcmVMLmxheWVycy5zZXQoMSk7XG4gICAgICBlbnRpdHkuYWRkKHBob3RvU3BoZXJlTCk7XG5cbiAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICBtYXRlcmlhbHNSLnB1c2gobmV3IE1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBwaG90b1NwaGVyZVIgPSBuZXcgTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICBwaG90b1NwaGVyZVIubGF5ZXJzLnNldCgyKTtcbiAgICAgIGVudGl0eS5hZGQocGhvdG9TcGhlcmVSKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChTdGVyZW9QaG90b1NwaGVyZVN0YXRlLCB7XG4gICAgICAgIHBob3RvU3BoZXJlTCxcbiAgICAgICAgcGhvdG9TcGhlcmVSXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IEltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5TdGVyZW9QaG90b1NwaGVyZVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtTdGVyZW9QaG90b1NwaGVyZSwgT2JqZWN0M0RUYWcsIE5vdChTdGVyZW9QaG90b1NwaGVyZVN0YXRlKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IENsb2NrLCBXZWJHTFJlbmRlcmVyIGFzIFRocmVlV2ViR0xSZW5kZXJlciB9IGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgVGhyZWVXb3JsZCB9IGZyb20gXCIuL1RocmVlV29ybGRcIjtcbmltcG9ydCB7IFNjZW5lRW50aXR5LCBQZXJzcGVjdGl2ZUNhbWVyYUVudGl0eSB9IGZyb20gXCIuL2VudGl0aWVzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyIH0gZnJvbSBcIi4vY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzXCI7XG5pbXBvcnQgeyBSZW5kZXJQYXNzIH0gZnJvbSBcIi4vY29tcG9uZW50cy9SZW5kZXJQYXNzLmpzXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKHdvcmxkID0gbmV3IFRocmVlV29ybGQoKSwgb3B0aW9ucykge1xuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgb3B0aW9ucyk7XG5cbiAgd29ybGRcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoV2ViR0xSZW5kZXJlciwgZmFsc2UpXG4gICAgLnJlZ2lzdGVyRW50aXR5VHlwZShTY2VuZUVudGl0eSlcbiAgICAucmVnaXN0ZXJFbnRpdHlUeXBlKFBlcnNwZWN0aXZlQ2FtZXJhRW50aXR5LCBmYWxzZSlcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoUmVuZGVyUGFzcywgZmFsc2UpXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFdlYkdMUmVuZGVyZXJTeXN0ZW0sIHsgcHJpb3JpdHk6IDEgfSk7XG5cbiAgbGV0IGFuaW1hdGlvbkxvb3AgPSBvcHRpb25zLmFuaW1hdGlvbkxvb3A7XG5cbiAgaWYgKCFhbmltYXRpb25Mb29wKSB7XG4gICAgY29uc3QgY2xvY2sgPSBuZXcgQ2xvY2soKTtcblxuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgY29uc3QgcmVuZGVyZXJPcHRpb25zID0gT2JqZWN0LmFzc2lnbihcbiAgICB7XG4gICAgICBhbnRpYWxpYXM6IHRydWVcbiAgICB9LFxuICAgIG9wdGlvbnMucmVuZGVyZXJcbiAgKTtcblxuICBjb25zdCByZW5kZXJlciA9IG5ldyBUaHJlZVdlYkdMUmVuZGVyZXIocmVuZGVyZXJPcHRpb25zKTtcbiAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gIHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoYW5pbWF0aW9uTG9vcCk7XG5cbiAgY29uc3QgY2FudmFzID0gb3B0aW9ucy5yZW5kZXJlciAmJiBvcHRpb25zLnJlbmRlcmVyLmNhbnZhcztcbiAgY29uc3Qgd2lkdGggPSBjYW52YXMgPyBjYW52YXMucGFyZW50RWxlbWVudC5vZmZzZXRXaWR0aCA6IHdpbmRvdy5pbm5lcldpZHRoO1xuICBjb25zdCBoZWlnaHQgPSBjYW52YXNcbiAgICA/IGNhbnZhcy5wYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodFxuICAgIDogd2luZG93LmlubmVySGVpZ2h0O1xuXG4gIHJlbmRlcmVyLnNldFNpemUod2lkdGgsIGhlaWdodCwgISFjYW52YXMpO1xuXG4gIGlmICghY2FudmFzKSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcbiAgfVxuXG4gIGxldCBzY2VuZSA9IHdvcmxkLmFkZEVudGl0eShuZXcgU2NlbmVFbnRpdHkod29ybGQpKTtcblxuICBjb25zdCBjYW1lcmEgPSBuZXcgUGVyc3BlY3RpdmVDYW1lcmFFbnRpdHkoXG4gICAgd29ybGQsXG4gICAgOTAsXG4gICAgd2lkdGggLyBoZWlnaHQsXG4gICAgMC4xLFxuICAgIDEwMFxuICApO1xuXG4gIHNjZW5lLmFkZChjYW1lcmEpO1xuXG4gIGxldCByZW5kZXJlckVudGl0eSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgcmVuZGVyZXIsXG4gICAgc2NlbmUsXG4gICAgY2FtZXJhLFxuICAgIHVwZGF0ZUNhbnZhc1N0eWxlOiAhIWNhbnZhc1xuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIHJlbmRlcmVyOiByZW5kZXJlckVudGl0eVxuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJUaHJlZVdlYkdMUmVuZGVyZXIiXSwibWFwcGluZ3MiOiI7OztBQUVPLE1BQU0sVUFBVSxTQUFTLEtBQUssQ0FBQztFQUNwQyxXQUFXLEdBQUc7SUFDWixLQUFLLEVBQUUsQ0FBQzs7SUFFUixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztJQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQztHQUN2Qjs7RUFFRCxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFO0lBQ3pDLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7TUFDckMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLGNBQWMsRUFBRSxVQUFVLENBQUMsSUFBSSxDQUFDLHFC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

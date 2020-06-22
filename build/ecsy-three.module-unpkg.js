import { Component, Types, _Entity, TagComponent, World, createType, copyCopyable, cloneClonable, System, Not, SystemStateComponent } from 'https://unpkg.com/ecsy@0.2.6/build/ecsy.module.js';
export { Types } from 'https://unpkg.com/ecsy@0.2.6/build/ecsy.module.js';
import { Vector3, WebGLRenderer as WebGLRenderer$1, Clock, Scene as Scene$1, PerspectiveCamera, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, AnimationMixer, LoopOnce, Object3D, PositionalAudio, AudioListener, AudioLoader } from 'https://unpkg.com/three@0.117.1/build/three.module.js';
import { VRButton } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/ARButton.js';
import { GLTFLoader as GLTFLoader$1 } from 'https://unpkg.com/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'https://unpkg.com/troika-3d-text@0.28.1/dist/textmesh-standalone.esm.js?module';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/XRControllerModelFactory.js';

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

class Active extends TagComponent {}

class Animation extends Component {}
Animation.schema = {
  animations: { default: [], type: Types.Array },
  duration: { default: -1, type: Types.Number }
};

class Camera extends Component {}

Camera.schema = {
  fov: { default: 45, type: Types.Number },
  aspect: { default: 1, type: Types.Number },
  near: { default: 0.1, type: Types.Number },
  far: { default: 1000, type: Types.Number },
  layers: { default: 0, type: Types.Number },
  handleResize: { default: true, type: Types.Boolean }
};

class CameraRig extends Component {}
CameraRig.schema = {
  leftHand: { default: null, type: Types.Object },
  rightHand: { default: null, type: Types.Object },
  camera: { default: null, type: Types.Object }
};

class Colliding extends Component {}
Colliding.schema = {
  collidingWith: { default: [], type: Types.Array },
  collidingFrame: { default: 0, type: Types.Number }
};

class CollisionStart extends TagComponent {}

class CollisionStop extends TagComponent {}

class Draggable extends Component {}
Draggable.schema = {
  value: { default: false, type: Types.Boolean }
};

class Dragging extends TagComponent {}

class Geometry extends Component {}
Geometry.schema = {
  primitive: { default: "box", type: Types.String },
  width: { default: 0, type: Types.Number },
  height: { default: 0, type: Types.Number },
  depth: { default: 0, type: Types.Number }
};

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

class Parent extends Component {}
Parent.schema = {
  value: { default: null, type: Types.Object }
};

class ParentObject3D extends Component {}
ParentObject3D.schema = {
  value: { default: null, type: Types.Object },
};

class Play extends TagComponent {}

class Position extends Component {}

Position.schema = {
  value: { default: new Vector3(), type: Vector3Type }
};

class RenderPass extends Component {}

RenderPass.schema = {
  scene: { default: null, type: Types.Object },
  camera: { default: null, type: Types.Object }
};

class RigidBody extends Component {}
RigidBody.schema = {
  object: { default: null, type: Types.Object },
  weight: { default: 0, type: Types.Number },
  restitution: { default: 1, type: Types.Number },
  friction: { default: 1, type: Types.Number },
  linearDamping: { default: 0, type: Types.Number },
  angularDamping: { default: 0, type: Types.Number },
  linearVelocity: { default: { x: 0, y: 0, z: 0 }, type: Types.Object }
};

class Rotation extends Component {}
Rotation.schema = {
  // @fixme
  rotation: { default: new Vector3(), type: Vector3Type }
};

class Scale extends Component {}
Scale.schema = {
  // @fixme
  value: { default: new Vector3(), type: Vector3Type }
};

class Scene extends Component {}
Scene.schema = {
  value: { default: null, type: Types.Object }
};

class Shape extends Component {}
Shape.schema = {
  primitive: { default: "", type: Types.String },
  width: { default: 0, type: Types.Number },
  height: { default: 0, type: Types.Number },
  depth: { default: 0, type: Types.Number },
  radius: { default: 0, type: Types.Number }
};

class SkyBox extends Component {}
SkyBox.schema = {
  texture: { default: null, type: Types.Object },
  type: { default: 0, type: Types.Number }
};

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

class Transform extends Component {}

Transform.schema = {
  position: { default: new Vector3(), type: Vector3Type },
  rotation: { default: new Vector3(), type: Vector3Type }
};

class Visible extends Component {}
Visible.schema = {
  value: { default: true, type: Types.Boolean }
};

class VRController extends Component {}
VRController.schema = {
  id: { default: 0, type: Types.Number },
  controller: { default: null, type: Types.Object }
};

class VRControllerBasicBehaviour extends Component {}
VRControllerBasicBehaviour.schema = {
  select: { default: null, type: Types.Object },
  selectstart: { default: null, type: Types.Object },
  selectend: { default: null, type: Types.Object },

  connected: { default: null, type: Types.Object },
  disconnected: { default: null, type: Types.Object },

  squeeze: { default: null, type: Types.Object },
  squeezestart: { default: null, type: Types.Object },
  squeezeend: { default: null, type: Types.Object }
};

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

class OnObject3DAdded extends Component {}
OnObject3DAdded.schema = {
  callback: { default: null, type: Types.Object }
};

class UpdateAspectOnResizeTag extends TagComponent {}

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

class OnObject3DAddedSystem extends System {
  execute() {
    const entities = this.queries.entities.added;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const component = entity.getComponent(OnObject3DAdded);
      component.callback(entity.getObject3D());
    }
  }
}

OnObject3DAddedSystem.queries = {
  entities: {
    components: [OnObject3DAdded, Object3DComponent],
    listen: {
      added: true
    }
  }
};

function initialize(world = new ECSYThreeWorld(), options) {
  if (!(world instanceof ECSYThreeWorld)) {
    throw new Error(
      "The provided 'world' paremeter is not an instance of 'ECSYThreeWorld'"
    );
  }

  world
    .registerSystem(UpdateAspectOnResizeSystem)
    .registerSystem(TransformSystem)
    .registerSystem(OnObject3DAddedSystem)
    .registerSystem(WebGLRendererSystem);

  world
    .registerComponent(OnObject3DAdded)
    .registerComponent(WebGLRenderer)
    .registerComponent(Scene)
    .registerComponent(Active)
    .registerComponent(CameraRig)
    .registerComponent(Parent)
    .registerComponent(Object3DComponent)
    .registerComponent(RenderPass)
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
  if (options.ar || options.vr) {
    cameraRig = world
      .createEntity()
      .addComponent(CameraRig)
      .addComponent(Parent, { value: scene })
      .addComponent(Active);
  } else {
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
      if (entity.hasComponent(Object3DComponent)) {
        if (component.append) {
          entity.getObject3D().add(gltf.scene);
        }
      } else {
        entity
          .addComponent(GLTFModel, { value: gltf })
          .addObject3DComponent(gltf.scene, component.parent);
      }

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

var controllerModelFactory = new XRControllerModelFactory();

class VRControllerSystem extends System {
  init() {
    this.world
      .registerComponent(VRController)
      .registerComponent(VRControllerBasicBehaviour)
      .registerComponent(ControllerConnected);
  }

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
      controllerGrip.name = "model";
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

class AnimationMixerComponent extends Component {}
AnimationMixerComponent.schema = {
  value: { default: 0, type: Types.Number }
};

class AnimationActionsComponent extends Component {}
AnimationActionsComponent.schema = {
  animations: { default: [], type: Types.Array },
  duration: { default: 0, type: Types.Number }
};

class AnimationSystem extends System {
  init() {
    this.world
      .registerComponent(AnimationMixerComponent)
      .registerComponent(AnimationActionsComponent);
  }

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

export { Active, Animation, AnimationSystem, Camera, CameraRig, CameraTagComponent, Colliding, CollisionStart, CollisionStop, ControllerConnected, Draggable, Dragging, ECSYThreeWorld, GLTFLoader, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, InputState, InputSystem, MeshTagComponent, Object3DComponent, OnObject3DAdded, OnObject3DAddedSystem, Parent, ParentObject3D, Play, Position, RenderPass, RigidBody, Rotation, SDFTextSystem, Scale, Scene, SceneTagComponent, Shape, SkyBox, SkyBoxSystem, Sound, SoundSystem, Stop, Text, ThreeTypes, Transform, TransformSystem, UpdateAspectOnResizeSystem, UpdateAspectOnResizeTag, VRController, VRControllerBasicBehaviour, VRControllerSystem, Vector3Type, VisibilitySystem, Visible, WebGLRenderer, WebGLRendererContext, WebGLRendererSystem, initialize };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUtdW5wa2cuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL09iamVjdDNEQ29tcG9uZW50LmpzIiwiLi4vc3JjL2NvcmUvZW50aXR5LmpzIiwiLi4vc3JjL2NvcmUvT2JqZWN0M0RUYWdzLmpzIiwiLi4vc3JjL2NvcmUvZGVmYXVsdE9iamVjdDNESW5mbGF0b3IuanMiLCIuLi9zcmMvY29yZS93b3JsZC5qcyIsIi4uL3NyYy9jb3JlL1R5cGVzLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9BbmltYXRpb24uanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvQ2FtZXJhLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Db2xsaWRpbmcuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RhcnQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RvcC5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9EcmFnZ2FibGUuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvR2VvbWV0cnkuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvR0xURkxvYWRlci5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvSW5wdXRTdGF0ZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvUGFyZW50T2JqZWN0M0QuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvUGxheS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9SZW5kZXJQYXNzLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL1JpZ2lkQm9keS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9TY2FsZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9TY2VuZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9TaGFwZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvU291bmQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvU3RvcC5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9UZXh0LmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL1RyYW5zZm9ybS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9WaXNpYmxlLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL0NvbnRyb2xsZXJDb25uZWN0ZWQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvT25PYmplY3QzREFkZGVkLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL2luZGV4LmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvZXh0cmFzL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1VwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL09uT2JqZWN0M0RBZGRlZFN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvaW5pdGlhbGl6ZS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1NreUJveFN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1NERlRleHRTeXN0ZW0uanMiLCIuLi9zcmMvZXh0cmFzL3N5c3RlbXMvVlJDb250cm9sbGVyU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL0FuaW1hdGlvblN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9JbnB1dFN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvbGliL1Bvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMuanMiLCIuLi9zcmMvZXh0cmFzL3N5c3RlbXMvU291bmRTeXN0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBPYmplY3QzRENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5PYmplY3QzRENvbXBvbmVudC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgX0VudGl0eSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuL09iamVjdDNEQ29tcG9uZW50LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFQ1NZVGhyZWVFbnRpdHkgZXh0ZW5kcyBfRW50aXR5IHtcbiAgYWRkT2JqZWN0M0RDb21wb25lbnQob2JqLCBwYXJlbnRFbnRpdHkpIHtcbiAgICBvYmouZW50aXR5ID0gdGhpcztcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogb2JqIH0pO1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIud29ybGQub2JqZWN0M0RJbmZsYXRvci5pbmZsYXRlKHRoaXMsIG9iaik7XG4gICAgaWYgKHBhcmVudEVudGl0eSAmJiBwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgcGFyZW50RW50aXR5LmdldE9iamVjdDNEKCkuYWRkKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlT2JqZWN0M0RDb21wb25lbnQodW5wYXJlbnQgPSB0cnVlKSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5nZXRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHRydWUpLnZhbHVlO1xuICAgIGlmICh1bnBhcmVudCkge1xuICAgICAgLy8gVXNpbmcgXCJ0cnVlXCIgYXMgdGhlIGVudGl0eSBjb3VsZCBiZSByZW1vdmVkIHNvbWV3aGVyZSBlbHNlXG4gICAgICBvYmoucGFyZW50ICYmIG9iai5wYXJlbnQucmVtb3ZlKG9iaik7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KTtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLndvcmxkLm9iamVjdDNESW5mbGF0b3IuZGVmbGF0ZSh0aGlzLCBvYmopO1xuICAgIG9iai5lbnRpdHkgPSBudWxsO1xuICB9XG5cbiAgcmVtb3ZlKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgaWYgKHRoaXMuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgY29uc3Qgb2JqID0gdGhpcy5nZXRPYmplY3QzRCgpO1xuICAgICAgb2JqLnRyYXZlcnNlKG8gPT4ge1xuICAgICAgICBpZiAoby5lbnRpdHkpIHtcbiAgICAgICAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eShvLmVudGl0eSwgZm9yY2VJbW1lZGlhdGUpO1xuICAgICAgICB9XG4gICAgICAgIG8uZW50aXR5ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgb2JqLnBhcmVudCAmJiBvYmoucGFyZW50LnJlbW92ZShvYmopO1xuICAgIH1cbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eSh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cblxuICBnZXRPYmplY3QzRCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpLnZhbHVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU2NlbmVUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBDYW1lcmFUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBNZXNoVGFnQ29tcG9uZW50IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQge1xuICBNZXNoVGFnQ29tcG9uZW50LFxuICBTY2VuZVRhZ0NvbXBvbmVudCxcbiAgQ2FtZXJhVGFnQ29tcG9uZW50XG59IGZyb20gXCIuL09iamVjdDNEVGFncy5qc1wiO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgPSB7XG4gIGluZmxhdGU6IChlbnRpdHksIG9iaikgPT4ge1xuICAgIC8vIFRPRE8gc3VwcG9ydCBtb3JlIHRhZ3MgYW5kIHByb2JhYmx5IGEgd2F5IHRvIGFkZCB1c2VyIGRlZmluZWQgb25lc1xuICAgIGlmIChvYmouaXNNZXNoKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE1lc2hUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzU2NlbmUpIHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoU2NlbmVUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzQ2FtZXJhKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KENhbWVyYVRhZ0NvbXBvbmVudCk7XG4gICAgfVxuICB9LFxuICBkZWZsYXRlOiAoZW50aXR5LCBvYmopID0+IHtcbiAgICAvLyBUT0RPIHN1cHBvcnQgbW9yZSB0YWdzIGFuZCBwcm9iYWJseSBhIHdheSB0byBhZGQgdXNlciBkZWZpbmVkIG9uZXNcbiAgICBpZiAob2JqLmlzTWVzaCkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChNZXNoVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc1NjZW5lKSB7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFNjZW5lVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc0NhbWVyYSkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChDYW1lcmFUYWdDb21wb25lbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IEVDU1lUaHJlZUVudGl0eSB9IGZyb20gXCIuL2VudGl0eS5qc1wiO1xuaW1wb3J0IHsgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgfSBmcm9tIFwiLi9kZWZhdWx0T2JqZWN0M0RJbmZsYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlV29ybGQgZXh0ZW5kcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCB7IGVudGl0eUNsYXNzOiBFQ1NZVGhyZWVFbnRpdHkgfSwgb3B0aW9ucykpO1xuICAgIHRoaXMub2JqZWN0M0RJbmZsYXRvciA9IGRlZmF1bHRPYmplY3QzREluZmxhdG9yO1xuICB9XG59XG4iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBjcmVhdGVUeXBlLCBjb3B5Q29weWFibGUsIGNsb25lQ2xvbmFibGUgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY29uc3QgVmVjdG9yM1R5cGUgPSBjcmVhdGVUeXBlKHtcbiAgbmFtZTogXCJWZWN0b3IzXCIsXG4gIGRlZmF1bHQ6IG5ldyBWZWN0b3IzKCksXG4gIGNvcHk6IGNvcHlDb3B5YWJsZSxcbiAgY2xvbmU6IGNsb25lQ2xvbmFibGVcbn0pO1xuXG5leHBvcnQgY29uc3QgVGhyZWVUeXBlcyA9IHtcbiAgVmVjdG9yM1R5cGVcbn07XG5cbmV4cG9ydCB7IFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgQWN0aXZlIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7fVxuQW5pbWF0aW9uLnNjaGVtYSA9IHtcbiAgYW5pbWF0aW9uczogeyBkZWZhdWx0OiBbXSwgdHlwZTogVHlwZXMuQXJyYXkgfSxcbiAgZHVyYXRpb246IHsgZGVmYXVsdDogLTEsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmEgZXh0ZW5kcyBDb21wb25lbnQge31cblxuQ2FtZXJhLnNjaGVtYSA9IHtcbiAgZm92OiB7IGRlZmF1bHQ6IDQ1LCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgYXNwZWN0OiB7IGRlZmF1bHQ6IDEsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBuZWFyOiB7IGRlZmF1bHQ6IDAuMSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGZhcjogeyBkZWZhdWx0OiAxMDAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbGF5ZXJzOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFSaWcgZXh0ZW5kcyBDb21wb25lbnQge31cbkNhbWVyYVJpZy5zY2hlbWEgPSB7XG4gIGxlZnRIYW5kOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICByaWdodEhhbmQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGNhbWVyYTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgQ29sbGlkaW5nIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Db2xsaWRpbmcuc2NoZW1hID0ge1xuICBjb2xsaWRpbmdXaXRoOiB7IGRlZmF1bHQ6IFtdLCB0eXBlOiBUeXBlcy5BcnJheSB9LFxuICBjb2xsaWRpbmdGcmFtZTogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDb2xsaXNpb25TdGFydCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIENvbGxpc2lvblN0b3AgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5EcmFnZ2FibGUuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9XG59O1xuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBEcmFnZ2luZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBHZW9tZXRyeSBleHRlbmRzIENvbXBvbmVudCB7fVxuR2VvbWV0cnkuc2NoZW1hID0ge1xuICBwcmltaXRpdmU6IHsgZGVmYXVsdDogXCJib3hcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHdpZHRoOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBoZWlnaHQ6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGRlcHRoOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbkdMVEZMb2FkZXIuc2NoZW1hID0ge1xuICB1cmw6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHJlY2VpdmVTaGFkb3c6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgY2FzdFNoYWRvdzogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBlbnZNYXBPdmVycmlkZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgYXBwZW5kOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgb25Mb2FkZWQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHBhcmVudDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgR0xURk1vZGVsIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbkdMVEZNb2RlbC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dFN0YXRlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbklucHV0U3RhdGUuc2NoZW1hID0ge1xuICB2cmNvbnRyb2xsZXJzOiB7IGRlZmF1bHQ6IG5ldyBNYXAoKSwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGtleWJvYXJkOiB7IGRlZmF1bHQ6IHt9LCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgbW91c2U6IHsgZGVmYXVsdDoge30sIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBnYW1lcGFkczogeyBkZWZhdWx0OiB7fSwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFBhcmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuUGFyZW50LnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFBhcmVudE9iamVjdDNEIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5QYXJlbnRPYmplY3QzRC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgUGxheSBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uLy4uL2NvcmUvVHlwZXMuanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24gZXh0ZW5kcyBDb21wb25lbnQge31cblxuUG9zaXRpb24uc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFJlbmRlclBhc3MgZXh0ZW5kcyBDb21wb25lbnQge31cblxuUmVuZGVyUGFzcy5zY2hlbWEgPSB7XG4gIHNjZW5lOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBjYW1lcmE6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFJpZ2lkQm9keSBleHRlbmRzIENvbXBvbmVudCB7fVxuUmlnaWRCb2R5LnNjaGVtYSA9IHtcbiAgb2JqZWN0OiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICB3ZWlnaHQ6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIHJlc3RpdHV0aW9uOiB7IGRlZmF1bHQ6IDEsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBmcmljdGlvbjogeyBkZWZhdWx0OiAxLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbGluZWFyRGFtcGluZzogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgYW5ndWxhckRhbXBpbmc6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGxpbmVhclZlbG9jaXR5OiB7IGRlZmF1bHQ6IHsgeDogMCwgeTogMCwgejogMCB9LCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uLy4uL2NvcmUvVHlwZXMuanNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Sb3RhdGlvbi5zY2hlbWEgPSB7XG4gIC8vIEBmaXhtZVxuICByb3RhdGlvbjogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUaHJlZVR5cGVzIGZyb20gXCIuLi8uLi9jb3JlL1R5cGVzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FsZSBleHRlbmRzIENvbXBvbmVudCB7fVxuU2NhbGUuc2NoZW1hID0ge1xuICAvLyBAZml4bWVcbiAgdmFsdWU6IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb21wb25lbnQge31cblNjZW5lLnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNoYXBlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5TaGFwZS5zY2hlbWEgPSB7XG4gIHByaW1pdGl2ZTogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgd2lkdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGhlaWdodDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZGVwdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIHJhZGl1czogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Ta3lCb3guc2NoZW1hID0ge1xuICB0ZXh0dXJlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICB0eXBlOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBTb3VuZCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5Tb3VuZC5zY2hlbWEgPSB7XG4gIHNvdW5kOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICB1cmw6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH1cbn07XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFN0b3AgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIENvbXBvbmVudCB7fVxuVGV4dC5zY2hlbWEgPSB7XG4gIHRleHQ6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHRleHRBbGlnbjogeyBkZWZhdWx0OiBcImxlZnRcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInXVxuICBhbmNob3I6IHsgZGVmYXVsdDogXCJjZW50ZXJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICBiYXNlbGluZTogeyBkZWZhdWx0OiBcImNlbnRlclwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWyd0b3AnLCAnY2VudGVyJywgJ2JvdHRvbSddXG4gIGNvbG9yOiB7IGRlZmF1bHQ6IFwiI0ZGRlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgZm9udDogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy9cImh0dHBzOi8vY29kZS5jZG4ubW96aWxsYS5uZXQvZm9udHMvdHRmL1ppbGxhU2xhYi1TZW1pQm9sZC50dGZcIlxuICBmb250U2l6ZTogeyBkZWZhdWx0OiAwLjIsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsZXR0ZXJTcGFjaW5nOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsaW5lSGVpZ2h0OiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBtYXhXaWR0aDogeyBkZWZhdWx0OiBJbmZpbml0eSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIG92ZXJmbG93V3JhcDogeyBkZWZhdWx0OiBcIm5vcm1hbFwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWydub3JtYWwnLCAnYnJlYWstd29yZCddXG4gIHdoaXRlU3BhY2U6IHsgZGVmYXVsdDogXCJub3JtYWxcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbm9ybWFsJywgJ25vd3JhcCddXG4gIG9wYWNpdHk6IHsgZGVmYXVsdDogMSwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVGhyZWVUeXBlcyBmcm9tIFwiLi4vLi4vY29yZS9UeXBlcy5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0gZXh0ZW5kcyBDb21wb25lbnQge31cblxuVHJhbnNmb3JtLnNjaGVtYSA9IHtcbiAgcG9zaXRpb246IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSB9LFxuICByb3RhdGlvbjogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2libGUgZXh0ZW5kcyBDb21wb25lbnQge31cblZpc2libGUuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciBleHRlbmRzIENvbXBvbmVudCB7fVxuVlJDb250cm9sbGVyLnNjaGVtYSA9IHtcbiAgaWQ6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGNvbnRyb2xsZXI6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ciBleHRlbmRzIENvbXBvbmVudCB7fVxuVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIuc2NoZW1hID0ge1xuICBzZWxlY3Q6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHNlbGVjdHN0YXJ0OiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBzZWxlY3RlbmQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG5cbiAgY29ubmVjdGVkOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBkaXNjb25uZWN0ZWQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG5cbiAgc3F1ZWV6ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgc3F1ZWV6ZXN0YXJ0OiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBzcXVlZXplZW5kOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbldlYkdMUmVuZGVyZXIuc2NoZW1hID0ge1xuICB2cjogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBhcjogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBhbnRpYWxpYXM6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBhbmltYXRpb25Mb29wOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyQ29ubmVjdGVkIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIE9uT2JqZWN0M0RBZGRlZCBleHRlbmRzIENvbXBvbmVudCB7fVxuT25PYmplY3QzREFkZGVkLnNjaGVtYSA9IHtcbiAgY2FsbGJhY2s6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJleHBvcnQgeyBBY3RpdmUgfSBmcm9tIFwiLi9BY3RpdmUuanNcIjtcbmV4cG9ydCB7IEFuaW1hdGlvbiB9IGZyb20gXCIuL0FuaW1hdGlvbi5qc1wiO1xuZXhwb3J0IHsgQ2FtZXJhIH0gZnJvbSBcIi4vQ2FtZXJhLmpzXCI7XG5leHBvcnQgeyBDYW1lcmFSaWcgfSBmcm9tIFwiLi9DYW1lcmFSaWcuanNcIjtcbmV4cG9ydCB7IENvbGxpZGluZyB9IGZyb20gXCIuL0NvbGxpZGluZy5qc1wiO1xuZXhwb3J0IHsgQ29sbGlzaW9uU3RhcnQgfSBmcm9tIFwiLi9Db2xsaXNpb25TdGFydC5qc1wiO1xuZXhwb3J0IHsgQ29sbGlzaW9uU3RvcCB9IGZyb20gXCIuL0NvbGxpc2lvblN0b3AuanNcIjtcbmV4cG9ydCB7IERyYWdnYWJsZSB9IGZyb20gXCIuL0RyYWdnYWJsZS5qc1wiO1xuZXhwb3J0IHsgRHJhZ2dpbmcgfSBmcm9tIFwiLi9EcmFnZ2luZy5qc1wiO1xuZXhwb3J0IHsgR2VvbWV0cnkgfSBmcm9tIFwiLi9HZW9tZXRyeS5qc1wiO1xuZXhwb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCIuL0dMVEZMb2FkZXIuanNcIjtcbmV4cG9ydCB7IEdMVEZNb2RlbCB9IGZyb20gXCIuL0dMVEZNb2RlbC5qc1wiO1xuZXhwb3J0IHsgSW5wdXRTdGF0ZSB9IGZyb20gXCIuL0lucHV0U3RhdGUuanNcIjtcbmV4cG9ydCB7IFBhcmVudCB9IGZyb20gXCIuL1BhcmVudC5qc1wiO1xuZXhwb3J0IHsgUGFyZW50T2JqZWN0M0QgfSBmcm9tIFwiLi9QYXJlbnRPYmplY3QzRC5qc1wiO1xuZXhwb3J0IHsgUGxheSB9IGZyb20gXCIuL1BsYXkuanNcIjtcbmV4cG9ydCB7IFBvc2l0aW9uIH0gZnJvbSBcIi4vUG9zaXRpb24uanNcIjtcbmV4cG9ydCB7IFJlbmRlclBhc3MgfSBmcm9tIFwiLi9SZW5kZXJQYXNzLmpzXCI7XG5leHBvcnQgeyBSaWdpZEJvZHkgfSBmcm9tIFwiLi9SaWdpZEJvZHkuanNcIjtcbmV4cG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb24uanNcIjtcbmV4cG9ydCB7IFNjYWxlIH0gZnJvbSBcIi4vU2NhbGUuanNcIjtcbmV4cG9ydCB7IFNjZW5lIH0gZnJvbSBcIi4vU2NlbmUuanNcIjtcbmV4cG9ydCB7IFNoYXBlIH0gZnJvbSBcIi4vU2hhcGUuanNcIjtcbmV4cG9ydCB7IFNreUJveCB9IGZyb20gXCIuL1NreWJveC5qc1wiO1xuZXhwb3J0IHsgU291bmQgfSBmcm9tIFwiLi9Tb3VuZC5qc1wiO1xuZXhwb3J0IHsgU3RvcCB9IGZyb20gXCIuL1N0b3AuanNcIjtcbmV4cG9ydCB7IFRleHQgfSBmcm9tIFwiLi9UZXh0LmpzXCI7XG5leHBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zvcm0uanNcIjtcbmV4cG9ydCB7IFZpc2libGUgfSBmcm9tIFwiLi9WaXNpYmxlLmpzXCI7XG5leHBvcnQgeyBWUkNvbnRyb2xsZXIsIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyIH0gZnJvbSBcIi4vVlJDb250cm9sbGVyLmpzXCI7XG5leHBvcnQgeyBXZWJHTFJlbmRlcmVyIH0gZnJvbSBcIi4vV2ViR0xSZW5kZXJlci5qc1wiO1xuZXhwb3J0IHsgQ29udHJvbGxlckNvbm5lY3RlZCB9IGZyb20gXCIuL0NvbnRyb2xsZXJDb25uZWN0ZWQuanNcIjtcbmV4cG9ydCB7IE9uT2JqZWN0M0RBZGRlZCB9IGZyb20gXCIuL09uT2JqZWN0M0RBZGRlZC5qc1wiO1xuXG5pbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzLCBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBSZW5kZXJQYXNzLCBBY3RpdmUsIFdlYkdMUmVuZGVyZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhVGFnQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50cy5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBWUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvVlJCdXR0b24uanNcIjtcbmltcG9ydCB7IEFSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9BUkJ1dHRvbi5qc1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlckNvbnRleHQgZXh0ZW5kcyBDb21wb25lbnQge31cbldlYkdMUmVuZGVyZXJDb250ZXh0LnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLndvcmxkLnJlZ2lzdGVyQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29tcG9uZW50LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVbmluaXRpYWxpemVkIHJlbmRlcmVyc1xuICAgIHRoaXMucXVlcmllcy51bmluaXRpYWxpemVkUmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG5cbiAgICAgIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgICAgYW50aWFsaWFzOiBjb21wb25lbnQuYW50aWFsaWFzXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52ciB8fCBjb21wb25lbnQuYXIpIHtcbiAgICAgICAgcmVuZGVyZXIueHIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoVlJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50LmFyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0LCB7IHZhbHVlOiByZW5kZXJlciB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMuY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgIHZhciByZW5kZXJlciA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wb25lbnQud2lkdGggIT09IHJlbmRlcmVyLndpZHRoIHx8XG4gICAgICAgIGNvbXBvbmVudC5oZWlnaHQgIT09IHJlbmRlcmVyLmhlaWdodFxuICAgICAgKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUoY29tcG9uZW50LndpZHRoLCBjb21wb25lbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8gaW5uZXJXaWR0aC9pbm5lckhlaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJQYXNzZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyUGFzc11cbiAgfSxcbiAgYWN0aXZlQ2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmFUYWdDb21wb25lbnQsIEFjdGl2ZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBQYXJlbnRPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICBQb3NpdGlvbixcbiAgU2NhbGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29yZS9jb21wb25lbnRzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgaWYgKCFlbnRpdHkuYWxpdmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGllcmFyY2h5XG4gICAgdGhpcy5xdWVyaWVzLnBhcmVudE9iamVjdDNELmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50T2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICB9KTtcblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGlmICghZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGxldCBwb3NpdGlvbnMgPSB0aGlzLnF1ZXJpZXMucG9zaXRpb25zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmFkZGVkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuXG4gICAgICAvLyBMaW5rIHRoZW1cbiAgICAgIGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlID0gb2JqZWN0LnBvc2l0aW9uO1xuICAgIH1cbiAgICAvKlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuKi9cbiAgICAvLyBTY2FsZVxuICAgIGxldCBzY2FsZXMgPSB0aGlzLnF1ZXJpZXMuc2NhbGVzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmFkZGVkW2ldO1xuICAgICAgbGV0IHNjYWxlID0gZW50aXR5LmdldENvbXBvbmVudChTY2FsZSkudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBzY2FsZXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3Quc2NhbGUuY29weShzY2FsZSk7XG4gICAgfVxuICB9XG59XG5cblRyYW5zZm9ybVN5c3RlbS5xdWVyaWVzID0ge1xuICBwYXJlbnRPYmplY3QzRDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnRPYmplY3QzRCwgT2JqZWN0M0RDb21wb25lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEQ29tcG9uZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmFuc2Zvcm1zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNEQ29tcG9uZW50LCBUcmFuc2Zvcm1dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVHJhbnNmb3JtXVxuICAgIH1cbiAgfSxcbiAgcG9zaXRpb25zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNEQ29tcG9uZW50LCBQb3NpdGlvbl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtQb3NpdGlvbl1cbiAgICB9XG4gIH0sXG4gIHNjYWxlczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgU2NhbGVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbU2NhbGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuaW1wb3J0IHtcbiAgQ2FtZXJhVGFnQ29tcG9uZW50LFxuICBPYmplY3QzRENvbXBvbmVudFxufSBmcm9tIFwiLi4vLi4vY29yZS9jb21wb25lbnRzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzaXplXCIsIHRoaXMuYXNwZWN0KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCBjYW1lcmFzID0gdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbWVyYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjYW1lcmFPYmogPSBjYW1lcmFzW2ldLmdldE9iamVjdDNEKCk7XG4gICAgICBpZiAoY2FtZXJhT2JqLmFzcGVjdCAhPT0gdGhpcy5hc3BlY3QpIHtcbiAgICAgICAgY2FtZXJhT2JqLmFzcGVjdCA9IHRoaXMuYXNwZWN0O1xuICAgICAgICBjYW1lcmFPYmoudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5VcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYVRhZ0NvbXBvbmVudCwgVXBkYXRlQXNwZWN0T25SZXNpemVUYWcsIE9iamVjdDNEQ29tcG9uZW50XVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IE9uT2JqZWN0M0RBZGRlZCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09uT2JqZWN0M0RBZGRlZC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29yZS9PYmplY3QzRENvbXBvbmVudC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgT25PYmplY3QzREFkZGVkU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBjb25zdCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChPbk9iamVjdDNEQWRkZWQpO1xuICAgICAgY29tcG9uZW50LmNhbGxiYWNrKGVudGl0eS5nZXRPYmplY3QzRCgpKTtcbiAgICB9XG4gIH1cbn1cblxuT25PYmplY3QzREFkZGVkU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW09uT2JqZWN0M0RBZGRlZCwgT2JqZWN0M0RDb21wb25lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IFVwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9VcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgT25PYmplY3QzREFkZGVkU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9Pbk9iamVjdDNEQWRkZWRTeXN0ZW0uanNcIjtcblxuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIEFjdGl2ZSxcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhLFxuICBDYW1lcmFSaWcsXG4gIFBhcmVudCxcbiAgVXBkYXRlQXNwZWN0T25SZXNpemVUYWcsXG4gIE9uT2JqZWN0M0RBZGRlZFxufSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQge1xuICBPYmplY3QzRENvbXBvbmVudCxcbiAgU2NlbmVUYWdDb21wb25lbnQsXG4gIENhbWVyYVRhZ0NvbXBvbmVudCxcbiAgTWVzaFRhZ0NvbXBvbmVudFxufSBmcm9tIFwiLi4vY29yZS9jb21wb25lbnRzLmpzXCI7XG5cbmltcG9ydCB7IEVDU1lUaHJlZVdvcmxkIH0gZnJvbSBcIi4uL2NvcmUvd29ybGQuanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemUod29ybGQgPSBuZXcgRUNTWVRocmVlV29ybGQoKSwgb3B0aW9ucykge1xuICBpZiAoISh3b3JsZCBpbnN0YW5jZW9mIEVDU1lUaHJlZVdvcmxkKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgIFwiVGhlIHByb3ZpZGVkICd3b3JsZCcgcGFyZW1ldGVyIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiAnRUNTWVRocmVlV29ybGQnXCJcbiAgICApO1xuICB9XG5cbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFRyYW5zZm9ybVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oT25PYmplY3QzREFkZGVkU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtKTtcblxuICB3b3JsZFxuICAgIC5yZWdpc3RlckNvbXBvbmVudChPbk9iamVjdDNEQWRkZWQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFNjZW5lKVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChBY3RpdmUpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KENhbWVyYVJpZylcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoUGFyZW50KVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChPYmplY3QzRENvbXBvbmVudClcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoUmVuZGVyUGFzcylcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoQ2FtZXJhKVxuICAgIC8vIFRhZ3NcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoU2NlbmVUYWdDb21wb25lbnQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KENhbWVyYVRhZ0NvbXBvbmVudClcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoTWVzaFRhZ0NvbXBvbmVudClcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoVXBkYXRlQXNwZWN0T25SZXNpemVUYWcpO1xuXG4gIGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHtcbiAgICB2cjogZmFsc2UsXG4gICAgZGVmYXVsdHM6IHRydWVcbiAgfTtcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKTtcblxuICBpZiAoIW9wdGlvbnMuZGVmYXVsdHMpIHtcbiAgICByZXR1cm4geyB3b3JsZCB9O1xuICB9XG5cbiAgbGV0IGFuaW1hdGlvbkxvb3AgPSBvcHRpb25zLmFuaW1hdGlvbkxvb3A7XG4gIGlmICghYW5pbWF0aW9uTG9vcCkge1xuICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgYW5pbWF0aW9uTG9vcCA9ICgpID0+IHtcbiAgICAgIHdvcmxkLmV4ZWN1dGUoY2xvY2suZ2V0RGVsdGEoKSwgY2xvY2suZWxhcHNlZFRpbWUpO1xuICAgIH07XG4gIH1cblxuICBsZXQgc2NlbmUgPSB3b3JsZFxuICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgIC5hZGRDb21wb25lbnQoU2NlbmUpXG4gICAgLmFkZE9iamVjdDNEQ29tcG9uZW50KG5ldyBUSFJFRS5TY2VuZSgpKTtcblxuICBsZXQgcmVuZGVyZXIgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlciwge1xuICAgIGFyOiBvcHRpb25zLmFyLFxuICAgIHZyOiBvcHRpb25zLnZyLFxuICAgIGFuaW1hdGlvbkxvb3A6IGFuaW1hdGlvbkxvb3BcbiAgfSk7XG5cbiAgLy8gY2FtZXJhIHJpZyAmIGNvbnRyb2xsZXJzXG4gIHZhciBjYW1lcmEgPSBudWxsLFxuICAgIGNhbWVyYVJpZyA9IG51bGw7XG4gIGlmIChvcHRpb25zLmFyIHx8IG9wdGlvbnMudnIpIHtcbiAgICBjYW1lcmFSaWcgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KVxuICAgICAgLmFkZENvbXBvbmVudChBY3RpdmUpO1xuICB9IGVsc2Uge1xuICAgIGNhbWVyYSA9IHdvcmxkXG4gICAgICAuY3JlYXRlRW50aXR5KClcbiAgICAgIC5hZGRDb21wb25lbnQoQ2FtZXJhKVxuICAgICAgLmFkZENvbXBvbmVudChVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZylcbiAgICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChcbiAgICAgICAgbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICAgIDkwLFxuICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICAgIDAuMSxcbiAgICAgICAgICAxMDBcbiAgICAgICAgKSxcbiAgICAgICAgc2NlbmVcbiAgICAgIClcbiAgICAgIC5hZGRDb21wb25lbnQoQWN0aXZlKTtcbiAgfVxuXG4gIGxldCByZW5kZXJQYXNzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlclBhc3MsIHtcbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICBjYW1lcmFSaWcsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHJlbmRlclBhc3NcbiAgICB9XG4gIH07XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBHZW9tZXRyeSxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvT2JqZWN0M0RDb21wb25lbnQuanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldFJlbW92ZWRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpLnZhbHVlO1xuICAgICAgdmFyIHBhcmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50LCB0cnVlKS52YWx1ZTtcbiAgICAgIHBhcmVudC5nZXRPYmplY3QzRCgpLnJlbW92ZShvYmplY3QpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR2VvbWV0cnkpO1xuXG4gICAgICB2YXIgZ2VvbWV0cnk7XG4gICAgICBzd2l0Y2ggKGNvbXBvbmVudC5wcmltaXRpdmUpIHtcbiAgICAgICAgY2FzZSBcInRvcnVzXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGl1cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YmUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpYWxTZWdtZW50cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YnVsYXJTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzcGhlcmVcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5KGNvbXBvbmVudC5yYWRpdXMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQud2lkdGgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5kZXB0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9XG4gICAgICAgIGNvbXBvbmVudC5wcmltaXRpdmUgPT09IFwidG9ydXNcIiA/IDB4OTk5OTAwIDogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuXG4gICAgICAvKlxuICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChNYXRlcmlhbCkpIHtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiovXG5cbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChUcmFuc2Zvcm0pKSB7XG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICAgIGlmICh0cmFuc2Zvcm0ucm90YXRpb24pIHtcbiAgICAgICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KEVsZW1lbnQpICYmICFlbnRpdHkuaGFzQ29tcG9uZW50KERyYWdnYWJsZSkpIHtcbiAgICAgIC8vICAgICAgICBvYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0KDB4MzMzMzMzKTtcbiAgICAgIC8vICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuR2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR2VvbWV0cnldLCAvLyBAdG9kbyBUcmFuc2Zvcm06IEFzIG9wdGlvbmFsLCBob3cgdG8gZGVmaW5lIGl0P1xuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgR0xURkxvYWRlciBhcyBHTFRGTG9hZGVyVGhyZWUgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvR0xURkxvYWRlci5qc1wiO1xuaW1wb3J0IHsgU3lzdGVtLCBTeXN0ZW1TdGF0ZUNvbXBvbmVudCwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IEdMVEZNb2RlbCB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZNb2RlbC5qc1wiO1xuaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50cy5qc1wiO1xuXG4vLyBAdG9kbyBVc2UgcGFyYW1ldGVyIGFuZCBsb2FkZXIgbWFuYWdlclxudmFyIGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyVGhyZWUoKTsgLy8uc2V0UGF0aChcIi9hc3NldHMvbW9kZWxzL1wiKTtcblxuY2xhc3MgR0xURkxvYWRlclN0YXRlIGV4dGVuZHMgU3lzdGVtU3RhdGVDb21wb25lbnQge31cblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMud29ybGQucmVnaXN0ZXJDb21wb25lbnQoR0xURkxvYWRlclN0YXRlKS5yZWdpc3RlckNvbXBvbmVudChHTFRGTW9kZWwpO1xuICAgIHRoaXMubG9hZGVkID0gW107XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGNvbnN0IHRvTG9hZCA9IHRoaXMucXVlcmllcy50b0xvYWQucmVzdWx0cztcbiAgICB3aGlsZSAodG9Mb2FkLmxlbmd0aCkge1xuICAgICAgY29uc3QgZW50aXR5ID0gdG9Mb2FkWzBdO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChHTFRGTG9hZGVyU3RhdGUpO1xuICAgICAgbG9hZGVyLmxvYWQoZW50aXR5LmdldENvbXBvbmVudChHTFRGTG9hZGVyKS51cmwsIGdsdGYgPT5cbiAgICAgICAgdGhpcy5sb2FkZWQucHVzaChbZW50aXR5LCBnbHRmXSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRG8gdGhlIGFjdHVhbCBlbnRpdHkgY3JlYXRpb24gaW5zaWRlIHRoZSBzeXN0ZW0gdGljayBub3QgaW4gdGhlIGxvYWRlciBjYWxsYmFja1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2FkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IFtlbnRpdHksIGdsdGZdID0gdGhpcy5sb2FkZWRbaV07XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZMb2FkZXIpO1xuICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQuaXNNZXNoKSB7XG4gICAgICAgICAgY2hpbGQucmVjZWl2ZVNoYWRvdyA9IGNvbXBvbmVudC5yZWNlaXZlU2hhZG93O1xuICAgICAgICAgIGNoaWxkLmNhc3RTaGFkb3cgPSBjb21wb25lbnQuY2FzdFNoYWRvdztcblxuICAgICAgICAgIGlmIChjb21wb25lbnQuZW52TWFwT3ZlcnJpZGUpIHtcbiAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLypcbiAgICAgIHRoaXMud29ybGRcbiAgICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAgIC5hZGRDb21wb25lbnQoR0xURk1vZGVsLCB7IHZhbHVlOiBnbHRmIH0pXG4gICAgICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChnbHRmLnNjZW5lLCBjb21wb25lbnQuYXBwZW5kICYmIGVudGl0eSk7XG4qL1xuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpKSB7XG4gICAgICAgIGlmIChjb21wb25lbnQuYXBwZW5kKSB7XG4gICAgICAgICAgZW50aXR5LmdldE9iamVjdDNEKCkuYWRkKGdsdGYuc2NlbmUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbnRpdHlcbiAgICAgICAgICAuYWRkQ29tcG9uZW50KEdMVEZNb2RlbCwgeyB2YWx1ZTogZ2x0ZiB9KVxuICAgICAgICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChnbHRmLnNjZW5lLCBjb21wb25lbnQucGFyZW50KTtcbiAgICAgIH1cblxuICAgICAgaWYgKGNvbXBvbmVudC5vbkxvYWRlZCkge1xuICAgICAgICBjb21wb25lbnQub25Mb2FkZWQoZ2x0Zi5zY2VuZSwgZ2x0Zik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9hZGVkLmxlbmd0aCA9IDA7XG5cbiAgICBjb25zdCB0b1VubG9hZCA9IHRoaXMucXVlcmllcy50b1VubG9hZC5yZXN1bHRzO1xuICAgIHdoaWxlICh0b1VubG9hZC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IHRvVW5sb2FkWzBdO1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChHTFRGTG9hZGVyU3RhdGUpO1xuICAgICAgZW50aXR5LnJlbW92ZU9iamVjdDNEQ29tcG9uZW50KCk7XG4gICAgfVxuICB9XG59XG5cbkdMVEZMb2FkZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdG9Mb2FkOiB7XG4gICAgY29tcG9uZW50czogW0dMVEZMb2FkZXIsIE5vdChHTFRGTG9hZGVyU3RhdGUpXVxuICB9LFxuICB0b1VubG9hZDoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyU3RhdGUsIE5vdChHTFRGTG9hZGVyKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFNreUJveCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb3JlL09iamVjdDNEQ29tcG9uZW50LmpzXCI7XG5cbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGxldCBza3lib3ggPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNreUJveCk7XG5cbiAgICAgIGxldCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICAgZ2VvbWV0cnkuc2NhbGUoMSwgMSwgLTEpO1xuXG4gICAgICBpZiAoc2t5Ym94LnR5cGUgPT09IFwiY3ViZW1hcC1zdGVyZW9cIikge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoc2t5Ym94LnRleHR1cmVVcmwsIDEyKTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzKTtcbiAgICAgICAgc2t5Qm94LmxheWVycy5zZXQoMSk7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3gpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzUi5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveFIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICAgIHNreUJveFIubGF5ZXJzLnNldCgyKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveFIpO1xuXG4gICAgICAgIGVudGl0eS5hZGRPYmplY3QzRENvbXBvbmVudChncm91cCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biBza3lib3ggdHlwZTogXCIsIHNreWJveC50eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5Ta3lCb3hTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbU2t5Qm94LCBOb3QoT2JqZWN0M0RDb21wb25lbnQpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZpc2libGUgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29yZS9PYmplY3QzRENvbXBvbmVudC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJpbGl0eVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHByb2Nlc3NWaXNpYmlsaXR5KGVudGl0aWVzKSB7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldE9iamVjdDNEKCkudmlzaWJsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoVmlzaWJsZSkudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkKTtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkKTtcbiAgfVxufVxuXG5WaXNpYmlsaXR5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1Zpc2libGUsIE9iamVjdDNEQ29tcG9uZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVGV4dE1lc2ggfSBmcm9tIFwidHJvaWthLTNkLXRleHQvZGlzdC90ZXh0bWVzaC1zdGFuZGFsb25lLmVzbS5qc1wiO1xuaW1wb3J0IHsgVGV4dCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb3JlL09iamVjdDNEQ29tcG9uZW50LmpzXCI7XG5cbmNvbnN0IGFuY2hvck1hcHBpbmcgPSB7XG4gIGxlZnQ6IDAsXG4gIGNlbnRlcjogMC41LFxuICByaWdodDogMVxufTtcbmNvbnN0IGJhc2VsaW5lTWFwcGluZyA9IHtcbiAgdG9wOiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgYm90dG9tOiAxXG59O1xuXG5leHBvcnQgY2xhc3MgU0RGVGV4dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpIHtcbiAgICB0ZXh0TWVzaC50ZXh0ID0gdGV4dENvbXBvbmVudC50ZXh0O1xuICAgIHRleHRNZXNoLnRleHRBbGlnbiA9IHRleHRDb21wb25lbnQudGV4dEFsaWduO1xuICAgIHRleHRNZXNoLmFuY2hvclswXSA9IGFuY2hvck1hcHBpbmdbdGV4dENvbXBvbmVudC5hbmNob3JdO1xuICAgIHRleHRNZXNoLmFuY2hvclsxXSA9IGJhc2VsaW5lTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmJhc2VsaW5lXTtcbiAgICB0ZXh0TWVzaC5jb2xvciA9IHRleHRDb21wb25lbnQuY29sb3I7XG4gICAgdGV4dE1lc2guZm9udCA9IHRleHRDb21wb25lbnQuZm9udDtcbiAgICB0ZXh0TWVzaC5mb250U2l6ZSA9IHRleHRDb21wb25lbnQuZm9udFNpemU7XG4gICAgdGV4dE1lc2gubGV0dGVyU3BhY2luZyA9IHRleHRDb21wb25lbnQubGV0dGVyU3BhY2luZyB8fCAwO1xuICAgIHRleHRNZXNoLmxpbmVIZWlnaHQgPSB0ZXh0Q29tcG9uZW50LmxpbmVIZWlnaHQgfHwgbnVsbDtcbiAgICB0ZXh0TWVzaC5vdmVyZmxvd1dyYXAgPSB0ZXh0Q29tcG9uZW50Lm92ZXJmbG93V3JhcDtcbiAgICB0ZXh0TWVzaC53aGl0ZVNwYWNlID0gdGV4dENvbXBvbmVudC53aGl0ZVNwYWNlO1xuICAgIHRleHRNZXNoLm1heFdpZHRoID0gdGV4dENvbXBvbmVudC5tYXhXaWR0aDtcbiAgICB0ZXh0TWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gdGV4dENvbXBvbmVudC5vcGFjaXR5O1xuICAgIHRleHRNZXNoLnN5bmMoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzO1xuXG4gICAgZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG5cbiAgICAgIGNvbnN0IHRleHRNZXNoID0gbmV3IFRleHRNZXNoKCk7XG4gICAgICB0ZXh0TWVzaC5uYW1lID0gXCJ0ZXh0TWVzaFwiO1xuICAgICAgdGV4dE1lc2guYW5jaG9yID0gWzAsIDBdO1xuICAgICAgdGV4dE1lc2gucmVuZGVyT3JkZXIgPSAxMDsgLy9icnV0ZS1mb3JjZSBmaXggZm9yIHVnbHkgYW50aWFsaWFzaW5nLCBzZWUgaXNzdWUgIzY3XG4gICAgICB0aGlzLnVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpO1xuICAgICAgZS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IHRleHRNZXNoIH0pO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRPYmplY3QzRCgpO1xuICAgICAgdmFyIHRleHRNZXNoID0gb2JqZWN0M0QuZ2V0T2JqZWN0QnlOYW1lKFwidGV4dE1lc2hcIik7XG4gICAgICB0ZXh0TWVzaC5kaXNwb3NlKCk7XG4gICAgICBvYmplY3QzRC5yZW1vdmUodGV4dE1lc2gpO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMuY2hhbmdlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRPYmplY3QzRCgpO1xuICAgICAgaWYgKG9iamVjdDNEIGluc3RhbmNlb2YgVGV4dE1lc2gpIHtcbiAgICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KG9iamVjdDNELCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5TREZUZXh0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RleHRdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgQ29udHJvbGxlckNvbm5lY3RlZFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlckNvbnRleHQgfSBmcm9tIFwiLi9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5cbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvT2JqZWN0M0RDb21wb25lbnQuanNcIjtcbmltcG9ydCB7IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5LmpzXCI7XG5cbnZhciBjb250cm9sbGVyTW9kZWxGYWN0b3J5ID0gbmV3IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSgpO1xuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLndvcmxkXG4gICAgICAucmVnaXN0ZXJDb21wb25lbnQoVlJDb250cm9sbGVyKVxuICAgICAgLnJlZ2lzdGVyQ29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKVxuICAgICAgLnJlZ2lzdGVyQ29tcG9uZW50KENvbnRyb2xsZXJDb25uZWN0ZWQpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXIgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJDb250ZXh0LnJlc3VsdHNbMF0uZ2V0Q29tcG9uZW50KFxuICAgICAgV2ViR0xSZW5kZXJlckNvbnRleHRcbiAgICApLnZhbHVlO1xuXG4gICAgdGhpcy5xdWVyaWVzLmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb250cm9sbGVySWQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlcikuaWQ7XG4gICAgICB2YXIgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXIubmFtZSA9IFwiY29udHJvbGxlclwiO1xuXG4gICAgICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IGdyb3VwIH0pO1xuXG4gICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjb25uZWN0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KENvbnRyb2xsZXJDb25uZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRpc2Nvbm5lY3RlZFwiLCAoKSA9PiB7XG4gICAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoQ29udHJvbGxlckNvbm5lY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpKSB7XG4gICAgICAgIHZhciBiZWhhdmlvdXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKTtcbiAgICAgICAgT2JqZWN0LmtleXMoYmVoYXZpb3VyKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKGJlaGF2aW91cltldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBiZWhhdmlvdXJbZXZlbnROYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB3aWxsIGF1dG9tYXRpY2FsbHkgZmV0Y2ggY29udHJvbGxlciBtb2RlbHNcbiAgICAgIC8vIHRoYXQgbWF0Y2ggd2hhdCB0aGUgdXNlciBpcyBob2xkaW5nIGFzIGNsb3NlbHkgYXMgcG9zc2libGUuIFRoZSBtb2RlbHNcbiAgICAgIC8vIHNob3VsZCBiZSBhdHRhY2hlZCB0byB0aGUgb2JqZWN0IHJldHVybmVkIGZyb20gZ2V0Q29udHJvbGxlckdyaXAgaW5cbiAgICAgIC8vIG9yZGVyIHRvIG1hdGNoIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgaGVsZCBkZXZpY2UuXG4gICAgICBsZXQgY29udHJvbGxlckdyaXAgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyR3JpcChjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlckdyaXAuYWRkKFxuICAgICAgICBjb250cm9sbGVyTW9kZWxGYWN0b3J5LmNyZWF0ZUNvbnRyb2xsZXJNb2RlbChjb250cm9sbGVyR3JpcClcbiAgICAgICk7XG4gICAgICBjb250cm9sbGVyR3JpcC5uYW1lID0gXCJtb2RlbFwiO1xuICAgICAgZ3JvdXAuYWRkKGNvbnRyb2xsZXJHcmlwKTtcblxuICAgICAgLypcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKFxuICAgICAgICBcInBvc2l0aW9uXCIsXG4gICAgICAgIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKFswLCAwLCAwLCAwLCAwLCAtMV0sIDMpXG4gICAgICApO1xuXG4gICAgICB2YXIgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5KTtcbiAgICAgIGxpbmUubmFtZSA9IFwibGluZVwiO1xuICAgICAgbGluZS5zY2FsZS56ID0gNTtcbiAgICAgIGdyb3VwLmFkZChsaW5lKTtcblxuICAgICAgbGV0IGdlb21ldHJ5MiA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgwLjEsIDAuMSwgMC4xKTtcbiAgICAgIGxldCBtYXRlcmlhbDIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMGZmMDAgfSk7XG4gICAgICBsZXQgY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5MiwgbWF0ZXJpYWwyKTtcbiAgICAgIGdyb3VwLm5hbWUgPSBcIlZSQ29udHJvbGxlclwiO1xuICAgICAgZ3JvdXAuYWRkKGN1YmUpO1xuKi9cbiAgICB9KTtcblxuICAgIC8vIHRoaXMuY2xlYW5JbnRlcnNlY3RlZCgpO1xuICB9XG59XG5cblZSQ29udHJvbGxlclN5c3RlbS5xdWVyaWVzID0ge1xuICBjb250cm9sbGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtWUkNvbnRyb2xsZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICAgIC8vY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9LFxuICByZW5kZXJlckNvbnRleHQ6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIG1hbmRhdG9yeTogdHJ1ZVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgUGxheSwgU3RvcCwgR0xURk1vZGVsLCBBbmltYXRpb24gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgQW5pbWF0aW9uTWl4ZXIgfSBmcm9tIFwidGhyZWVcIjtcblxuY2xhc3MgQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge31cbkFuaW1hdGlvbk1peGVyQ29tcG9uZW50LnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG5cbmNsYXNzIEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge31cbkFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQuc2NoZW1hID0ge1xuICBhbmltYXRpb25zOiB7IGRlZmF1bHQ6IFtdLCB0eXBlOiBUeXBlcy5BcnJheSB9LFxuICBkdXJhdGlvbjogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvblN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy53b3JsZFxuICAgICAgLnJlZ2lzdGVyQ29tcG9uZW50KEFuaW1hdGlvbk1peGVyQ29tcG9uZW50KVxuICAgICAgLnJlZ2lzdGVyQ29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQpO1xuICB9XG5cbiAgZXhlY3V0ZShkZWx0YSkge1xuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgZ2x0ZiA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURk1vZGVsKS52YWx1ZTtcbiAgICAgIGxldCBtaXhlciA9IG5ldyBUSFJFRS5BbmltYXRpb25NaXhlcihnbHRmLnNjZW5lKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQsIHtcbiAgICAgICAgdmFsdWU6IG1peGVyXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBbXTtcbiAgICAgIGdsdGYuYW5pbWF0aW9ucy5mb3JFYWNoKGFuaW1hdGlvbkNsaXAgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBtaXhlci5jbGlwQWN0aW9uKGFuaW1hdGlvbkNsaXAsIGdsdGYuc2NlbmUpO1xuICAgICAgICBhY3Rpb24ubG9vcCA9IFRIUkVFLkxvb3BPbmNlO1xuICAgICAgICBhbmltYXRpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgIH0pO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIHtcbiAgICAgICAgYW5pbWF0aW9uczogYW5pbWF0aW9ucyxcbiAgICAgICAgZHVyYXRpb246IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uKS5kdXJhdGlvblxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMubWl4ZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25NaXhlckNvbXBvbmVudCkudmFsdWUudXBkYXRlKGRlbHRhKTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5wbGF5Q2xpcHMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5hbmltYXRpb25zLmZvckVhY2goYWN0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGlmIChjb21wb25lbnQuZHVyYXRpb24gIT09IC0xKSB7XG4gICAgICAgICAgYWN0aW9uQ2xpcC5zZXREdXJhdGlvbihjb21wb25lbnQuZHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWN0aW9uQ2xpcC5jbGFtcFdoZW5GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIGFjdGlvbkNsaXAucmVzZXQoKTtcbiAgICAgICAgYWN0aW9uQ2xpcC5wbGF5KCk7XG4gICAgICB9KTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoUGxheSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuc3RvcENsaXBzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQpXG4gICAgICAgIC5hbmltYXRpb25zO1xuICAgICAgYW5pbWF0aW9ucy5mb3JFYWNoKGFjdGlvbkNsaXAgPT4ge1xuICAgICAgICBhY3Rpb25DbGlwLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkNsaXAuc3RvcCgpO1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFN0b3ApO1xuICAgIH0pO1xuICB9XG59XG5cbkFuaW1hdGlvblN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb24sIEdMVEZNb2RlbF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbWl4ZXJzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbk1peGVyQ29tcG9uZW50XVxuICB9LFxuICBwbGF5Q2xpcHM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwgUGxheV1cbiAgfSxcbiAgc3RvcENsaXBzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIFN0b3BdXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgSW5wdXRTdGF0ZVxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIC8vISEhISEhISEhISEhIVxuICAgIHRoaXMud29ybGQucmVnaXN0ZXJDb21wb25lbnQoSW5wdXRTdGF0ZSk7XG5cbiAgICBsZXQgZW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoSW5wdXRTdGF0ZSk7XG4gICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoSW5wdXRTdGF0ZSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1ZSQ29udHJvbGxlcnMoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NLZXlib2FyZCgpO1xuICAgIC8vIHRoaXMucHJvY2Vzc01vdXNlKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzR2FtZXBhZHMoKTtcbiAgfVxuXG4gIHByb2Nlc3NWUkNvbnRyb2xsZXJzKCkge1xuICAgIC8vIFByb2Nlc3MgcmVjZW50bHkgYWRkZWQgY29udHJvbGxlcnNcbiAgICB0aGlzLnF1ZXJpZXMudnJjb250cm9sbGVycy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLCB7XG4gICAgICAgIHNlbGVjdHN0YXJ0OiBldmVudCA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZ2V0KGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHN0YXRlLnByZXZTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlbmQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5nZXQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIHN0YXRlLnByZXZTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbm5lY3RlZDogZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLnNldChldmVudC50YXJnZXQsIHt9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlzY29ubmVjdGVkOiBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZGVsZXRlKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHN0YXRlXG4gICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZm9yRWFjaChzdGF0ZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3RTdGFydCA9IHN0YXRlLnNlbGVjdGVkICYmICFzdGF0ZS5wcmV2U2VsZWN0ZWQ7XG4gICAgICBzdGF0ZS5zZWxlY3RFbmQgPSAhc3RhdGUuc2VsZWN0ZWQgJiYgc3RhdGUucHJldlNlbGVjdGVkO1xuICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gc3RhdGUuc2VsZWN0ZWQ7XG4gICAgfSk7XG4gIH1cbn1cblxuSW5wdXRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdnJjb250cm9sbGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtWUkNvbnRyb2xsZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyBleHRlbmRzIFRIUkVFLk9iamVjdDNEIHtcbiAgY29uc3RydWN0b3IobGlzdGVuZXIsIHBvb2xTaXplKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgdGhpcy5jb250ZXh0ID0gbGlzdGVuZXIuY29udGV4dDtcblxuICAgIHRoaXMucG9vbFNpemUgPSBwb29sU2l6ZSB8fCA1O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wb29sU2l6ZTsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuLnB1c2gobmV3IFRIUkVFLlBvc2l0aW9uYWxBdWRpbyhsaXN0ZW5lcikpO1xuICAgIH1cbiAgfVxuXG4gIHNldEJ1ZmZlcihidWZmZXIpIHtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goc291bmQgPT4ge1xuICAgICAgc291bmQuc2V0QnVmZmVyKGJ1ZmZlcik7XG4gICAgfSk7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHNvdW5kID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgIGlmICghc291bmQuaXNQbGF5aW5nICYmIHNvdW5kLmJ1ZmZlciAmJiAhZm91bmQpIHtcbiAgICAgICAgc291bmQucGxheSgpO1xuICAgICAgICBzb3VuZC5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJBbGwgdGhlIHNvdW5kcyBhcmUgcGxheWluZy4gSWYgeW91IG5lZWQgdG8gcGxheSBtb3JlIHNvdW5kcyBzaW11bHRhbmVvdXNseSBjb25zaWRlciBpbmNyZWFzaW5nIHRoZSBwb29sIHNpemVcIlxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFNvdW5kIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCBQb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljIGZyb20gXCIuLi9saWIvUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgU291bmRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMubGlzdGVuZXIgPSBuZXcgVEhSRUUuQXVkaW9MaXN0ZW5lcigpO1xuICB9XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLnNvdW5kcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChTb3VuZCk7XG4gICAgICBjb25zdCBzb3VuZCA9IG5ldyBQb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljKHRoaXMubGlzdGVuZXIsIDEwKTtcbiAgICAgIGNvbnN0IGF1ZGlvTG9hZGVyID0gbmV3IFRIUkVFLkF1ZGlvTG9hZGVyKCk7XG4gICAgICBhdWRpb0xvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGJ1ZmZlciA9PiB7XG4gICAgICAgIHNvdW5kLnNldEJ1ZmZlcihidWZmZXIpO1xuICAgICAgfSk7XG4gICAgICBjb21wb25lbnQuc291bmQgPSBzb3VuZDtcbiAgICB9KTtcbiAgfVxufVxuXG5Tb3VuZFN5c3RlbS5xdWVyaWVzID0ge1xuICBzb3VuZHM6IHtcbiAgICBjb21wb25lbnRzOiBbU291bmRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZSAvLyBbU291bmRdXG4gICAgfVxuICB9XG59O1xuIl0sIm5hbWVzIjpbIlRIUkVFLlZlY3RvcjMiLCJUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIiwiVEhSRUUuV2ViR0xSZW5kZXJlciIsIlRIUkVFLkNsb2NrIiwiVEhSRUUuU2NlbmUiLCJUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIkdMVEZMb2FkZXJUaHJlZSIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJUSFJFRS5BbmltYXRpb25NaXhlciIsIlRIUkVFLkxvb3BPbmNlIiwiVEhSRUUuT2JqZWN0M0QiLCJUSFJFRS5Qb3NpdGlvbmFsQXVkaW8iLCJUSFJFRS5BdWRpb0xpc3RlbmVyIiwiVEhSRUUuQXVkaW9Mb2FkZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUVPLE1BQU0saUJBQWlCLFNBQVMsU0FBUyxDQUFDLEVBQUU7O0FBRW5ELGlCQUFpQixDQUFDLE1BQU0sR0FBRztFQUN6QixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0NBQzdDLENBQUM7O0FDSEssTUFBTSxlQUFlLFNBQVMsT0FBTyxDQUFDO0VBQzNDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxZQUFZ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

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
    const entities = this.queries.entities.results;

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUtdW5wa2cuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb3JlL09iamVjdDNEQ29tcG9uZW50LmpzIiwiLi4vc3JjL2NvcmUvZW50aXR5LmpzIiwiLi4vc3JjL2NvcmUvT2JqZWN0M0RUYWdzLmpzIiwiLi4vc3JjL2NvcmUvZGVmYXVsdE9iamVjdDNESW5mbGF0b3IuanMiLCIuLi9zcmMvY29yZS93b3JsZC5qcyIsIi4uL3NyYy9jb3JlL1R5cGVzLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9BbmltYXRpb24uanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvQ2FtZXJhLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Db2xsaWRpbmcuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RhcnQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RvcC5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9EcmFnZ2FibGUuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvR2VvbWV0cnkuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvR0xURkxvYWRlci5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvSW5wdXRTdGF0ZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvUGFyZW50T2JqZWN0M0QuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvUGxheS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9SZW5kZXJQYXNzLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL1JpZ2lkQm9keS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9TY2FsZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9TY2VuZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9TaGFwZS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvU291bmQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvU3RvcC5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9UZXh0LmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL1RyYW5zZm9ybS5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9WaXNpYmxlLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9leHRyYXMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL0NvbnRyb2xsZXJDb25uZWN0ZWQuanMiLCIuLi9zcmMvZXh0cmFzL2NvbXBvbmVudHMvT25PYmplY3QzREFkZGVkLmpzIiwiLi4vc3JjL2V4dHJhcy9jb21wb25lbnRzL2luZGV4LmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvZXh0cmFzL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1VwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL09uT2JqZWN0M0RBZGRlZFN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvaW5pdGlhbGl6ZS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1NreUJveFN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL1NERlRleHRTeXN0ZW0uanMiLCIuLi9zcmMvZXh0cmFzL3N5c3RlbXMvVlJDb250cm9sbGVyU3lzdGVtLmpzIiwiLi4vc3JjL2V4dHJhcy9zeXN0ZW1zL0FuaW1hdGlvblN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvc3lzdGVtcy9JbnB1dFN5c3RlbS5qcyIsIi4uL3NyYy9leHRyYXMvbGliL1Bvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMuanMiLCIuLi9zcmMvZXh0cmFzL3N5c3RlbXMvU291bmRTeXN0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBPYmplY3QzRENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5PYmplY3QzRENvbXBvbmVudC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgX0VudGl0eSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuL09iamVjdDNEQ29tcG9uZW50LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFQ1NZVGhyZWVFbnRpdHkgZXh0ZW5kcyBfRW50aXR5IHtcbiAgYWRkT2JqZWN0M0RDb21wb25lbnQob2JqLCBwYXJlbnRFbnRpdHkpIHtcbiAgICBvYmouZW50aXR5ID0gdGhpcztcbiAgICB0aGlzLmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogb2JqIH0pO1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIud29ybGQub2JqZWN0M0RJbmZsYXRvci5pbmZsYXRlKHRoaXMsIG9iaik7XG4gICAgaWYgKHBhcmVudEVudGl0eSAmJiBwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgcGFyZW50RW50aXR5LmdldE9iamVjdDNEKCkuYWRkKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlT2JqZWN0M0RDb21wb25lbnQodW5wYXJlbnQgPSB0cnVlKSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5nZXRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHRydWUpLnZhbHVlO1xuICAgIGlmICh1bnBhcmVudCkge1xuICAgICAgLy8gVXNpbmcgXCJ0cnVlXCIgYXMgdGhlIGVudGl0eSBjb3VsZCBiZSByZW1vdmVkIHNvbWV3aGVyZSBlbHNlXG4gICAgICBvYmoucGFyZW50ICYmIG9iai5wYXJlbnQucmVtb3ZlKG9iaik7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KTtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLndvcmxkLm9iamVjdDNESW5mbGF0b3IuZGVmbGF0ZSh0aGlzLCBvYmopO1xuICAgIG9iai5lbnRpdHkgPSBudWxsO1xuICB9XG5cbiAgcmVtb3ZlKGZvcmNlSW1tZWRpYXRlKSB7XG4gICAgaWYgKHRoaXMuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgY29uc3Qgb2JqID0gdGhpcy5nZXRPYmplY3QzRCgpO1xuICAgICAgb2JqLnRyYXZlcnNlKG8gPT4ge1xuICAgICAgICBpZiAoby5lbnRpdHkpIHtcbiAgICAgICAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eShvLmVudGl0eSwgZm9yY2VJbW1lZGlhdGUpO1xuICAgICAgICB9XG4gICAgICAgIG8uZW50aXR5ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgb2JqLnBhcmVudCAmJiBvYmoucGFyZW50LnJlbW92ZShvYmopO1xuICAgIH1cbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eSh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gIH1cblxuICBnZXRPYmplY3QzRCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpLnZhbHVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU2NlbmVUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBDYW1lcmFUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBNZXNoVGFnQ29tcG9uZW50IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQge1xuICBNZXNoVGFnQ29tcG9uZW50LFxuICBTY2VuZVRhZ0NvbXBvbmVudCxcbiAgQ2FtZXJhVGFnQ29tcG9uZW50XG59IGZyb20gXCIuL09iamVjdDNEVGFncy5qc1wiO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgPSB7XG4gIGluZmxhdGU6IChlbnRpdHksIG9iaikgPT4ge1xuICAgIC8vIFRPRE8gc3VwcG9ydCBtb3JlIHRhZ3MgYW5kIHByb2JhYmx5IGEgd2F5IHRvIGFkZCB1c2VyIGRlZmluZWQgb25lc1xuICAgIGlmIChvYmouaXNNZXNoKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE1lc2hUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzU2NlbmUpIHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoU2NlbmVUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzQ2FtZXJhKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KENhbWVyYVRhZ0NvbXBvbmVudCk7XG4gICAgfVxuICB9LFxuICBkZWZsYXRlOiAoZW50aXR5LCBvYmopID0+IHtcbiAgICAvLyBUT0RPIHN1cHBvcnQgbW9yZSB0YWdzIGFuZCBwcm9iYWJseSBhIHdheSB0byBhZGQgdXNlciBkZWZpbmVkIG9uZXNcbiAgICBpZiAob2JqLmlzTWVzaCkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChNZXNoVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc1NjZW5lKSB7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFNjZW5lVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc0NhbWVyYSkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChDYW1lcmFUYWdDb21wb25lbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IEVDU1lUaHJlZUVudGl0eSB9IGZyb20gXCIuL2VudGl0eS5qc1wiO1xuaW1wb3J0IHsgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgfSBmcm9tIFwiLi9kZWZhdWx0T2JqZWN0M0RJbmZsYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlV29ybGQgZXh0ZW5kcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCB7IGVudGl0eUNsYXNzOiBFQ1NZVGhyZWVFbnRpdHkgfSwgb3B0aW9ucykpO1xuICAgIHRoaXMub2JqZWN0M0RJbmZsYXRvciA9IGRlZmF1bHRPYmplY3QzREluZmxhdG9yO1xuICB9XG59XG4iLCJpbXBvcnQgeyBWZWN0b3IzIH0gZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBjcmVhdGVUeXBlLCBjb3B5Q29weWFibGUsIGNsb25lQ2xvbmFibGUgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY29uc3QgVmVjdG9yM1R5cGUgPSBjcmVhdGVUeXBlKHtcbiAgbmFtZTogXCJWZWN0b3IzXCIsXG4gIGRlZmF1bHQ6IG5ldyBWZWN0b3IzKCksXG4gIGNvcHk6IGNvcHlDb3B5YWJsZSxcbiAgY2xvbmU6IGNsb25lQ2xvbmFibGVcbn0pO1xuXG5leHBvcnQgY29uc3QgVGhyZWVUeXBlcyA9IHtcbiAgVmVjdG9yM1R5cGVcbn07XG5cbmV4cG9ydCB7IFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgQWN0aXZlIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiBleHRlbmRzIENvbXBvbmVudCB7fVxuQW5pbWF0aW9uLnNjaGVtYSA9IHtcbiAgYW5pbWF0aW9uczogeyBkZWZhdWx0OiBbXSwgdHlwZTogVHlwZXMuQXJyYXkgfSxcbiAgZHVyYXRpb246IHsgZGVmYXVsdDogLTEsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmEgZXh0ZW5kcyBDb21wb25lbnQge31cblxuQ2FtZXJhLnNjaGVtYSA9IHtcbiAgZm92OiB7IGRlZmF1bHQ6IDQ1LCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgYXNwZWN0OiB7IGRlZmF1bHQ6IDEsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBuZWFyOiB7IGRlZmF1bHQ6IDAuMSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGZhcjogeyBkZWZhdWx0OiAxMDAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbGF5ZXJzOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFSaWcgZXh0ZW5kcyBDb21wb25lbnQge31cbkNhbWVyYVJpZy5zY2hlbWEgPSB7XG4gIGxlZnRIYW5kOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICByaWdodEhhbmQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGNhbWVyYTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgQ29sbGlkaW5nIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Db2xsaWRpbmcuc2NoZW1hID0ge1xuICBjb2xsaWRpbmdXaXRoOiB7IGRlZmF1bHQ6IFtdLCB0eXBlOiBUeXBlcy5BcnJheSB9LFxuICBjb2xsaWRpbmdGcmFtZTogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDb2xsaXNpb25TdGFydCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIENvbGxpc2lvblN0b3AgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5EcmFnZ2FibGUuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9XG59O1xuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBEcmFnZ2luZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBHZW9tZXRyeSBleHRlbmRzIENvbXBvbmVudCB7fVxuR2VvbWV0cnkuc2NoZW1hID0ge1xuICBwcmltaXRpdmU6IHsgZGVmYXVsdDogXCJib3hcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHdpZHRoOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBoZWlnaHQ6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGRlcHRoOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbkdMVEZMb2FkZXIuc2NoZW1hID0ge1xuICB1cmw6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHJlY2VpdmVTaGFkb3c6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgY2FzdFNoYWRvdzogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBlbnZNYXBPdmVycmlkZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgYXBwZW5kOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgb25Mb2FkZWQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHBhcmVudDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgR0xURk1vZGVsIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbkdMVEZNb2RlbC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dFN0YXRlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbklucHV0U3RhdGUuc2NoZW1hID0ge1xuICB2cmNvbnRyb2xsZXJzOiB7IGRlZmF1bHQ6IG5ldyBNYXAoKSwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGtleWJvYXJkOiB7IGRlZmF1bHQ6IHt9LCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgbW91c2U6IHsgZGVmYXVsdDoge30sIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBnYW1lcGFkczogeyBkZWZhdWx0OiB7fSwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFBhcmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuUGFyZW50LnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFBhcmVudE9iamVjdDNEIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5QYXJlbnRPYmplY3QzRC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgUGxheSBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uLy4uL2NvcmUvVHlwZXMuanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24gZXh0ZW5kcyBDb21wb25lbnQge31cblxuUG9zaXRpb24uc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFJlbmRlclBhc3MgZXh0ZW5kcyBDb21wb25lbnQge31cblxuUmVuZGVyUGFzcy5zY2hlbWEgPSB7XG4gIHNjZW5lOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBjYW1lcmE6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFJpZ2lkQm9keSBleHRlbmRzIENvbXBvbmVudCB7fVxuUmlnaWRCb2R5LnNjaGVtYSA9IHtcbiAgb2JqZWN0OiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICB3ZWlnaHQ6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIHJlc3RpdHV0aW9uOiB7IGRlZmF1bHQ6IDEsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBmcmljdGlvbjogeyBkZWZhdWx0OiAxLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbGluZWFyRGFtcGluZzogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgYW5ndWxhckRhbXBpbmc6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGxpbmVhclZlbG9jaXR5OiB7IGRlZmF1bHQ6IHsgeDogMCwgeTogMCwgejogMCB9LCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uLy4uL2NvcmUvVHlwZXMuanNcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Sb3RhdGlvbi5zY2hlbWEgPSB7XG4gIC8vIEBmaXhtZVxuICByb3RhdGlvbjogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUaHJlZVR5cGVzIGZyb20gXCIuLi8uLi9jb3JlL1R5cGVzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FsZSBleHRlbmRzIENvbXBvbmVudCB7fVxuU2NhbGUuc2NoZW1hID0ge1xuICAvLyBAZml4bWVcbiAgdmFsdWU6IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb21wb25lbnQge31cblNjZW5lLnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNoYXBlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5TaGFwZS5zY2hlbWEgPSB7XG4gIHByaW1pdGl2ZTogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgd2lkdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGhlaWdodDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZGVwdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIHJhZGl1czogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Ta3lCb3guc2NoZW1hID0ge1xuICB0ZXh0dXJlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICB0eXBlOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBTb3VuZCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5Tb3VuZC5zY2hlbWEgPSB7XG4gIHNvdW5kOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICB1cmw6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH1cbn07XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFN0b3AgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dCBleHRlbmRzIENvbXBvbmVudCB7fVxuVGV4dC5zY2hlbWEgPSB7XG4gIHRleHQ6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHRleHRBbGlnbjogeyBkZWZhdWx0OiBcImxlZnRcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInXVxuICBhbmNob3I6IHsgZGVmYXVsdDogXCJjZW50ZXJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICBiYXNlbGluZTogeyBkZWZhdWx0OiBcImNlbnRlclwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWyd0b3AnLCAnY2VudGVyJywgJ2JvdHRvbSddXG4gIGNvbG9yOiB7IGRlZmF1bHQ6IFwiI0ZGRlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgZm9udDogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy9cImh0dHBzOi8vY29kZS5jZG4ubW96aWxsYS5uZXQvZm9udHMvdHRmL1ppbGxhU2xhYi1TZW1pQm9sZC50dGZcIlxuICBmb250U2l6ZTogeyBkZWZhdWx0OiAwLjIsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsZXR0ZXJTcGFjaW5nOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsaW5lSGVpZ2h0OiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBtYXhXaWR0aDogeyBkZWZhdWx0OiBJbmZpbml0eSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIG92ZXJmbG93V3JhcDogeyBkZWZhdWx0OiBcIm5vcm1hbFwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWydub3JtYWwnLCAnYnJlYWstd29yZCddXG4gIHdoaXRlU3BhY2U6IHsgZGVmYXVsdDogXCJub3JtYWxcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbm9ybWFsJywgJ25vd3JhcCddXG4gIG9wYWNpdHk6IHsgZGVmYXVsdDogMSwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVGhyZWVUeXBlcyBmcm9tIFwiLi4vLi4vY29yZS9UeXBlcy5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0gZXh0ZW5kcyBDb21wb25lbnQge31cblxuVHJhbnNmb3JtLnNjaGVtYSA9IHtcbiAgcG9zaXRpb246IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSB9LFxuICByb3RhdGlvbjogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2libGUgZXh0ZW5kcyBDb21wb25lbnQge31cblZpc2libGUuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciBleHRlbmRzIENvbXBvbmVudCB7fVxuVlJDb250cm9sbGVyLnNjaGVtYSA9IHtcbiAgaWQ6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGNvbnRyb2xsZXI6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ciBleHRlbmRzIENvbXBvbmVudCB7fVxuVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIuc2NoZW1hID0ge1xuICBzZWxlY3Q6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHNlbGVjdHN0YXJ0OiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBzZWxlY3RlbmQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG5cbiAgY29ubmVjdGVkOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuXG4gIHNxdWVlemU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHNxdWVlemVzdGFydDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgc3F1ZWV6ZWVuZDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5XZWJHTFJlbmRlcmVyLnNjaGVtYSA9IHtcbiAgdnI6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYXI6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgc2hhZG93TWFwOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYW5pbWF0aW9uTG9vcDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgQ29udHJvbGxlckNvbm5lY3RlZCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBPbk9iamVjdDNEQWRkZWQgZXh0ZW5kcyBDb21wb25lbnQge31cbk9uT2JqZWN0M0RBZGRlZC5zY2hlbWEgPSB7XG4gIGNhbGxiYWNrOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiZXhwb3J0IHsgQWN0aXZlIH0gZnJvbSBcIi4vQWN0aXZlLmpzXCI7XG5leHBvcnQgeyBBbmltYXRpb24gfSBmcm9tIFwiLi9BbmltYXRpb24uanNcIjtcbmV4cG9ydCB7IENhbWVyYSB9IGZyb20gXCIuL0NhbWVyYS5qc1wiO1xuZXhwb3J0IHsgQ2FtZXJhUmlnIH0gZnJvbSBcIi4vQ2FtZXJhUmlnLmpzXCI7XG5leHBvcnQgeyBDb2xsaWRpbmcgfSBmcm9tIFwiLi9Db2xsaWRpbmcuanNcIjtcbmV4cG9ydCB7IENvbGxpc2lvblN0YXJ0IH0gZnJvbSBcIi4vQ29sbGlzaW9uU3RhcnQuanNcIjtcbmV4cG9ydCB7IENvbGxpc2lvblN0b3AgfSBmcm9tIFwiLi9Db2xsaXNpb25TdG9wLmpzXCI7XG5leHBvcnQgeyBEcmFnZ2FibGUgfSBmcm9tIFwiLi9EcmFnZ2FibGUuanNcIjtcbmV4cG9ydCB7IERyYWdnaW5nIH0gZnJvbSBcIi4vRHJhZ2dpbmcuanNcIjtcbmV4cG9ydCB7IEdlb21ldHJ5IH0gZnJvbSBcIi4vR2VvbWV0cnkuanNcIjtcbmV4cG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwiLi9HTFRGTG9hZGVyLmpzXCI7XG5leHBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi9HTFRGTW9kZWwuanNcIjtcbmV4cG9ydCB7IElucHV0U3RhdGUgfSBmcm9tIFwiLi9JbnB1dFN0YXRlLmpzXCI7XG5leHBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi9QYXJlbnQuanNcIjtcbmV4cG9ydCB7IFBhcmVudE9iamVjdDNEIH0gZnJvbSBcIi4vUGFyZW50T2JqZWN0M0QuanNcIjtcbmV4cG9ydCB7IFBsYXkgfSBmcm9tIFwiLi9QbGF5LmpzXCI7XG5leHBvcnQgeyBQb3NpdGlvbiB9IGZyb20gXCIuL1Bvc2l0aW9uLmpzXCI7XG5leHBvcnQgeyBSZW5kZXJQYXNzIH0gZnJvbSBcIi4vUmVuZGVyUGFzcy5qc1wiO1xuZXhwb3J0IHsgUmlnaWRCb2R5IH0gZnJvbSBcIi4vUmlnaWRCb2R5LmpzXCI7XG5leHBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uLmpzXCI7XG5leHBvcnQgeyBTY2FsZSB9IGZyb20gXCIuL1NjYWxlLmpzXCI7XG5leHBvcnQgeyBTY2VuZSB9IGZyb20gXCIuL1NjZW5lLmpzXCI7XG5leHBvcnQgeyBTaGFwZSB9IGZyb20gXCIuL1NoYXBlLmpzXCI7XG5leHBvcnQgeyBTa3lCb3ggfSBmcm9tIFwiLi9Ta3lib3guanNcIjtcbmV4cG9ydCB7IFNvdW5kIH0gZnJvbSBcIi4vU291bmQuanNcIjtcbmV4cG9ydCB7IFN0b3AgfSBmcm9tIFwiLi9TdG9wLmpzXCI7XG5leHBvcnQgeyBUZXh0IH0gZnJvbSBcIi4vVGV4dC5qc1wiO1xuZXhwb3J0IHsgVHJhbnNmb3JtIH0gZnJvbSBcIi4vVHJhbnNmb3JtLmpzXCI7XG5leHBvcnQgeyBWaXNpYmxlIH0gZnJvbSBcIi4vVmlzaWJsZS5qc1wiO1xuZXhwb3J0IHsgVlJDb250cm9sbGVyLCBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ciB9IGZyb20gXCIuL1ZSQ29udHJvbGxlci5qc1wiO1xuZXhwb3J0IHsgV2ViR0xSZW5kZXJlciB9IGZyb20gXCIuL1dlYkdMUmVuZGVyZXIuanNcIjtcbmV4cG9ydCB7IENvbnRyb2xsZXJDb25uZWN0ZWQgfSBmcm9tIFwiLi9Db250cm9sbGVyQ29ubmVjdGVkLmpzXCI7XG5leHBvcnQgeyBPbk9iamVjdDNEQWRkZWQgfSBmcm9tIFwiLi9Pbk9iamVjdDNEQWRkZWQuanNcIjtcblxuaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcywgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUmVuZGVyUGFzcywgQWN0aXZlLCBXZWJHTFJlbmRlcmVyIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCB7IENhbWVyYVRhZ0NvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb3JlL2NvbXBvbmVudHMuanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgVlJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1ZSQnV0dG9uLmpzXCI7XG5pbXBvcnQgeyBBUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvQVJCdXR0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJDb250ZXh0IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5XZWJHTFJlbmRlcmVyQ29udGV4dC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy53b3JsZC5yZWdpc3RlckNvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVycyA9IHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cztcbiAgICByZW5kZXJlcnMuZm9yRWFjaChyZW5kZXJlckVudGl0eSA9PiB7XG4gICAgICB2YXIgcmVuZGVyZXIgPSByZW5kZXJlckVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlclBhc3Nlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIHBhc3MgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFJlbmRlclBhc3MpO1xuICAgICAgICB2YXIgc2NlbmUgPSBwYXNzLnNjZW5lLmdldE9iamVjdDNEKCk7XG5cbiAgICAgICAgdGhpcy5xdWVyaWVzLmFjdGl2ZUNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYUVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNhbWVyYSA9IGNhbWVyYUVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGNvbXBvbmVudC5zaGFkb3dNYXA7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIgfHwgY29tcG9uZW50LmFyKSB7XG4gICAgICAgIHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFZSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhVGFnQ29tcG9uZW50LCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUGFyZW50T2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgUG9zaXRpb24sXG4gIFNjYWxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50cy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBIaWVyYXJjaHlcbiAgICBsZXQgYWRkZWQgPSB0aGlzLnF1ZXJpZXMucGFyZW50LmFkZGVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBhZGRlZFtpXTtcbiAgICAgIGlmICghZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcmVudEVudGl0eSA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZTtcbiAgICAgIGlmIChwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBwYXJlbnRFbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgICAgcGFyZW50T2JqZWN0M0QuYWRkKGNoaWxkT2JqZWN0M0QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhpZXJhcmNoeVxuICAgIHRoaXMucXVlcmllcy5wYXJlbnRPYmplY3QzRC5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBjaGlsZE9iamVjdDNEID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG4gICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgfSk7XG5cbiAgICAvLyBUcmFuc2Zvcm1zXG4gICAgdmFyIHRyYW5zZm9ybXMgPSB0aGlzLnF1ZXJpZXMudHJhbnNmb3JtcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmFkZGVkW2ldO1xuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmNoYW5nZWRbaV07XG4gICAgICBpZiAoIWVudGl0eS5hbGl2ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpb25cbiAgICBsZXQgcG9zaXRpb25zID0gdGhpcy5xdWVyaWVzLnBvc2l0aW9ucztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHBvc2l0aW9ucy5hZGRlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcblxuICAgICAgLy8gTGluayB0aGVtXG4gICAgICBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZSA9IG9iamVjdC5wb3NpdGlvbjtcbiAgICB9XG4gICAgLypcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmNoYW5nZWRbaV07XG4gICAgICBsZXQgcG9zaXRpb24gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuICAgIH1cbiovXG4gICAgLy8gU2NhbGVcbiAgICBsZXQgc2NhbGVzID0gdGhpcy5xdWVyaWVzLnNjYWxlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHNjYWxlcy5hZGRlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5zY2FsZS5jb3B5KHNjYWxlKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmNoYW5nZWRbaV07XG4gICAgICBsZXQgc2NhbGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjYWxlKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50T2JqZWN0M0Q6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50T2JqZWN0M0QsIE9iamVjdDNEQ29tcG9uZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRENvbXBvbmVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3Jtczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgVHJhbnNmb3JtXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RyYW5zZm9ybV1cbiAgICB9XG4gIH0sXG4gIHBvc2l0aW9uczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgUG9zaXRpb25dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbUG9zaXRpb25dXG4gICAgfVxuICB9LFxuICBzY2FsZXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0RDb21wb25lbnQsIFNjYWxlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1NjYWxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZyB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmltcG9ydCB7XG4gIENhbWVyYVRhZ0NvbXBvbmVudCxcbiAgT2JqZWN0M0RDb21wb25lbnRcbn0gZnJvbSBcIi4uLy4uL2NvcmUvY29tcG9uZW50cy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlc2l6ZVwiLCB0aGlzLmFzcGVjdCk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2FtZXJhcyA9IHRoaXMucXVlcmllcy5jYW1lcmFzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW1lcmFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2FtZXJhT2JqID0gY2FtZXJhc1tpXS5nZXRPYmplY3QzRCgpO1xuICAgICAgaWYgKGNhbWVyYU9iai5hc3BlY3QgIT09IHRoaXMuYXNwZWN0KSB7XG4gICAgICAgIGNhbWVyYU9iai5hc3BlY3QgPSB0aGlzLmFzcGVjdDtcbiAgICAgICAgY2FtZXJhT2JqLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmFUYWdDb21wb25lbnQsIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnLCBPYmplY3QzRENvbXBvbmVudF1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPbk9iamVjdDNEQWRkZWQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9Pbk9iamVjdDNEQWRkZWQuanNcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvT2JqZWN0M0RDb21wb25lbnQuanNcIjtcblxuZXhwb3J0IGNsYXNzIE9uT2JqZWN0M0RBZGRlZFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgY29uc3QgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChPbk9iamVjdDNEQWRkZWQpO1xuICAgICAgY29tcG9uZW50LmNhbGxiYWNrKGVudGl0eS5nZXRPYmplY3QzRCgpKTtcbiAgICB9XG4gIH1cbn1cblxuT25PYmplY3QzREFkZGVkU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW09uT2JqZWN0M0RBZGRlZCwgT2JqZWN0M0RDb21wb25lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IFVwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9VcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgT25PYmplY3QzREFkZGVkU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9Pbk9iamVjdDNEQWRkZWRTeXN0ZW0uanNcIjtcblxuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIEFjdGl2ZSxcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhLFxuICBVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZyxcbiAgT25PYmplY3QzREFkZGVkXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCB7XG4gIE9iamVjdDNEQ29tcG9uZW50LFxuICBTY2VuZVRhZ0NvbXBvbmVudCxcbiAgQ2FtZXJhVGFnQ29tcG9uZW50LFxuICBNZXNoVGFnQ29tcG9uZW50XG59IGZyb20gXCIuLi9jb3JlL2NvbXBvbmVudHMuanNcIjtcblxuaW1wb3J0IHsgRUNTWVRocmVlV29ybGQgfSBmcm9tIFwiLi4vY29yZS93b3JsZC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSh3b3JsZCA9IG5ldyBFQ1NZVGhyZWVXb3JsZCgpLCBvcHRpb25zKSB7XG4gIGlmICghKHdvcmxkIGluc3RhbmNlb2YgRUNTWVRocmVlV29ybGQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJUaGUgcHJvdmlkZWQgJ3dvcmxkJyBwYXJlbWV0ZXIgaXMgbm90IGFuIGluc3RhbmNlIG9mICdFQ1NZVGhyZWVXb3JsZCdcIlxuICAgICk7XG4gIH1cblxuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShVcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVHJhbnNmb3JtU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShPbk9iamVjdDNEQWRkZWRTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFdlYkdMUmVuZGVyZXJTeXN0ZW0pO1xuXG4gIHdvcmxkXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KE9uT2JqZWN0M0RBZGRlZClcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoV2ViR0xSZW5kZXJlcilcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoU2NlbmUpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KEFjdGl2ZSlcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFJlbmRlclBhc3MpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KENhbWVyYSlcbiAgICAvLyBUYWdzXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFNjZW5lVGFnQ29tcG9uZW50KVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChDYW1lcmFUYWdDb21wb25lbnQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KE1lc2hUYWdDb21wb25lbnQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnKTtcblxuICBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgdnI6IGZhbHNlLFxuICAgIGRlZmF1bHRzOiB0cnVlXG4gIH07XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgaWYgKCFvcHRpb25zLmRlZmF1bHRzKSB7XG4gICAgcmV0dXJuIHsgd29ybGQgfTtcbiAgfVxuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChuZXcgVEhSRUUuU2NlbmUoKSk7XG5cbiAgbGV0IHJlbmRlcmVyID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIsIHtcbiAgICBhcjogb3B0aW9ucy5hcixcbiAgICB2cjogb3B0aW9ucy52cixcbiAgICBhbmltYXRpb25Mb29wOiBhbmltYXRpb25Mb29wXG4gIH0pO1xuXG4gIC8vIGNhbWVyYSByaWcgJiBjb250cm9sbGVyc1xuICB2YXIgY2FtZXJhID0gbnVsbCxcbiAgICBjYW1lcmFSaWcgPSBudWxsO1xuXG4gIC8vIGlmIChvcHRpb25zLmFyIHx8IG9wdGlvbnMudnIpIHtcbiAgLy8gICBjYW1lcmFSaWcgPSB3b3JsZFxuICAvLyAgICAgLmNyZWF0ZUVudGl0eSgpXG4gIC8vICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgLy8gICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KTtcbiAgLy8gfVxuXG4gIHtcbiAgICBjYW1lcmEgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYSlcbiAgICAgIC5hZGRDb21wb25lbnQoVXBkYXRlQXNwZWN0T25SZXNpemVUYWcpXG4gICAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQoXG4gICAgICAgIG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgICAgICA5MCxcbiAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAwLjEsXG4gICAgICAgICAgMTAwXG4gICAgICAgICksXG4gICAgICAgIHNjZW5lXG4gICAgICApXG4gICAgICAuYWRkQ29tcG9uZW50KEFjdGl2ZSk7XG4gIH1cblxuICBsZXQgcmVuZGVyUGFzcyA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChSZW5kZXJQYXNzLCB7XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd29ybGQsXG4gICAgZW50aXRpZXM6IHtcbiAgICAgIHNjZW5lLFxuICAgICAgY2FtZXJhLFxuICAgICAgY2FtZXJhUmlnLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICByZW5kZXJQYXNzXG4gICAgfVxuICB9O1xufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb3JlL09iamVjdDNEQ29tcG9uZW50LmpzXCI7XG5cbi8qKlxuICogQ3JlYXRlIGEgTWVzaCBiYXNlZCBvbiB0aGUgW0dlb21ldHJ5XSBjb21wb25lbnQgYW5kIGF0dGFjaCBpdCB0byB0aGUgZW50aXR5IHVzaW5nIGEgW09iamVjdDNEXSBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBSZW1vdmVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0T2JqZWN0M0QoKS5yZW1vdmUob2JqZWN0KTtcbiAgICB9KTtcblxuICAgIC8vIEFkZGVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdlb21ldHJ5KTtcblxuICAgICAgdmFyIGdlb21ldHJ5O1xuICAgICAgc3dpdGNoIChjb21wb25lbnQucHJpbWl0aXZlKSB7XG4gICAgICAgIGNhc2UgXCJ0b3J1c1wiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpdXMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJlLFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaWFsU2VnbWVudHMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJ1bGFyU2VnbWVudHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3BoZXJlXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeShjb21wb25lbnQucmFkaXVzLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LndpZHRoLFxuICAgICAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0LFxuICAgICAgICAgICAgICBjb21wb25lbnQuZGVwdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPVxuICAgICAgICBjb21wb25lbnQucHJpbWl0aXZlID09PSBcInRvcnVzXCIgPyAweDk5OTkwMCA6IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcblxuICAgICAgLypcbiAgICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoTWF0ZXJpYWwpKSB7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4qL1xuXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVHJhbnNmb3JtKSkge1xuICAgICAgICB2YXIgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0aW9uKSB7XG4gICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChFbGVtZW50KSAmJiAhZW50aXR5Lmhhc0NvbXBvbmVudChEcmFnZ2FibGUpKSB7XG4gICAgICAvLyAgICAgICAgb2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweDMzMzMzMyk7XG4gICAgICAvLyAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dlb21ldHJ5XSwgLy8gQHRvZG8gVHJhbnNmb3JtOiBBcyBvcHRpb25hbCwgaG93IHRvIGRlZmluZSBpdD9cbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IEdMVEZMb2FkZXIgYXMgR0xURkxvYWRlclRocmVlIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbSwgU3lzdGVtU3RhdGVDb21wb25lbnQsIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcbmltcG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTG9hZGVyLmpzXCI7XG5cbi8vIEB0b2RvIFVzZSBwYXJhbWV0ZXIgYW5kIGxvYWRlciBtYW5hZ2VyXG52YXIgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXJUaHJlZSgpOyAvLy5zZXRQYXRoKFwiL2Fzc2V0cy9tb2RlbHMvXCIpO1xuXG5jbGFzcyBHTFRGTG9hZGVyU3RhdGUgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7fVxuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy53b3JsZC5yZWdpc3RlckNvbXBvbmVudChHTFRGTG9hZGVyU3RhdGUpLnJlZ2lzdGVyQ29tcG9uZW50KEdMVEZNb2RlbCk7XG4gICAgdGhpcy5sb2FkZWQgPSBbXTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgY29uc3QgdG9Mb2FkID0gdGhpcy5xdWVyaWVzLnRvTG9hZC5yZXN1bHRzO1xuICAgIHdoaWxlICh0b0xvYWQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0b0xvYWRbMF07XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEdMVEZMb2FkZXJTdGF0ZSk7XG4gICAgICBsb2FkZXIubG9hZChlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZMb2FkZXIpLnVybCwgZ2x0ZiA9PlxuICAgICAgICB0aGlzLmxvYWRlZC5wdXNoKFtlbnRpdHksIGdsdGZdKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBEbyB0aGUgYWN0dWFsIGVudGl0eSBjcmVhdGlvbiBpbnNpZGUgdGhlIHN5c3RlbSB0aWNrIG5vdCBpbiB0aGUgbG9hZGVyIGNhbGxiYWNrXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvYWRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgW2VudGl0eSwgZ2x0Zl0gPSB0aGlzLmxvYWRlZFtpXTtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURkxvYWRlcik7XG4gICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICBjaGlsZC5yZWNlaXZlU2hhZG93ID0gY29tcG9uZW50LnJlY2VpdmVTaGFkb3c7XG4gICAgICAgICAgY2hpbGQuY2FzdFNoYWRvdyA9IGNvbXBvbmVudC5jYXN0U2hhZG93O1xuXG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZSkge1xuICAgICAgICAgICAgY2hpbGQubWF0ZXJpYWwuZW52TWFwID0gY29tcG9uZW50LmVudk1hcE92ZXJyaWRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvKlxuICAgICAgdGhpcy53b3JsZFxuICAgICAgICAuY3JlYXRlRW50aXR5KClcbiAgICAgICAgLmFkZENvbXBvbmVudChHTFRGTW9kZWwsIHsgdmFsdWU6IGdsdGYgfSlcbiAgICAgICAgLmFkZE9iamVjdDNEQ29tcG9uZW50KGdsdGYuc2NlbmUsIGNvbXBvbmVudC5hcHBlbmQgJiYgZW50aXR5KTtcbiovXG5cbiAgICAgIGVudGl0eVxuICAgICAgICAuYWRkQ29tcG9uZW50KEdMVEZNb2RlbCwgeyB2YWx1ZTogZ2x0ZiB9KVxuICAgICAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQoZ2x0Zi5zY2VuZSwgY29tcG9uZW50LnBhcmVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQub25Mb2FkZWQpIHtcbiAgICAgICAgY29tcG9uZW50Lm9uTG9hZGVkKGdsdGYuc2NlbmUsIGdsdGYpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxvYWRlZC5sZW5ndGggPSAwO1xuXG4gICAgY29uc3QgdG9VbmxvYWQgPSB0aGlzLnF1ZXJpZXMudG9VbmxvYWQucmVzdWx0cztcbiAgICB3aGlsZSAodG9VbmxvYWQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0b1VubG9hZFswXTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoR0xURkxvYWRlclN0YXRlKTtcbiAgICAgIGVudGl0eS5yZW1vdmVPYmplY3QzRENvbXBvbmVudCgpO1xuICAgIH1cbiAgfVxufVxuXG5HTFRGTG9hZGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHRvTG9hZDoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyLCBOb3QoR0xURkxvYWRlclN0YXRlKV1cbiAgfSxcbiAgdG9VbmxvYWQ6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURkxvYWRlclN0YXRlLCBOb3QoR0xURkxvYWRlcildXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTa3lCb3ggfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29yZS9PYmplY3QzRENvbXBvbmVudC5qc1wiO1xuXG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuXG4gICAgICBsZXQgc2t5Ym94ID0gZW50aXR5LmdldENvbXBvbmVudChTa3lCb3gpO1xuXG4gICAgICBsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgaWYgKHNreWJveC50eXBlID09PSBcImN1YmVtYXAtc3RlcmVvXCIpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHNreWJveC50ZXh0dXJlVXJsLCAxMik7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgIHNreUJveC5sYXllcnMuc2V0KDEpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94KTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzUiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3hSID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsc1IpO1xuICAgICAgICBza3lCb3hSLmxheWVycy5zZXQoMik7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3hSKTtcblxuICAgICAgICBlbnRpdHkuYWRkT2JqZWN0M0RDb21wb25lbnQoZ3JvdXAsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gc2t5Ym94IHR5cGU6IFwiLCBza3lib3gudHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShhdGxhc0ltZ1VybCwgdGlsZXNOdW0pIHtcbiAgbGV0IHRleHR1cmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc051bTsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB9XG5cbiAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcigpO1xuICBsb2FkZXIubG9hZChhdGxhc0ltZ1VybCwgZnVuY3Rpb24oaW1hZ2VPYmopIHtcbiAgICBsZXQgY2FudmFzLCBjb250ZXh0O1xuICAgIGxldCB0aWxlV2lkdGggPSBpbWFnZU9iai5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGlsZVdpZHRoO1xuICAgICAgY2FudmFzLndpZHRoID0gdGlsZVdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIGltYWdlT2JqLFxuICAgICAgICB0aWxlV2lkdGggKiBpLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGhcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlc1tpXS5pbWFnZSA9IGNhbnZhcztcbiAgICAgIHRleHR1cmVzW2ldLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0ZXh0dXJlcztcbn1cblxuU2t5Qm94U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1NreUJveCwgTm90KE9iamVjdDNEQ29tcG9uZW50KV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWaXNpYmxlIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uLy4uL2NvcmUvT2JqZWN0M0RDb21wb25lbnQuanNcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2liaWxpdHlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBwcm9jZXNzVmlzaWJpbGl0eShlbnRpdGllcykge1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRPYmplY3QzRCgpLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZpc2libGUpLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRENvbXBvbmVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRNZXNoIH0gZnJvbSBcInRyb2lrYS0zZC10ZXh0L2Rpc3QvdGV4dG1lc2gtc3RhbmRhbG9uZS5lc20uanNcIjtcbmltcG9ydCB7IFRleHQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vLi4vY29yZS9PYmplY3QzRENvbXBvbmVudC5qc1wiO1xuXG5jb25zdCBhbmNob3JNYXBwaW5nID0ge1xuICBsZWZ0OiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgcmlnaHQ6IDFcbn07XG5jb25zdCBiYXNlbGluZU1hcHBpbmcgPSB7XG4gIHRvcDogMCxcbiAgY2VudGVyOiAwLjUsXG4gIGJvdHRvbTogMVxufTtcblxuZXhwb3J0IGNsYXNzIFNERlRleHRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICB1cGRhdGVUZXh0KHRleHRNZXNoLCB0ZXh0Q29tcG9uZW50KSB7XG4gICAgdGV4dE1lc2gudGV4dCA9IHRleHRDb21wb25lbnQudGV4dDtcbiAgICB0ZXh0TWVzaC50ZXh0QWxpZ24gPSB0ZXh0Q29tcG9uZW50LnRleHRBbGlnbjtcbiAgICB0ZXh0TWVzaC5hbmNob3JbMF0gPSBhbmNob3JNYXBwaW5nW3RleHRDb21wb25lbnQuYW5jaG9yXTtcbiAgICB0ZXh0TWVzaC5hbmNob3JbMV0gPSBiYXNlbGluZU1hcHBpbmdbdGV4dENvbXBvbmVudC5iYXNlbGluZV07XG4gICAgdGV4dE1lc2guY29sb3IgPSB0ZXh0Q29tcG9uZW50LmNvbG9yO1xuICAgIHRleHRNZXNoLmZvbnQgPSB0ZXh0Q29tcG9uZW50LmZvbnQ7XG4gICAgdGV4dE1lc2guZm9udFNpemUgPSB0ZXh0Q29tcG9uZW50LmZvbnRTaXplO1xuICAgIHRleHRNZXNoLmxldHRlclNwYWNpbmcgPSB0ZXh0Q29tcG9uZW50LmxldHRlclNwYWNpbmcgfHwgMDtcbiAgICB0ZXh0TWVzaC5saW5lSGVpZ2h0ID0gdGV4dENvbXBvbmVudC5saW5lSGVpZ2h0IHx8IG51bGw7XG4gICAgdGV4dE1lc2gub3ZlcmZsb3dXcmFwID0gdGV4dENvbXBvbmVudC5vdmVyZmxvd1dyYXA7XG4gICAgdGV4dE1lc2gud2hpdGVTcGFjZSA9IHRleHRDb21wb25lbnQud2hpdGVTcGFjZTtcbiAgICB0ZXh0TWVzaC5tYXhXaWR0aCA9IHRleHRDb21wb25lbnQubWF4V2lkdGg7XG4gICAgdGV4dE1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHRleHRDb21wb25lbnQub3BhY2l0eTtcbiAgICB0ZXh0TWVzaC5zeW5jKCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcztcblxuICAgIGVudGl0aWVzLmFkZGVkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGUuZ2V0Q29tcG9uZW50KFRleHQpO1xuXG4gICAgICBjb25zdCB0ZXh0TWVzaCA9IG5ldyBUZXh0TWVzaCgpO1xuICAgICAgdGV4dE1lc2gubmFtZSA9IFwidGV4dE1lc2hcIjtcbiAgICAgIHRleHRNZXNoLmFuY2hvciA9IFswLCAwXTtcbiAgICAgIHRleHRNZXNoLnJlbmRlck9yZGVyID0gMTA7IC8vYnJ1dGUtZm9yY2UgZml4IGZvciB1Z2x5IGFudGlhbGlhc2luZywgc2VlIGlzc3VlICM2N1xuICAgICAgdGhpcy51cGRhdGVUZXh0KHRleHRNZXNoLCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIGUuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiB0ZXh0TWVzaCB9KTtcbiAgICB9KTtcblxuICAgIGVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciBvYmplY3QzRCA9IGUuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIHZhciB0ZXh0TWVzaCA9IG9iamVjdDNELmdldE9iamVjdEJ5TmFtZShcInRleHRNZXNoXCIpO1xuICAgICAgdGV4dE1lc2guZGlzcG9zZSgpO1xuICAgICAgb2JqZWN0M0QucmVtb3ZlKHRleHRNZXNoKTtcbiAgICB9KTtcblxuICAgIGVudGl0aWVzLmNoYW5nZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciBvYmplY3QzRCA9IGUuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIGlmIChvYmplY3QzRCBpbnN0YW5jZW9mIFRleHRNZXNoKSB7XG4gICAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGV4dChvYmplY3QzRCwgdGV4dENvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuU0RGVGV4dFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtUZXh0XVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLFxuICBWUkNvbnRyb2xsZXIsXG4gIENvbnRyb2xsZXJDb25uZWN0ZWRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXJDb250ZXh0IH0gZnJvbSBcIi4vV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuXG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuLi8uLi9jb3JlL09iamVjdDNEQ29tcG9uZW50LmpzXCI7XG5pbXBvcnQgeyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1hSQ29udHJvbGxlck1vZGVsRmFjdG9yeS5qc1wiO1xuXG52YXIgY29udHJvbGxlck1vZGVsRmFjdG9yeSA9IG5ldyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkoKTtcblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVyID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVyQ29udGV4dC5yZXN1bHRzWzBdLmdldENvbXBvbmVudChcbiAgICAgIFdlYkdMUmVuZGVyZXJDb250ZXh0XG4gICAgKS52YWx1ZTtcblxuICAgIHRoaXMucXVlcmllcy5jb250cm9sbGVycy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29udHJvbGxlcklkID0gZW50aXR5LmdldENvbXBvbmVudChWUkNvbnRyb2xsZXIpLmlkO1xuICAgICAgdmFyIGNvbnRyb2xsZXIgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyLm5hbWUgPSBcImNvbnRyb2xsZXJcIjtcblxuICAgICAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlcik7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiBncm91cCB9KTtcblxuICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwiY29ubmVjdGVkXCIsICgpID0+IHtcbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChDb250cm9sbGVyQ29ubmVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJkaXNjb25uZWN0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KENvbnRyb2xsZXJDb25uZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKSkge1xuICAgICAgICB2YXIgYmVoYXZpb3VyID0gZW50aXR5LmdldENvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cik7XG4gICAgICAgIE9iamVjdC5rZXlzKGJlaGF2aW91cikuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgICAgIGlmIChiZWhhdmlvdXJbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgYmVoYXZpb3VyW2V2ZW50TmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBYUkNvbnRyb2xsZXJNb2RlbEZhY3Rvcnkgd2lsbCBhdXRvbWF0aWNhbGx5IGZldGNoIGNvbnRyb2xsZXIgbW9kZWxzXG4gICAgICAvLyB0aGF0IG1hdGNoIHdoYXQgdGhlIHVzZXIgaXMgaG9sZGluZyBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlLiBUaGUgbW9kZWxzXG4gICAgICAvLyBzaG91bGQgYmUgYXR0YWNoZWQgdG8gdGhlIG9iamVjdCByZXR1cm5lZCBmcm9tIGdldENvbnRyb2xsZXJHcmlwIGluXG4gICAgICAvLyBvcmRlciB0byBtYXRjaCB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGhlbGQgZGV2aWNlLlxuICAgICAgbGV0IGNvbnRyb2xsZXJHcmlwID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlckdyaXAoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXJHcmlwLmFkZChcbiAgICAgICAgY29udHJvbGxlck1vZGVsRmFjdG9yeS5jcmVhdGVDb250cm9sbGVyTW9kZWwoY29udHJvbGxlckdyaXApXG4gICAgICApO1xuICAgICAgZ3JvdXAuYWRkKGNvbnRyb2xsZXJHcmlwKTtcbiAgICAgIC8qXG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcbiAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZShcbiAgICAgICAgXCJwb3NpdGlvblwiLFxuICAgICAgICBuZXcgVEhSRUUuRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZShbMCwgMCwgMCwgMCwgMCwgLTFdLCAzKVxuICAgICAgKTtcblxuICAgICAgdmFyIGxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSk7XG4gICAgICBsaW5lLm5hbWUgPSBcImxpbmVcIjtcbiAgICAgIGxpbmUuc2NhbGUueiA9IDU7XG4gICAgICBncm91cC5hZGQobGluZSk7XG5cbiAgICAgIGxldCBnZW9tZXRyeTIgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMC4xLCAwLjEsIDAuMSk7XG4gICAgICBsZXQgbWF0ZXJpYWwyID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4MDBmZjAwIH0pO1xuICAgICAgbGV0IGN1YmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeTIsIG1hdGVyaWFsMik7XG4gICAgICBncm91cC5uYW1lID0gXCJWUkNvbnRyb2xsZXJcIjtcbiAgICAgIGdyb3VwLmFkZChjdWJlKTtcbiovXG4gICAgfSk7XG5cbiAgICAvLyB0aGlzLmNsZWFuSW50ZXJzZWN0ZWQoKTtcbiAgfVxufVxuXG5WUkNvbnRyb2xsZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY29udHJvbGxlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbVlJDb250cm9sbGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgICAvL2NoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyZXJDb250ZXh0OiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBtYW5kYXRvcnk6IHRydWVcbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFBsYXksIFN0b3AsIEdMVEZNb2RlbCwgQW5pbWF0aW9uIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCB7IEFuaW1hdGlvbk1peGVyIH0gZnJvbSBcInRocmVlXCI7XG5cbmNsYXNzIEFuaW1hdGlvbk1peGVyQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5BbmltYXRpb25NaXhlckNvbXBvbmVudC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuXG5jbGFzcyBBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5BbmltYXRpb25BY3Rpb25zQ29tcG9uZW50LnNjaGVtYSA9IHtcbiAgYW5pbWF0aW9uczogeyBkZWZhdWx0OiBbXSwgdHlwZTogVHlwZXMuQXJyYXkgfSxcbiAgZHVyYXRpb246IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG5cbmV4cG9ydCBjbGFzcyBBbmltYXRpb25TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMud29ybGRcbiAgICAgIC5yZWdpc3RlckNvbXBvbmVudChBbmltYXRpb25NaXhlckNvbXBvbmVudClcbiAgICAgIC5yZWdpc3RlckNvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50KTtcbiAgfVxuXG4gIGV4ZWN1dGUoZGVsdGEpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGdsdGYgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZNb2RlbCkudmFsdWU7XG4gICAgICBsZXQgbWl4ZXIgPSBuZXcgVEhSRUUuQW5pbWF0aW9uTWl4ZXIoZ2x0Zi5zY2VuZSk7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEFuaW1hdGlvbk1peGVyQ29tcG9uZW50LCB7XG4gICAgICAgIHZhbHVlOiBtaXhlclxuICAgICAgfSk7XG5cbiAgICAgIGxldCBhbmltYXRpb25zID0gW107XG4gICAgICBnbHRmLmFuaW1hdGlvbnMuZm9yRWFjaChhbmltYXRpb25DbGlwID0+IHtcbiAgICAgICAgY29uc3QgYWN0aW9uID0gbWl4ZXIuY2xpcEFjdGlvbihhbmltYXRpb25DbGlwLCBnbHRmLnNjZW5lKTtcbiAgICAgICAgYWN0aW9uLmxvb3AgPSBUSFJFRS5Mb29wT25jZTtcbiAgICAgICAgYW5pbWF0aW9ucy5wdXNoKGFjdGlvbik7XG4gICAgICB9KTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50LCB7XG4gICAgICAgIGFuaW1hdGlvbnM6IGFuaW1hdGlvbnMsXG4gICAgICAgIGR1cmF0aW9uOiBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbikuZHVyYXRpb25cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLm1peGVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQpLnZhbHVlLnVwZGF0ZShkZWx0YSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucGxheUNsaXBzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCk7XG4gICAgICBjb21wb25lbnQuYW5pbWF0aW9ucy5mb3JFYWNoKGFjdGlvbkNsaXAgPT4ge1xuICAgICAgICBpZiAoY29tcG9uZW50LmR1cmF0aW9uICE9PSAtMSkge1xuICAgICAgICAgIGFjdGlvbkNsaXAuc2V0RHVyYXRpb24oY29tcG9uZW50LmR1cmF0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGFjdGlvbkNsaXAuY2xhbXBXaGVuRmluaXNoZWQgPSB0cnVlO1xuICAgICAgICBhY3Rpb25DbGlwLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkNsaXAucGxheSgpO1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFBsYXkpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLnN0b3BDbGlwcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBhbmltYXRpb25zID0gZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50KVxuICAgICAgICAuYW5pbWF0aW9ucztcbiAgICAgIGFuaW1hdGlvbnMuZm9yRWFjaChhY3Rpb25DbGlwID0+IHtcbiAgICAgICAgYWN0aW9uQ2xpcC5yZXNldCgpO1xuICAgICAgICBhY3Rpb25DbGlwLnN0b3AoKTtcbiAgICAgIH0pO1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChTdG9wKTtcbiAgICB9KTtcbiAgfVxufVxuXG5BbmltYXRpb25TeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uLCBHTFRGTW9kZWxdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIG1peGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb25NaXhlckNvbXBvbmVudF1cbiAgfSxcbiAgcGxheUNsaXBzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIFBsYXldXG4gIH0sXG4gIHN0b3BDbGlwczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50LCBTdG9wXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLFxuICBWUkNvbnRyb2xsZXIsXG4gIElucHV0U3RhdGVcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIElucHV0U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICAvLyEhISEhISEhISEhISFcbiAgICB0aGlzLndvcmxkLnJlZ2lzdGVyQ29tcG9uZW50KElucHV0U3RhdGUpO1xuXG4gICAgbGV0IGVudGl0eSA9IHRoaXMud29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KElucHV0U3RhdGUpO1xuICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KElucHV0U3RhdGUpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWUkNvbnRyb2xsZXJzKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzS2V5Ym9hcmQoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NNb3VzZSgpO1xuICAgIC8vIHRoaXMucHJvY2Vzc0dhbWVwYWRzKCk7XG4gIH1cblxuICBwcm9jZXNzVlJDb250cm9sbGVycygpIHtcbiAgICAvLyBQcm9jZXNzIHJlY2VudGx5IGFkZGVkIGNvbnRyb2xsZXJzXG4gICAgdGhpcy5xdWVyaWVzLnZyY29udHJvbGxlcnMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ciwge1xuICAgICAgICBzZWxlY3RzdGFydDogZXZlbnQgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmdldChldmVudC50YXJnZXQpO1xuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgfSxcbiAgICAgICAgc2VsZWN0ZW5kOiBldmVudCA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZ2V0KGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICB9LFxuICAgICAgICBjb25uZWN0ZWQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5zZXQoZXZlbnQudGFyZ2V0LCB7fSk7XG4gICAgICAgIH0sXG4gICAgICAgIGRpc2Nvbm5lY3RlZDogZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmRlbGV0ZShldmVudC50YXJnZXQpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFVwZGF0ZSBzdGF0ZVxuICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmZvckVhY2goc3RhdGUgPT4ge1xuICAgICAgc3RhdGUuc2VsZWN0U3RhcnQgPSBzdGF0ZS5zZWxlY3RlZCAmJiAhc3RhdGUucHJldlNlbGVjdGVkO1xuICAgICAgc3RhdGUuc2VsZWN0RW5kID0gIXN0YXRlLnNlbGVjdGVkICYmIHN0YXRlLnByZXZTZWxlY3RlZDtcbiAgICAgIHN0YXRlLnByZXZTZWxlY3RlZCA9IHN0YXRlLnNlbGVjdGVkO1xuICAgIH0pO1xuICB9XG59XG5cbklucHV0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHZyY29udHJvbGxlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbVlJDb250cm9sbGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMgZXh0ZW5kcyBUSFJFRS5PYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKGxpc3RlbmVyLCBwb29sU2l6ZSkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICAgIHRoaXMuY29udGV4dCA9IGxpc3RlbmVyLmNvbnRleHQ7XG5cbiAgICB0aGlzLnBvb2xTaXplID0gcG9vbFNpemUgfHwgNTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucG9vbFNpemU7IGkrKykge1xuICAgICAgdGhpcy5jaGlsZHJlbi5wdXNoKG5ldyBUSFJFRS5Qb3NpdGlvbmFsQXVkaW8obGlzdGVuZXIpKTtcbiAgICB9XG4gIH1cblxuICBzZXRCdWZmZXIoYnVmZmVyKSB7XG4gICAgdGhpcy5jaGlsZHJlbi5mb3JFYWNoKHNvdW5kID0+IHtcbiAgICAgIHNvdW5kLnNldEJ1ZmZlcihidWZmZXIpO1xuICAgIH0pO1xuICB9XG5cbiAgcGxheSgpIHtcbiAgICB2YXIgZm91bmQgPSBmYWxzZTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBzb3VuZCA9IHRoaXMuY2hpbGRyZW5baV07XG4gICAgICBpZiAoIXNvdW5kLmlzUGxheWluZyAmJiBzb3VuZC5idWZmZXIgJiYgIWZvdW5kKSB7XG4gICAgICAgIHNvdW5kLnBsYXkoKTtcbiAgICAgICAgc291bmQuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgZm91bmQgPSB0cnVlO1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWZvdW5kKSB7XG4gICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgIFwiQWxsIHRoZSBzb3VuZHMgYXJlIHBsYXlpbmcuIElmIHlvdSBuZWVkIHRvIHBsYXkgbW9yZSBzb3VuZHMgc2ltdWx0YW5lb3VzbHkgY29uc2lkZXIgaW5jcmVhc2luZyB0aGUgcG9vbCBzaXplXCJcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTb3VuZCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyBmcm9tIFwiLi4vbGliL1Bvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMuanNcIjtcblxuZXhwb3J0IGNsYXNzIFNvdW5kU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmxpc3RlbmVyID0gbmV3IFRIUkVFLkF1ZGlvTGlzdGVuZXIoKTtcbiAgfVxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5zb3VuZHMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoU291bmQpO1xuICAgICAgY29uc3Qgc291bmQgPSBuZXcgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyh0aGlzLmxpc3RlbmVyLCAxMCk7XG4gICAgICBjb25zdCBhdWRpb0xvYWRlciA9IG5ldyBUSFJFRS5BdWRpb0xvYWRlcigpO1xuICAgICAgYXVkaW9Mb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBidWZmZXIgPT4ge1xuICAgICAgICBzb3VuZC5zZXRCdWZmZXIoYnVmZmVyKTtcbiAgICAgIH0pO1xuICAgICAgY29tcG9uZW50LnNvdW5kID0gc291bmQ7XG4gICAgfSk7XG4gIH1cbn1cblxuU291bmRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgc291bmRzOiB7XG4gICAgY29tcG9uZW50czogW1NvdW5kXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWUgLy8gW1NvdW5kXVxuICAgIH1cbiAgfVxufTtcbiJdLCJuYW1lcyI6WyJUSFJFRS5WZWN0b3IzIiwiVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSIsIlRIUkVFLldlYkdMUmVuZGVyZXIiLCJUSFJFRS5DbG9jayIsIlRIUkVFLlNjZW5lIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiLCJUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5IiwiVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCIsIlRIUkVFLk1lc2giLCJHTFRGTG9hZGVyVGhyZWUiLCJUSFJFRS5Hcm91cCIsIlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIiwiVEhSRUUuVGV4dHVyZSIsIlRIUkVFLkltYWdlTG9hZGVyIiwiVEhSRUUuQW5pbWF0aW9uTWl4ZXIiLCJUSFJFRS5Mb29wT25jZSIsIlRIUkVFLk9iamVjdDNEIiwiVEhSRUUuUG9zaXRp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QUNDcEMsTUFBTSxTQUFTLFNBQVMsU0FBUyxDQUFDLEVBQUU7QUFDM0MsU0FBUyxDQUFDLE1BQU0sR0FBRztFQUNqQixVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFO0VBQzlDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUM5QyxDQUFDOztBQ0pLLE1BQU0sTUFBTSxTQUFTLFNBQVMsQ0FBQyxFQUFFOztBQUV4QyxNQUFNLENBQUMsTUFBTSxHQUFHO0VBQ2QsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUN4QyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzFDLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDMUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUMxQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzFDLFlBQVksRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7Q0FDckQsQ0FBQzs7QUNUSyxNQUFNLFNBQVMsU0FBUyxTQUFTLENBQUMsRUFBRTtBQUMzQyxTQUFTLENBQUMsTUFBTSxHQUFHO0VBQ2pCLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDL0MsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVB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

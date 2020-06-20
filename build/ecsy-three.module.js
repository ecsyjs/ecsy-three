import { TagComponent, Component, Types, createType, copyCopyable, cloneClonable, System, Not, SystemStateComponent, _Entity, World } from 'ecsy';
export { Types } from 'ecsy';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, AnimationMixer, LoopOnce, Object3D, PositionalAudio, AudioListener, AudioLoader, Clock, Scene as Scene$1, PerspectiveCamera } from 'three';
import { GLTFLoader as GLTFLoader$1 } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'troika-3d-text/dist/textmesh-standalone.esm.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

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

class CollisionStart extends Component {}
CollisionStart.schema = {
  collidingWith: { default: [], type: Types.Array }
};

class CollisionStop extends Component {}
CollisionStop.schema = {
  collidingWith: { default: [], type: Types.Array }
};

class Draggable extends Component {}
Draggable.schema = {
  value: { default: false, type: Types.Boolean }
};

class Dragging extends TagComponent {}

class Environment extends Component {}
Environment.schema = {
  active: { default: false, type: Types.Boolean },
  preset: { default: "default", type: Types.String },
  seed: { default: 1, type: Types.Number },
  skyType: { default: "atmosphere", type: Types.String },
  skyColor: { default: "", type: Types.String },
  horizonColor: { default: "", type: Types.String },
  lighting: { default: "distant", type: Types.String },
  shadow: { default: false, type: Types.Boolean },
  shadowSize: { default: 10, type: Types.Number },
  lightPosition: { default: { x: 0, y: 1, z: -0.2 }, type: Types.Number },
  fog: { default: 0, type: Types.Number },

  flatShading: { default: false, type: Types.Boolean },
  playArea: { default: 1, type: Types.Number },

  ground: { default: "flat", type: Types.String },
  groundYScale: { default: 3, type: Types.Number },
  groundTexture: { default: "none", type: Types.String },
  groundColor: { default: "#553e35", type: Types.String },
  groundColor2: { default: "#694439", type: Types.String },

  dressing: { default: "none", type: Types.String },
  dressingAmount: { default: 10, type: Types.Number },
  dressingColor: { default: "#795449", type: Types.String },
  dressingScale: { default: 5, type: Types.Number },
  dressingVariance: { default: { x: 1, y: 1, z: 1 }, type: Types.Object },
  dressingUniformScale: { default: true, type: Types.Boolean },
  dressingOnPlayArea: { default: 0, type: Types.Number },

  grid: { default: "none", type: Types.String },
  gridColor: { default: "#ccc", type: Types.String }
};

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

class Material extends Component {}
Material.schema = {
  color: { default: 0xff0000, type: Types.Number },
  alphaTest: { default: 0, type: Types.Number },
  depthTest: { default: true, type: Types.Boolean },
  depthWrite: { default: true, type: Types.Boolean },
  flatShading: { default: false, type: Types.Boolean },
  npot: { default: false, type: Types.Boolean },
  offset: { default: new Vector2(), type: Types.Object },
  opacity: { default: 1.0, type: Types.Number },
  repeat: { default: new Vector2(1, 1), type: Types.Object },
  shader: { default: SHADERS.standard, type: Types.Number },
  side: { default: SIDES.front, type: Types.Number },
  transparent: { default: false, type: Types.Number },
  vertexColors: { default: VERTEX_COLORS.none, type: Types.Number },
  visible: { default: true, type: Types.Number },
  blending: { default: BLENDING.normal, type: Types.Number }
};

class Object3DComponent extends Component {}

Object3DComponent.schema = {
  value: { default: null, type: Types.Object }
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

const Vector3Type = createType({
  name: "Vector3",
  default: new Vector3(),
  copy: copyCopyable,
  clone: cloneClonable
});

const ThreeTypes = {
  Vector3Type
};

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

class Sky extends Component {}
Sky.schema = {
  attribute: { default: 0, type: Types.Number }
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

// @fixme remove
class TextGeometry extends Component {}
TextGeometry.schema = {
  attribute: { default: 0, type: Types.Number },
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
    .registerSystem(TransformSystem)
    .registerSystem(WebGLRendererSystem);

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

export { Active, Animation, AnimationSystem, Camera, CameraRig, Colliding, CollisionStart, CollisionStop, ControllerConnected, Draggable, Dragging, ECSYThreeWorld, Environment, EnvironmentSystem, GLTFLoader, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, InputState, InputSystem, Material, MaterialSystem, Object3DComponent, Parent, ParentObject3D, Play, Position, RenderPass, RigidBody, Rotation, SDFTextSystem, Scale, Scene, Shape, Sky, SkyBox, SkyBoxSystem, Sound, SoundSystem, Stop, Text, TextGeometry, TextGeometrySystem, ThreeTypes, Transform, TransformSystem, UpdateAspectOnResizeSystem, VRController, VRControllerBasicBehaviour, VRControllerSystem, Vector3Type, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, initialize };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0FuaW1hdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NvbGxpZGluZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NvbGxpc2lvblN0YXJ0LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RvcC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZMb2FkZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbnB1dFN0YXRlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvTWF0ZXJpYWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9PYmplY3QzRENvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1BhcmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1BhcmVudE9iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGxheS5qcyIsIi4uL3NyYy9UeXBlcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Bvc2l0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmVuZGVyUGFzcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JpZ2lkQm9keS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdGF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2NhbGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9TY2VuZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NoYXBlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU291bmQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9TdG9wLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHRHZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RyYW5zZm9ybS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Zpc2libGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WUkNvbnRyb2xsZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29udHJvbGxlckNvbm5lY3RlZC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNEVGFncy5qcyIsIi4uL3NyYy9zeXN0ZW1zL01hdGVyaWFsU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1NERlRleHRTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1ZSQ29udHJvbGxlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0FuaW1hdGlvblN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0lucHV0U3lzdGVtLmpzIiwiLi4vc3JjL2xpYi9Qb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljLmpzIiwiLi4vc3JjL3N5c3RlbXMvU291bmRTeXN0ZW0uanMiLCIuLi9zcmMvZW50aXR5LmpzIiwiLi4vc3JjL2RlZmF1bHRPYmplY3QzREluZmxhdG9yLmpzIiwiLi4vc3JjL3dvcmxkLmpzIiwiLi4vc3JjL2luaXRpYWxpemUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBBY3RpdmUgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5BbmltYXRpb24uc2NoZW1hID0ge1xuICBhbmltYXRpb25zOiB7IGRlZmF1bHQ6IFtdLCB0eXBlOiBUeXBlcy5BcnJheSB9LFxuICBkdXJhdGlvbjogeyBkZWZhdWx0OiAtMSwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5DYW1lcmEuc2NoZW1hID0ge1xuICBmb3Y6IHsgZGVmYXVsdDogNDUsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBhc3BlY3Q6IHsgZGVmYXVsdDogMSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIG5lYXI6IHsgZGVmYXVsdDogMC4xLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZmFyOiB7IGRlZmF1bHQ6IDEwMDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsYXllcnM6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGhhbmRsZVJlc2l6ZTogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYVJpZyBleHRlbmRzIENvbXBvbmVudCB7fVxuQ2FtZXJhUmlnLnNjaGVtYSA9IHtcbiAgbGVmdEhhbmQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHJpZ2h0SGFuZDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgY2FtZXJhOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDb2xsaWRpbmcgZXh0ZW5kcyBDb21wb25lbnQge31cbkNvbGxpZGluZy5zY2hlbWEgPSB7XG4gIGNvbGxpZGluZ1dpdGg6IHsgZGVmYXVsdDogW10sIHR5cGU6IFR5cGVzLkFycmF5IH0sXG4gIGNvbGxpZGluZ0ZyYW1lOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDb2xsaXNpb25TdGFydCBleHRlbmRzIENvbXBvbmVudCB7fVxuQ29sbGlzaW9uU3RhcnQuc2NoZW1hID0ge1xuICBjb2xsaWRpbmdXaXRoOiB7IGRlZmF1bHQ6IFtdLCB0eXBlOiBUeXBlcy5BcnJheSB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBDb2xsaXNpb25TdG9wIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Db2xsaXNpb25TdG9wLnNjaGVtYSA9IHtcbiAgY29sbGlkaW5nV2l0aDogeyBkZWZhdWx0OiBbXSwgdHlwZTogVHlwZXMuQXJyYXkgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgRHJhZ2dhYmxlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5EcmFnZ2FibGUuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9XG59O1xuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBEcmFnZ2luZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuRW52aXJvbm1lbnQuc2NoZW1hID0ge1xuICBhY3RpdmU6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgcHJlc2V0OiB7IGRlZmF1bHQ6IFwiZGVmYXVsdFwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgc2VlZDogeyBkZWZhdWx0OiAxLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgc2t5VHlwZTogeyBkZWZhdWx0OiBcImF0bW9zcGhlcmVcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIHNreUNvbG9yOiB7IGRlZmF1bHQ6IFwiXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LFxuICBob3Jpem9uQ29sb3I6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIGxpZ2h0aW5nOiB7IGRlZmF1bHQ6IFwiZGlzdGFudFwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgc2hhZG93OiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIHNoYWRvd1NpemU6IHsgZGVmYXVsdDogMTAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsaWdodFBvc2l0aW9uOiB7IGRlZmF1bHQ6IHsgeDogMCwgeTogMSwgejogLTAuMiB9LCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZm9nOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuXG4gIGZsYXRTaGFkaW5nOiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIHBsYXlBcmVhOiB7IGRlZmF1bHQ6IDEsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuXG4gIGdyb3VuZDogeyBkZWZhdWx0OiBcImZsYXRcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIGdyb3VuZFlTY2FsZTogeyBkZWZhdWx0OiAzLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZ3JvdW5kVGV4dHVyZTogeyBkZWZhdWx0OiBcIm5vbmVcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIGdyb3VuZENvbG9yOiB7IGRlZmF1bHQ6IFwiIzU1M2UzNVwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgZ3JvdW5kQ29sb3IyOiB7IGRlZmF1bHQ6IFwiIzY5NDQzOVwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcblxuICBkcmVzc2luZzogeyBkZWZhdWx0OiBcIm5vbmVcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIGRyZXNzaW5nQW1vdW50OiB7IGRlZmF1bHQ6IDEwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZHJlc3NpbmdDb2xvcjogeyBkZWZhdWx0OiBcIiM3OTU0NDlcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIGRyZXNzaW5nU2NhbGU6IHsgZGVmYXVsdDogNSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGRyZXNzaW5nVmFyaWFuY2U6IHsgZGVmYXVsdDogeyB4OiAxLCB5OiAxLCB6OiAxIH0sIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBkcmVzc2luZ1VuaWZvcm1TY2FsZTogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGRyZXNzaW5nT25QbGF5QXJlYTogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcblxuICBncmlkOiB7IGRlZmF1bHQ6IFwibm9uZVwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgZ3JpZENvbG9yOiB7IGRlZmF1bHQ6IFwiI2NjY1wiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgR2VvbWV0cnkgZXh0ZW5kcyBDb21wb25lbnQge31cbkdlb21ldHJ5LnNjaGVtYSA9IHtcbiAgcHJpbWl0aXZlOiB7IGRlZmF1bHQ6IFwiYm94XCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LFxuICB3aWR0aDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgaGVpZ2h0OiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBkZXB0aDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlciBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5HTFRGTG9hZGVyLnNjaGVtYSA9IHtcbiAgdXJsOiB7IGRlZmF1bHQ6IFwiXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LFxuICByZWNlaXZlU2hhZG93OiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGNhc3RTaGFkb3c6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgZW52TWFwT3ZlcnJpZGU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGFwcGVuZDogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIG9uTG9hZGVkOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBwYXJlbnQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIEdMVEZNb2RlbCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5HTFRGTW9kZWwuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRTdGF0ZSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5JbnB1dFN0YXRlLnNjaGVtYSA9IHtcbiAgdnJjb250cm9sbGVyczogeyBkZWZhdWx0OiBuZXcgTWFwKCksIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBrZXlib2FyZDogeyBkZWZhdWx0OiB7fSwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIG1vdXNlOiB7IGRlZmF1bHQ6IHt9LCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgZ2FtZXBhZHM6IHsgZGVmYXVsdDoge30sIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNvbnN0IFNJREVTID0ge1xuICBmcm9udDogMCxcbiAgYmFjazogMSxcbiAgZG91YmxlOiAyXG59O1xuXG5leHBvcnQgY29uc3QgU0hBREVSUyA9IHtcbiAgc3RhbmRhcmQ6IDAsXG4gIGZsYXQ6IDFcbn07XG5cbmV4cG9ydCBjb25zdCBCTEVORElORyA9IHtcbiAgbm9ybWFsOiAwLFxuICBhZGRpdGl2ZTogMSxcbiAgc3VidHJhY3RpdmU6IDIsXG4gIG11bHRpcGx5OiAzXG59O1xuXG5leHBvcnQgY29uc3QgVkVSVEVYX0NPTE9SUyA9IHtcbiAgbm9uZTogMCxcbiAgZmFjZTogMSxcbiAgdmVydGV4OiAyXG59O1xuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWwgZXh0ZW5kcyBDb21wb25lbnQge31cbk1hdGVyaWFsLnNjaGVtYSA9IHtcbiAgY29sb3I6IHsgZGVmYXVsdDogMHhmZjAwMDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBhbHBoYVRlc3Q6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGRlcHRoVGVzdDogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGRlcHRoV3JpdGU6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBmbGF0U2hhZGluZzogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBucG90OiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIG9mZnNldDogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMigpLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgb3BhY2l0eTogeyBkZWZhdWx0OiAxLjAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICByZXBlYXQ6IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjIoMSwgMSksIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBzaGFkZXI6IHsgZGVmYXVsdDogU0hBREVSUy5zdGFuZGFyZCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIHNpZGU6IHsgZGVmYXVsdDogU0lERVMuZnJvbnQsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICB0cmFuc3BhcmVudDogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIHZlcnRleENvbG9yczogeyBkZWZhdWx0OiBWRVJURVhfQ09MT1JTLm5vbmUsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICB2aXNpYmxlOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBibGVuZGluZzogeyBkZWZhdWx0OiBCTEVORElORy5ub3JtYWwsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBPYmplY3QzRENvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5PYmplY3QzRENvbXBvbmVudC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBQYXJlbnQgZXh0ZW5kcyBDb21wb25lbnQge31cblBhcmVudC5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBQYXJlbnRPYmplY3QzRCBleHRlbmRzIENvbXBvbmVudCB7fVxuUGFyZW50T2JqZWN0M0Quc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbn07XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFBsYXkgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IGNyZWF0ZVR5cGUsIGNvcHlDb3B5YWJsZSwgY2xvbmVDbG9uYWJsZSB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjb25zdCBWZWN0b3IzVHlwZSA9IGNyZWF0ZVR5cGUoe1xuICBuYW1lOiBcIlZlY3RvcjNcIixcbiAgZGVmYXVsdDogbmV3IFZlY3RvcjMoKSxcbiAgY29weTogY29weUNvcHlhYmxlLFxuICBjbG9uZTogY2xvbmVDbG9uYWJsZVxufSk7XG5cbmV4cG9ydCBjb25zdCBUaHJlZVR5cGVzID0ge1xuICBWZWN0b3IzVHlwZVxufTtcblxuZXhwb3J0IHsgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uL1R5cGVzLmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cblBvc2l0aW9uLnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cblJlbmRlclBhc3Muc2NoZW1hID0ge1xuICBzY2VuZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgY2FtZXJhOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBSaWdpZEJvZHkgZXh0ZW5kcyBDb21wb25lbnQge31cblJpZ2lkQm9keS5zY2hlbWEgPSB7XG4gIG9iamVjdDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgd2VpZ2h0OiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICByZXN0aXR1dGlvbjogeyBkZWZhdWx0OiAxLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZnJpY3Rpb246IHsgZGVmYXVsdDogMSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGxpbmVhckRhbXBpbmc6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGFuZ3VsYXJEYW1waW5nOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBsaW5lYXJWZWxvY2l0eTogeyBkZWZhdWx0OiB7IHg6IDAsIHk6IDAsIHo6IDAgfSwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUaHJlZVR5cGVzIGZyb20gXCIuLi9UeXBlcy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRpb24gZXh0ZW5kcyBDb21wb25lbnQge31cblJvdGF0aW9uLnNjaGVtYSA9IHtcbiAgLy8gQGZpeG1lXG4gIHJvdGF0aW9uOiB7IGRlZmF1bHQ6IG5ldyBUSFJFRS5WZWN0b3IzKCksIHR5cGU6IFRocmVlVHlwZXMuVmVjdG9yM1R5cGUgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uL1R5cGVzLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTY2FsZSBleHRlbmRzIENvbXBvbmVudCB7fVxuU2NhbGUuc2NoZW1hID0ge1xuICAvLyBAZml4bWVcbiAgdmFsdWU6IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgU2NlbmUgZXh0ZW5kcyBDb21wb25lbnQge31cblNjZW5lLnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNoYXBlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5TaGFwZS5zY2hlbWEgPSB7XG4gIHByaW1pdGl2ZTogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgd2lkdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGhlaWdodDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgZGVwdGg6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIHJhZGl1czogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5Ta3kuc2NoZW1hID0ge1xuICBhdHRyaWJ1dGU6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveCBleHRlbmRzIENvbXBvbmVudCB7fVxuU2t5Qm94LnNjaGVtYSA9IHtcbiAgdGV4dHVyZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgdHlwZTogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU291bmQgZXh0ZW5kcyBDb21wb25lbnQge31cblxuU291bmQuc2NoZW1hID0ge1xuICBzb3VuZDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgdXJsOiB7IGRlZmF1bHQ6IFwiXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9XG59O1xuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBTdG9wIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBDb21wb25lbnQge31cblRleHQuc2NoZW1hID0ge1xuICB0ZXh0OiB7IGRlZmF1bHQ6IFwiXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LFxuICB0ZXh0QWxpZ246IHsgZGVmYXVsdDogXCJsZWZ0XCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LCAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ11cbiAgYW5jaG9yOiB7IGRlZmF1bHQ6IFwiY2VudGVyXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LCAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJywgJ2FsaWduJ11cbiAgYmFzZWxpbmU6IHsgZGVmYXVsdDogXCJjZW50ZXJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsndG9wJywgJ2NlbnRlcicsICdib3R0b20nXVxuICBjb2xvcjogeyBkZWZhdWx0OiBcIiNGRkZcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sXG4gIGZvbnQ6IHsgZGVmYXVsdDogXCJcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vXCJodHRwczovL2NvZGUuY2RuLm1vemlsbGEubmV0L2ZvbnRzL3R0Zi9aaWxsYVNsYWItU2VtaUJvbGQudHRmXCJcbiAgZm9udFNpemU6IHsgZGVmYXVsdDogMC4yLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbGV0dGVyU3BhY2luZzogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbGluZUhlaWdodDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbWF4V2lkdGg6IHsgZGVmYXVsdDogSW5maW5pdHksIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBvdmVyZmxvd1dyYXA6IHsgZGVmYXVsdDogXCJub3JtYWxcIiwgdHlwZTogVHlwZXMuU3RyaW5nIH0sIC8vIFsnbm9ybWFsJywgJ2JyZWFrLXdvcmQnXVxuICB3aGl0ZVNwYWNlOiB7IGRlZmF1bHQ6IFwibm9ybWFsXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LCAvLyBbJ25vcm1hbCcsICdub3dyYXAnXVxuICBvcGFjaXR5OiB7IGRlZmF1bHQ6IDEsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbi8vIEBmaXhtZSByZW1vdmVcbmV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnkgZXh0ZW5kcyBDb21wb25lbnQge31cblRleHRHZW9tZXRyeS5zY2hlbWEgPSB7XG4gIGF0dHJpYnV0ZTogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbn07IiwiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRocmVlVHlwZXMgZnJvbSBcIi4uL1R5cGVzLmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5UcmFuc2Zvcm0uc2NoZW1hID0ge1xuICBwb3NpdGlvbjogeyBkZWZhdWx0OiBuZXcgVEhSRUUuVmVjdG9yMygpLCB0eXBlOiBUaHJlZVR5cGVzLlZlY3RvcjNUeXBlIH0sXG4gIHJvdGF0aW9uOiB7IGRlZmF1bHQ6IG5ldyBUSFJFRS5WZWN0b3IzKCksIHR5cGU6IFRocmVlVHlwZXMuVmVjdG9yM1R5cGUgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJsZSBleHRlbmRzIENvbXBvbmVudCB7fVxuVmlzaWJsZS5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5WUkNvbnRyb2xsZXIuc2NoZW1hID0ge1xuICBpZDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgY29udHJvbGxlcjogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5WUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ci5zY2hlbWEgPSB7XG4gIHNlbGVjdDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgc2VsZWN0c3RhcnQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHNlbGVjdGVuZDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcblxuICBjb25uZWN0ZWQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG5cbiAgc3F1ZWV6ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgc3F1ZWV6ZXN0YXJ0OiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBzcXVlZXplZW5kOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbldlYkdMUmVuZGVyZXIuc2NoZW1hID0ge1xuICB2cjogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBhcjogeyBkZWZhdWx0OiBmYWxzZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBhbnRpYWxpYXM6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9LFxuICBhbmltYXRpb25Mb29wOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyQ29ubmVjdGVkIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU2NlbmVUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBDYW1lcmFUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbmV4cG9ydCBjbGFzcyBNZXNoVGFnQ29tcG9uZW50IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVBc3BlY3RPblJlc2l6ZVRhZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0sIE5vdCwgU3lzdGVtU3RhdGVDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgTWF0ZXJpYWwsXG4gIE9iamVjdDNEQ29tcG9uZW50LFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuY2xhc3MgTWF0ZXJpYWxJbnN0YW5jZSBleHRlbmRzIFN5c3RlbVN0YXRlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLm5ldy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoTWF0ZXJpYWwpO1xuICAgIH0pO1xuICB9XG59XG5cbk1hdGVyaWFsU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIG5ldzoge1xuICAgIGNvbXBvbmVudHM6IFtNYXRlcmlhbCwgTm90KE1hdGVyaWFsSW5zdGFuY2UpXVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNEQ29tcG9uZW50LFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldFJlbW92ZWRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpLnZhbHVlO1xuICAgICAgdmFyIHBhcmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50LCB0cnVlKS52YWx1ZTtcbiAgICAgIHBhcmVudC5nZXRPYmplY3QzRCgpLnJlbW92ZShvYmplY3QpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR2VvbWV0cnkpO1xuXG4gICAgICB2YXIgZ2VvbWV0cnk7XG4gICAgICBzd2l0Y2ggKGNvbXBvbmVudC5wcmltaXRpdmUpIHtcbiAgICAgICAgY2FzZSBcInRvcnVzXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGl1cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YmUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpYWxTZWdtZW50cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YnVsYXJTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzcGhlcmVcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5KGNvbXBvbmVudC5yYWRpdXMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQud2lkdGgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5kZXB0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9XG4gICAgICAgIGNvbXBvbmVudC5wcmltaXRpdmUgPT09IFwidG9ydXNcIiA/IDB4OTk5OTAwIDogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KE1hdGVyaWFsKSkge1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgfVxuKi9cblxuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIGZsYXRTaGFkaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFRyYW5zZm9ybSkpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGlvbikge1xuICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoRWxlbWVudCkgJiYgIWVudGl0eS5oYXNDb21wb25lbnQoRHJhZ2dhYmxlKSkge1xuICAgICAgLy8gICAgICAgIG9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXQoMHgzMzMzMzMpO1xuICAgICAgLy8gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5HZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHZW9tZXRyeV0sIC8vIEB0b2RvIFRyYW5zZm9ybTogQXMgb3B0aW9uYWwsIGhvdyB0byBkZWZpbmUgaXQ/XG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBHTFRGTG9hZGVyIGFzIEdMVEZMb2FkZXJUaHJlZSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0sIFN5c3RlbVN0YXRlQ29tcG9uZW50LCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgR0xURk1vZGVsIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvR0xURk1vZGVsLmpzXCI7XG5pbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvR0xURkxvYWRlci5qc1wiO1xuXG4vLyBAdG9kbyBVc2UgcGFyYW1ldGVyIGFuZCBsb2FkZXIgbWFuYWdlclxudmFyIGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyVGhyZWUoKTsgLy8uc2V0UGF0aChcIi9hc3NldHMvbW9kZWxzL1wiKTtcblxuY2xhc3MgR0xURkxvYWRlclN0YXRlIGV4dGVuZHMgU3lzdGVtU3RhdGVDb21wb25lbnQge31cblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMud29ybGQucmVnaXN0ZXJDb21wb25lbnQoR0xURkxvYWRlclN0YXRlKS5yZWdpc3RlckNvbXBvbmVudChHTFRGTW9kZWwpO1xuICAgIHRoaXMubG9hZGVkID0gW107XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGNvbnN0IHRvTG9hZCA9IHRoaXMucXVlcmllcy50b0xvYWQucmVzdWx0cztcbiAgICB3aGlsZSAodG9Mb2FkLmxlbmd0aCkge1xuICAgICAgY29uc3QgZW50aXR5ID0gdG9Mb2FkWzBdO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChHTFRGTG9hZGVyU3RhdGUpO1xuICAgICAgbG9hZGVyLmxvYWQoZW50aXR5LmdldENvbXBvbmVudChHTFRGTG9hZGVyKS51cmwsIGdsdGYgPT5cbiAgICAgICAgdGhpcy5sb2FkZWQucHVzaChbZW50aXR5LCBnbHRmXSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gRG8gdGhlIGFjdHVhbCBlbnRpdHkgY3JlYXRpb24gaW5zaWRlIHRoZSBzeXN0ZW0gdGljayBub3QgaW4gdGhlIGxvYWRlciBjYWxsYmFja1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5sb2FkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IFtlbnRpdHksIGdsdGZdID0gdGhpcy5sb2FkZWRbaV07XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZMb2FkZXIpO1xuICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICBpZiAoY2hpbGQuaXNNZXNoKSB7XG4gICAgICAgICAgY2hpbGQucmVjZWl2ZVNoYWRvdyA9IGNvbXBvbmVudC5yZWNlaXZlU2hhZG93O1xuICAgICAgICAgIGNoaWxkLmNhc3RTaGFkb3cgPSBjb21wb25lbnQuY2FzdFNoYWRvdztcblxuICAgICAgICAgIGlmIChjb21wb25lbnQuZW52TWFwT3ZlcnJpZGUpIHtcbiAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLypcbiAgICAgIHRoaXMud29ybGRcbiAgICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAgIC5hZGRDb21wb25lbnQoR0xURk1vZGVsLCB7IHZhbHVlOiBnbHRmIH0pXG4gICAgICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChnbHRmLnNjZW5lLCBjb21wb25lbnQuYXBwZW5kICYmIGVudGl0eSk7XG4qL1xuXG4gICAgICBlbnRpdHlcbiAgICAgICAgLmFkZENvbXBvbmVudChHTFRGTW9kZWwsIHsgdmFsdWU6IGdsdGYgfSlcbiAgICAgICAgLmFkZE9iamVjdDNEQ29tcG9uZW50KGdsdGYuc2NlbmUsIGNvbXBvbmVudC5wYXJlbnQpO1xuXG4gICAgICBpZiAoY29tcG9uZW50Lm9uTG9hZGVkKSB7XG4gICAgICAgIGNvbXBvbmVudC5vbkxvYWRlZChnbHRmLnNjZW5lLCBnbHRmKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5sb2FkZWQubGVuZ3RoID0gMDtcblxuICAgIGNvbnN0IHRvVW5sb2FkID0gdGhpcy5xdWVyaWVzLnRvVW5sb2FkLnJlc3VsdHM7XG4gICAgd2hpbGUgKHRvVW5sb2FkLmxlbmd0aCkge1xuICAgICAgY29uc3QgZW50aXR5ID0gdG9VbmxvYWRbMF07XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KEdMVEZMb2FkZXJTdGF0ZSk7XG4gICAgICBlbnRpdHkucmVtb3ZlT2JqZWN0M0RDb21wb25lbnQoKTtcbiAgICB9XG4gIH1cbn1cblxuR0xURkxvYWRlclN5c3RlbS5xdWVyaWVzID0ge1xuICB0b0xvYWQ6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURkxvYWRlciwgTm90KEdMVEZMb2FkZXJTdGF0ZSldXG4gIH0sXG4gIHRvVW5sb2FkOiB7XG4gICAgY29tcG9uZW50czogW0dMVEZMb2FkZXJTdGF0ZSwgTm90KEdMVEZMb2FkZXIpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgU2t5Qm94LCBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuXG4gICAgICBsZXQgc2t5Ym94ID0gZW50aXR5LmdldENvbXBvbmVudChTa3lCb3gpO1xuXG4gICAgICBsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgaWYgKHNreWJveC50eXBlID09PSBcImN1YmVtYXAtc3RlcmVvXCIpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHNreWJveC50ZXh0dXJlVXJsLCAxMik7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgIHNreUJveC5sYXllcnMuc2V0KDEpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94KTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzUiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3hSID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsc1IpO1xuICAgICAgICBza3lCb3hSLmxheWVycy5zZXQoMik7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3hSKTtcblxuICAgICAgICBlbnRpdHkuYWRkT2JqZWN0M0RDb21wb25lbnQoZ3JvdXAsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gc2t5Ym94IHR5cGU6IFwiLCBza3lib3gudHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShhdGxhc0ltZ1VybCwgdGlsZXNOdW0pIHtcbiAgbGV0IHRleHR1cmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc051bTsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB9XG5cbiAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcigpO1xuICBsb2FkZXIubG9hZChhdGxhc0ltZ1VybCwgZnVuY3Rpb24oaW1hZ2VPYmopIHtcbiAgICBsZXQgY2FudmFzLCBjb250ZXh0O1xuICAgIGxldCB0aWxlV2lkdGggPSBpbWFnZU9iai5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGlsZVdpZHRoO1xuICAgICAgY2FudmFzLndpZHRoID0gdGlsZVdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIGltYWdlT2JqLFxuICAgICAgICB0aWxlV2lkdGggKiBpLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGhcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlc1tpXS5pbWFnZSA9IGNhbnZhcztcbiAgICAgIHRleHR1cmVzW2ldLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0ZXh0dXJlcztcbn1cblxuU2t5Qm94U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1NreUJveCwgTm90KE9iamVjdDNEQ29tcG9uZW50KV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWaXNpYmxlLCBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBWaXNpYmlsaXR5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgcHJvY2Vzc1Zpc2liaWxpdHkoZW50aXRpZXMpIHtcbiAgICBlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0T2JqZWN0M0QoKS52aXNpYmxlID0gZW50aXR5LmdldENvbXBvbmVudChWaXNpYmxlKS52YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQpO1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQpO1xuICB9XG59XG5cblZpc2liaWxpdHlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVmlzaWJsZSwgT2JqZWN0M0RDb21wb25lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBUZXh0TWVzaCB9IGZyb20gXCJ0cm9pa2EtM2QtdGV4dC9kaXN0L3RleHRtZXNoLXN0YW5kYWxvbmUuZXNtLmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCwgVGV4dCB9IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuXG5jb25zdCBhbmNob3JNYXBwaW5nID0ge1xuICBsZWZ0OiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgcmlnaHQ6IDFcbn07XG5jb25zdCBiYXNlbGluZU1hcHBpbmcgPSB7XG4gIHRvcDogMCxcbiAgY2VudGVyOiAwLjUsXG4gIGJvdHRvbTogMVxufTtcblxuZXhwb3J0IGNsYXNzIFNERlRleHRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICB1cGRhdGVUZXh0KHRleHRNZXNoLCB0ZXh0Q29tcG9uZW50KSB7XG4gICAgdGV4dE1lc2gudGV4dCA9IHRleHRDb21wb25lbnQudGV4dDtcbiAgICB0ZXh0TWVzaC50ZXh0QWxpZ24gPSB0ZXh0Q29tcG9uZW50LnRleHRBbGlnbjtcbiAgICB0ZXh0TWVzaC5hbmNob3JbMF0gPSBhbmNob3JNYXBwaW5nW3RleHRDb21wb25lbnQuYW5jaG9yXTtcbiAgICB0ZXh0TWVzaC5hbmNob3JbMV0gPSBiYXNlbGluZU1hcHBpbmdbdGV4dENvbXBvbmVudC5iYXNlbGluZV07XG4gICAgdGV4dE1lc2guY29sb3IgPSB0ZXh0Q29tcG9uZW50LmNvbG9yO1xuICAgIHRleHRNZXNoLmZvbnQgPSB0ZXh0Q29tcG9uZW50LmZvbnQ7XG4gICAgdGV4dE1lc2guZm9udFNpemUgPSB0ZXh0Q29tcG9uZW50LmZvbnRTaXplO1xuICAgIHRleHRNZXNoLmxldHRlclNwYWNpbmcgPSB0ZXh0Q29tcG9uZW50LmxldHRlclNwYWNpbmcgfHwgMDtcbiAgICB0ZXh0TWVzaC5saW5lSGVpZ2h0ID0gdGV4dENvbXBvbmVudC5saW5lSGVpZ2h0IHx8IG51bGw7XG4gICAgdGV4dE1lc2gub3ZlcmZsb3dXcmFwID0gdGV4dENvbXBvbmVudC5vdmVyZmxvd1dyYXA7XG4gICAgdGV4dE1lc2gud2hpdGVTcGFjZSA9IHRleHRDb21wb25lbnQud2hpdGVTcGFjZTtcbiAgICB0ZXh0TWVzaC5tYXhXaWR0aCA9IHRleHRDb21wb25lbnQubWF4V2lkdGg7XG4gICAgdGV4dE1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHRleHRDb21wb25lbnQub3BhY2l0eTtcbiAgICB0ZXh0TWVzaC5zeW5jKCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcztcblxuICAgIGVudGl0aWVzLmFkZGVkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGUuZ2V0Q29tcG9uZW50KFRleHQpO1xuXG4gICAgICBjb25zdCB0ZXh0TWVzaCA9IG5ldyBUZXh0TWVzaCgpO1xuICAgICAgdGV4dE1lc2gubmFtZSA9IFwidGV4dE1lc2hcIjtcbiAgICAgIHRleHRNZXNoLmFuY2hvciA9IFswLCAwXTtcbiAgICAgIHRleHRNZXNoLnJlbmRlck9yZGVyID0gMTA7IC8vYnJ1dGUtZm9yY2UgZml4IGZvciB1Z2x5IGFudGlhbGlhc2luZywgc2VlIGlzc3VlICM2N1xuICAgICAgdGhpcy51cGRhdGVUZXh0KHRleHRNZXNoLCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIGUuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiB0ZXh0TWVzaCB9KTtcbiAgICB9KTtcblxuICAgIGVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciBvYmplY3QzRCA9IGUuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIHZhciB0ZXh0TWVzaCA9IG9iamVjdDNELmdldE9iamVjdEJ5TmFtZShcInRleHRNZXNoXCIpO1xuICAgICAgdGV4dE1lc2guZGlzcG9zZSgpO1xuICAgICAgb2JqZWN0M0QucmVtb3ZlKHRleHRNZXNoKTtcbiAgICB9KTtcblxuICAgIGVudGl0aWVzLmNoYW5nZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciBvYmplY3QzRCA9IGUuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIGlmIChvYmplY3QzRCBpbnN0YW5jZW9mIFRleHRNZXNoKSB7XG4gICAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGV4dChvYmplY3QzRCwgdGV4dENvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuU0RGVGV4dFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtUZXh0XVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMsIFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFJlbmRlclBhc3MsXG4gIENhbWVyYVRhZ0NvbXBvbmVudCxcbiAgQWN0aXZlLFxuICBXZWJHTFJlbmRlcmVyXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFZSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9WUkJ1dHRvbi5qc1wiO1xuaW1wb3J0IHsgQVJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL0FSQnV0dG9uLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyQ29udGV4dCBleHRlbmRzIENvbXBvbmVudCB7fVxuV2ViR0xSZW5kZXJlckNvbnRleHQuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMud29ybGQucmVnaXN0ZXJDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgICAgICBjb21wb25lbnQud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCByZW5kZXJlcnMgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHM7XG4gICAgcmVuZGVyZXJzLmZvckVhY2gocmVuZGVyZXJFbnRpdHkgPT4ge1xuICAgICAgdmFyIHJlbmRlcmVyID0gcmVuZGVyZXJFbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJQYXNzZXMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgIHZhciBwYXNzID0gZW50aXR5LmdldENvbXBvbmVudChSZW5kZXJQYXNzKTtcbiAgICAgICAgdmFyIHNjZW5lID0gcGFzcy5zY2VuZS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICAgIHRoaXMucXVlcmllcy5hY3RpdmVDYW1lcmFzLnJlc3VsdHMuZm9yRWFjaChjYW1lcmFFbnRpdHkgPT4ge1xuICAgICAgICAgIHZhciBjYW1lcmEgPSBjYW1lcmFFbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFVuaW5pdGlhbGl6ZWQgcmVuZGVyZXJzXG4gICAgdGhpcy5xdWVyaWVzLnVuaW5pdGlhbGl6ZWRSZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcblxuICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgICBhbnRpYWxpYXM6IGNvbXBvbmVudC5hbnRpYWxpYXNcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0QW5pbWF0aW9uTG9vcChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgaWYgKGNvbXBvbmVudC5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSBjb21wb25lbnQuc2hhZG93TWFwO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICBpZiAoY29tcG9uZW50LnZyIHx8IGNvbXBvbmVudC5hcikge1xuICAgICAgICByZW5kZXJlci54ci5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LnZyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChWUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21wb25lbnQuYXIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKEFSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQsIHsgdmFsdWU6IHJlbmRlcmVyIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5jaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgdmFyIHJlbmRlcmVyID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICBpZiAoXG4gICAgICAgIGNvbXBvbmVudC53aWR0aCAhPT0gcmVuZGVyZXIud2lkdGggfHxcbiAgICAgICAgY29tcG9uZW50LmhlaWdodCAhPT0gcmVuZGVyZXIuaGVpZ2h0XG4gICAgICApIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZShjb21wb25lbnQud2lkdGgsIGNvbXBvbmVudC5oZWlnaHQpO1xuICAgICAgICAvLyBpbm5lcldpZHRoL2lubmVySGVpZ2h0XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuV2ViR0xSZW5kZXJlclN5c3RlbS5xdWVyaWVzID0ge1xuICB1bmluaXRpYWxpemVkUmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIE5vdChXZWJHTFJlbmRlcmVyQ29udGV4dCldXG4gIH0sXG4gIHJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBXZWJHTFJlbmRlcmVyQ29udGV4dF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbV2ViR0xSZW5kZXJlcl1cbiAgICB9XG4gIH0sXG4gIHJlbmRlclBhc3Nlczoge1xuICAgIGNvbXBvbmVudHM6IFtSZW5kZXJQYXNzXVxuICB9LFxuICBhY3RpdmVDYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYVRhZ0NvbXBvbmVudCwgQWN0aXZlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFBhcmVudE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIFBvc2l0aW9uLFxuICBTY2FsZSxcbiAgUGFyZW50LFxuICBPYmplY3QzRENvbXBvbmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBIaWVyYXJjaHlcbiAgICBsZXQgYWRkZWQgPSB0aGlzLnF1ZXJpZXMucGFyZW50LmFkZGVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBhZGRlZFtpXTtcbiAgICAgIGlmICghZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyIHBhcmVudEVudGl0eSA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZTtcbiAgICAgIGlmIChwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KSkge1xuICAgICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBwYXJlbnRFbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgICAgcGFyZW50T2JqZWN0M0QuYWRkKGNoaWxkT2JqZWN0M0QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhpZXJhcmNoeVxuICAgIHRoaXMucXVlcmllcy5wYXJlbnRPYmplY3QzRC5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBjaGlsZE9iamVjdDNEID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG4gICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgfSk7XG5cbiAgICAvLyBUcmFuc2Zvcm1zXG4gICAgdmFyIHRyYW5zZm9ybXMgPSB0aGlzLnF1ZXJpZXMudHJhbnNmb3JtcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmFkZGVkW2ldO1xuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmNoYW5nZWRbaV07XG4gICAgICBpZiAoIWVudGl0eS5hbGl2ZSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gUG9zaXRpb25cbiAgICBsZXQgcG9zaXRpb25zID0gdGhpcy5xdWVyaWVzLnBvc2l0aW9ucztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHBvc2l0aW9ucy5hZGRlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcblxuICAgICAgLy8gTGluayB0aGVtXG4gICAgICBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZSA9IG9iamVjdC5wb3NpdGlvbjtcbiAgICB9XG4vKlxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuKi9cbiAgICAvLyBTY2FsZVxuICAgIGxldCBzY2FsZXMgPSB0aGlzLnF1ZXJpZXMuc2NhbGVzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmFkZGVkW2ldO1xuICAgICAgbGV0IHNjYWxlID0gZW50aXR5LmdldENvbXBvbmVudChTY2FsZSkudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBzY2FsZXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3Quc2NhbGUuY29weShzY2FsZSk7XG4gICAgfVxuICB9XG59XG5cblRyYW5zZm9ybVN5c3RlbS5xdWVyaWVzID0ge1xuICBwYXJlbnRPYmplY3QzRDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnRPYmplY3QzRCwgT2JqZWN0M0RDb21wb25lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEQ29tcG9uZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmFuc2Zvcm1zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNEQ29tcG9uZW50LCBUcmFuc2Zvcm1dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVHJhbnNmb3JtXVxuICAgIH1cbiAgfSxcbiAgcG9zaXRpb25zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNEQ29tcG9uZW50LCBQb3NpdGlvbl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtQb3NpdGlvbl1cbiAgICB9XG4gIH0sXG4gIHNjYWxlczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgU2NhbGVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbU2NhbGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIENhbWVyYVRhZ0NvbXBvbmVudCxcbiAgVXBkYXRlQXNwZWN0T25SZXNpemVUYWcsXG4gIE9iamVjdDNEQ29tcG9uZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBVcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5hc3BlY3QgPSB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzaXplXCIsIHRoaXMuYXNwZWN0KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCBjYW1lcmFzID0gdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbWVyYXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjYW1lcmFPYmogPSBjYW1lcmFzW2ldLmdldE9iamVjdDNEKCk7XG4gICAgICBpZiAoY2FtZXJhT2JqLmFzcGVjdCAhPT0gdGhpcy5hc3BlY3QpIHtcbiAgICAgICAgY2FtZXJhT2JqLmFzcGVjdCA9IHRoaXMuYXNwZWN0O1xuICAgICAgICBjYW1lcmFPYmoudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5VcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYVRhZ0NvbXBvbmVudCwgVXBkYXRlQXNwZWN0T25SZXNpemVUYWcsIE9iamVjdDNEQ29tcG9uZW50XVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9PYmplY3QzRENvbXBvbmVudFwiO1xuaW1wb3J0IHsgVGV4dEdlb21ldHJ5IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5XCI7XG5cbmV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkZvbnRMb2FkZXIoKTtcbiAgICB0aGlzLmZvbnQgPSBudWxsO1xuICAgIC8qXG4gICAgbG9hZGVyLmxvYWQoXCIvYXNzZXRzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uXCIsIGZvbnQgPT4ge1xuICAgICAgdGhpcy5mb250ID0gZm9udDtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0pO1xuICAgICovXG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGlmICghdGhpcy5mb250KSByZXR1cm47XG5cbiAgICB2YXIgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkO1xuICAgIGNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcbiAgICAgIGVudGl0eS5nZXRPYmplY3QzRCgpLmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgfSk7XG5cbiAgICB2YXIgYWRkZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG4gICAgYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbG9yID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgY29sb3IgPSAweGZmZmZmZjtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiBtZXNoIH0pO1xuICAgIH0pO1xuICB9XG59XG5cblRleHRHZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0R2VvbWV0cnldLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50LCBTY2VuZSwgT2JqZWN0M0RDb21wb25lbnQsIEVudmlyb25tZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIEVudmlyb25tZW50U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW52aXJvbm1lbnRzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIC8vIHN0YWdlIGdyb3VuZCBkaWFtZXRlciAoYW5kIHNreSByYWRpdXMpXG4gICAgICB2YXIgU1RBR0VfU0laRSA9IDIwMDtcblxuICAgICAgLy8gY3JlYXRlIGdyb3VuZFxuICAgICAgLy8gdXBkYXRlIGdyb3VuZCwgcGxheWFyZWEgYW5kIGdyaWQgdGV4dHVyZXMuXG4gICAgICB2YXIgZ3JvdW5kUmVzb2x1dGlvbiA9IDIwNDg7XG4gICAgICB2YXIgdGV4TWV0ZXJzID0gMjA7IC8vIGdyb3VuZCB0ZXh0dXJlIG9mIDIwIHggMjAgbWV0ZXJzXG4gICAgICB2YXIgdGV4UmVwZWF0ID0gU1RBR0VfU0laRSAvIHRleE1ldGVycztcblxuICAgICAgdmFyIHJlc29sdXRpb24gPSA2NDsgLy8gbnVtYmVyIG9mIGRpdmlzaW9ucyBvZiB0aGUgZ3JvdW5kIG1lc2hcblxuICAgICAgdmFyIGdyb3VuZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBncm91bmRDYW52YXMud2lkdGggPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kQ2FudmFzLmhlaWdodCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICB2YXIgZ3JvdW5kVGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGdyb3VuZENhbnZhcyk7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLnJlcGVhdC5zZXQodGV4UmVwZWF0LCB0ZXhSZXBlYXQpO1xuXG4gICAgICB0aGlzLmVudmlyb25tZW50RGF0YSA9IHtcbiAgICAgICAgZ3JvdW5kQ29sb3I6IFwiIzQ1NDU0NVwiLFxuICAgICAgICBncm91bmRDb2xvcjI6IFwiIzVkNWQ1ZFwiXG4gICAgICB9O1xuXG4gICAgICB2YXIgZ3JvdW5kY3R4ID0gZ3JvdW5kQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgdmFyIHNpemUgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KDAsIDAsIHNpemUsIHNpemUpO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yMjtcbiAgICAgIHZhciBudW0gPSBNYXRoLmZsb29yKHRleE1ldGVycyAvIDIpO1xuICAgICAgdmFyIHN0ZXAgPSBzaXplIC8gKHRleE1ldGVycyAvIDIpOyAvLyAyIG1ldGVycyA9PSA8c3RlcD4gcGl4ZWxzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bSArIDE7IGkgKz0gMikge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bSArIDE7IGorKykge1xuICAgICAgICAgIGdyb3VuZGN0eC5maWxsUmVjdChcbiAgICAgICAgICAgIE1hdGguZmxvb3IoKGkgKyAoaiAlIDIpKSAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihqICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ3JvdW5kVGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgIHZhciBncm91bmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgbWFwOiBncm91bmRUZXh0dXJlXG4gICAgICB9KTtcblxuICAgICAgbGV0IHNjZW5lID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG4gICAgICAvL3NjZW5lLmFkZChtZXNoKTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICBTVEFHRV9TSVpFICsgMixcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIHJlc29sdXRpb24gLSAxLFxuICAgICAgICByZXNvbHV0aW9uIC0gMVxuICAgICAgKTtcblxuICAgICAgbGV0IG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBncm91bmRNYXRlcmlhbCk7XG4gICAgICBvYmplY3Qucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChQYXJlbnQsIHsgdmFsdWU6IHdpbmRvdy5lbnRpdHlTY2VuZSB9KTtcblxuICAgICAgY29uc3QgY29sb3IgPSAweDMzMzMzMztcbiAgICAgIGNvbnN0IG5lYXIgPSAyMDtcbiAgICAgIGNvbnN0IGZhciA9IDEwMDtcbiAgICAgIHNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2coY29sb3IsIG5lYXIsIGZhcik7XG4gICAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKGNvbG9yKTtcbiAgICB9KTtcbiAgfVxufVxuXG5FbnZpcm9ubWVudFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnZpcm9ubWVudHM6IHtcbiAgICBjb21wb25lbnRzOiBbU2NlbmUsIEVudmlyb25tZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlckNvbnRleHQsXG4gIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLFxuICBWUkNvbnRyb2xsZXIsXG4gIENvbnRyb2xsZXJDb25uZWN0ZWQsXG4gIE9iamVjdDNEQ29tcG9uZW50XG59IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuaW1wb3J0IHsgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5IH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9YUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkuanNcIjtcblxudmFyIGNvbnRyb2xsZXJNb2RlbEZhY3RvcnkgPSBuZXcgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5KCk7XG5cbmV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCByZW5kZXJlciA9IHRoaXMucXVlcmllcy5yZW5kZXJlckNvbnRleHQucmVzdWx0c1swXS5nZXRDb21wb25lbnQoXG4gICAgICBXZWJHTFJlbmRlcmVyQ29udGV4dFxuICAgICkudmFsdWU7XG5cbiAgICB0aGlzLnF1ZXJpZXMuY29udHJvbGxlcnMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGNvbnRyb2xsZXJJZCA9IGVudGl0eS5nZXRDb21wb25lbnQoVlJDb250cm9sbGVyKS5pZDtcbiAgICAgIHZhciBjb250cm9sbGVyID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlcihjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlci5uYW1lID0gXCJjb250cm9sbGVyXCI7XG5cbiAgICAgIHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgZ3JvdXAuYWRkKGNvbnRyb2xsZXIpO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG5cbiAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcImNvbm5lY3RlZFwiLCAoKSA9PiB7XG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQ29udHJvbGxlckNvbm5lY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKFwiZGlzY29ubmVjdGVkXCIsICgpID0+IHtcbiAgICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChDb250cm9sbGVyQ29ubmVjdGVkKTtcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cikpIHtcbiAgICAgICAgdmFyIGJlaGF2aW91ciA9IGVudGl0eS5nZXRDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpO1xuICAgICAgICBPYmplY3Qua2V5cyhiZWhhdmlvdXIpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICBpZiAoYmVoYXZpb3VyW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGJlaGF2aW91cltldmVudE5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5IHdpbGwgYXV0b21hdGljYWxseSBmZXRjaCBjb250cm9sbGVyIG1vZGVsc1xuICAgICAgLy8gdGhhdCBtYXRjaCB3aGF0IHRoZSB1c2VyIGlzIGhvbGRpbmcgYXMgY2xvc2VseSBhcyBwb3NzaWJsZS4gVGhlIG1vZGVsc1xuICAgICAgLy8gc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSBnZXRDb250cm9sbGVyR3JpcCBpblxuICAgICAgLy8gb3JkZXIgdG8gbWF0Y2ggdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBoZWxkIGRldmljZS5cbiAgICAgIGxldCBjb250cm9sbGVyR3JpcCA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXJHcmlwKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyR3JpcC5hZGQoXG4gICAgICAgIGNvbnRyb2xsZXJNb2RlbEZhY3RvcnkuY3JlYXRlQ29udHJvbGxlck1vZGVsKGNvbnRyb2xsZXJHcmlwKVxuICAgICAgKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyR3JpcCk7XG4gICAgICAvKlxuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIFwicG9zaXRpb25cIixcbiAgICAgICAgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoWzAsIDAsIDAsIDAsIDAsIC0xXSwgMylcbiAgICAgICk7XG5cbiAgICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnkpO1xuICAgICAgbGluZS5uYW1lID0gXCJsaW5lXCI7XG4gICAgICBsaW5lLnNjYWxlLnogPSA1O1xuICAgICAgZ3JvdXAuYWRkKGxpbmUpO1xuXG4gICAgICBsZXQgZ2VvbWV0cnkyID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDAuMSwgMC4xLCAwLjEpO1xuICAgICAgbGV0IG1hdGVyaWFsMiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDAwZmYwMCB9KTtcbiAgICAgIGxldCBjdWJlID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnkyLCBtYXRlcmlhbDIpO1xuICAgICAgZ3JvdXAubmFtZSA9IFwiVlJDb250cm9sbGVyXCI7XG4gICAgICBncm91cC5hZGQoY3ViZSk7XG4qL1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcy5jbGVhbkludGVyc2VjdGVkKCk7XG4gIH1cbn1cblxuVlJDb250cm9sbGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGNvbnRyb2xsZXJzOiB7XG4gICAgY29tcG9uZW50czogW1ZSQ29udHJvbGxlcl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgICAgLy9jaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH0sXG4gIHJlbmRlcmVyQ29udGV4dDoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyQ29udGV4dF0sXG4gICAgbWFuZGF0b3J5OiB0cnVlXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBQbGF5LCBTdG9wLCBHTFRGTW9kZWwsIEFuaW1hdGlvbiB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBBbmltYXRpb25NaXhlciB9IGZyb20gXCJ0aHJlZVwiO1xuXG5jbGFzcyBBbmltYXRpb25NaXhlckNvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcblxuY2xhc3MgQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCBleHRlbmRzIENvbXBvbmVudCB7fVxuQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudC5zY2hlbWEgPSB7XG4gIGFuaW1hdGlvbnM6IHsgZGVmYXVsdDogW10sIHR5cGU6IFR5cGVzLkFycmF5IH0sXG4gIGR1cmF0aW9uOiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9XG59O1xuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLndvcmxkXG4gICAgICAucmVnaXN0ZXJDb21wb25lbnQoQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQpXG4gICAgICAucmVnaXN0ZXJDb21wb25lbnQoQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCk7XG4gIH1cblxuICBleGVjdXRlKGRlbHRhKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBnbHRmID0gZW50aXR5LmdldENvbXBvbmVudChHTFRGTW9kZWwpLnZhbHVlO1xuICAgICAgbGV0IG1peGVyID0gbmV3IFRIUkVFLkFuaW1hdGlvbk1peGVyKGdsdGYuc2NlbmUpO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChBbmltYXRpb25NaXhlckNvbXBvbmVudCwge1xuICAgICAgICB2YWx1ZTogbWl4ZXJcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgYW5pbWF0aW9ucyA9IFtdO1xuICAgICAgZ2x0Zi5hbmltYXRpb25zLmZvckVhY2goYW5pbWF0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGNvbnN0IGFjdGlvbiA9IG1peGVyLmNsaXBBY3Rpb24oYW5pbWF0aW9uQ2xpcCwgZ2x0Zi5zY2VuZSk7XG4gICAgICAgIGFjdGlvbi5sb29wID0gVEhSRUUuTG9vcE9uY2U7XG4gICAgICAgIGFuaW1hdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgfSk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwge1xuICAgICAgICBhbmltYXRpb25zOiBhbmltYXRpb25zLFxuICAgICAgICBkdXJhdGlvbjogZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb24pLmR1cmF0aW9uXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5taXhlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbk1peGVyQ29tcG9uZW50KS52YWx1ZS51cGRhdGUoZGVsdGEpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLnBsYXlDbGlwcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQpO1xuICAgICAgY29tcG9uZW50LmFuaW1hdGlvbnMuZm9yRWFjaChhY3Rpb25DbGlwID0+IHtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5kdXJhdGlvbiAhPT0gLTEpIHtcbiAgICAgICAgICBhY3Rpb25DbGlwLnNldER1cmF0aW9uKGNvbXBvbmVudC5kdXJhdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBhY3Rpb25DbGlwLmNsYW1wV2hlbkZpbmlzaGVkID0gdHJ1ZTtcbiAgICAgICAgYWN0aW9uQ2xpcC5yZXNldCgpO1xuICAgICAgICBhY3Rpb25DbGlwLnBsYXkoKTtcbiAgICAgIH0pO1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChQbGF5KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5zdG9wQ2xpcHMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgYW5pbWF0aW9ucyA9IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudClcbiAgICAgICAgLmFuaW1hdGlvbnM7XG4gICAgICBhbmltYXRpb25zLmZvckVhY2goYWN0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGFjdGlvbkNsaXAucmVzZXQoKTtcbiAgICAgICAgYWN0aW9uQ2xpcC5zdG9wKCk7XG4gICAgICB9KTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoU3RvcCk7XG4gICAgfSk7XG4gIH1cbn1cblxuQW5pbWF0aW9uU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbiwgR0xURk1vZGVsXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICBtaXhlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uTWl4ZXJDb21wb25lbnRdXG4gIH0sXG4gIHBsYXlDbGlwczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50LCBQbGF5XVxuICB9LFxuICBzdG9wQ2xpcHM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwgU3RvcF1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cixcbiAgVlJDb250cm9sbGVyLFxuICBJbnB1dFN0YXRlXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBJbnB1dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgLy8hISEhISEhISEhISEhXG4gICAgdGhpcy53b3JsZC5yZWdpc3RlckNvbXBvbmVudChJbnB1dFN0YXRlKTtcblxuICAgIGxldCBlbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChJbnB1dFN0YXRlKTtcbiAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChJbnB1dFN0YXRlKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVlJDb250cm9sbGVycygpO1xuICAgIC8vIHRoaXMucHJvY2Vzc0tleWJvYXJkKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzTW91c2UoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NHYW1lcGFkcygpO1xuICB9XG5cbiAgcHJvY2Vzc1ZSQ29udHJvbGxlcnMoKSB7XG4gICAgLy8gUHJvY2VzcyByZWNlbnRseSBhZGRlZCBjb250cm9sbGVyc1xuICAgIHRoaXMucXVlcmllcy52cmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsIHtcbiAgICAgICAgc2VsZWN0c3RhcnQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5nZXQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdGVuZDogZXZlbnQgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmdldChldmVudC50YXJnZXQpO1xuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgY29ubmVjdGVkOiBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuc2V0KGV2ZW50LnRhcmdldCwge30pO1xuICAgICAgICB9LFxuICAgICAgICBkaXNjb25uZWN0ZWQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5kZWxldGUoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5mb3JFYWNoKHN0YXRlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdFN0YXJ0ID0gc3RhdGUuc2VsZWN0ZWQgJiYgIXN0YXRlLnByZXZTZWxlY3RlZDtcbiAgICAgIHN0YXRlLnNlbGVjdEVuZCA9ICFzdGF0ZS5zZWxlY3RlZCAmJiBzdGF0ZS5wcmV2U2VsZWN0ZWQ7XG4gICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSBzdGF0ZS5zZWxlY3RlZDtcbiAgICB9KTtcbiAgfVxufVxuXG5JbnB1dFN5c3RlbS5xdWVyaWVzID0ge1xuICB2cmNvbnRyb2xsZXJzOiB7XG4gICAgY29tcG9uZW50czogW1ZSQ29udHJvbGxlcl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcihsaXN0ZW5lciwgcG9vbFNpemUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICB0aGlzLmNvbnRleHQgPSBsaXN0ZW5lci5jb250ZXh0O1xuXG4gICAgdGhpcy5wb29sU2l6ZSA9IHBvb2xTaXplIHx8IDU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBvb2xTaXplOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXcgVEhSRUUuUG9zaXRpb25hbEF1ZGlvKGxpc3RlbmVyKSk7XG4gICAgfVxuICB9XG5cbiAgc2V0QnVmZmVyKGJ1ZmZlcikge1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChzb3VuZCA9PiB7XG4gICAgICBzb3VuZC5zZXRCdWZmZXIoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHBsYXkoKSB7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgc291bmQgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKCFzb3VuZC5pc1BsYXlpbmcgJiYgc291bmQuYnVmZmVyICYmICFmb3VuZCkge1xuICAgICAgICBzb3VuZC5wbGF5KCk7XG4gICAgICAgIHNvdW5kLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIkFsbCB0aGUgc291bmRzIGFyZSBwbGF5aW5nLiBJZiB5b3UgbmVlZCB0byBwbGF5IG1vcmUgc291bmRzIHNpbXVsdGFuZW91c2x5IGNvbnNpZGVyIGluY3JlYXNpbmcgdGhlIHBvb2wgc2l6ZVwiXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU291bmQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IFBvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMgZnJvbSBcIi4uL2xpYi9Qb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTb3VuZFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IG5ldyBUSFJFRS5BdWRpb0xpc3RlbmVyKCk7XG4gIH1cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuc291bmRzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFNvdW5kKTtcbiAgICAgIGNvbnN0IHNvdW5kID0gbmV3IFBvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWModGhpcy5saXN0ZW5lciwgMTApO1xuICAgICAgY29uc3QgYXVkaW9Mb2FkZXIgPSBuZXcgVEhSRUUuQXVkaW9Mb2FkZXIoKTtcbiAgICAgIGF1ZGlvTG9hZGVyLmxvYWQoY29tcG9uZW50LnVybCwgYnVmZmVyID0+IHtcbiAgICAgICAgc291bmQuc2V0QnVmZmVyKGJ1ZmZlcik7XG4gICAgICB9KTtcbiAgICAgIGNvbXBvbmVudC5zb3VuZCA9IHNvdW5kO1xuICAgIH0pO1xuICB9XG59XG5cblNvdW5kU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHNvdW5kczoge1xuICAgIGNvbXBvbmVudHM6IFtTb3VuZF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlIC8vIFtTb3VuZF1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBfRW50aXR5IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlRW50aXR5IGV4dGVuZHMgX0VudGl0eSB7XG4gIGFkZE9iamVjdDNEQ29tcG9uZW50KG9iaiwgcGFyZW50RW50aXR5KSB7XG4gICAgb2JqLmVudGl0eSA9IHRoaXM7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IG9iaiB9KTtcbiAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLndvcmxkLm9iamVjdDNESW5mbGF0b3IuaW5mbGF0ZSh0aGlzLCBvYmopO1xuICAgIGlmIChwYXJlbnRFbnRpdHkgJiYgcGFyZW50RW50aXR5Lmhhc0NvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkpIHtcbiAgICAgIHBhcmVudEVudGl0eS5nZXRPYmplY3QzRCgpLmFkZChvYmopO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJlbW92ZU9iamVjdDNEQ29tcG9uZW50KHVucGFyZW50ID0gdHJ1ZSkge1xuICAgIGNvbnN0IG9iaiA9IHRoaXMuZ2V0Q29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB0cnVlKS52YWx1ZTtcbiAgICBpZiAodW5wYXJlbnQpIHtcbiAgICAgIC8vIFVzaW5nIFwidHJ1ZVwiIGFzIHRoZSBlbnRpdHkgY291bGQgYmUgcmVtb3ZlZCBzb21ld2hlcmUgZWxzZVxuICAgICAgb2JqLnBhcmVudCAmJiBvYmoucGFyZW50LnJlbW92ZShvYmopO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUNvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCk7XG4gICAgdGhpcy5fZW50aXR5TWFuYWdlci53b3JsZC5vYmplY3QzREluZmxhdG9yLmRlZmxhdGUodGhpcywgb2JqKTtcbiAgICBvYmouZW50aXR5ID0gbnVsbDtcbiAgfVxuXG4gIHJlbW92ZShmb3JjZUltbWVkaWF0ZSkge1xuICAgIGlmICh0aGlzLmhhc0NvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkpIHtcbiAgICAgIGNvbnN0IG9iaiA9IHRoaXMuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIG9iai50cmF2ZXJzZShvID0+IHtcbiAgICAgICAgaWYgKG8uZW50aXR5KSB7XG4gICAgICAgICAgdGhpcy5fZW50aXR5TWFuYWdlci5yZW1vdmVFbnRpdHkoby5lbnRpdHksIGZvcmNlSW1tZWRpYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBvLmVudGl0eSA9IG51bGw7XG4gICAgICB9KTtcbiAgICAgIG9iai5wYXJlbnQgJiYgb2JqLnBhcmVudC5yZW1vdmUob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZW50aXR5TWFuYWdlci5yZW1vdmVFbnRpdHkodGhpcywgZm9yY2VJbW1lZGlhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGdldE9iamVjdDNEKCkge1xuICAgIHJldHVybiB0aGlzLmdldENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkudmFsdWU7XG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIE1lc2hUYWdDb21wb25lbnQsXG4gIFNjZW5lVGFnQ29tcG9uZW50LFxuICBDYW1lcmFUYWdDb21wb25lbnRcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY29uc3QgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgPSB7XG4gIGluZmxhdGU6IChlbnRpdHksIG9iaikgPT4ge1xuICAgIC8vIFRPRE8gc3VwcG9ydCBtb3JlIHRhZ3MgYW5kIHByb2JhYmx5IGEgd2F5IHRvIGFkZCB1c2VyIGRlZmluZWQgb25lc1xuICAgIGlmIChvYmouaXNNZXNoKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE1lc2hUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzU2NlbmUpIHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoU2NlbmVUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzQ2FtZXJhKSB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KENhbWVyYVRhZ0NvbXBvbmVudCk7XG4gICAgfVxuICB9LFxuICBkZWZsYXRlOiAoZW50aXR5LCBvYmopID0+IHtcbiAgICAvLyBUT0RPIHN1cHBvcnQgbW9yZSB0YWdzIGFuZCBwcm9iYWJseSBhIHdheSB0byBhZGQgdXNlciBkZWZpbmVkIG9uZXNcbiAgICBpZiAob2JqLmlzTWVzaCkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChNZXNoVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc1NjZW5lKSB7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFNjZW5lVGFnQ29tcG9uZW50KTtcbiAgICB9IGVsc2UgaWYgKG9iai5pc0NhbWVyYSkge1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChDYW1lcmFUYWdDb21wb25lbnQpO1xuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFdvcmxkIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IEVDU1lUaHJlZUVudGl0eSB9IGZyb20gXCIuL2VudGl0eS5qc1wiO1xuaW1wb3J0IHsgZGVmYXVsdE9iamVjdDNESW5mbGF0b3IgfSBmcm9tIFwiLi9kZWZhdWx0T2JqZWN0M0RJbmZsYXRvclwiO1xuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlV29ybGQgZXh0ZW5kcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCB7IGVudGl0eUNsYXNzOiBFQ1NZVGhyZWVFbnRpdHkgfSwgb3B0aW9ucykpO1xuICAgIHRoaXMub2JqZWN0M0RJbmZsYXRvciA9IGRlZmF1bHRPYmplY3QzREluZmxhdG9yO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IFVwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9VcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbS5qc1wiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIEFjdGl2ZSxcbiAgUmVuZGVyUGFzcyxcbiAgT2JqZWN0M0RDb21wb25lbnQsXG4gIENhbWVyYSxcbiAgU2NlbmVUYWdDb21wb25lbnQsXG4gIENhbWVyYVRhZ0NvbXBvbmVudCxcbiAgTWVzaFRhZ0NvbXBvbmVudCxcbiAgVXBkYXRlQXNwZWN0T25SZXNpemVUYWdcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5pbXBvcnQgeyBFQ1NZVGhyZWVXb3JsZCB9IGZyb20gXCIuL3dvcmxkLmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplKHdvcmxkID0gbmV3IEVDU1lUaHJlZVdvcmxkKCksIG9wdGlvbnMpIHtcbiAgaWYgKCEod29ybGQgaW5zdGFuY2VvZiBFQ1NZVGhyZWVXb3JsZCkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBcIlRoZSBwcm92aWRlZCAnd29ybGQnIHBhcmVtZXRlciBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgJ0VDU1lUaHJlZVdvcmxkJ1wiXG4gICAgKTtcbiAgfVxuXG4gIHdvcmxkXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFVwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShUcmFuc2Zvcm1TeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFdlYkdMUmVuZGVyZXJTeXN0ZW0pXG5cbiAgd29ybGRcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoV2ViR0xSZW5kZXJlcilcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoU2NlbmUpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KEFjdGl2ZSlcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFJlbmRlclBhc3MpXG4vLyAgICAucmVnaXN0ZXJDb21wb25lbnQoVHJhbnNmb3JtKVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChDYW1lcmEpXG4gICAgLy8gVGFnc1xuICAgIC5yZWdpc3RlckNvbXBvbmVudChTY2VuZVRhZ0NvbXBvbmVudClcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoQ2FtZXJhVGFnQ29tcG9uZW50KVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChNZXNoVGFnQ29tcG9uZW50KVxuXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnKVxuXG5cbiAgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge1xuICAgIHZyOiBmYWxzZSxcbiAgICBkZWZhdWx0czogdHJ1ZVxuICB9O1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuXG4gIGlmICghb3B0aW9ucy5kZWZhdWx0cykge1xuICAgIHJldHVybiB7IHdvcmxkIH07XG4gIH1cblxuICBsZXQgYW5pbWF0aW9uTG9vcCA9IG9wdGlvbnMuYW5pbWF0aW9uTG9vcDtcbiAgaWYgKCFhbmltYXRpb25Mb29wKSB7XG4gICAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcbiAgICBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xuICAgICAgd29ybGQuZXhlY3V0ZShjbG9jay5nZXREZWx0YSgpLCBjbG9jay5lbGFwc2VkVGltZSk7XG4gICAgfTtcbiAgfVxuXG4gIGxldCBzY2VuZSA9IHdvcmxkXG4gICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgLmFkZENvbXBvbmVudChTY2VuZSlcbiAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQobmV3IFRIUkVFLlNjZW5lKCkpO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgYXI6IG9wdGlvbnMuYXIsXG4gICAgdnI6IG9wdGlvbnMudnIsXG4gICAgYW5pbWF0aW9uTG9vcDogYW5pbWF0aW9uTG9vcFxuICB9KTtcblxuICAvLyBjYW1lcmEgcmlnICYgY29udHJvbGxlcnNcbiAgdmFyIGNhbWVyYSA9IG51bGwsXG4gICAgY2FtZXJhUmlnID0gbnVsbDtcblxuICAvLyBpZiAob3B0aW9ucy5hciB8fCBvcHRpb25zLnZyKSB7XG4gIC8vICAgY2FtZXJhUmlnID0gd29ybGRcbiAgLy8gICAgIC5jcmVhdGVFbnRpdHkoKVxuICAvLyAgICAgLmFkZENvbXBvbmVudChDYW1lcmFSaWcpXG4gIC8vICAgICAuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogc2NlbmUgfSk7XG4gIC8vIH1cblxuICB7XG4gICAgY2FtZXJhID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmEpXG4gICAgICAuYWRkQ29tcG9uZW50KFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnKVxuICAgICAgLmFkZE9iamVjdDNEQ29tcG9uZW50KFxuICAgICAgICBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgICAgOTAsXG4gICAgICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgICAgMC4xLFxuICAgICAgICAgIDEwMFxuICAgICAgICApLFxuICAgICAgICBzY2VuZVxuICAgICAgKVxuICAgICAgLmFkZENvbXBvbmVudChBY3RpdmUpO1xuICB9XG5cbiAgbGV0IHJlbmRlclBhc3MgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoUmVuZGVyUGFzcywge1xuICAgIHNjZW5lOiBzY2VuZSxcbiAgICBjYW1lcmE6IGNhbWVyYVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIGNhbWVyYVJpZyxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgcmVuZGVyUGFzc1xuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJUSFJFRS5WZWN0b3IyIiwiVEhSRUUuVmVjdG9yMyIsIlRocmVlVHlwZXMuVmVjdG9yM1R5cGUiLCJUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIkdMVEZMb2FkZXJUaHJlZSIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiVEhSRUUuRm9udExvYWRlciIsIlRIUkVFLlRleHRHZW9tZXRyeSIsIlRIUkVFLlJlcGVhdFdyYXBwaW5nIiwiVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkZvZyIsIlRIUkVFLkNvbG9yIiwiVEhSRUUuQW5pbWF0aW9uTWl4ZXIiLCJUSFJFRS5Mb29wT25jZSIsIlRIUkVFLk9iamVjdDNEIiwiVEhSRUUuUG9zaXRpb25hbEF1ZGlvIiwiVEhSRUUuQXVkaW9MaXN0ZW5lciIsIlRIUkVFLkF1ZGlvTG9hZGVyIiwiVEhSRUUuQ2xvY2siLCJUSFJFRS5TY2VuZSIsIlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFDTyxNQUFNLE1BQU0sU0FBUyxZQUFZLENBQUMsRUFBRTs7QUNDcEMsTUFBTSxTQUFTLFNBQVMsU0FBUyxDQUFDLEVBQUU7QUFDM0MsU0FBUyxDQUFDLE1BQU0sR0FBRztFQUNqQixVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsS0FBSyxFQUFFO0VBQzlDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUM5QyxDQUFDOztBQ0pLLE1BQU0sTUFBTSxTQUFTLFNBQVMsQ0FBQyxFQUFFOztBQUV4QyxNQUFNLENBQUMsTUFBTSxHQUFHO0VBQ2QsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVB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WSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUNqRCxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3BELE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDL0MsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUMvQyxhQUFhLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDdkUsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTs7RUFFdkMsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtFQUNwRCxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFOztFQUU1QyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQy9DLFlBQVksRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDaEQsYUFBYSxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUN0RCxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3ZELFlBQVksRUFBRSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7O0VBRXhELFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDakQsY0FBYyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUNuRCxhQUFhLEVBQUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3pELGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDakQsZ0JBQWdCLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3ZFLG9CQUFvQixFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtFQUM1RCxrQkFBa0IsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7O0VBRXRELElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDN0MsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUNuRCxDQUFDOztBQ2pDSyxNQUFNLFFBQVEsU0FBUyxTQUFTLENBQUMsRUFBRTtBQUMxQyxRQUFRLENBQUMsTUFBTSxHQUFHO0VBQ2hCLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDakQsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUN6QyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7Q0FDMUMsQ0FBQzs7QUNOSyxNQUFNLFVBQVUsU0FBUyxTQUFTLENBQUMsRUFBRTs7QUFFNUMsVUFBVSxDQUFDLE1BQU0sR0FBRztFQUNsQixHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3hDLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDdEQsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtFQUNuRCxjQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3JELE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDOUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUMvQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0NBQzlDLENBQUM7O0FDVkssTUFBTSxTQUFTLFNBQVMsU0FBUyxDQUFDLEVBQUU7O0FBRTNDLFNBQVMsQ0FBQyxNQUFNLEdBQUc7RUFDakIsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUM3QyxDQUFDOztBQ0pLLE1BQU0sVUFBVSxTQUFTLFNBQVMsQ0FBQyxFQUFFOztBQUU1QyxVQUFVLENBQUMsTUFBTSxHQUFHO0VBQ2xCLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3pELFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDN0MsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUMxQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0NBQzlDLENBQUM7O0FDTkssTUFBTSxLQUFLLEdBQUc7RUFDbkIsS0FBSyxFQUFFLENBQUM7RUFDUixJQUFJLEVBQUUsQ0FBQztFQUNQLE1BQU0sRUFBRSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sT0FBTyxHQUFHO0VBQ3JCLFFBQVEsRUFBRSxDQUFDO0VBQ1gsSUFBSSxFQUFFLENBQUM7Q0FDUixDQUFDOztBQUVGLEFBQU8sTUFBTSxRQUFRLEdBQUc7RUFDdEIsTUFBTSxFQUFFLENBQUM7RUFDVCxRQUFRLEVBQUUsQ0FBQztFQUNYLFdBQVcsRUFBRSxDQUFDO0VBQ2QsUUFBUSxFQUFFLENBQUM7Q0FDWixDQUFDOztBQUVGLEFBQU8sTUFBTSxhQUFhLEdBQUc7RUFDM0IsSUFBSSxFQUFFLENBQUM7RUFDUCxJQUFJLEVBQUUsQ0FBQztFQUNQLE1BQU0sRUFBRSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sUUFBUSxTQUFTLFNBQVMsQ0FBQyxFQUFFO0FBQzFDLFFBQVEsQ0FBQyxNQUFNLEdBQUc7RUFDaEIsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUNoRCxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzdDLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDakQsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtFQUNsRCxXQUFXLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFO0VBQ3BELElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDN0MsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUlBLE9BQWEsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzVELE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDN0MsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUlBLE9BQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDaEUsTUFBTSxFQUFFLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDekQsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDbEQsV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0s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

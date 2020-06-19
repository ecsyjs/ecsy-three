import { TagComponent, Component, Types, createType, copyCopyable, cloneClonable, System, Not, SystemStateComponent, _Entity, World } from 'ecsy';
export { Types } from 'ecsy';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, AnimationMixer, LoopOnce, Object3D, PositionalAudio, AudioListener, AudioLoader, Clock, Scene as Scene$1, PerspectiveCamera } from 'three';
import { GLTFLoader as GLTFLoader$1 } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'troika-3d-text/dist/textmesh-standalone.esm.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

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

export { Active, Animation, AnimationSystem, Camera, CameraRig, Colliding, CollisionStart, CollisionStop, ControllerConnected, Draggable, Dragging, ECSYThreeWorld, Environment, EnvironmentSystem, GLTFLoader, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, InputState, InputSystem, Material, MaterialSystem, Object3DComponent, Parent, ParentObject3D, Play, Position, RenderPass, RigidBody, Rotation, SDFTextSystem, Scale, Scene, Shape, Sky, SkyBox, SkyBoxSystem, Sound, SoundSystem, Stop, Text, TextGeometry, TextGeometrySystem, Transform, TransformSystem, UpdateAspectOnResizeSystem, VRController, VRControllerBasicBehaviour, VRControllerSystem, Vector3Type, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, initialize };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0FuaW1hdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NvbGxpZGluZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NvbGxpc2lvblN0YXJ0LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RvcC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZMb2FkZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbnB1dFN0YXRlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvTWF0ZXJpYWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9PYmplY3QzRENvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1BhcmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1BhcmVudE9iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGxheS5qcyIsIi4uL3NyYy9UeXBlcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Bvc2l0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmVuZGVyUGFzcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JpZ2lkQm9keS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdGF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2NhbGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9TY2VuZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NoYXBlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU291bmQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9TdG9wLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHRHZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RyYW5zZm9ybS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Zpc2libGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WUkNvbnRyb2xsZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29udHJvbGxlckNvbm5lY3RlZC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNEVGFncy5qcyIsIi4uL3NyYy9zeXN0ZW1zL01hdGVyaWFsU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1NERlRleHRTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1ZSQ29udHJvbGxlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0FuaW1hdGlvblN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0lucHV0U3lzdGVtLmpzIiwiLi4vc3JjL2xpYi9Qb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljLmpzIiwiLi4vc3JjL3N5c3RlbXMvU291bmRTeXN0ZW0uanMiLCIuLi9zcmMvZW50aXR5LmpzIiwiLi4vc3JjL2RlZmF1bHRPYmplY3QzREluZmxhdG9yLmpzIiwiLi4vc3JjL3dvcmxkLmpzIiwiLi4vc3JjL2luaXRpYWxpemUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBBY3RpdmUgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBBbmltYXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFuaW1hdGlvbnMgPSBbXTtcbiAgICB0aGlzLmR1cmF0aW9uID0gLTE7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmFuaW1hdGlvbnMubGVuZ3RoID0gMDtcbiAgICB0aGlzLmR1cmF0aW9uID0gLTE7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgQ2FtZXJhIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cbkNhbWVyYS5zY2hlbWEgPSB7XG4gIGZvdjogeyBkZWZhdWx0OiA0NSwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGFzcGVjdDogeyBkZWZhdWx0OiAxLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgbmVhcjogeyBkZWZhdWx0OiAwLjEsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBmYXI6IHsgZGVmYXVsdDogMTAwMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGxheWVyczogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfVxufTtcbiIsImV4cG9ydCBjbGFzcyBDYW1lcmFSaWcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxlZnRIYW5kID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ29sbGlkaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoID0gW107XG4gICAgdGhpcy5jb2xsaWRpbmdGcmFtZSA9IDA7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5jb2xsaWRpbmdGcmFtZSA9IDA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDb2xsaXNpb25TdGFydCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aCA9IFtdO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aC5sZW5ndGggPSAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ29sbGlzaW9uU3RvcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aCA9IFtdO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aC5sZW5ndGggPSAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRHJhZ2dhYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIERyYWdnaW5nIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgRW52aXJvbm1lbnQge1xuICByZXNldCgpIHt9XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5wcmVzZXQgPSBcImRlZmF1bHRcIjtcbiAgICB0aGlzLnNlZWQgPSAxO1xuICAgIHRoaXMuc2t5VHlwZSA9IFwiYXRtb3NwaGVyZVwiO1xuICAgIHRoaXMuc2t5Q29sb3IgPSBcIlwiO1xuICAgIHRoaXMuaG9yaXpvbkNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmxpZ2h0aW5nID0gXCJkaXN0YW50XCI7XG4gICAgdGhpcy5zaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLnNoYWRvd1NpemUgPSAxMDtcbiAgICB0aGlzLmxpZ2h0UG9zaXRpb24gPSB7IHg6IDAsIHk6IDEsIHo6IC0wLjIgfTtcbiAgICB0aGlzLmZvZyA9IDA7XG5cbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5QXJlYSA9IDE7XG5cbiAgICB0aGlzLmdyb3VuZCA9IFwiZmxhdFwiO1xuICAgIHRoaXMuZ3JvdW5kWVNjYWxlID0gMztcbiAgICB0aGlzLmdyb3VuZFRleHR1cmUgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yID0gXCIjNTUzZTM1XCI7XG4gICAgdGhpcy5ncm91bmRDb2xvcjIgPSBcIiM2OTQ0MzlcIjtcblxuICAgIHRoaXMuZHJlc3NpbmcgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmRyZXNzaW5nQW1vdW50ID0gMTA7XG4gICAgdGhpcy5kcmVzc2luZ0NvbG9yID0gXCIjNzk1NDQ5XCI7XG4gICAgdGhpcy5kcmVzc2luZ1NjYWxlID0gNTtcbiAgICB0aGlzLmRyZXNzaW5nVmFyaWFuY2UgPSB7IHg6IDEsIHk6IDEsIHo6IDEgfTtcbiAgICB0aGlzLmRyZXNzaW5nVW5pZm9ybVNjYWxlID0gdHJ1ZTtcbiAgICB0aGlzLmRyZXNzaW5nT25QbGF5QXJlYSA9IDA7XG5cbiAgICB0aGlzLmdyaWQgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyaWRDb2xvciA9IFwiI2NjY1wiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlciBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5HTFRGTG9hZGVyLnNjaGVtYSA9IHtcbiAgdXJsOiB7IGRlZmF1bHQ6IFwiXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LFxuICByZWNlaXZlU2hhZG93OiB7IGRlZmF1bHQ6IGZhbHNlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIGNhc3RTaGFkb3c6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgZW52TWFwT3ZlcnJpZGU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGFwcGVuZDogeyBkZWZhdWx0OiB0cnVlLCB0eXBlOiBUeXBlcy5Cb29sZWFuIH0sXG4gIG9uTG9hZGVkOiB7IGRlZmF1bHQ6IG51bGwsIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBwYXJlbnQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIEdMVEZNb2RlbCBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5HTFRGTW9kZWwuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRTdGF0ZSBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5JbnB1dFN0YXRlLnNjaGVtYSA9IHtcbiAgdnJjb250cm9sbGVyczogeyBkZWZhdWx0OiBuZXcgTWFwKCksIHR5cGU6IFR5cGVzLk9iamVjdCB9LFxuICBrZXlib2FyZDogeyBkZWZhdWx0OiB7fSwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIG1vdXNlOiB7IGRlZmF1bHQ6IHt9LCB0eXBlOiBUeXBlcy5PYmplY3QgfSxcbiAgZ2FtZXBhZHM6IHsgZGVmYXVsdDoge30sIHR5cGU6IFR5cGVzLk9iamVjdCB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjb25zdCBTSURFUyA9IHtcbiAgZnJvbnQ6IDAsXG4gIGJhY2s6IDEsXG4gIGRvdWJsZTogMlxufTtcblxuZXhwb3J0IGNvbnN0IFNIQURFUlMgPSB7XG4gIHN0YW5kYXJkOiAwLFxuICBmbGF0OiAxXG59O1xuXG5leHBvcnQgY29uc3QgQkxFTkRJTkcgPSB7XG4gIG5vcm1hbDogMCxcbiAgYWRkaXRpdmU6IDEsXG4gIHN1YnRyYWN0aXZlOiAyLFxuICBtdWx0aXBseTogM1xufTtcblxuZXhwb3J0IGNvbnN0IFZFUlRFWF9DT0xPUlMgPSB7XG4gIG5vbmU6IDAsXG4gIGZhY2U6IDEsXG4gIHZlcnRleDogMlxufTtcblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdCA9IG5ldyBUSFJFRS5WZWN0b3IyKDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQuc2V0KDAsIDApO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdC5zZXQoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cbn1cbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgT2JqZWN0M0RDb21wb25lbnQgZXh0ZW5kcyBDb21wb25lbnQge31cblxuT2JqZWN0M0RDb21wb25lbnQuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgUGFyZW50IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5QYXJlbnQuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImV4cG9ydCBjbGFzcyBQYXJlbnRPYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn0iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFBsYXkgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IFZlY3RvcjMgfSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IGNyZWF0ZVR5cGUsIGNvcHlDb3B5YWJsZSwgY2xvbmVDbG9uYWJsZSB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjb25zdCBWZWN0b3IzVHlwZSA9IGNyZWF0ZVR5cGUoe1xuICBuYW1lOiBcIlZlY3RvcjNcIixcbiAgZGVmYXVsdDogbmV3IFZlY3RvcjMoKSxcbiAgY29weTogY29weUNvcHlhYmxlLFxuICBjbG9uZTogY2xvbmVDbG9uYWJsZVxufSk7XG5cbmV4cG9ydCB7IFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcbiIsImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUaHJlZVR5cGVzIGZyb20gXCIuLi9UeXBlcy5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5Qb3NpdGlvbi5zY2hlbWEgPSB7XG4gIHZhbHVlOiB7IGRlZmF1bHQ6IG5ldyBUSFJFRS5WZWN0b3IzKCksIHR5cGU6IFRocmVlVHlwZXMuVmVjdG9yM1R5cGUgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgUmVuZGVyUGFzcyBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5SZW5kZXJQYXNzLnNjaGVtYSA9IHtcbiAgc2NlbmU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIGNhbWVyYTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImV4cG9ydCBjbGFzcyBSaWdpZEJvZHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5vYmplY3QgPSBudWxsO1xuICAgIHRoaXMud2VpZ2h0ID0gMDtcbiAgICB0aGlzLnJlc3RpdHV0aW9uID0gMTtcbiAgICB0aGlzLmZyaWN0aW9uID0gMTtcbiAgICB0aGlzLmxpbmVhckRhbXBpbmcgPSAwO1xuICAgIHRoaXMuYW5ndWxhckRhbXBpbmcgPSAwO1xuICAgIHRoaXMubGluZWFyVmVsb2NpdHkgPSB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2NhbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBTY2VuZSBleHRlbmRzIENvbXBvbmVudCB7fVxuU2NlbmUuc2NoZW1hID0ge1xuICB2YWx1ZTogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgU2hhcGUgZXh0ZW5kcyBDb21wb25lbnQge31cblNoYXBlLnNjaGVtYSA9IHtcbiAgcHJpbWl0aXZlOiB7IGRlZmF1bHQ6IFwiXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LFxuICB3aWR0aDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgaGVpZ2h0OiB7IGRlZmF1bHQ6IDAsIHR5cGU6IFR5cGVzLk51bWJlciB9LFxuICBkZXB0aDogeyBkZWZhdWx0OiAwLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImV4cG9ydCBjbGFzcyBTa3kge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3lCb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNvdW5kIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cblNvdW5kLnNjaGVtYSA9IHtcbiAgc291bmQ6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH0sXG4gIHVybDogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfVxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgU3RvcCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBUZXh0IGV4dGVuZHMgQ29tcG9uZW50IHt9XG5UZXh0LnNjaGVtYSA9IHtcbiAgdGV4dDogeyBkZWZhdWx0OiBcIlwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSxcbiAgdGV4dEFsaWduOiB7IGRlZmF1bHQ6IFwibGVmdFwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWydsZWZ0JywgJ3JpZ2h0JywgJ2NlbnRlciddXG4gIGFuY2hvcjogeyBkZWZhdWx0OiBcImNlbnRlclwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWydsZWZ0JywgJ3JpZ2h0JywgJ2NlbnRlcicsICdhbGlnbiddXG4gIGJhc2VsaW5lOiB7IGRlZmF1bHQ6IFwiY2VudGVyXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LCAvLyBbJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJ11cbiAgY29sb3I6IHsgZGVmYXVsdDogXCIjRkZGXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LFxuICBmb250OiB7IGRlZmF1bHQ6IFwiXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LCAvL1wiaHR0cHM6Ly9jb2RlLmNkbi5tb3ppbGxhLm5ldC9mb250cy90dGYvWmlsbGFTbGFiLVNlbWlCb2xkLnR0ZlwiXG4gIGZvbnRTaXplOiB7IGRlZmF1bHQ6IDAuMiwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGxldHRlclNwYWNpbmc6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIGxpbmVIZWlnaHQ6IHsgZGVmYXVsdDogMCwgdHlwZTogVHlwZXMuTnVtYmVyIH0sXG4gIG1heFdpZHRoOiB7IGRlZmF1bHQ6IEluZmluaXR5LCB0eXBlOiBUeXBlcy5OdW1iZXIgfSxcbiAgb3ZlcmZsb3dXcmFwOiB7IGRlZmF1bHQ6IFwibm9ybWFsXCIsIHR5cGU6IFR5cGVzLlN0cmluZyB9LCAvLyBbJ25vcm1hbCcsICdicmVhay13b3JkJ11cbiAgd2hpdGVTcGFjZTogeyBkZWZhdWx0OiBcIm5vcm1hbFwiLCB0eXBlOiBUeXBlcy5TdHJpbmcgfSwgLy8gWydub3JtYWwnLCAnbm93cmFwJ11cbiAgb3BhY2l0eTogeyBkZWZhdWx0OiAxLCB0eXBlOiBUeXBlcy5OdW1iZXIgfVxufTtcbiIsImV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnkge1xuICByZXNldCgpIHt9XG59XG4iLCJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVGhyZWVUeXBlcyBmcm9tIFwiLi4vVHlwZXMuanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5cblRyYW5zZm9ybS5zY2hlbWEgPSB7XG4gIHBvc2l0aW9uOiB7IGRlZmF1bHQ6IG5ldyBUSFJFRS5WZWN0b3IzKCksIHR5cGU6IFRocmVlVHlwZXMuVmVjdG9yM1R5cGUgfSxcbiAgcm90YXRpb246IHsgZGVmYXVsdDogbmV3IFRIUkVFLlZlY3RvcjMoKSwgdHlwZTogVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSB9XG59O1xuIiwiaW1wb3J0IHsgQ29tcG9uZW50LCBUeXBlcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBWaXNpYmxlIGV4dGVuZHMgQ29tcG9uZW50IHt9XG5WaXNpYmxlLnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogdHJ1ZSwgdHlwZTogVHlwZXMuQm9vbGVhbiB9XG59O1xuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNlbGVjdCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RlbmQgPSBudWxsO1xuXG4gICAgdGhpcy5jb25uZWN0ZWQgPSBudWxsO1xuXG4gICAgdGhpcy5zcXVlZXplID0gbnVsbDtcbiAgICB0aGlzLnNxdWVlemVzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplZW5kID0gbnVsbDtcbiAgfVxufSIsImltcG9ydCB7IENvbXBvbmVudCwgVHlwZXMgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciBleHRlbmRzIENvbXBvbmVudCB7fVxuXG5XZWJHTFJlbmRlcmVyLnNjaGVtYSA9IHtcbiAgdnI6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYXI6IHsgZGVmYXVsdDogZmFsc2UsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgc2hhZG93TWFwOiB7IGRlZmF1bHQ6IHRydWUsIHR5cGU6IFR5cGVzLkJvb2xlYW4gfSxcbiAgYW5pbWF0aW9uTG9vcDogeyBkZWZhdWx0OiBudWxsLCB0eXBlOiBUeXBlcy5PYmplY3QgfVxufTtcbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgQ29udHJvbGxlckNvbm5lY3RlZCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IGNsYXNzIFNjZW5lVGFnQ29tcG9uZW50IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgQ2FtZXJhVGFnQ29tcG9uZW50IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG5leHBvcnQgY2xhc3MgTWVzaFRhZ0NvbXBvbmVudCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuXG5leHBvcnQgY2xhc3MgVXBkYXRlQXNwZWN0T25SZXNpemVUYWcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtLCBOb3QsIFN5c3RlbVN0YXRlQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIE1hdGVyaWFsLFxuICBPYmplY3QzRENvbXBvbmVudCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmNsYXNzIE1hdGVyaWFsSW5zdGFuY2UgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy52YWx1ZSA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5uZXcucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE1hdGVyaWFsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5NYXRlcmlhbFN5c3RlbS5xdWVyaWVzID0ge1xuICBuZXc6IHtcbiAgICBjb21wb25lbnRzOiBbTWF0ZXJpYWwsIE5vdChNYXRlcmlhbEluc3RhbmNlKV1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIEdlb21ldHJ5LFxuICBPYmplY3QzRENvbXBvbmVudCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbi8qKlxuICogQ3JlYXRlIGEgTWVzaCBiYXNlZCBvbiB0aGUgW0dlb21ldHJ5XSBjb21wb25lbnQgYW5kIGF0dGFjaCBpdCB0byB0aGUgZW50aXR5IHVzaW5nIGEgW09iamVjdDNEXSBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBSZW1vdmVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0T2JqZWN0M0QoKS5yZW1vdmUob2JqZWN0KTtcbiAgICB9KTtcblxuICAgIC8vIEFkZGVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdlb21ldHJ5KTtcblxuICAgICAgdmFyIGdlb21ldHJ5O1xuICAgICAgc3dpdGNoIChjb21wb25lbnQucHJpbWl0aXZlKSB7XG4gICAgICAgIGNhc2UgXCJ0b3J1c1wiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpdXMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJlLFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaWFsU2VnbWVudHMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJ1bGFyU2VnbWVudHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3BoZXJlXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeShjb21wb25lbnQucmFkaXVzLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LndpZHRoLFxuICAgICAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0LFxuICAgICAgICAgICAgICBjb21wb25lbnQuZGVwdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPVxuICAgICAgICBjb21wb25lbnQucHJpbWl0aXZlID09PSBcInRvcnVzXCIgPyAweDk5OTkwMCA6IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChNYXRlcmlhbCkpIHtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiovXG5cbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChUcmFuc2Zvcm0pKSB7XG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICAgIGlmICh0cmFuc2Zvcm0ucm90YXRpb24pIHtcbiAgICAgICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KEVsZW1lbnQpICYmICFlbnRpdHkuaGFzQ29tcG9uZW50KERyYWdnYWJsZSkpIHtcbiAgICAgIC8vICAgICAgICBvYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0KDB4MzMzMzMzKTtcbiAgICAgIC8vICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuR2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR2VvbWV0cnldLCAvLyBAdG9kbyBUcmFuc2Zvcm06IEFzIG9wdGlvbmFsLCBob3cgdG8gZGVmaW5lIGl0P1xuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgR0xURkxvYWRlciBhcyBHTFRGTG9hZGVyVGhyZWUgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvR0xURkxvYWRlci5qc1wiO1xuaW1wb3J0IHsgU3lzdGVtLCBTeXN0ZW1TdGF0ZUNvbXBvbmVudCwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IEdMVEZNb2RlbCB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZNb2RlbC5qc1wiO1xuaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZMb2FkZXIuanNcIjtcblxuLy8gQHRvZG8gVXNlIHBhcmFtZXRlciBhbmQgbG9hZGVyIG1hbmFnZXJcbnZhciBsb2FkZXIgPSBuZXcgR0xURkxvYWRlclRocmVlKCk7IC8vLnNldFBhdGgoXCIvYXNzZXRzL21vZGVscy9cIik7XG5cbmNsYXNzIEdMVEZMb2FkZXJTdGF0ZSBleHRlbmRzIFN5c3RlbVN0YXRlQ29tcG9uZW50IHt9XG5cbmV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLndvcmxkLnJlZ2lzdGVyQ29tcG9uZW50KEdMVEZMb2FkZXJTdGF0ZSkucmVnaXN0ZXJDb21wb25lbnQoR0xURk1vZGVsKTtcbiAgICB0aGlzLmxvYWRlZCA9IFtdO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBjb25zdCB0b0xvYWQgPSB0aGlzLnF1ZXJpZXMudG9Mb2FkLnJlc3VsdHM7XG4gICAgd2hpbGUgKHRvTG9hZC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IHRvTG9hZFswXTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoR0xURkxvYWRlclN0YXRlKTtcbiAgICAgIGxvYWRlci5sb2FkKGVudGl0eS5nZXRDb21wb25lbnQoR0xURkxvYWRlcikudXJsLCBnbHRmID0+XG4gICAgICAgIHRoaXMubG9hZGVkLnB1c2goW2VudGl0eSwgZ2x0Zl0pXG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIERvIHRoZSBhY3R1YWwgZW50aXR5IGNyZWF0aW9uIGluc2lkZSB0aGUgc3lzdGVtIHRpY2sgbm90IGluIHRoZSBsb2FkZXIgY2FsbGJhY2tcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMubG9hZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBbZW50aXR5LCBnbHRmXSA9IHRoaXMubG9hZGVkW2ldO1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHTFRGTG9hZGVyKTtcbiAgICAgIGdsdGYuc2NlbmUudHJhdmVyc2UoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgIGNoaWxkLnJlY2VpdmVTaGFkb3cgPSBjb21wb25lbnQucmVjZWl2ZVNoYWRvdztcbiAgICAgICAgICBjaGlsZC5jYXN0U2hhZG93ID0gY29tcG9uZW50LmNhc3RTaGFkb3c7XG5cbiAgICAgICAgICBpZiAoY29tcG9uZW50LmVudk1hcE92ZXJyaWRlKSB7XG4gICAgICAgICAgICBjaGlsZC5tYXRlcmlhbC5lbnZNYXAgPSBjb21wb25lbnQuZW52TWFwT3ZlcnJpZGU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8qXG4gICAgICB0aGlzLndvcmxkXG4gICAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgICAuYWRkQ29tcG9uZW50KEdMVEZNb2RlbCwgeyB2YWx1ZTogZ2x0ZiB9KVxuICAgICAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQoZ2x0Zi5zY2VuZSwgY29tcG9uZW50LmFwcGVuZCAmJiBlbnRpdHkpO1xuKi9cblxuICAgICAgZW50aXR5XG4gICAgICAgIC5hZGRDb21wb25lbnQoR0xURk1vZGVsLCB7IHZhbHVlOiBnbHRmIH0pXG4gICAgICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChnbHRmLnNjZW5lLCBjb21wb25lbnQucGFyZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC5vbkxvYWRlZCkge1xuICAgICAgICBjb21wb25lbnQub25Mb2FkZWQoZ2x0Zi5zY2VuZSwgZ2x0Zik7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMubG9hZGVkLmxlbmd0aCA9IDA7XG5cbiAgICBjb25zdCB0b1VubG9hZCA9IHRoaXMucXVlcmllcy50b1VubG9hZC5yZXN1bHRzO1xuICAgIHdoaWxlICh0b1VubG9hZC5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGVudGl0eSA9IHRvVW5sb2FkWzBdO1xuICAgICAgZW50aXR5LnJlbW92ZUNvbXBvbmVudChHTFRGTG9hZGVyU3RhdGUpO1xuICAgICAgZW50aXR5LnJlbW92ZU9iamVjdDNEQ29tcG9uZW50KCk7XG4gICAgfVxuICB9XG59XG5cbkdMVEZMb2FkZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdG9Mb2FkOiB7XG4gICAgY29tcG9uZW50czogW0dMVEZMb2FkZXIsIE5vdChHTFRGTG9hZGVyU3RhdGUpXVxuICB9LFxuICB0b1VubG9hZDoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyU3RhdGUsIE5vdChHTFRGTG9hZGVyKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFNreUJveCwgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBTa3lCb3hTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgbGV0IHNreWJveCA9IGVudGl0eS5nZXRDb21wb25lbnQoU2t5Qm94KTtcblxuICAgICAgbGV0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMTAwLCAxMDAsIDEwMCk7XG4gICAgICBnZW9tZXRyeS5zY2FsZSgxLCAxLCAtMSk7XG5cbiAgICAgIGlmIChza3lib3gudHlwZSA9PT0gXCJjdWJlbWFwLXN0ZXJlb1wiKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShza3lib3gudGV4dHVyZVVybCwgMTIpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFscy5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgICBza3lCb3gubGF5ZXJzLnNldCgxKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveCk7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFsc1IgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gNjsgaiA8IDEyOyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHNSLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94UiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHNSKTtcbiAgICAgICAgc2t5Qm94Ui5sYXllcnMuc2V0KDIpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94Uik7XG5cbiAgICAgICAgZW50aXR5LmFkZE9iamVjdDNEQ29tcG9uZW50KGdyb3VwLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmtub3duIHNreWJveCB0eXBlOiBcIiwgc2t5Ym94LnR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoYXRsYXNJbWdVcmwsIHRpbGVzTnVtKSB7XG4gIGxldCB0ZXh0dXJlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXNOdW07IGkrKykge1xuICAgIHRleHR1cmVzW2ldID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgfVxuXG4gIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoKTtcbiAgbG9hZGVyLmxvYWQoYXRsYXNJbWdVcmwsIGZ1bmN0aW9uKGltYWdlT2JqKSB7XG4gICAgbGV0IGNhbnZhcywgY29udGV4dDtcbiAgICBsZXQgdGlsZVdpZHRoID0gaW1hZ2VPYmouaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRpbGVXaWR0aDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRpbGVXaWR0aDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZU9iaixcbiAgICAgICAgdGlsZVdpZHRoICogaSxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoXG4gICAgICApO1xuICAgICAgdGV4dHVyZXNbaV0uaW1hZ2UgPSBjYW52YXM7XG4gICAgICB0ZXh0dXJlc1tpXS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGV4dHVyZXM7XG59XG5cblNreUJveFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtTa3lCb3gsIE5vdChPYmplY3QzRENvbXBvbmVudCldXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVmlzaWJsZSwgT2JqZWN0M0RDb21wb25lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJpbGl0eVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHByb2Nlc3NWaXNpYmlsaXR5KGVudGl0aWVzKSB7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldE9iamVjdDNEKCkudmlzaWJsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoVmlzaWJsZSkudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkKTtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkKTtcbiAgfVxufVxuXG5WaXNpYmlsaXR5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1Zpc2libGUsIE9iamVjdDNEQ29tcG9uZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVGV4dE1lc2ggfSBmcm9tIFwidHJvaWthLTNkLXRleHQvZGlzdC90ZXh0bWVzaC1zdGFuZGFsb25lLmVzbS5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0RDb21wb25lbnQsIFRleHQgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxuY29uc3QgYW5jaG9yTWFwcGluZyA9IHtcbiAgbGVmdDogMCxcbiAgY2VudGVyOiAwLjUsXG4gIHJpZ2h0OiAxXG59O1xuY29uc3QgYmFzZWxpbmVNYXBwaW5nID0ge1xuICB0b3A6IDAsXG4gIGNlbnRlcjogMC41LFxuICBib3R0b206IDFcbn07XG5cbmV4cG9ydCBjbGFzcyBTREZUZXh0U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgdXBkYXRlVGV4dCh0ZXh0TWVzaCwgdGV4dENvbXBvbmVudCkge1xuICAgIHRleHRNZXNoLnRleHQgPSB0ZXh0Q29tcG9uZW50LnRleHQ7XG4gICAgdGV4dE1lc2gudGV4dEFsaWduID0gdGV4dENvbXBvbmVudC50ZXh0QWxpZ247XG4gICAgdGV4dE1lc2guYW5jaG9yWzBdID0gYW5jaG9yTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmFuY2hvcl07XG4gICAgdGV4dE1lc2guYW5jaG9yWzFdID0gYmFzZWxpbmVNYXBwaW5nW3RleHRDb21wb25lbnQuYmFzZWxpbmVdO1xuICAgIHRleHRNZXNoLmNvbG9yID0gdGV4dENvbXBvbmVudC5jb2xvcjtcbiAgICB0ZXh0TWVzaC5mb250ID0gdGV4dENvbXBvbmVudC5mb250O1xuICAgIHRleHRNZXNoLmZvbnRTaXplID0gdGV4dENvbXBvbmVudC5mb250U2l6ZTtcbiAgICB0ZXh0TWVzaC5sZXR0ZXJTcGFjaW5nID0gdGV4dENvbXBvbmVudC5sZXR0ZXJTcGFjaW5nIHx8IDA7XG4gICAgdGV4dE1lc2gubGluZUhlaWdodCA9IHRleHRDb21wb25lbnQubGluZUhlaWdodCB8fCBudWxsO1xuICAgIHRleHRNZXNoLm92ZXJmbG93V3JhcCA9IHRleHRDb21wb25lbnQub3ZlcmZsb3dXcmFwO1xuICAgIHRleHRNZXNoLndoaXRlU3BhY2UgPSB0ZXh0Q29tcG9uZW50LndoaXRlU3BhY2U7XG4gICAgdGV4dE1lc2gubWF4V2lkdGggPSB0ZXh0Q29tcG9uZW50Lm1heFdpZHRoO1xuICAgIHRleHRNZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSB0ZXh0Q29tcG9uZW50Lm9wYWNpdHk7XG4gICAgdGV4dE1lc2guc3luYygpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXM7XG5cbiAgICBlbnRpdGllcy5hZGRlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcblxuICAgICAgY29uc3QgdGV4dE1lc2ggPSBuZXcgVGV4dE1lc2goKTtcbiAgICAgIHRleHRNZXNoLm5hbWUgPSBcInRleHRNZXNoXCI7XG4gICAgICB0ZXh0TWVzaC5hbmNob3IgPSBbMCwgMF07XG4gICAgICB0ZXh0TWVzaC5yZW5kZXJPcmRlciA9IDEwOyAvL2JydXRlLWZvcmNlIGZpeCBmb3IgdWdseSBhbnRpYWxpYXNpbmcsIHNlZSBpc3N1ZSAjNjdcbiAgICAgIHRoaXMudXBkYXRlVGV4dCh0ZXh0TWVzaCwgdGV4dENvbXBvbmVudCk7XG4gICAgICBlLmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogdGV4dE1lc2ggfSk7XG4gICAgfSk7XG5cbiAgICBlbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSBlLmdldE9iamVjdDNEKCk7XG4gICAgICB2YXIgdGV4dE1lc2ggPSBvYmplY3QzRC5nZXRPYmplY3RCeU5hbWUoXCJ0ZXh0TWVzaFwiKTtcbiAgICAgIHRleHRNZXNoLmRpc3Bvc2UoKTtcbiAgICAgIG9iamVjdDNELnJlbW92ZSh0ZXh0TWVzaCk7XG4gICAgfSk7XG5cbiAgICBlbnRpdGllcy5jaGFuZ2VkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSBlLmdldE9iamVjdDNEKCk7XG4gICAgICBpZiAob2JqZWN0M0QgaW5zdGFuY2VvZiBUZXh0TWVzaCkge1xuICAgICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGUuZ2V0Q29tcG9uZW50KFRleHQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRleHQob2JqZWN0M0QsIHRleHRDb21wb25lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cblNERlRleHRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVGV4dF1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBDb21wb25lbnQsIFR5cGVzLCBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBSZW5kZXJQYXNzLFxuICBDYW1lcmFUYWdDb21wb25lbnQsXG4gIEFjdGl2ZSxcbiAgV2ViR0xSZW5kZXJlclxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBWUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvVlJCdXR0b24uanNcIjtcbmltcG9ydCB7IEFSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9BUkJ1dHRvbi5qc1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlckNvbnRleHQgZXh0ZW5kcyBDb21wb25lbnQge31cbldlYkdMUmVuZGVyZXJDb250ZXh0LnNjaGVtYSA9IHtcbiAgdmFsdWU6IHsgZGVmYXVsdDogbnVsbCwgdHlwZTogVHlwZXMuT2JqZWN0IH1cbn07XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLndvcmxkLnJlZ2lzdGVyQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29tcG9uZW50LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVbmluaXRpYWxpemVkIHJlbmRlcmVyc1xuICAgIHRoaXMucXVlcmllcy51bmluaXRpYWxpemVkUmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG5cbiAgICAgIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgICAgYW50aWFsaWFzOiBjb21wb25lbnQuYW50aWFsaWFzXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52ciB8fCBjb21wb25lbnQuYXIpIHtcbiAgICAgICAgcmVuZGVyZXIueHIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoVlJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50LmFyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0LCB7IHZhbHVlOiByZW5kZXJlciB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMuY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgIHZhciByZW5kZXJlciA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wb25lbnQud2lkdGggIT09IHJlbmRlcmVyLndpZHRoIHx8XG4gICAgICAgIGNvbXBvbmVudC5oZWlnaHQgIT09IHJlbmRlcmVyLmhlaWdodFxuICAgICAgKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUoY29tcG9uZW50LndpZHRoLCBjb21wb25lbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8gaW5uZXJXaWR0aC9pbm5lckhlaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJQYXNzZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyUGFzc11cbiAgfSxcbiAgYWN0aXZlQ2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmFUYWdDb21wb25lbnQsIEFjdGl2ZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBQYXJlbnRPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICBQb3NpdGlvbixcbiAgU2NhbGUsXG4gIFBhcmVudCxcbiAgT2JqZWN0M0RDb21wb25lbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gSGllcmFyY2h5XG4gICAgbGV0IGFkZGVkID0gdGhpcy5xdWVyaWVzLnBhcmVudC5hZGRlZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gYWRkZWRbaV07XG4gICAgICBpZiAoIWVudGl0eS5hbGl2ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciBwYXJlbnRFbnRpdHkgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCkudmFsdWU7XG4gICAgICBpZiAocGFyZW50RW50aXR5Lmhhc0NvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkpIHtcbiAgICAgICAgdmFyIHBhcmVudE9iamVjdDNEID0gcGFyZW50RW50aXR5LmdldE9iamVjdDNEKCk7XG4gICAgICAgIHZhciBjaGlsZE9iamVjdDNEID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG4gICAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIaWVyYXJjaHlcbiAgICB0aGlzLnF1ZXJpZXMucGFyZW50T2JqZWN0M0QuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHBhcmVudE9iamVjdDNEID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnRPYmplY3QzRCkudmFsdWU7XG4gICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgcGFyZW50T2JqZWN0M0QuYWRkKGNoaWxkT2JqZWN0M0QpO1xuICAgIH0pO1xuXG4gICAgLy8gVHJhbnNmb3Jtc1xuICAgIHZhciB0cmFuc2Zvcm1zID0gdGhpcy5xdWVyaWVzLnRyYW5zZm9ybXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdHJhbnNmb3Jtcy5hZGRlZFtpXTtcbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdHJhbnNmb3Jtcy5jaGFuZ2VkW2ldO1xuICAgICAgaWYgKCFlbnRpdHkuYWxpdmUpIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG5cbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aW9uXG4gICAgbGV0IHBvc2l0aW9ucyA9IHRoaXMucXVlcmllcy5wb3NpdGlvbnM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuYWRkZWRbaV07XG4gICAgICBsZXQgcG9zaXRpb24gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZTtcblxuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG5cbiAgICAgIC8vIExpbmsgdGhlbVxuICAgICAgZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWUgPSBvYmplY3QucG9zaXRpb247XG4gICAgfVxuLypcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmNoYW5nZWRbaV07XG4gICAgICBsZXQgcG9zaXRpb24gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuICAgIH1cbiovXG4gICAgLy8gU2NhbGVcbiAgICBsZXQgc2NhbGVzID0gdGhpcy5xdWVyaWVzLnNjYWxlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHNjYWxlcy5hZGRlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5zY2FsZS5jb3B5KHNjYWxlKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmNoYW5nZWRbaV07XG4gICAgICBsZXQgc2NhbGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjYWxlKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50T2JqZWN0M0Q6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50T2JqZWN0M0QsIE9iamVjdDNEQ29tcG9uZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRENvbXBvbmVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3Jtczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgVHJhbnNmb3JtXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RyYW5zZm9ybV1cbiAgICB9XG4gIH0sXG4gIHBvc2l0aW9uczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgUG9zaXRpb25dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbUG9zaXRpb25dXG4gICAgfVxuICB9LFxuICBzY2FsZXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0RDb21wb25lbnQsIFNjYWxlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1NjYWxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBDYW1lcmFUYWdDb21wb25lbnQsXG4gIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnLFxuICBPYmplY3QzRENvbXBvbmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlc2l6ZVwiLCB0aGlzLmFzcGVjdCk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2FtZXJhcyA9IHRoaXMucXVlcmllcy5jYW1lcmFzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW1lcmFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2FtZXJhT2JqID0gY2FtZXJhc1tpXS5nZXRPYmplY3QzRCgpO1xuICAgICAgaWYgKGNhbWVyYU9iai5hc3BlY3QgIT09IHRoaXMuYXNwZWN0KSB7XG4gICAgICAgIGNhbWVyYU9iai5hc3BlY3QgPSB0aGlzLmFzcGVjdDtcbiAgICAgICAgY2FtZXJhT2JqLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmFUYWdDb21wb25lbnQsIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnLCBPYmplY3QzRENvbXBvbmVudF1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0RDb21wb25lbnRcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSB9IGZyb20gXCIuLi9jb21wb25lbnRzL1RleHRHZW9tZXRyeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgdGhpcy5mb250ID0gbnVsbDtcbiAgICAvKlxuICAgIGxvYWRlci5sb2FkKFwiL2Fzc2V0cy9mb250cy9oZWx2ZXRpa2VyX3JlZ3VsYXIudHlwZWZhY2UuanNvblwiLCBmb250ID0+IHtcbiAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICAqL1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkuZ2V0T2JqZWN0M0QoKS5nZW9tZXRyeSA9IGdlb21ldHJ5O1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZGVkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkO1xuICAgIGFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb2xvciA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcbiAgICAgIGNvbG9yID0gMHhmZmZmZmY7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogbWVzaCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dEdlb21ldHJ5XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCwgU2NlbmUsIE9iamVjdDNEQ29tcG9uZW50LCBFbnZpcm9ubWVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudmlyb25tZW50cy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAvLyBzdGFnZSBncm91bmQgZGlhbWV0ZXIgKGFuZCBza3kgcmFkaXVzKVxuICAgICAgdmFyIFNUQUdFX1NJWkUgPSAyMDA7XG5cbiAgICAgIC8vIGNyZWF0ZSBncm91bmRcbiAgICAgIC8vIHVwZGF0ZSBncm91bmQsIHBsYXlhcmVhIGFuZCBncmlkIHRleHR1cmVzLlxuICAgICAgdmFyIGdyb3VuZFJlc29sdXRpb24gPSAyMDQ4O1xuICAgICAgdmFyIHRleE1ldGVycyA9IDIwOyAvLyBncm91bmQgdGV4dHVyZSBvZiAyMCB4IDIwIG1ldGVyc1xuICAgICAgdmFyIHRleFJlcGVhdCA9IFNUQUdFX1NJWkUgLyB0ZXhNZXRlcnM7XG5cbiAgICAgIHZhciByZXNvbHV0aW9uID0gNjQ7IC8vIG51bWJlciBvZiBkaXZpc2lvbnMgb2YgdGhlIGdyb3VuZCBtZXNoXG5cbiAgICAgIHZhciBncm91bmRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgZ3JvdW5kQ2FudmFzLndpZHRoID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZENhbnZhcy5oZWlnaHQgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgdmFyIGdyb3VuZFRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShncm91bmRDYW52YXMpO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS5yZXBlYXQuc2V0KHRleFJlcGVhdCwgdGV4UmVwZWF0KTtcblxuICAgICAgdGhpcy5lbnZpcm9ubWVudERhdGEgPSB7XG4gICAgICAgIGdyb3VuZENvbG9yOiBcIiM0NTQ1NDVcIixcbiAgICAgICAgZ3JvdW5kQ29sb3IyOiBcIiM1ZDVkNWRcIlxuICAgICAgfTtcblxuICAgICAgdmFyIGdyb3VuZGN0eCA9IGdyb3VuZENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgIHZhciBzaXplID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjtcbiAgICAgIGdyb3VuZGN0eC5maWxsUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjI7XG4gICAgICB2YXIgbnVtID0gTWF0aC5mbG9vcih0ZXhNZXRlcnMgLyAyKTtcbiAgICAgIHZhciBzdGVwID0gc2l6ZSAvICh0ZXhNZXRlcnMgLyAyKTsgLy8gMiBtZXRlcnMgPT0gPHN0ZXA+IHBpeGVsc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW0gKyAxOyBpICs9IDIpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW0gKyAxOyBqKyspIHtcbiAgICAgICAgICBncm91bmRjdHguZmlsbFJlY3QoXG4gICAgICAgICAgICBNYXRoLmZsb29yKChpICsgKGogJSAyKSkgKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3IoaiAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdyb3VuZFRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICB2YXIgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIG1hcDogZ3JvdW5kVGV4dHVyZVxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzY2VuZSA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgLy9zY2VuZS5hZGQobWVzaCk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICByZXNvbHV0aW9uIC0gMSxcbiAgICAgICAgcmVzb2x1dGlvbiAtIDFcbiAgICAgICk7XG5cbiAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiB3aW5kb3cuZW50aXR5U2NlbmUgfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0gMHgzMzMzMzM7XG4gICAgICBjb25zdCBuZWFyID0gMjA7XG4gICAgICBjb25zdCBmYXIgPSAxMDA7XG4gICAgICBzY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKGNvbG9yLCBuZWFyLCBmYXIpO1xuICAgICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcik7XG4gICAgfSk7XG4gIH1cbn1cblxuRW52aXJvbm1lbnRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW52aXJvbm1lbnRzOiB7XG4gICAgY29tcG9uZW50czogW1NjZW5lLCBFbnZpcm9ubWVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXJDb250ZXh0LFxuICBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cixcbiAgVlJDb250cm9sbGVyLFxuICBDb250cm9sbGVyQ29ubmVjdGVkLFxuICBPYmplY3QzRENvbXBvbmVudFxufSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5LmpzXCI7XG5cbnZhciBjb250cm9sbGVyTW9kZWxGYWN0b3J5ID0gbmV3IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSgpO1xuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXIgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJDb250ZXh0LnJlc3VsdHNbMF0uZ2V0Q29tcG9uZW50KFxuICAgICAgV2ViR0xSZW5kZXJlckNvbnRleHRcbiAgICApLnZhbHVlO1xuXG4gICAgdGhpcy5xdWVyaWVzLmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb250cm9sbGVySWQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlcikuaWQ7XG4gICAgICB2YXIgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXIubmFtZSA9IFwiY29udHJvbGxlclwiO1xuXG4gICAgICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IGdyb3VwIH0pO1xuXG4gICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjb25uZWN0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KENvbnRyb2xsZXJDb25uZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRpc2Nvbm5lY3RlZFwiLCAoKSA9PiB7XG4gICAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoQ29udHJvbGxlckNvbm5lY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpKSB7XG4gICAgICAgIHZhciBiZWhhdmlvdXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKTtcbiAgICAgICAgT2JqZWN0LmtleXMoYmVoYXZpb3VyKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKGJlaGF2aW91cltldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBiZWhhdmlvdXJbZXZlbnROYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB3aWxsIGF1dG9tYXRpY2FsbHkgZmV0Y2ggY29udHJvbGxlciBtb2RlbHNcbiAgICAgIC8vIHRoYXQgbWF0Y2ggd2hhdCB0aGUgdXNlciBpcyBob2xkaW5nIGFzIGNsb3NlbHkgYXMgcG9zc2libGUuIFRoZSBtb2RlbHNcbiAgICAgIC8vIHNob3VsZCBiZSBhdHRhY2hlZCB0byB0aGUgb2JqZWN0IHJldHVybmVkIGZyb20gZ2V0Q29udHJvbGxlckdyaXAgaW5cbiAgICAgIC8vIG9yZGVyIHRvIG1hdGNoIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgaGVsZCBkZXZpY2UuXG4gICAgICBsZXQgY29udHJvbGxlckdyaXAgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyR3JpcChjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlckdyaXAuYWRkKFxuICAgICAgICBjb250cm9sbGVyTW9kZWxGYWN0b3J5LmNyZWF0ZUNvbnRyb2xsZXJNb2RlbChjb250cm9sbGVyR3JpcClcbiAgICAgICk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlckdyaXApO1xuICAgICAgLypcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKFxuICAgICAgICBcInBvc2l0aW9uXCIsXG4gICAgICAgIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKFswLCAwLCAwLCAwLCAwLCAtMV0sIDMpXG4gICAgICApO1xuXG4gICAgICB2YXIgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5KTtcbiAgICAgIGxpbmUubmFtZSA9IFwibGluZVwiO1xuICAgICAgbGluZS5zY2FsZS56ID0gNTtcbiAgICAgIGdyb3VwLmFkZChsaW5lKTtcblxuICAgICAgbGV0IGdlb21ldHJ5MiA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgwLjEsIDAuMSwgMC4xKTtcbiAgICAgIGxldCBtYXRlcmlhbDIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMGZmMDAgfSk7XG4gICAgICBsZXQgY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5MiwgbWF0ZXJpYWwyKTtcbiAgICAgIGdyb3VwLm5hbWUgPSBcIlZSQ29udHJvbGxlclwiO1xuICAgICAgZ3JvdXAuYWRkKGN1YmUpO1xuKi9cbiAgICB9KTtcblxuICAgIC8vIHRoaXMuY2xlYW5JbnRlcnNlY3RlZCgpO1xuICB9XG59XG5cblZSQ29udHJvbGxlclN5c3RlbS5xdWVyaWVzID0ge1xuICBjb250cm9sbGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtWUkNvbnRyb2xsZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICAgIC8vY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9LFxuICByZW5kZXJlckNvbnRleHQ6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIG1hbmRhdG9yeTogdHJ1ZVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgUGxheSwgU3RvcCwgR0xURk1vZGVsLCBBbmltYXRpb24gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5jbGFzcyBBbmltYXRpb25NaXhlckNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgcmVzZXQoKSB7fVxufVxuXG5jbGFzcyBBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZShkZWx0YSkge1xuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgZ2x0ZiA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURk1vZGVsKS52YWx1ZTtcbiAgICAgIGxldCBtaXhlciA9IG5ldyBUSFJFRS5BbmltYXRpb25NaXhlcihnbHRmLnNjZW5lKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQsIHtcbiAgICAgICAgdmFsdWU6IG1peGVyXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBbXTtcbiAgICAgIGdsdGYuYW5pbWF0aW9ucy5mb3JFYWNoKGFuaW1hdGlvbkNsaXAgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBtaXhlci5jbGlwQWN0aW9uKGFuaW1hdGlvbkNsaXAsIGdsdGYuc2NlbmUpO1xuICAgICAgICBhY3Rpb24ubG9vcCA9IFRIUkVFLkxvb3BPbmNlO1xuICAgICAgICBhbmltYXRpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgIH0pO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIHtcbiAgICAgICAgYW5pbWF0aW9uczogYW5pbWF0aW9ucyxcbiAgICAgICAgZHVyYXRpb246IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uKS5kdXJhdGlvblxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMubWl4ZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25NaXhlckNvbXBvbmVudCkudmFsdWUudXBkYXRlKGRlbHRhKTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5wbGF5Q2xpcHMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5hbmltYXRpb25zLmZvckVhY2goYWN0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGlmIChjb21wb25lbnQuZHVyYXRpb24gIT09IC0xKSB7XG4gICAgICAgICAgYWN0aW9uQ2xpcC5zZXREdXJhdGlvbihjb21wb25lbnQuZHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWN0aW9uQ2xpcC5jbGFtcFdoZW5GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIGFjdGlvbkNsaXAucmVzZXQoKTtcbiAgICAgICAgYWN0aW9uQ2xpcC5wbGF5KCk7XG4gICAgICB9KTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoUGxheSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuc3RvcENsaXBzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQpXG4gICAgICAgIC5hbmltYXRpb25zO1xuICAgICAgYW5pbWF0aW9ucy5mb3JFYWNoKGFjdGlvbkNsaXAgPT4ge1xuICAgICAgICBhY3Rpb25DbGlwLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkNsaXAuc3RvcCgpO1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFN0b3ApO1xuICAgIH0pO1xuICB9XG59XG5cbkFuaW1hdGlvblN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb24sIEdMVEZNb2RlbF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbWl4ZXJzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbk1peGVyQ29tcG9uZW50XVxuICB9LFxuICBwbGF5Q2xpcHM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwgUGxheV1cbiAgfSxcbiAgc3RvcENsaXBzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIFN0b3BdXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgSW5wdXRTdGF0ZVxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIC8vISEhISEhISEhISEhIVxuICAgIHRoaXMud29ybGQucmVnaXN0ZXJDb21wb25lbnQoSW5wdXRTdGF0ZSk7XG5cbiAgICBsZXQgZW50aXR5ID0gdGhpcy53b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoSW5wdXRTdGF0ZSk7XG4gICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoSW5wdXRTdGF0ZSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1ZSQ29udHJvbGxlcnMoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NLZXlib2FyZCgpO1xuICAgIC8vIHRoaXMucHJvY2Vzc01vdXNlKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzR2FtZXBhZHMoKTtcbiAgfVxuXG4gIHByb2Nlc3NWUkNvbnRyb2xsZXJzKCkge1xuICAgIC8vIFByb2Nlc3MgcmVjZW50bHkgYWRkZWQgY29udHJvbGxlcnNcbiAgICB0aGlzLnF1ZXJpZXMudnJjb250cm9sbGVycy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLCB7XG4gICAgICAgIHNlbGVjdHN0YXJ0OiBldmVudCA9PiB7XG4gICAgICAgICAgbGV0IHN0YXRlID0gdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZ2V0KGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSB0cnVlO1xuICAgICAgICAgIHN0YXRlLnByZXZTZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICB9LFxuICAgICAgICBzZWxlY3RlbmQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5nZXQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgIHN0YXRlLnByZXZTZWxlY3RlZCA9IHRydWU7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbm5lY3RlZDogZXZlbnQgPT4ge1xuICAgICAgICAgIHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLnNldChldmVudC50YXJnZXQsIHt9KTtcbiAgICAgICAgfSxcbiAgICAgICAgZGlzY29ubmVjdGVkOiBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZGVsZXRlKGV2ZW50LnRhcmdldCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVXBkYXRlIHN0YXRlXG4gICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuZm9yRWFjaChzdGF0ZSA9PiB7XG4gICAgICBzdGF0ZS5zZWxlY3RTdGFydCA9IHN0YXRlLnNlbGVjdGVkICYmICFzdGF0ZS5wcmV2U2VsZWN0ZWQ7XG4gICAgICBzdGF0ZS5zZWxlY3RFbmQgPSAhc3RhdGUuc2VsZWN0ZWQgJiYgc3RhdGUucHJldlNlbGVjdGVkO1xuICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gc3RhdGUuc2VsZWN0ZWQ7XG4gICAgfSk7XG4gIH1cbn1cblxuSW5wdXRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdnJjb250cm9sbGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtWUkNvbnRyb2xsZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYyBleHRlbmRzIFRIUkVFLk9iamVjdDNEIHtcbiAgY29uc3RydWN0b3IobGlzdGVuZXIsIHBvb2xTaXplKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gICAgdGhpcy5jb250ZXh0ID0gbGlzdGVuZXIuY29udGV4dDtcblxuICAgIHRoaXMucG9vbFNpemUgPSBwb29sU2l6ZSB8fCA1O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wb29sU2l6ZTsgaSsrKSB7XG4gICAgICB0aGlzLmNoaWxkcmVuLnB1c2gobmV3IFRIUkVFLlBvc2l0aW9uYWxBdWRpbyhsaXN0ZW5lcikpO1xuICAgIH1cbiAgfVxuXG4gIHNldEJ1ZmZlcihidWZmZXIpIHtcbiAgICB0aGlzLmNoaWxkcmVuLmZvckVhY2goc291bmQgPT4ge1xuICAgICAgc291bmQuc2V0QnVmZmVyKGJ1ZmZlcik7XG4gICAgfSk7XG4gIH1cblxuICBwbGF5KCkge1xuICAgIHZhciBmb3VuZCA9IGZhbHNlO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5jaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IHNvdW5kID0gdGhpcy5jaGlsZHJlbltpXTtcbiAgICAgIGlmICghc291bmQuaXNQbGF5aW5nICYmIHNvdW5kLmJ1ZmZlciAmJiAhZm91bmQpIHtcbiAgICAgICAgc291bmQucGxheSgpO1xuICAgICAgICBzb3VuZC5pc1BhdXNlZCA9IGZhbHNlO1xuICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZm91bmQpIHtcbiAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgXCJBbGwgdGhlIHNvdW5kcyBhcmUgcGxheWluZy4gSWYgeW91IG5lZWQgdG8gcGxheSBtb3JlIHNvdW5kcyBzaW11bHRhbmVvdXNseSBjb25zaWRlciBpbmNyZWFzaW5nIHRoZSBwb29sIHNpemVcIlxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH1cbn1cbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFNvdW5kIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCBQb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljIGZyb20gXCIuLi9saWIvUG9zaXRpb25hbEF1ZGlvUG9seXBob25pYy5qc1wiO1xuXG5leHBvcnQgY2xhc3MgU291bmRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMubGlzdGVuZXIgPSBuZXcgVEhSRUUuQXVkaW9MaXN0ZW5lcigpO1xuICB9XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLnNvdW5kcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChTb3VuZCk7XG4gICAgICBjb25zdCBzb3VuZCA9IG5ldyBQb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljKHRoaXMubGlzdGVuZXIsIDEwKTtcbiAgICAgIGNvbnN0IGF1ZGlvTG9hZGVyID0gbmV3IFRIUkVFLkF1ZGlvTG9hZGVyKCk7XG4gICAgICBhdWRpb0xvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGJ1ZmZlciA9PiB7XG4gICAgICAgIHNvdW5kLnNldEJ1ZmZlcihidWZmZXIpO1xuICAgICAgfSk7XG4gICAgICBjb21wb25lbnQuc291bmQgPSBzb3VuZDtcbiAgICB9KTtcbiAgfVxufVxuXG5Tb3VuZFN5c3RlbS5xdWVyaWVzID0ge1xuICBzb3VuZHM6IHtcbiAgICBjb21wb25lbnRzOiBbU291bmRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZSAvLyBbU291bmRdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgX0VudGl0eSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRENvbXBvbmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIEVDU1lUaHJlZUVudGl0eSBleHRlbmRzIF9FbnRpdHkge1xuICBhZGRPYmplY3QzRENvbXBvbmVudChvYmosIHBhcmVudEVudGl0eSkge1xuICAgIG9iai5lbnRpdHkgPSB0aGlzO1xuICAgIHRoaXMuYWRkQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50LCB7IHZhbHVlOiBvYmogfSk7XG4gICAgdGhpcy5fZW50aXR5TWFuYWdlci53b3JsZC5vYmplY3QzREluZmxhdG9yLmluZmxhdGUodGhpcywgb2JqKTtcbiAgICBpZiAocGFyZW50RW50aXR5ICYmIHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpKSB7XG4gICAgICBwYXJlbnRFbnRpdHkuZ2V0T2JqZWN0M0QoKS5hZGQob2JqKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZW1vdmVPYmplY3QzRENvbXBvbmVudCh1bnBhcmVudCA9IHRydWUpIHtcbiAgICBjb25zdCBvYmogPSB0aGlzLmdldENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgaWYgKHVucGFyZW50KSB7XG4gICAgICAvLyBVc2luZyBcInRydWVcIiBhcyB0aGUgZW50aXR5IGNvdWxkIGJlIHJlbW92ZWQgc29tZXdoZXJlIGVsc2VcbiAgICAgIG9iai5wYXJlbnQgJiYgb2JqLnBhcmVudC5yZW1vdmUob2JqKTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpO1xuICAgIHRoaXMuX2VudGl0eU1hbmFnZXIud29ybGQub2JqZWN0M0RJbmZsYXRvci5kZWZsYXRlKHRoaXMsIG9iaik7XG4gICAgb2JqLmVudGl0eSA9IG51bGw7XG4gIH1cblxuICByZW1vdmUoZm9yY2VJbW1lZGlhdGUpIHtcbiAgICBpZiAodGhpcy5oYXNDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpKSB7XG4gICAgICBjb25zdCBvYmogPSB0aGlzLmdldE9iamVjdDNEKCk7XG4gICAgICBvYmoudHJhdmVyc2UobyA9PiB7XG4gICAgICAgIHRoaXMuX2VudGl0eU1hbmFnZXIucmVtb3ZlRW50aXR5KG8uZW50aXR5LCBmb3JjZUltbWVkaWF0ZSk7XG4gICAgICAgIG8uZW50aXR5ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgb2JqLnBhcmVudCAmJiBvYmoucGFyZW50LnJlbW92ZShvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eSh0aGlzLCBmb3JjZUltbWVkaWF0ZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0T2JqZWN0M0QoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0Q29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KS52YWx1ZTtcbiAgfVxufVxuIiwiaW1wb3J0IHtcbiAgTWVzaFRhZ0NvbXBvbmVudCxcbiAgU2NlbmVUYWdDb21wb25lbnQsXG4gIENhbWVyYVRhZ0NvbXBvbmVudFxufSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0T2JqZWN0M0RJbmZsYXRvciA9IHtcbiAgaW5mbGF0ZTogKGVudGl0eSwgb2JqKSA9PiB7XG4gICAgLy8gVE9ETyBzdXBwb3J0IG1vcmUgdGFncyBhbmQgcHJvYmFibHkgYSB3YXkgdG8gYWRkIHVzZXIgZGVmaW5lZCBvbmVzXG4gICAgaWYgKG9iai5pc01lc2gpIHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoTWVzaFRhZ0NvbXBvbmVudCk7XG4gICAgfSBlbHNlIGlmIChvYmouaXNTY2VuZSkge1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChTY2VuZVRhZ0NvbXBvbmVudCk7XG4gICAgfSBlbHNlIGlmIChvYmouaXNDYW1lcmEpIHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQ2FtZXJhVGFnQ29tcG9uZW50KTtcbiAgICB9XG4gIH0sXG4gIGRlZmxhdGU6IChlbnRpdHksIG9iaikgPT4ge1xuICAgIC8vIFRPRE8gc3VwcG9ydCBtb3JlIHRhZ3MgYW5kIHByb2JhYmx5IGEgd2F5IHRvIGFkZCB1c2VyIGRlZmluZWQgb25lc1xuICAgIGlmIChvYmouaXNNZXNoKSB7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KE1lc2hUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzU2NlbmUpIHtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoU2NlbmVUYWdDb21wb25lbnQpO1xuICAgIH0gZWxzZSBpZiAob2JqLmlzQ2FtZXJhKSB7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KENhbWVyYVRhZ0NvbXBvbmVudCk7XG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgV29ybGQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgRUNTWVRocmVlRW50aXR5IH0gZnJvbSBcIi4vZW50aXR5LmpzXCI7XG5pbXBvcnQgeyBkZWZhdWx0T2JqZWN0M0RJbmZsYXRvciB9IGZyb20gXCIuL2RlZmF1bHRPYmplY3QzREluZmxhdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBFQ1NZVGhyZWVXb3JsZCBleHRlbmRzIFdvcmxkIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIHN1cGVyKE9iamVjdC5hc3NpZ24oe30sIHsgZW50aXR5Q2xhc3M6IEVDU1lUaHJlZUVudGl0eSB9LCBvcHRpb25zKSk7XG4gICAgdGhpcy5vYmplY3QzREluZmxhdG9yID0gZGVmYXVsdE9iamVjdDNESW5mbGF0b3I7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBVcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0uanNcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXIsXG4gIFNjZW5lLFxuICBBY3RpdmUsXG4gIFJlbmRlclBhc3MsXG4gIE9iamVjdDNEQ29tcG9uZW50LFxuICBDYW1lcmEsXG4gIFNjZW5lVGFnQ29tcG9uZW50LFxuICBDYW1lcmFUYWdDb21wb25lbnQsXG4gIE1lc2hUYWdDb21wb25lbnQsXG4gIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuaW1wb3J0IHsgRUNTWVRocmVlV29ybGQgfSBmcm9tIFwiLi93b3JsZC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSh3b3JsZCA9IG5ldyBFQ1NZVGhyZWVXb3JsZCgpLCBvcHRpb25zKSB7XG4gIGlmICghKHdvcmxkIGluc3RhbmNlb2YgRUNTWVRocmVlV29ybGQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJUaGUgcHJvdmlkZWQgJ3dvcmxkJyBwYXJlbWV0ZXIgaXMgbm90IGFuIGluc3RhbmNlIG9mICdFQ1NZVGhyZWVXb3JsZCdcIlxuICAgICk7XG4gIH1cblxuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShVcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oV2ViR0xSZW5kZXJlclN5c3RlbSlcblxuICB3b3JsZFxuICAgIC5yZWdpc3RlckNvbXBvbmVudChXZWJHTFJlbmRlcmVyKVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChTY2VuZSlcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoQWN0aXZlKVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChPYmplY3QzRENvbXBvbmVudClcbiAgICAucmVnaXN0ZXJDb21wb25lbnQoUmVuZGVyUGFzcylcbi8vICAgIC5yZWdpc3RlckNvbXBvbmVudChUcmFuc2Zvcm0pXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KENhbWVyYSlcbiAgICAvLyBUYWdzXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KFNjZW5lVGFnQ29tcG9uZW50KVxuICAgIC5yZWdpc3RlckNvbXBvbmVudChDYW1lcmFUYWdDb21wb25lbnQpXG4gICAgLnJlZ2lzdGVyQ29tcG9uZW50KE1lc2hUYWdDb21wb25lbnQpXG5cbiAgICAucmVnaXN0ZXJDb21wb25lbnQoVXBkYXRlQXNwZWN0T25SZXNpemVUYWcpXG5cblxuICBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgdnI6IGZhbHNlLFxuICAgIGRlZmF1bHRzOiB0cnVlXG4gIH07XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgaWYgKCFvcHRpb25zLmRlZmF1bHRzKSB7XG4gICAgcmV0dXJuIHsgd29ybGQgfTtcbiAgfVxuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChuZXcgVEhSRUUuU2NlbmUoKSk7XG5cbiAgbGV0IHJlbmRlcmVyID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIsIHtcbiAgICBhcjogb3B0aW9ucy5hcixcbiAgICB2cjogb3B0aW9ucy52cixcbiAgICBhbmltYXRpb25Mb29wOiBhbmltYXRpb25Mb29wXG4gIH0pO1xuXG4gIC8vIGNhbWVyYSByaWcgJiBjb250cm9sbGVyc1xuICB2YXIgY2FtZXJhID0gbnVsbCxcbiAgICBjYW1lcmFSaWcgPSBudWxsO1xuXG4gIC8vIGlmIChvcHRpb25zLmFyIHx8IG9wdGlvbnMudnIpIHtcbiAgLy8gICBjYW1lcmFSaWcgPSB3b3JsZFxuICAvLyAgICAgLmNyZWF0ZUVudGl0eSgpXG4gIC8vICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgLy8gICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KTtcbiAgLy8gfVxuXG4gIHtcbiAgICBjYW1lcmEgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYSlcbiAgICAgIC5hZGRDb21wb25lbnQoVXBkYXRlQXNwZWN0T25SZXNpemVUYWcpXG4gICAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQoXG4gICAgICAgIG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgICAgICA5MCxcbiAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAwLjEsXG4gICAgICAgICAgMTAwXG4gICAgICAgICksXG4gICAgICAgIHNjZW5lXG4gICAgICApXG4gICAgICAuYWRkQ29tcG9uZW50KEFjdGl2ZSk7XG4gIH1cblxuICBsZXQgcmVuZGVyUGFzcyA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChSZW5kZXJQYXNzLCB7XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd29ybGQsXG4gICAgZW50aXRpZXM6IHtcbiAgICAgIHNjZW5lLFxuICAgICAgY2FtZXJhLFxuICAgICAgY2FtZXJhUmlnLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICByZW5kZXJQYXNzXG4gICAgfVxuICB9O1xufVxuIl0sIm5hbWVzIjpbIlRIUkVFLlZlY3RvcjIiLCJUSFJFRS5WZWN0b3IzIiwiVGhyZWVUeXBlcy5WZWN0b3IzVHlwZSIsIlRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsIiwiVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwiLCJUSFJFRS5NZXNoIiwiR0xURkxvYWRlclRocmVlIiwiVEhSRUUuR3JvdXAiLCJUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCIsIlRIUkVFLlRleHR1cmUiLCJUSFJFRS5JbWFnZUxvYWRlciIsIlRIUkVFLldlYkdMUmVuZGVyZXIiLCJUSFJFRS5Gb250TG9hZGVyIiwiVEhSRUUuVGV4dEdlb21ldHJ5IiwiVEhSRUUuUmVwZWF0V3JhcHBpbmciLCJUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuRm9nIiwiVEhSRUUuQ29sb3IiLCJUSFJFRS5BbmltYXRpb25NaXhlciIsIlRIUkVFLkxvb3BPbmNlIiwiVEhSRUUuT2JqZWN0M0QiLCJUSFJFRS5Qb3NpdGlvbmFsQXVkaW8iLCJUSFJFRS5BdWRpb0xpc3RlbmVyIiwiVEhSRUUuQXVkaW9Mb2FkZXIiLCJUSFJFRS5DbG9jayIsIlRIUkVFLlNjZW5lIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUNPLE1BQU0sTUFBTSxTQUFTLFlBQVksQ0FBQyxFQUFFOztBQ0RwQyxNQUFNLFNBQVMsQ0FBQztFQUNyQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ3BCOztFQUVELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUMzQixJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0dBQ3BCO0NBQ0Y7O0FDUk0sTUFBTSxNQUFNLFNBQVMsU0FBUyxDQUFDLEVBQUU7O0FBRXhDLE1BQU0sQ0FBQyxNQUFNLEdBQUc7RUFDZCxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3hDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDMUMsSUFBSSxFQUFFLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUMxQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzFDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDMUMsWUFBWSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtDQUNyRCxDQUFDOztBQ1hLLE1BQU0sU0FBUyxDQUFDO0VBQ3JCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNkOztFQUVELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ3BCO0NBQ0Y7O0FDVk0sTUFBTSxTQUFTLENBQUM7RUFDckIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7SUFDeEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7R0FDekI7RUFDRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLENBQUM7R0FDekI7Q0FDRjs7QUNUTSxNQUFNLGNBQWMsQ0FBQztFQUMxQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsYUFBYSxHQUFHLEVBQUUsQ0FBQztHQUN6QjtFQUNELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztHQUMvQjtDQUNGOztBQ1BNLE1BQU0sYUFBYSxDQUFDO0VBQ3pCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDO0dBQ3pCO0VBQ0QsS0FBSyxHQUFHO0lBQ04sSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0dBQy9CO0NBQ0Y7O0FDUE0sTUFBTSxTQUFTLENBQUM7RUFDckIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2Q7O0VBRUQsS0FBSyxHQUFHO0lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7R0FDcEI7Q0FDRjs7QUNQTSxNQUFNLFFBQVEsU0FBUyxZQUFZLENBQUMsRUFBRTs7QUNEdEMsTUFBTSxXQUFXLENBQUM7RUFDdkIsS0FBSyxHQUFHLEVBQUU7RUFDVixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztJQUNwQixJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztJQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztJQUNkLElBQUksQ0FBQyxPQUFPLEdBQUcsWUFBWSxDQUFDO0lBQzVCLElBQUksQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0lBQ25CLElBQUksQ0FBQyxZQUFZLEdBQUcsRUFBRSxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDO0lBQzFCLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxhQUFhLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDN0MsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7O0lBRWIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7O0lBRWxCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBQ3RCLElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxDQUFDO0lBQzVCLElBQUksQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO0lBQzdCLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDOztJQUU5QixJQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQztJQUN2QixJQUFJLENBQUMsY0FBYyxHQUFHLEVBQUUsQ0FBQztJQUN6QixJQUFJLENBQUMsYUFBYSxHQUFHLFNBQVMsQ0FBQztJQUMvQixJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsQ0FBQztJQUN2QixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0lBQzdDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFDakMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLENBQUMsQ0FBQzs7SUFFNUIsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7SUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7R0FDekI7Q0FDRjs7QUNuQ00sTUFBTSxRQUFRLENBQUM7RUFDcEIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7R0FDeEI7O0VBRUQsS0FBSyxHQUFHO0lBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7R0FDeEI7Q0FDRjs7QUNOTSxNQUFNLFVBQVUsU0FBUyxTQUFTLENBQUMsRUFBRTs7QUFFNUMsVUFBVSxDQUFDLE1BQU0sR0FBRztFQUNsQixHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3hDLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDdEQsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtFQUNuRCxjQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3JELE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDOUMsUUFBUSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUMvQyxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0NBQzlDLENBQUM7O0FDVkssTUFBTSxTQUFTLFNBQVMsU0FBUyxDQUFDLEVBQUU7O0FBRTNDLFNBQVMsQ0FBQyxNQUFNLEdBQUc7RUFDakIsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUM3QyxDQUFDOztBQ0pLLE1BQU0sVUFBVSxTQUFTLFNBQVMsQ0FBQyxFQUFFOztBQUU1QyxVQUFVLENBQUMsTUFBTSxHQUFHO0VBQ2xCLGFBQWEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEdBQUcsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3pELFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDN0MsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUMxQyxRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0NBQzlDLENBQUM7O0FDUEssTUFBTSxLQUFLLEdBQUc7RUFDbkIsS0FBSyxFQUFFLENBQUM7RUFDUixJQUFJLEVBQUUsQ0FBQztFQUNQLE1BQU0sRUFBRSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sT0FBTyxHQUFHO0VBQ3JCLFFBQVEsRUFBRSxDQUFDO0VBQ1gsSUFBSSxFQUFFLENBQUM7Q0FDUixDQUFDOztBQUVGLEFBQU8sTUFBTSxRQUFRLEdBQUc7RUFDdEIsTUFBTSxFQUFFLENBQUM7RUFDVCxRQUFRLEVBQUUsQ0FBQztFQUNYLFdBQVcsRUFBRSxDQUFDO0VBQ2QsUUFBUSxFQUFFLENBQUM7Q0FDWixDQUFDOztBQUVGLEFBQU8sTUFBTSxhQUFhLEdBQUc7RUFDM0IsSUFBSSxFQUFFLENBQUM7RUFDUCxJQUFJLEVBQUUsQ0FBQztFQUNQLE1BQU0sRUFBRSxDQUFDO0NBQ1YsQ0FBQzs7QUFFRixBQUFPLE1BQU0sUUFBUSxDQUFDO0VBQ3BCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0lBQ25CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQ3pCLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2xCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSUEsT0FBYSxFQUFFLENBQUM7SUFDbEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDbkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJQSxPQUFhLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztHQUNqQzs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztJQUN0QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztJQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN0QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN2QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUN6QixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNsQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxHQUFHLENBQUM7SUFDbkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3RCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztJQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7SUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztHQUNqQztDQUNGOztBQzVETSxNQUFNLGlCQUFpQixTQUFTLFNBQVMsQ0FBQyxFQUFFOztBQUVuRCxpQkFBaUIsQ0FBQyxNQUFNLEdBQUc7RUFDekIsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUM3QyxDQUFDOztBQ0pLLE1BQU0sTUFBTSxTQUFTLFNBQVMsQ0FBQyxFQUFFO0FBQ3hDLE1BQU0sQ0FBQyxNQUFNLEdBQUc7RUFDZCxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0NBQzdDLENBQUM7O0FDTEssTUFBTSxjQUFjLENBQUM7RUFDMUIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7R0FDbkI7O0VBRUQsS0FBSyxHQUFHO0lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7R0FDbkI7OztDQUNGLERDUE0sTUFBTSxJQUFJLFNBQVMsWUFBWSxDQUFDLEVBQUU7O0FDRTdCLE1BQUMsV0FBVyxHQUFHLFVBQVUsQ0FBQztFQUNwQyxJQUFJLEVBQUUsU0FBUztFQUNmLE9BQU8sRUFBRSxJQUFJLE9BQU8sRUFBRTtFQUN0QixJQUFJLEVBQUUsWUFBWTtFQUNsQixLQUFLLEVBQUUsYUFBYTtDQUNyQixDQUFDOztBQ0pLLE1BQU0sUUFBUSxTQUFTLFNBQVMsQ0FBQyxFQUFFOztBQUUxQyxRQUFRLENBQUMsTUFBTSxHQUFHO0VBQ2hCLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJQyxPQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUVDLFdBQXNCLEVBQUU7Q0FDdEUsQ0FBQzs7QUNOSyxNQUFNLFVBQVUsU0FBUyxTQUFTLENBQUMsRUFBRTs7QUFFNUMsVUFBVSxDQUFDLE1BQU0sR0FBRztFQUNsQixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzVDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7Q0FDOUMsQ0FBQzs7QUNQSyxNQUFNLFNBQVMsQ0FBQztFQUNyQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDtFQUNELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ25CLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxjQUFjLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxjQUFjLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO0dBQzVDO0NBQ0Y7O0FDWE0sTUFBTSxRQUFRLENBQUM7RUFDcEIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJRCxPQUFhLEVBQUUsQ0FBQztHQUNyQzs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQzVCO0NBQ0Y7O0FDUk0sTUFBTSxLQUFLLENBQUM7RUFDakIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJQSxPQUFhLEVBQUUsQ0FBQztHQUNsQzs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0dBQ3pCO0NBQ0Y7O0FDVE0sTUFBTSxLQUFLLFNBQVMsU0FBUyxDQUFDLEVBQUU7QUFDdkMsS0FBSyxDQUFDLE1BQU0sR0FBRztFQUNiLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7Q0FDN0MsQ0FBQzs7QUNGSyxNQUFNLEtBQUssU0FBUyxTQUFTLENBQUMsRUFBRTtBQUN2QyxLQUFLLENBQUMsTUFBTSxHQUFHO0VBQ2IsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUM5QyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3pDLE1BQU0sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDMUMsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUMxQyxDQUFDOztBQ1JLLE1BQU0sR0FBRyxDQUFDO0VBQ2YsV0FBVyxHQUFHLEVBQUU7RUFDaEIsS0FBSyxHQUFHLEVBQUU7Q0FDWDs7QUNITSxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztHQUNoQjtFQUNELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0lBQ2xCLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0dBQ2hCO0NBQ0Y7O0FDUE0sTUFBTSxLQUFLLFNBQVMsU0FBUyxDQUFDLEVBQUU7O0FBRXZDLEtBQUssQ0FBQyxNQUFNLEdBQUc7RUFDYixLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzVDLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7Q0FDekMsQ0FBQzs7QUNOSyxNQUFNLElBQUksU0FBUyxZQUFZLENBQUMsRUFBRTs7QUNDbEMsTUFBTSxJQUFJLFNBQVMsU0FBUyxDQUFDLEVBQUU7QUFDdEMsSUFBSSxDQUFDLE1BQU0sR0FBRztFQUNaLElBQUksRUFBRSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDekMsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUNsRCxNQUFNLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ2pELFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDbkQsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUM5QyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3pDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDOUMsYUFBYSxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUNqRCxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQzlDLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7RUFDbkQsWUFBWSxFQUFFLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtFQUN2RCxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsTUFBTSxFQUFFO0VBQ3JELE9BQU8sRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7Q0FDNUMsQ0FBQzs7QUNqQkssTUFBTSxZQUFZLENBQUM7RUFDeEIsS0FBSyxHQUFHLEVBQUU7Q0FDWDs7QUNFTSxNQUFNLFNBQVMsU0FBUyxTQUFTLENBQUMsRUFBRTs7QUFFM0MsU0FBUyxDQUFDLE1BQU0sR0FBRztFQUNqQixRQUFRLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSUEsT0FBYSxFQUFFLEVBQUUsSUFBSSxFQUFFQyxXQUFzQixFQUFFO0VBQ3hFLFFBQVEsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJRCxPQUFhLEVBQUUsRUFBRSxJQUFJLEVBQUVDLFdBQXNCLEVBQUU7Q0FDekUsQ0FBQzs7QUNQSyxNQUFNLE9BQU8sU0FBUyxTQUFTLENBQUMsRUFBRTtBQUN6QyxPQUFPLENBQUMsTUFBTSxHQUFHO0VBQ2YsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtDQUM5QyxDQUFDOztBQ0xLLE1BQU0sWUFBWSxDQUFDO0VBQ3hCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ1osSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7R0FDeEI7RUFDRCxLQUFLLEdBQUcsRUFBRTtDQUNYOztBQUVELEFBQU8sTUFBTSwwQkFBMEIsQ0FBQztFQUN0QyxXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztJQUN4QixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQzs7SUFFdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7O0lBRXRCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3BCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0dBQ3hCOzs7Q0FDRixEQ3RCTSxNQUFNLGFBQWEsU0FBUyxTQUFTLENBQUMsRUFBRTs7QUFFL0MsYUFBYSxDQUFDLE1BQU0sR0FBRztFQUNyQixFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFO0VBQzNDLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDM0MsU0FBUyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRTtFQUNqRCxZQUFZLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFO0VBQ3BELFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUU7RUFDakQsYUFBYSxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE1BQU0sRUFBRTtDQUNyRCxDQUFDOztBQ1ZLLE1BQU0sbUJBQW1CLFNBQVMsWUFBWSxDQUFDLEVBQUU7O0FDQ2pELE1BQU0saUJBQWlCLFNBQVMsWUFBWSxDQUFDLEVBQUU7QUFDdEQsQUFBTyxNQUFNLGtCQUFrQixTQUFTLFlBQVksQ0FBQyxFQUFFO0FBQ3ZELEFBQU8sTUFBTSxnQkFBZ0IsU0FBUyxZQUFZLENBQUMsRUFBRTs7QUFFckQsQUFBTyxNQUFNLHVCQUF1QixTQUFTLFlBQVksQ0FBQyxFQUFFOztBQ0s1RCxNQUFNLGdCQUFnQixTQUFTLG9CQUFvQixDQUFDO0VBQ2xELFdBQVcsR0FBRztJQUNaLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJQyxvQkFBMEIsRUFBRSxDQUFDO0dBQy9DOztFQUVELEtBQUssR0FBRyxFQUFFO0NBQ1g7O0FBRUQsQUFBTyxNQUFNLGNBQWMsU0FBUyxNQUFNLENBQUM7RUFDekMsT0FBTyxHQUFHO0lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUk7TUFDekMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNqRCxDQUFDLENBQUM7R0FDSjtDQUNGOztBQUVELGNBQWMsQ0FBQyxPQUFPLEdBQUc7RUFDdkIsR0FBRyxFQUFFO0lBQ0gsVUFBVSxFQUFFLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0dBQzlDO0NBQ0YsQ0FBQzs7QUNyQkY7OztBQUdBLEFBQU8sTUFBTSxjQUFjLFNBQVMsTUFBTSxDQUFDO0VBQ3pDLE9BQU8sR0FBRzs7SUFFUixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSTtNQUM5QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxLQUFLLENBQUM7TUFDakUsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsS0FBSyxDQUFDO01BQ3JELE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDckMsQ0FBQyxDQUFDOzs7SUFHSCxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSTtNQUM1QyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztNQUU5QyxJQUFJLFFBQVEsQ0FBQztNQUNiLFFBQVEsU0FBUyxDQUFDLFNBQVM7UUFDekIsS0FBSyxPQUFPO1VBQ1Y7WUFDRSxRQUFRLEdBQUcsSUFBSUMsbUJBQXlCO2NBQ3RDLFNBQVMsQ0FBQyxNQUFNO2NBQ2hCLFNBQVMsQ0FBQyxJQUFJO2NBQ2QsU0FBUyxDQUFDLGNBQWM7Y0FDeEIsU0FBUyxDQUFDLGVBQWU7YUFDMUIsQ0FBQztXQUNIO1VBQ0QsTUFBTTtRQUNSLEtBQUssUUFBUTtVQUNYO1lBQ0UsUUFBUSxHQUFHLElBQUlDLHlCQUErQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7V0FDckU7VUFDRCxNQUFNO1FBQ1IsS0FBSyxLQUFLO1VBQ1I7WUFDRSxRQUFRLEdBQUcsSUFBSUMsaUJBQXVCO2NBQ3BDLFNBQVMsQ0FBQyxLQUFLO2NBQ2YsU0FBUyxDQUFDLE1BQU07Y0FDaEIsU0FBUyxDQUFDLEtBQUs7YUFDaEIsQ0FBQztXQUNIO1VBQ0QsTUFBTTtPQUNUOztNQUVELElBQUksS0FBSztRQUNQLFNBQVMsQ0FBQyxTQUFTLEtBQUssT0FBTyxHQUFHLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7O01BVXhFLElBQUksUUFBUSxHQUFHLElBQUlDLG1CQUF5QixDQUFDO1FBQzNDLEtBQUssRUFBRSxLQUFLO1FBQ1osV0FBVyxFQUFFLElBQUk7T0FDbEIsQ0FBQyxDQUFDOztNQUVILElBQUksTUFBTSxHQUFHLElBQUlDLElBQVUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDaEQsTUFBTSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7TUFDekIsTUFBTSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O01BRTVCLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUNsQyxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN6QyxJQUFJLFNBQVMsQ0FBQyxRQUFRLEVBQUU7VUFDdEIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHO1lBQ2pCLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNwQixTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDcEIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1dBQ3JCLENBQUM7U0FDSDtPQUNGOzs7Ozs7TUFNRCxNQUFNLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7S0FDM0QsQ0FBQyxDQUFDO0dBQ0o7Q0FDRjs7QUFFRCxjQUFjLENBQUMsT0FBTyxHQUFHO0VBQ3ZCLFFBQVEsRUFBRTtJQUNSLFVBQVUsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUN0QixNQUFNLEVBQUU7TUFDTixLQUFLLEVBQUUsSUFBSTtNQUNYLE9BQU8sRUFBRSxJQUFJO0tBQ2Q7R0FDRjtDQUNGLENBQUM7O0FDbkdGO0FBQ0EsSUFBSSxNQUFNLEdBQUcsSUFBSUMsWUFBZSxFQUFFLENBQUM7O0FBRW5DLE1BQU0sZUFBZSxTQUFTLG9CQUFvQixDQUFDLEVBQUU7O0FBRXJELEFBQU8sTUFBTSxnQkFBZ0IsU0FBUyxNQUFNLENBQUM7RUFDM0MsSUFBSSxHQUFHO0lBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUMzRSxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztHQUNsQjs7RUFFRCxPQUFPLEdBQUc7SUFDUixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDM0MsT0FBTyxNQUFNLENBQUMsTUFBTSxFQUFFO01BQ3BCLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN6QixNQUFNLENBQUMsWUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO01BQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLEVBQUUsSUFBSTtRQUNuRCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztPQUNqQyxDQUFDO0tBQ0g7OztJQUdELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUMzQyxNQUFNLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdEMsTUFBTSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUNsRCxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxTQUFTLEtBQUssRUFBRTtRQUNsQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7VUFDaEIsS0FBSyxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDO1VBQzlDLEtBQUssQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLFVBQVUsQ0FBQzs7VUFFeEMsSUFBSSxTQUFTLENBQUMsY0FBYyxFQUFFO1lBQzVCLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxjQUFjLENBQUM7V0FDbEQ7U0FDRjtPQUNGLENBQUMsQ0FBQzs7Ozs7Ozs7TUFRSCxNQUFNO1NBQ0gsWUFBWSxDQUFDLFNBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQztTQUN4QyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7TUFFdEQsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFO1FBQ3RCLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztPQUN0QztLQUNGO0lBQ0QsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDOztJQUV2QixNQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUM7SUFDL0MsT0FBTyxRQUFRLENBQUMsTUFBTSxFQUFFO01BQ3RCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUMzQixNQUFNLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxDQUFDO01BQ3hDLE1BQU0sQ0FBQyx1QkFBdUIsRUFBRSxDQUFDO0tBQ2xDO0dBQ0Y7Q0FDRjs7QUFFRCxnQkFBZ0IsQ0FBQyxPQUFPLEdBQUc7RUFDekIsTUFBTSxFQUFFO0lBQ04sVUFBVSxFQUFFLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztHQUMvQztFQUNELFFBQVEsRUFBRTtJQUNSLFVBQVUsRUFBRSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDL0M7Q0FDRixDQUFDOztBQ3JFSyxNQUFNLFlBQVksU0FBUyxNQUFNLENBQUM7RUFDdkMsT0FBTyxHQUFHO0lBQ1IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDO0lBQzdDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3hDLElBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFekIsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7TUFFekMsSUFBSSxLQUFLLEdBQUcsSUFBSUMsS0FBVyxFQUFFLENBQUM7TUFDOUIsSUFBSSxRQUFRLEdBQUcsSUFBSUosaUJBQXVCLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztNQUMxRCxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7TUFFekIsSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLGdCQUFnQixFQUFFO1FBQ3BDLElBQUksUUFBUSxHQUFHLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7O1FBRS9ELElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQzs7UUFFbkIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtVQUMxQixTQUFTLENBQUMsSUFBSSxDQUFDLElBQUlLLGlCQUF1QixDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNuRTs7UUFFRCxJQUFJLE1BQU0sR0FBRyxJQUFJSCxJQUFVLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ2pELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3JCLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O1FBRWxCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQzs7UUFFcEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtVQUMzQixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUlHLGlCQUF1QixDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUNwRTs7UUFFRCxJQUFJLE9BQU8sR0FBRyxJQUFJSCxJQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ25ELE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7O1FBRW5CLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7T0FDM0MsTUFBTTtRQUNMLE9BQU8sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ3BEO0tBQ0Y7R0FDRjtDQUNGOztBQUVELFNBQVMsd0JBQXdCLENBQUMsV0FBVyxFQUFFLFFBQVEsRUFBRTtFQUN2RCxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7O0VBRWxCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDakMsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUlJLE9BQWEsRUFBRSxDQUFDO0dBQ25DOztFQUVELElBQUksTUFBTSxHQUFHLElBQUlDLFdBQWlCLEVBQUUsQ0FBQztFQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxTQUFTLFFBQVEsRUFBRTtJQUMxQyxJQUFJLE1BQU0sRUFBRSxPQUFPLENBQUM7SUFDcEIsSUFBSSxTQUFTLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQzs7SUFFaEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDeEMsTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDMUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbEMsTUFBTSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDMUIsTUFBTSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7TUFDekIsT0FBTyxDQUFDLFNBQVM7UUFDZixRQUFRO1FBQ1IsU0FBUyxHQUFHLENBQUM7UUFDYixDQUFDO1FBQ0QsU0FBUztRQUNULFNBQVM7UUFDVCxDQUFDO1FBQ0QsQ0FBQztRQUNELFNBQVM7UUFDVCxTQUFTO09BQ1YsQ0FBQztNQUNGLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO01BQzNCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO0tBQ2hDO0dBQ0YsQ0FBQyxDQUFDOztFQUVILE9BQU8sUUFBUSxDQUFDO0NBQ2pCOztBQUVELFlBQVksQ0FBQyxPQUFPLEdBQUc7RUFDckIsUUFBUSxFQUFFO0lBQ1IsVUFBVSxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0dBQzdDO0NBQ0YsQ0FBQzs7QUNwRkssTUFBTSxnQkFBZ0IsU0FBUyxNQUFNLENBQUM7RUFDM0MsaUJBQWlCLENBQUMsUUFBUSxFQUFFO0lBQzFCLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO01BQ3pCLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUM7S0FDbkUsQ0FBQyxDQUFDO0dBQ0o7O0VBRUQsT0FBTyxHQUFHO0lBQ1IsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN2RDtDQUNGOztBQUVELGdCQUFnQixDQUFDLE9BQU8sR0FBRztFQUN6QixRQUFRLEVBQUU7SUFDUixVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsaUJBQWlCLENBQUM7SUFDeEMsTUFBTSxFQUFFO01BQ04sS0FBSyxFQUFFLElBQUk7TUFDWCxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUM7S0FDbkI7R0FDRjtDQUNGLENBQUM7O0FDbkJGLE1BQU0sYUFBYSxHQUFHO0VBQ3BCLElBQUksRUFBRSxDQUFDO0VBQ1AsTUFBTSxFQUFFLEdBQUc7RUFDWCxLQUFLLEVBQUUsQ0FBQztDQUNULENBQUM7QUFDRixNQUFNLGVBQWUsR0FBRztFQUN0QixHQUFHLEVBQUUsQ0FBQztFQUNOLE1BQU0sRUFBRSxHQUFHO0VBQ1gsTUFBTSxFQUFFLENBQUM7Q0FDVixDQUFDOztBQUVGLEFBQU8sTUFBTSxhQUFhLFNBQVMsTUFBTSxDQUFDO0VBQ3hDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxFQUFFO0lBQ2xDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQztJQUNuQyxRQUFRLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUM7SUFDN0MsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxhQUFhLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3pELFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsZUFBZSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3RCxRQUFRLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUM7SUFDckMsUUFBUSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsSUFBSSxDQUFDO0lBQ25DLFFBQVEsQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQztJQUMzQyxRQUFRLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQyxhQUFhLElBQUksQ0FBQyxDQUFDO0lBQzFELFFBQVEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUM7SUFDdkQsUUFBUSxDQUFDLFlBQVksR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDO0lBQ25ELFFBQVEsQ0FBQyxVQUFVLEdBQUcsYUFBYSxDQUFDLFVBQVUsQ0FBQztJQUMvQyxRQUFRLENBQUMsUUFBUSxHQUFHLGFBQWEsQ0FBQyxRQUFRLENBQUM7SUFDM0MsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEdBQUcsYUFBYSxDQUFDLE9BQU8sQ0FBQztJQUNsRCxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7R0FDakI7O0VBRUQsT0FBTyxHQUFHO0lBQ1IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUM7O0lBRXJDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTtNQUMxQixJQUFJLGFBQWEsR0FBRyxDQUFDLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDOztNQUV6QyxNQUFNLFFBQVEsR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO01BQ2hDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDO01BQzNCLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDekIsUUFBUSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7TUFDMUIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7TUFDekMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsQ0FBQyxDQUFDO0tBQ3hELENBQUMsQ0FBQzs7SUFFSCxRQUFRLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUk7TUFDNUIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO01BQy9CLElBQUksUUFBUSxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDcEQsUUFBUSxDQUFDLE9BQU8sRUFBRSxDQUFDO01BQ25CLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7S0FDM0IsQ0FBQyxDQUFDOztJQUVILFFBQVEsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSTtNQUM1QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7TUFDL0IsSUFBSSxRQUFRLFlBQVksUUFBUSxFQUFFO1FBQ2hDLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7T0FDMUM7S0FDRixDQUFDLENBQUM7R0FDSjtDQUNGOztBQUVELGFBQWEsQ0FBQyxPQUFPLEdBQUc7RUFDdEIsUUFBUSxFQUFFO0lBQ1IsVUFBVSxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ2xCLE1BQU0sRUFBRTtNQUNOLEtBQUssRUFBRSxJQUFJO01BQ1gsT0FBTyxFQUFFLElBQUk7TUFDYixPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUM7S0FDaEI7R0FDRjtDQUNGLENBQUM7O0FDL0RLLE1BQU0sb0JBQW9CLFNBQVMsU0FBUyxDQUFDLEVBQUU7QUFDdEQsb0JBQW9CLENBQUMsTUFBTSxHQUFHO0VBQzVCLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUU7Q0FDN0MsQ0FBQzs7QUFFRixBQUFPLE1BQU0sbUJBQW1CLFNBQVMsTUFBTSxDQUFDO0VBQzlDLElBQUksR0FBRztJQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsaUJBQWlCLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7SUFFbkQsTUFBTSxDQUFDLGdCQUFnQjtNQUNyQixRQUFRO01BQ1IsTUFBTTtRQUNKLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO1VBQy9DLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsQ0FBQztVQUMxRCxTQUFTLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7VUFDcEMsU0FBUyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1NBQ3ZDLENBQUMsQ0FBQztPQUNKO01BQ0QsS0FBSztLQUNOLENBQUM7R0FDSDs7RUFFRCxPQUFPLEdBQUc7SUFDUixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUM7SUFDL0MsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLElBQUk7TUFDbEMsSUFBSSxRQUFRLEdBQUcsY0FBYyxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQztNQUN2RSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSTtRQUNsRCxJQUFJLElBQUksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzNDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7O1FBRXJDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJO1VBQ3pELElBQUksTUFBTSxHQUFHLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7VUFFeEMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDaEMsQ0FBQyxDQUFDO09BQ0osQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDOzs7SUFHSCxJQUFJLENBQUMsT0FBTyxDQUFDLHNCQUFzQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO01BQzVELElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7O01BRW5ELElBQUksUUFBUSxHQUFHLElBQUlDLGVBQW1CLENBQUM7UUFDckMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTO09BQy9CLENBQUMsQ0FBQzs7TUFFSCxJQUFJLFNBQVMsQ0FBQyxhQUFhLEVBQUU7UUFDM0IsUUFBUSxDQUFDLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsQ0FBQztPQUNwRDs7TUFFRCxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO01BQ2hELElBQUksU0FBUyxDQUFDLFlBQVksRUFBRTtRQUMxQixRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO09BQ3pEOztNQUVELFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7O01BRWpELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7TUFFL0MsSUFBSSxTQUFTLENBQUMsRUFBRSxJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUU7UUFDaEMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDOztRQUUzQixJQUFJLFNBQVMsQ0FBQyxFQUFFLEVBQUU7VUFDaEIsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1NBQzVEOztRQUVELElBQUksU0FBUyxDQUFDLEVBQUUsRUFBRTtVQUNoQixRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDNUQ7T0FDRjs7TUFFRCxNQUFNLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7S0FDaEUsQ0FBQyxDQUFDOztJQUVILElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO01BQy9DLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDLENBQUM7TUFDbkQsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLEtBQUssQ0FBQztNQUMvRDtRQUNFLFNBQVMsQ0FBQyxLQUFLLEtBQUssUUFBUSxDQUFDLEtBQUs7UUFDbEMsU0FBUyxDQUFDLE1BQU0sS0FBSyxRQUFRLENBQUMsTUFBTTtRQUNwQztRQUNBLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7O09BRXJEO0tBQ0YsQ0FBQyxDQUFDO0dBQ0o7Q0FDRjs7QUFFRCxtQkFBbUIsQ0FBQyxPQUFPLEdBQUc7RUFDNUIsc0JBQXNCLEVBQUU7SUFDdEIsVUFBVSxFQUFFLENBQUMsYUFBYSxFQUFFLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO0dBQ3ZEO0VBQ0QsU0FBUyxFQUFFO0lBQ1QsVUFBVSxFQUFFLENBQUMsYUFBYSxFQUFFLG9CQUFvQixDQUFDO0lBQ2pELE1BQU0sRUFBRTtNQUNOLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQztLQUN6QjtHQUNGO0VBQ0QsWUFBWSxFQUFFO0lBQ1osVUFBVSxFQUFFLENBQUMsVUFBVSxDQUFDO0dBQ3pCO0VBQ0QsYUFBYSxFQUFFO0lBQ2IsVUFBVSxFQUFFLENBQUMsa0JBQWtCLEVBQUUsTUFBTSxDQUFDO0lBQ3hDLE1BQU0sRUFBRTtNQUNOLEtBQUssRUFBRSxJQUFJO0tBQ1o7R0FDRjtDQUNGLENBQUM7O0FDNUdLLE1BQU0sZUFBZSxTQUFTLE1BQU0sQ0FBQztFQUMxQyxPQUFPLEdBQUc7O0lBRVIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ3RDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3JDLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRTtRQUNqQixPQUFPO09BQ1I7O01BRUQsSUFBSSxZQUFZLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQyxLQUFLLENBQUM7TUFDckQsSUFBSSxZQUFZLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDaEQsSUFBSSxjQUFjLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2hELElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN6QyxjQUFjLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO09BQ25DO0tBQ0Y7OztJQUdELElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO01BQ2xELElBQUksY0FBYyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxDQUFDO01BQy9ELElBQUksYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztNQUN6QyxjQUFjLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ25DLENBQUMsQ0FBQzs7O0lBR0gsSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7SUFDekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ2hELElBQUksTUFBTSxHQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDakMsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUMvQyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7O01BRWxDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUc7UUFDakIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BCLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNwQixTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDckIsQ0FBQztLQUNIOztJQUVELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUNsRCxJQUFJLE1BQU0sR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFO1FBQ2pCLFNBQVM7T0FDVjs7TUFFRCxJQUFJLFNBQVMsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQy9DLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQzs7TUFFbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQ3pDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRztRQUNqQixTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDcEIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3BCLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUNyQixDQUFDO0tBQ0g7OztJQUdELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDO0lBQ3ZDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUMvQyxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ2hDLElBQUksUUFBUSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDOztNQUVuRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7O01BRWxDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDOzs7TUFHL0IsTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQztLQUN2RDs7Ozs7Ozs7Ozs7SUFXRCxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUNqQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDNUMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM3QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQzs7TUFFN0MsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDOztNQUVsQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMxQjs7SUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDOUMsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUMvQixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQztNQUM3QyxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7O01BRWxDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzFCO0dBQ0Y7Q0FDRjs7QUFFRCxlQUFlLENBQUMsT0FBTyxHQUFHO0VBQ3hCLGNBQWMsRUFBRTtJQUNkLFVBQVUsRUFBRSxDQUFDLGNBQWMsRUFBRSxpQkFBaUIsQ0FBQztJQUMvQyxNQUFNLEVBQUU7TUFDTixLQUFLLEVBQUUsSUFBSTtLQUNaO0dBQ0Y7RUFDRCxNQUFNLEVBQUU7SUFDTixVQUFVLEVBQUUsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUM7SUFDdkMsTUFBTSxFQUFFO01BQ04sS0FBSyxFQUFFLElBQUk7S0FDWjtHQUNGO0VBQ0QsVUFBVSxFQUFFO0lBQ1YsVUFBVSxFQUFFLENBQUMsaUJBQWlCLEVBQUUsU0FBUyxDQUFDO0lBQzFDLE1BQU0sRUFBRTtNQUNOLEtBQUssRUFBRSxJQUFJO01BQ1gsT0FBTyxFQUFFLENBQUMsU0FBUyxDQUFDO0tBQ3JCO0dBQ0Y7RUFDRCxTQUFTLEVBQUU7SUFDVCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUM7SUFDekMsTUFBTSxFQUFFO01BQ04sS0FBSyxFQUFFLElBQUk7TUFDWCxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUM7S0FDcEI7R0FDRjtFQUNELE1BQU0sRUFBRTtJQUNOLFVBQVUsRUFBRSxDQUFDLGlCQUFpQixFQUFFLEtBQUssQ0FBQztJQUN0QyxNQUFNLEVBQUU7TUFDTixLQUFLLEVBQUUsSUFBSTtNQUNYLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQztLQUNqQjtHQUNGO0NBQ0YsQ0FBQzs7QUN6SUssTUFBTSwwQkFBMEIsU0FBUyxNQUFNLENBQUM7RUFDckQsSUFBSSxHQUFHO0lBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDckQsTUFBTSxDQUFDLGdCQUFnQjtNQUNyQixRQUFRO01BQ1IsTUFBTTtRQUNKLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDO1FBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztPQUNwQztNQUNELEtBQUs7S0FDTixDQUFDO0dBQ0g7O0VBRUQsT0FBTyxHQUFHO0lBQ1IsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO0lBQzNDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3ZDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztNQUN6QyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNwQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDL0IsU0FBUyxDQUFDLHNCQUFzQixFQUFFLENBQUM7T0FDcEM7S0FDRjtHQUNGO0NBQ0Y7O0FBRUQsMEJBQTBCLENBQUMsT0FBTyxHQUFHO0VBQ25DLE9BQU8sRUFBRTtJQUNQLFVBQVUsRUFBRSxDQUFDLGtCQUFrQixFQUFFLHVCQUF1QixFQUFFLGlCQUFpQixDQUFDO0dBQzdFO0NBQ0YsQ0FBQzs7QUMvQkssTUFBTSxrQkFBa0IsU0FBUyxNQUFNLENBQUM7RUFDN0MsSUFBSSxHQUFHO0lBQ0wsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7SUFDekIsSUFBSSxNQUFNLEdBQUcsSUFBSUMsVUFBZ0IsRUFBRSxDQUFDO0lBQ3BDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDOzs7Ozs7O0dBT2xCOztFQUVELE9BQU8sR0FBRztJQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU87O0lBRXZCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQztJQUM1QyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSTtNQUN4QixJQUFJLGFBQWEsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ3RELElBQUksUUFBUSxHQUFHLElBQUlDLGNBQWtCLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRTtRQUN4RCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7UUFDZixJQUFJLEVBQUUsQ0FBQztRQUNQLE1BQU0sRUFBRSxHQUFHO1FBQ1gsYUFBYSxFQUFFLENBQUM7UUFDaEIsWUFBWSxFQUFFLElBQUk7UUFDbEIsY0FBYyxFQUFFLElBQUk7UUFDcEIsU0FBUyxFQUFFLElBQUk7UUFDZixXQUFXLEVBQUUsQ0FBQztRQUNkLGFBQWEsRUFBRSxDQUFDO09BQ2pCLENBQUMsQ0FBQztNQUNILE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0tBQzFDLENBQUMsQ0FBQzs7SUFFSCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDeEMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUk7TUFDdEIsSUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUMsQ0FBQztNQUN0RCxJQUFJLFFBQVEsR0FBRyxJQUFJQSxjQUFrQixDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUU7UUFDeEQsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO1FBQ2YsSUFBSSxFQUFFLENBQUM7UUFDUCxNQUFNLEVBQUUsR0FBRztRQUNYLGFBQWEsRUFBRSxDQUFDO1FBQ2hCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFNBQVMsRUFBRSxJQUFJO1FBQ2YsV0FBVyxFQUFFLENBQUM7UUFDZCxhQUFhLEVBQUUsQ0FBQztPQUNqQixDQUFDLENBQUM7O01BRUgsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQztNQUNyQyxLQUFLLEdBQUcsUUFBUSxDQUFDO01BQ2pCLElBQUksUUFBUSxHQUFHLElBQUliLG9CQUEwQixDQUFDO1FBQzVDLEtBQUssRUFBRSxLQUFLO1FBQ1osU0FBUyxFQUFFLEdBQUc7UUFDZCxTQUFTLEVBQUUsR0FBRztPQUNmLENBQUMsQ0FBQzs7TUFFSCxJQUFJLElBQUksR0FBRyxJQUFJSyxJQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxDQUFDOztNQUU5QyxNQUFNLENBQUMsWUFBWSxDQUFDLGlCQUFpQixFQUFFLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDekQsQ0FBQyxDQUFDO0dBQ0o7Q0FDRjs7QUFFRCxrQkFBa0IsQ0FBQyxPQUFPLEdBQUc7RUFDM0IsUUFBUSxFQUFFO0lBQ1IsVUFBVSxFQUFFLENBQUMsWUFBWSxDQUFDO0lBQzFCLE1BQU0sRUFBRTtNQUNOLEtBQUssRUFBRSxJQUFJO01BQ1gsT0FBTyxFQUFFLElBQUk7S0FDZDtHQUNGO0NBQ0YsQ0FBQzs7QUN4RUssTUFBTSxpQkFBaUIsU0FBUyxNQUFNLENBQUM7RUFDNUMsT0FBTyxHQUFHO0lBQ1IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUk7O01BRWhELElBQUksVUFBVSxHQUFHLEdBQUcsQ0FBQzs7OztNQUlyQixJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQztNQUM1QixJQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7TUFDbkIsSUFBSSxTQUFTLEdBQUcsVUFBVSxHQUFHLFNBQVMsQ0FBQzs7TUFFdkMsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztNQUVwQixJQUFJLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQ3BELFlBQVksQ0FBQyxLQUFLLEdBQUcsZ0JBQWdCLENBQUM7TUFDdEMsWUFBWSxDQUFDLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQztNQUN2QyxJQUFJLGFBQWEsR0FBRyxJQUFJSSxPQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDcEQsYUFBYSxDQUFDLEtBQUssR0FBR0ssY0FBb0IsQ0FBQztNQUMzQyxhQUFhLENBQUMsS0FBSyxHQUFHQSxjQUFvQixDQUFDO01BQzNDLGFBQWEsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzs7TUFFL0MsSUFBSSxDQUFDLGVBQWUsR0FBRztRQUNyQixXQUFXLEVBQUUsU0FBUztRQUN0QixZQUFZLEVBQUUsU0FBUztPQUN4QixDQUFDOztNQUVGLElBQUksU0FBUyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O01BRTlDLElBQUksSUFBSSxHQUFHLGdCQUFnQixDQUFDO01BQzVCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUM7TUFDdkQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNyQyxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDO01BQ3hELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ3BDLElBQUksSUFBSSxHQUFHLElBQUksSUFBSSxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDbEMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtVQUNoQyxTQUFTLENBQUMsUUFBUTtZQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7WUFDaEMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1dBQ2pCLENBQUM7U0FDSDtPQUNGOztNQUVELGFBQWEsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDOztNQUVqQyxJQUFJLGNBQWMsR0FBRyxJQUFJVixtQkFBeUIsQ0FBQztRQUNqRCxHQUFHLEVBQUUsYUFBYTtPQUNuQixDQUFDLENBQUM7O01BRUgsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLFdBQVcsRUFBRSxDQUFDOztNQUVqQyxJQUFJLFFBQVEsR0FBRyxJQUFJVyxtQkFBeUI7UUFDMUMsVUFBVSxHQUFHLENBQUM7UUFDZCxVQUFVLEdBQUcsQ0FBQztRQUNkLFVBQVUsR0FBRyxDQUFDO1FBQ2QsVUFBVSxHQUFHLENBQUM7T0FDZixDQUFDOztNQUVGLElBQUksTUFBTSxHQUFHLElBQUlWLElBQVUsQ0FBQyxRQUFRLEVBQUUsY0FBYyxDQUFDLENBQUM7TUFDdEQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztNQUNqQyxNQUFNLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7TUFFNUIsTUFBTSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO01BQzFELE1BQU0sQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDOztNQUUzRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUM7TUFDdkIsTUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO01BQ2hCLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQztNQUNoQixLQUFLLENBQUMsR0FBRyxHQUFHLElBQUlXLEdBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQzVDLEtBQUssQ0FBQyxVQUFVLEdBQUcsSUFBSUMsS0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNDLENBQUMsQ0FBQztHQUNKO0NBQ0Y7O0FBRUQsaUJBQWlCLENBQUMsT0FBTyxHQUFHO0VBQzFCLFlBQVksRUFBRTtJQUNaLFVBQVUsRUFBRSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUM7SUFDaEMsTUFBTSxFQUFFO01BQ04sS0FBSyxFQUFFLElBQUk7S0FDWjtHQUNGO0NBQ0YsQ0FBQzs7QUM3RUYsSUFBSSxzQkFBc0IsR0FBRyxJQUFJLHdCQUF3QixFQUFFLENBQUM7O0FBRTVELEFBQU8sTUFBTSxrQkFBa0IsU0FBUyxNQUFNLENBQUM7RUFDN0MsT0FBTyxHQUFHO0lBQ1IsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVk7TUFDakUsb0JBQW9CO0tBQ3JCLENBQUMsS0FBSyxDQUFDOztJQUVSLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO01BQy9DLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ3hELElBQUksVUFBVSxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ3pELFVBQVUsQ0FBQyxJQUFJLEdBQUcsWUFBWSxDQUFDOztNQUUvQixJQUFJLEtBQUssR0FBRyxJQUFJVixLQUFXLEVBQUUsQ0FBQztNQUM5QixLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQ3RCLE1BQU0sQ0FBQyxZQUFZLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQzs7TUFFekQsVUFBVSxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxNQUFNO1FBQzdDLE1BQU0sQ0FBQyxZQUFZLENBQUMsbUJBQW1CLENBQUMsQ0FBQztPQUMxQyxDQUFDLENBQUM7O01BRUgsVUFBVSxDQUFDLGdCQUFnQixDQUFDLGNBQWMsRUFBRSxNQUFNO1FBQ2hELE1BQU0sQ0FBQyxlQUFlLENBQUMsbUJBQW1CLENBQUMsQ0FBQztPQUM3QyxDQUFDLENBQUM7O01BRUgsSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLDBCQUEwQixDQUFDLEVBQUU7UUFDbkQsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLFNBQVMsSUFBSTtVQUMxQyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUN4QixVQUFVLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1dBQzlEO1NBQ0YsQ0FBQyxDQUFDO09BQ0o7Ozs7OztNQU1ELElBQUksY0FBYyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDakUsY0FBYyxDQUFDLEdBQUc7UUFDaEIsc0JBQXNCLENBQUMscUJBQXFCLENBQUMsY0FBYyxDQUFDO09BQzdELENBQUM7TUFDRixLQUFLLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBbUIzQixDQUFDLENBQUM7OztHQUdKO0NBQ0Y7O0FBRUQsa0JBQWtCLENBQUMsT0FBTyxHQUFHO0VBQzNCLFdBQVcsRUFBRTtJQUNYLFVBQVUsRUFBRSxDQUFDLFlBQVksQ0FBQztJQUMxQixNQUFNLEVBQUU7TUFDTixLQUFLLEVBQUUsSUFBSTs7S0FFWjtHQUNGO0VBQ0QsZUFBZSxFQUFFO0lBQ2YsVUFBVSxFQUFFLENBQUMsb0JBQW9CLENBQUM7SUFDbEMsU0FBUyxFQUFFLElBQUk7R0FDaEI7Q0FDRixDQUFDOztBQ3RGRixNQUFNLHVCQUF1QixDQUFDO0VBQzVCLFdBQVcsR0FBRyxFQUFFO0VBQ2hCLEtBQUssR0FBRyxFQUFFO0NBQ1g7O0FBRUQsTUFBTSx5QkFBeUIsQ0FBQztFQUM5QixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztHQUN0QjtFQUNELEtBQUssR0FBRyxFQUFFO0NBQ1g7O0FBRUQsQUFBTyxNQUFNLGVBQWUsU0FBUyxNQUFNLENBQUM7RUFDMUMsT0FBTyxDQUFDLEtBQUssRUFBRTtJQUNiLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO01BQzVDLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDO01BQ2hELElBQUksS0FBSyxHQUFHLElBQUlXLGNBQW9CLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2pELE1BQU0sQ0FBQyxZQUFZLENBQUMsdUJBQXVCLEVBQUU7UUFDM0MsS0FBSyxFQUFFLEtBQUs7T0FDYixDQUFDLENBQUM7O01BRUgsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDO01BQ3BCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSTtRQUN2QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0QsTUFBTSxDQUFDLElBQUksR0FBR0MsUUFBYyxDQUFDO1FBQzdCLFVBQVUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDekIsQ0FBQyxDQUFDOztNQUVILE1BQU0sQ0FBQyxZQUFZLENBQUMseUJBQXlCLEVBQUU7UUFDN0MsVUFBVSxFQUFFLFVBQVU7UUFDdEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsUUFBUTtPQUNsRCxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0lBRUgsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUk7TUFDNUMsTUFBTSxDQUFDLFlBQVksQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDbEUsQ0FBQyxDQUFDOztJQUVILElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxJQUFJO01BQy9DLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMseUJBQXlCLENBQUMsQ0FBQztNQUMvRCxTQUFTLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLElBQUk7UUFDekMsSUFBSSxTQUFTLENBQUMsUUFBUSxLQUFLLENBQUMsQ0FBQyxFQUFFO1VBQzdCLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQzVDOztRQUVELFVBQVUsQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7UUFDcEMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ25CLFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNuQixDQUFDLENBQUM7TUFDSCxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCLENBQUMsQ0FBQzs7SUFFSCxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSTtNQUMvQyxJQUFJLFVBQVUsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLHlCQUF5QixDQUFDO1NBQzVELFVBQVUsQ0FBQztNQUNkLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBVSxJQUFJO1FBQy9CLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNuQixVQUFVLENBQUMsSUFBSSxFQUFFLENBQUM7T0FDbkIsQ0FBQyxDQUFDO01BQ0gsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5QixDQUFDLENBQUM7R0FDSjtDQUNGOztBQUVELGVBQWUsQ0FBQyxPQUFPLEdBQUc7RUFDeEIsUUFBUSxFQUFFO0lBQ1IsVUFBVSxFQUFFLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQztJQUNsQyxNQUFNLEVBQUU7TUFDTixLQUFLLEVBQUUsSUFBSTtLQUNaO0dBQ0Y7RUFDRCxNQUFNLEVBQUU7SUFDTixVQUFVLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQztHQUN0QztFQUNELFNBQVMsRUFBRTtJQUNULFVBQVUsRUFBRSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQztHQUM5QztFQUNELFNBQVMsRUFBRTtJQUNULFVBQVUsRUFBRSxDQUFDLHlCQUF5QixFQUFFLElBQUksQ0FBQztHQUM5QztDQUNGLENBQUM7O0FDN0VLLE1BQU0sV0FBVyxTQUFTLE1BQU0sQ0FBQztFQUN0QyxJQUFJLEdBQUc7O0lBRUwsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsQ0FBQzs7SUFFekMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEUsSUFBSSxDQUFDLG1CQUFtQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUNuRTs7RUFFRCxPQUFPLEdBQUc7SUFDUixJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQzs7OztHQUk3Qjs7RUFFRCxvQkFBb0IsR0FBRzs7SUFFckIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLElBQUk7TUFDakQsTUFBTSxDQUFDLFlBQVksQ0FBQywwQkFBMEIsRUFBRTtRQUM5QyxXQUFXLEVBQUUsS0FBSyxJQUFJO1VBQ3BCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztVQUNyRSxLQUFLLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztVQUN0QixLQUFLLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztTQUM1QjtRQUNELFNBQVMsRUFBRSxLQUFLLElBQUk7VUFDbEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1VBQ3JFLEtBQUssQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1VBQ3ZCLEtBQUssQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzNCO1FBQ0QsU0FBUyxFQUFFLEtBQUssSUFBSTtVQUNsQixJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1NBQzlEO1FBQ0QsWUFBWSxFQUFFLEtBQUssSUFBSTtVQUNyQixJQUFJLENBQUMsbUJBQW1CLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDN0Q7T0FDRixDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7OztJQUdILElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSTtNQUN0RCxLQUFLLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO01BQzFELEtBQUssQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLENBQUMsUUFBUSxJQUFJLEtBQUssQ0FBQyxZQUFZLENBQUM7TUFDeEQsS0FBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDO0tBQ3JDLENBQUMsQ0FBQztHQUNKO0NBQ0Y7O0FBRUQsV0FBVyxDQUFDLE9BQU8sR0FBRztFQUNwQixhQUFhLEVBQUU7SUFDYixVQUFVLEVBQUUsQ0FBQyxZQUFZLENBQUM7SUFDMUIsTUFBTSxFQUFFO01BQ04sS0FBSyxFQUFFLElBQUk7S0FDWjtHQUNGO0NBQ0YsQ0FBQzs7QUM1RGEsTUFBTSx5QkFBeUIsU0FBU0MsUUFBYyxDQUFDO0VBQ3BFLFdBQVcsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFO0lBQzlCLEtBQUssRUFBRSxDQUFDO0lBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDOztJQUVoQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsSUFBSSxDQUFDLENBQUM7SUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDdEMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSUMsZUFBcUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0tBQ3pEO0dBQ0Y7O0VBRUQsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUNoQixJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUk7TUFDN0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6QixDQUFDLENBQUM7R0FDSjs7RUFFRCxJQUFJLEdBQUc7SUFDTCxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDbEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQzdDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRTtRQUM5QyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDYixLQUFLLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztRQUN2QixLQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsU0FBUztPQUNWO0tBQ0Y7O0lBRUQsSUFBSSxDQUFDLEtBQUssRUFBRTtNQUNWLE9BQU8sQ0FBQyxJQUFJO1FBQ1YsOEdBQThHO09BQy9HLENBQUM7TUFDRixPQUFPO0tBQ1I7R0FDRjtDQUNGOztBQ2xDTSxNQUFNLFdBQVcsU0FBUyxNQUFNLENBQUM7RUFDdEMsSUFBSSxHQUFHO0lBQ0wsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJQyxhQUFtQixFQUFFLENBQUM7R0FDM0M7RUFDRCxPQUFPLEdBQUc7SUFDUixJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sSUFBSTtNQUMxQyxNQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDcEQsTUFBTSxLQUFLLEdBQUcsSUFBSSx5QkFBeUIsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQy9ELE1BQU0sV0FBVyxHQUFHLElBQUlDLFdBQWlCLEVBQUUsQ0FBQztNQUM1QyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsTUFBTSxJQUFJO1FBQ3hDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7T0FDekIsQ0FBQyxDQUFDO01BQ0gsU0FBUyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7S0FDekIsQ0FBQyxDQUFDO0dBQ0o7Q0FDRjs7QUFFRCxXQUFXLENBQUMsT0FBTyxHQUFHO0VBQ3BCLE1BQU0sRUFBRTtJQUNOLFVBQVUsRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNuQixNQUFNLEVBQUU7TUFDTixLQUFLLEVBQUUsSUFBSTtNQUNYLE9BQU8sRUFBRSxJQUFJO01BQ2IsT0FBTyxFQUFFLElBQUk7S0FDZDtHQUNGO0NBQ0YsQ0FBQzs7QUM1QkssTUFBTSxlQUFlLFNBQVMsT0FBTyxDQUFDO0VBQzNDLG9CQUFvQixDQUFDLEdBQUcsRUFBRSxZQUFZLEVBQUU7SUFDdEMsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3JELElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDOUQsSUFBSSxZQUFZLElBQUksWUFBWSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO01BQ2hFLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDckM7SUFDRCxPQUFPLElBQUksQ0FBQztHQUNiOztFQUVELHVCQUF1QixDQUFDLFFBQVEsR0FBRyxJQUFJLEVBQUU7SUFDdkMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxpQkFBaUIsRUFBRSxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUM7SUFDN0QsSUFBSSxRQUFRLEVBQUU7O01BRVosR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN0QztJQUNELElBQUksQ0FBQyxlQUFlLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUN4QyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzlELEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0dBQ25COztFQUVELE1BQU0sQ0FBQyxjQUFjLEVBQUU7SUFDckIsSUFBSSxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7TUFDeEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO01BQy9CLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJO1FBQ2hCLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDM0QsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7T0FDakIsQ0FBQyxDQUFDO01BQ0gsR0FBRyxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN0QyxNQUFNO01BQ0wsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0tBQ3hEO0dBQ0Y7O0VBRUQsV0FBVyxHQUFHO0lBQ1osT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsS0FBSyxDQUFDO0dBQ25EO0NBQ0Y7O0FDbkNNLE1BQU0sdUJBQXVCLEdBQUc7RUFDckMsT0FBTyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsS0FBSzs7SUFFeEIsSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFO01BQ2QsTUFBTSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0tBQ3ZDLE1BQU0sSUFBSSxHQUFHLENBQUMsT0FBTyxFQUFFO01BQ3RCLE1BQU0sQ0FBQyxZQUFZLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUN4QyxNQUFNLElBQUksR0FBRyxDQUFDLFFBQVEsRUFBRTtNQUN2QixNQUFNLENBQUMsWUFBWSxDQUFDLGtCQUFrQixDQUFDLENBQUM7S0FDekM7R0FDRjtFQUNELE9BQU8sRUFBRSxDQUFDLE1BQU0sRUFBRSxHQUFHLEtBQUs7O0lBRXhCLElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRTtNQUNkLE1BQU0sQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUMxQyxNQUFNLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTtNQUN0QixNQUFNLENBQUMsZUFBZSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDM0MsTUFBTSxJQUFJLEdBQUcsQ0FBQyxRQUFRLEVBQUU7TUFDdkIsTUFBTSxDQUFDLGVBQWUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0tBQzVDO0dBQ0Y7Q0FDRixDQUFDOztBQ3ZCSyxNQUFNLGNBQWMsU0FBUyxLQUFLLENBQUM7RUFDeEMsV0FBVyxDQUFDLE9BQU8sRUFBRTtJQUNuQixLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNwRSxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsdUJBQXVCLENBQUM7R0FDakQ7Q0FDRjs7QUNVTSxTQUFTLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxjQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUU7RUFDaEUsSUFBSSxFQUFFLEtBQUssWUFBWSxjQUFjLENBQUMsRUFBRTtJQUN0QyxNQUFNLElBQUksS0FBSztNQUNiLHVFQUF1RTtLQUN4RSxDQUFDO0dBQ0g7O0VBRUQsS0FBSztLQUNGLGNBQWMsQ0FBQywwQkFBMEIsQ0FBQztLQUMxQyxjQUFjLENBQUMsbUJBQW1CLEVBQUM7O0VBRXRDLEtBQUs7S0FDRixpQkFBaUIsQ0FBQyxhQUFhLENBQUM7S0FDaEMsaUJBQWlCLENBQUMsS0FBSyxDQUFDO0tBQ3hCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQztLQUN6QixpQkFBaUIsQ0FBQyxpQkFBaUIsQ0FBQztLQUNwQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUM7O0tBRTdCLGlCQUFpQixDQUFDLE1BQU0sQ0FBQzs7S0FFekIsaUJBQWlCLENBQUMsaUJBQWlCLENBQUM7S0FDcEMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUM7S0FDckMsaUJBQWlCLENBQUMsZ0JBQWdCLENBQUM7O0tBRW5DLGlCQUFpQixDQUFDLHVCQUF1QixFQUFDOzs7RUFHN0MsTUFBTSxlQUFlLEdBQUc7SUFDdEIsRUFBRSxFQUFFLEtBQUs7SUFDVCxRQUFRLEVBQUUsSUFBSTtHQUNmLENBQUM7O0VBRUYsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQzs7RUFFdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUU7SUFDckIsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDO0dBQ2xCOztFQUVELElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUM7RUFDMUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtJQUNsQixNQUFNLEtBQUssR0FBRyxJQUFJQyxLQUFXLEVBQUUsQ0FBQztJQUNoQyxhQUFhLEdBQUcsTUFBTTtNQUNwQixLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDcEQsQ0FBQztHQUNIOztFQUVELElBQUksS0FBSyxHQUFHLEtBQUs7S0FDZCxZQUFZLEVBQUU7S0FDZCxZQUFZLENBQUMsS0FBSyxDQUFDO0tBQ25CLG9CQUFvQixDQUFDLElBQUlDLE9BQVcsRUFBRSxDQUFDLENBQUM7O0VBRTNDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFO0lBQzlELEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtJQUNkLEVBQUUsRUFBRSxPQUFPLENBQUMsRUFBRTtJQUNkLGFBQWEsRUFBRSxhQUFhO0dBQzdCLENBQUMsQ0FBQzs7O0VBR0gsSUFBSSxNQUFNLEdBQUcsSUFBSTtJQUNmLFNBQVMsR0FBRyxJQUFJLENBQUM7Ozs7Ozs7OztFQVNuQjtJQUNFLE1BQU0sR0FBRyxLQUFLO09BQ1gsWUFBWSxFQUFFO09BQ2QsWUFBWSxDQUFDLE1BQU0sQ0FBQztPQUNwQixZQUFZLENBQUMsdUJBQXVCLENBQUM7T0FDckMsb0JBQW9CO1FBQ25CLElBQUlDLGlCQUF1QjtVQUN6QixFQUFFO1VBQ0YsTUFBTSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUMsV0FBVztVQUN0QyxHQUFHO1VBQ0gsR0FBRztTQUNKO1FBQ0QsS0FBSztPQUNOO09BQ0EsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0dBQ3pCOztFQUVELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFO0lBQzdELEtBQUssRUFBRSxLQUFLO0lBQ1osTUFBTSxFQUFFLE1BQU07R0FDZixDQUFDLENBQUM7O0VBRUgsT0FBTztJQUNMLEtBQUs7SUFDTCxRQUFRLEVBQUU7TUFDUixLQUFLO01BQ0wsTUFBTTtNQUNOLFNBQVM7TUFDVCxRQUFRO01BQ1IsVUFBVTtLQUNYO0dBQ0YsQ0FBQztDQUNIOzs7OyJ9

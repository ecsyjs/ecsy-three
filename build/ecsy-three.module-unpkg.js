import { TagComponent, System, Not, SystemStateComponent, _Entity, World } from 'https://unpkg.com/ecsy@0.2.6/build/ecsy.module.js';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, AnimationMixer, LoopOnce, Object3D, PositionalAudio, AudioListener, AudioLoader, Clock, Scene as Scene$1, PerspectiveCamera } from 'https://unpkg.com/three@0.117.1/build/three.module.js';
import { GLTFLoader as GLTFLoader$1 } from 'https://unpkg.com/three@0.117.1/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'https://unpkg.com/troika-3d-text@0.27.0/dist/textmesh-standalone.esm.js?module';
import { VRButton } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.117.1/examples/jsm/webxr/XRControllerModelFactory.js';

class Active {
  constructor() {
    this.reset();
  }

  reset() {
    this.value = false;
  }
}

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

class Camera {
  constructor() {
    this.fov = 45;
    this.aspect = 1;
    this.near = 0.1;
    this.far = 1000;
    this.layers = 0;
    this.handleResize = true;
  }

  reset() {}
}

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
    this.append = true;
    this.onLoaded = null;
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

class Object3DComponent {
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
    this.value = new Vector3();
  }

  reset() {
    this.value.set(0, 0, 0);
  }
}

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

class Scene {
  constructor() {
    this.scene = null;
  }

  reset() {
    this.scene = null;
  }
}

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

class Transform {
  constructor() {
    this.position = new Vector3();
    this.rotation = new Vector3();
  }

  copy(src) {
    this.position.copy(src.position);
    this.rotation.copy(src.rotation);
  }

  reset() {
    this.position.set(0, 0, 0);
    this.rotation.set(0, 0, 0);
  }
}

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

class WebGLRenderer {
  constructor() {
    this.vr = false;
    this.ar = false;
    this.antialias = true;
    this.handleResize = true;
    this.shadowMap = true;
  }

  reset() {}
}

/*
export const WebGLRenderer = createComponentClass(
  {
    vr: { default: true },
    antialias: { default: true },
    handleResize: { default: true },
    shadowMap: { default: false }
  },
  "WebGLRenderer"
);
*/

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

      this.world
        .createEntity()
        .addComponent(GLTFModel, { value: gltf })
        .addObject3DComponent(gltf.scene, component.append && entity);

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
    }

    for (let i = 0; i < positions.changed.length; i++) {
      let entity = positions.changed[i];
      let position = entity.getComponent(Position).value;
      let object = entity.getObject3D();

      object.position.copy(position);
    }

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

function tagClassForObject3D(obj) {
  // TODO support more tags and probably a way to add user defined ones
  if (obj.isMesh) {
    return MeshTagComponent;
  } else if (obj.isScene) {
    return SceneTagComponent;
  } else if (obj.isCamera) {
    return CameraTagComponent;
  }
}

class ECSYThreeEntity extends _Entity {
  addObject3DComponent(obj, parentEntity) {
    obj.entity = this;
    this.addComponent(Object3DComponent, { value: obj });
    const Tag = tagClassForObject3D(obj);
    if (Tag) {
      this.addComponent(Tag);
    }
    if (parentEntity) {
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
    const Tag = tagClassForObject3D(obj);
    if (Tag) {
      this.removeComponent(Tag);
    }
    obj.entity = null;
  }

  getObject3D() {
    return this.getComponent(Object3DComponent).value;
  }
}

class ECSYThreeWorld extends World {
  constructor(options) {
    super(Object.assign({}, { entityClass: ECSYThreeEntity }, options));
  }

  // TODO expose removeEntity on ECSY.World and change `this.entityManager` usage to `super``
  removeEntity(entity) {
    if (entity.hasComponent(Object3DComponent)) {
      const obj = entity.getObject3D();
      obj.traverse(o => {
        this.entityManager.removeEntity(o.entity);
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    } else {
      this.entityManager.removeEntity(entity);
    }
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

export { Active, Animation, AnimationSystem, Camera, CameraRig, Colliding, CollisionStart, CollisionStop, ControllerConnected, Draggable, Dragging, ECSYThreeWorld, Environment, EnvironmentSystem, GLTFLoader, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, InputState, InputSystem, Material, MaterialSystem, Object3DComponent, Parent, ParentObject3D, Play, Position, RenderPass, RigidBody, Rotation, SDFTextSystem, Scale, Scene, Shape, Sky, SkyBox, SkyBoxSystem, Sound, SoundSystem, Stop, Text, TextGeometry, TextGeometrySystem, Transform, TransformSystem, UpdateAspectOnResizeSystem, VRController, VRControllerBasicBehaviour, VRControllerSystem, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, initialize };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUtdW5wa2cuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0FuaW1hdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NvbGxpZGluZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NvbGxpc2lvblN0YXJ0LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29sbGlzaW9uU3RvcC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZMb2FkZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9JbnB1dFN0YXRlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvTWF0ZXJpYWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9PYmplY3QzRENvbXBvbmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1BhcmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1BhcmVudE9iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGxheS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Bvc2l0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmVuZGVyUGFzcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JpZ2lkQm9keS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdGF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2NhbGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9TY2VuZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NoYXBlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU291bmQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9TdG9wLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHRHZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RyYW5zZm9ybS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Zpc2libGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WUkNvbnRyb2xsZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ29udHJvbGxlckNvbm5lY3RlZC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNEVGFncy5qcyIsIi4uL3NyYy9zeXN0ZW1zL01hdGVyaWFsU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1NERlRleHRTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1ZSQ29udHJvbGxlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0FuaW1hdGlvblN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0lucHV0U3lzdGVtLmpzIiwiLi4vc3JjL2xpYi9Qb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljLmpzIiwiLi4vc3JjL3N5c3RlbXMvU291bmRTeXN0ZW0uanMiLCIuLi9zcmMvZW50aXR5LmpzIiwiLi4vc3JjL3dvcmxkLmpzIiwiLi4vc3JjL2luaXRpYWxpemUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEFuaW1hdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYW5pbWF0aW9ucyA9IFtdO1xuICAgIHRoaXMuZHVyYXRpb24gPSAtMTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuYW5pbWF0aW9ucy5sZW5ndGggPSAwO1xuICAgIHRoaXMuZHVyYXRpb24gPSAtMTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZm92ID0gNDU7XG4gICAgdGhpcy5hc3BlY3QgPSAxO1xuICAgIHRoaXMubmVhciA9IDAuMTtcbiAgICB0aGlzLmZhciA9IDEwMDA7XG4gICAgdGhpcy5sYXllcnMgPSAwO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmFSaWcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxlZnRIYW5kID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ29sbGlkaW5nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoID0gW107XG4gICAgdGhpcy5jb2xsaWRpbmdGcmFtZSA9IDA7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xsaWRpbmdXaXRoLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5jb2xsaWRpbmdGcmFtZSA9IDA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDb2xsaXNpb25TdGFydCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aCA9IFtdO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aC5sZW5ndGggPSAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ29sbGlzaW9uU3RvcCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aCA9IFtdO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sbGlkaW5nV2l0aC5sZW5ndGggPSAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRHJhZ2dhYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIERyYWdnaW5nIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgRW52aXJvbm1lbnQge1xuICByZXNldCgpIHt9XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5wcmVzZXQgPSBcImRlZmF1bHRcIjtcbiAgICB0aGlzLnNlZWQgPSAxO1xuICAgIHRoaXMuc2t5VHlwZSA9IFwiYXRtb3NwaGVyZVwiO1xuICAgIHRoaXMuc2t5Q29sb3IgPSBcIlwiO1xuICAgIHRoaXMuaG9yaXpvbkNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmxpZ2h0aW5nID0gXCJkaXN0YW50XCI7XG4gICAgdGhpcy5zaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLnNoYWRvd1NpemUgPSAxMDtcbiAgICB0aGlzLmxpZ2h0UG9zaXRpb24gPSB7IHg6IDAsIHk6IDEsIHo6IC0wLjIgfTtcbiAgICB0aGlzLmZvZyA9IDA7XG5cbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5QXJlYSA9IDE7XG5cbiAgICB0aGlzLmdyb3VuZCA9IFwiZmxhdFwiO1xuICAgIHRoaXMuZ3JvdW5kWVNjYWxlID0gMztcbiAgICB0aGlzLmdyb3VuZFRleHR1cmUgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yID0gXCIjNTUzZTM1XCI7XG4gICAgdGhpcy5ncm91bmRDb2xvcjIgPSBcIiM2OTQ0MzlcIjtcblxuICAgIHRoaXMuZHJlc3NpbmcgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmRyZXNzaW5nQW1vdW50ID0gMTA7XG4gICAgdGhpcy5kcmVzc2luZ0NvbG9yID0gXCIjNzk1NDQ5XCI7XG4gICAgdGhpcy5kcmVzc2luZ1NjYWxlID0gNTtcbiAgICB0aGlzLmRyZXNzaW5nVmFyaWFuY2UgPSB7IHg6IDEsIHk6IDEsIHo6IDEgfTtcbiAgICB0aGlzLmRyZXNzaW5nVW5pZm9ybVNjYWxlID0gdHJ1ZTtcbiAgICB0aGlzLmRyZXNzaW5nT25QbGF5QXJlYSA9IDA7XG5cbiAgICB0aGlzLmdyaWQgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyaWRDb2xvciA9IFwiI2NjY1wiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy51cmwgPSBcIlwiO1xuICAgIHRoaXMucmVjZWl2ZVNoYWRvdyA9IGZhbHNlO1xuICAgIHRoaXMuY2FzdFNoYWRvdyA9IGZhbHNlO1xuICAgIHRoaXMuZW52TWFwT3ZlcnJpZGUgPSBudWxsO1xuICAgIHRoaXMuYXBwZW5kID0gdHJ1ZTtcbiAgICB0aGlzLm9uTG9hZGVkID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdMVEZNb2RlbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBJbnB1dFN0YXRlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52cmNvbnRyb2xsZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMua2V5Ym9hcmQgPSB7fTtcbiAgICB0aGlzLm1vdXNlID0ge307XG4gICAgdGhpcy5nYW1lcGFkcyA9IHt9O1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjb25zdCBTSURFUyA9IHtcbiAgZnJvbnQ6IDAsXG4gIGJhY2s6IDEsXG4gIGRvdWJsZTogMlxufTtcblxuZXhwb3J0IGNvbnN0IFNIQURFUlMgPSB7XG4gIHN0YW5kYXJkOiAwLFxuICBmbGF0OiAxXG59O1xuXG5leHBvcnQgY29uc3QgQkxFTkRJTkcgPSB7XG4gIG5vcm1hbDogMCxcbiAgYWRkaXRpdmU6IDEsXG4gIHN1YnRyYWN0aXZlOiAyLFxuICBtdWx0aXBseTogM1xufTtcblxuZXhwb3J0IGNvbnN0IFZFUlRFWF9DT0xPUlMgPSB7XG4gIG5vbmU6IDAsXG4gIGZhY2U6IDEsXG4gIHZlcnRleDogMlxufTtcblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdCA9IG5ldyBUSFJFRS5WZWN0b3IyKDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQuc2V0KDAsIDApO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdC5zZXQoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBPYmplY3QzRENvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBQYXJlbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50T2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59IiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBQbGF5IGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFJlbmRlclBhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBSaWdpZEJvZHkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5vYmplY3QgPSBudWxsO1xuICAgIHRoaXMud2VpZ2h0ID0gMDtcbiAgICB0aGlzLnJlc3RpdHV0aW9uID0gMTtcbiAgICB0aGlzLmZyaWN0aW9uID0gMTtcbiAgICB0aGlzLmxpbmVhckRhbXBpbmcgPSAwO1xuICAgIHRoaXMuYW5ndWxhckRhbXBpbmcgPSAwO1xuICAgIHRoaXMubGluZWFyVmVsb2NpdHkgPSB7IHg6IDAsIHk6IDAsIHo6IDAgfTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2NhbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NlbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2hhcGUge1xuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5Qm94IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNvdW5kIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zb3VuZCA9IG51bGw7XG4gICAgdGhpcy51cmwgPSBcIlwiO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFN0b3AgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBUZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgICB0aGlzLnRleHRBbGlnbiA9IFwibGVmdFwiOyAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ11cbiAgICB0aGlzLmFuY2hvciA9IFwiY2VudGVyXCI7IC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICAgIHRoaXMuYmFzZWxpbmUgPSBcImNlbnRlclwiOyAvLyBbJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJ11cbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgdGhpcy5mb250ID0gXCJcIjsgLy9cImh0dHBzOi8vY29kZS5jZG4ubW96aWxsYS5uZXQvZm9udHMvdHRmL1ppbGxhU2xhYi1TZW1pQm9sZC50dGZcIjtcbiAgICB0aGlzLmZvbnRTaXplID0gMC4yO1xuICAgIHRoaXMubGV0dGVyU3BhY2luZyA9IDA7XG4gICAgdGhpcy5saW5lSGVpZ2h0ID0gMDtcbiAgICB0aGlzLm1heFdpZHRoID0gSW5maW5pdHk7XG4gICAgdGhpcy5vdmVyZmxvd1dyYXAgPSBcIm5vcm1hbFwiOyAvLyBbJ25vcm1hbCcsICdicmVhay13b3JkJ11cbiAgICB0aGlzLndoaXRlU3BhY2UgPSBcIm5vcm1hbFwiOyAvLyBbJ25vcm1hbCcsICdub3dyYXAnXVxuICAgIHRoaXMub3BhY2l0eSA9IDE7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHQgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5jb3B5KHNyYy5wb3NpdGlvbik7XG4gICAgdGhpcy5yb3RhdGlvbi5jb3B5KHNyYy5yb3RhdGlvbik7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpc2libGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlkID0gMDtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zZWxlY3QgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0c3RhcnQgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0ZW5kID0gbnVsbDtcblxuICAgIHRoaXMuY29ubmVjdGVkID0gbnVsbDtcblxuICAgIHRoaXMuc3F1ZWV6ZSA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplc3RhcnQgPSBudWxsO1xuICAgIHRoaXMuc3F1ZWV6ZWVuZCA9IG51bGw7XG4gIH1cbn0iLCJleHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudnIgPSBmYWxzZTtcbiAgICB0aGlzLmFyID0gZmFsc2U7XG4gICAgdGhpcy5hbnRpYWxpYXMgPSB0cnVlO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgICB0aGlzLnNoYWRvd01hcCA9IHRydWU7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG5cbi8qXG5leHBvcnQgY29uc3QgV2ViR0xSZW5kZXJlciA9IGNyZWF0ZUNvbXBvbmVudENsYXNzKFxuICB7XG4gICAgdnI6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGFudGlhbGlhczogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogZmFsc2UgfVxuICB9LFxuICBcIldlYkdMUmVuZGVyZXJcIlxuKTtcbiovXG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIENvbnRyb2xsZXJDb25uZWN0ZWQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCBjbGFzcyBTY2VuZVRhZ0NvbXBvbmVudCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIENhbWVyYVRhZ0NvbXBvbmVudCBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuZXhwb3J0IGNsYXNzIE1lc2hUYWdDb21wb25lbnQgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cblxuZXhwb3J0IGNsYXNzIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSwgTm90LCBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBNYXRlcmlhbCxcbiAgT2JqZWN0M0RDb21wb25lbnQsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5jbGFzcyBNYXRlcmlhbEluc3RhbmNlIGV4dGVuZHMgU3lzdGVtU3RhdGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoKTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMubmV3LnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChNYXRlcmlhbCk7XG4gICAgfSk7XG4gIH1cbn1cblxuTWF0ZXJpYWxTeXN0ZW0ucXVlcmllcyA9IHtcbiAgbmV3OiB7XG4gICAgY29tcG9uZW50czogW01hdGVyaWFsLCBOb3QoTWF0ZXJpYWxJbnN0YW5jZSldXG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBHZW9tZXRyeSxcbiAgT2JqZWN0M0RDb21wb25lbnQsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG4vKipcbiAqIENyZWF0ZSBhIE1lc2ggYmFzZWQgb24gdGhlIFtHZW9tZXRyeV0gY29tcG9uZW50IGFuZCBhdHRhY2ggaXQgdG8gdGhlIGVudGl0eSB1c2luZyBhIFtPYmplY3QzRF0gY29tcG9uZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gUmVtb3ZlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0UmVtb3ZlZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldE9iamVjdDNEKCkucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIHZhciBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoTWF0ZXJpYWwpKSB7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4qL1xuXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVHJhbnNmb3JtKSkge1xuICAgICAgICB2YXIgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0aW9uKSB7XG4gICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChFbGVtZW50KSAmJiAhZW50aXR5Lmhhc0NvbXBvbmVudChEcmFnZ2FibGUpKSB7XG4gICAgICAvLyAgICAgICAgb2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweDMzMzMzMyk7XG4gICAgICAvLyAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dlb21ldHJ5XSwgLy8gQHRvZG8gVHJhbnNmb3JtOiBBcyBvcHRpb25hbCwgaG93IHRvIGRlZmluZSBpdD9cbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IEdMVEZMb2FkZXIgYXMgR0xURkxvYWRlclRocmVlIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbSwgU3lzdGVtU3RhdGVDb21wb25lbnQsIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcbmltcG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTG9hZGVyLmpzXCI7XG5cbi8vIEB0b2RvIFVzZSBwYXJhbWV0ZXIgYW5kIGxvYWRlciBtYW5hZ2VyXG52YXIgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXJUaHJlZSgpOyAvLy5zZXRQYXRoKFwiL2Fzc2V0cy9tb2RlbHMvXCIpO1xuXG5jbGFzcyBHTFRGTG9hZGVyU3RhdGUgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7fVxuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5sb2FkZWQgPSBbXTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgY29uc3QgdG9Mb2FkID0gdGhpcy5xdWVyaWVzLnRvTG9hZC5yZXN1bHRzO1xuICAgIHdoaWxlICh0b0xvYWQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0b0xvYWRbMF07XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEdMVEZMb2FkZXJTdGF0ZSk7XG4gICAgICBsb2FkZXIubG9hZChlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZMb2FkZXIpLnVybCwgZ2x0ZiA9PlxuICAgICAgICB0aGlzLmxvYWRlZC5wdXNoKFtlbnRpdHksIGdsdGZdKVxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBEbyB0aGUgYWN0dWFsIGVudGl0eSBjcmVhdGlvbiBpbnNpZGUgdGhlIHN5c3RlbSB0aWNrIG5vdCBpbiB0aGUgbG9hZGVyIGNhbGxiYWNrXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmxvYWRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgY29uc3QgW2VudGl0eSwgZ2x0Zl0gPSB0aGlzLmxvYWRlZFtpXTtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURkxvYWRlcik7XG4gICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICBjaGlsZC5yZWNlaXZlU2hhZG93ID0gY29tcG9uZW50LnJlY2VpdmVTaGFkb3c7XG4gICAgICAgICAgY2hpbGQuY2FzdFNoYWRvdyA9IGNvbXBvbmVudC5jYXN0U2hhZG93O1xuXG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZSkge1xuICAgICAgICAgICAgY2hpbGQubWF0ZXJpYWwuZW52TWFwID0gY29tcG9uZW50LmVudk1hcE92ZXJyaWRlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMud29ybGRcbiAgICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAgIC5hZGRDb21wb25lbnQoR0xURk1vZGVsLCB7IHZhbHVlOiBnbHRmIH0pXG4gICAgICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChnbHRmLnNjZW5lLCBjb21wb25lbnQuYXBwZW5kICYmIGVudGl0eSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQub25Mb2FkZWQpIHtcbiAgICAgICAgY29tcG9uZW50Lm9uTG9hZGVkKGdsdGYuc2NlbmUsIGdsdGYpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmxvYWRlZC5sZW5ndGggPSAwO1xuXG4gICAgY29uc3QgdG9VbmxvYWQgPSB0aGlzLnF1ZXJpZXMudG9VbmxvYWQucmVzdWx0cztcbiAgICB3aGlsZSAodG9VbmxvYWQubGVuZ3RoKSB7XG4gICAgICBjb25zdCBlbnRpdHkgPSB0b1VubG9hZFswXTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoR0xURkxvYWRlclN0YXRlKTtcbiAgICAgIGVudGl0eS5yZW1vdmVPYmplY3QzRENvbXBvbmVudCgpO1xuICAgIH1cbiAgfVxufVxuXG5HTFRGTG9hZGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHRvTG9hZDoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyLCBOb3QoR0xURkxvYWRlclN0YXRlKV1cbiAgfSxcbiAgdG9VbmxvYWQ6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURkxvYWRlclN0YXRlLCBOb3QoR0xURkxvYWRlcildXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTa3lCb3gsIE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGxldCBza3lib3ggPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNreUJveCk7XG5cbiAgICAgIGxldCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICAgZ2VvbWV0cnkuc2NhbGUoMSwgMSwgLTEpO1xuXG4gICAgICBpZiAoc2t5Ym94LnR5cGUgPT09IFwiY3ViZW1hcC1zdGVyZW9cIikge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoc2t5Ym94LnRleHR1cmVVcmwsIDEyKTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzKTtcbiAgICAgICAgc2t5Qm94LmxheWVycy5zZXQoMSk7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3gpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzUi5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveFIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICAgIHNreUJveFIubGF5ZXJzLnNldCgyKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveFIpO1xuXG4gICAgICAgIGVudGl0eS5hZGRPYmplY3QzRENvbXBvbmVudChncm91cCwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biBza3lib3ggdHlwZTogXCIsIHNreWJveC50eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5Ta3lCb3hTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbU2t5Qm94LCBOb3QoT2JqZWN0M0RDb21wb25lbnQpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZpc2libGUsIE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2liaWxpdHlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBwcm9jZXNzVmlzaWJpbGl0eShlbnRpdGllcykge1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRPYmplY3QzRCgpLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZpc2libGUpLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRENvbXBvbmVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRNZXNoIH0gZnJvbSBcInRyb2lrYS0zZC10ZXh0L2Rpc3QvdGV4dG1lc2gtc3RhbmRhbG9uZS5lc20uanNcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50LCBUZXh0IH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5cbmNvbnN0IGFuY2hvck1hcHBpbmcgPSB7XG4gIGxlZnQ6IDAsXG4gIGNlbnRlcjogMC41LFxuICByaWdodDogMVxufTtcbmNvbnN0IGJhc2VsaW5lTWFwcGluZyA9IHtcbiAgdG9wOiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgYm90dG9tOiAxXG59O1xuXG5leHBvcnQgY2xhc3MgU0RGVGV4dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpIHtcbiAgICB0ZXh0TWVzaC50ZXh0ID0gdGV4dENvbXBvbmVudC50ZXh0O1xuICAgIHRleHRNZXNoLnRleHRBbGlnbiA9IHRleHRDb21wb25lbnQudGV4dEFsaWduO1xuICAgIHRleHRNZXNoLmFuY2hvclswXSA9IGFuY2hvck1hcHBpbmdbdGV4dENvbXBvbmVudC5hbmNob3JdO1xuICAgIHRleHRNZXNoLmFuY2hvclsxXSA9IGJhc2VsaW5lTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmJhc2VsaW5lXTtcbiAgICB0ZXh0TWVzaC5jb2xvciA9IHRleHRDb21wb25lbnQuY29sb3I7XG4gICAgdGV4dE1lc2guZm9udCA9IHRleHRDb21wb25lbnQuZm9udDtcbiAgICB0ZXh0TWVzaC5mb250U2l6ZSA9IHRleHRDb21wb25lbnQuZm9udFNpemU7XG4gICAgdGV4dE1lc2gubGV0dGVyU3BhY2luZyA9IHRleHRDb21wb25lbnQubGV0dGVyU3BhY2luZyB8fCAwO1xuICAgIHRleHRNZXNoLmxpbmVIZWlnaHQgPSB0ZXh0Q29tcG9uZW50LmxpbmVIZWlnaHQgfHwgbnVsbDtcbiAgICB0ZXh0TWVzaC5vdmVyZmxvd1dyYXAgPSB0ZXh0Q29tcG9uZW50Lm92ZXJmbG93V3JhcDtcbiAgICB0ZXh0TWVzaC53aGl0ZVNwYWNlID0gdGV4dENvbXBvbmVudC53aGl0ZVNwYWNlO1xuICAgIHRleHRNZXNoLm1heFdpZHRoID0gdGV4dENvbXBvbmVudC5tYXhXaWR0aDtcbiAgICB0ZXh0TWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gdGV4dENvbXBvbmVudC5vcGFjaXR5O1xuICAgIHRleHRNZXNoLnN5bmMoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzO1xuXG4gICAgZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG5cbiAgICAgIGNvbnN0IHRleHRNZXNoID0gbmV3IFRleHRNZXNoKCk7XG4gICAgICB0ZXh0TWVzaC5uYW1lID0gXCJ0ZXh0TWVzaFwiO1xuICAgICAgdGV4dE1lc2guYW5jaG9yID0gWzAsIDBdO1xuICAgICAgdGV4dE1lc2gucmVuZGVyT3JkZXIgPSAxMDsgLy9icnV0ZS1mb3JjZSBmaXggZm9yIHVnbHkgYW50aWFsaWFzaW5nLCBzZWUgaXNzdWUgIzY3XG4gICAgICB0aGlzLnVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpO1xuICAgICAgZS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IHRleHRNZXNoIH0pO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRPYmplY3QzRCgpO1xuICAgICAgdmFyIHRleHRNZXNoID0gb2JqZWN0M0QuZ2V0T2JqZWN0QnlOYW1lKFwidGV4dE1lc2hcIik7XG4gICAgICB0ZXh0TWVzaC5kaXNwb3NlKCk7XG4gICAgICBvYmplY3QzRC5yZW1vdmUodGV4dE1lc2gpO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMuY2hhbmdlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRPYmplY3QzRCgpO1xuICAgICAgaWYgKG9iamVjdDNEIGluc3RhbmNlb2YgVGV4dE1lc2gpIHtcbiAgICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KG9iamVjdDNELCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5TREZUZXh0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RleHRdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhVGFnQ29tcG9uZW50LFxuICBBY3RpdmUsXG4gIFdlYkdMUmVuZGVyZXIsXG4gIE9iamVjdDNEQ29tcG9uZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFZSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9WUkJ1dHRvbi5qc1wiO1xuaW1wb3J0IHsgQVJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL0FSQnV0dG9uLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVycyA9IHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cztcbiAgICByZW5kZXJlcnMuZm9yRWFjaChyZW5kZXJlckVudGl0eSA9PiB7XG4gICAgICB2YXIgcmVuZGVyZXIgPSByZW5kZXJlckVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlclBhc3Nlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIHBhc3MgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFJlbmRlclBhc3MpO1xuICAgICAgICB2YXIgc2NlbmUgPSBwYXNzLnNjZW5lLmdldE9iamVjdDNEKCk7XG5cbiAgICAgICAgdGhpcy5xdWVyaWVzLmFjdGl2ZUNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYUVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNhbWVyYSA9IGNhbWVyYUVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGNvbXBvbmVudC5zaGFkb3dNYXA7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIgfHwgY29tcG9uZW50LmFyKSB7XG4gICAgICAgIHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFZSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhVGFnQ29tcG9uZW50LCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUGFyZW50T2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgUG9zaXRpb24sXG4gIFNjYWxlLFxuICBQYXJlbnQsXG4gIE9iamVjdDNEQ29tcG9uZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgaWYgKCFlbnRpdHkuYWxpdmUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGllcmFyY2h5XG4gICAgdGhpcy5xdWVyaWVzLnBhcmVudE9iamVjdDNELmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50T2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICB9KTtcblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGlmICghZW50aXR5LmFsaXZlKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGxldCBwb3NpdGlvbnMgPSB0aGlzLnF1ZXJpZXMucG9zaXRpb25zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmFkZGVkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gU2NhbGVcbiAgICBsZXQgc2NhbGVzID0gdGhpcy5xdWVyaWVzLnNjYWxlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHNjYWxlcy5hZGRlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldE9iamVjdDNEKCk7XG5cbiAgICAgIG9iamVjdC5zY2FsZS5jb3B5KHNjYWxlKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmNoYW5nZWRbaV07XG4gICAgICBsZXQgc2NhbGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjYWxlKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50T2JqZWN0M0Q6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50T2JqZWN0M0QsIE9iamVjdDNEQ29tcG9uZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRENvbXBvbmVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3Jtczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgVHJhbnNmb3JtXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RyYW5zZm9ybV1cbiAgICB9XG4gIH0sXG4gIHBvc2l0aW9uczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRENvbXBvbmVudCwgUG9zaXRpb25dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbUG9zaXRpb25dXG4gICAgfVxuICB9LFxuICBzY2FsZXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0RDb21wb25lbnQsIFNjYWxlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1NjYWxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBDYW1lcmFUYWdDb21wb25lbnQsXG4gIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnLFxuICBPYmplY3QzRENvbXBvbmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMuYXNwZWN0ID0gd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLmFzcGVjdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICBjb25zb2xlLmxvZyhcInJlc2l6ZVwiLCB0aGlzLmFzcGVjdCk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2FtZXJhcyA9IHRoaXMucXVlcmllcy5jYW1lcmFzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW1lcmFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY2FtZXJhT2JqID0gY2FtZXJhc1tpXS5nZXRPYmplY3QzRCgpO1xuICAgICAgaWYgKGNhbWVyYU9iai5hc3BlY3QgIT09IHRoaXMuYXNwZWN0KSB7XG4gICAgICAgIGNhbWVyYU9iai5hc3BlY3QgPSB0aGlzLmFzcGVjdDtcbiAgICAgICAgY2FtZXJhT2JqLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmFUYWdDb21wb25lbnQsIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnLCBPYmplY3QzRENvbXBvbmVudF1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0RDb21wb25lbnRcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSB9IGZyb20gXCIuLi9jb21wb25lbnRzL1RleHRHZW9tZXRyeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgdGhpcy5mb250ID0gbnVsbDtcbiAgICAvKlxuICAgIGxvYWRlci5sb2FkKFwiL2Fzc2V0cy9mb250cy9oZWx2ZXRpa2VyX3JlZ3VsYXIudHlwZWZhY2UuanNvblwiLCBmb250ID0+IHtcbiAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICAqL1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkuZ2V0T2JqZWN0M0QoKS5nZW9tZXRyeSA9IGdlb21ldHJ5O1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZGVkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkO1xuICAgIGFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb2xvciA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcbiAgICAgIGNvbG9yID0gMHhmZmZmZmY7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRENvbXBvbmVudCwgeyB2YWx1ZTogbWVzaCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dEdlb21ldHJ5XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCwgU2NlbmUsIE9iamVjdDNEQ29tcG9uZW50LCBFbnZpcm9ubWVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudmlyb25tZW50cy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAvLyBzdGFnZSBncm91bmQgZGlhbWV0ZXIgKGFuZCBza3kgcmFkaXVzKVxuICAgICAgdmFyIFNUQUdFX1NJWkUgPSAyMDA7XG5cbiAgICAgIC8vIGNyZWF0ZSBncm91bmRcbiAgICAgIC8vIHVwZGF0ZSBncm91bmQsIHBsYXlhcmVhIGFuZCBncmlkIHRleHR1cmVzLlxuICAgICAgdmFyIGdyb3VuZFJlc29sdXRpb24gPSAyMDQ4O1xuICAgICAgdmFyIHRleE1ldGVycyA9IDIwOyAvLyBncm91bmQgdGV4dHVyZSBvZiAyMCB4IDIwIG1ldGVyc1xuICAgICAgdmFyIHRleFJlcGVhdCA9IFNUQUdFX1NJWkUgLyB0ZXhNZXRlcnM7XG5cbiAgICAgIHZhciByZXNvbHV0aW9uID0gNjQ7IC8vIG51bWJlciBvZiBkaXZpc2lvbnMgb2YgdGhlIGdyb3VuZCBtZXNoXG5cbiAgICAgIHZhciBncm91bmRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgZ3JvdW5kQ2FudmFzLndpZHRoID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZENhbnZhcy5oZWlnaHQgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgdmFyIGdyb3VuZFRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShncm91bmRDYW52YXMpO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS5yZXBlYXQuc2V0KHRleFJlcGVhdCwgdGV4UmVwZWF0KTtcblxuICAgICAgdGhpcy5lbnZpcm9ubWVudERhdGEgPSB7XG4gICAgICAgIGdyb3VuZENvbG9yOiBcIiM0NTQ1NDVcIixcbiAgICAgICAgZ3JvdW5kQ29sb3IyOiBcIiM1ZDVkNWRcIlxuICAgICAgfTtcblxuICAgICAgdmFyIGdyb3VuZGN0eCA9IGdyb3VuZENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgIHZhciBzaXplID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjtcbiAgICAgIGdyb3VuZGN0eC5maWxsUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjI7XG4gICAgICB2YXIgbnVtID0gTWF0aC5mbG9vcih0ZXhNZXRlcnMgLyAyKTtcbiAgICAgIHZhciBzdGVwID0gc2l6ZSAvICh0ZXhNZXRlcnMgLyAyKTsgLy8gMiBtZXRlcnMgPT0gPHN0ZXA+IHBpeGVsc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW0gKyAxOyBpICs9IDIpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW0gKyAxOyBqKyspIHtcbiAgICAgICAgICBncm91bmRjdHguZmlsbFJlY3QoXG4gICAgICAgICAgICBNYXRoLmZsb29yKChpICsgKGogJSAyKSkgKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3IoaiAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdyb3VuZFRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICB2YXIgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIG1hcDogZ3JvdW5kVGV4dHVyZVxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzY2VuZSA9IGVudGl0eS5nZXRPYmplY3QzRCgpO1xuICAgICAgLy9zY2VuZS5hZGQobWVzaCk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICByZXNvbHV0aW9uIC0gMSxcbiAgICAgICAgcmVzb2x1dGlvbiAtIDFcbiAgICAgICk7XG5cbiAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiB3aW5kb3cuZW50aXR5U2NlbmUgfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0gMHgzMzMzMzM7XG4gICAgICBjb25zdCBuZWFyID0gMjA7XG4gICAgICBjb25zdCBmYXIgPSAxMDA7XG4gICAgICBzY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKGNvbG9yLCBuZWFyLCBmYXIpO1xuICAgICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcik7XG4gICAgfSk7XG4gIH1cbn1cblxuRW52aXJvbm1lbnRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW52aXJvbm1lbnRzOiB7XG4gICAgY29tcG9uZW50czogW1NjZW5lLCBFbnZpcm9ubWVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXJDb250ZXh0LFxuICBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cixcbiAgVlJDb250cm9sbGVyLFxuICBDb250cm9sbGVyQ29ubmVjdGVkLFxuICBPYmplY3QzRENvbXBvbmVudFxufSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5LmpzXCI7XG5cbnZhciBjb250cm9sbGVyTW9kZWxGYWN0b3J5ID0gbmV3IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSgpO1xuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXIgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJDb250ZXh0LnJlc3VsdHNbMF0uZ2V0Q29tcG9uZW50KFxuICAgICAgV2ViR0xSZW5kZXJlckNvbnRleHRcbiAgICApLnZhbHVlO1xuXG4gICAgdGhpcy5xdWVyaWVzLmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb250cm9sbGVySWQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlcikuaWQ7XG4gICAgICB2YXIgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXIubmFtZSA9IFwiY29udHJvbGxlclwiO1xuXG4gICAgICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IGdyb3VwIH0pO1xuXG4gICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJjb25uZWN0ZWRcIiwgKCkgPT4ge1xuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KENvbnRyb2xsZXJDb25uZWN0ZWQpO1xuICAgICAgfSk7XG5cbiAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihcImRpc2Nvbm5lY3RlZFwiLCAoKSA9PiB7XG4gICAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoQ29udHJvbGxlckNvbm5lY3RlZCk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpKSB7XG4gICAgICAgIHZhciBiZWhhdmlvdXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKTtcbiAgICAgICAgT2JqZWN0LmtleXMoYmVoYXZpb3VyKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKGJlaGF2aW91cltldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBiZWhhdmlvdXJbZXZlbnROYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB3aWxsIGF1dG9tYXRpY2FsbHkgZmV0Y2ggY29udHJvbGxlciBtb2RlbHNcbiAgICAgIC8vIHRoYXQgbWF0Y2ggd2hhdCB0aGUgdXNlciBpcyBob2xkaW5nIGFzIGNsb3NlbHkgYXMgcG9zc2libGUuIFRoZSBtb2RlbHNcbiAgICAgIC8vIHNob3VsZCBiZSBhdHRhY2hlZCB0byB0aGUgb2JqZWN0IHJldHVybmVkIGZyb20gZ2V0Q29udHJvbGxlckdyaXAgaW5cbiAgICAgIC8vIG9yZGVyIHRvIG1hdGNoIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgaGVsZCBkZXZpY2UuXG4gICAgICBsZXQgY29udHJvbGxlckdyaXAgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyR3JpcChjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlckdyaXAuYWRkKFxuICAgICAgICBjb250cm9sbGVyTW9kZWxGYWN0b3J5LmNyZWF0ZUNvbnRyb2xsZXJNb2RlbChjb250cm9sbGVyR3JpcClcbiAgICAgICk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlckdyaXApO1xuICAgICAgLypcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKFxuICAgICAgICBcInBvc2l0aW9uXCIsXG4gICAgICAgIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKFswLCAwLCAwLCAwLCAwLCAtMV0sIDMpXG4gICAgICApO1xuXG4gICAgICB2YXIgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5KTtcbiAgICAgIGxpbmUubmFtZSA9IFwibGluZVwiO1xuICAgICAgbGluZS5zY2FsZS56ID0gNTtcbiAgICAgIGdyb3VwLmFkZChsaW5lKTtcblxuICAgICAgbGV0IGdlb21ldHJ5MiA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgwLjEsIDAuMSwgMC4xKTtcbiAgICAgIGxldCBtYXRlcmlhbDIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMGZmMDAgfSk7XG4gICAgICBsZXQgY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5MiwgbWF0ZXJpYWwyKTtcbiAgICAgIGdyb3VwLm5hbWUgPSBcIlZSQ29udHJvbGxlclwiO1xuICAgICAgZ3JvdXAuYWRkKGN1YmUpO1xuKi9cbiAgICB9KTtcblxuICAgIC8vIHRoaXMuY2xlYW5JbnRlcnNlY3RlZCgpO1xuICB9XG59XG5cblZSQ29udHJvbGxlclN5c3RlbS5xdWVyaWVzID0ge1xuICBjb250cm9sbGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtWUkNvbnRyb2xsZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICAgIC8vY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9LFxuICByZW5kZXJlckNvbnRleHQ6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIG1hbmRhdG9yeTogdHJ1ZVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgUGxheSwgU3RvcCwgR0xURk1vZGVsLCBBbmltYXRpb24gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5jbGFzcyBBbmltYXRpb25NaXhlckNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgcmVzZXQoKSB7fVxufVxuXG5jbGFzcyBBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZShkZWx0YSkge1xuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgZ2x0ZiA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURk1vZGVsKS52YWx1ZTtcbiAgICAgIGxldCBtaXhlciA9IG5ldyBUSFJFRS5BbmltYXRpb25NaXhlcihnbHRmLnNjZW5lKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQsIHtcbiAgICAgICAgdmFsdWU6IG1peGVyXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBbXTtcbiAgICAgIGdsdGYuYW5pbWF0aW9ucy5mb3JFYWNoKGFuaW1hdGlvbkNsaXAgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBtaXhlci5jbGlwQWN0aW9uKGFuaW1hdGlvbkNsaXAsIGdsdGYuc2NlbmUpO1xuICAgICAgICBhY3Rpb24ubG9vcCA9IFRIUkVFLkxvb3BPbmNlO1xuICAgICAgICBhbmltYXRpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgIH0pO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIHtcbiAgICAgICAgYW5pbWF0aW9uczogYW5pbWF0aW9ucyxcbiAgICAgICAgZHVyYXRpb246IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uKS5kdXJhdGlvblxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMubWl4ZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25NaXhlckNvbXBvbmVudCkudmFsdWUudXBkYXRlKGRlbHRhKTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5wbGF5Q2xpcHMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5hbmltYXRpb25zLmZvckVhY2goYWN0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGlmIChjb21wb25lbnQuZHVyYXRpb24gIT09IC0xKSB7XG4gICAgICAgICAgYWN0aW9uQ2xpcC5zZXREdXJhdGlvbihjb21wb25lbnQuZHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWN0aW9uQ2xpcC5jbGFtcFdoZW5GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIGFjdGlvbkNsaXAucmVzZXQoKTtcbiAgICAgICAgYWN0aW9uQ2xpcC5wbGF5KCk7XG4gICAgICB9KTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoUGxheSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuc3RvcENsaXBzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQpXG4gICAgICAgIC5hbmltYXRpb25zO1xuICAgICAgYW5pbWF0aW9ucy5mb3JFYWNoKGFjdGlvbkNsaXAgPT4ge1xuICAgICAgICBhY3Rpb25DbGlwLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkNsaXAuc3RvcCgpO1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFN0b3ApO1xuICAgIH0pO1xuICB9XG59XG5cbkFuaW1hdGlvblN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb24sIEdMVEZNb2RlbF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbWl4ZXJzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbk1peGVyQ29tcG9uZW50XVxuICB9LFxuICBwbGF5Q2xpcHM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwgUGxheV1cbiAgfSxcbiAgc3RvcENsaXBzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIFN0b3BdXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgSW5wdXRTdGF0ZVxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIGxldCBlbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChJbnB1dFN0YXRlKTtcbiAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChJbnB1dFN0YXRlKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVlJDb250cm9sbGVycygpO1xuICAgIC8vIHRoaXMucHJvY2Vzc0tleWJvYXJkKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzTW91c2UoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NHYW1lcGFkcygpO1xuICB9XG5cbiAgcHJvY2Vzc1ZSQ29udHJvbGxlcnMoKSB7XG4gICAgLy8gUHJvY2VzcyByZWNlbnRseSBhZGRlZCBjb250cm9sbGVyc1xuICAgIHRoaXMucXVlcmllcy52cmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsIHtcbiAgICAgICAgc2VsZWN0c3RhcnQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5nZXQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdGVuZDogZXZlbnQgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmdldChldmVudC50YXJnZXQpO1xuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgY29ubmVjdGVkOiBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuc2V0KGV2ZW50LnRhcmdldCwge30pO1xuICAgICAgICB9LFxuICAgICAgICBkaXNjb25uZWN0ZWQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5kZWxldGUoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5mb3JFYWNoKHN0YXRlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdFN0YXJ0ID0gc3RhdGUuc2VsZWN0ZWQgJiYgIXN0YXRlLnByZXZTZWxlY3RlZDtcbiAgICAgIHN0YXRlLnNlbGVjdEVuZCA9ICFzdGF0ZS5zZWxlY3RlZCAmJiBzdGF0ZS5wcmV2U2VsZWN0ZWQ7XG4gICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSBzdGF0ZS5zZWxlY3RlZDtcbiAgICB9KTtcbiAgfVxufVxuXG5JbnB1dFN5c3RlbS5xdWVyaWVzID0ge1xuICB2cmNvbnRyb2xsZXJzOiB7XG4gICAgY29tcG9uZW50czogW1ZSQ29udHJvbGxlcl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljIGV4dGVuZHMgVEhSRUUuT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcihsaXN0ZW5lciwgcG9vbFNpemUpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgICB0aGlzLmNvbnRleHQgPSBsaXN0ZW5lci5jb250ZXh0O1xuXG4gICAgdGhpcy5wb29sU2l6ZSA9IHBvb2xTaXplIHx8IDU7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBvb2xTaXplOyBpKyspIHtcbiAgICAgIHRoaXMuY2hpbGRyZW4ucHVzaChuZXcgVEhSRUUuUG9zaXRpb25hbEF1ZGlvKGxpc3RlbmVyKSk7XG4gICAgfVxuICB9XG5cbiAgc2V0QnVmZmVyKGJ1ZmZlcikge1xuICAgIHRoaXMuY2hpbGRyZW4uZm9yRWFjaChzb3VuZCA9PiB7XG4gICAgICBzb3VuZC5zZXRCdWZmZXIoYnVmZmVyKTtcbiAgICB9KTtcbiAgfVxuXG4gIHBsYXkoKSB7XG4gICAgdmFyIGZvdW5kID0gZmFsc2U7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgc291bmQgPSB0aGlzLmNoaWxkcmVuW2ldO1xuICAgICAgaWYgKCFzb3VuZC5pc1BsYXlpbmcgJiYgc291bmQuYnVmZmVyICYmICFmb3VuZCkge1xuICAgICAgICBzb3VuZC5wbGF5KCk7XG4gICAgICAgIHNvdW5kLmlzUGF1c2VkID0gZmFsc2U7XG4gICAgICAgIGZvdW5kID0gdHJ1ZTtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKCFmb3VuZCkge1xuICAgICAgY29uc29sZS53YXJuKFxuICAgICAgICBcIkFsbCB0aGUgc291bmRzIGFyZSBwbGF5aW5nLiBJZiB5b3UgbmVlZCB0byBwbGF5IG1vcmUgc291bmRzIHNpbXVsdGFuZW91c2x5IGNvbnNpZGVyIGluY3JlYXNpbmcgdGhlIHBvb2wgc2l6ZVwiXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU291bmQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0IFBvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWMgZnJvbSBcIi4uL2xpYi9Qb3NpdGlvbmFsQXVkaW9Qb2x5cGhvbmljLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBTb3VuZFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5saXN0ZW5lciA9IG5ldyBUSFJFRS5BdWRpb0xpc3RlbmVyKCk7XG4gIH1cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuc291bmRzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFNvdW5kKTtcbiAgICAgIGNvbnN0IHNvdW5kID0gbmV3IFBvc2l0aW9uYWxBdWRpb1BvbHlwaG9uaWModGhpcy5saXN0ZW5lciwgMTApO1xuICAgICAgY29uc3QgYXVkaW9Mb2FkZXIgPSBuZXcgVEhSRUUuQXVkaW9Mb2FkZXIoKTtcbiAgICAgIGF1ZGlvTG9hZGVyLmxvYWQoY29tcG9uZW50LnVybCwgYnVmZmVyID0+IHtcbiAgICAgICAgc291bmQuc2V0QnVmZmVyKGJ1ZmZlcik7XG4gICAgICB9KTtcbiAgICAgIGNvbXBvbmVudC5zb3VuZCA9IHNvdW5kO1xuICAgIH0pO1xuICB9XG59XG5cblNvdW5kU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHNvdW5kczoge1xuICAgIGNvbXBvbmVudHM6IFtTb3VuZF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlIC8vIFtTb3VuZF1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBfRW50aXR5IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIE9iamVjdDNEQ29tcG9uZW50LFxuICBNZXNoVGFnQ29tcG9uZW50LFxuICBTY2VuZVRhZ0NvbXBvbmVudCxcbiAgQ2FtZXJhVGFnQ29tcG9uZW50XG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZnVuY3Rpb24gdGFnQ2xhc3NGb3JPYmplY3QzRChvYmopIHtcbiAgLy8gVE9ETyBzdXBwb3J0IG1vcmUgdGFncyBhbmQgcHJvYmFibHkgYSB3YXkgdG8gYWRkIHVzZXIgZGVmaW5lZCBvbmVzXG4gIGlmIChvYmouaXNNZXNoKSB7XG4gICAgcmV0dXJuIE1lc2hUYWdDb21wb25lbnQ7XG4gIH0gZWxzZSBpZiAob2JqLmlzU2NlbmUpIHtcbiAgICByZXR1cm4gU2NlbmVUYWdDb21wb25lbnQ7XG4gIH0gZWxzZSBpZiAob2JqLmlzQ2FtZXJhKSB7XG4gICAgcmV0dXJuIENhbWVyYVRhZ0NvbXBvbmVudDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlRW50aXR5IGV4dGVuZHMgX0VudGl0eSB7XG4gIGFkZE9iamVjdDNEQ29tcG9uZW50KG9iaiwgcGFyZW50RW50aXR5KSB7XG4gICAgb2JqLmVudGl0eSA9IHRoaXM7XG4gICAgdGhpcy5hZGRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHsgdmFsdWU6IG9iaiB9KTtcbiAgICBjb25zdCBUYWcgPSB0YWdDbGFzc0Zvck9iamVjdDNEKG9iaik7XG4gICAgaWYgKFRhZykge1xuICAgICAgdGhpcy5hZGRDb21wb25lbnQoVGFnKTtcbiAgICB9XG4gICAgaWYgKHBhcmVudEVudGl0eSkge1xuICAgICAgcGFyZW50RW50aXR5LmdldE9iamVjdDNEKCkuYWRkKG9iaik7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmVtb3ZlT2JqZWN0M0RDb21wb25lbnQodW5wYXJlbnQgPSB0cnVlKSB7XG4gICAgY29uc3Qgb2JqID0gdGhpcy5nZXRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQsIHRydWUpLnZhbHVlO1xuICAgIGlmICh1bnBhcmVudCkge1xuICAgICAgLy8gVXNpbmcgXCJ0cnVlXCIgYXMgdGhlIGVudGl0eSBjb3VsZCBiZSByZW1vdmVkIHNvbWV3aGVyZSBlbHNlXG4gICAgICBvYmoucGFyZW50ICYmIG9iai5wYXJlbnQucmVtb3ZlKG9iaik7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQ29tcG9uZW50KE9iamVjdDNEQ29tcG9uZW50KTtcbiAgICBjb25zdCBUYWcgPSB0YWdDbGFzc0Zvck9iamVjdDNEKG9iaik7XG4gICAgaWYgKFRhZykge1xuICAgICAgdGhpcy5yZW1vdmVDb21wb25lbnQoVGFnKTtcbiAgICB9XG4gICAgb2JqLmVudGl0eSA9IG51bGw7XG4gIH1cblxuICBnZXRPYmplY3QzRCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpLnZhbHVlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBXb3JsZCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBFQ1NZVGhyZWVFbnRpdHkgfSBmcm9tIFwiLi9lbnRpdHkuanNcIjtcbmltcG9ydCB7IE9iamVjdDNEQ29tcG9uZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRUNTWVRocmVlV29ybGQgZXh0ZW5kcyBXb3JsZCB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICBzdXBlcihPYmplY3QuYXNzaWduKHt9LCB7IGVudGl0eUNsYXNzOiBFQ1NZVGhyZWVFbnRpdHkgfSwgb3B0aW9ucykpO1xuICB9XG5cbiAgLy8gVE9ETyBleHBvc2UgcmVtb3ZlRW50aXR5IG9uIEVDU1kuV29ybGQgYW5kIGNoYW5nZSBgdGhpcy5lbnRpdHlNYW5hZ2VyYCB1c2FnZSB0byBgc3VwZXJgYFxuICByZW1vdmVFbnRpdHkoZW50aXR5KSB7XG4gICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0RDb21wb25lbnQpKSB7XG4gICAgICBjb25zdCBvYmogPSBlbnRpdHkuZ2V0T2JqZWN0M0QoKTtcbiAgICAgIG9iai50cmF2ZXJzZShvID0+IHtcbiAgICAgICAgdGhpcy5lbnRpdHlNYW5hZ2VyLnJlbW92ZUVudGl0eShvLmVudGl0eSk7XG4gICAgICAgIG8uZW50aXR5ID0gbnVsbDtcbiAgICAgIH0pO1xuICAgICAgb2JqLnBhcmVudCAmJiBvYmoucGFyZW50LnJlbW92ZShvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmVudGl0eU1hbmFnZXIucmVtb3ZlRW50aXR5KGVudGl0eSk7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgVXBkYXRlQXNwZWN0T25SZXNpemVTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1VwZGF0ZUFzcGVjdE9uUmVzaXplU3lzdGVtLmpzXCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyLFxuICBTY2VuZSxcbiAgQWN0aXZlLFxuICBSZW5kZXJQYXNzLFxuICBDYW1lcmEsXG4gIFVwZGF0ZUFzcGVjdE9uUmVzaXplVGFnXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuaW1wb3J0IHsgRUNTWVRocmVlV29ybGQgfSBmcm9tIFwiLi93b3JsZC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZSh3b3JsZCA9IG5ldyBFQ1NZVGhyZWVXb3JsZCgpLCBvcHRpb25zKSB7XG4gIGlmICghKHdvcmxkIGluc3RhbmNlb2YgRUNTWVRocmVlV29ybGQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgXCJUaGUgcHJvdmlkZWQgJ3dvcmxkJyBwYXJlbWV0ZXIgaXMgbm90IGFuIGluc3RhbmNlIG9mICdFQ1NZVGhyZWVXb3JsZCdcIlxuICAgICk7XG4gIH1cblxuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShVcGRhdGVBc3BlY3RPblJlc2l6ZVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oV2ViR0xSZW5kZXJlclN5c3RlbSwgeyBwcmlvcml0eTogMSB9KTtcblxuICBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgdnI6IGZhbHNlLFxuICAgIGRlZmF1bHRzOiB0cnVlXG4gIH07XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgaWYgKCFvcHRpb25zLmRlZmF1bHRzKSB7XG4gICAgcmV0dXJuIHsgd29ybGQgfTtcbiAgfVxuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRPYmplY3QzRENvbXBvbmVudChuZXcgVEhSRUUuU2NlbmUoKSk7XG5cbiAgbGV0IHJlbmRlcmVyID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIsIHtcbiAgICBhcjogb3B0aW9ucy5hcixcbiAgICB2cjogb3B0aW9ucy52cixcbiAgICBhbmltYXRpb25Mb29wOiBhbmltYXRpb25Mb29wXG4gIH0pO1xuXG4gIC8vIGNhbWVyYSByaWcgJiBjb250cm9sbGVyc1xuICB2YXIgY2FtZXJhID0gbnVsbCxcbiAgICBjYW1lcmFSaWcgPSBudWxsO1xuXG4gIC8vIGlmIChvcHRpb25zLmFyIHx8IG9wdGlvbnMudnIpIHtcbiAgLy8gICBjYW1lcmFSaWcgPSB3b3JsZFxuICAvLyAgICAgLmNyZWF0ZUVudGl0eSgpXG4gIC8vICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgLy8gICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KTtcbiAgLy8gfVxuXG4gIHtcbiAgICBjYW1lcmEgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYSlcbiAgICAgIC5hZGRDb21wb25lbnQoVXBkYXRlQXNwZWN0T25SZXNpemVUYWcpXG4gICAgICAuYWRkT2JqZWN0M0RDb21wb25lbnQoXG4gICAgICAgIG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgICAgICA5MCxcbiAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgICAwLjEsXG4gICAgICAgICAgMTAwXG4gICAgICAgICksXG4gICAgICAgIHNjZW5lXG4gICAgICApXG4gICAgICAuYWRkQ29tcG9uZW50KEFjdGl2ZSk7XG4gIH1cblxuICBsZXQgcmVuZGVyUGFzcyA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChSZW5kZXJQYXNzLCB7XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd29ybGQsXG4gICAgZW50aXRpZXM6IHtcbiAgICAgIHNjZW5lLFxuICAgICAgY2FtZXJhLFxuICAgICAgY2FtZXJhUmlnLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICByZW5kZXJQYXNzXG4gICAgfVxuICB9O1xufVxuIl0sIm5hbWVzIjpbIlRIUkVFLlZlY3RvcjIiLCJUSFJFRS5WZWN0b3IzIiwiVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwiLCJUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5IiwiVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCIsIlRIUkVFLk1lc2giLCJHTFRGTG9hZGVyVGhyZWUiLCJUSFJFRS5Hcm91cCIsIlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIiwiVEhSRUUuVGV4dHVyZSIsIlRIUkVFLkltYWdlTG9hZGVyIiwiVEhSRUUuV2ViR0xSZW5kZXJlciIsIlRIUkVFLkZvbnRMb2FkZXIiLCJUSFJFRS5UZXh0R2VvbWV0cnkiLCJUSFJFRS5SZXBlYXRXcmFwcGluZyIsIlRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Gb2ciLCJUSFJFRS5Db2xvciIsIlRIUkVFLkFuaW1hdGlvbk1peGVyIiwiVEhSRUUuTG9vcE9uY2UiLCJUSFJFRS5PYmplY3QzRCIsIlRIUkVFLlBvc2l0aW9uYWxBdWRpbyIsIlRIUkVFLkF1ZGlvTGlzdGVuZXIiLCJUSFJFRS5BdWRpb0xvYWRlciIsIlRIUkVFLkNsb2NrIiwiVEhSRUUuU2NlbmUiLCJUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBTyxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztHQUNwQjtDQUNGOztBQ1JNLE1BQU0sU0FBUyxDQUFDO0VBQ3JCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxR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

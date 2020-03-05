import { TagComponent, System, Not, SystemStateComponent, World } from 'ecsy';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, AnimationMixer, LoopOnce, Clock, Scene as Scene$1 } from 'three';
import { GLTFLoader as GLTFLoader$1 } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'troika-3d-text/dist/textmesh-standalone.esm.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'three/examples/jsm/webxr/XRControllerModelFactory.js';

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

class InputState {
  constructor() {
    this.vrcontrollers = new Map();
    this.keyboard = {};
    this.mouse = {};
    this.gamepads = {};
  }

  reset() {}
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

function init(world) {
  world
    .registerSystem(TransformSystem)
    .registerSystem(CameraSystem)
    .registerSystem(MaterialSystem)
    .registerSystem(WebGLRendererSystem, { priority: 1 });
}

function initializeDefault(world = new World(), options) {
  init(world);

  const DEFAULT_OPTIONS = {};

  options = Object.assign({}, DEFAULT_OPTIONS, options);

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

export { Active, Animation, AnimationSystem, Camera, CameraRig, CameraSystem, Draggable, Dragging, Environment, EnvironmentSystem, GLTFLoader, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, InputState, InputSystem, Material, MaterialSystem, Object3D, Parent, ParentObject3D, Play, Position, RenderPass, Rotation, SDFTextSystem, Scale, Scene, Sky, SkyBox, SkyBoxSystem, Stop, Text, TextGeometry, TextGeometrySystem, Transform, TransformSystem, VRController, VRControllerBasicBehaviour, VRControllerSystem, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, init, initializeDefault };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0FuaW1hdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZMb2FkZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYXRlcmlhbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50T2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QbGF5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUG9zaXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9SZW5kZXJQYXNzLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUm90YXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9TY2FsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU3RvcC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UZXh0R2VvbWV0cnkuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UcmFuc2Zvcm0uanMiLCIuLi9zcmMvY29tcG9uZW50cy9WaXNpYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvSW5wdXRTdGF0ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanMiLCIuLi9zcmMvc3lzdGVtcy9NYXRlcmlhbFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dlb21ldHJ5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR0xURkxvYWRlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1NreUJveFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1Zpc2liaWxpdHlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9TREZUZXh0U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0Vudmlyb25tZW50U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVlJDb250cm9sbGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvQW5pbWF0aW9uU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvSW5wdXRTeXN0ZW0uanMiLCIuLi9zcmMvaW5pdGlhbGl6ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQWN0aXZlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQW5pbWF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gICAgdGhpcy5kdXJhdGlvbiA9IC0xO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5hbmltYXRpb25zLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5kdXJhdGlvbiA9IC0xO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2FtZXJhIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5mb3YgPSA0NTtcbiAgICB0aGlzLmFzcGVjdCA9IDE7XG4gICAgdGhpcy5uZWFyID0gMC4xO1xuICAgIHRoaXMuZmFyID0gMTAwMDtcbiAgICB0aGlzLmxheWVycyA9IDA7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUgPSB0cnVlO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYVJpZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVmdEhhbmQgPSBudWxsO1xuICAgIHRoaXMucmlnaHRIYW5kID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEcmFnZ2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgRHJhZ2dpbmcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudCB7XG4gIHJlc2V0KCkge31cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnByZXNldCA9IFwiZGVmYXVsdFwiO1xuICAgIHRoaXMuc2VlZCA9IDE7XG4gICAgdGhpcy5za3lUeXBlID0gXCJhdG1vc3BoZXJlXCI7XG4gICAgdGhpcy5za3lDb2xvciA9IFwiXCI7XG4gICAgdGhpcy5ob3Jpem9uQ29sb3IgPSBcIlwiO1xuICAgIHRoaXMubGlnaHRpbmcgPSBcImRpc3RhbnRcIjtcbiAgICB0aGlzLnNoYWRvdyA9IGZhbHNlO1xuICAgIHRoaXMuc2hhZG93U2l6ZSA9IDEwO1xuICAgIHRoaXMubGlnaHRQb3NpdGlvbiA9IHsgeDogMCwgeTogMSwgejogLTAuMiB9O1xuICAgIHRoaXMuZm9nID0gMDtcblxuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXlBcmVhID0gMTtcblxuICAgIHRoaXMuZ3JvdW5kID0gXCJmbGF0XCI7XG4gICAgdGhpcy5ncm91bmRZU2NhbGUgPSAzO1xuICAgIHRoaXMuZ3JvdW5kVGV4dHVyZSA9IFwibm9uZVwiO1xuICAgIHRoaXMuZ3JvdW5kQ29sb3IgPSBcIiM1NTNlMzVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yMiA9IFwiIzY5NDQzOVwiO1xuXG4gICAgdGhpcy5kcmVzc2luZyA9IFwibm9uZVwiO1xuICAgIHRoaXMuZHJlc3NpbmdBbW91bnQgPSAxMDtcbiAgICB0aGlzLmRyZXNzaW5nQ29sb3IgPSBcIiM3OTU0NDlcIjtcbiAgICB0aGlzLmRyZXNzaW5nU2NhbGUgPSA1O1xuICAgIHRoaXMuZHJlc3NpbmdWYXJpYW5jZSA9IHsgeDogMSwgeTogMSwgejogMSB9O1xuICAgIHRoaXMuZHJlc3NpbmdVbmlmb3JtU2NhbGUgPSB0cnVlO1xuICAgIHRoaXMuZHJlc3NpbmdPblBsYXlBcmVhID0gMDtcblxuICAgIHRoaXMuZ3JpZCA9IFwibm9uZVwiO1xuICAgIHRoaXMuZ3JpZENvbG9yID0gXCIjY2NjXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHZW9tZXRyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnVybCA9IFwiXCI7XG4gICAgdGhpcy5yZWNlaXZlU2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5jYXN0U2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5lbnZNYXBPdmVycmlkZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTW9kZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNvbnN0IFNJREVTID0ge1xuICBmcm9udDogMCxcbiAgYmFjazogMSxcbiAgZG91YmxlOiAyXG59O1xuXG5leHBvcnQgY29uc3QgU0hBREVSUyA9IHtcbiAgc3RhbmRhcmQ6IDAsXG4gIGZsYXQ6IDFcbn07XG5cbmV4cG9ydCBjb25zdCBCTEVORElORyA9IHtcbiAgbm9ybWFsOiAwLFxuICBhZGRpdGl2ZTogMSxcbiAgc3VidHJhY3RpdmU6IDIsXG4gIG11bHRpcGx5OiAzXG59O1xuXG5leHBvcnQgY29uc3QgVkVSVEVYX0NPTE9SUyA9IHtcbiAgbm9uZTogMCxcbiAgZmFjZTogMSxcbiAgdmVydGV4OiAyXG59O1xuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbG9yID0gMHhmZjAwMDA7XG4gICAgdGhpcy5hbHBoYVRlc3QgPSAwO1xuICAgIHRoaXMuZGVwdGhUZXN0ID0gdHJ1ZTtcbiAgICB0aGlzLmRlcHRoV3JpdGUgPSB0cnVlO1xuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm5wb3QgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xuICAgIHRoaXMucmVwZWF0ID0gbmV3IFRIUkVFLlZlY3RvcjIoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvbG9yID0gMHhmZjAwMDA7XG4gICAgdGhpcy5hbHBoYVRlc3QgPSAwO1xuICAgIHRoaXMuZGVwdGhUZXN0ID0gdHJ1ZTtcbiAgICB0aGlzLmRlcHRoV3JpdGUgPSB0cnVlO1xuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm5wb3QgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldC5zZXQoMCwgMCk7XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xuICAgIHRoaXMucmVwZWF0LnNldCgxLCAxKTtcbiAgICB0aGlzLnNoYWRlciA9IFNIQURFUlMuc3RhbmRhcmQ7XG4gICAgdGhpcy5zaWRlID0gU0lERVMuZnJvbnQ7XG4gICAgdGhpcy50cmFuc3BhcmVudCA9IGZhbHNlO1xuICAgIHRoaXMudmVydGV4Q29sb3JzID0gVkVSVEVYX0NPTE9SUy5ub25lO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5ibGVuZGluZyA9IEJMRU5ESU5HLm5vcm1hbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE9iamVjdDNEIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBQYXJlbnRPYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn0iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIFBsYXkgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2NhbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NlbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5Qm94IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBTdG9wIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgVGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGV4dCA9IFwiXCI7XG4gICAgdGhpcy50ZXh0QWxpZ24gPSBcImxlZnRcIjsgLy8gWydsZWZ0JywgJ3JpZ2h0JywgJ2NlbnRlciddXG4gICAgdGhpcy5hbmNob3IgPSBcImNlbnRlclwiOyAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJywgJ2FsaWduJ11cbiAgICB0aGlzLmJhc2VsaW5lID0gXCJjZW50ZXJcIjsgLy8gWyd0b3AnLCAnY2VudGVyJywgJ2JvdHRvbSddXG4gICAgdGhpcy5jb2xvciA9IFwiI0ZGRlwiO1xuICAgIHRoaXMuZm9udCA9IFwiXCI7IC8vXCJodHRwczovL2NvZGUuY2RuLm1vemlsbGEubmV0L2ZvbnRzL3R0Zi9aaWxsYVNsYWItU2VtaUJvbGQudHRmXCI7XG4gICAgdGhpcy5mb250U2l6ZSA9IDAuMjtcbiAgICB0aGlzLmxldHRlclNwYWNpbmcgPSAwO1xuICAgIHRoaXMubGluZUhlaWdodCA9IDA7XG4gICAgdGhpcy5tYXhXaWR0aCA9IEluZmluaXR5O1xuICAgIHRoaXMub3ZlcmZsb3dXcmFwID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnYnJlYWstd29yZCddXG4gICAgdGhpcy53aGl0ZVNwYWNlID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnbm93cmFwJ11cbiAgICB0aGlzLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeSB7XG4gIHJlc2V0KCkge31cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICBjb3B5KHNyYykge1xuICAgIHRoaXMucG9zaXRpb24uY29weShzcmMucG9zaXRpb24pO1xuICAgIHRoaXMucm90YXRpb24uY29weShzcmMucm90YXRpb24pO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBWaXNpYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgSW5wdXRTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudnJjb250cm9sbGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLmtleWJvYXJkID0ge307XG4gICAgdGhpcy5tb3VzZSA9IHt9O1xuICAgIHRoaXMuZ2FtZXBhZHMgPSB7fTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlkID0gMDtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zZWxlY3QgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0c3RhcnQgPSBudWxsO1xuICAgIHRoaXMuc2VsZWN0ZW5kID0gbnVsbDtcblxuICAgIHRoaXMuY29ubmVjdGVkID0gbnVsbDtcblxuICAgIHRoaXMuc3F1ZWV6ZSA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplc3RhcnQgPSBudWxsO1xuICAgIHRoaXMuc3F1ZWV6ZWVuZCA9IG51bGw7XG4gIH1cbn0iLCJleHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudnIgPSBmYWxzZTtcbiAgICB0aGlzLmFyID0gZmFsc2U7XG4gICAgdGhpcy5hbnRpYWxpYXMgPSB0cnVlO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgICB0aGlzLnNoYWRvd01hcCA9IHRydWU7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG5cbi8qXG5leHBvcnQgY29uc3QgV2ViR0xSZW5kZXJlciA9IGNyZWF0ZUNvbXBvbmVudENsYXNzKFxuICB7XG4gICAgdnI6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGFudGlhbGlhczogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogZmFsc2UgfVxuICB9LFxuICBcIldlYkdMUmVuZGVyZXJcIlxuKTtcbiovXG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSwgTm90LCBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBNYXRlcmlhbCxcbiAgT2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5jbGFzcyBNYXRlcmlhbEluc3RhbmNlIGV4dGVuZHMgU3lzdGVtU3RhdGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoKTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMubmV3LnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChNYXRlcmlhbCk7XG4gICAgfSk7XG4gIH1cbn1cblxuTWF0ZXJpYWxTeXN0ZW0ucXVlcmllcyA9IHtcbiAgbmV3OiB7XG4gICAgY29tcG9uZW50czogW01hdGVyaWFsLCBOb3QoTWF0ZXJpYWxJbnN0YW5jZSldXG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBHZW9tZXRyeSxcbiAgT2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG4vKipcbiAqIENyZWF0ZSBhIE1lc2ggYmFzZWQgb24gdGhlIFtHZW9tZXRyeV0gY29tcG9uZW50IGFuZCBhdHRhY2ggaXQgdG8gdGhlIGVudGl0eSB1c2luZyBhIFtPYmplY3QzRF0gY29tcG9uZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gUmVtb3ZlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0UmVtb3ZlZENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIHZhciBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoTWF0ZXJpYWwpKSB7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4qL1xuXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVHJhbnNmb3JtKSkge1xuICAgICAgICB2YXIgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0aW9uKSB7XG4gICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChFbGVtZW50KSAmJiAhZW50aXR5Lmhhc0NvbXBvbmVudChEcmFnZ2FibGUpKSB7XG4gICAgICAvLyAgICAgICAgb2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweDMzMzMzMyk7XG4gICAgICAvLyAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dlb21ldHJ5XSwgLy8gQHRvZG8gVHJhbnNmb3JtOiBBcyBvcHRpb25hbCwgaG93IHRvIGRlZmluZSBpdD9cbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IEdMVEZMb2FkZXIgYXMgR0xURkxvYWRlclRocmVlIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IEdMVEZNb2RlbCB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZNb2RlbC5qc1wiO1xuaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZMb2FkZXIuanNcIjtcblxuLy8gQHRvZG8gVXNlIHBhcmFtZXRlciBhbmQgbG9hZGVyIG1hbmFnZXJcbnZhciBsb2FkZXIgPSBuZXcgR0xURkxvYWRlclRocmVlKCk7IC8vLnNldFBhdGgoXCIvYXNzZXRzL21vZGVscy9cIik7XG5cbmV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURkxvYWRlcik7XG5cbiAgICAgIGxvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGdsdGYgPT4ge1xuICAgICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgICAgY2hpbGQucmVjZWl2ZVNoYWRvdyA9IGNvbXBvbmVudC5yZWNlaXZlU2hhZG93O1xuICAgICAgICAgICAgY2hpbGQuY2FzdFNoYWRvdyA9IGNvbXBvbmVudC5jYXN0U2hhZG93O1xuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmVudk1hcE92ZXJyaWRlKSB7XG4gICAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEdMVEZNb2RlbCwgeyB2YWx1ZTogZ2x0ZiB9KTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LmFwcGVuZCkge1xuICAgICAgICAgIGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5hZGQoZ2x0Zi5zY2VuZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ2x0Zi5zY2VuZSB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29tcG9uZW50Lm9uTG9hZGVkKSB7XG4gICAgICAgICAgY29tcG9uZW50Lm9uTG9hZGVkKGdsdGYuc2NlbmUsIGdsdGYpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNELCB0cnVlKS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5yZW1vdmUob2JqZWN0KTtcbiAgICB9KTtcbiAgfVxufVxuXG5HTFRGTG9hZGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dMVEZMb2FkZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgU2t5Qm94LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuXG4gICAgICBsZXQgc2t5Ym94ID0gZW50aXR5LmdldENvbXBvbmVudChTa3lCb3gpO1xuXG4gICAgICBsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgaWYgKHNreWJveC50eXBlID09PSBcImN1YmVtYXAtc3RlcmVvXCIpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHNreWJveC50ZXh0dXJlVXJsLCAxMik7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgIHNreUJveC5sYXllcnMuc2V0KDEpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94KTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzUiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3hSID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsc1IpO1xuICAgICAgICBza3lCb3hSLmxheWVycy5zZXQoMik7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3hSKTtcblxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBncm91cCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gc2t5Ym94IHR5cGU6IFwiLCBza3lib3gudHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShhdGxhc0ltZ1VybCwgdGlsZXNOdW0pIHtcbiAgbGV0IHRleHR1cmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc051bTsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB9XG5cbiAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcigpO1xuICBsb2FkZXIubG9hZChhdGxhc0ltZ1VybCwgZnVuY3Rpb24oaW1hZ2VPYmopIHtcbiAgICBsZXQgY2FudmFzLCBjb250ZXh0O1xuICAgIGxldCB0aWxlV2lkdGggPSBpbWFnZU9iai5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGlsZVdpZHRoO1xuICAgICAgY2FudmFzLndpZHRoID0gdGlsZVdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIGltYWdlT2JqLFxuICAgICAgICB0aWxlV2lkdGggKiBpLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGhcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlc1tpXS5pbWFnZSA9IGNhbnZhcztcbiAgICAgIHRleHR1cmVzW2ldLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0ZXh0dXJlcztcbn1cblxuU2t5Qm94U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1NreUJveCwgTm90KE9iamVjdDNEKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWaXNpYmxlLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBWaXNpYmlsaXR5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgcHJvY2Vzc1Zpc2liaWxpdHkoZW50aXRpZXMpIHtcbiAgICBlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWUudmlzaWJsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoXG4gICAgICAgIFZpc2libGVcbiAgICAgICkudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkKTtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkKTtcbiAgfVxufVxuXG5WaXNpYmlsaXR5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1Zpc2libGUsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVGV4dE1lc2ggfSBmcm9tIFwidHJvaWthLTNkLXRleHQvZGlzdC90ZXh0bWVzaC1zdGFuZGFsb25lLmVzbS5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QsIFRleHQgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxuY29uc3QgYW5jaG9yTWFwcGluZyA9IHtcbiAgbGVmdDogMCxcbiAgY2VudGVyOiAwLjUsXG4gIHJpZ2h0OiAxXG59O1xuY29uc3QgYmFzZWxpbmVNYXBwaW5nID0ge1xuICB0b3A6IDAsXG4gIGNlbnRlcjogMC41LFxuICBib3R0b206IDFcbn07XG5cbmV4cG9ydCBjbGFzcyBTREZUZXh0U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgdXBkYXRlVGV4dCh0ZXh0TWVzaCwgdGV4dENvbXBvbmVudCkge1xuICAgIHRleHRNZXNoLnRleHQgPSB0ZXh0Q29tcG9uZW50LnRleHQ7XG4gICAgdGV4dE1lc2gudGV4dEFsaWduID0gdGV4dENvbXBvbmVudC50ZXh0QWxpZ247XG4gICAgdGV4dE1lc2guYW5jaG9yWzBdID0gYW5jaG9yTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmFuY2hvcl07XG4gICAgdGV4dE1lc2guYW5jaG9yWzFdID0gYmFzZWxpbmVNYXBwaW5nW3RleHRDb21wb25lbnQuYmFzZWxpbmVdO1xuICAgIHRleHRNZXNoLmNvbG9yID0gdGV4dENvbXBvbmVudC5jb2xvcjtcbiAgICB0ZXh0TWVzaC5mb250ID0gdGV4dENvbXBvbmVudC5mb250O1xuICAgIHRleHRNZXNoLmZvbnRTaXplID0gdGV4dENvbXBvbmVudC5mb250U2l6ZTtcbiAgICB0ZXh0TWVzaC5sZXR0ZXJTcGFjaW5nID0gdGV4dENvbXBvbmVudC5sZXR0ZXJTcGFjaW5nIHx8IDA7XG4gICAgdGV4dE1lc2gubGluZUhlaWdodCA9IHRleHRDb21wb25lbnQubGluZUhlaWdodCB8fCBudWxsO1xuICAgIHRleHRNZXNoLm92ZXJmbG93V3JhcCA9IHRleHRDb21wb25lbnQub3ZlcmZsb3dXcmFwO1xuICAgIHRleHRNZXNoLndoaXRlU3BhY2UgPSB0ZXh0Q29tcG9uZW50LndoaXRlU3BhY2U7XG4gICAgdGV4dE1lc2gubWF4V2lkdGggPSB0ZXh0Q29tcG9uZW50Lm1heFdpZHRoO1xuICAgIHRleHRNZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSB0ZXh0Q29tcG9uZW50Lm9wYWNpdHk7XG4gICAgdGV4dE1lc2guc3luYygpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXM7XG5cbiAgICBlbnRpdGllcy5hZGRlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcblxuICAgICAgY29uc3QgdGV4dE1lc2ggPSBuZXcgVGV4dE1lc2goKTtcbiAgICAgIHRleHRNZXNoLm5hbWUgPSBcInRleHRNZXNoXCI7XG4gICAgICB0ZXh0TWVzaC5hbmNob3IgPSBbMCwgMF07XG4gICAgICB0ZXh0TWVzaC5yZW5kZXJPcmRlciA9IDEwOyAvL2JydXRlLWZvcmNlIGZpeCBmb3IgdWdseSBhbnRpYWxpYXNpbmcsIHNlZSBpc3N1ZSAjNjdcbiAgICAgIHRoaXMudXBkYXRlVGV4dCh0ZXh0TWVzaCwgdGV4dENvbXBvbmVudCk7XG4gICAgICBlLmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogdGV4dE1lc2ggfSk7XG4gICAgfSk7XG5cbiAgICBlbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSBlLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICB2YXIgdGV4dE1lc2ggPSBvYmplY3QzRC5nZXRPYmplY3RCeU5hbWUoXCJ0ZXh0TWVzaFwiKTtcbiAgICAgIHRleHRNZXNoLmRpc3Bvc2UoKTtcbiAgICAgIG9iamVjdDNELnJlbW92ZSh0ZXh0TWVzaCk7XG4gICAgfSk7XG5cbiAgICBlbnRpdGllcy5jaGFuZ2VkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSBlLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBpZiAob2JqZWN0M0QgaW5zdGFuY2VvZiBUZXh0TWVzaCkge1xuICAgICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGUuZ2V0Q29tcG9uZW50KFRleHQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRleHQob2JqZWN0M0QsIHRleHRDb21wb25lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cblNERlRleHRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVGV4dF1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBSZW5kZXJQYXNzLFxuICBDYW1lcmEsXG4gIEFjdGl2ZSxcbiAgV2ViR0xSZW5kZXJlcixcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgVlJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1ZSQnV0dG9uLmpzXCI7XG5pbXBvcnQgeyBBUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvQVJCdXR0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29tcG9uZW50LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVbmluaXRpYWxpemVkIHJlbmRlcmVyc1xuICAgIHRoaXMucXVlcmllcy51bmluaXRpYWxpemVkUmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG5cbiAgICAgIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgICAgYW50aWFsaWFzOiBjb21wb25lbnQuYW50aWFsaWFzXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52ciB8fCBjb21wb25lbnQuYXIpIHtcbiAgICAgICAgcmVuZGVyZXIueHIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoVlJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50LmFyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0LCB7IHZhbHVlOiByZW5kZXJlciB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMuY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgIHZhciByZW5kZXJlciA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wb25lbnQud2lkdGggIT09IHJlbmRlcmVyLndpZHRoIHx8XG4gICAgICAgIGNvbXBvbmVudC5oZWlnaHQgIT09IHJlbmRlcmVyLmhlaWdodFxuICAgICAgKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUoY29tcG9uZW50LndpZHRoLCBjb21wb25lbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8gaW5uZXJXaWR0aC9pbm5lckhlaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJQYXNzZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyUGFzc11cbiAgfSxcbiAgYWN0aXZlQ2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIEFjdGl2ZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBQYXJlbnRPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICBQb3NpdGlvbixcbiAgU2NhbGUsXG4gIFBhcmVudCxcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gSGllcmFyY2h5XG4gICAgbGV0IGFkZGVkID0gdGhpcy5xdWVyaWVzLnBhcmVudC5hZGRlZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gYWRkZWRbaV07XG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0QpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGllcmFyY2h5XG4gICAgdGhpcy5xdWVyaWVzLnBhcmVudE9iamVjdDNELmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50T2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICB9KTtcblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aW9uXG4gICAgbGV0IHBvc2l0aW9ucyA9IHRoaXMucXVlcmllcy5wb3NpdGlvbnM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuYWRkZWRbaV07XG4gICAgICBsZXQgcG9zaXRpb24gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZTtcblxuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHBvc2l0aW9ucy5jaGFuZ2VkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBTY2FsZVxuICAgIGxldCBzY2FsZXMgPSB0aGlzLnF1ZXJpZXMuc2NhbGVzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmFkZGVkW2ldO1xuICAgICAgbGV0IHNjYWxlID0gZW50aXR5LmdldENvbXBvbmVudChTY2FsZSkudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBzY2FsZXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3Quc2NhbGUuY29weShzY2FsZSk7XG4gICAgfVxuICB9XG59XG5cblRyYW5zZm9ybVN5c3RlbS5xdWVyaWVzID0ge1xuICBwYXJlbnRPYmplY3QzRDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnRPYmplY3QzRCwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmFuc2Zvcm1zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNELCBUcmFuc2Zvcm1dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVHJhbnNmb3JtXVxuICAgIH1cbiAgfSxcbiAgcG9zaXRpb25zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNELCBQb3NpdGlvbl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtQb3NpdGlvbl1cbiAgICB9XG4gIH0sXG4gIHNjYWxlczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgU2NhbGVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbU2NhbGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgQ2FtZXJhLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhID0+IHtcbiAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY2FtZXJhLmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgICAgICBjYW1lcmEuZ2V0TXV0YWJsZUNvbXBvbmVudChDYW1lcmEpLmFzcGVjdCA9XG4gICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5jYW1lcmFzLmNoYW5nZWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gY2hhbmdlZFtpXTtcblxuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgIGxldCBjYW1lcmEzZCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgaWYgKGNhbWVyYTNkLmFzcGVjdCAhPT0gY29tcG9uZW50LmFzcGVjdCkge1xuICAgICAgICBjYW1lcmEzZC5hc3BlY3QgPSBjb21wb25lbnQuYXNwZWN0O1xuICAgICAgICBjYW1lcmEzZC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICB9XG4gICAgICAvLyBAdG9kbyBEbyBpdCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHZhbHVlc1xuICAgIH1cblxuICAgIHRoaXMucXVlcmllcy5jYW1lcmFzVW5pbml0aWFsaXplZC5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG5cbiAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgIGNvbXBvbmVudC5mb3YsXG4gICAgICAgIGNvbXBvbmVudC5hc3BlY3QsXG4gICAgICAgIGNvbXBvbmVudC5uZWFyLFxuICAgICAgICBjb21wb25lbnQuZmFyXG4gICAgICApO1xuXG4gICAgICBjYW1lcmEubGF5ZXJzLmVuYWJsZShjb21wb25lbnQubGF5ZXJzKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogY2FtZXJhIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkNhbWVyYVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzVW5pbml0aWFsaXplZDoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE5vdChPYmplY3QzRCldXG4gIH0sXG4gIGNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbQ2FtZXJhXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0RcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSB9IGZyb20gXCIuLi9jb21wb25lbnRzL1RleHRHZW9tZXRyeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgdGhpcy5mb250ID0gbnVsbDtcbiAgICAvKlxuICAgIGxvYWRlci5sb2FkKFwiL2Fzc2V0cy9mb250cy9oZWx2ZXRpa2VyX3JlZ3VsYXIudHlwZWZhY2UuanNvblwiLCBmb250ID0+IHtcbiAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgICAqL1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgfSk7XG5cbiAgICB2YXIgYWRkZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG4gICAgYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbG9yID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgY29sb3IgPSAweGZmZmZmZjtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBtZXNoIH0pO1xuICAgIH0pO1xuICB9XG59XG5cblRleHRHZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0R2VvbWV0cnldLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50LCBTY2VuZSwgT2JqZWN0M0QsIEVudmlyb25tZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIEVudmlyb25tZW50U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW52aXJvbm1lbnRzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIC8vIHN0YWdlIGdyb3VuZCBkaWFtZXRlciAoYW5kIHNreSByYWRpdXMpXG4gICAgICB2YXIgU1RBR0VfU0laRSA9IDIwMDtcblxuICAgICAgLy8gY3JlYXRlIGdyb3VuZFxuICAgICAgLy8gdXBkYXRlIGdyb3VuZCwgcGxheWFyZWEgYW5kIGdyaWQgdGV4dHVyZXMuXG4gICAgICB2YXIgZ3JvdW5kUmVzb2x1dGlvbiA9IDIwNDg7XG4gICAgICB2YXIgdGV4TWV0ZXJzID0gMjA7IC8vIGdyb3VuZCB0ZXh0dXJlIG9mIDIwIHggMjAgbWV0ZXJzXG4gICAgICB2YXIgdGV4UmVwZWF0ID0gU1RBR0VfU0laRSAvIHRleE1ldGVycztcblxuICAgICAgdmFyIHJlc29sdXRpb24gPSA2NDsgLy8gbnVtYmVyIG9mIGRpdmlzaW9ucyBvZiB0aGUgZ3JvdW5kIG1lc2hcblxuICAgICAgdmFyIGdyb3VuZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBncm91bmRDYW52YXMud2lkdGggPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kQ2FudmFzLmhlaWdodCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICB2YXIgZ3JvdW5kVGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGdyb3VuZENhbnZhcyk7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLnJlcGVhdC5zZXQodGV4UmVwZWF0LCB0ZXhSZXBlYXQpO1xuXG4gICAgICB0aGlzLmVudmlyb25tZW50RGF0YSA9IHtcbiAgICAgICAgZ3JvdW5kQ29sb3I6IFwiIzQ1NDU0NVwiLFxuICAgICAgICBncm91bmRDb2xvcjI6IFwiIzVkNWQ1ZFwiXG4gICAgICB9O1xuXG4gICAgICB2YXIgZ3JvdW5kY3R4ID0gZ3JvdW5kQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgdmFyIHNpemUgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KDAsIDAsIHNpemUsIHNpemUpO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yMjtcbiAgICAgIHZhciBudW0gPSBNYXRoLmZsb29yKHRleE1ldGVycyAvIDIpO1xuICAgICAgdmFyIHN0ZXAgPSBzaXplIC8gKHRleE1ldGVycyAvIDIpOyAvLyAyIG1ldGVycyA9PSA8c3RlcD4gcGl4ZWxzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bSArIDE7IGkgKz0gMikge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bSArIDE7IGorKykge1xuICAgICAgICAgIGdyb3VuZGN0eC5maWxsUmVjdChcbiAgICAgICAgICAgIE1hdGguZmxvb3IoKGkgKyAoaiAlIDIpKSAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihqICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ3JvdW5kVGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgIHZhciBncm91bmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgbWFwOiBncm91bmRUZXh0dXJlXG4gICAgICB9KTtcblxuICAgICAgbGV0IHNjZW5lID0gZW50aXR5LmdldENvbXBvbmVudChTY2VuZSkudmFsdWUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIC8vc2NlbmUuYWRkKG1lc2gpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICBTVEFHRV9TSVpFICsgMixcbiAgICAgICAgcmVzb2x1dGlvbiAtIDEsXG4gICAgICAgIHJlc29sdXRpb24gLSAxXG4gICAgICApO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIGdyb3VuZE1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogd2luZG93LmVudGl0eVNjZW5lIH0pO1xuXG4gICAgICBjb25zdCBjb2xvciA9IDB4MzMzMzMzO1xuICAgICAgY29uc3QgbmVhciA9IDIwO1xuICAgICAgY29uc3QgZmFyID0gMTAwO1xuICAgICAgc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZyhjb2xvciwgbmVhciwgZmFyKTtcbiAgICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoY29sb3IpO1xuICAgIH0pO1xuICB9XG59XG5cbkVudmlyb25tZW50U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudmlyb25tZW50czoge1xuICAgIGNvbXBvbmVudHM6IFtTY2VuZSwgRW52aXJvbm1lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyQ29udGV4dCxcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1hSQ29udHJvbGxlck1vZGVsRmFjdG9yeS5qc1wiO1xuXG52YXIgY29udHJvbGxlck1vZGVsRmFjdG9yeSA9IG5ldyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkoKTtcblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVyID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVyQ29udGV4dC5yZXN1bHRzWzBdLmdldENvbXBvbmVudChcbiAgICAgIFdlYkdMUmVuZGVyZXJDb250ZXh0XG4gICAgKS52YWx1ZTtcblxuICAgIHRoaXMucXVlcmllcy5jb250cm9sbGVycy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29udHJvbGxlcklkID0gZW50aXR5LmdldENvbXBvbmVudChWUkNvbnRyb2xsZXIpLmlkO1xuICAgICAgdmFyIGNvbnRyb2xsZXIgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyLm5hbWUgPSBcImNvbnRyb2xsZXJcIjtcblxuICAgICAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlcik7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBncm91cCB9KTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpKSB7XG4gICAgICAgIHZhciBiZWhhdmlvdXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKTtcbiAgICAgICAgT2JqZWN0LmtleXMoYmVoYXZpb3VyKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKGJlaGF2aW91cltldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBiZWhhdmlvdXJbZXZlbnROYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB3aWxsIGF1dG9tYXRpY2FsbHkgZmV0Y2ggY29udHJvbGxlciBtb2RlbHNcbiAgICAgIC8vIHRoYXQgbWF0Y2ggd2hhdCB0aGUgdXNlciBpcyBob2xkaW5nIGFzIGNsb3NlbHkgYXMgcG9zc2libGUuIFRoZSBtb2RlbHNcbiAgICAgIC8vIHNob3VsZCBiZSBhdHRhY2hlZCB0byB0aGUgb2JqZWN0IHJldHVybmVkIGZyb20gZ2V0Q29udHJvbGxlckdyaXAgaW5cbiAgICAgIC8vIG9yZGVyIHRvIG1hdGNoIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgaGVsZCBkZXZpY2UuXG4gICAgICBsZXQgY29udHJvbGxlckdyaXAgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyR3JpcChjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlckdyaXAuYWRkKFxuICAgICAgICBjb250cm9sbGVyTW9kZWxGYWN0b3J5LmNyZWF0ZUNvbnRyb2xsZXJNb2RlbChjb250cm9sbGVyR3JpcClcbiAgICAgICk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlckdyaXApO1xuICAgICAgLypcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKFxuICAgICAgICBcInBvc2l0aW9uXCIsXG4gICAgICAgIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKFswLCAwLCAwLCAwLCAwLCAtMV0sIDMpXG4gICAgICApO1xuXG4gICAgICB2YXIgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5KTtcbiAgICAgIGxpbmUubmFtZSA9IFwibGluZVwiO1xuICAgICAgbGluZS5zY2FsZS56ID0gNTtcbiAgICAgIGdyb3VwLmFkZChsaW5lKTtcblxuICAgICAgbGV0IGdlb21ldHJ5MiA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgwLjEsIDAuMSwgMC4xKTtcbiAgICAgIGxldCBtYXRlcmlhbDIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMGZmMDAgfSk7XG4gICAgICBsZXQgY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5MiwgbWF0ZXJpYWwyKTtcbiAgICAgIGdyb3VwLm5hbWUgPSBcIlZSQ29udHJvbGxlclwiO1xuICAgICAgZ3JvdXAuYWRkKGN1YmUpO1xuKi9cbiAgICB9KTtcblxuICAgIC8vIHRoaXMuY2xlYW5JbnRlcnNlY3RlZCgpO1xuICB9XG59XG5cblZSQ29udHJvbGxlclN5c3RlbS5xdWVyaWVzID0ge1xuICBjb250cm9sbGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtWUkNvbnRyb2xsZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICAgIC8vY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9LFxuICByZW5kZXJlckNvbnRleHQ6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIG1hbmRhdG9yeTogdHJ1ZVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgUGxheSwgU3RvcCwgR0xURk1vZGVsLCBBbmltYXRpb24gfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5jbGFzcyBBbmltYXRpb25NaXhlckNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgcmVzZXQoKSB7fVxufVxuXG5jbGFzcyBBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hbmltYXRpb25zID0gW107XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgQW5pbWF0aW9uU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZShkZWx0YSkge1xuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgZ2x0ZiA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURk1vZGVsKS52YWx1ZTtcbiAgICAgIGxldCBtaXhlciA9IG5ldyBUSFJFRS5BbmltYXRpb25NaXhlcihnbHRmLnNjZW5lKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoQW5pbWF0aW9uTWl4ZXJDb21wb25lbnQsIHtcbiAgICAgICAgdmFsdWU6IG1peGVyXG4gICAgICB9KTtcblxuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBbXTtcbiAgICAgIGdsdGYuYW5pbWF0aW9ucy5mb3JFYWNoKGFuaW1hdGlvbkNsaXAgPT4ge1xuICAgICAgICBjb25zdCBhY3Rpb24gPSBtaXhlci5jbGlwQWN0aW9uKGFuaW1hdGlvbkNsaXAsIGdsdGYuc2NlbmUpO1xuICAgICAgICBhY3Rpb24ubG9vcCA9IFRIUkVFLkxvb3BPbmNlO1xuICAgICAgICBhbmltYXRpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgIH0pO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIHtcbiAgICAgICAgYW5pbWF0aW9uczogYW5pbWF0aW9ucyxcbiAgICAgICAgZHVyYXRpb246IGVudGl0eS5nZXRDb21wb25lbnQoQW5pbWF0aW9uKS5kdXJhdGlvblxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMubWl4ZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25NaXhlckNvbXBvbmVudCkudmFsdWUudXBkYXRlKGRlbHRhKTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5wbGF5Q2xpcHMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChBbmltYXRpb25BY3Rpb25zQ29tcG9uZW50KTtcbiAgICAgIGNvbXBvbmVudC5hbmltYXRpb25zLmZvckVhY2goYWN0aW9uQ2xpcCA9PiB7XG4gICAgICAgIGlmIChjb21wb25lbnQuZHVyYXRpb24gIT09IC0xKSB7XG4gICAgICAgICAgYWN0aW9uQ2xpcC5zZXREdXJhdGlvbihjb21wb25lbnQuZHVyYXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgYWN0aW9uQ2xpcC5jbGFtcFdoZW5GaW5pc2hlZCA9IHRydWU7XG4gICAgICAgIGFjdGlvbkNsaXAucmVzZXQoKTtcbiAgICAgICAgYWN0aW9uQ2xpcC5wbGF5KCk7XG4gICAgICB9KTtcbiAgICAgIGVudGl0eS5yZW1vdmVDb21wb25lbnQoUGxheSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuc3RvcENsaXBzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGFuaW1hdGlvbnMgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEFuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQpXG4gICAgICAgIC5hbmltYXRpb25zO1xuICAgICAgYW5pbWF0aW9ucy5mb3JFYWNoKGFjdGlvbkNsaXAgPT4ge1xuICAgICAgICBhY3Rpb25DbGlwLnJlc2V0KCk7XG4gICAgICAgIGFjdGlvbkNsaXAuc3RvcCgpO1xuICAgICAgfSk7XG4gICAgICBlbnRpdHkucmVtb3ZlQ29tcG9uZW50KFN0b3ApO1xuICAgIH0pO1xuICB9XG59XG5cbkFuaW1hdGlvblN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtBbmltYXRpb24sIEdMVEZNb2RlbF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgbWl4ZXJzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbk1peGVyQ29tcG9uZW50XVxuICB9LFxuICBwbGF5Q2xpcHM6IHtcbiAgICBjb21wb25lbnRzOiBbQW5pbWF0aW9uQWN0aW9uc0NvbXBvbmVudCwgUGxheV1cbiAgfSxcbiAgc3RvcENsaXBzOiB7XG4gICAgY29tcG9uZW50czogW0FuaW1hdGlvbkFjdGlvbnNDb21wb25lbnQsIFN0b3BdXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgSW5wdXRTdGF0ZVxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgSW5wdXRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIGxldCBlbnRpdHkgPSB0aGlzLndvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChJbnB1dFN0YXRlKTtcbiAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChJbnB1dFN0YXRlKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVlJDb250cm9sbGVycygpO1xuICAgIC8vIHRoaXMucHJvY2Vzc0tleWJvYXJkKCk7XG4gICAgLy8gdGhpcy5wcm9jZXNzTW91c2UoKTtcbiAgICAvLyB0aGlzLnByb2Nlc3NHYW1lcGFkcygpO1xuICB9XG5cbiAgcHJvY2Vzc1ZSQ29udHJvbGxlcnMoKSB7XG4gICAgLy8gUHJvY2VzcyByZWNlbnRseSBhZGRlZCBjb250cm9sbGVyc1xuICAgIHRoaXMucXVlcmllcy52cmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsIHtcbiAgICAgICAgc2VsZWN0c3RhcnQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICBsZXQgc3RhdGUgPSB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5nZXQoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICAgIHNlbGVjdGVuZDogZXZlbnQgPT4ge1xuICAgICAgICAgIGxldCBzdGF0ZSA9IHRoaXMuaW5wdXRTdGF0ZUNvbXBvbmVudC52cmNvbnRyb2xsZXJzLmdldChldmVudC50YXJnZXQpO1xuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgc3RhdGUucHJldlNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgY29ubmVjdGVkOiBldmVudCA9PiB7XG4gICAgICAgICAgdGhpcy5pbnB1dFN0YXRlQ29tcG9uZW50LnZyY29udHJvbGxlcnMuc2V0KGV2ZW50LnRhcmdldCwge30pO1xuICAgICAgICB9LFxuICAgICAgICBkaXNjb25uZWN0ZWQ6IGV2ZW50ID0+IHtcbiAgICAgICAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5kZWxldGUoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVcGRhdGUgc3RhdGVcbiAgICB0aGlzLmlucHV0U3RhdGVDb21wb25lbnQudnJjb250cm9sbGVycy5mb3JFYWNoKHN0YXRlID0+IHtcbiAgICAgIHN0YXRlLnNlbGVjdFN0YXJ0ID0gc3RhdGUuc2VsZWN0ZWQgJiYgIXN0YXRlLnByZXZTZWxlY3RlZDtcbiAgICAgIHN0YXRlLnNlbGVjdEVuZCA9ICFzdGF0ZS5zZWxlY3RlZCAmJiBzdGF0ZS5wcmV2U2VsZWN0ZWQ7XG4gICAgICBzdGF0ZS5wcmV2U2VsZWN0ZWQgPSBzdGF0ZS5zZWxlY3RlZDtcbiAgICB9KTtcbiAgfVxufVxuXG5JbnB1dFN5c3RlbS5xdWVyaWVzID0ge1xuICB2cmNvbnRyb2xsZXJzOiB7XG4gICAgY29tcG9uZW50czogW1ZSQ29udHJvbGxlcl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIEVDU1kgZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1TeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE1hdGVyaWFsU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9NYXRlcmlhbFN5c3RlbS5qc1wiO1xuXG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IENhbWVyYVJpZyB9IGZyb20gXCIuL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzXCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL1BhcmVudC5qc1wiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIEFjdGl2ZSxcbiAgUmVuZGVyUGFzcyxcbiAgVHJhbnNmb3JtLFxuICBDYW1lcmFcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCh3b3JsZCkge1xuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShUcmFuc2Zvcm1TeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKENhbWVyYVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oTWF0ZXJpYWxTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFdlYkdMUmVuZGVyZXJTeXN0ZW0sIHsgcHJpb3JpdHk6IDEgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplRGVmYXVsdCh3b3JsZCA9IG5ldyBFQ1NZLldvcmxkKCksIG9wdGlvbnMpIHtcbiAgaW5pdCh3b3JsZCk7XG5cbiAgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge307XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgbGV0IGFuaW1hdGlvbkxvb3AgPSBvcHRpb25zLmFuaW1hdGlvbkxvb3A7XG4gIGlmICghYW5pbWF0aW9uTG9vcCkge1xuICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgYW5pbWF0aW9uTG9vcCA9ICgpID0+IHtcbiAgICAgIHdvcmxkLmV4ZWN1dGUoY2xvY2suZ2V0RGVsdGEoKSwgY2xvY2suZWxhcHNlZFRpbWUpO1xuICAgIH07XG4gIH1cblxuICBsZXQgc2NlbmUgPSB3b3JsZFxuICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgIC5hZGRDb21wb25lbnQoU2NlbmUpXG4gICAgLmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogbmV3IFRIUkVFLlNjZW5lKCkgfSk7XG5cbiAgbGV0IHJlbmRlcmVyID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIsIHtcbiAgICBhcjogb3B0aW9ucy5hcixcbiAgICB2cjogb3B0aW9ucy52cixcbiAgICBhbmltYXRpb25Mb29wOiBhbmltYXRpb25Mb29wXG4gIH0pO1xuXG4gIC8vIGNhbWVyYSByaWcgJiBjb250cm9sbGVyc1xuICB2YXIgY2FtZXJhID0gbnVsbCxcbiAgICBjYW1lcmFSaWcgPSBudWxsO1xuXG4gIGlmIChvcHRpb25zLmFyIHx8IG9wdGlvbnMudnIpIHtcbiAgICBjYW1lcmFSaWcgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KTtcbiAgfVxuXG4gIHtcbiAgICBjYW1lcmEgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYSwge1xuICAgICAgICBmb3Y6IDkwLFxuICAgICAgICBhc3BlY3Q6IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICBuZWFyOiAwLjEsXG4gICAgICAgIGZhcjogMTAwLFxuICAgICAgICBsYXllcnM6IDEsXG4gICAgICAgIGhhbmRsZVJlc2l6ZTogdHJ1ZVxuICAgICAgfSlcbiAgICAgIC5hZGRDb21wb25lbnQoVHJhbnNmb3JtKVxuICAgICAgLmFkZENvbXBvbmVudChBY3RpdmUpO1xuICB9XG5cbiAgbGV0IHJlbmRlclBhc3MgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoUmVuZGVyUGFzcywge1xuICAgIHNjZW5lOiBzY2VuZSxcbiAgICBjYW1lcmE6IGNhbWVyYVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIGNhbWVyYVJpZyxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgcmVuZGVyUGFzc1xuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJUSFJFRS5WZWN0b3IyIiwiVEhSRUUuVmVjdG9yMyIsIlRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsIiwiVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwiLCJUSFJFRS5NZXNoIiwiR0xURkxvYWRlclRocmVlIiwiVEhSRUUuR3JvdXAiLCJUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCIsIlRIUkVFLlRleHR1cmUiLCJUSFJFRS5JbWFnZUxvYWRlciIsIlRIUkVFLldlYkdMUmVuZGVyZXIiLCJUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSIsIlRIUkVFLkZvbnRMb2FkZXIiLCJUSFJFRS5UZXh0R2VvbWV0cnkiLCJUSFJFRS5SZXBlYXRXcmFwcGluZyIsIlRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Gb2ciLCJUSFJFRS5Db2xvciIsIlRIUkVFLkFuaW1hdGlvbk1peGVyIiwiVEhSRUUuTG9vcE9uY2UiLCJFQ1NZLldvcmxkIiwiVEhSRUUuQ2xvY2siLCJUSFJFRS5TY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBTyxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztHQUNwQjtDQUNGOztBQ1JNLE1BQU0sU0FBUyxDQUFDO0VBQ3JCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxVQUFVLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDcEI7O0VBRUQsS0FBSyxHQUFHO0lBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDcEI7Q0FDRjs7QUNWTSxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2hCLElBQUksQ0FB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

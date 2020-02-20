import { TagComponent, System, Not, SystemStateComponent, World } from 'ecsy';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, Clock, Scene as Scene$1 } from 'three';
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

class GLTFModel {
  constructor() {
    this.reset();
  }

  reset() {}
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

class Position {
  constructor() {
    this.value = new Vector3();
  }

  reset() {
    this.value.set(0, 0, 0);
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

class Text {
  constructor() {
    this.text = "";
    this.textAlign = "left"; // ['left', 'right', 'center']
    this.anchor = "center"; // ['left', 'right', 'center', 'align']
    this.baseline = "center"; // ['top', 'center', 'bottom']
    this.color = "#FFF";
    this.font = "https://code.cdn.mozilla.net/fonts/ttf/ZillaSlab-SemiBold.ttf";
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
var loader = new GLTFLoader$1().setPath("/assets/");

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
        entity.addComponent(Object3D, { value: gltf.scene });
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
      textMesh.renderOrder = 1; //brute-force fix for ugly antialiasing, see issue #67
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
    loader.load("/assets/fonts/helvetiker_regular.typeface.json", font => {
      this.font = font;
      this.initialized = true;
    });
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

export { Active, Camera, CameraRig, CameraSystem, Draggable, Dragging, Environment, EnvironmentSystem, GLTFLoader, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, Material, MaterialSystem, Object3D, Parent, ParentObject3D, Position, RenderPass, Rotation, SDFTextSystem, Scale, Scene, Sky, SkyBox, SkyBoxSystem, Text, TextGeometry, TextGeometrySystem, Transform, TransformSystem, VRController, VRControllerBasicBehaviour, VRControllerSystem, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, init, initializeDefault };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZMb2FkZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYXRlcmlhbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50T2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjYWxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmVuZGVyUGFzcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdGF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2NlbmUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3kuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvY29tcG9uZW50cy9UZXh0R2VvbWV0cnkuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UcmFuc2Zvcm0uanMiLCIuLi9zcmMvY29tcG9uZW50cy9WaXNpYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanMiLCIuLi9zcmMvc3lzdGVtcy9NYXRlcmlhbFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dlb21ldHJ5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR0xURkxvYWRlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1NreUJveFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1Zpc2liaWxpdHlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9TREZUZXh0U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0Vudmlyb25tZW50U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVlJDb250cm9sbGVyU3lzdGVtLmpzIiwiLi4vc3JjL2luaXRpYWxpemUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZm92ID0gNDU7XG4gICAgdGhpcy5hc3BlY3QgPSAxO1xuICAgIHRoaXMubmVhciA9IDAuMTtcbiAgICB0aGlzLmZhciA9IDEwMDA7XG4gICAgdGhpcy5sYXllcnMgPSAwO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmFSaWcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxlZnRIYW5kID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRHJhZ2dhYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIERyYWdnaW5nIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgRW52aXJvbm1lbnQge1xuICByZXNldCgpIHt9XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5wcmVzZXQgPSBcImRlZmF1bHRcIjtcbiAgICB0aGlzLnNlZWQgPSAxO1xuICAgIHRoaXMuc2t5VHlwZSA9IFwiYXRtb3NwaGVyZVwiO1xuICAgIHRoaXMuc2t5Q29sb3IgPSBcIlwiO1xuICAgIHRoaXMuaG9yaXpvbkNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmxpZ2h0aW5nID0gXCJkaXN0YW50XCI7XG4gICAgdGhpcy5zaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLnNoYWRvd1NpemUgPSAxMDtcbiAgICB0aGlzLmxpZ2h0UG9zaXRpb24gPSB7IHg6IDAsIHk6IDEsIHo6IC0wLjIgfTtcbiAgICB0aGlzLmZvZyA9IDA7XG5cbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5QXJlYSA9IDE7XG5cbiAgICB0aGlzLmdyb3VuZCA9IFwiZmxhdFwiO1xuICAgIHRoaXMuZ3JvdW5kWVNjYWxlID0gMztcbiAgICB0aGlzLmdyb3VuZFRleHR1cmUgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yID0gXCIjNTUzZTM1XCI7XG4gICAgdGhpcy5ncm91bmRDb2xvcjIgPSBcIiM2OTQ0MzlcIjtcblxuICAgIHRoaXMuZHJlc3NpbmcgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmRyZXNzaW5nQW1vdW50ID0gMTA7XG4gICAgdGhpcy5kcmVzc2luZ0NvbG9yID0gXCIjNzk1NDQ5XCI7XG4gICAgdGhpcy5kcmVzc2luZ1NjYWxlID0gNTtcbiAgICB0aGlzLmRyZXNzaW5nVmFyaWFuY2UgPSB7IHg6IDEsIHk6IDEsIHo6IDEgfTtcbiAgICB0aGlzLmRyZXNzaW5nVW5pZm9ybVNjYWxlID0gdHJ1ZTtcbiAgICB0aGlzLmRyZXNzaW5nT25QbGF5QXJlYSA9IDA7XG5cbiAgICB0aGlzLmdyaWQgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyaWRDb2xvciA9IFwiI2NjY1wiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTW9kZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgR0xURkxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudXJsID0gXCJcIjtcbiAgICB0aGlzLnJlY2VpdmVTaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLmNhc3RTaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLmVudk1hcE92ZXJyaWRlID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjb25zdCBTSURFUyA9IHtcbiAgZnJvbnQ6IDAsXG4gIGJhY2s6IDEsXG4gIGRvdWJsZTogMlxufTtcblxuZXhwb3J0IGNvbnN0IFNIQURFUlMgPSB7XG4gIHN0YW5kYXJkOiAwLFxuICBmbGF0OiAxXG59O1xuXG5leHBvcnQgY29uc3QgQkxFTkRJTkcgPSB7XG4gIG5vcm1hbDogMCxcbiAgYWRkaXRpdmU6IDEsXG4gIHN1YnRyYWN0aXZlOiAyLFxuICBtdWx0aXBseTogM1xufTtcblxuZXhwb3J0IGNvbnN0IFZFUlRFWF9DT0xPUlMgPSB7XG4gIG5vbmU6IDAsXG4gIGZhY2U6IDEsXG4gIHZlcnRleDogMlxufTtcblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdCA9IG5ldyBUSFJFRS5WZWN0b3IyKDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQuc2V0KDAsIDApO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdC5zZXQoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBPYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBQYXJlbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50T2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59IiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZS5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2NhbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3kge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3lCb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5jb3B5KHNyYy5wb3NpdGlvbik7XG4gICAgdGhpcy5yb3RhdGlvbi5jb3B5KHNyYy5yb3RhdGlvbik7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpc2libGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgICB0aGlzLnRleHRBbGlnbiA9IFwibGVmdFwiOyAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ11cbiAgICB0aGlzLmFuY2hvciA9IFwiY2VudGVyXCI7IC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICAgIHRoaXMuYmFzZWxpbmUgPSBcImNlbnRlclwiOyAvLyBbJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJ11cbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgdGhpcy5mb250ID0gXCJodHRwczovL2NvZGUuY2RuLm1vemlsbGEubmV0L2ZvbnRzL3R0Zi9aaWxsYVNsYWItU2VtaUJvbGQudHRmXCI7XG4gICAgdGhpcy5mb250U2l6ZSA9IDAuMjtcbiAgICB0aGlzLmxldHRlclNwYWNpbmcgPSAwO1xuICAgIHRoaXMubGluZUhlaWdodCA9IDA7XG4gICAgdGhpcy5tYXhXaWR0aCA9IEluZmluaXR5O1xuICAgIHRoaXMub3ZlcmZsb3dXcmFwID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnYnJlYWstd29yZCddXG4gICAgdGhpcy53aGl0ZVNwYWNlID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnbm93cmFwJ11cbiAgICB0aGlzLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNlbGVjdCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RlbmQgPSBudWxsO1xuXG4gICAgdGhpcy5jb25uZWN0ZWQgPSBudWxsO1xuXG4gICAgdGhpcy5zcXVlZXplID0gbnVsbDtcbiAgICB0aGlzLnNxdWVlemVzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplZW5kID0gbnVsbDtcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52ciA9IGZhbHNlO1xuICAgIHRoaXMuYXIgPSBmYWxzZTtcbiAgICB0aGlzLmFudGlhbGlhcyA9IHRydWU7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUgPSB0cnVlO1xuICAgIHRoaXMuc2hhZG93TWFwID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cblxuLypcbmV4cG9ydCBjb25zdCBXZWJHTFJlbmRlcmVyID0gY3JlYXRlQ29tcG9uZW50Q2xhc3MoXG4gIHtcbiAgICB2cjogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIHNoYWRvd01hcDogeyBkZWZhdWx0OiBmYWxzZSB9XG4gIH0sXG4gIFwiV2ViR0xSZW5kZXJlclwiXG4pO1xuKi9cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtLCBOb3QsIFN5c3RlbVN0YXRlQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIE1hdGVyaWFsLFxuICBPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmNsYXNzIE1hdGVyaWFsSW5zdGFuY2UgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy52YWx1ZSA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5uZXcucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE1hdGVyaWFsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5NYXRlcmlhbFN5c3RlbS5xdWVyaWVzID0ge1xuICBuZXc6IHtcbiAgICBjb21wb25lbnRzOiBbTWF0ZXJpYWwsIE5vdChNYXRlcmlhbEluc3RhbmNlKV1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIEdlb21ldHJ5LFxuICBPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbi8qKlxuICogQ3JlYXRlIGEgTWVzaCBiYXNlZCBvbiB0aGUgW0dlb21ldHJ5XSBjb21wb25lbnQgYW5kIGF0dGFjaCBpdCB0byB0aGUgZW50aXR5IHVzaW5nIGEgW09iamVjdDNEXSBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBSZW1vdmVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5yZW1vdmUob2JqZWN0KTtcbiAgICB9KTtcblxuICAgIC8vIEFkZGVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdlb21ldHJ5KTtcblxuICAgICAgdmFyIGdlb21ldHJ5O1xuICAgICAgc3dpdGNoIChjb21wb25lbnQucHJpbWl0aXZlKSB7XG4gICAgICAgIGNhc2UgXCJ0b3J1c1wiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpdXMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJlLFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaWFsU2VnbWVudHMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJ1bGFyU2VnbWVudHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3BoZXJlXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeShjb21wb25lbnQucmFkaXVzLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LndpZHRoLFxuICAgICAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0LFxuICAgICAgICAgICAgICBjb21wb25lbnQuZGVwdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPVxuICAgICAgICBjb21wb25lbnQucHJpbWl0aXZlID09PSBcInRvcnVzXCIgPyAweDk5OTkwMCA6IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChNYXRlcmlhbCkpIHtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiovXG5cbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChUcmFuc2Zvcm0pKSB7XG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICAgIGlmICh0cmFuc2Zvcm0ucm90YXRpb24pIHtcbiAgICAgICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KEVsZW1lbnQpICYmICFlbnRpdHkuaGFzQ29tcG9uZW50KERyYWdnYWJsZSkpIHtcbiAgICAgIC8vICAgICAgICBvYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0KDB4MzMzMzMzKTtcbiAgICAgIC8vICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuR2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR2VvbWV0cnldLCAvLyBAdG9kbyBUcmFuc2Zvcm06IEFzIG9wdGlvbmFsLCBob3cgdG8gZGVmaW5lIGl0P1xuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgR0xURkxvYWRlciBhcyBHTFRGTG9hZGVyVGhyZWUgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvR0xURkxvYWRlci5qc1wiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL1BhcmVudC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgR0xURk1vZGVsIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvR0xURk1vZGVsLmpzXCI7XG5pbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvR0xURkxvYWRlci5qc1wiO1xuXG4vLyBAdG9kbyBVc2UgcGFyYW1ldGVyIGFuZCBsb2FkZXIgbWFuYWdlclxudmFyIGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyVGhyZWUoKS5zZXRQYXRoKFwiL2Fzc2V0cy9cIik7XG5cbmV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURkxvYWRlcik7XG5cbiAgICAgIGxvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGdsdGYgPT4ge1xuICAgICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgICAgY2hpbGQucmVjZWl2ZVNoYWRvdyA9IGNvbXBvbmVudC5yZWNlaXZlU2hhZG93O1xuICAgICAgICAgICAgY2hpbGQuY2FzdFNoYWRvdyA9IGNvbXBvbmVudC5jYXN0U2hhZG93O1xuXG4gICAgICAgICAgICBpZiAoY29tcG9uZW50LmVudk1hcE92ZXJyaWRlKSB7XG4gICAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KEdMVEZNb2RlbCwgeyB2YWx1ZTogZ2x0ZiB9KTtcbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ2x0Zi5zY2VuZSB9KTtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5vbkxvYWRlZCkge1xuICAgICAgICAgIGNvbXBvbmVudC5vbkxvYWRlZChnbHRmLnNjZW5lLCBnbHRmKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCwgdHJ1ZSkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn1cblxuR0xURkxvYWRlclN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFNreUJveCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBTa3lCb3hTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgbGV0IHNreWJveCA9IGVudGl0eS5nZXRDb21wb25lbnQoU2t5Qm94KTtcblxuICAgICAgbGV0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMTAwLCAxMDAsIDEwMCk7XG4gICAgICBnZW9tZXRyeS5zY2FsZSgxLCAxLCAtMSk7XG5cbiAgICAgIGlmIChza3lib3gudHlwZSA9PT0gXCJjdWJlbWFwLXN0ZXJlb1wiKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShza3lib3gudGV4dHVyZVVybCwgMTIpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFscy5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgICBza3lCb3gubGF5ZXJzLnNldCgxKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveCk7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFsc1IgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gNjsgaiA8IDEyOyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHNSLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94UiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHNSKTtcbiAgICAgICAgc2t5Qm94Ui5sYXllcnMuc2V0KDIpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94Uik7XG5cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmtub3duIHNreWJveCB0eXBlOiBcIiwgc2t5Ym94LnR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoYXRsYXNJbWdVcmwsIHRpbGVzTnVtKSB7XG4gIGxldCB0ZXh0dXJlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXNOdW07IGkrKykge1xuICAgIHRleHR1cmVzW2ldID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgfVxuXG4gIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoKTtcbiAgbG9hZGVyLmxvYWQoYXRsYXNJbWdVcmwsIGZ1bmN0aW9uKGltYWdlT2JqKSB7XG4gICAgbGV0IGNhbnZhcywgY29udGV4dDtcbiAgICBsZXQgdGlsZVdpZHRoID0gaW1hZ2VPYmouaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRpbGVXaWR0aDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRpbGVXaWR0aDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZU9iaixcbiAgICAgICAgdGlsZVdpZHRoICogaSxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoXG4gICAgICApO1xuICAgICAgdGV4dHVyZXNbaV0uaW1hZ2UgPSBjYW52YXM7XG4gICAgICB0ZXh0dXJlc1tpXS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGV4dHVyZXM7XG59XG5cblNreUJveFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtTa3lCb3gsIE5vdChPYmplY3QzRCldXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVmlzaWJsZSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJpbGl0eVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHByb2Nlc3NWaXNpYmlsaXR5KGVudGl0aWVzKSB7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFxuICAgICAgICBWaXNpYmxlXG4gICAgICApLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRNZXNoIH0gZnJvbSBcInRyb2lrYS0zZC10ZXh0L2Rpc3QvdGV4dG1lc2gtc3RhbmRhbG9uZS5lc20uanNcIjtcbmltcG9ydCB7IE9iamVjdDNELCBUZXh0IH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5cbmNvbnN0IGFuY2hvck1hcHBpbmcgPSB7XG4gIGxlZnQ6IDAsXG4gIGNlbnRlcjogMC41LFxuICByaWdodDogMVxufTtcbmNvbnN0IGJhc2VsaW5lTWFwcGluZyA9IHtcbiAgdG9wOiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgYm90dG9tOiAxXG59O1xuXG5leHBvcnQgY2xhc3MgU0RGVGV4dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpIHtcbiAgICB0ZXh0TWVzaC50ZXh0ID0gdGV4dENvbXBvbmVudC50ZXh0O1xuICAgIHRleHRNZXNoLnRleHRBbGlnbiA9IHRleHRDb21wb25lbnQudGV4dEFsaWduO1xuICAgIHRleHRNZXNoLmFuY2hvclswXSA9IGFuY2hvck1hcHBpbmdbdGV4dENvbXBvbmVudC5hbmNob3JdO1xuICAgIHRleHRNZXNoLmFuY2hvclsxXSA9IGJhc2VsaW5lTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmJhc2VsaW5lXTtcbiAgICB0ZXh0TWVzaC5jb2xvciA9IHRleHRDb21wb25lbnQuY29sb3I7XG4gICAgdGV4dE1lc2guZm9udCA9IHRleHRDb21wb25lbnQuZm9udDtcbiAgICB0ZXh0TWVzaC5mb250U2l6ZSA9IHRleHRDb21wb25lbnQuZm9udFNpemU7XG4gICAgdGV4dE1lc2gubGV0dGVyU3BhY2luZyA9IHRleHRDb21wb25lbnQubGV0dGVyU3BhY2luZyB8fCAwO1xuICAgIHRleHRNZXNoLmxpbmVIZWlnaHQgPSB0ZXh0Q29tcG9uZW50LmxpbmVIZWlnaHQgfHwgbnVsbDtcbiAgICB0ZXh0TWVzaC5vdmVyZmxvd1dyYXAgPSB0ZXh0Q29tcG9uZW50Lm92ZXJmbG93V3JhcDtcbiAgICB0ZXh0TWVzaC53aGl0ZVNwYWNlID0gdGV4dENvbXBvbmVudC53aGl0ZVNwYWNlO1xuICAgIHRleHRNZXNoLm1heFdpZHRoID0gdGV4dENvbXBvbmVudC5tYXhXaWR0aDtcbiAgICB0ZXh0TWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gdGV4dENvbXBvbmVudC5vcGFjaXR5O1xuICAgIHRleHRNZXNoLnN5bmMoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzO1xuXG4gICAgZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG5cbiAgICAgIGNvbnN0IHRleHRNZXNoID0gbmV3IFRleHRNZXNoKCk7XG4gICAgICB0ZXh0TWVzaC5uYW1lID0gXCJ0ZXh0TWVzaFwiO1xuICAgICAgdGV4dE1lc2guYW5jaG9yID0gWzAsIDBdO1xuICAgICAgdGV4dE1lc2gucmVuZGVyT3JkZXIgPSAxOyAvL2JydXRlLWZvcmNlIGZpeCBmb3IgdWdseSBhbnRpYWxpYXNpbmcsIHNlZSBpc3N1ZSAjNjdcbiAgICAgIHRoaXMudXBkYXRlVGV4dCh0ZXh0TWVzaCwgdGV4dENvbXBvbmVudCk7XG4gICAgICBlLmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogdGV4dE1lc2ggfSk7XG4gICAgfSk7XG5cbiAgICBlbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSBlLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICB2YXIgdGV4dE1lc2ggPSBvYmplY3QzRC5nZXRPYmplY3RCeU5hbWUoXCJ0ZXh0TWVzaFwiKTtcbiAgICAgIHRleHRNZXNoLmRpc3Bvc2UoKTtcbiAgICAgIG9iamVjdDNELnJlbW92ZSh0ZXh0TWVzaCk7XG4gICAgfSk7XG5cbiAgICBlbnRpdGllcy5jaGFuZ2VkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgb2JqZWN0M0QgPSBlLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBpZiAob2JqZWN0M0QgaW5zdGFuY2VvZiBUZXh0TWVzaCkge1xuICAgICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGUuZ2V0Q29tcG9uZW50KFRleHQpO1xuICAgICAgICB0aGlzLnVwZGF0ZVRleHQob2JqZWN0M0QsIHRleHRDb21wb25lbnQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cblNERlRleHRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVGV4dF1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBSZW5kZXJQYXNzLFxuICBDYW1lcmEsXG4gIEFjdGl2ZSxcbiAgV2ViR0xSZW5kZXJlcixcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgVlJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1ZSQnV0dG9uLmpzXCI7XG5pbXBvcnQgeyBBUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvQVJCdXR0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29tcG9uZW50LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVbmluaXRpYWxpemVkIHJlbmRlcmVyc1xuICAgIHRoaXMucXVlcmllcy51bmluaXRpYWxpemVkUmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG5cbiAgICAgIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgICAgYW50aWFsaWFzOiBjb21wb25lbnQuYW50aWFsaWFzXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52ciB8fCBjb21wb25lbnQuYXIpIHtcbiAgICAgICAgcmVuZGVyZXIueHIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoVlJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50LmFyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0LCB7IHZhbHVlOiByZW5kZXJlciB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMuY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgIHZhciByZW5kZXJlciA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wb25lbnQud2lkdGggIT09IHJlbmRlcmVyLndpZHRoIHx8XG4gICAgICAgIGNvbXBvbmVudC5oZWlnaHQgIT09IHJlbmRlcmVyLmhlaWdodFxuICAgICAgKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUoY29tcG9uZW50LndpZHRoLCBjb21wb25lbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8gaW5uZXJXaWR0aC9pbm5lckhlaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJQYXNzZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyUGFzc11cbiAgfSxcbiAgYWN0aXZlQ2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIEFjdGl2ZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBQYXJlbnRPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICBQb3NpdGlvbixcbiAgU2NhbGUsXG4gIFBhcmVudCxcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gSGllcmFyY2h5XG4gICAgbGV0IGFkZGVkID0gdGhpcy5xdWVyaWVzLnBhcmVudC5hZGRlZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gYWRkZWRbaV07XG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0QpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gSGllcmFyY2h5XG4gICAgdGhpcy5xdWVyaWVzLnBhcmVudE9iamVjdDNELmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50T2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICB9KTtcblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFBvc2l0aW9uXG4gICAgbGV0IHBvc2l0aW9ucyA9IHRoaXMucXVlcmllcy5wb3NpdGlvbnM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuYWRkZWRbaV07XG4gICAgICBsZXQgcG9zaXRpb24gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZTtcblxuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwb3NpdGlvbnMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHBvc2l0aW9ucy5jaGFuZ2VkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICAvLyBTY2FsZVxuICAgIGxldCBzY2FsZXMgPSB0aGlzLnF1ZXJpZXMuc2NhbGVzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmFkZGVkW2ldO1xuICAgICAgbGV0IHNjYWxlID0gZW50aXR5LmdldENvbXBvbmVudChTY2FsZSkudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2NhbGVzLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBzY2FsZXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3Quc2NhbGUuY29weShzY2FsZSk7XG4gICAgfVxuICB9XG59XG5cblRyYW5zZm9ybVN5c3RlbS5xdWVyaWVzID0ge1xuICBwYXJlbnRPYmplY3QzRDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnRPYmplY3QzRCwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmFuc2Zvcm1zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNELCBUcmFuc2Zvcm1dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVHJhbnNmb3JtXVxuICAgIH1cbiAgfSxcbiAgcG9zaXRpb25zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNELCBQb3NpdGlvbl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtQb3NpdGlvbl1cbiAgICB9XG4gIH0sXG4gIHNjYWxlczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgU2NhbGVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbU2NhbGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgQ2FtZXJhLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhID0+IHtcbiAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY2FtZXJhLmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgICAgICBjYW1lcmEuZ2V0TXV0YWJsZUNvbXBvbmVudChDYW1lcmEpLmFzcGVjdCA9XG4gICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5jYW1lcmFzLmNoYW5nZWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gY2hhbmdlZFtpXTtcblxuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgIGxldCBjYW1lcmEzZCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgaWYgKGNhbWVyYTNkLmFzcGVjdCAhPT0gY29tcG9uZW50LmFzcGVjdCkge1xuICAgICAgICBjYW1lcmEzZC5hc3BlY3QgPSBjb21wb25lbnQuYXNwZWN0O1xuICAgICAgICBjYW1lcmEzZC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICB9XG4gICAgICAvLyBAdG9kbyBEbyBpdCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHZhbHVlc1xuICAgIH1cblxuICAgIHRoaXMucXVlcmllcy5jYW1lcmFzVW5pbml0aWFsaXplZC5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG5cbiAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgIGNvbXBvbmVudC5mb3YsXG4gICAgICAgIGNvbXBvbmVudC5hc3BlY3QsXG4gICAgICAgIGNvbXBvbmVudC5uZWFyLFxuICAgICAgICBjb21wb25lbnQuZmFyXG4gICAgICApO1xuXG4gICAgICBjYW1lcmEubGF5ZXJzLmVuYWJsZShjb21wb25lbnQubGF5ZXJzKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogY2FtZXJhIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkNhbWVyYVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzVW5pbml0aWFsaXplZDoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE5vdChPYmplY3QzRCldXG4gIH0sXG4gIGNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbQ2FtZXJhXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0RcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSB9IGZyb20gXCIuLi9jb21wb25lbnRzL1RleHRHZW9tZXRyeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgdGhpcy5mb250ID0gbnVsbDtcbiAgICBsb2FkZXIubG9hZChcIi9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIiwgZm9udCA9PiB7XG4gICAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGlmICghdGhpcy5mb250KSByZXR1cm47XG5cbiAgICB2YXIgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkO1xuICAgIGNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBvYmplY3QuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcbiAgICB9KTtcblxuICAgIHZhciBhZGRlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcbiAgICBhZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29sb3IgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG4gICAgICBjb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICByb3VnaG5lc3M6IDAuNyxcbiAgICAgICAgbWV0YWxuZXNzOiAwLjBcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG1lc2ggfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRHZW9tZXRyeV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQsIFNjZW5lLCBPYmplY3QzRCwgRW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5lbnZpcm9ubWVudHMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgLy8gc3RhZ2UgZ3JvdW5kIGRpYW1ldGVyIChhbmQgc2t5IHJhZGl1cylcbiAgICAgIHZhciBTVEFHRV9TSVpFID0gMjAwO1xuXG4gICAgICAvLyBjcmVhdGUgZ3JvdW5kXG4gICAgICAvLyB1cGRhdGUgZ3JvdW5kLCBwbGF5YXJlYSBhbmQgZ3JpZCB0ZXh0dXJlcy5cbiAgICAgIHZhciBncm91bmRSZXNvbHV0aW9uID0gMjA0ODtcbiAgICAgIHZhciB0ZXhNZXRlcnMgPSAyMDsgLy8gZ3JvdW5kIHRleHR1cmUgb2YgMjAgeCAyMCBtZXRlcnNcbiAgICAgIHZhciB0ZXhSZXBlYXQgPSBTVEFHRV9TSVpFIC8gdGV4TWV0ZXJzO1xuXG4gICAgICB2YXIgcmVzb2x1dGlvbiA9IDY0OyAvLyBudW1iZXIgb2YgZGl2aXNpb25zIG9mIHRoZSBncm91bmQgbWVzaFxuXG4gICAgICB2YXIgZ3JvdW5kQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGdyb3VuZENhbnZhcy53aWR0aCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRDYW52YXMuaGVpZ2h0ID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIHZhciBncm91bmRUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoZ3JvdW5kQ2FudmFzKTtcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUucmVwZWF0LnNldCh0ZXhSZXBlYXQsIHRleFJlcGVhdCk7XG5cbiAgICAgIHRoaXMuZW52aXJvbm1lbnREYXRhID0ge1xuICAgICAgICBncm91bmRDb2xvcjogXCIjNDU0NTQ1XCIsXG4gICAgICAgIGdyb3VuZENvbG9yMjogXCIjNWQ1ZDVkXCJcbiAgICAgIH07XG5cbiAgICAgIHZhciBncm91bmRjdHggPSBncm91bmRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICB2YXIgc2l6ZSA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3I7XG4gICAgICBncm91bmRjdHguZmlsbFJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSk7XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3IyO1xuICAgICAgdmFyIG51bSA9IE1hdGguZmxvb3IodGV4TWV0ZXJzIC8gMik7XG4gICAgICB2YXIgc3RlcCA9IHNpemUgLyAodGV4TWV0ZXJzIC8gMik7IC8vIDIgbWV0ZXJzID09IDxzdGVwPiBwaXhlbHNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtICsgMTsgaSArPSAyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtICsgMTsgaisrKSB7XG4gICAgICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgTWF0aC5mbG9vcigoaSArIChqICUgMikpICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKGogKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBncm91bmRUZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgdmFyIGdyb3VuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBtYXA6IGdyb3VuZFRleHR1cmVcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgc2NlbmUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjZW5lKS52YWx1ZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgLy9zY2VuZS5hZGQobWVzaCk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICByZXNvbHV0aW9uIC0gMSxcbiAgICAgICAgcmVzb2x1dGlvbiAtIDFcbiAgICAgICk7XG5cbiAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiB3aW5kb3cuZW50aXR5U2NlbmUgfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0gMHgzMzMzMzM7XG4gICAgICBjb25zdCBuZWFyID0gMjA7XG4gICAgICBjb25zdCBmYXIgPSAxMDA7XG4gICAgICBzY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKGNvbG9yLCBuZWFyLCBmYXIpO1xuICAgICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcik7XG4gICAgfSk7XG4gIH1cbn1cblxuRW52aXJvbm1lbnRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW52aXJvbm1lbnRzOiB7XG4gICAgY29tcG9uZW50czogW1NjZW5lLCBFbnZpcm9ubWVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXJDb250ZXh0LFxuICBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cixcbiAgVlJDb250cm9sbGVyLFxuICBPYmplY3QzRFxufSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5LmpzXCI7XG5cbnZhciBjb250cm9sbGVyTW9kZWxGYWN0b3J5ID0gbmV3IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSgpO1xuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXIgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJDb250ZXh0LnJlc3VsdHNbMF0uZ2V0Q29tcG9uZW50KFxuICAgICAgV2ViR0xSZW5kZXJlckNvbnRleHRcbiAgICApLnZhbHVlO1xuXG4gICAgdGhpcy5xdWVyaWVzLmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb250cm9sbGVySWQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlcikuaWQ7XG4gICAgICB2YXIgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXIubmFtZSA9IFwiY29udHJvbGxlclwiO1xuXG4gICAgICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdyb3VwIH0pO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cikpIHtcbiAgICAgICAgdmFyIGJlaGF2aW91ciA9IGVudGl0eS5nZXRDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpO1xuICAgICAgICBPYmplY3Qua2V5cyhiZWhhdmlvdXIpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICBpZiAoYmVoYXZpb3VyW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGJlaGF2aW91cltldmVudE5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5IHdpbGwgYXV0b21hdGljYWxseSBmZXRjaCBjb250cm9sbGVyIG1vZGVsc1xuICAgICAgLy8gdGhhdCBtYXRjaCB3aGF0IHRoZSB1c2VyIGlzIGhvbGRpbmcgYXMgY2xvc2VseSBhcyBwb3NzaWJsZS4gVGhlIG1vZGVsc1xuICAgICAgLy8gc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSBnZXRDb250cm9sbGVyR3JpcCBpblxuICAgICAgLy8gb3JkZXIgdG8gbWF0Y2ggdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBoZWxkIGRldmljZS5cbiAgICAgIGxldCBjb250cm9sbGVyR3JpcCA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXJHcmlwKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyR3JpcC5hZGQoXG4gICAgICAgIGNvbnRyb2xsZXJNb2RlbEZhY3RvcnkuY3JlYXRlQ29udHJvbGxlck1vZGVsKGNvbnRyb2xsZXJHcmlwKVxuICAgICAgKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyR3JpcCk7XG4gICAgICAvKlxuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIFwicG9zaXRpb25cIixcbiAgICAgICAgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoWzAsIDAsIDAsIDAsIDAsIC0xXSwgMylcbiAgICAgICk7XG5cbiAgICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnkpO1xuICAgICAgbGluZS5uYW1lID0gXCJsaW5lXCI7XG4gICAgICBsaW5lLnNjYWxlLnogPSA1O1xuICAgICAgZ3JvdXAuYWRkKGxpbmUpO1xuXG4gICAgICBsZXQgZ2VvbWV0cnkyID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDAuMSwgMC4xLCAwLjEpO1xuICAgICAgbGV0IG1hdGVyaWFsMiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDAwZmYwMCB9KTtcbiAgICAgIGxldCBjdWJlID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnkyLCBtYXRlcmlhbDIpO1xuICAgICAgZ3JvdXAubmFtZSA9IFwiVlJDb250cm9sbGVyXCI7XG4gICAgICBncm91cC5hZGQoY3ViZSk7XG4qL1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcy5jbGVhbkludGVyc2VjdGVkKCk7XG4gIH1cbn1cblxuVlJDb250cm9sbGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGNvbnRyb2xsZXJzOiB7XG4gICAgY29tcG9uZW50czogW1ZSQ29udHJvbGxlcl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgICAgLy9jaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH0sXG4gIHJlbmRlcmVyQ29udGV4dDoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyQ29udGV4dF0sXG4gICAgbWFuZGF0b3J5OiB0cnVlXG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBFQ1NZIGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IENhbWVyYVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBNYXRlcmlhbFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanNcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QgfSBmcm9tIFwiLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBDYW1lcmFSaWcgfSBmcm9tIFwiLi9jb21wb25lbnRzL0NhbWVyYVJpZy5qc1wiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXIsXG4gIFNjZW5lLFxuICBBY3RpdmUsXG4gIFJlbmRlclBhc3MsXG4gIFRyYW5zZm9ybSxcbiAgQ2FtZXJhXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQod29ybGQpIHtcbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVHJhbnNmb3JtU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShDYW1lcmFTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKE1hdGVyaWFsU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZURlZmF1bHQod29ybGQgPSBuZXcgRUNTWS5Xb3JsZCgpLCBvcHRpb25zKSB7XG4gIGluaXQod29ybGQpO1xuXG4gIGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHt9O1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG5ldyBUSFJFRS5TY2VuZSgpIH0pO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgYXI6IG9wdGlvbnMuYXIsXG4gICAgdnI6IG9wdGlvbnMudnIsXG4gICAgYW5pbWF0aW9uTG9vcDogYW5pbWF0aW9uTG9vcFxuICB9KTtcblxuICAvLyBjYW1lcmEgcmlnICYgY29udHJvbGxlcnNcbiAgdmFyIGNhbWVyYSA9IG51bGwsXG4gICAgY2FtZXJhUmlnID0gbnVsbDtcblxuICBpZiAob3B0aW9ucy5hciB8fCBvcHRpb25zLnZyKSB7XG4gICAgY2FtZXJhUmlnID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmFSaWcpXG4gICAgICAuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogc2NlbmUgfSk7XG4gIH1cblxuICB7XG4gICAgY2FtZXJhID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmEsIHtcbiAgICAgICAgZm92OiA5MCxcbiAgICAgICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgbmVhcjogMC4xLFxuICAgICAgICBmYXI6IDEwMCxcbiAgICAgICAgbGF5ZXJzOiAxLFxuICAgICAgICBoYW5kbGVSZXNpemU6IHRydWVcbiAgICAgIH0pXG4gICAgICAuYWRkQ29tcG9uZW50KFRyYW5zZm9ybSlcbiAgICAgIC5hZGRDb21wb25lbnQoQWN0aXZlKTtcbiAgfVxuXG4gIGxldCByZW5kZXJQYXNzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlclBhc3MsIHtcbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICBjYW1lcmFSaWcsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHJlbmRlclBhc3NcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiVEhSRUUuVmVjdG9yMiIsIlRIUkVFLlZlY3RvcjMiLCJUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIkdMVEZMb2FkZXJUaHJlZSIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiLCJUSFJFRS5Gb250TG9hZGVyIiwiVEhSRUUuVGV4dEdlb21ldHJ5IiwiVEhSRUUuUmVwZWF0V3JhcHBpbmciLCJUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuRm9nIiwiVEhSRUUuQ29sb3IiLCJFQ1NZLldvcmxkIiwiVEhSRUUuQ2xvY2siLCJUSFJFRS5TY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBTyxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxH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

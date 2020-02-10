import { TagComponent, System, Not, SystemStateComponent, World } from 'ecsy';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, Clock, Scene as Scene$1 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
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
    this.near = 1;
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

class GLTFModel {}

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
var loader = new GLTFLoader().setPath("/assets/");

class GLTFLoaderSystem extends System {
  execute() {
    this.queries.entities.added.forEach(entity => {
      var component = entity.getComponent(GLTFModel);

      loader.load(component.url, gltf => {
        /*
        gltf.scene.traverse(function(child) {
          if (child.isMesh) {
            child.material.envMap = envMap;
          }
        });
*/
        entity.addComponent(Object3D, { value: gltf.scene });
      });
    });
  }
}

GLTFLoaderSystem.queries = {
  entities: {
    components: [GLTFModel],
    listen: {
      added: true
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

    // Transforms
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
  }
}

TransformSystem.queries = {
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

export { Active, Camera, CameraRig, CameraSystem, Draggable, Dragging, Environment, EnvironmentSystem, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, Material, MaterialSystem, Object3D, Parent, Position, RenderPass, Rotation, SDFTextSystem, Scene, Sky, SkyBox, SkyBoxSystem, Text, TextGeometry, TextGeometrySystem, Transform, TransformSystem, VRController, VRControllerBasicBehaviour, VRControllerSystem, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, init, initializeDefault };

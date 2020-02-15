import { TagComponent, System, Not, SystemStateComponent, World } from 'https://unpkg.com/ecsy@0.2.2/build/ecsy.module.js';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, Clock, Scene as Scene$1 } from 'https://unpkg.com/three@0.113.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.113.2/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'https://unpkg.com/troika-3d-text@0.17.0/dist/textmesh-standalone.esm.js?module';
import { VRButton } from 'https://unpkg.com/three@0.113.2/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'https://unpkg.com/three@0.113.2/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.113.2/examples/jsm/webxr/XRControllerModelFactory.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUtdW5wa2cuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL01hdGVyaWFsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JlbmRlclBhc3MuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WUkNvbnRyb2xsZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU0RGVGV4dFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1ZSQ29udHJvbGxlclN5c3RlbS5qcyIsIi4uL3NyYy9pbml0aWFsaXplLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBY3RpdmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZvdiA9IDQ1O1xuICAgIHRoaXMuYXNwZWN0ID0gMTtcbiAgICB0aGlzLm5lYXIgPSAwLjE7XG4gICAgdGhpcy5mYXIgPSAxMDAwO1xuICAgIHRoaXMubGF5ZXJzID0gMDtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRydWU7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2FtZXJhUmlnIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5sZWZ0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5yaWdodEhhbmQgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIERyYWdnYWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBEcmFnZ2luZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiZXhwb3J0IGNsYXNzIEVudmlyb25tZW50IHtcbiAgcmVzZXQoKSB7fVxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMucHJlc2V0ID0gXCJkZWZhdWx0XCI7XG4gICAgdGhpcy5zZWVkID0gMTtcbiAgICB0aGlzLnNreVR5cGUgPSBcImF0bW9zcGhlcmVcIjtcbiAgICB0aGlzLnNreUNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmhvcml6b25Db2xvciA9IFwiXCI7XG4gICAgdGhpcy5saWdodGluZyA9IFwiZGlzdGFudFwiO1xuICAgIHRoaXMuc2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5zaGFkb3dTaXplID0gMTA7XG4gICAgdGhpcy5saWdodFBvc2l0aW9uID0geyB4OiAwLCB5OiAxLCB6OiAtMC4yIH07XG4gICAgdGhpcy5mb2cgPSAwO1xuXG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucGxheUFyZWEgPSAxO1xuXG4gICAgdGhpcy5ncm91bmQgPSBcImZsYXRcIjtcbiAgICB0aGlzLmdyb3VuZFlTY2FsZSA9IDM7XG4gICAgdGhpcy5ncm91bmRUZXh0dXJlID0gXCJub25lXCI7XG4gICAgdGhpcy5ncm91bmRDb2xvciA9IFwiIzU1M2UzNVwiO1xuICAgIHRoaXMuZ3JvdW5kQ29sb3IyID0gXCIjNjk0NDM5XCI7XG5cbiAgICB0aGlzLmRyZXNzaW5nID0gXCJub25lXCI7XG4gICAgdGhpcy5kcmVzc2luZ0Ftb3VudCA9IDEwO1xuICAgIHRoaXMuZHJlc3NpbmdDb2xvciA9IFwiIzc5NTQ0OVwiO1xuICAgIHRoaXMuZHJlc3NpbmdTY2FsZSA9IDU7XG4gICAgdGhpcy5kcmVzc2luZ1ZhcmlhbmNlID0geyB4OiAxLCB5OiAxLCB6OiAxIH07XG4gICAgdGhpcy5kcmVzc2luZ1VuaWZvcm1TY2FsZSA9IHRydWU7XG4gICAgdGhpcy5kcmVzc2luZ09uUGxheUFyZWEgPSAwO1xuXG4gICAgdGhpcy5ncmlkID0gXCJub25lXCI7XG4gICAgdGhpcy5ncmlkQ29sb3IgPSBcIiNjY2NcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdlb21ldHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR0xURk1vZGVsIHt9XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNvbnN0IFNJREVTID0ge1xuICBmcm9udDogMCxcbiAgYmFjazogMSxcbiAgZG91YmxlOiAyXG59O1xuXG5leHBvcnQgY29uc3QgU0hBREVSUyA9IHtcbiAgc3RhbmRhcmQ6IDAsXG4gIGZsYXQ6IDFcbn07XG5cbmV4cG9ydCBjb25zdCBCTEVORElORyA9IHtcbiAgbm9ybWFsOiAwLFxuICBhZGRpdGl2ZTogMSxcbiAgc3VidHJhY3RpdmU6IDIsXG4gIG11bHRpcGx5OiAzXG59O1xuXG5leHBvcnQgY29uc3QgVkVSVEVYX0NPTE9SUyA9IHtcbiAgbm9uZTogMCxcbiAgZmFjZTogMSxcbiAgdmVydGV4OiAyXG59O1xuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbG9yID0gMHhmZjAwMDA7XG4gICAgdGhpcy5hbHBoYVRlc3QgPSAwO1xuICAgIHRoaXMuZGVwdGhUZXN0ID0gdHJ1ZTtcbiAgICB0aGlzLmRlcHRoV3JpdGUgPSB0cnVlO1xuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm5wb3QgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xuICAgIHRoaXMucmVwZWF0ID0gbmV3IFRIUkVFLlZlY3RvcjIoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvbG9yID0gMHhmZjAwMDA7XG4gICAgdGhpcy5hbHBoYVRlc3QgPSAwO1xuICAgIHRoaXMuZGVwdGhUZXN0ID0gdHJ1ZTtcbiAgICB0aGlzLmRlcHRoV3JpdGUgPSB0cnVlO1xuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm5wb3QgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldC5zZXQoMCwgMCk7XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xuICAgIHRoaXMucmVwZWF0LnNldCgxLCAxKTtcbiAgICB0aGlzLnNoYWRlciA9IFNIQURFUlMuc3RhbmRhcmQ7XG4gICAgdGhpcy5zaWRlID0gU0lERVMuZnJvbnQ7XG4gICAgdGhpcy50cmFuc3BhcmVudCA9IGZhbHNlO1xuICAgIHRoaXMudmVydGV4Q29sb3JzID0gVkVSVEVYX0NPTE9SUy5ub25lO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5ibGVuZGluZyA9IEJMRU5ESU5HLm5vcm1hbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE9iamVjdDNEIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3kge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3lCb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5jb3B5KHNyYy5wb3NpdGlvbik7XG4gICAgdGhpcy5yb3RhdGlvbi5jb3B5KHNyYy5yb3RhdGlvbik7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpc2libGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgICB0aGlzLnRleHRBbGlnbiA9IFwibGVmdFwiOyAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ11cbiAgICB0aGlzLmFuY2hvciA9IFwiY2VudGVyXCI7IC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICAgIHRoaXMuYmFzZWxpbmUgPSBcImNlbnRlclwiOyAvLyBbJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJ11cbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgdGhpcy5mb250ID0gXCJodHRwczovL2NvZGUuY2RuLm1vemlsbGEubmV0L2ZvbnRzL3R0Zi9aaWxsYVNsYWItU2VtaUJvbGQudHRmXCI7XG4gICAgdGhpcy5mb250U2l6ZSA9IDAuMjtcbiAgICB0aGlzLmxldHRlclNwYWNpbmcgPSAwO1xuICAgIHRoaXMubGluZUhlaWdodCA9IDA7XG4gICAgdGhpcy5tYXhXaWR0aCA9IEluZmluaXR5O1xuICAgIHRoaXMub3ZlcmZsb3dXcmFwID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnYnJlYWstd29yZCddXG4gICAgdGhpcy53aGl0ZVNwYWNlID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnbm93cmFwJ11cbiAgICB0aGlzLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNlbGVjdCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RlbmQgPSBudWxsO1xuXG4gICAgdGhpcy5jb25uZWN0ZWQgPSBudWxsO1xuXG4gICAgdGhpcy5zcXVlZXplID0gbnVsbDtcbiAgICB0aGlzLnNxdWVlemVzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplZW5kID0gbnVsbDtcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52ciA9IGZhbHNlO1xuICAgIHRoaXMuYXIgPSBmYWxzZTtcbiAgICB0aGlzLmFudGlhbGlhcyA9IHRydWU7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUgPSB0cnVlO1xuICAgIHRoaXMuc2hhZG93TWFwID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cblxuLypcbmV4cG9ydCBjb25zdCBXZWJHTFJlbmRlcmVyID0gY3JlYXRlQ29tcG9uZW50Q2xhc3MoXG4gIHtcbiAgICB2cjogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIHNoYWRvd01hcDogeyBkZWZhdWx0OiBmYWxzZSB9XG4gIH0sXG4gIFwiV2ViR0xSZW5kZXJlclwiXG4pO1xuKi9cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtLCBOb3QsIFN5c3RlbVN0YXRlQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIE1hdGVyaWFsLFxuICBPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmNsYXNzIE1hdGVyaWFsSW5zdGFuY2UgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy52YWx1ZSA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5uZXcucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE1hdGVyaWFsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5NYXRlcmlhbFN5c3RlbS5xdWVyaWVzID0ge1xuICBuZXc6IHtcbiAgICBjb21wb25lbnRzOiBbTWF0ZXJpYWwsIE5vdChNYXRlcmlhbEluc3RhbmNlKV1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIEdlb21ldHJ5LFxuICBPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbi8qKlxuICogQ3JlYXRlIGEgTWVzaCBiYXNlZCBvbiB0aGUgW0dlb21ldHJ5XSBjb21wb25lbnQgYW5kIGF0dGFjaCBpdCB0byB0aGUgZW50aXR5IHVzaW5nIGEgW09iamVjdDNEXSBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBSZW1vdmVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5yZW1vdmUob2JqZWN0KTtcbiAgICB9KTtcblxuICAgIC8vIEFkZGVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdlb21ldHJ5KTtcblxuICAgICAgdmFyIGdlb21ldHJ5O1xuICAgICAgc3dpdGNoIChjb21wb25lbnQucHJpbWl0aXZlKSB7XG4gICAgICAgIGNhc2UgXCJ0b3J1c1wiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpdXMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJlLFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaWFsU2VnbWVudHMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJ1bGFyU2VnbWVudHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3BoZXJlXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeShjb21wb25lbnQucmFkaXVzLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LndpZHRoLFxuICAgICAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0LFxuICAgICAgICAgICAgICBjb21wb25lbnQuZGVwdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPVxuICAgICAgICBjb21wb25lbnQucHJpbWl0aXZlID09PSBcInRvcnVzXCIgPyAweDk5OTkwMCA6IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChNYXRlcmlhbCkpIHtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiovXG5cbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChUcmFuc2Zvcm0pKSB7XG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICAgIGlmICh0cmFuc2Zvcm0ucm90YXRpb24pIHtcbiAgICAgICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KEVsZW1lbnQpICYmICFlbnRpdHkuaGFzQ29tcG9uZW50KERyYWdnYWJsZSkpIHtcbiAgICAgIC8vICAgICAgICBvYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0KDB4MzMzMzMzKTtcbiAgICAgIC8vICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuR2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR2VvbWV0cnldLCAvLyBAdG9kbyBUcmFuc2Zvcm06IEFzIG9wdGlvbmFsLCBob3cgdG8gZGVmaW5lIGl0P1xuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcblxuLy8gQHRvZG8gVXNlIHBhcmFtZXRlciBhbmQgbG9hZGVyIG1hbmFnZXJcbnZhciBsb2FkZXIgPSBuZXcgR0xURkxvYWRlcigpLnNldFBhdGgoXCIvYXNzZXRzL1wiKTtcblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHTFRGTW9kZWwpO1xuXG4gICAgICBsb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBnbHRmID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGVudk1hcDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuKi9cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ2x0Zi5zY2VuZSB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdMVEZMb2FkZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURk1vZGVsXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgU2t5Qm94LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuXG4gICAgICBsZXQgc2t5Ym94ID0gZW50aXR5LmdldENvbXBvbmVudChTa3lCb3gpO1xuXG4gICAgICBsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgaWYgKHNreWJveC50eXBlID09PSBcImN1YmVtYXAtc3RlcmVvXCIpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHNreWJveC50ZXh0dXJlVXJsLCAxMik7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgIHNreUJveC5sYXllcnMuc2V0KDEpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94KTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzUiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3hSID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsc1IpO1xuICAgICAgICBza3lCb3hSLmxheWVycy5zZXQoMik7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3hSKTtcblxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBncm91cCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gc2t5Ym94IHR5cGU6IFwiLCBza3lib3gudHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShhdGxhc0ltZ1VybCwgdGlsZXNOdW0pIHtcbiAgbGV0IHRleHR1cmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc051bTsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB9XG5cbiAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcigpO1xuICBsb2FkZXIubG9hZChhdGxhc0ltZ1VybCwgZnVuY3Rpb24oaW1hZ2VPYmopIHtcbiAgICBsZXQgY2FudmFzLCBjb250ZXh0O1xuICAgIGxldCB0aWxlV2lkdGggPSBpbWFnZU9iai5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGlsZVdpZHRoO1xuICAgICAgY2FudmFzLndpZHRoID0gdGlsZVdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIGltYWdlT2JqLFxuICAgICAgICB0aWxlV2lkdGggKiBpLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGhcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlc1tpXS5pbWFnZSA9IGNhbnZhcztcbiAgICAgIHRleHR1cmVzW2ldLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0ZXh0dXJlcztcbn1cblxuU2t5Qm94U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1NreUJveCwgTm90KE9iamVjdDNEKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWaXNpYmxlLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBWaXNpYmlsaXR5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgcHJvY2Vzc1Zpc2liaWxpdHkoZW50aXRpZXMpIHtcbiAgICBlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWUudmlzaWJsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoXG4gICAgICAgIFZpc2libGVcbiAgICAgICkudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkKTtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkKTtcbiAgfVxufVxuXG5WaXNpYmlsaXR5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1Zpc2libGUsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVGV4dE1lc2ggfSBmcm9tIFwidHJvaWthLTNkLXRleHQvZGlzdC90ZXh0bWVzaC1zdGFuZGFsb25lLmVzbS5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QsIFRleHQgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxuY29uc3QgYW5jaG9yTWFwcGluZyA9IHtcbiAgbGVmdDogMCxcbiAgY2VudGVyOiAwLjUsXG4gIHJpZ2h0OiAxXG59O1xuY29uc3QgYmFzZWxpbmVNYXBwaW5nID0ge1xuICB0b3A6IDAsXG4gIGNlbnRlcjogMC41LFxuICBib3R0b206IDFcbn07XG5cbmV4cG9ydCBjbGFzcyBTREZUZXh0U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgdXBkYXRlVGV4dCh0ZXh0TWVzaCwgdGV4dENvbXBvbmVudCkge1xuICAgIHRleHRNZXNoLnRleHQgPSB0ZXh0Q29tcG9uZW50LnRleHQ7XG4gICAgdGV4dE1lc2gudGV4dEFsaWduID0gdGV4dENvbXBvbmVudC50ZXh0QWxpZ247XG4gICAgdGV4dE1lc2guYW5jaG9yWzBdID0gYW5jaG9yTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmFuY2hvcl07XG4gICAgdGV4dE1lc2guYW5jaG9yWzFdID0gYmFzZWxpbmVNYXBwaW5nW3RleHRDb21wb25lbnQuYmFzZWxpbmVdO1xuICAgIHRleHRNZXNoLmNvbG9yID0gdGV4dENvbXBvbmVudC5jb2xvcjtcbiAgICB0ZXh0TWVzaC5mb250ID0gdGV4dENvbXBvbmVudC5mb250O1xuICAgIHRleHRNZXNoLmZvbnRTaXplID0gdGV4dENvbXBvbmVudC5mb250U2l6ZTtcbiAgICB0ZXh0TWVzaC5sZXR0ZXJTcGFjaW5nID0gdGV4dENvbXBvbmVudC5sZXR0ZXJTcGFjaW5nIHx8IDA7XG4gICAgdGV4dE1lc2gubGluZUhlaWdodCA9IHRleHRDb21wb25lbnQubGluZUhlaWdodCB8fCBudWxsO1xuICAgIHRleHRNZXNoLm92ZXJmbG93V3JhcCA9IHRleHRDb21wb25lbnQub3ZlcmZsb3dXcmFwO1xuICAgIHRleHRNZXNoLndoaXRlU3BhY2UgPSB0ZXh0Q29tcG9uZW50LndoaXRlU3BhY2U7XG4gICAgdGV4dE1lc2gubWF4V2lkdGggPSB0ZXh0Q29tcG9uZW50Lm1heFdpZHRoO1xuICAgIHRleHRNZXNoLm1hdGVyaWFsLm9wYWNpdHkgPSB0ZXh0Q29tcG9uZW50Lm9wYWNpdHk7XG4gICAgdGV4dE1lc2guc3luYygpO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXM7XG5cbiAgICBlbnRpdGllcy5hZGRlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcblxuICAgICAgY29uc3QgdGV4dE1lc2ggPSBuZXcgVGV4dE1lc2goKTtcbiAgICAgIHRleHRNZXNoLm5hbWUgPSBcInRleHRNZXNoXCI7XG4gICAgICB0ZXh0TWVzaC5hbmNob3IgPSBbMCwgMF07XG4gICAgICB0ZXh0TWVzaC5yZW5kZXJPcmRlciA9IDE7IC8vYnJ1dGUtZm9yY2UgZml4IGZvciB1Z2x5IGFudGlhbGlhc2luZywgc2VlIGlzc3VlICM2N1xuICAgICAgdGhpcy51cGRhdGVUZXh0KHRleHRNZXNoLCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIGUuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiB0ZXh0TWVzaCB9KTtcbiAgICB9KTtcblxuICAgIGVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciBvYmplY3QzRCA9IGUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciB0ZXh0TWVzaCA9IG9iamVjdDNELmdldE9iamVjdEJ5TmFtZShcInRleHRNZXNoXCIpO1xuICAgICAgdGV4dE1lc2guZGlzcG9zZSgpO1xuICAgICAgb2JqZWN0M0QucmVtb3ZlKHRleHRNZXNoKTtcbiAgICB9KTtcblxuICAgIGVudGl0aWVzLmNoYW5nZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciBvYmplY3QzRCA9IGUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIGlmIChvYmplY3QzRCBpbnN0YW5jZW9mIFRleHRNZXNoKSB7XG4gICAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG4gICAgICAgIHRoaXMudXBkYXRlVGV4dChvYmplY3QzRCwgdGV4dENvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuU0RGVGV4dFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtUZXh0XVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFJlbmRlclBhc3MsXG4gIENhbWVyYSxcbiAgQWN0aXZlLFxuICBXZWJHTFJlbmRlcmVyLFxuICBPYmplY3QzRFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBWUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvVlJCdXR0b24uanNcIjtcbmltcG9ydCB7IEFSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9BUkJ1dHRvbi5qc1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlckNvbnRleHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgICAgICBjb21wb25lbnQud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCByZW5kZXJlcnMgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHM7XG4gICAgcmVuZGVyZXJzLmZvckVhY2gocmVuZGVyZXJFbnRpdHkgPT4ge1xuICAgICAgdmFyIHJlbmRlcmVyID0gcmVuZGVyZXJFbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJQYXNzZXMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgIHZhciBwYXNzID0gZW50aXR5LmdldENvbXBvbmVudChSZW5kZXJQYXNzKTtcbiAgICAgICAgdmFyIHNjZW5lID0gcGFzcy5zY2VuZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICAgIHRoaXMucXVlcmllcy5hY3RpdmVDYW1lcmFzLnJlc3VsdHMuZm9yRWFjaChjYW1lcmFFbnRpdHkgPT4ge1xuICAgICAgICAgIHZhciBjYW1lcmEgPSBjYW1lcmFFbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVbmluaXRpYWxpemVkIHJlbmRlcmVyc1xuICAgIHRoaXMucXVlcmllcy51bmluaXRpYWxpemVkUmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG5cbiAgICAgIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgICAgYW50aWFsaWFzOiBjb21wb25lbnQuYW50aWFsaWFzXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52ciB8fCBjb21wb25lbnQuYXIpIHtcbiAgICAgICAgcmVuZGVyZXIueHIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoVlJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50LmFyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0LCB7IHZhbHVlOiByZW5kZXJlciB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMuY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgIHZhciByZW5kZXJlciA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wb25lbnQud2lkdGggIT09IHJlbmRlcmVyLndpZHRoIHx8XG4gICAgICAgIGNvbXBvbmVudC5oZWlnaHQgIT09IHJlbmRlcmVyLmhlaWdodFxuICAgICAgKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUoY29tcG9uZW50LndpZHRoLCBjb21wb25lbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8gaW5uZXJXaWR0aC9pbm5lckhlaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJQYXNzZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyUGFzc11cbiAgfSxcbiAgYWN0aXZlQ2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIEFjdGl2ZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm0sIFBvc2l0aW9uLCBQYXJlbnQsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gSGllcmFyY2h5XG4gICAgbGV0IGFkZGVkID0gdGhpcy5xdWVyaWVzLnBhcmVudC5hZGRlZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gYWRkZWRbaV07XG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0QpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3Jtc1xuICAgIHZhciB0cmFuc2Zvcm1zID0gdGhpcy5xdWVyaWVzLnRyYW5zZm9ybXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdHJhbnNmb3Jtcy5hZGRlZFtpXTtcbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdHJhbnNmb3Jtcy5jaGFuZ2VkW2ldO1xuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3Jtc1xuICAgIGxldCBwb3NpdGlvbnMgPSB0aGlzLnF1ZXJpZXMucG9zaXRpb25zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmFkZGVkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuICB9XG59XG5cblRyYW5zZm9ybVN5c3RlbS5xdWVyaWVzID0ge1xuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3Jtczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgVHJhbnNmb3JtXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RyYW5zZm9ybV1cbiAgICB9XG4gIH0sXG4gIHBvc2l0aW9uczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgUG9zaXRpb25dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbUG9zaXRpb25dXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgQ2FtZXJhLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhID0+IHtcbiAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY2FtZXJhLmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgICAgICBjYW1lcmEuZ2V0TXV0YWJsZUNvbXBvbmVudChDYW1lcmEpLmFzcGVjdCA9XG4gICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5jYW1lcmFzLmNoYW5nZWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gY2hhbmdlZFtpXTtcblxuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgIGxldCBjYW1lcmEzZCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgaWYgKGNhbWVyYTNkLmFzcGVjdCAhPT0gY29tcG9uZW50LmFzcGVjdCkge1xuICAgICAgICBjYW1lcmEzZC5hc3BlY3QgPSBjb21wb25lbnQuYXNwZWN0O1xuICAgICAgICBjYW1lcmEzZC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICB9XG4gICAgICAvLyBAdG9kbyBEbyBpdCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHZhbHVlc1xuICAgIH1cblxuICAgIHRoaXMucXVlcmllcy5jYW1lcmFzVW5pbml0aWFsaXplZC5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG5cbiAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgIGNvbXBvbmVudC5mb3YsXG4gICAgICAgIGNvbXBvbmVudC5hc3BlY3QsXG4gICAgICAgIGNvbXBvbmVudC5uZWFyLFxuICAgICAgICBjb21wb25lbnQuZmFyXG4gICAgICApO1xuXG4gICAgICBjYW1lcmEubGF5ZXJzLmVuYWJsZShjb21wb25lbnQubGF5ZXJzKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogY2FtZXJhIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkNhbWVyYVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzVW5pbml0aWFsaXplZDoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE5vdChPYmplY3QzRCldXG4gIH0sXG4gIGNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbQ2FtZXJhXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0RcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSB9IGZyb20gXCIuLi9jb21wb25lbnRzL1RleHRHZW9tZXRyeVwiO1xuXG5leHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgdGhpcy5mb250ID0gbnVsbDtcbiAgICBsb2FkZXIubG9hZChcIi9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIiwgZm9udCA9PiB7XG4gICAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGlmICghdGhpcy5mb250KSByZXR1cm47XG5cbiAgICB2YXIgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkO1xuICAgIGNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBvYmplY3QuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcbiAgICB9KTtcblxuICAgIHZhciBhZGRlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcbiAgICBhZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29sb3IgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG4gICAgICBjb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICByb3VnaG5lc3M6IDAuNyxcbiAgICAgICAgbWV0YWxuZXNzOiAwLjBcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG1lc2ggfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRHZW9tZXRyeV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQsIFNjZW5lLCBPYmplY3QzRCwgRW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5lbnZpcm9ubWVudHMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgLy8gc3RhZ2UgZ3JvdW5kIGRpYW1ldGVyIChhbmQgc2t5IHJhZGl1cylcbiAgICAgIHZhciBTVEFHRV9TSVpFID0gMjAwO1xuXG4gICAgICAvLyBjcmVhdGUgZ3JvdW5kXG4gICAgICAvLyB1cGRhdGUgZ3JvdW5kLCBwbGF5YXJlYSBhbmQgZ3JpZCB0ZXh0dXJlcy5cbiAgICAgIHZhciBncm91bmRSZXNvbHV0aW9uID0gMjA0ODtcbiAgICAgIHZhciB0ZXhNZXRlcnMgPSAyMDsgLy8gZ3JvdW5kIHRleHR1cmUgb2YgMjAgeCAyMCBtZXRlcnNcbiAgICAgIHZhciB0ZXhSZXBlYXQgPSBTVEFHRV9TSVpFIC8gdGV4TWV0ZXJzO1xuXG4gICAgICB2YXIgcmVzb2x1dGlvbiA9IDY0OyAvLyBudW1iZXIgb2YgZGl2aXNpb25zIG9mIHRoZSBncm91bmQgbWVzaFxuXG4gICAgICB2YXIgZ3JvdW5kQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGdyb3VuZENhbnZhcy53aWR0aCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRDYW52YXMuaGVpZ2h0ID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIHZhciBncm91bmRUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoZ3JvdW5kQ2FudmFzKTtcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUucmVwZWF0LnNldCh0ZXhSZXBlYXQsIHRleFJlcGVhdCk7XG5cbiAgICAgIHRoaXMuZW52aXJvbm1lbnREYXRhID0ge1xuICAgICAgICBncm91bmRDb2xvcjogXCIjNDU0NTQ1XCIsXG4gICAgICAgIGdyb3VuZENvbG9yMjogXCIjNWQ1ZDVkXCJcbiAgICAgIH07XG5cbiAgICAgIHZhciBncm91bmRjdHggPSBncm91bmRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICB2YXIgc2l6ZSA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3I7XG4gICAgICBncm91bmRjdHguZmlsbFJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSk7XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3IyO1xuICAgICAgdmFyIG51bSA9IE1hdGguZmxvb3IodGV4TWV0ZXJzIC8gMik7XG4gICAgICB2YXIgc3RlcCA9IHNpemUgLyAodGV4TWV0ZXJzIC8gMik7IC8vIDIgbWV0ZXJzID09IDxzdGVwPiBwaXhlbHNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtICsgMTsgaSArPSAyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtICsgMTsgaisrKSB7XG4gICAgICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgTWF0aC5mbG9vcigoaSArIChqICUgMikpICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKGogKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBncm91bmRUZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgdmFyIGdyb3VuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBtYXA6IGdyb3VuZFRleHR1cmVcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgc2NlbmUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjZW5lKS52YWx1ZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgLy9zY2VuZS5hZGQobWVzaCk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICByZXNvbHV0aW9uIC0gMSxcbiAgICAgICAgcmVzb2x1dGlvbiAtIDFcbiAgICAgICk7XG5cbiAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiB3aW5kb3cuZW50aXR5U2NlbmUgfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0gMHgzMzMzMzM7XG4gICAgICBjb25zdCBuZWFyID0gMjA7XG4gICAgICBjb25zdCBmYXIgPSAxMDA7XG4gICAgICBzY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKGNvbG9yLCBuZWFyLCBmYXIpO1xuICAgICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcik7XG4gICAgfSk7XG4gIH1cbn1cblxuRW52aXJvbm1lbnRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW52aXJvbm1lbnRzOiB7XG4gICAgY29tcG9uZW50czogW1NjZW5lLCBFbnZpcm9ubWVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXJDb250ZXh0LFxuICBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cixcbiAgVlJDb250cm9sbGVyLFxuICBPYmplY3QzRFxufSBmcm9tIFwiLi4vaW5kZXguanNcIjtcbmltcG9ydCB7IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5LmpzXCI7XG5cbnZhciBjb250cm9sbGVyTW9kZWxGYWN0b3J5ID0gbmV3IFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSgpO1xuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXIgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJDb250ZXh0LnJlc3VsdHNbMF0uZ2V0Q29tcG9uZW50KFxuICAgICAgV2ViR0xSZW5kZXJlckNvbnRleHRcbiAgICApLnZhbHVlO1xuXG4gICAgdGhpcy5xdWVyaWVzLmNvbnRyb2xsZXJzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb250cm9sbGVySWQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlcikuaWQ7XG4gICAgICB2YXIgY29udHJvbGxlciA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXIoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXIubmFtZSA9IFwiY29udHJvbGxlclwiO1xuXG4gICAgICB2YXIgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyKTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdyb3VwIH0pO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cikpIHtcbiAgICAgICAgdmFyIGJlaGF2aW91ciA9IGVudGl0eS5nZXRDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpO1xuICAgICAgICBPYmplY3Qua2V5cyhiZWhhdmlvdXIpLmZvckVhY2goZXZlbnROYW1lID0+IHtcbiAgICAgICAgICBpZiAoYmVoYXZpb3VyW2V2ZW50TmFtZV0pIHtcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGJlaGF2aW91cltldmVudE5hbWVdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICAvLyBUaGUgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5IHdpbGwgYXV0b21hdGljYWxseSBmZXRjaCBjb250cm9sbGVyIG1vZGVsc1xuICAgICAgLy8gdGhhdCBtYXRjaCB3aGF0IHRoZSB1c2VyIGlzIGhvbGRpbmcgYXMgY2xvc2VseSBhcyBwb3NzaWJsZS4gVGhlIG1vZGVsc1xuICAgICAgLy8gc2hvdWxkIGJlIGF0dGFjaGVkIHRvIHRoZSBvYmplY3QgcmV0dXJuZWQgZnJvbSBnZXRDb250cm9sbGVyR3JpcCBpblxuICAgICAgLy8gb3JkZXIgdG8gbWF0Y2ggdGhlIG9yaWVudGF0aW9uIG9mIHRoZSBoZWxkIGRldmljZS5cbiAgICAgIGxldCBjb250cm9sbGVyR3JpcCA9IHJlbmRlcmVyLnhyLmdldENvbnRyb2xsZXJHcmlwKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyR3JpcC5hZGQoXG4gICAgICAgIGNvbnRyb2xsZXJNb2RlbEZhY3RvcnkuY3JlYXRlQ29udHJvbGxlck1vZGVsKGNvbnRyb2xsZXJHcmlwKVxuICAgICAgKTtcbiAgICAgIGdyb3VwLmFkZChjb250cm9sbGVyR3JpcCk7XG4gICAgICAvKlxuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJ1ZmZlckdlb21ldHJ5KCk7XG4gICAgICBnZW9tZXRyeS5zZXRBdHRyaWJ1dGUoXG4gICAgICAgIFwicG9zaXRpb25cIixcbiAgICAgICAgbmV3IFRIUkVFLkZsb2F0MzJCdWZmZXJBdHRyaWJ1dGUoWzAsIDAsIDAsIDAsIDAsIC0xXSwgMylcbiAgICAgICk7XG5cbiAgICAgIHZhciBsaW5lID0gbmV3IFRIUkVFLkxpbmUoZ2VvbWV0cnkpO1xuICAgICAgbGluZS5uYW1lID0gXCJsaW5lXCI7XG4gICAgICBsaW5lLnNjYWxlLnogPSA1O1xuICAgICAgZ3JvdXAuYWRkKGxpbmUpO1xuXG4gICAgICBsZXQgZ2VvbWV0cnkyID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDAuMSwgMC4xLCAwLjEpO1xuICAgICAgbGV0IG1hdGVyaWFsMiA9IG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IGNvbG9yOiAweDAwZmYwMCB9KTtcbiAgICAgIGxldCBjdWJlID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnkyLCBtYXRlcmlhbDIpO1xuICAgICAgZ3JvdXAubmFtZSA9IFwiVlJDb250cm9sbGVyXCI7XG4gICAgICBncm91cC5hZGQoY3ViZSk7XG4qL1xuICAgIH0pO1xuXG4gICAgLy8gdGhpcy5jbGVhbkludGVyc2VjdGVkKCk7XG4gIH1cbn1cblxuVlJDb250cm9sbGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGNvbnRyb2xsZXJzOiB7XG4gICAgY29tcG9uZW50czogW1ZSQ29udHJvbGxlcl0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgICAgLy9jaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH0sXG4gIHJlbmRlcmVyQ29udGV4dDoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyQ29udGV4dF0sXG4gICAgbWFuZGF0b3J5OiB0cnVlXG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBFQ1NZIGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IENhbWVyYVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBNYXRlcmlhbFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanNcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QgfSBmcm9tIFwiLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBDYW1lcmFSaWcgfSBmcm9tIFwiLi9jb21wb25lbnRzL0NhbWVyYVJpZy5qc1wiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXIsXG4gIFNjZW5lLFxuICBBY3RpdmUsXG4gIFJlbmRlclBhc3MsXG4gIFRyYW5zZm9ybSxcbiAgQ2FtZXJhXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQod29ybGQpIHtcbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVHJhbnNmb3JtU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShDYW1lcmFTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKE1hdGVyaWFsU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZURlZmF1bHQod29ybGQgPSBuZXcgRUNTWS5Xb3JsZCgpLCBvcHRpb25zKSB7XG4gIGluaXQod29ybGQpO1xuXG4gIGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHt9O1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG5ldyBUSFJFRS5TY2VuZSgpIH0pO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgYXI6IG9wdGlvbnMuYXIsXG4gICAgdnI6IG9wdGlvbnMudnIsXG4gICAgYW5pbWF0aW9uTG9vcDogYW5pbWF0aW9uTG9vcFxuICB9KTtcblxuICAvLyBjYW1lcmEgcmlnICYgY29udHJvbGxlcnNcbiAgdmFyIGNhbWVyYSA9IG51bGwsXG4gICAgY2FtZXJhUmlnID0gbnVsbDtcblxuICBpZiAob3B0aW9ucy5hciB8fCBvcHRpb25zLnZyKSB7XG4gICAgY2FtZXJhUmlnID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmFSaWcpXG4gICAgICAuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogc2NlbmUgfSk7XG4gIH1cblxuICB7XG4gICAgY2FtZXJhID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmEsIHtcbiAgICAgICAgZm92OiA5MCxcbiAgICAgICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgbmVhcjogMC4xLFxuICAgICAgICBmYXI6IDEwMCxcbiAgICAgICAgbGF5ZXJzOiAxLFxuICAgICAgICBoYW5kbGVSZXNpemU6IHRydWVcbiAgICAgIH0pXG4gICAgICAuYWRkQ29tcG9uZW50KFRyYW5zZm9ybSlcbiAgICAgIC5hZGRDb21wb25lbnQoQWN0aXZlKTtcbiAgfVxuXG4gIGxldCByZW5kZXJQYXNzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlclBhc3MsIHtcbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICBjYW1lcmFSaWcsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHJlbmRlclBhc3NcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiVEhSRUUuVmVjdG9yMiIsIlRIUkVFLlZlY3RvcjMiLCJUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiLCJUSFJFRS5Gb250TG9hZGVyIiwiVEhSRUUuVGV4dEdlb21ldHJ5IiwiVEhSRUUuUmVwZWF0V3JhcHBpbmciLCJUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuRm9nIiwiVEhSRUUuQ29sb3IiLCJFQ1NZLldvcmxkIiwiVEhSRUUuQ2xvY2siLCJUSFJFRS5TY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBTyxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztHQUNwQjtDQUNGOztBQ1JNLE1BQU0sTUFBTSxDQUFDO0VBQ2xCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7SUFDaEIsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7SUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7R0FDMUI7O0VBRUQsS0FBSyxHQUFHLEVBQUU7Q0FDWDs7QUNYTSxNQUFNLFNBQVMsQ0FBQztFQUNyQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztJQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztHQUNwQjtDQUNGOztBQ1ZNLE1BQU0sU0FBUyxDQUFDO0VBQ3JCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUNkOztFQUVELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0dBQ3BCO0NBQ0Y7O0FDUE0sTUFBTSxRQUFRLFNBQVMsWUFB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

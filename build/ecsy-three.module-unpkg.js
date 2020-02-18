import { TagComponent, System, Not, SystemStateComponent, World } from 'https://unpkg.com/ecsy@0.2.2/build/ecsy.module.js';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, Clock, Scene as Scene$1 } from 'https://unpkg.com/three@0.113.2/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.113.2/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'https://unpkg.com/troika-3d-text@0.17.1/dist/textmesh-standalone.esm.js?module';
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
        if (component.onLoaded) {
          component.onLoaded(gltf.scene);
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
    components: [GLTFModel],
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUtdW5wa2cuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL01hdGVyaWFsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JlbmRlclBhc3MuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WUkNvbnRyb2xsZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU0RGVGV4dFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1ZSQ29udHJvbGxlclN5c3RlbS5qcyIsIi4uL3NyYy9pbml0aWFsaXplLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBY3RpdmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZvdiA9IDQ1O1xuICAgIHRoaXMuYXNwZWN0ID0gMTtcbiAgICB0aGlzLm5lYXIgPSAwLjE7XG4gICAgdGhpcy5mYXIgPSAxMDAwO1xuICAgIHRoaXMubGF5ZXJzID0gMDtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRydWU7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2FtZXJhUmlnIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5sZWZ0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5yaWdodEhhbmQgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIERyYWdnYWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBEcmFnZ2luZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiZXhwb3J0IGNsYXNzIEVudmlyb25tZW50IHtcbiAgcmVzZXQoKSB7fVxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIHRoaXMucHJlc2V0ID0gXCJkZWZhdWx0XCI7XG4gICAgdGhpcy5zZWVkID0gMTtcbiAgICB0aGlzLnNreVR5cGUgPSBcImF0bW9zcGhlcmVcIjtcbiAgICB0aGlzLnNreUNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmhvcml6b25Db2xvciA9IFwiXCI7XG4gICAgdGhpcy5saWdodGluZyA9IFwiZGlzdGFudFwiO1xuICAgIHRoaXMuc2hhZG93ID0gZmFsc2U7XG4gICAgdGhpcy5zaGFkb3dTaXplID0gMTA7XG4gICAgdGhpcy5saWdodFBvc2l0aW9uID0geyB4OiAwLCB5OiAxLCB6OiAtMC4yIH07XG4gICAgdGhpcy5mb2cgPSAwO1xuXG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMucGxheUFyZWEgPSAxO1xuXG4gICAgdGhpcy5ncm91bmQgPSBcImZsYXRcIjtcbiAgICB0aGlzLmdyb3VuZFlTY2FsZSA9IDM7XG4gICAgdGhpcy5ncm91bmRUZXh0dXJlID0gXCJub25lXCI7XG4gICAgdGhpcy5ncm91bmRDb2xvciA9IFwiIzU1M2UzNVwiO1xuICAgIHRoaXMuZ3JvdW5kQ29sb3IyID0gXCIjNjk0NDM5XCI7XG5cbiAgICB0aGlzLmRyZXNzaW5nID0gXCJub25lXCI7XG4gICAgdGhpcy5kcmVzc2luZ0Ftb3VudCA9IDEwO1xuICAgIHRoaXMuZHJlc3NpbmdDb2xvciA9IFwiIzc5NTQ0OVwiO1xuICAgIHRoaXMuZHJlc3NpbmdTY2FsZSA9IDU7XG4gICAgdGhpcy5kcmVzc2luZ1ZhcmlhbmNlID0geyB4OiAxLCB5OiAxLCB6OiAxIH07XG4gICAgdGhpcy5kcmVzc2luZ1VuaWZvcm1TY2FsZSA9IHRydWU7XG4gICAgdGhpcy5kcmVzc2luZ09uUGxheUFyZWEgPSAwO1xuXG4gICAgdGhpcy5ncmlkID0gXCJub25lXCI7XG4gICAgdGhpcy5ncmlkQ29sb3IgPSBcIiNjY2NcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdlb21ldHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR0xURk1vZGVsIHt9XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNvbnN0IFNJREVTID0ge1xuICBmcm9udDogMCxcbiAgYmFjazogMSxcbiAgZG91YmxlOiAyXG59O1xuXG5leHBvcnQgY29uc3QgU0hBREVSUyA9IHtcbiAgc3RhbmRhcmQ6IDAsXG4gIGZsYXQ6IDFcbn07XG5cbmV4cG9ydCBjb25zdCBCTEVORElORyA9IHtcbiAgbm9ybWFsOiAwLFxuICBhZGRpdGl2ZTogMSxcbiAgc3VidHJhY3RpdmU6IDIsXG4gIG11bHRpcGx5OiAzXG59O1xuXG5leHBvcnQgY29uc3QgVkVSVEVYX0NPTE9SUyA9IHtcbiAgbm9uZTogMCxcbiAgZmFjZTogMSxcbiAgdmVydGV4OiAyXG59O1xuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbG9yID0gMHhmZjAwMDA7XG4gICAgdGhpcy5hbHBoYVRlc3QgPSAwO1xuICAgIHRoaXMuZGVwdGhUZXN0ID0gdHJ1ZTtcbiAgICB0aGlzLmRlcHRoV3JpdGUgPSB0cnVlO1xuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm5wb3QgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldCA9IG5ldyBUSFJFRS5WZWN0b3IyKCk7XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xuICAgIHRoaXMucmVwZWF0ID0gbmV3IFRIUkVFLlZlY3RvcjIoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmNvbG9yID0gMHhmZjAwMDA7XG4gICAgdGhpcy5hbHBoYVRlc3QgPSAwO1xuICAgIHRoaXMuZGVwdGhUZXN0ID0gdHJ1ZTtcbiAgICB0aGlzLmRlcHRoV3JpdGUgPSB0cnVlO1xuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLm5wb3QgPSBmYWxzZTtcbiAgICB0aGlzLm9mZnNldC5zZXQoMCwgMCk7XG4gICAgdGhpcy5vcGFjaXR5ID0gMS4wO1xuICAgIHRoaXMucmVwZWF0LnNldCgxLCAxKTtcbiAgICB0aGlzLnNoYWRlciA9IFNIQURFUlMuc3RhbmRhcmQ7XG4gICAgdGhpcy5zaWRlID0gU0lERVMuZnJvbnQ7XG4gICAgdGhpcy50cmFuc3BhcmVudCA9IGZhbHNlO1xuICAgIHRoaXMudmVydGV4Q29sb3JzID0gVkVSVEVYX0NPTE9SUy5ub25lO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5ibGVuZGluZyA9IEJMRU5ESU5HLm5vcm1hbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE9iamVjdDNEIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3kge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3lCb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5jb3B5KHNyYy5wb3NpdGlvbik7XG4gICAgdGhpcy5yb3RhdGlvbi5jb3B5KHNyYy5yb3RhdGlvbik7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpc2libGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgICB0aGlzLnRleHRBbGlnbiA9IFwibGVmdFwiOyAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ11cbiAgICB0aGlzLmFuY2hvciA9IFwiY2VudGVyXCI7IC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICAgIHRoaXMuYmFzZWxpbmUgPSBcImNlbnRlclwiOyAvLyBbJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJ11cbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgdGhpcy5mb250ID0gXCJodHRwczovL2NvZGUuY2RuLm1vemlsbGEubmV0L2ZvbnRzL3R0Zi9aaWxsYVNsYWItU2VtaUJvbGQudHRmXCI7XG4gICAgdGhpcy5mb250U2l6ZSA9IDAuMjtcbiAgICB0aGlzLmxldHRlclNwYWNpbmcgPSAwO1xuICAgIHRoaXMubGluZUhlaWdodCA9IDA7XG4gICAgdGhpcy5tYXhXaWR0aCA9IEluZmluaXR5O1xuICAgIHRoaXMub3ZlcmZsb3dXcmFwID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnYnJlYWstd29yZCddXG4gICAgdGhpcy53aGl0ZVNwYWNlID0gXCJub3JtYWxcIjsgLy8gWydub3JtYWwnLCAnbm93cmFwJ11cbiAgICB0aGlzLm9wYWNpdHkgPSAxO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNlbGVjdCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zZWxlY3RlbmQgPSBudWxsO1xuXG4gICAgdGhpcy5jb25uZWN0ZWQgPSBudWxsO1xuXG4gICAgdGhpcy5zcXVlZXplID0gbnVsbDtcbiAgICB0aGlzLnNxdWVlemVzdGFydCA9IG51bGw7XG4gICAgdGhpcy5zcXVlZXplZW5kID0gbnVsbDtcbiAgfVxufSIsImV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52ciA9IGZhbHNlO1xuICAgIHRoaXMuYXIgPSBmYWxzZTtcbiAgICB0aGlzLmFudGlhbGlhcyA9IHRydWU7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUgPSB0cnVlO1xuICAgIHRoaXMuc2hhZG93TWFwID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cblxuLypcbmV4cG9ydCBjb25zdCBXZWJHTFJlbmRlcmVyID0gY3JlYXRlQ29tcG9uZW50Q2xhc3MoXG4gIHtcbiAgICB2cjogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIHNoYWRvd01hcDogeyBkZWZhdWx0OiBmYWxzZSB9XG4gIH0sXG4gIFwiV2ViR0xSZW5kZXJlclwiXG4pO1xuKi9cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtLCBOb3QsIFN5c3RlbVN0YXRlQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIE1hdGVyaWFsLFxuICBPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmNsYXNzIE1hdGVyaWFsSW5zdGFuY2UgZXh0ZW5kcyBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy52YWx1ZSA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuXG5leHBvcnQgY2xhc3MgTWF0ZXJpYWxTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5uZXcucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zdCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE1hdGVyaWFsKTtcbiAgICB9KTtcbiAgfVxufVxuXG5NYXRlcmlhbFN5c3RlbS5xdWVyaWVzID0ge1xuICBuZXc6IHtcbiAgICBjb21wb25lbnRzOiBbTWF0ZXJpYWwsIE5vdChNYXRlcmlhbEluc3RhbmNlKV1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIEdlb21ldHJ5LFxuICBPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbi8qKlxuICogQ3JlYXRlIGEgTWVzaCBiYXNlZCBvbiB0aGUgW0dlb21ldHJ5XSBjb21wb25lbnQgYW5kIGF0dGFjaCBpdCB0byB0aGUgZW50aXR5IHVzaW5nIGEgW09iamVjdDNEXSBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBSZW1vdmVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5yZW1vdmUob2JqZWN0KTtcbiAgICB9KTtcblxuICAgIC8vIEFkZGVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdlb21ldHJ5KTtcblxuICAgICAgdmFyIGdlb21ldHJ5O1xuICAgICAgc3dpdGNoIChjb21wb25lbnQucHJpbWl0aXZlKSB7XG4gICAgICAgIGNhc2UgXCJ0b3J1c1wiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpdXMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJlLFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaWFsU2VnbWVudHMsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC50dWJ1bGFyU2VnbWVudHNcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3BoZXJlXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeShjb21wb25lbnQucmFkaXVzLCAxKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJib3hcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LndpZHRoLFxuICAgICAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0LFxuICAgICAgICAgICAgICBjb21wb25lbnQuZGVwdGhcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgY29sb3IgPVxuICAgICAgICBjb21wb25lbnQucHJpbWl0aXZlID09PSBcInRvcnVzXCIgPyAweDk5OTkwMCA6IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcblxuICAgICAgICAvKlxuICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChNYXRlcmlhbCkpIHtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgIH1cbiovXG5cbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHZhciBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChUcmFuc2Zvcm0pKSB7XG4gICAgICAgIHZhciB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICAgIGlmICh0cmFuc2Zvcm0ucm90YXRpb24pIHtcbiAgICAgICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KEVsZW1lbnQpICYmICFlbnRpdHkuaGFzQ29tcG9uZW50KERyYWdnYWJsZSkpIHtcbiAgICAgIC8vICAgICAgICBvYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0KDB4MzMzMzMzKTtcbiAgICAgIC8vICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuR2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR2VvbWV0cnldLCAvLyBAdG9kbyBUcmFuc2Zvcm06IEFzIG9wdGlvbmFsLCBob3cgdG8gZGVmaW5lIGl0P1xuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcblxuLy8gQHRvZG8gVXNlIHBhcmFtZXRlciBhbmQgbG9hZGVyIG1hbmFnZXJcbnZhciBsb2FkZXIgPSBuZXcgR0xURkxvYWRlcigpLnNldFBhdGgoXCIvYXNzZXRzL1wiKTtcblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHTFRGTW9kZWwpO1xuXG4gICAgICBsb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBnbHRmID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGVudk1hcDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuKi9cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ2x0Zi5zY2VuZSB9KTtcbiAgICAgICAgaWYgKGNvbXBvbmVudC5vbkxvYWRlZCkge1xuICAgICAgICAgIGNvbXBvbmVudC5vbkxvYWRlZChnbHRmLnNjZW5lKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCwgdHJ1ZSkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG5cbiAgfVxufVxuXG5HTFRGTG9hZGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dMVEZNb2RlbF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTa3lCb3gsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGxldCBza3lib3ggPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNreUJveCk7XG5cbiAgICAgIGxldCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICAgZ2VvbWV0cnkuc2NhbGUoMSwgMSwgLTEpO1xuXG4gICAgICBpZiAoc2t5Ym94LnR5cGUgPT09IFwiY3ViZW1hcC1zdGVyZW9cIikge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoc2t5Ym94LnRleHR1cmVVcmwsIDEyKTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzKTtcbiAgICAgICAgc2t5Qm94LmxheWVycy5zZXQoMSk7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3gpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzUi5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveFIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICAgIHNreUJveFIubGF5ZXJzLnNldCgyKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveFIpO1xuXG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdyb3VwIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biBza3lib3ggdHlwZTogXCIsIHNreWJveC50eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5Ta3lCb3hTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbU2t5Qm94LCBOb3QoT2JqZWN0M0QpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZpc2libGUsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2liaWxpdHlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBwcm9jZXNzVmlzaWJpbGl0eShlbnRpdGllcykge1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS52aXNpYmxlID0gZW50aXR5LmdldENvbXBvbmVudChcbiAgICAgICAgVmlzaWJsZVxuICAgICAgKS52YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQpO1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQpO1xuICB9XG59XG5cblZpc2liaWxpdHlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVmlzaWJsZSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBUZXh0TWVzaCB9IGZyb20gXCJ0cm9pa2EtM2QtdGV4dC9kaXN0L3RleHRtZXNoLXN0YW5kYWxvbmUuZXNtLmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCwgVGV4dCB9IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuXG5jb25zdCBhbmNob3JNYXBwaW5nID0ge1xuICBsZWZ0OiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgcmlnaHQ6IDFcbn07XG5jb25zdCBiYXNlbGluZU1hcHBpbmcgPSB7XG4gIHRvcDogMCxcbiAgY2VudGVyOiAwLjUsXG4gIGJvdHRvbTogMVxufTtcblxuZXhwb3J0IGNsYXNzIFNERlRleHRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICB1cGRhdGVUZXh0KHRleHRNZXNoLCB0ZXh0Q29tcG9uZW50KSB7XG4gICAgdGV4dE1lc2gudGV4dCA9IHRleHRDb21wb25lbnQudGV4dDtcbiAgICB0ZXh0TWVzaC50ZXh0QWxpZ24gPSB0ZXh0Q29tcG9uZW50LnRleHRBbGlnbjtcbiAgICB0ZXh0TWVzaC5hbmNob3JbMF0gPSBhbmNob3JNYXBwaW5nW3RleHRDb21wb25lbnQuYW5jaG9yXTtcbiAgICB0ZXh0TWVzaC5hbmNob3JbMV0gPSBiYXNlbGluZU1hcHBpbmdbdGV4dENvbXBvbmVudC5iYXNlbGluZV07XG4gICAgdGV4dE1lc2guY29sb3IgPSB0ZXh0Q29tcG9uZW50LmNvbG9yO1xuICAgIHRleHRNZXNoLmZvbnQgPSB0ZXh0Q29tcG9uZW50LmZvbnQ7XG4gICAgdGV4dE1lc2guZm9udFNpemUgPSB0ZXh0Q29tcG9uZW50LmZvbnRTaXplO1xuICAgIHRleHRNZXNoLmxldHRlclNwYWNpbmcgPSB0ZXh0Q29tcG9uZW50LmxldHRlclNwYWNpbmcgfHwgMDtcbiAgICB0ZXh0TWVzaC5saW5lSGVpZ2h0ID0gdGV4dENvbXBvbmVudC5saW5lSGVpZ2h0IHx8IG51bGw7XG4gICAgdGV4dE1lc2gub3ZlcmZsb3dXcmFwID0gdGV4dENvbXBvbmVudC5vdmVyZmxvd1dyYXA7XG4gICAgdGV4dE1lc2gud2hpdGVTcGFjZSA9IHRleHRDb21wb25lbnQud2hpdGVTcGFjZTtcbiAgICB0ZXh0TWVzaC5tYXhXaWR0aCA9IHRleHRDb21wb25lbnQubWF4V2lkdGg7XG4gICAgdGV4dE1lc2gubWF0ZXJpYWwub3BhY2l0eSA9IHRleHRDb21wb25lbnQub3BhY2l0eTtcbiAgICB0ZXh0TWVzaC5zeW5jKCk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHZhciBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcztcblxuICAgIGVudGl0aWVzLmFkZGVkLmZvckVhY2goZSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGUuZ2V0Q29tcG9uZW50KFRleHQpO1xuXG4gICAgICBjb25zdCB0ZXh0TWVzaCA9IG5ldyBUZXh0TWVzaCgpO1xuICAgICAgdGV4dE1lc2gubmFtZSA9IFwidGV4dE1lc2hcIjtcbiAgICAgIHRleHRNZXNoLmFuY2hvciA9IFswLCAwXTtcbiAgICAgIHRleHRNZXNoLnJlbmRlck9yZGVyID0gMTsgLy9icnV0ZS1mb3JjZSBmaXggZm9yIHVnbHkgYW50aWFsaWFzaW5nLCBzZWUgaXNzdWUgIzY3XG4gICAgICB0aGlzLnVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpO1xuICAgICAgZS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IHRleHRNZXNoIH0pO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIHRleHRNZXNoID0gb2JqZWN0M0QuZ2V0T2JqZWN0QnlOYW1lKFwidGV4dE1lc2hcIik7XG4gICAgICB0ZXh0TWVzaC5kaXNwb3NlKCk7XG4gICAgICBvYmplY3QzRC5yZW1vdmUodGV4dE1lc2gpO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMuY2hhbmdlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgaWYgKG9iamVjdDNEIGluc3RhbmNlb2YgVGV4dE1lc2gpIHtcbiAgICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KG9iamVjdDNELCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5TREZUZXh0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RleHRdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhLFxuICBBY3RpdmUsXG4gIFdlYkdMUmVuZGVyZXIsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFZSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9WUkJ1dHRvbi5qc1wiO1xuaW1wb3J0IHsgQVJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL0FSQnV0dG9uLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVycyA9IHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cztcbiAgICByZW5kZXJlcnMuZm9yRWFjaChyZW5kZXJlckVudGl0eSA9PiB7XG4gICAgICB2YXIgcmVuZGVyZXIgPSByZW5kZXJlckVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlclBhc3Nlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIHBhc3MgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFJlbmRlclBhc3MpO1xuICAgICAgICB2YXIgc2NlbmUgPSBwYXNzLnNjZW5lLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgICAgdGhpcy5xdWVyaWVzLmFjdGl2ZUNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYUVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNhbWVyYSA9IGNhbWVyYUVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGNvbXBvbmVudC5zaGFkb3dNYXA7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIgfHwgY29tcG9uZW50LmFyKSB7XG4gICAgICAgIHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFZSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVHJhbnNmb3JtLCBQb3NpdGlvbiwgUGFyZW50LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgdmFyIHBhcmVudEVudGl0eSA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZTtcbiAgICAgIGlmIChwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEKSkge1xuICAgICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBwYXJlbnRFbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgcGFyZW50T2JqZWN0M0QuYWRkKGNoaWxkT2JqZWN0M0QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICBsZXQgcG9zaXRpb25zID0gdGhpcy5xdWVyaWVzLnBvc2l0aW9ucztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHBvc2l0aW9ucy5hZGRlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHBvc2l0aW9uKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHBvc2l0aW9ucy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmNoYW5nZWRbaV07XG4gICAgICBsZXQgcG9zaXRpb24gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBvc2l0aW9uKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50OiB7XG4gICAgY29tcG9uZW50czogW1BhcmVudCwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIHRyYW5zZm9ybXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0QsIFRyYW5zZm9ybV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtUcmFuc2Zvcm1dXG4gICAgfVxuICB9LFxuICBwb3NpdGlvbnM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0QsIFBvc2l0aW9uXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Bvc2l0aW9uXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IENhbWVyYSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYSA9PiB7XG4gICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNhbWVyYS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgY2FtZXJhLmdldE11dGFibGVDb21wb25lbnQoQ2FtZXJhKS5hc3BlY3QgPVxuICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5jaGFuZ2VkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNoYW5nZWRbaV07XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICBsZXQgY2FtZXJhM2QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIGlmIChjYW1lcmEzZC5hc3BlY3QgIT09IGNvbXBvbmVudC5hc3BlY3QpIHtcbiAgICAgICAgY2FtZXJhM2QuYXNwZWN0ID0gY29tcG9uZW50LmFzcGVjdDtcbiAgICAgICAgY2FtZXJhM2QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgICAgLy8gQHRvZG8gRG8gaXQgZm9yIHRoZSByZXN0IG9mIHRoZSB2YWx1ZXNcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhc1VuaW5pdGlhbGl6ZWQucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuXG4gICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICBjb21wb25lbnQuZm92LFxuICAgICAgICBjb21wb25lbnQuYXNwZWN0LFxuICAgICAgICBjb21wb25lbnQubmVhcixcbiAgICAgICAgY29tcG9uZW50LmZhclxuICAgICAgKTtcblxuICAgICAgY2FtZXJhLmxheWVycy5lbmFibGUoY29tcG9uZW50LmxheWVycyk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGNhbWVyYSB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5DYW1lcmFTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhc1VuaW5pdGlhbGl6ZWQ6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBOb3QoT2JqZWN0M0QpXVxuICB9LFxuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW0NhbWVyYV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNEXCI7XG5pbXBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9UZXh0R2VvbWV0cnlcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgbG9hZGVyLmxvYWQoXCIvYXNzZXRzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uXCIsIGZvbnQgPT4ge1xuICAgICAgdGhpcy5mb250ID0gZm9udDtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgfSk7XG5cbiAgICB2YXIgYWRkZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG4gICAgYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbG9yID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgY29sb3IgPSAweGZmZmZmZjtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBtZXNoIH0pO1xuICAgIH0pO1xuICB9XG59XG5cblRleHRHZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0R2VvbWV0cnldLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50LCBTY2VuZSwgT2JqZWN0M0QsIEVudmlyb25tZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIEVudmlyb25tZW50U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW52aXJvbm1lbnRzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIC8vIHN0YWdlIGdyb3VuZCBkaWFtZXRlciAoYW5kIHNreSByYWRpdXMpXG4gICAgICB2YXIgU1RBR0VfU0laRSA9IDIwMDtcblxuICAgICAgLy8gY3JlYXRlIGdyb3VuZFxuICAgICAgLy8gdXBkYXRlIGdyb3VuZCwgcGxheWFyZWEgYW5kIGdyaWQgdGV4dHVyZXMuXG4gICAgICB2YXIgZ3JvdW5kUmVzb2x1dGlvbiA9IDIwNDg7XG4gICAgICB2YXIgdGV4TWV0ZXJzID0gMjA7IC8vIGdyb3VuZCB0ZXh0dXJlIG9mIDIwIHggMjAgbWV0ZXJzXG4gICAgICB2YXIgdGV4UmVwZWF0ID0gU1RBR0VfU0laRSAvIHRleE1ldGVycztcblxuICAgICAgdmFyIHJlc29sdXRpb24gPSA2NDsgLy8gbnVtYmVyIG9mIGRpdmlzaW9ucyBvZiB0aGUgZ3JvdW5kIG1lc2hcblxuICAgICAgdmFyIGdyb3VuZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBncm91bmRDYW52YXMud2lkdGggPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kQ2FudmFzLmhlaWdodCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICB2YXIgZ3JvdW5kVGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGdyb3VuZENhbnZhcyk7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLnJlcGVhdC5zZXQodGV4UmVwZWF0LCB0ZXhSZXBlYXQpO1xuXG4gICAgICB0aGlzLmVudmlyb25tZW50RGF0YSA9IHtcbiAgICAgICAgZ3JvdW5kQ29sb3I6IFwiIzQ1NDU0NVwiLFxuICAgICAgICBncm91bmRDb2xvcjI6IFwiIzVkNWQ1ZFwiXG4gICAgICB9O1xuXG4gICAgICB2YXIgZ3JvdW5kY3R4ID0gZ3JvdW5kQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgdmFyIHNpemUgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KDAsIDAsIHNpemUsIHNpemUpO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yMjtcbiAgICAgIHZhciBudW0gPSBNYXRoLmZsb29yKHRleE1ldGVycyAvIDIpO1xuICAgICAgdmFyIHN0ZXAgPSBzaXplIC8gKHRleE1ldGVycyAvIDIpOyAvLyAyIG1ldGVycyA9PSA8c3RlcD4gcGl4ZWxzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bSArIDE7IGkgKz0gMikge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bSArIDE7IGorKykge1xuICAgICAgICAgIGdyb3VuZGN0eC5maWxsUmVjdChcbiAgICAgICAgICAgIE1hdGguZmxvb3IoKGkgKyAoaiAlIDIpKSAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihqICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ3JvdW5kVGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgIHZhciBncm91bmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgbWFwOiBncm91bmRUZXh0dXJlXG4gICAgICB9KTtcblxuICAgICAgbGV0IHNjZW5lID0gZW50aXR5LmdldENvbXBvbmVudChTY2VuZSkudmFsdWUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIC8vc2NlbmUuYWRkKG1lc2gpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICBTVEFHRV9TSVpFICsgMixcbiAgICAgICAgcmVzb2x1dGlvbiAtIDEsXG4gICAgICAgIHJlc29sdXRpb24gLSAxXG4gICAgICApO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIGdyb3VuZE1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogd2luZG93LmVudGl0eVNjZW5lIH0pO1xuXG4gICAgICBjb25zdCBjb2xvciA9IDB4MzMzMzMzO1xuICAgICAgY29uc3QgbmVhciA9IDIwO1xuICAgICAgY29uc3QgZmFyID0gMTAwO1xuICAgICAgc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZyhjb2xvciwgbmVhciwgZmFyKTtcbiAgICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoY29sb3IpO1xuICAgIH0pO1xuICB9XG59XG5cbkVudmlyb25tZW50U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudmlyb25tZW50czoge1xuICAgIGNvbXBvbmVudHM6IFtTY2VuZSwgRW52aXJvbm1lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyQ29udGV4dCxcbiAgVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIsXG4gIFZSQ29udHJvbGxlcixcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5pbXBvcnQgeyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1hSQ29udHJvbGxlck1vZGVsRmFjdG9yeS5qc1wiO1xuXG52YXIgY29udHJvbGxlck1vZGVsRmFjdG9yeSA9IG5ldyBYUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkoKTtcblxuZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVyID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVyQ29udGV4dC5yZXN1bHRzWzBdLmdldENvbXBvbmVudChcbiAgICAgIFdlYkdMUmVuZGVyZXJDb250ZXh0XG4gICAgKS52YWx1ZTtcblxuICAgIHRoaXMucXVlcmllcy5jb250cm9sbGVycy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29udHJvbGxlcklkID0gZW50aXR5LmdldENvbXBvbmVudChWUkNvbnRyb2xsZXIpLmlkO1xuICAgICAgdmFyIGNvbnRyb2xsZXIgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyKGNvbnRyb2xsZXJJZCk7XG4gICAgICBjb250cm9sbGVyLm5hbWUgPSBcImNvbnRyb2xsZXJcIjtcblxuICAgICAgdmFyIGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlcik7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBncm91cCB9KTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVlJDb250cm9sbGVyQmFzaWNCZWhhdmlvdXIpKSB7XG4gICAgICAgIHZhciBiZWhhdmlvdXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKTtcbiAgICAgICAgT2JqZWN0LmtleXMoYmVoYXZpb3VyKS5mb3JFYWNoKGV2ZW50TmFtZSA9PiB7XG4gICAgICAgICAgaWYgKGJlaGF2aW91cltldmVudE5hbWVdKSB7XG4gICAgICAgICAgICBjb250cm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBiZWhhdmlvdXJbZXZlbnROYW1lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgLy8gVGhlIFhSQ29udHJvbGxlck1vZGVsRmFjdG9yeSB3aWxsIGF1dG9tYXRpY2FsbHkgZmV0Y2ggY29udHJvbGxlciBtb2RlbHNcbiAgICAgIC8vIHRoYXQgbWF0Y2ggd2hhdCB0aGUgdXNlciBpcyBob2xkaW5nIGFzIGNsb3NlbHkgYXMgcG9zc2libGUuIFRoZSBtb2RlbHNcbiAgICAgIC8vIHNob3VsZCBiZSBhdHRhY2hlZCB0byB0aGUgb2JqZWN0IHJldHVybmVkIGZyb20gZ2V0Q29udHJvbGxlckdyaXAgaW5cbiAgICAgIC8vIG9yZGVyIHRvIG1hdGNoIHRoZSBvcmllbnRhdGlvbiBvZiB0aGUgaGVsZCBkZXZpY2UuXG4gICAgICBsZXQgY29udHJvbGxlckdyaXAgPSByZW5kZXJlci54ci5nZXRDb250cm9sbGVyR3JpcChjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlckdyaXAuYWRkKFxuICAgICAgICBjb250cm9sbGVyTW9kZWxGYWN0b3J5LmNyZWF0ZUNvbnRyb2xsZXJNb2RlbChjb250cm9sbGVyR3JpcClcbiAgICAgICk7XG4gICAgICBncm91cC5hZGQoY29udHJvbGxlckdyaXApO1xuICAgICAgLypcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5CdWZmZXJHZW9tZXRyeSgpO1xuICAgICAgZ2VvbWV0cnkuc2V0QXR0cmlidXRlKFxuICAgICAgICBcInBvc2l0aW9uXCIsXG4gICAgICAgIG5ldyBUSFJFRS5GbG9hdDMyQnVmZmVyQXR0cmlidXRlKFswLCAwLCAwLCAwLCAwLCAtMV0sIDMpXG4gICAgICApO1xuXG4gICAgICB2YXIgbGluZSA9IG5ldyBUSFJFRS5MaW5lKGdlb21ldHJ5KTtcbiAgICAgIGxpbmUubmFtZSA9IFwibGluZVwiO1xuICAgICAgbGluZS5zY2FsZS56ID0gNTtcbiAgICAgIGdyb3VwLmFkZChsaW5lKTtcblxuICAgICAgbGV0IGdlb21ldHJ5MiA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgwLjEsIDAuMSwgMC4xKTtcbiAgICAgIGxldCBtYXRlcmlhbDIgPSBuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBjb2xvcjogMHgwMGZmMDAgfSk7XG4gICAgICBsZXQgY3ViZSA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5MiwgbWF0ZXJpYWwyKTtcbiAgICAgIGdyb3VwLm5hbWUgPSBcIlZSQ29udHJvbGxlclwiO1xuICAgICAgZ3JvdXAuYWRkKGN1YmUpO1xuKi9cbiAgICB9KTtcblxuICAgIC8vIHRoaXMuY2xlYW5JbnRlcnNlY3RlZCgpO1xuICB9XG59XG5cblZSQ29udHJvbGxlclN5c3RlbS5xdWVyaWVzID0ge1xuICBjb250cm9sbGVyczoge1xuICAgIGNvbXBvbmVudHM6IFtWUkNvbnRyb2xsZXJdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICAgIC8vY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9LFxuICByZW5kZXJlckNvbnRleHQ6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIG1hbmRhdG9yeTogdHJ1ZVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgRUNTWSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmltcG9ydCB7IFRyYW5zZm9ybVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBDYW1lcmFTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgTWF0ZXJpYWxTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL01hdGVyaWFsU3lzdGVtLmpzXCI7XG5cbmltcG9ydCB7IFdlYkdMUmVuZGVyZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhUmlnIH0gZnJvbSBcIi4vY29tcG9uZW50cy9DYW1lcmFSaWcuanNcIjtcbmltcG9ydCB7IFBhcmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyLFxuICBTY2VuZSxcbiAgQWN0aXZlLFxuICBSZW5kZXJQYXNzLFxuICBUcmFuc2Zvcm0sXG4gIENhbWVyYVxufSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KHdvcmxkKSB7XG4gIHdvcmxkXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFRyYW5zZm9ybVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oQ2FtZXJhU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShNYXRlcmlhbFN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oV2ViR0xSZW5kZXJlclN5c3RlbSwgeyBwcmlvcml0eTogMSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVEZWZhdWx0KHdvcmxkID0gbmV3IEVDU1kuV29ybGQoKSwgb3B0aW9ucykge1xuICBpbml0KHdvcmxkKTtcblxuICBjb25zdCBERUZBVUxUX09QVElPTlMgPSB7fTtcblxuICBvcHRpb25zID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9PUFRJT05TLCBvcHRpb25zKTtcblxuICBsZXQgYW5pbWF0aW9uTG9vcCA9IG9wdGlvbnMuYW5pbWF0aW9uTG9vcDtcbiAgaWYgKCFhbmltYXRpb25Mb29wKSB7XG4gICAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcbiAgICBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xuICAgICAgd29ybGQuZXhlY3V0ZShjbG9jay5nZXREZWx0YSgpLCBjbG9jay5lbGFwc2VkVGltZSk7XG4gICAgfTtcbiAgfVxuXG4gIGxldCBzY2VuZSA9IHdvcmxkXG4gICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgLmFkZENvbXBvbmVudChTY2VuZSlcbiAgICAuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBuZXcgVEhSRUUuU2NlbmUoKSB9KTtcblxuICBsZXQgcmVuZGVyZXIgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlciwge1xuICAgIGFyOiBvcHRpb25zLmFyLFxuICAgIHZyOiBvcHRpb25zLnZyLFxuICAgIGFuaW1hdGlvbkxvb3A6IGFuaW1hdGlvbkxvb3BcbiAgfSk7XG5cbiAgLy8gY2FtZXJhIHJpZyAmIGNvbnRyb2xsZXJzXG4gIHZhciBjYW1lcmEgPSBudWxsLFxuICAgIGNhbWVyYVJpZyA9IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMuYXIgfHwgb3B0aW9ucy52cikge1xuICAgIGNhbWVyYVJpZyA9IHdvcmxkXG4gICAgICAuY3JlYXRlRW50aXR5KClcbiAgICAgIC5hZGRDb21wb25lbnQoQ2FtZXJhUmlnKVxuICAgICAgLmFkZENvbXBvbmVudChQYXJlbnQsIHsgdmFsdWU6IHNjZW5lIH0pO1xuICB9XG5cbiAge1xuICAgIGNhbWVyYSA9IHdvcmxkXG4gICAgICAuY3JlYXRlRW50aXR5KClcbiAgICAgIC5hZGRDb21wb25lbnQoQ2FtZXJhLCB7XG4gICAgICAgIGZvdjogOTAsXG4gICAgICAgIGFzcGVjdDogd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICAgIG5lYXI6IDAuMSxcbiAgICAgICAgZmFyOiAxMDAsXG4gICAgICAgIGxheWVyczogMSxcbiAgICAgICAgaGFuZGxlUmVzaXplOiB0cnVlXG4gICAgICB9KVxuICAgICAgLmFkZENvbXBvbmVudChUcmFuc2Zvcm0pXG4gICAgICAuYWRkQ29tcG9uZW50KEFjdGl2ZSk7XG4gIH1cblxuICBsZXQgcmVuZGVyUGFzcyA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChSZW5kZXJQYXNzLCB7XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd29ybGQsXG4gICAgZW50aXRpZXM6IHtcbiAgICAgIHNjZW5lLFxuICAgICAgY2FtZXJhLFxuICAgICAgY2FtZXJhUmlnLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICByZW5kZXJQYXNzXG4gICAgfVxuICB9O1xufVxuIl0sIm5hbWVzIjpbIlRIUkVFLlZlY3RvcjIiLCJUSFJFRS5WZWN0b3IzIiwiVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwiLCJUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5IiwiVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCIsIlRIUkVFLk1lc2giLCJUSFJFRS5Hcm91cCIsIlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIiwiVEhSRUUuVGV4dHVyZSIsIlRIUkVFLkltYWdlTG9hZGVyIiwiVEhSRUUuV2ViR0xSZW5kZXJlciIsIlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIiwiVEhSRUUuRm9udExvYWRlciIsIlRIUkVFLlRleHRHZW9tZXRyeSIsIlRIUkVFLlJlcGVhdFdyYXBwaW5nIiwiVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkZvZyIsIlRIUkVFLkNvbG9yIiwiRUNTWS5Xb3JsZCIsIlRIUkVFLkNsb2NrIiwiVEhSRUUuU2NlbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQU8sTUFBTSxNQUFNLENBQUM7RUFDbEIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2Q7O0VBRUQsS0FBSyxHQUFHO0lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7R0FDcEI7Q0FDRjs7QUNSTSxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQztJQUNkLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ2hCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0dBQzFCOztFQUVELEtBQUssR0FBRyxFQUFFO0NBQ1g7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

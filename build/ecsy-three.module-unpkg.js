import { TagComponent, System, Not, SystemStateComponent, World } from 'https://unpkg.com/ecsy@0.2.2/build/ecsy.module.js';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, Clock, Scene as Scene$1 } from 'https://unpkg.com/three@0.114.0/build/three.module.js';
import { GLTFLoader as GLTFLoader$1 } from 'https://unpkg.com/three@0.114.0/examples/jsm/loaders/GLTFLoader.js';
import { TextMesh } from 'https://unpkg.com/troika-3d-text@0.19.0/dist/textmesh-standalone.esm.js?module';
import { VRButton } from 'https://unpkg.com/three@0.114.0/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'https://unpkg.com/three@0.114.0/examples/jsm/webxr/ARButton.js';
import { XRControllerModelFactory } from 'https://unpkg.com/three@0.114.0/examples/jsm/webxr/XRControllerModelFactory.js';

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUtdW5wa2cuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZMb2FkZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYXRlcmlhbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50T2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjYWxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmVuZGVyUGFzcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdGF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2NlbmUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3kuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvY29tcG9uZW50cy9UZXh0R2VvbWV0cnkuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UcmFuc2Zvcm0uanMiLCIuLi9zcmMvY29tcG9uZW50cy9WaXNpYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanMiLCIuLi9zcmMvc3lzdGVtcy9NYXRlcmlhbFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dlb21ldHJ5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR0xURkxvYWRlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1NreUJveFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1Zpc2liaWxpdHlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9TREZUZXh0U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0Vudmlyb25tZW50U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVlJDb250cm9sbGVyU3lzdGVtLmpzIiwiLi4vc3JjL2luaXRpYWxpemUuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuZm92ID0gNDU7XG4gICAgdGhpcy5hc3BlY3QgPSAxO1xuICAgIHRoaXMubmVhciA9IDAuMTtcbiAgICB0aGlzLmZhciA9IDEwMDA7XG4gICAgdGhpcy5sYXllcnMgPSAwO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmFSaWcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxlZnRIYW5kID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRHJhZ2dhYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIERyYWdnaW5nIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgRW52aXJvbm1lbnQge1xuICByZXNldCgpIHt9XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5wcmVzZXQgPSBcImRlZmF1bHRcIjtcbiAgICB0aGlzLnNlZWQgPSAxO1xuICAgIHRoaXMuc2t5VHlwZSA9IFwiYXRtb3NwaGVyZVwiO1xuICAgIHRoaXMuc2t5Q29sb3IgPSBcIlwiO1xuICAgIHRoaXMuaG9yaXpvbkNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmxpZ2h0aW5nID0gXCJkaXN0YW50XCI7XG4gICAgdGhpcy5zaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLnNoYWRvd1NpemUgPSAxMDtcbiAgICB0aGlzLmxpZ2h0UG9zaXRpb24gPSB7IHg6IDAsIHk6IDEsIHo6IC0wLjIgfTtcbiAgICB0aGlzLmZvZyA9IDA7XG5cbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5QXJlYSA9IDE7XG5cbiAgICB0aGlzLmdyb3VuZCA9IFwiZmxhdFwiO1xuICAgIHRoaXMuZ3JvdW5kWVNjYWxlID0gMztcbiAgICB0aGlzLmdyb3VuZFRleHR1cmUgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yID0gXCIjNTUzZTM1XCI7XG4gICAgdGhpcy5ncm91bmRDb2xvcjIgPSBcIiM2OTQ0MzlcIjtcblxuICAgIHRoaXMuZHJlc3NpbmcgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmRyZXNzaW5nQW1vdW50ID0gMTA7XG4gICAgdGhpcy5kcmVzc2luZ0NvbG9yID0gXCIjNzk1NDQ5XCI7XG4gICAgdGhpcy5kcmVzc2luZ1NjYWxlID0gNTtcbiAgICB0aGlzLmRyZXNzaW5nVmFyaWFuY2UgPSB7IHg6IDEsIHk6IDEsIHo6IDEgfTtcbiAgICB0aGlzLmRyZXNzaW5nVW5pZm9ybVNjYWxlID0gdHJ1ZTtcbiAgICB0aGlzLmRyZXNzaW5nT25QbGF5QXJlYSA9IDA7XG5cbiAgICB0aGlzLmdyaWQgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyaWRDb2xvciA9IFwiI2NjY1wiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTW9kZWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgR0xURkxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudXJsID0gXCJcIjtcbiAgICB0aGlzLnJlY2VpdmVTaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLmNhc3RTaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLmVudk1hcE92ZXJyaWRlID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjb25zdCBTSURFUyA9IHtcbiAgZnJvbnQ6IDAsXG4gIGJhY2s6IDEsXG4gIGRvdWJsZTogMlxufTtcblxuZXhwb3J0IGNvbnN0IFNIQURFUlMgPSB7XG4gIHN0YW5kYXJkOiAwLFxuICBmbGF0OiAxXG59O1xuXG5leHBvcnQgY29uc3QgQkxFTkRJTkcgPSB7XG4gIG5vcm1hbDogMCxcbiAgYWRkaXRpdmU6IDEsXG4gIHN1YnRyYWN0aXZlOiAyLFxuICBtdWx0aXBseTogM1xufTtcblxuZXhwb3J0IGNvbnN0IFZFUlRFWF9DT0xPUlMgPSB7XG4gIG5vbmU6IDAsXG4gIGZhY2U6IDEsXG4gIHZlcnRleDogMlxufTtcblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdCA9IG5ldyBUSFJFRS5WZWN0b3IyKDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQuc2V0KDAsIDApO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdC5zZXQoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBPYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBQYXJlbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50T2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59IiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZS5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2NhbGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUuc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3kge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3lCb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5jb3B5KHNyYy5wb3NpdGlvbik7XG4gICAgdGhpcy5yb3RhdGlvbi5jb3B5KHNyYy5yb3RhdGlvbik7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpc2libGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0ID0gXCJcIjtcbiAgICB0aGlzLnRleHRBbGlnbiA9IFwibGVmdFwiOyAvLyBbJ2xlZnQnLCAncmlnaHQnLCAnY2VudGVyJ11cbiAgICB0aGlzLmFuY2hvciA9IFwiY2VudGVyXCI7IC8vIFsnbGVmdCcsICdyaWdodCcsICdjZW50ZXInLCAnYWxpZ24nXVxuICAgIHRoaXMuYmFzZWxpbmUgPSBcImNlbnRlclwiOyAvLyBbJ3RvcCcsICdjZW50ZXInLCAnYm90dG9tJ11cbiAgICB0aGlzLmNvbG9yID0gXCIjRkZGXCI7XG4gICAgdGhpcy5mb250ID0gXCJcIjsgLy9cImh0dHBzOi8vY29kZS5jZG4ubW96aWxsYS5uZXQvZm9udHMvdHRmL1ppbGxhU2xhYi1TZW1pQm9sZC50dGZcIjtcbiAgICB0aGlzLmZvbnRTaXplID0gMC4yO1xuICAgIHRoaXMubGV0dGVyU3BhY2luZyA9IDA7XG4gICAgdGhpcy5saW5lSGVpZ2h0ID0gMDtcbiAgICB0aGlzLm1heFdpZHRoID0gSW5maW5pdHk7XG4gICAgdGhpcy5vdmVyZmxvd1dyYXAgPSBcIm5vcm1hbFwiOyAvLyBbJ25vcm1hbCcsICdicmVhay13b3JkJ11cbiAgICB0aGlzLndoaXRlU3BhY2UgPSBcIm5vcm1hbFwiOyAvLyBbJ25vcm1hbCcsICdub3dyYXAnXVxuICAgIHRoaXMub3BhY2l0eSA9IDE7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHQgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVlJDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZCA9IDA7XG4gICAgdGhpcy5jb250cm9sbGVyID0gbnVsbDtcbiAgfVxuICByZXNldCgpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91ciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2VsZWN0ID0gbnVsbDtcbiAgICB0aGlzLnNlbGVjdHN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLnNlbGVjdGVuZCA9IG51bGw7XG5cbiAgICB0aGlzLmNvbm5lY3RlZCA9IG51bGw7XG5cbiAgICB0aGlzLnNxdWVlemUgPSBudWxsO1xuICAgIHRoaXMuc3F1ZWV6ZXN0YXJ0ID0gbnVsbDtcbiAgICB0aGlzLnNxdWVlemVlbmQgPSBudWxsO1xuICB9XG59IiwiZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZyID0gZmFsc2U7XG4gICAgdGhpcy5hciA9IGZhbHNlO1xuICAgIHRoaXMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRydWU7XG4gICAgdGhpcy5zaGFkb3dNYXAgPSB0cnVlO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuXG4vKlxuZXhwb3J0IGNvbnN0IFdlYkdMUmVuZGVyZXIgPSBjcmVhdGVDb21wb25lbnRDbGFzcyhcbiAge1xuICAgIHZyOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBhbnRpYWxpYXM6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGhhbmRsZVJlc2l6ZTogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgc2hhZG93TWFwOiB7IGRlZmF1bHQ6IGZhbHNlIH1cbiAgfSxcbiAgXCJXZWJHTFJlbmRlcmVyXCJcbik7XG4qL1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0sIE5vdCwgU3lzdGVtU3RhdGVDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgTWF0ZXJpYWwsXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuY2xhc3MgTWF0ZXJpYWxJbnN0YW5jZSBleHRlbmRzIFN5c3RlbVN0YXRlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLm5ldy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoTWF0ZXJpYWwpO1xuICAgIH0pO1xuICB9XG59XG5cbk1hdGVyaWFsU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIG5ldzoge1xuICAgIGNvbXBvbmVudHM6IFtNYXRlcmlhbCwgTm90KE1hdGVyaWFsSW5zdGFuY2UpXVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldFJlbW92ZWRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIHBhcmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50LCB0cnVlKS52YWx1ZTtcbiAgICAgIHBhcmVudC5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnJlbW92ZShvYmplY3QpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR2VvbWV0cnkpO1xuXG4gICAgICB2YXIgZ2VvbWV0cnk7XG4gICAgICBzd2l0Y2ggKGNvbXBvbmVudC5wcmltaXRpdmUpIHtcbiAgICAgICAgY2FzZSBcInRvcnVzXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGl1cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YmUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpYWxTZWdtZW50cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YnVsYXJTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzcGhlcmVcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5KGNvbXBvbmVudC5yYWRpdXMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQud2lkdGgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5kZXB0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9XG4gICAgICAgIGNvbXBvbmVudC5wcmltaXRpdmUgPT09IFwidG9ydXNcIiA/IDB4OTk5OTAwIDogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KE1hdGVyaWFsKSkge1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgfVxuKi9cblxuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIGZsYXRTaGFkaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFRyYW5zZm9ybSkpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGlvbikge1xuICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoRWxlbWVudCkgJiYgIWVudGl0eS5oYXNDb21wb25lbnQoRHJhZ2dhYmxlKSkge1xuICAgICAgLy8gICAgICAgIG9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXQoMHgzMzMzMzMpO1xuICAgICAgLy8gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5HZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHZW9tZXRyeV0sIC8vIEB0b2RvIFRyYW5zZm9ybTogQXMgb3B0aW9uYWwsIGhvdyB0byBkZWZpbmUgaXQ/XG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBHTFRGTG9hZGVyIGFzIEdMVEZMb2FkZXJUaHJlZSB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcbmltcG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTG9hZGVyLmpzXCI7XG5cbi8vIEB0b2RvIFVzZSBwYXJhbWV0ZXIgYW5kIGxvYWRlciBtYW5hZ2VyXG52YXIgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXJUaHJlZSgpOyAvLy5zZXRQYXRoKFwiL2Fzc2V0cy9tb2RlbHMvXCIpO1xuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZMb2FkZXIpO1xuXG4gICAgICBsb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBnbHRmID0+IHtcbiAgICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICAgIGNoaWxkLnJlY2VpdmVTaGFkb3cgPSBjb21wb25lbnQucmVjZWl2ZVNoYWRvdztcbiAgICAgICAgICAgIGNoaWxkLmNhc3RTaGFkb3cgPSBjb21wb25lbnQuY2FzdFNoYWRvdztcblxuICAgICAgICAgICAgaWYgKGNvbXBvbmVudC5lbnZNYXBPdmVycmlkZSkge1xuICAgICAgICAgICAgICBjaGlsZC5tYXRlcmlhbC5lbnZNYXAgPSBjb21wb25lbnQuZW52TWFwT3ZlcnJpZGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChHTFRGTW9kZWwsIHsgdmFsdWU6IGdsdGYgfSk7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcHBlbmQpIHtcbiAgICAgICAgICBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWUuYWRkKGdsdGYuc2NlbmUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdsdGYuc2NlbmUgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbXBvbmVudC5vbkxvYWRlZCkge1xuICAgICAgICAgIGNvbXBvbmVudC5vbkxvYWRlZChnbHRmLnNjZW5lLCBnbHRmKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCwgdHJ1ZSkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG4gIH1cbn1cblxuR0xURkxvYWRlclN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTG9hZGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFNreUJveCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBTa3lCb3hTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgbGV0IHNreWJveCA9IGVudGl0eS5nZXRDb21wb25lbnQoU2t5Qm94KTtcblxuICAgICAgbGV0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMTAwLCAxMDAsIDEwMCk7XG4gICAgICBnZW9tZXRyeS5zY2FsZSgxLCAxLCAtMSk7XG5cbiAgICAgIGlmIChza3lib3gudHlwZSA9PT0gXCJjdWJlbWFwLXN0ZXJlb1wiKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShza3lib3gudGV4dHVyZVVybCwgMTIpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFscy5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgICBza3lCb3gubGF5ZXJzLnNldCgxKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveCk7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFsc1IgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gNjsgaiA8IDEyOyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHNSLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94UiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHNSKTtcbiAgICAgICAgc2t5Qm94Ui5sYXllcnMuc2V0KDIpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94Uik7XG5cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmtub3duIHNreWJveCB0eXBlOiBcIiwgc2t5Ym94LnR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoYXRsYXNJbWdVcmwsIHRpbGVzTnVtKSB7XG4gIGxldCB0ZXh0dXJlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXNOdW07IGkrKykge1xuICAgIHRleHR1cmVzW2ldID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgfVxuXG4gIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoKTtcbiAgbG9hZGVyLmxvYWQoYXRsYXNJbWdVcmwsIGZ1bmN0aW9uKGltYWdlT2JqKSB7XG4gICAgbGV0IGNhbnZhcywgY29udGV4dDtcbiAgICBsZXQgdGlsZVdpZHRoID0gaW1hZ2VPYmouaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRpbGVXaWR0aDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRpbGVXaWR0aDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZU9iaixcbiAgICAgICAgdGlsZVdpZHRoICogaSxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoXG4gICAgICApO1xuICAgICAgdGV4dHVyZXNbaV0uaW1hZ2UgPSBjYW52YXM7XG4gICAgICB0ZXh0dXJlc1tpXS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGV4dHVyZXM7XG59XG5cblNreUJveFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtTa3lCb3gsIE5vdChPYmplY3QzRCldXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVmlzaWJsZSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJpbGl0eVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHByb2Nlc3NWaXNpYmlsaXR5KGVudGl0aWVzKSB7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFxuICAgICAgICBWaXNpYmxlXG4gICAgICApLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRNZXNoIH0gZnJvbSBcInRyb2lrYS0zZC10ZXh0L2Rpc3QvdGV4dG1lc2gtc3RhbmRhbG9uZS5lc20uanNcIjtcbmltcG9ydCB7IE9iamVjdDNELCBUZXh0IH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5cbmNvbnN0IGFuY2hvck1hcHBpbmcgPSB7XG4gIGxlZnQ6IDAsXG4gIGNlbnRlcjogMC41LFxuICByaWdodDogMVxufTtcbmNvbnN0IGJhc2VsaW5lTWFwcGluZyA9IHtcbiAgdG9wOiAwLFxuICBjZW50ZXI6IDAuNSxcbiAgYm90dG9tOiAxXG59O1xuXG5leHBvcnQgY2xhc3MgU0RGVGV4dFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpIHtcbiAgICB0ZXh0TWVzaC50ZXh0ID0gdGV4dENvbXBvbmVudC50ZXh0O1xuICAgIHRleHRNZXNoLnRleHRBbGlnbiA9IHRleHRDb21wb25lbnQudGV4dEFsaWduO1xuICAgIHRleHRNZXNoLmFuY2hvclswXSA9IGFuY2hvck1hcHBpbmdbdGV4dENvbXBvbmVudC5hbmNob3JdO1xuICAgIHRleHRNZXNoLmFuY2hvclsxXSA9IGJhc2VsaW5lTWFwcGluZ1t0ZXh0Q29tcG9uZW50LmJhc2VsaW5lXTtcbiAgICB0ZXh0TWVzaC5jb2xvciA9IHRleHRDb21wb25lbnQuY29sb3I7XG4gICAgdGV4dE1lc2guZm9udCA9IHRleHRDb21wb25lbnQuZm9udDtcbiAgICB0ZXh0TWVzaC5mb250U2l6ZSA9IHRleHRDb21wb25lbnQuZm9udFNpemU7XG4gICAgdGV4dE1lc2gubGV0dGVyU3BhY2luZyA9IHRleHRDb21wb25lbnQubGV0dGVyU3BhY2luZyB8fCAwO1xuICAgIHRleHRNZXNoLmxpbmVIZWlnaHQgPSB0ZXh0Q29tcG9uZW50LmxpbmVIZWlnaHQgfHwgbnVsbDtcbiAgICB0ZXh0TWVzaC5vdmVyZmxvd1dyYXAgPSB0ZXh0Q29tcG9uZW50Lm92ZXJmbG93V3JhcDtcbiAgICB0ZXh0TWVzaC53aGl0ZVNwYWNlID0gdGV4dENvbXBvbmVudC53aGl0ZVNwYWNlO1xuICAgIHRleHRNZXNoLm1heFdpZHRoID0gdGV4dENvbXBvbmVudC5tYXhXaWR0aDtcbiAgICB0ZXh0TWVzaC5tYXRlcmlhbC5vcGFjaXR5ID0gdGV4dENvbXBvbmVudC5vcGFjaXR5O1xuICAgIHRleHRNZXNoLnN5bmMoKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzO1xuXG4gICAgZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZS5nZXRDb21wb25lbnQoVGV4dCk7XG5cbiAgICAgIGNvbnN0IHRleHRNZXNoID0gbmV3IFRleHRNZXNoKCk7XG4gICAgICB0ZXh0TWVzaC5uYW1lID0gXCJ0ZXh0TWVzaFwiO1xuICAgICAgdGV4dE1lc2guYW5jaG9yID0gWzAsIDBdO1xuICAgICAgdGV4dE1lc2gucmVuZGVyT3JkZXIgPSAxMDsgLy9icnV0ZS1mb3JjZSBmaXggZm9yIHVnbHkgYW50aWFsaWFzaW5nLCBzZWUgaXNzdWUgIzY3XG4gICAgICB0aGlzLnVwZGF0ZVRleHQodGV4dE1lc2gsIHRleHRDb21wb25lbnQpO1xuICAgICAgZS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IHRleHRNZXNoIH0pO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIHRleHRNZXNoID0gb2JqZWN0M0QuZ2V0T2JqZWN0QnlOYW1lKFwidGV4dE1lc2hcIik7XG4gICAgICB0ZXh0TWVzaC5kaXNwb3NlKCk7XG4gICAgICBvYmplY3QzRC5yZW1vdmUodGV4dE1lc2gpO1xuICAgIH0pO1xuXG4gICAgZW50aXRpZXMuY2hhbmdlZC5mb3JFYWNoKGUgPT4ge1xuICAgICAgdmFyIG9iamVjdDNEID0gZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgaWYgKG9iamVjdDNEIGluc3RhbmNlb2YgVGV4dE1lc2gpIHtcbiAgICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlLmdldENvbXBvbmVudChUZXh0KTtcbiAgICAgICAgdGhpcy51cGRhdGVUZXh0KG9iamVjdDNELCB0ZXh0Q29tcG9uZW50KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5TREZUZXh0U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RleHRdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhLFxuICBBY3RpdmUsXG4gIFdlYkdMUmVuZGVyZXIsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFZSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9WUkJ1dHRvbi5qc1wiO1xuaW1wb3J0IHsgQVJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL0FSQnV0dG9uLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVycyA9IHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cztcbiAgICByZW5kZXJlcnMuZm9yRWFjaChyZW5kZXJlckVudGl0eSA9PiB7XG4gICAgICB2YXIgcmVuZGVyZXIgPSByZW5kZXJlckVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlclBhc3Nlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIHBhc3MgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFJlbmRlclBhc3MpO1xuICAgICAgICB2YXIgc2NlbmUgPSBwYXNzLnNjZW5lLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgICAgdGhpcy5xdWVyaWVzLmFjdGl2ZUNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYUVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNhbWVyYSA9IGNhbWVyYUVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGNvbXBvbmVudC5zaGFkb3dNYXA7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIgfHwgY29tcG9uZW50LmFyKSB7XG4gICAgICAgIHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFZSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUGFyZW50T2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgUG9zaXRpb24sXG4gIFNjYWxlLFxuICBQYXJlbnQsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgdmFyIHBhcmVudEVudGl0eSA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZTtcbiAgICAgIGlmIChwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEKSkge1xuICAgICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBwYXJlbnRFbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgcGFyZW50T2JqZWN0M0QuYWRkKGNoaWxkT2JqZWN0M0QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIEhpZXJhcmNoeVxuICAgIHRoaXMucXVlcmllcy5wYXJlbnRPYmplY3QzRC5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBjaGlsZE9iamVjdDNEID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgfSk7XG5cbiAgICAvLyBUcmFuc2Zvcm1zXG4gICAgdmFyIHRyYW5zZm9ybXMgPSB0aGlzLnF1ZXJpZXMudHJhbnNmb3JtcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmFkZGVkW2ldO1xuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmNoYW5nZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGxldCBwb3NpdGlvbnMgPSB0aGlzLnF1ZXJpZXMucG9zaXRpb25zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gcG9zaXRpb25zLmFkZGVkW2ldO1xuICAgICAgbGV0IHBvc2l0aW9uID0gZW50aXR5LmdldENvbXBvbmVudChQb3NpdGlvbikudmFsdWU7XG5cbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkocG9zaXRpb24pO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcG9zaXRpb25zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBwb3NpdGlvbnMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCBwb3NpdGlvbiA9IGVudGl0eS5nZXRDb21wb25lbnQoUG9zaXRpb24pLnZhbHVlO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weShwb3NpdGlvbik7XG4gICAgfVxuXG4gICAgLy8gU2NhbGVcbiAgICBsZXQgc2NhbGVzID0gdGhpcy5xdWVyaWVzLnNjYWxlcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHNjYWxlcy5hZGRlZFtpXTtcbiAgICAgIGxldCBzY2FsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NhbGUpLnZhbHVlO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5zY2FsZS5jb3B5KHNjYWxlKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNjYWxlcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gc2NhbGVzLmNoYW5nZWRbaV07XG4gICAgICBsZXQgc2NhbGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjYWxlKS52YWx1ZTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnNjYWxlLmNvcHkoc2NhbGUpO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50T2JqZWN0M0Q6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50T2JqZWN0M0QsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3Jtczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgVHJhbnNmb3JtXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RyYW5zZm9ybV1cbiAgICB9XG4gIH0sXG4gIHBvc2l0aW9uczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgUG9zaXRpb25dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbUG9zaXRpb25dXG4gICAgfVxuICB9LFxuICBzY2FsZXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0QsIFNjYWxlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1NjYWxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IENhbWVyYSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYSA9PiB7XG4gICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNhbWVyYS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgY2FtZXJhLmdldE11dGFibGVDb21wb25lbnQoQ2FtZXJhKS5hc3BlY3QgPVxuICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5jaGFuZ2VkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNoYW5nZWRbaV07XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICBsZXQgY2FtZXJhM2QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIGlmIChjYW1lcmEzZC5hc3BlY3QgIT09IGNvbXBvbmVudC5hc3BlY3QpIHtcbiAgICAgICAgY2FtZXJhM2QuYXNwZWN0ID0gY29tcG9uZW50LmFzcGVjdDtcbiAgICAgICAgY2FtZXJhM2QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgICAgLy8gQHRvZG8gRG8gaXQgZm9yIHRoZSByZXN0IG9mIHRoZSB2YWx1ZXNcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhc1VuaW5pdGlhbGl6ZWQucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuXG4gICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICBjb21wb25lbnQuZm92LFxuICAgICAgICBjb21wb25lbnQuYXNwZWN0LFxuICAgICAgICBjb21wb25lbnQubmVhcixcbiAgICAgICAgY29tcG9uZW50LmZhclxuICAgICAgKTtcblxuICAgICAgY2FtZXJhLmxheWVycy5lbmFibGUoY29tcG9uZW50LmxheWVycyk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGNhbWVyYSB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5DYW1lcmFTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhc1VuaW5pdGlhbGl6ZWQ6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBOb3QoT2JqZWN0M0QpXVxuICB9LFxuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW0NhbWVyYV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNEXCI7XG5pbXBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9UZXh0R2VvbWV0cnlcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgLypcbiAgICBsb2FkZXIubG9hZChcIi9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIiwgZm9udCA9PiB7XG4gICAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gICAgKi9cbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHJldHVybjtcblxuICAgIHZhciBjaGFuZ2VkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQ7XG4gICAgY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIG9iamVjdC5nZW9tZXRyeSA9IGdlb21ldHJ5O1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZGVkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkO1xuICAgIGFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb2xvciA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcbiAgICAgIGNvbG9yID0gMHhmZmZmZmY7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogbWVzaCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dEdlb21ldHJ5XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCwgU2NlbmUsIE9iamVjdDNELCBFbnZpcm9ubWVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudmlyb25tZW50cy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAvLyBzdGFnZSBncm91bmQgZGlhbWV0ZXIgKGFuZCBza3kgcmFkaXVzKVxuICAgICAgdmFyIFNUQUdFX1NJWkUgPSAyMDA7XG5cbiAgICAgIC8vIGNyZWF0ZSBncm91bmRcbiAgICAgIC8vIHVwZGF0ZSBncm91bmQsIHBsYXlhcmVhIGFuZCBncmlkIHRleHR1cmVzLlxuICAgICAgdmFyIGdyb3VuZFJlc29sdXRpb24gPSAyMDQ4O1xuICAgICAgdmFyIHRleE1ldGVycyA9IDIwOyAvLyBncm91bmQgdGV4dHVyZSBvZiAyMCB4IDIwIG1ldGVyc1xuICAgICAgdmFyIHRleFJlcGVhdCA9IFNUQUdFX1NJWkUgLyB0ZXhNZXRlcnM7XG5cbiAgICAgIHZhciByZXNvbHV0aW9uID0gNjQ7IC8vIG51bWJlciBvZiBkaXZpc2lvbnMgb2YgdGhlIGdyb3VuZCBtZXNoXG5cbiAgICAgIHZhciBncm91bmRDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgZ3JvdW5kQ2FudmFzLndpZHRoID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZENhbnZhcy5oZWlnaHQgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgdmFyIGdyb3VuZFRleHR1cmUgPSBuZXcgVEhSRUUuVGV4dHVyZShncm91bmRDYW52YXMpO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwUyA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS53cmFwVCA9IFRIUkVFLlJlcGVhdFdyYXBwaW5nO1xuICAgICAgZ3JvdW5kVGV4dHVyZS5yZXBlYXQuc2V0KHRleFJlcGVhdCwgdGV4UmVwZWF0KTtcblxuICAgICAgdGhpcy5lbnZpcm9ubWVudERhdGEgPSB7XG4gICAgICAgIGdyb3VuZENvbG9yOiBcIiM0NTQ1NDVcIixcbiAgICAgICAgZ3JvdW5kQ29sb3IyOiBcIiM1ZDVkNWRcIlxuICAgICAgfTtcblxuICAgICAgdmFyIGdyb3VuZGN0eCA9IGdyb3VuZENhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG5cbiAgICAgIHZhciBzaXplID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjtcbiAgICAgIGdyb3VuZGN0eC5maWxsUmVjdCgwLCAwLCBzaXplLCBzaXplKTtcbiAgICAgIGdyb3VuZGN0eC5maWxsU3R5bGUgPSB0aGlzLmVudmlyb25tZW50RGF0YS5ncm91bmRDb2xvcjI7XG4gICAgICB2YXIgbnVtID0gTWF0aC5mbG9vcih0ZXhNZXRlcnMgLyAyKTtcbiAgICAgIHZhciBzdGVwID0gc2l6ZSAvICh0ZXhNZXRlcnMgLyAyKTsgLy8gMiBtZXRlcnMgPT0gPHN0ZXA+IHBpeGVsc1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW0gKyAxOyBpICs9IDIpIHtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBudW0gKyAxOyBqKyspIHtcbiAgICAgICAgICBncm91bmRjdHguZmlsbFJlY3QoXG4gICAgICAgICAgICBNYXRoLmZsb29yKChpICsgKGogJSAyKSkgKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3IoaiAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcClcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGdyb3VuZFRleHR1cmUubmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICB2YXIgZ3JvdW5kTWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIG1hcDogZ3JvdW5kVGV4dHVyZVxuICAgICAgfSk7XG5cbiAgICAgIGxldCBzY2VuZSA9IGVudGl0eS5nZXRDb21wb25lbnQoU2NlbmUpLnZhbHVlLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAvL3NjZW5lLmFkZChtZXNoKTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5QbGFuZUJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICBTVEFHRV9TSVpFICsgMixcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIHJlc29sdXRpb24gLSAxLFxuICAgICAgICByZXNvbHV0aW9uIC0gMVxuICAgICAgKTtcblxuICAgICAgbGV0IG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBncm91bmRNYXRlcmlhbCk7XG4gICAgICBvYmplY3Qucm90YXRpb24ueCA9IC1NYXRoLlBJIC8gMjtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChQYXJlbnQsIHsgdmFsdWU6IHdpbmRvdy5lbnRpdHlTY2VuZSB9KTtcblxuICAgICAgY29uc3QgY29sb3IgPSAweDMzMzMzMztcbiAgICAgIGNvbnN0IG5lYXIgPSAyMDtcbiAgICAgIGNvbnN0IGZhciA9IDEwMDtcbiAgICAgIHNjZW5lLmZvZyA9IG5ldyBUSFJFRS5Gb2coY29sb3IsIG5lYXIsIGZhcik7XG4gICAgICBzY2VuZS5iYWNrZ3JvdW5kID0gbmV3IFRIUkVFLkNvbG9yKGNvbG9yKTtcbiAgICB9KTtcbiAgfVxufVxuXG5FbnZpcm9ubWVudFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnZpcm9ubWVudHM6IHtcbiAgICBjb21wb25lbnRzOiBbU2NlbmUsIEVudmlyb25tZW50XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlckNvbnRleHQsXG4gIFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyLFxuICBWUkNvbnRyb2xsZXIsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuaW1wb3J0IHsgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5IH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9YUkNvbnRyb2xsZXJNb2RlbEZhY3RvcnkuanNcIjtcblxudmFyIGNvbnRyb2xsZXJNb2RlbEZhY3RvcnkgPSBuZXcgWFJDb250cm9sbGVyTW9kZWxGYWN0b3J5KCk7XG5cbmV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCByZW5kZXJlciA9IHRoaXMucXVlcmllcy5yZW5kZXJlckNvbnRleHQucmVzdWx0c1swXS5nZXRDb21wb25lbnQoXG4gICAgICBXZWJHTFJlbmRlcmVyQ29udGV4dFxuICAgICkudmFsdWU7XG5cbiAgICB0aGlzLnF1ZXJpZXMuY29udHJvbGxlcnMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGNvbnRyb2xsZXJJZCA9IGVudGl0eS5nZXRDb21wb25lbnQoVlJDb250cm9sbGVyKS5pZDtcbiAgICAgIHZhciBjb250cm9sbGVyID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlcihjb250cm9sbGVySWQpO1xuICAgICAgY29udHJvbGxlci5uYW1lID0gXCJjb250cm9sbGVyXCI7XG5cbiAgICAgIHZhciBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgZ3JvdXAuYWRkKGNvbnRyb2xsZXIpO1xuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFZSQ29udHJvbGxlckJhc2ljQmVoYXZpb3VyKSkge1xuICAgICAgICB2YXIgYmVoYXZpb3VyID0gZW50aXR5LmdldENvbXBvbmVudChWUkNvbnRyb2xsZXJCYXNpY0JlaGF2aW91cik7XG4gICAgICAgIE9iamVjdC5rZXlzKGJlaGF2aW91cikuZm9yRWFjaChldmVudE5hbWUgPT4ge1xuICAgICAgICAgIGlmIChiZWhhdmlvdXJbZXZlbnROYW1lXSkge1xuICAgICAgICAgICAgY29udHJvbGxlci5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgYmVoYXZpb3VyW2V2ZW50TmFtZV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBYUkNvbnRyb2xsZXJNb2RlbEZhY3Rvcnkgd2lsbCBhdXRvbWF0aWNhbGx5IGZldGNoIGNvbnRyb2xsZXIgbW9kZWxzXG4gICAgICAvLyB0aGF0IG1hdGNoIHdoYXQgdGhlIHVzZXIgaXMgaG9sZGluZyBhcyBjbG9zZWx5IGFzIHBvc3NpYmxlLiBUaGUgbW9kZWxzXG4gICAgICAvLyBzaG91bGQgYmUgYXR0YWNoZWQgdG8gdGhlIG9iamVjdCByZXR1cm5lZCBmcm9tIGdldENvbnRyb2xsZXJHcmlwIGluXG4gICAgICAvLyBvcmRlciB0byBtYXRjaCB0aGUgb3JpZW50YXRpb24gb2YgdGhlIGhlbGQgZGV2aWNlLlxuICAgICAgbGV0IGNvbnRyb2xsZXJHcmlwID0gcmVuZGVyZXIueHIuZ2V0Q29udHJvbGxlckdyaXAoY29udHJvbGxlcklkKTtcbiAgICAgIGNvbnRyb2xsZXJHcmlwLmFkZChcbiAgICAgICAgY29udHJvbGxlck1vZGVsRmFjdG9yeS5jcmVhdGVDb250cm9sbGVyTW9kZWwoY29udHJvbGxlckdyaXApXG4gICAgICApO1xuICAgICAgZ3JvdXAuYWRkKGNvbnRyb2xsZXJHcmlwKTtcbiAgICAgIC8qXG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQnVmZmVyR2VvbWV0cnkoKTtcbiAgICAgIGdlb21ldHJ5LnNldEF0dHJpYnV0ZShcbiAgICAgICAgXCJwb3NpdGlvblwiLFxuICAgICAgICBuZXcgVEhSRUUuRmxvYXQzMkJ1ZmZlckF0dHJpYnV0ZShbMCwgMCwgMCwgMCwgMCwgLTFdLCAzKVxuICAgICAgKTtcblxuICAgICAgdmFyIGxpbmUgPSBuZXcgVEhSRUUuTGluZShnZW9tZXRyeSk7XG4gICAgICBsaW5lLm5hbWUgPSBcImxpbmVcIjtcbiAgICAgIGxpbmUuc2NhbGUueiA9IDU7XG4gICAgICBncm91cC5hZGQobGluZSk7XG5cbiAgICAgIGxldCBnZW9tZXRyeTIgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMC4xLCAwLjEsIDAuMSk7XG4gICAgICBsZXQgbWF0ZXJpYWwyID0gbmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgY29sb3I6IDB4MDBmZjAwIH0pO1xuICAgICAgbGV0IGN1YmUgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeTIsIG1hdGVyaWFsMik7XG4gICAgICBncm91cC5uYW1lID0gXCJWUkNvbnRyb2xsZXJcIjtcbiAgICAgIGdyb3VwLmFkZChjdWJlKTtcbiovXG4gICAgfSk7XG5cbiAgICAvLyB0aGlzLmNsZWFuSW50ZXJzZWN0ZWQoKTtcbiAgfVxufVxuXG5WUkNvbnRyb2xsZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY29udHJvbGxlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbVlJDb250cm9sbGVyXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgICAvL2NoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyZXJDb250ZXh0OiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBtYW5kYXRvcnk6IHRydWVcbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIEVDU1kgZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1TeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE1hdGVyaWFsU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9NYXRlcmlhbFN5c3RlbS5qc1wiO1xuXG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IENhbWVyYVJpZyB9IGZyb20gXCIuL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzXCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL1BhcmVudC5qc1wiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIEFjdGl2ZSxcbiAgUmVuZGVyUGFzcyxcbiAgVHJhbnNmb3JtLFxuICBDYW1lcmFcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCh3b3JsZCkge1xuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShUcmFuc2Zvcm1TeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKENhbWVyYVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oTWF0ZXJpYWxTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFdlYkdMUmVuZGVyZXJTeXN0ZW0sIHsgcHJpb3JpdHk6IDEgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplRGVmYXVsdCh3b3JsZCA9IG5ldyBFQ1NZLldvcmxkKCksIG9wdGlvbnMpIHtcbiAgaW5pdCh3b3JsZCk7XG5cbiAgY29uc3QgREVGQVVMVF9PUFRJT05TID0ge307XG5cbiAgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIERFRkFVTFRfT1BUSU9OUywgb3B0aW9ucyk7XG5cbiAgbGV0IGFuaW1hdGlvbkxvb3AgPSBvcHRpb25zLmFuaW1hdGlvbkxvb3A7XG4gIGlmICghYW5pbWF0aW9uTG9vcCkge1xuICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgYW5pbWF0aW9uTG9vcCA9ICgpID0+IHtcbiAgICAgIHdvcmxkLmV4ZWN1dGUoY2xvY2suZ2V0RGVsdGEoKSwgY2xvY2suZWxhcHNlZFRpbWUpO1xuICAgIH07XG4gIH1cblxuICBsZXQgc2NlbmUgPSB3b3JsZFxuICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgIC5hZGRDb21wb25lbnQoU2NlbmUpXG4gICAgLmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogbmV3IFRIUkVFLlNjZW5lKCkgfSk7XG5cbiAgbGV0IHJlbmRlcmVyID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIsIHtcbiAgICBhcjogb3B0aW9ucy5hcixcbiAgICB2cjogb3B0aW9ucy52cixcbiAgICBhbmltYXRpb25Mb29wOiBhbmltYXRpb25Mb29wXG4gIH0pO1xuXG4gIC8vIGNhbWVyYSByaWcgJiBjb250cm9sbGVyc1xuICB2YXIgY2FtZXJhID0gbnVsbCxcbiAgICBjYW1lcmFSaWcgPSBudWxsO1xuXG4gIGlmIChvcHRpb25zLmFyIHx8IG9wdGlvbnMudnIpIHtcbiAgICBjYW1lcmFSaWcgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KTtcbiAgfVxuXG4gIHtcbiAgICBjYW1lcmEgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYSwge1xuICAgICAgICBmb3Y6IDkwLFxuICAgICAgICBhc3BlY3Q6IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgICBuZWFyOiAwLjEsXG4gICAgICAgIGZhcjogMTAwLFxuICAgICAgICBsYXllcnM6IDEsXG4gICAgICAgIGhhbmRsZVJlc2l6ZTogdHJ1ZVxuICAgICAgfSlcbiAgICAgIC5hZGRDb21wb25lbnQoVHJhbnNmb3JtKVxuICAgICAgLmFkZENvbXBvbmVudChBY3RpdmUpO1xuICB9XG5cbiAgbGV0IHJlbmRlclBhc3MgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoUmVuZGVyUGFzcywge1xuICAgIHNjZW5lOiBzY2VuZSxcbiAgICBjYW1lcmE6IGNhbWVyYVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIGNhbWVyYVJpZyxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgcmVuZGVyUGFzc1xuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJUSFJFRS5WZWN0b3IyIiwiVEhSRUUuVmVjdG9yMyIsIlRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsIiwiVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwiLCJUSFJFRS5NZXNoIiwiR0xURkxvYWRlclRocmVlIiwiVEhSRUUuR3JvdXAiLCJUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCIsIlRIUkVFLlRleHR1cmUiLCJUSFJFRS5JbWFnZUxvYWRlciIsIlRIUkVFLldlYkdMUmVuZGVyZXIiLCJUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSIsIlRIUkVFLkZvbnRMb2FkZXIiLCJUSFJFRS5UZXh0R2VvbWV0cnkiLCJUSFJFRS5SZXBlYXRXcmFwcGluZyIsIlRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Gb2ciLCJUSFJF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

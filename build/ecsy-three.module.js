import { TagComponent, System, Not, SystemStateComponent, World } from 'ecsy';
import { Vector2, Vector3, MeshStandardMaterial, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, RepeatWrapping, PlaneBufferGeometry, Fog, Color, Clock, Scene as Scene$1 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

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
    this.position = new Vector3();
  }

  reset() {
    this.position.set(0, 0, 0);
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

class VRController {
  constructor() {
    this.id = 0;
    this.controller = null;
  }
  reset() {}
}

class WebGLRenderer {
  constructor() {
    this.vr = false;
    this.ar = false;
    this.antialias = true;
    this.handleResize = true;
    this.gammaOutput = true;
    this.shadowMap = true;
  }
}

/*
export const WebGLRenderer = createComponentClass(
  {
    vr: { default: true },
    antialias: { default: true },
    handleResize: { default: true },
    gammaOutput: { default: true },
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

class WebGLRendererContext {
  constructor() {
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

      renderer.gammaOutput = component.gammaOutput;
      renderer.shadowMap.enabled = component.shadowMap;

      document.body.appendChild(renderer.domElement);

      if (component.vr || component.ar) {
        renderer.vr.enabled = true;

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
        near: 1,
        far: 1000,
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

export { Active, Camera, CameraRig, CameraSystem, Draggable, Dragging, Environment, EnvironmentSystem, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, Material, MaterialSystem, Object3D, Parent, Position, RenderPass, Rotation, Scene, Sky, SkyBox, SkyBoxSystem, TextGeometry, TextGeometrySystem, Transform, TransformSystem, VRController, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, init, initializeDefault };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRW52aXJvbm1lbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL01hdGVyaWFsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JlbmRlclBhc3MuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanMiLCIuLi9zcmMvc3lzdGVtcy9NYXRlcmlhbFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dlb21ldHJ5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR0xURkxvYWRlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1NreUJveFN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1Zpc2liaWxpdHlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVGV4dEdlb21ldHJ5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvRW52aXJvbm1lbnRTeXN0ZW0uanMiLCIuLi9zcmMvaW5pdGlhbGl6ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQWN0aXZlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2FtZXJhIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5mb3YgPSA0NTtcbiAgICB0aGlzLmFzcGVjdCA9IDE7XG4gICAgdGhpcy5uZWFyID0gMTtcbiAgICB0aGlzLmZhciA9IDEwMDA7XG4gICAgdGhpcy5sYXllcnMgPSAwO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmFSaWcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxlZnRIYW5kID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRHJhZ2dhYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIERyYWdnaW5nIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgRW52aXJvbm1lbnQge1xuICByZXNldCgpIHt9XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5wcmVzZXQgPSBcImRlZmF1bHRcIjtcbiAgICB0aGlzLnNlZWQgPSAxO1xuICAgIHRoaXMuc2t5VHlwZSA9IFwiYXRtb3NwaGVyZVwiO1xuICAgIHRoaXMuc2t5Q29sb3IgPSBcIlwiO1xuICAgIHRoaXMuaG9yaXpvbkNvbG9yID0gXCJcIjtcbiAgICB0aGlzLmxpZ2h0aW5nID0gXCJkaXN0YW50XCI7XG4gICAgdGhpcy5zaGFkb3cgPSBmYWxzZTtcbiAgICB0aGlzLnNoYWRvd1NpemUgPSAxMDtcbiAgICB0aGlzLmxpZ2h0UG9zaXRpb24gPSB7IHg6IDAsIHk6IDEsIHo6IC0wLjIgfTtcbiAgICB0aGlzLmZvZyA9IDA7XG5cbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5wbGF5QXJlYSA9IDE7XG5cbiAgICB0aGlzLmdyb3VuZCA9IFwiZmxhdFwiO1xuICAgIHRoaXMuZ3JvdW5kWVNjYWxlID0gMztcbiAgICB0aGlzLmdyb3VuZFRleHR1cmUgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yID0gXCIjNTUzZTM1XCI7XG4gICAgdGhpcy5ncm91bmRDb2xvcjIgPSBcIiM2OTQ0MzlcIjtcblxuICAgIHRoaXMuZHJlc3NpbmcgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmRyZXNzaW5nQW1vdW50ID0gMTA7XG4gICAgdGhpcy5kcmVzc2luZ0NvbG9yID0gXCIjNzk1NDQ5XCI7XG4gICAgdGhpcy5kcmVzc2luZ1NjYWxlID0gNTtcbiAgICB0aGlzLmRyZXNzaW5nVmFyaWFuY2UgPSB7IHg6IDEsIHk6IDEsIHo6IDEgfTtcbiAgICB0aGlzLmRyZXNzaW5nVW5pZm9ybVNjYWxlID0gdHJ1ZTtcbiAgICB0aGlzLmRyZXNzaW5nT25QbGF5QXJlYSA9IDA7XG5cbiAgICB0aGlzLmdyaWQgPSBcIm5vbmVcIjtcbiAgICB0aGlzLmdyaWRDb2xvciA9IFwiI2NjY1wiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTW9kZWwge31cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY29uc3QgU0lERVMgPSB7XG4gIGZyb250OiAwLFxuICBiYWNrOiAxLFxuICBkb3VibGU6IDJcbn07XG5cbmV4cG9ydCBjb25zdCBTSEFERVJTID0ge1xuICBzdGFuZGFyZDogMCxcbiAgZmxhdDogMVxufTtcblxuZXhwb3J0IGNvbnN0IEJMRU5ESU5HID0ge1xuICBub3JtYWw6IDAsXG4gIGFkZGl0aXZlOiAxLFxuICBzdWJ0cmFjdGl2ZTogMixcbiAgbXVsdGlwbHk6IDNcbn07XG5cbmV4cG9ydCBjb25zdCBWRVJURVhfQ09MT1JTID0ge1xuICBub25lOiAwLFxuICBmYWNlOiAxLFxuICB2ZXJ0ZXg6IDJcbn07XG5cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sb3IgPSAweGZmMDAwMDtcbiAgICB0aGlzLmFscGhhVGVzdCA9IDA7XG4gICAgdGhpcy5kZXB0aFRlc3QgPSB0cnVlO1xuICAgIHRoaXMuZGVwdGhXcml0ZSA9IHRydWU7XG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubnBvdCA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0ID0gbmV3IFRIUkVFLlZlY3RvcjIoKTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG4gICAgdGhpcy5yZXBlYXQgPSBuZXcgVEhSRUUuVmVjdG9yMigxLCAxKTtcbiAgICB0aGlzLnNoYWRlciA9IFNIQURFUlMuc3RhbmRhcmQ7XG4gICAgdGhpcy5zaWRlID0gU0lERVMuZnJvbnQ7XG4gICAgdGhpcy50cmFuc3BhcmVudCA9IGZhbHNlO1xuICAgIHRoaXMudmVydGV4Q29sb3JzID0gVkVSVEVYX0NPTE9SUy5ub25lO1xuICAgIHRoaXMudmlzaWJsZSA9IHRydWU7XG4gICAgdGhpcy5ibGVuZGluZyA9IEJMRU5ESU5HLm5vcm1hbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY29sb3IgPSAweGZmMDAwMDtcbiAgICB0aGlzLmFscGhhVGVzdCA9IDA7XG4gICAgdGhpcy5kZXB0aFRlc3QgPSB0cnVlO1xuICAgIHRoaXMuZGVwdGhXcml0ZSA9IHRydWU7XG4gICAgdGhpcy5mbGF0U2hhZGluZyA9IGZhbHNlO1xuICAgIHRoaXMubnBvdCA9IGZhbHNlO1xuICAgIHRoaXMub2Zmc2V0LnNldCgwLCAwKTtcbiAgICB0aGlzLm9wYWNpdHkgPSAxLjA7XG4gICAgdGhpcy5yZXBlYXQuc2V0KDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjZW5lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreUJveCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnkge1xuICByZXNldCgpIHt9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgY29weShzcmMpIHtcbiAgICB0aGlzLnBvc2l0aW9uLmNvcHkoc3JjLnBvc2l0aW9uKTtcbiAgICB0aGlzLnJvdGF0aW9uLmNvcHkoc3JjLnJvdGF0aW9uKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVmlzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZyID0gZmFsc2U7XG4gICAgdGhpcy5hciA9IGZhbHNlO1xuICAgIHRoaXMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRydWU7XG4gICAgdGhpcy5nYW1tYU91dHB1dCA9IHRydWU7XG4gICAgdGhpcy5zaGFkb3dNYXAgPSB0cnVlO1xuICB9XG59XG5cbi8qXG5leHBvcnQgY29uc3QgV2ViR0xSZW5kZXJlciA9IGNyZWF0ZUNvbXBvbmVudENsYXNzKFxuICB7XG4gICAgdnI6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGFudGlhbGlhczogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBnYW1tYU91dHB1dDogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgc2hhZG93TWFwOiB7IGRlZmF1bHQ6IGZhbHNlIH1cbiAgfSxcbiAgXCJXZWJHTFJlbmRlcmVyXCJcbik7XG4qL1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0sIE5vdCwgU3lzdGVtU3RhdGVDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgTWF0ZXJpYWwsXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuY2xhc3MgTWF0ZXJpYWxJbnN0YW5jZSBleHRlbmRzIFN5c3RlbVN0YXRlQ29tcG9uZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLnZhbHVlID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKCk7XG4gIH1cblxuICByZXNldCgpIHt9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXRlcmlhbFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLm5ldy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnN0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoTWF0ZXJpYWwpO1xuICAgIH0pO1xuICB9XG59XG5cbk1hdGVyaWFsU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIG5ldzoge1xuICAgIGNvbXBvbmVudHM6IFtNYXRlcmlhbCwgTm90KE1hdGVyaWFsSW5zdGFuY2UpXVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldFJlbW92ZWRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIHBhcmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50LCB0cnVlKS52YWx1ZTtcbiAgICAgIHBhcmVudC5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnJlbW92ZShvYmplY3QpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR2VvbWV0cnkpO1xuXG4gICAgICB2YXIgZ2VvbWV0cnk7XG4gICAgICBzd2l0Y2ggKGNvbXBvbmVudC5wcmltaXRpdmUpIHtcbiAgICAgICAgY2FzZSBcInRvcnVzXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGl1cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YmUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpYWxTZWdtZW50cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YnVsYXJTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzcGhlcmVcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5KGNvbXBvbmVudC5yYWRpdXMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQud2lkdGgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5kZXB0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9XG4gICAgICAgIGNvbXBvbmVudC5wcmltaXRpdmUgPT09IFwidG9ydXNcIiA/IDB4OTk5OTAwIDogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KE1hdGVyaWFsKSkge1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgfVxuKi9cblxuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIGZsYXRTaGFkaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFRyYW5zZm9ybSkpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGlvbikge1xuICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoRWxlbWVudCkgJiYgIWVudGl0eS5oYXNDb21wb25lbnQoRHJhZ2dhYmxlKSkge1xuICAgICAgLy8gICAgICAgIG9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXQoMHgzMzMzMzMpO1xuICAgICAgLy8gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5HZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHZW9tZXRyeV0sIC8vIEB0b2RvIFRyYW5zZm9ybTogQXMgb3B0aW9uYWwsIGhvdyB0byBkZWZpbmUgaXQ/XG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IEdMVEZNb2RlbCB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZNb2RlbC5qc1wiO1xuXG4vLyBAdG9kbyBVc2UgcGFyYW1ldGVyIGFuZCBsb2FkZXIgbWFuYWdlclxudmFyIGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyKCkuc2V0UGF0aChcIi9hc3NldHMvXCIpO1xuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZNb2RlbCk7XG5cbiAgICAgIGxvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGdsdGYgPT4ge1xuICAgICAgICAvKlxuICAgICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgICAgY2hpbGQubWF0ZXJpYWwuZW52TWFwID0gZW52TWFwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4qL1xuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBnbHRmLnNjZW5lIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuR0xURkxvYWRlclN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTW9kZWxdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTa3lCb3gsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGxldCBza3lib3ggPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNreUJveCk7XG5cbiAgICAgIGxldCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICAgZ2VvbWV0cnkuc2NhbGUoMSwgMSwgLTEpO1xuXG4gICAgICBpZiAoc2t5Ym94LnR5cGUgPT09IFwiY3ViZW1hcC1zdGVyZW9cIikge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoc2t5Ym94LnRleHR1cmVVcmwsIDEyKTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzKTtcbiAgICAgICAgc2t5Qm94LmxheWVycy5zZXQoMSk7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3gpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzUi5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveFIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICAgIHNreUJveFIubGF5ZXJzLnNldCgyKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveFIpO1xuXG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdyb3VwIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biBza3lib3ggdHlwZTogXCIsIHNreWJveC50eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5Ta3lCb3hTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbU2t5Qm94LCBOb3QoT2JqZWN0M0QpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZpc2libGUsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2liaWxpdHlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBwcm9jZXNzVmlzaWJpbGl0eShlbnRpdGllcykge1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS52aXNpYmxlID0gZW50aXR5LmdldENvbXBvbmVudChcbiAgICAgICAgVmlzaWJsZVxuICAgICAgKS52YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQpO1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQpO1xuICB9XG59XG5cblZpc2liaWxpdHlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVmlzaWJsZSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBSZW5kZXJQYXNzLFxuICBDYW1lcmEsXG4gIEFjdGl2ZSxcbiAgV2ViR0xSZW5kZXJlcixcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgVlJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1ZSQnV0dG9uLmpzXCI7XG5pbXBvcnQgeyBBUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvQVJCdXR0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29tcG9uZW50LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5nYW1tYU91dHB1dCA9IGNvbXBvbmVudC5nYW1tYU91dHB1dDtcbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52ciB8fCBjb21wb25lbnQuYXIpIHtcbiAgICAgICAgcmVuZGVyZXIudnIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoVlJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50LmFyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0LCB7IHZhbHVlOiByZW5kZXJlciB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMuY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgIHZhciByZW5kZXJlciA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wb25lbnQud2lkdGggIT09IHJlbmRlcmVyLndpZHRoIHx8XG4gICAgICAgIGNvbXBvbmVudC5oZWlnaHQgIT09IHJlbmRlcmVyLmhlaWdodFxuICAgICAgKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUoY29tcG9uZW50LndpZHRoLCBjb21wb25lbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8gaW5uZXJXaWR0aC9pbm5lckhlaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJQYXNzZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyUGFzc11cbiAgfSxcbiAgYWN0aXZlQ2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIEFjdGl2ZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm0sIFBhcmVudCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBIaWVyYXJjaHlcbiAgICBsZXQgYWRkZWQgPSB0aGlzLnF1ZXJpZXMucGFyZW50LmFkZGVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBhZGRlZFtpXTtcbiAgICAgIHZhciBwYXJlbnRFbnRpdHkgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCkudmFsdWU7XG4gICAgICBpZiAocGFyZW50RW50aXR5Lmhhc0NvbXBvbmVudChPYmplY3QzRCkpIHtcbiAgICAgICAgdmFyIHBhcmVudE9iamVjdDNEID0gcGFyZW50RW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgIHZhciBjaGlsZE9iamVjdDNEID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm1zXG4gICAgdmFyIHRyYW5zZm9ybXMgPSB0aGlzLnF1ZXJpZXMudHJhbnNmb3JtcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmFkZGVkW2ldO1xuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmNoYW5nZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuVHJhbnNmb3JtU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmFuc2Zvcm1zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNELCBUcmFuc2Zvcm1dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVHJhbnNmb3JtXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IENhbWVyYSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYSA9PiB7XG4gICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNhbWVyYS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgY2FtZXJhLmdldE11dGFibGVDb21wb25lbnQoQ2FtZXJhKS5hc3BlY3QgPVxuICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5jaGFuZ2VkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNoYW5nZWRbaV07XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICBsZXQgY2FtZXJhM2QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIGlmIChjYW1lcmEzZC5hc3BlY3QgIT09IGNvbXBvbmVudC5hc3BlY3QpIHtcbiAgICAgICAgY2FtZXJhM2QuYXNwZWN0ID0gY29tcG9uZW50LmFzcGVjdDtcbiAgICAgICAgY2FtZXJhM2QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgICAgLy8gQHRvZG8gRG8gaXQgZm9yIHRoZSByZXN0IG9mIHRoZSB2YWx1ZXNcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhc1VuaW5pdGlhbGl6ZWQucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuXG4gICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICBjb21wb25lbnQuZm92LFxuICAgICAgICBjb21wb25lbnQuYXNwZWN0LFxuICAgICAgICBjb21wb25lbnQubmVhcixcbiAgICAgICAgY29tcG9uZW50LmZhclxuICAgICAgKTtcblxuICAgICAgY2FtZXJhLmxheWVycy5lbmFibGUoY29tcG9uZW50LmxheWVycyk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGNhbWVyYSB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5DYW1lcmFTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhc1VuaW5pdGlhbGl6ZWQ6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBOb3QoT2JqZWN0M0QpXVxuICB9LFxuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW0NhbWVyYV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNEXCI7XG5pbXBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9UZXh0R2VvbWV0cnlcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgbG9hZGVyLmxvYWQoXCIvYXNzZXRzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uXCIsIGZvbnQgPT4ge1xuICAgICAgdGhpcy5mb250ID0gZm9udDtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgfSk7XG5cbiAgICB2YXIgYWRkZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG4gICAgYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbG9yID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgY29sb3IgPSAweGZmZmZmZjtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBtZXNoIH0pO1xuICAgIH0pO1xuICB9XG59XG5cblRleHRHZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0R2VvbWV0cnldLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50LCBTY2VuZSwgT2JqZWN0M0QsIEVudmlyb25tZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIEVudmlyb25tZW50U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW52aXJvbm1lbnRzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIC8vIHN0YWdlIGdyb3VuZCBkaWFtZXRlciAoYW5kIHNreSByYWRpdXMpXG4gICAgICB2YXIgU1RBR0VfU0laRSA9IDIwMDtcblxuICAgICAgLy8gY3JlYXRlIGdyb3VuZFxuICAgICAgLy8gdXBkYXRlIGdyb3VuZCwgcGxheWFyZWEgYW5kIGdyaWQgdGV4dHVyZXMuXG4gICAgICB2YXIgZ3JvdW5kUmVzb2x1dGlvbiA9IDIwNDg7XG4gICAgICB2YXIgdGV4TWV0ZXJzID0gMjA7IC8vIGdyb3VuZCB0ZXh0dXJlIG9mIDIwIHggMjAgbWV0ZXJzXG4gICAgICB2YXIgdGV4UmVwZWF0ID0gU1RBR0VfU0laRSAvIHRleE1ldGVycztcblxuICAgICAgdmFyIHJlc29sdXRpb24gPSA2NDsgLy8gbnVtYmVyIG9mIGRpdmlzaW9ucyBvZiB0aGUgZ3JvdW5kIG1lc2hcblxuICAgICAgdmFyIGdyb3VuZENhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBncm91bmRDYW52YXMud2lkdGggPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kQ2FudmFzLmhlaWdodCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICB2YXIgZ3JvdW5kVGV4dHVyZSA9IG5ldyBUSFJFRS5UZXh0dXJlKGdyb3VuZENhbnZhcyk7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBTID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLndyYXBUID0gVEhSRUUuUmVwZWF0V3JhcHBpbmc7XG4gICAgICBncm91bmRUZXh0dXJlLnJlcGVhdC5zZXQodGV4UmVwZWF0LCB0ZXhSZXBlYXQpO1xuXG4gICAgICB0aGlzLmVudmlyb25tZW50RGF0YSA9IHtcbiAgICAgICAgZ3JvdW5kQ29sb3I6IFwiIzQ1NDU0NVwiLFxuICAgICAgICBncm91bmRDb2xvcjI6IFwiIzVkNWQ1ZFwiXG4gICAgICB9O1xuXG4gICAgICB2YXIgZ3JvdW5kY3R4ID0gZ3JvdW5kQ2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcblxuICAgICAgdmFyIHNpemUgPSBncm91bmRSZXNvbHV0aW9uO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KDAsIDAsIHNpemUsIHNpemUpO1xuICAgICAgZ3JvdW5kY3R4LmZpbGxTdHlsZSA9IHRoaXMuZW52aXJvbm1lbnREYXRhLmdyb3VuZENvbG9yMjtcbiAgICAgIHZhciBudW0gPSBNYXRoLmZsb29yKHRleE1ldGVycyAvIDIpO1xuICAgICAgdmFyIHN0ZXAgPSBzaXplIC8gKHRleE1ldGVycyAvIDIpOyAvLyAyIG1ldGVycyA9PSA8c3RlcD4gcGl4ZWxzXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bSArIDE7IGkgKz0gMikge1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IG51bSArIDE7IGorKykge1xuICAgICAgICAgIGdyb3VuZGN0eC5maWxsUmVjdChcbiAgICAgICAgICAgIE1hdGguZmxvb3IoKGkgKyAoaiAlIDIpKSAqIHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihqICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcihzdGVwKVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZ3JvdW5kVGV4dHVyZS5uZWVkc1VwZGF0ZSA9IHRydWU7XG5cbiAgICAgIHZhciBncm91bmRNYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgbWFwOiBncm91bmRUZXh0dXJlXG4gICAgICB9KTtcblxuICAgICAgbGV0IHNjZW5lID0gZW50aXR5LmdldENvbXBvbmVudChTY2VuZSkudmFsdWUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIC8vc2NlbmUuYWRkKG1lc2gpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkoXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICBTVEFHRV9TSVpFICsgMixcbiAgICAgICAgcmVzb2x1dGlvbiAtIDEsXG4gICAgICAgIHJlc29sdXRpb24gLSAxXG4gICAgICApO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIGdyb3VuZE1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi54ID0gLU1hdGguUEkgLyAyO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBvYmplY3QgfSk7XG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogd2luZG93LmVudGl0eVNjZW5lIH0pO1xuXG4gICAgICBjb25zdCBjb2xvciA9IDB4MzMzMzMzO1xuICAgICAgY29uc3QgbmVhciA9IDIwO1xuICAgICAgY29uc3QgZmFyID0gMTAwO1xuICAgICAgc2NlbmUuZm9nID0gbmV3IFRIUkVFLkZvZyhjb2xvciwgbmVhciwgZmFyKTtcbiAgICAgIHNjZW5lLmJhY2tncm91bmQgPSBuZXcgVEhSRUUuQ29sb3IoY29sb3IpO1xuICAgIH0pO1xuICB9XG59XG5cbkVudmlyb25tZW50U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudmlyb25tZW50czoge1xuICAgIGNvbXBvbmVudHM6IFtTY2VuZSwgRW52aXJvbm1lbnRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBFQ1NZIGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IENhbWVyYVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBNYXRlcmlhbFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvTWF0ZXJpYWxTeXN0ZW0uanNcIjtcblxuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QgfSBmcm9tIFwiLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBDYW1lcmFSaWcgfSBmcm9tIFwiLi9jb21wb25lbnRzL0NhbWVyYVJpZy5qc1wiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXIsXG4gIFNjZW5lLFxuICBBY3RpdmUsXG4gIFJlbmRlclBhc3MsXG4gIFRyYW5zZm9ybSxcbiAgQ2FtZXJhXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQod29ybGQpIHtcbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVHJhbnNmb3JtU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShDYW1lcmFTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKE1hdGVyaWFsU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZURlZmF1bHQod29ybGQgPSBuZXcgRUNTWS5Xb3JsZCgpLCBvcHRpb25zKSB7XG4gIGluaXQod29ybGQpO1xuXG4gIGNvbnN0IERFRkFVTFRfT1BUSU9OUyA9IHt9O1xuXG4gIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG5ldyBUSFJFRS5TY2VuZSgpIH0pO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgYXI6IG9wdGlvbnMuYXIsXG4gICAgdnI6IG9wdGlvbnMudnIsXG4gICAgYW5pbWF0aW9uTG9vcDogYW5pbWF0aW9uTG9vcFxuICB9KTtcblxuICAvLyBjYW1lcmEgcmlnICYgY29udHJvbGxlcnNcbiAgdmFyIGNhbWVyYSA9IG51bGwsXG4gICAgY2FtZXJhUmlnID0gbnVsbDtcblxuICBpZiAob3B0aW9ucy5hciB8fCBvcHRpb25zLnZyKSB7XG4gICAgY2FtZXJhUmlnID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmFSaWcpXG4gICAgICAuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogc2NlbmUgfSk7XG4gIH1cblxuICB7XG4gICAgY2FtZXJhID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmEsIHtcbiAgICAgICAgZm92OiA5MCxcbiAgICAgICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgICAgbmVhcjogMSxcbiAgICAgICAgZmFyOiAxMDAwLFxuICAgICAgICBsYXllcnM6IDEsXG4gICAgICAgIGhhbmRsZVJlc2l6ZTogdHJ1ZVxuICAgICAgfSlcbiAgICAgIC5hZGRDb21wb25lbnQoVHJhbnNmb3JtKVxuICAgICAgLmFkZENvbXBvbmVudChBY3RpdmUpO1xuICB9XG5cbiAgbGV0IHJlbmRlclBhc3MgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoUmVuZGVyUGFzcywge1xuICAgIHNjZW5lOiBzY2VuZSxcbiAgICBjYW1lcmE6IGNhbWVyYVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIGNhbWVyYVJpZyxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgcmVuZGVyUGFzc1xuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJUSFJFRS5WZWN0b3IyIiwiVEhSRUUuVmVjdG9yMyIsIlRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsIiwiVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwiLCJUSFJFRS5NZXNoIiwiVEhSRUUuR3JvdXAiLCJUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCIsIlRIUkVFLlRleHR1cmUiLCJUSFJFRS5JbWFnZUxvYWRlciIsIlRIUkVFLldlYkdMUmVuZGVyZXIiLCJUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSIsIlRIUkVFLkZvbnRMb2FkZXIiLCJUSFJFRS5UZXh0R2VvbWV0cnkiLCJUSFJFRS5SZXBlYXRXcmFwcGluZyIsIlRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Gb2ciLCJUSFJFRS5Db2xvciIsIkVDU1kuV29ybGQiLCJUSFJFRS5DbG9jayIsIlRIUkVFLlNjZW5lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBTyxNQUFNLE1BQU0sQ0FBQztFQUNsQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7R0FDZDs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztHQUNwQjtDQUNGOztBQ1JNLE1BQU0sTUFBTSxDQUFDO0VBQ2xCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDO0lBQ2QsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDaEIsSUFBSSxD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

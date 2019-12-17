(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ecsy'), require('three'), require('three/examples/jsm/loaders/GLTFLoader.js'), require('three/examples/jsm/webxr/VRButton.js'), require('three/examples/jsm/webxr/ARButton.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'ecsy', 'three', 'three/examples/jsm/loaders/GLTFLoader.js', 'three/examples/jsm/webxr/VRButton.js', 'three/examples/jsm/webxr/ARButton.js'], factory) :
	(global = global || self, (function () {
		var current = global.ECSYTHREE;
		var exports = global.ECSYTHREE = {};
		factory(exports, global.ECSY, global.THREE, global.GLTFLoader_js, global.VRButton_js, global.ARButton_js);
		exports.noConflict = function () { global.ECSYTHREE = current; return exports; };
	}()));
}(this, (function (exports, ECSY, THREE, GLTFLoader_js, VRButton_js, ARButton_js) { 'use strict';

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

	class Dragging extends ECSY.TagComponent {}

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

	class Material {
	  constructor() {
	    this.color = 0xff0000;
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
	    this.position = new THREE.Vector3();
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
	    this.rotation = new THREE.Vector3();
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
	    this.position = new THREE.Vector3();
	    this.rotation = new THREE.Vector3();
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

	/**
	 * Create a Mesh based on the [Geometry] component and attach it to the entity using a [Object3D] component
	 */
	class GeometrySystem extends ECSY.System {
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
	            geometry = new THREE.TorusBufferGeometry(
	              component.radius,
	              component.tube,
	              component.radialSegments,
	              component.tubularSegments
	            );
	          }
	          break;
	        case "sphere":
	          {
	            geometry = new THREE.IcosahedronBufferGeometry(component.radius, 1);
	          }
	          break;
	        case "box":
	          {
	            geometry = new THREE.BoxBufferGeometry(
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

	      var material = new THREE.MeshLambertMaterial({
	        color: color,
	        flatShading: true
	      });

	      var object = new THREE.Mesh(geometry, material);
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
	var loader = new GLTFLoader_js.GLTFLoader().setPath("/assets/");

	class GLTFLoaderSystem extends ECSY.System {
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

	class SkyBoxSystem extends ECSY.System {
	  execute() {
	    let entities = this.queries.entities.results;
	    for (let i = 0; i < entities.length; i++) {
	      let entity = entities[i];

	      let skybox = entity.getComponent(SkyBox);

	      let group = new THREE.Group();
	      let geometry = new THREE.BoxBufferGeometry(100, 100, 100);
	      geometry.scale(1, 1, -1);

	      if (skybox.type === "cubemap-stereo") {
	        let textures = getTexturesFromAtlasFile(skybox.textureUrl, 12);

	        let materials = [];

	        for (let j = 0; j < 6; j++) {
	          materials.push(new THREE.MeshBasicMaterial({ map: textures[j] }));
	        }

	        let skyBox = new THREE.Mesh(geometry, materials);
	        skyBox.layers.set(1);
	        group.add(skyBox);

	        let materialsR = [];

	        for (let j = 6; j < 12; j++) {
	          materialsR.push(new THREE.MeshBasicMaterial({ map: textures[j] }));
	        }

	        let skyBoxR = new THREE.Mesh(geometry, materialsR);
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
	    textures[i] = new THREE.Texture();
	  }

	  let loader = new THREE.ImageLoader();
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
	    components: [SkyBox, ECSY.Not(Object3D)]
	  }
	};

	class VisibilitySystem extends ECSY.System {
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

	class WebGLRendererSystem extends ECSY.System {
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

	      var renderer = new THREE.WebGLRenderer({
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
	        renderer.xr.enabled = true;

	        if (component.vr) {
	          document.body.appendChild(VRButton_js.VRButton.createButton(renderer));
	        }

	        if (component.ar) {
	          document.body.appendChild(ARButton_js.ARButton.createButton(renderer));
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
	    components: [WebGLRenderer, ECSY.Not(WebGLRendererContext)]
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

	class TransformSystem extends ECSY.System {
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

	class CameraSystem extends ECSY.System {
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

	      let camera = new THREE.PerspectiveCamera(
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
	    components: [Camera, ECSY.Not(Object3D)]
	  },
	  cameras: {
	    components: [Camera, Object3D],
	    listen: {
	      changed: [Camera]
	    }
	  }
	};

	class TextGeometrySystem extends ECSY.System {
	  init() {
	    this.initialized = false;
	    var loader = new THREE.FontLoader();
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
	      var geometry = new THREE.TextGeometry(textComponent.text, {
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
	      var geometry = new THREE.TextGeometry(textComponent.text, {
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
	      var material = new THREE.MeshStandardMaterial({
	        color: color,
	        roughness: 0.7,
	        metalness: 0.0
	      });

	      var mesh = new THREE.Mesh(geometry, material);

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

	class EnvironmentSystem extends ECSY.System {
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
	      var groundTexture = new THREE.Texture(groundCanvas);
	      groundTexture.wrapS = THREE.RepeatWrapping;
	      groundTexture.wrapT = THREE.RepeatWrapping;
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

	      var groundMaterial = new THREE.MeshLambertMaterial({
	        map: groundTexture
	      });

	      let scene = entity.getComponent(Scene).value.getComponent(Object3D).value;
	      //scene.add(mesh);
	      var geometry = new THREE.PlaneBufferGeometry(
	        STAGE_SIZE + 2,
	        STAGE_SIZE + 2,
	        resolution - 1,
	        resolution - 1
	      );

	      let object = new THREE.Mesh(geometry, groundMaterial);
	      object.rotation.x = -Math.PI / 2;
	      object.receiveShadow = true;

	      entity.addComponent(Object3D, { value: object });
	      entity.addComponent(Parent, { value: window.entityScene });

	      const color = 0x333333;
	      const near = 20;
	      const far = 100;
	      scene.fog = new THREE.Fog(color, near, far);
	      scene.background = new THREE.Color(color);
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
	    .registerSystem(WebGLRendererSystem, { priority: 1 });
	}

	function initializeDefault(world = new ECSY.World(), options) {
	  init(world);

	  let animationLoop = options.animationLoop;
	  if (!animationLoop) {
	    const clock = new THREE.Clock();
	    animationLoop = () => {
	      world.execute(clock.getDelta(), clock.elapsedTime);
	    };
	  }

	  let scene = world
	    .createEntity()
	    .addComponent(Scene)
	    .addComponent(Object3D, { value: new THREE.Scene() });

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
	  } else {
	    camera = world.createEntity().addComponent(Camera, {
	      fov: 90,
	      aspect: window.innerWidth / window.innerHeight,
	      near: 1,
	      far: 1000,
	      layers: 1,
	      handleResize: true
	    });
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

	exports.Active = Active;
	exports.Camera = Camera;
	exports.CameraRig = CameraRig;
	exports.CameraSystem = CameraSystem;
	exports.Draggable = Draggable;
	exports.Dragging = Dragging;
	exports.Environment = Environment;
	exports.EnvironmentSystem = EnvironmentSystem;
	exports.GLTFLoaderSystem = GLTFLoaderSystem;
	exports.GLTFModel = GLTFModel;
	exports.Geometry = Geometry;
	exports.GeometrySystem = GeometrySystem;
	exports.Material = Material;
	exports.Object3D = Object3D;
	exports.Parent = Parent;
	exports.Position = Position;
	exports.RenderPass = RenderPass;
	exports.Rotation = Rotation;
	exports.Scene = Scene;
	exports.Sky = Sky;
	exports.SkyBox = SkyBox;
	exports.SkyBoxSystem = SkyBoxSystem;
	exports.TextGeometry = TextGeometry;
	exports.TextGeometrySystem = TextGeometrySystem;
	exports.Transform = Transform;
	exports.TransformSystem = TransformSystem;
	exports.VRController = VRController;
	exports.VisibilitySystem = VisibilitySystem;
	exports.Visible = Visible;
	exports.WebGLRendererContext = WebGLRendererContext;
	exports.WebGLRendererSystem = WebGLRendererSystem;
	exports.init = init;
	exports.initializeDefault = initializeDefault;

	Object.defineProperty(exports, '__esModule', { value: true });

})));

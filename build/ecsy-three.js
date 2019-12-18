(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ecsy'), require('three')) :
	typeof define === 'function' && define.amd ? define(['exports', 'ecsy', 'three'], factory) :
	(global = global || self, (function () {
		var current = global.ECSYTHREE;
		var exports = global.ECSYTHREE = {};
		factory(exports, global.ECSY, global.THREE);
		exports.noConflict = function () { global.ECSYTHREE = current; return exports; };
	}()));
}(this, (function (exports, ECSY, THREE) { 'use strict';

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
	    this.offset = new THREE.Vector2();
	    this.opacity = 1.0;
	    this.repeat = new THREE.Vector2(1, 1);
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

	class MaterialInstance extends ECSY.SystemStateComponent {
	  constructor() {
	    super();
	    this.value = new THREE.MeshStandardMaterial();
	  }

	  reset() {}
	}

	class MaterialSystem$1 extends ECSY.System {
	  execute() {
	    this.queries.new.results.forEach(entity => {
	      const component = entity.getComponent(Material);
	    });
	  }
	}

	MaterialSystem$1.queries = {
	  new: {
	    components: [Material, ECSY.Not(MaterialInstance)]
	  }
	};

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

	//import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

	// @todo Use parameter and loader manager
	var loader = new GLTFLoader().setPath("/assets/");

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

	// import { VRButton } from "three/examples/jsm/webxr/VRButton.js";
	// import { ARButton } from "three/examples/jsm/webxr/ARButton.js";

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
	    .registerSystem(MaterialSystem)
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
	exports.MaterialSystem = MaterialSystem$1;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvQWN0aXZlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9FbnZpcm9ubWVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvR0xURk1vZGVsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvTWF0ZXJpYWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9PYmplY3QzRC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1BhcmVudC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Bvc2l0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUmVuZGVyUGFzcy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdGF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2NlbmUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3kuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvY29tcG9uZW50cy9UZXh0R2VvbWV0cnkuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UcmFuc2Zvcm0uanMiLCIuLi9zcmMvY29tcG9uZW50cy9WaXNpYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVlJDb250cm9sbGVyLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvV2ViR0xSZW5kZXJlci5qcyIsIi4uL3NyYy9zeXN0ZW1zL01hdGVyaWFsU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9FbnZpcm9ubWVudFN5c3RlbS5qcyIsIi4uL3NyYy9pbml0aWFsaXplLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBY3RpdmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZvdiA9IDQ1O1xuICAgIHRoaXMuYXNwZWN0ID0gMTtcbiAgICB0aGlzLm5lYXIgPSAxO1xuICAgIHRoaXMuZmFyID0gMTAwMDtcbiAgICB0aGlzLmxheWVycyA9IDA7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUgPSB0cnVlO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYVJpZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVmdEhhbmQgPSBudWxsO1xuICAgIHRoaXMucmlnaHRIYW5kID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEcmFnZ2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgRHJhZ2dpbmcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBFbnZpcm9ubWVudCB7XG4gIHJlc2V0KCkge31cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLnByZXNldCA9IFwiZGVmYXVsdFwiO1xuICAgIHRoaXMuc2VlZCA9IDE7XG4gICAgdGhpcy5za3lUeXBlID0gXCJhdG1vc3BoZXJlXCI7XG4gICAgdGhpcy5za3lDb2xvciA9IFwiXCI7XG4gICAgdGhpcy5ob3Jpem9uQ29sb3IgPSBcIlwiO1xuICAgIHRoaXMubGlnaHRpbmcgPSBcImRpc3RhbnRcIjtcbiAgICB0aGlzLnNoYWRvdyA9IGZhbHNlO1xuICAgIHRoaXMuc2hhZG93U2l6ZSA9IDEwO1xuICAgIHRoaXMubGlnaHRQb3NpdGlvbiA9IHsgeDogMCwgeTogMSwgejogLTAuMiB9O1xuICAgIHRoaXMuZm9nID0gMDtcblxuICAgIHRoaXMuZmxhdFNoYWRpbmcgPSBmYWxzZTtcbiAgICB0aGlzLnBsYXlBcmVhID0gMTtcblxuICAgIHRoaXMuZ3JvdW5kID0gXCJmbGF0XCI7XG4gICAgdGhpcy5ncm91bmRZU2NhbGUgPSAzO1xuICAgIHRoaXMuZ3JvdW5kVGV4dHVyZSA9IFwibm9uZVwiO1xuICAgIHRoaXMuZ3JvdW5kQ29sb3IgPSBcIiM1NTNlMzVcIjtcbiAgICB0aGlzLmdyb3VuZENvbG9yMiA9IFwiIzY5NDQzOVwiO1xuXG4gICAgdGhpcy5kcmVzc2luZyA9IFwibm9uZVwiO1xuICAgIHRoaXMuZHJlc3NpbmdBbW91bnQgPSAxMDtcbiAgICB0aGlzLmRyZXNzaW5nQ29sb3IgPSBcIiM3OTU0NDlcIjtcbiAgICB0aGlzLmRyZXNzaW5nU2NhbGUgPSA1O1xuICAgIHRoaXMuZHJlc3NpbmdWYXJpYW5jZSA9IHsgeDogMSwgeTogMSwgejogMSB9O1xuICAgIHRoaXMuZHJlc3NpbmdVbmlmb3JtU2NhbGUgPSB0cnVlO1xuICAgIHRoaXMuZHJlc3NpbmdPblBsYXlBcmVhID0gMDtcblxuICAgIHRoaXMuZ3JpZCA9IFwibm9uZVwiO1xuICAgIHRoaXMuZ3JpZENvbG9yID0gXCIjY2NjXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHZW9tZXRyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdMVEZNb2RlbCB7fVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjb25zdCBTSURFUyA9IHtcbiAgZnJvbnQ6IDAsXG4gIGJhY2s6IDEsXG4gIGRvdWJsZTogMlxufTtcblxuZXhwb3J0IGNvbnN0IFNIQURFUlMgPSB7XG4gIHN0YW5kYXJkOiAwLFxuICBmbGF0OiAxXG59O1xuXG5leHBvcnQgY29uc3QgQkxFTkRJTkcgPSB7XG4gIG5vcm1hbDogMCxcbiAgYWRkaXRpdmU6IDEsXG4gIHN1YnRyYWN0aXZlOiAyLFxuICBtdWx0aXBseTogM1xufTtcblxuZXhwb3J0IGNvbnN0IFZFUlRFWF9DT0xPUlMgPSB7XG4gIG5vbmU6IDAsXG4gIGZhY2U6IDEsXG4gIHZlcnRleDogMlxufTtcblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQgPSBuZXcgVEhSRUUuVmVjdG9yMigpO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdCA9IG5ldyBUSFJFRS5WZWN0b3IyKDEsIDEpO1xuICAgIHRoaXMuc2hhZGVyID0gU0hBREVSUy5zdGFuZGFyZDtcbiAgICB0aGlzLnNpZGUgPSBTSURFUy5mcm9udDtcbiAgICB0aGlzLnRyYW5zcGFyZW50ID0gZmFsc2U7XG4gICAgdGhpcy52ZXJ0ZXhDb2xvcnMgPSBWRVJURVhfQ09MT1JTLm5vbmU7XG4gICAgdGhpcy52aXNpYmxlID0gdHJ1ZTtcbiAgICB0aGlzLmJsZW5kaW5nID0gQkxFTkRJTkcubm9ybWFsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICAgIHRoaXMuYWxwaGFUZXN0ID0gMDtcbiAgICB0aGlzLmRlcHRoVGVzdCA9IHRydWU7XG4gICAgdGhpcy5kZXB0aFdyaXRlID0gdHJ1ZTtcbiAgICB0aGlzLmZsYXRTaGFkaW5nID0gZmFsc2U7XG4gICAgdGhpcy5ucG90ID0gZmFsc2U7XG4gICAgdGhpcy5vZmZzZXQuc2V0KDAsIDApO1xuICAgIHRoaXMub3BhY2l0eSA9IDEuMDtcbiAgICB0aGlzLnJlcGVhdC5zZXQoMSwgMSk7XG4gICAgdGhpcy5zaGFkZXIgPSBTSEFERVJTLnN0YW5kYXJkO1xuICAgIHRoaXMuc2lkZSA9IFNJREVTLmZyb250O1xuICAgIHRoaXMudHJhbnNwYXJlbnQgPSBmYWxzZTtcbiAgICB0aGlzLnZlcnRleENvbG9ycyA9IFZFUlRFWF9DT0xPUlMubm9uZTtcbiAgICB0aGlzLnZpc2libGUgPSB0cnVlO1xuICAgIHRoaXMuYmxlbmRpbmcgPSBCTEVORElORy5ub3JtYWw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBPYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBQYXJlbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFBvc2l0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFJlbmRlclBhc3Mge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2NlbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5Qm94IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG4gIHJlc2V0KCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeSB7XG4gIHJlc2V0KCkge31cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wb3NpdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICBjb3B5KHNyYykge1xuICAgIHRoaXMucG9zaXRpb24uY29weShzcmMucG9zaXRpb24pO1xuICAgIHRoaXMucm90YXRpb24uY29weShzcmMucm90YXRpb24pO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBWaXNpYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVlJDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZCA9IDA7XG4gICAgdGhpcy5jb250cm9sbGVyID0gbnVsbDtcbiAgfVxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudnIgPSBmYWxzZTtcbiAgICB0aGlzLmFyID0gZmFsc2U7XG4gICAgdGhpcy5hbnRpYWxpYXMgPSB0cnVlO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgICB0aGlzLmdhbW1hT3V0cHV0ID0gdHJ1ZTtcbiAgICB0aGlzLnNoYWRvd01hcCA9IHRydWU7XG4gIH1cbn1cblxuLypcbmV4cG9ydCBjb25zdCBXZWJHTFJlbmRlcmVyID0gY3JlYXRlQ29tcG9uZW50Q2xhc3MoXG4gIHtcbiAgICB2cjogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGdhbW1hT3V0cHV0OiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogZmFsc2UgfVxuICB9LFxuICBcIldlYkdMUmVuZGVyZXJcIlxuKTtcbiovXG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSwgTm90LCBTeXN0ZW1TdGF0ZUNvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBNYXRlcmlhbCxcbiAgT2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5jbGFzcyBNYXRlcmlhbEluc3RhbmNlIGV4dGVuZHMgU3lzdGVtU3RhdGVDb21wb25lbnQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMudmFsdWUgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoKTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cblxuZXhwb3J0IGNsYXNzIE1hdGVyaWFsU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMubmV3LnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgY29uc3QgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChNYXRlcmlhbCk7XG4gICAgfSk7XG4gIH1cbn1cblxuTWF0ZXJpYWxTeXN0ZW0ucXVlcmllcyA9IHtcbiAgbmV3OiB7XG4gICAgY29tcG9uZW50czogW01hdGVyaWFsLCBOb3QoTWF0ZXJpYWxJbnN0YW5jZSldXG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBHZW9tZXRyeSxcbiAgT2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG4vKipcbiAqIENyZWF0ZSBhIE1lc2ggYmFzZWQgb24gdGhlIFtHZW9tZXRyeV0gY29tcG9uZW50IGFuZCBhdHRhY2ggaXQgdG8gdGhlIGVudGl0eSB1c2luZyBhIFtPYmplY3QzRF0gY29tcG9uZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gUmVtb3ZlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0UmVtb3ZlZENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIHZhciBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoTWF0ZXJpYWwpKSB7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4qL1xuXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVHJhbnNmb3JtKSkge1xuICAgICAgICB2YXIgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0aW9uKSB7XG4gICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChFbGVtZW50KSAmJiAhZW50aXR5Lmhhc0NvbXBvbmVudChEcmFnZ2FibGUpKSB7XG4gICAgICAvLyAgICAgICAgb2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweDMzMzMzMyk7XG4gICAgICAvLyAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dlb21ldHJ5XSwgLy8gQHRvZG8gVHJhbnNmb3JtOiBBcyBvcHRpb25hbCwgaG93IHRvIGRlZmluZSBpdD9cbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsIi8vaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcblxuLy8gQHRvZG8gVXNlIHBhcmFtZXRlciBhbmQgbG9hZGVyIG1hbmFnZXJcbnZhciBsb2FkZXIgPSBuZXcgR0xURkxvYWRlcigpLnNldFBhdGgoXCIvYXNzZXRzL1wiKTtcblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHTFRGTW9kZWwpO1xuXG4gICAgICBsb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBnbHRmID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGVudk1hcDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuKi9cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ2x0Zi5zY2VuZSB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdMVEZMb2FkZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURk1vZGVsXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgU2t5Qm94LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuXG4gICAgICBsZXQgc2t5Ym94ID0gZW50aXR5LmdldENvbXBvbmVudChTa3lCb3gpO1xuXG4gICAgICBsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgaWYgKHNreWJveC50eXBlID09PSBcImN1YmVtYXAtc3RlcmVvXCIpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHNreWJveC50ZXh0dXJlVXJsLCAxMik7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgIHNreUJveC5sYXllcnMuc2V0KDEpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94KTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzUiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3hSID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsc1IpO1xuICAgICAgICBza3lCb3hSLmxheWVycy5zZXQoMik7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3hSKTtcblxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBncm91cCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gc2t5Ym94IHR5cGU6IFwiLCBza3lib3gudHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShhdGxhc0ltZ1VybCwgdGlsZXNOdW0pIHtcbiAgbGV0IHRleHR1cmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc051bTsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB9XG5cbiAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcigpO1xuICBsb2FkZXIubG9hZChhdGxhc0ltZ1VybCwgZnVuY3Rpb24oaW1hZ2VPYmopIHtcbiAgICBsZXQgY2FudmFzLCBjb250ZXh0O1xuICAgIGxldCB0aWxlV2lkdGggPSBpbWFnZU9iai5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGlsZVdpZHRoO1xuICAgICAgY2FudmFzLndpZHRoID0gdGlsZVdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIGltYWdlT2JqLFxuICAgICAgICB0aWxlV2lkdGggKiBpLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGhcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlc1tpXS5pbWFnZSA9IGNhbnZhcztcbiAgICAgIHRleHR1cmVzW2ldLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0ZXh0dXJlcztcbn1cblxuU2t5Qm94U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1NreUJveCwgTm90KE9iamVjdDNEKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWaXNpYmxlLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBWaXNpYmlsaXR5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgcHJvY2Vzc1Zpc2liaWxpdHkoZW50aXRpZXMpIHtcbiAgICBlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWUudmlzaWJsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoXG4gICAgICAgIFZpc2libGVcbiAgICAgICkudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkKTtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkKTtcbiAgfVxufVxuXG5WaXNpYmlsaXR5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1Zpc2libGUsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhLFxuICBBY3RpdmUsXG4gIFdlYkdMUmVuZGVyZXIsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbi8vIGltcG9ydCB7IFZSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9WUkJ1dHRvbi5qc1wiO1xuLy8gaW1wb3J0IHsgQVJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL0FSQnV0dG9uLmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IHJlbmRlcmVycyA9IHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cztcbiAgICByZW5kZXJlcnMuZm9yRWFjaChyZW5kZXJlckVudGl0eSA9PiB7XG4gICAgICB2YXIgcmVuZGVyZXIgPSByZW5kZXJlckVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlclBhc3Nlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIHBhc3MgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFJlbmRlclBhc3MpO1xuICAgICAgICB2YXIgc2NlbmUgPSBwYXNzLnNjZW5lLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgICAgdGhpcy5xdWVyaWVzLmFjdGl2ZUNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYUVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNhbWVyYSA9IGNhbWVyYUVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8vIFVuaW5pdGlhbGl6ZWQgcmVuZGVyZXJzXG4gICAgdGhpcy5xdWVyaWVzLnVuaW5pdGlhbGl6ZWRSZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcblxuICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgICBhbnRpYWxpYXM6IGNvbXBvbmVudC5hbnRpYWxpYXNcbiAgICAgIH0pO1xuXG4gICAgICBpZiAoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0QW5pbWF0aW9uTG9vcChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgaWYgKGNvbXBvbmVudC5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuZ2FtbWFPdXRwdXQgPSBjb21wb25lbnQuZ2FtbWFPdXRwdXQ7XG4gICAgICByZW5kZXJlci5zaGFkb3dNYXAuZW5hYmxlZCA9IGNvbXBvbmVudC5zaGFkb3dNYXA7XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIgfHwgY29tcG9uZW50LmFyKSB7XG4gICAgICAgIHJlbmRlcmVyLnhyLmVuYWJsZWQgPSB0cnVlO1xuXG4gICAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKFZSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC5hcikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoQVJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVHJhbnNmb3JtLCBQYXJlbnQsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gSGllcmFyY2h5XG4gICAgbGV0IGFkZGVkID0gdGhpcy5xdWVyaWVzLnBhcmVudC5hZGRlZDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gYWRkZWRbaV07XG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgaWYgKHBhcmVudEVudGl0eS5oYXNDb21wb25lbnQoT2JqZWN0M0QpKSB7XG4gICAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICB2YXIgY2hpbGRPYmplY3QzRCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gVHJhbnNmb3Jtc1xuICAgIHZhciB0cmFuc2Zvcm1zID0gdGhpcy5xdWVyaWVzLnRyYW5zZm9ybXM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmFkZGVkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdHJhbnNmb3Jtcy5hZGRlZFtpXTtcbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5jaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gdHJhbnNmb3Jtcy5jaGFuZ2VkW2ldO1xuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuICB9XG59XG5cblRyYW5zZm9ybVN5c3RlbS5xdWVyaWVzID0ge1xuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfSxcbiAgdHJhbnNmb3Jtczoge1xuICAgIGNvbXBvbmVudHM6IFtPYmplY3QzRCwgVHJhbnNmb3JtXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1RyYW5zZm9ybV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBDYW1lcmEsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgQ2FtZXJhU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5jYW1lcmFzLnJlc3VsdHMuZm9yRWFjaChjYW1lcmEgPT4ge1xuICAgICAgICAgIGxldCBjb21wb25lbnQgPSBjYW1lcmEuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgICAgIGNhbWVyYS5nZXRNdXRhYmxlQ29tcG9uZW50KENhbWVyYSkuYXNwZWN0ID1cbiAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCBjaGFuZ2VkID0gdGhpcy5xdWVyaWVzLmNhbWVyYXMuY2hhbmdlZDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBjaGFuZ2VkW2ldO1xuXG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgbGV0IGNhbWVyYTNkID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBpZiAoY2FtZXJhM2QuYXNwZWN0ICE9PSBjb21wb25lbnQuYXNwZWN0KSB7XG4gICAgICAgIGNhbWVyYTNkLmFzcGVjdCA9IGNvbXBvbmVudC5hc3BlY3Q7XG4gICAgICAgIGNhbWVyYTNkLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgIH1cbiAgICAgIC8vIEB0b2RvIERvIGl0IGZvciB0aGUgcmVzdCBvZiB0aGUgdmFsdWVzXG4gICAgfVxuXG4gICAgdGhpcy5xdWVyaWVzLmNhbWVyYXNVbmluaXRpYWxpemVkLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcblxuICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgICAgY29tcG9uZW50LmZvdixcbiAgICAgICAgY29tcG9uZW50LmFzcGVjdCxcbiAgICAgICAgY29tcG9uZW50Lm5lYXIsXG4gICAgICAgIGNvbXBvbmVudC5mYXJcbiAgICAgICk7XG5cbiAgICAgIGNhbWVyYS5sYXllcnMuZW5hYmxlKGNvbXBvbmVudC5sYXllcnMpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBjYW1lcmEgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuQ2FtZXJhU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGNhbWVyYXNVbmluaXRpYWxpemVkOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgTm90KE9iamVjdDNEKV1cbiAgfSxcbiAgY2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtDYW1lcmFdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVGV4dEdlb21ldHJ5LCBPYmplY3QzRCB9IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgdGhpcy5mb250ID0gbnVsbDtcbiAgICBsb2FkZXIubG9hZChcIi9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIiwgZm9udCA9PiB7XG4gICAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGlmICghdGhpcy5mb250KSByZXR1cm47XG5cbiAgICB2YXIgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkO1xuICAgIGNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBvYmplY3QuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcbiAgICB9KTtcblxuICAgIHZhciBhZGRlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcbiAgICBhZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29sb3IgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG4gICAgICBjb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICByb3VnaG5lc3M6IDAuNyxcbiAgICAgICAgbWV0YWxuZXNzOiAwLjBcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG1lc2ggfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRHZW9tZXRyeV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQsIFNjZW5lLCBPYmplY3QzRCwgRW52aXJvbm1lbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgRW52aXJvbm1lbnRTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHRoaXMucXVlcmllcy5lbnZpcm9ubWVudHMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgLy8gc3RhZ2UgZ3JvdW5kIGRpYW1ldGVyIChhbmQgc2t5IHJhZGl1cylcbiAgICAgIHZhciBTVEFHRV9TSVpFID0gMjAwO1xuXG4gICAgICAvLyBjcmVhdGUgZ3JvdW5kXG4gICAgICAvLyB1cGRhdGUgZ3JvdW5kLCBwbGF5YXJlYSBhbmQgZ3JpZCB0ZXh0dXJlcy5cbiAgICAgIHZhciBncm91bmRSZXNvbHV0aW9uID0gMjA0ODtcbiAgICAgIHZhciB0ZXhNZXRlcnMgPSAyMDsgLy8gZ3JvdW5kIHRleHR1cmUgb2YgMjAgeCAyMCBtZXRlcnNcbiAgICAgIHZhciB0ZXhSZXBlYXQgPSBTVEFHRV9TSVpFIC8gdGV4TWV0ZXJzO1xuXG4gICAgICB2YXIgcmVzb2x1dGlvbiA9IDY0OyAvLyBudW1iZXIgb2YgZGl2aXNpb25zIG9mIHRoZSBncm91bmQgbWVzaFxuXG4gICAgICB2YXIgZ3JvdW5kQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGdyb3VuZENhbnZhcy53aWR0aCA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRDYW52YXMuaGVpZ2h0ID0gZ3JvdW5kUmVzb2x1dGlvbjtcbiAgICAgIHZhciBncm91bmRUZXh0dXJlID0gbmV3IFRIUkVFLlRleHR1cmUoZ3JvdW5kQ2FudmFzKTtcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFMgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUud3JhcFQgPSBUSFJFRS5SZXBlYXRXcmFwcGluZztcbiAgICAgIGdyb3VuZFRleHR1cmUucmVwZWF0LnNldCh0ZXhSZXBlYXQsIHRleFJlcGVhdCk7XG5cbiAgICAgIHRoaXMuZW52aXJvbm1lbnREYXRhID0ge1xuICAgICAgICBncm91bmRDb2xvcjogXCIjNDU0NTQ1XCIsXG4gICAgICAgIGdyb3VuZENvbG9yMjogXCIjNWQ1ZDVkXCJcbiAgICAgIH07XG5cbiAgICAgIHZhciBncm91bmRjdHggPSBncm91bmRDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgICB2YXIgc2l6ZSA9IGdyb3VuZFJlc29sdXRpb247XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3I7XG4gICAgICBncm91bmRjdHguZmlsbFJlY3QoMCwgMCwgc2l6ZSwgc2l6ZSk7XG4gICAgICBncm91bmRjdHguZmlsbFN0eWxlID0gdGhpcy5lbnZpcm9ubWVudERhdGEuZ3JvdW5kQ29sb3IyO1xuICAgICAgdmFyIG51bSA9IE1hdGguZmxvb3IodGV4TWV0ZXJzIC8gMik7XG4gICAgICB2YXIgc3RlcCA9IHNpemUgLyAodGV4TWV0ZXJzIC8gMik7IC8vIDIgbWV0ZXJzID09IDxzdGVwPiBwaXhlbHNcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtICsgMTsgaSArPSAyKSB7XG4gICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgbnVtICsgMTsgaisrKSB7XG4gICAgICAgICAgZ3JvdW5kY3R4LmZpbGxSZWN0KFxuICAgICAgICAgICAgTWF0aC5mbG9vcigoaSArIChqICUgMikpICogc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKGogKiBzdGVwKSxcbiAgICAgICAgICAgIE1hdGguZmxvb3Ioc3RlcCksXG4gICAgICAgICAgICBNYXRoLmZsb29yKHN0ZXApXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBncm91bmRUZXh0dXJlLm5lZWRzVXBkYXRlID0gdHJ1ZTtcblxuICAgICAgdmFyIGdyb3VuZE1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBtYXA6IGdyb3VuZFRleHR1cmVcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgc2NlbmUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNjZW5lKS52YWx1ZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgLy9zY2VuZS5hZGQobWVzaCk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuUGxhbmVCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgU1RBR0VfU0laRSArIDIsXG4gICAgICAgIFNUQUdFX1NJWkUgKyAyLFxuICAgICAgICByZXNvbHV0aW9uIC0gMSxcbiAgICAgICAgcmVzb2x1dGlvbiAtIDFcbiAgICAgICk7XG5cbiAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgZ3JvdW5kTWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnggPSAtTWF0aC5QSSAvIDI7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiB3aW5kb3cuZW50aXR5U2NlbmUgfSk7XG5cbiAgICAgIGNvbnN0IGNvbG9yID0gMHgzMzMzMzM7XG4gICAgICBjb25zdCBuZWFyID0gMjA7XG4gICAgICBjb25zdCBmYXIgPSAxMDA7XG4gICAgICBzY2VuZS5mb2cgPSBuZXcgVEhSRUUuRm9nKGNvbG9yLCBuZWFyLCBmYXIpO1xuICAgICAgc2NlbmUuYmFja2dyb3VuZCA9IG5ldyBUSFJFRS5Db2xvcihjb2xvcik7XG4gICAgfSk7XG4gIH1cbn1cblxuRW52aXJvbm1lbnRTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW52aXJvbm1lbnRzOiB7XG4gICAgY29tcG9uZW50czogW1NjZW5lLCBFbnZpcm9ubWVudF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIEVDU1kgZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1TeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhUmlnIH0gZnJvbSBcIi4vY29tcG9uZW50cy9DYW1lcmFSaWcuanNcIjtcbmltcG9ydCB7IFBhcmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyLFxuICBTY2VuZSxcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQod29ybGQpIHtcbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVHJhbnNmb3JtU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShDYW1lcmFTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKE1hdGVyaWFsU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZURlZmF1bHQod29ybGQgPSBuZXcgRUNTWS5Xb3JsZCgpLCBvcHRpb25zKSB7XG4gIGluaXQod29ybGQpO1xuXG4gIGxldCBhbmltYXRpb25Mb29wID0gb3B0aW9ucy5hbmltYXRpb25Mb29wO1xuICBpZiAoIWFuaW1hdGlvbkxvb3ApIHtcbiAgICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuICAgIGFuaW1hdGlvbkxvb3AgPSAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9O1xuICB9XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG5ldyBUSFJFRS5TY2VuZSgpIH0pO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgYXI6IG9wdGlvbnMuYXIsXG4gICAgdnI6IG9wdGlvbnMudnIsXG4gICAgYW5pbWF0aW9uTG9vcDogYW5pbWF0aW9uTG9vcFxuICB9KTtcblxuICAvLyBjYW1lcmEgcmlnICYgY29udHJvbGxlcnNcbiAgdmFyIGNhbWVyYSA9IG51bGwsXG4gICAgY2FtZXJhUmlnID0gbnVsbDtcblxuICBpZiAob3B0aW9ucy5hciB8fCBvcHRpb25zLnZyKSB7XG4gICAgY2FtZXJhUmlnID0gd29ybGRcbiAgICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgICAgLmFkZENvbXBvbmVudChDYW1lcmFSaWcpXG4gICAgICAuYWRkQ29tcG9uZW50KFBhcmVudCwgeyB2YWx1ZTogc2NlbmUgfSk7XG4gIH0gZWxzZSB7XG4gICAgY2FtZXJhID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KENhbWVyYSwge1xuICAgICAgZm92OiA5MCxcbiAgICAgIGFzcGVjdDogd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgICBuZWFyOiAxLFxuICAgICAgZmFyOiAxMDAwLFxuICAgICAgbGF5ZXJzOiAxLFxuICAgICAgaGFuZGxlUmVzaXplOiB0cnVlXG4gICAgfSk7XG4gIH1cblxuICBsZXQgcmVuZGVyUGFzcyA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChSZW5kZXJQYXNzLCB7XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd29ybGQsXG4gICAgZW50aXRpZXM6IHtcbiAgICAgIHNjZW5lLFxuICAgICAgY2FtZXJhLFxuICAgICAgY2FtZXJhUmlnLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICByZW5kZXJQYXNzXG4gICAgfVxuICB9O1xufVxuIl0sIm5hbWVzIjpbIlRhZ0NvbXBvbmVudCIsIlRIUkVFLlZlY3RvcjIiLCJUSFJFRS5WZWN0b3IzIiwiU3lzdGVtU3RhdGVDb21wb25lbnQiLCJUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCIsIk1hdGVyaWFsU3lzdGVtIiwiU3lzdGVtIiwiTm90IiwiVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwiLCJUSFJFRS5NZXNoIiwiVEhSRUUuR3JvdXAiLCJUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCIsIlRIUkVFLlRleHR1cmUiLCJUSFJFRS5JbWFnZUxvYWRlciIsIlRIUkVFLldlYkdMUmVuZGVyZXIiLCJUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSIsIlRIUkVFLkZvbnRMb2FkZXIiLCJUSFJFRS5UZXh0R2VvbWV0cnkiLCJUSFJFRS5SZXBlYXRXcmFwcGluZyIsIlRIUkVFLlBsYW5lQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Gb2ciLCJUSFJFRS5Db2xvciIsIkVDU1kuV29ybGQiLCJUSFJFRS5DbG9jayIsIlRIUkVFLlNjZW5lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztDQUFPLE1BQU0sTUFBTSxDQUFDO0NBQ3BCLEVBQUUsV0FBVyxHQUFHO0NBQ2hCLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0NBQ2pCLEdBQUc7O0NBRUgsRUFBRSxLQUFLLEdBQUc7Q0FDVixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0NBQ3ZCLEdBQUc7Q0FDSCxDQUFDOztDQ1JNLE1BQU0sTUFBTSxDQUFDO0NBQ3BCLEVBQUUsV0FBVyxHQUFHO0NBQ2hCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7Q0FDbEIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztDQUNwQixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0NBQ2xCLElBQUksSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUM7Q0FDcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztDQUNwQixJQUFJLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0NBQzdCLEdBQUc7O0NBRUgsRUFBRSxLQUFLLEdBQUcsRUFBRTtDQUNaLENBQUM7O0NDWE0s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

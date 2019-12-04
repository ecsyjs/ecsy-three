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
	    this.gammaInput = true;
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
	    gammaInput: { default: true },
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

	      renderer.gammaInput = component.gammaInput;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvQWN0aXZlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL01hdGVyaWFsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JlbmRlclBhc3MuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1dlYkdMUmVuZGVyZXIuanMiLCIuLi9zcmMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9pbml0aWFsaXplLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBY3RpdmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmEge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmZvdiA9IDQ1O1xuICAgIHRoaXMuYXNwZWN0ID0gMTtcbiAgICB0aGlzLm5lYXIgPSAxO1xuICAgIHRoaXMuZmFyID0gMTAwMDtcbiAgICB0aGlzLmxheWVycyA9IDA7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUgPSB0cnVlO1xuICB9XG5cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYVJpZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVmdEhhbmQgPSBudWxsO1xuICAgIHRoaXMucmlnaHRIYW5kID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEcmFnZ2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgRHJhZ2dpbmcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBHZW9tZXRyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdMVEZNb2RlbCB7fVxuIiwiZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjZW5lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreUJveCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnkge1xuICByZXNldCgpIHt9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgY29weShzcmMpIHtcbiAgICB0aGlzLnBvc2l0aW9uLmNvcHkoc3JjLnBvc2l0aW9uKTtcbiAgICB0aGlzLnJvdGF0aW9uLmNvcHkoc3JjLnJvdGF0aW9uKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVmlzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZyID0gZmFsc2U7XG4gICAgdGhpcy5hciA9IGZhbHNlO1xuICAgIHRoaXMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRydWU7XG4gICAgdGhpcy5nYW1tYUlucHV0ID0gdHJ1ZTtcbiAgICB0aGlzLmdhbW1hT3V0cHV0ID0gdHJ1ZTtcbiAgICB0aGlzLnNoYWRvd01hcCA9IHRydWU7XG4gIH1cbn1cblxuLypcbmV4cG9ydCBjb25zdCBXZWJHTFJlbmRlcmVyID0gY3JlYXRlQ29tcG9uZW50Q2xhc3MoXG4gIHtcbiAgICB2cjogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGdhbW1hSW5wdXQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGdhbW1hT3V0cHV0OiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogZmFsc2UgfVxuICB9LFxuICBcIldlYkdMUmVuZGVyZXJcIlxuKTtcbiovXG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBHZW9tZXRyeSxcbiAgT2JqZWN0M0QsXG4gIFRyYW5zZm9ybSxcbiAgLy8gIEVsZW1lbnQsXG4gIC8vICBEcmFnZ2FibGUsXG4gIFBhcmVudFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG4vKipcbiAqIENyZWF0ZSBhIE1lc2ggYmFzZWQgb24gdGhlIFtHZW9tZXRyeV0gY29tcG9uZW50IGFuZCBhdHRhY2ggaXQgdG8gdGhlIGVudGl0eSB1c2luZyBhIFtPYmplY3QzRF0gY29tcG9uZW50XG4gKi9cbmV4cG9ydCBjbGFzcyBHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gUmVtb3ZlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5yZW1vdmVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0UmVtb3ZlZENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIHZhciBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoTWF0ZXJpYWwpKSB7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICB9XG4qL1xuXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaExhbWJlcnRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVHJhbnNmb3JtKSkge1xuICAgICAgICB2YXIgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0aW9uKSB7XG4gICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChFbGVtZW50KSAmJiAhZW50aXR5Lmhhc0NvbXBvbmVudChEcmFnZ2FibGUpKSB7XG4gICAgICAvLyAgICAgICAgb2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweDMzMzMzMyk7XG4gICAgICAvLyAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dlb21ldHJ5XSwgLy8gQHRvZG8gVHJhbnNmb3JtOiBBcyBvcHRpb25hbCwgaG93IHRvIGRlZmluZSBpdD9cbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvR0xURkxvYWRlci5qc1wiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL1BhcmVudC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgR0xURk1vZGVsIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvR0xURk1vZGVsLmpzXCI7XG5cbi8vIEB0b2RvIFVzZSBwYXJhbWV0ZXIgYW5kIGxvYWRlciBtYW5hZ2VyXG52YXIgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXIoKS5zZXRQYXRoKFwiL2Fzc2V0cy9cIik7XG5cbmV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURk1vZGVsKTtcblxuICAgICAgbG9hZGVyLmxvYWQoY29tcG9uZW50LnVybCwgZ2x0ZiA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgIGdsdGYuc2NlbmUudHJhdmVyc2UoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgICBpZiAoY2hpbGQuaXNNZXNoKSB7XG4gICAgICAgICAgICBjaGlsZC5tYXRlcmlhbC5lbnZNYXAgPSBlbnZNYXA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiovXG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdsdGYuc2NlbmUgfSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5HTFRGTG9hZGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dMVEZNb2RlbF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFNreUJveCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBTa3lCb3hTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgbGV0IHNreWJveCA9IGVudGl0eS5nZXRDb21wb25lbnQoU2t5Qm94KTtcblxuICAgICAgbGV0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMTAwLCAxMDAsIDEwMCk7XG4gICAgICBnZW9tZXRyeS5zY2FsZSgxLCAxLCAtMSk7XG5cbiAgICAgIGlmIChza3lib3gudHlwZSA9PT0gXCJjdWJlbWFwLXN0ZXJlb1wiKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShza3lib3gudGV4dHVyZVVybCwgMTIpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFscy5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgICBza3lCb3gubGF5ZXJzLnNldCgxKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveCk7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFsc1IgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gNjsgaiA8IDEyOyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHNSLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94UiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHNSKTtcbiAgICAgICAgc2t5Qm94Ui5sYXllcnMuc2V0KDIpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94Uik7XG5cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmtub3duIHNreWJveCB0eXBlOiBcIiwgc2t5Ym94LnR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoYXRsYXNJbWdVcmwsIHRpbGVzTnVtKSB7XG4gIGxldCB0ZXh0dXJlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXNOdW07IGkrKykge1xuICAgIHRleHR1cmVzW2ldID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgfVxuXG4gIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoKTtcbiAgbG9hZGVyLmxvYWQoYXRsYXNJbWdVcmwsIGZ1bmN0aW9uKGltYWdlT2JqKSB7XG4gICAgbGV0IGNhbnZhcywgY29udGV4dDtcbiAgICBsZXQgdGlsZVdpZHRoID0gaW1hZ2VPYmouaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRpbGVXaWR0aDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRpbGVXaWR0aDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZU9iaixcbiAgICAgICAgdGlsZVdpZHRoICogaSxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoXG4gICAgICApO1xuICAgICAgdGV4dHVyZXNbaV0uaW1hZ2UgPSBjYW52YXM7XG4gICAgICB0ZXh0dXJlc1tpXS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGV4dHVyZXM7XG59XG5cblNreUJveFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtTa3lCb3gsIE5vdChPYmplY3QzRCldXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVmlzaWJsZSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJpbGl0eVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHByb2Nlc3NWaXNpYmlsaXR5KGVudGl0aWVzKSB7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFxuICAgICAgICBWaXNpYmxlXG4gICAgICApLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFJlbmRlclBhc3MsXG4gIENhbWVyYSxcbiAgQWN0aXZlLFxuICBXZWJHTFJlbmRlcmVyLFxuICBPYmplY3QzRFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBWUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvVlJCdXR0b24uanNcIjtcbmltcG9ydCB7IEFSQnV0dG9uIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS93ZWJ4ci9BUkJ1dHRvbi5qc1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlckNvbnRleHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgICAgICBjb21wb25lbnQud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCByZW5kZXJlcnMgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHM7XG4gICAgcmVuZGVyZXJzLmZvckVhY2gocmVuZGVyZXJFbnRpdHkgPT4ge1xuICAgICAgdmFyIHJlbmRlcmVyID0gcmVuZGVyZXJFbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJQYXNzZXMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgIHZhciBwYXNzID0gZW50aXR5LmdldENvbXBvbmVudChSZW5kZXJQYXNzKTtcbiAgICAgICAgdmFyIHNjZW5lID0gcGFzcy5zY2VuZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICAgIHRoaXMucXVlcmllcy5hY3RpdmVDYW1lcmFzLnJlc3VsdHMuZm9yRWFjaChjYW1lcmFFbnRpdHkgPT4ge1xuICAgICAgICAgIHZhciBjYW1lcmEgPSBjYW1lcmFFbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvLyBVbmluaXRpYWxpemVkIHJlbmRlcmVyc1xuICAgIHRoaXMucXVlcmllcy51bmluaXRpYWxpemVkUmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG5cbiAgICAgIHZhciByZW5kZXJlciA9IG5ldyBUSFJFRS5XZWJHTFJlbmRlcmVyKHtcbiAgICAgICAgYW50aWFsaWFzOiBjb21wb25lbnQuYW50aWFsaWFzXG4gICAgICB9KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldEFuaW1hdGlvbkxvb3AoY29tcG9uZW50LmFuaW1hdGlvbkxvb3ApO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIHJlbmRlcmVyLmdhbW1hSW5wdXQgPSBjb21wb25lbnQuZ2FtbWFJbnB1dDtcbiAgICAgIHJlbmRlcmVyLmdhbW1hT3V0cHV0ID0gY29tcG9uZW50LmdhbW1hT3V0cHV0O1xuICAgICAgcmVuZGVyZXIuc2hhZG93TWFwLmVuYWJsZWQgPSBjb21wb25lbnQuc2hhZG93TWFwO1xuXG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHJlbmRlcmVyLmRvbUVsZW1lbnQpO1xuXG4gICAgICBpZiAoY29tcG9uZW50LnZyIHx8IGNvbXBvbmVudC5hcikge1xuICAgICAgICByZW5kZXJlci54ci5lbmFibGVkID0gdHJ1ZTtcblxuICAgICAgICBpZiAoY29tcG9uZW50LnZyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChWUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChjb21wb25lbnQuYXIpIHtcbiAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKEFSQnV0dG9uLmNyZWF0ZUJ1dHRvbihyZW5kZXJlcikpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQsIHsgdmFsdWU6IHJlbmRlcmVyIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5jaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgdmFyIHJlbmRlcmVyID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICBpZiAoXG4gICAgICAgIGNvbXBvbmVudC53aWR0aCAhPT0gcmVuZGVyZXIud2lkdGggfHxcbiAgICAgICAgY29tcG9uZW50LmhlaWdodCAhPT0gcmVuZGVyZXIuaGVpZ2h0XG4gICAgICApIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZShjb21wb25lbnQud2lkdGgsIGNvbXBvbmVudC5oZWlnaHQpO1xuICAgICAgICAvLyBpbm5lcldpZHRoL2lubmVySGVpZ2h0XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuV2ViR0xSZW5kZXJlclN5c3RlbS5xdWVyaWVzID0ge1xuICB1bmluaXRpYWxpemVkUmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIE5vdChXZWJHTFJlbmRlcmVyQ29udGV4dCldXG4gIH0sXG4gIHJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBXZWJHTFJlbmRlcmVyQ29udGV4dF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbV2ViR0xSZW5kZXJlcl1cbiAgICB9XG4gIH0sXG4gIHJlbmRlclBhc3Nlczoge1xuICAgIGNvbXBvbmVudHM6IFtSZW5kZXJQYXNzXVxuICB9LFxuICBhY3RpdmVDYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgQWN0aXZlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRyYW5zZm9ybSwgUGFyZW50LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgdmFyIHBhcmVudEVudGl0eSA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZTtcbiAgICAgIGlmIChwYXJlbnRFbnRpdHkuaGFzQ29tcG9uZW50KE9iamVjdDNEKSkge1xuICAgICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBwYXJlbnRFbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgcGFyZW50T2JqZWN0M0QuYWRkKGNoaWxkT2JqZWN0M0QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyYW5zZm9ybXNcbiAgICB2YXIgdHJhbnNmb3JtcyA9IHRoaXMucXVlcmllcy50cmFuc2Zvcm1zO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdHJhbnNmb3Jtcy5hZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuYWRkZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IHRyYW5zZm9ybXMuY2hhbmdlZFtpXTtcbiAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICBsZXQgb2JqZWN0ID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICApO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50OiB7XG4gICAgY29tcG9uZW50czogW1BhcmVudCwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH0sXG4gIHRyYW5zZm9ybXM6IHtcbiAgICBjb21wb25lbnRzOiBbT2JqZWN0M0QsIFRyYW5zZm9ybV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtUcmFuc2Zvcm1dXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgQ2FtZXJhLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhID0+IHtcbiAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY2FtZXJhLmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgICAgICBjYW1lcmEuZ2V0TXV0YWJsZUNvbXBvbmVudChDYW1lcmEpLmFzcGVjdCA9XG4gICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5jYW1lcmFzLmNoYW5nZWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gY2hhbmdlZFtpXTtcblxuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgIGxldCBjYW1lcmEzZCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgaWYgKGNhbWVyYTNkLmFzcGVjdCAhPT0gY29tcG9uZW50LmFzcGVjdCkge1xuICAgICAgICBjYW1lcmEzZC5hc3BlY3QgPSBjb21wb25lbnQuYXNwZWN0O1xuICAgICAgICBjYW1lcmEzZC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICB9XG4gICAgICAvLyBAdG9kbyBEbyBpdCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHZhbHVlc1xuICAgIH1cblxuICAgIHRoaXMucXVlcmllcy5jYW1lcmFzVW5pbml0aWFsaXplZC5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG5cbiAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgIGNvbXBvbmVudC5mb3YsXG4gICAgICAgIGNvbXBvbmVudC5hc3BlY3QsXG4gICAgICAgIGNvbXBvbmVudC5uZWFyLFxuICAgICAgICBjb21wb25lbnQuZmFyXG4gICAgICApO1xuXG4gICAgICBjYW1lcmEubGF5ZXJzLmVuYWJsZShjb21wb25lbnQubGF5ZXJzKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogY2FtZXJhIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkNhbWVyYVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzVW5pbml0aWFsaXplZDoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE5vdChPYmplY3QzRCldXG4gIH0sXG4gIGNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbQ2FtZXJhXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgbG9hZGVyLmxvYWQoXCIvYXNzZXRzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uXCIsIGZvbnQgPT4ge1xuICAgICAgdGhpcy5mb250ID0gZm9udDtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgfSk7XG5cbiAgICB2YXIgYWRkZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG4gICAgYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbG9yID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgY29sb3IgPSAweGZmZmZmZjtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBtZXNoIH0pO1xuICAgIH0pO1xuICB9XG59XG5cblRleHRHZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0R2VvbWV0cnldLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgRUNTWSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmltcG9ydCB7IFRyYW5zZm9ybVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBDYW1lcmFTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QgfSBmcm9tIFwiLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBDYW1lcmFSaWcgfSBmcm9tIFwiLi9jb21wb25lbnRzL0NhbWVyYVJpZy5qc1wiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXIsXG4gIFNjZW5lLFxuICBSZW5kZXJQYXNzLFxuICBDYW1lcmFcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCh3b3JsZCkge1xuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShUcmFuc2Zvcm1TeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKENhbWVyYVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oV2ViR0xSZW5kZXJlclN5c3RlbSwgeyBwcmlvcml0eTogMSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVEZWZhdWx0KHdvcmxkID0gbmV3IEVDU1kuV29ybGQoKSwgb3B0aW9ucykge1xuICBpbml0KHdvcmxkKTtcblxuICBsZXQgYW5pbWF0aW9uTG9vcCA9IG9wdGlvbnMuYW5pbWF0aW9uTG9vcDtcbiAgaWYgKCFhbmltYXRpb25Mb29wKSB7XG4gICAgY29uc3QgY2xvY2sgPSBuZXcgVEhSRUUuQ2xvY2soKTtcbiAgICBhbmltYXRpb25Mb29wID0gKCkgPT4ge1xuICAgICAgd29ybGQuZXhlY3V0ZShjbG9jay5nZXREZWx0YSgpLCBjbG9jay5lbGFwc2VkVGltZSk7XG4gICAgfTtcbiAgfVxuXG4gIGxldCBzY2VuZSA9IHdvcmxkXG4gICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgLmFkZENvbXBvbmVudChTY2VuZSlcbiAgICAuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBuZXcgVEhSRUUuU2NlbmUoKSB9KTtcblxuICBsZXQgcmVuZGVyZXIgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlciwge1xuICAgIGFyOiBvcHRpb25zLmFyLFxuICAgIHZyOiBvcHRpb25zLnZyLFxuICAgIGFuaW1hdGlvbkxvb3A6IGFuaW1hdGlvbkxvb3BcbiAgfSk7XG5cbiAgLy8gY2FtZXJhIHJpZyAmIGNvbnRyb2xsZXJzXG4gIHZhciBjYW1lcmEgPSBudWxsLFxuICAgIGNhbWVyYVJpZyA9IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMuYXIgfHwgb3B0aW9ucy52cikge1xuICAgIGNhbWVyYVJpZyA9IHdvcmxkXG4gICAgICAuY3JlYXRlRW50aXR5KClcbiAgICAgIC5hZGRDb21wb25lbnQoQ2FtZXJhUmlnKVxuICAgICAgLmFkZENvbXBvbmVudChQYXJlbnQsIHsgdmFsdWU6IHNjZW5lIH0pO1xuICB9IGVsc2Uge1xuICAgIGNhbWVyYSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChDYW1lcmEsIHtcbiAgICAgIGZvdjogOTAsXG4gICAgICBhc3BlY3Q6IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgICAgbmVhcjogMSxcbiAgICAgIGZhcjogMTAwMCxcbiAgICAgIGxheWVyczogMSxcbiAgICAgIGhhbmRsZVJlc2l6ZTogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgbGV0IHJlbmRlclBhc3MgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoUmVuZGVyUGFzcywge1xuICAgIHNjZW5lOiBzY2VuZSxcbiAgICBjYW1lcmE6IGNhbWVyYVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIGNhbWVyYVJpZyxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgcmVuZGVyUGFzc1xuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJUYWdDb21wb25lbnQiLCJUSFJFRS5WZWN0b3IzIiwiU3lzdGVtIiwiVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSIsIlRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwiLCJUSFJFRS5NZXNoIiwiR0xURkxvYWRlciIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJOb3QiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiVlJCdXR0b24iLCJBUkJ1dHRvbiIsIlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIiwiVEhSRUUuRm9udExvYWRlciIsIlRIUkVFLlRleHRHZW9tZXRyeSIsIlRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsIiwiRUNTWS5Xb3JsZCIsIlRIUkVFLkNsb2NrIiwiVEhSRUUuU2NlbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0NBQU8sTUFBTSxNQUFNLENBQUM7Q0FDcEIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Q0FD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

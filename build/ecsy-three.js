(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('ecsy'), require('three'), require('three/examples/jsm/loaders/GLTFLoader.js'), require('three/examples/jsm/vr/WebVR.js')) :
	typeof define === 'function' && define.amd ? define(['exports', 'ecsy', 'three', 'three/examples/jsm/loaders/GLTFLoader.js', 'three/examples/jsm/vr/WebVR.js'], factory) :
	(global = global || self, (function () {
		var current = global.ECSYTHREE;
		var exports = global.ECSYTHREE = {};
		factory(exports, global.ECSY, global.THREE, global.GLTFLoader_js, global.WebVR_js);
		exports.noConflict = function () { global.ECSYTHREE = current; return exports; };
	}()));
}(this, (function (exports, ECSY, THREE, GLTFLoader_js, WebVR_js) { 'use strict';

	class Active {
	  constructor() {
	    this.reset();
	  }

	  reset() {
	    this.value = false;
	  }
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

	class Camera {
	  constructor() {
	    this.fov = 45;
	    this.aspect = 1;
	    this.near = 1;
	    this.far = 1000;
	    this.layers = 0;
	    this.handleResize = true;
	  }
	}

	class WebGLRenderer {
	  constructor() {
	    this.vr = true;
	    this.antialias = true;
	    this.handleResize = true;
	    this.gammaInput = true;
	    this.gammaOutput = true;
	    this.shadowMap = false;
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
	    this.queries.entities.removed.forEach((/*entity*/) => {
	      /*
	      var object = entity.getRemovedComponent(Object3D).value;
	      var parent = entity.getComponent(Parent, true).value;
	      parent.getComponent(Object3D).value.remove(object);
	      */
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

	      var material = new THREE.MeshLambertMaterial({
	        color: color,
	        flatShading: true
	      });

	      /*
	      var material = new THREE.MeshStandardMaterial({
	        color: color,
	        roughness: 0.7,
	        metalness: 0.0,
	        flatShading: true
	      });
	*/

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

	      // @todo Remove it! hierarchy system will take care of it
	      if (entity.hasComponent(Parent)) {
	        entity
	          .getComponent(Parent)
	          .value.getComponent(Object3D)
	          .value.add(object);
	      }
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
	    var entities = this.queries.entities.added;

	    //Queries
	    for (let i = 0; i < entities.length; i++) {
	      var entity = entities[i];
	      var component = entity.getComponent(GLTFModel);

	      loader.load(component.url, gltf => {
	        /*
	        gltf.scene.traverse(function(child) {
	          if (child.isMesh) {
	            child.material.envMap = envMap;
	          }
	        });
	*/
	        // @todo Remove, hierarchy will take care of it
	        if (entity.hasComponent(Parent)) {
	          entity.getComponent(Parent).value.add(gltf.scene);
	        }
	        entity.addComponent(Object3D, { value: gltf.scene });
	      });
	    }
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

	      if (component.vr) {
	        renderer.vr.enabled = true;
	        document.body.appendChild(
	          WebVR_js.WEBVR.createButton(renderer, { referenceSpaceType: "local" })
	        );
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
	      var parentObject3D = parentEntity.getComponent(Object3D).value;
	      var childObject3D = entity.getComponent(Object3D).value;
	      parentObject3D.add(childObject3D);
	    }
	  }
	}

	TransformSystem.queries = {
	  parent: {
	    components: [Parent, Object3D],
	    listen: {
	      added: true
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
	            console.log("Aspect updated");
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
	        console.log("Camera Updated");

	        camera3d.aspect = component.aspect;
	        camera3d.updateProjectionMatrix();
	      }
	      // @todo Do it for the rest of the values
	    }

	    this.queries.camerasUninitialized.results.forEach(entity => {
	      console.log(entity);

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
	  const clock = new THREE.Clock();

	  init(world);

	  let scene = world
	    .createEntity()
	    .addComponent(Scene)
	    .addComponent(Object3D, { value: new THREE.Scene() });

	  let renderer = world.createEntity().addComponent(WebGLRenderer, {
	    animationLoop: () => {
	      world.execute(clock.getDelta(), clock.elapsedTime);
	    }
	  });

	  // camera rig & controllers
	  var camera = null,
	    cameraRig = null;

	  if (options.vr) {
	    cameraRig = world.createEntity().addComponent(CameraRig);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvQWN0aXZlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL01hdGVyaWFsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JlbmRlclBhc3MuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2luZGV4LmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYVJpZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVmdEhhbmQgPSBudWxsO1xuICAgIHRoaXMucmlnaHRIYW5kID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEcmFnZ2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgRHJhZ2dpbmcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBHZW9tZXRyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdMVEZNb2RlbCB7fVxuIiwiZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjZW5lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreUJveCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnkge1xuICByZXNldCgpIHt9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgY29weShzcmMpIHtcbiAgICB0aGlzLnBvc2l0aW9uLmNvcHkoc3JjLnBvc2l0aW9uKTtcbiAgICB0aGlzLnJvdGF0aW9uLmNvcHkoc3JjLnJvdGF0aW9uKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVmlzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50Q2xhc3MgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgeyBBY3RpdmUgfSBmcm9tIFwiLi9BY3RpdmUuanNcIjtcbmV4cG9ydCB7IENhbWVyYVJpZyB9IGZyb20gXCIuL0NhbWVyYVJpZy5qc1wiO1xuZXhwb3J0IHsgRHJhZ2dhYmxlIH0gZnJvbSBcIi4vRHJhZ2dhYmxlLmpzXCI7XG5leHBvcnQgeyBEcmFnZ2luZyB9IGZyb20gXCIuL0RyYWdnaW5nLmpzXCI7XG5leHBvcnQgeyBHZW9tZXRyeSB9IGZyb20gXCIuL0dlb21ldHJ5LmpzXCI7XG5leHBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi9HTFRGTW9kZWwuanNcIjtcbmV4cG9ydCB7IE1hdGVyaWFsIH0gZnJvbSBcIi4vTWF0ZXJpYWwuanNcIjtcbmV4cG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vT2JqZWN0M0QuanNcIjtcbmV4cG9ydCB7IFBhcmVudCB9IGZyb20gXCIuL1BhcmVudC5qc1wiO1xuZXhwb3J0IHsgUG9zaXRpb24gfSBmcm9tIFwiLi9Qb3NpdGlvbi5qc1wiO1xuZXhwb3J0IHsgUmVuZGVyUGFzcyB9IGZyb20gXCIuL1JlbmRlclBhc3MuanNcIjtcbmV4cG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb24uanNcIjtcbmV4cG9ydCB7IFNjZW5lIH0gZnJvbSBcIi4vU2NlbmUuanNcIjtcbmV4cG9ydCB7IFNreSB9IGZyb20gXCIuL1NreS5qc1wiO1xuZXhwb3J0IHsgU2t5Qm94IH0gZnJvbSBcIi4vU2t5Ym94LmpzXCI7XG5leHBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi9UZXh0R2VvbWV0cnkuanNcIjtcbmV4cG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZm9ybS5qc1wiO1xuZXhwb3J0IHsgVmlzaWJsZSB9IGZyb20gXCIuL1Zpc2libGUuanNcIjtcbmV4cG9ydCB7IFZSQ29udHJvbGxlciB9IGZyb20gXCIuL1ZSQ29udHJvbGxlci5qc1wiO1xuXG5leHBvcnQgY2xhc3MgQ2FtZXJhIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5mb3YgPSA0NTtcbiAgICB0aGlzLmFzcGVjdCA9IDE7XG4gICAgdGhpcy5uZWFyID0gMTtcbiAgICB0aGlzLmZhciA9IDEwMDA7XG4gICAgdGhpcy5sYXllcnMgPSAwO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudnIgPSB0cnVlO1xuICAgIHRoaXMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRydWU7XG4gICAgdGhpcy5nYW1tYUlucHV0ID0gdHJ1ZTtcbiAgICB0aGlzLmdhbW1hT3V0cHV0ID0gdHJ1ZTtcbiAgICB0aGlzLnNoYWRvd01hcCA9IGZhbHNlO1xuICB9XG59XG5cblxuLypcbmV4cG9ydCBjb25zdCBXZWJHTFJlbmRlcmVyID0gY3JlYXRlQ29tcG9uZW50Q2xhc3MoXG4gIHtcbiAgICB2cjogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGdhbW1hSW5wdXQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGdhbW1hT3V0cHV0OiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogZmFsc2UgfVxuICB9LFxuICBcIldlYkdMUmVuZGVyZXJcIlxuKTtcbiovIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKCgvKmVudGl0eSovKSA9PiB7XG4gICAgICAvKlxuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5yZW1vdmUob2JqZWN0KTtcbiAgICAgICovXG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIHZhciBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8qXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMCxcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuKi9cblxuICAgICAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFRyYW5zZm9ybSkpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGlvbikge1xuICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoRWxlbWVudCkgJiYgIWVudGl0eS5oYXNDb21wb25lbnQoRHJhZ2dhYmxlKSkge1xuICAgICAgLy8gICAgICAgIG9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXQoMHgzMzMzMzMpO1xuICAgICAgLy8gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcblxuICAgICAgLy8gQHRvZG8gUmVtb3ZlIGl0ISBoaWVyYXJjaHkgc3lzdGVtIHdpbGwgdGFrZSBjYXJlIG9mIGl0XG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChQYXJlbnQpKSB7XG4gICAgICAgIGVudGl0eVxuICAgICAgICAgIC5nZXRDb21wb25lbnQoUGFyZW50KVxuICAgICAgICAgIC52YWx1ZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpXG4gICAgICAgICAgLnZhbHVlLmFkZChvYmplY3QpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbkdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dlb21ldHJ5XSwgLy8gQHRvZG8gVHJhbnNmb3JtOiBBcyBvcHRpb25hbCwgaG93IHRvIGRlZmluZSBpdD9cbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgcmVtb3ZlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IEdMVEZMb2FkZXIgfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL2xvYWRlcnMvR0xURkxvYWRlci5qc1wiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCB9IGZyb20gXCIuLi9jb21wb25lbnRzL1BhcmVudC5qc1wiO1xuaW1wb3J0IHsgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgR0xURk1vZGVsIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvR0xURk1vZGVsLmpzXCI7XG5cbi8vIEB0b2RvIFVzZSBwYXJhbWV0ZXIgYW5kIGxvYWRlciBtYW5hZ2VyXG52YXIgbG9hZGVyID0gbmV3IEdMVEZMb2FkZXIoKS5zZXRQYXRoKFwiL2Fzc2V0cy9cIik7XG5cbmV4cG9ydCBjbGFzcyBHTFRGTG9hZGVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICB2YXIgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG5cbiAgICAvL1F1ZXJpZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZW50aXR5ID0gZW50aXRpZXNbaV07XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHTFRGTW9kZWwpO1xuXG4gICAgICBsb2FkZXIubG9hZChjb21wb25lbnQudXJsLCBnbHRmID0+IHtcbiAgICAgICAgLypcbiAgICAgICAgZ2x0Zi5zY2VuZS50cmF2ZXJzZShmdW5jdGlvbihjaGlsZCkge1xuICAgICAgICAgIGlmIChjaGlsZC5pc01lc2gpIHtcbiAgICAgICAgICAgIGNoaWxkLm1hdGVyaWFsLmVudk1hcCA9IGVudk1hcDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuKi9cbiAgICAgICAgLy8gQHRvZG8gUmVtb3ZlLCBoaWVyYXJjaHkgd2lsbCB0YWtlIGNhcmUgb2YgaXRcbiAgICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoUGFyZW50KSkge1xuICAgICAgICAgIGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZS5hZGQoZ2x0Zi5zY2VuZSk7XG4gICAgICAgIH1cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ2x0Zi5zY2VuZSB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuXG5HTFRGTG9hZGVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW0dMVEZNb2RlbF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFNreUJveCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBTa3lCb3hTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIGxldCBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBlbnRpdGllc1tpXTtcblxuICAgICAgbGV0IHNreWJveCA9IGVudGl0eS5nZXRDb21wb25lbnQoU2t5Qm94KTtcblxuICAgICAgbGV0IGdyb3VwID0gbmV3IFRIUkVFLkdyb3VwKCk7XG4gICAgICBsZXQgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoMTAwLCAxMDAsIDEwMCk7XG4gICAgICBnZW9tZXRyeS5zY2FsZSgxLCAxLCAtMSk7XG5cbiAgICAgIGlmIChza3lib3gudHlwZSA9PT0gXCJjdWJlbWFwLXN0ZXJlb1wiKSB7XG4gICAgICAgIGxldCB0ZXh0dXJlcyA9IGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShza3lib3gudGV4dHVyZVVybCwgMTIpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHMgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDY7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFscy5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHMpO1xuICAgICAgICBza3lCb3gubGF5ZXJzLnNldCgxKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveCk7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFsc1IgPSBbXTtcblxuICAgICAgICBmb3IgKGxldCBqID0gNjsgaiA8IDEyOyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHNSLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94UiA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbHNSKTtcbiAgICAgICAgc2t5Qm94Ui5sYXllcnMuc2V0KDIpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94Uik7XG5cbiAgICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogZ3JvdXAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmtub3duIHNreWJveCB0eXBlOiBcIiwgc2t5Ym94LnR5cGUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoYXRsYXNJbWdVcmwsIHRpbGVzTnVtKSB7XG4gIGxldCB0ZXh0dXJlcyA9IFtdO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGlsZXNOdW07IGkrKykge1xuICAgIHRleHR1cmVzW2ldID0gbmV3IFRIUkVFLlRleHR1cmUoKTtcbiAgfVxuXG4gIGxldCBsb2FkZXIgPSBuZXcgVEhSRUUuSW1hZ2VMb2FkZXIoKTtcbiAgbG9hZGVyLmxvYWQoYXRsYXNJbWdVcmwsIGZ1bmN0aW9uKGltYWdlT2JqKSB7XG4gICAgbGV0IGNhbnZhcywgY29udGV4dDtcbiAgICBsZXQgdGlsZVdpZHRoID0gaW1hZ2VPYmouaGVpZ2h0O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXh0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICAgICAgY2FudmFzLmhlaWdodCA9IHRpbGVXaWR0aDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHRpbGVXaWR0aDtcbiAgICAgIGNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgICBpbWFnZU9iaixcbiAgICAgICAgdGlsZVdpZHRoICogaSxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIDAsXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoXG4gICAgICApO1xuICAgICAgdGV4dHVyZXNbaV0uaW1hZ2UgPSBjYW52YXM7XG4gICAgICB0ZXh0dXJlc1tpXS5uZWVkc1VwZGF0ZSA9IHRydWU7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gdGV4dHVyZXM7XG59XG5cblNreUJveFN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtTa3lCb3gsIE5vdChPYmplY3QzRCldXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVmlzaWJsZSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVmlzaWJpbGl0eVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIHByb2Nlc3NWaXNpYmlsaXR5KGVudGl0aWVzKSB7XG4gICAgZW50aXRpZXMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnZpc2libGUgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFxuICAgICAgICBWaXNpYmxlXG4gICAgICApLnZhbHVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZCk7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZCk7XG4gIH1cbn1cblxuVmlzaWJpbGl0eVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtWaXNpYmxlLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IFtWaXNpYmxlXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIFJlbmRlclBhc3MsXG4gIENhbWVyYSxcbiAgQWN0aXZlLFxuICBXZWJHTFJlbmRlcmVyLFxuICBPYmplY3QzRFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBXRUJWUiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vdnIvV2ViVlIuanNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29tcG9uZW50LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5nYW1tYUlucHV0ID0gY29tcG9uZW50LmdhbW1hSW5wdXQ7XG4gICAgICByZW5kZXJlci5nYW1tYU91dHB1dCA9IGNvbXBvbmVudC5nYW1tYU91dHB1dDtcbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICByZW5kZXJlci52ci5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChcbiAgICAgICAgICBXRUJWUi5jcmVhdGVCdXR0b24ocmVuZGVyZXIsIHsgcmVmZXJlbmNlU3BhY2VUeXBlOiBcImxvY2FsXCIgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyUGFzc2VzOiB7XG4gICAgY29tcG9uZW50czogW1JlbmRlclBhc3NdXG4gIH0sXG4gIGFjdGl2ZUNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBBY3RpdmVdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgdmFyIHBhcmVudEVudGl0eSA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnRPYmplY3QzRCA9IHBhcmVudEVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIGNoaWxkT2JqZWN0M0QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICB9XG4gIH1cbn1cblxuVHJhbnNmb3JtU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgQ2FtZXJhLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhID0+IHtcbiAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY2FtZXJhLmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgICAgICBjYW1lcmEuZ2V0TXV0YWJsZUNvbXBvbmVudChDYW1lcmEpLmFzcGVjdCA9XG4gICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBc3BlY3QgdXBkYXRlZFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5jaGFuZ2VkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNoYW5nZWRbaV07XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICBsZXQgY2FtZXJhM2QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIGlmIChjYW1lcmEzZC5hc3BlY3QgIT09IGNvbXBvbmVudC5hc3BlY3QpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDYW1lcmEgVXBkYXRlZFwiKTtcblxuICAgICAgICBjYW1lcmEzZC5hc3BlY3QgPSBjb21wb25lbnQuYXNwZWN0O1xuICAgICAgICBjYW1lcmEzZC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICB9XG4gICAgICAvLyBAdG9kbyBEbyBpdCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHZhbHVlc1xuICAgIH1cblxuICAgIHRoaXMucXVlcmllcy5jYW1lcmFzVW5pbml0aWFsaXplZC5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKGVudGl0eSk7XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG5cbiAgICAgIGxldCBjYW1lcmEgPSBuZXcgVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEoXG4gICAgICAgIGNvbXBvbmVudC5mb3YsXG4gICAgICAgIGNvbXBvbmVudC5hc3BlY3QsXG4gICAgICAgIGNvbXBvbmVudC5uZWFyLFxuICAgICAgICBjb21wb25lbnQuZmFyXG4gICAgICApO1xuXG4gICAgICBjYW1lcmEubGF5ZXJzLmVuYWJsZShjb21wb25lbnQubGF5ZXJzKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogY2FtZXJhIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbkNhbWVyYVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzVW5pbml0aWFsaXplZDoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE5vdChPYmplY3QzRCldXG4gIH0sXG4gIGNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbQ2FtZXJhXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgbG9hZGVyLmxvYWQoXCIvYXNzZXRzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uXCIsIGZvbnQgPT4ge1xuICAgICAgdGhpcy5mb250ID0gZm9udDtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgfSk7XG5cbiAgICB2YXIgYWRkZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG4gICAgYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbG9yID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgY29sb3IgPSAweGZmZmZmZjtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBtZXNoIH0pO1xuICAgIH0pO1xuICB9XG59XG5cblRleHRHZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0R2VvbWV0cnldLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgRUNTWSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7XG4gIEFjdGl2ZSxcbiAgQ2FtZXJhLFxuICBDYW1lcmFSaWcsXG4gIERyYWdnYWJsZSxcbiAgRHJhZ2dpbmcsXG4gIEdlb21ldHJ5LFxuICBHTFRGTW9kZWwsXG4gIE1hdGVyaWFsLFxuICBPYmplY3QzRCxcbiAgUGFyZW50LFxuICBQb3NpdGlvbixcbiAgUm90YXRpb24sXG4gIFJlbmRlclBhc3MsXG4gIFNjZW5lLFxuICBTa3ksXG4gIFNreUJveCxcbiAgVGV4dEdlb21ldHJ5LFxuICBUcmFuc2Zvcm0sXG4gIFZpc2libGUsXG4gIFZSQ29udHJvbGxlclxufSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbi8vIHN5c3RlbXNcbmV4cG9ydCB7IEdlb21ldHJ5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgR0xURkxvYWRlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvR0xURkxvYWRlclN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgU2t5Qm94U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFZpc2liaWxpdHlTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1Zpc2liaWxpdHlTeXN0ZW0uanNcIjtcbmV4cG9ydCB7XG4gIFdlYkdMUmVuZGVyZXJTeXN0ZW0sXG4gIFdlYkdMUmVuZGVyZXJDb250ZXh0XG59IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmV4cG9ydCB7IENhbWVyYVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBUZXh0R2VvbWV0cnlTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qc1wiO1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1TeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhUmlnIH0gZnJvbSBcIi4vY29tcG9uZW50cy9DYW1lcmFSaWcuanNcIjtcbmltcG9ydCB7XG4gIFdlYkdMUmVuZGVyZXIsXG4gIFNjZW5lLFxuICBSZW5kZXJQYXNzLFxuICBDYW1lcmFcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCh3b3JsZCkge1xuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShUcmFuc2Zvcm1TeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKENhbWVyYVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oV2ViR0xSZW5kZXJlclN5c3RlbSwgeyBwcmlvcml0eTogMSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVEZWZhdWx0KHdvcmxkID0gbmV3IEVDU1kuV29ybGQoKSwgb3B0aW9ucykge1xuICBjb25zdCBjbG9jayA9IG5ldyBUSFJFRS5DbG9jaygpO1xuXG4gIGluaXQod29ybGQpO1xuXG4gIGxldCBzY2VuZSA9IHdvcmxkXG4gICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgLmFkZENvbXBvbmVudChTY2VuZSlcbiAgICAuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBuZXcgVEhSRUUuU2NlbmUoKSB9KTtcblxuICBsZXQgcmVuZGVyZXIgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlciwge1xuICAgIGFuaW1hdGlvbkxvb3A6ICgpID0+IHtcbiAgICAgIHdvcmxkLmV4ZWN1dGUoY2xvY2suZ2V0RGVsdGEoKSwgY2xvY2suZWxhcHNlZFRpbWUpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gY2FtZXJhIHJpZyAmIGNvbnRyb2xsZXJzXG4gIHZhciBjYW1lcmEgPSBudWxsLFxuICAgIGNhbWVyYVJpZyA9IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMudnIpIHtcbiAgICBjYW1lcmFSaWcgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoQ2FtZXJhUmlnKTtcbiAgfSBlbHNlIHtcbiAgICBjYW1lcmEgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoQ2FtZXJhLCB7XG4gICAgICBmb3Y6IDkwLFxuICAgICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIG5lYXI6IDEsXG4gICAgICBmYXI6IDEwMDAsXG4gICAgICBsYXllcnM6IDEsXG4gICAgICBoYW5kbGVSZXNpemU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGxldCByZW5kZXJQYXNzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlclBhc3MsIHtcbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICBjYW1lcmFSaWcsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHJlbmRlclBhc3NcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiVGFnQ29tcG9uZW50IiwiVEhSRUUuVmVjdG9yMyIsIlN5c3RlbSIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIkdMVEZMb2FkZXIiLCJUSFJFRS5Hcm91cCIsIlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIiwiVEhSRUUuVGV4dHVyZSIsIlRIUkVFLkltYWdlTG9hZGVyIiwiTm90IiwiVEhSRUUuV2ViR0xSZW5kZXJlciIsIldFQlZSIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiLCJUSFJFRS5Gb250TG9hZGVyIiwiVEhSRUUuVGV4dEdlb21ldHJ5IiwiVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwiLCJFQ1NZLldvcmxkIiwiVEhSRUUuQ2xvY2siLCJUSFJFRS5TY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Q0FBTyxNQUFNLE1BQU0sQ0FBQztDQUNwQixFQUFFLFdBQVcsR0FBRztDQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztDQUNqQixHQUFHOztDQUVI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

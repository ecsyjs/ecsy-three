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
	      /*
	      if (entity.hasComponent(Parent)) {
	        entity
	          .getComponent(Parent)
	          .value.getComponent(Object3D)
	          .value.add(object);
	      }
	      */
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
	          /*
	          var component = entity.getMutableComponent(WebGLRenderer);
	          component.width = window.innerWidth;
	          component.height = window.innerHeight;
	          */
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
	    components: [WebGLRendererContext],
	//    components: [WebGLRenderer, WebGLRendererContext],
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
	    /*animationLoop: () => {
	      world.execute(clock.getDelta(), clock.elapsedTime);
	    }*/
	  });

	  // camera rig & controllers
	  var camera = null,
	    cameraRig = null;

	  if (options.vr) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvQWN0aXZlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL01hdGVyaWFsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JlbmRlclBhc3MuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Sb3RhdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVGV4dEdlb21ldHJ5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVmlzaWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2luZGV4LmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIEFjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYVJpZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVmdEhhbmQgPSBudWxsO1xuICAgIHRoaXMucmlnaHRIYW5kID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEcmFnZ2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgRHJhZ2dpbmcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBHZW9tZXRyeSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucHJpbWl0aXZlID0gXCJib3hcIjtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdMVEZNb2RlbCB7fVxuIiwiZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBSZW5kZXJQYXNzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNjZW5lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreSB7XG4gIGNvbnN0cnVjdG9yKCkge31cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreUJveCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnkge1xuICByZXNldCgpIHt9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgY29weShzcmMpIHtcbiAgICB0aGlzLnBvc2l0aW9uLmNvcHkoc3JjLnBvc2l0aW9uKTtcbiAgICB0aGlzLnJvdGF0aW9uLmNvcHkoc3JjLnJvdGF0aW9uKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVmlzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0IHsgY3JlYXRlQ29tcG9uZW50Q2xhc3MgfSBmcm9tIFwiZWNzeVwiO1xuXG5leHBvcnQgeyBBY3RpdmUgfSBmcm9tIFwiLi9BY3RpdmUuanNcIjtcbmV4cG9ydCB7IENhbWVyYVJpZyB9IGZyb20gXCIuL0NhbWVyYVJpZy5qc1wiO1xuZXhwb3J0IHsgRHJhZ2dhYmxlIH0gZnJvbSBcIi4vRHJhZ2dhYmxlLmpzXCI7XG5leHBvcnQgeyBEcmFnZ2luZyB9IGZyb20gXCIuL0RyYWdnaW5nLmpzXCI7XG5leHBvcnQgeyBHZW9tZXRyeSB9IGZyb20gXCIuL0dlb21ldHJ5LmpzXCI7XG5leHBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi9HTFRGTW9kZWwuanNcIjtcbmV4cG9ydCB7IE1hdGVyaWFsIH0gZnJvbSBcIi4vTWF0ZXJpYWwuanNcIjtcbmV4cG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vT2JqZWN0M0QuanNcIjtcbmV4cG9ydCB7IFBhcmVudCB9IGZyb20gXCIuL1BhcmVudC5qc1wiO1xuZXhwb3J0IHsgUG9zaXRpb24gfSBmcm9tIFwiLi9Qb3NpdGlvbi5qc1wiO1xuZXhwb3J0IHsgUmVuZGVyUGFzcyB9IGZyb20gXCIuL1JlbmRlclBhc3MuanNcIjtcbmV4cG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb24uanNcIjtcbmV4cG9ydCB7IFNjZW5lIH0gZnJvbSBcIi4vU2NlbmUuanNcIjtcbmV4cG9ydCB7IFNreSB9IGZyb20gXCIuL1NreS5qc1wiO1xuZXhwb3J0IHsgU2t5Qm94IH0gZnJvbSBcIi4vU2t5Ym94LmpzXCI7XG5leHBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi9UZXh0R2VvbWV0cnkuanNcIjtcbmV4cG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZm9ybS5qc1wiO1xuZXhwb3J0IHsgVmlzaWJsZSB9IGZyb20gXCIuL1Zpc2libGUuanNcIjtcbmV4cG9ydCB7IFZSQ29udHJvbGxlciB9IGZyb20gXCIuL1ZSQ29udHJvbGxlci5qc1wiO1xuXG5leHBvcnQgY2xhc3MgQ2FtZXJhIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5mb3YgPSA0NTtcbiAgICB0aGlzLmFzcGVjdCA9IDE7XG4gICAgdGhpcy5uZWFyID0gMTtcbiAgICB0aGlzLmZhciA9IDEwMDA7XG4gICAgdGhpcy5sYXllcnMgPSAwO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudnIgPSB0cnVlO1xuICAgIHRoaXMuYW50aWFsaWFzID0gdHJ1ZTtcbiAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRydWU7XG4gICAgdGhpcy5nYW1tYUlucHV0ID0gdHJ1ZTtcbiAgICB0aGlzLmdhbW1hT3V0cHV0ID0gdHJ1ZTtcbiAgICB0aGlzLnNoYWRvd01hcCA9IGZhbHNlO1xuICB9XG59XG5cblxuLypcbmV4cG9ydCBjb25zdCBXZWJHTFJlbmRlcmVyID0gY3JlYXRlQ29tcG9uZW50Q2xhc3MoXG4gIHtcbiAgICB2cjogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgYW50aWFsaWFzOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBoYW5kbGVSZXNpemU6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGdhbW1hSW5wdXQ6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGdhbW1hT3V0cHV0OiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBzaGFkb3dNYXA6IHsgZGVmYXVsdDogZmFsc2UgfVxuICB9LFxuICBcIldlYkdMUmVuZGVyZXJcIlxuKTtcbiovIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKCgvKmVudGl0eSovKSA9PiB7XG4gICAgICAvKlxuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5yZW1vdmUob2JqZWN0KTtcbiAgICAgICovXG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIHZhciBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIC8qXG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMCxcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuKi9cblxuICAgICAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFRyYW5zZm9ybSkpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGlvbikge1xuICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoRWxlbWVudCkgJiYgIWVudGl0eS5oYXNDb21wb25lbnQoRHJhZ2dhYmxlKSkge1xuICAgICAgLy8gICAgICAgIG9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXQoMHgzMzMzMzMpO1xuICAgICAgLy8gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcblxuICAgICAgLy8gQHRvZG8gUmVtb3ZlIGl0ISBoaWVyYXJjaHkgc3lzdGVtIHdpbGwgdGFrZSBjYXJlIG9mIGl0XG4gICAgICAvKlxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoUGFyZW50KSkge1xuICAgICAgICBlbnRpdHlcbiAgICAgICAgICAuZ2V0Q29tcG9uZW50KFBhcmVudClcbiAgICAgICAgICAudmFsdWUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKVxuICAgICAgICAgIC52YWx1ZS5hZGQob2JqZWN0KTtcbiAgICAgIH1cbiAgICAgICovXG4gICAgfSk7XG4gIH1cbn1cblxuR2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR2VvbWV0cnldLCAvLyBAdG9kbyBUcmFuc2Zvcm06IEFzIG9wdGlvbmFsLCBob3cgdG8gZGVmaW5lIGl0P1xuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcblxuLy8gQHRvZG8gVXNlIHBhcmFtZXRlciBhbmQgbG9hZGVyIG1hbmFnZXJcbnZhciBsb2FkZXIgPSBuZXcgR0xURkxvYWRlcigpLnNldFBhdGgoXCIvYXNzZXRzL1wiKTtcblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHZhciBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcblxuICAgIC8vUXVlcmllc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZNb2RlbCk7XG5cbiAgICAgIGxvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGdsdGYgPT4ge1xuICAgICAgICAvKlxuICAgICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgICAgY2hpbGQubWF0ZXJpYWwuZW52TWFwID0gZW52TWFwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4qL1xuICAgICAgICAvLyBAdG9kbyBSZW1vdmUsIGhpZXJhcmNoeSB3aWxsIHRha2UgY2FyZSBvZiBpdFxuICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChQYXJlbnQpKSB7XG4gICAgICAgICAgZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlLmFkZChnbHRmLnNjZW5lKTtcbiAgICAgICAgfVxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBnbHRmLnNjZW5lIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbkdMVEZMb2FkZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURk1vZGVsXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgU2t5Qm94LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuXG4gICAgICBsZXQgc2t5Ym94ID0gZW50aXR5LmdldENvbXBvbmVudChTa3lCb3gpO1xuXG4gICAgICBsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgaWYgKHNreWJveC50eXBlID09PSBcImN1YmVtYXAtc3RlcmVvXCIpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHNreWJveC50ZXh0dXJlVXJsLCAxMik7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgIHNreUJveC5sYXllcnMuc2V0KDEpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94KTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzUiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3hSID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsc1IpO1xuICAgICAgICBza3lCb3hSLmxheWVycy5zZXQoMik7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3hSKTtcblxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBncm91cCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gc2t5Ym94IHR5cGU6IFwiLCBza3lib3gudHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShhdGxhc0ltZ1VybCwgdGlsZXNOdW0pIHtcbiAgbGV0IHRleHR1cmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc051bTsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB9XG5cbiAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcigpO1xuICBsb2FkZXIubG9hZChhdGxhc0ltZ1VybCwgZnVuY3Rpb24oaW1hZ2VPYmopIHtcbiAgICBsZXQgY2FudmFzLCBjb250ZXh0O1xuICAgIGxldCB0aWxlV2lkdGggPSBpbWFnZU9iai5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGlsZVdpZHRoO1xuICAgICAgY2FudmFzLndpZHRoID0gdGlsZVdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIGltYWdlT2JqLFxuICAgICAgICB0aWxlV2lkdGggKiBpLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGhcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlc1tpXS5pbWFnZSA9IGNhbnZhcztcbiAgICAgIHRleHR1cmVzW2ldLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0ZXh0dXJlcztcbn1cblxuU2t5Qm94U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1NreUJveCwgTm90KE9iamVjdDNEKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWaXNpYmxlLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBWaXNpYmlsaXR5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgcHJvY2Vzc1Zpc2liaWxpdHkoZW50aXRpZXMpIHtcbiAgICBlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWUudmlzaWJsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoXG4gICAgICAgIFZpc2libGVcbiAgICAgICkudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkKTtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkKTtcbiAgfVxufVxuXG5WaXNpYmlsaXR5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1Zpc2libGUsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhLFxuICBBY3RpdmUsXG4gIFdlYkdMUmVuZGVyZXIsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFdFQlZSIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS92ci9XZWJWUi5qc1wiO1xuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlckNvbnRleHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICAgIC8qXG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgKi9cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5nYW1tYUlucHV0ID0gY29tcG9uZW50LmdhbW1hSW5wdXQ7XG4gICAgICByZW5kZXJlci5nYW1tYU91dHB1dCA9IGNvbXBvbmVudC5nYW1tYU91dHB1dDtcbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICByZW5kZXJlci52ci5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChcbiAgICAgICAgICBXRUJWUi5jcmVhdGVCdXR0b24ocmVuZGVyZXIsIHsgcmVmZXJlbmNlU3BhY2VUeXBlOiBcImxvY2FsXCIgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyB2YWx1ZTogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS52YWx1ZTtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXJDb250ZXh0XSxcbi8vICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBXZWJHTFJlbmRlcmVyQ29udGV4dF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbV2ViR0xSZW5kZXJlcl1cbiAgICB9XG4gIH0sXG4gIHJlbmRlclBhc3Nlczoge1xuICAgIGNvbXBvbmVudHM6IFtSZW5kZXJQYXNzXVxuICB9LFxuICBhY3RpdmVDYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgQWN0aXZlXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBIaWVyYXJjaHlcbiAgICBsZXQgYWRkZWQgPSB0aGlzLnF1ZXJpZXMucGFyZW50LmFkZGVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBhZGRlZFtpXTtcbiAgICAgIHZhciBwYXJlbnRFbnRpdHkgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCkudmFsdWU7XG4gICAgICB2YXIgcGFyZW50T2JqZWN0M0QgPSBwYXJlbnRFbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIHZhciBjaGlsZE9iamVjdDNEID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBwYXJlbnRPYmplY3QzRC5hZGQoY2hpbGRPYmplY3QzRCk7XG4gICAgfVxuICB9XG59XG5cblRyYW5zZm9ybVN5c3RlbS5xdWVyaWVzID0ge1xuICBwYXJlbnQ6IHtcbiAgICBjb21wb25lbnRzOiBbUGFyZW50LCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IENhbWVyYSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYSA9PiB7XG4gICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNhbWVyYS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgY2FtZXJhLmdldE11dGFibGVDb21wb25lbnQoQ2FtZXJhKS5hc3BlY3QgPVxuICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQXNwZWN0IHVwZGF0ZWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGxldCBjaGFuZ2VkID0gdGhpcy5xdWVyaWVzLmNhbWVyYXMuY2hhbmdlZDtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBjaGFuZ2VkW2ldO1xuXG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgbGV0IGNhbWVyYTNkID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBpZiAoY2FtZXJhM2QuYXNwZWN0ICE9PSBjb21wb25lbnQuYXNwZWN0KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiQ2FtZXJhIFVwZGF0ZWRcIik7XG5cbiAgICAgICAgY2FtZXJhM2QuYXNwZWN0ID0gY29tcG9uZW50LmFzcGVjdDtcbiAgICAgICAgY2FtZXJhM2QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgICAgLy8gQHRvZG8gRG8gaXQgZm9yIHRoZSByZXN0IG9mIHRoZSB2YWx1ZXNcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhc1VuaW5pdGlhbGl6ZWQucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlbnRpdHkpO1xuXG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuXG4gICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICBjb21wb25lbnQuZm92LFxuICAgICAgICBjb21wb25lbnQuYXNwZWN0LFxuICAgICAgICBjb21wb25lbnQubmVhcixcbiAgICAgICAgY29tcG9uZW50LmZhclxuICAgICAgKTtcblxuICAgICAgY2FtZXJhLmxheWVycy5lbmFibGUoY29tcG9uZW50LmxheWVycyk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGNhbWVyYSB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5DYW1lcmFTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhc1VuaW5pdGlhbGl6ZWQ6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBOb3QoT2JqZWN0M0QpXVxuICB9LFxuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW0NhbWVyYV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBUZXh0R2VvbWV0cnksIE9iamVjdDNEIH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkZvbnRMb2FkZXIoKTtcbiAgICB0aGlzLmZvbnQgPSBudWxsO1xuICAgIGxvYWRlci5sb2FkKFwiL2Fzc2V0cy9mb250cy9oZWx2ZXRpa2VyX3JlZ3VsYXIudHlwZWZhY2UuanNvblwiLCBmb250ID0+IHtcbiAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHJldHVybjtcblxuICAgIHZhciBjaGFuZ2VkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQ7XG4gICAgY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIG9iamVjdC5nZW9tZXRyeSA9IGdlb21ldHJ5O1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZGVkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkO1xuICAgIGFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb2xvciA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcbiAgICAgIGNvbG9yID0gMHhmZmZmZmY7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogbWVzaCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dEdlb21ldHJ5XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIEVDU1kgZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG4vLyBjb21wb25lbnRzXG5leHBvcnQge1xuICBBY3RpdmUsXG4gIENhbWVyYSxcbiAgQ2FtZXJhUmlnLFxuICBEcmFnZ2FibGUsXG4gIERyYWdnaW5nLFxuICBHZW9tZXRyeSxcbiAgR0xURk1vZGVsLFxuICBNYXRlcmlhbCxcbiAgT2JqZWN0M0QsXG4gIFBhcmVudCxcbiAgUG9zaXRpb24sXG4gIFJvdGF0aW9uLFxuICBSZW5kZXJQYXNzLFxuICBTY2VuZSxcbiAgU2t5LFxuICBTa3lCb3gsXG4gIFRleHRHZW9tZXRyeSxcbiAgVHJhbnNmb3JtLFxuICBWaXNpYmxlLFxuICBWUkNvbnRyb2xsZXJcbn0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG4vLyBzeXN0ZW1zXG5leHBvcnQgeyBHZW9tZXRyeVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IEdMVEZMb2FkZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFNreUJveFN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzXCI7XG5leHBvcnQgeyBWaXNpYmlsaXR5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzXCI7XG5leHBvcnQge1xuICBXZWJHTFJlbmRlcmVyU3lzdGVtLFxuICBXZWJHTFJlbmRlcmVyQ29udGV4dFxufSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFRyYW5zZm9ybVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBDYW1lcmFTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVGV4dEdlb21ldHJ5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanNcIjtcblxuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IENhbWVyYVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IENhbWVyYVJpZyB9IGZyb20gXCIuL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzXCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi9jb21wb25lbnRzL1BhcmVudC5qc1wiO1xuaW1wb3J0IHtcbiAgV2ViR0xSZW5kZXJlcixcbiAgU2NlbmUsXG4gIFJlbmRlclBhc3MsXG4gIENhbWVyYVxufSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KHdvcmxkKSB7XG4gIHdvcmxkXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFRyYW5zZm9ybVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oQ2FtZXJhU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZURlZmF1bHQod29ybGQgPSBuZXcgRUNTWS5Xb3JsZCgpLCBvcHRpb25zKSB7XG4gIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG5cbiAgaW5pdCh3b3JsZCk7XG5cbiAgbGV0IHNjZW5lID0gd29ybGRcbiAgICAuY3JlYXRlRW50aXR5KClcbiAgICAuYWRkQ29tcG9uZW50KFNjZW5lKVxuICAgIC5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG5ldyBUSFJFRS5TY2VuZSgpIH0pO1xuXG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyLCB7XG4gICAgLyphbmltYXRpb25Mb29wOiAoKSA9PiB7XG4gICAgICB3b3JsZC5leGVjdXRlKGNsb2NrLmdldERlbHRhKCksIGNsb2NrLmVsYXBzZWRUaW1lKTtcbiAgICB9Ki9cbiAgfSk7XG5cbiAgLy8gY2FtZXJhIHJpZyAmIGNvbnRyb2xsZXJzXG4gIHZhciBjYW1lcmEgPSBudWxsLFxuICAgIGNhbWVyYVJpZyA9IG51bGw7XG5cbiAgaWYgKG9wdGlvbnMudnIpIHtcbiAgICBjYW1lcmFSaWcgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KTtcbiAgfSBlbHNlIHtcbiAgICBjYW1lcmEgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoQ2FtZXJhLCB7XG4gICAgICBmb3Y6IDkwLFxuICAgICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIG5lYXI6IDEsXG4gICAgICBmYXI6IDEwMDAsXG4gICAgICBsYXllcnM6IDEsXG4gICAgICBoYW5kbGVSZXNpemU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGxldCByZW5kZXJQYXNzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlclBhc3MsIHtcbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICBjYW1lcmFSaWcsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHJlbmRlclBhc3NcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiVGFnQ29tcG9uZW50IiwiVEhSRUUuVmVjdG9yMyIsIlN5c3RlbSIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIkdMVEZMb2FkZXIiLCJUSFJFRS5Hcm91cCIsIlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIiwiVEhSRUUuVGV4dHVyZSIsIlRIUkVFLkltYWdlTG9hZGVyIiwiTm90IiwiVEhSRUUuV2ViR0xSZW5kZXJlciIsIldFQlZSIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiLCJUSFJFRS5Gb250TG9hZGVyIiwiVEhSRUUuVGV4dEdlb21ldHJ5IiwiVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwiLCJFQ1NZLldvcmxkIiwiVEhSRUUuQ2xvY2siLCJUSFJFRS5TY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Q0FBTyxNQUFNLE1BQU0sQ0FBQztDQUNwQixFQUFFLFdBQVcsR0FBRztDQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztDQUNqQixHQUFHOztDQUVILEVBQUUsS0FBSyxHQUFHO0NBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUN2QixHQUFHO0NBQ0gsQ0FBQzs7Q0NSTSxNQUFNLFNBQVMsQ0FBQztDQUN2QixFQUFFLFdBQVcsR0FBRztDQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztDQUNqQixHQUFHOztDQUVILEVBQUUsS0FBSyxHQUFHO0NBQ1YsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztDQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0NBQzFCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Q0FDdkIsR0FBRztDQUNILENBQUM7O0NDVk0sTUFBTSxTQUFTLENBQUM7Q0FDdkIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Q0FDakIsR0FBRzs7Q0FFSCxFQUFFLEtBQUssR0FBRztDQUNWLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Q0FDdkIsR0FBRztDQUNILENBQUM7O0NDUE0sTUFBTSxRQUFRLFNBQVNBLGlCQUFZLENBQUMsRUFBRTs7Q0NEdEMsTUFBTSxRQUFRLENBQUM7Q0FDdEIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztDQUMzQixHQUFHOztDQUVILEVBQUUsS0FBSyxHQUFHO0NBQ1YsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUss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dUIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDNUUsU0FBUzs7Q0FFVCxRQUFRLElBQUksTUFBTSxHQUFHLElBQUlILFVBQVUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7Q0FDekQsUUFBUSxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztDQUM3QixRQUFRLEtBQUssQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7O0NBRTFCLFFBQVEsSUFBSSxVQUFVLEdBQUcsRUFBRSxDQUFDOztDQUU1QixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDckMsVUFBVSxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUlHLHVCQUF1QixDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztDQUM3RSxTQUFTOztDQUVULFFBQVEsSUFBSSxPQUFPLEdBQUcsSUFBSUgsVUFBVSxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUMzRCxRQUFRLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzlCLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7Q0FFM0IsUUFBUSxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO0NBQ3hELE9BQU8sTUFBTTtDQUNiLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQyx1QkFBdUIsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDM0QsT0FBTztDQUNQLEtBQUs7Q0FDTCxHQUFHO0NBQ0gsQ0FBQzs7Q0FFRCxTQUFTLHdCQUF3QixDQUFDLFdBQVcsRUFBRSxRQUFRLEVBQUU7Q0FDekQsRUFBRSxJQUFJ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

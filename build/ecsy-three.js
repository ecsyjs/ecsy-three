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

	class Scene {
	  constructor() {
	    this.scene = null;
	  }

	  reset() {
	    this.scene = null;
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

	class Object3D {
	  constructor() {
	    this.value = null;
	  }

	  reset() {
	    this.value = null;
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

	class Active {
	  constructor() {
	    this.reset();
	  }

	  reset() {
	    this.value = false;
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

	class Rotation {
	  constructor() {
	    this.rotation = new THREE.Vector3();
	  }

	  reset() {
	    this.rotation.set(0, 0, 0);
	  }
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

	class Geometry {
	  constructor() {
	    this.primitive = "box";
	  }

	  reset() {
	    this.primitive = "box";
	  }
	}

	class GLTFModel {}

	class TextGeometry {
	  reset() {}
	}

	class VRController {
	  constructor() {
	    this.id = 0;
	    this.controller = null;
	  }
	  reset() {}
	}

	class Material {
	  constructor() {
	    this.color = 0xff0000;
	  }
	}

	class Sky {
	  constructor() {}
	  reset() {}
	}

	const Camera = ECSY.createComponentClass(
	  {
	    fov: { default: 45 },
	    aspect: { default: 1 },
	    near: { default: 1 },
	    far: { default: 1000 },
	    layers: { default: 0 },
	    handleResize: { default: true }
	  },
	  "Camera"
	);

	const WebGLRenderer = ECSY.createComponentClass(
	  {
	    vr: { default: true },
	    antialias: { default: true },
	    handleResize: { default: true }
	  },
	  "WebGLRenderer"
	);

	class RenderableGroup {
	  constructor() {
	    this.scene = null;
	    this.camera = null;
	  }

	  reset() {
	    this.scene = null;
	    this.camera = null;
	  }
	}

	/**
	 * Create a Mesh based on the [Geometry] component and attach it to the entity using a [Object3D] component
	 */
	class GeometrySystem extends ECSY.System {
	  execute() {
	    // Removed
	    this.queries.entities.removed.forEach((/*entity*/) => {
	      /*
	      let object = entity.getRemovedComponent(Object3D).value;
	      let parent = entity.getComponent(Parent, true).value;
	      parent.getComponent(Object3D).value.remove(object);
	      */
	    });

	    // Added
	    this.queries.entities.added.forEach(entity => {
	      let component = entity.getComponent(Geometry);

	      let geometry;
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

	      let color =
	        component.primitive === "torus" ? 0x999900 : Math.random() * 0xffffff;

	      let material = new THREE.MeshStandardMaterial({
	        color: color,
	        roughness: 0.7,
	        metalness: 0.0,
	        flatShading: true
	      });

	      let object = new THREE.Mesh(geometry, material);
	      object.castShadow = true;
	      object.receiveShadow = true;

	      if (entity.hasComponent(Transform)) {
	        let transform = entity.getComponent(Transform);
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
	    this.renderer = null;
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
	    // Uninitialized renderers
	    this.queries.uninitializedRenderers.results.forEach(entity => {
	      var component = entity.getComponent(WebGLRenderer);

	      var renderer = new THREE.WebGLRenderer({
	        antialias: component.antialias
	      });

	      renderer.setPixelRatio(window.devicePixelRatio);
	      if (component.handleResize) {
	        renderer.setSize(window.innerWidth, window.innerHeight);
	      }

	      document.body.appendChild(renderer.domElement);

	      if (component.vr) {
	        renderer.vr.enabled = true;
	        document.body.appendChild(
	          WebVR_js.WEBVR.createButton(renderer, { referenceSpaceType: "local" })
	        );
	      }

	      entity.addComponent(WebGLRendererContext, { renderer: renderer });
	    });

	    this.queries.renderers.changed.forEach(entity => {
	      var component = entity.getComponent(WebGLRenderer);
	      var renderer = entity.getComponent(WebGLRendererContext).renderer;
	      if (
	        component.width !== renderer.width ||
	        component.height !== renderer.height
	      ) {
	        renderer.setSize(component.width, component.height);
	        // innerWidth/innerHeight
	      }
	    });

	    let renderers = this.queries.renderers.results;
	    renderers.forEach(rendererEntity => {
	      var renderer = rendererEntity.getComponent(WebGLRendererContext).renderer;
	      this.queries.renderables.results.forEach(entity => {
	        var group = entity.getComponent(RenderableGroup);
	        var scene = group.scene.getComponent(Object3D).value;
	        var camera = group.camera.getComponent(Object3D).value;
	        renderer.render(scene, camera);
	      });
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
	  renderables: {
	    components: [RenderableGroup]
	  }
	};

	class TransformSystem extends ECSY.System {
	  execute() {
	    // Hierarchy
	    let added = this.queries.parent.added;
	    for (var i = 0; i < added.length; i++) {
	      var entity = added[i];
	      console.log("Adding", i);
	      var parentEntity = entity.getComponent(Parent).value;
	      parentEntity
	        .getComponent(Object3D)
	        .value.add(entity.getComponent(Object3D).value);
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

	    let camerasUninitialized = this.queries.camerasUninitialized.results;
	    for (let i = 0; i < camerasUninitialized.length; i++) {
	      let entity = camerasUninitialized[i];

	      let component = entity.getComponent(Camera);

	      let camera = new THREE.PerspectiveCamera(
	        component.fov,
	        component.aspect,
	        component.near,
	        component.far
	      );

	      camera.layers.enable(component.layers);

	      entity.addComponent(Object3D, { value: camera });
	    }
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

	function initializeDefault(world = new ECSY.World()) {
	  init(world);

	  let scene = world
	    .createEntity()
	    .addComponent(Object3D /* Scene */, { value: new THREE.Scene() });
	  let renderer = world.createEntity().addComponent(WebGLRenderer);
	  let camera = world.createEntity().addComponent(Camera, {
	    fov: 90,
	    aspect: window.innerWidth / window.innerHeight,
	    near: 1,
	    far: 1000,
	    layers: 1,
	    handleResize: true
	  });

	  let renderables = world.createEntity().addComponent(RenderableGroup, {
	    scene: scene,
	    camera: camera
	  });

	  return {
	    world,
	    entities: {
	      scene,
	      camera,
	      renderer,
	      renderables
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
	exports.WebGLRendererSystem = WebGLRendererSystem;
	exports.init = init;
	exports.initializeDefault = initializeDefault;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NvbXBvbmVudHMvU2NlbmUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9QYXJlbnQuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Ta3lib3guanMiLCIuLi9zcmMvY29tcG9uZW50cy9PYmplY3QzRC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Zpc2libGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9DYW1lcmFSaWcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9EcmFnZ2FibGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9EcmFnZ2luZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Bvc2l0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUm90YXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9UcmFuc2Zvcm0uanMiLCIuLi9zcmMvY29tcG9uZW50cy9HZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0dMVEZNb2RlbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHRHZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1ZSQ29udHJvbGxlci5qcyIsIi4uL3NyYy9jb21wb25lbnRzL01hdGVyaWFsLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvaW5kZXguanMiLCIuLi9zcmMvc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0dMVEZMb2FkZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9WaXNpYmlsaXR5U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qcyIsIi4uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgU2NlbmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUGFyZW50IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFNreUJveCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudGV4dHVyZSA9IFwiXCI7XG4gICAgdGhpcy50eXBlID0gXCJcIjtcbiAgfVxuICByZXNldCgpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBPYmplY3QzRCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBWaXNpYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2FtZXJhUmlnIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5sZWZ0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5yaWdodEhhbmQgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIERyYWdnYWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgVGFnQ29tcG9uZW50IH0gZnJvbSBcImVjc3lcIjtcbmV4cG9ydCBjbGFzcyBEcmFnZ2luZyBleHRlbmRzIFRhZ0NvbXBvbmVudCB7fVxuIiwiZXhwb3J0IGNsYXNzIEFjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBQb3NpdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUm90YXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFRyYW5zZm9ybSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucG9zaXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgY29weShzcmMpIHtcbiAgICB0aGlzLnBvc2l0aW9uLmNvcHkoc3JjLnBvc2l0aW9uKTtcbiAgICB0aGlzLnJvdGF0aW9uLmNvcHkoc3JjLnJvdGF0aW9uKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICAgIHRoaXMucm90YXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTW9kZWwge31cbiIsImV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnkge1xuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgVlJDb250cm9sbGVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZCA9IDA7XG4gICAgdGhpcy5jb250cm9sbGVyID0gbnVsbDtcbiAgfVxuICByZXNldCgpIHt9XG59XG4iLCJleHBvcnQgY2xhc3MgTWF0ZXJpYWwge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmNvbG9yID0gMHhmZjAwMDA7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3kge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cbiIsImltcG9ydCB7IGNyZWF0ZUNvbXBvbmVudENsYXNzIH0gZnJvbSBcImVjc3lcIjtcblxuZXhwb3J0IHsgU2NlbmUgfSBmcm9tIFwiLi9TY2VuZS5qc1wiO1xuZXhwb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4vUGFyZW50LmpzXCI7XG5leHBvcnQgeyBTa3lCb3ggfSBmcm9tIFwiLi9Ta3lib3guanNcIjtcbmV4cG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vT2JqZWN0M0QuanNcIjtcbmV4cG9ydCB7IFZpc2libGUgfSBmcm9tIFwiLi9WaXNpYmxlLmpzXCI7XG5leHBvcnQgeyBDYW1lcmFSaWcgfSBmcm9tIFwiLi9DYW1lcmFSaWcuanNcIjtcbmV4cG9ydCB7IERyYWdnYWJsZSB9IGZyb20gXCIuL0RyYWdnYWJsZS5qc1wiO1xuZXhwb3J0IHsgRHJhZ2dpbmcgfSBmcm9tIFwiLi9EcmFnZ2luZy5qc1wiO1xuZXhwb3J0IHsgQWN0aXZlIH0gZnJvbSBcIi4vQWN0aXZlLmpzXCI7XG5cbmV4cG9ydCB7IFBvc2l0aW9uIH0gZnJvbSBcIi4vUG9zaXRpb24uanNcIjtcbmV4cG9ydCB7IFJvdGF0aW9uIH0gZnJvbSBcIi4vUm90YXRpb24uanNcIjtcbmV4cG9ydCB7IFRyYW5zZm9ybSB9IGZyb20gXCIuL1RyYW5zZm9ybS5qc1wiO1xuXG5leHBvcnQgeyBHZW9tZXRyeSB9IGZyb20gXCIuL0dlb21ldHJ5LmpzXCI7XG5leHBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi9HTFRGTW9kZWwuanNcIjtcbmV4cG9ydCB7IFRleHRHZW9tZXRyeSB9IGZyb20gXCIuL1RleHRHZW9tZXRyeS5qc1wiO1xuZXhwb3J0IHsgVlJDb250cm9sbGVyIH0gZnJvbSBcIi4vVlJDb250cm9sbGVyLmpzXCI7XG5leHBvcnQgeyBNYXRlcmlhbCB9IGZyb20gXCIuL01hdGVyaWFsLmpzXCI7XG5leHBvcnQgeyBTa3kgfSBmcm9tIFwiLi9Ta3kuanNcIjtcblxuZXhwb3J0IGNvbnN0IENhbWVyYSA9IGNyZWF0ZUNvbXBvbmVudENsYXNzKFxuICB7XG4gICAgZm92OiB7IGRlZmF1bHQ6IDQ1IH0sXG4gICAgYXNwZWN0OiB7IGRlZmF1bHQ6IDEgfSxcbiAgICBuZWFyOiB7IGRlZmF1bHQ6IDEgfSxcbiAgICBmYXI6IHsgZGVmYXVsdDogMTAwMCB9LFxuICAgIGxheWVyczogeyBkZWZhdWx0OiAwIH0sXG4gICAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUgfVxuICB9LFxuICBcIkNhbWVyYVwiXG4pO1xuXG5leHBvcnQgY29uc3QgV2ViR0xSZW5kZXJlciA9IGNyZWF0ZUNvbXBvbmVudENsYXNzKFxuICB7XG4gICAgdnI6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGFudGlhbGlhczogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUgfVxuICB9LFxuICBcIldlYkdMUmVuZGVyZXJcIlxuKTtcblxuZXhwb3J0IGNsYXNzIFJlbmRlcmFibGVHcm91cCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKCgvKmVudGl0eSovKSA9PiB7XG4gICAgICAvKlxuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRSZW1vdmVkQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIGxldCBwYXJlbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCwgdHJ1ZSkudmFsdWU7XG4gICAgICBwYXJlbnQuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS5yZW1vdmUob2JqZWN0KTtcbiAgICAgICovXG4gICAgfSk7XG5cbiAgICAvLyBBZGRlZFxuICAgIHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChHZW9tZXRyeSk7XG5cbiAgICAgIGxldCBnZW9tZXRyeTtcbiAgICAgIHN3aXRjaCAoY29tcG9uZW50LnByaW1pdGl2ZSkge1xuICAgICAgICBjYXNlIFwidG9ydXNcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQucmFkaXVzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHViZSxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGlhbFNlZ21lbnRzLFxuICAgICAgICAgICAgICBjb21wb25lbnQudHVidWxhclNlZ21lbnRzXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInNwaGVyZVwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkljb3NhaGVkcm9uQnVmZmVyR2VvbWV0cnkoY29tcG9uZW50LnJhZGl1cywgMSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiYm94XCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkoXG4gICAgICAgICAgICAgIGNvbXBvbmVudC53aWR0aCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmhlaWdodCxcbiAgICAgICAgICAgICAgY29tcG9uZW50LmRlcHRoXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgbGV0IGNvbG9yID1cbiAgICAgICAgY29tcG9uZW50LnByaW1pdGl2ZSA9PT0gXCJ0b3J1c1wiID8gMHg5OTk5MDAgOiBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG5cbiAgICAgIGxldCBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wLFxuICAgICAgICBmbGF0U2hhZGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIGxldCBvYmplY3QgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuICAgICAgb2JqZWN0LmNhc3RTaGFkb3cgPSB0cnVlO1xuICAgICAgb2JqZWN0LnJlY2VpdmVTaGFkb3cgPSB0cnVlO1xuXG4gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChUcmFuc2Zvcm0pKSB7XG4gICAgICAgIGxldCB0cmFuc2Zvcm0gPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRyYW5zZm9ybSk7XG4gICAgICAgIG9iamVjdC5wb3NpdGlvbi5jb3B5KHRyYW5zZm9ybS5wb3NpdGlvbik7XG4gICAgICAgIGlmICh0cmFuc2Zvcm0ucm90YXRpb24pIHtcbiAgICAgICAgICBvYmplY3Qucm90YXRpb24uc2V0KFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi56XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KEVsZW1lbnQpICYmICFlbnRpdHkuaGFzQ29tcG9uZW50KERyYWdnYWJsZSkpIHtcbiAgICAgIC8vICAgICAgICBvYmplY3QubWF0ZXJpYWwuY29sb3Iuc2V0KDB4MzMzMzMzKTtcbiAgICAgIC8vICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBvYmplY3QgfSk7XG5cbiAgICAgIC8vIEB0b2RvIFJlbW92ZSBpdCEgaGllcmFyY2h5IHN5c3RlbSB3aWxsIHRha2UgY2FyZSBvZiBpdFxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoUGFyZW50KSkge1xuICAgICAgICBlbnRpdHlcbiAgICAgICAgICAuZ2V0Q29tcG9uZW50KFBhcmVudClcbiAgICAgICAgICAudmFsdWUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKVxuICAgICAgICAgIC52YWx1ZS5hZGQob2JqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG5HZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHZW9tZXRyeV0sIC8vIEB0b2RvIFRyYW5zZm9ybTogQXMgb3B0aW9uYWwsIGhvdyB0byBkZWZpbmUgaXQ/XG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IEdMVEZNb2RlbCB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZNb2RlbC5qc1wiO1xuXG4vLyBAdG9kbyBVc2UgcGFyYW1ldGVyIGFuZCBsb2FkZXIgbWFuYWdlclxudmFyIGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyKCkuc2V0UGF0aChcIi9hc3NldHMvXCIpO1xuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdmFyIGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkO1xuXG4gICAgLy9RdWVyaWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGVudGl0aWVzW2ldO1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR0xURk1vZGVsKTtcblxuICAgICAgbG9hZGVyLmxvYWQoY29tcG9uZW50LnVybCwgZ2x0ZiA9PiB7XG4gICAgICAgIC8qXG4gICAgICAgIGdsdGYuc2NlbmUudHJhdmVyc2UoZnVuY3Rpb24oY2hpbGQpIHtcbiAgICAgICAgICBpZiAoY2hpbGQuaXNNZXNoKSB7XG4gICAgICAgICAgICBjaGlsZC5tYXRlcmlhbC5lbnZNYXAgPSBlbnZNYXA7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiovXG4gICAgICAgIC8vIEB0b2RvIFJlbW92ZSwgaGllcmFyY2h5IHdpbGwgdGFrZSBjYXJlIG9mIGl0XG4gICAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFBhcmVudCkpIHtcbiAgICAgICAgICBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCkudmFsdWUuYWRkKGdsdGYuc2NlbmUpO1xuICAgICAgICB9XG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdsdGYuc2NlbmUgfSk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn1cblxuR0xURkxvYWRlclN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTW9kZWxdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTa3lCb3gsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGxldCBza3lib3ggPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNreUJveCk7XG5cbiAgICAgIGxldCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICAgZ2VvbWV0cnkuc2NhbGUoMSwgMSwgLTEpO1xuXG4gICAgICBpZiAoc2t5Ym94LnR5cGUgPT09IFwiY3ViZW1hcC1zdGVyZW9cIikge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoc2t5Ym94LnRleHR1cmVVcmwsIDEyKTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzKTtcbiAgICAgICAgc2t5Qm94LmxheWVycy5zZXQoMSk7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3gpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzUi5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveFIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICAgIHNreUJveFIubGF5ZXJzLnNldCgyKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveFIpO1xuXG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdyb3VwIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biBza3lib3ggdHlwZTogXCIsIHNreWJveC50eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5Ta3lCb3hTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbU2t5Qm94LCBOb3QoT2JqZWN0M0QpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZpc2libGUsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2liaWxpdHlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBwcm9jZXNzVmlzaWJpbGl0eShlbnRpdGllcykge1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS52aXNpYmxlID0gZW50aXR5LmdldENvbXBvbmVudChcbiAgICAgICAgVmlzaWJsZVxuICAgICAgKS52YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQpO1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQpO1xuICB9XG59XG5cblZpc2liaWxpdHlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVmlzaWJsZSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBSZW5kZXJhYmxlR3JvdXAsXG4gIFdlYkdMUmVuZGVyZXIsXG4gIE9iamVjdDNEXG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFdFQlZSIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS92ci9XZWJWUi5qc1wiO1xuXG5jbGFzcyBXZWJHTFJlbmRlcmVyQ29udGV4dCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVuZGVyZXIgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgICAgIGNvbXBvbmVudC53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIHJlbmRlcmVyLnNldFBpeGVsUmF0aW8od2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgaWYgKGNvbXBvbmVudC5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZSh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgIH1cblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICByZW5kZXJlci52ci5lbmFibGVkID0gdHJ1ZTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChcbiAgICAgICAgICBXRUJWUi5jcmVhdGVCdXR0b24ocmVuZGVyZXIsIHsgcmVmZXJlbmNlU3BhY2VUeXBlOiBcImxvY2FsXCIgfSlcbiAgICAgICAgKTtcbiAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCwgeyByZW5kZXJlcjogcmVuZGVyZXIgfSk7XG4gICAgfSk7XG5cbiAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLmNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICB2YXIgcmVuZGVyZXIgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS5yZW5kZXJlcjtcbiAgICAgIGlmIChcbiAgICAgICAgY29tcG9uZW50LndpZHRoICE9PSByZW5kZXJlci53aWR0aCB8fFxuICAgICAgICBjb21wb25lbnQuaGVpZ2h0ICE9PSByZW5kZXJlci5oZWlnaHRcbiAgICAgICkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKGNvbXBvbmVudC53aWR0aCwgY29tcG9uZW50LmhlaWdodCk7XG4gICAgICAgIC8vIGlubmVyV2lkdGgvaW5uZXJIZWlnaHRcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGxldCByZW5kZXJlcnMgPSB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHM7XG4gICAgcmVuZGVyZXJzLmZvckVhY2gocmVuZGVyZXJFbnRpdHkgPT4ge1xuICAgICAgdmFyIHJlbmRlcmVyID0gcmVuZGVyZXJFbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0KS5yZW5kZXJlcjtcbiAgICAgIHRoaXMucXVlcmllcy5yZW5kZXJhYmxlcy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgdmFyIGdyb3VwID0gZW50aXR5LmdldENvbXBvbmVudChSZW5kZXJhYmxlR3JvdXApO1xuICAgICAgICB2YXIgc2NlbmUgPSBncm91cC5zY2VuZS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICB2YXIgY2FtZXJhID0gZ3JvdXAuY2FtZXJhLmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgIHJlbmRlcmVyLnJlbmRlcihzY2VuZSwgY2FtZXJhKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJhYmxlczoge1xuICAgIGNvbXBvbmVudHM6IFtSZW5kZXJhYmxlR3JvdXBdXG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1TeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIEhpZXJhcmNoeVxuICAgIGxldCBhZGRlZCA9IHRoaXMucXVlcmllcy5wYXJlbnQuYWRkZWQ7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhZGRlZC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVudGl0eSA9IGFkZGVkW2ldO1xuICAgICAgY29uc29sZS5sb2coXCJBZGRpbmdcIiwgaSk7XG4gICAgICB2YXIgcGFyZW50RW50aXR5ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlO1xuICAgICAgcGFyZW50RW50aXR5XG4gICAgICAgIC5nZXRDb21wb25lbnQoT2JqZWN0M0QpXG4gICAgICAgIC52YWx1ZS5hZGQoZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5UcmFuc2Zvcm1TeXN0ZW0ucXVlcmllcyA9IHtcbiAgcGFyZW50OiB7XG4gICAgY29tcG9uZW50czogW1BhcmVudCwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBDYW1lcmEsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgQ2FtZXJhU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwicmVzaXplXCIsXG4gICAgICAoKSA9PiB7XG4gICAgICAgIHRoaXMucXVlcmllcy5jYW1lcmFzLnJlc3VsdHMuZm9yRWFjaChjYW1lcmEgPT4ge1xuICAgICAgICAgIGxldCBjb21wb25lbnQgPSBjYW1lcmEuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgICAgIGNhbWVyYS5nZXRNdXRhYmxlQ29tcG9uZW50KENhbWVyYSkuYXNwZWN0ID1cbiAgICAgICAgICAgICAgd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcIkFzcGVjdCB1cGRhdGVkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5jYW1lcmFzLmNoYW5nZWQ7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VkLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gY2hhbmdlZFtpXTtcblxuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgIGxldCBjYW1lcmEzZCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgaWYgKGNhbWVyYTNkLmFzcGVjdCAhPT0gY29tcG9uZW50LmFzcGVjdCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkNhbWVyYSBVcGRhdGVkXCIpO1xuXG4gICAgICAgIGNhbWVyYTNkLmFzcGVjdCA9IGNvbXBvbmVudC5hc3BlY3Q7XG4gICAgICAgIGNhbWVyYTNkLnVwZGF0ZVByb2plY3Rpb25NYXRyaXgoKTtcbiAgICAgIH1cbiAgICAgIC8vIEB0b2RvIERvIGl0IGZvciB0aGUgcmVzdCBvZiB0aGUgdmFsdWVzXG4gICAgfVxuXG4gICAgbGV0IGNhbWVyYXNVbmluaXRpYWxpemVkID0gdGhpcy5xdWVyaWVzLmNhbWVyYXNVbmluaXRpYWxpemVkLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYW1lcmFzVW5pbml0aWFsaXplZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNhbWVyYXNVbmluaXRpYWxpemVkW2ldO1xuXG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuXG4gICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICBjb21wb25lbnQuZm92LFxuICAgICAgICBjb21wb25lbnQuYXNwZWN0LFxuICAgICAgICBjb21wb25lbnQubmVhcixcbiAgICAgICAgY29tcG9uZW50LmZhclxuICAgICAgKTtcblxuICAgICAgY2FtZXJhLmxheWVycy5lbmFibGUoY29tcG9uZW50LmxheWVycyk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGNhbWVyYSB9KTtcbiAgICB9XG4gIH1cbn1cblxuQ2FtZXJhU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGNhbWVyYXNVbmluaXRpYWxpemVkOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgTm90KE9iamVjdDNEKV1cbiAgfSxcbiAgY2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtDYW1lcmFdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgVGV4dEdlb21ldHJ5LCBPYmplY3QzRCB9IGZyb20gXCIuLi9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgaW5pdCgpIHtcbiAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgdmFyIGxvYWRlciA9IG5ldyBUSFJFRS5Gb250TG9hZGVyKCk7XG4gICAgdGhpcy5mb250ID0gbnVsbDtcbiAgICBsb2FkZXIubG9hZChcIi9hc3NldHMvZm9udHMvaGVsdmV0aWtlcl9yZWd1bGFyLnR5cGVmYWNlLmpzb25cIiwgZm9udCA9PiB7XG4gICAgICB0aGlzLmZvbnQgPSBmb250O1xuICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIGlmICghdGhpcy5mb250KSByZXR1cm47XG5cbiAgICB2YXIgY2hhbmdlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkO1xuICAgIGNoYW5nZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcbiAgICAgIHZhciBvYmplY3QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBvYmplY3QuZ2VvbWV0cnkgPSBnZW9tZXRyeTtcbiAgICB9KTtcblxuICAgIHZhciBhZGRlZCA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcbiAgICBhZGRlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgY29sb3IgPSBNYXRoLnJhbmRvbSgpICogMHhmZmZmZmY7XG4gICAgICBjb2xvciA9IDB4ZmZmZmZmO1xuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hTdGFuZGFyZE1hdGVyaWFsKHtcbiAgICAgICAgY29sb3I6IGNvbG9yLFxuICAgICAgICByb3VnaG5lc3M6IDAuNyxcbiAgICAgICAgbWV0YWxuZXNzOiAwLjBcbiAgICAgIH0pO1xuXG4gICAgICB2YXIgbWVzaCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG1lc2ggfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuVGV4dEdlb21ldHJ5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1RleHRHZW9tZXRyeV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIGNoYW5nZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBFQ1NZIGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuLy8gY29tcG9uZW50c1xuZXhwb3J0IHtcbiAgQWN0aXZlLFxuICBDYW1lcmEsXG4gIENhbWVyYVJpZyxcbiAgRHJhZ2dhYmxlLFxuICBEcmFnZ2luZyxcbiAgR2VvbWV0cnksXG4gIEdMVEZNb2RlbCxcbiAgTWF0ZXJpYWwsXG4gIE9iamVjdDNELFxuICBQYXJlbnQsXG4gIFBvc2l0aW9uLFxuICBSb3RhdGlvbixcbiAgU2NlbmUsXG4gIFNreSxcbiAgU2t5Qm94LFxuICBUZXh0R2VvbWV0cnksXG4gIFRyYW5zZm9ybSxcbiAgVmlzaWJsZSxcbiAgVlJDb250cm9sbGVyXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLy8gc3lzdGVtc1xuZXhwb3J0IHsgR2VvbWV0cnlTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0dlb21ldHJ5U3lzdGVtLmpzXCI7XG5leHBvcnQgeyBHTFRGTG9hZGVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBTa3lCb3hTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1NreUJveFN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVmlzaWJpbGl0eVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgV2ViR0xSZW5kZXJlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvV2ViR0xSZW5kZXJlclN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmV4cG9ydCB7IENhbWVyYVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBUZXh0R2VvbWV0cnlTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RleHRHZW9tZXRyeVN5c3RlbS5qc1wiO1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1TeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgV2ViR0xSZW5kZXJlciwgUmVuZGVyYWJsZUdyb3VwLCBDYW1lcmEgfSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0KHdvcmxkKSB7XG4gIHdvcmxkXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFRyYW5zZm9ybVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oQ2FtZXJhU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShXZWJHTFJlbmRlcmVyU3lzdGVtLCB7IHByaW9yaXR5OiAxIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5pdGlhbGl6ZURlZmF1bHQod29ybGQgPSBuZXcgRUNTWS5Xb3JsZCgpKSB7XG4gIGluaXQod29ybGQpO1xuXG4gIGxldCBzY2VuZSA9IHdvcmxkXG4gICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgLmFkZENvbXBvbmVudChPYmplY3QzRCAvKiBTY2VuZSAqLywgeyB2YWx1ZTogbmV3IFRIUkVFLlNjZW5lKCkgfSk7XG4gIGxldCByZW5kZXJlciA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgbGV0IGNhbWVyYSA9IHdvcmxkLmNyZWF0ZUVudGl0eSgpLmFkZENvbXBvbmVudChDYW1lcmEsIHtcbiAgICBmb3Y6IDkwLFxuICAgIGFzcGVjdDogd2luZG93LmlubmVyV2lkdGggLyB3aW5kb3cuaW5uZXJIZWlnaHQsXG4gICAgbmVhcjogMSxcbiAgICBmYXI6IDEwMDAsXG4gICAgbGF5ZXJzOiAxLFxuICAgIGhhbmRsZVJlc2l6ZTogdHJ1ZVxuICB9KTtcblxuICBsZXQgcmVuZGVyYWJsZXMgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoUmVuZGVyYWJsZUdyb3VwLCB7XG4gICAgc2NlbmU6IHNjZW5lLFxuICAgIGNhbWVyYTogY2FtZXJhXG4gIH0pO1xuXG4gIHJldHVybiB7XG4gICAgd29ybGQsXG4gICAgZW50aXRpZXM6IHtcbiAgICAgIHNjZW5lLFxuICAgICAgY2FtZXJhLFxuICAgICAgcmVuZGVyZXIsXG4gICAgICByZW5kZXJhYmxlc1xuICAgIH1cbiAgfTtcbn1cbiJdLCJuYW1lcyI6WyJUYWdDb21wb25lbnQiLCJUSFJFRS5WZWN0b3IzIiwiY3JlYXRlQ29tcG9uZW50Q2xhc3MiLCJTeXN0ZW0iLCJUSFJFRS5Ub3J1c0J1ZmZlckdlb21ldHJ5IiwiVEhSRUUuSWNvc2FoZWRyb25CdWZmZXJHZW9tZXRyeSIsIlRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwiLCJUSFJFRS5NZXNoIiwiR0xURkxvYWRlciIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJOb3QiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiV0VCVlIiLCJUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYSIsIlRIUkVFLkZvbnRMb2FkZXIiLCJUSFJFRS5UZXh0R2VvbWV0cnkiLCJFQ1NZLldvcmxkIiwiVEhSRUUuU2NlbmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0NBQU8sTUFBTSxLQUFLLENBQUM7Q0FDbkIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztDQUN0QixHQUFHOztDQUVILEVBQUUsS0FBSyxHQUFHO0NBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztDQUN0QixHQUFHO0NBQ0gsQ0FBQzs7Q0NSTSxNQUFNLE1BQU0sQ0FBQztDQUNwQixFQUFFLFdBQVcsR0FBRztDQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0NBQ3RCLEdBQUc7O0NBRUgsRUFBRSxLQUFLLEdBQUc7Q0FDVixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0NBQ3RCLEdBQUc7Q0FDSCxDQUFDOztDQ1JNLE1BQU0sTUFBTSxDQUFDO0NBQ3BCLEVBQUUsV0FBVyxHQUFHO0NBQ2hCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Q0FDdEIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztDQUNuQixHQUFHO0NBQ0gsRUFBRSxLQUFLLEdBQUc7Q0FDVixJQUFJLElBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0NBQ3RCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7Q0FDbkIsR0FBRztDQUNILENBQUM7O0NDVE0sTUFBTSxRQUFRLENBQUM7Q0FDdEIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztDQUN0QixHQUFHOztDQUVILEVBQUUsS0FBSyxHQUFHO0NBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztDQUN0QixHQUFHO0NBQ0gsQ0FBQzs7Q0NSTSxNQUFNLE9BQU8sQ0FBQztDQUNyQixFQUFFLFdBQVcsR0FBRztDQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztDQUNqQixHQUFHOztDQUVILEVBQUUsS0FBSyxHQUFHO0NBQ1YsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztDQUN2QixHQUFHO0NBQ0gsQ0FBQzs7Q0NSTSxNQUFNLFNBQVMsQ0FBQztDQUN2QixFQUFFLFdBQVcsR0FBRztDQUNoQixJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztDQUNqQixHQUFHOztDQUVILEVBQUUsS0FBSyxHQUFHO0NBQ1YsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztDQUN6QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0NBQzFCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Q0FDdkIsR0FBRztDQUNILENBQUM7O0NDVk0sTUFBTSxTQUFTLENBQUM7Q0FDdkIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Q0FDakIsR0FBRzs7Q0FFSCxFQUFFLEtBQUssR0FBRztDQUNWLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Q0FDdkIsR0FBRztDQUNILENBQUM7O0NDUE0sTUFBTSxRQUFRLFNBQVNBLGlCQUFZLENBQUMsRUFBRTs7Q0NEdEMsTUFBTSxNQUFNLENBQUM7Q0FDcEIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7Q0FDakIsR0FBRzs7Q0FFSCxFQUFFLEtBQUssR0FBRztDQUNWLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7Q0FDdkIsR0FBRztDQUNILENBQUM7O0NDTk0sTUFBTSxRQUFRLENBQUM7Q0FDdEIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUlDLGFBQWEsRUFBRSxDQUFDO0NBQ3hDLEdBQUc7O0NBRUgsRUFBRSxLQUFLLEdBQUc7Q0FDVixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDL0IsR0FBRztDQUNILENBQUM7O0NDUk0sTUFBTSxRQUFRLENBQUM7Q0FDdEIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUlBLGFBQWEsRUFBRSxDQUFDO0NBQ3hDLEdBQUc7O0NBRUgsRUFBRSxLQUFLLEdBQUc7Q0FDVixJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Q0FDL0IsR0FBRztDQUNILENBQUM7O0NDUk0sTUFBTSxTQUFTLENBQUM7Q0FDdkIsRUFBRSxXQUFXLEdBQUc7Q0FDaEIsSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUlBLGFBQWEsRUFBRSxDQUFDO0NBQ3hDLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJQSxhQUFhLEVBQUUsQ0FBQztDQUN4QyxHQUFHOztDQUVILEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRTtDQUNaLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ3JDLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0NBQ3JDLEdBQUc7O0NBRUgsRUFBRSxLQUFLLEdBQUc7Q0FDVixJQUFJLElB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SyxnQkFBZ0IsRUFBRTtDQUM1QyxRQUFRLElBQUksUUFBUSxHQUFHLHdCQUF3QixDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLENBQUM7O0NBRXZFLFFBQVEsSUFBSSxTQUFTLEdBQUcsRUFBRSxDQUFDOztDQUUzQixRQUFRLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Q0FDcEMsVUFBVSxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUlLLHVCQUF1QixDQUFDLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztDQUM1RSxTQUFTOztDQUVULFFBQVEsSUFBSSxNQUFNLEdBQUcsSUFBSUgsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztDQUN6RCxRQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0NBQzdCLFFBQVEsS0FBSyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7Q0FFMUIsUUFBUSxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7O0NBRTVCLFFBQVEsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRTtDQUNyQyxVQUFVLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSUcsdUJBQXVCLENBQUMsRUFBRSxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0NBQzdFLFNBQVM7O0NBRVQsUUFBUSxJQUFJLE9BQU8sR0FBRyxJQUFJSCxVQUFVLENBQUMsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0NBQzNELFFBQVEsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDOUIsUUFBUSxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztDQUUzQixRQUFRLE1BQU0s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

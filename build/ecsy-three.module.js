import { TagComponent, System, Not, World } from 'ecsy';
import { Vector3, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshLambertMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, MeshStandardMaterial, Clock, Scene as Scene$1 } from 'three';
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

      renderer.gammaInput = component.gammaInput;
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

function init(world) {
  world
    .registerSystem(TransformSystem)
    .registerSystem(CameraSystem)
    .registerSystem(WebGLRendererSystem, { priority: 1 });
}

function initializeDefault(world = new World(), options) {
  init(world);

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

export { Active, Camera, CameraRig, CameraSystem, Draggable, Dragging, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, Material, Object3D, Parent, Position, RenderPass, Rotation, Scene, Sky, SkyBox, SkyBoxSystem, TextGeometry, TextGeometrySystem, Transform, TransformSystem, VRController, VisibilitySystem, Visible, WebGLRendererContext, WebGLRendererSystem, init, initializeDefault };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL0FjdGl2ZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0NhbWVyYVJpZy5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnYWJsZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL0RyYWdnaW5nLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvR2VvbWV0cnkuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYXRlcmlhbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL09iamVjdDNELmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUG9zaXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9SZW5kZXJQYXNzLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUm90YXRpb24uanMiLCIuLi9zcmMvY29tcG9uZW50cy9TY2VuZS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NreS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NreWJveC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RleHRHZW9tZXRyeS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1RyYW5zZm9ybS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1Zpc2libGUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WUkNvbnRyb2xsZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9XZWJHTFJlbmRlcmVyLmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvaW5pdGlhbGl6ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY2xhc3MgQWN0aXZlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQ2FtZXJhIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5mb3YgPSA0NTtcbiAgICB0aGlzLmFzcGVjdCA9IDE7XG4gICAgdGhpcy5uZWFyID0gMTtcbiAgICB0aGlzLmZhciA9IDEwMDA7XG4gICAgdGhpcy5sYXllcnMgPSAwO1xuICAgIHRoaXMuaGFuZGxlUmVzaXplID0gdHJ1ZTtcbiAgfVxuXG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBDYW1lcmFSaWcge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLmxlZnRIYW5kID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0SGFuZCA9IG51bGw7XG4gICAgdGhpcy5jYW1lcmEgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgRHJhZ2dhYmxlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IGZhbHNlO1xuICB9XG59XG4iLCJpbXBvcnQgeyBUYWdDb21wb25lbnQgfSBmcm9tIFwiZWNzeVwiO1xuZXhwb3J0IGNsYXNzIERyYWdnaW5nIGV4dGVuZHMgVGFnQ29tcG9uZW50IHt9XG4iLCJleHBvcnQgY2xhc3MgR2VvbWV0cnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnByaW1pdGl2ZSA9IFwiYm94XCI7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBHTFRGTW9kZWwge31cbiIsImV4cG9ydCBjbGFzcyBNYXRlcmlhbCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY29sb3IgPSAweGZmMDAwMDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIE9iamVjdDNEIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgUmVuZGVyUGFzcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICAgIHRoaXMuY2FtZXJhID0gbnVsbDtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBSb3RhdGlvbiB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucm90YXRpb24gPSBuZXcgVEhSRUUuVmVjdG9yMygpO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5yb3RhdGlvbi5zZXQoMCwgMCwgMCk7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTY2VuZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuc2NlbmUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3kge1xuICBjb25zdHJ1Y3RvcigpIHt9XG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3lCb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5jb3B5KHNyYy5wb3NpdGlvbik7XG4gICAgdGhpcy5yb3RhdGlvbi5jb3B5KHNyYy5yb3RhdGlvbik7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFZpc2libGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBWUkNvbnRyb2xsZXIge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlkID0gMDtcbiAgICB0aGlzLmNvbnRyb2xsZXIgPSBudWxsO1xuICB9XG4gIHJlc2V0KCkge31cbn1cbiIsImV4cG9ydCBjbGFzcyBXZWJHTFJlbmRlcmVyIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52ciA9IGZhbHNlO1xuICAgIHRoaXMuYXIgPSBmYWxzZTtcbiAgICB0aGlzLmFudGlhbGlhcyA9IHRydWU7XG4gICAgdGhpcy5oYW5kbGVSZXNpemUgPSB0cnVlO1xuICAgIHRoaXMuZ2FtbWFJbnB1dCA9IHRydWU7XG4gICAgdGhpcy5nYW1tYU91dHB1dCA9IHRydWU7XG4gICAgdGhpcy5zaGFkb3dNYXAgPSB0cnVlO1xuICB9XG59XG5cbi8qXG5leHBvcnQgY29uc3QgV2ViR0xSZW5kZXJlciA9IGNyZWF0ZUNvbXBvbmVudENsYXNzKFxuICB7XG4gICAgdnI6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGFudGlhbGlhczogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgaGFuZGxlUmVzaXplOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBnYW1tYUlucHV0OiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBnYW1tYU91dHB1dDogeyBkZWZhdWx0OiB0cnVlIH0sXG4gICAgc2hhZG93TWFwOiB7IGRlZmF1bHQ6IGZhbHNlIH1cbiAgfSxcbiAgXCJXZWJHTFJlbmRlcmVyXCJcbik7XG4qL1xuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgR2VvbWV0cnksXG4gIE9iamVjdDNELFxuICBUcmFuc2Zvcm0sXG4gIC8vICBFbGVtZW50LFxuICAvLyAgRHJhZ2dhYmxlLFxuICBQYXJlbnRcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuLyoqXG4gKiBDcmVhdGUgYSBNZXNoIGJhc2VkIG9uIHRoZSBbR2VvbWV0cnldIGNvbXBvbmVudCBhbmQgYXR0YWNoIGl0IHRvIHRoZSBlbnRpdHkgdXNpbmcgYSBbT2JqZWN0M0RdIGNvbXBvbmVudFxuICovXG5leHBvcnQgY2xhc3MgR2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIC8vIFJlbW92ZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVtb3ZlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldFJlbW92ZWRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgdmFyIHBhcmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50LCB0cnVlKS52YWx1ZTtcbiAgICAgIHBhcmVudC5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlLnJlbW92ZShvYmplY3QpO1xuICAgIH0pO1xuXG4gICAgLy8gQWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR2VvbWV0cnkpO1xuXG4gICAgICB2YXIgZ2VvbWV0cnk7XG4gICAgICBzd2l0Y2ggKGNvbXBvbmVudC5wcmltaXRpdmUpIHtcbiAgICAgICAgY2FzZSBcInRvcnVzXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGl1cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YmUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpYWxTZWdtZW50cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YnVsYXJTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzcGhlcmVcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5KGNvbXBvbmVudC5yYWRpdXMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQud2lkdGgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5kZXB0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIHZhciBjb2xvciA9XG4gICAgICAgIGNvbXBvbmVudC5wcmltaXRpdmUgPT09IFwidG9ydXNcIiA/IDB4OTk5OTAwIDogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuXG4gICAgICAgIC8qXG4gICAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KE1hdGVyaWFsKSkge1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgfVxuKi9cblxuICAgICAgdmFyIG1hdGVyaWFsID0gbmV3IFRIUkVFLk1lc2hMYW1iZXJ0TWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIGZsYXRTaGFkaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdmFyIG9iamVjdCA9IG5ldyBUSFJFRS5NZXNoKGdlb21ldHJ5LCBtYXRlcmlhbCk7XG4gICAgICBvYmplY3QuY2FzdFNoYWRvdyA9IHRydWU7XG4gICAgICBvYmplY3QucmVjZWl2ZVNoYWRvdyA9IHRydWU7XG5cbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFRyYW5zZm9ybSkpIHtcbiAgICAgICAgdmFyIHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgICAgaWYgKHRyYW5zZm9ybS5yb3RhdGlvbikge1xuICAgICAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueCxcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoRWxlbWVudCkgJiYgIWVudGl0eS5oYXNDb21wb25lbnQoRHJhZ2dhYmxlKSkge1xuICAgICAgLy8gICAgICAgIG9iamVjdC5tYXRlcmlhbC5jb2xvci5zZXQoMHgzMzMzMzMpO1xuICAgICAgLy8gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IG9iamVjdCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5HZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHZW9tZXRyeV0sIC8vIEB0b2RvIFRyYW5zZm9ybTogQXMgb3B0aW9uYWwsIGhvdyB0byBkZWZpbmUgaXQ/XG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZSxcbiAgICAgIHJlbW92ZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBHTFRGTG9hZGVyIH0gZnJvbSBcInRocmVlL2V4YW1wbGVzL2pzbS9sb2FkZXJzL0dMVEZMb2FkZXIuanNcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBQYXJlbnQgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9QYXJlbnQuanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IEdMVEZNb2RlbCB9IGZyb20gXCIuLi9jb21wb25lbnRzL0dMVEZNb2RlbC5qc1wiO1xuXG4vLyBAdG9kbyBVc2UgcGFyYW1ldGVyIGFuZCBsb2FkZXIgbWFuYWdlclxudmFyIGxvYWRlciA9IG5ldyBHTFRGTG9hZGVyKCkuc2V0UGF0aChcIi9hc3NldHMvXCIpO1xuXG5leHBvcnQgY2xhc3MgR0xURkxvYWRlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZNb2RlbCk7XG5cbiAgICAgIGxvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGdsdGYgPT4ge1xuICAgICAgICAvKlxuICAgICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgICAgY2hpbGQubWF0ZXJpYWwuZW52TWFwID0gZW52TWFwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4qL1xuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBnbHRmLnNjZW5lIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuR0xURkxvYWRlclN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtHTFRGTW9kZWxdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWVcbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBTa3lCb3gsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgU2t5Qm94U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgZW50aXRpZXMgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMucmVzdWx0cztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVudGl0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgZW50aXR5ID0gZW50aXRpZXNbaV07XG5cbiAgICAgIGxldCBza3lib3ggPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFNreUJveCk7XG5cbiAgICAgIGxldCBncm91cCA9IG5ldyBUSFJFRS5Hcm91cCgpO1xuICAgICAgbGV0IGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KDEwMCwgMTAwLCAxMDApO1xuICAgICAgZ2VvbWV0cnkuc2NhbGUoMSwgMSwgLTEpO1xuXG4gICAgICBpZiAoc2t5Ym94LnR5cGUgPT09IFwiY3ViZW1hcC1zdGVyZW9cIikge1xuICAgICAgICBsZXQgdGV4dHVyZXMgPSBnZXRUZXh0dXJlc0Zyb21BdGxhc0ZpbGUoc2t5Ym94LnRleHR1cmVVcmwsIDEyKTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCA2OyBqKyspIHtcbiAgICAgICAgICBtYXRlcmlhbHMucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzKTtcbiAgICAgICAgc2t5Qm94LmxheWVycy5zZXQoMSk7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3gpO1xuXG4gICAgICAgIGxldCBtYXRlcmlhbHNSID0gW107XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDY7IGogPCAxMjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzUi5wdXNoKG5ldyBUSFJFRS5NZXNoQmFzaWNNYXRlcmlhbCh7IG1hcDogdGV4dHVyZXNbal0gfSkpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNreUJveFIgPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWxzUik7XG4gICAgICAgIHNreUJveFIubGF5ZXJzLnNldCgyKTtcbiAgICAgICAgZ3JvdXAuYWRkKHNreUJveFIpO1xuXG4gICAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGdyb3VwIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc29sZS53YXJuKFwiVW5rbm93biBza3lib3ggdHlwZTogXCIsIHNreWJveC50eXBlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKGF0bGFzSW1nVXJsLCB0aWxlc051bSkge1xuICBsZXQgdGV4dHVyZXMgPSBbXTtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHRpbGVzTnVtOyBpKyspIHtcbiAgICB0ZXh0dXJlc1tpXSA9IG5ldyBUSFJFRS5UZXh0dXJlKCk7XG4gIH1cblxuICBsZXQgbG9hZGVyID0gbmV3IFRIUkVFLkltYWdlTG9hZGVyKCk7XG4gIGxvYWRlci5sb2FkKGF0bGFzSW1nVXJsLCBmdW5jdGlvbihpbWFnZU9iaikge1xuICAgIGxldCBjYW52YXMsIGNvbnRleHQ7XG4gICAgbGV0IHRpbGVXaWR0aCA9IGltYWdlT2JqLmhlaWdodDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgIGNhbnZhcy5oZWlnaHQgPSB0aWxlV2lkdGg7XG4gICAgICBjYW52YXMud2lkdGggPSB0aWxlV2lkdGg7XG4gICAgICBjb250ZXh0LmRyYXdJbWFnZShcbiAgICAgICAgaW1hZ2VPYmosXG4gICAgICAgIHRpbGVXaWR0aCAqIGksXG4gICAgICAgIDAsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICAwLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aFxuICAgICAgKTtcbiAgICAgIHRleHR1cmVzW2ldLmltYWdlID0gY2FudmFzO1xuICAgICAgdGV4dHVyZXNbaV0ubmVlZHNVcGRhdGUgPSB0cnVlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHRleHR1cmVzO1xufVxuXG5Ta3lCb3hTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbU2t5Qm94LCBOb3QoT2JqZWN0M0QpXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFZpc2libGUsIE9iamVjdDNEIH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFZpc2liaWxpdHlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBwcm9jZXNzVmlzaWJpbGl0eShlbnRpdGllcykge1xuICAgIGVudGl0aWVzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZS52aXNpYmxlID0gZW50aXR5LmdldENvbXBvbmVudChcbiAgICAgICAgVmlzaWJsZVxuICAgICAgKS52YWx1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgdGhpcy5wcm9jZXNzVmlzaWJpbGl0eSh0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQpO1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQpO1xuICB9XG59XG5cblZpc2liaWxpdHlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVmlzaWJsZSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVmlzaWJsZV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgeyBTeXN0ZW0sIE5vdCB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQge1xuICBSZW5kZXJQYXNzLFxuICBDYW1lcmEsXG4gIEFjdGl2ZSxcbiAgV2ViR0xSZW5kZXJlcixcbiAgT2JqZWN0M0Rcbn0gZnJvbSBcIi4uL2NvbXBvbmVudHMvaW5kZXguanNcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgVlJCdXR0b24gfSBmcm9tIFwidGhyZWUvZXhhbXBsZXMvanNtL3dlYnhyL1ZSQnV0dG9uLmpzXCI7XG5pbXBvcnQgeyBBUkJ1dHRvbiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vd2VieHIvQVJCdXR0b24uanNcIjtcblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJDb250ZXh0IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIFdlYkdMUmVuZGVyZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gICAgICAgICAgY29tcG9uZW50LndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgY29tcG9uZW50LmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkudmFsdWU7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyUGFzc2VzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICB2YXIgcGFzcyA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyUGFzcyk7XG4gICAgICAgIHZhciBzY2VuZSA9IHBhc3Muc2NlbmUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgICB0aGlzLnF1ZXJpZXMuYWN0aXZlQ2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhRW50aXR5ID0+IHtcbiAgICAgICAgICB2YXIgY2FtZXJhID0gY2FtZXJhRW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgICAgcmVuZGVyZXIucmVuZGVyKHNjZW5lLCBjYW1lcmEpO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgLy8gVW5pbml0aWFsaXplZCByZW5kZXJlcnNcbiAgICB0aGlzLnF1ZXJpZXMudW5pbml0aWFsaXplZFJlbmRlcmVycy5yZXN1bHRzLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuXG4gICAgICB2YXIgcmVuZGVyZXIgPSBuZXcgVEhSRUUuV2ViR0xSZW5kZXJlcih7XG4gICAgICAgIGFudGlhbGlhczogY29tcG9uZW50LmFudGlhbGlhc1xuICAgICAgfSk7XG5cbiAgICAgIGlmIChjb21wb25lbnQuYW5pbWF0aW9uTG9vcCkge1xuICAgICAgICByZW5kZXJlci5zZXRBbmltYXRpb25Mb29wKGNvbXBvbmVudC5hbmltYXRpb25Mb29wKTtcbiAgICAgIH1cblxuICAgICAgcmVuZGVyZXIuc2V0UGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyk7XG4gICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICByZW5kZXJlci5zZXRTaXplKHdpbmRvdy5pbm5lcldpZHRoLCB3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgICAgfVxuXG4gICAgICByZW5kZXJlci5nYW1tYUlucHV0ID0gY29tcG9uZW50LmdhbW1hSW5wdXQ7XG4gICAgICByZW5kZXJlci5nYW1tYU91dHB1dCA9IGNvbXBvbmVudC5nYW1tYU91dHB1dDtcbiAgICAgIHJlbmRlcmVyLnNoYWRvd01hcC5lbmFibGVkID0gY29tcG9uZW50LnNoYWRvd01hcDtcblxuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyZW5kZXJlci5kb21FbGVtZW50KTtcblxuICAgICAgaWYgKGNvbXBvbmVudC52ciB8fCBjb21wb25lbnQuYXIpIHtcbiAgICAgICAgcmVuZGVyZXIueHIuZW5hYmxlZCA9IHRydWU7XG5cbiAgICAgICAgaWYgKGNvbXBvbmVudC52cikge1xuICAgICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoVlJCdXR0b24uY3JlYXRlQnV0dG9uKHJlbmRlcmVyKSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29tcG9uZW50LmFyKSB7XG4gICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChBUkJ1dHRvbi5jcmVhdGVCdXR0b24ocmVuZGVyZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXJDb250ZXh0LCB7IHZhbHVlOiByZW5kZXJlciB9KTtcbiAgICB9KTtcblxuICAgIHRoaXMucXVlcmllcy5yZW5kZXJlcnMuY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgIHZhciByZW5kZXJlciA9IGVudGl0eS5nZXRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQpLnZhbHVlO1xuICAgICAgaWYgKFxuICAgICAgICBjb21wb25lbnQud2lkdGggIT09IHJlbmRlcmVyLndpZHRoIHx8XG4gICAgICAgIGNvbXBvbmVudC5oZWlnaHQgIT09IHJlbmRlcmVyLmhlaWdodFxuICAgICAgKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUoY29tcG9uZW50LndpZHRoLCBjb21wb25lbnQuaGVpZ2h0KTtcbiAgICAgICAgLy8gaW5uZXJXaWR0aC9pbm5lckhlaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbldlYkdMUmVuZGVyZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgdW5pbml0aWFsaXplZFJlbmRlcmVyczoge1xuICAgIGNvbXBvbmVudHM6IFtXZWJHTFJlbmRlcmVyLCBOb3QoV2ViR0xSZW5kZXJlckNvbnRleHQpXVxuICB9LFxuICByZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgV2ViR0xSZW5kZXJlckNvbnRleHRdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW1dlYkdMUmVuZGVyZXJdXG4gICAgfVxuICB9LFxuICByZW5kZXJQYXNzZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyUGFzc11cbiAgfSxcbiAgYWN0aXZlQ2FtZXJhczoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIEFjdGl2ZV0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBhZGRlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBUcmFuc2Zvcm0sIFBhcmVudCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBIaWVyYXJjaHlcbiAgICBsZXQgYWRkZWQgPSB0aGlzLnF1ZXJpZXMucGFyZW50LmFkZGVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBhZGRlZFtpXTtcbiAgICAgIHZhciBwYXJlbnRFbnRpdHkgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFBhcmVudCkudmFsdWU7XG4gICAgICBpZiAocGFyZW50RW50aXR5Lmhhc0NvbXBvbmVudChPYmplY3QzRCkpIHtcbiAgICAgICAgdmFyIHBhcmVudE9iamVjdDNEID0gcGFyZW50RW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgIHZhciBjaGlsZE9iamVjdDNEID0gZW50aXR5LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICAgIHBhcmVudE9iamVjdDNELmFkZChjaGlsZE9iamVjdDNEKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFuc2Zvcm1zXG4gICAgdmFyIHRyYW5zZm9ybXMgPSB0aGlzLnF1ZXJpZXMudHJhbnNmb3JtcztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyYW5zZm9ybXMuYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmFkZGVkW2ldO1xuICAgICAgbGV0IHRyYW5zZm9ybSA9IGVudGl0eS5nZXRDb21wb25lbnQoVHJhbnNmb3JtKTtcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcblxuICAgICAgb2JqZWN0LnBvc2l0aW9uLmNvcHkodHJhbnNmb3JtLnBvc2l0aW9uKTtcbiAgICAgIG9iamVjdC5yb3RhdGlvbi5zZXQoXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24ueSxcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnpcbiAgICAgICk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0cmFuc2Zvcm1zLmNoYW5nZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSB0cmFuc2Zvcm1zLmNoYW5nZWRbaV07XG4gICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgbGV0IG9iamVjdCA9IGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuXG4gICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLngsXG4gICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi55LFxuICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cblxuVHJhbnNmb3JtU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9LFxuICB0cmFuc2Zvcm1zOiB7XG4gICAgY29tcG9uZW50czogW09iamVjdDNELCBUcmFuc2Zvcm1dLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiBbVHJhbnNmb3JtXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSwgTm90IH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IENhbWVyYSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBDYW1lcmFTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFxuICAgICAgXCJyZXNpemVcIixcbiAgICAgICgpID0+IHtcbiAgICAgICAgdGhpcy5xdWVyaWVzLmNhbWVyYXMucmVzdWx0cy5mb3JFYWNoKGNhbWVyYSA9PiB7XG4gICAgICAgICAgbGV0IGNvbXBvbmVudCA9IGNhbWVyYS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgY2FtZXJhLmdldE11dGFibGVDb21wb25lbnQoQ2FtZXJhKS5hc3BlY3QgPVxuICAgICAgICAgICAgICB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5jaGFuZ2VkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNoYW5nZWRbaV07XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICBsZXQgY2FtZXJhM2QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIGlmIChjYW1lcmEzZC5hc3BlY3QgIT09IGNvbXBvbmVudC5hc3BlY3QpIHtcbiAgICAgICAgY2FtZXJhM2QuYXNwZWN0ID0gY29tcG9uZW50LmFzcGVjdDtcbiAgICAgICAgY2FtZXJhM2QudXBkYXRlUHJvamVjdGlvbk1hdHJpeCgpO1xuICAgICAgfVxuICAgICAgLy8gQHRvZG8gRG8gaXQgZm9yIHRoZSByZXN0IG9mIHRoZSB2YWx1ZXNcbiAgICB9XG5cbiAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhc1VuaW5pdGlhbGl6ZWQucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBsZXQgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChDYW1lcmEpO1xuXG4gICAgICBsZXQgY2FtZXJhID0gbmV3IFRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhKFxuICAgICAgICBjb21wb25lbnQuZm92LFxuICAgICAgICBjb21wb25lbnQuYXNwZWN0LFxuICAgICAgICBjb21wb25lbnQubmVhcixcbiAgICAgICAgY29tcG9uZW50LmZhclxuICAgICAgKTtcblxuICAgICAgY2FtZXJhLmxheWVycy5lbmFibGUoY29tcG9uZW50LmxheWVycyk7XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoT2JqZWN0M0QsIHsgdmFsdWU6IGNhbWVyYSB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5DYW1lcmFTeXN0ZW0ucXVlcmllcyA9IHtcbiAgY2FtZXJhc1VuaW5pdGlhbGl6ZWQ6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBOb3QoT2JqZWN0M0QpXVxuICB9LFxuICBjYW1lcmFzOiB7XG4gICAgY29tcG9uZW50czogW0NhbWVyYSwgT2JqZWN0M0RdLFxuICAgIGxpc3Rlbjoge1xuICAgICAgY2hhbmdlZDogW0NhbWVyYV1cbiAgICB9XG4gIH1cbn07XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcbmltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBUZXh0R2VvbWV0cnksIE9iamVjdDNEIH0gZnJvbSBcIi4uL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBUZXh0R2VvbWV0cnlTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBpbml0KCkge1xuICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICB2YXIgbG9hZGVyID0gbmV3IFRIUkVFLkZvbnRMb2FkZXIoKTtcbiAgICB0aGlzLmZvbnQgPSBudWxsO1xuICAgIGxvYWRlci5sb2FkKFwiL2Fzc2V0cy9mb250cy9oZWx2ZXRpa2VyX3JlZ3VsYXIudHlwZWZhY2UuanNvblwiLCBmb250ID0+IHtcbiAgICAgIHRoaXMuZm9udCA9IGZvbnQ7XG4gICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICB9KTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgaWYgKCF0aGlzLmZvbnQpIHJldHVybjtcblxuICAgIHZhciBjaGFuZ2VkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmNoYW5nZWQ7XG4gICAgY2hhbmdlZC5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgdGV4dENvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoVGV4dEdlb21ldHJ5KTtcbiAgICAgIHZhciBnZW9tZXRyeSA9IG5ldyBUSFJFRS5UZXh0R2VvbWV0cnkodGV4dENvbXBvbmVudC50ZXh0LCB7XG4gICAgICAgIGZvbnQ6IHRoaXMuZm9udCxcbiAgICAgICAgc2l6ZTogMSxcbiAgICAgICAgaGVpZ2h0OiAwLjEsXG4gICAgICAgIGN1cnZlU2VnbWVudHM6IDMsXG4gICAgICAgIGJldmVsRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYmV2ZWxUaGlja25lc3M6IDAuMDMsXG4gICAgICAgIGJldmVsU2l6ZTogMC4wMyxcbiAgICAgICAgYmV2ZWxPZmZzZXQ6IDAsXG4gICAgICAgIGJldmVsU2VnbWVudHM6IDNcbiAgICAgIH0pO1xuICAgICAgdmFyIG9iamVjdCA9IGVudGl0eS5nZXRNdXRhYmxlQ29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgIG9iamVjdC5nZW9tZXRyeSA9IGdlb21ldHJ5O1xuICAgIH0pO1xuXG4gICAgdmFyIGFkZGVkID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkO1xuICAgIGFkZGVkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG5cbiAgICAgIHZhciBjb2xvciA9IE1hdGgucmFuZG9tKCkgKiAweGZmZmZmZjtcbiAgICAgIGNvbG9yID0gMHhmZmZmZmY7XG4gICAgICB2YXIgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMFxuICAgICAgfSk7XG5cbiAgICAgIHZhciBtZXNoID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogbWVzaCB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5UZXh0R2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbVGV4dEdlb21ldHJ5XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogdHJ1ZVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIEVDU1kgZnJvbSBcImVjc3lcIjtcbmltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5pbXBvcnQgeyBUcmFuc2Zvcm1TeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1RyYW5zZm9ybVN5c3RlbS5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmltcG9ydCB7IE9iamVjdDNEIH0gZnJvbSBcIi4vY29tcG9uZW50cy9PYmplY3QzRC5qc1wiO1xuaW1wb3J0IHsgQ2FtZXJhUmlnIH0gZnJvbSBcIi4vY29tcG9uZW50cy9DYW1lcmFSaWcuanNcIjtcbmltcG9ydCB7IFBhcmVudCB9IGZyb20gXCIuL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQge1xuICBXZWJHTFJlbmRlcmVyLFxuICBTY2VuZSxcbiAgUmVuZGVyUGFzcyxcbiAgQ2FtZXJhXG59IGZyb20gXCIuL2NvbXBvbmVudHMvaW5kZXguanNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQod29ybGQpIHtcbiAgd29ybGRcbiAgICAucmVnaXN0ZXJTeXN0ZW0oVHJhbnNmb3JtU3lzdGVtKVxuICAgIC5yZWdpc3RlclN5c3RlbShDYW1lcmFTeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKFdlYkdMUmVuZGVyZXJTeXN0ZW0sIHsgcHJpb3JpdHk6IDEgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpbml0aWFsaXplRGVmYXVsdCh3b3JsZCA9IG5ldyBFQ1NZLldvcmxkKCksIG9wdGlvbnMpIHtcbiAgaW5pdCh3b3JsZCk7XG5cbiAgbGV0IGFuaW1hdGlvbkxvb3AgPSBvcHRpb25zLmFuaW1hdGlvbkxvb3A7XG4gIGlmICghYW5pbWF0aW9uTG9vcCkge1xuICAgIGNvbnN0IGNsb2NrID0gbmV3IFRIUkVFLkNsb2NrKCk7XG4gICAgYW5pbWF0aW9uTG9vcCA9ICgpID0+IHtcbiAgICAgIHdvcmxkLmV4ZWN1dGUoY2xvY2suZ2V0RGVsdGEoKSwgY2xvY2suZWxhcHNlZFRpbWUpO1xuICAgIH07XG4gIH1cblxuICBsZXQgc2NlbmUgPSB3b3JsZFxuICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgIC5hZGRDb21wb25lbnQoU2NlbmUpXG4gICAgLmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogbmV3IFRIUkVFLlNjZW5lKCkgfSk7XG5cbiAgbGV0IHJlbmRlcmVyID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFdlYkdMUmVuZGVyZXIsIHtcbiAgICBhcjogb3B0aW9ucy5hcixcbiAgICB2cjogb3B0aW9ucy52cixcbiAgICBhbmltYXRpb25Mb29wOiBhbmltYXRpb25Mb29wXG4gIH0pO1xuXG4gIC8vIGNhbWVyYSByaWcgJiBjb250cm9sbGVyc1xuICB2YXIgY2FtZXJhID0gbnVsbCxcbiAgICBjYW1lcmFSaWcgPSBudWxsO1xuXG4gIGlmIChvcHRpb25zLmFyIHx8IG9wdGlvbnMudnIpIHtcbiAgICBjYW1lcmFSaWcgPSB3b3JsZFxuICAgICAgLmNyZWF0ZUVudGl0eSgpXG4gICAgICAuYWRkQ29tcG9uZW50KENhbWVyYVJpZylcbiAgICAgIC5hZGRDb21wb25lbnQoUGFyZW50LCB7IHZhbHVlOiBzY2VuZSB9KTtcbiAgfSBlbHNlIHtcbiAgICBjYW1lcmEgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoQ2FtZXJhLCB7XG4gICAgICBmb3Y6IDkwLFxuICAgICAgYXNwZWN0OiB3aW5kb3cuaW5uZXJXaWR0aCAvIHdpbmRvdy5pbm5lckhlaWdodCxcbiAgICAgIG5lYXI6IDEsXG4gICAgICBmYXI6IDEwMDAsXG4gICAgICBsYXllcnM6IDEsXG4gICAgICBoYW5kbGVSZXNpemU6IHRydWVcbiAgICB9KTtcbiAgfVxuXG4gIGxldCByZW5kZXJQYXNzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlclBhc3MsIHtcbiAgICBzY2VuZTogc2NlbmUsXG4gICAgY2FtZXJhOiBjYW1lcmFcbiAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICB3b3JsZCxcbiAgICBlbnRpdGllczoge1xuICAgICAgc2NlbmUsXG4gICAgICBjYW1lcmEsXG4gICAgICBjYW1lcmFSaWcsXG4gICAgICByZW5kZXJlcixcbiAgICAgIHJlbmRlclBhc3NcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiVEhSRUUuVmVjdG9yMyIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoTGFtYmVydE1hdGVyaWFsIiwiVEhSRUUuTWVzaCIsIlRIUkVFLkdyb3VwIiwiVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwiLCJUSFJFRS5UZXh0dXJlIiwiVEhSRUUuSW1hZ2VMb2FkZXIiLCJUSFJFRS5XZWJHTFJlbmRlcmVyIiwiVEhSRUUuUGVyc3BlY3RpdmVDYW1lcmEiLCJUSFJFRS5Gb250TG9hZGVyIiwiVEhSRUUuVGV4dEdlb21ldHJ5IiwiVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwiLCJFQ1NZLldvcmxkIiwiVEhSRUUuQ2xvY2siLCJUSFJFRS5TY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQU8sTUFBTSxNQUFNLENBQUM7RUFDbEIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQ2Q7O0VBRUQsS0FBSyxHQUFHO0lBQ04sSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7R0FDcEI7Q0FDRjs7QUNSTSxNQUFN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

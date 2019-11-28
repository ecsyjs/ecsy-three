import { TagComponent, createComponentClass, System, Not, World } from 'ecsy';
import { Vector3, BoxBufferGeometry, IcosahedronBufferGeometry, TorusBufferGeometry, MeshStandardMaterial, Mesh, Group, MeshBasicMaterial, Texture, ImageLoader, WebGLRenderer as WebGLRenderer$1, PerspectiveCamera, FontLoader, TextGeometry as TextGeometry$1, Scene as Scene$1 } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { WEBVR } from 'three/examples/jsm/vr/WebVR.js';

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

class Dragging extends TagComponent {}

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
    this.position = new Vector3();
  }

  reset() {
    this.position.set(0, 0, 0);
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

const Camera = createComponentClass(
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

const WebGLRenderer = createComponentClass(
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
class GeometrySystem extends System {
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

      let color =
        component.primitive === "torus" ? 0x999900 : Math.random() * 0xffffff;

      let material = new MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.0,
        flatShading: true
      });

      let object = new Mesh(geometry, material);
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
var loader = new GLTFLoader().setPath("/assets/");

class GLTFLoaderSystem extends System {
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
    this.renderer = null;
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
    // Uninitialized renderers
    this.queries.uninitializedRenderers.results.forEach(entity => {
      var component = entity.getComponent(WebGLRenderer);

      var renderer = new WebGLRenderer$1({
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
          WEBVR.createButton(renderer, { referenceSpaceType: "local" })
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
    components: [WebGLRenderer, Not(WebGLRendererContext)]
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

class TransformSystem extends System {
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

      let camera = new PerspectiveCamera(
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

function initializeDefault(world = new World()) {
  init(world);

  let scene = world
    .createEntity()
    .addComponent(Object3D /* Scene */, { value: new Scene$1() });
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

export { Active, Camera, CameraRig, CameraSystem, Draggable, Dragging, GLTFLoaderSystem, GLTFModel, Geometry, GeometrySystem, Material, Object3D, Parent, Position, Rotation, Scene, Sky, SkyBox, SkyBoxSystem, TextGeometry, TextGeometrySystem, Transform, TransformSystem, VRController, VisibilitySystem, Visible, WebGLRendererSystem, init, initializeDefault };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWNzeS10aHJlZS5tb2R1bGUuanMiLCJzb3VyY2VzIjpbIi4uL3NyYy9jb21wb25lbnRzL1NjZW5lLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvUGFyZW50LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvU2t5Ym94LmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvT2JqZWN0M0QuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WaXNpYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvQ2FtZXJhUmlnLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dhYmxlLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvRHJhZ2dpbmcuanMiLCIuLi9zcmMvY29tcG9uZW50cy9BY3RpdmUuanMiLCIuLi9zcmMvY29tcG9uZW50cy9Qb3NpdGlvbi5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1JvdGF0aW9uLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvVHJhbnNmb3JtLmpzIiwiLi4vc3JjL2NvbXBvbmVudHMvR2VvbWV0cnkuanMiLCIuLi9zcmMvY29tcG9uZW50cy9HTFRGTW9kZWwuanMiLCIuLi9zcmMvY29tcG9uZW50cy9UZXh0R2VvbWV0cnkuanMiLCIuLi9zcmMvY29tcG9uZW50cy9WUkNvbnRyb2xsZXIuanMiLCIuLi9zcmMvY29tcG9uZW50cy9NYXRlcmlhbC5qcyIsIi4uL3NyYy9jb21wb25lbnRzL1NreS5qcyIsIi4uL3NyYy9jb21wb25lbnRzL2luZGV4LmpzIiwiLi4vc3JjL3N5c3RlbXMvR2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9HTFRGTG9hZGVyU3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvU2t5Qm94U3lzdGVtLmpzIiwiLi4vc3JjL3N5c3RlbXMvVmlzaWJpbGl0eVN5c3RlbS5qcyIsIi4uL3NyYy9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9DYW1lcmFTeXN0ZW0uanMiLCIuLi9zcmMvc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanMiLCIuLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIFNjZW5lIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5zY2VuZSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIFBhcmVudCB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBTa3lCb3gge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnRleHR1cmUgPSBcIlwiO1xuICAgIHRoaXMudHlwZSA9IFwiXCI7XG4gIH1cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy50ZXh0dXJlID0gXCJcIjtcbiAgICB0aGlzLnR5cGUgPSBcIlwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgT2JqZWN0M0Qge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgVmlzaWJsZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMudmFsdWUgPSBmYWxzZTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIENhbWVyYVJpZyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMubGVmdEhhbmQgPSBudWxsO1xuICAgIHRoaXMucmlnaHRIYW5kID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImV4cG9ydCBjbGFzcyBEcmFnZ2FibGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCB7IFRhZ0NvbXBvbmVudCB9IGZyb20gXCJlY3N5XCI7XG5leHBvcnQgY2xhc3MgRHJhZ2dpbmcgZXh0ZW5kcyBUYWdDb21wb25lbnQge31cbiIsImV4cG9ydCBjbGFzcyBBY3RpdmUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnZhbHVlID0gZmFsc2U7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuXG5leHBvcnQgY2xhc3MgUG9zaXRpb24ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMucG9zaXRpb24uc2V0KDAsIDAsIDApO1xuICB9XG59XG4iLCJpbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFJvdGF0aW9uIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5yb3RhdGlvbiA9IG5ldyBUSFJFRS5WZWN0b3IzKCk7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm0ge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnBvc2l0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgICB0aGlzLnJvdGF0aW9uID0gbmV3IFRIUkVFLlZlY3RvcjMoKTtcbiAgfVxuXG4gIGNvcHkoc3JjKSB7XG4gICAgdGhpcy5wb3NpdGlvbi5jb3B5KHNyYy5wb3NpdGlvbik7XG4gICAgdGhpcy5yb3RhdGlvbi5jb3B5KHNyYy5yb3RhdGlvbik7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnBvc2l0aW9uLnNldCgwLCAwLCAwKTtcbiAgICB0aGlzLnJvdGF0aW9uLnNldCgwLCAwLCAwKTtcbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEdlb21ldHJ5IHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5wcmltaXRpdmUgPSBcImJveFwiO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgR0xURk1vZGVsIHt9XG4iLCJleHBvcnQgY2xhc3MgVGV4dEdlb21ldHJ5IHtcbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIFZSQ29udHJvbGxlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaWQgPSAwO1xuICAgIHRoaXMuY29udHJvbGxlciA9IG51bGw7XG4gIH1cbiAgcmVzZXQoKSB7fVxufVxuIiwiZXhwb3J0IGNsYXNzIE1hdGVyaWFsIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb2xvciA9IDB4ZmYwMDAwO1xuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgU2t5IHtcbiAgY29uc3RydWN0b3IoKSB7fVxuICByZXNldCgpIHt9XG59XG4iLCJpbXBvcnQgeyBjcmVhdGVDb21wb25lbnRDbGFzcyB9IGZyb20gXCJlY3N5XCI7XG5cbmV4cG9ydCB7IFNjZW5lIH0gZnJvbSBcIi4vU2NlbmUuanNcIjtcbmV4cG9ydCB7IFBhcmVudCB9IGZyb20gXCIuL1BhcmVudC5qc1wiO1xuZXhwb3J0IHsgU2t5Qm94IH0gZnJvbSBcIi4vU2t5Ym94LmpzXCI7XG5leHBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuL09iamVjdDNELmpzXCI7XG5leHBvcnQgeyBWaXNpYmxlIH0gZnJvbSBcIi4vVmlzaWJsZS5qc1wiO1xuZXhwb3J0IHsgQ2FtZXJhUmlnIH0gZnJvbSBcIi4vQ2FtZXJhUmlnLmpzXCI7XG5leHBvcnQgeyBEcmFnZ2FibGUgfSBmcm9tIFwiLi9EcmFnZ2FibGUuanNcIjtcbmV4cG9ydCB7IERyYWdnaW5nIH0gZnJvbSBcIi4vRHJhZ2dpbmcuanNcIjtcbmV4cG9ydCB7IEFjdGl2ZSB9IGZyb20gXCIuL0FjdGl2ZS5qc1wiO1xuXG5leHBvcnQgeyBQb3NpdGlvbiB9IGZyb20gXCIuL1Bvc2l0aW9uLmpzXCI7XG5leHBvcnQgeyBSb3RhdGlvbiB9IGZyb20gXCIuL1JvdGF0aW9uLmpzXCI7XG5leHBvcnQgeyBUcmFuc2Zvcm0gfSBmcm9tIFwiLi9UcmFuc2Zvcm0uanNcIjtcblxuZXhwb3J0IHsgR2VvbWV0cnkgfSBmcm9tIFwiLi9HZW9tZXRyeS5qc1wiO1xuZXhwb3J0IHsgR0xURk1vZGVsIH0gZnJvbSBcIi4vR0xURk1vZGVsLmpzXCI7XG5leHBvcnQgeyBUZXh0R2VvbWV0cnkgfSBmcm9tIFwiLi9UZXh0R2VvbWV0cnkuanNcIjtcbmV4cG9ydCB7IFZSQ29udHJvbGxlciB9IGZyb20gXCIuL1ZSQ29udHJvbGxlci5qc1wiO1xuZXhwb3J0IHsgTWF0ZXJpYWwgfSBmcm9tIFwiLi9NYXRlcmlhbC5qc1wiO1xuZXhwb3J0IHsgU2t5IH0gZnJvbSBcIi4vU2t5LmpzXCI7XG5cbmV4cG9ydCBjb25zdCBDYW1lcmEgPSBjcmVhdGVDb21wb25lbnRDbGFzcyhcbiAge1xuICAgIGZvdjogeyBkZWZhdWx0OiA0NSB9LFxuICAgIGFzcGVjdDogeyBkZWZhdWx0OiAxIH0sXG4gICAgbmVhcjogeyBkZWZhdWx0OiAxIH0sXG4gICAgZmFyOiB7IGRlZmF1bHQ6IDEwMDAgfSxcbiAgICBsYXllcnM6IHsgZGVmYXVsdDogMCB9LFxuICAgIGhhbmRsZVJlc2l6ZTogeyBkZWZhdWx0OiB0cnVlIH1cbiAgfSxcbiAgXCJDYW1lcmFcIlxuKTtcblxuZXhwb3J0IGNvbnN0IFdlYkdMUmVuZGVyZXIgPSBjcmVhdGVDb21wb25lbnRDbGFzcyhcbiAge1xuICAgIHZyOiB7IGRlZmF1bHQ6IHRydWUgfSxcbiAgICBhbnRpYWxpYXM6IHsgZGVmYXVsdDogdHJ1ZSB9LFxuICAgIGhhbmRsZVJlc2l6ZTogeyBkZWZhdWx0OiB0cnVlIH1cbiAgfSxcbiAgXCJXZWJHTFJlbmRlcmVyXCJcbik7XG5cbmV4cG9ydCBjbGFzcyBSZW5kZXJhYmxlR3JvdXAge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lID0gbnVsbDtcbiAgICB0aGlzLmNhbWVyYSA9IG51bGw7XG4gIH1cbn1cbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7XG4gIEdlb21ldHJ5LFxuICBPYmplY3QzRCxcbiAgVHJhbnNmb3JtLFxuICAvLyAgRWxlbWVudCxcbiAgLy8gIERyYWdnYWJsZSxcbiAgUGFyZW50XG59IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbi8qKlxuICogQ3JlYXRlIGEgTWVzaCBiYXNlZCBvbiB0aGUgW0dlb21ldHJ5XSBjb21wb25lbnQgYW5kIGF0dGFjaCBpdCB0byB0aGUgZW50aXR5IHVzaW5nIGEgW09iamVjdDNEXSBjb21wb25lbnRcbiAqL1xuZXhwb3J0IGNsYXNzIEdlb21ldHJ5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBSZW1vdmVkXG4gICAgdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlbW92ZWQuZm9yRWFjaCgoLyplbnRpdHkqLykgPT4ge1xuICAgICAgLypcbiAgICAgIGxldCBvYmplY3QgPSBlbnRpdHkuZ2V0UmVtb3ZlZENvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG4gICAgICBsZXQgcGFyZW50ID0gZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQsIHRydWUpLnZhbHVlO1xuICAgICAgcGFyZW50LmdldENvbXBvbmVudChPYmplY3QzRCkudmFsdWUucmVtb3ZlKG9iamVjdCk7XG4gICAgICAqL1xuICAgIH0pO1xuXG4gICAgLy8gQWRkZWRcbiAgICB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoR2VvbWV0cnkpO1xuXG4gICAgICBsZXQgZ2VvbWV0cnk7XG4gICAgICBzd2l0Y2ggKGNvbXBvbmVudC5wcmltaXRpdmUpIHtcbiAgICAgICAgY2FzZSBcInRvcnVzXCI6XG4gICAgICAgICAge1xuICAgICAgICAgICAgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVG9ydXNCdWZmZXJHZW9tZXRyeShcbiAgICAgICAgICAgICAgY29tcG9uZW50LnJhZGl1cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YmUsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5yYWRpYWxTZWdtZW50cyxcbiAgICAgICAgICAgICAgY29tcG9uZW50LnR1YnVsYXJTZWdtZW50c1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzcGhlcmVcIjpcbiAgICAgICAgICB7XG4gICAgICAgICAgICBnZW9tZXRyeSA9IG5ldyBUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5KGNvbXBvbmVudC5yYWRpdXMsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImJveFwiOlxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGdlb21ldHJ5ID0gbmV3IFRIUkVFLkJveEJ1ZmZlckdlb21ldHJ5KFxuICAgICAgICAgICAgICBjb21wb25lbnQud2lkdGgsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5oZWlnaHQsXG4gICAgICAgICAgICAgIGNvbXBvbmVudC5kZXB0aFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG5cbiAgICAgIGxldCBjb2xvciA9XG4gICAgICAgIGNvbXBvbmVudC5wcmltaXRpdmUgPT09IFwidG9ydXNcIiA/IDB4OTk5OTAwIDogTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuXG4gICAgICBsZXQgbWF0ZXJpYWwgPSBuZXcgVEhSRUUuTWVzaFN0YW5kYXJkTWF0ZXJpYWwoe1xuICAgICAgICBjb2xvcjogY29sb3IsXG4gICAgICAgIHJvdWdobmVzczogMC43LFxuICAgICAgICBtZXRhbG5lc3M6IDAuMCxcbiAgICAgICAgZmxhdFNoYWRpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgb2JqZWN0ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsKTtcbiAgICAgIG9iamVjdC5jYXN0U2hhZG93ID0gdHJ1ZTtcbiAgICAgIG9iamVjdC5yZWNlaXZlU2hhZG93ID0gdHJ1ZTtcblxuICAgICAgaWYgKGVudGl0eS5oYXNDb21wb25lbnQoVHJhbnNmb3JtKSkge1xuICAgICAgICBsZXQgdHJhbnNmb3JtID0gZW50aXR5LmdldENvbXBvbmVudChUcmFuc2Zvcm0pO1xuICAgICAgICBvYmplY3QucG9zaXRpb24uY29weSh0cmFuc2Zvcm0ucG9zaXRpb24pO1xuICAgICAgICBpZiAodHJhbnNmb3JtLnJvdGF0aW9uKSB7XG4gICAgICAgICAgb2JqZWN0LnJvdGF0aW9uLnNldChcbiAgICAgICAgICAgIHRyYW5zZm9ybS5yb3RhdGlvbi54LFxuICAgICAgICAgICAgdHJhbnNmb3JtLnJvdGF0aW9uLnksXG4gICAgICAgICAgICB0cmFuc2Zvcm0ucm90YXRpb24uelxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChFbGVtZW50KSAmJiAhZW50aXR5Lmhhc0NvbXBvbmVudChEcmFnZ2FibGUpKSB7XG4gICAgICAvLyAgICAgICAgb2JqZWN0Lm1hdGVyaWFsLmNvbG9yLnNldCgweDMzMzMzMyk7XG4gICAgICAvLyAgICAgIH1cblxuICAgICAgZW50aXR5LmFkZENvbXBvbmVudChPYmplY3QzRCwgeyB2YWx1ZTogb2JqZWN0IH0pO1xuXG4gICAgICAvLyBAdG9kbyBSZW1vdmUgaXQhIGhpZXJhcmNoeSBzeXN0ZW0gd2lsbCB0YWtlIGNhcmUgb2YgaXRcbiAgICAgIGlmIChlbnRpdHkuaGFzQ29tcG9uZW50KFBhcmVudCkpIHtcbiAgICAgICAgZW50aXR5XG4gICAgICAgICAgLmdldENvbXBvbmVudChQYXJlbnQpXG4gICAgICAgICAgLnZhbHVlLmdldENvbXBvbmVudChPYmplY3QzRClcbiAgICAgICAgICAudmFsdWUuYWRkKG9iamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cblxuR2VvbWV0cnlTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR2VvbWV0cnldLCAvLyBAdG9kbyBUcmFuc2Zvcm06IEFzIG9wdGlvbmFsLCBob3cgdG8gZGVmaW5lIGl0P1xuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICByZW1vdmVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgR0xURkxvYWRlciB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vbG9hZGVycy9HTFRGTG9hZGVyLmpzXCI7XG5pbXBvcnQgeyBTeXN0ZW0gfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgUGFyZW50IH0gZnJvbSBcIi4uL2NvbXBvbmVudHMvUGFyZW50LmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL09iamVjdDNELmpzXCI7XG5pbXBvcnQgeyBHTFRGTW9kZWwgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9HTFRGTW9kZWwuanNcIjtcblxuLy8gQHRvZG8gVXNlIHBhcmFtZXRlciBhbmQgbG9hZGVyIG1hbmFnZXJcbnZhciBsb2FkZXIgPSBuZXcgR0xURkxvYWRlcigpLnNldFBhdGgoXCIvYXNzZXRzL1wiKTtcblxuZXhwb3J0IGNsYXNzIEdMVEZMb2FkZXJTeXN0ZW0gZXh0ZW5kcyBTeXN0ZW0ge1xuICBleGVjdXRlKCkge1xuICAgIHZhciBlbnRpdGllcyA9IHRoaXMucXVlcmllcy5lbnRpdGllcy5hZGRlZDtcblxuICAgIC8vUXVlcmllc1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZW50aXRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBlbnRpdGllc1tpXTtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KEdMVEZNb2RlbCk7XG5cbiAgICAgIGxvYWRlci5sb2FkKGNvbXBvbmVudC51cmwsIGdsdGYgPT4ge1xuICAgICAgICAvKlxuICAgICAgICBnbHRmLnNjZW5lLnRyYXZlcnNlKGZ1bmN0aW9uKGNoaWxkKSB7XG4gICAgICAgICAgaWYgKGNoaWxkLmlzTWVzaCkge1xuICAgICAgICAgICAgY2hpbGQubWF0ZXJpYWwuZW52TWFwID0gZW52TWFwO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4qL1xuICAgICAgICAvLyBAdG9kbyBSZW1vdmUsIGhpZXJhcmNoeSB3aWxsIHRha2UgY2FyZSBvZiBpdFxuICAgICAgICBpZiAoZW50aXR5Lmhhc0NvbXBvbmVudChQYXJlbnQpKSB7XG4gICAgICAgICAgZW50aXR5LmdldENvbXBvbmVudChQYXJlbnQpLnZhbHVlLmFkZChnbHRmLnNjZW5lKTtcbiAgICAgICAgfVxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBnbHRmLnNjZW5lIH0pO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG5cbkdMVEZMb2FkZXJTeXN0ZW0ucXVlcmllcyA9IHtcbiAgZW50aXRpZXM6IHtcbiAgICBjb21wb25lbnRzOiBbR0xURk1vZGVsXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgU2t5Qm94LCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIFNreUJveFN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGVudGl0aWVzID0gdGhpcy5xdWVyaWVzLmVudGl0aWVzLnJlc3VsdHM7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlbnRpdGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGVudGl0aWVzW2ldO1xuXG4gICAgICBsZXQgc2t5Ym94ID0gZW50aXR5LmdldENvbXBvbmVudChTa3lCb3gpO1xuXG4gICAgICBsZXQgZ3JvdXAgPSBuZXcgVEhSRUUuR3JvdXAoKTtcbiAgICAgIGxldCBnZW9tZXRyeSA9IG5ldyBUSFJFRS5Cb3hCdWZmZXJHZW9tZXRyeSgxMDAsIDEwMCwgMTAwKTtcbiAgICAgIGdlb21ldHJ5LnNjYWxlKDEsIDEsIC0xKTtcblxuICAgICAgaWYgKHNreWJveC50eXBlID09PSBcImN1YmVtYXAtc3RlcmVvXCIpIHtcbiAgICAgICAgbGV0IHRleHR1cmVzID0gZ2V0VGV4dHVyZXNGcm9tQXRsYXNGaWxlKHNreWJveC50ZXh0dXJlVXJsLCAxMik7XG5cbiAgICAgICAgbGV0IG1hdGVyaWFscyA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgNjsgaisrKSB7XG4gICAgICAgICAgbWF0ZXJpYWxzLnB1c2gobmV3IFRIUkVFLk1lc2hCYXNpY01hdGVyaWFsKHsgbWFwOiB0ZXh0dXJlc1tqXSB9KSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2t5Qm94ID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFscyk7XG4gICAgICAgIHNreUJveC5sYXllcnMuc2V0KDEpO1xuICAgICAgICBncm91cC5hZGQoc2t5Qm94KTtcblxuICAgICAgICBsZXQgbWF0ZXJpYWxzUiA9IFtdO1xuXG4gICAgICAgIGZvciAobGV0IGogPSA2OyBqIDwgMTI7IGorKykge1xuICAgICAgICAgIG1hdGVyaWFsc1IucHVzaChuZXcgVEhSRUUuTWVzaEJhc2ljTWF0ZXJpYWwoeyBtYXA6IHRleHR1cmVzW2pdIH0pKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBza3lCb3hSID0gbmV3IFRIUkVFLk1lc2goZ2VvbWV0cnksIG1hdGVyaWFsc1IpO1xuICAgICAgICBza3lCb3hSLmxheWVycy5zZXQoMik7XG4gICAgICAgIGdyb3VwLmFkZChza3lCb3hSKTtcblxuICAgICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBncm91cCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihcIlVua25vd24gc2t5Ym94IHR5cGU6IFwiLCBza3lib3gudHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGdldFRleHR1cmVzRnJvbUF0bGFzRmlsZShhdGxhc0ltZ1VybCwgdGlsZXNOdW0pIHtcbiAgbGV0IHRleHR1cmVzID0gW107XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aWxlc051bTsgaSsrKSB7XG4gICAgdGV4dHVyZXNbaV0gPSBuZXcgVEhSRUUuVGV4dHVyZSgpO1xuICB9XG5cbiAgbGV0IGxvYWRlciA9IG5ldyBUSFJFRS5JbWFnZUxvYWRlcigpO1xuICBsb2FkZXIubG9hZChhdGxhc0ltZ1VybCwgZnVuY3Rpb24oaW1hZ2VPYmopIHtcbiAgICBsZXQgY2FudmFzLCBjb250ZXh0O1xuICAgIGxldCB0aWxlV2lkdGggPSBpbWFnZU9iai5oZWlnaHQ7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRleHR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuICAgICAgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdGlsZVdpZHRoO1xuICAgICAgY2FudmFzLndpZHRoID0gdGlsZVdpZHRoO1xuICAgICAgY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIGltYWdlT2JqLFxuICAgICAgICB0aWxlV2lkdGggKiBpLFxuICAgICAgICAwLFxuICAgICAgICB0aWxlV2lkdGgsXG4gICAgICAgIHRpbGVXaWR0aCxcbiAgICAgICAgMCxcbiAgICAgICAgMCxcbiAgICAgICAgdGlsZVdpZHRoLFxuICAgICAgICB0aWxlV2lkdGhcbiAgICAgICk7XG4gICAgICB0ZXh0dXJlc1tpXS5pbWFnZSA9IGNhbnZhcztcbiAgICAgIHRleHR1cmVzW2ldLm5lZWRzVXBkYXRlID0gdHJ1ZTtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB0ZXh0dXJlcztcbn1cblxuU2t5Qm94U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1NreUJveCwgTm90KE9iamVjdDNEKV1cbiAgfVxufTtcbiIsImltcG9ydCB7IFN5c3RlbSB9IGZyb20gXCJlY3N5XCI7XG5pbXBvcnQgeyBWaXNpYmxlLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbmV4cG9ydCBjbGFzcyBWaXNpYmlsaXR5U3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgcHJvY2Vzc1Zpc2liaWxpdHkoZW50aXRpZXMpIHtcbiAgICBlbnRpdGllcy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWUudmlzaWJsZSA9IGVudGl0eS5nZXRDb21wb25lbnQoXG4gICAgICAgIFZpc2libGVcbiAgICAgICkudmFsdWU7XG4gICAgfSk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIHRoaXMucHJvY2Vzc1Zpc2liaWxpdHkodGhpcy5xdWVyaWVzLmVudGl0aWVzLmFkZGVkKTtcbiAgICB0aGlzLnByb2Nlc3NWaXNpYmlsaXR5KHRoaXMucXVlcmllcy5lbnRpdGllcy5jaGFuZ2VkKTtcbiAgfVxufVxuXG5WaXNpYmlsaXR5U3lzdGVtLnF1ZXJpZXMgPSB7XG4gIGVudGl0aWVzOiB7XG4gICAgY29tcG9uZW50czogW1Zpc2libGUsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlLFxuICAgICAgY2hhbmdlZDogW1Zpc2libGVdXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHtcbiAgUmVuZGVyYWJsZUdyb3VwLFxuICBXZWJHTFJlbmRlcmVyLFxuICBPYmplY3QzRFxufSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5pbXBvcnQgeyBXRUJWUiB9IGZyb20gXCJ0aHJlZS9leGFtcGxlcy9qc20vdnIvV2ViVlIuanNcIjtcblxuY2xhc3MgV2ViR0xSZW5kZXJlckNvbnRleHQge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLnJlbmRlcmVyID0gbnVsbDtcbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2ViR0xSZW5kZXJlclN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyZXJzLnJlc3VsdHMuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcbiAgICAgICAgICBjb21wb25lbnQud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICBjb21wb25lbnQuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH1cblxuICBleGVjdXRlKCkge1xuICAgIC8vIFVuaW5pdGlhbGl6ZWQgcmVuZGVyZXJzXG4gICAgdGhpcy5xdWVyaWVzLnVuaW5pdGlhbGl6ZWRSZW5kZXJlcnMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICB2YXIgY29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyKTtcblxuICAgICAgdmFyIHJlbmRlcmVyID0gbmV3IFRIUkVFLldlYkdMUmVuZGVyZXIoe1xuICAgICAgICBhbnRpYWxpYXM6IGNvbXBvbmVudC5hbnRpYWxpYXNcbiAgICAgIH0pO1xuXG4gICAgICByZW5kZXJlci5zZXRQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgIHJlbmRlcmVyLnNldFNpemUod2luZG93LmlubmVyV2lkdGgsIHdpbmRvdy5pbm5lckhlaWdodCk7XG4gICAgICB9XG5cbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQocmVuZGVyZXIuZG9tRWxlbWVudCk7XG5cbiAgICAgIGlmIChjb21wb25lbnQudnIpIHtcbiAgICAgICAgcmVuZGVyZXIudnIuZW5hYmxlZCA9IHRydWU7XG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoXG4gICAgICAgICAgV0VCVlIuY3JlYXRlQnV0dG9uKHJlbmRlcmVyLCB7IHJlZmVyZW5jZVNwYWNlVHlwZTogXCJsb2NhbFwiIH0pXG4gICAgICAgICk7XG4gICAgICB9XG5cbiAgICAgIGVudGl0eS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlckNvbnRleHQsIHsgcmVuZGVyZXI6IHJlbmRlcmVyIH0pO1xuICAgIH0pO1xuXG4gICAgdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5jaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFdlYkdMUmVuZGVyZXIpO1xuICAgICAgdmFyIHJlbmRlcmVyID0gZW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkucmVuZGVyZXI7XG4gICAgICBpZiAoXG4gICAgICAgIGNvbXBvbmVudC53aWR0aCAhPT0gcmVuZGVyZXIud2lkdGggfHxcbiAgICAgICAgY29tcG9uZW50LmhlaWdodCAhPT0gcmVuZGVyZXIuaGVpZ2h0XG4gICAgICApIHtcbiAgICAgICAgcmVuZGVyZXIuc2V0U2l6ZShjb21wb25lbnQud2lkdGgsIGNvbXBvbmVudC5oZWlnaHQpO1xuICAgICAgICAvLyBpbm5lcldpZHRoL2lubmVySGVpZ2h0XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBsZXQgcmVuZGVyZXJzID0gdGhpcy5xdWVyaWVzLnJlbmRlcmVycy5yZXN1bHRzO1xuICAgIHJlbmRlcmVycy5mb3JFYWNoKHJlbmRlcmVyRW50aXR5ID0+IHtcbiAgICAgIHZhciByZW5kZXJlciA9IHJlbmRlcmVyRW50aXR5LmdldENvbXBvbmVudChXZWJHTFJlbmRlcmVyQ29udGV4dCkucmVuZGVyZXI7XG4gICAgICB0aGlzLnF1ZXJpZXMucmVuZGVyYWJsZXMucmVzdWx0cy5mb3JFYWNoKGVudGl0eSA9PiB7XG4gICAgICAgIHZhciBncm91cCA9IGVudGl0eS5nZXRDb21wb25lbnQoUmVuZGVyYWJsZUdyb3VwKTtcbiAgICAgICAgdmFyIHNjZW5lID0gZ3JvdXAuc2NlbmUuZ2V0Q29tcG9uZW50KE9iamVjdDNEKS52YWx1ZTtcbiAgICAgICAgdmFyIGNhbWVyYSA9IGdyb3VwLmNhbWVyYS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgICByZW5kZXJlci5yZW5kZXIoc2NlbmUsIGNhbWVyYSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5XZWJHTFJlbmRlcmVyU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHVuaW5pdGlhbGl6ZWRSZW5kZXJlcnM6IHtcbiAgICBjb21wb25lbnRzOiBbV2ViR0xSZW5kZXJlciwgTm90KFdlYkdMUmVuZGVyZXJDb250ZXh0KV1cbiAgfSxcbiAgcmVuZGVyZXJzOiB7XG4gICAgY29tcG9uZW50czogW1dlYkdMUmVuZGVyZXIsIFdlYkdMUmVuZGVyZXJDb250ZXh0XSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGNoYW5nZWQ6IFtXZWJHTFJlbmRlcmVyXVxuICAgIH1cbiAgfSxcbiAgcmVuZGVyYWJsZXM6IHtcbiAgICBjb21wb25lbnRzOiBbUmVuZGVyYWJsZUdyb3VwXVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFBhcmVudCwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNmb3JtU3lzdGVtIGV4dGVuZHMgU3lzdGVtIHtcbiAgZXhlY3V0ZSgpIHtcbiAgICAvLyBIaWVyYXJjaHlcbiAgICBsZXQgYWRkZWQgPSB0aGlzLnF1ZXJpZXMucGFyZW50LmFkZGVkO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWRkZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBlbnRpdHkgPSBhZGRlZFtpXTtcbiAgICAgIGNvbnNvbGUubG9nKFwiQWRkaW5nXCIsIGkpO1xuICAgICAgdmFyIHBhcmVudEVudGl0eSA9IGVudGl0eS5nZXRDb21wb25lbnQoUGFyZW50KS52YWx1ZTtcbiAgICAgIHBhcmVudEVudGl0eVxuICAgICAgICAuZ2V0Q29tcG9uZW50KE9iamVjdDNEKVxuICAgICAgICAudmFsdWUuYWRkKGVudGl0eS5nZXRDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlKTtcbiAgICB9XG4gIH1cbn1cblxuVHJhbnNmb3JtU3lzdGVtLnF1ZXJpZXMgPSB7XG4gIHBhcmVudDoge1xuICAgIGNvbXBvbmVudHM6IFtQYXJlbnQsIE9iamVjdDNEXSxcbiAgICBsaXN0ZW46IHtcbiAgICAgIGFkZGVkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0IHsgU3lzdGVtLCBOb3QgfSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0IHsgQ2FtZXJhLCBPYmplY3QzRCB9IGZyb20gXCIuLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5pbXBvcnQgKiBhcyBUSFJFRSBmcm9tIFwidGhyZWVcIjtcblxuZXhwb3J0IGNsYXNzIENhbWVyYVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgICBcInJlc2l6ZVwiLFxuICAgICAgKCkgPT4ge1xuICAgICAgICB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5yZXN1bHRzLmZvckVhY2goY2FtZXJhID0+IHtcbiAgICAgICAgICBsZXQgY29tcG9uZW50ID0gY2FtZXJhLmdldENvbXBvbmVudChDYW1lcmEpO1xuICAgICAgICAgIGlmIChjb21wb25lbnQuaGFuZGxlUmVzaXplKSB7XG4gICAgICAgICAgICBjYW1lcmEuZ2V0TXV0YWJsZUNvbXBvbmVudChDYW1lcmEpLmFzcGVjdCA9XG4gICAgICAgICAgICAgIHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJBc3BlY3QgdXBkYXRlZFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhbHNlXG4gICAgKTtcbiAgfVxuXG4gIGV4ZWN1dGUoKSB7XG4gICAgbGV0IGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuY2FtZXJhcy5jaGFuZ2VkO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2hhbmdlZC5sZW5ndGg7IGkrKykge1xuICAgICAgbGV0IGVudGl0eSA9IGNoYW5nZWRbaV07XG5cbiAgICAgIGxldCBjb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KENhbWVyYSk7XG4gICAgICBsZXQgY2FtZXJhM2QgPSBlbnRpdHkuZ2V0TXV0YWJsZUNvbXBvbmVudChPYmplY3QzRCkudmFsdWU7XG5cbiAgICAgIGlmIChjYW1lcmEzZC5hc3BlY3QgIT09IGNvbXBvbmVudC5hc3BlY3QpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJDYW1lcmEgVXBkYXRlZFwiKTtcblxuICAgICAgICBjYW1lcmEzZC5hc3BlY3QgPSBjb21wb25lbnQuYXNwZWN0O1xuICAgICAgICBjYW1lcmEzZC51cGRhdGVQcm9qZWN0aW9uTWF0cml4KCk7XG4gICAgICB9XG4gICAgICAvLyBAdG9kbyBEbyBpdCBmb3IgdGhlIHJlc3Qgb2YgdGhlIHZhbHVlc1xuICAgIH1cblxuICAgIGxldCBjYW1lcmFzVW5pbml0aWFsaXplZCA9IHRoaXMucXVlcmllcy5jYW1lcmFzVW5pbml0aWFsaXplZC5yZXN1bHRzO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FtZXJhc1VuaW5pdGlhbGl6ZWQubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBlbnRpdHkgPSBjYW1lcmFzVW5pbml0aWFsaXplZFtpXTtcblxuICAgICAgbGV0IGNvbXBvbmVudCA9IGVudGl0eS5nZXRDb21wb25lbnQoQ2FtZXJhKTtcblxuICAgICAgbGV0IGNhbWVyYSA9IG5ldyBUSFJFRS5QZXJzcGVjdGl2ZUNhbWVyYShcbiAgICAgICAgY29tcG9uZW50LmZvdixcbiAgICAgICAgY29tcG9uZW50LmFzcGVjdCxcbiAgICAgICAgY29tcG9uZW50Lm5lYXIsXG4gICAgICAgIGNvbXBvbmVudC5mYXJcbiAgICAgICk7XG5cbiAgICAgIGNhbWVyYS5sYXllcnMuZW5hYmxlKGNvbXBvbmVudC5sYXllcnMpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBjYW1lcmEgfSk7XG4gICAgfVxuICB9XG59XG5cbkNhbWVyYVN5c3RlbS5xdWVyaWVzID0ge1xuICBjYW1lcmFzVW5pbml0aWFsaXplZDoge1xuICAgIGNvbXBvbmVudHM6IFtDYW1lcmEsIE5vdChPYmplY3QzRCldXG4gIH0sXG4gIGNhbWVyYXM6IHtcbiAgICBjb21wb25lbnRzOiBbQ2FtZXJhLCBPYmplY3QzRF0sXG4gICAgbGlzdGVuOiB7XG4gICAgICBjaGFuZ2VkOiBbQ2FtZXJhXVxuICAgIH1cbiAgfVxufTtcbiIsImltcG9ydCAqIGFzIFRIUkVFIGZyb20gXCJ0aHJlZVwiO1xuaW1wb3J0IHsgU3lzdGVtIH0gZnJvbSBcImVjc3lcIjtcbmltcG9ydCB7IFRleHRHZW9tZXRyeSwgT2JqZWN0M0QgfSBmcm9tIFwiLi4vaW5kZXguanNcIjtcblxuZXhwb3J0IGNsYXNzIFRleHRHZW9tZXRyeVN5c3RlbSBleHRlbmRzIFN5c3RlbSB7XG4gIGluaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXplZCA9IGZhbHNlO1xuICAgIHZhciBsb2FkZXIgPSBuZXcgVEhSRUUuRm9udExvYWRlcigpO1xuICAgIHRoaXMuZm9udCA9IG51bGw7XG4gICAgbG9hZGVyLmxvYWQoXCIvYXNzZXRzL2ZvbnRzL2hlbHZldGlrZXJfcmVndWxhci50eXBlZmFjZS5qc29uXCIsIGZvbnQgPT4ge1xuICAgICAgdGhpcy5mb250ID0gZm9udDtcbiAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgZXhlY3V0ZSgpIHtcbiAgICBpZiAoIXRoaXMuZm9udCkgcmV0dXJuO1xuXG4gICAgdmFyIGNoYW5nZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuY2hhbmdlZDtcbiAgICBjaGFuZ2VkLmZvckVhY2goZW50aXR5ID0+IHtcbiAgICAgIHZhciB0ZXh0Q29tcG9uZW50ID0gZW50aXR5LmdldENvbXBvbmVudChUZXh0R2VvbWV0cnkpO1xuICAgICAgdmFyIGdlb21ldHJ5ID0gbmV3IFRIUkVFLlRleHRHZW9tZXRyeSh0ZXh0Q29tcG9uZW50LnRleHQsIHtcbiAgICAgICAgZm9udDogdGhpcy5mb250LFxuICAgICAgICBzaXplOiAxLFxuICAgICAgICBoZWlnaHQ6IDAuMSxcbiAgICAgICAgY3VydmVTZWdtZW50czogMyxcbiAgICAgICAgYmV2ZWxFbmFibGVkOiB0cnVlLFxuICAgICAgICBiZXZlbFRoaWNrbmVzczogMC4wMyxcbiAgICAgICAgYmV2ZWxTaXplOiAwLjAzLFxuICAgICAgICBiZXZlbE9mZnNldDogMCxcbiAgICAgICAgYmV2ZWxTZWdtZW50czogM1xuICAgICAgfSk7XG4gICAgICB2YXIgb2JqZWN0ID0gZW50aXR5LmdldE11dGFibGVDb21wb25lbnQoT2JqZWN0M0QpLnZhbHVlO1xuICAgICAgb2JqZWN0Lmdlb21ldHJ5ID0gZ2VvbWV0cnk7XG4gICAgfSk7XG5cbiAgICB2YXIgYWRkZWQgPSB0aGlzLnF1ZXJpZXMuZW50aXRpZXMuYWRkZWQ7XG4gICAgYWRkZWQuZm9yRWFjaChlbnRpdHkgPT4ge1xuICAgICAgdmFyIHRleHRDb21wb25lbnQgPSBlbnRpdHkuZ2V0Q29tcG9uZW50KFRleHRHZW9tZXRyeSk7XG4gICAgICB2YXIgZ2VvbWV0cnkgPSBuZXcgVEhSRUUuVGV4dEdlb21ldHJ5KHRleHRDb21wb25lbnQudGV4dCwge1xuICAgICAgICBmb250OiB0aGlzLmZvbnQsXG4gICAgICAgIHNpemU6IDEsXG4gICAgICAgIGhlaWdodDogMC4xLFxuICAgICAgICBjdXJ2ZVNlZ21lbnRzOiAzLFxuICAgICAgICBiZXZlbEVuYWJsZWQ6IHRydWUsXG4gICAgICAgIGJldmVsVGhpY2tuZXNzOiAwLjAzLFxuICAgICAgICBiZXZlbFNpemU6IDAuMDMsXG4gICAgICAgIGJldmVsT2Zmc2V0OiAwLFxuICAgICAgICBiZXZlbFNlZ21lbnRzOiAzXG4gICAgICB9KTtcblxuICAgICAgdmFyIGNvbG9yID0gTWF0aC5yYW5kb20oKSAqIDB4ZmZmZmZmO1xuICAgICAgY29sb3IgPSAweGZmZmZmZjtcbiAgICAgIHZhciBtYXRlcmlhbCA9IG5ldyBUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCh7XG4gICAgICAgIGNvbG9yOiBjb2xvcixcbiAgICAgICAgcm91Z2huZXNzOiAwLjcsXG4gICAgICAgIG1ldGFsbmVzczogMC4wXG4gICAgICB9KTtcblxuICAgICAgdmFyIG1lc2ggPSBuZXcgVEhSRUUuTWVzaChnZW9tZXRyeSwgbWF0ZXJpYWwpO1xuXG4gICAgICBlbnRpdHkuYWRkQ29tcG9uZW50KE9iamVjdDNELCB7IHZhbHVlOiBtZXNoIH0pO1xuICAgIH0pO1xuICB9XG59XG5cblRleHRHZW9tZXRyeVN5c3RlbS5xdWVyaWVzID0ge1xuICBlbnRpdGllczoge1xuICAgIGNvbXBvbmVudHM6IFtUZXh0R2VvbWV0cnldLFxuICAgIGxpc3Rlbjoge1xuICAgICAgYWRkZWQ6IHRydWUsXG4gICAgICBjaGFuZ2VkOiB0cnVlXG4gICAgfVxuICB9XG59O1xuIiwiaW1wb3J0ICogYXMgRUNTWSBmcm9tIFwiZWNzeVwiO1xuaW1wb3J0ICogYXMgVEhSRUUgZnJvbSBcInRocmVlXCI7XG5cbi8vIGNvbXBvbmVudHNcbmV4cG9ydCB7XG4gIEFjdGl2ZSxcbiAgQ2FtZXJhLFxuICBDYW1lcmFSaWcsXG4gIERyYWdnYWJsZSxcbiAgRHJhZ2dpbmcsXG4gIEdlb21ldHJ5LFxuICBHTFRGTW9kZWwsXG4gIE1hdGVyaWFsLFxuICBPYmplY3QzRCxcbiAgUGFyZW50LFxuICBQb3NpdGlvbixcbiAgUm90YXRpb24sXG4gIFNjZW5lLFxuICBTa3ksXG4gIFNreUJveCxcbiAgVGV4dEdlb21ldHJ5LFxuICBUcmFuc2Zvcm0sXG4gIFZpc2libGUsXG4gIFZSQ29udHJvbGxlclxufSBmcm9tIFwiLi9jb21wb25lbnRzL2luZGV4LmpzXCI7XG5cbi8vIHN5c3RlbXNcbmV4cG9ydCB7IEdlb21ldHJ5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9HZW9tZXRyeVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgR0xURkxvYWRlclN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvR0xURkxvYWRlclN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgU2t5Qm94U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9Ta3lCb3hTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFZpc2liaWxpdHlTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1Zpc2liaWxpdHlTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFdlYkdMUmVuZGVyZXJTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL1dlYkdMUmVuZGVyZXJTeXN0ZW0uanNcIjtcbmV4cG9ydCB7IFRyYW5zZm9ybVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvVHJhbnNmb3JtU3lzdGVtLmpzXCI7XG5leHBvcnQgeyBDYW1lcmFTeXN0ZW0gfSBmcm9tIFwiLi9zeXN0ZW1zL0NhbWVyYVN5c3RlbS5qc1wiO1xuZXhwb3J0IHsgVGV4dEdlb21ldHJ5U3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UZXh0R2VvbWV0cnlTeXN0ZW0uanNcIjtcblxuaW1wb3J0IHsgVHJhbnNmb3JtU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9UcmFuc2Zvcm1TeXN0ZW0uanNcIjtcbmltcG9ydCB7IENhbWVyYVN5c3RlbSB9IGZyb20gXCIuL3N5c3RlbXMvQ2FtZXJhU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBXZWJHTFJlbmRlcmVyU3lzdGVtIH0gZnJvbSBcIi4vc3lzdGVtcy9XZWJHTFJlbmRlcmVyU3lzdGVtLmpzXCI7XG5pbXBvcnQgeyBPYmplY3QzRCB9IGZyb20gXCIuL2NvbXBvbmVudHMvT2JqZWN0M0QuanNcIjtcbmltcG9ydCB7IFdlYkdMUmVuZGVyZXIsIFJlbmRlcmFibGVHcm91cCwgQ2FtZXJhIH0gZnJvbSBcIi4vY29tcG9uZW50cy9pbmRleC5qc1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdCh3b3JsZCkge1xuICB3b3JsZFxuICAgIC5yZWdpc3RlclN5c3RlbShUcmFuc2Zvcm1TeXN0ZW0pXG4gICAgLnJlZ2lzdGVyU3lzdGVtKENhbWVyYVN5c3RlbSlcbiAgICAucmVnaXN0ZXJTeXN0ZW0oV2ViR0xSZW5kZXJlclN5c3RlbSwgeyBwcmlvcml0eTogMSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRpYWxpemVEZWZhdWx0KHdvcmxkID0gbmV3IEVDU1kuV29ybGQoKSkge1xuICBpbml0KHdvcmxkKTtcblxuICBsZXQgc2NlbmUgPSB3b3JsZFxuICAgIC5jcmVhdGVFbnRpdHkoKVxuICAgIC5hZGRDb21wb25lbnQoT2JqZWN0M0QgLyogU2NlbmUgKi8sIHsgdmFsdWU6IG5ldyBUSFJFRS5TY2VuZSgpIH0pO1xuICBsZXQgcmVuZGVyZXIgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoV2ViR0xSZW5kZXJlcik7XG4gIGxldCBjYW1lcmEgPSB3b3JsZC5jcmVhdGVFbnRpdHkoKS5hZGRDb21wb25lbnQoQ2FtZXJhLCB7XG4gICAgZm92OiA5MCxcbiAgICBhc3BlY3Q6IHdpbmRvdy5pbm5lcldpZHRoIC8gd2luZG93LmlubmVySGVpZ2h0LFxuICAgIG5lYXI6IDEsXG4gICAgZmFyOiAxMDAwLFxuICAgIGxheWVyczogMSxcbiAgICBoYW5kbGVSZXNpemU6IHRydWVcbiAgfSk7XG5cbiAgbGV0IHJlbmRlcmFibGVzID0gd29ybGQuY3JlYXRlRW50aXR5KCkuYWRkQ29tcG9uZW50KFJlbmRlcmFibGVHcm91cCwge1xuICAgIHNjZW5lOiBzY2VuZSxcbiAgICBjYW1lcmE6IGNhbWVyYVxuICB9KTtcblxuICByZXR1cm4ge1xuICAgIHdvcmxkLFxuICAgIGVudGl0aWVzOiB7XG4gICAgICBzY2VuZSxcbiAgICAgIGNhbWVyYSxcbiAgICAgIHJlbmRlcmVyLFxuICAgICAgcmVuZGVyYWJsZXNcbiAgICB9XG4gIH07XG59XG4iXSwibmFtZXMiOlsiVEhSRUUuVmVjdG9yMyIsIlRIUkVFLlRvcnVzQnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5JY29zYWhlZHJvbkJ1ZmZlckdlb21ldHJ5IiwiVEhSRUUuQm94QnVmZmVyR2VvbWV0cnkiLCJUSFJFRS5NZXNoU3RhbmRhcmRNYXRlcmlhbCIsIlRIUkVFLk1lc2giLCJUSFJFRS5Hcm91cCIsIlRIUkVFLk1lc2hCYXNpY01hdGVyaWFsIiwiVEhSRUUuVGV4dHVyZSIsIlRIUkVFLkltYWdlTG9hZGVyIiwiVEhSRUUuV2ViR0xSZW5kZXJlciIsIlRIUkVFLlBlcnNwZWN0aXZlQ2FtZXJhIiwiVEhSRUUuRm9udExvYWRlciIsIlRIUkVFLlRleHRHZW9tZXRyeSIsIkVDU1kuV29ybGQiLCJUSFJFRS5TY2VuZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBTyxNQUFNLEtBQUssQ0FBQztFQUNqQixXQUFXLEdBQUc7SUFDWixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztHQUNuQjs7RUFFRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztHQUNuQjtDQUNGOztBQ1JNLE1BQU0sTUFBTSxDQUFDO0VBQ2xCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0dBQ25COztFQUVELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0dBQ25CO0NBQ0Y7O0FDUk0sTUFBTSxNQUFNLENBQUM7RUFDbEIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDbEIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7R0FDaEI7RUFDRCxLQUFLLEdBQUc7SUFDTixJQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNsQixJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztHQUNoQjtDQUNGOztBQ1RNLE1BQU0sUUFBUSxDQUFDO0VBQ3BCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0dBQ25COztFQUVELEtBQUssR0FBRztJQUNOLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO0dBQ25CO0NBQ0Y7O0FDUk0sTUFBTSxPQUFPLENBQUM7RUFDbkIsV0FBVyxHQUFHO0lB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

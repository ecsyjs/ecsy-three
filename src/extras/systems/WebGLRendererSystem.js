import {Component, Types, System, Not} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import {RenderPass, Active, WebGLRenderer} from "../components/index.js";
import {CameraTagComponent} from "../../core/components.js";
import * as THREE from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three.js";
import {VRButton as VRButton2} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three/examples/jsm/webxr/VRButton.js";
import {ARButton as ARButton2} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three/examples/jsm/webxr/ARButton.js";
export class WebGLRendererContext extends Component {
}
WebGLRendererContext.schema = {
  value: {
    default: null,
    type: Types.Ref
  }
};
export class WebGLRendererSystem extends System {
  init() {
    this.world.registerComponent(WebGLRendererContext);
    window.addEventListener("resize", () => {
      this.queries.renderers.results.forEach((entity) => {
        var component = entity.getMutableComponent(WebGLRenderer);
        component.width = window.innerWidth;
        component.height = window.innerHeight;
      });
    }, false);
  }
  execute() {
    let renderers = this.queries.renderers.results;
    renderers.forEach((rendererEntity) => {
      var renderer = rendererEntity.getComponent(WebGLRendererContext).value;
      this.queries.renderPasses.results.forEach((entity) => {
        var pass = entity.getComponent(RenderPass);
        var scene = pass.scene.getObject3D();
        this.queries.activeCameras.results.forEach((cameraEntity) => {
          var camera = cameraEntity.getObject3D();
          renderer.render(scene, camera);
        });
      });
    });
    this.queries.uninitializedRenderers.results.forEach((entity) => {
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
      renderer.shadowMap.enabled = component.shadowMap;
      document.body.appendChild(renderer.domElement);
      if (component.vr || component.ar) {
        renderer.xr.enabled = true;
        if (component.vr) {
          document.body.appendChild(VRButton2.createButton(renderer));
        }
        if (component.ar) {
          document.body.appendChild(ARButton2.createButton(renderer));
        }
      }
      entity.addComponent(WebGLRendererContext, {
        value: renderer
      });
    });
    this.queries.renderers.changed.forEach((entity) => {
      var component = entity.getComponent(WebGLRenderer);
      var renderer = entity.getComponent(WebGLRendererContext).value;
      if (component.width !== renderer.width || component.height !== renderer.height) {
        renderer.setSize(component.width, component.height);
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
    components: [CameraTagComponent, Active],
    listen: {
      added: true
    }
  }
};

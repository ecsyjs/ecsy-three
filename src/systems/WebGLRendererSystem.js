import { System, Not } from "../../ecsy.module.js";
import { RenderableGroup, WebGLRenderer, Object3D } from "../components/index.js";
import * as THREE from "../../three.module.js";
import { WEBVR } from '../../examples/jsm/vr/WebVR.js';

class WebGLRendererContext {
  constructor() {
    this.renderer = null;
  }
}

export class WebGLRendererSystem extends System {
  init() {
    window.addEventListener(
      "resize",
      () => {
        this.queries.renderers.results.forEach(entity => {
          var component = entity.getMutableComponent(WebGLRenderer);
          console.log(window.innerWidth, window.innerHeight);
          component.width = window.innerWidth;
          component.height = window.innerHeight;
        })
      },
      false
    );
  }

  execute(delta) {
    // Uninitialized renderers
    this.queries.uninitializedRenderers.results.forEach(entity => {
      var component = entity.getComponent(WebGLRenderer);

      var renderer = new THREE.WebGLRenderer({antialias: component.antialias});

      renderer.setPixelRatio( window.devicePixelRatio );
      if (component.handleResize) {
				renderer.setSize( window.innerWidth, window.innerHeight );
      }

      document.body.appendChild( renderer.domElement );

      if (component.vr) {
        renderer.vr.enabled = true;
        document.body.appendChild( WEBVR.createButton( renderer, { referenceSpaceType: 'local' } ) );
      }

      entity.addComponent(WebGLRendererContext, {renderer: renderer});
    });

    this.queries.renderers.changed.forEach(entity => {
      var component = entity.getComponent(WebGLRenderer);
      var context = entity.getComponent(WebGLRendererContext).renderer;
      if (component.width !== context.width || component.height !== context.height) {
        context.width = component.width;
        context.height = component.height;
      }
    });

    let renderers = this.queries.renderers.results;
    renderers.forEach(rendererEntity => {
      var renderer = rendererEntity.getComponent(WebGLRendererContext).renderer;
      this.queries.renderables.results.forEach(entity => {
        var group = entity.getComponent(RenderableGroup);
        var scene = group.scene.getComponent(Object3D).object;
        var camera = group.camera.getComponent(Object3D).object;
        renderer.render(scene, camera);
      });
    });
  }
}


WebGLRendererSystem.queries = {
  uninitializedRenderers: {
    components: [WebGLRenderer, Not(WebGLRendererContext)],
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

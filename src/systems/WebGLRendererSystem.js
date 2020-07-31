import { System } from "ecsy";
import { PerspectiveCamera } from "three";
import { WebGLRendererComponent } from "../components/WebGLRendererComponent";

export class WebGLRendererSystem extends System {
  static queries = {
    renderers: { components: [WebGLRendererComponent] },
  };

  onResize() {
    this.needsResize = true;
  }

  init() {
    this.needsResize = true;
    this.onResize = this.onResize.bind(this);
    window.addEventListener("resize", this.onResize, false);
  }

  dispose() {
    window.removeEventListener("resize", this.onResize);
  }

  execute() {
    const entities = this.queries.renderers.results;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const component = entity.getComponent(WebGLRendererComponent);
      const camera = component.camera.getObject3D();
      const scene = component.scene.getObject3D();
      const renderer = component.renderer;

      if (this.needsResize) 
      {
        const canvas = renderer.domElement;

        const curPixelRatio = renderer.getPixelRatio();

        if (curPixelRatio !== window.devicePixelRatio) {
          renderer.setPixelRatio(window.devicePixelRatio);
        }
  
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        
        this.needsResize = false;
      }

      renderer.render(scene, camera);
    }
  }
}

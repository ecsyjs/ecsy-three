import { System } from "ecsy";
import { WebGLRenderer } from "../components/index.js";

export class WebGLRendererSystem extends System {
  init() {
    window.addEventListener(
      "resize",
      () => {
        this.queries.renderers.results.forEach(entity => {
          const component = entity.getMutableComponent(WebGLRenderer);
          const parent = component.renderer.domElement.parentElement;
          const width = parent.clientWidth;
          const height = parent.clientHeight;
          component.renderer.setSize(
            width,
            height,
            component.updateCanvasStyle
          );
          component.camera.aspect = width / height;
          component.camera.updateProjectionMatrix();
        });
      },
      false
    );
  }

  execute() {
    this.queries.renderers.results.forEach(entity => {
      const component = entity.getComponent(WebGLRenderer);
      component.renderer.render(component.scene, component.camera);
    });
  }
}

WebGLRendererSystem.queries = {
  renderers: {
    components: [WebGLRenderer]
  }
};

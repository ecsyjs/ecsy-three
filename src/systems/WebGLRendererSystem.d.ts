import { System } from "ecsy";
import { WebGLRendererComponent } from "../components/WebGLRendererComponent";

export class WebGLRendererSystem extends System {
  static queries: {
    renderers: { components: [typeof WebGLRendererComponent] },
  };

  needsResize: boolean;

  onResize(): void;

  dispose(): void;

  execute(): void
}

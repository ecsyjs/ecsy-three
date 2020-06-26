import {System} from "/web_modules/ecsy.js";
import {Visible} from "../components/index.js";
import {Object3DComponent as Object3DComponent2} from "../../core/Object3DComponent.js";
export class VisibilitySystem extends System {
  processVisibility(entities) {
    entities.forEach((entity) => {
      entity.getObject3D().visible = entity.getComponent(Visible).value;
    });
  }
  execute() {
    this.processVisibility(this.queries.entities.added);
    this.processVisibility(this.queries.entities.changed);
  }
}
VisibilitySystem.queries = {
  entities: {
    components: [Visible, Object3DComponent2],
    listen: {
      added: true,
      changed: [Visible]
    }
  }
};

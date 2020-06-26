import {System} from "/web_modules/ecsy.js";
import {OnObject3DAdded as OnObject3DAdded2} from "../components/OnObject3DAdded.js";
import {Object3DComponent as Object3DComponent2} from "../../core/Object3DComponent.js";
export class OnObject3DAddedSystem extends System {
  execute() {
    const entities = this.queries.entities.added;
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const component = entity.getComponent(OnObject3DAdded2);
      component.callback(entity.getObject3D());
    }
  }
}
OnObject3DAddedSystem.queries = {
  entities: {
    components: [OnObject3DAdded2, Object3DComponent2],
    listen: {
      added: true
    }
  }
};

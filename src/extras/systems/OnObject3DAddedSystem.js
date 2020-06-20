import { System } from "ecsy";
import { OnObject3DAdded } from "../components/OnObject3DAdded.js";
import { Object3DComponent } from "../../core/Object3DComponent.js";

export class OnObject3DAddedSystem extends System {
  execute() {
    const entities = this.queries.entities.results;

    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];
      const component = entity.getComponent(OnObject3DAdded);
      component.callback(entity.getObject3D());
    }
  }
}

OnObject3DAddedSystem.queries = {
  entities: {
    components: [OnObject3DAdded, Object3DComponent],
    listen: {
      added: true
    }
  }
};

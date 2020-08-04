import { World } from "ecsy";
import { ECSYThreeEntity } from "./entity.js";
import * as Object3DTagComponents from "./components/Object3DTagComponents.js";
import { Object3DComponent } from "./components/Object3DComponent.js";

export class ECSYThreeWorld extends World {
  constructor(options) {
    super(
      Object.assign(
        {
          entityClass: ECSYThreeEntity,
        },
        options
      )
    );

    this.registerComponent(Object3DComponent);

    Object.values(Object3DTagComponents).forEach((Component) => {
      this.registerComponent(Component);
    });
  }
}

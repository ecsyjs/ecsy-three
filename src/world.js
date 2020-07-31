import { World } from "ecsy";
import { ECSYThreeEntity } from "./entity.js";
import { defaultObject3DInflator } from "./defaultObject3DInflator";
import * as Object3DTagComponents from "./components/Object3DTags.js";
import { Object3DComponent } from "./components/Object3DComponent.js";

export class ECSYThreeWorld extends World {
  constructor(options) {
    super(
      Object.assign(
        {
          entityClass: ECSYThreeEntity,
          registerTagComponents: true
        },
        options
      )
    );

    if (this.options.registerTagComponents) {
      this.registerComponent(Object3DComponent);
      Object.values(Object3DTagComponents).forEach(Component => {
        this.registerComponent(Component)
      });
    }

    this.object3DInflator = defaultObject3DInflator;
  }
}

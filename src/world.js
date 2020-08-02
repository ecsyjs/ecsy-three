import { World } from "ecsy";
import { ECSYThreeEntity } from "./entity.js";
import * as ThreeTagComponents from "./components/ThreeTagComponents.js";
import { Object3DComponent } from "./components/Object3DComponent.js";

export class ECSYThreeWorld extends World {
  constructor(options) {
    super(
      Object.assign(
        {
          entityClass: ECSYThreeEntity,
          registerThreeTagComponents: true
        },
        options
      )
    );

    this.threeTagComponents = [];

    if (this.options.registerThreeTagComponents) {
      this.registerComponent(Object3DComponent);

      Object.values(ThreeTagComponents).forEach(Component => {
        this.registerComponent(Component)
      });
    }
  }

  registerComponent(Component, objectPool) {
    if (Component.isThreeTagComponent) {
      this.threeTagComponents.push(Component);
    }

    return super.registerComponent(Component, objectPool);
  }

  inflateObject3DComponents(entity, object3D) {
    for (let i = 0; i < this.threeTagComponents.length; i++) {
      const ThreeTagComponent = this.threeTagComponents[i];
      
      if (ThreeTagComponent.matchesObject3D(object3D)) {
        entity.addComponent(ThreeTagComponent);
      }
    }

    return entity;
  }
}

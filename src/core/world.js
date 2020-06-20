import { World } from "ecsy";
import { ECSYThreeEntity } from "./entity.js";
import { defaultObject3DInflator } from "./defaultObject3DInflator";

export class ECSYThreeWorld extends World {
  constructor(options) {
    super(Object.assign({}, { entityClass: ECSYThreeEntity }, options));
    this.object3DInflator = defaultObject3DInflator;
  }
}

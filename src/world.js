import { World } from "ecsy";
import { ECSYThreeEntity } from "./entity.js";

export class ECSYThreeWorld extends World {
  constructor(options) {
    super(Object.assign({}, { entityClass: ECSYThreeEntity }, options));
  }
}

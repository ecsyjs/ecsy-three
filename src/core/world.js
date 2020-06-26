import {World} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import {ECSYThreeEntity} from "./entity.js";
import {defaultObject3DInflator as defaultObject3DInflator2} from "./defaultObject3DInflator.js";
export class ECSYThreeWorld extends World {
  constructor(options) {
    super(Object.assign({}, {
      entityClass: ECSYThreeEntity
    }, options));
    this.object3DInflator = defaultObject3DInflator2;
  }
}

import {Vector3} from "/web_modules/three.js";
import {createType, copyCopyable, cloneClonable} from "/web_modules/ecsy.js";
export const Vector3Type = createType({
  name: "Vector3",
  default: new Vector3(),
  copy: copyCopyable,
  clone: cloneClonable
});
export const ThreeTypes = {
  Vector3Type
};
export {Types} from "/web_modules/ecsy.js";

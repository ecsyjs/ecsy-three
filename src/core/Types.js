import { Vector3 } from "three";
import { createType, copyCopyable, cloneClonable } from "ecsy";

export const Vector3Type = createType({
  name: "Vector3",
  default: new Vector3(),
  copy: copyCopyable,
  clone: cloneClonable
});

export const ThreeTypes = {
  Vector3Type
};

export { Types } from "ecsy";

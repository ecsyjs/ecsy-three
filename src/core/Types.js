import { Vector3 } from "three";
import { createType, copyCopyable, cloneClonable } from "ecsy";

export const ThreeTypes = {
  Vector3: createType({
    name: "Vector3",
    default: new Vector3(),
    copy: copyCopyable,
    clone: cloneClonable
  })
};

export { Types } from "ecsy";

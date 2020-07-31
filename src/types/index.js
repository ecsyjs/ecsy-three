import { Vector2 as _Vector2, Vector3 as _Vector3 } from "three";
import { createType, copyCopyable, cloneClonable } from "ecsy";

function defineType(ClassName, ThreeClass) {
  return createType({
    name: ClassName,
    default: new ThreeClass(),
    copy: copyCopyable,
    clone: cloneClonable
  });
}

export const Vector2 = defineType("Vector2", _Vector2);
export const Vector3 = defineType("Vector3", _Vector3);

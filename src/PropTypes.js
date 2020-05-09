import { PropTypes as ECSYPropTypes, copyCopyable, cloneClonable } from "ecsy";
import {
  Vector2,
  Vector3,
  Vector4,
  Quaternion,
  Color,
  Euler,
  Matrix3,
  Matrix4
} from "three";

export const PropTypes = {
  ...ECSYPropTypes,
  Vector2: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Vector2()
  },
  Vector3: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Vector3()
  },
  Vector4: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Vector4()
  },
  Quaternion: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Quaternion()
  },
  Color: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Color()
  },
  Euler: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Euler()
  },
  Matrix3: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Matrix3()
  },
  Matrix4: {
    copy: copyCopyable,
    clone: cloneClonable,
    default: new Matrix4()
  }
};

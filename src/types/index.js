import {
  Box2 as _Box2,
  Box3 as _Box3,
  Color as _Color,
  Cylindrical as _Cylindrical,
  Euler as _Euler,
  Frustum as _Frustum,
  Line3 as _Line3,
  Matrix3 as _Matrix3,
  Matrix4 as _Matrix4,
  Plane as _Plane,
  Quaternion as _Quaternion,
  Ray as _Ray,
  Sphere as _Sphere,
  Spherical as _Spherical,
  SphericalHarmonics3 as _SphericalHarmonics3,
  Triangle as _Triangle,
  Vector2 as _Vector2,
  Vector3 as _Vector3,
  Vector4 as _Vector4,
} from "three";
import { createType, copyCopyable, cloneClonable } from "ecsy";

function defineClonableType(ClassName, ThreeClass) {
  return createType({
    name: ClassName,
    default: new ThreeClass(),
    copy: copyCopyable,
    clone: cloneClonable,
  });
}

// Types from the three.js core library
// All types must implement the copy and clone methods.
// Excludes Geometries, Object3Ds, Materials, and other types that require more
// advanced object pooling techniques

// math

export const Box2 = defineClonableType("Box2", _Box2);
export const Box3 = defineClonableType("Box3", _Box3);
export const Color = defineClonableType("Color", _Color);
export const Cylindrical = defineClonableType("Cylindrical", _Cylindrical);
export const Euler = defineClonableType("Euler", _Euler);
export const Frustum = defineClonableType("Frustum", _Frustum);
export const Line3 = defineClonableType("Line3", _Line3);
export const Matrix3 = defineClonableType("Matrix3", _Matrix3);
export const Matrix4 = defineClonableType("Matrix4", _Matrix4);
export const Plane = defineClonableType("Plane", _Plane);
export const Quaternion = defineClonableType("Quaternion", _Quaternion);
export const Ray = defineClonableType("Ray", _Ray);
export const Sphere = defineClonableType("Sphere", _Sphere);
export const Spherical = defineClonableType("Spherical", _Spherical);
export const SphericalHarmonics3 = defineClonableType(
  "SphericalHarmonics3",
  _SphericalHarmonics3
);
export const Triangle = defineClonableType("Triangle", _Triangle);
export const Vector2 = defineClonableType("Vector2", _Vector2);
export const Vector3 = defineClonableType("Vector3", _Vector3);
export const Vector4 = defineClonableType("Vector4", _Vector4);

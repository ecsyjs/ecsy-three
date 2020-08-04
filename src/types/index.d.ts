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
import { PropType } from "ecsy";


// Types from the three.js core library
// All types must implement the copy and clone methods.
// Excludes Geometries, Object3Ds, Materials, and other types that require more
// advanced object pooling techniques

// math

export type Box2Type = PropType<_Box2, _Box2>;
export const Box2: Box2Type;
export type Box3Type = PropType<_Box3, _Box3>;
export const Box3: Box3Type;
export type ColorType = PropType<_Color, _Color>;
export const Color: ColorType;
export type CylindricalType = PropType<_Cylindrical, _Cylindrical>;
export const Cylindrical: CylindricalType;
export type EulerType = PropType<_Euler, _Euler>;
export const Euler: EulerType;
export type FrustumType = PropType<_Frustum, _Frustum>;
export const Frustum: FrustumType;
export type Line3Type = PropType<_Line3, _Line3>;
export const Line3: Line3Type;
export type Matrix3Type = PropType<_Matrix3, _Matrix3>;
export const Matrix3: Matrix3Type;
export type Matrix4Type = PropType<_Matrix4, _Matrix4>;
export const Matrix4: Matrix4Type;
export type PlaneType = PropType<_Plane, _Plane>;
export const Plane: PlaneType;
export type QuaternionType = PropType<_Quaternion, _Quaternion>;
export const Quaternion: QuaternionType;
export type RayType = PropType<_Ray, _Ray>;
export const Ray: RayType;
export type SphereType = PropType<_Sphere, _Sphere>;
export const Sphere: SphereType;
export type SphericalType = PropType<_Spherical, _Spherical>;
export const Spherical: SphericalType;
export type SphericalHarmonics3Type = PropType<_SphericalHarmonics3, _SphericalHarmonics3>;
export const SphericalHarmonics3: SphericalHarmonics3Type;
export type TriangleType = PropType<_Triangle, _Triangle>;
export const Triangle: TriangleType;
export type Vector2Type = PropType<_Vector2, _Vector2>;
export const Vector2: Vector2Type;
export type Vector3Type = PropType<_Vector3, _Vector3>;
export const Vector3: Vector3Type;
export type Vector4Type = PropType<_Vector4, _Vector4>;
export const Vector4: Vector4Type;

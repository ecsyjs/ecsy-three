import { TagComponent } from "ecsy";

// Tag components for every Object3D in the three.js core library

// audio
export class AudioTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class AudioListenerTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class PositionalAudioTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

// cameras
export class ArrayCameraTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class CameraTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class CubeCameraTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class OrthographicCameraTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class PerspectiveCameraTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

// extras/objects
export class ImmediateRenderObjectTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

// helpers

// Due to inconsistency in implementing consistent identifying properties like "type" on helpers, we've
// chosen to exclude helper tag components.

// lights
export class AmbientLightTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class AmbientLightProbeTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class DirectionalLightTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class HemisphereLightTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class HemisphereLightProbeTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class LightTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class LightProbeTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class PointLightTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class RectAreaLightTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class SpotLightTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

// objects
export class BoneTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class GroupTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class InstancedMeshTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class LODTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class LineTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class LineLoopTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class LineSegmentsTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class MeshTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}
export class PointsTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class SkinnedMeshTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

export class SpriteTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

// scenes
export class SceneTagComponent extends TagComponent {
  static isObject3DTagComponent = true;
}

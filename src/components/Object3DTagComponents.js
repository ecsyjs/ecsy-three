import { TagComponent } from "ecsy";

// Tag components for every Object3D in the three.js core library

// audio
export class AudioTagComponent extends TagComponent {}

export class AudioListenerTagComponent extends TagComponent {}

export class PositionalAudioTagComponent extends TagComponent {}

// cameras
export class ArrayCameraTagComponent extends TagComponent {}

export class CameraTagComponent extends TagComponent {}

export class CubeCameraTagComponent extends TagComponent {}

export class OrthographicCameraTagComponent extends TagComponent {}

export class PerspectiveCameraTagComponent extends TagComponent {}

// extras/objects
export class ImmediateRenderObjectTagComponent extends TagComponent {}

// helpers

// Due to inconsistency in implementing consistent identifying properties like "type" on helpers, we've
// chosen to exclude helper tag components.

// lights
export class AmbientLightTagComponent extends TagComponent {}

export class AmbientLightProbeTagComponent extends TagComponent {}

export class DirectionalLightTagComponent extends TagComponent {}

export class HemisphereLightTagComponent extends TagComponent {}

export class HemisphereLightProbeTagComponent extends TagComponent {}

export class LightTagComponent extends TagComponent {}

export class LightProbeTagComponent extends TagComponent {}

export class PointLightTagComponent extends TagComponent {}

export class RectAreaLightTagComponent extends TagComponent {}

export class SpotLightTagComponent extends TagComponent {}

// objects
export class BoneTagComponent extends TagComponent {}

export class GroupTagComponent extends TagComponent {}

export class InstancedMeshTagComponent extends TagComponent {}

export class LODTagComponent extends TagComponent {}

export class LineTagComponent extends TagComponent {}

export class LineLoopTagComponent extends TagComponent {}

export class LineSegmentsTagComponent extends TagComponent {}

export class MeshTagComponent extends TagComponent {}
export class PointsTagComponent extends TagComponent {}

export class SkinnedMeshTagComponent extends TagComponent {}

export class SpriteTagComponent extends TagComponent {}

// scenes
export class SceneTagComponent extends TagComponent {}

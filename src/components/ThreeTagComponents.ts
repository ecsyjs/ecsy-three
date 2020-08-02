import { ThreeTagComponent } from "./ThreeTagComponent";

// Tag components for every Object3D in the three.js core library

// audio
export class AudioTagComponent extends ThreeTagComponent {}

export class AudioListenerTagComponent extends ThreeTagComponent {}

export class PositionalAudioTagComponent extends ThreeTagComponent {}

// cameras
export class ArrayCameraTagComponent extends ThreeTagComponent {}

export class CameraTagComponent extends ThreeTagComponent {}

export class CubeCameraTagComponent extends ThreeTagComponent {}

export class OrthographicCameraTagComponent extends ThreeTagComponent {}

export class PerspectiveCameraTagComponent extends ThreeTagComponent {}

// extras/objects
export class ImmediateRenderObjectTagComponent extends ThreeTagComponent {}

// helpers

// Due to inconsistency in implementing consistent identifying properties like "type" on helpers, we've
// chosen to exclude helper tag components.

// lights
export class AmbientLightTagComponent extends ThreeTagComponent {}

export class AmbientLightProbeTagComponent extends ThreeTagComponent {}

export class DirectionalLightTagComponent extends ThreeTagComponent {}

export class HemisphereLightTagComponent extends ThreeTagComponent {}

export class HemisphereLightProbeTagComponent extends ThreeTagComponent {}

export class LightTagComponent extends ThreeTagComponent {}

export class LightProbeTagComponent extends ThreeTagComponent {}

export class PointLightTagComponent extends ThreeTagComponent {}

export class RectAreaLightTagComponent extends ThreeTagComponent {}

export class SpotLightTagComponent extends ThreeTagComponent {}

// objects
export class BoneTagComponent extends ThreeTagComponent {}

export class GroupTagComponent extends ThreeTagComponent {}

export class InstancedMeshTagComponent extends ThreeTagComponent {}

export class LODTagComponent extends ThreeTagComponent {}

export class LineTagComponent extends ThreeTagComponent {}

export class LineLoopTagComponent extends ThreeTagComponent {}

export class LineSegmentsTagComponent extends ThreeTagComponent {}

export class MeshTagComponent extends ThreeTagComponent {}
export class PointsTagComponent extends ThreeTagComponent {}

export class SkinnedMeshTagComponent extends ThreeTagComponent {}

export class SpriteTagComponent extends ThreeTagComponent {}

// scenes
export class SceneTagComponent extends ThreeTagComponent {}

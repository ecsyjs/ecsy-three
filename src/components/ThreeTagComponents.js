import { ThreeTagComponent } from "./ThreeTagComponent.js";

// Tag components for every Object3D in the three.js core library

// audio
export class AudioTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.type === "Audio";
  }
}

export class AudioListenerTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.type === "AudioListener";
  }
}

export class PositionalAudioTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    // PositionalAudio doesn't have a type or isPositionalAudio property.
    return object.type === "Audio" && object.panner !== undefined; 
  }
}

// cameras
export class ArrayCameraTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isArrayCamera; 
  }
}

export class CameraTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isCamera; 
  }
}

export class CubeCameraTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.type === "CubeCamera"; 
  }
}

export class OrthographicCameraTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isOrthographicCamera; 
  }
}

export class PerspectiveCameraTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isPerspectiveCamera; 
  }
}

// extras/objects
export class ImmediateRenderObjectTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isImmediateRenderObject; 
  }
}

// helpers

// Due to inconsistency in implementing consistent identifying properties like "type" on helpers, we've
// chosen to exclude helper tag components.

// lights
export class AmbientLightTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isAmbientLight; 
  }
}

export class AmbientLightProbeTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isAmbientLightProbe; 
  }
}

export class DirectionalLightTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isDirectionalLight; 
  }
}

export class HemisphereLightTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isHemisphereLight; 
  }
}

export class HemisphereLightProbeTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isHemisphereLightProbe; 
  }
}

export class LightTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isLight; 
  }
}

export class LightProbeTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isLightProbe; 
  }
}

export class PointLightTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isPointLight; 
  }
}

export class RectAreaLightTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isRectAreaLight; 
  }
}

export class SpotLightTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isSpotLight; 
  }
}

// objects
export class BoneTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isBone; 
  }
}

export class GroupTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isGroup; 
  }
}

export class InstancedMeshTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isInstancedMesh; 
  }
}

export class LODTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isLOD; 
  }
}

export class LineTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isLine; 
  }
}

export class LineLoopTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isLineLoop; 
  }
}

export class LineSegmentsTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isLineSegments; 
  }
}

export class MeshTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isMesh; 
  }
}
export class PointsTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isPoints; 
  }
}

export class SkinnedMeshTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isSkinnedMesh; 
  }
}

export class SpriteTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isSprite; 
  }
}

// scenes
export class SceneTagComponent extends ThreeTagComponent {
  static matchesObject3D(object) {
    return object.isScene; 
  }
}

import { TagComponent } from "ecsy";
import { EntityMixin } from "../EntityMixin.js";
import {
  Object3D,
  Scene,
  Group,
  Mesh,
  SkinnedMesh,
  Bone,
  InstancedMesh,
  LOD,
  Line,
  LineSegments,
  LineLoop,
  Sprite,
  Points,
  Audio,
  AudioListener,
  PositionalAudio,
  ArrayCamera,
  Camera,
  CubeCamera,
  OrthographicCamera,
  PerspectiveCamera,
  AmbientLight,
  Light,
  LightProbe,
  DirectionalLight,
  HemisphereLight,
  HemisphereLightProbe,
  PointLight,
  RectAreaLight,
  SpotLight,
  ImmediateRenderObject,
  ArrowHelper,
  AxesHelper,
  Box3Helper,
  BoxHelper,
  CameraHelper,
  DirectionalLightHelper,
  GridHelper,
  HemisphereLightHelper,
  PlaneHelper,
  PointLightHelper,
  PolarGridHelper,
  SkeletonHelper,
  SpotLightHelper,
} from "three";

export class Object3DTag extends TagComponent {}
export class SceneTag extends TagComponent {}
export class GroupTag extends TagComponent {}
export class MeshTag extends TagComponent {}
export class SkinnedMeshTag extends TagComponent {}
export class BoneTag extends TagComponent {}
export class InstancedMeshTag extends TagComponent {}
export class LODTag extends TagComponent {}
export class LineTag extends TagComponent {}
export class LineLoopTag extends TagComponent {}
export class LineSegmentsTag extends TagComponent {}
export class PointsTag extends TagComponent {}
export class SpriteTag extends TagComponent {}
export class AudioTag extends TagComponent {}
export class AudioListenerTag extends TagComponent {}
export class PositionalAudioTag extends TagComponent {}
export class CameraTag extends TagComponent {}
export class PerspectiveCameraTag extends TagComponent {}
export class OrthographicCameraTag extends TagComponent {}
export class ArrayCameraTag extends TagComponent {}
export class CubeCameraTag extends TagComponent {}
export class LightTag extends TagComponent {}
export class LightProbeTag extends TagComponent {}
export class AmbientLightTag extends TagComponent {}
export class DirectionalLightTag extends TagComponent {}
export class HemisphereLightTag extends TagComponent {}
export class HemisphereLightProbeTag extends TagComponent {}
export class PointLightTag extends TagComponent {}
export class RectAreaLightTag extends TagComponent {}
export class SpotLightTag extends TagComponent {}
export class ImmediateRenderObjectTag extends TagComponent {}
export class HelperTag extends TagComponent {}
export class ArrowHelperTag extends TagComponent {}
export class AxesHelperTag extends TagComponent {}
export class Box3HelperTag extends TagComponent {}
export class BoxHelperTag extends TagComponent {}
export class CameraHelperTag extends TagComponent {}
export class DirectionalLightHelperTag extends TagComponent {}
export class GridHelperTag extends TagComponent {}
export class HemisphereLightHelperTag extends TagComponent {}
export class PlaneHelperTag extends TagComponent {}
export class PointLightHelperTag extends TagComponent {}
export class PolarGridHelperTag extends TagComponent {}
export class SkeletonHelperTag extends TagComponent {}
export class SpotLightHelperTag extends TagComponent {}

export class Object3DEntity extends EntityMixin(Object3D) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
  }
}

Object3DEntity.tagComponents = [Object3DTag];

export class SceneEntity extends EntityMixin(Scene) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(SceneTag);
  }
}

SceneEntity.tagComponents = [Object3DTag, SceneTag];

export class GroupEntity extends EntityMixin(Group) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(GroupTag);
  }
}

GroupEntity.tagComponents = [Object3DTag, GroupTag];

export class MeshEntity extends EntityMixin(Mesh) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(MeshTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

MeshEntity.tagComponents = [Object3DTag, MeshTag];

export class SkinnedMeshEntity extends EntityMixin(SkinnedMesh) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(MeshTag);
    this.addComponent(SkinnedMeshTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

SkinnedMeshEntity.tagComponents = [Object3DTag, MeshTag, SkinnedMeshTag];

export class BoneEntity extends EntityMixin(Bone) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(BoneTag);
  }
}

BoneEntity.tagComponents = [Object3DTag, BoneTag];

export class InstancedMeshEntity extends EntityMixin(InstancedMesh) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(MeshTag);
    this.addComponent(InstancedMeshTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

InstancedMeshEntity.tagComponents = [Object3DTag, MeshTag, InstancedMeshTag];

export class LODEntity extends EntityMixin(LOD) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(LODTag);
  }
}

LODEntity.tagComponents = [Object3DTag, LODTag];

export class LineEntity extends EntityMixin(Line) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(LineTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

LineEntity.tagComponents = [Object3DTag, LineTag];

export class LineLoopEntity extends EntityMixin(LineLoop) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(LineTag);
    this.addComponent(LineLoopTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

LineLoopEntity.tagComponents = [Object3DTag, LineTag, LineLoopTag];

export class LineSegmentsEntity extends EntityMixin(LineSegments) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

LineSegmentsEntity.tagComponents = [Object3DTag, LineTag, LineSegmentsTag];

export class PointsEntity extends EntityMixin(Points) {
  constructor(world, geometry, material) {
    super(world, geometry, material);
    this.addComponent(Object3DTag);
    this.addComponent(PointsTag);
  }

  clone() {
    return new this.constructor(this.world, this.geometry, this.material).copy(
      this
    );
  }
}

PointsEntity.tagComponents = [Object3DTag, PointsTag];

export class SpriteEntity extends EntityMixin(Sprite) {
  constructor(world, material) {
    super(world, material);
    this.addComponent(Object3DTag);
    this.addComponent(SpriteTag);
  }

  clone() {
    return new this.constructor(this.world, this.material).copy(this);
  }
}

SpriteEntity.tagComponents = [Object3DTag, SpriteTag];

export class AudioEntity extends EntityMixin(Audio) {
  constructor(world, listener) {
    super(world, listener);
    this.addComponent(Object3DTag);
    this.addComponent(AudioTag);
  }
}

AudioEntity.tagComponents = [Object3DTag, AudioTag];

export class AudioListenerEntity extends EntityMixin(AudioListener) {
  constructor(world) {
    super(world);
    this.addComponent(Object3DTag);
    this.addComponent(AudioListenerTag);
  }
}

AudioListenerEntity.tagComponents = [Object3DTag, AudioListenerTag];

export class PositionalAudioEntity extends EntityMixin(PositionalAudio) {
  constructor(world, listener) {
    super(world, listener);
    this.addComponent(Object3DTag);
    this.addComponent(AudioTag);
    this.addComponent(PositionalAudioTag);
  }
}

PositionalAudioEntity.tagComponents = [
  Object3DTag,
  AudioTag,
  PositionalAudioTag,
];

export class CameraEntity extends EntityMixin(Camera) {
  constructor(world, fov, aspect, near, far) {
    super(world, fov, aspect, near, far);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
  }
}

CameraEntity.tagComponents = [Object3DTag, CameraTag];

export class PerspectiveCameraEntity extends EntityMixin(PerspectiveCamera) {
  constructor(world, fov, aspect, near, far) {
    super(world, fov, aspect, near, far);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
    this.addComponent(PerspectiveCameraTag);
  }
}

PerspectiveCameraEntity.tagComponents = [
  Object3DTag,
  CameraTag,
  PerspectiveCameraTag,
];

export class OrthographicCameraEntity extends EntityMixin(OrthographicCamera) {
  constructor(world, left, right, top, bottom, near, far) {
    super(world, left, right, top, bottom, near, far);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
    this.addComponent(OrthographicCameraTag);
  }
}

OrthographicCameraEntity.tagComponents = [
  Object3DTag,
  CameraTag,
  OrthographicCameraTag,
];

export class ArrayCameraEntity extends EntityMixin(ArrayCamera) {
  constructor(world, array) {
    super(world, array);
    this.addComponent(Object3DTag);
    this.addComponent(CameraTag);
    this.addComponent(PerspectiveCameraTag);
    this.addComponent(ArrayCameraTag);
  }
}

ArrayCameraEntity.tagComponents = [
  Object3DTag,
  CameraTag,
  PerspectiveCameraTag,
  ArrayCameraTag,
];

export class CubeCameraEntity extends EntityMixin(CubeCamera) {
  constructor(world, near, far, cubeResolution, options) {
    super(world, near, far, cubeResolution, options);
    this.addComponent(Object3DTag);
    this.addComponent(CubeCameraTag);
  }
}

CubeCameraEntity.tagComponents = [Object3DTag, CubeCameraTag];

export class LightEntity extends EntityMixin(Light) {
  constructor(world, color, intensity) {
    super(world, color, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
  }
}

LightEntity.tagComponents = [Object3DTag, LightTag];

export class LightProbeEntity extends EntityMixin(LightProbe) {
  constructor(world, sh, intensity) {
    super(world, sh, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(LightProbeTag);
  }
}
LightProbeEntity.tagComponents = [Object3DTag, LightTag, LightProbeTag];

export class AmbientLightEntity extends EntityMixin(AmbientLight) {
  constructor(world, color, intensity) {
    super(world, color, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(AmbientLightTag);
  }
}

AmbientLightEntity.tagComponents = [Object3DTag, LightTag, AmbientLightTag];

export class DirectionalLightEntity extends EntityMixin(DirectionalLight) {
  constructor(world, color, intensity) {
    super(world, color, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(DirectionalLightTag);
  }
}

DirectionalLightEntity.tagComponents = [
  Object3DTag,
  LightTag,
  DirectionalLightTag,
];

export class HemisphereLightEntity extends EntityMixin(HemisphereLight) {
  constructor(world, skyColor, groundColor, intensity) {
    super(world, skyColor, groundColor, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(HemisphereLightTag);
  }
}

HemisphereLightEntity.tagComponents = [
  Object3DTag,
  LightTag,
  HemisphereLightTag,
];

export class HemisphereLightProbeEntity extends EntityMixin(
  HemisphereLightProbe
) {
  constructor(world, skyColor, groundColor, intensity) {
    super(world, skyColor, groundColor, intensity);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(LightProbeTag);
    this.addComponent(HemisphereLightProbeTag);
  }
}

HemisphereLightProbeEntity.tagComponents = [
  Object3DTag,
  LightTag,
  LightProbeTag,
  HemisphereLightProbeTag,
];

export class PointLightEntity extends EntityMixin(PointLight) {
  constructor(world, color, intensity, distance, decay) {
    super(world, color, intensity, distance, decay);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(PointLightTag);
  }
}

PointLightEntity.tagComponents = [Object3DTag, LightTag, PointLightTag];

export class RectAreaLightEntity extends EntityMixin(RectAreaLight) {
  constructor(world, color, intensity, width, height) {
    super(world, color, intensity, width, height);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(RectAreaLightTag);
  }
}

RectAreaLightEntity.tagComponents = [Object3DTag, LightTag, RectAreaLightTag];

export class SpotLightEntity extends EntityMixin(SpotLight) {
  constructor(world, color, intensity, distance, angle, penumbra, decay) {
    super(world, color, intensity, distance, angle, penumbra, decay);
    this.addComponent(Object3DTag);
    this.addComponent(LightTag);
    this.addComponent(SpotLightTag);
  }
}

SpotLightEntity.tagComponents = [Object3DTag, LightTag, SpotLightTag];

export class ImmediateRenderObjectEntity extends EntityMixin(
  ImmediateRenderObject
) {
  constructor(world, material) {
    super(world, material);
    this.addComponent(Object3DTag);
    this.addComponent(ImmediateRenderObjectTag);
  }
}

ImmediateRenderObjectEntity.tagComponents = [
  Object3DTag,
  ImmediateRenderObjectTag,
];

export class ArrowHelperEntity extends EntityMixin(ArrowHelper) {
  constructor(world, dir, origin, length, color, headLength, headWidth) {
    super(world, dir, origin, length, color, headLength, headWidth);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(ArrowHelperTag);
  }
}

ArrowHelperEntity.tagComponents = [Object3DTag, HelperTag, ArrowHelperTag];

export class AxesHelperEntity extends EntityMixin(AxesHelper) {
  constructor(world, size) {
    super(world, size);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(AxesHelperTag);
  }
}

AxesHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  AxesHelperTag,
];

export class Box3HelperEntity extends EntityMixin(Box3Helper) {
  constructor(world, box, color) {
    super(world, box, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(Box3HelperTag);
  }
}

Box3HelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  Box3HelperTag,
];

export class BoxHelperEntity extends EntityMixin(BoxHelper) {
  constructor(world, object, color) {
    super(world, object, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(BoxHelperTag);
  }
}

BoxHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  BoxHelperTag,
];

export class CameraHelperEntity extends EntityMixin(CameraHelper) {
  constructor(world, camera) {
    super(world, camera);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(CameraHelperTag);
  }
}

CameraHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  CameraHelperTag,
];

export class DirectionalLightHelperEntity extends EntityMixin(
  DirectionalLightHelper
) {
  constructor(world, light, size, color) {
    super(world, light, size, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(DirectionalLightHelperTag);
  }
}

DirectionalLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  DirectionalLightHelperTag,
];

export class GridHelperEntity extends EntityMixin(GridHelper) {
  constructor(world, size, divisions, color1, color2) {
    super(world, size, divisions, color1, color2);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(GridHelperTag);
  }
}

GridHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  GridHelperTag,
];

export class HemisphereLightHelperEntity extends EntityMixin(
  HemisphereLightHelper
) {
  constructor(world, light, size, color) {
    super(world, light, size, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(HemisphereLightHelperTag);
  }
}

HemisphereLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  HemisphereLightHelperTag,
];

export class PlaneHelperEntity extends EntityMixin(PlaneHelper) {
  constructor(world, plane, size, hex) {
    super(world, plane, size, hex);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(PlaneHelperTag);
  }
}

PlaneHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  PlaneHelperTag,
];

export class PointLightHelperEntity extends EntityMixin(PointLightHelper) {
  constructor(world, light, sphereSize, color) {
    super(world, light, sphereSize, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(PointLightHelperTag);
    this.addComponent(MeshTag);
  }
}

PointLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  PointLightHelperTag,
  MeshTag,
];

export class PolarGridHelperEntity extends EntityMixin(PolarGridHelper) {
  constructor(world, radius, radials, circles, divisions, color1, color2) {
    super(world, radius, radials, circles, divisions, color1, color2);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(PolarGridHelperTag);
  }
}

PolarGridHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  PolarGridHelperTag,
];

export class SkeletonHelperEntity extends EntityMixin(SkeletonHelper) {
  constructor(world, object) {
    super(world, object);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(LineTag);
    this.addComponent(LineSegmentsTag);
    this.addComponent(SkeletonHelperTag);
  }
}

SkeletonHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  LineTag,
  LineSegmentsTag,
  SkeletonHelperTag,
];

export class SpotLightHelperEntity extends EntityMixin(SpotLightHelper) {
  constructor(world, light, color) {
    super(world, light, color);
    this.addComponent(Object3DTag);
    this.addComponent(HelperTag);
    this.addComponent(SpotLightHelperTag);
  }
}

SpotLightHelperEntity.tagComponents = [
  Object3DTag,
  HelperTag,
  SpotLightHelperTag,
];

import { _Entity } from "ecsy";
import { Object3DComponent } from "./components/Object3DComponent.js";
import {
  AudioTagComponent,
  AudioListenerTagComponent,
  PositionalAudioTagComponent,
  ArrayCameraTagComponent,
  CameraTagComponent,
  CubeCameraTagComponent,
  OrthographicCameraTagComponent,
  PerspectiveCameraTagComponent,
  ImmediateRenderObjectTagComponent,
  AmbientLightTagComponent,
  AmbientLightProbeTagComponent,
  DirectionalLightTagComponent,
  HemisphereLightTagComponent,
  HemisphereLightProbeTagComponent,
  LightTagComponent,
  LightProbeTagComponent,
  PointLightTagComponent,
  RectAreaLightTagComponent,
  SpotLightTagComponent,
  BoneTagComponent,
  GroupTagComponent,
  InstancedMeshTagComponent,
  LODTagComponent,
  LineTagComponent,
  LineLoopTagComponent,
  LineSegmentsTagComponent,
  MeshTagComponent,
  PointsTagComponent,
  SkinnedMeshTagComponent,
  SpriteTagComponent,
  SceneTagComponent,
} from "./components/Object3DTagComponents.js";

export class ECSYThreeEntity extends _Entity {
  addObject3DComponent(obj, parentEntity) {
    obj.entity = this;

    this.addComponent(Object3DComponent, { value: obj });

    if (obj.type === "Audio" && obj.panner !== undefined) {
      this.addComponent(PositionalAudioTagComponent);
    } else if (obj.type === "Audio") {
      this.addComponent(AudioTagComponent);
    } else if (obj.type === "AudioListener") {
      this.addComponent(AudioListenerTagComponent);
    } else if (obj.isCamera) {
      this.addComponent(CameraTagComponent);

      if (obj.isOrthographicCamera) {
        this.addComponent(OrthographicCameraTagComponent);
      } else if (obj.isPerspectiveCamera) {
        this.addComponent(PerspectiveCameraTagComponent);

        if (obj.isArrayCamera) {
          this.addComponent(ArrayCameraTagComponent);
        }
      }
    } else if (obj.type === "CubeCamera") {
      this.addComponent(CubeCameraTagComponent);
    } else if (obj.isImmediateRenderObject) {
      this.addComponent(ImmediateRenderObjectTagComponent);
    } else if (obj.isLight) {
      this.addComponent(LightTagComponent);

      if (obj.isAmbientLight) {
        this.addComponent(AmbientLightTagComponent);
      } else if (obj.isDirectionalLight) {
        this.addComponent(DirectionalLightTagComponent);
      } else if (obj.isHemisphereLight) {
        this.addComponent(HemisphereLightTagComponent);
      } else if (obj.isPointLight) {
        this.addComponent(PointLightTagComponent);
      } else if (obj.isRectAreaLight) {
        this.addComponent(RectAreaLightTagComponent);
      } else if (obj.isSpotLight) {
        this.addComponent(SpotLightTagComponent);
      } else if (obj.isLightProbe) {
        this.addComponent(LightProbeTagComponent);

        if (obj.isAmbientLightProbe) {
          this.addComponent(AmbientLightProbeTagComponent);
        } else if (obj.isHemisphereLightProbe) {
          this.addComponent(HemisphereLightProbeTagComponent);
        }
      }
    } else if (obj.isBone) {
      this.addComponent(BoneTagComponent);
    } else if (obj.isGroup) {
      this.addComponent(GroupTagComponent);
    } else if (obj.isLOD) {
      this.addComponent(LODTagComponent);
    } else if (obj.isMesh) {
      this.addComponent(MeshTagComponent);

      if (obj.isInstancedMesh) {
        this.addComponent(InstancedMeshTagComponent);
      } else if (obj.isSkinnedMesh) {
        this.addComponent(SkinnedMeshTagComponent);
      }
    } else if (obj.isLine) {
      this.addComponent(LineTagComponent);

      if (obj.isLineLoop) {
        this.addComponent(LineLoopTagComponent);
      } else if (obj.isLineSegments) {
        this.addComponent(LineSegmentsTagComponent);
      }
    } else if (obj.isPoints) {
      this.addComponent(PointsTagComponent);
    } else if (obj.isSprite) {
      this.addComponent(SpriteTagComponent);
    } else if (obj.isScene) {
      this.addComponent(SceneTagComponent);
    }

    if (parentEntity && parentEntity.hasComponent(Object3DComponent)) {
      parentEntity.getObject3D().add(obj);
    }

    return this;
  }

  removeObject3DComponent(unparent = true) {
    const obj = this.getComponent(Object3DComponent, true).value;
    if (unparent) {
      // Using "true" as the entity could be removed somewhere else
      obj.parent && obj.parent.remove(obj);
    }
    this.removeComponent(Object3DComponent);

    for (let i = this._ComponentTypes.length - 1; i >= 0; i--) {
      const Component = this._ComponentTypes[i];

      if (Component.isObject3DTagComponent) {
        this.removeComponent(Component);
      }
    }

    obj.entity = null;
  }

  removeAllComponents(forceImmediate) {
    if (this.hasComponent(Object3DComponent)) {
      this.removeObject3DComponent();
    }

    return super.removeAllComponents(forceImmediate);
  }

  remove(forceImmediate) {
    if (this.hasComponent(Object3DComponent)) {
      const obj = this.getObject3D();
      obj.traverse((o) => {
        if (o.entity) {
          this._entityManager.removeEntity(o.entity, forceImmediate);
        }
        o.entity = null;
      });
      obj.parent && obj.parent.remove(obj);
    } else {
      this._entityManager.removeEntity(this, forceImmediate);
    }
  }

  getObject3D() {
    const component = this.getComponent(Object3DComponent);
    return component && component.value;
  }
}

import { World, Entity, System, SystemConstructor } from "ecsy";
import { Object3D } from "three";
import { ECSYThreeEntity } from "./entity.js";
import { ECSYThreeSystem } from "./system.js";

export interface Object3DInflator {
  inflate(entity: Entity, obj: Object3D): void
  deflate(entity: Entity, obj: Object3D): void
}

export class ECSYThreeWorld extends World {
  object3DInflator: Object3DInflator;
  getSystem<S extends System>(System: SystemConstructor<S>): ECSYThreeSystem
  getSystems(): Array<ECSYThreeSystem>
  createEntity(name?: string): ECSYThreeEntity;
}

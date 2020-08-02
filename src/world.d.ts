import { World, System, SystemConstructor } from "ecsy";
import { Object3D } from "three";
import { ECSYThreeEntity } from "./entity.js";
import { ECSYThreeSystem } from "./system.js";
import { ThreeTagComponent } from "./components/index.js";

export class ECSYThreeWorld extends World {
  threeTagComponents: ThreeTagComponent[];
  getSystem<S extends System>(System: SystemConstructor<S>): ECSYThreeSystem
  getSystems(): Array<ECSYThreeSystem>
  createEntity(name?: string): ECSYThreeEntity;
  inflateObject3DComponents(entity: ECSYThreeEntity, object3D: Object3D): ECSYThreeEntity
}

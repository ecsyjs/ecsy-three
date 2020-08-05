import { World, System, SystemConstructor } from "ecsy";
import { ECSYThreeEntity } from "./entity.js";
import { ECSYThreeSystem } from "./system.js";

export class ECSYThreeWorld extends World {
  getSystem<S extends System>(System: SystemConstructor<S>): S
  getSystems(): Array<ECSYThreeSystem>
  createEntity(name?: string): ECSYThreeEntity;
}

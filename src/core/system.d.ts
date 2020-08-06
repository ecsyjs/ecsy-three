import { System, Attributes } from "ecsy";
import { ECSYThreeWorld } from "../world.js";
import { ECSYThreeEntity } from "../entity.js";

export abstract class ECSYThreeSystem extends System {
  constructor(world: ECSYThreeWorld, attributes?: Attributes);

  queries: {
    [queryName: string]: {
      results: ECSYThreeEntity[],
      added?: ECSYThreeEntity[],
      removed?: ECSYThreeEntity[],
      changed?: ECSYThreeEntity[],
    }
  }

  world: ECSYThreeWorld;
}
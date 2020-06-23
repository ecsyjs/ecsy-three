export * as THREE from "three";
export * as ECSY from "ecsy";

import * as CORE from "./core/index.js";
import * as EXTRAS from "../extras.js";

export const ECSYTHREE = {
  ...CORE,
  ...EXTRAS
};

import * as THREE from "three";
import { Component } from "ecsy";
import * as ThreeTypes from "../Types.js";

export class Scale extends Component {}
Scale.schema = {
  // @fixme
  value: { default: new THREE.Vector3(), type: ThreeTypes.Vector3Type }
};

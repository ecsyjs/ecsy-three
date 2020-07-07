import * as THREE from "three";
import { Component } from "ecsy";
import { ThreeTypes } from "../../core/Types.js";

export class Scale extends Component {}
Scale.schema = {
  // @fixme
  value: { default: new THREE.Vector3(), type: ThreeTypes.Vector3 }
};

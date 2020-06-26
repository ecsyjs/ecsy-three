import * as THREE from "three";
import { Component } from "ecsy";
import * as ThreeTypes from "../../core/Types.js";

export class Rotation extends Component {}
Rotation.schema = {
  // @fixme
  rotation: { default: new THREE.Vector3(), type: ThreeTypes.Vector3Type }
};

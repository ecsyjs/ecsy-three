import { Component } from "ecsy";
import * as ThreeTypes from "../../core/Types.js";
import * as THREE from "three";

export class Transform extends Component {}

Transform.schema = {
  position: { default: new THREE.Vector3(), type: ThreeTypes.Vector3Type },
  rotation: { default: new THREE.Vector3(), type: ThreeTypes.Vector3Type }
};

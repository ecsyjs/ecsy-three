import { Component } from "ecsy";
import * as ThreeTypes from "../Types.js";
import * as THREE from "three";

export class Position extends Component {}

Position.schema = {
  value: { default: new THREE.Vector3(), type: ThreeTypes.Vector3Type }
};

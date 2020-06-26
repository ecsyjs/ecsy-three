import {Component} from "/web_modules/ecsy.js";
import * as ThreeTypes from "../../core/Types.js";
import * as THREE from "/web_modules/three.js";
export class Transform extends Component {
}
Transform.schema = {
  position: {
    default: new THREE.Vector3(),
    type: ThreeTypes.Vector3Type
  },
  rotation: {
    default: new THREE.Vector3(),
    type: ThreeTypes.Vector3Type
  }
};

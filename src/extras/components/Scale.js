import * as THREE from "/web_modules/three.js";
import {Component} from "/web_modules/ecsy.js";
import * as ThreeTypes from "../../core/Types.js";
export class Scale extends Component {
}
Scale.schema = {
  value: {
    default: new THREE.Vector3(),
    type: ThreeTypes.Vector3Type
  }
};

import {Component} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import * as ThreeTypes from "../../core/Types.js";
import * as THREE from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three.js";
export class Position extends Component {
}
Position.schema = {
  value: {
    default: new THREE.Vector3(),
    type: ThreeTypes.Vector3Type
  }
};

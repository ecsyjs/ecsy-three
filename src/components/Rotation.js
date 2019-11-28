import * as THREE from "three";

export class Rotation {
  constructor() {
    this.rotation = new THREE.Vector3();
  }

  reset() {
    this.rotation.set(0, 0, 0);
  }
}

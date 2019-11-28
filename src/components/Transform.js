import * as THREE from "three";

export class Transform {
  constructor() {
    this.position = new THREE.Vector3();
    this.rotation = new THREE.Vector3();
  }

  copy(src) {
    this.position.copy(src.position);
    this.rotation.copy(src.rotation);
  }

  reset() {
    this.position.set(0, 0, 0);
    this.rotation.set(0, 0, 0);
  }
}

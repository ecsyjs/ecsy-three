import * as THREE from "three";

export class Position {
  constructor() {
    this.value = new THREE.Vector3();
  }

  reset() {
    this.value.set(0, 0, 0);
  }
}

import * as THREE from "three";

export class Position {
  constructor() {
    this.position = new THREE.Vector3();
  }

  reset() {
    this.position.set(0, 0, 0);
  }
}

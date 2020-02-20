export class GLTFLoader {
  constructor() {
    this.reset();
  }

  reset() {
    this.url = "";
    this.receiveShadow = false;
    this.castShadow = false;
    this.envMapOverride = null;
  }
}

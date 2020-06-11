class Object3DTagInflator {
  constructor() {
    this._inflators = [];
  }

  addInflator(fun) {
    this._inflators.push(fun);
  }

  removeInflator(fun) {
    let index = this._inflators.indexOf(fun);
    if (index !== -1) {
      this._inflators.splice(index, 1);
    }
  }

  addTagClassesForObject3D(entity, obj3D) {
    this._inflators.forEach(inflator => inflator(entity, obj3D));
  }

  removeTagClassesForObject3D(entity, obj3D) {
    this._inflators.forEach(inflator => {});
  }
}

export const inflatorManager = new Object3DTagInflator();

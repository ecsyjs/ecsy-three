import { Component, RefPropType } from "ecsy";
import { Object3D } from "three";

export class Object3DComponent extends Component<Object3DComponent> {
  value: Object3D | null;

  static schema: {
    value: { default: null, type: RefPropType<Object3D> }
  };
}

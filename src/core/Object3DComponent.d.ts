import { Component, RefPropType } from "ecsy";
import { Object3D } from "three";

export class Object3DComponent extends Component<Object3DComponent> {
  value?: Object3D;

  static schema: {
    value: { type: RefPropType<Object3D> }
  };
}

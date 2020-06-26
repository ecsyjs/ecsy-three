import { Component, PropType } from "ecsy";
import { Object3D } from "three";

interface Object3DComponentProps {
  value: Object3D
}

export class Object3DComponent extends Component<Object3DComponentProps> {
  static schema: {
    value: { default: null, type: PropType<any> }
  };
}

import { Component, Types } from "ecsy";

export class Object3DComponent extends Component {}

Object3DComponent.schema = {
  value: { default: null, type: Types.Object }
};

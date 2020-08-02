import { Component, Types } from "ecsy";

export class Object3DComponent extends Component {}

Object3DComponent.schema = {
  value: { type: Types.Ref },
};

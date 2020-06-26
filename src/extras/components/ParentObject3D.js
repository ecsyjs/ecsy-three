import { Component, Types } from "ecsy";

export class ParentObject3D extends Component {}
ParentObject3D.schema = {
  value: { default: null, type: Types.Ref }
};

import { Component, Types } from "ecsy";

export class GLTFModel extends Component {}

GLTFModel.schema = {
  value: { default: null, type: Types.Ref }
};

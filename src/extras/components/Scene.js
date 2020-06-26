import { Component, Types } from "ecsy";
export class Scene extends Component {}
Scene.schema = {
  value: { default: null, type: Types.Ref }
};

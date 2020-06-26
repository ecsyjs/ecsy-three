import { Component, Types } from "ecsy";

export class GLTFLoader extends Component {}

GLTFLoader.schema = {
  url: { default: "", type: Types.String },
  receiveShadow: { default: false, type: Types.Boolean },
  castShadow: { default: false, type: Types.Boolean },
  envMapOverride: { default: null, type: Types.Ref },
  append: { default: true, type: Types.Boolean },
  onLoaded: { default: null, type: Types.Ref },
  parent: { default: null, type: Types.Ref }
};

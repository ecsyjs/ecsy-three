import { Component, Types } from "ecsy";

export class Environment extends Component {}
Environment.schema = {
  active: { default: false, type: Types.Boolean },
  preset: { default: "default", type: Types.String },
  seed: { default: 1, type: Types.Number },
  skyType: { default: "atmosphere", type: Types.String },
  skyColor: { default: "", type: Types.String },
  horizonColor: { default: "", type: Types.String },
  lighting: { default: "distant", type: Types.String },
  shadow: { default: false, type: Types.Boolean },
  shadowSize: { default: 10, type: Types.Number },
  lightPosition: { default: { x: 0, y: 1, z: -0.2 }, type: Types.Number },
  fog: { default: 0, type: Types.Number },

  flatShading: { default: false, type: Types.Boolean },
  playArea: { default: 1, type: Types.Number },

  ground: { default: "flat", type: Types.String },
  groundYScale: { default: 3, type: Types.Number },
  groundTexture: { default: "none", type: Types.String },
  groundColor: { default: "#553e35", type: Types.String },
  groundColor2: { default: "#694439", type: Types.String },

  dressing: { default: "none", type: Types.String },
  dressingAmount: { default: 10, type: Types.Number },
  dressingColor: { default: "#795449", type: Types.String },
  dressingScale: { default: 5, type: Types.Number },
  dressingVariance: { default: { x: 1, y: 1, z: 1 }, type: Types.Object },
  dressingUniformScale: { default: true, type: Types.Boolean },
  dressingOnPlayArea: { default: 0, type: Types.Number },

  grid: { default: "none", type: Types.String },
  gridColor: { default: "#ccc", type: Types.String }
};

import * as THREE from "three";
import { Component, Types } from "ecsy";

export const SIDES = {
  front: 0,
  back: 1,
  double: 2
};

export const SHADERS = {
  standard: 0,
  flat: 1
};

export const BLENDING = {
  normal: 0,
  additive: 1,
  subtractive: 2,
  multiply: 3
};

export const VERTEX_COLORS = {
  none: 0,
  face: 1,
  vertex: 2
};

export class Material extends Component {}
Material.schema = {
  color: { default: 0xff0000, type: Types.Number },
  alphaTest: { default: 0, type: Types.Number },
  depthTest: { default: true, type: Types.Boolean },
  depthWrite: { default: true, type: Types.Boolean },
  flatShading: { default: false, type: Types.Boolean },
  npot: { default: false, type: Types.Boolean },
  offset: { default: new THREE.Vector2(), type: Types.Object },
  opacity: { default: 1.0, type: Types.Number },
  repeat: { default: new THREE.Vector2(1, 1), type: Types.Object },
  shader: { default: SHADERS.standard, type: Types.Number },
  side: { default: SIDES.front, type: Types.Number },
  transparent: { default: false, type: Types.Number },
  vertexColors: { default: VERTEX_COLORS.none, type: Types.Number },
  visible: { default: true, type: Types.Number },
  blending: { default: BLENDING.normal, type: Types.Number }
};

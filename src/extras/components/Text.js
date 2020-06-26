import { Component, Types } from "ecsy";

export class Text extends Component {}
Text.schema = {
  text: { default: "", type: Types.String },
  textAlign: { default: "left", type: Types.String }, // ['left', 'right', 'center']
  anchor: { default: "center", type: Types.String }, // ['left', 'right', 'center', 'align']
  baseline: { default: "center", type: Types.String }, // ['top', 'center', 'bottom']
  color: { default: "#FFF", type: Types.String },
  font: { default: "", type: Types.String }, //"https://code.cdn.mozilla.net/fonts/ttf/ZillaSlab-SemiBold.ttf"
  fontSize: { default: 0.2, type: Types.Number },
  letterSpacing: { default: 0, type: Types.Number },
  lineHeight: { default: 0, type: Types.Number },
  maxWidth: { default: Infinity, type: Types.Number },
  overflowWrap: { default: "normal", type: Types.String }, // ['normal', 'break-word']
  whiteSpace: { default: "normal", type: Types.String }, // ['normal', 'nowrap']
  opacity: { default: 1, type: Types.Number }
};

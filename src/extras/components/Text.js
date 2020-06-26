import {Component, Types} from "/web_modules/ecsy.js";
export class Text extends Component {
}
Text.schema = {
  text: {
    default: "",
    type: Types.String
  },
  textAlign: {
    default: "left",
    type: Types.String
  },
  anchor: {
    default: "center",
    type: Types.String
  },
  baseline: {
    default: "center",
    type: Types.String
  },
  color: {
    default: "#FFF",
    type: Types.String
  },
  font: {
    default: "",
    type: Types.String
  },
  fontSize: {
    default: 0.2,
    type: Types.Number
  },
  letterSpacing: {
    default: 0,
    type: Types.Number
  },
  lineHeight: {
    default: 0,
    type: Types.Number
  },
  maxWidth: {
    default: Infinity,
    type: Types.Number
  },
  overflowWrap: {
    default: "normal",
    type: Types.String
  },
  whiteSpace: {
    default: "normal",
    type: Types.String
  },
  opacity: {
    default: 1,
    type: Types.Number
  }
};

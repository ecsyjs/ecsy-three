import { Component } from "ecsy";
import { PropTypes } from "../PropTypes.js";

export class WebGLRenderer extends Component {}

WebGLRenderer.schema = {
  renderer: { type: PropTypes.Object },
  scene: { type: PropTypes.Object },
  camera: { type: PropTypes.Object },
  updateCanvasStyle: { type: PropTypes.Boolean }
};

import { Component } from "ecsy";

export class WebGLRenderer extends Component {}

WebGLRenderer.schema = {
  renderer: { type: Object },
  scene: { type: Object },
  camera: { type: Object },
  updateCanvasStyle: { type: Boolean }
};

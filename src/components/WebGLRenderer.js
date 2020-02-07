export class WebGLRenderer {
  constructor() {
    this.vr = false;
    this.ar = false;
    this.antialias = true;
    this.handleResize = true;
    this.shadowMap = true;
  }

  reset() {}
}

/*
export const WebGLRenderer = createComponentClass(
  {
    vr: { default: true },
    antialias: { default: true },
    handleResize: { default: true },
    shadowMap: { default: false }
  },
  "WebGLRenderer"
);
*/

export class WebGLRenderer {
  constructor() {
    this.vr = false;
    this.ar = false;
    this.antialias = true;
    this.handleResize = true;
    this.gammaInput = true;
    this.gammaOutput = true;
    this.shadowMap = true;
  }
}

/*
export const WebGLRenderer = createComponentClass(
  {
    vr: { default: true },
    antialias: { default: true },
    handleResize: { default: true },
    gammaInput: { default: true },
    gammaOutput: { default: true },
    shadowMap: { default: false }
  },
  "WebGLRenderer"
);
*/

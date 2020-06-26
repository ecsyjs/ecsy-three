import {Component, Types} from "/web_modules/ecsy.js";
export class SkyBox extends Component {
}
SkyBox.schema = {
  textureUrl: {
    default: null,
    type: Types.String
  },
  type: {
    default: 0,
    type: Types.Number
  }
};

import {Component, Types} from "/web_modules/ecsy.js";
export class Sound extends Component {
}
Sound.schema = {
  sound: {
    default: null,
    type: Types.Ref
  },
  url: {
    default: "",
    type: Types.String
  }
};

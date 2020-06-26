import {Component, Types} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
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

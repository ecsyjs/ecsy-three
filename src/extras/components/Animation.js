import {Component, Types} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
export class Animation extends Component {
}
Animation.schema = {
  animations: {
    default: [],
    type: Types.Array
  },
  duration: {
    default: -1,
    type: Types.Number
  }
};

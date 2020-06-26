import {Component, Types} from "/web_modules/ecsy.js";
export class Parent extends Component {
}
Parent.schema = {
  value: {
    default: null,
    type: Types.Ref
  }
};

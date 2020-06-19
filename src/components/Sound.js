import { Component, Types } from "ecsy";

export class Sound extends Component {}

Sound.schema = {
  sound: { default: null, type: Types.Object },
  url: { default: "", type: Types.String }
};

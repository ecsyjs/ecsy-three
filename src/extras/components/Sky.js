import { Component, Types } from "ecsy";

export class Sky extends Component {}
Sky.schema = {
  attribute: { default: 0, type: Types.Number }
};

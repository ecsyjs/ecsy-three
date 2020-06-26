import { Component, Types } from "ecsy";

export class Visible extends Component {}
Visible.schema = {
  value: { default: true, type: Types.Boolean }
};

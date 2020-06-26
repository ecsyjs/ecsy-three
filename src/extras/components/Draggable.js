import { Component, Types } from "ecsy";

export class Draggable extends Component {}
Draggable.schema = {
  value: { default: false, type: Types.Boolean }
};

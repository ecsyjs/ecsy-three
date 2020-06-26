import { Component, Types } from "ecsy";

export class Parent extends Component {}
Parent.schema = {
  value: { default: null, type: Types.Ref }
};

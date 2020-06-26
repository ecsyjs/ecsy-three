import { Component, Types } from "ecsy";

export class OnObject3DAdded extends Component {}
OnObject3DAdded.schema = {
  callback: { default: null, type: Types.Ref }
};

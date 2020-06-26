import { Component, Types } from "ecsy";

export class RigidBody extends Component {}
RigidBody.schema = {
  object: { default: null, type: Types.Ref },
  weight: { default: 0, type: Types.Number },
  restitution: { default: 1, type: Types.Number },
  friction: { default: 1, type: Types.Number },
  linearDamping: { default: 0, type: Types.Number },
  angularDamping: { default: 0, type: Types.Number },
  linearVelocity: { default: { x: 0, y: 0, z: 0 }, type: Types.Ref }
};

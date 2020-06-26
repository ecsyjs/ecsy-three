import { Component, Types } from "ecsy";

export class VRController extends Component {}
VRController.schema = {
  id: { default: 0, type: Types.Number },
  controller: { default: null, type: Types.Ref }
};

export class VRControllerBasicBehaviour extends Component {}
VRControllerBasicBehaviour.schema = {
  select: { default: null, type: Types.Ref },
  selectstart: { default: null, type: Types.Ref },
  selectend: { default: null, type: Types.Ref },

  connected: { default: null, type: Types.Ref },
  disconnected: { default: null, type: Types.Ref },

  squeeze: { default: null, type: Types.Ref },
  squeezestart: { default: null, type: Types.Ref },
  squeezeend: { default: null, type: Types.Ref }
};

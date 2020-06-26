import {System} from "/web_modules/ecsy.js";
import {VRControllerBasicBehaviour, VRController, InputState} from "../components/index.js";
export class InputSystem extends System {
  init() {
    this.world.registerComponent(InputState);
    let entity = this.world.createEntity().addComponent(InputState);
    this.inputStateComponent = entity.getMutableComponent(InputState);
  }
  execute() {
    this.processVRControllers();
  }
  processVRControllers() {
    this.queries.vrcontrollers.added.forEach((entity) => {
      entity.addComponent(VRControllerBasicBehaviour, {
        selectstart: (event) => {
          let state = this.inputStateComponent.vrcontrollers.get(event.target);
          state.selected = true;
          state.prevSelected = false;
        },
        selectend: (event) => {
          let state = this.inputStateComponent.vrcontrollers.get(event.target);
          state.selected = false;
          state.prevSelected = true;
        },
        connected: (event) => {
          this.inputStateComponent.vrcontrollers.set(event.target, {});
        },
        disconnected: (event) => {
          this.inputStateComponent.vrcontrollers.delete(event.target);
        }
      });
    });
    this.inputStateComponent.vrcontrollers.forEach((state) => {
      state.selectStart = state.selected && !state.prevSelected;
      state.selectEnd = !state.selected && state.prevSelected;
      state.prevSelected = state.selected;
    });
  }
}
InputSystem.queries = {
  vrcontrollers: {
    components: [VRController],
    listen: {
      added: true
    }
  }
};

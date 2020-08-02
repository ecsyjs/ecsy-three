import { TagComponent } from "ecsy";

export class ThreeTagComponent extends TagComponent {
  static matchesObject3D() {
    return false;
  }
}

ThreeTagComponent.isThreeTagComponent = true;

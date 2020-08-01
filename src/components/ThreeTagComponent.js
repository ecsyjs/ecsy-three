
import { TagComponent } from "ecsy";

export class ThreeTagComponent extends TagComponent {
  static isThreeTagComponent = true;

  static matchesObject3D(object) {
    return false;
  }
}

import { TagComponent } from "ecsy";
import { Object3D } from "three";

export class ThreeTagComponent extends TagComponent {
  static isThreeTagComponent: boolean;

  static matchesObject3D(object: Object3D): boolean
}
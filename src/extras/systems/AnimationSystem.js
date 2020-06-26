import {System, Component, Types} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import * as THREE from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three.js";
import {Play, Stop, GLTFModel, Animation} from "../components/index.js";
class AnimationMixerComponent extends Component {
}
AnimationMixerComponent.schema = {
  value: {
    default: 0,
    type: Types.Number
  }
};
class AnimationActionsComponent extends Component {
}
AnimationActionsComponent.schema = {
  animations: {
    default: [],
    type: Types.Array
  },
  duration: {
    default: 0,
    type: Types.Number
  }
};
export class AnimationSystem extends System {
  init() {
    this.world.registerComponent(AnimationMixerComponent).registerComponent(AnimationActionsComponent);
  }
  execute(delta) {
    this.queries.entities.added.forEach((entity) => {
      let gltf = entity.getComponent(GLTFModel).value;
      let mixer = new THREE.AnimationMixer(gltf.scene);
      entity.addComponent(AnimationMixerComponent, {
        value: mixer
      });
      let animations = [];
      gltf.animations.forEach((animationClip) => {
        const action = mixer.clipAction(animationClip, gltf.scene);
        action.loop = THREE.LoopOnce;
        animations.push(action);
      });
      entity.addComponent(AnimationActionsComponent, {
        animations,
        duration: entity.getComponent(Animation).duration
      });
    });
    this.queries.mixers.results.forEach((entity) => {
      entity.getComponent(AnimationMixerComponent).value.update(delta);
    });
    this.queries.playClips.results.forEach((entity) => {
      let component = entity.getComponent(AnimationActionsComponent);
      component.animations.forEach((actionClip) => {
        if (component.duration !== -1) {
          actionClip.setDuration(component.duration);
        }
        actionClip.clampWhenFinished = true;
        actionClip.reset();
        actionClip.play();
      });
      entity.removeComponent(Play);
    });
    this.queries.stopClips.results.forEach((entity) => {
      let animations = entity.getComponent(AnimationActionsComponent).animations;
      animations.forEach((actionClip) => {
        actionClip.reset();
        actionClip.stop();
      });
      entity.removeComponent(Stop);
    });
  }
}
AnimationSystem.queries = {
  entities: {
    components: [Animation, GLTFModel],
    listen: {
      added: true
    }
  },
  mixers: {
    components: [AnimationMixerComponent]
  },
  playClips: {
    components: [AnimationActionsComponent, Play]
  },
  stopClips: {
    components: [AnimationActionsComponent, Stop]
  }
};

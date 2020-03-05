import { System } from "ecsy";
import * as THREE from "three";
import { Play, Stop, GLTFModel, Animation } from "../components/index.js";

class AnimationMixerComponent {
  constructor() {}
  reset() {}
}

class AnimationActionsComponent {
  constructor() {
    this.animations = [];
  }
  reset() {}
}

export class AnimationSystem extends System {
  execute(delta) {
    this.queries.entities.added.forEach(entity => {
      let gltf = entity.getComponent(GLTFModel).value;
      let mixer = new THREE.AnimationMixer(gltf.scene);
      entity.addComponent(AnimationMixerComponent, {
        value: mixer
      });

      let animations = [];
      gltf.animations.forEach(animationClip => {
        const action = mixer.clipAction(animationClip, gltf.scene);
        action.loop = THREE.LoopOnce;
        animations.push(action);
      });

      entity.addComponent(AnimationActionsComponent, {
        animations: animations,
        duration: entity.getComponent(Animation).duration
      });
    });

    this.queries.mixers.results.forEach(entity => {
      entity.getComponent(AnimationMixerComponent).value.update(delta);
    });

    this.queries.playClips.results.forEach(entity => {
      let component = entity.getComponent(AnimationActionsComponent);
      component.animations.forEach(actionClip => {
        if (component.duration !== -1) {
          actionClip.setDuration(component.duration);
        }

        actionClip.clampWhenFinished = true;
        actionClip.reset();
        actionClip.play();
      });
      entity.removeComponent(Play);
    });

    this.queries.stopClips.results.forEach(entity => {
      let animations = entity.getComponent(AnimationActionsComponent)
        .animations;
      animations.forEach(actionClip => {
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

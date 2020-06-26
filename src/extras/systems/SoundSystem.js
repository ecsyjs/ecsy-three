import {System} from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/ecsy.js";
import * as THREE from "https:/github.com/mozillareality/ecsy-three#readme/web_modules/three.js";
import {Sound} from "../components/index.js";
import PositionalAudioPolyphonic2 from "../lib/PositionalAudioPolyphonic.js";
export class SoundSystem extends System {
  init() {
    this.listener = new THREE.AudioListener();
  }
  execute() {
    this.queries.sounds.added.forEach((entity) => {
      const component = entity.getMutableComponent(Sound);
      const sound = new PositionalAudioPolyphonic2(this.listener, 10);
      const audioLoader = new THREE.AudioLoader();
      audioLoader.load(component.url, (buffer) => {
        sound.setBuffer(buffer);
      });
      component.sound = sound;
    });
  }
}
SoundSystem.queries = {
  sounds: {
    components: [Sound],
    listen: {
      added: true,
      removed: true,
      changed: true
    }
  }
};

import * as THREE from "three";
import { System } from "ecsy";
import { Scene, Object3DComponent, Environment } from "../components/index.js";

export class EnvironmentSystem extends System {
  execute() {
    this.queries.environments.added.forEach(entity => {
      // stage ground diameter (and sky radius)
      var STAGE_SIZE = 200;

      // create ground
      // update ground, playarea and grid textures.
      var groundResolution = 2048;
      var texMeters = 20; // ground texture of 20 x 20 meters
      var texRepeat = STAGE_SIZE / texMeters;

      var resolution = 64; // number of divisions of the ground mesh

      var groundCanvas = document.createElement("canvas");
      groundCanvas.width = groundResolution;
      groundCanvas.height = groundResolution;
      var groundTexture = new THREE.Texture(groundCanvas);
      groundTexture.wrapS = THREE.RepeatWrapping;
      groundTexture.wrapT = THREE.RepeatWrapping;
      groundTexture.repeat.set(texRepeat, texRepeat);

      this.environmentData = {
        groundColor: "#454545",
        groundColor2: "#5d5d5d"
      };

      var groundctx = groundCanvas.getContext("2d");

      var size = groundResolution;
      groundctx.fillStyle = this.environmentData.groundColor;
      groundctx.fillRect(0, 0, size, size);
      groundctx.fillStyle = this.environmentData.groundColor2;
      var num = Math.floor(texMeters / 2);
      var step = size / (texMeters / 2); // 2 meters == <step> pixels
      for (var i = 0; i < num + 1; i += 2) {
        for (var j = 0; j < num + 1; j++) {
          groundctx.fillRect(
            Math.floor((i + (j % 2)) * step),
            Math.floor(j * step),
            Math.floor(step),
            Math.floor(step)
          );
        }
      }

      groundTexture.needsUpdate = true;

      var groundMaterial = new THREE.MeshLambertMaterial({
        map: groundTexture
      });

      let scene = entity
        .getComponent(Scene)
        .value.getComponent(Object3DComponent).value;
      //scene.add(mesh);
      var geometry = new THREE.PlaneBufferGeometry(
        STAGE_SIZE + 2,
        STAGE_SIZE + 2,
        resolution - 1,
        resolution - 1
      );

      let object = new THREE.Mesh(geometry, groundMaterial);
      object.rotation.x = -Math.PI / 2;
      object.receiveShadow = true;

      entity.addObject3DComponents(object);

      const color = 0x333333;
      const near = 20;
      const far = 100;
      scene.fog = new THREE.Fog(color, near, far);
      scene.background = new THREE.Color(color);
    });
  }
}

EnvironmentSystem.queries = {
  environments: {
    components: [Scene, Environment],
    listen: {
      added: true
    }
  }
};

import { System, SystemStateComponent, Not } from "ecsy";
import { StereoPhotoSphere } from "../components/StereoPhotoSphere.js";
import {
  BoxBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Texture,
  ImageLoader
} from "three";
import { Object3DTag } from "../entities/index.js";

export class StereoPhotoSphereState extends SystemStateComponent {}

StereoPhotoSphereState.schema = {
  photoSphereL: { type: Object },
  photoSphereR: { type: Object }
};

export class StereoPhotoSphereSystem extends System {
  init() {
    this.world.registerComponent(StereoPhotoSphereState, false);
  }

  execute() {
    let entities = this.queries.entities.results;
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i];

      console.log(entity);

      let photoSphere = entity.getComponent(StereoPhotoSphere);

      let geometry = new BoxBufferGeometry(100, 100, 100);
      geometry.scale(1, 1, -1);

      let textures = getTexturesFromAtlasFile(photoSphere.src, 12);

      let materials = [];

      for (let j = 0; j < 6; j++) {
        materials.push(new MeshBasicMaterial({ map: textures[j] }));
      }

      let photoSphereL = new Mesh(geometry, materials);
      photoSphereL.layers.set(1);
      entity.add(photoSphereL);

      let materialsR = [];

      for (let j = 6; j < 12; j++) {
        materialsR.push(new MeshBasicMaterial({ map: textures[j] }));
      }

      let photoSphereR = new Mesh(geometry, materialsR);
      photoSphereR.layers.set(2);
      entity.add(photoSphereR);

      entity.addComponent(StereoPhotoSphereState, {
        photoSphereL,
        photoSphereR
      });
    }
  }
}

function getTexturesFromAtlasFile(atlasImgUrl, tilesNum) {
  let textures = [];

  for (let i = 0; i < tilesNum; i++) {
    textures[i] = new Texture();
  }

  let loader = new ImageLoader();
  loader.load(atlasImgUrl, function(imageObj) {
    let canvas, context;
    let tileWidth = imageObj.height;

    for (let i = 0; i < textures.length; i++) {
      canvas = document.createElement("canvas");
      context = canvas.getContext("2d");
      canvas.height = tileWidth;
      canvas.width = tileWidth;
      context.drawImage(
        imageObj,
        tileWidth * i,
        0,
        tileWidth,
        tileWidth,
        0,
        0,
        tileWidth,
        tileWidth
      );
      textures[i].image = canvas;
      textures[i].needsUpdate = true;
    }
  });

  return textures;
}

StereoPhotoSphereSystem.queries = {
  entities: {
    components: [StereoPhotoSphere, Object3DTag, Not(StereoPhotoSphereState)]
  }
};

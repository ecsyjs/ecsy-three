import { System, Not } from "../../ecsy.module.js";
import { SkyBox, Object3D } from "../components/index.js";
import * as THREE from "../../three.module.js";

export class SkyBoxSystem extends System {
  execute() {
    let entities = this.queries.entities.results;
    for (var i = 0; i < entities.length; i++) {
      var entity = entities[i];

      var skybox = entity.getComponent(SkyBox);

      var group = new THREE.Group();
      var geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
      geometry.scale( 1, 1, - 1 );

      if (skybox.type === 'cubemap-stereo') {
        var textures = getTexturesFromAtlasFile( skybox.textureUrl, 12 );

        var materials = [];

        for ( var i = 0; i < 6; i ++ ) {
  
          materials.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
  
        }
  
        var skyBox = new THREE.Mesh( geometry, materials );
        skyBox.layers.set( 1 );
        group.add(skyBox);
  
        var materialsR = [];
  
        for ( var i = 6; i < 12; i ++ ) {
  
          materialsR.push( new THREE.MeshBasicMaterial( { map: textures[ i ] } ) );
  
        }
  
        var skyBoxR = new THREE.Mesh( geometry, materialsR );
        skyBoxR.layers.set( 2 );
        group.add(skyBoxR);

        entity.addComponent(Object3D, { object: group });
      } else {
        console.warn('Unknown skybox type: ', skybox.type);
      }

    }
  }
}


function getTexturesFromAtlasFile( atlasImgUrl, tilesNum ) {

  var textures = [];

  for ( var i = 0; i < tilesNum; i ++ ) {

    textures[ i ] = new THREE.Texture();

  }

  var loader = new THREE.ImageLoader();
  loader.load( atlasImgUrl, function ( imageObj ) {

    var canvas, context;
    var tileWidth = imageObj.height;

    for ( var i = 0; i < textures.length; i ++ ) {

      canvas = document.createElement( 'canvas' );
      context = canvas.getContext( '2d' );
      canvas.height = tileWidth;
      canvas.width = tileWidth;
      context.drawImage( imageObj, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth );
      textures[ i ].image = canvas;
      textures[ i ].needsUpdate = true;

    }

  } );

  return textures;

}

SkyBoxSystem.queries = {
  entities: {
    components: [SkyBox, Not(Object3D)]
  }
};

import { ECSYThreeWorld } from "/src/index.js";
import { initialize, Parent, SkyBox, SkyBoxSystem } from "/src/extras/index.js";

var world;

init();
animate();

function init() {
  world = new ECSYThreeWorld();

  let data = initialize(world, { vr: true });

  let { scene } = data.entities;

  world.registerSystem(SkyBoxSystem);
  world.registerComponent(SkyBox);

  world
    .createEntity()
    .addComponent(SkyBox, {
      textureUrl: "./textures/sun_temple_stripe_stereo.jpg",
      type: "cubemap-stereo"
    })
    .addComponent(Parent, { value: scene });

  world.execute();
}

function animate() {
  world.execute();
  requestAnimationFrame(animate);
}

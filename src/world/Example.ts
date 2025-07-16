import { BoxGeometry, Mesh, MeshBasicNodeMaterial } from 'three';
import { world } from './World.ts';

export class Example {
  scale = 1;
  rotationSpeed = 0.1;
  mesh = new Mesh(
    new BoxGeometry(this.scale, this.scale, this.scale),
    new MeshBasicNodeMaterial({
      wireframe: true,
    }),
  );

  setup() {
    world.scene.add(this.mesh);

    // Debug
    const debug = world.debug.addFolder({
      title: 'Example',
    });

    const scale = debug.addBinding(this, 'scale', {
      min: 1,
      max: 10,
      step: 0.1,
    });
    scale.on('change', () => {
      this.mesh.scale.set(this.scale, this.scale, this.scale);
    });

    debug.addBinding(this, 'rotationSpeed', {
      min: 0,
      max: 2,
      step: 0.1,
    });
  }

  update() {
    this.mesh.rotation.y +=
      this.rotationSpeed * 2 * Math.PI * (world.time.delta / 1000);
  }
}

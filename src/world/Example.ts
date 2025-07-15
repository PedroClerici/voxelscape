import * as THREE from 'three';
import { world } from "./World.ts";

export class Example {
  scale = 1
  rotationSpeed = 0.1
  mesh = new THREE.Mesh(
    new THREE.BoxGeometry(this.scale, this.scale, this.scale),
    new THREE.MeshBasicMaterial({ wireframe: true })
  )

  setup() {
    world.scene.add(this.mesh)

    // Debug
    const debug = world.debug.addFolder({
      title: 'Example'
    })

    const scale = debug.addBinding(this, 'scale', {
      min: 1, max: 10, step: 0.1
    })
    scale.on('change', () => {
      this.mesh.scale.set(this.scale, this.scale, this.scale)
    })

    debug.addBinding(this, 'rotationSpeed', {
      min: 0.1, max: 1, step: 0.1
    })
  }

  update() {
    this.mesh.rotation.y += this.rotationSpeed / world.time.delta
  }
}
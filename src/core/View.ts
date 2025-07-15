import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { Sizes } from './Sizes.ts';

export class View {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  canvas: HTMLCanvasElement;
  sizes: Sizes;

  constructor(canvas: HTMLCanvasElement, sizes: Sizes) {
    this.canvas = canvas;
    this.sizes = sizes;

    this.camera = new THREE.PerspectiveCamera(
      75,
      this.sizes.width / this.sizes.height,
      0.01,
      1000,
    );
    this.camera.position.set(2, 1, 3);
    this.camera.aspect = this.sizes.width / this.sizes.height;

    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.enableDamping = true;
  }

  resize() {
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.controls.update();
  }
}

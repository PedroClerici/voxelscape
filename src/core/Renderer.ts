import * as THREE from 'three';
import type { View } from './View.ts';
import type { Sizes } from './Sizes.ts';

export class Renderer {
  canvas: HTMLCanvasElement;
  sizes: Sizes;
  instance: THREE.WebGLRenderer;

  constructor(canvas: HTMLCanvasElement, sizes: Sizes) {
    this.canvas = canvas;
    this.sizes = sizes;

    this.instance = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.canvas,
    });
    this.instance.toneMapping = THREE.CineonToneMapping;
    this.instance.toneMappingExposure = 1.75;
    this.instance.shadowMap.enabled = true;
    this.instance.shadowMap.type = THREE.PCFShadowMap;
    this.instance.setClearColor('#221d20');
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update(scene: THREE.Scene, view: View) {
    this.instance.render(scene, view.camera);
  }
}

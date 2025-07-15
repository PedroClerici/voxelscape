import * as THREE from 'three';
import { Sizes } from './Sizes.ts';
import { Time } from './Time.ts';
import { View } from './View.ts';
import { Renderer } from './Renderer.ts';

abstract class World {
  // Will be set by the engine
  scene!: THREE.Scene;
  time!: Time;

  abstract setup(): void;

  abstract update(): void;
}

export class Engine {
  canvas: HTMLCanvasElement;
  sizes: Sizes;
  time = new Time();
  renderer: Renderer;
  view: View;
  scene: THREE.Scene;
  world: World | null = null;

  static World = World;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.sizes = new Sizes();
    this.renderer = new Renderer(this.canvas, this.sizes);
    this.view = new View(this.canvas, this.sizes);
    this.scene = new THREE.Scene();
  }

  resize() {
    this.view.camera.aspect = this.sizes.width / this.sizes.height;
    this.view.camera.updateProjectionMatrix();
    this.renderer.resize();
  }

  update() {
    this.view.update();
    this.renderer.update(this.scene, this.view);
    // biome-ignore lint/style/noNonNullAssertion: Update only occurs when there is a world loaded
    this.world!.update();
  }

  load(world: World) {
    world.scene = this.scene;
    world.time = this.time;
    this.world = world;

    this.world.setup();

    globalThis.addEventListener('resize', () => {
      this.resize();
    });

    this.time.on('tick', () => {
      this.update();
    });
  }
}

import { Engine } from '../core/Engine.ts';
import { Debug } from '../utils/Debug.ts';
import { Example } from './Example.ts';

class World extends Engine.World {
  example = new Example();
  debug = new Debug();

  setup() {
    console.log('Hello, world!');
    this.example.setup();
  }

  update() {
    this.example.update();
  }
}

export const world = new World();

import type { FpsGraphBladeApi } from '@tweakpane/plugin-essentials';
import { Debug } from '../utils/Debug.ts';
import { EventDispatcher } from '../utils/EventDispatcher.ts';

const container = document.querySelector('.engine-debug') as HTMLDivElement;

export class Time extends EventDispatcher<{ tick: null }> {
  start = Date.now();
  current = this.start;
  elapsed = 0;
  delta = 16;
  debug = new Debug({ container });
  fpsGraph = this.debug.addBlade({
    view: 'fpsgraph',
    label: 'FPS',
    rows: 2,
  }) as FpsGraphBladeApi;

  constructor() {
    super();

    globalThis.requestAnimationFrame(() => {
      this.tick();
    });
  }

  tick() {
    this.fpsGraph.begin();

    const currentTime = Date.now();
    this.delta = currentTime - this.current;
    this.current = currentTime;
    this.elapsed = this.current - this.start;

    this.dispatch('tick');

    this.fpsGraph.end();
    globalThis.requestAnimationFrame(() => {
      this.tick();
    });
  }
}

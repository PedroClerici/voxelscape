import { SimplexNoise } from '@three/examples/jsm/math/SimplexNoise';
import {
  BufferAttribute,
  BufferGeometry,
  Mesh,
  MeshMatcapNodeMaterial,
  TextureLoader,
  Vector3,
} from 'three';
import { mulberry } from '@/utils/random.ts';
import { world } from './World.ts';

enum VoxelType {
  Air,
  Stone,
}

export class Chunk {
  size = 16;
  terrain = {
    scale: 30,
    magnitude: 0.5,
    offset: 0.5,
    seed: 'Hello, World!',
  };
  mesh!: Mesh;
  vertices: Vector3[] = [];
  indices: number[] = [];
  uvs: number[] = [];

  private faceCount = 0;
  private voxels: VoxelType[][][] = [];

  setup() {
    // Debug
    const debug = world.debug.addFolder({
      title: 'Chunk',
    });

    debug
      .addBinding(this, 'size', {
        min: 8,
        max: 32,
        step: 1,
      })
      .on('change', () => this.generateMesh());

    debug
      .addBinding(this.terrain, 'scale', { min: 10, max: 100 })
      .on('change', () => this.generateMesh());

    debug
      .addBinding(this.terrain, 'magnitude', { min: 0, max: 1 })
      .on('change', () => this.generateMesh());

    debug
      .addBinding(this.terrain, 'offset', { min: 0, max: 1 })
      .on('change', () => this.generateMesh());

    debug.addBinding(this.terrain, 'seed').on('change', (event) => {
      const formattedValue = event.value.substring(0, 32);
      this.terrain.seed = formattedValue;
      this.generateMesh();
    });

    this.generateMesh();
  }

  initializeTerrain() {
    for (let x = 0; x < this.size; x++) {
      this.voxels[x] = [];
      for (let y = 0; y < this.size; y++) {
        this.voxels[x][y] = [];
        for (let z = 0; z < this.size; z++) {
          this.voxels[x][y][z] = VoxelType.Air;
        }
      }
    }
  }

  generateTerrain() {
    const simplex = new SimplexNoise(mulberry(this.terrain.seed));

    for (let x = 0; x < this.size; x++) {
      for (let z = 0; z < this.size; z++) {
        const value = simplex.noise(
          x / this.terrain.scale,
          z / this.terrain.scale,
        );

        const scaledNoise =
          this.terrain.offset + this.terrain.magnitude * value;

        let height = this.size * scaledNoise;
        height = Math.max(0, Math.min(height, this.size - 1));

        for (let y = 0; y <= height; y++) {
          this.voxels[x][y][z] = VoxelType.Stone;
        }
      }
    }
  }

  addUvs() {
    this.uvs.push(0, 0);
    this.uvs.push(1, 0);
    this.uvs.push(1, 1);
    this.uvs.push(0, 1);
  }

  addTriangles() {
    const currentFace = this.faceCount * 4;
    this.indices.push(currentFace + 0);
    this.indices.push(currentFace + 2);
    this.indices.push(currentFace + 1);

    this.indices.push(currentFace + 0);
    this.indices.push(currentFace + 3);
    this.indices.push(currentFace + 2);

    this.faceCount += 1;
  }

  createVoxelGeometry(position: Vector3) {
    // Top
    if (this.isVoxelAir(new Vector3(0, 1, 0).add(position))) {
      this.vertices.push(new Vector3(-0.5, 0.5, -0.5).add(position));
      this.vertices.push(new Vector3(0.5, 0.5, -0.5).add(position));
      this.vertices.push(new Vector3(0.5, 0.5, 0.5).add(position));
      this.vertices.push(new Vector3(-0.5, 0.5, 0.5).add(position));

      this.addTriangles();
      this.addUvs();
    }

    // East
    if (this.isVoxelAir(new Vector3(1, 0, 0).add(position))) {
      this.vertices.push(new Vector3(0.5, 0.5, 0.5).add(position));
      this.vertices.push(new Vector3(0.5, 0.5, -0.5).add(position));
      this.vertices.push(new Vector3(0.5, -0.5, -0.5).add(position));
      this.vertices.push(new Vector3(0.5, -0.5, 0.5).add(position));

      this.addTriangles();
      this.addUvs();
    }

    // South
    if (this.isVoxelAir(new Vector3(0, 0, 1).add(position))) {
      this.vertices.push(new Vector3(-0.5, 0.5, 0.5).add(position));
      this.vertices.push(new Vector3(0.5, 0.5, 0.5).add(position));
      this.vertices.push(new Vector3(0.5, -0.5, 0.5).add(position));
      this.vertices.push(new Vector3(-0.5, -0.5, 0.5).add(position));

      this.addTriangles();
      this.addUvs();
    }

    // West
    if (this.isVoxelAir(new Vector3(-1, 0, 0).add(position))) {
      this.vertices.push(new Vector3(-0.5, 0.5, -0.5).add(position));
      this.vertices.push(new Vector3(-0.5, 0.5, 0.5).add(position));
      this.vertices.push(new Vector3(-0.5, -0.5, 0.5).add(position));
      this.vertices.push(new Vector3(-0.5, -0.5, -0.5).add(position));

      this.addTriangles();
      this.addUvs();
    }

    // North
    if (this.isVoxelAir(new Vector3(0, 0, -1).add(position))) {
      this.vertices.push(new Vector3(0.5, 0.5, -0.5).add(position));
      this.vertices.push(new Vector3(-0.5, 0.5, -0.5).add(position));
      this.vertices.push(new Vector3(-0.5, -0.5, -0.5).add(position));
      this.vertices.push(new Vector3(0.5, -0.5, -0.5).add(position));

      this.addTriangles();
      this.addUvs();
    }

    // Bottom
    if (this.isVoxelAir(new Vector3(0, -1, 0).add(position))) {
      this.vertices.push(new Vector3(-0.5, -0.5, 0.5).add(position));
      this.vertices.push(new Vector3(0.5, -0.5, 0.5).add(position));
      this.vertices.push(new Vector3(0.5, -0.5, -0.5).add(position));
      this.vertices.push(new Vector3(-0.5, -0.5, -0.5).add(position));

      this.addTriangles();
      this.addUvs();
    }
  }

  generateMesh() {
    if (this.mesh) {
      world.scene.remove(this.mesh);
    }

    this.vertices = [];
    this.uvs = [];
    this.indices = [];
    this.voxels = [];
    this.faceCount = 0;

    this.initializeTerrain();
    this.generateTerrain();

    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        for (let z = 0; z < this.size; z++) {
          if (this.voxels[x][y][z] === VoxelType.Air) {
            continue;
          }

          this.createVoxelGeometry(new Vector3(x, y, z));
        }
      }
    }

    const geometry = new BufferGeometry();

    const positions: number[] = [];
    for (const vertex of this.vertices) {
      positions.push(...vertex.toArray());
    }

    const positionBuffer = new BufferAttribute(new Float32Array(positions), 3);
    const indexBuffer = new BufferAttribute(new Uint16Array(this.indices), 1);
    const uvBuffer = new BufferAttribute(new Float32Array(this.uvs), 2);

    geometry.setAttribute('position', positionBuffer);
    geometry.setAttribute('uv', uvBuffer);
    geometry.setIndex(indexBuffer);

    geometry.computeVertexNormals();
    geometry.computeBoundingBox();

    // const texture = new TextureLoader().load(gridTest);
    // texture.flipY = false;
    const material = new MeshMatcapNodeMaterial();

    this.mesh = new Mesh(geometry, material);
    world.scene.add(this.mesh);

    // Reposition the camera
    const cameraDistance = this.size * 1.5;

    const chunkCenter = new Vector3();
    this.mesh.geometry.boundingBox?.getCenter(chunkCenter);

    world.view.camera.position.set(
      cameraDistance,
      cameraDistance,
      cameraDistance,
    );
    world.view.controls.target = chunkCenter;
  }

  isVoxelAir(position: Vector3) {
    if (position.x < 0 || position.y < 0 || position.z < 0) {
      return true;
    }

    if (
      position.x >= this.size ||
      position.y >= this.size ||
      position.z >= this.size
    ) {
      return true;
    }

    if (this.voxels[position.x][position.y][position.z] === VoxelType.Air) {
      return true;
    }

    return false;
  }
}

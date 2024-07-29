import * as THREE from "three";
import {
  GLTFLoader,
  RGBELoader,
  DRACOLoader,
} from "three/examples/jsm/Addons.js";

import EventEmitter from "./EventEmitter";

export default class Resources extends EventEmitter {
  constructor(sources) {
    super();

    // Options
    this.sources = sources;

    // Setup
    this.items = {};
    this.toLoad = this.sources.length;
    this.loaded = 0;

    this.setLoaders();
    this.startLoading();
  }

  setLoaders() {
    this.loaders = {};

    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("draco");
    
    this.loaders.gltfLoader = new GLTFLoader();
    this.loaders.gltfLoader.setDRACOLoader(dracoLoader);

    this.loaders.textureLoader = new THREE.TextureLoader();
    this.loaders.rgbeLoader = new RGBELoader();
  }

  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case "gltfModel":
          {
            this.loaders.gltfLoader.load(source.path, (file) =>
              this.sourceLoaded(source, file)
            );
          }
          break;

        case "texture":
          {
            this.loaders.textureLoader.load(source.path, (file) =>
              this.sourceLoaded(source, file)
            );
          }
          break;

        case "envTexture":
          {
            this.loaders.rgbeLoader.load(source.path, (file) => {
              this.sourceLoaded(source, file);
            });
          }
          break;

        default:
          break;
      }
    }
  }

  sourceLoaded(source, file) {
    this.items[source.name] = file;
    this.loaded++;

    if (this.loaded === this.toLoad) {
      this.trigger("ready");
    }
  }
}

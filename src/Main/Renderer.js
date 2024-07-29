import * as THREE from "three";

import Main from "./Main";

export default class Renderer {
  constructor() {
    this.main = new Main();
    this.sizes = this.main.sizes;
    this.scene = this.main.scene;
    this.canvas = this.main.canvas;
    this.camera = this.main.camera;
    this.debug = this.main.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("renderer");
    }

    this.setParameters();
    this.setInstance();
  }

  setParameters() {
    this.parameters = {};
    this.parameters.clearColor = "#000e1e";

    if (this.debug.active) {
      this.debugFolder.addColor(this.parameters, "clearColor").onChange(() => {
        this.instance.setClearColor(this.parameters.clearColor);
      });
    }
  }

  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    });

    this.instance.setClearColor(this.parameters.clearColor);
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height);
    this.instance.setPixelRatio(this.sizes.pixelRatio);
  }

  update() {
    this.instance.render(this.scene, this.camera.instance);
  }
}

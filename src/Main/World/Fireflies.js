import * as THREE from "three";

import Main from "../Main";

import firefliesVertexShader from "../../shaders/fireflies/vertex.glsl";
import firefliesFragmentShader from "../../shaders/fireflies/fragment.glsl";

export default class Fireflies {
  constructor() {
    this.main = new Main();
    this.scene = this.main.scene;
    this.time = this.main.time;
    this.sizes = this.main.sizes;
    this.debug = this.main.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("fireflies");
    }

    this.setGeometry();
    this.setAttributes();
    this.setMaterial();
    this.setInstance();
  }

  setGeometry() {
    this.geometry = new THREE.BufferGeometry();
    this.count = 30;
  }

  setAttributes() {
    const positionArray = new Float32Array(this.count * 3);
    const scaleArray = new Float32Array(this.count);

    for (let i = 0; i < this.count; i++) {
      positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
      positionArray[i * 3 + 1] = Math.random() * 1.5;
      positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

      scaleArray[i] = Math.random();
    }

    this.geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positionArray, 3)
    );
    this.geometry.setAttribute(
      "aScale",
      new THREE.BufferAttribute(scaleArray, 1)
    );
  }

  setMaterial() {
    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uPixelRatio: new THREE.Uniform(this.sizes.pixelRatio),
        uSize: new THREE.Uniform(100),
      },
      vertexShader: firefliesVertexShader,
      fragmentShader: firefliesFragmentShader,

      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    if (this.debug.active) {
      this.debugFolder
        .add(this.material.uniforms.uSize, "value", 0, 500, 1)
        .name("firefliesSize");
    }
  }

  setInstance() {
    this.instance = new THREE.Points(this.geometry, this.material);

    this.scene.add(this.instance);
  }

  update() {
    this.material.uniforms.uTime.value = this.time.elapsed * 0.001;
  }
}

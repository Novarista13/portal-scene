import * as THREE from "three";

import Main from "../Main";

import portalVertexShader from "../../shaders/portal/vertex.glsl";
import portalFragmentShader from "../../shaders/portal/fragment.glsl";

export default class Model {
  constructor() {
    this.main = new Main();
    this.scene = this.main.scene;
    this.resources = this.main.resources;
    this.time = this.main.time;
    this.debug = this.main.debug;

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder("portal");
    }

    // Setup
    this.resource = this.resources.items.portal;

    this.setTexture();
    this.setParameters();
    this.setMaterial();
    this.setModel();
  }

  setTexture() {
    this.bakedTexture = this.resources.items.bakedTexture;
    this.bakedTexture.flipY = false;
    this.bakedTexture.colorSpace = THREE.SRGBColorSpace;
  }

  setParameters() {
    this.parameters = {};
    this.parameters.portalColorStart = "#003d8e";
    this.parameters.portalColorEnd = "#c4ddff";

    if (this.debug.active) {
      this.debugFolder
        .addColor(this.parameters, "portalColorStart")
        .onChange(() => {
          this.portalLightMaterial.uniforms.uColorStart.value.set(
            this.parameters.portalColorStart
          );
        });
      this.debugFolder
        .addColor(this.parameters, "portalColorEnd")
        .onChange(() => {
          this.portalLightMaterial.uniforms.uColorEnd.value.set(
            this.parameters.portalColorEnd
          );
        });
    }
  }

  setMaterial() {
    // baked material
    this.bakedMaterial = new THREE.MeshBasicMaterial({
      map: this.bakedTexture,
    });

    // portal light material (color: "#c4ddff", 0xffffff)
    this.portalLightMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: new THREE.Uniform(0),
        uColorStart: new THREE.Uniform(
          new THREE.Color(this.parameters.portalColorStart)
        ),
        uColorEnd: new THREE.Uniform(
          new THREE.Color(this.parameters.portalColorEnd)
        ),
      },
      vertexShader: portalVertexShader,
      fragmentShader: portalFragmentShader,
    });

    // pole light material (0xffffe5)
    this.poleLightMaterial = new THREE.MeshBasicMaterial({
      color: "#ffb599",
    });
  }

  setModel() {
    this.model = this.resource.scene;

    const bakedMesh = this.model.children.find(
      (child) => child.name === "baked"
    );

    // emissions
    const poleLightAMesh = this.model.children.find(
      (child) => child.name === "poleLightA"
    );
    const poleLightBMesh = this.model.children.find(
      (child) => child.name === "poleLightB"
    );
    const portalLightMesh = this.model.children.find(
      (child) => child.name === "portalLight"
    );

    // Apply materials
    bakedMesh.material = this.bakedMaterial;
    poleLightAMesh.material = this.poleLightMaterial;
    poleLightBMesh.material = this.poleLightMaterial;
    portalLightMesh.material = this.portalLightMaterial;

    this.scene.add(this.model);
  }

  update() {
    this.portalLightMaterial.uniforms.uTime.value = this.time.elapsed * 0.001;
  }
}

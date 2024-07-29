import Main from "../Main";
import Model from "./Model";
import Fireflies from "./Fireflies";

export default class World {
  constructor() {
    this.main = new Main();
    this.resources = this.main.resources;

    // Wait for resources
    this.resources.on("ready", () => {
      this.model = new Model();
      this.fireflies = new Fireflies();
    });
  }

  update() {
    if (this.model) this.model.update();
    if (this.fireflies) this.fireflies.update();
  }
}

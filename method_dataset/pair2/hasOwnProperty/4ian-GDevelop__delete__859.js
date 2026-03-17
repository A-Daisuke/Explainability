function __method_wrapper__() {
  delete() {
    // Destroy all instances
    for (let s in this.renderedInstances) {
      let i = Number(s);
      if (this.renderedInstances.hasOwnProperty(i)) {
        const renderedInstance = this.renderedInstances[i];
        renderedInstance.onRemovedFromScene(); // TODO: pass argument to tell it's even worth removing from container?
        delete this.renderedInstances[i];
      }
    }

    // Destroy the container
    this.pixiContainer.destroy();

    // Destroy the object iterating on instances
    this.instancesRenderer.delete();
  }

}

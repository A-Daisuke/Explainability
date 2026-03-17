function __method_wrapper__() {
  resetInstanceRenderersFor(objectName: string) {
    for (let s in this.renderedInstances) {
      let i = Number(s);
      if (this.renderedInstances.hasOwnProperty(i)) {
        const renderedInstance = this.renderedInstances[i];
        if (renderedInstance.getInstance().getObjectName() === objectName) {
          renderedInstance.onRemovedFromScene();
          if (!renderedInstance._wasDestroyed)
            console.error(
              'Rendered instance was not marked as destroyed by onRemovedFromScene - verify the implementation.',
              renderedInstance
            );
          delete this.renderedInstances[i];
        }
      }
    }
  }

}

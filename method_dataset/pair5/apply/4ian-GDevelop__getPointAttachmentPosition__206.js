function __method_wrapper__() {
    getPointAttachmentPosition(
      attachmentName: string,
      slotName?: string
    ): pixi_spine.Vector2 {
      if (!slotName) {
        slotName = attachmentName;
      }
      if (!isSpine(this._rendererObject)) {
        return new pixi_spine.Vector2(
          this._rendererObject.x,
          this._rendererObject.y
        );
      }
      const slot = this._rendererObject.skeleton.findSlot(slotName);
      if (!slot) {
        throw new Error(
          `Unable to find ${slotName} slot name for ${attachmentName} point attachment.`
        );
      }
      const attachment = this._rendererObject.skeleton.getAttachmentByName(
        slotName,
        attachmentName
      );
      if (!isPointAttachment(attachment)) {
        throw new Error(
          `Unable to find ${attachmentName} point attachment with ${slotName} slot name.`
        );
      }

      return new PIXI.Matrix()
        .rotate(this._rendererObject.rotation)
        .scale(this._rendererObject.scale.x, this._rendererObject.scale.y)
        .translate(this._rendererObject.x, this._rendererObject.y)
        .apply(
          attachment.computeWorldPosition(slot.bone, new pixi_spine.Vector2())
        );
    }

}

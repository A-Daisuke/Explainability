function __method_wrapper__() {
	removeChildNow(child, keepalive) {
		if (this.hasChild(child) && this.getChildIndex(child) >= 0) {
			if (typeof child.onDeactivateEvent === "function") {
				child.onDeactivateEvent();
			}

			// remove the body first to avoid a condition where a body can be detached
			// from its parent, before the body is removed from the game world
			if (child.body instanceof Body) {
				this.getRootAncestor().removeBody(child.body);
			}

			if (!keepalive) {
				// attempt at recycling the object
				if (pool.push(child, false) === false) {
					//  else just destroy it
					if (typeof child.destroy === "function") {
						child.destroy();
					}
				}
			}

			// Don't cache the child index; another element might have been removed
			// by the child's `onDeactivateEvent` or `destroy` methods
			const childIndex = this.getChildIndex(child);
			if (childIndex >= 0) {
				this.getChildren().splice(childIndex, 1);
				child.ancestor = undefined;
			}

			// force bounds update if required
			if (this.enableChildBoundsUpdate === true) {
				this.updateBounds();
			}

			// mark the container for repaint
			this.isDirty = true;

			// triggered callback if defined
			this.onChildChange.call(this, childIndex);
		}
	}

}

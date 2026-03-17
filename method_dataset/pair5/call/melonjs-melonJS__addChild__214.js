class __C__ {
	addChild(child, z) {
		if (child.ancestor instanceof Container) {
			child.ancestor.removeChildNow(child);
		} else {
			// only allocate a GUID if the object has no previous ancestor
			// (e.g. move one child from one container to another)
			if (child.isRenderable) {
				// allocated a GUID value (use child.id as based index if defined)
				child.GUID = createGUID(child.id);
			}
		}

		// add the new child
		child.ancestor = this;
		this.getChildren().push(child);

		// update child bounds to reflect the new ancestor
		if (typeof child.updateBounds === "function") {
			if (this.isFloating === true) {
				// only parent container can be floating
				child.floating = false;
			}
			child.updateBounds();
		}

		// set the child z value if required
		if (typeof child.pos !== "undefined") {
			if (typeof z === "number") {
				child.pos.z = z;
			} else if (this.autoDepth === true) {
				child.pos.z = this.getChildren().length;
			}
		}

		if (this.autoSort === true) {
			this.sort();
		}

		if (
			typeof child.onActivateEvent === "function" &&
			this.isAttachedToRoot()
		) {
			child.onActivateEvent();
		}

		// force container bounds update if required
		if (this.enableChildBoundsUpdate === true) {
			this.updateBounds();
		}

		// if a physic body(ies) to the game world
		if (this.isAttachedToRoot()) {
			const worldContainer = this.getRootAncestor();
			if (child.body instanceof Body) {
				worldContainer.addBody(child.body);
			}
			// if the child is a container
			if (child instanceof Container) {
				// add all container child bodies
				// TODO: make it recursive ?
				child.forEach((cchild) => {
					if (cchild.body instanceof Body) {
						worldContainer.addBody(cchild.body);
					}
				});
			}
		}

		// mark the container for repaint
		this.isDirty = true;

		// triggered callback if defined
		this.onChildChange.call(this, this.getChildren().length - 1);

		return child;
	}

}

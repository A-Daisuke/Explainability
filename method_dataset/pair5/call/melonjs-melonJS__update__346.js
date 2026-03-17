function __method_wrapper__() {
	update(dt: number) {
		// the original Tween implementation expect
		// a timestamp and not a time delta
		this._tweenTimeTracker =
			game.lastUpdate > this._tweenTimeTracker
				? game.lastUpdate
				: this._tweenTimeTracker + dt;
		const time = this._tweenTimeTracker;

		if (this._startTime === null || time < this._startTime) {
			return true;
		}

		if (!this._onStartCallbackFired) {
			if (this._onStartCallback !== null) {
				this._onStartCallback.call(this._object);
			}

			this._onStartCallbackFired = true;
		}

		let elapsed = (time - this._startTime) / this._duration;
		elapsed = elapsed > 1 ? 1 : elapsed;

		const value = this._easingFunction(elapsed);

		for (const property in this._valuesEnd) {
			const start = this._valuesStart[property] || 0;
			let end = this._valuesEnd[property];

			if (Array.isArray(end)) {
				// @ts-expect-error todo
				this._object[property] = this._interpolationFunction(end, value);
			} else {
				// Parses relative end values with start as base (e.g.: +10, -3)
				if (typeof end === "string") {
					// @ts-expect-error todo
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
					end = start + parseFloat(end);
				}

				// protect against non numeric properties.
				if (typeof end === "number") {
					// @ts-expect-error todo
					// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
					this._object[property] = start + (end - start) * value;
				}
			}
		}

		if (this._onUpdateCallback !== null) {
			this._onUpdateCallback.call(this._object, value);
		}

		if (elapsed === 1) {
			if (this._repeat > 0) {
				if (isFinite(this._repeat)) {
					this._repeat--;
				}

				// reassign starting values, restart by making startTime = now
				for (const property in this._valuesStartRepeat) {
					if (typeof this._valuesEnd[property] === "string") {
						this._valuesStartRepeat[property] =
							// @ts-expect-error todo
							// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
							this._valuesStartRepeat[property] +
							// @ts-ignore
							parseFloat(this._valuesEnd[property]);
					}

					if (this._yoyo) {
						const tmp = this._valuesStartRepeat[property];
						this._valuesStartRepeat[property] = this._valuesEnd[property];
						this._valuesEnd[property] = tmp;
					}
					this._valuesStart[property] = this._valuesStartRepeat[property];
				}

				if (this._yoyo) {
					this._reversed = !this._reversed;
				}

				this._startTime = time + this._delayTime;

				return true;
			} else {
				// remove the tween from the world container
				game.world.removeChildNow(this);

				if (this._onCompleteCallback !== null) {
					this._onCompleteCallback.call(this._object);
				}

				for (
					let i = 0, numChainedTweens = this._chainedTweens.length;
					i < numChainedTweens;
					i++
				) {
					this._chainedTweens[i].start(time);
				}

				return false;
			}
		}
		return true;
	}

}

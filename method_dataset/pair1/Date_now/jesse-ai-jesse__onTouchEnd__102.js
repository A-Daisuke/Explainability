class __C__ {
    onTouchEnd(targetWindow, e) {
        const timestamp = Date.now(); // use Date.now() because on FF e.timeStamp is not epoch based.
        const activeTouchCount = Object.keys(this.activeTouches).length;
        for (let i = 0, len = e.changedTouches.length; i < len; i++) {
            const touch = e.changedTouches.item(i);
            if (!this.activeTouches.hasOwnProperty(String(touch.identifier))) {
                console.warn('move of an UNKNOWN touch', touch);
                continue;
            }
            const data = this.activeTouches[touch.identifier], holdTime = Date.now() - data.initialTimeStamp;
            if (holdTime < Gesture.HOLD_DELAY
                && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                const evt = this.newGestureEvent(EventType.Tap, data.initialTarget);
                evt.pageX = arrays.tail(data.rollingPageX);
                evt.pageY = arrays.tail(data.rollingPageY);
                this.dispatchEvent(evt);
            }
            else if (holdTime >= Gesture.HOLD_DELAY
                && Math.abs(data.initialPageX - arrays.tail(data.rollingPageX)) < 30
                && Math.abs(data.initialPageY - arrays.tail(data.rollingPageY)) < 30) {
                const evt = this.newGestureEvent(EventType.Contextmenu, data.initialTarget);
                evt.pageX = arrays.tail(data.rollingPageX);
                evt.pageY = arrays.tail(data.rollingPageY);
                this.dispatchEvent(evt);
            }
            else if (activeTouchCount === 1) {
                const finalX = arrays.tail(data.rollingPageX);
                const finalY = arrays.tail(data.rollingPageY);
                const deltaT = arrays.tail(data.rollingTimestamps) - data.rollingTimestamps[0];
                const deltaX = finalX - data.rollingPageX[0];
                const deltaY = finalY - data.rollingPageY[0];
                // We need to get all the dispatch targets on the start of the inertia event
                const dispatchTo = [...this.targets].filter(t => data.initialTarget instanceof Node && t.contains(data.initialTarget));
                this.inertia(targetWindow, dispatchTo, timestamp, // time now
                Math.abs(deltaX) / deltaT, // speed
                deltaX > 0 ? 1 : -1, // x direction
                finalX, // x now
                Math.abs(deltaY) / deltaT, // y speed
                deltaY > 0 ? 1 : -1, // y direction
                finalY // y now
                );
            }
            this.dispatchEvent(this.newGestureEvent(EventType.End, data.initialTarget));
            // forget about this touch
            delete this.activeTouches[touch.identifier];
        }
        if (this.dispatched) {
            e.preventDefault();
            e.stopPropagation();
            this.dispatched = false;
        }
    }

}

  const start = (state: DraggingState) => {
    timings.start('starting fluid scroller');
    invariant(!dragging, 'Cannot start auto scrolling when already started');
    const dragStartTime: number = Date.now();

    let wasScrollNeeded: boolean = false;
    const fakeScrollCallback = () => {
      wasScrollNeeded = true;
    };
    scroll({
      state,
      dragStartTime: 0,
      shouldUseTimeDampening: false,
      scrollWindow: fakeScrollCallback,
      scrollDroppable: fakeScrollCallback,
    });

    dragging = {
      dragStartTime,
      shouldUseTimeDampening: wasScrollNeeded,
    };
    timings.finish('starting fluid scroller');

    // we know an auto scroll is needed - let's do it!
    if (wasScrollNeeded) {
      tryScroll(state);
    }
  };

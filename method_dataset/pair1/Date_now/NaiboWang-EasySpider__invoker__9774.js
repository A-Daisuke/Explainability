      const invoker = (e) => {
          // async edge case vuejs/vue#6566
          // inner click event triggers patch, event handler
          // attached to outer element during patch, and triggered again. This
          // happens because browsers fire microtask ticks between event propagation.
          // this no longer happens for templates in Vue 3, but could still be
          // theoretically possible for hand-written render functions.
          // the solution: we save the timestamp when a handler is attached,
          // and also attach the timestamp to any event that was handled by vue
          // for the first time (to avoid inconsistent event timestamp implementations
          // or events fired from iframes, e.g. #2513)
          // The handler would only fire if the event passed to it was fired
          // AFTER it was attached.
          if (!e._vts) {
              e._vts = Date.now();
          }
          else if (e._vts <= invoker.attached) {
              return;
          }
          callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5 /* ErrorCodes.NATIVE_EVENT_HANDLER */, [e]);
      };

  function get(target, key, isReadonly = false, isShallow = false) {
      // #1772: readonly(reactive(Map)) should return readonly + reactive version
      // of the value
      target = target["__v_raw" /* ReactiveFlags.RAW */];
      const rawTarget = toRaw(target);
      const rawKey = toRaw(key);
      if (!isReadonly) {
          if (key !== rawKey) {
              track(rawTarget, "get" /* TrackOpTypes.GET */, key);
          }
          track(rawTarget, "get" /* TrackOpTypes.GET */, rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = isShallow ? toShallow : isReadonly ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
          return wrap(target.get(key));
      }
      else if (has.call(rawTarget, rawKey)) {
          return wrap(target.get(rawKey));
      }
      else if (target !== rawTarget) {
          // #3602 readonly(reactive(Map))
          // ensure that the nested reactive `Map` can do tracking for itself
          target.get(key);
      }
  }

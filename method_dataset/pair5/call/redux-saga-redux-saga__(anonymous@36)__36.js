function __method_wrapper__() {
test('saga middleware monitoring', async () => {
  let ids = []
  let effects = {}
  let actions = []
  const storeAction = { type: 'STORE_ACTION' }
  const sagaAction = { type: 'SAGA_ACTION' }
  const apiDefs = arrayOfDeferred(2)
  Promise.resolve(1)
    .then(() => apiDefs[0].resolve('api1'))
    .then(() => apiDefs[1].resolve('api2'))

  function api(idx) {
    return apiDefs[idx].promise
  }

  function* child() {
    yield io.call(api, 1)
    yield io.put(sagaAction)
    throw 'child error'
  }

  function* main() {
    try {
      yield io.call(api, 0)
      yield io.race({
        action: io.take('action'),
        call: io.call(child),
      })
    } catch (e) {
      void 0
    }
  }

  const sagaMonitor = createSagaMonitor(ids, effects, actions)
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
  const store = createStore(() => ({}), applyMiddleware(sagaMiddleware))
  store.dispatch(storeAction)
  const task = sagaMiddleware.run(main)
  await task.toPromise()

  const expectedEffects = {
    [ids[0]]: { saga: main, args: [], result: task },
    [ids[1]]: { parentEffectId: ids[0], label: '', effect: io.call(api, 0), result: 'api1' },
    [ids[2]]: {
      parentEffectId: ids[0],
      label: '',
      effect: io.race({ action: io.take('action'), call: io.call(child) }),
      error: 'child error',
    },
    [ids[3]]: { parentEffectId: ids[2], label: 'action', effect: io.take('action'), cancelled: true },
    [ids[4]]: { parentEffectId: ids[2], label: 'call', effect: io.call(child), error: 'child error' },
    [ids[5]]: { parentEffectId: ids[4], label: '', effect: io.call(api, 1), result: 'api2' },
    [ids[6]]: { parentEffectId: ids[4], label: '', effect: io.put(sagaAction), result: sagaAction },
  }

  // sagaMiddleware must notify the saga monitor of Effect creation and resolution
  expect(effects).toEqual(expectedEffects)

  // sagaMiddleware must notify the saga monitor of dispatched actions
  expect(actions).toEqual([storeAction, sagaAction])
})

}

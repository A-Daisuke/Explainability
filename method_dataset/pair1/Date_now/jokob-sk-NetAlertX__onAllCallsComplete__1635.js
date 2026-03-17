const onAllCallsComplete = () => {
  completedCalls = mergeUniqueArrays(getCache('completedCalls').split(','), completedCalls);
  setCache('completedCalls', completedCalls);

  // Check if all necessary strings are initialized
  if (areAllStringsInitialized()) {
    sessionStorage.setItem(sessionStorageKey, "true");
    const millisecondsNow = Date.now();
    sessionStorage.setItem(sessionStorageKey + '_time', millisecondsNow);

    console.log('✔ Cache initialized');
    // setTimeout(() => {
    //   location.reload()
    // }, 10);
   
  } else {
    // If not all strings are initialized, retry initialization
    console.log('❌ Not all strings are initialized. Retrying...');
    executeOnce();
    return;
  }

  // Call any other initialization functions here if needed

};

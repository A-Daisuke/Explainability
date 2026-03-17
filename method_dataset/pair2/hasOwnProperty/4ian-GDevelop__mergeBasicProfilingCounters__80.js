export const mergeBasicProfilingCounters = (
  destination: BasicProfilingCounters,
  source: BasicProfilingCounters
): BasicProfilingCounters => {
  for (const objectName in source.instanceCounters) {
    if (source.instanceCounters.hasOwnProperty(objectName)) {
      const instanceCounter = source.instanceCounters[objectName];
      let destinationInstanceCounter = destination.instanceCounters[objectName];
      if (!destinationInstanceCounter) {
        destinationInstanceCounter = destination.instanceCounters[
          objectName
        ] = {
          updateCount: 0,
          totalUpdateTime: 0,
        };
      }
      destinationInstanceCounter.updateCount += instanceCounter.updateCount;
      destinationInstanceCounter.totalUpdateTime +=
        instanceCounter.totalUpdateTime;
    }
  }
  destination.totalInstancesUpdateCount += source.totalInstancesUpdateCount;
  destination.totalInstancesUpdateTime += source.totalInstancesUpdateTime;
  destination.totalPixiRenderingTime += source.totalPixiRenderingTime;
  destination.totalPixiUiRenderingTime += source.totalPixiUiRenderingTime;
  destination.totalThreeRenderingTime += source.totalThreeRenderingTime;
  return destination;
};

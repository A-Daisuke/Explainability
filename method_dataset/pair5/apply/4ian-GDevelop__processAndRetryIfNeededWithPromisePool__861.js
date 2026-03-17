  const processAndRetryIfNeededWithPromisePool = async <T, U>(
    items: Array<T>,
    maxConcurrency: number,
    maxAttempt: number,
    asyncFunction: (item: T) => Promise<U>
  ): Promise<PromisePoolOutput<T, U>> => {
    const output = await processWithPromisePool<T, U>(
      items,
      maxConcurrency,
      asyncFunction
    );
    if (output.errors.length !== 0) {
      logger.warn("Some assets couldn't be downloaded. Trying again now.");
    }
    for (
      let attempt = 1;
      attempt < maxAttempt && output.errors.length !== 0;
      attempt++
    ) {
      const retryOutput = await processWithPromisePool<T, U>(
        items,
        maxConcurrency,
        asyncFunction
      );
      output.results.push.apply(output.results, retryOutput.results);
      output.errors = retryOutput.errors;
    }
    return output;
  };

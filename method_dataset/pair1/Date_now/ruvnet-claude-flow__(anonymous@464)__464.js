function __method_wrapper__() {
  it('should handle multiple concurrent spec creations efficiently', async () => {
    const startTime = Date.now();
    const concurrentSpecs = 3;
    
    const promises = Array.from({ length: concurrentSpecs }, (_, i) =>
      coordinator.createSpec(`concurrent-spec-${i}`, `Concurrent test spec ${i}`)
    );
    
    await Promise.all(promises);
    
    const duration = Date.now() - startTime;
    const avgTimePerSpec = duration / concurrentSpecs;
    
    // Should be more efficient than sequential execution
    expect(avgTimePerSpec).toBeLessThan(90000); // < 1.5 minutes per spec on average
  }, 300000);

}

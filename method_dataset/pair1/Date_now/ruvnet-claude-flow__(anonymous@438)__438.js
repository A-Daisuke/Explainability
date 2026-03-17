function __method_wrapper__() {
  it('should initialize swarm within performance target (< 5 seconds)', async () => {
    const startTime = Date.now();
    
    const testCoordinator = new MaestroSwarmCoordinator(
      (coordinator as any).config,
      eventBus,
      logger
    );
    
    await testCoordinator.initialize();
    const duration = Date.now() - startTime;
    
    expect(duration).toBeLessThan(5000);
    
    await testCoordinator.shutdown();
  });

}

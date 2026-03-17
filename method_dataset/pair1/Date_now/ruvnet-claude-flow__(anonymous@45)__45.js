function __method_wrapper__() {
    test('should provide comprehensive health check response', async () => {
      const healthResult = await healthCheckManager.performHealthCheck();
      
      expect(healthResult).toBeDefined();
      expect(healthResult.status).toMatch(/^(healthy|warning|unhealthy)$/);
      expect(healthResult.timestamp).toBeLessThanOrEqual(Date.now());
      expect(healthResult.uptime).toBeGreaterThan(0);
      
      // Validate component health
      expect(healthResult.components).toBeDefined();
      expect(Array.isArray(healthResult.components)).toBe(true);
      
      // Each component should have required properties
      healthResult.components.forEach(component => {
        expect(component).toHaveProperty('name');
        expect(component).toHaveProperty('status');
        expect(component).toHaveProperty('responseTime');
        expect(['healthy', 'warning', 'unhealthy']).toContain(component.status);
        expect(typeof component.responseTime).toBe('number');
      });
      
      // Validate system metrics
      expect(healthResult.metrics).toBeDefined();
      expect(healthResult.metrics.memory).toBeDefined();
      expect(healthResult.metrics.cpu).toBeDefined();
      expect(typeof healthResult.metrics.memory.used).toBe('number');
      expect(typeof healthResult.metrics.memory.total).toBe('number');
    });

}

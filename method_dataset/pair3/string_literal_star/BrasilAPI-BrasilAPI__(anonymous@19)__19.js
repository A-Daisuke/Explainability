function __method_wrapper__() {
    it('deve lidar corretamente com pre-flight CORS request', async () => {
      const response = await axios.options(url, {
        headers: {
          Origin: 'http://exemplo.com',
          'Access-Control-Request-Method': 'GET',
          'Access-Control-Request-Headers': 'Content-Type, Authorization',
        },
      });

      expect(response.headers['access-control-allow-origin']).toBe('*');
      expect(response.headers['access-control-allow-methods']).toContain(
        'GET,HEAD,PUT,PATCH,POST,DELETE'
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Content-Type'
      );
      expect(response.headers['access-control-allow-headers']).toContain(
        'Authorization'
      );
      expect(response.status).toBe(204);
    });

}

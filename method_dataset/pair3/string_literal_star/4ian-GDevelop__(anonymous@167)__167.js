function __method_wrapper__() {
      (async () => {
        try {
          // Try to get the file from IndexedDB
          const fileRecord = await getBrowserSWPreviewFile(relativePath);

          if (!fileRecord) {
            console.warn(
              '[ServiceWorker] File not found in IndexedDB:',
              relativePath
            );
            return new Response(
              'File not found in browser SW preview storage',
              {
                status: 404,
                headers: {
                  'Content-Type': 'text/plain',
                },
              }
            );
          }

          // Return the file with appropriate headers
          return new Response(fileRecord.bytes, {
            status: 200,
            headers: {
              'Content-Type':
                fileRecord.contentType || 'application/octet-stream',
              // Prevent caching to ensure latest version is always served
              'Cache-Control': 'no-store, no-cache, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
              // CORS headers for cross-origin requests if needed
              'Access-Control-Allow-Origin': '*',
            },
          });
        } catch (error) {
          console.error(
            '[ServiceWorker] Error serving browser SW preview file:',
            relativePath,
            error
          );
          return new Response(
            'Error loading file from browser SW preview storage: ' +
              error.message,
            {
              status: 500,
              headers: {
                'Content-Type': 'text/plain',
              },
            }
          );
        }
      })()

}

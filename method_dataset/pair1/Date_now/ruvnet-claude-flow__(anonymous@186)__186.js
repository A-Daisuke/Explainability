function __method_wrapper__() {
      claudeProcess.on('close', (code) => {
        const duration = Date.now() - startTime;
        
        // Parse output for summary
        let summary = 'Step completed';
        try {
          if (output.includes('"type":"message"')) {
            const lines = output.split('\n');
            for (const line of lines) {
              if (line.includes('"type":"message"')) {
                const parsed = JSON.parse(line);
                if (parsed.content && parsed.content[0]) {
                  summary = parsed.content[0].text?.slice(0, 100) || summary;
                  break;
                }
              }
            }
          } else {
            summary = output.slice(0, 100);
          }
        } catch (e) {
          // Fallback to raw output
          summary = output.slice(0, 100);
        }

        resolve({
          success: code === 0,
          duration,
          summary,
          stream: !isLast ? streamOutput : null
        });
      });

}

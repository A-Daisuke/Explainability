        function onSTAT(reqid, path) {
          if (path !== '/tmp/foo.txt')
            return sftp.status(reqid, STATUS_CODE.FAILURE);

          let mode = constants.S_IFREG; // Regular file
          mode |= constants.S_IRWXU; // Read, write, execute for user
          mode |= constants.S_IRWXG; // Read, write, execute for group
          mode |= constants.S_IRWXO; // Read, write, execute for other
          sftp.attrs(reqid, {
            mode: mode,
            uid: 0,
            gid: 0,
            size: 3,
            atime: Date.now(),
            mtime: Date.now(),
          });
        }

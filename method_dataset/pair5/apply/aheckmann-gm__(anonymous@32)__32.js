function __method_wrapper__() {
      this.orientation({bufferStream: true}, function (err, orientation) {
        if (err) return callback(err);

        var transforms = exifTransforms[orientation.toLowerCase()];
        if (transforms) {

          // remove any existing transforms that might conflict
          var index = this._out.indexOf(transforms[0]);
          if (~index) {
            this._out.splice(index, transforms.length);
          }

          // repage to fix coordinates
          this._out.unshift.apply(this._out, transforms.concat('-page', '+0+0'));
        }

        callback();
      });

}

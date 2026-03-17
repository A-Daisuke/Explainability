function __method_wrapper__() {
          hover={monitor => {
            const { y } = monitor.getClientOffset();
            // Use a cached version of container position to avoid recomputing bounding rectangle.
            // Doing this, the position is computed every second the user hovers the target.
            const containerYPosition = memoized(
              Math.floor(Date.now() / 1000),
              getContainerYPosition
            );
            if (containerYPosition) {
              setWhereToDrop(
                y - containerYPosition.y <= containerYPosition.height / 2
                  ? 'before'
                  : 'after'
              );
            }
          }}

}

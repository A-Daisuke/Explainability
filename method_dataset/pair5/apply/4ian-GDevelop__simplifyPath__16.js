    export const simplifyPath = (
      sourceVertices: FloatPoint[],
      maxGap: float,
      simplifiedVertices: FloatPoint[] = [],
      workingVertices: FloatPoint[] = []
    ): FloatPoint[] => {
      if (sourceVertices.length <= 2) {
        simplifiedVertices.length = 0;
        simplifiedVertices.push.apply(simplifiedVertices, sourceVertices);
        return simplifiedVertices;
      }
      const maxGapSq = maxGap * maxGap;

      // We start with only one rope part.
      // Stretch a rope between the start and the end of the path.
      let previousStepVertices: FloatPoint[] = workingVertices;
      previousStepVertices.length = 0;
      previousStepVertices.push(sourceVertices[0]);
      previousStepVertices.push(sourceVertices[sourceVertices.length - 1]);

      do {
        simplifiedVertices.length = 0;
        simplifiedVertices.push(previousStepVertices[0]);

        // For each part of the rope...
        let sourceIndex = 0;
        for (
          let previousStepVerticesIndex = 0;
          previousStepVerticesIndex + 1 < previousStepVertices.length;
          previousStepVerticesIndex++
        ) {
          const startVertex = previousStepVertices[previousStepVerticesIndex];
          const endVertex = previousStepVertices[previousStepVerticesIndex + 1];

          const startX = startVertex[0];
          const startY = startVertex[1];
          const endX = endVertex[0];
          const endY = endVertex[1];

          // Search the furthest vertex from the rope part.
          let maxDeviationSq = maxGapSq;
          let maxDeviationVertex: FloatPoint | null = null;
          // The first and last vertices of the rope part are not checked.
          for (
            sourceIndex++;
            sourceVertices[sourceIndex] !== endVertex;
            sourceIndex++
          ) {
            const sourceVertex = sourceVertices[sourceIndex];

            const deviationSq = gdjs.pathfinding.getPointSegmentDistanceSq(
              sourceVertex[0],
              sourceVertex[1],
              startX,
              startY,
              endX,
              endY
            );
            if (deviationSq > maxDeviationSq) {
              maxDeviationSq = deviationSq;
              maxDeviationVertex = sourceVertex;
            }
          }
          // Add the furthest vertex to the rope.
          // The current rope part is split in 2 for the next step.
          if (maxDeviationVertex) {
            simplifiedVertices.push(maxDeviationVertex);
          }
          simplifiedVertices.push(endVertex);
        }

        const swapVertices = previousStepVertices;
        previousStepVertices = simplifiedVertices;
        simplifiedVertices = swapVertices;
      } while (
        // Stop when no new vertex were added.
        // It means that the maxGap constraint is fulfilled.
        // Otherwise, iterate over the full path once more.
        simplifiedVertices.length !== previousStepVertices.length
      );
      return simplifiedVertices;
    };

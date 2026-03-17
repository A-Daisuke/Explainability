function __method_wrapper__() {
  public async train(
    trainingData: TrainingData,
    validationData?: TrainingData
  ): Promise<{
    finalAccuracy: number;
    trainingHistory: Array<{
      epoch: number;
      loss: number;
      accuracy: number;
      validationLoss?: number;
      validationAccuracy?: number;
    }>;
    bestModel: {
      weights: Map<string, number[]>;
      biases: Map<string, number[]>;
    };
  }> {
    if (this.isTraining) {
      throw new Error('Training already in progress');
    }

    this.isTraining = true;
    this.emit('training-started', { trainingData, validationData });

    try {
      const trainingHistory: Array<{
        epoch: number;
        loss: number;
        accuracy: number;
        validationLoss?: number;
        validationAccuracy?: number;
      }> = [];

      let bestAccuracy = 0;
      let bestWeights = new Map(this.weights);
      let bestBiases = new Map(this.biases);
      let patienceCounter = 0;

      // Training loop
      for (let epoch = 0; epoch < this.trainingConfig.epochs; epoch++) {
        this.trainingState.epoch = epoch;
        
        // Forward pass and backpropagation
        const { loss, accuracy } = await this.trainEpoch(trainingData);
        
        // Validation
        let validationLoss: number | undefined;
        let validationAccuracy: number | undefined;
        
        if (validationData) {
          const validationResults = await this.validateModel(validationData);
          validationLoss = validationResults.loss;
          validationAccuracy = validationResults.accuracy;
        }

        // Update training state
        this.trainingState.loss = loss;
        this.trainingState.accuracy = accuracy;
        this.trainingState.validationLoss = validationLoss;
        this.trainingState.validationAccuracy = validationAccuracy;

        const epochResult = {
          epoch,
          loss,
          accuracy,
          validationLoss,
          validationAccuracy,
        };
        trainingHistory.push(epochResult);

        // Check for improvement
        const currentAccuracy = validationAccuracy || accuracy;
        if (currentAccuracy > bestAccuracy + this.trainingConfig.earlyStoping.minDelta) {
          bestAccuracy = currentAccuracy;
          bestWeights = new Map(this.weights);
          bestBiases = new Map(this.biases);
          patienceCounter = 0;
        } else {
          patienceCounter++;
        }

        // Early stopping
        if (
          this.trainingConfig.earlyStoping.enabled &&
          patienceCounter >= this.trainingConfig.earlyStoping.patience
        ) {
          console.log(`Early stopping at epoch ${epoch}`);
          break;
        }

        // Learning rate scheduling
        if (epoch > 0 && epoch % 20 === 0) {
          this.trainingConfig.learningRate *= 0.9;
          this.trainingState.learningRate = this.trainingConfig.learningRate;
        }

        this.emit('epoch-completed', epochResult);
      }

      // Restore best model
      this.weights = bestWeights;
      this.biases = bestBiases;
      
      // Update graph metadata
      this.graph.metadata.lastTraining = Date.now();

      const result = {
        finalAccuracy: bestAccuracy,
        trainingHistory,
        bestModel: {
          weights: bestWeights,
          biases: bestBiases,
        },
      };

      this.emit('training-completed', result);
      return result;

    } finally {
      this.isTraining = false;
    }
  }

}

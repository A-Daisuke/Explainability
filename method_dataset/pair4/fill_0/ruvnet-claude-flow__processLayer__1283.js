function __method_wrapper__() {
  private processLayer(
    input: number[],
    weights: number[],
    biases: number[],
    config: GNNLayerConfig
  ): number[] {
    // Matrix multiplication: input * weights + biases
    const output = new Array(config.outputDim).fill(0);
    
    for (let i = 0; i < config.outputDim; i++) {
      let sum = biases[i] || 0;
      for (let j = 0; j < input.length; j++) {
        const weightIndex = j * config.outputDim + i;
        sum += input[j] * (weights[weightIndex] || 0);
      }
      output[i] = this.applyActivation(sum, config.activation);
    }
    
    // Apply dropout during training
    if (this.isTraining && config.dropout > 0) {
      for (let i = 0; i < output.length; i++) {
        if (Math.random() < config.dropout) {
          output[i] = 0;
        }
      }
    }
    
    return output;
  }

}

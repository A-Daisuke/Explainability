function __method_wrapper__() {
  async proveRange(value: number, min: number, max: number): Promise<{
    commitment: string;
    rangeProof: string;
    bulletproof: string;
  }> {
    if (value < min || value > max) {
      throw new Error('Value outside specified range');
    }

    const commitment = this.crypto.hash(`${value}_${Date.now()}`);
    
    // Create range proof (simplified bulletproof)
    const rangeData = `${value}_${min}_${max}_${commitment}`;
    const rangeProof = this.crypto.hash(rangeData);
    
    // Generate bulletproof-style proof
    const bulletproof = this.crypto.hash(`bulletproof_${rangeData}_${this.crypto.generateNonce()}`);

    return { commitment, rangeProof, bulletproof };
  }

}

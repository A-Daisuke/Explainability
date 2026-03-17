function __method_wrapper__() {
  public convertToGraph(
    domains: Array<{
      id: string;
      name: string;
      type: DomainNode['type'];
      metadata: any;
    }>,
    relationships: Array<{
      source: string;
      target: string;
      type: DomainEdge['type'];
      weight?: number;
      metadata?: any;
    }>
  ): DomainGraph {
    // Clear existing graph
    this.graph.nodes.clear();
    this.graph.edges.clear();

    // Convert domains to nodes
    for (const domain of domains) {
      const node: DomainNode = {
        id: domain.id,
        name: domain.name,
        type: domain.type,
        features: this.extractDomainFeatures(domain),
        metadata: {
          size: domain.metadata?.size || 1,
          complexity: domain.metadata?.complexity || 0.5,
          stability: domain.metadata?.stability || 0.8,
          dependencies: domain.metadata?.dependencies || [],
          lastUpdated: domain.metadata?.lastUpdated || Date.now(),
          version: domain.metadata?.version || '1.0.0',
        },
        activation: 0,
        embedding: this.initializeNodeEmbedding(domain.id),
      };
      
      this.graph.nodes.set(domain.id, node);
    }

    // Convert relationships to edges
    for (const rel of relationships) {
      const edgeId = `${rel.source}->${rel.target}`;
      const edge: DomainEdge = {
        source: rel.source,
        target: rel.target,
        weight: rel.weight || 1.0,
        type: rel.type,
        features: this.extractEdgeFeatures(rel),
        metadata: {
          frequency: rel.metadata?.frequency || 1,
          latency: rel.metadata?.latency || 100,
          reliability: rel.metadata?.reliability || 0.99,
          bandwidth: rel.metadata?.bandwidth || 1000,
          direction: rel.metadata?.direction || 'unidirectional',
        },
      };
      
      this.graph.edges.set(edgeId, edge);
    }

    // Update graph metadata
    this.graph.metadata.totalNodes = this.graph.nodes.size;
    this.graph.metadata.totalEdges = this.graph.edges.size;
    this.graph.metadata.lastTraining = 0; // Reset training timestamp

    this.emit('graph-updated', this.graph);
    return this.graph;
  }

}

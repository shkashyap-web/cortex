import { KnowledgeGraph, KnowledgeGraphNode, KnowledgeGraphEdge } from '@/types';
import { MOCK_KNOWLEDGE_GRAPH } from '@/data/knowledgeGraph';
import { observabilityService } from '../observability/ObservabilityService';

export class KnowledgeGraphService {
  private static instance: KnowledgeGraphService;

  private constructor() {}

  public static getInstance(): KnowledgeGraphService {
    if (!KnowledgeGraphService.instance) {
      KnowledgeGraphService.instance = new KnowledgeGraphService();
    }
    return KnowledgeGraphService.instance;
  }

  public async getGraph(): Promise<KnowledgeGraph> {
    return observabilityService.measure('KnowledgeGraphService', 'getGraph', async () => {
      return MOCK_KNOWLEDGE_GRAPH;
    });
  }

  public async getNeighbors(nodeId: string): Promise<{ node: KnowledgeGraphNode; edge: KnowledgeGraphEdge }[]> {
    return observabilityService.measure('KnowledgeGraphService', 'getNeighbors', async () => {
      const edges = MOCK_KNOWLEDGE_GRAPH.edges.filter(e => e.source === nodeId || e.target === nodeId);
      const neighbors: { node: KnowledgeGraphNode; edge: KnowledgeGraphEdge }[] = [];

      edges.forEach(edge => {
        const neighborId = edge.source === nodeId ? edge.target : edge.source;
        const node = MOCK_KNOWLEDGE_GRAPH.nodes.find(n => n.id === neighborId);
        if (node) {
          neighbors.push({ node, edge });
        }
      });

      return neighbors;
    });
  }
}

export const knowledgeGraphService = KnowledgeGraphService.getInstance();
export default knowledgeGraphService;

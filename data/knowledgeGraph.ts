import { KnowledgeGraph } from '@/types';

export const MOCK_KNOWLEDGE_GRAPH: KnowledgeGraph = {
  nodes: [
    { id: 'NODE-CUST-001', type: 'Customer', label: 'Aditya Birla', properties: { segment: 'HNI', creditRating: 'AAA' } },
    { id: 'NODE-CUST-002', type: 'Customer', label: 'Rohan Sharma', properties: { segment: 'RETAIL', creditRating: 'A' } },
    { id: 'NODE-CUST-003', type: 'Customer', label: 'Priya Patel', properties: { segment: 'CORPORATE', creditRating: 'AA' } },
    { id: 'NODE-CUST-004', type: 'Customer', label: 'Rajesh Kumar', properties: { segment: 'RETAIL', creditRating: 'C' } },
    { id: 'NODE-MSME-001', type: 'MSME', label: 'Patel Agro Industries Ltd', properties: { industry: 'AGRICULTURE', revenue: 45000000 } },
    { id: 'NODE-MSME-002', type: 'MSME', label: 'TechVeda Solutions Pvt Ltd', properties: { industry: 'TECHNOLOGY', revenue: 120000000 } },
    { id: 'NODE-MSME-003', type: 'MSME', label: 'Nutan Apparels', properties: { industry: 'MANUFACTURING', revenue: 15000000 } },
    { id: 'NODE-GUAR-001', type: 'Guarantor', label: 'Dinesh Patel', properties: { relation: 'Father of Priya Patel', collateralAssigned: true } },
    { id: 'NODE-COLL-001', type: 'Collateral', label: 'Bandra Residential Flat', properties: { estimatedValue: 25000000 } },
    { id: 'NODE-LOC-001', type: 'Location', label: 'Mumbai, MH', properties: { riskTier: 'LOW' } },
    { id: 'NODE-LOC-002', type: 'Location', label: 'Ahmedabad, GJ', properties: { riskTier: 'LOW' } }
  ],
  edges: [
    { id: 'EDGE-001', source: 'NODE-CUST-003', target: 'NODE-MSME-001', label: 'OWNED_BY', weight: 1.0, properties: { percentageShare: 80 } },
    { id: 'EDGE-002', source: 'NODE-CUST-001', target: 'NODE-MSME-002', label: 'OWNED_BY', weight: 1.0, properties: { percentageShare: 65 } },
    { id: 'EDGE-003', source: 'NODE-CUST-002', target: 'NODE-MSME-003', label: 'OWNED_BY', weight: 1.0, properties: { percentageShare: 90 } },
    { id: 'EDGE-004', source: 'NODE-GUAR-001', target: 'NODE-MSME-001', label: 'GUARANTOR_FOR', weight: 0.8, properties: { guaranteeCapLimit: 10000000 } },
    { id: 'EDGE-005', source: 'NODE-CUST-001', target: 'NODE-COLL-001', label: 'OWNER_OF', weight: 1.0, properties: {} },
    { id: 'EDGE-006', source: 'NODE-CUST-001', target: 'NODE-LOC-001', label: 'LOCATED_IN', weight: 1.0, properties: {} },
    { id: 'EDGE-007', source: 'NODE-MSME-001', target: 'NODE-LOC-002', label: 'LOCATED_IN', weight: 1.0, properties: {} },
    { id: 'EDGE-008', source: 'NODE-MSME-001', target: 'NODE-MSME-002', label: 'TRANSACTED_WITH', weight: 0.65, properties: { totalTxnValue: 12000000, frequency: 'MONTHLY' } }
  ]
};
export function getMockKnowledgeGraph(): KnowledgeGraph {
  return MOCK_KNOWLEDGE_GRAPH;
}

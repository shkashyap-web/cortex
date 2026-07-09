'use client';

import React, { useState } from 'react';
import WorkspaceHeader from '@/components/WorkspaceHeader';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { MOCK_KNOWLEDGE_GRAPH } from '@/data/knowledgeGraph';
import { Network, ArrowRight } from 'lucide-react';

export default function KnowledgeGraphPage() {
  const wsConfig = workspaceRegistryService.getWorkspaceByRoute('/knowledge-graph');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  if (!wsConfig) return <div>Workspace config not found.</div>;

  const { nodes, edges } = MOCK_KNOWLEDGE_GRAPH;
  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const connectedEdges = selectedNodeId ? edges.filter(e => e.source === selectedNodeId || e.target === selectedNodeId) : [];
  const connectedNodes = connectedEdges.map(e => {
    const neighborId = e.source === selectedNodeId ? e.target : e.source;
    return { node: nodes.find(n => n.id === neighborId), edge: e };
  }).filter(r => r.node);

  const nodeTypeColor: Record<string, string> = {
    Customer: 'border-emerald-800 text-emerald-400',
    MSME: 'border-indigo-800 text-indigo-400',
    Guarantor: 'border-amber-800 text-amber-400',
    Collateral: 'border-zinc-700 text-zinc-400',
    Location: 'border-sky-800 text-sky-400',
  };

  return (
    <div className="space-y-6">
      <WorkspaceHeader config={wsConfig} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* Node Directory */}
        <div className="lg:col-span-1 border border-zinc-800 bg-zinc-950 rounded p-4 space-y-3">
          <h2 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5"><Network size={12} /> Graph Nodes</span>
            <span className="text-[10px] text-zinc-500 font-normal">{nodes.length} entities</span>
          </h2>
          <div className="space-y-1.5">
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id === selectedNodeId ? null : node.id)}
                className={`w-full text-left p-3 rounded border text-xs transition-colors ${
                  node.id === selectedNodeId
                    ? 'border-emerald-700/60 bg-emerald-950/15'
                    : 'border-zinc-900 bg-zinc-900/30 hover:border-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 truncate">{node.label}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded border font-bold ${nodeTypeColor[node.type as string] || 'border-zinc-700 text-zinc-400'}`}>
                    {node.type}
                  </span>
                </div>
                <p className="text-[9px] text-zinc-600 mt-0.5">{node.id}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Edge Explorer / Node Detail */}
        <div className="lg:col-span-2 space-y-5">
          {selectedNode ? (
            <>
              {/* Node Detail Card */}
              <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">{selectedNode.label}</h3>
                    <p className="text-[10px] text-zinc-500">{selectedNode.id}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${nodeTypeColor[selectedNode.type as string] || 'border-zinc-700 text-zinc-400'}`}>
                    {selectedNode.type}
                  </span>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider mb-2">Node Properties</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(selectedNode.properties).map(([k, v]) => (
                      <div key={k} className="bg-zinc-900/50 border border-zinc-900 p-2.5 rounded">
                        <p className="text-[9px] text-zinc-500 uppercase">{k}</p>
                        <p className="text-xs text-zinc-300 font-semibold mt-0.5">{String(v)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connected Relationships */}
              <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-3">
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2">
                  Graph Relationships ({connectedNodes.length})
                </h3>
                {connectedNodes.length === 0 ? (
                  <p className="text-xs text-zinc-600 text-center py-4">No relationships found for this node.</p>
                ) : (
                  <div className="space-y-2">
                    {connectedNodes.map(({ node: neighbor, edge }, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-zinc-900/40 border border-zinc-900 rounded text-xs">
                        <span className="font-semibold text-zinc-400">{selectedNode.label}</span>
                        <ArrowRight size={12} className="text-zinc-600 flex-shrink-0" />
                        <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-emerald-400 rounded text-[9px] font-bold">{edge.label}</span>
                        <ArrowRight size={12} className="text-zinc-600 flex-shrink-0" />
                        <span className="font-semibold text-zinc-200">{neighbor?.label}</span>
                        {edge.weight && (
                          <span className="ml-auto text-[9px] text-zinc-600">weight: {edge.weight}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="border border-zinc-800 bg-zinc-950 rounded p-6 h-64 flex flex-col items-center justify-center text-center space-y-3">
              <Network size={32} className="text-zinc-700" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-zinc-400">Select a Node to Explore Relationships</p>
                <p className="text-[10px] text-zinc-600">
                  {edges.length} total graph edges registered across {nodes.length} entities.
                </p>
              </div>
            </div>
          )}

          {/* All Edges Summary */}
          <div className="border border-zinc-800 bg-zinc-950 rounded p-5 space-y-3">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest border-b border-zinc-900 pb-2">
              All Graph Edges ({edges.length})
            </h3>
            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {edges.map(edge => {
                const src = nodes.find(n => n.id === edge.source);
                const tgt = nodes.find(n => n.id === edge.target);
                return (
                  <div key={edge.id} className="flex items-center gap-2 text-[10px] py-1.5 border-b border-zinc-900/50">
                    <span className="text-zinc-400 truncate w-28">{src?.label}</span>
                    <span className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-500 rounded flex-shrink-0">{edge.label}</span>
                    <span className="text-zinc-400 truncate w-28">{tgt?.label}</span>
                    {edge.weight && <span className="ml-auto text-zinc-600 flex-shrink-0">{edge.weight}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

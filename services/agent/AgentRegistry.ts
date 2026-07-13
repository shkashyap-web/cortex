/**
 * Agent Registry
 * ---------------------------------------------------------------------------
 * Core Engine: Agent Registry (AI_ENGINEERING_RULES.md Section 4 & 12).
 *
 * Responsibility
 * --------------
 * Registers AI Agent plugins and makes them discoverable by capability or
 * supported event. Agents are plugins: nothing in CORTEX hardcodes agent
 * execution — the Decision Engine (and, as of Milestone 2, the Context
 * Engine) resolve which agent to use entirely through this registry.
 *
 * Milestone 2 additions (existing methods/signatures unchanged):
 * - unregisterAgent(): runtime removal, mirroring registerAgent().
 * - discoverAgentsByEvent(): resolves agents by EventType, complementing
 *   the existing capability-based discovery.
 * - updateAgentHealth(): tracks operational health (HEALTHY/DEGRADED/
 *   UNHEALTHY) distinct from AgentStatus (IDLE/BUSY/OFFLINE/SUSPENDED).
 * - Event Bus integration: registration, unregistration, and health
 *   changes now publish to the Enterprise Event Bus so other engines can
 *   react without this registry calling them directly.
 */

import { AgentPluginMetadata, AgentStatus, AgentHealthStatus, IAgentRegistry, EventType } from '@/types';
import { AGENT_REGISTRY } from '@/config/agents';
import { observabilityService } from '../observability/ObservabilityService';
import { eventBus } from '../event-bus/EventBus';

export class AgentRegistryService implements IAgentRegistry {
  private static instance: AgentRegistryService;
  private agents: Map<string, AgentPluginMetadata> = new Map();

  private constructor() {
    // Bootstrap static config agents
    AGENT_REGISTRY.forEach(agent => {
      this.agents.set(agent.id, agent);
    });
  }

  public static getInstance(): AgentRegistryService {
    if (!AgentRegistryService.instance) {
      AgentRegistryService.instance = new AgentRegistryService();
    }
    return AgentRegistryService.instance;
  }

  /**
   * Registers a new dynamic agent plugin.
   */
  public registerAgent(agent: AgentPluginMetadata): void {
    if (this.agents.has(agent.id)) {
      console.warn(`[AgentRegistry] Agent "${agent.id}" already registered. Overwriting metadata.`);
    }
    this.agents.set(agent.id, agent);
    console.log(`[AgentRegistry] Dynamically registered Agent Plugin: "${agent.name}" (ID: ${agent.id}, Version: ${agent.version})`);

    observabilityService.recordExecution('agent-registry', 'registerAgent', {
      agentId: agent.id,
      name: agent.name
    });

    void eventBus.publish({
      id: `EVT-AGT-${Math.random().toString(36).substr(2, 9)}`,
      type: 'AgentRegistered',
      timestamp: new Date().toISOString(),
      source: 'agent-registry',
      payload: { agentId: agent.id, name: agent.name },
      correlationId: `CORR-AGT-${agent.id}`
    });
  }

  /**
   * Unregisters an agent plugin by ID.
   */
  public unregisterAgent(agentId: string): boolean {
    const existed = this.agents.delete(agentId);

    if (existed) {
      console.log(`[AgentRegistry] Unregistered Agent Plugin: "${agentId}"`);

      observabilityService.recordExecution('agent-registry', 'unregisterAgent', { agentId });

      void eventBus.publish({
        id: `EVT-AGT-${Math.random().toString(36).substr(2, 9)}`,
        type: 'AgentUnregistered',
        timestamp: new Date().toISOString(),
        source: 'agent-registry',
        payload: { agentId },
        correlationId: `CORR-AGT-${agentId}`
      });
    }

    return existed;
  }

  /**
   * Discovers an agent by its supported capabilities.
   * Results are sorted by priority (ascending — lower value first).
   */
  public discoverAgentsByCapability(capability: string): AgentPluginMetadata[] {
    return this.getAllAgents()
      .filter(agent => agent.capabilities.includes(capability as any) && agent.status !== 'OFFLINE')
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Discovers agents that subscribe to a given EventType.
   * Results are sorted by priority (ascending — lower value first).
   */
  public discoverAgentsByEvent(eventType: EventType): AgentPluginMetadata[] {
    return this.getAllAgents()
      .filter(agent => agent.supportedEvents.includes(eventType) && agent.status !== 'OFFLINE')
      .sort((a, b) => a.priority - b.priority);
  }

  /**
   * Update the operational status of an agent.
   */
  public updateAgentStatus(agentId: string, status: AgentStatus): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.status = status;
    this.agents.set(agentId, agent);
    console.log(`[AgentRegistry] Updated status of agent "${agentId}" to: ${status}`);
    return true;
  }

  /**
   * Update the operational health of an agent and notify the Event Bus.
   * Distinct from updateAgentStatus: health reflects whether the agent is
   * functioning correctly, not what it is currently doing.
   */
  public updateAgentHealth(agentId: string, health: AgentHealthStatus): boolean {
    const agent = this.agents.get(agentId);
    if (!agent) return false;

    agent.health = health;
    this.agents.set(agentId, agent);
    console.log(`[AgentRegistry] Updated health of agent "${agentId}" to: ${health}`);

    void eventBus.publish({
      id: `EVT-AGT-${Math.random().toString(36).substr(2, 9)}`,
      type: 'AgentHealthChanged',
      timestamp: new Date().toISOString(),
      source: 'agent-registry',
      payload: { agentId, health, status: agent.status },
      correlationId: `CORR-AGT-${agentId}`
    });

    return true;
  }

  /**
   * Returns a list of all registered agents.
   */
  public getAllAgents(): AgentPluginMetadata[] {
    return Array.from(this.agents.values());
  }

  /**
   * Find agent by ID.
   */
  public getAgent(id: string): AgentPluginMetadata | undefined {
    return this.agents.get(id);
  }
}

export const agentRegistryService = AgentRegistryService.getInstance();
export default agentRegistryService;

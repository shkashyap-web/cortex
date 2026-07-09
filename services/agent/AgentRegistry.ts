import { AgentPluginMetadata, AgentStatus } from '@/types';
import { AGENT_REGISTRY } from '@/config/agents';

export class AgentRegistryService {
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
  }

  /**
   * Discovers an agent by its supported capabilities.
   */
  public discoverAgentsByCapability(capability: string): AgentPluginMetadata[] {
    return this.getAllAgents().filter(agent =>
      agent.capabilities.includes(capability as any) && agent.status !== 'OFFLINE'
    );
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

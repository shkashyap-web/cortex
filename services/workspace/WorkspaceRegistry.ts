import { WorkspaceConfig, SidebarGroup } from '@/types';
import { WORKSPACE_REGISTRY } from '@/config/workspaces';
import { rbacService } from '../rbac/RBACService';

export class WorkspaceRegistryService {
  private static instance: WorkspaceRegistryService;
  private workspaces: Map<string, WorkspaceConfig> = new Map();

  private constructor() {
    // Bootstrap from static configuration
    WORKSPACE_REGISTRY.forEach(ws => {
      this.workspaces.set(ws.id, ws);
    });
  }

  public static getInstance(): WorkspaceRegistryService {
    if (!WorkspaceRegistryService.instance) {
      WorkspaceRegistryService.instance = new WorkspaceRegistryService();
    }
    return WorkspaceRegistryService.instance;
  }

  /**
   * Register a new workspace dynamically (Pluggable interface).
   */
  public registerWorkspace(config: WorkspaceConfig): void {
    if (this.workspaces.has(config.id)) {
      console.warn(`[WorkspaceRegistry] Workspace ID "${config.id}" is already registered. Overwriting.`);
    }
    this.workspaces.set(config.id, config);
    console.log(`[WorkspaceRegistry] Dynamically registered workspace: "${config.title}" -> ${config.route}`);
  }

  /**
   * Retrieve all registered workspaces.
   */
  public getAllWorkspaces(): WorkspaceConfig[] {
    return Array.from(this.workspaces.values());
  }

  /**
   * Retrieve active workspaces that the current user has permission to see.
   */
  public getAuthorizedWorkspaces(): WorkspaceConfig[] {
    return this.getAllWorkspaces().filter(ws => {
      if (!ws.isEnabled) return false;
      return ws.permissions.every(perm => rbacService.checkPermission(perm));
    });
  }

  /**
   * Retrieve authorized workspaces grouped by sidebar groups.
   */
  public getGroupedWorkspaces(): Record<SidebarGroup, WorkspaceConfig[]> {
    const authorized = this.getAuthorizedWorkspaces();
    const groups: Record<SidebarGroup, WorkspaceConfig[]> = {
      intelligence: [],
      operations: [],
      management: [],
      system: []
    };

    authorized.forEach(ws => {
      if (groups[ws.sidebarGroup]) {
        groups[ws.sidebarGroup].push(ws);
      }
    });

    return groups;
  }

  /**
   * Find workspace by its route path.
   */
  public getWorkspaceByRoute(route: string): WorkspaceConfig | undefined {
    return this.getAllWorkspaces().find(ws => ws.route === route);
  }
}

export const workspaceRegistryService = WorkspaceRegistryService.getInstance();
export default workspaceRegistryService;

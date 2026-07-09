import { AccessControlContext, Role, Permission } from '@/types';
import { ROLE_PERMISSIONS, hasPermission } from '@/config/rbac';
import { WORKSPACE_REGISTRY } from '@/config/workspaces';

export class RBACService {
  private static instance: RBACService;
  private currentContext: AccessControlContext;

  private constructor() {
    // Default session context (starts as Executive for demonstration)
    this.currentContext = {
      userId: 'EMP-EXC-001',
      role: 'Executive',
      permissions: ROLE_PERMISSIONS['Executive'],
      branchId: 'BR-MUMBAI-01',
      allowedWorkspaces: this.calculateAllowedWorkspaces('Executive')
    };
  }

  public static getInstance(): RBACService {
    if (!RBACService.instance) {
      RBACService.instance = new RBACService();
    }
    return RBACService.instance;
  }

  /**
   * Return the active access control context.
   */
  public getContext(): AccessControlContext {
    return this.currentContext;
  }

  /**
   * Dynamically switch the simulated active role (for demonstration and settings menu).
   */
  public switchRole(role: Role, userId: string = 'SIMULATOR-USER'): AccessControlContext {
    const permissions = ROLE_PERMISSIONS[role] || [];
    this.currentContext = {
      userId,
      role,
      permissions,
      branchId: role === 'Customer' ? undefined : 'BR-MUMBAI-01',
      allowedWorkspaces: this.calculateAllowedWorkspaces(role)
    };
    
    console.log(`[RBAC] User switched to simulated role: "${role}"`);
    return this.currentContext;
  }

  /**
   * Check if the active role has a specific permission.
   */
  public checkPermission(permission: Permission): boolean {
    return hasPermission(this.currentContext.role, permission);
  }

  /**
   * Check if a specific workspace route is allowed for the active role.
   */
  public isWorkspaceAllowed(route: string): boolean {
    const workspace = WORKSPACE_REGISTRY.find(w => w.route === route);
    if (!workspace) return false;
    if (!workspace.isEnabled) return false;
    
    // Check if user has all required permissions for the workspace
    return workspace.permissions.every(perm => this.checkPermission(perm));
  }

  /**
   * Calculates allowed workspaces for a role.
   */
  private calculateAllowedWorkspaces(role: Role): string[] {
    return WORKSPACE_REGISTRY.filter(w => {
      if (!w.isEnabled) return false;
      return w.permissions.every(perm => hasPermission(role, perm));
    }).map(w => w.id);
  }
}

export const rbacService = RBACService.getInstance();
export default rbacService;

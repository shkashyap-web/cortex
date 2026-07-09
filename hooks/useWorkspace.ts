'use client';

import { useRBAC } from './useRBAC';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';
import { WorkspaceConfig, SidebarGroup } from '@/types';

export function useWorkspace() {
  const { context } = useRBAC(); // Dependency on RBAC context forces update on role switch

  const getAuthorizedWorkspaces = (): WorkspaceConfig[] => {
    return workspaceRegistryService.getAuthorizedWorkspaces();
  };

  const getGroupedWorkspaces = (): Record<SidebarGroup, WorkspaceConfig[]> => {
    return workspaceRegistryService.getGroupedWorkspaces();
  };

  const isRouteAllowed = (route: string): boolean => {
    const ws = workspaceRegistryService.getWorkspaceByRoute(route);
    if (!ws) return false;
    return ws.permissions.every(perm => context.permissions.includes(perm) || context.permissions.includes('read:all'));
  };

  return {
    getAuthorizedWorkspaces,
    getGroupedWorkspaces,
    isRouteAllowed,
    activeRole: context.role
  };
}

'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Role, Permission, AccessControlContext } from '@/types';
import { rbacService } from '@/services/rbac/RBACService';

interface RBACContextType {
  context: AccessControlContext;
  switchRole: (role: Role) => void;
  checkPermission: (permission: Permission) => boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [context, setContext] = useState<AccessControlContext>(rbacService.getContext());

  const switchRole = (role: Role) => {
    const nextContext = rbacService.switchRole(role);
    setContext(nextContext);
  };

  const checkPermission = (permission: Permission): boolean => {
    return rbacService.checkPermission(permission);
  };

  return (
    <RBACContext.Provider value={{ context, switchRole, checkPermission }}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  return context;
};

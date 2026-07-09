'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { workspaceRegistryService } from '@/services/workspace/WorkspaceRegistry';

export const Breadcrumbs: React.FC = () => {
  const pathname = usePathname();
  if (pathname === '/' || pathname === '/overview') {
    return (
      <div className="flex items-center text-xs text-zinc-500 font-mono">
        <span>CORTEX</span>
        <ChevronRight size={12} className="mx-1.5" />
        <span className="text-zinc-300">Overview</span>
      </div>
    );
  }

  const parts = pathname.split('/').filter(Boolean);
  const breadcrumbItems = parts.map((part, index) => {
    const route = '/' + parts.slice(0, index + 1).join('/');
    const workspace = workspaceRegistryService.getWorkspaceByRoute(route);
    return {
      title: workspace ? workspace.title : part.charAt(0).toUpperCase() + part.slice(1),
      route
    };
  });

  return (
    <div className="flex items-center text-xs text-zinc-500 font-mono">
      <Link href="/overview" className="hover:text-zinc-300">
        CORTEX
      </Link>
      {breadcrumbItems.map((item, index) => {
        const isLast = index === breadcrumbItems.length - 1;
        return (
          <React.Fragment key={item.route}>
            <ChevronRight size={12} className="mx-1.5" />
            {isLast ? (
              <span className="text-zinc-300 font-semibold">{item.title}</span>
            ) : (
              <Link href={item.route} className="hover:text-zinc-300">
                {item.title}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
export default Breadcrumbs;

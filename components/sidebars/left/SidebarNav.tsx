'use client';

/**
 * SidebarNav
 *
 * Responsibilities:
 * - Render vertical icon navigation
 * - Handle active state
 * - Emit mode changes upward
 *
 * IMPORTANT:
 * - No business logic
 * - No catalog knowledge
 * - No drag logic
 */

import clsx from 'clsx';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/* Types */
/* ------------------------------------------------------------------ */

export interface SidebarNavItem<T extends string> {
  id: T;
  icon: LucideIcon;
  label: string;
}

export interface SidebarNavProps<T extends string> {
  active: T;
  items: SidebarNavItem<T>[];
  onChange: (id: T) => void;
}

/* ------------------------------------------------------------------ */
/* Component */
/* ------------------------------------------------------------------ */

export default function SidebarNav<T extends string>({
  active,
  items,
  onChange,
}: SidebarNavProps<T>) {
  return (
    <nav className="mt-6 flex flex-col items-center gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            aria-label={item.label}
            title={item.label}
            className={clsx(
              'group relative flex h-10 w-10 items-center justify-center rounded-lg transition',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            )}
          >
            <Icon className="h-5 w-5" />

            {/* Tooltip */}
            <span
              className={clsx(
                'pointer-events-none absolute left-12 whitespace-nowrap rounded-md bg-[#1A1A1A] px-2 py-1 text-xs text-white shadow-lg border border-white/10',
                'opacity-0 translate-x-1 transition-all',
                'group-hover:opacity-100 group-hover:translate-x-0'
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

'use client';
import { cn } from '@/app/lib/utils';
import { Settings, Car, GitMerge } from 'lucide-react';

interface ModeSwitcherProps {
  mode: 'manual' | 'auto' | 'hybrid';
  onChange: (mode: 'manual' | 'auto' | 'hybrid') => void;
}

export function ModeSwitcher({ mode, onChange }: ModeSwitcherProps) {
  const tabs = [
    { id: 'manual', label: 'Manual Rating', icon: Settings },
    { id: 'auto', label: 'Smart Auto-Map', icon: Car },
    { id: 'hybrid', label: 'Hybrid Mode', icon: GitMerge },
  ] as const;

  return (
    <div className="relative flex w-full rounded-xl bg-slate-100 p-1 shadow-inner">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = mode === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative z-10 flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-colors',
              isActive ? 'text-emerald-700' : 'text-slate-500 hover:text-slate-700'
            )}
            aria-pressed={isActive}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
      <div
        className="absolute bottom-1 top-1 z-0 rounded-lg bg-white shadow transition-all duration-300 ease-out"
        style={{
          width: 'calc(33.333% - 4px)',
          transform: `translateX(${mode === 'manual' ? '4px' : mode === 'auto' ? 'calc(100% + 4px)' : 'calc(200% + 4px)'})`,
        }}
      />
    </div>
  );
}

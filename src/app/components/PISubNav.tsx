import { Home, ClipboardList, LayoutDashboard } from 'lucide-react';

export type PISection = 'home' | 'pips' | 'dashboard';

const PI_TABS = [
  { id: 'home'      as PISection, label: 'Home',       icon: Home            },
  { id: 'pips'      as PISection, label: 'PIPS Cases', icon: ClipboardList   },
  { id: 'dashboard' as PISection, label: 'Dashboard',  icon: LayoutDashboard },
];

interface PISubNavProps {
  active: PISection;
  onChange: (s: PISection) => void;
}

export function PISubNav({ active, onChange }: PISubNavProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 flex items-center gap-1 h-9 flex-shrink-0">
      {PI_TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            active === id
              ? 'bg-teal-600 text-white shadow-sm'
              : 'text-gray-500 hover:bg-gray-200 hover:text-gray-700'
          }`}
        >
          <Icon size={11} />
          {label}
        </button>
      ))}
    </div>
  );
}

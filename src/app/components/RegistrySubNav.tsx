import { Home } from 'lucide-react';

export type RegistrySection = 'home';

const REGISTRY_TABS = [
  { id: 'home' as RegistrySection, label: 'Home', icon: Home },
];

interface RegistrySubNavProps {
  active: RegistrySection;
  onChange: (s: RegistrySection) => void;
}

export function RegistrySubNav({ active, onChange }: RegistrySubNavProps) {
  return (
    <div className="bg-gray-50 border-b border-gray-200 px-6 flex items-center gap-1 h-9 flex-shrink-0">
      {REGISTRY_TABS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
            active === id
              ? 'bg-red-600 text-white shadow-sm'
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

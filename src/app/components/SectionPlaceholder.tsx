import { LucideIcon, Settings, Users, Tag, Calendar, Bell, Key, FileSearch } from 'lucide-react';

interface CardConfig {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface SectionConfig {
  icon: LucideIcon;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  hoverBg: string;
  title: string;
  subtitle: string;
  cards: CardConfig[];
}

type PISection = 'admin';

const CONFIGS: { pi: Record<PISection, SectionConfig> } = {
  pi: {
    admin: {
      icon: Settings,
      iconColor: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-100',
      hoverBg: 'hover:bg-teal-50/20',
      title: 'PI Administration',
      subtitle: 'Configure workflows, user assignments, and module settings',
      cards: [
        {
          icon: Users,
          title: 'PI Nurse Assignments',
          description: 'Assign PI nurses to trauma cases and manage workload distribution across the review team.',
        },
        {
          icon: Tag,
          title: 'Flag Type Configuration',
          description: 'Define and manage quality flag types, severity levels, and associated review workflows.',
        },
        {
          icon: Calendar,
          title: 'Review Cycle Settings',
          description: 'Configure M&M and TPRC review cycle schedules, deadlines, and notification triggers.',
        },
        {
          icon: Bell,
          title: 'Notification Rules',
          description: 'Set up automated alerts for flag assignments, overdue reviews, and upcoming conference dates.',
        },
        {
          icon: Key,
          title: 'Access Control',
          description: 'Manage role-based permissions for PI nurses, physicians, and administrative staff.',
        },
        {
          icon: FileSearch,
          title: 'Audit Log',
          description: 'View a full history of module activity including flag edits, review completions, and config changes.',
        },
      ],
    },
  },
};

interface SectionPlaceholderProps {
  module: 'pi';
  section: string;
}

export function SectionPlaceholder({ module, section }: SectionPlaceholderProps) {
  const moduleConfigs = CONFIGS[module];
  const config = moduleConfigs[section as PISection];

  if (!config) return null;

  const {
    iconColor,
    bgColor,
    borderColor,
    hoverBg,
    title,
    subtitle,
    cards,
  } = config;

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">{title}</h1>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {cards.map(({ icon: Icon, title: cardTitle, description }) => (
            <div
              key={cardTitle}
              className={`bg-white rounded-xl border ${borderColor} p-5 flex flex-col gap-3 ${hoverBg} transition-all cursor-pointer`}
            >
              <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center flex-shrink-0`}>
                <Icon size={15} className={iconColor} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{cardTitle}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { UserCheck, Lock, CalendarClock, Bell, ArrowLeftRight, ClipboardList } from 'lucide-react';

const CARDS = [
  {
    icon: UserCheck,
    title: 'Registry Nurse Assignments',
    desc: 'Assign cases to registry nurses, manage workload, and configure coverage rotations.',
  },
  {
    icon: Lock,
    title: 'Access Control',
    desc: 'Role-based permissions for registry nurses, coordinators, trauma medical directors, and auditors.',
  },
  {
    icon: CalendarClock,
    title: 'Submission Deadlines',
    desc: 'Configure TQIP, NTDB, and state registry submission windows and automated reminder rules.',
  },
  {
    icon: Bell,
    title: 'Notification Settings',
    desc: 'Alerts for approaching deadlines, validation error thresholds, and missing data cutoffs.',
  },
  {
    icon: ArrowLeftRight,
    title: 'Data Import / Export',
    desc: 'Bulk data import from other systems, and export to CSV/XML for external analysis.',
  },
  {
    icon: ClipboardList,
    title: 'Audit Log',
    desc: 'Complete audit trail of field edits, approvals, and configuration changes with user attribution.',
  },
];

export function RegistryAdmin() {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">Registry Administration</h1>
          <p className="text-xs text-gray-400 mt-0.5">Configure registry settings, user access, and data governance</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">{title}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

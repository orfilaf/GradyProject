import { List, BookOpen, Calculator, BookMarked, ShieldCheck, History } from 'lucide-react';

const CARDS = [
  {
    icon: List,
    title: 'Field Definitions',
    desc: 'Full list of all 192 registry fields with data types, required status, and accepted values.',
  },
  {
    icon: BookOpen,
    title: 'ICD-10 Coding Reference',
    desc: 'Diagnosis and procedure coding lookup with trauma-specific guidance and examples.',
  },
  {
    icon: Calculator,
    title: 'AIS / ISS Calculator',
    desc: 'Abbreviated Injury Scale body region coding reference with automatic ISS calculation rules.',
  },
  {
    icon: BookMarked,
    title: 'NTDB Data Dictionary',
    desc: 'Official National Trauma Data Bank data element specifications and submission rules.',
  },
  {
    icon: ShieldCheck,
    title: 'Validation Rules',
    desc: 'Field-level validation logic: required conditions, range checks, and cross-field dependencies.',
  },
  {
    icon: History,
    title: 'Change History',
    desc: 'Log of data dictionary updates, field deprecations, and new element additions by version.',
  },
];

export function RegistryDictionary() {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">Data Dictionary</h1>
          <p className="text-xs text-gray-400 mt-0.5">Field definitions, coding references, and registry data standards</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-red-100 p-5 flex flex-col gap-3 hover:bg-red-50/20 transition-all cursor-pointer">
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

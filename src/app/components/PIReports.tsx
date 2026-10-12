import { Users, BookOpen, Calendar, TrendingUp, UserCheck, Filter } from 'lucide-react';

const CARDS = [
  {
    icon: Users,
    title: 'M&M Conference Report',
    desc: 'Mortality & Morbidity cases with flag details, formatted for conference presentation.',
  },
  {
    icon: BookOpen,
    title: 'TPRC Summary Report',
    desc: 'Trauma Peer Review Committee case summaries for the selected review period.',
  },
  {
    icon: Calendar,
    title: 'Monthly PI Activity',
    desc: 'Case volume, flags opened/closed, and review completions by calendar month.',
  },
  {
    icon: TrendingUp,
    title: 'Quarterly Outcome Report',
    desc: 'Quarter-over-quarter performance trends with guideline compliance benchmarks.',
  },
  {
    icon: UserCheck,
    title: 'Nurse Workload Report',
    desc: 'Case assignments, flag resolution times, and review completion rates by PI nurse.',
  },
  {
    icon: Filter,
    title: 'Filter Failure Analysis',
    desc: 'Breakdown of quality filters triggered, outcomes, and resolution patterns.',
  },
];

export function PIReports() {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">PI Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Generate and export process improvement reports for review and submission</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-teal-100 p-5 flex flex-col gap-3 hover:bg-teal-50/20 transition-all cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-teal-600" />
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

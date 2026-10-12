import { TrendingUp, AlertTriangle, Layers, CheckCircle, Clock, BarChart2 } from 'lucide-react';

const CARDS = [
  {
    icon: TrendingUp,
    title: 'Flag Trend Analysis',
    desc: 'Open flag volume over the past 90 days, broken down by type and severity.',
    badge: null,
  },
  {
    icon: AlertTriangle,
    title: 'High-Priority Flags',
    desc: 'Cases with critical flags pending review, ranked by urgency.',
    badge: { label: '7 open', color: 'bg-red-100 text-red-700 border-red-200' },
  },
  {
    icon: Layers,
    title: 'Review Stage Summary',
    desc: 'Distribution of cases across Primary, Secondary, M&M, and TPRC review stages.',
    badge: null,
  },
  {
    icon: CheckCircle,
    title: 'Guideline Compliance',
    desc: 'Aggregate adherence rates across all active care guidelines for the current quarter.',
    badge: null,
  },
  {
    icon: Clock,
    title: 'Time-to-Review Metrics',
    desc: 'Average time from case arrival to 1st review completion, trended by month.',
    badge: null,
  },
  {
    icon: BarChart2,
    title: 'Case Completion Rate',
    desc: 'Percentage of cases fully reviewed and closed vs. pending, filtered by PI nurse.',
    badge: null,
  },
];

export function PIDashboard() {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">PI Dashboard</h1>
          <p className="text-xs text-gray-400 mt-0.5">Aggregate performance improvement metrics across all cases</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CARDS.map(({ icon: Icon, title, desc, badge }) => (
            <div key={title} className="bg-white rounded-xl border border-teal-100 p-5 flex flex-col gap-3 hover:bg-teal-50/20 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-teal-600" />
                </div>
                {badge && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color} whitespace-nowrap`}>
                    {badge.label}
                  </span>
                )}
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

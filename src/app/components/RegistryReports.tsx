import { Activity, TrendingDown, Siren, BedDouble, Users, BarChart2 } from 'lucide-react';

const CARDS = [
  {
    icon: Activity,
    title: 'Case Volume by Mechanism',
    desc: 'Monthly and quarterly breakdown of trauma cases by injury mechanism and activation level.',
    badge: null,
  },
  {
    icon: TrendingDown,
    title: 'Mortality & ISS Analysis',
    desc: 'Injury Severity Score distribution and in-hospital mortality rates, trended over time.',
    badge: null,
  },
  {
    icon: Siren,
    title: 'Activation Level Summary',
    desc: 'Level 1–4 activation distribution, overtriage rates, and team response compliance.',
    badge: null,
  },
  {
    icon: BedDouble,
    title: 'LOS & Disposition Report',
    desc: 'Length of stay, ICU utilization, and discharge disposition by injury type and severity.',
    badge: null,
  },
  {
    icon: Users,
    title: 'Demographics Report',
    desc: 'Age, sex, race, and insurance payor mix across all registered trauma activations.',
    badge: null,
  },
  {
    icon: BarChart2,
    title: 'NTDB Benchmark Report',
    desc: 'Side-by-side comparison of Grady outcomes vs. national NTDB peer group benchmarks.',
    badge: null,
  },
];

export function RegistryReports() {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">Registry Reports</h1>
          <p className="text-xs text-gray-400 mt-0.5">Generate registry data summaries and outcome analyses</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CARDS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-red-600" />
                </div>
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

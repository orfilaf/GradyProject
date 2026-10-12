import { Send, AlertTriangle, CheckSquare, Clock, FileText, BarChart2 } from 'lucide-react';

const CARDS = [
  {
    icon: Send,
    title: 'TQIP Quarterly Submission',
    desc: 'Current submission status for the American College of Surgeons Trauma Quality Program.',
    badge: { label: 'Q2 Due Jul 31', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  },
  {
    icon: FileText,
    title: 'NTDB Annual Data',
    desc: 'National Trauma Data Bank submission — record counts, validation errors, and upload history.',
    badge: null,
  },
  {
    icon: CheckSquare,
    title: 'Submission Readiness',
    desc: 'Pre-submission checklist: missing required fields, out-of-range values, and coding errors.',
    badge: null,
  },
  {
    icon: Clock,
    title: 'Submission History',
    desc: 'Log of all past submissions with timestamps, record counts, and acknowledgment receipts.',
    badge: null,
  },
  {
    icon: AlertTriangle,
    title: 'Validation Errors',
    desc: 'Current data quality issues flagged by registry validators, with field-level detail.',
    badge: { label: '14 errors', color: 'bg-red-100 text-red-700 border-red-200' },
  },
  {
    icon: BarChart2,
    title: 'Submission Reports',
    desc: 'Outcome reports and benchmark comparisons returned from TQIP and NTDB after submission.',
    badge: null,
  },
];

export function RegistrySubmissions() {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">
        <div className="mb-6">
          <h1 className="text-base font-bold text-gray-900">Registry Submissions</h1>
          <p className="text-xs text-gray-400 mt-0.5">Manage TQIP, NTDB, and state registry data submissions</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {CARDS.map(({ icon: Icon, title, desc, badge }) => (
            <div key={title} className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-3 hover:border-red-200 hover:shadow-sm transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-red-600" />
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

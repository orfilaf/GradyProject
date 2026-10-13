import { useState } from 'react';
import {
  Activity, Flame, Heart, Microscope, Bug, Waves,
  AlertTriangle, CheckCircle, Clock, ArrowUpRight,
  Users, Flag, LayoutGrid, Search, Send, AlertCircle,
} from 'lucide-react';
import { PatientList } from './PatientList';

interface RegistryDef {
  id: string;
  name: string;
  shortName: string;
  color: {
    text: string;
    bg: string;
    border: string;
    header: string;
    badge: string;
    dot: string;
    stageBg: string;
  };
  icon: React.ElementType;
  totalCases: number;
  activeCases: number;
  thisQuarter: number;
  openFlags: number;
  piStage: string;
  piFlags: number;
  piStatus: 'open' | 'ok';
  lastSubmission: string;
  nextDue: string;
  submissionStatus: 'submitted' | 'pending' | 'overdue';
  isLive: boolean;
}

const REGISTRIES: RegistryDef[] = [
  {
    id: 'trauma', name: 'Trauma Registry', shortName: 'TRAUMA PI',
    color: { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', header: 'bg-red-50 border-red-100', badge: 'bg-red-100 text-red-700', dot: 'bg-red-500', stageBg: 'bg-red-100 text-red-700' },
    icon: Activity, totalCases: 11247, activeCases: 23, thisQuarter: 847,
    openFlags: 3, piStage: 'Secondary Review', piFlags: 12, piStatus: 'open',
    lastSubmission: 'Q3 2026', nextDue: 'Jan 31, 2027', submissionStatus: 'submitted', isLive: true,
  },
  {
    id: 'burn', name: 'Burn Registry', shortName: 'BURN PI',
    color: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', header: 'bg-orange-50 border-orange-100', badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500', stageBg: 'bg-orange-100 text-orange-700' },
    icon: Flame, totalCases: 2841, activeCases: 8, thisQuarter: 214,
    openFlags: 1, piStage: 'Primary Review', piFlags: 4, piStatus: 'open',
    lastSubmission: 'Q3 2026', nextDue: 'Jan 31, 2027', submissionStatus: 'submitted', isLive: false,
  },
  {
    id: 'neuro', name: 'Neuro Registry', shortName: 'NEURO PI',
    color: { text: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-200', header: 'bg-violet-50 border-violet-100', badge: 'bg-violet-100 text-violet-700', dot: 'bg-violet-500', stageBg: 'bg-violet-100 text-violet-700' },
    icon: Waves, totalCases: 3654, activeCases: 14, thisQuarter: 312,
    openFlags: 2, piStage: 'Primary Review', piFlags: 7, piStatus: 'open',
    lastSubmission: 'Q3 2026', nextDue: 'Jan 31, 2027', submissionStatus: 'pending', isLive: false,
  },
  {
    id: 'cardiovascular', name: 'Cardiovascular Registry', shortName: 'CARDIOVASCULAR PI',
    color: { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', header: 'bg-rose-50 border-rose-100', badge: 'bg-rose-100 text-rose-700', dot: 'bg-rose-500', stageBg: 'bg-green-100 text-green-700' },
    icon: Heart, totalCases: 5129, activeCases: 19, thisQuarter: 438,
    openFlags: 0, piStage: 'Closed', piFlags: 0, piStatus: 'ok',
    lastSubmission: 'Q3 2026', nextDue: 'Jan 31, 2027', submissionStatus: 'submitted', isLive: false,
  },
  {
    id: 'cancer', name: 'Cancer Registry', shortName: 'CANCER PI',
    color: { text: 'text-teal-600', bg: 'bg-teal-50', border: 'border-teal-200', header: 'bg-teal-50 border-teal-100', badge: 'bg-teal-100 text-teal-700', dot: 'bg-teal-500', stageBg: 'bg-purple-100 text-purple-700' },
    icon: Microscope, totalCases: 8923, activeCases: 31, thisQuarter: 721,
    openFlags: 1, piStage: 'TPRC', piFlags: 3, piStatus: 'open',
    lastSubmission: 'Q2 2026', nextDue: 'Oct 31, 2026', submissionStatus: 'overdue', isLive: false,
  },
  {
    id: 'sepsis', name: 'Sepsis Registry', shortName: 'SEPSIS PI',
    color: { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', header: 'bg-amber-50 border-amber-100', badge: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500', stageBg: 'bg-green-100 text-green-700' },
    icon: Bug, totalCases: 1987, activeCases: 6, thisQuarter: 189,
    openFlags: 0, piStage: 'Closed', piFlags: 0, piStatus: 'ok',
    lastSubmission: 'Q3 2026', nextDue: 'Jan 31, 2027', submissionStatus: 'submitted', isLive: false,
  },
];

function StatPill({ label, value, icon: Icon, variant = 'neutral' }: {
  label: string; value: string | number; icon: React.ElementType; variant?: 'neutral' | 'warning' | 'danger' | 'ok';
}) {
  const colors = {
    neutral: 'text-indigo-600 bg-indigo-50 border-indigo-100',
    warning: 'text-amber-600 bg-amber-50 border-amber-100',
    danger:  'text-red-600 bg-red-50 border-red-100',
    ok:      'text-green-600 bg-green-50 border-green-100',
  };
  const valColors = { neutral: 'text-indigo-800', warning: 'text-amber-800', danger: 'text-red-800', ok: 'text-green-800' };
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border bg-white shadow-sm ${variant !== 'neutral' ? colors[variant] : 'border-gray-200'}`}>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colors[variant]}`}>
        <Icon size={15} />
      </div>
      <div>
        <p className={`text-lg font-bold leading-none ${valColors[variant]}`}>{value}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function SubmissionChip({ status, lastSubmission, nextDue }: { status: RegistryDef['submissionStatus']; lastSubmission: string; nextDue: string }) {
  if (status === 'submitted') return (
    <div className="flex items-center gap-1.5">
      <CheckCircle size={11} className="text-green-500 flex-shrink-0" />
      <span className="text-[11px] text-gray-600">{lastSubmission} submitted</span>
      <span className="text-[11px] text-gray-400">· Next: {nextDue}</span>
    </div>
  );
  if (status === 'pending') return (
    <div className="flex items-center gap-1.5">
      <Clock size={11} className="text-amber-500 flex-shrink-0" />
      <span className="text-[11px] text-amber-700 font-medium">Pending submission</span>
      <span className="text-[11px] text-gray-400">· Due: {nextDue}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-1.5">
      <AlertCircle size={11} className="text-red-500 flex-shrink-0" />
      <span className="text-[11px] text-red-700 font-medium">Submission overdue</span>
      <span className="text-[11px] text-gray-400">· Was due: {nextDue}</span>
    </div>
  );
}

function RegistryCard({ reg, onOpen }: { reg: RegistryDef; onOpen?: () => void }) {
  const Icon = reg.icon;
  const c = reg.color;
  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow ${c.border}`}>
      <div className={`px-4 py-3 border-b flex items-center gap-3 ${c.header}`}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 border ${c.bg} ${c.border}`}>
          <Icon size={15} className={c.text} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${c.text} leading-tight truncate`}>{reg.name}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {reg.totalCases.toLocaleString()} total cases
            <span className="mx-1 text-gray-300">·</span>
            <span className="font-medium text-gray-700">{reg.activeCases} active</span>
          </p>
        </div>
        {reg.openFlags > 0 ? (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 border border-red-100 flex-shrink-0">
            <AlertTriangle size={10} className="text-red-500" />
            <span className="text-[10px] font-bold text-red-600">{reg.openFlags}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-50 border border-green-100 flex-shrink-0">
            <CheckCircle size={10} className="text-green-500" />
            <span className="text-[10px] font-bold text-green-600">PI OK</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { label: 'Active Now', value: reg.activeCases },
          { label: 'This Quarter', value: reg.thisQuarter.toLocaleString() },
          { label: 'All Time', value: reg.totalCases.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center py-3 gap-0.5">
            <span className="text-base font-bold text-gray-800">{value}</span>
            <span className="text-[10px] text-gray-400 uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${reg.piStatus === 'ok' ? 'border-green-400' : 'border-gray-300'}`}>
            {reg.piStatus === 'ok' && <span className="w-2 h-2 rounded-full bg-green-400" />}
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide truncate">{reg.shortName}</span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.stageBg}`}>{reg.piStage}</span>
          {reg.piFlags > 0 && (
            <span className="flex items-center gap-1 text-[11px] text-gray-500">
              <Flag size={10} className="text-gray-400" />
              {reg.piFlags} flags
            </span>
          )}
        </div>
      </div>

      <div className="px-4 py-2.5 flex items-center justify-between gap-2">
        <SubmissionChip status={reg.submissionStatus} lastSubmission={reg.lastSubmission} nextDue={reg.nextDue} />
        <button
          onClick={onOpen}
          disabled={!reg.isLive}
          className={`flex items-center gap-1 text-[11px] font-semibold transition-colors flex-shrink-0 ${reg.isLive ? `${c.text} hover:opacity-70` : 'text-gray-300 cursor-default'}`}
        >
          Open <ArrowUpRight size={11} />
        </button>
      </div>
    </div>
  );
}

interface HubCommandCenterProps {
  onPatientSelect: (patient: any) => void;
  onOpenRegistry: () => void;
}

type HubView = 'overview' | 'patients';

export function HubCommandCenter({ onPatientSelect, onOpenRegistry }: HubCommandCenterProps) {
  const [view, setView] = useState<HubView>('overview');

  const totalActive    = REGISTRIES.reduce((s, r) => s + r.activeCases, 0);
  const totalFlags     = REGISTRIES.reduce((s, r) => s + r.piFlags, 0);
  const overdueCount   = REGISTRIES.filter(r => r.submissionStatus === 'overdue').length;
  const attentionCount = REGISTRIES.filter(r => r.piStatus === 'open').length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="bg-white border-b border-gray-200 px-6 flex items-center gap-1 h-10 flex-shrink-0">
        <button
          onClick={() => setView('overview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'overview' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <LayoutGrid size={11} />
          Command Center
        </button>
        <button
          onClick={() => setView('patients')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${view === 'patients' ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-100'}`}
        >
          <Search size={11} />
          Patient Search
        </button>
        {view === 'overview' && (
          <span className="ml-3 text-[10px] text-gray-400 italic">
            {REGISTRIES.length} registries · Grady Memorial Hospital
          </span>
        )}
      </div>

      {view === 'patients' ? (
        <PatientList onPatientSelect={onPatientSelect} showDashboard={false} />
      ) : (
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="px-8 py-6 max-w-7xl">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h1 className="text-base font-bold text-gray-900">Registry Command Center</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Click <span className="font-semibold text-indigo-600">Open</span> on any registry to navigate to that module
                </p>
              </div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {REGISTRIES.length} Registries
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 mb-6">
              <StatPill label="Registries Active"                              value={REGISTRIES.length} icon={LayoutGrid} variant="neutral" />
              <StatPill label="Active Cases"                                    value={totalActive}        icon={Users}      variant="neutral" />
              <StatPill label={`PI Flags Open (${attentionCount} registries)`} value={totalFlags}         icon={Flag}       variant={totalFlags > 0 ? 'warning' : 'ok'} />
              <StatPill label="Submissions Overdue"                             value={overdueCount}       icon={Send}       variant={overdueCount > 0 ? 'danger' : 'ok'} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              {REGISTRIES.map(reg => (
                <RegistryCard
                  key={reg.id}
                  reg={reg}
                  onOpen={reg.isLive ? onOpenRegistry : undefined}
                />
              ))}
            </div>

            <p className="text-[11px] text-gray-400 mt-6">
              Data sourced from Epic via Patient Record Hub. Full documentation lives in each registry module.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

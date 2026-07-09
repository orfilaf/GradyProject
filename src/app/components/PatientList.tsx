import { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, UserCheck } from 'lucide-react';

// ── Dashboard data ─────────────────────────────────────────────────────────────
const DAYS_TO_CLOSE = 73;

const registries = [
  {
    name: 'NTDS',
    deadline: 'Rolling',
    deadlineLabel: 'Deadline',
    closedCases: 289,
    openCases: 47,
    color: 'border-indigo-300 bg-indigo-50',
    labelColor: 'text-indigo-900',
  },
  {
    name: 'GQIP',
    deadline: 'Jun 1, 2026',
    deadlineLabel: 'Due',
    recordDates: 'Jan 1 – Mar 31, 2026',
    closedCases: 124,
    openCases: 23,
    color: 'border-teal-300 bg-teal-50',
    labelColor: 'text-teal-700',
  },
  {
    name: 'OEMST',
    deadline: 'Aug 1 – Sep 1, 2026',
    deadlineLabel: 'Due',
    recordDates: 'Jan 1 – Jun 30, 2026',
    closedCases: 198,
    openCases: 31,
    color: 'border-red-300 bg-red-50',
    labelColor: 'text-red-600',
  },
];

interface Patient {
  id: string;
  mrn: string;
  name: string;
  traumaNumber: string;
  hospitalAccountNumber: string;
  arrived: string;
  discharged: string;
  mechanism: string;
  activation: string;
  ntdb: 'Yes' | 'No';
  recordCloser: string;
  piAssigned: string;
  status: 'Completed' | 'In Progress';
}

type ColKey = keyof Omit<Patient, 'id'>;
type SortDir = 'asc' | 'desc';

interface Column { key: ColKey; label: string; }

const COLUMNS: Column[] = [
  { key: 'mrn', label: 'MRN' },
  { key: 'name', label: 'Patient Name' },
  { key: 'traumaNumber', label: 'Trauma #' },
  { key: 'hospitalAccountNumber', label: 'Acct #' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'discharged', label: 'Discharged' },
  { key: 'mechanism', label: 'Mechanism' },
  { key: 'activation', label: 'Activation' },
  { key: 'ntdb', label: 'NTDB' },
  { key: 'recordCloser', label: 'Record Closer' },
  { key: 'piAssigned', label: 'PI Assigned' },
  { key: 'status', label: 'Status' },
];

const STAFF = ['Michael Chen', 'Emily Rodriguez', 'Sarah Williams', 'Dr. Thompson'];

const patients: Patient[] = [
  { id: '1', mrn: 'MRN-2024-001234', name: 'John Anderson', traumaNumber: 'TN-24-0891', hospitalAccountNumber: 'HA-884421', arrived: '2024-06-07 14:30', discharged: '2024-06-10 09:15', mechanism: 'Car Accident', activation: 'Level 4', ntdb: 'Yes', recordCloser: 'Michael Chen', piAssigned: 'Sarah Williams', status: 'Completed' },
  { id: '2', mrn: 'MRN-2024-001235', name: 'Maria Garcia', traumaNumber: 'TN-24-0892', hospitalAccountNumber: 'HA-884422', arrived: '2024-06-08 08:45', discharged: '', mechanism: 'Fall', activation: 'Level 3', ntdb: 'Yes', recordCloser: 'Michael Chen', piAssigned: 'Sarah Williams', status: 'In Progress' },
  { id: '3', mrn: 'MRN-2024-001236', name: 'David Johnson', traumaNumber: 'TN-24-0893', hospitalAccountNumber: 'HA-884423', arrived: '2024-06-08 11:20', discharged: '', mechanism: 'Gunshot Wound', activation: 'Level 1', ntdb: 'Yes', recordCloser: 'Emily Rodriguez', piAssigned: 'Dr. Thompson', status: 'In Progress' },
  { id: '4', mrn: 'MRN-2024-001237', name: 'Sarah Kim', traumaNumber: 'TN-24-0894', hospitalAccountNumber: 'HA-884424', arrived: '2024-06-07 19:30', discharged: '2024-06-09 16:45', mechanism: 'Motorcycle Accident', activation: 'Level 2', ntdb: 'No', recordCloser: 'Michael Chen', piAssigned: 'Dr. Thompson', status: 'Completed' },
  { id: '5', mrn: 'MRN-2024-001238', name: 'Robert Williams', traumaNumber: 'TN-24-0895', hospitalAccountNumber: 'HA-884425', arrived: '2024-06-08 13:00', discharged: '', mechanism: 'Pedestrian vs Auto', activation: 'Level 2', ntdb: 'Yes', recordCloser: 'Emily Rodriguez', piAssigned: 'Sarah Williams', status: 'In Progress' },
];

interface PatientListProps {
  onPatientSelect: (patient: any) => void;
}

function SortIcon({ col, sortCol, sortDir }: { col: ColKey; sortCol: ColKey | null; sortDir: SortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={11} className="text-gray-400 flex-shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp size={11} className="text-primary flex-shrink-0" />
    : <ChevronDown size={11} className="text-primary flex-shrink-0" />;
}

export function PatientList({ onPatientSelect }: PatientListProps) {
  const [filters, setFilters] = useState<Partial<Record<ColKey, string>>>({});
  const [sortCol, setSortCol] = useState<ColKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAssignee, setBulkAssignee] = useState('');

  const setFilter = (key: ColKey, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const handleSort = (key: ColKey) => {
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => patients.filter(p =>
    COLUMNS.every(col => {
      const f = filters[col.key] ?? '';
      if (!f) return true;
      return String(p[col.key] ?? '').toLowerCase().includes(f.toLowerCase());
    })
  ), [filters]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      const av = String(a[sortCol] ?? '').toLowerCase();
      const bv = String(b[sortCol] ?? '').toLowerCase();
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  }, [filtered, sortCol, sortDir]);

  const allSelected = sorted.length > 0 && sorted.every(p => selected.has(p.id));
  const someSelected = sorted.some(p => selected.has(p.id));

  const toggleAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(sorted.map(p => p.id)));
  };

  const toggleOne = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBulkAssign = () => {
    if (!bulkAssignee) return;
    setSelected(new Set());
    setBulkAssignee('');
  };

  const thCls = 'px-3 py-2 text-left text-[11px] font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap';
  const filterInp = 'w-full px-2 py-1 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white placeholder:text-gray-300';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6 flex flex-col gap-6">

        {/* ── Row 1: Summary stats ──────────────────────────────────────── */}
        <section>
          <div className="grid grid-cols-3 gap-4">
            <div className={`rounded-xl border-2 px-4 py-3 flex items-center gap-2 ${DAYS_TO_CLOSE > 60 ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
              <span className="text-2xl font-bold">{DAYS_TO_CLOSE}</span>
              <span className="text-sm opacity-60">days avg to close</span>
              {DAYS_TO_CLOSE > 60 && <span className="ml-auto text-lg">‼️</span>}
              <span className="text-sm font-bold ml-auto">Days to Close</span>
            </div>
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-3 flex items-center gap-2 text-amber-700">
              <span className="text-2xl font-bold">47</span>
              <span className="text-sm opacity-60">cases active</span>
              <span className="text-sm font-bold ml-auto">Open Cases</span>
            </div>
            <div className="rounded-xl border-2 border-gray-200 bg-white px-4 py-3 flex items-center gap-2 text-gray-700">
              <span className="text-2xl font-bold">312</span>
              <span className="text-sm opacity-60">cases closed</span>
              <span className="text-sm font-bold ml-auto">Closed Cases YTD</span>
            </div>
          </div>
        </section>

        {/* ── Row 2: Registries ─────────────────────────────────────────── */}
        <section>
          <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Registries</h2>
          <div className="grid grid-cols-3 gap-4">
            {registries.map(r => (
              <div key={r.name} className={`rounded-xl border-2 ${r.color} flex flex-col overflow-hidden`}>
                {/* Header: title + dates all in one row */}
                <div className="px-4 py-3 border-b border-white/60 flex items-center gap-4 flex-wrap">
                  <span className={`text-4xl font-black tracking-tight flex-shrink-0 ${r.labelColor}`}>{r.name}</span>
                  <div className="flex items-center gap-4 flex-wrap">
                    {r.recordDates && (
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">Records</span>
                        <p className="text-xs font-medium text-gray-700 whitespace-nowrap">{r.recordDates}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-gray-500 uppercase tracking-wide">{r.deadlineLabel}</span>
                      <p className="text-xs font-semibold text-gray-800 whitespace-nowrap">{r.deadline}</p>
                    </div>
                  </div>
                </div>
                {/* Stats */}
                <div className="flex divide-x divide-white/60">
                  <div className="flex-1 px-4 py-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Closed</p>
                    <span className="text-3xl font-black text-gray-800">{r.closedCases}</span>
                  </div>
                  <div className="flex-1 px-4 py-3">
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-0.5">Open</p>
                    <span className="text-3xl font-black text-gray-800">{r.openCases}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Patient Table ─────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">

          {/* Bulk action bar */}
          {someSelected && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-primary/5 border border-primary/20 rounded-lg">
              <UserCheck size={15} className="text-primary flex-shrink-0" />
              <span className="text-sm font-medium text-primary">{selected.size} patient{selected.size > 1 ? 's' : ''} selected</span>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-600">Assign Record Closer:</span>
                <select
                  value={bulkAssignee}
                  onChange={e => setBulkAssignee(e.target.value)}
                  className="text-xs px-2 py-1.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white"
                >
                  <option value="">Select...</option>
                  {STAFF.map(s => <option key={s}>{s}</option>)}
                </select>
                <button
                  onClick={handleBulkAssign}
                  disabled={!bulkAssignee}
                  className="text-xs px-3 py-1.5 bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-40 transition-colors"
                >
                  Assign
                </button>
                <button onClick={() => setSelected(new Set())} className="text-xs text-gray-500 hover:text-gray-700">
                  Clear
                </button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  {/* Column headers */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="w-8 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                      />
                    </th>
                    {COLUMNS.map(col => (
                      <th key={col.key} className={thCls}>
                        <button
                          onClick={() => handleSort(col.key)}
                          className="flex items-center gap-1 hover:text-primary transition-colors group"
                        >
                          {col.label}
                          <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                        </button>
                      </th>
                    ))}
                  </tr>
                  {/* Filter row */}
                  <tr className="bg-white border-b border-gray-100">
                    <td className="px-3 py-1.5" />
                    {COLUMNS.map(col => (
                      <td key={col.key} className="px-2 py-1.5">
                        <input
                          type="text"
                          placeholder="Filter..."
                          value={filters[col.key] ?? ''}
                          onChange={e => setFilter(col.key, e.target.value)}
                          className={filterInp}
                        />
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sorted.length === 0 ? (
                    <tr><td colSpan={COLUMNS.length + 1} className="px-4 py-8 text-center text-sm text-gray-500">No patients match the current filters</td></tr>
                  ) : sorted.map(patient => (
                    <tr
                      key={patient.id}
                      onClick={() => onPatientSelect(patient)}
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${selected.has(patient.id) ? 'bg-primary/5' : ''}`}
                    >
                      <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={selected.has(patient.id)}
                          onChange={() => toggleOne(patient.id)}
                          className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="px-3 py-2.5 font-mono text-gray-900 whitespace-nowrap">{patient.mrn}</td>
                      <td className="px-3 py-2.5 font-medium text-gray-900 whitespace-nowrap">{patient.name}</td>
                      <td className="px-3 py-2.5 text-gray-600 font-mono whitespace-nowrap">{patient.traumaNumber}</td>
                      <td className="px-3 py-2.5 text-gray-600 font-mono whitespace-nowrap">{patient.hospitalAccountNumber}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{patient.arrived}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{patient.discharged || <span className="text-gray-300">—</span>}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{patient.mechanism}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{patient.activation}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${patient.ntdb === 'Yes' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {patient.ntdb}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{patient.recordCloser}</td>
                      <td className="px-3 py-2.5 text-gray-600 whitespace-nowrap">{patient.piAssigned}</td>
                      <td className="px-3 py-2.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${patient.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-xs text-gray-500">Showing {sorted.length} of {patients.length} patients</div>
        </section>

      </div>
    </div>
  );
}

import { useState, useMemo, Fragment } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, UserCheck, ChevronRight, Bot, Sparkles, Search, X } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { IRISChat } from './IRISChat';

// ── Table ──────────────────────────────────────────────────────────────────────────────────

type ReviewStage = 'Primary' | 'Secondary' | 'M&M' | 'TPRC' | '';

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
  piAssigned: string;
  openFlags: number;
  guidelines: { name: string; acronym: string; status: 'red' | 'amber' | 'green' }[];
  status: 'Completed' | 'In Progress';
  review: ReviewStage;
  // quick-review panel data
  age: number; sex: string; hospital: string; level: string;
  iss: number; triss: number; niss: number;
  admitService: string; by: string;
  left: string; los: string; rc: string; pi: string;
  caseSummary: string;
  rcNurse: string;
}

const REVIEW_LABEL_STYLES: Record<string, string> = {
  'Primary':   'bg-blue-50 border border-blue-200 text-blue-700',
  'Secondary': 'bg-amber-50 border border-amber-200 text-amber-700',
  'M&M':       'bg-red-50 border border-red-200 text-red-700',
  'TPRC':      'bg-emerald-50 border border-emerald-200 text-emerald-700',
};

type ColKey = 'mrn' | 'name' | 'flags' | 'traumaNumber' | 'hospitalAccountNumber' | 'arrived' | 'discharged' | 'mechanism' | 'activation' | 'piAssigned' | 'rcNurse' | 'status' | 'reviews';
type SortDir = 'asc' | 'desc';
interface Column { key: ColKey; label: string; }

const COLUMNS: Column[] = [
  { key: 'mrn', label: 'MRN' },
  { key: 'name', label: 'Name' },
  { key: 'traumaNumber', label: 'Trauma #' },
  { key: 'hospitalAccountNumber', label: 'Acct #' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'discharged', label: 'Discharged' },
  { key: 'mechanism', label: 'Mechanism' },
  { key: 'activation', label: 'Activation' },
  { key: 'rcNurse', label: 'RC Nurse' },
  { key: 'piAssigned', label: 'PI Nurse' },
  { key: 'status', label: 'PI Status' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'flags', label: 'Flags' },
];

const STAFF = ['Sarah Williams', 'Dr. Thompson', 'Michael Chen', 'Emily Rodriguez'];

const patients: Patient[] = [
  { id: '1', mrn: 'MRN-2024-001234', name: 'John Anderson',   traumaNumber: 'TN-24-0891', hospitalAccountNumber: 'HA-884421', arrived: '2024-06-07 14:30', discharged: '2024-06-10 09:15', mechanism: 'Car Accident',        activation: 'Level 4', ntdb: 'Yes', piAssigned: 'Sarah Williams', openFlags: 3, guidelines: [{ name: 'Traumatic Brain Injury', acronym: 'TBI', status: 'red' }, { name: 'Extended FAST', acronym: 'eFAST', status: 'green' }], status: 'In Progress', review: 'Secondary', age: 45, sex: 'Male',   hospital: 'Mercy Hospital',   level: 'Level 4', iss: 3,  triss: 4.0, niss: 6,  admitService: 'Podiatric Surgery',  by: 'Dr. Smith',    left: 'Jun 10, 2024 09:15', los: '3d 18h 45m', rc: 'Michael Chen', pi: 'Sarah Williams', rcNurse: 'Michael Chen', caseSummary: '34-year-old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation, and airbag deployment. Patient presented with severe chest pain (9/10) and respiratory distress. Initial assessment revealed seatbelt sign across chest and abdomen.\n\nImaging demonstrated multiple left-sided rib fractures (ribs 4–7) with associated pulmonary contusion and small left hemopneumothorax. No solid organ injury identified on CT scan.\n\nPatient managed with chest tube placement for hemopneumothorax with good clinical response. Discharged hospital day 5 in good condition with outpatient trauma surgery follow-up scheduled in 2 weeks.' },
  { id: '2', mrn: 'MRN-2024-001235', name: 'Maria Garcia',    traumaNumber: 'TN-24-0892', hospitalAccountNumber: 'HA-884422', arrived: '2024-06-08 08:45', discharged: '',                mechanism: 'Fall',                activation: 'Level 3', ntdb: 'Yes', piAssigned: 'Sarah Williams', openFlags: 1, guidelines: [{ name: 'Traumatic Brain Injury', acronym: 'TBI', status: 'amber' }, { name: 'Geriatric Trauma', acronym: 'Ger.', status: 'green' }], status: 'In Progress', review: 'Primary',   age: 72, sex: 'Female', hospital: 'Grady Memorial',   level: 'Level 3', iss: 9,  triss: 6.2, niss: 11, admitService: 'Orthopedic Surgery', by: 'Dr. Patel',    left: '',                    los: 'Inpatient',  rc: 'Sarah Williams', pi: 'Sarah Williams', rcNurse: 'Sarah Williams', caseSummary: '72-year-old female presenting after unwitnessed mechanical fall at home. Sustained right hip fracture and mild traumatic brain injury with brief LOC. Ground-level fall with no identified prodrome.\n\nCT head negative for intracranial hemorrhage. Pelvis X-ray confirmed right intertrochanteric fracture. Orthopedics consulted for ORIF planning.\n\nCognitive baseline limited by mild dementia. Family contact established. Fall risk protocol initiated.' },
  { id: '3', mrn: 'MRN-2024-001236', name: 'David Johnson',   traumaNumber: 'TN-24-0893', hospitalAccountNumber: 'HA-884423', arrived: '2024-06-08 11:20', discharged: '',                mechanism: 'Gunshot Wound',       activation: 'Level 1', ntdb: 'Yes', piAssigned: 'Dr. Thompson',   openFlags: 5, guidelines: [{ name: 'Traumatic Brain Injury', acronym: 'TBI', status: 'red' }, { name: 'Blunt Cardiac Injury', acronym: 'BCI', status: 'red' }], status: 'In Progress', review: 'M&M',       age: 28, sex: 'Male',   hospital: 'Grady Memorial',   level: 'Level 1', iss: 25, triss: 9.1, niss: 29, admitService: 'Trauma Surgery',     by: 'Dr. Thompson', left: '',                    los: 'Inpatient',  rc: 'Dr. Thompson', pi: 'Dr. Thompson', rcNurse: 'Dr. Thompson', caseSummary: '28-year-old male presenting with penetrating gunshot wound to the left chest. Single entry wound at 4th intercostal space midclavicular line, no exit wound identified. Hemodynamically unstable on arrival.\n\nEmergent left thoracotomy performed in ED. Cardiac laceration repaired. Transferred to OR for definitive hemorrhage control. Postoperative course complicated by ventilator-associated pneumonia.\n\nCurrently in SICU, day 6 post-injury. Multiple unresolved PI flags pending review.' },
  { id: '4', mrn: 'MRN-2024-001237', name: 'Sarah Kim',       traumaNumber: 'TN-24-0894', hospitalAccountNumber: 'HA-884424', arrived: '2024-06-07 19:30', discharged: '2024-06-09 16:45', mechanism: 'Motorcycle Accident', activation: 'Level 2', ntdb: 'No',  piAssigned: 'Dr. Thompson',   openFlags: 0, guidelines: [{ name: 'Geriatric Trauma', acronym: 'Ger.', status: 'green' }], status: 'Completed',  review: 'Primary',   age: 34, sex: 'Female', hospital: 'Grady Memorial',   level: 'Level 2', iss: 6,  triss: 2.1, niss: 6,  admitService: 'General Surgery',    by: 'Dr. Lee',      left: 'Jun 9, 2024 16:45',  los: '1d 21h 15m', rc: 'Dr. Thompson', pi: 'Dr. Thompson', rcNurse: 'Dr. Thompson', caseSummary: '34-year-old female helmeted motorcyclist involved in side-impact collision. Presented with road rash and right clavicle fracture. Alert and oriented throughout.\n\nNo intracranial or intra-abdominal injuries identified on CT imaging. Orthopedics recommended conservative management for clavicle fracture. Discharged with sling and outpatient follow-up.\n\nNo open PI flags. Record marked complete.' },
  { id: '5', mrn: 'MRN-2024-001238', name: 'Robert Williams', traumaNumber: 'TN-24-0895', hospitalAccountNumber: 'HA-884425', arrived: '2024-06-08 13:00', discharged: '',                mechanism: 'Pedestrian vs Auto',  activation: 'Level 2', ntdb: 'Yes', piAssigned: 'Sarah Williams', openFlags: 2, guidelines: [{ name: 'Traumatic Brain Injury', acronym: 'TBI', status: 'red' }, { name: 'Geriatric Trauma', acronym: 'Ger.', status: 'amber' }, { name: 'Spinal Cord Injury', acronym: 'SCI', status: 'green' }], status: 'In Progress', review: 'TPRC',      age: 81, sex: 'Male',   hospital: 'Mercy Hospital',   level: 'Level 2', iss: 17, triss: 7.8, niss: 22, admitService: 'Trauma Surgery',     by: 'Dr. Smith',    left: '',                    los: 'Inpatient',  rc: 'Michael Chen', pi: 'Sarah Williams', rcNurse: 'Michael Chen', caseSummary: '81-year-old male struck by vehicle while crossing intersection. Sustained multiple rib fractures (bilateral), splenic laceration grade II, and right femur fracture. Anticoagulated for atrial fibrillation.\n\nSplenic laceration managed non-operatively with angioembolization. Right femur ORIF performed day 2. Anticoagulation held peri-procedure.\n\nDelirium developed day 3, managed with reorientation protocol. Prolonged ICU course. Referred to TPRC given complexity and extended LOS.' },
];

interface PIPatientListProps {
  onPatientSelect: (patient: any, tab?: 'timeline' | 'guidelines') => void;
}

function SortIcon({ col, sortCol, sortDir }: { col: ColKey; sortCol: ColKey | null; sortDir: SortDir }) {
  if (sortCol !== col) return <ChevronsUpDown size={11} className="text-teal-400 flex-shrink-0" />;
  return sortDir === 'asc'
    ? <ChevronUp size={11} className="text-teal-600 flex-shrink-0" />
    : <ChevronDown size={11} className="text-teal-600 flex-shrink-0" />;
}

export function PIPatientList({ onPatientSelect }: PIPatientListProps) {
  const [filters, setFilters] = useState<Partial<Record<ColKey, string>>>({});
  const [sortCol, setSortCol] = useState<ColKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkAssignee, setBulkAssignee] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [irisOpenForId, setIrisOpenForId] = useState<string | null>(null);
  const setFilter = (key: ColKey, value: string) =>
    setFilters(prev => ({ ...prev, [key]: value }));

  const handleSort = (key: ColKey) => {
    if (sortCol === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(key); setSortDir('asc'); }
  };

  const filtered = useMemo(() => patients.filter(p => {
    return COLUMNS.every(col => {
      const f = filters[col.key] ?? '';
      if (!f) return true;
      if (col.key === 'reviews') return p.review === f;
      if (col.key === 'flags') {
        const q = f.toLowerCase();
        return p.guidelines.some(g => g.name.toLowerCase().includes(q) || g.acronym.toLowerCase().includes(q));
      }
      return String(p[col.key as keyof Patient] ?? '').toLowerCase().includes(f.toLowerCase());
    });
  }), [filters]);

  const sorted = useMemo(() => {
    if (!sortCol) return filtered;
    return [...filtered].sort((a, b) => {
      if (sortCol === 'flags') {
        const diff = a.openFlags - b.openFlags;
        return sortDir === 'asc' ? diff : -diff;
      }
      const av = String(sortCol === 'reviews' ? a.review : (a[sortCol as keyof Patient] ?? '')).toLowerCase();
      const bv = String(sortCol === 'reviews' ? b.review : (b[sortCol as keyof Patient] ?? '')).toLowerCase();
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

  const thCls = 'px-3 py-2 text-left text-[11px] font-semibold text-teal-900 uppercase tracking-wider whitespace-nowrap';
  const filterInp = 'w-full px-2 py-1 text-xs border border-teal-100 rounded focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white placeholder:text-teal-200';

  return (
    <Tooltip.Provider>
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6 flex flex-col gap-6">

        {/* ── Patient Table ────────────────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-3">

          {/* Bulk action bar */}
          {someSelected && (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-teal-100 border border-teal-300 rounded-lg">
              <UserCheck size={15} className="text-teal-700 flex-shrink-0" />
              <span className="text-sm font-medium text-teal-800">{selected.size} patient{selected.size > 1 ? 's' : ''} selected</span>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-teal-700">Assign PI:</span>
                <select
                  value={bulkAssignee}
                  onChange={e => setBulkAssignee(e.target.value)}
                  className="text-xs px-2 py-1.5 border border-teal-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white"
                >
                  <option value="">Select...</option>
                  {STAFF.map(s => <option key={s}>{s}</option>)}
                </select>
                <button
                  onClick={handleBulkAssign}
                  disabled={!bulkAssignee}
                  className="text-xs px-3 py-1.5 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-40 transition-colors"
                >
                  Assign
                </button>
                <button onClick={() => setSelected(new Set())} className="text-xs text-teal-600 hover:text-teal-800">Clear</button>
              </div>
            </div>
          )}

          <div className="bg-white rounded-lg border border-teal-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-teal-100 border-b border-teal-200">
                    <th className="w-8 px-3 py-2">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        ref={el => { if (el) el.indeterminate = someSelected && !allSelected; }}
                        onChange={toggleAll}
                        className="w-3.5 h-3.5 text-teal-600 border-teal-300 rounded focus:ring-teal-400 cursor-pointer"
                      />
                    </th>
                    {COLUMNS.map(col => (
                      <th key={col.key} className={thCls}>
                        <button onClick={() => handleSort(col.key)} className="flex items-center gap-1 text-[11px] font-semibold text-teal-900 uppercase tracking-wider hover:text-teal-700 transition-colors">
                          {col.label}
                          <SortIcon col={col.key} sortCol={sortCol} sortDir={sortDir} />
                        </button>
                      </th>
                    ))}
                    <th className="w-8 px-2 py-2" />
                  </tr>
                  <tr className="bg-white border-b border-teal-100">
                    <td className="px-3 py-1.5" />
                    {COLUMNS.map(col => (
                      <td key={col.key} className="px-2 py-1.5">
                        {col.key === 'flags' ? (
                          <div className="relative flex items-center">
                            <Search size={10} className="absolute left-1.5 text-teal-300 pointer-events-none" />
                            <input
                              type="text"
                              placeholder="Guideline..."
                              value={filters.flags ?? ''}
                              onChange={e => setFilter('flags', e.target.value)}
                              className={`${filterInp} pl-5 pr-5 max-w-[90px]`}
                            />
                            {filters.flags && (
                              <button onClick={() => setFilter('flags', '')} className="absolute right-1 text-teal-300 hover:text-teal-600">
                                <X size={10} />
                              </button>
                            )}
                          </div>
                        ) : col.key === 'reviews' ? (
                          <select
                            value={filters.reviews ?? ''}
                            onChange={e => setFilter('reviews', e.target.value)}
                            className={`${filterInp} max-w-[68px]`}
                          >
                            <option value="">All</option>
                            <option value="Primary">1st</option>
                            <option value="Secondary">2nd</option>
                            <option value="M&M">M&amp;M</option>
                            <option value="TPRC">TPRC</option>
                          </select>
                        ) : col.key === 'activation' ? (
                          <input type="text" placeholder="Filter..." value={filters[col.key] ?? ''} onChange={e => setFilter(col.key, e.target.value)} className={`${filterInp} max-w-[64px]`} />
                        ) : col.key === 'rcNurse' || col.key === 'piAssigned' ? (
                          <input type="text" placeholder="Filter..." value={filters[col.key] ?? ''} onChange={e => setFilter(col.key, e.target.value)} className={`${filterInp} max-w-[80px]`} />
                        ) : (
                          <input
                            type="text"
                            placeholder="Filter..."
                            value={filters[col.key] ?? ''}
                            onChange={e => setFilter(col.key, e.target.value)}
                            className={filterInp}
                          />
                        )}
                      </td>
                    ))}
                    <td className="w-8 px-2 py-1.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-teal-50">
                  {sorted.length === 0 ? (
                    <tr><td colSpan={COLUMNS.length + 2} className="px-4 py-8 text-center text-sm text-gray-500">No patients match the current filters</td></tr>
                  ) : sorted.map(patient => {
                    const isExpanded = expandedId === patient.id;
                    const reviewColor = patient.review
                      ? { Primary: 'bg-blue-50 border-blue-200', Secondary: 'bg-amber-50 border-amber-200', 'M&M': 'bg-red-50 border-red-200', TPRC: 'bg-emerald-50 border-emerald-200' }[patient.review] ?? ''
                      : '';
                    return (
                      <Fragment key={patient.id}><tr
                        onClick={() => onPatientSelect(patient)}
                        className={`hover:bg-teal-50 cursor-pointer transition-colors ${selected.has(patient.id) ? 'bg-teal-50/80' : ''} ${isExpanded ? 'bg-teal-50/60' : ''}`}
                      >
                        <td className="px-3 py-2.5 text-center" onClick={e => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={selected.has(patient.id)}
                            onChange={() => toggleOne(patient.id)}
                            className="w-3.5 h-3.5 text-teal-600 border-teal-300 rounded focus:ring-teal-400 cursor-pointer"
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
                        <td className="px-3 py-2.5 text-gray-600 max-w-[90px] truncate">{patient.rcNurse}</td>
                        <td className="px-3 py-2.5 text-gray-600 max-w-[90px] truncate">{patient.piAssigned}</td>
                        <td className="px-3 py-2.5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${patient.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-teal-100 text-teal-800'}`}>
                            {patient.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5">
                          {patient.review
                            ? <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap ${REVIEW_LABEL_STYLES[patient.review]}`}>{patient.review}</span>
                            : <span className="text-gray-300">—</span>
                          }
                        </td>
                        <td className="px-3 py-2.5" onClick={e => { e.stopPropagation(); onPatientSelect(patient, 'guidelines'); }}>
                          <Tooltip.Root delayDuration={200}>
                            <Tooltip.Trigger asChild>
                              <div className="cursor-default w-fit">
                                {patient.openFlags > 0
                                  ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-100 text-red-700 whitespace-nowrap">‼️ {patient.openFlags}</span>
                                  : <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-green-100 text-green-700 whitespace-nowrap">✅ 0</span>}
                              </div>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                side="left"
                                sideOffset={8}
                                className="z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2.5 flex flex-col gap-1.5"
                              >
                                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Guidelines</p>
                                {patient.guidelines.map(g => (
                                  <span
                                    key={g.acronym}
                                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold whitespace-nowrap ${
                                      g.status === 'red' ? 'bg-red-100 text-red-700' :
                                      g.status === 'amber' ? 'bg-amber-100 text-amber-700' :
                                      'bg-green-100 text-green-700'
                                    }`}
                                  >
                                    {g.acronym}
                                  </span>
                                ))}
                                <Tooltip.Arrow className="fill-gray-200" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                        </td>
                        <td className="w-8 px-2 py-2.5 text-center flex-shrink-0" onClick={e => { e.stopPropagation(); setExpandedId(isExpanded ? null : patient.id); if (isExpanded) setIrisOpenForId(null); }}>
                          <button
                            className={`p-0.5 rounded transition-colors ${isExpanded ? 'text-teal-600 bg-teal-100' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'}`}
                            aria-label={isExpanded ? 'Collapse' : 'Expand quick review'}
                          >
                            <ChevronRight size={14} className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-white border-b border-teal-100">
                          <td colSpan={COLUMNS.length + 2} className="px-0 py-0">
                            <div className={`border-l-4 ${reviewColor} mx-4 my-3 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden flex`}>

                              {/* Left: IRIS chat panel */}
                              {irisOpenForId === patient.id && (
                                <IRISChat
                                  onClose={() => setIrisOpenForId(null)}
                                  patient={{ name: patient.name, mrn: patient.mrn, age: patient.age, gender: patient.sex, dob: '' }}
                                  navCollapsed={false}
                                  onToggleNav={() => {}}
                                />
                              )}

                              {/* Right: persistent bar + case summary + IRIS button */}
                              <div className="flex-1 min-w-0 flex flex-col">

                                {/* Persistent bar */}
                                <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-6 flex-wrap">
                                  <div>
                                    <div className="text-sm font-bold text-gray-900">{patient.name}</div>
                                    <div className="text-[11px] text-gray-500 font-mono">{patient.mrn}</div>
                                  </div>
                                  <div className="h-8 w-px bg-gray-200" />
                                  <div className="flex flex-col gap-1.5 min-w-0">
                                    <div className="flex items-center gap-4 text-[13px] text-gray-600 flex-wrap">
                                      <span><span className="text-gray-400 mr-1">Age</span><span className="font-semibold">{patient.age}</span></span>
                                      <span><span className="text-gray-400 mr-1">Sex</span><span className="font-semibold">{patient.sex}</span></span>
                                      <span><span className="text-gray-400 mr-1">Hospital</span><span className="font-semibold">{patient.hospital}</span></span>
                                      <span><span className="text-gray-400 mr-1">Level</span><span className="font-semibold">{patient.level}</span></span>
                                      <span><span className="text-gray-400 mr-1">Mechanism</span><span className="font-semibold">{patient.mechanism}</span></span>
                                      <span><span className="text-gray-400 mr-1">ISS</span><span className="font-semibold font-mono">{patient.iss}</span></span>
                                      <span><span className="text-gray-400 mr-1">NISS</span><span className="font-semibold font-mono">{patient.niss}</span></span>
                                      <span><span className="text-gray-400 mr-1">TRISS</span><span className="font-semibold font-mono">{patient.triss}</span></span>
                                      <span><span className="text-gray-400 mr-1">Admit</span><span className="font-semibold">{patient.admitService}</span></span>
                                      <span><span className="text-gray-400 mr-1">By</span><span className="font-semibold">{patient.by}</span></span>
                                    </div>
                                    <div className="flex items-center gap-4 text-[13px] text-gray-500 flex-wrap">
                                      <span><span className="text-gray-400 mr-1">Arrived</span><span className="font-semibold">{patient.arrived}</span></span>
                                      <span><span className="text-gray-400 mr-1">Left</span><span className="font-semibold">{patient.left || '—'}</span></span>
                                      <span><span className="text-gray-400 mr-1">LOS</span><span className="font-semibold">{patient.los}</span></span>
                                      <span><span className="text-gray-400 mr-1">RC</span><span className="font-semibold">{patient.rc}</span></span>
                                      <span><span className="text-gray-400 mr-1">PI</span><span className="font-semibold">{patient.pi}</span></span>
                                    </div>
                                  </div>
                                  <div className="ml-auto flex items-center gap-3 text-[11px]">
                                    {patient.review && (
                                      <span className={`px-2.5 py-1 rounded-full font-semibold border ${REVIEW_LABEL_STYLES[patient.review]}`}>
                                        {patient.review} Review
                                      </span>
                                    )}
                                    <button
                                      onClick={e => { e.stopPropagation(); onPatientSelect(patient); }}
                                      className="px-3 py-1 rounded bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
                                    >
                                      Open Full Record →
                                    </button>
                                  </div>
                                </div>

                                {/* Case Summary */}
                                <div className="px-4 py-3 flex-1">
                                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Case Summary</div>
                                  <div className="text-[13px] text-gray-700 leading-relaxed whitespace-pre-line">{patient.caseSummary}</div>
                                </div>

                                {/* I.R.I.S. button — anchored bottom, mirroring patient record left nav */}
                                <div className="px-4 pb-3 pt-1 border-t border-gray-100">
                                  <button
                                    onClick={e => { e.stopPropagation(); setIrisOpenForId(irisOpenForId === patient.id ? null : patient.id); }}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${irisOpenForId === patient.id ? 'bg-teal-100 border-teal-300' : 'bg-teal-50 hover:bg-teal-100 border-teal-200'}`}
                                  >
                                    <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                                      <Bot size={13} className="text-white" />
                                    </div>
                                    <span className="text-xs font-bold text-teal-700 tracking-widest">I.R.I.S.</span>
                                    <Sparkles size={8} className="text-teal-400" />
                                  </button>
                                </div>

                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-xs text-gray-500">Showing {sorted.length} of {patients.length} patients</div>
        </section>

      </div>


    </div>
    </Tooltip.Provider>
  );
}

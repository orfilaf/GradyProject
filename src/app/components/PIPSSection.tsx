import React, { useState } from 'react';
import {
  ChevronRight, AlertTriangle, Plus, Trash2, Clock, User, UserCheck, ClipboardList,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

export type ReviewStage = 'Primary Review' | 'Secondary Review' | 'M&M' | 'TPRC';

export interface PIPSCase {
  id: string;
  reviewId: string;
  patient: string;
  mrn: string;
  date: string;
  mechanism: string;
  iss: number;
  stage: ReviewStage;
  flags: number;
  completed: boolean;
}

export const CASES: PIPSCase[] = [
  { id: '1', reviewId: 'PI-2024-0892', patient: 'John Anderson',    mrn: 'GH-2024-00892', date: 'Mar 15, 2024', mechanism: 'MVC – Unrestrained Driver',    iss: 29, stage: 'Secondary Review', flags: 3,  completed: false },
  { id: '2', reviewId: 'PI-2024-0771', patient: 'Maria Gonzalez',   mrn: 'GH-2024-00771', date: 'Mar 12, 2024', mechanism: 'Pedestrian vs Vehicle',        iss: 22, stage: 'Primary Review',   flags: 1,  completed: false },
  { id: '3', reviewId: 'PI-2024-0654', patient: 'DeShawn Williams', mrn: 'GH-2024-00654', date: 'Mar 8, 2024',  mechanism: 'Fall from Height (22 ft)',     iss: 17, stage: 'M&M',              flags: 2,  completed: false },
  { id: '4', reviewId: 'PI-2024-0512', patient: 'Patricia Chen',    mrn: 'GH-2024-00512', date: 'Feb 28, 2024', mechanism: 'Assault – Gunshot Wound',      iss: 34, stage: 'TPRC',             flags: 5,  completed: false },
  { id: '5', reviewId: 'PI-2024-0401', patient: 'Robert Okafor',    mrn: 'GH-2024-00401', date: 'Feb 20, 2024', mechanism: 'MVC – Rollover',               iss: 11, stage: 'Primary Review',   flags: 0,  completed: true  },
];

export const STAGE_COLORS: Record<ReviewStage, string> = {
  'Primary Review':   'bg-blue-100 text-blue-700 border-blue-200',
  'Secondary Review': 'bg-amber-100 text-amber-700 border-amber-200',
  'M&M':              'bg-red-100 text-red-700 border-red-200',
  'TPRC':             'bg-emerald-100 text-emerald-700 border-emerald-200',
};

// ── Shared helpers ─────────────────────────────────────────────────────────────

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{children}</p>;
}

export function SectionCard({ title, children, naPad }: { title: string; children: React.ReactNode; naPad?: boolean }) {
  const [na, setNa] = useState(false);
  return (
    <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
        <p className="text-xs font-bold text-teal-800">{title}</p>
        {naPad && (
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" className="w-3 h-3 accent-teal-600" checked={na} onChange={e => setNa(e.target.checked)} />
            <span className="text-[10px] text-gray-500 font-medium">Not Applicable</span>
          </label>
        )}
      </div>
      {!na && <div className="px-4 py-3">{children}</div>}
      {na && <div className="px-4 py-3 text-xs text-gray-400 italic">Marked as Not Applicable</div>}
    </div>
  );
}

// ── Consult table ──────────────────────────────────────────────────────────────

interface ConsultRow { id: number; type: string; provider: string; called: string; arrival: string; npi: string; timeliness: string; }

export function ConsultTable({ rows, setRows }: { rows: ConsultRow[]; setRows: React.Dispatch<React.SetStateAction<ConsultRow[]>> }) {
  const addRow = () => setRows(p => [...p, { id: Date.now(), type: '', provider: '', called: '', arrival: '', npi: '', timeliness: '' }]);
  const removeRow = (id: number) => setRows(p => p.filter(r => r.id !== id));
  const update = (id: number, field: keyof ConsultRow, val: string) =>
    setRows(p => p.map(r => r.id === id ? { ...r, [field]: val } : r));

  return (
    <div>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-teal-50 border border-teal-200">
            {['Consult Type', 'Provider Name', 'Called Timestamp', 'Arrival Date', 'Arrival Time', 'NPI', 'Timeliness'].map(h => (
              <th key={h} className="text-left px-2 py-1.5 font-semibold text-teal-700 border border-teal-200 text-[10px] uppercase tracking-wide">{h}</th>
            ))}
            <th className="w-6 border border-teal-200" />
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.id} className="border border-gray-200">
              <td className="border border-gray-200 p-1">
                <select value={row.type} onChange={e => update(row.id, 'type', e.target.value)} className="w-full text-xs border-none outline-none bg-transparent">
                  <option value="">Select…</option>
                  <option>Pulmonology</option><option>Neurosurgery</option><option>Orthopedics</option><option>Cardiology</option>
                </select>
              </td>
              <td className="border border-gray-200 p-1"><input type="text" value={row.provider} onChange={e => update(row.id, 'provider', e.target.value)} placeholder="Name" className="w-full text-xs outline-none bg-transparent" /></td>
              <td className="border border-gray-200 p-1"><input type="text" value={row.called} onChange={e => update(row.id, 'called', e.target.value)} placeholder="mm/dd/yyyy --:--" className="w-full text-xs outline-none bg-transparent" /></td>
              <td className="border border-gray-200 p-1"><input type="date" value={row.arrival} onChange={e => update(row.id, 'arrival', e.target.value)} className="w-full text-xs outline-none bg-transparent" /></td>
              <td className="border border-gray-200 p-1"><input type="time" value={row.npi} onChange={e => update(row.id, 'npi', e.target.value)} className="w-full text-xs outline-none bg-transparent" /></td>
              <td className="border border-gray-200 p-1"><input type="text" value={row.npi} onChange={e => update(row.id, 'npi', e.target.value)} placeholder="NPI" className="w-full text-xs outline-none bg-transparent" /></td>
              <td className="border border-gray-200 p-1">
                <select value={row.timeliness} onChange={e => update(row.id, 'timeliness', e.target.value)} className="w-full text-xs border-none outline-none bg-transparent">
                  <option value="">Select…</option><option>On Time</option><option>Delayed</option><option>Not Applicable</option>
                </select>
              </td>
              <td className="border border-gray-200 p-1 text-center">
                <button onClick={() => removeRow(row.id)} className="text-gray-300 hover:text-red-400 transition-colors"><Trash2 size={11} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow} className="mt-2 flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors">
        <Plus size={12} /> Add Row
      </button>
    </div>
  );
}

// ── MTP Table ──────────────────────────────────────────────────────────────────

export function MTPTable() {
  const PRODUCTS = ['PRBC', 'FFP', 'Platelets', 'Cryo', 'Ca'];
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-red-600 text-white">
          <th className="text-left px-2 py-1.5 border border-red-700 font-semibold text-[10px]">Time of MTP</th>
          <th className="text-left px-2 py-1.5 border border-red-700 font-semibold text-[10px]">Location</th>
          {PRODUCTS.map(p => <th key={p} className="px-2 py-1.5 border border-red-700 font-semibold text-[10px]">{p}</th>)}
        </tr>
      </thead>
      <tbody>
        {[0, 1].map(i => (
          <tr key={i} className="border border-gray-200">
            <td className="border border-gray-200 p-1"><input type="text" placeholder="--:--" className="w-full text-xs outline-none" /></td>
            <td className="border border-gray-200 p-1"><input type="text" placeholder="Location" className="w-full text-xs outline-none" /></td>
            {PRODUCTS.map(p => <td key={p} className="border border-gray-200 p-1 text-center"><input type="number" className="w-12 text-xs outline-none text-center" /></td>)}
          </tr>
        ))}
        <tr className="bg-gray-100 font-bold border border-gray-200">
          <td colSpan={2} className="px-2 py-1.5 text-xs border border-gray-200">Totals</td>
          {PRODUCTS.map(p => <td key={p} className="border border-gray-200 p-1 text-center text-xs">0</td>)}
        </tr>
        <tr className="border border-gray-200">
          <td colSpan={7} className="px-2 py-1.5">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Noncompliance Issues/Concerns:</p>
            <input type="text" className="w-full text-xs outline-none border-b border-gray-200 pb-0.5" placeholder="Enter any concerns…" />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

// ── Injury Complex ─────────────────────────────────────────────────────────────

interface DiagRow { id: number; icd10: string; desc: string; }

export function InjuryComplexTable() {
  const [rows, setRows] = useState<DiagRow[]>([{ id: 1, icd10: 'S72.001A', desc: 'Fracture of neck of right femur' }]);
  const add = () => setRows(p => [...p, { id: Date.now(), icd10: '', desc: '' }]);
  const remove = (id: number) => setRows(p => p.filter(r => r.id !== id));
  const update = (id: number, f: keyof DiagRow, v: string) => setRows(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
  return (
    <div>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-teal-50 border border-teal-200">
            <th className="text-left px-2 py-1.5 font-semibold text-teal-700 border border-teal-200 text-[10px] uppercase w-28">ICD-10</th>
            <th className="text-left px-2 py-1.5 font-semibold text-teal-700 border border-teal-200 text-[10px] uppercase">ICD-10 Description</th>
            <th className="w-6 border border-teal-200" />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border border-gray-200">
              <td className="border border-gray-200 p-1"><input value={r.icd10} onChange={e => update(r.id, 'icd10', e.target.value)} placeholder="ICD-10" className="w-full text-xs outline-none" /></td>
              <td className="border border-gray-200 p-1"><input value={r.desc} onChange={e => update(r.id, 'desc', e.target.value)} placeholder="Description…" className="w-full text-xs outline-none" /></td>
              <td className="border border-gray-200 p-1 text-center"><button onClick={() => remove(r.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={11} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add} className="mt-2 flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium"><Plus size={12} /> Add Diagnosis</button>
    </div>
  );
}

// ── Operations table ───────────────────────────────────────────────────────────

interface ProcRow { id: number; icd10: string; start: string; time: string; location: string; service: string; physician: string; }

export function OperationTable() {
  const [rows, setRows] = useState<ProcRow[]>([{ id: 1, icd10: '', start: '', time: '', location: '', service: '', physician: '' }]);
  const add = () => setRows(p => [...p, { id: Date.now(), icd10: '', start: '', time: '', location: '', service: '', physician: '' }]);
  const remove = (id: number) => setRows(p => p.filter(r => r.id !== id));
  const update = (id: number, f: keyof ProcRow, v: string) => setRows(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));
  return (
    <div>
      <table className="w-full text-xs border-collapse">
        <thead>
          <tr className="bg-teal-50 border border-teal-200">
            {['ICD-10', 'Start Date', 'Start Time', 'Location', 'Service', 'Physician'].map(h => (
              <th key={h} className="text-left px-2 py-1.5 font-semibold text-teal-700 border border-teal-200 text-[10px] uppercase tracking-wide">{h}</th>
            ))}
            <th className="w-6 border border-teal-200" />
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border border-gray-200">
              <td className="border border-gray-200 p-1"><input value={r.icd10} onChange={e => update(r.id, 'icd10', e.target.value)} placeholder="ICD-10" className="w-20 text-xs outline-none" /></td>
              <td className="border border-gray-200 p-1"><input type="date" value={r.start} onChange={e => update(r.id, 'start', e.target.value)} className="w-full text-xs outline-none" /></td>
              <td className="border border-gray-200 p-1"><input type="time" value={r.time} onChange={e => update(r.id, 'time', e.target.value)} className="w-full text-xs outline-none" /></td>
              <td className="border border-gray-200 p-1">
                <select value={r.location} onChange={e => update(r.id, 'location', e.target.value)} className="w-full text-xs outline-none bg-transparent">
                  <option value="">Select…</option><option>OR 1</option><option>OR 2</option><option>Trauma Bay</option><option>ICU</option>
                </select>
              </td>
              <td className="border border-gray-200 p-1">
                <select value={r.service} onChange={e => update(r.id, 'service', e.target.value)} className="w-full text-xs outline-none bg-transparent">
                  <option value="">Select…</option><option>Trauma Surgery</option><option>Orthopedics</option><option>Neurosurgery</option>
                </select>
              </td>
              <td className="border border-gray-200 p-1">
                <select value={r.physician} onChange={e => update(r.id, 'physician', e.target.value)} className="w-full text-xs outline-none bg-transparent">
                  <option value="">Select…</option><option>Dr. Smith</option><option>Dr. Johnston</option><option>Dr. Patel</option>
                </select>
              </td>
              <td className="border border-gray-200 p-1 text-center"><button onClick={() => remove(r.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={11} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={add} className="mt-2 flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium"><Plus size={12} /> Add Procedure</button>
    </div>
  );
}

// ── Events Close table ─────────────────────────────────────────────────────────

export function EventsCloseTable() {
  return (
    <table className="w-full text-xs border-collapse">
      <thead>
        <tr className="bg-gray-700 text-white">
          {['Event/Opp', 'Status', 'By (result)', 'Date Closed'].map(h => (
            <th key={h} className="text-left px-2 py-1.5 border border-gray-600 font-semibold text-[10px] uppercase tracking-wide">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[
          ['Delayed CT scan (> 30 min)', 'Open'],
          ['Missed hemorrhage protocol', 'Open'],
        ].map(([event, status], i) => (
          <tr key={i} className="border border-gray-200">
            <td className="border border-gray-200 p-1.5 text-gray-700">{event}</td>
            <td className="border border-gray-200 p-1.5">
              <select defaultValue={status} className="text-xs outline-none bg-transparent">
                <option>Open</option><option>1-No PI</option><option>1-No PI (Off)</option><option>Closed</option>
              </select>
            </td>
            <td className="border border-gray-200 p-1.5"><input type="text" placeholder="Reviewer" className="w-full text-xs outline-none" /></td>
            <td className="border border-gray-200 p-1.5"><input type="date" className="w-full text-xs outline-none" /></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Visit timeline ─────────────────────────────────────────────────────────────

const TIMELINE_EVENTS = [
  { event: 'Patient Arrival',        note: 'Patient arrived via ambulance with car accident injuries.',                                   time: '2024-06-07 14:02' },
  { event: 'Triage Assessment',      note: 'Level 4 trauma activation. Initial vitals: BP 120/80, HR 95, SpO2 98%',                      time: '2024-06-07 14:05' },
  { event: 'Trauma Team Activation', note: 'Trauma team assembled. Dr. Smith and Dr. Johnston assigned.',                                time: '2024-06-07 14:05' },
  { event: 'Triage Assessment',      note: 'Level 4 trauma activation. Initial vitals: BP 120/80, HR 95, SpO2 98%',                      time: '2024-06-07 14:05' },
  { event: 'Trauma Team Activation', note: 'Trauma team assembled. Dr. Smith and Dr. Johnston assigned.',                                time: '2024-06-07 14:05' },
  { event: 'Trauma Team Activation', note: 'Level 4 trauma activation. Initial vitals: BP 120/80, HR 95, SpO2 98%',                      time: '2024-06-07 14:05' },
];

// ── Stage review panel (Secondary Review / M&M / TPRC) ────────────────────────

const REASON_OPTIONS: Record<string, string[]> = {
  'Secondary Review': ['Delayed diagnosis', 'Suboptimal management', 'Documentation gap', 'Protocol deviation', 'Communication failure', 'Preventable complication'],
  'M&M':              ['Mortality — unexpected', 'Major morbidity', 'Near-miss event', 'Sentinel event', 'Iatrogenic injury', 'Failure to rescue'],
  'TPRC':             ['Triage level mismatch', 'Transfer delay', 'Resource utilization', 'Registry data gap', 'Outcome variance', 'Peer review flag'],
};

const OUTCOME_OPTIONS: Record<string, string[]> = {
  'Secondary Review': ['No PI identified', 'System issue', 'Provider issue', 'Education needed', 'Policy change', 'Further review'],
  'M&M':              ['Unavoidable', 'Potentially avoidable', 'Avoidable', 'Ongoing investigation', 'Closed — no action', 'Referred to peer review'],
  'TPRC':             ['Registry correction made', 'Protocol updated', 'No action needed', 'Training recommended', 'Referred to QI committee', 'Pending'],
};

const NEXT_ACTIONS: Record<string, [string, string][]> = {
  'Secondary Review': [['closeCase', 'Close Case'], ['referMM', 'Refer to M&M'], ['referTertiary', 'Refer to Tertiary']],
  'M&M':              [['closeCase', 'Close Case'], ['referTprc', 'Refer to TPRC'], ['referSecondary', 'Refer to Secondary']],
  'TPRC':             [['closeCase', 'Close Case'], ['closeReview', 'Close for Review'], ['referMM', 'Refer to M&M']],
};

interface DiagCodeRow { id: number; code: string; sort: string; }

function StageReviewPanel({ stage }: { stage: ReviewStage }) {
  const [finalDiscussion, setFinalDiscussion] = useState(
    '34-year old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation, and airbag deployment. Patient presented with severe chest pain (9/10) and respiratory distress following steering wheel impact. Initial assessment revealed seatbelt sign across chest and abdomen.\n\nImaging demonstrated multiple left-sided rib fractures (ribs 4-7) with associated pulmonary contusion and small left hemopneumothorax. No solid organ injury identified on CT scan.\n\nPatient managed with chest tube placement for hemopneumothorax with good clinical response. Patient monitored in ICU for 48 hours with stable vital signs throughout. Patient discharged on hospital day 5 in good condition with outpatient trauma surgery follow-up scheduled in 2 weeks.'
  );
  const [attendingDiscussion, setAttendingDiscussion] = useState('');
  const [complications, setComplications] = useState('');
  const [improvements, setImprovements] = useState('');
  const [completed, setCompleted] = useState(false);
  const [reviewer, setReviewer] = useState('');
  const [isNew] = useState(true);
  const [reasonChecks, setReasonChecks] = useState<Record<string, boolean>>({});
  const [outcomeChecks, setOutcomeChecks] = useState<Record<string, boolean>>({});
  const [diagRows, setDiagRows] = useState<DiagCodeRow[]>([{ id: 1, code: '555', sort: '' }]);
  const [nextChecks, setNextChecks] = useState<Record<string, boolean>>({});

  const addDiagRow = () => setDiagRows(p => [...p, { id: Date.now(), code: '', sort: '' }]);
  const removeDiagRow = (id: number) => setDiagRows(p => p.filter(r => r.id !== id));
  const updateDiag = (id: number, f: keyof DiagCodeRow, v: string) => setDiagRows(p => p.map(r => r.id === id ? { ...r, [f]: v } : r));

  const reasons = REASON_OPTIONS[stage] ?? [];
  const outcomes = OUTCOME_OPTIONS[stage] ?? [];
  const nextActions = NEXT_ACTIONS[stage] ?? [];
  const reasonCount = Object.values(reasonChecks).filter(Boolean).length;
  const outcomeCount = Object.values(outcomeChecks).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">

      {/* Info bar */}
      <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
        <div className="px-4 py-2.5 bg-teal-50/40 border-b border-teal-100 flex items-center gap-4 flex-wrap">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-wide whitespace-nowrap">Process Improvement</span>
          <span className="text-gray-300 text-xs">|</span>

          {/* Reason for review */}
          <div className="relative group flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Reason for review:</span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-full">
              {reasonCount}/{reasons.length} selected
            </span>
            <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:flex flex-col bg-white border border-teal-200 rounded-xl shadow-xl w-56 p-3 gap-2">
              {reasons.map(r => (
                <label key={r} className="flex items-center gap-2 cursor-pointer select-none hover:bg-teal-50 rounded px-1 py-0.5">
                  <input type="checkbox" checked={!!reasonChecks[r]} onChange={e => setReasonChecks(p => ({ ...p, [r]: e.target.checked }))} className="w-3 h-3 accent-teal-600" />
                  <span className="text-xs text-gray-700">{r}</span>
                </label>
              ))}
            </div>
          </div>

          <span className="text-gray-300 text-xs">|</span>

          {/* Outcomes/Classification */}
          <div className="relative group flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">Outcomes/Classification:</span>
            <span className="text-[10px] font-semibold text-teal-700 bg-teal-100 px-1.5 py-0.5 rounded-full">
              {outcomeCount}/{outcomes.length} selected
            </span>
            <div className="absolute top-full left-0 mt-1 z-50 hidden group-hover:flex flex-col bg-white border border-teal-200 rounded-xl shadow-xl w-60 p-3 gap-2">
              {outcomes.map(o => (
                <label key={o} className="flex items-center gap-2 cursor-pointer select-none hover:bg-teal-50 rounded px-1 py-0.5">
                  <input type="checkbox" checked={!!outcomeChecks[o]} onChange={e => setOutcomeChecks(p => ({ ...p, [o]: e.target.checked }))} className="w-3 h-3 accent-teal-600" />
                  <span className="text-xs text-gray-700">{o}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} className="w-3.5 h-3.5 accent-teal-600" />
              <span className="text-xs font-semibold text-gray-500">Completed</span>
            </label>
          </div>
        </div>

        {/* Review by */}
        <div className="px-4 py-2 flex items-center gap-3 border-b border-teal-50">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Review by:</span>
          <select value={reviewer} onChange={e => setReviewer(e.target.value)} className="text-xs border border-teal-200 rounded-lg px-2 py-1 outline-none text-gray-700 focus:ring-1 focus:ring-teal-400 bg-white">
            <option value="">Select reviewer…</option>
            <option>Dr. Smith</option><option>Dr. Johnston</option><option>Dr. Patel</option><option>Dr. Williams</option>
          </select>
        </div>
      </div>

      {/* Final Discussion */}
      <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
          <p className="text-xs font-bold text-teal-800">Final Discussion</p>
          {isNew && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">New</span>}
        </div>
        <div className="px-4 py-3">
          <textarea
            value={finalDiscussion}
            onChange={e => setFinalDiscussion(e.target.value)}
            rows={6}
            className="w-full text-xs text-gray-700 leading-relaxed resize-none outline-none border-none bg-transparent"
            placeholder="Enter final discussion notes…"
          />
        </div>
      </div>

      {/* Reason for [Stage] Review */}
      <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
          <p className="text-xs font-bold text-teal-800">Reason for {stage} Review</p>
          <span className="text-[10px] text-teal-600 font-medium">{diagRows.length} / 10</span>
        </div>
        <div className="px-4 py-3">
          <table className="w-full text-xs border-collapse mb-2">
            <thead>
              <tr className="bg-teal-50 border border-teal-200">
                <th className="text-left px-2 py-1.5 font-semibold text-teal-700 border border-teal-200 text-[10px] uppercase w-28">Code</th>
                <th className="text-left px-2 py-1.5 font-semibold text-teal-700 border border-teal-200 text-[10px] uppercase">Sort</th>
                <th className="w-6 border border-teal-200" />
              </tr>
            </thead>
            <tbody>
              {diagRows.map(r => (
                <tr key={r.id} className="border border-teal-100">
                  <td className="border border-teal-100 p-1">
                    <input value={r.code} onChange={e => updateDiag(r.id, 'code', e.target.value)} placeholder="Code…" className="w-full text-xs outline-none bg-transparent" />
                  </td>
                  <td className="border border-teal-100 p-1">
                    <input value={r.sort} onChange={e => updateDiag(r.id, 'sort', e.target.value)} placeholder="Description…" className="w-full text-xs outline-none bg-transparent" />
                  </td>
                  <td className="border border-teal-100 p-1 text-center">
                    <button onClick={() => removeDiagRow(r.id)} className="text-gray-300 hover:text-red-400"><Trash2 size={11} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={addDiagRow} className="flex items-center gap-1 text-xs text-teal-600 hover:text-teal-800 font-medium">
            <Plus size={12} /> Add Diagnosis
          </button>
        </div>
      </div>

      {/* Attending [Stage] Discussion */}
      <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
          <div className="flex items-center gap-1.5">
            <User size={12} className="text-teal-500" />
            <p className="text-xs font-bold text-teal-800">Attending {stage} Discussion</p>
          </div>
        </div>
        <div className="px-4 py-3">
          <textarea
            value={attendingDiscussion}
            onChange={e => setAttendingDiscussion(e.target.value)}
            rows={5}
            className="w-full text-xs text-gray-700 leading-relaxed resize-none outline-none border-none bg-transparent"
            placeholder="34-year old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation and airbag deployment…"
          />
        </div>
      </div>

      {/* Complications | Improvements */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
            <p className="text-xs font-bold text-teal-800">Complications</p>
          </div>
          <div className="px-4 py-3">
            <textarea
              value={complications}
              onChange={e => setComplications(e.target.value)}
              rows={5}
              className="w-full text-xs text-gray-700 leading-relaxed resize-none outline-none border-none bg-transparent"
              placeholder="34-year old male driver involved in high-speed motor vehicle accident with frontal impact and respiratory distress following steering wheel impact. Initial assessment revealed…"
            />
          </div>
        </div>
        <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
          <div className="px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
            <p className="text-xs font-bold text-teal-800">Improvements</p>
          </div>
          <div className="px-4 py-3">
            <textarea
              value={improvements}
              onChange={e => setImprovements(e.target.value)}
              rows={5}
              className="w-full text-xs text-gray-700 leading-relaxed resize-none outline-none border-none bg-transparent"
              placeholder="34-year old male driver involved in high-speed motor vehicle accident with frontal impact. Imaging demonstrated multiple left-sided rib fractures (ribs 4-7) with associated pulmonary contusion…"
            />
          </div>
        </div>
      </div>

      {/* Next actions / Save */}
      <div className="bg-white border border-teal-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold text-gray-600">Next:</span>
          {nextActions.map(([key, label]) => (
            <label key={key} className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked={!!nextChecks[key]} onChange={e => setNextChecks(p => ({ ...p, [key]: e.target.checked }))}
                className="w-3.5 h-3.5 accent-teal-600" />
              <span className="text-xs text-gray-600 font-medium">{label}</span>
            </label>
          ))}
          <button className="ml-auto px-5 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
            Save Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PIPSReviewForm — the full review form used inside PIPatientRecord ──────────

interface PIPSReviewFormProps {
  patientName?: string;
  mrn?: string;
  flags?: number;
}

export function PIPSReviewForm({ patientName, mrn, flags = 3 }: PIPSReviewFormProps) {
  const [stage, setStage] = useState<ReviewStage>('Secondary Review');
  const [completed, setCompleted] = useState(false);
  const [reviewId] = useState('PI-2024-0892');
  const [summary, setSummary] = useState(
    '34-year old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation, and airbag deployment. Patient presented with severe chest pain (9/10) and respiratory distress following steering wheel impact. Initial assessment revealed seatbelt sign across chest and abdomen.\n\nImaging demonstrated multiple left-sided rib fractures (ribs 4-7) with associated pulmonary contusion and small left hemopneumothorax. No solid organ injury identified on CT scan.\n\nPatient managed with chest tube placement for hemopneumothorax with good clinical response. Patient monitored in ICU for 48 hours with stable vital signs throughout. Patient discharged on hospital day 5 in good condition with outpatient trauma surgery follow-up scheduled in 2 weeks.'
  );
  const [attendingSummary, setAttendingSummary] = useState('');
  const [rnSummary, setRnSummary] = useState('');
  const [consultRows, setConsultRows] = useState([
    { id: 1, type: 'Pulmonology', provider: '', called: '', arrival: '', npi: '', timeliness: '' },
  ]);
  const [nextActions, setNextActions] = useState({ closeCase: false, referMM: false, referSecondary: false });

  const STAGES: ReviewStage[] = ['Primary Review', 'Secondary Review', 'M&M', 'TPRC'];

  return (
    <div className="flex flex-col gap-5">

      {/* Review stage strip */}
      <div className="flex items-center gap-2 flex-wrap">
        {STAGES.map(s => (
          <button
            key={s}
            onClick={() => setStage(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              stage === s ? STAGE_COLORS[s] : 'bg-white border-teal-100 text-teal-400 hover:border-teal-300 hover:text-teal-600'
            }`}
          >
            {s}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-3">
          <span className="text-[11px] text-gray-400">Review ID: <span className="font-mono font-semibold text-gray-600">{reviewId}</span></span>
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input type="checkbox" checked={completed} onChange={e => setCompleted(e.target.checked)} className="w-3.5 h-3.5 accent-teal-600" />
            <span className="text-xs font-semibold text-gray-500">Completed</span>
          </label>
        </div>
      </div>

      {/* Stage-specific content */}
      {stage !== 'Primary Review' ? (
        <StageReviewPanel stage={stage} />
      ) : (
      <>

      {/* Consolidated Case Summary */}
      <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
          <p className="text-xs font-bold text-teal-800">Consolidated Case Summary</p>
          {flags > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-red-500">
              <AlertTriangle size={11} /> {flags} flags
            </span>
          )}
        </div>
        <div className="px-4 py-3">
          <textarea
            value={summary}
            onChange={e => setSummary(e.target.value)}
            rows={6}
            className="w-full text-xs text-gray-700 leading-relaxed resize-none outline-none border-none bg-transparent"
            placeholder="Enter consolidated case summary…"
          />
        </div>
      </div>

      {/* Visit Timeline */}
      <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
          <Clock size={13} className="text-teal-500" />
          <p className="text-xs font-bold text-teal-800">Visit Timeline</p>
        </div>
        <div className="px-4 py-3 flex flex-col gap-0">
          {TIMELINE_EVENTS.map((ev, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-teal-50 last:border-0">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-gray-700">{ev.event}</span>
                <span className="text-xs text-gray-500 ml-2">{ev.note}</span>
              </div>
              <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">{ev.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Attending + RN Case Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
            <div className="flex items-center gap-1.5">
              <User size={12} className="text-teal-500" />
              <p className="text-xs font-bold text-teal-800">Attending Case Summary</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">By:</span>
              <select className="text-xs border border-teal-200 rounded px-1.5 py-0.5 outline-none text-gray-600">
                <option value="">Select…</option><option>Dr. Smith</option><option>Dr. Johnston</option><option>Dr. Patel</option>
              </select>
            </div>
          </div>
          <div className="px-4 py-3">
            <textarea value={attendingSummary} onChange={e => setAttendingSummary(e.target.value)} rows={5}
              className="w-full text-xs text-gray-700 leading-relaxed resize-none outline-none border-none bg-transparent"
              placeholder="34-year old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation and airbag deployment…" />
          </div>
        </div>
        <div className="bg-white border border-teal-200 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-teal-100 bg-teal-50/40">
            <div className="flex items-center gap-1.5">
              <UserCheck size={12} className="text-teal-500" />
              <p className="text-xs font-bold text-teal-800">RN Case Summary</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">By:</span>
              <select className="text-xs border border-teal-200 rounded px-1.5 py-0.5 outline-none text-gray-600">
                <option value="">Select…</option><option>RN Williams</option><option>RN Martinez</option><option>RN Chen</option>
              </select>
            </div>
          </div>
          <div className="px-4 py-3">
            <textarea value={rnSummary} onChange={e => setRnSummary(e.target.value)} rows={5}
              className="w-full text-xs text-gray-700 leading-relaxed resize-none outline-none border-none bg-transparent"
              placeholder="34-year old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation and airbag deployment…" />
          </div>
        </div>
      </div>

      {/* MTC Course and Metrics */}
      <SectionCard title="MTC Course and Metrics" naPad>
        <div className="grid grid-cols-5 gap-3">
          {[
            { label: 'Patient Arrival',        type: 'datetime-local' },
            { label: 'Team Arrival',            type: 'datetime-local' },
            { label: 'CT',                      type: 'datetime-local' },
            { label: 'Admission Order Placed',  type: 'datetime-local' },
            { label: 'Patient Out of MTC',      type: 'datetime-local' },
          ].map(({ label, type }) => (
            <div key={label}>
              <FieldLabel>{label}</FieldLabel>
              <input type={type} className="w-full text-xs border border-teal-200 rounded-lg px-2 py-1.5 outline-none focus:border-teal-500" />
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <FieldLabel>Time to CT</FieldLabel>
          <div className="flex items-center gap-2">
            <input type="number" className="w-16 text-xs border border-teal-200 rounded-lg px-2 py-1.5 outline-none focus:border-teal-500 text-center" placeholder="min" />
            <span className="text-xs text-gray-500">minutes</span>
          </div>
        </div>
      </SectionCard>

      {/* Emergent Consult Review */}
      <SectionCard title="Emergent Consult Review" naPad>
        <ConsultTable rows={consultRows} setRows={setConsultRows} />
      </SectionCard>

      {/* MTP Review */}
      <SectionCard title="MTP Review" naPad>
        <MTPTable />
      </SectionCard>

      {/* Injury Complex */}
      <SectionCard title="Injury Complex">
        <InjuryComplexTable />
      </SectionCard>

      {/* Operation Number */}
      <SectionCard title="Operation Number" naPad>
        <OperationTable />
      </SectionCard>

      {/* Events Close */}
      <SectionCard title="Events Close" naPad>
        <EventsCloseTable />
      </SectionCard>

      {/* Next actions / Save */}
      <div className="bg-white border border-teal-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-6">
          <span className="text-xs font-bold text-gray-600">Next:</span>
          {([
            ['closeCase',      'Close Case'],
            ['referMM',        'Refer to M&M'],
            ['referSecondary', 'Refer to Secondary'],
          ] as [keyof typeof nextActions, string][]).map(([key, label]) => (
            <label key={key} className="flex items-center gap-1.5 cursor-pointer select-none">
              <input type="checkbox" checked={nextActions[key]} onChange={e => setNextActions(p => ({ ...p, [key]: e.target.checked }))}
                className="w-3.5 h-3.5 accent-teal-600" />
              <span className="text-xs text-gray-600 font-medium">{label}</span>
            </label>
          ))}
          <button className="ml-auto px-5 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg hover:bg-teal-700 transition-colors shadow-sm">
            Save Review
          </button>
        </div>
      </div>

      </>
      )}
    </div>
  );
}

// ── PIPSSection — case queue list (navigates to patient record on Open) ─────────

interface PIPSSectionProps {
  onPatientSelect: (patient: any) => void;
}

export function PIPSSection({ onPatientSelect }: PIPSSectionProps) {
  const stageCounts = {
    'Primary Review':   CASES.filter(c => !c.completed && c.stage === 'Primary Review').length,
    'Secondary Review': CASES.filter(c => !c.completed && c.stage === 'Secondary Review').length,
    'M&M':              CASES.filter(c => !c.completed && c.stage === 'M&M').length,
    'TPRC':             CASES.filter(c => !c.completed && c.stage === 'TPRC').length,
  };

  const handleOpen = (c: PIPSCase) => {
    onPatientSelect({ mrn: c.mrn, name: c.patient });
  };

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-5xl">

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white border border-teal-200 flex items-center justify-center shadow-sm">
            <ClipboardList size={17} className="text-teal-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">PIPS Review Queue</h1>
            <p className="text-xs text-gray-400">{CASES.filter(c => !c.completed).length} open · {CASES.filter(c => c.completed).length} completed</p>
          </div>
        </div>

        {/* Review stage count tiles */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          {([
            { label: '1st Review',   stage: 'Primary Review',   bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-700',    count: stageCounts['Primary Review']   },
            { label: '2nd Review',   stage: 'Secondary Review', bg: 'bg-amber-50',   border: 'border-amber-200',   text: 'text-amber-700',   count: stageCounts['Secondary Review'] },
            { label: 'M&M',          stage: 'M&M',              bg: 'bg-red-50',     border: 'border-red-200',     text: 'text-red-700',     count: stageCounts['M&M']              },
            { label: 'TPRC',         stage: 'TPRC',             bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', count: stageCounts['TPRC']             },
          ] as { label: string; stage: ReviewStage; bg: string; border: string; text: string; count: number }[]).map(t => (
            <div key={t.stage} className={`${t.bg} border ${t.border} rounded-xl px-4 py-3 flex flex-col gap-0.5`}>
              <span className={`text-2xl font-bold ${t.text}`}>{t.count}</span>
              <span className="text-xs font-semibold text-gray-600">{t.label}</span>
              <span className="text-[10px] text-gray-400">pending review</span>
            </div>
          ))}
        </div>

        {/* Case table */}
        <div className="bg-white rounded-xl border border-teal-100 overflow-hidden shadow-sm">
          <div className="px-4 py-2.5 border-b border-teal-100 bg-teal-50 flex items-center justify-between">
            <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">Cases Awaiting Review</span>
            <span className="text-[10px] text-teal-600">{CASES.length} total</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Review ID', 'Patient', 'Date', 'Mechanism', 'ISS', 'Stage', 'Flags', ''].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {CASES.map(c => (
                <tr key={c.id} className={`hover:bg-teal-50/40 transition-colors ${c.completed ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono font-semibold text-gray-600">{c.reviewId}</span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs font-semibold text-gray-800">{c.patient}</p>
                    <p className="text-[10px] text-gray-400 font-mono">{c.mrn}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{c.date}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[180px] truncate">{c.mechanism}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${c.iss >= 25 ? 'text-red-600' : c.iss >= 16 ? 'text-amber-600' : 'text-gray-600'}`}>{c.iss}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.completed ? 'bg-gray-100 text-gray-400 border-gray-200' : STAGE_COLORS[c.stage]}`}>
                      {c.completed ? 'Completed' : c.stage}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {c.flags > 0 ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                        <AlertTriangle size={10} /> {c.flags}
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleOpen(c)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-teal-600 hover:text-teal-800 transition-colors ml-auto"
                    >
                      Open <ChevronRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

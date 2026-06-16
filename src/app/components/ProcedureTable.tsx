import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface ProcedureRow { id: string; icd10: string; startDate: string; startTime: string; location: string; service: string; physician: string; }

const MAX_ROWS = 200;
const LOCATIONS = ['OR','ED','ICU','Step-Down','Floor','Radiology','Interventional Radiology','Procedure Room','PACU','Other'];
const SERVICES = ['Trauma Surgery','Orthopedics','Neurosurgery','Cardiothoracic','Vascular','Plastics','Urology','General Surgery','Anesthesia','Interventional Radiology','Other'];
const PHYSICIANS = ['Dr. Smith','Dr. Johnson','Dr. Williams','Dr. Brown','Dr. Davis','Dr. Miller','Other'];

function newRow(): ProcedureRow { return { id: crypto.randomUUID(), icd10: '', startDate: '', startTime: '', location: '', service: '', physician: '' }; }

export function ProcedureTable() {
  const [rows, setRows] = useState<ProcedureRow[]>([newRow()]);
  const addRow = () => { if (rows.length >= MAX_ROWS) return; setRows(prev => [...prev, newRow()]); };
  const deleteRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));
  const update = (id: string, field: keyof ProcedureRow, value: string) => setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  const inp = 'px-1.5 py-1 text-xs border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white';
  const sel = `${inp} cursor-pointer`;
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="w-8 px-2 py-2" />
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">ICD-10</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Start Date</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Start Time</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Location</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Service</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Physician</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-2 py-1.5 text-center"><button type="button" onClick={() => deleteRow(row.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button></td>
                <td className="px-2 py-1.5"><input type="text" maxLength={7} placeholder="Select..." className={`${inp} w-[72px] font-mono uppercase`} value={row.icd10} onChange={e => update(row.id, 'icd10', e.target.value.toUpperCase())} /></td>
                {row.icd10.trim() ? (<>
                  <td className="px-2 py-1.5"><input type="date" className={`${inp} w-[130px]`} value={row.startDate} onChange={e => update(row.id, 'startDate', e.target.value)} /></td>
                  <td className="px-2 py-1.5"><input type="time" className={`${inp} w-[90px]`} value={row.startTime} onChange={e => update(row.id, 'startTime', e.target.value)} /></td>
                  <td className="px-2 py-1.5"><select className={`${sel} w-[130px]`} value={row.location} onChange={e => update(row.id, 'location', e.target.value)}><option value="">Select...</option>{LOCATIONS.map(l => <option key={l}>{l}</option>)}</select></td>
                  <td className="px-2 py-1.5"><select className={`${sel} w-[150px]`} value={row.service} onChange={e => update(row.id, 'service', e.target.value)}><option value="">Select...</option>{SERVICES.map(s => <option key={s}>{s}</option>)}</select></td>
                  <td className="px-2 py-1.5"><select className={`${sel} w-[140px]`} value={row.physician} onChange={e => update(row.id, 'physician', e.target.value)}><option value="">Select...</option>{PHYSICIANS.map(p => <option key={p}>{p}</option>)}</select></td>
                </>) : <td colSpan={5} />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        {rows.length < MAX_ROWS ? <button type="button" onClick={addRow} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"><Plus size={13} />Add Procedure</button> : <span className="text-xs text-gray-400">Maximum rows reached</span>}
        <span className="text-xs text-gray-400">{rows.length} / {MAX_ROWS}</span>
      </div>
    </div>
  );
}
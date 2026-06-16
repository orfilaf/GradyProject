import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface InjuryDiagnosisRow { id: string; icd10: string; description: string; }

const MAX_ROWS = 50;
function newRow(): InjuryDiagnosisRow { return { id: crypto.randomUUID(), icd10: '', description: '' }; }

export function InjuryDiagnosisTable() {
  const [rows, setRows] = useState<InjuryDiagnosisRow[]>([newRow()]);
  const addRow = () => { if (rows.length >= MAX_ROWS) return; setRows(prev => [...prev, newRow()]); };
  const deleteRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));
  const update = (id: string, field: keyof InjuryDiagnosisRow, value: string) => setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  const inp = 'px-1.5 py-1 text-xs border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white';
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="w-8 px-2 py-2" />
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">ICD-10</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">ICD-10 Description</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-2 py-1.5 text-center"><button type="button" onClick={() => deleteRow(row.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button></td>
                <td className="px-2 py-1.5"><input type="text" maxLength={7} placeholder="Select..." className={`${inp} w-[72px] font-mono uppercase`} value={row.icd10} onChange={e => update(row.id, 'icd10', e.target.value.toUpperCase())} /></td>
                {row.icd10.trim() ? <td className="px-2 py-1.5 w-full"><input type="text" placeholder="Description..." className={`${inp} w-full min-w-[260px]`} value={row.description} onChange={e => update(row.id, 'description', e.target.value)} /></td> : <td />}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between">
        {rows.length < MAX_ROWS ? <button type="button" onClick={addRow} className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors"><Plus size={13} />Add Diagnosis</button> : <span className="text-xs text-gray-400">Maximum rows reached</span>}
        <span className="text-xs text-gray-400">{rows.length} / {MAX_ROWS}</span>
      </div>
    </div>
  );
}
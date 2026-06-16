import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface DiagnosisRow { id: string; aisCode: string; aisVersion: string; aisPredotCode: string; aisSeverity: string; issBodyRegion: string; }

const MAX_ROWS = 50;
const AIS_SEVERITY = ['1 - Minor','2 - Moderate','3 - Serious','4 - Severe','5 - Critical','6 - Maximum (Unsurvivable)'];
const ISS_BODY_REGIONS = ['Head/Neck','Face','Thorax','Abdomen','Extremity/Pelvis','External'];

function newRow(): DiagnosisRow { return { id: crypto.randomUUID(), aisCode: '', aisVersion: '', aisPredotCode: '', aisSeverity: '', issBodyRegion: '' }; }

export function DiagnosisTable() {
  const [rows, setRows] = useState<DiagnosisRow[]>([newRow()]);
  const addRow = () => { if (rows.length >= MAX_ROWS) return; setRows(prev => [...prev, newRow()]); };
  const deleteRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));
  const update = (id: string, field: keyof DiagnosisRow, value: string) => setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  const inp = 'px-1.5 py-1 text-xs border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white';
  const sel = `${inp} cursor-pointer`;
  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-xs border-collapse">
          <thead><tr className="bg-gray-50 border-b border-gray-200">
            <th className="w-8 px-2 py-2" />
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">AIS Code</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">AIS Version</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">AIS Predot Code</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">AIS Severity</th>
            <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">ISS Body Region</th>
          </tr></thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                <td className="px-2 py-1.5 text-center"><button type="button" onClick={() => deleteRow(row.id)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={13} /></button></td>
                <td className="px-2 py-1.5"><input type="text" placeholder="Select..." className={`${inp} w-24 font-mono`} value={row.aisCode} onChange={e => update(row.id, 'aisCode', e.target.value)} /></td>
                {row.aisCode.trim() ? (<>
                  <td className="px-2 py-1.5"><input type="text" placeholder="Version" className={`${inp} w-24`} value={row.aisVersion} onChange={e => update(row.id, 'aisVersion', e.target.value)} /></td>
                  <td className="px-2 py-1.5"><input type="text" placeholder="Predot code" className={`${inp} w-28 font-mono`} value={row.aisPredotCode} onChange={e => update(row.id, 'aisPredotCode', e.target.value)} /></td>
                  <td className="px-2 py-1.5"><select className={`${sel} w-44`} value={row.aisSeverity} onChange={e => update(row.id, 'aisSeverity', e.target.value)}><option value="">Select...</option>{AIS_SEVERITY.map(s => <option key={s}>{s}</option>)}</select></td>
                  <td className="px-2 py-1.5"><select className={`${sel} w-40`} value={row.issBodyRegion} onChange={e => update(row.id, 'issBodyRegion', e.target.value)}><option value="">Select...</option>{ISS_BODY_REGIONS.map(r => <option key={r}>{r}</option>)}</select></td>
                </>) : <td colSpan={4} />}
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
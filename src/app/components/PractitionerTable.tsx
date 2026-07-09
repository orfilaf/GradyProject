import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';

interface PractitionerRow {
  id: string;
  firstCol: string;
  providerName: string;
  calledTimestamp: string;
  arrivalTimestamp: string;
  npi: string;
  timeliness: string;
}

interface PractitionerTableProps {
  firstColumnLabel: string;
  firstColumnOptions: string[]; // excludes 'None' — added automatically as first option
  maxRows?: number;
}

const PROVIDER_NAMES = [
  'Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown',
  'Dr. Davis', 'Dr. Miller', 'Dr. Wilson', 'Dr. Moore', 'Other',
];

const TIMELINESS_OPTIONS = ['Timely', 'Delayed', 'Not Applicable', 'Unknown'];

function newRow(): PractitionerRow {
  return {
    id: crypto.randomUUID(),
    firstCol: '',
    providerName: '',
    calledTimestamp: '',
    arrivalTimestamp: '',
    npi: '',
    timeliness: '',
  };
}

export function PractitionerTable({
  firstColumnLabel,
  firstColumnOptions,
  maxRows = 50,
}: PractitionerTableProps) {
  const [rows, setRows] = useState<PractitionerRow[]>([newRow()]);

  const addRow = () => {
    if (rows.length >= maxRows) return;
    setRows(prev => [...prev, newRow()]);
  };

  const deleteRow = (id: string) => setRows(prev => prev.filter(r => r.id !== id));

  const update = (id: string, field: keyof PractitionerRow, value: string) =>
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));

  const inp = 'px-1.5 py-1 text-xs border border-input rounded focus:outline-none focus:ring-1 focus:ring-primary bg-white';
  const sel = `${inp} cursor-pointer`;

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-8 px-2 py-2" />
              <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">{firstColumnLabel}</th>
              <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Provider Name</th>
              <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Called Timestamp</th>
              <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Arrival</th>
              <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">NPI</th>
              <th className="px-2 py-2 text-left font-semibold text-gray-600 whitespace-nowrap">Timeliness</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(row => {
              const showCols = !!row.firstCol && row.firstCol !== 'None';
              return (
                <tr key={row.id} className="hover:bg-gray-50/60 transition-colors">
                  {/* Trash */}
                  <td className="px-2 py-1.5 text-center">
                    <button type="button" onClick={() => deleteRow(row.id)} title="Delete row"
                      className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </td>

                  {/* First column — always visible */}
                  <td className="px-2 py-1.5">
                    <select className={`${sel} w-40`}
                      value={row.firstCol} onChange={e => update(row.id, 'firstCol', e.target.value)}>
                      <option value="">Select...</option>
                      <option value="None">None</option>
                      {firstColumnOptions.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </td>

                  {/* Conditional columns — shown when anything except None/empty is selected */}
                  {showCols ? (
                    <>
                      <td className="px-2 py-1.5">
                        <select className={`${sel} w-36`}
                          value={row.providerName} onChange={e => update(row.id, 'providerName', e.target.value)}>
                          <option value="">Select...</option>
                          {PROVIDER_NAMES.map(n => <option key={n}>{n}</option>)}
                        </select>
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="datetime-local" className={`${inp} w-[170px]`}
                          value={row.calledTimestamp} onChange={e => update(row.id, 'calledTimestamp', e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="datetime-local" className={`${inp} w-[170px]`}
                          value={row.arrivalTimestamp} onChange={e => update(row.id, 'arrivalTimestamp', e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <input type="text" placeholder="NPI" className={`${inp} w-28 font-mono`}
                          value={row.npi} onChange={e => update(row.id, 'npi', e.target.value)} />
                      </td>
                      <td className="px-2 py-1.5">
                        <select className={`${sel} w-32`}
                          value={row.timeliness} onChange={e => update(row.id, 'timeliness', e.target.value)}>
                          <option value="">Select...</option>
                          {TIMELINESS_OPTIONS.map(t => <option key={t}>{t}</option>)}
                        </select>
                      </td>
                    </>
                  ) : (
                    <td colSpan={5} />
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        {rows.length < maxRows ? (
          <button type="button" onClick={addRow}
            className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            <Plus size={13} />
            Add Row
          </button>
        ) : (
          <span className="text-xs text-gray-400">Maximum rows reached</span>
        )}
        <span className="text-xs text-gray-400">{rows.length} / {maxRows}</span>
      </div>
    </div>
  );
}

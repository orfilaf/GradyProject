import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface AccordionChecklistProps {
  title: string;
  items: string[];
  values: Record<string, boolean>;
  onChange: (item: string, checked: boolean) => void;
}

export function AccordionChecklist({ title, items, values, onChange }: AccordionChecklistProps) {
  const [open, setOpen] = useState(false);
  const checkedCount = items.filter((item) => values[item]).length;
  return (
    <div className="border border-gray-200 rounded-md overflow-hidden">
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors text-left">
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {checkedCount > 0 && (
            <span className="text-xs font-semibold px-1.5 py-0.5 rounded-full bg-primary text-white leading-none">{checkedCount}</span>
          )}
        </div>
        <span className="text-xs text-gray-400">{items.length} options</span>
      </button>
      {open && (
        <div className="px-3 py-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2 bg-white border-t border-gray-100">
          {items.map((item) => (
            <label key={item} className="flex items-start gap-2 cursor-pointer group">
              <input type="checkbox" checked={values[item] || false}
                onChange={(e) => onChange(item, e.target.checked)}
                className="w-3.5 h-3.5 mt-0.5 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0" />
              <span className="text-xs text-gray-700 leading-tight group-hover:text-gray-900">{item}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
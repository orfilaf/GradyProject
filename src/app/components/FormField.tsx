import { useState } from 'react';
import { Check } from 'lucide-react';
import { FieldDefinition } from '../data/patientFields';
import { AIFieldData } from '../data/aiMockData';
import { AISourceModal } from './AISourceModal';

interface FormFieldProps {
  field: FieldDefinition;
  value?: string | number | boolean;
  onChange?: (value: string | number | boolean) => void;
  aiData?: AIFieldData;
  aiConfirmed?: boolean;
  onAiConfirm?: () => void;
  onOpenIRIS?: () => void;
}

export function FormField({ field, value, onChange, aiData, aiConfirmed, onAiConfirm, onOpenIRIS }: FormFieldProps) {
  const fieldId = field.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const [popupOpen, setPopupOpen] = useState(false);

  const getColSpanClass = () => {
    if (!field.colSpan || field.colSpan === 1) return 'col-span-1';
    if (field.colSpan === 2) return 'col-span-1 md:col-span-2';
    if (field.colSpan === 3) return 'col-span-1 md:col-span-3';
    if (field.colSpan === 4) return 'col-span-1 md:col-span-4';
    return 'col-span-1';
  };

  const renderInput = () => {
    switch (field.type) {
      case 'textarea':
        return (
          <textarea
            id={fieldId}
            className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-transparent resize-none"
            rows={1}
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );

      case 'checkbox':
        return (
          <div className="flex items-center h-7">
            <input
              type="checkbox"
              id={fieldId}
              className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0"
              checked={value as boolean || false}
              onChange={(e) => onChange?.(e.target.checked)}
            />
            <label htmlFor={fieldId} className="ml-2 text-xs text-gray-700 cursor-pointer leading-tight">
              {field.name}
            </label>
          </div>
        );

      case 'yesno':
        return (
          <div className="flex items-center gap-4 h-7">
            {['Yes', 'No'].map((option) => (
              <label key={option} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name={fieldId}
                  value={option}
                  checked={value === option}
                  onChange={() => onChange?.(option)}
                  className="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary"
                />
                {option}
              </label>
            ))}
          </div>
        );

      case 'select':
        return (
          <select
            id={fieldId}
            className={`${field.inputWidth ?? 'w-full'} px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          >
            <option value="">Select...</option>
            {field.options
              ? field.options.map((opt) => <option key={opt} value={opt}>{opt}</option>)
              : (<><option value="option1">Option 1</option><option value="option2">Option 2</option></>)
            }
          </select>
        );

      case 'date':
        return (
          <input
            type="date"
            id={fieldId}
            className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );

      case 'time':
        return (
          <input
            type="time"
            id={fieldId}
            className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );

      case 'datetime-local':
        return (
          <input
            type="datetime-local"
            id={fieldId}
            className="w-[200px] px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            id={fieldId}
            className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={value as number || ''}
            onChange={(e) => onChange?.(parseFloat(e.target.value))}
          />
        );

      case 'calculated':
        return (
          <div className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-800 font-semibold flex items-center gap-1.5 select-none">
            {value ? (
              <span>{String(value)}</span>
            ) : (
              <span className="text-gray-400 font-normal text-xs italic">calculated from height & weight</span>
            )}
          </div>
        );

      default:
        return (
          <input
            type="text"
            id={fieldId}
            className={`${field.inputWidth ?? 'w-full'} px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
    }
  };

  // AI confidence badge with hover popup
  const renderAIControls = () => {
    if (!aiData) return null;
    const isHigh = aiData.confidence >= 95;
    const badgeClass = isHigh
      ? 'text-white bg-green-600 border-green-700 shadow-sm shadow-green-200'
      : 'text-white bg-red-600 border-red-700 shadow-sm shadow-red-200';
    return (
      <div className="flex items-center gap-1 flex-shrink-0">
        {/* % badge with hover popup */}
        <div
          className="relative"
          onMouseEnter={() => setPopupOpen(true)}
          onMouseLeave={() => setPopupOpen(false)}
        >
          <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border leading-none tracking-tight cursor-default select-none ${badgeClass}`}>
            {aiData.confidence}%
          </span>
          {popupOpen && aiData && (
            <AISourceModal
              fieldName={field.name}
              aiData={aiData}
              onOpenIRIS={() => {
                setPopupOpen(false);
                onOpenIRIS?.();
              }}
            />
          )}
        </div>
        {/* Confirm checkmark */}
        <button
          type="button"
          onClick={onAiConfirm}
          title={aiConfirmed ? 'Confirmed' : 'Confirm AI suggestion'}
          className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${
            aiConfirmed
              ? 'bg-green-500 text-white'
              : 'border border-gray-300 text-gray-300 hover:border-green-500 hover:text-green-500'
          }`}
        >
          <Check size={11} strokeWidth={aiConfirmed ? 3 : 2} />
        </button>
      </div>
    );
  };

  // ── Checkbox type ─────────────────────────────────────────────
  if (field.type === 'checkbox') {
    return (
      <div className={`${getColSpanClass()} relative`}>
        <div className="flex items-center justify-between gap-2">
          {renderInput()}
          {renderAIControls()}
        </div>
      </div>
    );
  }

  // ── Yes/No type ───────────────────────────────────────────────
  if (field.type === 'yesno') {
    return (
      <div className={`${getColSpanClass()} relative`}>
        <div className="flex items-center justify-between gap-2 mb-0.5">
          <label className="text-xs font-medium text-gray-700">{field.name}</label>
          {renderAIControls()}
        </div>
        {renderInput()}
      </div>
    );
  }

  // ── Standard field ────────────────────────────────────────────
  return (
    <div className={`${getColSpanClass()} flex items-end gap-2 relative`}>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <label htmlFor={fieldId} className="text-xs font-medium text-gray-700">
            {field.name}
            {field.required && <span className="text-destructive ml-1">*</span>}
            {field.unit && <span className="ml-1 text-gray-500 font-normal">({field.unit})</span>}
          </label>
          {renderAIControls()}
        </div>
        {renderInput()}
      </div>
      {field.operatorAfter && (
        <div className="flex items-center justify-center pb-2 text-xl font-bold text-gray-600">
          {field.operatorAfter}
        </div>
      )}
    </div>
  );
}

import { FieldDefinition } from '../data/patientFields';

interface FormFieldProps {
  field: FieldDefinition;
  value?: string | number | boolean;
  onChange?: (value: string | number | boolean) => void;
}

export function FormField({ field, value, onChange }: FormFieldProps) {
  const fieldId = field.name.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Determine column span class
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
            className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
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

      case 'select':
        return (
          <select
            id={fieldId}
            className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="option1">Option 1</option>
            <option value="option2">Option 2</option>
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

      default:
        return (
          <input
            type="text"
            id={fieldId}
            className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
          />
        );
    }
  };

  if (field.type === 'checkbox') {
    return <div className={getColSpanClass()}>{renderInput()}</div>;
  }

  return (
    <div className={`${getColSpanClass()} flex items-end gap-2`}>
      <div className="flex-1">
        <label htmlFor={fieldId} className="block text-xs font-medium text-gray-700 mb-1">
          {field.name}
          {field.required && <span className="text-destructive ml-1">*</span>}
          {field.unit && <span className="ml-1 text-gray-500 font-normal">({field.unit})</span>}
        </label>
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

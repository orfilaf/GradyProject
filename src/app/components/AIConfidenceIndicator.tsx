import { useState } from 'react';
import { Check } from 'lucide-react';
import { AISourceModal } from './AISourceModal';
import { AIFieldData } from '../data/aiMockData';

interface AIConfidenceIndicatorProps {
  fieldName: string;
  aiData: AIFieldData;
  confirmed: boolean;
  onConfirm: () => void;
  onOpenIRIS?: () => void;
  children: React.ReactNode;
  isCheckboxType?: boolean;
}

export function AIConfidenceIndicator({
  fieldName,
  aiData,
  confirmed,
  onConfirm,
  onOpenIRIS,
  children,
}: AIConfidenceIndicatorProps) {
  const [popupOpen, setPopupOpen] = useState(false);

  const isHighConfidence = aiData.confidence >= 95;
  const badgeClass = isHighConfidence
    ? 'text-white bg-green-600 border-green-700'
    : 'text-white bg-red-600 border-red-700';

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between gap-2 w-full">
        <div className="flex-1">{children}</div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <div
            className="relative"
            onMouseEnter={() => setPopupOpen(true)}
            onMouseLeave={() => setPopupOpen(false)}
          >
            <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border leading-none tracking-tight cursor-default select-none ${badgeClass}`}>
              {aiData.confidence}%
            </span>
            {popupOpen && (
              <AISourceModal
                fieldName={fieldName}
                aiData={aiData}
                onOpenIRIS={() => { setPopupOpen(false); onOpenIRIS?.(); }}
              />
            )}
          </div>
          <button
            type="button"
            onClick={onConfirm}
            title={confirmed ? 'Confirmed' : 'Confirm AI suggestion'}
            className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${
              confirmed
                ? 'bg-green-500 text-white'
                : 'border border-gray-300 text-gray-300 hover:border-green-500 hover:text-green-500'
            }`}
          >
            <Check size={11} strokeWidth={confirmed ? 3 : 2} />
          </button>
        </div>
      </div>
    </div>
  );
}

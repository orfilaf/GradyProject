import { useRef, useState } from 'react';
import { Info, Check } from 'lucide-react';
import { AISourceModal } from './AISourceModal';
import { AIFieldData } from '../data/aiMockData';

interface AIConfidenceIndicatorProps {
  fieldName: string;
  aiData: AIFieldData;
  confirmed: boolean;
  onConfirm: () => void;
  children: React.ReactNode;
  isCheckboxType?: boolean;
}

export function AIConfidenceIndicator({
  fieldName,
  aiData,
  confirmed,
  onConfirm,
  children,
  isCheckboxType = false,
}: AIConfidenceIndicatorProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);

  const isHighConfidence = aiData.confidence >= 95;
  const confidenceBadgeClass = isHighConfidence
    ? 'text-green-700 bg-green-50 border-green-300'
    : 'text-red-700 bg-red-50 border-red-300';

  return (
    <div ref={anchorRef} className="relative w-full">
      {isCheckboxType ? (
        <div className="flex items-center justify-between gap-2 w-full">
          <div className="flex-1">{children}</div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <AIBadgeControls
              confidence={aiData.confidence}
              confidenceBadgeClass={confidenceBadgeClass}
              confirmed={confirmed}
              onConfirm={onConfirm}
              onToggleModal={() => setModalOpen((v) => !v)}
              modalOpen={modalOpen}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="flex items-center justify-between mb-1">
            <div className="flex-1 relative">
              {children}
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <AISourceModal
          fieldName={fieldName}
          aiData={aiData}
          onClose={() => setModalOpen(false)}
          anchorRef={anchorRef}
        />
      )}
    </div>
  );
}

interface AIBadgeControlsProps {
  confidence: number;
  confidenceBadgeClass: string;
  confirmed: boolean;
  onConfirm: () => void;
  onToggleModal: () => void;
  modalOpen: boolean;
}

export function AIBadgeControls({
  confidence,
  confidenceBadgeClass,
  confirmed,
  onConfirm,
  onToggleModal,
  modalOpen,
}: AIBadgeControlsProps) {
  return (
    <div className="flex items-center gap-1">
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border leading-none ${confidenceBadgeClass}`}>
        {confidence}
      </span>
      <button
        type="button"
        onClick={onToggleModal}
        title="View AI sources"
        className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${
          modalOpen
            ? 'bg-primary/10 text-primary'
            : 'text-gray-400 hover:text-primary hover:bg-primary/5'
        }`}
      >
        <Info size={12} />
      </button>
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
  );
}

import { Bot, Sparkles } from 'lucide-react';
import { AIFieldData } from '../data/aiMockData';

interface AISourcePopupProps {
  fieldName: string;
  aiData: AIFieldData;
  onOpenIRIS: () => void;
}

export function AISourceModal({ fieldName, aiData, onOpenIRIS }: AISourcePopupProps) {
  const confidenceColor = (c: number) =>
    c >= 95
      ? 'text-green-700 bg-green-50 border-green-300'
      : 'text-amber-700 bg-amber-50 border-amber-300';

  return (
    <div className="absolute right-0 top-7 z-50 w-80 bg-white border border-gray-200 rounded-lg shadow-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-200 flex-shrink-0">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">AI Sources</span>
        <span className="text-xs text-gray-700 font-medium truncate">— {fieldName}</span>
      </div>

      {/* Sources list */}
      <div className="flex flex-col divide-y divide-gray-100 overflow-y-auto max-h-56">
        {aiData.sources.map((source, i) => (
          <div key={i} className="px-3 py-2.5">
            <div className="flex items-center gap-1.5 flex-wrap mb-1">
              <span className="text-xs font-semibold text-gray-800">{source.name}</span>
              <span className="text-gray-300 text-xs">·</span>
              <span className="text-xs text-gray-500">{source.date}</span>
              <span className={`ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${confidenceColor(source.confidence)}`}>
                {source.confidence}%
              </span>
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed pl-2 border-l-2 border-gray-200">
              {source.extract}
            </p>
          </div>
        ))}
      </div>

      {/* Open IRIS button */}
      <div className="px-3 py-2 border-t border-gray-100 bg-gray-50 flex-shrink-0">
        <button
          onMouseDown={(e) => { e.stopPropagation(); onOpenIRIS(); }}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 bg-teal-600 text-white rounded-md text-xs font-medium hover:bg-teal-700 transition-colors"
        >
          <Bot size={12} />
          <span className="tracking-widest font-bold">I.R.I.S.</span>
          <Sparkles size={9} className="text-teal-200" />
        </button>
      </div>
    </div>
  );
}

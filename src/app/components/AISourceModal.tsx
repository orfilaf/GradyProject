import { useRef, useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { AIFieldData } from '../data/aiMockData';

interface AISourceModalProps {
  fieldName: string;
  aiData: AIFieldData;
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLDivElement | null>;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

export function AISourceModal({ fieldName, aiData, onClose }: AISourceModalProps) {
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const text = chatInput.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text },
      {
        role: 'ai',
        text: `Based on the available sources for "${fieldName}", I'm analyzing your question. This is a simulated AI response — in production this would query the clinical AI model with the full source context.`,
      },
    ]);
    setChatInput('');
  };

  const confidenceColor = (c: number) =>
    c >= 95
      ? 'text-green-700 bg-green-50 border-green-300'
      : 'text-red-700 bg-red-50 border-red-300';

  return (
    // Backdrop
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div
        ref={modalRef}
        className="bg-white border border-gray-200 rounded-lg shadow-2xl flex flex-col overflow-hidden w-[480px] max-w-[95vw] max-h-[80vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">AI Sources</span>
            <span className="text-xs text-gray-700 font-medium">— {fieldName}</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={14} />
          </button>
        </div>

        {/* Sources */}
        <div className="flex flex-col divide-y divide-gray-100 overflow-y-auto flex-shrink-0 max-h-64">
          {aiData.sources.map((source, i) => (
            <div key={i} className="px-4 py-3">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xs font-semibold text-gray-800">Source {i + 1}:</span>
                <span className="text-xs text-gray-700 font-medium">{source.name}</span>
                <span className="text-gray-300 text-xs">||</span>
                <span className="text-xs text-gray-500">{source.date}</span>
                <span className="text-gray-300 text-xs">||</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded border ${confidenceColor(source.confidence)}`}>
                  {source.confidence}%
                </span>
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed pl-2 border-l-2 border-gray-200">
                {source.extract}
              </p>
            </div>
          ))}
        </div>

        {/* Chat history */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-2 px-4 py-3 bg-gray-50 border-t border-gray-100 overflow-y-auto max-h-40">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`text-xs px-3 py-2 rounded-lg max-w-[85%] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-200 text-gray-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        )}

        {/* Chat input */}
        <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-200 bg-white flex-shrink-0">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask the AI about this field or request a change..."
            className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            className="flex items-center justify-center w-7 h-7 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors flex-shrink-0"
          >
            <Send size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

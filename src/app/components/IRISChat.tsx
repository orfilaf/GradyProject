import { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, Sparkles, Lightbulb, MessageSquare, ChevronLeft, ChevronRight, History } from 'lucide-react';
import { AISource } from '../data/aiMockData';

interface Message {
  role: 'user' | 'iris';
  text: string;
}

interface FieldContext {
  fieldName: string;
  sources: AISource[];
}

export interface HistoryThread {
  id: string;
  theme: string;
  date: string;
  messages: Message[];
}

interface IRISChatProps {
  onClose: () => void;
  patient?: { name: string; mrn: string; age: number; gender: string; dob: string };
  fieldContext?: FieldContext;
  historyThread?: HistoryThread;
  navCollapsed: boolean;
  onToggleNav: () => void;
}

const PATIENT_QUESTIONS = [
  'Summarize this patient record',
  'What are the key injury findings?',
  'Are there any incomplete fields?',
  "What is the patient's GCS score?",
  'What procedures were performed?',
  'Explain the discharge disposition',
];

const GENERAL_QUESTIONS = [
  'How do I close a case?',
  'What is the TQIP submission deadline?',
  'Explain the activation levels',
  'How are ISS scores calculated?',
  'What does BCVI stand for?',
  'Show me cases pending 1st Review',
];

const FIELD_QUESTIONS = [
  'Why was this value suggested?',
  'What is the coding guideline for this field?',
  'Show me similar cases',
  'What sources support this value?',
  'Flag this field for review',
];

function buildFieldOpeningMessage(fieldName: string, sources: AISource[]): string {
  const sourceLines = sources
    .map(
      (s, i) =>
        `Source ${i + 1}: ${s.name} · ${s.date} · ${s.confidence}%\n"${s.extract}"`
    )
    .join('\n\n');
  return `Here are the sources I found for "${fieldName}":\n\n${sourceLines}\n\nWhat question do you have about ${fieldName}?`;
}

export function IRISChat({ onClose, patient, fieldContext, historyThread, navCollapsed, onToggleNav }: IRISChatProps) {
  const isField = !!fieldContext;
  const isContextual = !!patient;

  const buildInitialMessages = (): Message[] => {
    if (historyThread) return historyThread.messages;
    if (isField) {
      return [{
        role: 'iris',
        text: buildFieldOpeningMessage(fieldContext!.fieldName, fieldContext!.sources),
      }];
    }
    if (isContextual) {
      return [{
        role: 'iris',
        text: `Hello! I'm I.R.I.S.\n\nI'm ready to help you navigate the record for **${patient!.name}** (MRN: ${patient!.mrn}). Ask me about injury details, clinical findings, incomplete fields, or anything related to this patient.`,
      }];
    }
    return [{
      role: 'iris',
      text: "Hello! I'm I.R.I.S., your Integrated Record Intelligence System.\n\nI can help you navigate the registry, look up guidelines, explain fields, or find patients. What do you need?",
    }];
  };

  const [messages, setMessages] = useState<Message[]>(buildInitialMessages);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    setInput('');
    setMessages(prev => [
      ...prev,
      { role: 'user', text: msg },
      {
        role: 'iris',
        text: isField
          ? `I've reviewed the sources for "${fieldContext!.fieldName}" regarding your question: "${msg}".\n\nIn a live environment, I would cross-reference clinical guidelines and registry rules to give you a precise answer.\n\nThis is a simulated response. In production, I.R.I.S. connects to the full clinical data model.`
          : isContextual
          ? `I've reviewed the record for ${patient!.name} regarding "${msg}".\n\nIn a live environment, I would cross-reference all tabs of this record to give you a precise, evidence-based answer.\n\nThis is a simulated response.`
          : `You asked: "${msg}"\n\nIn a live environment, I would search across all registry records, guidelines, and documentation to give you an accurate answer.\n\nThis is a simulated response.`,
      },
    ]);
  };

  const showSuggestions = messages.length === 1;
  const suggestions = isField ? FIELD_QUESTIONS : isContextual ? PATIENT_QUESTIONS : GENERAL_QUESTIONS;

  // Sub-header label
  const subLabel = isField
    ? `Asking about ${fieldContext!.fieldName}`
    : isContextual
    ? 'Patient Record Assistant'
    : 'General registry assistant';

  const SubIcon = isField ? Sparkles : isContextual ? Bot : MessageSquare;
  const subIconColor = isField ? 'text-teal-400' : 'text-teal-600';

  return (
    <div className={`${navCollapsed ? 'w-[528px]' : 'w-[400px]'} flex-shrink-0 border-x-2 border-gray-200 bg-slate-50 flex flex-col h-full relative transition-all duration-200`}>
      {/* Expand/collapse toggle on left edge */}
      <button
        onClick={onToggleNav}
        title={navCollapsed ? 'Restore navigation' : 'Expand chat'}
        className="absolute -left-3.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 bg-white border border-gray-300 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 hover:border-gray-400 transition-colors"
      >
        {navCollapsed ? <ChevronRight size={13} className="text-gray-500" /> : <ChevronLeft size={13} className="text-gray-500" />}
      </button>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-teal-600 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/15 border border-white/25 flex items-center justify-center flex-shrink-0">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold text-white tracking-widest">I.R.I.S.</span>
              <Sparkles size={10} className="text-teal-200" />
            </div>
            <p className="text-[10px] text-teal-200 leading-none tracking-wide">
              {isField ? 'Field Intelligence' : isContextual ? 'Patient Record Assistant' : 'Registry Intelligence System'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="text-white/60 hover:text-white transition-colors p-1 rounded">
          <X size={15} />
        </button>
      </div>

      {/* Context bar */}
      <div className="px-4 py-1.5 bg-teal-50 border-b border-teal-100 flex items-center gap-1.5 flex-shrink-0 flex-wrap">
        <SubIcon size={11} className={subIconColor} />
        <span className="text-xs text-teal-700 font-medium">{subLabel}</span>
        {isContextual && !isField && (
          <>
            <span className="text-teal-300">·</span>
            <span className="text-xs text-teal-600">{patient!.mrn}</span>
            <span className="text-teal-300">·</span>
            <span className="text-xs text-teal-600">{patient!.age}y {patient!.gender}</span>
          </>
        )}
        {historyThread && (
          <>
            <span className="text-teal-300">·</span>
            <span className="text-xs text-teal-500 flex items-center gap-1"><History size={9} /> {historyThread.date}</span>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 bg-slate-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'iris' && (
              <div className="w-6 h-6 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot size={12} className="text-teal-600" />
              </div>
            )}
            <div className={`text-xs px-3.5 py-2.5 rounded-2xl max-w-[85%] leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-primary text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {showSuggestions && (
        <div className="px-4 pt-2 pb-3 bg-slate-50 border-t border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Lightbulb size={11} className="text-teal-500" />
            <span className="text-[10px] font-medium text-teal-600 uppercase tracking-wide">Suggested</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map(q => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-teal-200 text-teal-700 bg-white hover:bg-teal-50 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-t border-gray-200 bg-white flex-shrink-0">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={
            isField
              ? `Ask about ${fieldContext!.fieldName}...`
              : isContextual
              ? 'Ask about this patient...'
              : 'Ask I.R.I.S. anything...'
          }
          className="flex-1 text-xs px-3 py-1.5 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 bg-gray-50"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim()}
          className="flex items-center justify-center w-7 h-7 bg-teal-600 text-white rounded-full hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
        >
          <Send size={12} />
        </button>
      </div>
    </div>
  );
}

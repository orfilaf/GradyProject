import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Send, Bot } from 'lucide-react';
import { GuidelineFlowCanvas } from './GuidelineFlowCanvas';

// ── Types ─────────────────────────────────────────────────────────────────────────────────

export type BuilderStep =
  | 'name' | 'purpose' | 'objectives' | 'background' | 'references'
  | 'population-define' | 'population-more'
  | 'cluster-intro' | 'cluster-name' | 'cluster-criteria' | 'cluster-more'
  | 'actions-define' | 'actions-direct'
  | 'done';

export interface StepCtx {
  populationIdx: number;
  clusterIdx: number;
  actionIdx: number;
}

export interface GuidelineData {
  name: string;
  purpose: string;
  objectives: string;
  background: string;
  references: string;
  patientPopulations: string[];
  hasClusters: boolean;
  clusters: { name: string; criteria: string }[];
  actions: string[][];
}

export interface SavedGuideline extends GuidelineData {
  id: string;
  createdAt: string;
}

// ── Bot script ──────────────────────────────────────────────────────────────────────────

export function getBotMsg(step: BuilderStep, data: GuidelineData, ctx: StepCtx): string {
  switch (step) {
    case 'name':
      return "Hi! I'll help you build a care guideline step by step.\n\nWhat is the **name** of this guideline?";
    case 'purpose':
      return `Got it — **${data.name}**.\n\nWhat is the **purpose** of this guideline? Describe the clinical goal it serves.`;
    case 'objectives':
      return "What are the **objectives**? List the specific outcomes or behaviors this guideline aims to achieve.";
    case 'background':
      return "Any **background** context? (Evidence base, history, or rationale — optional, press Enter to skip.)";
    case 'references':
      return "Any **references**? (Guidelines, publications, or standards — optional, press Enter to skip.)";
    case 'population-define':
      return `Now let's define **patient populations**.\n\nDescribe population ${ctx.populationIdx + 1}: Who does this guideline apply to?`;
    case 'population-more':
      return `Population ${ctx.populationIdx} added. Do you have **another patient population** to define?`;
    case 'cluster-intro':
      return `Does population ${ctx.populationIdx} have **multiple sub-groups or clusters** that need different care pathways?\n\n(Yes = define clusters, No = go straight to care actions)`;
    case 'cluster-name':
      return `What is the **name** of cluster ${ctx.clusterIdx + 1}?`;
    case 'cluster-criteria':
      return `What **criteria** define a patient in cluster "${data.clusters[ctx.clusterIdx]?.name}"?`;
    case 'cluster-more':
      return `Cluster ${ctx.clusterIdx} defined. Do you have **another cluster** to add?`;
    case 'actions-define':
      return data.hasClusters
        ? `What **care actions** apply to cluster "${data.clusters[ctx.actionIdx]?.name}"? List them one per line.`
        : `What **care actions** apply to this population? List them one per line.`;
    case 'actions-direct':
      return `What **care actions** apply to this population? List them one per line.`;
    case 'done':
      return `**${data.name}** is ready to save! Review the flow on the right, then click **Save Guideline**.`;
    default:
      return '';
  }
}

// ── State machine ─────────────────────────────────────────────────────────────────────────

export function advance(
  step: BuilderStep,
  choice: 'yes' | 'no' | null,
  data: GuidelineData,
  ctx: StepCtx,
): { nextStep: BuilderStep; nextCtx: StepCtx } {
  let nextCtx = { ...ctx };
  switch (step) {
    case 'name':          return { nextStep: 'purpose',           nextCtx };
    case 'purpose':       return { nextStep: 'objectives',        nextCtx };
    case 'objectives':    return { nextStep: 'background',        nextCtx };
    case 'background':    return { nextStep: 'references',        nextCtx };
    case 'references':    return { nextStep: 'population-define', nextCtx };
    case 'population-define':
      nextCtx.populationIdx += 1;
      return { nextStep: 'population-more', nextCtx };
    case 'population-more':
      if (choice === 'yes') return { nextStep: 'population-define', nextCtx };
      return { nextStep: 'cluster-intro', nextCtx };
    case 'cluster-intro':
      if (choice === 'yes') return { nextStep: 'cluster-name', nextCtx };
      return { nextStep: 'actions-direct', nextCtx };
    case 'cluster-name':  return { nextStep: 'cluster-criteria', nextCtx };
    case 'cluster-criteria':
      nextCtx.clusterIdx += 1;
      return { nextStep: 'cluster-more', nextCtx };
    case 'cluster-more':
      if (choice === 'yes') return { nextStep: 'cluster-name', nextCtx };
      nextCtx.actionIdx = 0;
      return { nextStep: 'actions-define', nextCtx };
    case 'actions-define':
      nextCtx.actionIdx += 1;
      if (nextCtx.actionIdx < data.clusters.length) return { nextStep: 'actions-define', nextCtx };
      return { nextStep: 'done', nextCtx };
    case 'actions-direct':
      return { nextStep: 'done', nextCtx };
    default:
      return { nextStep: 'done', nextCtx };
  }
}

export function applyInput(
  step: BuilderStep,
  value: string,
  data: GuidelineData,
  ctx: StepCtx,
): GuidelineData {
  const d = { ...data };
  switch (step) {
    case 'name':       d.name       = value; break;
    case 'purpose':    d.purpose    = value; break;
    case 'objectives': d.objectives = value; break;
    case 'background': d.background = value; break;
    case 'references': d.references = value; break;
    case 'population-define':
      d.patientPopulations = [...d.patientPopulations];
      d.patientPopulations[ctx.populationIdx] = value;
      break;
    case 'cluster-intro':
      d.hasClusters = value.toLowerCase().startsWith('y');
      break;
    case 'cluster-name':
      d.clusters = [...d.clusters];
      d.clusters[ctx.clusterIdx] = { name: value, criteria: d.clusters[ctx.clusterIdx]?.criteria ?? '' };
      break;
    case 'cluster-criteria':
      d.clusters = [...d.clusters];
      d.clusters[ctx.clusterIdx] = { name: d.clusters[ctx.clusterIdx]?.name ?? '', criteria: value };
      break;
    case 'actions-define':
      d.actions = [...d.actions];
      d.actions[ctx.actionIdx] = value.split('\n').map(s => s.trim()).filter(Boolean);
      break;
    case 'actions-direct':
      d.actions = [value.split('\n').map(s => s.trim()).filter(Boolean)];
      break;
  }
  return d;
}

export function inputKind(step: BuilderStep): 'text' | 'textarea' | 'choice' {
  if (['population-more', 'cluster-intro', 'cluster-more'].includes(step)) return 'choice';
  if (['objectives', 'background', 'references', 'population-define', 'cluster-criteria', 'actions-define', 'actions-direct'].includes(step)) return 'textarea';
  return 'text';
}

// ── Chat message ────────────────────────────────────────────────────────────────────────

function ChatBubble({ role, text }: { role: 'bot' | 'user'; text: string }) {
  const isBot = role === 'bot';
  return (
    <div className={`flex gap-2 ${isBot ? '' : 'flex-row-reverse'}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot size={14} className="text-teal-700" />
        </div>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-wrap ${
          isBot
            ? 'bg-white border border-gray-200 text-gray-700 rounded-tl-sm shadow-sm'
            : 'bg-teal-600 text-white rounded-tr-sm'
        }`}
        dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
      />
    </div>
  );
}

function ThinkingDot() {
  return (
    <div className="flex gap-2">
      <div className="w-7 h-7 rounded-full bg-teal-100 border border-teal-200 flex items-center justify-center flex-shrink-0">
        <Bot size={14} className="text-teal-700" />
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center shadow-sm">
        {[0, 150, 300].map(d => (
          <span key={d} className="w-1.5 h-1.5 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
    </div>
  );
}

// ── Main builder ────────────────────────────────────────────────────────────────────────

const EMPTY_DATA: GuidelineData = {
  name: '', purpose: '', objectives: '', background: '', references: '',
  patientPopulations: [], hasClusters: false, clusters: [], actions: [],
};

const EMPTY_CTX: StepCtx = { populationIdx: 0, clusterIdx: 0, actionIdx: 0 };

interface Message { role: 'bot' | 'user'; text: string }

interface GuidelineBuilderProps {
  onBack: () => void;
  onSave: (g: SavedGuideline) => void;
}

export function GuidelineBuilder({ onBack, onSave }: GuidelineBuilderProps) {
  const [step, setStep]         = useState<BuilderStep>('name');
  const [ctx, setCtx]           = useState<StepCtx>(EMPTY_CTX);
  const [data, setData]         = useState<GuidelineData>(EMPTY_DATA);
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: getBotMsg('name', EMPTY_DATA, EMPTY_CTX) }]);
  const [input, setInput]       = useState('');
  const [thinking, setThinking] = useState(false);
  const bottomRef               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const submit = (value: string, choice: 'yes' | 'no' | null = null) => {
    if (step === 'done') return;
    const userText = choice ? (choice === 'yes' ? 'Yes' : 'No') : value.trim();
    if (!userText) return;

    const newData = applyInput(step, choice ? choice : value, data, ctx);
    setData(newData);
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setThinking(true);

    setTimeout(() => {
      const { nextStep, nextCtx } = advance(step, choice, newData, ctx);
      setStep(nextStep);
      setCtx(nextCtx);
      setThinking(false);
      setMessages(prev => [...prev, { role: 'bot', text: getBotMsg(nextStep, newData, nextCtx) }]);
    }, 600);
  };

  const handleSave = () => {
    const g: SavedGuideline = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    onSave(g);
    onBack();
  };

  const kind = inputKind(step);

  return (
    <div className="flex-1 flex overflow-hidden">

      {/* Left: chat */}
      <div className="w-[380px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center">
            <Bot size={13} className="text-teal-700" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Guideline Builder</span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
          {messages.map((m, i) => <ChatBubble key={i} role={m.role} text={m.text} />)}
          {thinking && <ThinkingDot />}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        {step !== 'done' && (
          <div className="border-t border-gray-100 p-3">
            {kind === 'choice' ? (
              <div className="flex gap-2">
                <button
                  onClick={() => submit('yes', 'yes')}
                  className="flex-1 py-2 rounded-xl bg-teal-600 text-white text-sm font-semibold hover:bg-teal-700 transition-colors"
                >Yes</button>
                <button
                  onClick={() => submit('no', 'no')}
                  className="flex-1 py-2 rounded-xl bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors"
                >No</button>
              </div>
            ) : kind === 'textarea' ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && e.metaKey) submit(input); }}
                  rows={4}
                  placeholder="Type here… (⌘Enter to send)"
                  className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
                />
                <button
                  onClick={() => submit(input)}
                  disabled={!input.trim()}
                  className="self-end flex items-center gap-1.5 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={12} /> Send
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') submit(input); }}
                  placeholder="Type here…"
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-100"
                />
                <button
                  onClick={() => submit(input)}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            )}
          </div>
        )}

        {step === 'done' && (
          <div className="border-t border-gray-100 p-3">
            <button
              onClick={handleSave}
              className="w-full py-2.5 bg-teal-600 text-white text-sm font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
            >
              Save Guideline
            </button>
          </div>
        )}
      </div>

      {/* Right: live flow canvas */}
      <GuidelineFlowCanvas data={data} step={step} ctx={ctx} />
    </div>
  );
}

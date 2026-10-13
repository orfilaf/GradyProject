import { useState, useEffect } from 'react';
import { FileText, Users, GitBranch, CheckSquare, ChevronDown, HelpCircle } from 'lucide-react';
import type { GuidelineData, BuilderStep, StepCtx } from './GuidelineBuilder';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      className="flex flex-col items-center w-full transition-all duration-500 ease-out"
      style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
    >
      {children}
    </div>
  );
}

function Connector() {
  return (
    <div className="flex flex-col items-center py-0.5">
      <div className="w-px h-5 bg-gray-300" />
      <ChevronDown size={12} className="text-gray-300 -mt-1" strokeWidth={2} />
    </div>
  );
}

function ForkConnector({ count }: { count: number }) {
  if (count <= 1) return <Connector />;
  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-px h-5 bg-gray-300" />
      <div className="relative w-full">
        <div
          className="absolute top-0 h-px bg-gray-300"
          style={{ left: `${50 / count}%`, right: `${50 / count}%` }}
        />
        <div className="flex justify-around w-full">
          {Array.from({ length: count }).map((_, i) => (
            <div key={i} className="w-px h-5 bg-gray-300" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ActiveDot() {
  return <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse flex-shrink-0" />;
}

function FieldRow({ label, value, active = false, multiline = false }: { label: string; value: string; active?: boolean; multiline?: boolean }) {
  const hasValue = value.trim().length > 0;
  return (
    <div className="flex gap-2 items-start">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide w-20 flex-shrink-0 pt-0.5">{label}</span>
      <div className="flex-1 flex items-center gap-1.5 min-w-0">
        {active && !hasValue && <ActiveDot />}
        <span className={`text-xs leading-relaxed break-words min-w-0 ${hasValue ? 'text-gray-800' : 'text-gray-300 italic'} ${multiline ? 'whitespace-pre-wrap' : ''}`}>
          {hasValue ? value : 'Waiting…'}
        </span>
      </div>
    </div>
  );
}

function FieldCompact({ label, value, active = false, multiline = false }: { label: string; value: string; active?: boolean; multiline?: boolean }) {
  const hasValue = value.trim().length > 0;
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      <div className="flex items-start gap-1.5 min-w-0">
        {active && !hasValue && <ActiveDot />}
        <span className={`text-[11px] leading-relaxed break-words min-w-0 ${hasValue ? 'text-gray-700' : 'text-gray-300 italic'} ${multiline ? 'whitespace-pre-wrap' : ''}`}>
          {hasValue ? value : 'Waiting…'}
        </span>
      </div>
    </div>
  );
}

const META_STEPS: BuilderStep[] = ['name', 'purpose', 'objectives', 'background', 'references'];

function InfoNode({ data, step }: { data: GuidelineData; step: BuilderStep }) {
  const isActive = META_STEPS.includes(step);
  return (
    <div className={`w-full bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${isActive ? 'border-teal-300 ring-2 ring-teal-100' : 'border-gray-200'}`}>
      <div className="bg-teal-50 border-b border-teal-100 px-4 py-2.5 flex items-center gap-2">
        <div className="w-6 h-6 rounded-md bg-teal-100 flex items-center justify-center">
          <FileText size={12} className="text-teal-700" />
        </div>
        <span className="text-xs font-bold text-teal-800 uppercase tracking-wide">Guideline Info</span>
        {isActive && <ActiveDot />}
      </div>
      <div className="px-4 py-3 flex flex-col gap-2">
        <FieldRow label="Name"       value={data.name}       active={step === 'name'} />
        <FieldRow label="Purpose"    value={data.purpose}    active={step === 'purpose'}    multiline />
        <FieldRow label="Objectives" value={data.objectives} active={step === 'objectives'} multiline />
        <FieldRow label="Background" value={data.background} active={step === 'background'} multiline />
        <FieldRow label="References" value={data.references} active={step === 'references'} multiline />
      </div>
    </div>
  );
}

function PopulationNode({ population, index, isActive }: { population: string; index: number; isActive: boolean }) {
  return (
    <FadeIn>
      <div className={`w-full bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${isActive ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'}`}>
        <div className="bg-blue-50 border-b border-blue-100 px-4 py-2.5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-100 flex items-center justify-center">
            <Users size={12} className="text-blue-700" />
          </div>
          <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Patient Population {index + 1}</span>
          {isActive && <ActiveDot />}
        </div>
        <div className="px-4 py-3">
          {population
            ? <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-wrap break-words">{population}</p>
            : <p className="text-xs text-gray-300 italic">Defining…</p>
          }
        </div>
      </div>
    </FadeIn>
  );
}

function SegmentationDecisionNode({ isActive }: { isActive: boolean }) {
  return (
    <FadeIn>
      <div className={`w-full border-2 border-dashed rounded-xl px-4 py-3 flex items-center gap-3 transition-all duration-300 ${isActive ? 'border-teal-400 bg-teal-50' : 'border-gray-200 bg-white'}`}>
        <div className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
          <HelpCircle size={14} className={isActive ? 'text-teal-500' : 'text-gray-300'} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${isActive ? 'text-teal-700' : 'text-gray-400'}`}>Patient Segmentation</p>
          <p className={`text-[11px] mt-0.5 ${isActive ? 'text-teal-600' : 'text-gray-300'}`}>Does this population have multiple clusters?</p>
        </div>
        {isActive && <ActiveDot />}
      </div>
    </FadeIn>
  );
}

function ClusterColumn({ cluster, index, actions, isClusterActive, isActionsActive }: {
  cluster: { name: string; criteria: string };
  index: number;
  actions?: string[];
  isClusterActive: boolean;
  isActionsActive: boolean;
}) {
  const hasActions = actions && actions.length > 0;
  const showActionsCard = isActionsActive || hasActions;
  return (
    <FadeIn>
      <div className="flex-1 min-w-0 flex flex-col items-center">
        <div className={`w-full bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${isClusterActive ? 'border-violet-300 ring-2 ring-violet-100' : 'border-gray-200'}`}>
          <div className="bg-violet-50 border-b border-violet-100 px-3 py-2 flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-violet-100 flex items-center justify-center flex-shrink-0">
              <GitBranch size={10} className="text-violet-700" />
            </div>
            <span className="text-[10px] font-bold text-violet-800 uppercase tracking-wide truncate flex-1">
              {cluster.name || `Cluster ${index + 1}`}
            </span>
            {isClusterActive && <ActiveDot />}
          </div>
          <div className="px-3 py-2.5 flex flex-col gap-2">
            <FieldCompact label="Name"     value={cluster.name}     active={isClusterActive && !cluster.name} />
            <FieldCompact label="Criteria" value={cluster.criteria} active={isClusterActive && !!cluster.name} multiline />
          </div>
        </div>
        {showActionsCard && (
          <>
            <div className="w-px h-3 bg-gray-300" />
            <div className={`w-full bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${isActionsActive ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200'}`}>
              <div className="bg-green-50 border-b border-green-100 px-3 py-2 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckSquare size={10} className="text-green-700" />
                </div>
                <span className="text-[10px] font-bold text-green-800 uppercase tracking-wide">Care Actions</span>
                {isActionsActive && !hasActions && <ActiveDot />}
              </div>
              <div className="px-3 py-2.5">
                {hasActions ? (
                  <ul className="flex flex-col gap-1.5">
                    {actions.map((a, j) => (
                      <li key={j} className="flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                        <span className="text-[11px] text-gray-700 leading-relaxed">{a}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[11px] text-gray-300 italic">Defining actions…</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </FadeIn>
  );
}

function DirectActionsNode({ actions, isActive }: { actions?: string[]; isActive: boolean }) {
  const hasActions = actions && actions.length > 0;
  return (
    <FadeIn>
      <div className={`w-full bg-white rounded-xl border shadow-sm overflow-hidden transition-all duration-300 ${isActive ? 'border-green-300 ring-2 ring-green-100' : 'border-gray-200'}`}>
        <div className="bg-green-50 border-b border-green-100 px-4 py-2.5 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center">
            <CheckSquare size={12} className="text-green-700" />
          </div>
          <span className="text-xs font-bold text-green-800 uppercase tracking-wide">Care Actions</span>
          {isActive && !hasActions && <ActiveDot />}
        </div>
        <div className="px-4 py-3">
          {hasActions ? (
            <ul className="flex flex-col gap-1.5">
              {actions.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                  <span className="text-xs text-gray-700 leading-relaxed">{a}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-300 italic">Defining actions…</p>
          )}
        </div>
      </div>
    </FadeIn>
  );
}

function DoneBanner({ data }: { data: GuidelineData }) {
  return (
    <FadeIn>
      <div className="w-full bg-teal-600 rounded-xl px-4 py-3 text-center">
        <p className="text-sm font-bold text-white">{data.name}</p>
        <p className="text-xs text-teal-100 mt-0.5">
          {data.patientPopulations.length} population{data.patientPopulations.length !== 1 ? 's' : ''}
          {data.hasClusters && data.clusters.length > 0 && <> · {data.clusters.length} cluster{data.clusters.length !== 1 ? 's' : ''}</>}
          {' · '}Ready to save
        </p>
      </div>
    </FadeIn>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 py-20 text-center">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
        <GitBranch size={24} className="text-teal-300" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-400">Flow preview</p>
        <p className="text-xs text-gray-300 mt-0.5">Your guideline structure will appear here</p>
      </div>
    </div>
  );
}

interface CanvasProps {
  data: GuidelineData;
  step: BuilderStep;
  ctx: StepCtx;
}

export function GuidelineFlowCanvas({ data, step, ctx }: CanvasProps) {
  const hasStarted = data.name.trim().length > 0;

  const inMetaStep      = (['name', 'purpose', 'objectives', 'background', 'references'] as BuilderStep[]).includes(step);
  const inPopStep       = (['population-define', 'population-more'] as BuilderStep[]).includes(step);
  const inClusterIntro  = step === 'cluster-intro';
  const inClusterStep   = (['cluster-name', 'cluster-criteria', 'cluster-more'] as BuilderStep[]).includes(step);
  const inActionsStep   = step === 'actions-define';
  const inDirectActions = step === 'actions-direct';
  const isDone          = step === 'done';

  const showPopulations      = data.patientPopulations.length > 0 || inPopStep;
  const showSegmentDecision  = showPopulations && (inClusterIntro || inClusterStep || inActionsStep || inDirectActions || isDone);
  const showDirectActions    = !data.hasClusters && (inDirectActions || (isDone && !!data.actions[0]));

  const displayedClusters = [...data.clusters];
  if (inClusterStep && data.clusters.length === ctx.clusterIdx) {
    displayedClusters.push({ name: '', criteria: '' });
  }
  const showClusters = data.hasClusters && displayedClusters.length > 0;

  // suppress unused warning
  void inMetaStep;

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="flex flex-col items-center px-8 py-8 min-h-full">
        <div className={`w-full flex flex-col items-center gap-0 transition-all duration-500 ${showClusters && displayedClusters.length > 1 ? 'max-w-3xl' : 'max-w-md'}`}>

          {hasStarted ? <InfoNode data={data} step={step} /> : <EmptyState />}

          {hasStarted && showPopulations && (
            <>
              <Connector />
              <div className="w-full flex flex-col gap-2">
                {data.patientPopulations.map((pop, i) => (
                  <div key={i} className="w-full flex flex-col items-center gap-0">
                    {i > 0 && <div className="w-px h-2 bg-gray-200 mb-1" />}
                    <PopulationNode population={pop} index={i} isActive={inPopStep && ctx.populationIdx === i} />
                  </div>
                ))}
                {inPopStep && data.patientPopulations.length === ctx.populationIdx && (
                  <div className="w-full flex flex-col items-center gap-0">
                    {ctx.populationIdx > 0 && <div className="w-px h-2 bg-gray-200 mb-1" />}
                    <PopulationNode population="" index={ctx.populationIdx} isActive />
                  </div>
                )}
              </div>
            </>
          )}

          {hasStarted && showSegmentDecision && (
            <>
              <Connector />
              <SegmentationDecisionNode isActive={inClusterIntro} />
            </>
          )}

          {hasStarted && showClusters && (
            <>
              <ForkConnector count={displayedClusters.length} />
              <div className="w-full flex gap-3 items-start">
                {displayedClusters.map((cluster, i) => (
                  <ClusterColumn
                    key={i}
                    cluster={cluster}
                    index={i}
                    actions={data.actions[i]}
                    isClusterActive={inClusterStep && ctx.clusterIdx === i}
                    isActionsActive={inActionsStep && ctx.actionIdx === i}
                  />
                ))}
              </div>
            </>
          )}

          {hasStarted && showDirectActions && (
            <>
              <Connector />
              <DirectActionsNode actions={data.actions[0]} isActive={inDirectActions} />
            </>
          )}

          {isDone && (
            <>
              <Connector />
              <DoneBanner data={data} />
            </>
          )}

          <div className="h-12" />
        </div>
      </div>
    </div>
  );
}

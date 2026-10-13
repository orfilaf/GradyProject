import { useState } from 'react';
import { BookOpen, Plus, Users, GitBranch, Clock, ChevronRight } from 'lucide-react';
import { GuidelineBuilder, SavedGuideline } from './GuidelineBuilder';

function GuidelineCard({ g, onClick }: { g: SavedGuideline; onClick: () => void }) {
  const date = new Date(g.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl border border-gray-200 p-5 text-left hover:border-teal-300 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-100 transition-colors">
          <BookOpen size={16} className="text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-gray-800 leading-tight truncate">{g.name}</p>
            <ChevronRight size={14} className="text-gray-300 group-hover:text-teal-500 flex-shrink-0 mt-0.5 transition-colors" />
          </div>
          {g.purpose && (
            <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">{g.purpose}</p>
          )}
          <div className="flex items-center gap-3 mt-2.5">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Users size={10} />
              {g.patientPopulations.length} population{g.patientPopulations.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <GitBranch size={10} />
              {g.clusters.length} cluster{g.clusters.length !== 1 ? 's' : ''}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400 ml-auto">
              <Clock size={10} />
              {date}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

function GuidelineDetail({ g, onClose }: { g: SavedGuideline; onClose: () => void }) {
  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onClose} className="text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors">
            ← Guidelines
          </button>
          <span className="text-gray-300 text-xs">/</span>
          <span className="text-xs text-gray-500 truncate">{g.name}</span>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-4">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center">
              <BookOpen size={18} className="text-teal-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">{g.name}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Created {new Date(g.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {' · '}{g.patientPopulations.length} population{g.patientPopulations.length !== 1 ? 's' : ''}
                {g.hasClusters && g.clusters.length > 0 && <> · {g.clusters.length} cluster{g.clusters.length !== 1 ? 's' : ''}</>}
              </p>
            </div>
          </div>
          {g.purpose     && <div className="mb-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Purpose</p>    <p className="text-sm text-gray-700 leading-relaxed">{g.purpose}</p></div>}
          {g.objectives  && <div className="mb-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Objectives</p>  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{g.objectives}</p></div>}
          {g.background  && <div className="mb-3"><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Background</p>  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{g.background}</p></div>}
          {g.references  && <div>              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">References</p>  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{g.references}</p></div>}
        </div>

        {g.patientPopulations.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Users size={13} className="text-blue-500" />
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Patient Populations</p>
            </div>
            <div className="flex flex-col gap-2">
              {g.patientPopulations.map((pop, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 px-4 py-3">
                  <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wide mb-1">Population {i + 1}</p>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{pop}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {g.clusters.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <GitBranch size={13} className="text-violet-500" />
              <p className="text-xs font-bold text-gray-600 uppercase tracking-wide">Clusters & Actions</p>
            </div>
            <div className="flex flex-col gap-3">
              {g.clusters.map((cluster, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-violet-50 border-b border-violet-100 px-4 py-2.5">
                    <p className="text-xs font-bold text-violet-800">{cluster.name || `Cluster ${i + 1}`}</p>
                  </div>
                  <div className="px-4 py-3">
                    {cluster.criteria && (
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">Criteria</p>
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{cluster.criteria}</p>
                      </div>
                    )}
                    {g.actions[i] && g.actions[i].length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1.5">Care Actions</p>
                        <ul className="flex flex-col gap-1.5">
                          {g.actions[i].map((action, j) => (
                            <li key={j} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />
                              <span className="text-sm text-gray-700">{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyList({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 pb-16">
      <div className="flex flex-col items-center gap-4 text-center max-w-xs">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center">
          <BookOpen size={28} className="text-teal-300" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">No guidelines yet</p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed">Create your first care guideline using the guided builder.</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
        >
          <Plus size={14} />
          Create Guideline
        </button>
      </div>
    </div>
  );
}

type View = 'list' | 'builder' | 'detail';

export function PIGuidelinesSection() {
  const [guidelines, setGuidelines] = useState<SavedGuideline[]>([]);
  const [view, setView]             = useState<View>('list');
  const [selected, setSelected]     = useState<SavedGuideline | null>(null);

  const handleSave = (g: SavedGuideline) => setGuidelines(prev => [g, ...prev]);

  if (view === 'builder') {
    return <GuidelineBuilder onBack={() => setView('list')} onSave={handleSave} />;
  }
  if (view === 'detail' && selected) {
    return <GuidelineDetail g={selected} onClose={() => { setView('list'); setSelected(null); }} />;
  }
  if (guidelines.length === 0) {
    return <EmptyList onCreate={() => setView('builder')} />;
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-8 py-6 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <BookOpen size={18} className="text-teal-600" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Care Guidelines</h1>
            <p className="text-xs text-gray-500">{guidelines.length} guideline{guidelines.length !== 1 ? 's' : ''} defined</p>
          </div>
          <button
            onClick={() => setView('builder')}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-xl hover:bg-teal-700 transition-colors shadow-sm"
          >
            <Plus size={14} />
            Create Guideline
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {guidelines.map(g => (
            <GuidelineCard key={g.id} g={g} onClick={() => { setSelected(g); setView('detail'); }} />
          ))}
          <button
            onClick={() => setView('builder')}
            className="bg-white rounded-xl border border-dashed border-gray-300 p-5 flex flex-col items-center justify-center gap-2 hover:border-teal-400 hover:bg-teal-50 transition-all group min-h-[120px]"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
              <Plus size={16} className="text-gray-400 group-hover:text-teal-600 transition-colors" />
            </div>
            <span className="text-xs font-medium text-gray-400 group-hover:text-teal-600 transition-colors">Add guideline</span>
          </button>
        </div>
      </div>
    </div>
  );
}

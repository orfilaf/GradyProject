import { useState, useEffect, useRef } from 'react';
import { PatientHeader } from './PatientHeader';
import { IRISChat } from './IRISChat';
import { mockGuidelines, ALL_GUIDELINES, getWorstStatus, getAlertCounts, Guideline, FlagStatus } from '../data/guidelineData';
import { patientDataCategories } from '../data/patientFields';
import {
  ChartLine,
  BookOpen,
  GitBranch,
  MapPin,
  Filter,
  CalendarDays,
  Archive,
  ChevronDown,
  ChevronRight,
  Bot,
  Sparkles,
  Lock,
  Clock,
  Check,
  X,
  Plus,
  Search,
  User,
  Activity,
  Ambulance,
  Siren,
  ClipboardList,
  Heart,
  FileText,
  Stethoscope,
  TrendingUp,
  Pill,
  Users,
} from 'lucide-react';
import { AISourceModal } from './AISourceModal';
import { aiFieldData } from '../data/aiMockData';

type ActiveView =
  | { type: 'timeline3' }
  | { type: 'pips' }
  | { type: 'guidelines-overview' }
  | { type: 'guideline'; id: string }
  | { type: 'guidelines-htabs'; activeId: string }
  | { type: 'registry'; tabId: string; tabLabel: string };

const STATUS_DOT: Record<FlagStatus, string> = {
  green: 'bg-green-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
};

const STATUS_ICON: Record<FlagStatus, string> = {
  green: '✅',
  amber: '⚠️',
  red: '‼️',
};

const registryCategories = patientDataCategories.filter(c => c.id !== 'processimprovement');

const registryCategoryIcons: Record<string, any> = {
  demographic: User,
  injury: Activity,
  prehospital: Ambulance,
  emergency: Siren,
  procedures: ClipboardList,
  preexisting: Heart,
  diagnosis: FileText,
  hospitalevents: Stethoscope,
  outcome: TrendingUp,
  tqip: Pill,
  practitioners: Users,
  recordhistory: Archive,
};

interface PIPatientRecordProps {
  patient: {
    mrn: string;
    name: string;
    age: number;
    gender: string;
    dob: string;
    address?: string;
    phone?: string;
  };
  onBackToList?: () => void;
  initialView?: ActiveView;
}

const timelineEvents = [
  { id: 1, timestamp: '2024-06-07 14:30', event: 'Patient Arrival', description: 'Patient arrived via ambulance with car accident injuries', user: 'EMS Team' },
  { id: 2, timestamp: '2024-06-07 14:35', event: 'Triage Assessment', description: 'Level 4 trauma activation. Initial vitals: BP 120/80, HR 95, SpO2 98%', user: 'Nurse Thompson' },
  { id: 3, timestamp: '2024-06-07 14:45', event: 'Trauma Team Activation', description: 'Trauma team assembled. Dr. Smith and Dr. Johnson assigned.', user: 'System' },
  { id: 4, timestamp: '2024-06-07 15:00', event: 'Initial Examination', description: 'Primary survey completed. Multiple contusions, possible rib fractures.', user: 'Dr. Smith' },
  { id: 5, timestamp: '2024-06-07 15:30', event: 'Imaging Ordered', description: 'CT scan of chest and abdomen ordered', user: 'Dr. Smith' },
  { id: 6, timestamp: '2024-06-07 16:15', event: 'Imaging Complete', description: 'CT results: 2 fractured ribs, no internal bleeding detected', user: 'Radiology' },
  { id: 7, timestamp: '2024-06-07 17:00', event: 'Treatment Plan', description: 'Pain management initiated. Observation for 24 hours.', user: 'Dr. Johnson' },
];

// ── Guideline bubble card (for overview grid) ─────────────────────────────────────────────────
function GuidelineBubble({ guideline, onClick }: { guideline: Guideline; onClick: () => void }) {
  const worst = getWorstStatus(guideline);
  const counts = getAlertCounts(guideline);
  const alertFlags = guideline.categories.flatMap(c => c.flags).filter(f => f.status !== 'green');

  const borderColor = worst === 'red' ? 'border-red-200 hover:border-red-400' : worst === 'amber' ? 'border-amber-200 hover:border-amber-400' : 'border-green-200 hover:border-green-400';
  const headerBg = worst === 'red' ? 'bg-red-50' : worst === 'amber' ? 'bg-amber-50' : 'bg-green-50';
  const acronymColor = worst === 'red' ? 'text-red-600' : worst === 'amber' ? 'text-amber-600' : 'text-green-700';

  return (
    <button
      onClick={onClick}
      className={`bg-white rounded-xl border-2 ${borderColor} text-left hover:shadow-md transition-all w-full`}
    >
      {/* Card header */}
      <div className={`${headerBg} rounded-t-xl px-4 py-3 flex items-start justify-between`}>
        <div>
          <span className={`text-[10px] font-bold tracking-widest uppercase ${acronymColor}`}>{guideline.acronym}</span>
          <h3 className="text-sm font-semibold text-gray-800 mt-0.5 leading-tight">{guideline.name}</h3>
        </div>
        <span className="text-xl leading-none flex-shrink-0 ml-2">{STATUS_ICON[worst]}</span>
      </div>

      {/* Card body */}
      <div className="px-4 py-3">
        {alertFlags.length === 0 ? (
          <p className="text-xs text-green-600 font-medium">All {counts.green} criteria met</p>
        ) : (
          <div className="flex flex-col gap-1">
            {alertFlags.slice(0, 3).map((flag, i) => (
              <p key={i} className="text-xs text-gray-600">
                {STATUS_ICON[flag.status]} {flag.label}
              </p>
            ))}
            {alertFlags.length > 3 && (
              <p className="text-xs text-gray-400 italic">+{alertFlags.length - 3} more open items</p>
            )}
          </div>
        )}

        {/* Flag summary chips */}
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
          {counts.red > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-100 text-red-700">‼️ {counts.red}</span>
          )}
          {counts.amber > 0 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700">⚠️ {counts.amber}</span>
          )}
          {counts.green > 0 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-green-100 text-green-700">✅ {counts.green}</span>
          )}
        </div>
      </div>
    </button>
  );
}

// ── Guideline detail view ───────────────────────────────────────────────────────────────────────
function GuidelineDetail({ guideline }: { guideline: Guideline }) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <span className="text-xs font-bold text-teal-600 tracking-widest uppercase">{guideline.acronym}</span>
        <h2 className="text-xl font-semibold text-gray-900">{guideline.name}</h2>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {guideline.categories.map(cat => (
          <div key={cat.name} className="bg-white rounded-xl border border-teal-200 p-3">
            <h3 className="text-sm font-semibold text-gray-700 mb-2 pb-1.5 border-b border-teal-100">{cat.name}</h3>
            <div className="flex flex-col gap-1">
              {cat.flags.map((flag, i) => (
                <button
                  key={i}
                  className="flex items-center gap-2 text-left px-2 py-1.5 rounded-md hover:bg-teal-50 transition-colors group w-full"
                >
                  <span className="text-sm flex-shrink-0">{STATUS_ICON[flag.status]}</span>
                  <span className="text-xs text-gray-700 group-hover:text-gray-900 flex-1 leading-snug">{flag.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main PIPatientRecord component ────────────────────────────────────────────────────────────────
export function PIPatientRecord({ patient, onBackToList, initialView }: PIPatientRecordProps) {
  const [activeView, setActiveView] = useState<ActiveView>(initialView ?? { type: 'timeline3' });
  const [registryExpanded, setRegistryExpanded] = useState(false);
  const [irisOpen, setIrisOpen] = useState(false);
  const [irisKey, setIrisKey] = useState(0);
  const [irisFieldContext, setIrisFieldContext] = useState<{ fieldName: string; sources: any[] } | undefined>(undefined);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [caseSummary, setCaseSummary] = useState(
    '34-year-old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation, and airbag deployment. Patient presented with severe chest pain (9/10) and respiratory distress following steering wheel impact. Initial assessment revealed seatbelt sign across chest and abdomen.\n\nImaging demonstrated multiple left-sided rib fractures (ribs 4-7) with associated pulmonary contusion and small left hemopneumothorax. No solid organ injury identified on CT scan.\n\nPatient managed with chest tube placement for hemopneumothorax with good clinical response. Pain control optimized with multimodal analgesia. Monitored in ICU for 48 hours with stable vital signs throughout. Patient discharged on hospital day 5 in good condition with outpatient trauma surgery follow-up scheduled in 2 weeks.'
  );
  const [activeGuidelineIds, setActiveGuidelineIds] = useState<Set<string>>(
    new Set(mockGuidelines.map(g => g.id))
  );
  const [dismissConfirm, setDismissConfirm] = useState<{ id: string; name: string } | null>(null);
  const [addSearchOpen, setAddSearchOpen] = useState(false);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  // Timeline 3 filter state
  const [tl3FilterWhere, setTl3FilterWhere] = useState('');
  const [tl3FilterWhat, setTl3FilterWhat] = useState('');
  const [tl3FilterWhenStart, setTl3FilterWhenStart] = useState('');
  const [tl3FilterWhenEnd, setTl3FilterWhenEnd] = useState('');
  const [tl3FilterWho, setTl3FilterWho] = useState('');
  const [tl3FilterSearch, setTl3FilterSearch] = useState('');
  const [tl3SourcePopup, setTl3SourcePopup] = useState<{ label: string; text: string } | null>(null);
  const [caseSummaryBadgeHover, setCaseSummaryBadgeHover] = useState(false);
  const [aiConfirmed, setAiConfirmed] = useState<Record<string, boolean>>({});
  const [reviewDates, setReviewDates] = useState<Record<string, string>>({
    primary: '', secondary: '', mam: '', tprc: '',
  });

  const handleAiConfirm = (key: string) => setAiConfirmed(prev => ({ ...prev, [key]: !prev[key] }));

  const addDropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!addSearchOpen) return;
    const handler = (e: MouseEvent) => {
      if (addDropdownRef.current && !addDropdownRef.current.contains(e.target as Node)) {
        setAddSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [addSearchOpen]);

  const openIRISForField = (fieldName: string, data: { sources: any[] }) => {
    setIrisFieldContext({ fieldName, sources: data.sources });
    setIrisOpen(true);
    setIrisKey(k => k + 1);
  };

  const isViewActive = (view: ActiveView): boolean => {
    if (view.type !== activeView.type) return false;
    if (view.type === 'guideline' && activeView.type === 'guideline') return view.id === activeView.id;
    if (view.type === 'registry' && activeView.type === 'registry') return view.tabId === activeView.tabId;
    return true;
  };

  const navBtnCls = (active: boolean) =>
    `flex items-center gap-2 w-full border-l-4 transition-colors text-left ${navCollapsed ? 'justify-center px-0 py-2' : 'px-4 py-2 text-xs font-medium'} ${
      active
        ? 'border-teal-500 bg-teal-50 text-teal-800'
        : 'border-transparent text-gray-600 hover:bg-teal-50/60 hover:text-teal-800'
    }`;

// ── Render: PIPS ──────────────────────────────────────────────────────────────────────────
  const renderPIPS = () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">PIPS</h2>
        <span className="text-xs text-teal-600 font-medium bg-teal-100 px-2 py-0.5 rounded-full">Process Improvement</span>
      </div>

      {/* Reviews date strip */}
      <div className="bg-white rounded-lg border border-gray-200 px-4 py-2.5 flex items-center gap-1.5">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-2 flex-shrink-0">Reviews</span>
        {[
          { key: 'primary',   label: 'Primary',   border: 'border-blue-300',    bg: 'bg-blue-50',    text: 'text-blue-700',    ring: 'focus:ring-blue-300' },
          { key: 'secondary', label: 'Secondary', border: 'border-amber-300',   bg: 'bg-amber-50',   text: 'text-amber-700',   ring: 'focus:ring-amber-300' },
          { key: 'mam',       label: 'M&M',       border: 'border-red-300',     bg: 'bg-red-50',     text: 'text-red-700',     ring: 'focus:ring-red-300' },
          { key: 'tprc',      label: 'TPRC',      border: 'border-emerald-300', bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'focus:ring-emerald-300' },
        ].map((r, i) => (
          <div key={r.key} className="flex items-center gap-1.5 flex-shrink-0">
            {i > 0 && <span className="text-gray-200 text-xs">·</span>}
            <label className={`text-xs font-semibold ${r.text} whitespace-nowrap`}>{r.label}</label>
            <input
              type="date"
              value={reviewDates[r.key] ?? ''}
              onChange={e => setReviewDates(prev => ({ ...prev, [r.key]: e.target.value }))}
              className={`text-xs px-2 py-1 rounded border ${r.border} ${r.bg} ${r.text} focus:outline-none focus:ring-1 ${r.ring} w-[130px]`}
            />
          </div>
        ))}
      </div>

      {/* Case Summary */}
      <div className="bg-white rounded-lg border border-teal-200 p-3">
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-teal-100">
          <h3 className="text-base font-semibold text-gray-700">Case Summary</h3>
          {aiFieldData['Case Summary'] && (
            <div className="flex items-center gap-1">
              <div
                className="relative"
                onMouseEnter={() => setCaseSummaryBadgeHover(true)}
                onMouseLeave={() => setCaseSummaryBadgeHover(false)}
              >
                <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border leading-none tracking-tight cursor-default select-none ${
                  aiFieldData['Case Summary'].confidence >= 95
                    ? 'text-white bg-green-600 border-green-700 shadow-sm shadow-green-200'
                    : 'text-white bg-red-600 border-red-700 shadow-sm shadow-red-200'
                }`}>
                  {aiFieldData['Case Summary'].confidence}%
                </span>
                {caseSummaryBadgeHover && (
                  <AISourceModal
                    fieldName="Case Summary"
                    aiData={aiFieldData['Case Summary']}
                    onClose={() => setCaseSummaryBadgeHover(false)}
                    onOpenIRIS={() => {
                      setCaseSummaryBadgeHover(false);
                      openIRISForField('Case Summary', aiFieldData['Case Summary']);
                    }}
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => handleAiConfirm('Case Summary')}
                title={aiConfirmed['Case Summary'] ? 'Confirmed' : 'Confirm AI suggestion'}
                className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${aiConfirmed['Case Summary'] ? 'bg-green-500 text-white' : 'border border-gray-300 text-gray-300 hover:border-green-500 hover:text-green-500'}`}
              >
                <Check size={11} strokeWidth={aiConfirmed['Case Summary'] ? 3 : 2} />
              </button>
            </div>
          )}
        </div>
        <textarea
          value={caseSummary}
          onChange={e => setCaseSummary(e.target.value)}
          className="w-full h-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-y"
        />
      </div>

    </div>
  );

  // ── Timeline data & render ────────────────────────────────────────────────────────────────────

  type TLEvent = {
    id: string;
    location: string;
    what: string;
    when: string;
    description: string;
    who: string;
    sourceText: string;
    status?: 'green' | 'amber' | 'red';
    labSteps?: { label: string; date: string; time: string; timeLapsed?: string }[];
  };

  const LOCATION_STYLES: Record<string, { bg: string; border: string; label: string }> = {
    'Scene':             { bg: 'bg-rose-50',    border: 'border-rose-300',   label: 'bg-rose-500'    },
    'En-Route':          { bg: 'bg-orange-50',  border: 'border-orange-300', label: 'bg-orange-500'  },
    'Ambulance Bay':     { bg: 'bg-amber-50',   border: 'border-amber-300',  label: 'bg-amber-500'   },
    'Emergency Dept':    { bg: 'bg-blue-50',    border: 'border-blue-300',   label: 'bg-blue-600'    },
    'OR':                { bg: 'bg-violet-50',  border: 'border-violet-300', label: 'bg-violet-600'  },
    'PACU':              { bg: 'bg-teal-50',    border: 'border-teal-300',   label: 'bg-teal-600'    },
    'GHS 4B MedSurg':    { bg: 'bg-emerald-50', border: 'border-emerald-300',label: 'bg-emerald-600' },
  };

  const ACTION_STYLES: Record<string, { dot: string; badge: string; text: string; border: string }> = {
    'Vitals':               { dot: 'bg-sky-500',      badge: 'bg-sky-100',      text: 'text-sky-800',      border: 'border-sky-300'      },
    'Neuro / GCS':          { dot: 'bg-indigo-500',   badge: 'bg-indigo-100',   text: 'text-indigo-800',   border: 'border-indigo-300'   },
    'Treatment':            { dot: 'bg-emerald-500',  badge: 'bg-emerald-100',  text: 'text-emerald-800',  border: 'border-emerald-300'  },
    'Triage Assessment':    { dot: 'bg-amber-500',    badge: 'bg-amber-100',    text: 'text-amber-800',    border: 'border-amber-300'    },
    'Trauma Activation':     { dot: 'bg-red-500',     badge: 'bg-red-100',      text: 'text-red-800',      border: 'border-red-300'      },
    'Arrival':              { dot: 'bg-cyan-500',     badge: 'bg-cyan-100',     text: 'text-cyan-800',     border: 'border-cyan-300'     },
    'Admission':            { dot: 'bg-blue-500',     badge: 'bg-blue-100',     text: 'text-blue-800',     border: 'border-blue-300'     },
    'Pain Screening':       { dot: 'bg-pink-500',     badge: 'bg-pink-100',     text: 'text-pink-800',     border: 'border-pink-300'     },
    'Labs':                 { dot: 'bg-purple-500',   badge: 'bg-purple-100',   text: 'text-purple-800',   border: 'border-purple-300'   },
    'Hospital Event':       { dot: 'bg-rose-600',     badge: 'bg-rose-100',     text: 'text-rose-800',     border: 'border-rose-300'     },
    'Transfer Out':         { dot: 'bg-orange-400',   badge: 'bg-orange-100',   text: 'text-orange-800',   border: 'border-orange-300'   },
    'Transfer In':          { dot: 'bg-teal-500',     badge: 'bg-teal-100',     text: 'text-teal-800',     border: 'border-teal-300'     },
    'Transfusion':          { dot: 'bg-red-400',      badge: 'bg-red-50',       text: 'text-red-700',      border: 'border-red-200'      },
    'Medication':           { dot: 'bg-violet-500',   badge: 'bg-violet-100',   text: 'text-violet-800',   border: 'border-violet-300'   },
    'Procedures':           { dot: 'bg-fuchsia-500',  badge: 'bg-fuchsia-100',  text: 'text-fuchsia-800',  border: 'border-fuchsia-300'  },
    'LDA':                  { dot: 'bg-lime-600',     badge: 'bg-lime-100',     text: 'text-lime-800',     border: 'border-lime-300'     },
    'O2 Therapy':           { dot: 'bg-sky-400',      badge: 'bg-sky-50',       text: 'text-sky-700',      border: 'border-sky-200'      },
    'Current':              { dot: 'bg-gray-400',     badge: 'bg-gray-100',     text: 'text-gray-700',     border: 'border-gray-300'     },
    'CT Ordered':           { dot: 'bg-slate-400',    badge: 'bg-slate-50',     text: 'text-slate-700',    border: 'border-slate-200'    },
    'CT Performed':         { dot: 'bg-slate-600',    badge: 'bg-slate-100',    text: 'text-slate-800',    border: 'border-slate-400'    },
    'CT Result':            { dot: 'bg-slate-500',    badge: 'bg-slate-100',    text: 'text-slate-800',    border: 'border-slate-300'    },
  };
  const DEFAULT_ACTION = { dot: 'bg-gray-400', badge: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };

  const tlEvents: TLEvent[] = [
    // ── SCENE ──────────────────────────────────────────────────────────────────────
    { id: 'tl1',       location: 'Scene',          what: 'Vitals',            when: '2024-06-07 14:10', description: 'Temp 36.8 °C · HR 89 · Resp 18 · BP 137/92 · MAP 105 mmHg · SpO2 99% · Position: Supine', who: 'Grady Transport', sourceText: 'Scene vitals obtained by EMS upon patient contact. GCS 15 at scene.' },
    { id: 'tl2',       location: 'Scene',          what: 'Neuro / GCS',       when: '2024-06-07 14:11', description: 'General: No focal deficit. Mental Status: Alert. GCS Eye 4 · Verbal 5 · Motor 6 = GCS 15. Sensation intact. Motor function intact.', who: 'Grady Transport', sourceText: 'Scene neurological assessment per EMS protocol. Patient cooperative and oriented x4.' },
    { id: 'tl3',       location: 'Scene',          what: 'Treatment',         when: '2024-06-07 14:13', description: 'Venous access established · Wound care applied · Cervical collar placed · Backboard immobilization', who: 'Grady Transport', sourceText: 'Scene interventions per trauma protocol. Two large-bore IVs established bilateral antecubital.' },
    { id: 'tl_s_out',  location: 'Scene',          what: 'Transfer Out',      when: '2024-06-07 14:15', description: 'Transfer to En-Route — patient loaded, transport initiated', who: 'Grady Transport', sourceText: 'Patient loaded onto transport unit at 14:15.' },
    // ── EN-ROUTE ────────────────────────────────────────────────────────────────────────────
    { id: 'tl4',       location: 'En-Route',       what: 'Triage Assessment', when: '2024-06-07 14:18', description: 'Trauma Level 1 · Mechanism: High-speed MVC, frontal impact, airbag deployment, steering wheel deformation · Activation requested', who: 'Grady Transport', sourceText: 'Radio notification to Grady ED at 14:18. Trauma team activation requested en route per Level 1 criteria.' },
    { id: 'tl6',       location: 'En-Route',       what: 'Trauma Activation', when: '2024-06-07 14:19', description: 'Activation called by communication center. Trauma team assembled and waiting on arrival.', who: 'Grady Comm Center', sourceText: 'Trauma activation paged at 14:19. Attending surgeon, anesthesia, nursing notified.' },
    { id: 'tl5',       location: 'En-Route',       what: 'Vitals',            when: '2024-06-07 14:20', description: 'Temp 36.6 °C · HR 102 · Resp 20 · BP 124/84 · SpO2 97% · O2 via NRB mask 15 L/min', who: 'Grady Transport', sourceText: 'En-route vitals obtained at approx. 5 min post-departure from scene.' },
    { id: 'tl_er_out', location: 'En-Route',       what: 'Transfer Out',      when: '2024-06-07 14:28', description: 'Transfer to Ambulance Bay — arrival imminent', who: 'Grady Transport', sourceText: 'EMS radioed arrival at 14:28. Trauma bay cleared.' },
    // ── AMBULANCE BAY ──────────────────────────────────────────────────────────────────────────
    { id: 'tl7',       location: 'Ambulance Bay',  what: 'Arrival',           when: '2024-06-07 14:30', description: 'Ground transport — Grady Transport Unit 7. Patient on backboard, cervical collar in place.', who: 'Grady Transport', sourceText: 'Patient arrived Ambulance Bay at 14:30 via ground EMS. Handoff to trauma team completed.' },
    { id: 'tl_ab_out', location: 'Ambulance Bay',  what: 'Transfer Out',      when: '2024-06-07 14:31', description: 'Transfer to Emergency Dept — trauma bay TR-04', who: 'Grady Transport', sourceText: 'Handoff complete. Patient wheeled to ED trauma bay at 14:31.' },
    // ── EMERGENCY DEPT — Visit 1 ───────────────────────────────────────────────────────────────────────────────────────
    { id: 'tl8',       location: 'Emergency Dept', what: 'Admission',         when: '2024-06-07 14:32', description: 'Room TR-04 · Bed TR-04 · Patient Class: Emergency · Service: Emergency Medicine (Non-admitting)', who: 'R. Thompson', sourceText: 'Patient registered and admitted to ED Trauma Bay TR-04 at 14:32.' },
    { id: 'tl9',       location: 'Emergency Dept', what: 'Vitals',            when: '2024-06-07 14:35', description: 'Temp 36.8 °C · HR 89 · Resp 18 · BP 137/92 · MAP 105 mmHg · SpO2 99% · BP Location: Left arm · Method: Automatic', who: 'R. Thompson', sourceText: 'Initial ED vitals obtained at 14:35 per trauma protocol.' },
    { id: 'tl10',      location: 'Emergency Dept', what: 'Pain Screening',    when: '2024-06-07 14:36', description: 'Pain Assessment Scale: Verbal Analog (0–10) · Score: 9/10 · Location: Chest and arm', who: 'R. Thompson', sourceText: 'Pain assessment documented per nursing flowsheet.' },
    { id: 'tl11',      location: 'Emergency Dept', what: 'Labs',              when: '2024-06-07 15:00', description: 'POCT Glucose (Meter) — Micro · Final · Specimen: Blood - Capillary · Collected: 14:58 · Result: 108 mg/dL', who: 'Point of Care', sourceText: 'POCT glucose ordered by Dr. Smith. Collected bedside ED trauma bay.' },
    { id: 'tl_ct_ord', location: 'Emergency Dept', what: 'CT Ordered',        when: '2024-06-07 15:05', description: 'CT Pulmonary Angiography — STAT · Indication: chest trauma, tachycardia, shortness of breath · Contrast: IV iodinated · Priority: STAT', who: 'Dr. Smith', sourceText: 'CT-PA ordered STAT by Dr. Smith at 15:05 for evaluation of pulmonary embolism.' },
    { id: 'tl12',      location: 'Emergency Dept', what: 'Hospital Event',    when: '2024-06-07 15:45', description: 'Pulmonary Embolism (PE) — identified on CT pulmonary angiography', who: 'Dr. Smith', sourceText: 'CT-PA read by radiology at 15:45. Attending notified. Anticoagulation protocol initiated.' },
    { id: 'tl13',      location: 'Emergency Dept', what: 'Transfer Out',      when: '2024-06-07 16:00', description: 'Transfer to OR for emergency surgery', who: 'Dr. Smith', sourceText: 'Patient transferred to OR at 16:00. Escort by trauma RN and attending.' },
    // ── OR — Visit 1 ───────────────────────────────────────────────────────────────────────────────────────
    { id: 'tl14',      location: 'OR',             what: 'Transfer In',       when: '2024-06-07 16:05', description: 'Room: OR-2 · Bed: OR-2 · Patient Class: Emergency · Level of Care: ICU · Service: Emergency Medicine', who: 'OR Charge Nurse', sourceText: 'Patient received in OR at 16:05. Anesthesia team present.' },
    { id: 'tl15',      location: 'OR',             what: 'Vitals',            when: '2024-06-07 16:10', description: 'Temp 36.8 °C · HR 89 · Resp 18 (ventilated) · BP 137/92 · MAP 105 mmHg · SpO2 99% · Method: Arterial line', who: 'Dr. Patel', sourceText: 'Intraoperative vitals obtained at time of incision.' },
    { id: 'tl16',      location: 'OR',             what: 'Transfusion',       when: '2024-06-07 16:20', description: 'Fresh Frozen Plasma (FFP) transfusion initiated · Anesthesia barcode verified', who: 'Dr. Patel', sourceText: 'FFP transfusion per massive transfusion protocol. Barcode verification completed.' },
    { id: 'tl17',      location: 'OR',             what: 'Medication',        when: '2024-06-07 16:25', description: 'Phenylephrine (Neo-Synephrine) 1000 mcg/10 mL syringe · Dose: 100 mcg · Route: Intravenous', who: 'Dr. Patel', sourceText: 'Vasopressor administered for intraoperative hypotension.' },
    { id: 'tl18',      location: 'OR',             what: 'Procedures',        when: '2024-06-07 17:30', description: '1. Excisional debridement posterior arm musculature (triceps) 5 cm x 2 cm x 4 cm deep\n2. Delayed primary closure dorsal arm wound — complex closure in layers\n3. Excisional debridement anterior arm compartment — brachial artery exploration\n4. Wound VAC anterior arm musculature 10 cm x 6 cm x 5 cm deep\n5. Nonexcisional debridement + wound VAC volar forearm wound 25 x 8 cm', who: 'Dr. Thompson · Dr. Lee', sourceText: 'Operative report dictated by Dr. Thompson. Procedure start 17:30, end 19:15.' },
    { id: 'tl19',      location: 'OR',             what: 'Transfer Out',      when: '2024-06-07 19:20', description: 'Transfer to PACU — post-operative, hemodynamically stable', who: 'Dr. Thompson', sourceText: 'Patient transferred from OR to PACU at 19:20. Handoff completed.' },
    // ── PACU — Visit 1 ─────────────────────────────────────────────────────────────────────────────────
    { id: 'tl20',      location: 'PACU',           what: 'Transfer In',       when: '2024-06-07 19:25', description: 'Room: GHS PACU Pool · Bed: PACU-3 · Patient Class: Observation/OP · Level of Care: Acute (Med Surg) · Service: Orthopedics', who: 'M. Chen', sourceText: 'Patient received in PACU at 19:25. PACU protocol initiated.' },
    { id: 'tl21',      location: 'PACU',           what: 'LDA',               when: '2024-06-07 19:35', description: 'Peripheral IV — 20 G · Right Antecubital · Placed: Jun 7, 2024 19:35 · Assessed and patent', who: 'M. Chen', sourceText: 'LDA assessment per PACU nursing flowsheet.' },
    { id: 'tl22',      location: 'PACU',           what: 'O2 Therapy',        when: '2024-06-07 19:40', description: 'SpO2: 95% · O2 Device: Standby at bedside · No active O2 delivery required at this time', who: 'M. Chen', sourceText: 'Oxygen therapy assessment per PACU protocol.' },
    { id: 'tl23',      location: 'PACU',           what: 'Medication',        when: '2024-06-07 20:00', description: 'Lactated Ringers (LR) IV Fluid · New Bag · Rate: 100 mL/hr · Route: Intravenous', who: 'M. Chen', sourceText: 'IV fluid management per post-op orders.' },
    { id: 'tl_p1_out', location: 'PACU',           what: 'Transfer Out',      when: '2024-06-08 10:00', description: 'Transfer to GHS 4B MedSurg — stable for step-down care', who: 'M. Chen', sourceText: 'Patient cleared for step-down by attending at 10:00. Transferred to Med Surg floor.' },
    // ── GHS 4B MEDSURG ───────────────────────────────────────────────────────────────────────────────
    { id: 'tl_ms1',    location: 'GHS 4B MedSurg', what: 'Transfer In',       when: '2024-06-08 10:30', description: 'Room: GHS 4B · Bed: 412B · Patient Class: Inpatient · Level of Care: Acute (Med Surg) · Service: Orthopedics', who: 'C. Reyes', sourceText: 'Patient received on 4B MedSurg floor at 10:30. Nursing handoff completed.' },
    { id: 'tl_ms2',    location: 'GHS 4B MedSurg', what: 'Medication',        when: '2024-06-08 12:00', description: 'Oxycodone 5 mg PO · PRN Pain · Administered per order', who: 'C. Reyes', sourceText: 'Medication administered per nursing flowsheet.' },
    { id: 'tl_ms3',    location: 'GHS 4B MedSurg', what: 'Pain Screening',    when: '2024-06-08 14:00', description: 'Pain Assessment Scale: Verbal Analog (0-10) · Score: 7/10 · Location: Anterior arm wound', who: 'C. Reyes', sourceText: 'Pain assessment documented per nursing flowsheet at 14:00.' },
    { id: 'tl_ms4',    location: 'GHS 4B MedSurg', what: 'Medication',        when: '2024-06-09 08:00', description: 'IV Vancomycin 1250 mg · Every 12h · Route: Intravenous — prophylactic antibiotic coverage', who: 'C. Reyes', sourceText: 'Vancomycin ordered by Dr. Williams. Trough level checked prior to administration.' },
    { id: 'tl_ms5',    location: 'GHS 4B MedSurg', what: 'Vitals',            when: '2024-06-09 10:00', description: 'Temp 36.9 °C · HR 78 · Resp 16 · BP 128/82 · SpO2 98% · Pain 3/10', who: 'C. Reyes', sourceText: 'Morning vitals obtained at 10:00 by nursing staff.' },
    { id: 'tl_ms6',    location: 'GHS 4B MedSurg', what: 'Vitals',            when: '2024-06-09 14:00', description: 'Temp 37.2 °C · HR 94 · Resp 18 · BP 128/84 · SpO2 98% · Pain 6/10', who: 'C. Reyes', sourceText: 'Routine vitals per floor protocol. Attending notified of elevated HR.' },
    { id: 'tl_ms_out', location: 'GHS 4B MedSurg', what: 'Transfer Out',      when: '2024-06-10 08:00', description: 'Transfer to Emergency Dept — wound dehiscence and signs of infection', who: 'Dr. Williams', sourceText: 'Patient reported increased wound drainage and erythema at 07:30. Transfer to ED ordered.' },
    // ── EMERGENCY DEPT — Visit 2 (Readmission) ───────────────────────────────────────────────────────────────────────
    { id: 'tl_ed2_1',  location: 'Emergency Dept', what: 'Transfer In',       when: '2024-06-10 08:30', description: 'Readmission — Room TR-02 · Bed TR-02 · Patient Class: Emergency · Service: Trauma Surgery', who: 'R. Thompson', sourceText: 'Patient readmitted to ED at 08:30 for wound complication evaluation.' },
    { id: 'tl_ct_perf',location: 'Emergency Dept', what: 'CT Performed',      when: '2024-06-10 08:35', description: 'CT Chest/Abdomen/Pelvis — STAT · Patient transported to radiology suite · Contrast: IV · Scan duration: 12 min · Images transmitted to radiologist on call', who: 'Radiology Tech', sourceText: 'CT performed at 08:35. Patient escorted by ED nurse. Images available for read at 08:52.' },
    { id: 'tl_ed2_2',  location: 'Emergency Dept', what: 'Vitals',            when: '2024-06-10 08:45', description: 'Temp 38.4 °C (febrile) · HR 108 · Resp 20 · BP 118/76 · SpO2 96% · Pain 8/10', who: 'R. Thompson', sourceText: 'Vitals on readmission. Fever and tachycardia consistent with infection.' },
    { id: 'tl_ed2_3',  location: 'Emergency Dept', what: 'Labs',              when: '2024-06-10 09:00', description: 'CBC: WBC 14.2 x10/uL (elevated) · Hgb 9.8 · Plt 210 · CRP 48 mg/L — consistent with wound infection', who: 'Point of Care', sourceText: 'Labs drawn at 09:00. Results at 09:42. Reviewed by Dr. Smith.' },
    { id: 'tl_ed2_4',  location: 'Emergency Dept', what: 'Hospital Event',    when: '2024-06-10 10:00', description: 'Wound dehiscence and superficial infection — anterior arm wound · Wound culture obtained · Antibiotics broadened', who: 'Dr. Smith', sourceText: 'Wound assessed by Dr. Smith. Culture swab taken. ID consult placed.' },
    { id: 'tl_ed2_out',location: 'Emergency Dept', what: 'Transfer Out',      when: '2024-06-10 11:00', description: 'Transfer to OR for wound washout and revision', who: 'Dr. Smith', sourceText: 'OR notified at 10:45. Patient transferred at 11:00.' },
    // ── OR — Visit 2 ───────────────────────────────────────────────────────────────────────────────────────
    { id: 'tl_or2_1',  location: 'OR',             what: 'Transfer In',       when: '2024-06-10 11:30', description: 'Room: OR-4 · Bed: OR-4 · Patient Class: Emergency · Service: Trauma Surgery', who: 'OR Charge Nurse', sourceText: 'Patient received in OR-4 at 11:30. Anesthesia and surgical team present.' },
    { id: 'tl_ct_res', location: 'OR',             what: 'CT Result',         when: '2024-06-10 11:35', description: 'CT Chest/Abdomen/Pelvis — Wound dehiscence confirmed · Soft tissue gas anterior arm consistent with infection · No pneumothorax · Pulmonary emboli partially resolved', who: 'Dr. Williams', sourceText: 'CT read by radiology. Report transmitted to OR team at 11:35. Dr. Thompson reviewed prior to incision.' },
    { id: 'tl_or2_2',  location: 'OR',             what: 'Vitals',            when: '2024-06-10 11:45', description: 'Temp 38.1 °C · HR 102 · Resp 16 (ventilated) · BP 122/78 · MAP 93 mmHg · SpO2 99%', who: 'Dr. Patel', sourceText: 'Intraoperative vitals at time of prep. Temp trending down from pre-op.' },
    { id: 'tl_or2_3',  location: 'OR',             what: 'Procedures',        when: '2024-06-10 12:00', description: '1. Wound washout and irrigation anterior arm — 3 L normal saline\n2. Excisional debridement infected tissue — anterior arm 3 cm x 2 cm\n3. Wound VAC replacement\n4. Culture specimens sent to microbiology', who: 'Dr. Thompson · Dr. Lee', sourceText: 'Operative report by Dr. Thompson. Procedure start 12:00, end 13:45.' },
    { id: 'tl_or2_4',  location: 'OR',             what: 'Medication',        when: '2024-06-10 12:30', description: 'Piperacillin-Tazobactam 3.375 g IV · Intraoperative antibiotic coverage · Single dose', who: 'Dr. Patel', sourceText: 'Antibiotic per ID recommendation. Administered at incision time.' },
    { id: 'tl_or2_out',location: 'OR',             what: 'Transfer Out',      when: '2024-06-10 14:00', description: 'Transfer to PACU — procedure complete, hemodynamically stable', who: 'Dr. Thompson', sourceText: 'Patient transferred from OR to PACU at 14:00. Handoff to M. Chen.' },
    // ── PACU — Current ──────────────────────────────────────────────────────────────────────────────────
    { id: 'tl_p2_1',   location: 'PACU',           what: 'Transfer In',       when: '2024-06-10 14:30', description: 'Room: GHS PACU Pool · Bed: PACU-5 · Patient Class: Observation/OP · Level of Care: Acute (Med Surg) · Service: Orthopedics', who: 'M. Chen', sourceText: 'Patient received in PACU at 14:30. PACU protocol initiated.' },
    { id: 'tl_p2_2',   location: 'PACU',           what: 'LDA',               when: '2024-06-10 14:45', description: 'Peripheral IV — 18 G · Left Antecubital · Placed: Jun 10, 2024 14:45 · Assessed and patent', who: 'M. Chen', sourceText: 'LDA assessment per PACU nursing flowsheet.' },
    { id: 'tl_p2_3',   location: 'PACU',           what: 'O2 Therapy',        when: '2024-06-10 15:00', description: 'SpO2: 97% · O2 Device: 2 L nasal cannula · Weaning to room air as tolerated', who: 'M. Chen', sourceText: 'Oxygen therapy per PACU protocol. Weaning initiated at 15:30.' },
    { id: 'tl_p2_4',   location: 'PACU',           what: 'Medication',        when: '2024-06-10 15:30', description: 'Acetaminophen (Tylenol) 1000 mg IV · Post-operative pain management', who: 'M. Chen', sourceText: 'Medication administered per post-op orders.' },
    { id: 'tl24',      location: 'PACU',           what: 'Current',           when: '2024-06-11 08:00', description: 'Room: GHS PACU Pool · Bed: PACU-5 · Patient Class: Observation/OP · Level of Care: Acute (Med Surg) · Service: Orthopedics', who: '', sourceText: 'Current patient location as of morning rounds Jun 11.' },
    {
      id: 'tl_lab_teg', location: 'Emergency Dept', what: 'Labs', when: '2026-08-13 20:02',
      description: 'TEG Hemostasis Lysis · Final · R-Time: 6.8 sec · FIB LY30: 0 · Rapid TEG MA: 67.2 · FF MA: 28.3',
      who: 'Point of Care',
      status: 'green',
      sourceText: 'TEG Hemostasis Lysis panel ordered and resulted in ED. Specimen collected at 19:03, received in lab at 20:01, final result at 20:02.',
      labSteps: [
        { label: 'Ordered',  date: '8/13', time: '19:00' },
        { label: 'Result',   date: '8/13', time: '20:02', timeLapsed: '62 min' },
      ],
    },
    {
      id: 'tl_lab_teg2', location: 'Emergency Dept', what: 'Labs', when: '2026-08-13 21:15',
      description: 'TEG Hemostasis Lysis · Pending · No result yet',
      who: 'Point of Care',
      status: 'red',
      sourceText: 'TEG Hemostasis Lysis panel ordered. Awaiting result.',
      labSteps: [
        { label: 'Ordered',  date: '8/13', time: '21:15' },
      ],
    },
  ];

  const ALL_LOCATIONS = ['Scene', 'En-Route', 'Ambulance Bay', 'Emergency Dept', 'OR', 'PACU', 'GHS 4B MedSurg'];
  const CT_WHATS = new Set(['CT Ordered', 'CT Performed', 'CT Result']);
  const ALL_WHATS = ['CT', ...[...new Set(tlEvents.map(e => e.what))].filter(w => !CT_WHATS.has(w)).sort()];
  const ALL_WHOS = [...new Set(tlEvents.map(e => e.who).filter(Boolean))].sort();

  type TLFilters = {
    filterWhere: string; setFilterWhere: (v: string) => void;
    filterWhat: string; setFilterWhat: (v: string) => void;
    filterWhenStart: string; setFilterWhenStart: (v: string) => void;
    filterWhenEnd: string; setFilterWhenEnd: (v: string) => void;
    filterWho: string; setFilterWho: (v: string) => void;
    filterSearch: string; setFilterSearch: (v: string) => void;
    sourcePopup: { label: string; text: string } | null;
    setSourcePopup: (v: { label: string; text: string } | null) => void;
    variant?: 'default' | 'date-first' | 'inline-location';
  };

  const renderTimelineWith = (f: TLFilters) => {
    const formatWhen = (when: string) => {
      const d = new Date(when);
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      const day = d.getDate();
      const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
      const hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      return `${months[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()} · ${h}:${mins} ${ampm}`;
    };

    const formatTimeOnly = (when: string) => {
      const d = new Date(when);
      const hours = d.getHours();
      const mins = d.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const h = hours % 12 || 12;
      return `${h}:${mins} ${ampm}`;
    };

    const formatDayLabel = (when: string) => {
      const d = new Date(when);
      const fullMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      const day = d.getDate();
      const suffix = day === 1 || day === 21 || day === 31 ? 'st' : day === 2 || day === 22 ? 'nd' : day === 3 || day === 23 ? 'rd' : 'th';
      return `${fullMonths[d.getMonth()]} ${day}${suffix}, ${d.getFullYear()}`;
    };

    const allSorted = [...tlEvents].sort((a, b) => b.when.localeCompare(a.when));
    const allGroups: { location: string; events: TLEvent[] }[] = [];
    allSorted.forEach(e => {
      const last = allGroups[allGroups.length - 1];
      if (last && last.location === e.location) last.events.push(e);
      else allGroups.push({ location: e.location, events: [e] });
    });

    const { filterWhere, setFilterWhere, filterWhat, setFilterWhat, filterWhenStart, setFilterWhenStart, filterWhenEnd, setFilterWhenEnd, filterWho, setFilterWho, filterSearch, setFilterSearch, sourcePopup, setSourcePopup, variant = 'default' } = f;
    const isInlineLocation = variant === 'inline-location';
    const isDateFirst = variant === 'date-first' || isInlineLocation;

    const passesEventFilters = (e: TLEvent) => {
      if (filterWhat) {
        const matchesCT = filterWhat === 'CT' && CT_WHATS.has(e.what);
        if (!matchesCT && e.what !== filterWhat) return false;
      }
      if (filterWho && e.who !== filterWho) return false;
      if (filterWhenStart && e.when < filterWhenStart) return false;
      if (filterWhenEnd && e.when > filterWhenEnd + ' 23:59') return false;
      if (filterSearch && !e.description.toLowerCase().includes(filterSearch.toLowerCase())) return false;
      return true;
    };

    type RenderGroup = { type: 'group'; location: string; events: TLEvent[] };
    type RenderTransfers = { type: 'transfers'; transfers: { location: string; event: TLEvent }[] };
    type RenderDay = { type: 'day'; label: string; key: string };
    type RenderItem = RenderGroup | RenderTransfers | RenderDay;

    let renderItems: RenderItem[] = [];

    if (filterWhere) {
      const matchIndices = allGroups.map((g, i) => g.location === filterWhere ? i : -1).filter(i => i >= 0);

      matchIndices.forEach((gi, rank) => {
        const bodyEvents = allGroups[gi].events.filter(e => e.what !== 'Transfer Out' && passesEventFilters(e));
        const transferOut = allGroups[gi].events.find(e => e.what === 'Transfer Out');
        const eventsWithTO = transferOut ? [...bodyEvents, transferOut] : bodyEvents;

        if (eventsWithTO.length > 0 || bodyEvents.length > 0) {
          renderItems.push({ type: 'group', location: filterWhere, events: allGroups[gi].events });
        }

        if (rank < matchIndices.length - 1) {
          const nextGi = matchIndices[rank + 1];
          const intermediate: { location: string; event: TLEvent }[] = [];
          for (let j = gi + 1; j < nextGi; j++) {
            const to = allGroups[j].events.find(e => e.what === 'Transfer Out');
            if (to) intermediate.push({ location: allGroups[j].location, event: to });
          }
          if (intermediate.length > 0) renderItems.push({ type: 'transfers', transfers: intermediate });
        }
      });
    } else {
      const filtered = tlEvents.filter(passesEventFilters);
      const sorted = [...filtered].sort((a, b) => b.when.localeCompare(a.when));
      const grouped: { location: string; events: TLEvent[] }[] = [];
      sorted.forEach(e => {
        const last = grouped[grouped.length - 1];
        if (last && last.location === e.location) last.events.push(e);
        else grouped.push({ location: e.location, events: [e] });
      });
      renderItems = grouped.map(g => ({ type: 'group' as const, location: g.location, events: g.events }));
    }

    {
      const withDays: RenderItem[] = [];
      let currentDayKey = '';
      for (const item of renderItems) {
        let when = '';
        if (item.type === 'group' && item.events.length > 0) when = item.events[0].when;
        else if (item.type === 'transfers' && item.transfers.length > 0) when = item.transfers[0].event.when;
        if (when) {
          const dayKey = when.slice(0, 10);
          if (dayKey !== currentDayKey) {
            currentDayKey = dayKey;
            withDays.push({ type: 'day', label: formatDayLabel(when), key: dayKey });
          }
        }
        withDays.push(item);
      }
      renderItems = withDays;
    }

    const activeFilters = [filterWhere, filterWhat, filterWho, filterWhenStart, filterSearch].some(Boolean);

    return (
      <div className="flex flex-col gap-3 h-full">
        <div className="flex-shrink-0 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Timeline</h2>
          {activeFilters && (
            <button
              onClick={() => { setFilterWhere(''); setFilterWhat(''); setFilterWho(''); setFilterWhenStart(''); setFilterWhenEnd(''); setFilterSearch(''); }}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium flex items-center gap-1"
            >
              <X size={11} /> Clear filters
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 flex flex-wrap gap-3 items-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 uppercase tracking-widest mr-1">
            <Filter size={11} /> Filter by
          </div>

          <div className="flex items-center gap-1.5">
            <input type="date" value={filterWhenStart} onChange={e => setFilterWhenStart(e.target.value)}
              className="text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 w-32" />
            <span className="text-xs text-gray-400">→</span>
            <input type="date" value={filterWhenEnd} onChange={e => setFilterWhenEnd(e.target.value)}
              className="text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 w-32" />
          </div>

          <select value={filterWhat} onChange={e => setFilterWhat(e.target.value)}
            className="text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white text-gray-700 w-40">
            <option value="">All labels</option>
            {ALL_WHATS.map(w => <option key={w}>{w}</option>)}
          </select>

          <div className="flex items-center gap-1 px-2 py-1.5 border border-gray-200 rounded-md bg-white focus-within:ring-1 focus-within:ring-teal-400 w-48">
            <Search size={11} className="text-gray-300 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search description..."
              value={filterSearch}
              onChange={e => setFilterSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs outline-none text-gray-700 placeholder:text-gray-300"
            />
            {filterSearch && (
              <button onClick={() => setFilterSearch('')} className="text-gray-300 hover:text-gray-500 flex-shrink-0">
                <X size={11} />
              </button>
            )}
          </div>

          <select value={filterWho} onChange={e => setFilterWho(e.target.value)}
            className="text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white text-gray-700 w-44">
            <option value="">All people</option>
            {ALL_WHOS.map(w => <option key={w}>{w}</option>)}
          </select>

          <select value={filterWhere} onChange={e => setFilterWhere(e.target.value)}
            className="text-xs px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-400 bg-white text-gray-700 w-36">
            <option value="">All locations</option>
            {ALL_LOCATIONS.map(l => <option key={l}>{l}</option>)}
          </select>
        </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 pb-4">
        {renderItems.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">No events match the current filters.</div>
        ) : (
          <div className="flex gap-0 relative">
            <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-gray-200 z-0" />
            <div className="w-8 flex-shrink-0" />

            <div className="flex-1 flex flex-col gap-3 min-w-0">
              {renderItems.map((item, ri) => {
                const isLast = ri === renderItems.length - 1;

                if (item.type === 'day') {
                  return (
                    <div key={`day-${item.key}`} className="sticky top-0 z-20 -ml-8 bg-gray-50/95 backdrop-blur-sm">
                      <div className="flex items-center gap-3 py-1.5 pr-2 pl-2">
                        <span className="text-xs font-bold text-gray-500 tracking-wide whitespace-nowrap">{item.label}</span>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    </div>
                  );
                }

                if (item.type === 'transfers') {
                  return (
                    <div key={`transfers-${ri}`} className="flex flex-col gap-1.5 -ml-8 pl-8">
                      {item.transfers.map(({ location, event }) => {
                        const locStyle = LOCATION_STYLES[location] ?? { label: 'bg-gray-500' };
                        return (
                          <div key={event.id} className="flex items-center gap-0">
                            <div className="flex flex-col items-center w-8 flex-shrink-0 -ml-8">
                              {isInlineLocation ? (
                                <div className="w-0 h-0 flex-shrink-0 z-10" style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '13px solid #f97316' }} />
                              ) : (
                                <div className={`w-3 h-3 rounded-full ${locStyle.label} ring-2 ring-white flex-shrink-0 z-10 opacity-70`} />
                              )}
                            </div>
                            {isInlineLocation ? (
                              <div className="flex items-center">
                                <div className="w-0 h-0 flex-shrink-0" style={{ borderTop: '14px solid transparent', borderBottom: '14px solid transparent', borderLeft: '11px solid #f97316' }} />
                                <div className="flex items-center gap-2 bg-orange-400 pl-3 pr-5 py-1.5" style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 50%, calc(100% - 11px) 100%, 0 100%)', width: 'fit-content' }}>
                                  <span className="text-[10px] font-bold text-gray-900 whitespace-nowrap">Transfer Out</span>
                                  <span className="text-[10px] text-gray-800 whitespace-nowrap">{formatTimeOnly(event.when)}</span>
                                  <span className="text-[10px] font-semibold text-gray-900 whitespace-nowrap">TO</span>
                                  <span className="text-[10px] text-gray-900 whitespace-nowrap">{location}</span>
                                  <span className="text-gray-700 text-[10px]">—</span>
                                  <span className="text-[10px] text-gray-800 whitespace-nowrap">{event.description}</span>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className={`flex items-center gap-1 ${locStyle.label} px-2 py-1 rounded-md opacity-80 flex-shrink-0`}>
                                  <MapPin size={9} className="text-white/80 flex-shrink-0" />
                                  <span className="text-[10px] font-bold text-white tracking-wide uppercase">{location}</span>
                                </div>
                                <div className="flex items-center ml-1.5 min-w-0">
                                  <div className="w-0 h-0 flex-shrink-0" style={{ borderTop: '10px solid transparent', borderBottom: '10px solid transparent', borderLeft: '8px solid #f97316' }} />
                                  <div className="flex items-center gap-2 bg-orange-400 pl-2 pr-3 py-1 min-w-0" style={{ clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 50%, calc(100% - 8px) 100%, 0 100%)' }}>
                                    <span className="text-[10px] font-bold text-white whitespace-nowrap flex-shrink-0">Transfer Out</span>
                                    <span className="text-[10px] text-white/90 truncate">{event.description}</span>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                const group = item;
                const locStyle = LOCATION_STYLES[group.location] ?? { bg: 'bg-gray-50', border: 'border-gray-200', label: 'bg-gray-500' };
                const transferOut = group.events.find(e => e.what === 'Transfer Out');
                const bodyEvents = group.events.filter(e => e.what !== 'Transfer Out' && passesEventFilters(e));

                return (
                  <div key={`${group.location}-${ri}`} className="flex flex-col">

                    <div className="flex items-center gap-0 -ml-8 mb-2 flex-wrap">
                      <div className="flex flex-col items-center w-8 flex-shrink-0">
                        {isInlineLocation && transferOut && (
                          <div className="w-0 h-0 flex-shrink-0 z-10" style={{ borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '13px solid #f97316' }} />
                        )}
                      </div>
                      {!isInlineLocation && (
                        <div className={`flex items-center gap-2 ${locStyle.label} px-3 py-1.5 rounded-lg flex-shrink-0`}>
                          <MapPin size={11} className="text-white/80 flex-shrink-0" />
                          <span className="text-xs font-bold text-white tracking-wide uppercase">{group.location}</span>
                        </div>
                      )}
                      {transferOut && (
                        <div className={`flex items-center ${isInlineLocation ? 'ml-0' : 'ml-2 min-w-0'}`}>
                          {!isInlineLocation && <div className="w-0 h-0 flex-shrink-0" style={{ borderTop: '14px solid transparent', borderBottom: '14px solid transparent', borderLeft: '11px solid #f97316' }} />}
                          {isInlineLocation ? (
                            <div className="flex items-center gap-2 bg-orange-400 pl-3 pr-5 py-1.5" style={{ clipPath: 'polygon(0 0, calc(100% - 11px) 0, 100% 50%, calc(100% - 11px) 100%, 0 100%)', width: 'fit-content' }}>
                              <span className="text-xs font-bold text-gray-900 whitespace-nowrap">Transfer Out</span>
                              <span className="text-xs text-gray-800 whitespace-nowrap">{formatTimeOnly(transferOut.when)}</span>
                              <span className="text-xs font-semibold text-gray-900 whitespace-nowrap">TO</span>
                              <span className="text-xs text-gray-900 whitespace-nowrap">{transferOut.description}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 bg-orange-400 pl-2 pr-3 py-1.5 min-w-0" style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 50%, calc(100% - 10px) 100%, 0 100%)' }}>
                              <span className="text-xs font-bold text-white whitespace-nowrap flex-shrink-0">Transfer Out</span>
                              <span className="text-xs text-white/90 truncate">{transferOut.description}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {bodyEvents.length > 0 && (
                      <div className={`-ml-8 rounded-xl ${isInlineLocation ? `border ${locStyle.border}` : `border-2 ${locStyle.border}`} ${locStyle.bg} overflow-hidden`}>
                        <div className="pl-[8px] pr-4 py-3 flex flex-col gap-4">
                          {bodyEvents.map(event => {
                            const act = ACTION_STYLES[event.what] ?? DEFAULT_ACTION;
                            return (
                              <div key={event.id} className="flex gap-3">
                                <div className="flex flex-col items-center flex-shrink-0 w-3 pt-0.5">
                                  {event.status ? (
                                    <span className="text-sm leading-none flex-shrink-0 z-10 relative">{STATUS_ICON[event.status]}</span>
                                  ) : (
                                    <div className={`w-2.5 h-2.5 rounded-full ${act.dot} ring-2 ring-white flex-shrink-0 z-10 relative`} />
                                  )}
                                </div>
                                {isDateFirst && (
                                  <span className="text-xs text-gray-400 whitespace-nowrap flex-shrink-0 pt-0.5">{formatTimeOnly(event.when)}</span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="grid min-w-0 flex-1" style={{ gridTemplateColumns: '9.5rem 1fr' }}>
                                      <span className={`text-xs font-bold ${act.text} ${act.badge} px-2 py-0.5 rounded-full border ${act.border} whitespace-nowrap self-start`} style={{ width: 'fit-content' }}>{event.what}</span>
                                      <div>
                                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{event.description}</p>
                                        {event.labSteps && (
                                          <div className="mt-1 pt-1 border-t border-gray-100">
                                            <div className="flex items-start">
                                              {event.labSteps.map((step, i) => (
                                                <div key={i} className="flex items-start flex-1 min-w-0">
                                                  <div className="flex flex-col items-center flex-1 min-w-0">
                                                    <div className="flex items-center w-full">
                                                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ring-2 ring-white ${i === event.labSteps!.length - 1 ? 'bg-purple-600' : 'bg-purple-300'}`} />
                                                      {i < event.labSteps!.length - 1 && <div className="flex-1 h-px bg-purple-200" />}
                                                    </div>
                                                    <div className="mt-1.5 text-left w-full pr-2 flex flex-col gap-0.5">
                                                      <div className="flex items-baseline gap-1 flex-wrap">
                                                        <span className="text-[10px] font-semibold text-gray-700 whitespace-nowrap">{step.label}</span>
                                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">{step.date} {step.time}</span>
                                                        {step.timeLapsed && (
                                                          <span className="text-[10px] font-medium text-purple-600 bg-purple-50 px-1 py-px rounded whitespace-nowrap">⏱ {step.timeLapsed}</span>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                                      {!isDateFirst && <span className="text-xs text-gray-400 whitespace-nowrap">{formatTimeOnly(event.when)}</span>}
                                      {event.who && <span className="text-xs text-gray-500 whitespace-nowrap">· by <span className="font-medium text-gray-700">{event.who}</span></span>}
                                      {event.sourceText && (
                                        <button
                                          onClick={() => setSourcePopup({ label: event.what, text: event.sourceText })}
                                          className="text-[10px] font-semibold px-1.5 py-0.5 rounded border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors whitespace-nowrap"
                                        >
                                          Source
                                        </button>
                                      )}
                                      {isInlineLocation && (
                                        <div className={`flex items-center gap-1 ${locStyle.label} px-1.5 py-0.5 rounded flex-shrink-0`}>
                                          <span className="text-[9px] font-bold text-white tracking-wide uppercase leading-none">{group.location}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {!isLast && <div className="w-0.5 h-3 bg-gray-200 ml-[-32px] mt-0 self-start" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}
        </div>

        {sourcePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-lg w-full mx-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-gray-900">Source — {sourcePopup.label}</h3>
                <button onClick={() => setSourcePopup(null)} className="text-gray-400 hover:text-gray-600"><X size={15} /></button>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-72 overflow-y-auto">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-mono">{sourcePopup.text}</p>
              </div>
              <button onClick={() => setSourcePopup(null)} className="mt-4 w-full text-xs text-center text-gray-400 hover:text-gray-600">Close</button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const activeGuidelines = mockGuidelines.filter(g => activeGuidelineIds.has(g.id));

  const renderGuidelinesOverview = () => (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Care Guidelines</h2>
        <span className="text-xs text-teal-600 font-medium bg-teal-100 px-2 py-0.5 rounded-full">
          {activeGuidelines.length} guidelines active
        </span>
      </div>
      <p className="text-sm text-gray-500 -mt-2">Click a guideline to view detailed flag status and criteria.</p>

      <div className="grid grid-cols-5 gap-3">
        {activeGuidelines.map(g => (
          <div key={g.id} className="relative group">
            <GuidelineBubble
              guideline={g}
              onClick={() => setActiveView({ type: 'guidelines-htabs', activeId: g.id })}
            />
            <button
              onClick={e => { e.stopPropagation(); setDismissConfirm({ id: g.id, name: g.name }); }}
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-white border border-gray-200 text-gray-400 hover:bg-red-50 hover:border-red-300 hover:text-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm z-10"
              title="Remove guideline"
            >
              <X size={10} />
            </button>
          </div>
        ))}
      </div>

      {dismissConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-sm w-full mx-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Remove Guideline</h3>
            <p className="text-sm text-gray-600 mb-5">
              Are you sure you want to turn off <span className="font-semibold text-gray-800">{dismissConfirm.name}</span> for patient <span className="font-semibold text-gray-800">{patient.name}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDismissConfirm(null)}
                className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
                No, keep it
              </button>
              <button
                onClick={() => {
                  setActiveGuidelineIds(prev => { const next = new Set(prev); next.delete(dismissConfirm.id); return next; });
                  if (activeView.type === 'guideline' && activeView.id === dismissConfirm.id) {
                    setActiveView({ type: 'guidelines-htabs', activeId: 'overview' });
                  }
                  setDismissConfirm(null);
                }}
                className="px-4 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
              >
                Yes, remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderRegistryTab = (tabId: string, tabLabel: string) => {
    const Icon = registryCategoryIcons[tabId] || FileText;
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <Icon className="w-5 h-5 text-gray-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold text-gray-900">{tabLabel}</h2>
              <span className="flex items-center gap-1 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                <Lock size={10} /> Read-only
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">Registry data — managed by Registry Nurses</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-8 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Read-only in Process Improvement</p>
            <p className="text-xs text-gray-500 mt-1 max-w-xs">
              {tabLabel} data is captured and maintained in the Registry module. Switch to Registry to view or edit these fields.
            </p>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Use the <span className="font-semibold text-gray-600">Trauma Registry</span> tab at the top to access full edit mode.
          </p>
        </div>
      </div>
    );
  };

  const renderGuidelinesHTabs = (activeId: string) => {
    const tabs = [
      { id: 'overview', label: 'Overview', acronym: 'Overview', worst: 'green' as const },
      ...activeGuidelines.map(g => ({ id: g.id, label: g.name, acronym: g.acronym, worst: getWorstStatus(g) })),
    ];

    const activeGuideline = activeId !== 'overview'
      ? activeGuidelines.find(g => g.id === activeId)
      : null;

    const inactiveGuidelines = ALL_GUIDELINES.filter(g => !activeGuidelineIds.has(g.id));
    const filteredInactive = inactiveGuidelines.filter(g =>
      g.name.toLowerCase().includes(addSearchQuery.toLowerCase()) ||
      g.acronym.toLowerCase().includes(addSearchQuery.toLowerCase())
    );

    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-gray-900">Care Guidelines</h2>

        <div className="flex flex-wrap gap-0 border-b border-gray-200 -mt-2 items-end">
          {tabs.map(tab => {
            const isActive = tab.id === activeId;
            return (
              <div key={tab.id} className="relative group flex items-end">
                <button
                  onClick={() => setActiveView({ type: 'guidelines-htabs', activeId: tab.id })}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                    isActive
                      ? 'border-teal-500 text-teal-700'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.id !== 'overview' && (
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[tab.worst]}`} />
                  )}
                  {tab.acronym}
                  {tab.id !== 'overview' && tab.worst !== 'green' && (
                    <span className="text-[10px]">{STATUS_ICON[tab.worst]}</span>
                  )}
                </button>
                {tab.id !== 'overview' && (
                  <button
                    onClick={e => { e.stopPropagation(); setDismissConfirm({ id: tab.id, name: tab.label }); }}
                    className="mb-1.5 w-3.5 h-3.5 rounded-full text-gray-300 hover:text-red-400 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all -ml-2 mr-1"
                    title="Remove guideline"
                  >
                    <X size={9} />
                  </button>
                )}
              </div>
            );
          })}

          <div ref={addDropdownRef} className="relative mb-0.5 ml-1">
            <button
              onClick={() => { setAddSearchOpen(v => !v); setAddSearchQuery(''); }}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors whitespace-nowrap"
            >
              <Plus size={11} />
              Add
            </button>

            {addSearchOpen && (
              <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-xl w-72">
                <div className="p-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-50 rounded-md border border-gray-200">
                    <Search size={12} className="text-gray-400 flex-shrink-0" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search guidelines..."
                      value={addSearchQuery}
                      onChange={e => setAddSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent text-xs outline-none text-gray-700 placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div className="max-h-64 overflow-y-auto py-1">
                  {filteredInactive.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No guidelines found</p>
                  ) : filteredInactive.map(g => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setActiveGuidelineIds(prev => new Set([...prev, g.id]));
                        setAddSearchOpen(false);
                        setAddSearchQuery('');
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-teal-50 transition-colors"
                    >
                      <span className="text-xs font-semibold text-gray-800">{g.acronym}</span>
                      <span className="text-xs text-gray-500 ml-2">{g.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {activeId === 'overview'
          ? renderGuidelinesOverview()
          : activeGuideline
            ? <GuidelineDetail guideline={activeGuideline} />
            : null}

        {dismissConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-6 max-w-sm w-full mx-4">
              <h3 className="text-sm font-bold text-gray-900 mb-2">Remove Guideline</h3>
              <p className="text-sm text-gray-600 mb-5">
                Are you sure you want to turn off <span className="font-semibold text-gray-800">{dismissConfirm.name}</span> for patient <span className="font-semibold text-gray-800">{patient.name}</span>?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setDismissConfirm(null)}
                  className="px-4 py-1.5 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  No, keep it
                </button>
                <button
                  onClick={() => {
                    setActiveGuidelineIds(prev => { const next = new Set(prev); next.delete(dismissConfirm.id); return next; });
                    if (activeView.type === 'guidelines-htabs' && activeView.activeId === dismissConfirm.id) {
                      setActiveView({ type: 'guidelines-htabs', activeId: 'overview' });
                    }
                    setDismissConfirm(null);
                  }}
                  className="px-4 py-1.5 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
                >
                  Yes, remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderTimeline3 = () => renderTimelineWith({
    filterWhere: tl3FilterWhere, setFilterWhere: setTl3FilterWhere,
    filterWhat: tl3FilterWhat, setFilterWhat: setTl3FilterWhat,
    filterWhenStart: tl3FilterWhenStart, setFilterWhenStart: setTl3FilterWhenStart,
    filterWhenEnd: tl3FilterWhenEnd, setFilterWhenEnd: setTl3FilterWhenEnd,
    filterWho: tl3FilterWho, setFilterWho: setTl3FilterWho,
    filterSearch: tl3FilterSearch, setFilterSearch: setTl3FilterSearch,
    sourcePopup: tl3SourcePopup, setSourcePopup: setTl3SourcePopup,
    variant: 'inline-location',
  });

  const renderContent = () => {
    if (activeView.type === 'timeline3') return renderTimeline3();
    if (activeView.type === 'pips') return renderPIPS();
    if (activeView.type === 'guidelines-htabs') return renderGuidelinesHTabs(activeView.activeId);
    if (activeView.type === 'registry') return renderRegistryTab(activeView.tabId, activeView.tabLabel);
    return null;
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <PatientHeader patient={patient} onBackToList={onBackToList} />

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ──────────────────────────────────────────────────────────────────── */}
        <aside className={`${navCollapsed ? 'w-12' : 'w-44'} bg-white border-r border-teal-200 flex-shrink-0 flex flex-col overflow-y-auto transition-all duration-200`}>
          <div className="flex flex-col py-2">

            <button
              onClick={() => setActiveView({ type: 'timeline3' })}
              title={navCollapsed ? 'Timeline' : undefined}
              className={navBtnCls(activeView.type === 'timeline3')}
            >
              <GitBranch className="w-4 h-4 flex-shrink-0" />
              {!navCollapsed && <span className="flex-1 leading-tight">Timeline</span>}
            </button>

            <button
              onClick={() => setActiveView({ type: 'pips' })}
              title={navCollapsed ? 'PIPS' : undefined}
              className={navBtnCls(activeView.type === 'pips')}
            >
              <ChartLine className="w-4 h-4 flex-shrink-0" />
              {!navCollapsed && <span className="flex-1 leading-tight">PIPS</span>}
            </button>

            <button
              onClick={() => setActiveView({ type: 'guidelines-htabs', activeId: 'overview' })}
              title={navCollapsed ? 'Care Guidelines' : undefined}
              className={navBtnCls(activeView.type === 'guidelines-htabs')}
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" />
              {!navCollapsed && <span className="flex-1 leading-tight">Care Guidelines</span>}
            </button>

            <div>
              <button
                onClick={() => setRegistryExpanded(v => !v)}
                title={navCollapsed ? 'Registry' : undefined}
                className={navBtnCls(activeView.type === 'registry')}
              >
                <Archive className="w-4 h-4 flex-shrink-0" />
                {!navCollapsed && <><span className="flex-1 leading-tight">Registry</span>
                <Lock size={10} className="text-gray-400 flex-shrink-0 mr-1" />
                {registryExpanded ? <ChevronDown size={13} className="flex-shrink-0" /> : <ChevronRight size={13} className="flex-shrink-0" />}</>}
              </button>

              {registryExpanded && !navCollapsed && (
                <div className="py-1 border-l-2 border-gray-100 ml-4">
                  {registryCategories.map(cat => {
                    const Icon = registryCategoryIcons[cat.id] || FileText;
                    const isActive = activeView.type === 'registry' && activeView.tabId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveView({ type: 'registry', tabId: cat.id, tabLabel: cat.label })}
                        className={`flex items-center gap-2 w-full pl-8 pr-3 py-1.5 text-xs transition-colors text-left rounded-r-lg ${
                          isActive
                            ? 'bg-gray-100 text-gray-800 font-medium'
                            : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="flex-1 truncate leading-tight">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={`pt-3 pb-1 ${navCollapsed ? 'px-1' : 'px-3'}`}>
              <button
                onClick={() => setIrisOpen(v => !v)}
                title="I.R.I.S."
                className={`w-full flex items-center gap-2 rounded-lg border transition-colors ${navCollapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'} ${
                  irisOpen ? 'bg-teal-100 border-teal-300' : 'bg-teal-50 hover:bg-teal-100 border-teal-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                  <Bot size={13} className="text-white" />
                </div>
                {!navCollapsed && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-teal-700 tracking-widest">I.R.I.S.</span>
                    <Sparkles size={8} className="text-teal-400" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </aside>

        {irisOpen && (
          <IRISChat
            key={irisKey}
            onClose={() => { setIrisOpen(false); setIrisFieldContext(undefined); }}
            fieldContext={irisFieldContext}
            navCollapsed={navCollapsed}
            onToggleNav={() => setNavCollapsed(v => !v)}
          />
        )}

        <main className={`flex-1 ${activeView.type === 'timeline3' ? 'overflow-hidden flex flex-col' : 'overflow-y-auto'}`}>
          <div className={`px-4 py-2 ${activeView.type === 'timeline3' ? 'flex-1 overflow-hidden flex flex-col' : ''}`}>
            {renderContent()}
          </div>
        </main>
      </div>

    </div>
  );
}

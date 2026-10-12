import { useState } from 'react';
import {
  Activity, Flame, Brain, Heart, Microscope, Bug,
  User, CreditCard, FileText, Phone, ChevronRight,
  ChevronDown, Shield, ArrowUpRight,
} from 'lucide-react';

interface Encounter {
  id: string;
  date: string;
  mechanism: string;
  status: 'Active' | 'Closed';
  detail: string;
}

interface PIEncounter {
  id: string;
  date: string;
  stage: 'Primary Review' | 'Secondary Review' | 'M&M' | 'TPRC' | 'Closed';
  flags: number;
}

interface RegistryDef {
  id: string;
  name: string;
  shortName: string;
  icon: React.ElementType;
  dotColor: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  encounters: Encounter[];
  piName: string;
  piShortName: string;
  piEncounters: PIEncounter[];
}

const REGISTRIES: RegistryDef[] = [
  {
    id: 'trauma', name: 'Trauma Registry', shortName: 'Trauma',
    icon: Activity,
    dotColor: 'bg-red-500', textColor: 'text-red-700',
    bgColor: 'bg-red-50', borderColor: 'border-red-200',
    encounters: [
      { id: 'tr-1', date: 'Mar 15, 2024', mechanism: 'MVC – Unrestrained Driver', status: 'Active', detail: 'Level 1 · ISS 29' },
      { id: 'tr-2', date: 'Nov 3, 2023',  mechanism: 'Fall from Height (18 ft)',  status: 'Closed', detail: 'Level 2 · ISS 14' },
    ],
    piName: 'Trauma PI', piShortName: 'Trauma PI',
    piEncounters: [
      { id: 'tpi-1', date: 'Mar 15, 2024', stage: 'Secondary Review', flags: 3 },
    ],
  },
  {
    id: 'burn', name: 'Burn Registry', shortName: 'Burn',
    icon: Flame,
    dotColor: 'bg-orange-500', textColor: 'text-orange-700',
    bgColor: 'bg-orange-50', borderColor: 'border-orange-200',
    encounters: [
      { id: 'br-1', date: 'Mar 15, 2024', mechanism: 'Thermal – Flash Burn', status: 'Active', detail: '18% TBSA · 2nd Degree' },
    ],
    piName: 'Burn PI', piShortName: 'Burn PI',
    piEncounters: [
      { id: 'bpi-1', date: 'Mar 15, 2024', stage: 'Primary Review', flags: 1 },
    ],
  },
  {
    id: 'neuro', name: 'Neuro Registry', shortName: 'Neuro',
    icon: Brain,
    dotColor: 'bg-purple-500', textColor: 'text-purple-700',
    bgColor: 'bg-purple-50', borderColor: 'border-purple-200',
    encounters: [
      { id: 'nr-1', date: 'Mar 15, 2024', mechanism: 'TBI – Severe (GCS 7)', status: 'Active', detail: 'Diffuse Axonal Injury' },
    ],
    piName: 'Neuro PI', piShortName: 'Neuro PI',
    piEncounters: [
      { id: 'npi-1', date: 'Mar 15, 2024', stage: 'Primary Review', flags: 2 },
    ],
  },
  {
    id: 'cardiovascular', name: 'Cardiovascular Registry', shortName: 'Cardiovascular',
    icon: Heart,
    dotColor: 'bg-rose-500', textColor: 'text-rose-700',
    bgColor: 'bg-rose-50', borderColor: 'border-rose-200',
    encounters: [
      { id: 'cv-1', date: 'Jan 8, 2024', mechanism: 'NSTEMI – Type 2', status: 'Closed', detail: 'Stress-induced · Cath Lab' },
    ],
    piName: 'Cardiovascular PI', piShortName: 'Cardio PI',
    piEncounters: [
      { id: 'cvpi-1', date: 'Jan 8, 2024', stage: 'Closed', flags: 0 },
    ],
  },
  {
    id: 'cancer', name: 'Cancer Registry', shortName: 'Cancer',
    icon: Microscope,
    dotColor: 'bg-emerald-500', textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200',
    encounters: [
      { id: 'ca-1', date: 'Dec 4, 2022', mechanism: 'Colorectal Adenocarcinoma', status: 'Active', detail: 'Stage III · FOLFOX Active' },
    ],
    piName: 'Cancer PI', piShortName: 'Cancer PI',
    piEncounters: [
      { id: 'capi-1', date: 'Dec 4, 2022', stage: 'TPRC', flags: 1 },
    ],
  },
  {
    id: 'sepsis', name: 'Sepsis Registry', shortName: 'Sepsis',
    icon: Bug,
    dotColor: 'bg-amber-500', textColor: 'text-amber-700',
    bgColor: 'bg-amber-50', borderColor: 'border-amber-200',
    encounters: [
      { id: 'sp-1', date: 'Nov 3, 2023', mechanism: 'Septic Shock – Abdominal Source', status: 'Closed', detail: 'SOFA 9 · ICU 6 days' },
    ],
    piName: 'Sepsis PI', piShortName: 'Sepsis PI',
    piEncounters: [
      { id: 'sppi-1', date: 'Nov 3, 2023', stage: 'Closed', flags: 0 },
    ],
  },
];

type NavItem =
  | { kind: 'patient-info'; id: string; label: string; icon: React.ElementType }
  | { kind: 'encounter'; registryId: string; encounterId: string }
  | { kind: 'pi-encounter'; registryId: string; piEncId: string };

const STAGE_COLORS: Record<PIEncounter['stage'], string> = {
  'Primary Review':   'bg-blue-100 text-blue-700',
  'Secondary Review': 'bg-amber-100 text-amber-700',
  'M&M':              'bg-purple-100 text-purple-700',
  'TPRC':             'bg-red-100 text-red-700',
  'Closed':           'bg-gray-100 text-gray-500',
};

function SidebarSection({ label }: { label: string }) {
  return (
    <div className="px-3 pt-4 pb-1">
      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

function RegistryNavGroup({ reg, selected, onSelect, isPIGroup }: {
  reg: RegistryDef;
  selected: NavItem | null;
  onSelect: (item: NavItem) => void;
  isPIGroup?: boolean;
}) {
  const [open, setOpen] = useState(true);
  const Icon = reg.icon;
  const totalFlags = isPIGroup ? reg.piEncounters.reduce((s, p) => s + p.flags, 0) : 0;
  const hasActive = !isPIGroup && reg.encounters.some(e => e.status === 'Active');

  const isGroupSelected = (isPIGroup ? reg.piEncounters : reg.encounters).some(enc => {
    if (!selected) return false;
    if (!isPIGroup && selected.kind === 'encounter') return selected.registryId === reg.id && selected.encounterId === (enc as Encounter).id;
    if (isPIGroup && selected.kind === 'pi-encounter') return selected.registryId === reg.id && selected.piEncId === (enc as PIEncounter).id;
    return false;
  });

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-left rounded-lg transition-colors ${isGroupSelected ? 'bg-indigo-50' : 'hover:bg-gray-100'}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isPIGroup ? 'bg-teal-400' : reg.dotColor}`} />
        <Icon size={12} className={isPIGroup ? 'text-teal-600' : reg.textColor} />
        <span className={`flex-1 text-xs font-semibold truncate ${isPIGroup ? 'text-teal-700' : reg.textColor}`}>
          {isPIGroup ? reg.piShortName : reg.shortName}
        </span>
        <div className="flex items-center gap-1">
          {hasActive && <span className="w-1.5 h-1.5 rounded-full bg-green-500" />}
          {totalFlags > 0 && <span className="text-[9px] font-bold text-red-500">{totalFlags}</span>}
          {open ? <ChevronDown size={10} className="text-gray-400" /> : <ChevronRight size={10} className="text-gray-400" />}
        </div>
      </button>
      {open && (
        <div className="ml-6 mt-0.5 flex flex-col gap-0.5">
          {isPIGroup
            ? reg.piEncounters.map(pi => {
                const isSelected = selected?.kind === 'pi-encounter' && selected.registryId === reg.id && selected.piEncId === pi.id;
                return (
                  <button key={pi.id} onClick={() => onSelect({ kind: 'pi-encounter', registryId: reg.id, piEncId: pi.id })}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${pi.stage === 'Closed' ? 'bg-gray-300' : 'bg-teal-400'}`} />
                    <span className="text-[11px] font-medium">{pi.date}</span>
                    {pi.flags > 0 && <span className="ml-auto text-[9px] font-bold text-red-500">{pi.flags}!</span>}
                  </button>
                );
              })
            : reg.encounters.map(enc => {
                const isSelected = selected?.kind === 'encounter' && selected.registryId === reg.id && selected.encounterId === enc.id;
                return (
                  <button key={enc.id} onClick={() => onSelect({ kind: 'encounter', registryId: reg.id, encounterId: enc.id })}
                    className={`w-full text-left flex items-center gap-2 px-2 py-1 rounded-md transition-colors ${isSelected ? 'bg-indigo-100 text-indigo-800' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}>
                    <span className={`w-1 h-1 rounded-full flex-shrink-0 ${enc.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-[11px] font-medium">{enc.date}</span>
                    {enc.status === 'Active' && <span className="ml-auto text-[9px] font-semibold text-green-600">Active</span>}
                  </button>
                );
              })
          }
        </div>
      )}
    </div>
  );
}

function PatientInfoPanel() {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Patient Identifiers</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {[['MRN','GH-2024-00892'],['Account #','ACC-88741'],['Trauma #','TR-2024-0342'],['SSN (last 4)','****-7734'],['Date of Birth','Mar 15, 1979'],['Age','45 years'],['Sex','Male'],['Race','Black or African American']].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
              <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Address & Contact</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {[['Address','123 Peachtree St NE'],['City / State','Atlanta, GA 30303'],['Phone','(404) 555-0123'],['Emergency Contact','Sarah Anderson (Wife)']].map(([label, value]) => (
            <div key={label}>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
              <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InsurancePanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Insurance</p>
      <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
        {[['Primary Payer','Medicaid – Georgia'],['Policy #','GA-MCD-7723441'],['Group #','GRP-9012'],['Secondary Payer','None'],['Authorization','Pending'],['Payment Class','Medicaid']].map(([label, value]) => (
          <div key={label}>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
            <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function EncounterPanel({ reg, enc }: { reg: RegistryDef; enc: Encounter }) {
  const Icon = reg.icon;
  return (
    <div className="flex flex-col gap-4">
      <div className={`${reg.bgColor} border ${reg.borderColor} rounded-xl p-5`}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-lg ${reg.dotColor} bg-opacity-20 flex items-center justify-center`}>
            <Icon size={18} className={reg.textColor} />
          </div>
          <div>
            <p className={`text-sm font-bold ${reg.textColor}`}>{reg.name}</p>
            <p className="text-xs text-gray-500">Encounter · {enc.date}</p>
          </div>
          <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${enc.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{enc.status}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Mechanism</p><p className="text-sm text-gray-800 font-medium mt-0.5">{enc.mechanism}</p></div>
          <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Detail</p><p className="text-sm text-gray-800 font-medium mt-0.5">{enc.detail}</p></div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${reg.dotColor} text-white hover:opacity-90 transition-opacity shadow-sm`}>
          Open in {reg.shortName} Registry <ArrowUpRight size={14} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">
          <Shield size={13} /> Open in PI Module
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">This encounter is managed in the {reg.name}.</p>
        <p className="text-xs text-gray-500 leading-relaxed">Full documentation, data entry, and registry submission for this encounter live in the {reg.name} module. Use the buttons above to navigate there.</p>
      </div>
    </div>
  );
}

function PIEncounterPanel({ reg, pi }: { reg: RegistryDef; pi: PIEncounter }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-teal-50 border border-teal-200 rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center">
            <Shield size={18} className="text-teal-700" />
          </div>
          <div>
            <p className="text-sm font-bold text-teal-800">{reg.piName}</p>
            <p className="text-xs text-gray-500">PI Case · {pi.date}</p>
          </div>
          <span className={`ml-auto text-xs font-semibold px-2.5 py-1 rounded-full ${STAGE_COLORS[pi.stage]}`}>{pi.stage}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Review Stage</p><p className="text-sm text-gray-800 font-medium mt-0.5">{pi.stage}</p></div>
          <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Open Flags</p><p className={`text-sm font-bold mt-0.5 ${pi.flags > 0 ? 'text-red-600' : 'text-gray-400'}`}>{pi.flags > 0 ? `${pi.flags} flag${pi.flags !== 1 ? 's' : ''}` : 'None'}</p></div>
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-sm w-fit">
        Open in {reg.piShortName} <ArrowUpRight size={14} />
      </button>
    </div>
  );
}

interface Props {
  patient: { mrn: string; name: string; age: number; gender: string; dob: string };
  onBackToList: () => void;
}

export function HubRecordB({ patient, onBackToList }: Props) {
  const [selected, setSelected] = useState<NavItem | null>({ kind: 'patient-info', id: 'demographics', label: 'Demographics', icon: User });

  const PATIENT_INFO: { kind: 'patient-info'; id: string; label: string; icon: React.ElementType }[] = [
    { kind: 'patient-info', id: 'demographics', label: 'Demographics', icon: User },
    { kind: 'patient-info', id: 'insurance',    label: 'Insurance',    icon: CreditCard },
    { kind: 'patient-info', id: 'documents',    label: 'Documents',    icon: FileText },
    { kind: 'patient-info', id: 'contacts',     label: 'Contacts',     icon: Phone },
  ];

  const renderContent = () => {
    if (!selected) return null;
    if (selected.kind === 'patient-info') {
      if (selected.id === 'demographics') return <PatientInfoPanel />;
      if (selected.id === 'insurance')    return <InsurancePanel />;
      return <div className="bg-white rounded-xl border border-gray-200 p-8 text-center"><p className="text-sm font-semibold text-gray-400">{selected.label} — coming soon</p></div>;
    }
    if (selected.kind === 'encounter') {
      const reg = REGISTRIES.find(r => r.id === selected.registryId);
      const enc = reg?.encounters.find(e => e.id === selected.encounterId);
      if (reg && enc) return <EncounterPanel reg={reg} enc={enc} />;
    }
    if (selected.kind === 'pi-encounter') {
      const reg = REGISTRIES.find(r => r.id === selected.registryId);
      const pi  = reg?.piEncounters.find(p => p.id === selected.piEncId);
      if (reg && pi) return <PIEncounterPanel reg={reg} pi={pi} />;
    }
    return null;
  };

  const contentTitle = () => {
    if (!selected) return '';
    if (selected.kind === 'patient-info') return selected.label;
    if (selected.kind === 'encounter') {
      const reg = REGISTRIES.find(r => r.id === selected.registryId);
      const enc = reg?.encounters.find(e => e.id === selected.encounterId);
      return `${reg?.shortName} · ${enc?.date}`;
    }
    if (selected.kind === 'pi-encounter') {
      const reg = REGISTRIES.find(r => r.id === selected.registryId);
      const pi  = reg?.piEncounters.find(p => p.id === selected.piEncId);
      return `${reg?.piShortName} · ${pi?.date}`;
    }
    return '';
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
        <div className="px-3 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-indigo-700">{patient.name.split(' ').map(n => n[0]).join('')}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-gray-800 truncate">{patient.name}</p>
              <p className="text-[10px] text-gray-400 font-mono">{patient.mrn}</p>
            </div>
          </div>
        </div>
        <SidebarSection label="Patient" />
        <div className="px-2 flex flex-col gap-0.5">
          {PATIENT_INFO.map(item => {
            const Icon = item.icon;
            const isSelected = selected?.kind === 'patient-info' && selected.id === item.id;
            return (
              <button key={item.id} onClick={() => setSelected(item)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-lg text-left transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                <Icon size={12} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
        <SidebarSection label="Registries" />
        <div className="px-2 flex flex-col gap-0.5">
          {REGISTRIES.map(reg => <RegistryNavGroup key={reg.id} reg={reg} selected={selected} onSelect={setSelected} />)}
        </div>
        <SidebarSection label="Process Improvement" />
        <div className="px-2 flex flex-col gap-0.5 pb-4">
          {REGISTRIES.map(reg => <RegistryNavGroup key={reg.id} reg={reg} selected={selected} onSelect={setSelected} isPIGroup />)}
        </div>
      </aside>
      <div className="flex-1 overflow-y-auto">
        <div className="px-7 py-6 max-w-3xl">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-4">
            <span className="font-medium text-indigo-600">{patient.name}</span>
            <ChevronRight size={12} />
            <span>{contentTitle()}</span>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

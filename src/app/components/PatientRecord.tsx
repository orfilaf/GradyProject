import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { PatientHeader } from './PatientHeader';
import { FormField } from './FormField';
import { AccordionChecklist } from './AccordionChecklist';
import { ProcedureTable } from './ProcedureTable';
import { DiagnosisTable } from './DiagnosisTable';
import { InjuryDiagnosisTable } from './InjuryDiagnosisTable';
import { PractitionerTable } from './PractitionerTable';
import { IRISChat, HistoryThread } from './IRISChat';
import { patientDataCategories } from '../data/patientFields';
import { aiFieldData, AIFieldData } from '../data/aiMockData';
import {
  User,
  Stethoscope,
  Activity,
  Siren,
  FileText,
  Heart,
  Pill,
  ClipboardList,
  TrendingUp,
  Ambulance,
  Users,
  MapPin,
  Building2,
  Route,
  Archive,
  Bot,
  Sparkles,
  MessageSquare,
} from 'lucide-react';

// Admitting Service → OEMST / GQIP derivation map
const ADMITTING_SERVICE_MAP: Record<string, { oemst: string; gqip: string }> = {
  'Trauma Surgery':             { oemst: 'Trauma',        gqip: 'Acute Care Surgery' },
  'Neurosurgery':               { oemst: 'Neurosurgery',  gqip: 'Neurosurgery' },
  'Orthopedic Surgery':         { oemst: 'Orthopedics',   gqip: 'Orthopedics' },
  'General Surgery':            { oemst: 'Surgery',       gqip: 'General Surgery' },
  'Internal Medicine':          { oemst: 'Medicine',      gqip: 'Internal Medicine' },
  'Cardiology':                 { oemst: 'Medicine',      gqip: 'Cardiology' },
  'Neurology':                  { oemst: 'Medicine',      gqip: 'Neurology' },
  'Burn Surgery':               { oemst: 'Burn',          gqip: 'Burn' },
  'Vascular Surgery':           { oemst: 'Surgery',       gqip: 'Vascular' },
  'Pediatrics':                 { oemst: 'Pediatrics',    gqip: 'Pediatrics' },
  'Urology':                    { oemst: 'Surgery',       gqip: 'General Surgery' },
  'Plastics / Reconstructive':  { oemst: 'Surgery',       gqip: 'Plastics' },
  'ENT':                        { oemst: 'Surgery',       gqip: 'General Surgery' },
  'Oral & Maxillofacial Surgery': { oemst: 'Surgery',     gqip: 'General Surgery' },
  'Other':                      { oemst: 'Other',         gqip: 'Other' },
};

// Mock past conversation threads shown in nav
const PAST_THREADS: HistoryThread[] = [
  {
    id: 'moi',
    theme: 'Mechanism of Injury',
    date: 'Jun 7',
    messages: [
      { role: 'iris', text: 'Hello! I\'m reviewing the Mechanism of Injury field.\n\nI found documentation supporting "Motor Vehicle Crash" from the EMS PCR and Police Report.\n\nWhat question do you have about Mechanism of Injury?' },
      { role: 'user', text: 'Should this be classified as MVA or MCC?' },
      { role: 'iris', text: 'Based on the sources, the incident involved a motor vehicle (car), not a motorcycle. The correct NTDB classification is "Motor Vehicle Crash (MVC/MVA)" rather than "Motor Cycle Crash (MCC)". The EMS PCR confirms a 4-wheeled fleet vehicle.' },
    ],
  },
  {
    id: 'gcs',
    theme: 'GCS Assessment',
    date: 'Jun 6',
    messages: [
      { role: 'iris', text: 'I\'m reviewing the GCS Assessment fields.\n\nBoth field and hospital GCS are documented at 15 (E4V5M6).\n\nWhat question do you have about GCS Assessment?' },
      { role: 'user', text: 'Do we need to document pediatric GCS?' },
      { role: 'iris', text: 'For this patient (34-year-old adult), pediatric GCS-40 is not required. The GCS-40 scale is used for patients under 2 years of age. You can leave the GCS-40 fields blank or mark as N/A.' },
    ],
  },
  {
    id: 'chest',
    theme: 'Chest Trauma Coding',
    date: 'Jun 5',
    messages: [
      { role: 'iris', text: 'I\'m reviewing documentation for Chest Trauma Coding.\n\nCT imaging shows left-sided rib fractures (ribs 4–7) with pulmonary contusion and hemopneumothorax.\n\nWhat question do you have?' },
      { role: 'user', text: 'Which AIS codes apply here?' },
      { role: 'iris', text: 'For this injury pattern:\n• Rib fractures ×4 left: AIS 4 (multiple ribs, unilateral)\n• Pulmonary contusion: AIS 3\n• Hemopneumothorax: AIS 3\n\nThe dominant injury (AIS 4) drives the chest region score. Recommend verifying with your trauma surgeon before finalizing ISS.' },
    ],
  },
];

const subTabIcons: Record<string, any> = {
  MapPin,
  Building2,
  Route,
  ClipboardList,
  Stethoscope,
  FileText,
  Users,
};

const categoryIcons: Record<string, any> = {
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

const EMS_COMPANIES = [
  { name: 'Georgia EMS generic', agencyId: '2020999' },
  { name: 'Alabama EMS generic', agencyId: '50100' },
  { name: 'Florida EMS generic', agencyId: '51200' },
  { name: 'Louisiana EMS generic', agencyId: '54900' },
  { name: 'Mississippi EMS generic', agencyId: '54800' },
  { name: 'North Carolina EMS generic', agencyId: '53700' },
  { name: 'South Carolina EMS generic', agencyId: '54500' },
  { name: 'Tennessee generic', agencyId: '54700' },
];

interface PatientRecordProps {
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
}

export function PatientRecord({ patient, onBackToList }: PatientRecordProps) {
  const [activeTab, setActiveTab] = useState('demographic');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [aiConfirmed, setAiConfirmed] = useState<Record<string, boolean>>({});
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>({});
  const [irisOpen, setIrisOpen] = useState(false);
  const [irisKey, setIrisKey] = useState(0);
  const [irisFieldContext, setIrisFieldContext] = useState<{ fieldName: string; sources: any[] } | undefined>(undefined);
  const [irisHistoryThread, setIrisHistoryThread] = useState<HistoryThread | undefined>(undefined);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [emsQuery, setEmsQuery] = useState('');
  const [emsOpen, setEmsOpen] = useState(false);

  const openIRISForField = (fieldName: string, data: AIFieldData) => {
    setIrisFieldContext({ fieldName, sources: data.sources });
    setIrisHistoryThread(undefined);
    setIrisOpen(true);
    setIrisKey(k => k + 1);
  };

  const openHistoryThread = (thread: HistoryThread) => {
    setIrisFieldContext(undefined);
    setIrisHistoryThread(thread);
    setIrisOpen(true);
    setIrisKey(k => k + 1);
  };

  const handleAiConfirm = (fieldName: string) => {
    setAiConfirmed((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const renderField = (categoryId: string, field: import('../data/patientFields').FieldDefinition) => {
    let value = formData[categoryId]?.[field.name];

    // Compute BMI from height (cm) and weight (kg)
    if (field.name === 'BMI') {
      const h = parseFloat(formData[categoryId]?.['Initial ED/Hospital Height'] ?? '');
      const w = parseFloat(formData[categoryId]?.['Initial ED/Hospital Weight'] ?? '');
      value = (h > 0 && w > 0) ? (w / Math.pow(h / 100, 2)).toFixed(1) : '';
    }

    // Compute Time in ED from arrival → physical discharge
    if (field.name === 'Time in ED') {
      const arrDate = formData[categoryId]?.['ED/Hospital Arrival Date'];
      const arrTime = formData[categoryId]?.['ED/Hospital Arrival Time'];
      const disDate = formData[categoryId]?.['Physical ED Discharge Date'];
      const disTime = formData[categoryId]?.['Physical ED Discharge Time'];
      if (arrDate && arrTime && disDate && disTime) {
        const arrival = new Date(`${arrDate}T${arrTime}`);
        const discharge = new Date(`${disDate}T${disTime}`);
        const diffMin = Math.round((discharge.getTime() - arrival.getTime()) / 60000);
        if (diffMin >= 0) {
          const hrs = Math.floor(diffMin / 60);
          const mins = diffMin % 60;
          value = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
        } else {
          value = '';
        }
      } else {
        value = '';
      }
    }

    const fieldAiData = field.aiEnabled ? aiFieldData[field.name] : undefined;
    return (
      <FormField
        key={field.name}
        field={field}
        value={value}
        onChange={(v) => handleFieldChange(categoryId, field.name, v)}
        aiData={fieldAiData}
        aiConfirmed={aiConfirmed[field.name]}
        onAiConfirm={() => handleAiConfirm(field.name)}
        onOpenIRIS={fieldAiData ? () => openIRISForField(field.name, fieldAiData) : undefined}
      />
    );
  };

  // Custom inline layout for the ED Vitals mini-card
  const renderEDVitalsContent = (categoryId: string) => {
    const val = (name: string) => String(formData[categoryId]?.[name] ?? '');
    const set = (name: string, value: any) => handleFieldChange(categoryId, name, value);
    const respMode = val('ED Respiratory Mode') || 'Unassisted';
    const massBlood = val('Mass Blood Protocol');

    const inputCls = 'w-16 px-1.5 py-1.5 text-sm text-center border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary';
    const selectCls = 'text-xs px-2 py-1.5 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white';
    const labelCls = 'text-xs font-medium text-gray-600 block mb-1';
    const unitCls = 'text-xs text-gray-400';

    return (
      <div className="flex flex-col gap-3 p-3">
        {/* Blood Pressure: SBP / DBP */}
        <div>
          <label className={labelCls}>Blood Pressure</label>
          <div className="flex items-center gap-1.5">
            <input type="number" placeholder="SBP" className={inputCls}
              value={val('ED Systolic Blood Pressure')} onChange={e => set('ED Systolic Blood Pressure', e.target.value)} />
            <span className="text-gray-400 font-medium">/</span>
            <input type="number" placeholder="DBP" className={inputCls}
              value={val('ED Diastolic Blood Pressure')} onChange={e => set('ED Diastolic Blood Pressure', e.target.value)} />
            <span className={unitCls}>mmHg</span>
          </div>
        </div>

        {/* Pulse Rate */}
        <div>
          <label className={labelCls}>Pulse Rate</label>
          <div className="flex items-center gap-1.5">
            <input type="number" className={inputCls}
              value={val('ED Pulse Rate')} onChange={e => set('ED Pulse Rate', e.target.value)} />
            <span className={unitCls}>bpm</span>
          </div>
        </div>

        {/* Respiratory Rate + Assisted/Unassisted */}
        <div>
          <label className={labelCls}>Respiratory Rate</label>
          <div className="flex items-center gap-1.5">
            <input type="number" className={inputCls}
              value={val('ED Respiratory Rate')} onChange={e => set('ED Respiratory Rate', e.target.value)} />
            <span className={unitCls}>/min</span>
            <select className={selectCls} value={respMode} onChange={e => set('ED Respiratory Mode', e.target.value)}>
              <option value="Unassisted">Unassisted</option>
              <option value="Assisted">Assisted</option>
            </select>
          </div>
          {respMode === 'Assisted' && (
            <div className="mt-2 pl-3 border-l-2 border-primary/30">
              <label className={labelCls}>Assist Method</label>
              <select className={`w-full ${selectCls}`}
                value={val('ED Assist Method')} onChange={e => set('ED Assist Method', e.target.value)}>
                <option value="">Select...</option>
                {['Bag-Valve Mask', 'Mechanical Ventilator', 'CPAP', 'BiPAP', 'High-Flow Nasal Cannula', 'Other'].map(m => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Oxygen Saturation + Supplemental O2 */}
        <div>
          <label className={labelCls}>Oxygen Saturation</label>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <input type="number" className={inputCls}
                value={val('ED Oxygen Saturation')} onChange={e => set('ED Oxygen Saturation', e.target.value)} />
              <span className={unitCls}>%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">Suppl. O2</span>
              {['Yes', 'No'].map(opt => (
                <label key={opt} className="flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
                  <input type="radio" name={`${categoryId}-suppl-o2`} value={opt}
                    checked={val('ED Supplemental O2') === opt} onChange={() => set('ED Supplemental O2', opt)}
                    className="w-3 h-3 text-primary border-gray-300 focus:ring-primary" />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Temperature + Route */}
        <div>
          <label className={labelCls}>Temperature</label>
          <div className="flex items-center gap-1.5 flex-wrap">
            <input type="number" className={inputCls}
              value={val('Initial ED/Hospital Temperature')} onChange={e => set('Initial ED/Hospital Temperature', e.target.value)} />
            <span className={unitCls}>°C</span>
            <select className={selectCls}
              value={val('Initial Temperature Route')} onChange={e => set('Initial Temperature Route', e.target.value)}>
              <option value="">Route...</option>
              {['Oral', 'Rectal', 'Axillary', 'Tympanic', 'Temporal', 'Esophageal', 'Bladder', 'Other'].map(r => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CPR */}
        <div>
          <label className={labelCls}>CPR</label>
          <div className="flex items-center gap-3">
            {['Yes', 'No'].map(opt => (
              <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                <input type="radio" name={`${categoryId}-cpr`} value={opt}
                  checked={val('CPR') === opt} onChange={() => set('CPR', opt)}
                  className="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary" />
                {opt}
              </label>
            ))}
          </div>
        </div>

        {/* Mass Blood Protocol */}
        <div>
          <label className={labelCls}>Mass Blood Protocol</label>
          <select className={`w-full ${selectCls}`}
            value={massBlood} onChange={e => set('Mass Blood Protocol', e.target.value)}>
            <option value="">Select...</option>
            {['Yes', 'No', 'N/A'].map(opt => <option key={opt}>{opt}</option>)}
          </select>
          {massBlood === 'Yes' && (
            <div className="mt-2 pl-3 border-l-2 border-primary/30 flex flex-col gap-2">
              <div>
                <label className={labelCls}>Protocol Date</label>
                <input type="date" className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  value={val('Mass Blood Protocol Date')} onChange={e => set('Mass Blood Protocol Date', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Protocol Time</label>
                <input type="time" className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  value={val('Mass Blood Protocol Time')} onChange={e => set('Mass Blood Protocol Time', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Protocol Administered</label>
                <div className="flex items-center gap-3">
                  {['Yes', 'No'].map(opt => (
                    <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                      <input type="radio" name={`${categoryId}-mbp-admin`} value={opt}
                        checked={val('Mass Blood Protocol Administered') === opt}
                        onChange={() => set('Mass Blood Protocol Administered', opt)}
                        className="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary" />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderScreeningsContent = (categoryId: string) => {
    const val = (name: string) => String(formData[categoryId]?.[name] ?? '');
    const set = (name: string, value: any) => handleFieldChange(categoryId, name, value);
    const drugIndicator = val('Drug Use Indicator');
    const showDrugList = drugIndicator.startsWith('Yes');

    const drugOptions = [
      'AMP (Amphetamine)', 'BAR (Barbiturate)', 'BZO (Benzodiazepines)',
      'COC (Cocaine)', 'mAMP (Methamphetamine)', 'MDMA (Ecstasy)',
      'MTD (Methadone)', 'OPI (Opioid)', 'OXY (Oxycodone)',
      'PCP (Phencyclidine)', 'TCA (Tricyclic Antidepressant)', 'THC (Cannabinoid)',
      'Other', 'None', 'Not Tested',
    ];

    const drugValues: Record<string, boolean> = formData[categoryId]?.['Drug Substances'] || {};
    const toggleDrug = (item: string, checked: boolean) =>
      set('Drug Substances', { ...drugValues, [item]: checked });

    const selectCls = 'text-xs px-2 py-1.5 border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white';
    const labelCls = 'text-xs font-medium text-gray-600';

    return (
      <div className="flex flex-col gap-4">
        {/* Alcohol row */}
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <span className={`${labelCls} block mb-1`}>Alcohol Screen</span>
            <div className="flex items-center gap-3">
              {['Yes', 'No'].map(opt => (
                <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                  <input type="radio" name={`${categoryId}-alcohol-screen`} value={opt}
                    checked={val('Alcohol Screen') === opt} onChange={() => set('Alcohol Screen', opt)}
                    className="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary" />
                  {opt}
                </label>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-[160px]">
            <label className={`${labelCls} block mb-1`}>Alcohol Screen Result</label>
            <input type="text" placeholder="Result..."
              className="w-full px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
              value={val('Alcohol Screen Result')} onChange={e => set('Alcohol Screen Result', e.target.value)} />
          </div>
        </div>

        {/* Drug Use Indicator */}
        <div>
          <label className={`${labelCls} block mb-1`}>Drug Use Indicator</label>
          <select className={`w-full ${selectCls}`}
            value={drugIndicator} onChange={e => set('Drug Use Indicator', e.target.value)}>
            <option value="">Select...</option>
            {[
              'No (Not Tested)',
              'No (Confirmed by Test)',
              'Yes (Confirmed by Test [Prescription Drug])',
              'Yes (Confirmed by Test [Illegal Use Drug])',
              'Yes (Confirmed by Test [Unknown if Prescribed or Illegal])',
              'Not Applicable',
              'Unknown',
            ].map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>

        {/* Drug substance checklist — conditional on any "Yes" */}
        {showDrugList && (
          <div>
            <span className={`${labelCls} block mb-2`}>Substances Detected</span>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5">
              {drugOptions.map(item => (
                <label key={item} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input type="checkbox"
                    checked={!!drugValues[item]}
                    onChange={e => toggleDrug(item, e.target.checked)}
                    className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary flex-shrink-0" />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDischargeContent = (categoryId: string) => {
    const val = (name: string) => String(formData[categoryId]?.[name] ?? '');
    const set = (name: string, value: any) => handleFieldChange(categoryId, name, value);

    const dischargeStatus = val('Discharge Status');
    const autopsyPerformed = val('Autopsy Performed');
    const organDonationRequested = val('Organ Donation Requested');
    const disposition = val('Hospital Discharge Disposition');
    const transferFacility = val('Transfer Facility');

    const inpCls = 'px-1.5 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white';
    const selCls = `${inpCls} cursor-pointer`;
    const labelCls = 'text-xs font-medium text-gray-600 whitespace-nowrap block mb-1';

    const field = (label: string, children: React.ReactNode) => (
      <div key={label} className="flex flex-col">
        <label className={labelCls}>{label}</label>
        {children}
      </div>
    );

    const yesNo = (name: string, radioName: string) => (
      <div className="flex items-center gap-3 h-[30px]">
        {['Yes', 'No'].map(opt => (
          <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
            <input type="radio" name={`${categoryId}-${radioName}`} value={opt}
              checked={val(name) === opt} onChange={() => set(name, opt)}
              className="w-3.5 h-3.5 text-primary border-gray-300 focus:ring-primary" />
            {opt}
          </label>
        ))}
      </div>
    );

    return (
      <div className="flex flex-col gap-4">
        {/* Dates + Total Days row */}
        <div className="flex items-end gap-4 flex-wrap">
          {[
            { label: 'Hospital Discharge Date', type: 'date', width: 'w-[132px]' },
            { label: 'Hospital Discharge Time', type: 'time', width: 'w-[104px]' },
            { label: 'Hospital Physical Discharge Date', type: 'date', width: 'w-[132px]' },
            { label: 'Hospital Physical Discharge Time', type: 'time', width: 'w-[104px]' },
          ].map(({ label, type, width }) => (
            field(label, <input type={type} className={`${inpCls} ${width}`}
              value={val(label)} onChange={e => set(label, e.target.value)} />)
          ))}
          {field('Total Days Hospital',
            <input type="number" min={0} className={`${inpCls} w-20`}
              value={val('Total Days Hospital')} onChange={e => set('Total Days Hospital', e.target.value)} />
          )}
        </div>

        {/* Discharge Status + all conditional fields — single inline row */}
        <div className="flex items-end gap-4 flex-wrap">
          {field('Discharge Status',
            <select className={`${selCls} w-32`}
              value={dischargeStatus} onChange={e => set('Discharge Status', e.target.value)}>
              <option value="">Select...</option>
              <option value="Alive">Alive</option>
              <option value="Dead">Dead</option>
            </select>
          )}

          {/* ── Dead fields ── */}
          {dischargeStatus === 'Dead' && (<>
            {field('Location',
              <select className={`${selCls} w-36`}
                value={val('Death Location')} onChange={e => set('Death Location', e.target.value)}>
                <option value="">Select...</option>
                {['ED', 'OR', 'ICU', 'Step-Down', 'Floor', 'Other'].map(o => <option key={o}>{o}</option>)}
              </select>
            )}
            {field('Circumstances of Death',
              <select className={`${selCls} w-48`}
                value={val('Circumstances of Death')} onChange={e => set('Circumstances of Death', e.target.value)}>
                <option value="">Select...</option>
                {['Trauma', 'Cardiac Arrest', 'Respiratory Failure', 'Sepsis', 'Neurological', 'Other'].map(o => <option key={o}>{o}</option>)}
              </select>
            )}
            {field('Autopsy Performed?', yesNo('Autopsy Performed', 'autopsy'))}
            {autopsyPerformed === 'Yes' && (<>
              {field('Autopsy #', <input type="text" className={`${inpCls} w-28`}
                value={val('Autopsy Number')} onChange={e => set('Autopsy Number', e.target.value)} />)}
              {field('County ME', <input type="text" className={`${inpCls} w-32`}
                value={val('County ME')} onChange={e => set('County ME', e.target.value)} />)}
            </>)}
            {field('Organ Donation Requested?', yesNo('Organ Donation Requested', 'organ-req'))}
            {organDonationRequested === 'Yes' && (<>
              {field('Donation Granted?', yesNo('Organ Donation Granted', 'organ-granted'))}
              {field('Donor Status',
                <select className={`${selCls} w-36`}
                  value={val('Donor Status')} onChange={e => set('Donor Status', e.target.value)}>
                  <option value="">Select...</option>
                  {['Brain Death', 'Non-Beating Heart'].map(o => <option key={o}>{o}</option>)}
                </select>
              )}
            </>)}
          </>)}

          {/* ── Alive fields ── */}
          {dischargeStatus === 'Alive' && (<>
            {field('Discharge Disposition',
              <select className={`${selCls} w-36`}
                value={disposition} onChange={e => set('Hospital Discharge Disposition', e.target.value)}>
                <option value="">Select...</option>
                <option value="Home">Home</option>
                <option value="Transfer">Transfer</option>
              </select>
            )}
            {disposition === 'Transfer' && (<>
              {field('Facility',
                <select className={`${selCls} w-36`}
                  value={transferFacility} onChange={e => set('Transfer Facility', e.target.value)}>
                  <option value="">Select...</option>
                  <option value="Facility 1">Facility 1</option>
                  <option value="N/A">N/A</option>
                </select>
              )}
              {transferFacility === 'N/A' && field('Discharged To',
                <input type="text" className={`${inpCls} w-52`}
                  value={val('Discharged To')} onChange={e => set('Discharged To', e.target.value)} />
              )}
              {field('Transfer Rationale',
                <select className={`${selCls} w-48`}
                  value={val('Transfer Rationale')} onChange={e => set('Transfer Rationale', e.target.value)}>
                  <option value="">Select...</option>
                  {['Higher Level of Care', 'Lower Level of Care', 'Specialty Care', 'Patient Request', 'Bed Availability', 'Other'].map(o => <option key={o}>{o}</option>)}
                </select>
              )}
            </>)}
          </>)}
        </div>
      </div>
    );
  };

  const renderEMSGroupContent = (categoryId: string) => {
    const val = (name: string) => String(formData[categoryId]?.[name] ?? '');
    const set = (name: string, value: any) => handleFieldChange(categoryId, name, value);

    const query = emsQuery || val('Agency Name');
    const matches = query.length >= 1
      ? EMS_COMPANIES.filter(c => c.name.toLowerCase().includes(query.toLowerCase()))
      : [];

    const selectCompany = (company: { name: string; agencyId: string }) => {
      set('Agency Name', company.name);
      set('Agency ID', company.agencyId);
      setEmsQuery('');
      setEmsOpen(false);
    };

    const inp = 'px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white';
    const lbl = 'text-xs font-medium text-gray-600 block mb-0.5 whitespace-nowrap';

    const EMS_ROLE_OPTIONS = [
      'Non-Transport',
      'Transport from Scene to Facility',
      'Transport from Scene to Rendezvous',
      'Transport from Rendezvous to Facility',
      'Transport to Other',
      'Transport from Non-Scene Location',
      'Not Applicable',
    ];
    const TRANSPORT_OPTIONS = [
      'Ground Ambulance',
      'Helicopter Ambulance',
      'Fixed-wing Ambulance',
      'Private/Public Vehicle/Walk-in',
      'Police',
      'Other',
    ];

    const selField = (label: string, name: string, options: string[], w: string) => (
      <div className="flex flex-col">
        <label className={lbl}>{label}</label>
        <select className={`${inp} ${w}`} value={val(name)} onChange={e => set(name, e.target.value)}>
          <option value="">Select...</option>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
    );

    const dtField = (label: string, name: string) => (
      <div className="flex flex-col">
        <label className={lbl}>{label}</label>
        <input type="datetime-local" className={`${inp} w-[180px]`} value={val(name)} onChange={e => set(name, e.target.value)} />
      </div>
    );

    const numField = (label: string, name: string, unit: string, w = 'w-20') => (
      <div className="flex flex-col">
        <label className={lbl}>{label}</label>
        <div className="flex items-center gap-1">
          <input type="number" className={`${inp} ${w}`} value={val(name)} onChange={e => set(name, e.target.value)} />
          <span className="text-xs text-gray-400">{unit}</span>
        </div>
      </div>
    );

    return (
      <div className="flex flex-col gap-3">
        {/* Row 1: Agency Name (lookup) + Agency ID + EMS Role + Transport Mode */}
        <div className="flex gap-3 flex-wrap items-end">
          {/* Agency Name — typeahead */}
          <div className="flex flex-col relative">
            <label className={lbl}>Agency Name</label>
            <input
              className={`${inp} w-52`}
              value={emsOpen ? emsQuery : val('Agency Name')}
              placeholder="Type to search..."
              onChange={e => { setEmsQuery(e.target.value); setEmsOpen(true); set('Agency Name', e.target.value); }}
              onFocus={() => setEmsOpen(true)}
              onBlur={() => setTimeout(() => setEmsOpen(false), 150)}
            />
            {emsOpen && matches.length > 0 && (
              <div className="absolute top-full left-0 z-20 mt-1 w-72 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {matches.map(c => (
                  <button
                    key={c.agencyId}
                    onMouseDown={() => selectCompany(c)}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-primary/10 hover:text-primary flex justify-between gap-2"
                  >
                    <span className="font-medium">{c.name}</span>
                    <span className="text-gray-400 flex-shrink-0">{c.agencyId}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Agency ID — auto-populated */}
          <div className="flex flex-col">
            <label className={lbl}>Agency ID</label>
            <input
              className={`${inp} w-28 bg-gray-50 text-gray-600`}
              value={val('Agency ID')}
              readOnly
              placeholder="Auto-filled"
            />
          </div>

          {selField('EMS Role', 'EMS Role', EMS_ROLE_OPTIONS, 'w-32')}
          {selField('Transport Mode', 'Transport Mode', TRANSPORT_OPTIONS, 'w-36')}
        </div>

        {/* Row 2: date/time + lapsed fields */}
        <div className="flex gap-3 flex-wrap items-end">
          {dtField('EMS Dispatch', 'EMS Dispatch')}
          {dtField('EMS Arrival at Scene', 'EMS Arrival at Scene')}
          {dtField('EMS Departure from Scene', 'EMS Departure from Scene')}
          {numField('Scene Time Lapsed', 'Scene Time Lapsed', 'min', 'w-32')}
          {dtField('EMS Arrival to Hospital', 'EMS Arrival to Hospital')}
          {numField('Transport Time Lapsed', 'Transport Time Lapsed', 'min', 'w-36')}
        </div>
      </div>
    );
  };

  const renderGradyAdminContent = (categoryId: string) => {

    const val = (name: string) => String(formData[categoryId]?.[name] ?? '');
    const set = (name: string, value: any) => handleFieldChange(categoryId, name, value);

    // Auto-populate created timestamp on first access
    const createdTimestamp = val('_createdTimestamp') || new Date().toISOString().slice(0, 16);
    if (!val('_createdTimestamp')) {
      set('_createdTimestamp', createdTimestamp);
    }

    const inpCls = 'px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white';
    const readCls = 'px-2 py-1.5 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-700 select-none';
    const labelCls = 'text-xs font-medium text-gray-600 block mb-1';

    const row = (label: string, content: React.ReactNode) => (
      <div key={label} className="flex flex-col gap-1">
        <label className={labelCls}>{label}</label>
        {content}
      </div>
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-2">
        {row('PI Owner', <div className={`${readCls} font-medium`}>Sarah Williams</div>)}
        {row('Registry Owner', <div className={`${readCls} font-medium`}>Michael Chen</div>)}
        {row('Created By', <div className={readCls}>System</div>)}
        {row('Created', <div className={readCls}>{createdTimestamp.replace('T', ' ')}</div>)}
        {row('Time to Complete Record',
          <div className={`${readCls} text-xs italic text-gray-400`}>calculated on completion</div>
        )}
        {row('Facility Number and Description',
          <input type="text" className={`${inpCls} w-full`}
            value={val('Facility Number and Description')}
            onChange={e => set('Facility Number and Description', e.target.value)} />
        )}
      </div>
    );
  };

  const renderDemographicTab = () => {
    const catId = 'demographic';
    const v = (name: string) => String(formData[catId]?.[name] ?? '');
    const s = (name: string, val: string) => handleFieldChange(catId, name, val);

    const inp = 'px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white';
    const lbl = 'text-xs font-medium text-gray-600 block mb-0.5 whitespace-nowrap';
    const card = 'bg-white rounded-lg border border-gray-200 p-3';
    const hdr = 'text-sm font-semibold text-gray-700 mb-2 pb-1.5 border-b border-gray-200';

    const fld = (label: string, input: React.ReactNode) => (
      <div key={label} className="flex flex-col">
        <label className={lbl}>{label}</label>
        {input}
      </div>
    );

    const txt = (name: string, w: string, placeholder?: string) =>
      <input className={`${inp} ${w}`} value={v(name)} placeholder={placeholder}
        onChange={e => s(name, e.target.value)} />;

    const sel = (name: string, w: string, options: string[]) =>
      <select className={`${inp} ${w}`} value={v(name)} onChange={e => s(name, e.target.value)}>
        <option value="">Select...</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>;

    return (
      <div className="flex flex-col gap-2">

        {/* ── Patient IDs ── */}
        <div className={card}>
          <h3 className={hdr}>Patient IDs</h3>
          <div className="flex gap-3 flex-wrap">
            {fld('Medical Record Number', txt('Medical Record Number', 'w-40'))}
            {fld('Georgia LongID Number', txt('Georgia LongID Number', 'w-40'))}
          </div>
        </div>

        {/* ── Patient Visits ── */}
        <div className={card}>
          <h3 className={hdr}>Patient Visits</h3>
          <div className="flex gap-3 flex-wrap">
            {fld('Account Number', txt('Account Number', 'w-40'))}
            {fld('Armband Number', txt('Armband Number', 'w-36'))}
          </div>
        </div>

        {/* ── Personal Information (includes Name + Financial) ── */}
        <div className={card}>
          <h3 className={hdr}>Personal Information</h3>
          <div className="flex flex-col gap-2">
            {/* Row 1: Name + DOB + Age + SSN */}
            <div className="flex gap-3 flex-wrap items-end">
              {fld('Last Name', txt('Last Name', 'w-36'))}
              {fld('First Name', txt('First Name', 'w-36'))}
              {fld('MI', txt('Middle Initial', 'w-12'))}
              {fld('Date of Birth', <input type="date" className={`${inp} w-36`} value={v('Date of Birth')} onChange={e => s('Date of Birth', e.target.value)} />)}
              {fld('Age', <input type="number" min={0} className={`${inp} w-16`} value={v('Age')} onChange={e => s('Age', e.target.value)} />)}
              {fld('Age Units', sel('Age Units', 'w-28', ['Minutes', 'Hours', 'Days', 'Months', 'Years']))}
              {fld('Social Security Number', txt('Social Security Number', 'w-36', 'XXX-XX-XXXX'))}
            </div>
            {/* Row 2: Sex + Gender + HRT + Race + Ethnicity + Payment */}
            <div className="flex gap-3 flex-wrap items-end">
              {fld('Sex Assigned at Birth', sel('Sex Assigned at Birth', 'w-36', ['Male', 'Female', 'Unknown', 'Not Reported']))}
              {fld('Gender', sel('Gender', 'w-36', ['Male', 'Female', 'Non-binary', 'Transgender Male', 'Transgender Female', 'Other', 'Unknown']))}
              <div className="flex flex-col gap-0.5">
                <label className="text-xs font-medium text-gray-700 whitespace-nowrap">Gender-Affirming HRT</label>
                <select
                  value={formData[catId]?.['Gender-Affirming Hormone Therapy'] ?? ''}
                  onChange={e => handleFieldChange(catId, 'Gender-Affirming Hormone Therapy', e.target.value)}
                  className="px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-36"
                >
                  <option value="">Select...</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Non-disclosed">Non-disclosed</option>
                </select>
              </div>
              {fld('Race', sel('Race', 'w-52', ['White', 'Black or African American', 'Asian', 'American Indian or Alaska Native', 'Native Hawaiian / Pacific Islander', 'Other', 'Unknown']))}
              {fld('Ethnicity', sel('Ethnicity', 'w-48', ['Hispanic or Latino', 'Not Hispanic or Latino', 'Unknown', 'Not Reported']))}
              {fld('Payment Method', sel('Primary Method of Payment', 'w-44', ['Private Insurance', 'Medicare', 'Medicaid', 'Self-Pay / Uninsured', 'Workers Compensation', 'Other Government', 'Other', 'Unknown']))}
            </div>
          </div>
        </div>

        {/* ── Address ── */}
        <div className={card}>
          <h3 className={hdr}>Address</h3>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 flex-wrap items-end">
              {fld('City', txt("Patient's Home City", 'w-40'))}
              {fld('County', txt("Patient's Home County", 'w-32'))}
              {fld('State', <input maxLength={2} className={`${inp} w-14`} value={v("Patient's Home State")} onChange={e => s("Patient's Home State", e.target.value)} />)}
              {fld('Zip / Postal Code', txt("Patient's Home Zip/Postal Code", 'w-28'))}
              {fld('Country', txt("Patient's Home Country", 'w-28'))}
            </div>
            <div>
              {fld('Alternate Home Residence', sel('Alternate Home Residence', 'w-56', ['Homeless', 'Undocumented Citizen', 'Migrant Worker']))}
            </div>
          </div>
        </div>


      </div>
    );
  };

  const renderGroup = (categoryId: string, group: import('../data/patientFields').FieldGroup) => {
    // Header select value (used for showIfValue filtering)
    const headerSelectValue: string = group.headerSelect
      ? (formData[categoryId]?.[group.headerSelect.name] ?? group.headerSelect.options[0])
      : '';

    // Custom layout override — renders a fully bespoke component
    if (group.customLayout) {
      // Title + fields all on one row
      if (group.customLayout === 'inline-header-fields') {
        return (
          <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-3">
            <div className="flex items-center gap-6 flex-wrap">
              <h3 className="text-base font-semibold text-gray-700 flex-shrink-0">{group.groupName}</h3>
              {group.fields.map(field => {
                const fId = field.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const val = String(formData[categoryId]?.[field.name] ?? '');
                const cls = 'w-44 px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent';
                return (
                  <div key={field.name} className="flex flex-col gap-1">
                    <label htmlFor={fId} className="text-xs font-medium text-gray-600 whitespace-nowrap">{field.name}</label>
                    {field.type === 'select' ? (
                      <select id={fId} className={`${cls} bg-white`} value={val} onChange={e => handleFieldChange(categoryId, field.name, e.target.value)}>
                        <option value="">Select...</option>
                        {(field.options ?? []).map(o => <option key={o}>{o}</option>)}
                      </select>
                    ) : (
                      <input id={fId} type="text" className={cls} value={val} onChange={e => handleFieldChange(categoryId, field.name, e.target.value)} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      // Arrival group: 4 admitting fields inline, rest in grid below
      if (group.customLayout === 'arrival-inline') {
        const INLINE_FIELDS = new Set(['Admitting Physician', 'Admitting Service', 'OEMST Category', 'GQIP Category']);
        const inlineFields = group.fields.filter(f => INLINE_FIELDS.has(f.name));
        const gridFields = group.fields.filter(f => !INLINE_FIELDS.has(f.name));
        const sel = 'px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white';
        const derivedFields = new Set(['OEMST Category', 'GQIP Category']);
        return (
          <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1.5 border-b border-gray-200">{group.groupName}</h3>
            {/* Inline admitting train */}
            <div className="flex items-end gap-3 flex-wrap mb-2 pb-2 border-b border-gray-100">
              {inlineFields.map((field, i) => {
                const fId = field.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const val = String(formData[categoryId]?.[field.name] ?? '');
                const isDerived = derivedFields.has(field.name);
                return (
                  <div key={field.name} className="flex items-end gap-2">
                    {i > 0 && <span className="text-gray-300 pb-2.5 font-light text-lg">→</span>}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <label htmlFor={fId} className="text-xs font-medium text-gray-600 whitespace-nowrap">{field.name}</label>
                        {isDerived && (
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-teal-50 text-teal-600 border border-teal-200 leading-none">derived</span>
                        )}
                      </div>
                      <select
                        id={fId}
                        className={`${sel} ${isDerived ? 'bg-teal-50/40' : ''} w-44`}
                        value={val}
                        onChange={e => handleFieldChange(categoryId, field.name, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {(field.options ?? []).map(o => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
            {/* Remaining fields in standard grid */}
            <div className="grid gap-x-3 gap-y-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gridFields.map(field => renderField(categoryId, field))}
            </div>
          </div>
        );
      }

      // Compact single-row date/time fields
      if (group.customLayout === 'compact-date-row') {
        const inpCls = 'px-1.5 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white';
        return (
          <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1.5 border-b border-gray-200">
              {group.groupName}
            </h3>
            <div className="flex items-end gap-4 flex-wrap">
              {group.fields.map(field => {
                const fId = field.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
                const widthCls = field.type === 'datetime-local' ? 'w-[200px]' : field.type === 'date' ? 'w-[132px]' : field.type === 'time' ? 'w-[104px]' : 'w-[90px]';
                return (
                  <div key={field.name} className="flex flex-col gap-1">
                    <label htmlFor={fId} className="text-xs font-medium text-gray-600 whitespace-nowrap">
                      {field.name}
                      {field.unit && <span className="ml-1 text-gray-400 font-normal">({field.unit})</span>}
                    </label>
                    <input
                      id={fId}
                      type={field.type === 'number' ? 'number' : field.type}
                      className={`${inpCls} ${widthCls}`}
                      value={String(formData[categoryId]?.[field.name] ?? '')}
                      onChange={e => handleFieldChange(categoryId, field.name, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      const customContent =
        group.customLayout === 'ems-group' ? renderEMSGroupContent(categoryId) :
        group.customLayout === 'screenings' ? renderScreeningsContent(categoryId) :
        group.customLayout === 'discharge' ? renderDischargeContent(categoryId) :
        group.customLayout === 'grady-admin' ? renderGradyAdminContent(categoryId) : null;
      if (customContent) {
        return (
          <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1.5 border-b border-gray-200">
              {group.groupName}
            </h3>
            {customContent}
          </div>
        );
      }
    }

    // Column layout — mini-cards with colored headers per column
    if (group.columns && group.columns.length > 0) {
      const columnStyles = [
        { header: 'bg-teal-600 text-white', card: 'border-teal-200 bg-teal-50/40' },
        { header: 'bg-yellow-500 text-white', card: 'border-yellow-200 bg-yellow-50/40' },
        { header: 'bg-slate-400 text-white', card: 'border-slate-200 bg-slate-50/40' },
        { header: 'bg-teal-400 text-white', card: 'border-teal-100 bg-teal-50/20' },
      ];
      return (
        <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1.5 border-b border-gray-200">
            {group.groupName}
          </h3>
          <div className="flex gap-2">
            {group.columns.map((col, i) => {
              const style = columnStyles[i % columnStyles.length];
              return (
                <div key={col.columnName} className={`flex-1 min-w-0 rounded-lg border overflow-hidden ${style.card}`}>
                  <div className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide ${style.header}`}>
                    {col.columnName}
                  </div>
                  {col.customLayout === 'ed-vitals'
                    ? renderEDVitalsContent(categoryId)
                    : (
                      <div className="flex flex-col gap-2 p-2.5">
                        {col.fields.map((field) => renderField(categoryId, field))}
                      </div>
                    )
                  }
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // Standard flat grid layout
    let gridClass = '';
    if (group.gridColumns === 5) gridClass = 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
    else if (group.gridColumns === 4) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
    else if (group.gridColumns === 3) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    else if (group.compactLayout) gridClass = 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
    else if (group.fields.every(f => f.type === 'checkbox')) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    else gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

    // Filter fields: respect showIf (checkbox) and showIfValue (header select / named field)
    const visibleFields = group.fields.filter(f => {
      if (f.showIf) return false; // handled separately via conditionalParents
      if (f.conditionalParent) return false;
      if (f.showIfChecked) return false; // handled separately after accordion
      if (f.showIfValue) {
        const fieldVal = f.showIfValue.field === group.headerSelect?.name
          ? headerSelectValue
          : formData[categoryId]?.[f.showIfValue.field];
        return f.showIfValue.matchesAny.includes(fieldVal);
      }
      return true;
    });

    const regularFields = visibleFields;
    const conditionalParents = group.fields.filter(f => f.conditionalParent);

    // Fields that appear conditionally based on accordion checkbox state
    const accordionConditionalFields = group.fields.filter(f => {
      if (!f.showIfChecked) return false;
      const accordionValues: Record<string, boolean> = formData[categoryId]?.['accordion_' + f.showIfChecked.accordionKey] || {};
      return f.showIfChecked.matchesAny.some(item => accordionValues[item]);
    });

    // Whether the header select value indicates "active" (any non-first option)
    const headerSelectActive = group.headerSelect
      ? headerSelectValue !== group.headerSelect.options[0]
      : true;

    return (
      <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-3">
        {/* Group header — with optional header select dropdown */}
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-700">{group.groupName}</h3>
          {group.headerSelect && (
            <select
              value={headerSelectValue}
              onChange={(e) => handleFieldChange(categoryId, group.headerSelect!.name, e.target.value)}
              className="text-xs px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary bg-white text-gray-700"
            >
              {group.headerSelect.options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          )}
        </div>

        {/* Conditional fields (shown when header select is not the default) */}
        {headerSelectActive && regularFields.length > 0 && (
          <div className={`grid gap-x-3 gap-y-2 ${gridClass}`}>
            {regularFields.map((field) => renderField(categoryId, field))}
          </div>
        )}

        {/* Checkbox conditional parents (existing logic) */}
        {conditionalParents.length > 0 && (
          <div className={`${regularFields.length > 0 ? 'mt-2 pt-2 border-t border-gray-100' : ''} flex flex-wrap gap-6`}>
            {conditionalParents.map((parent) => {
              const children = group.fields.filter(f => f.showIf === parent.name);
              const isChecked = !!formData[categoryId]?.[parent.name];
              return (
                <div key={parent.name} className="flex flex-col gap-2 min-w-[180px]">
                  {renderField(categoryId, parent)}
                  {isChecked && children.length > 0 && (
                    <div className="flex flex-col gap-2 pl-5 border-l-2 border-primary/30">
                      {children.map((child) => renderField(categoryId, child))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {group.accordions && group.accordions.length > 0 && (
          <div className={`${regularFields.length > 0 || conditionalParents.length > 0 ? 'mt-2 pt-2 border-t border-gray-100' : ''} flex flex-col gap-2`}>
            {group.accordions.map((accordion) => (
              <AccordionChecklist
                key={accordion.title}
                title={accordion.title}
                items={accordion.items}
                showCount={accordion.showCount !== false}
                values={formData[categoryId]?.['accordion_' + accordion.title] || {}}
                onChange={(item, checked) =>
                  handleFieldChange(categoryId, 'accordion_' + accordion.title, {
                    ...(formData[categoryId]?.['accordion_' + accordion.title] || {}),
                    [item]: checked,
                  })
                }
              />
            ))}
            {accordionConditionalFields.length > 0 && (
              <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap gap-x-3 gap-y-2">
                {accordionConditionalFields.map(f => renderField(categoryId, f))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const handleFieldChange = (categoryId: string, fieldName: string, value: any) => {
    setFormData((prev) => {
      const derived: Record<string, string> = {};
      if (fieldName === 'Admitting Service' && typeof value === 'string') {
        const mapping = ADMITTING_SERVICE_MAP[value];
        if (mapping) {
          derived['OEMST Category'] = mapping.oemst;
          derived['GQIP Category'] = mapping.gqip;
        }
      }
      return {
        ...prev,
        [categoryId]: { ...prev[categoryId], [fieldName]: value, ...derived },
      };
    });
  };

  const handleTabCompletedChange = (categoryId: string, isCompleted: boolean) => {
    setCompletedTabs((prev) => ({
      ...prev,
      [categoryId]: isCompleted,
    }));
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <PatientHeader patient={patient} onBackToList={onBackToList} />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Tabs.List className={`${navCollapsed ? 'w-12' : 'w-44'} bg-white border-r border-gray-200 flex-shrink-0 flex flex-col overflow-y-auto transition-all duration-200`}>
          <div className="flex flex-col py-2">
            {patientDataCategories.map((category) => {
              const Icon = categoryIcons[category.id] || FileText;
              return (
                <Tabs.Trigger
                  key={category.id}
                  value={category.id}
                  title={navCollapsed ? category.label : undefined}
                  className={`flex items-center gap-2 border-l-4 border-transparent hover:bg-gray-50 hover:text-primary data-[state=active]:bg-red-50 data-[state=active]:text-primary data-[state=active]:border-primary transition-colors text-left ${navCollapsed ? 'justify-center px-0 py-2' : 'px-4 py-2 text-xs font-medium text-gray-700'}`}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {!navCollapsed && <span className="flex-1 leading-tight text-xs font-medium">{category.label}</span>}
                </Tabs.Trigger>
              );
            })}

            {/* I.R.I.S. floating below last tab */}
            <div className={`pt-3 pb-1 ${navCollapsed ? 'px-1' : 'px-3'}`}>
              <button
                onClick={() => { setIrisFieldContext(undefined); setIrisHistoryThread(undefined); setIrisOpen(v => !v); setIrisKey(k => k + 1); }}
                title="I.R.I.S."
                className={`w-full flex items-center gap-2 rounded-lg border transition-colors ${navCollapsed ? 'justify-center px-0 py-2' : 'px-3 py-2'} ${
                  irisOpen && !irisFieldContext && !irisHistoryThread ? 'bg-teal-100 border-teal-300' : 'bg-teal-50 hover:bg-teal-100 border-teal-200'
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

            {/* Conversation history grouped by theme */}
            {!navCollapsed && (
              <div className="px-3 pb-3 flex flex-col gap-0.5">
                <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-widest px-1 pb-1">Recent</p>
                {PAST_THREADS.map(thread => (
                  <button
                    key={thread.id}
                    onClick={() => openHistoryThread(thread)}
                    className={`flex items-start gap-2 px-2 py-1.5 rounded text-left hover:bg-teal-50 transition-colors w-full ${
                      irisHistoryThread?.id === thread.id ? 'bg-teal-50' : ''
                    }`}
                  >
                    <MessageSquare size={10} className="text-teal-400 mt-0.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] font-medium text-teal-700 leading-tight truncate">{thread.theme}</p>
                      <p className="text-[9px] text-gray-400">{thread.date}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Tabs.List>

        {/* I.R.I.S. Panel */}
        {irisOpen && (
          <IRISChat
            key={irisKey}
            onClose={() => setIrisOpen(false)}
            fieldContext={irisFieldContext}
            historyThread={irisHistoryThread}
            navCollapsed={navCollapsed}
            onToggleNav={() => setNavCollapsed(v => !v)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 py-2">
            {patientDataCategories.map((category) => (
              <Tabs.Content key={category.id} value={category.id} className="outline-none">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">{category.label}</h2>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={completedTabs[category.id] || false}
                        onChange={(e) => handleTabCompletedChange(category.id, e.target.checked)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-2 focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">Completed</span>
                    </label>
                  </div>

                  {/* Custom layout for Process Improvement tab */}
                  {category.id === 'practitioners' ? (
                    (() => {
                      const activeId = activeSubTabs['practitioners'] || 'resusteam';
                      const subTabs = category.subTabs!;
                      return (
                        <div className="flex flex-col gap-4">
                          {/* Sub-tab navigation */}
                          <div className="flex gap-1 border-b border-gray-200">
                            {subTabs.map(st => {
                              const SubIcon = st.icon ? subTabIcons[st.icon] : null;
                              const isActive = activeId === st.id;
                              return (
                                <button key={st.id}
                                  onClick={() => setActiveSubTabs(prev => ({ ...prev, practitioners: st.id }))}
                                  className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${isActive ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                                  {SubIcon && <SubIcon size={13} />}
                                  {st.label}
                                </button>
                              );
                            })}
                          </div>
                          {/* Content */}
                          <div className="bg-white rounded-lg border border-gray-200 p-3">
                            {activeId === 'resusteam' && (
                              <PractitionerTable
                                firstColumnLabel="Trauma Provider Specialty"
                                firstColumnOptions={['Physician', 'PA (Physician Assistant)', 'NP (Nurse Practitioner)', 'Resident', 'Fellow', 'Medical Student', 'Other']}
                                maxRows={50}
                              />
                            )}
                            {activeId === 'inhouseconsults' && (
                              <PractitionerTable
                                firstColumnLabel="Consult Type"
                                firstColumnOptions={['Orthopedics', 'Neurosurgery', 'Cardiology', 'Pulmonology', 'Nephrology', 'Neurology', 'Plastics', 'Urology', 'Vascular Surgery', 'Other']}
                                maxRows={50}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })()
                  ) : category.id === 'demographic' ? (
                    renderDemographicTab()
                  ) : category.id === 'outcome' ? (
                    <>{category.groups?.map(group => renderGroup(category.id, group))}</>
                  ) : category.id === 'diagnosis' ? (
                    <>
                      <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1.5 border-b border-gray-200">Injury Diagnosis</h3>
                        <InjuryDiagnosisTable />
                      </div>
                      <div className="bg-white rounded-lg border border-gray-200 p-3">
                        <h3 className="text-base font-semibold text-gray-700 mb-2 pb-1.5 border-b border-gray-200">Injury Severity</h3>
                        {/* Summary score fields */}
                        <div className="flex flex-wrap gap-6 mb-4 pb-4 border-b border-gray-100">
                          {[
                            { label: 'Locally Calculated ISS', key: 'Locally Calculated ISS' },
                            { label: 'NISS', key: 'NISS' },
                            { label: 'TRISS', key: 'TRISS' },
                          ].map(({ label, key }) => (
                            <div key={key} className="flex flex-col gap-1 min-w-[140px]">
                              <div className="flex items-center gap-2">
                                <label className="text-xs font-medium text-gray-600">{label}</label>
                                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 border border-amber-200 leading-none">TBD</span>
                              </div>
                              <input
                                type="number"
                                className="w-24 px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                value={formData['diagnosis']?.[key] ?? ''}
                                onChange={e => handleFieldChange('diagnosis', key, e.target.value)}
                              />
                            </div>
                          ))}
                        </div>
                        <DiagnosisTable />
                      </div>
                    </>
                  ) : category.id === 'procedures' ? (
                    <div className="bg-white rounded-lg border border-gray-200 p-3 flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Operation Number</label>
                        <input
                          type="number"
                          min={1}
                          step={1}
                          className="w-28 px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          value={formData['procedures']?.['Operation Number'] ?? ''}
                          onChange={e => handleFieldChange('procedures', 'Operation Number', parseInt(e.target.value) || '')}
                        />
                      </div>
                      <ProcedureTable />
                    </div>
                  ) : category.subTabs ? (
                    // ── Sub-tab layout ──────────────────────────────────────
                    <div className="flex flex-col gap-4">
                      {/* Sub-tab navigation */}
                      <div className="flex gap-1 border-b border-gray-200 pb-0">
                        {category.subTabs.map((subTab) => {
                          const SubIcon = subTab.icon ? subTabIcons[subTab.icon] : null;
                          const isActive = (activeSubTabs[category.id] || category.subTabs![0].id) === subTab.id;
                          return (
                            <button
                              key={subTab.id}
                              onClick={() => setActiveSubTabs((prev) => ({ ...prev, [category.id]: subTab.id }))}
                              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-medium border-b-2 transition-colors -mb-px ${
                                isActive
                                  ? 'border-primary text-primary'
                                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                              }`}
                            >
                              {SubIcon && <SubIcon size={13} />}
                              {subTab.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Active sub-tab content */}
                      {(() => {
                        const activeId = activeSubTabs[category.id] || category.subTabs![0].id;
                        const activeSubTab = category.subTabs!.find((s) => s.id === activeId);
                        if (!activeSubTab) return null;
                        return (
                          <div className="flex flex-col gap-4">
                            {activeSubTab.groups.length === 0 && (
                              <div className="text-sm text-gray-400 italic text-center py-8">
                                No fields configured for this section yet.
                              </div>
                            )}
                            {activeSubTab.groups
                              .filter((group) => {
                                if (!group.visibleWhen) return true;
                                return group.visibleWhen.some((cond) =>
                                  cond.matchesAny.includes(formData[category.id]?.[cond.field] as string)
                                );
                              })
                              .map((group) => renderGroup(category.id, group))
                            }
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <>
                      {/* Render grouped fields */}
                      {category.groups && category.groups
                        .filter((group) => {
                          if (!group.visibleWhen) return true;
                          return group.visibleWhen.some((cond) =>
                            cond.matchesAny.includes(formData[category.id]?.[cond.field] as string)
                          );
                        })
                        .map((group) => renderGroup(category.id, group))
                      }

                      {/* Render ungrouped fields */}
                      {category.fields && (
                        <div className="bg-white rounded-lg border border-gray-200 p-3">
                          <div className={`grid gap-x-3 gap-y-2 ${
                            category.fields.every(f => f.type === 'checkbox')
                              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                          }`}>
                            {category.fields.map((field) => (
                              <FormField
                                key={field.name}
                                field={field}
                                value={formData[category.id]?.[field.name]}
                                onChange={(value) => handleFieldChange(category.id, field.name, value)}
                                aiData={field.aiEnabled ? aiFieldData[field.name] : undefined}
                                aiConfirmed={aiConfirmed[field.name]}
                                onAiConfirm={() => handleAiConfirm(field.name)}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Tabs.Content>
            ))}
          </div>
        </div>
      </Tabs.Root>

    </div>
  );
}

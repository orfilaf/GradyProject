import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { PatientHeader } from './PatientHeader';
import { FormField } from './FormField';
import { AccordionChecklist } from './AccordionChecklist';
import { AISourceModal } from './AISourceModal';
import { patientDataCategories } from '../data/patientFields';
import { aiFieldData } from '../data/aiMockData';
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
  ChartLine,
  Clock,
  MapPin,
  Building2,
  Route,
  Check,
  Info,
} from 'lucide-react';

const subTabIcons: Record<string, any> = {
  MapPin,
  Building2,
  Route,
};

const categoryIcons: Record<string, any> = {
  processimprovement: ChartLine,
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
};

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
  const [activeTab, setActiveTab] = useState('processimprovement');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedTabs, setCompletedTabs] = useState<Record<string, boolean>>({});
  const [caseSummary, setCaseSummary] = useState(
    '34-year-old male driver involved in high-speed motor vehicle accident with frontal impact, steering wheel deformation, and airbag deployment. Patient presented with severe chest pain (9/10) and respiratory distress following steering wheel impact. Initial assessment revealed seatbelt sign across chest and abdomen.\n\nImaging demonstrated multiple left-sided rib fractures (ribs 4-7) with associated pulmonary contusion and small left hemopneumothorax. No solid organ injury identified on CT scan.\n\nPatient managed with chest tube placement for hemopneumothorax with good clinical response. Pain control optimized with multimodal analgesia. Monitored in ICU for 48 hours with stable vital signs throughout. Patient discharged on hospital day 5 in good condition with outpatient trauma surgery follow-up scheduled in 2 weeks.'
  );
  const [aiConfirmed, setAiConfirmed] = useState<Record<string, boolean>>({});
  const [activeSubTabs, setActiveSubTabs] = useState<Record<string, string>>({});
  const [caseSummaryModalOpen, setCaseSummaryModalOpen] = useState(false);

  const handleAiConfirm = (fieldName: string) => {
    setAiConfirmed((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const renderField = (categoryId: string, field: import('../data/patientFields').FieldDefinition) => (
    <FormField
      key={field.name}
      field={field}
      value={formData[categoryId]?.[field.name]}
      onChange={(value) => handleFieldChange(categoryId, field.name, value)}
      aiData={field.aiEnabled ? aiFieldData[field.name] : undefined}
      aiConfirmed={aiConfirmed[field.name]}
      onAiConfirm={() => handleAiConfirm(field.name)}
    />
  );

  const renderGroup = (categoryId: string, group: import('../data/patientFields').FieldGroup) => {
    // Column layout — vertical fields per named column
    if (group.columns && group.columns.length > 0) {
      return (
        <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-4">
          <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
            {group.groupName}
          </h3>
          <div className="flex gap-6">
            {group.columns.map((col) => (
              <div key={col.columnName} className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 pb-1 border-b border-gray-100">
                  {col.columnName}
                </div>
                <div className="flex flex-col gap-3">
                  {col.fields.map((field) => renderField(categoryId, field))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Standard flat grid layout
    let gridClass = '';
    if (group.gridColumns === 3) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
    else if (group.compactLayout) gridClass = 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
    else if (group.fields.every(f => f.type === 'checkbox')) gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
    else gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

    const regularFields = group.fields.filter(f => !f.conditionalParent && !f.showIf);
    const conditionalParents = group.fields.filter(f => f.conditionalParent);

    return (
      <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
          {group.groupName}
        </h3>
        {regularFields.length > 0 && (
          <div className={`grid gap-x-4 gap-y-3 ${gridClass}`}>
            {regularFields.map((field) => renderField(categoryId, field))}
          </div>
        )}
        {conditionalParents.length > 0 && (
          <div className={`${regularFields.length > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''} flex flex-wrap gap-6`}>
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
          <div className={`${regularFields.length > 0 || conditionalParents.length > 0 ? 'mt-4 pt-4 border-t border-gray-100' : ''} flex flex-col gap-2`}>
            {group.accordions.map((accordion) => (
              <AccordionChecklist
                key={accordion.title}
                title={accordion.title}
                items={accordion.items}
                values={formData[categoryId]?.['accordion_' + accordion.title] || {}}
                onChange={(item, checked) =>
                  handleFieldChange(categoryId, 'accordion_' + accordion.title, {
                    ...(formData[categoryId]?.['accordion_' + accordion.title] || {}),
                    [item]: checked,
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Sample timeline data - will be replaced with actual patient visit history
  const timelineEvents = [
    {
      id: 1,
      timestamp: '2024-06-07 14:30',
      event: 'Patient Arrival',
      description: 'Patient arrived via ambulance with car accident injuries',
      user: 'EMS Team',
    },
    {
      id: 2,
      timestamp: '2024-06-07 14:35',
      event: 'Triage Assessment',
      description: 'Level 4 trauma activation. Initial vitals: BP 120/80, HR 95, SpO2 98%',
      user: 'Nurse Thompson',
    },
    {
      id: 3,
      timestamp: '2024-06-07 14:45',
      event: 'Trauma Team Activation',
      description: 'Trauma team assembled. Dr. Smith and Dr. Johnson assigned.',
      user: 'System',
    },
    {
      id: 4,
      timestamp: '2024-06-07 15:00',
      event: 'Initial Examination',
      description: 'Primary survey completed. Multiple contusions, possible rib fractures.',
      user: 'Dr. Smith',
    },
    {
      id: 5,
      timestamp: '2024-06-07 15:30',
      event: 'Imaging Ordered',
      description: 'CT scan of chest and abdomen ordered',
      user: 'Dr. Smith',
    },
    {
      id: 6,
      timestamp: '2024-06-07 16:15',
      event: 'Imaging Complete',
      description: 'CT results: 2 fractured ribs, no internal bleeding detected',
      user: 'Radiology',
    },
    {
      id: 7,
      timestamp: '2024-06-07 17:00',
      event: 'Treatment Plan',
      description: 'Pain management initiated. Observation for 24 hours.',
      user: 'Dr. Johnson',
    },
  ];

  const handleFieldChange = (categoryId: string, fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldName]: value,
      },
    }));
  };

  const handleTabCompletedChange = (categoryId: string, isCompleted: boolean) => {
    setCompletedTabs((prev) => ({
      ...prev,
      [categoryId]: isCompleted,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader patient={patient} onBackToList={onBackToList} />

      <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="flex">
        {/* Left Sidebar Navigation */}
        <Tabs.List className="w-56 bg-white border-r border-gray-200 min-h-screen flex-shrink-0">
          <div className="flex flex-col py-2">
            {patientDataCategories.map((category) => {
              const Icon = categoryIcons[category.id] || FileText;
              return (
                <Tabs.Trigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:text-primary data-[state=active]:bg-red-50 data-[state=active]:text-primary data-[state=active]:border-primary transition-colors text-left"
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="flex-1 leading-tight">{category.label}</span>
                </Tabs.Trigger>
              );
            })}
          </div>
        </Tabs.List>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto">
          <div className="px-6 py-4">
            {patientDataCategories.map((category) => (
              <Tabs.Content key={category.id} value={category.id} className="outline-none">
                <div className="space-y-4">
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
                  {category.id === 'processimprovement' ? (
                    <>
                      {/* Case Summary */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
                          <h3 className="text-base font-semibold text-gray-700">Case Summary</h3>
                          {aiFieldData['Case Summary'] && (
                            <div className="flex items-center gap-1">
                              {/* Confidence badge */}
                              <span className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border leading-none tracking-tight ${
                                aiFieldData['Case Summary'].confidence >= 95
                                  ? 'text-white bg-green-600 border-green-700 shadow-sm shadow-green-200'
                                  : 'text-white bg-red-600 border-red-700 shadow-sm shadow-red-200'
                              }`}>
                                {aiFieldData['Case Summary'].confidence}%
                              </span>
                              {/* Source info icon — opens modal */}
                              <button
                                type="button"
                                onClick={() => setCaseSummaryModalOpen((v) => !v)}
                                title="View AI sources"
                                className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${
                                  caseSummaryModalOpen
                                    ? 'bg-primary/10 text-primary'
                                    : 'text-gray-400 hover:text-primary hover:bg-primary/5'
                                }`}
                              >
                                <Info size={12} />
                              </button>
                              {/* Human-in-the-loop checkmark */}
                              <button
                                type="button"
                                onClick={() => handleAiConfirm('Case Summary')}
                                title={aiConfirmed['Case Summary'] ? 'Confirmed' : 'Confirm AI suggestion'}
                                className={`flex items-center justify-center w-5 h-5 rounded transition-colors ${
                                  aiConfirmed['Case Summary']
                                    ? 'bg-green-500 text-white'
                                    : 'border border-gray-300 text-gray-300 hover:border-green-500 hover:text-green-500'
                                }`}
                              >
                                <Check size={11} strokeWidth={aiConfirmed['Case Summary'] ? 3 : 2} />
                              </button>
                            </div>
                          )}
                        </div>
                        <textarea
                          value={caseSummary}
                          onChange={(e) => setCaseSummary(e.target.value)}
                          placeholder="AI-generated case summary will appear here. You can edit this text..."
                          className="w-full h-48 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                        />
                      </div>

                      {/* AI Source Modal for Case Summary — only shown when info icon clicked */}
                      {caseSummaryModalOpen && aiFieldData['Case Summary'] && (
                        <AISourceModal
                          onClose={() => setCaseSummaryModalOpen(false)}
                          fieldName="Case Summary"
                          aiData={aiFieldData['Case Summary']}
                        />
                      )}

                      {/* Timeline */}
                      <div className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                          Visit Timeline
                        </h3>
                        <div className="space-y-4">
                          {timelineEvents.map((event, index) => (
                            <div key={event.id} className="flex gap-4">
                              {/* Timeline line */}
                              <div className="flex flex-col items-center">
                                <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                                {index < timelineEvents.length - 1 && (
                                  <div className="w-0.5 h-full bg-gray-300 mt-1" />
                                )}
                              </div>

                              {/* Event content */}
                              <div className="flex-1 pb-6">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="text-sm font-semibold text-gray-900">{event.event}</h4>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{event.timestamp}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                                <p className="text-xs text-gray-500">by {event.user}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
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
                        <div className="bg-white rounded-lg border border-gray-200 p-4">
                          <div className={`grid gap-x-4 gap-y-3 ${
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

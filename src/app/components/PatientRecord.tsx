import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { PatientHeader } from './PatientHeader';
import { FormField } from './FormField';
import { patientDataCategories } from '../data/patientFields';
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
} from 'lucide-react';

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
}

export function PatientRecord({ patient }: PatientRecordProps) {
  const [activeTab, setActiveTab] = useState('demographic');
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleFieldChange = (categoryId: string, fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [fieldName]: value,
      },
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientHeader patient={patient} />

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
                  <h2 className="text-xl font-semibold text-gray-900">{category.label}</h2>

                  {/* Render grouped fields */}
                  {category.groups && category.groups.map((group) => {
                    // Determine grid columns based on group settings
                    let gridClass = '';
                    if (group.gridColumns === 3) {
                      gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
                    } else if (group.compactLayout) {
                      gridClass = 'grid-cols-1 md:grid-cols-3 lg:grid-cols-5';
                    } else if (group.fields.every(f => f.type === 'checkbox')) {
                      gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
                    } else {
                      gridClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
                    }

                    return (
                      <div key={group.groupName} className="bg-white rounded-lg border border-gray-200 p-4">
                        <h3 className="text-base font-semibold text-gray-700 mb-3 pb-2 border-b border-gray-200">
                          {group.groupName}
                        </h3>
                        <div className={`grid gap-x-4 gap-y-3 ${gridClass}`}>
                          {group.fields.map((field) => (
                            <FormField
                              key={field.name}
                              field={field}
                              value={formData[category.id]?.[field.name]}
                              onChange={(value) => handleFieldChange(category.id, field.name, value)}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}

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
                          />
                        ))}
                      </div>
                    </div>
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

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { PatientHeader } from './PatientHeader';
import { User } from 'lucide-react';

interface HubRecordProps {
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

export function HubRecord({ patient, onBackToList }: HubRecordProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});

  const s = (name: string, val: any) => setFormData(prev => ({ ...prev, [name]: val }));
  const v = (name: string) => String(formData[name] ?? '');

  const inp = 'px-2 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent bg-white';
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
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      <PatientHeader patient={patient} onBackToList={onBackToList} />

      <Tabs.Root defaultValue="demographic" className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Tabs.List className="w-44 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col overflow-y-auto">
          <div className="flex flex-col py-2">
            <Tabs.Trigger
              value="demographic"
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-700 border-l-4 border-transparent hover:bg-gray-50 hover:text-indigo-600 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600 data-[state=active]:border-indigo-500 transition-colors text-left"
            >
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 leading-tight text-xs font-medium">Demographic</span>
            </Tabs.Trigger>
          </div>
        </Tabs.List>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="px-4 py-2">
            <Tabs.Content value="demographic" className="outline-none">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Demographic</h2>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Patient IDs */}
                  <div className={card}>
                    <h3 className={hdr}>Patient IDs</h3>
                    <div className="flex gap-3 flex-wrap">
                      {fld('Medical Record Number', txt('Medical Record Number', 'w-40'))}
                      {fld('Georgia LongID Number', txt('Georgia LongID Number', 'w-40'))}
                    </div>
                  </div>

                  {/* Patient Visits */}
                  <div className={card}>
                    <h3 className={hdr}>Patient Visits</h3>
                    <div className="flex gap-3 flex-wrap">
                      {fld('Account Number', txt('Account Number', 'w-40'))}
                      {fld('Armband Number', txt('Armband Number', 'w-36'))}
                    </div>
                  </div>

                  {/* Personal Information */}
                  <div className={card}>
                    <h3 className={hdr}>Personal Information</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-3 flex-wrap items-end">
                        {fld('Last Name', txt('Last Name', 'w-36'))}
                        {fld('First Name', txt('First Name', 'w-36'))}
                        {fld('MI', txt('Middle Initial', 'w-12'))}
                        {fld('Date of Birth', <input type="date" className={`${inp} w-36`} value={v('Date of Birth')} onChange={e => s('Date of Birth', e.target.value)} />)}
                        {fld('Age', <input type="number" min={0} className={`${inp} w-16`} value={v('Age')} onChange={e => s('Age', e.target.value)} />)}
                        {fld('Age Units', sel('Age Units', 'w-28', ['Minutes', 'Hours', 'Days', 'Months', 'Years']))}
                        {fld('Social Security Number', txt('Social Security Number', 'w-36', 'XXX-XX-XXXX'))}
                      </div>
                      <div className="flex gap-3 flex-wrap items-end">
                        {fld('Sex Assigned at Birth', sel('Sex Assigned at Birth', 'w-36', ['Male', 'Female', 'Unknown', 'Not Reported']))}
                        {fld('Gender', sel('Gender', 'w-36', ['Male', 'Female', 'Non-binary', 'Transgender Male', 'Transgender Female', 'Other', 'Unknown']))}
                        <div className="flex flex-col gap-0.5">
                          <label className={lbl}>Gender-Affirming HRT</label>
                          <select value={formData['Gender-Affirming Hormone Therapy'] ?? ''} onChange={e => s('Gender-Affirming Hormone Therapy', e.target.value)} className={`${inp} w-36`}>
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

                  {/* Address */}
                  <div className={card}>
                    <h3 className={hdr}>Address</h3>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-3 flex-wrap">
                        {fld('Street 1', txt('Street 1', 'w-80'))}
                        {fld('Street 2', txt('Street 2', 'w-72'))}
                      </div>
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
              </div>
            </Tabs.Content>
          </div>
        </div>
      </Tabs.Root>
    </div>
  );
}

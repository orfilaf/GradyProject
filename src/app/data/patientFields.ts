// Patient data fields organized by category
// Based on patient-data-fields.csv
// All field names standardized to Title Case for professional EMR appearance

export interface FieldDefinition {
  name: string;
  type: 'text' | 'number' | 'date' | 'time' | 'datetime' | 'select' | 'textarea' | 'checkbox' | 'yesno';
  required?: boolean;
  colSpan?: number; // Number of columns to span (1-4)
  operatorAfter?: '+' | '=' | null; // Math operator to display after this field
  unit?: string; // Unit abbreviation to display (e.g., "cm", "kg", "°C")
  options?: string[]; // Named options for select fields
  showIf?: string; // Name of a checkbox field — only render when that field is checked
  conditionalParent?: boolean; // Marks a checkbox that owns conditional children; rendered in a special bottom row
  aiEnabled?: boolean; // Show AI confidence indicator for this field
}

export interface FieldGroupColumn {
  columnName: string;
  fields: FieldDefinition[];
}

export interface AccordionSection {
  title: string;
  items: string[]; // checkbox labels
}

export interface VisibleWhenCondition {
  field: string;       // field name to check
  matchesAny: string[]; // show group when field value is one of these
}

export interface FieldGroup {
  groupName: string;
  fields: FieldDefinition[];
  compactLayout?: boolean;
  gridColumns?: number;
  columns?: FieldGroupColumn[];
  accordions?: AccordionSection[];
  visibleWhen?: VisibleWhenCondition[]; // OR logic — show group if ANY condition is met
}

export interface SubTab {
  id: string;
  label: string;
  icon?: string; // lucide icon name
  groups: FieldGroup[];
}

export interface CategoryData {
  id: string;
  label: string;
  groups?: FieldGroup[];
  fields?: FieldDefinition[];
  subTabs?: SubTab[];
}

export const patientDataCategories: CategoryData[] = [
  // 0. Process Improvement - Custom Layout
  {
    id: 'processimprovement',
    label: 'Process Improvement',
    // Custom layout - will be handled separately in PatientRecord component
  },
  // 1. Demographic Information - WITH GROUPS
  {
    id: 'demographic',
    label: 'Demographic Information',
    groups: [
      {
        groupName: 'Patient IDs',
        fields: [
          { name: 'Medical Record Number', type: 'text' },
          { name: 'Georgia LongID Number', type: 'text' },
          { name: 'Account Number', type: 'text' },
          { name: 'Armband Number', type: 'text' },
        ],
      },
      {
        groupName: 'Personal Information',
        gridColumns: 3,
        fields: [
          { name: 'Date of Birth', type: 'date' },
          { name: 'Age', type: 'number' },
          { name: 'Age Units', type: 'select' },
          { name: 'Sex Assigned at Birth', type: 'select' },
          { name: 'Gender', type: 'select' },
          { name: 'Gender-Affirming Hormone Therapy', type: 'checkbox' },
          { name: 'Race', type: 'select' },
          { name: 'Ethnicity', type: 'select' },
          { name: 'Social Security Number', type: 'text' },
        ],
      },
      {
        groupName: 'Name',
        gridColumns: 3,
        fields: [
          { name: 'Last Name', type: 'text' },
          { name: 'First Name', type: 'text' },
          { name: 'Middle Initial', type: 'text' },
          { name: 'Alias Last Name', type: 'text' },
          { name: 'Alias First Name', type: 'text' },
          { name: 'Alias Middle Initial', type: 'text' },
        ],
      },
      {
        groupName: 'Address',
        compactLayout: true,
        fields: [
          { name: 'Street 1', type: 'text', colSpan: 2 },
          { name: 'Street 2', type: 'text', colSpan: 2 },
          { name: 'Patient\'s Home City', type: 'text' },
          { name: 'Patient\'s Home County', type: 'text' },
          { name: 'Patient\'s Home State', type: 'text' },
          { name: 'Patient\'s Home Zip/Postal Code', type: 'text' },
          { name: 'Patient\'s Home Country', type: 'text' },
          { name: 'Alternate Home Residence', type: 'text', colSpan: 2 },
        ],
      },
      {
        groupName: 'Financial',
        fields: [
          { name: 'Primary Method of Payment', type: 'select' },
        ],
      },
    ],
  },
  // 2. Injury Information - WITH GROUPS
  {
    id: 'injury',
    label: 'Injury Information',
    groups: [
      {
        groupName: 'External Cause Codes (ICD-10)',
        fields: [
          { name: 'Chief Complaint', type: 'textarea', colSpan: 2, aiEnabled: true },
          { name: 'ICD-10 Primary External Cause Code', type: 'text' },
          { name: 'ICD-10 Additional External Cause Code', type: 'text' },
          { name: 'ICD-10 Place of Occurrence External Cause Code', type: 'text' },
        ],
      },
      {
        groupName: 'Incident Details',
        fields: [
          { name: 'Injury Incident Date', type: 'date', aiEnabled: true },
          { name: 'Injury Incident Time', type: 'time', aiEnabled: true },
          { name: 'Trauma Type', type: 'select' },
          { name: 'Injury Type', type: 'select' },
          { name: 'Injury Intentionality', type: 'select' },
          { name: 'Vehicle Position', type: 'text' },
          { name: 'Casualty Type (# of people involved)', type: 'number', aiEnabled: true },
          { name: 'Work-Related', type: 'checkbox', conditionalParent: true, aiEnabled: true },
          { name: 'Patient\'s Occupation', type: 'text', showIf: 'Work-Related', aiEnabled: true },
          { name: 'Patient\'s Occupational Industry', type: 'text', showIf: 'Work-Related', aiEnabled: true },
          { name: 'Report of Physical Abuse', type: 'checkbox', conditionalParent: true },
          { name: 'Investigation of Physical Abuse', type: 'yesno', showIf: 'Report of Physical Abuse' },
          { name: 'Caregiver at Discharge', type: 'yesno', showIf: 'Report of Physical Abuse' },
        ],
      },
      {
        groupName: 'Incident Location',
        compactLayout: true,
        fields: [
          { name: 'Incident City', type: 'text', aiEnabled: true },
          { name: 'Incident County', type: 'text', aiEnabled: true },
          { name: 'Incident State', type: 'text', aiEnabled: true },
          { name: 'Zip/Postal Code', type: 'text', aiEnabled: true },
          { name: 'Incident Country', type: 'text', aiEnabled: true },
        ],
      },
      {
        groupName: 'Safety & Protective Equipment',
        fields: [
          { name: 'Airbag Deployment', type: 'select', aiEnabled: true },
          { name: 'Child Specific Restraint', type: 'select', aiEnabled: true },
          { name: 'Protective Devices', type: 'select', aiEnabled: true },
        ],
      },
    ],
  },
  // 3. Pre-Hospital Information - WITH SUB-TABS
  {
    id: 'prehospital',
    label: 'Pre-Hospital Information',
    subTabs: [
      {
        id: 'scene',
        label: 'Scene',
        icon: 'MapPin',
        groups: [
          {
            groupName: 'IDs',
            fields: [
              { name: 'State Trauma Number', type: 'number' },
              { name: 'Regional Trauma Number', type: 'number' },
              { name: 'Hospital System Trauma Number', type: 'number' },
            ],
          },
          {
            groupName: 'EMS',
            fields: [
              { name: 'EMS Patient Care Report UUID', type: 'text', aiEnabled: true },
              { name: 'EMS Service Name', type: 'text', aiEnabled: true },
              { name: 'EMS Type', type: 'select', aiEnabled: true },
              { name: 'EMS Role', type: 'select', aiEnabled: true },
              { name: 'Agency ID & Name', type: 'text', aiEnabled: true },
              { name: 'PCR Number (#)', type: 'text', aiEnabled: true },
              { name: 'Transport Mode', type: 'select', aiEnabled: true },
              { name: 'EMS Dispatch Date', type: 'date', aiEnabled: true },
              { name: 'EMS Dispatch Time', type: 'time', aiEnabled: true },
              { name: 'EMS Unit Arrival Date at Scene', type: 'date', aiEnabled: true },
              { name: 'EMS Unit Arrival Time at Scene', type: 'time', aiEnabled: true },
              { name: 'EMS Unit Departure Date from Scene', type: 'date', aiEnabled: true },
              { name: 'EMS Unit Departure Time from Scene', type: 'time', aiEnabled: true },
              { name: 'Scene Time Lapsed', type: 'number', unit: 'min', aiEnabled: true },
              { name: 'Transport Time Lapsed', type: 'number', unit: 'min', aiEnabled: true },
            ],
          },
          {
            groupName: 'Triage',
            fields: [
              { name: 'Trauma Center Criteria', type: 'select' },
              { name: 'National Field Triage 2021', type: 'select' },
              { name: 'National Field Triage Criteria', type: 'select' },
              { name: 'Vehicular, Pedestrian, Other Risk Injury', type: 'select' },
            ],
          },
          {
            groupName: 'Initial Field Vitals',
            fields: [],
            columns: [
              {
                columnName: 'Vitals',
                fields: [
                  { name: 'Initial Field Systolic Blood Pressure', type: 'number', unit: 'mmHg', aiEnabled: true },
                  { name: 'Initial Field Pulse Rate', type: 'number', unit: 'bpm', aiEnabled: true },
                  { name: 'Initial Field Respiratory Rate', type: 'number', unit: '/min', aiEnabled: true },
                  { name: 'Initial Field Oxygen Saturation', type: 'number', unit: '%', aiEnabled: true },
                ],
              },
              {
                columnName: 'Neurologic (GCS)',
                fields: [
                  { name: 'Initial Field GCS - Eye', type: 'number', operatorAfter: '+', aiEnabled: true },
                  { name: 'Initial Field GCS - Verbal', type: 'number', operatorAfter: '+', aiEnabled: true },
                  { name: 'Initial Field GCS - Motor', type: 'number', operatorAfter: '=', aiEnabled: true },
                  { name: 'Initial Field GCS - Total', type: 'number', aiEnabled: true },
                ],
              },
              {
                columnName: 'GCS 40',
                fields: [
                  { name: 'Initial Field GCS 40 - Eye', type: 'number', operatorAfter: '+', aiEnabled: true },
                  { name: 'Initial Field GCS 40 - Verbal', type: 'number', operatorAfter: '+', aiEnabled: true },
                  { name: 'Initial Field GCS 40 - Motor', type: 'number', aiEnabled: true },
                ],
              },
            ],
          },
          {
            groupName: 'Scene Treatment',
            fields: [
              { name: 'Intubation Prior to Arrival', type: 'checkbox' },
              { name: 'Intubation Location', type: 'select' },
              { name: 'Pre-Hospital Cardiac Arrest', type: 'checkbox' },
            ],
            accordions: [
              {
                title: 'Scene Procedures',
                items: [
                  'None',
                  'Airway opened or cleared',
                  'Airway-NPA',
                  'Airway-OPA',
                  'Arterial Line Maintenance',
                  'Bag Valve',
                  'Blind Insertion Airway Device',
                  'Blood Draw',
                  'Blood Glucose Analysis',
                  'Cardiac Monitor',
                  'Chest Tube',
                  'CPR-Automated Device',
                  'CPR-Manual',
                  'Cricothyrotomy-needle',
                  'Decontamination',
                  'Defibrillation',
                  'Endotracheal tube – Nasal',
                  'Endotracheal tube – Oral',
                  'Endotracheal tube route not recorded',
                  'Extrication',
                  'Intra-aortic balloon pump',
                  'Intraosseous access or infusion',
                  'Intravenous fluids',
                  'Nasogastric Tube',
                  'Needle thoracostomy – AAL placement',
                  'Needle thoracostomy – MCL placement',
                  'Needle thoracostomy – Unknown site',
                  'Pelvic binder',
                  'Physical restraint',
                  'Spinal restriction/Immobilization',
                  'Splinting',
                  'Tourniquet',
                  'Tracheostomy',
                  'Traction Splinting',
                  'Venous Access',
                  'Ventilator',
                  'Wound Care',
                  'N/A',
                  'Other',
                  'Unknown',
                ],
              },
              {
                title: 'Scene Medications',
                items: [
                  'None',
                  'Acetaminophen (Tylenol)',
                  'Albuterol (Airet, Proventil, Ventolin)',
                  'Amiodarone (Cordarone)',
                  'Antibiotics (Ampicillin, Ancef, Erythromycin, Gentamicin)',
                  'Aspirin',
                  'Atropine',
                  'Atrovent, Xopenex',
                  'Calcium Chloride',
                  'Calcium Gluconate',
                  'Crystalloid Solution',
                  'D10',
                  'D25',
                  'D50',
                  'D5 in Half Normal Saline',
                  'D5W',
                  'Diazepam (Valium)',
                  'Diltiazem (Cardizem)',
                  'Diphenhydramine (Benadryl)',
                  'Dopamine',
                  'Droperidol (Inapsine)',
                  'Epinephrine',
                  'Etomidate',
                  'Fentanyl',
                  'Furosemide',
                  'Glucagon',
                  'Haloperidol',
                  'Hydromorphone (Dilaudid)',
                  'Ibuprofen',
                  'Ketamine',
                  'Ketorolac (Toradol)',
                  'Labetalol',
                  'Lactated Ringers',
                  'Lidocaine',
                  'Lorazepam (Ativan)',
                  'Meperidine (Demerol)',
                  'Metoclopramide (Reglan)',
                  'Midazolam (Versed)',
                  'Morphine',
                  'Naloxone (Narcan)',
                  'Nitroglycerine',
                  'Norepinephrine',
                  'Normal Saline',
                  'Ondansetron (Zofran)',
                  'Oral Glucose',
                  'Oxygen',
                  'Packed Red Blood Cells – 1 unit',
                  'Packed Red Blood Cells – 2 units',
                  'Packed Red Blood Cells – 3 units',
                  'Packed Red Blood Cells – 4 units',
                  'Paralytics (Succinylcholine, Rocuronium, Vecuronium)',
                  'Plasma – 1 unit',
                  'Plasma – 2 units',
                  'Platelets',
                  'Promethazine (Phenergan)',
                  'Sodium Bicarbonate',
                  'Solumedrol',
                  'Tranexamic Acid (TXA)',
                  'Whole Blood – 1 unit',
                  'Whole Blood – 2 units',
                  'Whole Blood – 3 units',
                  'Whole Blood – 4 units (or more)',
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'referringfacility',
        label: 'Referring Facility',
        icon: 'Building2',
        groups: [
          {
            groupName: 'Admissions Information',
            fields: [
              { name: 'POV/Walk In', type: 'checkbox' },
              { name: 'Referring Facility', type: 'text' },
              { name: 'Admit Date', type: 'date' },
              { name: 'Admitting Time', type: 'time' },
              { name: 'Discharge Date', type: 'date' },
              { name: 'Discharge Time', type: 'time' },
              { name: 'Length of Stay', type: 'number', unit: 'days' },
              { name: 'Transfer Rationale', type: 'textarea', colSpan: 2 },
            ],
          },
          {
            groupName: 'Vitals',
            fields: [],
            columns: [
              {
                columnName: 'Vitals',
                fields: [
                  { name: 'Referring Systolic Blood Pressure', type: 'number', unit: 'mmHg', aiEnabled: true },
                  { name: 'Referring Diastolic Blood Pressure', type: 'number', unit: 'mmHg', aiEnabled: true },
                  { name: 'Referring Pulse Rate', type: 'number', unit: 'bpm', aiEnabled: true },
                  { name: 'Referring Unassisted Respiratory Rate', type: 'number', unit: '/min', aiEnabled: true },
                ],
              },
              {
                columnName: 'Neurologic (GCS)',
                fields: [
                  { name: 'Referring GCS - Eye', type: 'number', operatorAfter: '+', aiEnabled: true },
                  { name: 'Referring GCS - Verbal', type: 'number', operatorAfter: '+', aiEnabled: true },
                  { name: 'Referring GCS - Motor', type: 'number', operatorAfter: '=', aiEnabled: true },
                  { name: 'Referring GCS - Total', type: 'number', aiEnabled: true },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'interfacility',
        label: 'Inter-Facility Transport',
        icon: 'Route',
        groups: [
          {
            groupName: 'Patient Transport',
            fields: [
              { name: 'IFT Inter-Facility Transfer', type: 'yesno' },
              {
                name: 'IFT Other Transport Mode',
                type: 'select',
                options: [
                  'Helicopter Ambulance',
                  'Fixed-wing Ambulance',
                  'Grady Air',
                  'Private/Public Vehicle/Walk-In',
                  'Police',
                  'Other',
                  'Not Applicable',
                  'Unknown',
                ],
              },
              {
                name: 'IFT Inter-Facility Transport Mode',
                type: 'select',
                options: [
                  'Ground Ambulance',
                  'Helicopter Ambulance',
                  'Fixed-wing Ambulance',
                  'Grady Air',
                  'Private/Public Vehicle/Walk-In',
                  'Police',
                  'Other',
                  'Not Applicable',
                  'Unknown',
                ],
              },
            ],
          },
          {
            groupName: 'EMS',
            visibleWhen: [
              {
                field: 'IFT Inter-Facility Transport Mode',
                matchesAny: ['Ground Ambulance', 'Helicopter Ambulance', 'Fixed-wing Ambulance', 'Grady Air'],
              },
            ],
            fields: [
              { name: 'IFT EMS Patient Care Report UUID', type: 'text', aiEnabled: true },
              { name: 'IFT EMS Service Name', type: 'text', aiEnabled: true },
              { name: 'IFT EMS Type', type: 'select', aiEnabled: true },
              { name: 'IFT EMS Role', type: 'select', aiEnabled: true },
              { name: 'IFT Agency ID & Name', type: 'text', aiEnabled: true },
              { name: 'IFT PCR Number (#)', type: 'text', aiEnabled: true },
              { name: 'IFT Transport Mode', type: 'select', aiEnabled: true },
              { name: 'IFT EMS Dispatch Date', type: 'date', aiEnabled: true },
              { name: 'IFT EMS Dispatch Time', type: 'time', aiEnabled: true },
              { name: 'IFT EMS Unit Arrival Date at Scene', type: 'date', aiEnabled: true },
              { name: 'IFT EMS Unit Arrival Time at Scene', type: 'time', aiEnabled: true },
              { name: 'IFT EMS Unit Departure Date from Scene', type: 'date', aiEnabled: true },
              { name: 'IFT EMS Unit Departure Time from Scene', type: 'time', aiEnabled: true },
              { name: 'IFT Scene Time Lapsed', type: 'number', unit: 'min', aiEnabled: true },
              { name: 'IFT Transport Time Lapsed', type: 'number', unit: 'min', aiEnabled: true },
            ],
          },
          {
            groupName: 'Transport Vitals',
            visibleWhen: [
              {
                field: 'IFT Inter-Facility Transport Mode',
                matchesAny: ['Ground Ambulance', 'Helicopter Ambulance', 'Fixed-wing Ambulance', 'Grady Air'],
              },
            ],
            fields: [],
            columns: [
              {
                columnName: 'Vitals',
                fields: [
                  { name: 'Transport SBP', type: 'number', unit: 'mmHg', aiEnabled: true },
                  { name: 'Transport Pulse Rate', type: 'number', unit: 'bpm', aiEnabled: true },
                  { name: 'Transport Unassisted Resp Rate', type: 'number', unit: '/min', aiEnabled: true },
                  { name: 'Transport Assisted Resp Rate', type: 'number', unit: '/min', aiEnabled: true },
                  { name: 'Transport O2 Saturation', type: 'number', unit: '%', aiEnabled: true },
                  { name: 'Transport Supplemental O2', type: 'number', unit: 'L/min', aiEnabled: true },
                ],
              },
              {
                columnName: 'Neurologic (GCS)',
                fields: [
                  { name: 'Transport GCS Total', type: 'number', aiEnabled: true },
                ],
              },
            ],
          },
          {
            groupName: 'Transport Treatment',
            visibleWhen: [
              {
                field: 'IFT Inter-Facility Transport Mode',
                matchesAny: ['Ground Ambulance', 'Helicopter Ambulance', 'Fixed-wing Ambulance', 'Grady Air'],
              },
            ],
            fields: [],
            accordions: [
              {
                title: 'Transport Procedures',
                items: [
                  'None',
                  'Airway opened or cleared',
                  'Airway-NPA',
                  'Airway-OPA',
                  'Arterial Line Maintenance',
                  'Bag Valve',
                  'Blind Insertion Airway Device',
                  'Blood Draw',
                  'Blood Glucose Analysis',
                  'Cardiac Monitor',
                  'Chest Tube',
                  'CPR-Automated Device',
                  'CPR-Manual',
                  'Cricothyrotomy-needle',
                  'Decontamination',
                  'Defibrillation',
                  'Endotracheal tube – Nasal',
                  'Endotracheal tube – Oral',
                  'Endotracheal tube route not recorded',
                  'Extrication',
                  'Intra-aortic balloon pump',
                  'Intraosseous access or infusion',
                  'Intravenous fluids',
                  'Nasogastric Tube',
                  'Needle thoracostomy – AAL placement',
                  'Needle thoracostomy – MCL placement',
                  'Needle thoracostomy – Unknown site',
                  'Pelvic binder',
                  'Physical restraint',
                  'Spinal restriction/Immobilization',
                  'Splinting',
                  'Tourniquet',
                  'Tracheostomy',
                  'Traction Splinting',
                  'Venous Access',
                  'Ventilator',
                  'Wound Care',
                  'N/A',
                  'Other',
                  'Unknown',
                ],
              },
              {
                title: 'Transport Medications',
                items: [
                  'None',
                  'Acetaminophen (Tylenol)',
                  'Albuterol (Airet, Proventil, Ventolin)',
                  'Amiodarone (Cordarone)',
                  'Antibiotics (Ampicillin, Ancef, Erythromycin, Gentamicin)',
                  'Aspirin',
                  'Atropine',
                  'Atrovent, Xopenex',
                  'Calcium Chloride',
                  'Calcium Gluconate',
                  'Crystalloid Solution',
                  'D10',
                  'D25',
                  'D50',
                  'D5 in Half Normal Saline',
                  'D5W',
                  'Diazepam (Valium)',
                  'Diltiazem (Cardizem)',
                  'Diphenhydramine (Benadryl)',
                  'Dopamine',
                  'Droperidol (Inapsine)',
                  'Epinephrine',
                  'Etomidate',
                  'Fentanyl',
                  'Furosemide',
                  'Glucagon',
                  'Haloperidol',
                  'Hydromorphone (Dilaudid)',
                  'Ibuprofen',
                  'Ketamine',
                  'Ketorolac (Toradol)',
                  'Labetalol',
                  'Lactated Ringers',
                  'Lidocaine',
                  'Lorazepam (Ativan)',
                  'Meperidine (Demerol)',
                  'Metoclopramide (Reglan)',
                  'Midazolam (Versed)',
                  'Morphine',
                  'Naloxone (Narcan)',
                  'Nitroglycerine',
                  'Norepinephrine',
                  'Normal Saline',
                  'Ondansetron (Zofran)',
                  'Oral Glucose',
                  'Oxygen',
                  'Packed Red Blood Cells – 1 unit',
                  'Packed Red Blood Cells – 2 units',
                  'Packed Red Blood Cells – 3 units',
                  'Packed Red Blood Cells – 4 units',
                  'Paralytics (Succinylcholine, Rocuronium, Vecuronium)',
                  'Plasma – 1 unit',
                  'Plasma – 2 units',
                  'Platelets',
                  'Promethazine (Phenergan)',
                  'Sodium Bicarbonate',
                  'Solumedrol',
                  'Tranexamic Acid (TXA)',
                  'Whole Blood – 1 unit',
                  'Whole Blood – 2 units',
                  'Whole Blood – 3 units',
                  'Whole Blood – 4 units (or more)',
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  // 4. Emergency Department Information - WITH GROUPS
  {
    id: 'emergency',
    label: 'Emergency Department Information',
    groups: [
      {
        groupName: 'Arrival Information',
        fields: [
          { name: 'ED/Hospital Arrival Date', type: 'date' },
          { name: 'ED/Hospital Arrival Time', type: 'time' },
          { name: 'Mode of Arrival', type: 'select' },
          { name: 'Signs of Life', type: 'checkbox' },
        ],
      },
      {
        groupName: 'Initial ED/Hospital Vitals',
        fields: [
          { name: 'Initial ED/Hospital GCS - Eyes', type: 'number', operatorAfter: '+' },
          { name: 'Initial ED/Hospital GCS - Motor', type: 'number', operatorAfter: '+' },
          { name: 'Initial ED/Hospital GCS - Verbal', type: 'number', operatorAfter: '=' },
          { name: 'Initial ED/Hospital GCS - Total', type: 'number' },
          { name: 'Initial ED/Hospital Oxygen Saturation', type: 'number' },
          { name: 'Initial ED/Hospital Pulse Rate', type: 'number' },
          { name: 'Initial ED/Hospital Respiratory Rate', type: 'number' },
          { name: 'Initial ED/Hospital Systolic Blood Pressure', type: 'number' },
          { name: 'Diastolic Blood Pressure', type: 'number' },
          { name: 'Lowest ED/Hospital Systolic Blood Pressure', type: 'number' },
          { name: 'Initial ED/Hospital Temperature', type: 'number', unit: '°C' },
        ],
      },
      {
        groupName: 'Physical Measurements',
        fields: [
          { name: 'Initial ED/Hospital Height', type: 'number', unit: 'cm' },
          { name: 'Initial ED/Hospital Weight', type: 'number', unit: 'kg' },
        ],
      },
      {
        groupName: 'Screenings',
        fields: [
          { name: 'Alcohol Screen', type: 'checkbox' },
          { name: 'Alcohol Screen Results', type: 'text' },
          { name: 'Drug Screen', type: 'checkbox' },
          { name: 'Drug Use Indicator', type: 'text' },
        ],
      },
      {
        groupName: 'Trauma Response',
        fields: [
          { name: 'Highest Activation', type: 'select' },
          { name: 'Primary Trauma Service Type', type: 'select' },
          { name: 'Trauma Surgeon Arrival Date', type: 'date' },
          { name: 'Trauma Surgeon Arrival Time', type: 'time' },
        ],
      },
      {
        groupName: 'Admission & Discharge',
        fields: [
          { name: 'Primary Medical Event', type: 'select' },
          { name: 'Admitting Service', type: 'text' },
          { name: 'ED Discharge Date', type: 'date' },
          { name: 'ED Discharge Time', type: 'time' },
          { name: 'ED Discharge Disposition', type: 'select' },
        ],
      },
    ],
  },
  // 5. Hospital Procedure Information
  {
    id: 'procedures',
    label: 'Hospital Procedure Information',
    fields: [
      { name: 'Hospital Procedures Start Date', type: 'date' },
      { name: 'Hospital Procedures Start Time', type: 'time' },
      { name: 'ICD-10 Hospital Procedures', type: 'textarea', colSpan: 2 },
      { name: 'Procedure Location Code & Description', type: 'text' },
    ],
  },
  // 6. Pre-Existing Conditions
  {
    id: 'preexisting',
    label: 'Pre-Existing Conditions',
    fields: [
      { name: 'Advance Directive Limiting Care', type: 'checkbox' },
      { name: 'Alcohol Use Disorder', type: 'checkbox' },
      { name: 'Anticoagulant Therapy', type: 'checkbox' },
      { name: 'ADD/ADHD', type: 'checkbox' },
      { name: 'Autism Spectrum Disorder (ASD)', type: 'checkbox' },
      { name: 'Bipolar I/II Disorder', type: 'checkbox' },
      { name: 'Bleeding Disorder', type: 'checkbox' },
      { name: 'Cerebral Vascular Accident (CVA)', type: 'checkbox' },
      { name: 'COPD', type: 'checkbox' },
      { name: 'Chronic Renal Failure', type: 'checkbox' },
      { name: 'Cirrhosis', type: 'checkbox' },
      { name: 'Congenital Anomalies', type: 'checkbox' },
      { name: 'Congestive Heart Failure (CHF)', type: 'checkbox' },
      { name: 'Current Smoker', type: 'checkbox' },
      { name: 'Currently Receiving Chemotherapy for Cancer', type: 'checkbox' },
      { name: 'Dementia', type: 'checkbox' },
      { name: 'Diabetes Mellitus', type: 'checkbox' },
      { name: 'Disseminated Cancer', type: 'checkbox' },
      { name: 'Functionally Dependent Health Status', type: 'checkbox' },
      { name: 'Hypertension', type: 'checkbox' },
      { name: 'Major Depressive Disorder', type: 'checkbox' },
      { name: 'Myocardial Infarction (MI)', type: 'checkbox' },
      { name: 'Peripheral Arterial Disease (PAD)', type: 'checkbox' },
      { name: 'PTSD', type: 'checkbox' },
      { name: 'Pregnancy', type: 'checkbox' },
      { name: 'Prematurity', type: 'checkbox' },
      { name: 'Schizophrenia', type: 'checkbox' },
      { name: 'Steroid Use', type: 'checkbox' },
      { name: 'Substance Use Disorder', type: 'checkbox' },
      { name: 'Ventilator Dependence', type: 'checkbox' },
    ],
  },
  // 7. Diagnosis Information
  {
    id: 'diagnosis',
    label: 'Diagnosis Information',
    fields: [
      { name: 'AIS Code', type: 'text' },
      { name: 'AIS Version', type: 'text' },
      { name: 'ICD-10 Injury Diagnoses', type: 'textarea', colSpan: 2 },
      { name: 'Comorbid Conditions', type: 'textarea', colSpan: 2 },
      { name: 'AIS Predot Code', type: 'text' },
      { name: 'AIS Severity', type: 'select' },
      { name: 'ISS Body Region', type: 'text' },
      { name: 'Locally Calculated ISS', type: 'number' },
      { name: 'NISS', type: 'number' },
      { name: 'TRISS', type: 'number' },
    ],
  },
  // 8. Hospital Events
  {
    id: 'hospitalevents',
    label: 'Hospital Events',
    fields: [
      { name: 'Acute Kidney Injury (AKI)', type: 'checkbox' },
      { name: 'Acute Respiratory Distress Syndrome (ARDS)', type: 'checkbox' },
      { name: 'Alcohol Withdrawal Syndrome', type: 'checkbox' },
      { name: 'Cardiac Arrest with CPR', type: 'checkbox' },
      { name: 'Catheter-Associated Urinary Tract Infection (CAUTI)', type: 'checkbox' },
      { name: 'Central Line-Associated Bloodstream Infection (CLABSI)', type: 'checkbox' },
      { name: 'Deep Surgical Site Infection', type: 'checkbox' },
      { name: 'Deep Vein Thrombosis (DVT)', type: 'checkbox' },
      { name: 'Delirium', type: 'checkbox' },
      { name: 'Organ/Space Surgical Site Infection', type: 'checkbox' },
      { name: 'Osteomyelitis', type: 'checkbox' },
      { name: 'Pressure Ulcer', type: 'checkbox' },
      { name: 'Pulmonary Embolism (PE)', type: 'checkbox' },
      { name: 'Severe Sepsis', type: 'checkbox' },
      { name: 'Stroke/CVA', type: 'checkbox' },
      { name: 'Superficial Incisional Surgical Site Infection', type: 'checkbox' },
      { name: 'Unplanned Admission to the ICU', type: 'checkbox' },
      { name: 'Unplanned Intubation', type: 'checkbox' },
      { name: 'Unplanned Return to the Operating Room', type: 'checkbox' },
      { name: 'Ventilator-Associated Pneumonia (VAP)', type: 'checkbox' },
    ],
  },
  // 9. Outcome Information
  {
    id: 'outcome',
    label: 'Outcome Information',
    fields: [
      { name: 'Hospital Discharge Date', type: 'date' },
      { name: 'Hospital Discharge Disposition', type: 'select' },
      { name: 'Hospital Discharge Time', type: 'time' },
      { name: 'Total ICU Length of Stay', type: 'number' },
      { name: 'Total Ventilator Days', type: 'number' },
      { name: 'Total Days in Hospital', type: 'number' },
      { name: 'Discharge Status', type: 'select' },
      { name: 'If Death: Circumstances of Death', type: 'textarea', colSpan: 2 },
      { name: 'If Death: Location', type: 'text' },
      { name: 'If Death: Was Autopsy Performed?', type: 'checkbox' },
      { name: 'Was Organ Donation Request Granted?', type: 'checkbox' },
    ],
  },
  // 10. TQIP Measures for Processes of Care
  {
    id: 'tqip',
    label: 'TQIP Measures for Processes of Care',
    fields: [
      { name: 'Angiography', type: 'checkbox' },
      { name: 'Angiography Date', type: 'date' },
      { name: 'Angiography Time', type: 'time' },
      { name: 'Antibiotic Therapy', type: 'checkbox' },
      { name: 'Antibiotic Therapy Date', type: 'date' },
      { name: 'Antibiotic Therapy Time', type: 'time' },
      { name: 'Cerebral Monitor', type: 'checkbox' },
      { name: 'Cerebral Monitor Date', type: 'date' },
      { name: 'Cerebral Monitor Time', type: 'time' },
      { name: 'Cryoprecipitate', type: 'text' },
      { name: 'Packed Red Blood Cells', type: 'text' },
      { name: 'Plasma', type: 'text' },
      { name: 'Platelets', type: 'text' },
      { name: 'Whole Blood', type: 'text' },
      { name: 'Surgery for Hemorrhage Control Date', type: 'date' },
      { name: 'Surgery for Hemorrhage Control Time', type: 'time' },
      { name: 'Surgery for Hemorrhage Control Type', type: 'text' },
      { name: 'Venous Thromboembolism Prophylaxis Date', type: 'date' },
      { name: 'Venous Thromboembolism Prophylaxis Time', type: 'time' },
      { name: 'Venous Thromboembolism Prophylaxis Type', type: 'text' },
    ],
  },
  // 11. Practitioners
  {
    id: 'practitioners',
    label: 'Practitioners',
    fields: [
      { name: 'Attending Physician', type: 'text' },
      { name: 'Trauma Surgeon', type: 'text' },
      { name: 'Consulting Physician', type: 'text' },
      { name: 'Primary Nurse', type: 'text' },
      { name: 'Case Manager', type: 'text' },
    ],
  },
];

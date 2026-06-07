// Patient data fields organized by category
// Based on patient-data-fields.csv
// All field names standardized to Title Case for professional EMR appearance

export interface FieldDefinition {
  name: string;
  type: 'text' | 'number' | 'date' | 'time' | 'datetime' | 'select' | 'textarea' | 'checkbox';
  required?: boolean;
  colSpan?: number; // Number of columns to span (1-4)
  operatorAfter?: '+' | '=' | null; // Math operator to display after this field
  unit?: string; // Unit abbreviation to display (e.g., "cm", "kg", "°C")
}

export interface FieldGroup {
  groupName: string;
  fields: FieldDefinition[];
  compactLayout?: boolean; // For fitting more columns in one row
  gridColumns?: number; // Custom number of columns (1-5)
}

export interface CategoryData {
  id: string;
  label: string;
  groups?: FieldGroup[];
  fields?: FieldDefinition[];
}

export const patientDataCategories: CategoryData[] = [
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
        ],
      },
      {
        groupName: 'Address',
        compactLayout: true,
        fields: [
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
          { name: 'ICD-10 Primary External Cause Code', type: 'text' },
          { name: 'ICD-10 Additional External Cause Code', type: 'text' },
          { name: 'ICD-10 Place of Occurrence External Cause Code', type: 'text' },
        ],
      },
      {
        groupName: 'Incident Details',
        fields: [
          { name: 'Injury Incident Time', type: 'time' },
          { name: 'Trauma Type', type: 'select' },
          { name: 'Injury Type', type: 'select' },
          { name: 'Injury Intentionality', type: 'select' },
          { name: 'Chief Complaint', type: 'textarea', colSpan: 2 },
        ],
      },
      {
        groupName: 'Incident Location',
        compactLayout: true,
        fields: [
          { name: 'Incident City', type: 'text' },
          { name: 'Incident County', type: 'text' },
          { name: 'Incident State', type: 'text' },
          { name: 'Zip/Postal Code', type: 'text' },
          { name: 'Incident Country', type: 'text' },
        ],
      },
      {
        groupName: 'Safety & Protective Equipment',
        fields: [
          { name: 'Airbag Deployment', type: 'checkbox' },
          { name: 'Child Specific Restraint', type: 'select' },
          { name: 'Protective Devices', type: 'select' },
        ],
      },
      {
        groupName: 'Occupational Information',
        fields: [
          { name: 'Patient\'s Occupation', type: 'text' },
          { name: 'Patient\'s Occupational Industry', type: 'text' },
          { name: 'Work-Related', type: 'checkbox' },
        ],
      },
    ],
  },
  // 3. Pre-Hospital Information - WITH GROUPS
  {
    id: 'prehospital',
    label: 'Pre-Hospital Information',
    groups: [
      {
        groupName: 'EMS Information',
        fields: [
          { name: 'EMS Patient Care Report UUID', type: 'text' },
          { name: 'EMS Service Name', type: 'text' },
          { name: 'EMS Type', type: 'select' },
          { name: 'EMS Role', type: 'select' },
        ],
      },
      {
        groupName: 'Transport Information',
        fields: [
          { name: 'Transport Mode', type: 'select' },
          { name: 'Inter-Facility Transfer', type: 'checkbox' },
        ],
      },
      {
        groupName: 'Timeline',
        fields: [
          { name: 'EMS Dispatch Date', type: 'date' },
          { name: 'EMS Dispatch Time', type: 'time' },
          { name: 'EMS Unit Arrival Date at Scene', type: 'date' },
          { name: 'EMS Unit Arrival Time at Scene', type: 'time' },
          { name: 'EMS Unit Departure Date from Scene', type: 'date' },
          { name: 'EMS Unit Departure Time from Scene', type: 'time' },
        ],
      },
      {
        groupName: 'Initial Field Vitals',
        fields: [
          { name: 'Initial Field GCS - Eye', type: 'number', operatorAfter: '+' },
          { name: 'Initial Field GCS - Motor', type: 'number', operatorAfter: '+' },
          { name: 'Initial Field GCS - Verbal', type: 'number', operatorAfter: '=' },
          { name: 'Initial Field GCS - Total', type: 'number' },
          { name: 'Initial Field Oxygen Saturation', type: 'number' },
          { name: 'Initial Field Pulse Rate', type: 'number' },
          { name: 'Initial Field Respiratory Rate', type: 'number' },
          { name: 'Initial Field Systolic Blood Pressure', type: 'number' },
        ],
      },
      {
        groupName: 'Pre-Hospital Interventions',
        fields: [
          { name: 'Intubation Prior to Arrival', type: 'checkbox' },
          { name: 'Intubation Location', type: 'select' },
          { name: 'Pre-Hospital Cardiac Arrest', type: 'checkbox' },
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

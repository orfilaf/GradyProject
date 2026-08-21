export type FlagStatus = 'green' | 'amber' | 'red';

export interface GuidelineFlag {
  label: string;
  status: FlagStatus;
}

export interface GuidelineCategory {
  name: string;
  flags: GuidelineFlag[];
}

export interface Guideline {
  id: string;
  acronym: string;
  name: string;
  categories: GuidelineCategory[];
}

export function getWorstStatus(guideline: Guideline): FlagStatus {
  const all = guideline.categories.flatMap(c => c.flags);
  if (all.some(f => f.status === 'red')) return 'red';
  if (all.some(f => f.status === 'amber')) return 'amber';
  return 'green';
}

export function getAlertCounts(guideline: Guideline): { amber: number; red: number; green: number } {
  const all = guideline.categories.flatMap(c => c.flags);
  return {
    red: all.filter(f => f.status === 'red').length,
    amber: all.filter(f => f.status === 'amber').length,
    green: all.filter(f => f.status === 'green').length,
  };
}

export const mockGuidelines: Guideline[] = [
  {
    id: 'tbi',
    acronym: 'TBI',
    name: 'Traumatic Brain Injury',
    categories: [
      {
        name: 'Neurologic Monitoring',
        flags: [
          { label: 'Neurochecks Hourly', status: 'green' },
          { label: 'GCS Stable', status: 'green' },
          { label: 'Motor Exam Stable', status: 'green' },
          { label: 'Pupils Reactive', status: 'green' },
        ],
      },
      {
        name: 'Imaging & Neurosurgery',
        flags: [
          { label: 'Neurosurgery Consulted', status: 'green' },
          { label: 'Repeat CT Pending', status: 'amber' },
          { label: 'Repeat CT Overdue', status: 'red' },
        ],
      },
      {
        name: 'Hemodynamics & Oxygenation',
        flags: [
          { label: 'SBP ≥ 110 mmHg', status: 'green' },
          { label: 'MAP ≥ 80 mmHg', status: 'green' },
          { label: 'SpO₂ ≥ 95%', status: 'green' },
        ],
      },
      {
        name: 'Coagulopathy',
        flags: [
          { label: 'Anticoagulation', status: 'amber' },
          { label: 'TEG', status: 'red' },
          { label: 'Reversal', status: 'green' },
        ],
      },
    ],
  },
  {
    id: 'geriatric',
    acronym: 'Geriatric',
    name: 'Geriatric Trauma',
    categories: [
      {
        name: 'Frailty & Functional Status',
        flags: [
          { label: 'Frailty Score Documented', status: 'amber' },
          { label: 'Pre-Injury Functional Status', status: 'green' },
          { label: 'Fall Risk Assessment', status: 'green' },
        ],
      },
      {
        name: 'Medication Safety',
        flags: [
          { label: 'Anticoagulant Review', status: 'red' },
          { label: 'Polypharmacy Screen', status: 'amber' },
          { label: 'Renal Dose Adjustment', status: 'green' },
        ],
      },
      {
        name: 'Cognitive & Social',
        flags: [
          { label: 'Delirium Screening (CAM)', status: 'amber' },
          { label: 'Social Work Consult', status: 'green' },
        ],
      },
    ],
  },
  {
    id: 'vat',
    acronym: 'VAT',
    name: 'Vascular Access Trauma',
    categories: [
      {
        name: 'Vascular Assessment',
        flags: [
          { label: 'Distal Pulses Documented', status: 'green' },
          { label: 'ABI Measured', status: 'amber' },
          { label: 'Vascular Surgery Consulted', status: 'green' },
        ],
      },
      {
        name: 'Imaging',
        flags: [
          { label: 'CT Angiography Completed', status: 'green' },
          { label: 'Duplex Ultrasound Ordered', status: 'amber' },
        ],
      },
    ],
  },
  {
    id: 'aki',
    acronym: 'AKI',
    name: 'Acute Kidney Injury',
    categories: [
      {
        name: 'Renal Function Monitoring',
        flags: [
          { label: 'Creatinine Trending', status: 'red' },
          { label: 'BUN Elevated', status: 'red' },
          { label: 'Urine Output ≥ 0.5 mL/kg/hr', status: 'amber' },
        ],
      },
      {
        name: 'Fluid & Medication Management',
        flags: [
          { label: 'IV Fluids Optimized', status: 'green' },
          { label: 'Nephrotoxins Avoided', status: 'green' },
          { label: 'Nephrology Consulted', status: 'amber' },
          { label: 'Contrast Avoided', status: 'green' },
        ],
      },
    ],
  },
  {
    id: 'efast',
    acronym: 'eFAST',
    name: 'Extended FAST',
    categories: [
      {
        name: 'Exam Completion',
        flags: [
          { label: 'eFAST Performed on Arrival', status: 'green' },
          { label: 'Pericardial View Documented', status: 'green' },
          { label: 'Pleural Views Documented', status: 'green' },
          { label: 'Attending Sign-off', status: 'green' },
        ],
      },
      {
        name: 'Follow-up Imaging',
        flags: [
          { label: 'Repeat eFAST if Indicated', status: 'green' },
          { label: 'CT Correlation Documented', status: 'green' },
        ],
      },
    ],
  },
  {
    id: 'bluntcardiac',
    acronym: 'Blunt Cardiac',
    name: 'Blunt Cardiac Injury',
    categories: [
      {
        name: 'Cardiac Monitoring',
        flags: [
          { label: 'Continuous ECG Monitoring', status: 'green' },
          { label: 'Troponin × 2 Drawn', status: 'amber' },
          { label: 'Echo Ordered', status: 'amber' },
        ],
      },
      {
        name: 'Arrhythmia Management',
        flags: [
          { label: 'New Arrhythmia Documented', status: 'red' },
          { label: 'Cardiology Consulted', status: 'green' },
        ],
      },
    ],
  },
  {
    id: 'bcvi',
    acronym: 'Blunt Cerebro.',
    name: 'Blunt Cerebrovascular Injury',
    categories: [
      {
        name: 'Screening',
        flags: [
          { label: 'Denver Criteria Screened', status: 'green' },
          { label: 'CT Angiography Neck', status: 'green' },
          { label: 'BCVI Grade Documented', status: 'amber' },
        ],
      },
      {
        name: 'Treatment',
        flags: [
          { label: 'Anticoagulation Initiated', status: 'red' },
          { label: 'Neurosurgery Notified', status: 'green' },
          { label: 'Repeat Imaging Scheduled', status: 'amber' },
        ],
      },
    ],
  },
  {
    id: 'pregnancy',
    acronym: 'Pregnancy',
    name: 'Pregnancy Trauma',
    categories: [
      {
        name: 'Fetal Monitoring',
        flags: [
          { label: 'Fetal Heart Tones Checked', status: 'green' },
          { label: 'Continuous CTG Monitoring', status: 'green' },
          { label: 'OB/GYN Consulted', status: 'green' },
        ],
      },
      {
        name: 'Maternal Assessment',
        flags: [
          { label: 'Kleihauer-Betke Test', status: 'amber' },
          { label: 'Rh Status Documented', status: 'green' },
          { label: 'RhoGAM if Indicated', status: 'amber' },
        ],
      },
    ],
  },
  {
    id: 'sci',
    acronym: 'Spinal Cord',
    name: 'Spinal Cord Injury',
    categories: [
      {
        name: 'Spinal Precautions',
        flags: [
          { label: 'C-Collar Applied', status: 'green' },
          { label: 'Log Roll Precautions Active', status: 'green' },
          { label: 'Spinal Clearance Ordered', status: 'amber' },
        ],
      },
      {
        name: 'Neurological Assessment',
        flags: [
          { label: 'ASIA Score Documented', status: 'red' },
          { label: 'Neurosurgery Consulted', status: 'green' },
          { label: 'Baseline Motor Exam', status: 'amber' },
        ],
      },
    ],
  },
  {
    id: 'reboa',
    acronym: 'REBOA',
    name: 'Resuscitative Endovascular Balloon Occlusion',
    categories: [
      {
        name: 'Device Management',
        flags: [
          { label: 'Zone Placement Confirmed', status: 'green' },
          { label: 'Inflation Time Documented', status: 'green' },
          { label: 'Deflation Protocol Followed', status: 'green' },
        ],
      },
      {
        name: 'Post-Procedure Monitoring',
        flags: [
          { label: 'Distal Limb Perfusion Checked', status: 'amber' },
          { label: 'Access Site Assessed', status: 'green' },
          { label: 'Vascular Surgery Notified', status: 'green' },
        ],
      },
    ],
  },
];

// Full pool of all available guidelines (active + inactive stubs)
export const ALL_GUIDELINES: { id: string; acronym: string; name: string }[] = [
  ...mockGuidelines.map(g => ({ id: g.id, acronym: g.acronym, name: g.name })),
  { id: 'hemorrhage', acronym: 'MTP', name: 'Massive Transfusion Protocol' },
  { id: 'burns', acronym: 'Burns', name: 'Burns Management' },
  { id: 'pelvis', acronym: 'Pelvis', name: 'Pelvic Ring Injury' },
  { id: 'txa', acronym: 'TXA', name: 'Tranexamic Acid Administration' },
  { id: 'airways', acronym: 'Airways', name: 'Difficult Airway Management' },
  { id: 'hypothermia', acronym: 'Hypothermia', name: 'Trauma Hypothermia' },
  { id: 'coagulopathy', acronym: 'Coagulopathy', name: 'Trauma-Induced Coagulopathy' },
  { id: 'crush', acronym: 'Crush', name: 'Crush Injury / Compartment Syndrome' },
  { id: 'drowning', acronym: 'Drowning', name: 'Submersion Injury' },
  { id: 'pediatric', acronym: 'Pediatric', name: 'Pediatric Trauma' },
  { id: 'openchest', acronym: 'Open Chest', name: 'Open Chest Wound' },
  { id: 'aorta', acronym: 'Aortic', name: 'Blunt Aortic Injury' },
  { id: 'rib', acronym: 'Rib Fx', name: 'Rib Fracture Protocol' },
  { id: 'hemothorax', acronym: 'Hemothorax', name: 'Retained Hemothorax' },
  { id: 'pneumothorax', acronym: 'PTX', name: 'Tension Pneumothorax' },
  { id: 'dvt', acronym: 'DVT', name: 'DVT Prophylaxis' },
  { id: 'sepsis', acronym: 'Sepsis', name: 'Trauma-Related Sepsis' },
  { id: 'uti', acronym: 'CAUTI', name: 'Catheter-Associated UTI Prevention' },
  { id: 'vap', acronym: 'VAP', name: 'Ventilator-Associated Pneumonia' },
  { id: 'pressure', acronym: 'Pressure', name: 'Pressure Injury Prevention' },
  { id: 'falls', acronym: 'Falls', name: 'In-Hospital Falls Prevention' },
  { id: 'delirium', acronym: 'Delirium', name: 'ICU Delirium Protocol' },
  { id: 'pain', acronym: 'Pain', name: 'Acute Pain Management' },
  { id: 'alcohol', acronym: 'EtOH', name: 'Alcohol Withdrawal Protocol' },
  { id: 'opioid', acronym: 'Opioid', name: 'Opioid Stewardship' },
  { id: 'nutrition', acronym: 'Nutrition', name: 'Early Enteral Nutrition' },
  { id: 'glucose', acronym: 'Glucose', name: 'Glycemic Control' },
  { id: 'transfusion', acronym: 'Transfusion', name: 'Blood Transfusion Threshold' },
  { id: 'foley', acronym: 'Foley', name: 'Foley Catheter Removal' },
  { id: 'vent', acronym: 'Vent Wean', name: 'Ventilator Weaning' },
  { id: 'trach', acronym: 'Trach', name: 'Tracheostomy Timing' },
  { id: 'rehab', acronym: 'Rehab', name: 'Early Mobilization / Rehab' },
  { id: 'discharge', acronym: 'Discharge', name: 'Discharge Planning' },
  { id: 'social', acronym: 'Social', name: 'Social Work / Substance Use' },
  { id: 'mentalhealth', acronym: 'Mental Health', name: 'Trauma Mental Health Screening' },
  { id: 'domestic', acronym: 'IPV', name: 'Intimate Partner Violence Screening' },
  { id: 'seatbelt', acronym: 'Seatbelt', name: 'Seatbelt Sign Protocol' },
  { id: 'extremity', acronym: 'Extremity', name: 'Open Extremity Fracture' },
  { id: 'amputation', acronym: 'Amputation', name: 'Traumatic Amputation' },
  { id: 'ocular', acronym: 'Ocular', name: 'Ocular Trauma' },
  { id: 'facial', acronym: 'Facial', name: 'Facial Fracture Protocol' },
  { id: 'dental', acronym: 'Dental', name: 'Dental Trauma' },
  { id: 'ear', acronym: 'Ear', name: 'Auricular / Temporal Bone Trauma' },
];

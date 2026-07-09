export interface AISource {
  name: string;
  date: string;
  confidence: number;
  extract: string;
}

export interface AIFieldData {
  confidence: number;
  sources: AISource[];
}

export const aiFieldData: Record<string, AIFieldData> = {
  'Chief Complaint': {
    confidence: 97,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 97,
        extract: '"Patient is a 34-year-old male involved in a high-speed MVA. Chief complaint is severe chest pain and shortness of breath following steering wheel impact."',
      },
      {
        name: 'ED Triage Note',
        date: '2024-06-07',
        confidence: 94,
        extract: '"Pt presents via EMS c/o chest pain 9/10, SOB, diaphoresis. States he was the driver in a motor vehicle collision at approx 65mph."',
      },
    ],
  },
  'Injury Incident Date': {
    confidence: 99,
    sources: [
      {
        name: 'EMS Dispatch Log',
        date: '2024-06-07',
        confidence: 99,
        extract: '"Call received 2024-06-07 at 14:22. Unit dispatched to MVA scene at Peachtree Rd & 10th St NW."',
      },
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 98,
        extract: '"Incident date: June 7, 2024. Scene arrival time: 14:31."',
      },
    ],
  },
  'Injury Incident Time': {
    confidence: 96,
    sources: [
      {
        name: 'EMS Dispatch Log',
        date: '2024-06-07',
        confidence: 99,
        extract: '"911 call received at 14:22. Estimated time of incident: approximately 14:18 based on witness statements."',
      },
      {
        name: 'Police Incident Report #ATL-2024-061407',
        date: '2024-06-07',
        confidence: 93,
        extract: '"Officers arrived on scene at 14:35. Witness reported collision occurred approximately 15 minutes prior to police arrival."',
      },
    ],
  },
  'Work-Related': {
    confidence: 72,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 72,
        extract: '"Patient states he was driving to a client meeting at time of incident. Vehicle is a company fleet vehicle registered to Acme Corp."',
      },
    ],
  },
  "Patient's Occupation": {
    confidence: 88,
    sources: [
      {
        name: 'Patient Registration Form',
        date: '2024-06-07',
        confidence: 91,
        extract: '"Occupation: Sales Manager. Employer: Acme Corporation. Employment status: Full-time."',
      },
      {
        name: 'ED Intake Interview',
        date: '2024-06-07',
        confidence: 85,
        extract: '"Patient identified himself as a sales manager traveling for work at time of collision."',
      },
    ],
  },
  "Patient's Occupational Industry": {
    confidence: 83,
    sources: [
      {
        name: 'Patient Registration Form',
        date: '2024-06-07',
        confidence: 83,
        extract: '"Employer: Acme Corporation. Industry: Manufacturing / B2B Sales."',
      },
    ],
  },
  'Casualty Type (# of people involved)': {
    confidence: 91,
    sources: [
      {
        name: 'Police Incident Report #ATL-2024-061407',
        date: '2024-06-07',
        confidence: 95,
        extract: '"Two-vehicle collision. Vehicle 1: 1 occupant (this patient). Vehicle 2: 2 occupants, both ambulatory at scene. Total involved: 3 persons."',
      },
      {
        name: 'EMS Dispatch Log',
        date: '2024-06-07',
        confidence: 88,
        extract: '"Multiple casualty incident. 1 priority transport, 2 refused transport."',
      },
    ],
  },
  'Incident City': {
    confidence: 98,
    sources: [
      {
        name: 'EMS Dispatch Log',
        date: '2024-06-07',
        confidence: 99,
        extract: '"Incident location: Peachtree Rd NW & 10th St NW, Atlanta, GA."',
      },
      {
        name: 'Police Incident Report #ATL-2024-061407',
        date: '2024-06-07',
        confidence: 98,
        extract: '"Location of incident: Peachtree Road NW at intersection with 10th Street NW, City of Atlanta."',
      },
    ],
  },
  'Incident County': {
    confidence: 98,
    sources: [
      {
        name: 'Police Incident Report #ATL-2024-061407',
        date: '2024-06-07',
        confidence: 98,
        extract: '"Jurisdiction: City of Atlanta, Fulton County, Georgia."',
      },
    ],
  },
  'Incident State': {
    confidence: 99,
    sources: [
      {
        name: 'EMS Dispatch Log',
        date: '2024-06-07',
        confidence: 99,
        extract: '"Unit: Atlanta Fire Rescue / Grady EMS. State: Georgia."',
      },
    ],
  },
  'Zip/Postal Code': {
    confidence: 94,
    sources: [
      {
        name: 'EMS Dispatch Log',
        date: '2024-06-07',
        confidence: 94,
        extract: '"Scene address: Peachtree Rd NW & 10th St NW, Atlanta, GA 30309."',
      },
    ],
  },
  'Incident Country': {
    confidence: 99,
    sources: [
      {
        name: 'EMS Dispatch Log',
        date: '2024-06-07',
        confidence: 99,
        extract: '"Country of incident: United States of America."',
      },
    ],
  },
  'Airbag Deployment': {
    confidence: 78,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 82,
        extract: '"On arrival, front driver-side airbag was deployed. Steering wheel deformation noted. No side curtain airbag deployment visible."',
      },
      {
        name: 'Police Incident Report #ATL-2024-061407',
        date: '2024-06-07',
        confidence: 74,
        extract: '"Vehicle 1 airbag deployment observed. Specific type not documented at scene."',
      },
    ],
  },
  'Child Specific Restraint': {
    confidence: 62,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 62,
        extract: '"No child occupants noted in vehicle. Child restraint status not applicable per EMS assessment."',
      },
    ],
  },
  'Protective Devices': {
    confidence: 85,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 89,
        extract: '"Patient was restrained with seatbelt (lap and shoulder). Seatbelt sign noted across chest and abdomen."',
      },
      {
        name: 'Police Incident Report #ATL-2024-061407',
        date: '2024-06-07',
        confidence: 81,
        extract: '"Driver was wearing seatbelt at time of collision per officer observation."',
      },
    ],
  },
  'EMS Patient Care Report UUID': {
    confidence: 99,
    sources: [
      { name: 'EMS Dispatch Log', date: '2024-06-07', confidence: 99, extract: '"PCR UUID: 8f3a2c1d-4e5b-47f9-a012-3c6d8e9f1b2a. Assigned automatically at time of call receipt."' },
    ],
  },
  'EMS Service Name': {
    confidence: 98,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 98, extract: '"Responding agency: Grady EMS / Atlanta Fire Rescue. Unit designation: Medic 21."' },
    ],
  },
  'EMS Type': {
    confidence: 95,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 95, extract: '"Unit type: Advanced Life Support (ALS). Crew certification level: Paramedic."' },
    ],
  },
  'EMS Role': {
    confidence: 93,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 93, extract: '"EMS role: Primary transport unit. Patient contact made at scene, transported directly to Grady Memorial Hospital."' },
    ],
  },
  'Agency ID & Name': {
    confidence: 97,
    sources: [
      { name: 'EMS Dispatch Log', date: '2024-06-07', confidence: 97, extract: '"Agency ID: GA-ATL-0042. Agency Name: Atlanta Fire Rescue / Grady EMS."' },
    ],
  },
  'PCR Number (#)': {
    confidence: 99,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 99, extract: '"PCR Number: 2024-ATL-061407-021. Generated at time of call dispatch."' },
    ],
  },
  'Transport Mode': {
    confidence: 98,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 98, extract: '"Transport mode: Ground ambulance. No air transport requested or required."' },
    ],
  },
  'EMS Dispatch Date': {
    confidence: 99,
    sources: [
      { name: 'EMS Dispatch Log', date: '2024-06-07', confidence: 99, extract: '"Dispatch date: 2024-06-07. Call received at PSAP at 14:22."' },
    ],
  },
  'EMS Dispatch Time': {
    confidence: 99,
    sources: [
      { name: 'EMS Dispatch Log', date: '2024-06-07', confidence: 99, extract: '"Unit dispatched at 14:23:41. Time to dispatch from call receipt: 1 min 41 sec."' },
    ],
  },
  'EMS Unit Arrival Date at Scene': {
    confidence: 99,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 99, extract: '"Scene arrival date: 2024-06-07. Unit on scene at 14:31."' },
    ],
  },
  'EMS Unit Arrival Time at Scene': {
    confidence: 99,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 99, extract: '"Scene arrival time: 14:31. Response time from dispatch: 7 minutes 19 seconds."' },
    ],
  },
  'EMS Unit Departure Date from Scene': {
    confidence: 98,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 98, extract: '"Scene departure date: 2024-06-07. Unit departed scene at 14:49."' },
    ],
  },
  'EMS Unit Departure Time from Scene': {
    confidence: 98,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 98, extract: '"Scene departure time: 14:49. Scene time: 18 minutes."' },
      { name: 'EMS Dispatch Log', date: '2024-06-07', confidence: 97, extract: '"Unit clear from scene: 14:49:12."' },
    ],
  },
  'Scene Time Lapsed': {
    confidence: 96,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 96, extract: '"Scene time calculated: 18 minutes (arrival 14:31 to departure 14:49). Within target for ALS trauma response."' },
    ],
  },
  'Transport Time Lapsed': {
    confidence: 95,
    sources: [
      { name: 'EMS Patient Care Report', date: '2024-06-07', confidence: 95, extract: '"Transport time: 12 minutes (scene departure 14:49 to hospital arrival 15:01). Destination: Grady Memorial Hospital ED."' },
    ],
  },
  'Referring Systolic Blood Pressure': {
    confidence: 91,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 91, extract: '"Vitals on transfer: BP 124/82 mmHg. Hemodynamically stable at time of transfer."' },
    ],
  },
  'Referring Diastolic Blood Pressure': {
    confidence: 89,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 89, extract: '"BP documented as 124/82 mmHg. Diastolic within normal range."' },
    ],
  },
  'Referring Pulse Rate': {
    confidence: 90,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 90, extract: '"Pulse: 98 bpm at time of transfer. Slightly elevated, attributed to pain."' },
    ],
  },
  'Referring Unassisted Respiratory Rate': {
    confidence: 87,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 87, extract: '"Respiratory rate: 18/min unassisted. No supplemental oxygen required at transfer."' },
    ],
  },
  'Referring GCS - Eye': {
    confidence: 96,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 96, extract: '"GCS at transfer — Eye: 4. Patient opens eyes spontaneously."' },
    ],
  },
  'Referring GCS - Verbal': {
    confidence: 95,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 95, extract: '"GCS Verbal: 5. Patient oriented and conversational."' },
    ],
  },
  'Referring GCS - Motor': {
    confidence: 96,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 96, extract: '"GCS Motor: 6. Follows commands, moves all extremities."' },
    ],
  },
  'Referring GCS - Total': {
    confidence: 96,
    sources: [
      { name: 'Referring Facility Transfer Summary', date: '2024-06-07', confidence: 96, extract: '"Total GCS: 15 (E4V5M6). Alert and oriented x4 at time of transfer."' },
    ],
  },
  'Initial Field Systolic Blood Pressure': {
    confidence: 96,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 96,
        extract: '"Vitals on scene — BP: 118/76 mmHg. Systolic blood pressure within normal limits at time of initial assessment."',
      },
    ],
  },
  'Initial Field Pulse Rate': {
    confidence: 95,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 95,
        extract: '"Pulse: 102 bpm, regular rhythm. Slightly elevated, consistent with pain and sympathetic response post-MVA."',
      },
    ],
  },
  'Initial Field Respiratory Rate': {
    confidence: 91,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 91,
        extract: '"Respiratory rate: 22 breaths/min. Mildly tachypneic. Breath sounds equal bilaterally."',
      },
    ],
  },
  'Initial Field Oxygen Saturation': {
    confidence: 97,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 97,
        extract: '"SpO2: 96% on room air. Maintained throughout transport without supplemental oxygen."',
      },
    ],
  },
  'Initial Field GCS - Eye': {
    confidence: 98,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 98,
        extract: '"GCS Eye: 4 — Patient opens eyes spontaneously upon approach."',
      },
    ],
  },
  'Initial Field GCS - Verbal': {
    confidence: 97,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 97,
        extract: '"GCS Verbal: 5 — Patient is oriented, answers questions appropriately regarding name, date, and event."',
      },
    ],
  },
  'Initial Field GCS - Motor': {
    confidence: 98,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 98,
        extract: '"GCS Motor: 6 — Patient follows commands bilaterally. Moves all extremities purposefully."',
      },
    ],
  },
  'Initial Field GCS - Total': {
    confidence: 98,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 98,
        extract: '"Total GCS: 15 (E4V5M6). Patient is alert and oriented x4. No loss of consciousness reported."',
      },
    ],
  },
  'Initial Field GCS 40 - Eye': {
    confidence: 82,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 82,
        extract: '"GCS-40 Eye component documented as 10. Assessment performed per pediatric-adjusted scale."',
      },
    ],
  },
  'Initial Field GCS 40 - Verbal': {
    confidence: 80,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 80,
        extract: '"GCS-40 Verbal component: 15. Patient verbally responsive and appropriate."',
      },
    ],
  },
  'Initial Field GCS 40 - Motor': {
    confidence: 81,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 81,
        extract: '"GCS-40 Motor component: 10. Normal purposeful movement observed."',
      },
    ],
  },
  'Unplanned - Reason': {
    confidence: 87,
    sources: [
      {
        name: 'Discharge Summary',
        date: '2024-06-12',
        confidence: 89,
        extract: '"Patient returned to ED 7 days post-discharge with worsening shortness of breath. Re-evaluation revealed re-accumulation of left hemothorax requiring repeat chest tube placement."',
      },
      {
        name: 'ED Readmission Note',
        date: '2024-06-12',
        confidence: 85,
        extract: '"Unplanned readmission secondary to recurrent hemothorax following chest tube removal. Patient denied any new trauma or fall."',
      },
    ],
  },
  'Memo': {
    confidence: 91,
    sources: [
      {
        name: 'Discharge Summary',
        date: '2024-06-12',
        confidence: 92,
        extract: '"Patient readmitted for management of recurrent left hemothorax. Chest tube reinserted with 400cc sanguineous output. Hematology consulted. Patient stabilized and discharged after 3 days."',
      },
      {
        name: 'Nursing Progress Notes',
        date: '2024-06-13',
        confidence: 90,
        extract: '"Patient tolerated repeat chest tube procedure well. Drain output decreasing. Vitals stable. Pain managed with oral analgesics."',
      },
    ],
  },
  'Case Summary': {
    confidence: 94,
    sources: [
      {
        name: 'EMS Patient Care Report',
        date: '2024-06-07',
        confidence: 96,
        extract: '"34-year-old male driver in high-speed MVA with frontal impact, steering wheel deformation, and airbag deployment. Patient presented with chest pain and respiratory distress."',
      },
      {
        name: 'ED Triage Note',
        date: '2024-06-07',
        confidence: 95,
        extract: '"Patient involved in motor vehicle collision at approximately 65mph. Sustained blunt chest trauma with chest wall tenderness and dyspnea. Initial assessment reveals seatbelt sign across chest and abdomen."',
      },
      {
        name: 'CT Imaging Report',
        date: '2024-06-07',
        confidence: 92,
        extract: '"Imaging demonstrates multiple left-sided rib fractures (ribs 4-7) with associated pulmonary contusion. Small left hemopneumothorax identified. No solid organ injury."',
      },
      {
        name: 'Trauma Surgery Consult Note',
        date: '2024-06-07',
        confidence: 94,
        extract: '"Patient managed with chest tube placement for hemopneumothorax. Pain control optimized. Monitored in ICU for 48 hours with stable vital signs. Discharged on hospital day 5 with outpatient follow-up scheduled."',
      },
    ],
  },
};

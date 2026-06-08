import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PatientRecord } from './components/PatientRecord';
import { PatientList } from './components/PatientList';

export default function App() {
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handlePatientSelect = (patient: any) => {
    // Convert patient list data to patient record format
    const patientData = {
      mrn: patient.mrn,
      name: patient.name,
      age: 45, // TODO: Calculate from actual data
      gender: 'Male', // TODO: Get from actual data
      dob: '1979-03-15', // TODO: Get from actual data
      address: '123 Peachtree St NE, Atlanta, GA 30303', // TODO: Get from actual data
      phone: '(404) 555-0123', // TODO: Get from actual data
    };
    setSelectedPatient(patientData);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  return (
    <div className="size-full flex flex-col">
      <Navigation onBackToList={selectedPatient ? handleBackToList : undefined} />
      <div className="flex-1 overflow-auto">
        {selectedPatient ? (
          <PatientRecord patient={selectedPatient} onBackToList={handleBackToList} />
        ) : (
          <PatientList onPatientSelect={handlePatientSelect} />
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { PatientRecord } from './components/PatientRecord';
import { PatientList } from './components/PatientList';
import { PIPatientList } from './components/PIPatientList';
import { PIPatientRecord } from './components/PIPatientRecord';

type Module = 'registry' | 'pi';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('registry');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handlePatientSelect = (patient: any) => {
    const patientData = {
      mrn: patient.mrn,
      name: patient.name,
      age: 45,
      gender: 'Male',
      dob: '1979-03-15',
      address: '123 Peachtree St NE, Atlanta, GA 30303',
      phone: '(404) 555-0123',
    };
    setSelectedPatient(patientData);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  const handleModuleSwitch = (module: Module) => {
    setActiveModule(module);
    // patient selection persists — same patient opens in the new module
  };

  return (
    <div className="size-full flex flex-col">
      <Navigation
        activeModule={activeModule}
        onModuleSwitch={handleModuleSwitch}
        onBackToList={selectedPatient ? handleBackToList : undefined}
      />
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeModule === 'registry' ? (
          selectedPatient ? (
            <PatientRecord patient={selectedPatient} onBackToList={handleBackToList} />
          ) : (
            <PatientList onPatientSelect={handlePatientSelect} />
          )
        ) : (
          selectedPatient ? (
            <PIPatientRecord patient={selectedPatient} onBackToList={handleBackToList} />
          ) : (
            <PIPatientList onPatientSelect={handlePatientSelect} />
          )
        )}
      </div>
    </div>
  );
}

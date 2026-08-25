import { useState } from 'react';
import { Navigation, Module } from './components/Navigation';
import { PatientRecord } from './components/PatientRecord';
import { PatientList } from './components/PatientList';
import { PIPatientList } from './components/PIPatientList';
import { PIPatientRecord } from './components/PIPatientRecord';
import { HubRecord } from './components/HubRecord';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('hub');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [piInitialView, setPiInitialView] = useState<'timeline' | 'guidelines'>('guidelines');

  const handlePatientSelect = (patient: any, tab?: 'timeline' | 'guidelines') => {
    const patientData = {
      mrn: patient.mrn,
      name: patient.name,
      age: 45,
      gender: 'Male',
      dob: '1979-03-15',
      address: '123 Peachtree St NE, Atlanta, GA 30303',
      phone: '(404) 555-0123',
    };
    setPiInitialView(tab ?? 'guidelines');
    setSelectedPatient(patientData);
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
  };

  const handleModuleSwitch = (module: Module) => {
    setActiveModule(module);
  };

  return (
    <div className="size-full flex flex-col">
      <Navigation
        activeModule={activeModule}
        onModuleSwitch={handleModuleSwitch}
        onBackToList={selectedPatient ? handleBackToList : undefined}
      />
      <div className="flex-1 overflow-y-auto flex flex-col">
        {activeModule === 'hub' ? (
          selectedPatient ? (
            <HubRecord patient={selectedPatient} onBackToList={handleBackToList} />
          ) : (
            <PatientList onPatientSelect={handlePatientSelect} />
          )
        ) : activeModule === 'registry' ? (
          selectedPatient ? (
            <PatientRecord patient={selectedPatient} onBackToList={handleBackToList} />
          ) : (
            <PatientList onPatientSelect={handlePatientSelect} showDashboard />
          )
        ) : (
          selectedPatient ? (
            <PIPatientRecord
              patient={selectedPatient}
              onBackToList={handleBackToList}
              initialView={piInitialView === 'guidelines' ? { type: 'guidelines-htabs', activeId: 'overview' } : { type: 'timeline3' }}
            />
          ) : (
            <PIPatientList onPatientSelect={handlePatientSelect} />
          )
        )}
      </div>
    </div>
  );
}

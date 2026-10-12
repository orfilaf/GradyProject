import { useState } from 'react';
import { Navigation, Module } from './components/Navigation';
import { PatientRecord } from './components/PatientRecord';
import { PatientList } from './components/PatientList';
import { PIPatientList } from './components/PIPatientList';
import { PIPatientRecord } from './components/PIPatientRecord';
import { HubRecord } from './components/HubRecord';
import { HubRecordB } from './components/HubRecordB';

type HubVariant = 'original' | 'B';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('hub');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [piInitialView, setPiInitialView] = useState<'timeline' | 'guidelines'>('guidelines');
  const [hubVariant, setHubVariant] = useState<HubVariant>('B');

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
            hubVariant === 'B'
              ? <HubRecordB patient={selectedPatient} onBackToList={handleBackToList} />
              : <HubRecord patient={selectedPatient} onBackToList={handleBackToList} />
          ) : (
            <div className="flex flex-col flex-1">
              <div className="flex items-center gap-2 px-6 py-2 border-b border-gray-100 bg-white">
                <span className="text-xs font-semibold text-gray-400 mr-2">Hub View:</span>
                {(['original', 'B'] as HubVariant[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setHubVariant(v)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${hubVariant === v ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                  >
                    {v === 'original' ? 'Original' : 'Option B — Left Nav Rail'}
                  </button>
                ))}
              </div>
              <PatientList onPatientSelect={handlePatientSelect} />
            </div>
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

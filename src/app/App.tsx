import { useState } from 'react';
import { Navigation, Module } from './components/Navigation';
import { PatientRecord } from './components/PatientRecord';
import { PatientList } from './components/PatientList';
import { PIPatientList } from './components/PIPatientList';
import { PIPatientRecord } from './components/PIPatientRecord';
import { HubRecordB } from './components/HubRecordB';
import { RegistrySubNav, RegistrySection } from './components/RegistrySubNav';
import { RegistrySubmissions } from './components/RegistrySubmissions';
import { RegistryReports } from './components/RegistryReports';
import { RegistryDictionary } from './components/RegistryDictionary';
import { RegistryAdmin } from './components/RegistryAdmin';
import { PISubNav, PISection } from './components/PISubNav';
import { PIPSSection } from './components/PIPSSection';
import { PIDashboard } from './components/PIDashboard';
import { PIReports } from './components/PIReports';
import { PIGuidelinesSection } from './components/PIGuidelinesSection';
import { SectionPlaceholder } from './components/SectionPlaceholder';
import { HubCommandCenter } from './components/HubCommandCenter';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('hub');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [piInitialView, setPiInitialView] = useState<'timeline' | 'guidelines'>('guidelines');
  const [registrySection, setRegistrySection] = useState<RegistrySection>('home');
  const [piSection, setPiSection] = useState<PISection>('home');

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

  const handleRegistrySection = (section: RegistrySection) => {
    setRegistrySection(section);
    if (section !== 'home' && section !== 'cases') setSelectedPatient(null);
  };

  const handlePISection = (section: PISection) => {
    setPiSection(section);
    if (section !== 'home' && section !== 'pips') setSelectedPatient(null);
  };

  return (
    <div className="size-full flex flex-col">
      <Navigation
        activeModule={activeModule}
        onModuleSwitch={handleModuleSwitch}
        onBackToList={selectedPatient ? handleBackToList : undefined}
      />
      {activeModule === 'registry' && (
        <RegistrySubNav active={registrySection} onChange={handleRegistrySection} />
      )}
      {activeModule === 'pi' && (
        <PISubNav active={piSection} onChange={handlePISection} />
      )}
      <div className="flex-1 overflow-y-auto flex flex-col">
        {activeModule === 'hub' ? (
          selectedPatient ? (
            <HubRecordB patient={selectedPatient} onBackToList={handleBackToList} />
          ) : (
            <HubCommandCenter
              onPatientSelect={handlePatientSelect}
              onOpenRegistry={() => { setActiveModule('registry'); setRegistrySection('home'); }}
            />
          )
        ) : activeModule === 'registry' ? (
          registrySection === 'home' || registrySection === 'cases'
            ? selectedPatient
              ? <PatientRecord patient={selectedPatient} onBackToList={handleBackToList} />
              : <PatientList
                  onPatientSelect={handlePatientSelect}
                  showDashboard={registrySection === 'home'}
                />
            : registrySection === 'submissions'
              ? <RegistrySubmissions />
              : registrySection === 'reports'
                ? <RegistryReports />
                : registrySection === 'dictionary'
                  ? <RegistryDictionary />
                  : registrySection === 'admin'
                    ? <RegistryAdmin />
                    : null
        ) : activeModule === 'pi' ? (
          piSection === 'home'
            ? selectedPatient
              ? <PIPatientRecord
                  patient={selectedPatient}
                  onBackToList={handleBackToList}
                  initialView={piInitialView === 'guidelines' ? { type: 'guidelines-htabs', activeId: 'overview' } : { type: 'timeline3' }}
                />
              : <PIPatientList onPatientSelect={handlePatientSelect} />
            : piSection === 'pips'
              ? selectedPatient
                ? <PIPatientRecord
                    patient={selectedPatient}
                    onBackToList={handleBackToList}
                    initialView={{ type: 'pips' }}
                  />
                : <PIPSSection onPatientSelect={handlePatientSelect} />
            : piSection === 'dashboard'
              ? <PIDashboard />
              : piSection === 'reports'
                ? <PIReports />
                : piSection === 'guidelines'
                  ? <PIGuidelinesSection />
                  : <SectionPlaceholder module="pi" section={piSection} />
        ) : null}
      </div>
    </div>
  );
}

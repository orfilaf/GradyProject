import { Navigation } from './components/Navigation';
import { PatientRecord } from './components/PatientRecord';

export default function App() {
  const samplePatient = {
    mrn: 'MRN-2024-001234',
    name: 'John Anderson',
    age: 45,
    gender: 'Male',
    dob: '1979-03-15',
    address: '123 Peachtree St NE, Atlanta, GA 30303',
    phone: '(404) 555-0123',
  };

  return (
    <div className="size-full flex flex-col">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <PatientRecord patient={samplePatient} />
      </div>
    </div>
  );
}
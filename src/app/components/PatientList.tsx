import { useState } from 'react';
import { Search } from 'lucide-react';

interface Patient {
  id: string;
  mrn: string;
  name: string;
  arrived: string;
  discharged: string;
  mechanism: string;
  activation: string;
  registryAssigned: string;
  piAssigned: string;
  status: 'Completed' | 'In Progress';
}

interface PatientListProps {
  onPatientSelect: (patient: Patient) => void;
}

export function PatientList({ onPatientSelect }: PatientListProps) {
  const [searchMRN, setSearchMRN] = useState('');
  const [searchName, setSearchName] = useState('');

  // Sample data - will be replaced with actual data later
  const patients: Patient[] = [
    {
      id: '1',
      mrn: 'MRN-2024-001234',
      name: 'John Anderson',
      arrived: '2024-06-07 14:30',
      discharged: '2024-06-10 09:15',
      mechanism: 'Car Accident',
      activation: 'Level 4',
      registryAssigned: 'Michael Chen',
      piAssigned: 'Sarah Williams',
      status: 'Completed',
    },
    {
      id: '2',
      mrn: 'MRN-2024-001235',
      name: 'Maria Garcia',
      arrived: '2024-06-08 08:45',
      discharged: '',
      mechanism: 'Fall',
      activation: 'Level 3',
      registryAssigned: 'Michael Chen',
      piAssigned: 'Sarah Williams',
      status: 'In Progress',
    },
    {
      id: '3',
      mrn: 'MRN-2024-001236',
      name: 'David Johnson',
      arrived: '2024-06-08 11:20',
      discharged: '',
      mechanism: 'Gunshot Wound',
      activation: 'Level 1',
      registryAssigned: 'Emily Rodriguez',
      piAssigned: 'Dr. Thompson',
      status: 'In Progress',
    },
    {
      id: '4',
      mrn: 'MRN-2024-001237',
      name: 'Sarah Kim',
      arrived: '2024-06-07 19:30',
      discharged: '2024-06-09 16:45',
      mechanism: 'Motorcycle Accident',
      activation: 'Level 2',
      registryAssigned: 'Michael Chen',
      piAssigned: 'Dr. Thompson',
      status: 'Completed',
    },
    {
      id: '5',
      mrn: 'MRN-2024-001238',
      name: 'Robert Williams',
      arrived: '2024-06-08 13:00',
      discharged: '',
      mechanism: 'Pedestrian vs Auto',
      activation: 'Level 2',
      registryAssigned: 'Emily Rodriguez',
      piAssigned: 'Sarah Williams',
      status: 'In Progress',
    },
  ];

  // Filter patients based on search criteria
  const filteredPatients = patients.filter((patient) => {
    const matchesMRN = patient.mrn.toLowerCase().includes(searchMRN.toLowerCase());
    const matchesName = patient.name.toLowerCase().includes(searchName.toLowerCase());
    return matchesMRN && matchesName;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Patient Registry</h1>
          <p className="text-sm text-gray-600">Trauma registry case management</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label htmlFor="search-mrn" className="block text-xs font-medium text-gray-700 mb-1">
                Search by MRN
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="search-mrn"
                  type="text"
                  placeholder="Enter MRN..."
                  value={searchMRN}
                  onChange={(e) => setSearchMRN(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="search-name" className="block text-xs font-medium text-gray-700 mb-1">
                Search by Patient Name
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="search-name"
                  type="text"
                  placeholder="Enter patient name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    MRN
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Patient Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Arrived
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Discharged
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Mechanism
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Activation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Registry Assigned
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    PI Assigned
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-sm text-gray-500">
                      No patients found matching your search criteria
                    </td>
                  </tr>
                ) : (
                  filteredPatients.map((patient) => (
                    <tr
                      key={patient.id}
                      onClick={() => onPatientSelect(patient)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-4 py-3 text-sm font-mono text-gray-900">{patient.mrn}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{patient.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.arrived}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {patient.discharged || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.mechanism}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.activation}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.registryAssigned}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{patient.piAssigned}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            patient.status === 'Completed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredPatients.length} of {patients.length} patients
        </div>
      </div>
    </div>
  );
}
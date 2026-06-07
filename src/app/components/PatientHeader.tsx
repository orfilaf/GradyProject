import { User, Calendar, MapPin, Phone } from 'lucide-react';

interface PatientHeaderProps {
  patient: {
    mrn: string;
    name: string;
    age: number;
    gender: string;
    dob: string;
    address?: string;
    phone?: string;
  };
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{patient.name}</h1>
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <span className="font-medium">MRN:</span>
                <span className="font-mono">{patient.mrn}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{patient.age} yrs</span>
                <span className="text-gray-400">•</span>
                <span>{patient.dob}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span>{patient.gender}</span>
              {patient.address && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{patient.address}</span>
                  </div>
                </>
              )}
              {patient.phone && (
                <>
                  <span className="text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{patient.phone}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-primary border border-primary rounded-md hover:bg-primary/5">
            Print
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-primary rounded-md hover:bg-primary/90">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

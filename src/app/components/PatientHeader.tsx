import { ArrowLeft } from 'lucide-react';

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
  onBackToList?: () => void;
}

export function PatientHeader({ patient, onBackToList }: PatientHeaderProps) {
  // TODO: These will be populated from actual form data
  const activationLevel = 'Level 4';
  const practitioners = 'Dr. Smith, Dr. Johnson';
  const chiefComplaint = 'Car Accident';
  const piPerson = 'Sarah Williams';
  const registryPerson = 'Michael Chen';

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-start gap-3">
            {/* Back to List Button */}
            {onBackToList && (
              <button
                onClick={onBackToList}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-dark transition-colors flex-shrink-0 mt-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to List
              </button>
            )}

            {/* Patient Info Section */}
            <div className="flex-1">
              {/* Line 1: Name | MRN */}
              <h1 className="text-xl font-semibold text-gray-900 mb-2">
                {patient.name} <span className="text-gray-400 font-normal">|</span>{' '}
                <span className="font-mono text-base">{patient.mrn}</span>
              </h1>

              {/* Line 2: Case Information */}
              <div className="flex items-center gap-3 text-xs text-gray-600 flex-wrap">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Age:</span>
                  <span>{patient.age} yrs</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Gender:</span>
                  <span>{patient.gender}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Activation:</span>
                  <span>{activationLevel}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Practitioners:</span>
                  <span>{practitioners}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Chief Complaint:</span>
                  <span>{chiefComplaint}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">PI:</span>
                  <span>{piPerson}</span>
                </div>
                <span className="text-gray-400">•</span>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Registry:</span>
                  <span>{registryPerson}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 ml-4">
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
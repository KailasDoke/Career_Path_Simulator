import React from 'react';

export interface Program {
  id: number;
  name: string;
  degree: string;
  durationYears: number;
  totalTuition: number;
  institution: { name: string; country?: { name: string } };
  careerDomains: string[];
  admissionRequirements: { field: string; operator: string; value: string }[];
  sourceType: string;
}

export default function ProgramCard({ program }: { program: Program }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{program.name}</h3>
          <p className="text-sm text-primary font-medium">{program.institution?.name}</p>
        </div>
        {program.sourceType === 'DEMO' && (
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">DEMO</span>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
        <p><span className="font-medium">Degree:</span> {program.degree}</p>
        <p><span className="font-medium">Duration:</span> {program.durationYears} Years</p>
        <p><span className="font-medium">Tuition:</span> </p>
        <p><span className="font-medium">Country:</span> {program.institution?.country?.name}</p>
      </div>

      {program.careerDomains && program.careerDomains.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Career Domains</p>
          <div className="flex flex-wrap gap-1">
            {program.careerDomains.map(d => (
              <span key={d} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full">{d.replace('_', ' ')}</span>
            ))}
          </div>
        </div>
      )}

      {program.admissionRequirements && program.admissionRequirements.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Requirements</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {program.admissionRequirements.map((req, i) => (
              <li key={i}>• {req.field.replace('_', ' ')} {req.operator} {req.value}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

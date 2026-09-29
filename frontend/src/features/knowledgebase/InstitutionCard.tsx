import React from 'react';

export interface Institution {
  id: number;
  name: string;
  country: { name: string };
  city: string;
  type: string;
  estimatedLivingCostAnnual: number;
  sourceType: string;
}

export default function InstitutionCard({ institution }: { institution: Institution }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-bold text-lg text-gray-900">{institution.name}</h3>
        {institution.sourceType === 'DEMO' && (
          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-1 rounded">DEMO</span>
        )}
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Location:</span> {institution.city}, {institution.country?.name}</p>
        <p><span className="font-medium">Type:</span> {institution.type}</p>
        <p><span className="font-medium">Est. Living Cost (Annual):</span> </p>
      </div>
    </div>
  );
}

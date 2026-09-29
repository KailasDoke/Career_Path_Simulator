import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Review() {
  const { getValues } = useFormContext();
  const data = getValues();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Review Your Profile</h2>
        <p className="text-gray-500 mt-1">Please confirm your details before saving.</p>
      </div>
      
      <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="block text-gray-500 mb-1">Name</span>
            <span className="font-medium text-gray-900">{data.firstName} {data.lastName}</span>
          </div>
          <div>
            <span className="block text-gray-500 mb-1">Education Level</span>
            <span className="font-medium text-gray-900">{data.currentEducationLevel || 'Not specified'}</span>
          </div>
          <div>
            <span className="block text-gray-500 mb-1">Interests</span>
            <span className="font-medium text-gray-900">{data.interestProfile?.primaryInterests?.join(', ') || 'None'}</span>
          </div>
          <div>
            <span className="block text-gray-500 mb-1">Annual Budget</span>
            <span className="font-medium text-gray-900">{data.financialProfile?.annualEducationBudget ? `₹${data.financialProfile.annualEducationBudget}` : 'Not specified'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { useFormContext } from 'react-hook-form';

const INTERESTS_LIST = [
  'Technology', 'Engineering', 'Healthcare', 'Business', 
  'Finance', 'Design', 'Research', 'Arts', 
  'Social Sciences', 'Law', 'Environment', 'Other'
];

export default function Interests() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Career Interests</h2>
        <p className="text-gray-500 mt-1">Select the areas you are most passionate about.</p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {INTERESTS_LIST.map((interest) => (
          <label key={interest} className="relative flex items-center justify-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors has-[:checked]:border-primary has-[:checked]:bg-blue-50">
            <input type="checkbox" value={interest.toUpperCase()} {...register('interestProfile.primaryInterests')} className="sr-only" />
            <span className="text-sm font-medium text-gray-700">{interest}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

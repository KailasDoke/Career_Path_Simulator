import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Location() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Location Preferences</h2>
        <p className="text-gray-500 mt-1">Where would you like to study?</p>
      </div>
      
      <div className="space-y-4">
        <label className="flex items-center space-x-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <input type="checkbox" {...register('locationPreference.willingToStudyAbroad')} className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          <div>
            <span className="block text-gray-900 font-medium">Willing to study abroad</span>
            <span className="block text-gray-500 text-sm">Include international pathways in my results</span>
          </div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Distance Preference</label>
        <select {...register('locationPreference.distancePreference')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all">
          <option value="">Any distance</option>
          <option value="SAME_CITY">Same City Only</option>
          <option value="SAME_STATE">Same State Only</option>
          <option value="ANYWHERE_IN_COUNTRY">Anywhere in Country</option>
        </select>
      </div>
    </div>
  );
}

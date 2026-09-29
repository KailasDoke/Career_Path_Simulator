import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function Budget() {
  const { register, watch, formState: { errors } } = useFormContext();
  const willingToTakeLoan = watch('financialProfile.willingToTakeLoan');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financial Profile</h2>
        <p className="text-gray-500 mt-1">This helps us find feasible pathways.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Annual Education Budget (₹)</label>
          <input type="number" {...register('financialProfile.annualEducationBudget', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="300000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Total Budget (₹)</label>
          <input type="number" {...register('financialProfile.maximumTotalBudget', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="1200000" />
        </div>
      </div>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" {...register('financialProfile.requiresScholarship')} className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          <span className="text-gray-700 font-medium">I require a scholarship</span>
        </label>
        
        <label className="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" {...register('financialProfile.willingToTakeLoan')} className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
          <span className="text-gray-700 font-medium">I am willing to take an education loan</span>
        </label>
      </div>

      {willingToTakeLoan && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mt-4 animate-in fade-in slide-in-from-top-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Comfortable EMI (₹)</label>
          <input type="number" {...register('financialProfile.maximumComfortableEmi', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none" placeholder="15000" />
        </div>
      )}
    </div>
  );
}

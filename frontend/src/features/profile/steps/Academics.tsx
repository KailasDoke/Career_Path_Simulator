import React from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

export default function Academics() {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Academic Profile</h2>
        <p className="text-gray-500 mt-1">Tell us about your academic performance.</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Class 10 Percentage</label>
        <div className="relative">
          <input type="number" step="0.1" {...register('academicRecord.class10Percentage', { valueAsNumber: true })} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all pr-12" placeholder="85.5" />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">%</span>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Key Subject Marks (out of 100)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Mathematics</label>
            <input type="number" {...register('academicRecord.subjectMarks.maths', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="90" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Science</label>
            <input type="number" {...register('academicRecord.subjectMarks.science', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="85" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">English</label>
            <input type="number" {...register('academicRecord.subjectMarks.english', { valueAsNumber: true })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="88" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Academic Strengths (Optional)</label>
        <textarea {...register('academicRecord.academicStrengths')} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="E.g., Strong at problem solving, good at biology..."></textarea>
      </div>
    </div>
  );
}

$baseDir = "C:\Users\kaila\Downloads\Career\career-path-simulator\frontend\src\features\profile"

New-Item -ItemType Directory -Force -Path $baseDir

$profileBuilderCode = @"
import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import axios from 'axios';
import AboutYou from './steps/AboutYou';
import Academics from './steps/Academics';
import Interests from './steps/Interests';
import Budget from './steps/Budget';
import Location from './steps/Location';
import Review from './steps/Review';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  currentEducationLevel: z.string().optional(),
  country: z.string().optional(),
  stateRegion: z.string().optional(),
  city: z.string().optional(),
  academicRecord: z.object({
    class10Percentage: z.number().min(0).max(100).optional(),
    subjectMarks: z.record(z.number()).optional(),
    academicStrengths: z.string().optional()
  }).optional(),
  financialProfile: z.object({
    annualEducationBudget: z.number().min(0, 'Cannot be negative').optional(),
    maximumTotalBudget: z.number().min(0).optional(),
    familyContribution: z.number().min(0).optional(),
    requiresScholarship: z.boolean().optional(),
    willingToTakeLoan: z.boolean().optional(),
    maximumComfortableEmi: z.number().min(0).optional()
  }).optional(),
  locationPreference: z.object({
    preferredCountries: z.array(z.string()).optional(),
    preferredRegions: z.array(z.string()).optional(),
    preferredCityType: z.string().optional(),
    willingToStudyAbroad: z.boolean().optional(),
    distancePreference: z.string().optional()
  }).optional(),
  interestProfile: z.object({
    primaryInterests: z.array(z.string()).optional()
  }).optional()
});

export type ProfileFormData = z.infer<typeof profileSchema>;

const STEPS = ['About You', 'Academics', 'Interests', 'Budget', 'Location', 'Review'];

export default function ProfileBuilder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      academicRecord: { subjectMarks: {} },
      financialProfile: { requiresScholarship: false, willingToTakeLoan: false },
      locationPreference: { preferredCountries: [], preferredRegions: [], willingToStudyAbroad: false },
      interestProfile: { primaryInterests: [] }
    }
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      // Clean up empty records for backend
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/students`, data);
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to save profile', error);
      alert('Failed to save profile. Please check validation errors.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: string[] = [];
    if (currentStep === 0) fieldsToValidate = ['firstName', 'lastName'];
    // Add specific field validations per step if needed

    const isStepValid = await methods.trigger(fieldsToValidate as any);
    if (isStepValid) setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your profile is ready.</h2>
        <p className="text-gray-600 mb-8">We've saved your preferences and are ready to generate your custom career pathways.</p>
        <button className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow transition-all">
          Explore My Pathways
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary -z-10 transition-all duration-300" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
          {STEPS.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${index <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'}`}>
                {index + 1}
              </div>
              <span className={`text-xs mt-2 font-medium ${index <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Form Area */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-10">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            
            <div className="min-h-[400px]">
              {currentStep === 0 && <AboutYou />}
              {currentStep === 1 && <Academics />}
              {currentStep === 2 && <Interests />}
              {currentStep === 3 && <Budget />}
              {currentStep === 4 && <Location />}
              {currentStep === 5 && <Review />}
            </div>

            <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
              <button type="button" onClick={prevStep} disabled={currentStep === 0} className={`flex items-center text-sm font-medium px-4 py-2 rounded-lg transition-colors ${currentStep === 0 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}>
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </button>
              
              <div className="space-x-3">
                <button type="button" className="text-sm font-medium text-gray-500 hover:text-gray-700">
                  Save Draft
                </button>
                {currentStep === STEPS.length - 1 ? (
                  <button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow transition-all disabled:opacity-50">
                    {isSubmitting ? 'Saving...' : 'Complete Profile'}
                  </button>
                ) : (
                  <button type="button" onClick={nextStep} className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-2 px-6 rounded-lg shadow transition-all flex items-center inline-flex">
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                )}
              </div>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
"@

Set-Content -Path "$baseDir\ProfileBuilder.tsx" -Value $profileBuilderCode

New-Item -ItemType Directory -Force -Path "$baseDir\steps"

$aboutYouCode = @"
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function AboutYou() {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Basic Information</h2>
        <p className="text-gray-500 mt-1">Let's start with who you are.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <input type="text" {...register('firstName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="John" />
          {errors.firstName && <p className="text-red-500 text-xs mt-1">{(errors.firstName as any).message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <input type="text" {...register('lastName')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" placeholder="Doe" />
          {errors.lastName && <p className="text-red-500 text-xs mt-1">{(errors.lastName as any).message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Current Education Level</label>
        <select {...register('currentEducationLevel')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all">
          <option value="">Select Level</option>
          <option value="CLASS_10">Class 10</option>
          <option value="CLASS_12">Class 12</option>
          <option value="BACHELORS">Bachelor's Degree</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input type="text" {...register('country')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="India" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input type="text" {...register('city')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Mumbai" />
        </div>
      </div>
    </div>
  );
}
"@
Set-Content -Path "$baseDir\steps\AboutYou.tsx" -Value $aboutYouCode

$academicsCode = @"
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
"@
Set-Content -Path "$baseDir\steps\Academics.tsx" -Value $academicsCode

$interestsCode = @"
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
"@
Set-Content -Path "$baseDir\steps\Interests.tsx" -Value $interestsCode

$budgetCode = @"
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
"@
Set-Content -Path "$baseDir\steps\Budget.tsx" -Value $budgetCode

$locationCode = @"
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
"@
Set-Content -Path "$baseDir\steps\Location.tsx" -Value $locationCode

$reviewCode = @"
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
"@
Set-Content -Path "$baseDir\steps\Review.tsx" -Value $reviewCode


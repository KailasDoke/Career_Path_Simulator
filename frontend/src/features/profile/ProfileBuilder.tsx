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
    subjectMarks: z.record(z.string(), z.number()).optional(),
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
              
              <div className="space-x-3 flex items-center">
                <button type="button" className="text-sm font-medium text-gray-500 hover:text-gray-700 mr-4">
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

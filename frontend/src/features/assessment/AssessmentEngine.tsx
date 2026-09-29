import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Question {
  id: string;
  question: string;
  options: string[];
  category: string;
  type: string;
}

export default function AssessmentEngine() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userId, refreshProfile } = useAuth();

  useEffect(() => {
    // Adding dummy data fallback for UI development without backend
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/assessments/questions`)
      .then(res => {
        if (Array.isArray(res.data)) {
          setQuestions(res.data);
        } else {
          console.error("API returned non-array data:", res.data);
          setQuestions([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load questions", err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (qId: string, opt: string) => {
    setAnswers(prev => ({ ...prev, [qId]: opt }));
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert('You must be logged in to submit.');
      return;
    }
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/assessments/submit/${userId}`, { answers });
      await refreshProfile(); // Refresh profile so dashboard shows completion
      navigate('/assessment/results', { state: res.data });
    } catch (err) {
      console.error(err);
      alert('Failed to submit assessment.');
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
      <p className="text-gray-500 font-medium">Loading assessment...</p>
    </div>
  );

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-border">
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-primary/10 p-3 rounded-2xl text-primary shrink-0">
            <BrainCircuit className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Exploratory Assessment</h1>
            <p className="text-gray-500 mt-2 text-lg">
              Discover your natural strengths and interests.
            </p>
          </div>
        </div>
        
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800 text-sm">
          <Info className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
          <p>
            This is an educational assessment designed to estimate your reasoning strengths and interests. 
            <strong className="font-semibold text-blue-900 ml-1">It is not a psychological diagnosis.</strong> There are no wrong answers.
          </p>
        </div>
        
        {/* Progress bar */}
        <div className="mt-8 mb-2 flex justify-between items-end">
          <span className="text-sm font-semibold text-gray-600">Progress</span>
          <span className="text-sm font-bold text-primary">{answeredCount} of {questions.length} completed</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-8">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out rounded-full" 
            style={{ width: `${progress}%` }} 
          />
        </div>

        <div className="space-y-8">
          {questions.length === 0 ? (
             <div className="text-center py-12 text-gray-500">
               No questions found. Please check backend connection.
             </div>
          ) : (
            questions.map((q, i) => (
              <div key={q.id} className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
                <div className="flex gap-4">
                  <span className="text-2xl font-bold text-slate-300 shrink-0">{i + 1}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-5 text-lg leading-snug">{q.question}</h3>
                    <div className="space-y-3">
                      {q.options.map(opt => {
                        const isSelected = answers[q.id] === opt;
                        return (
                          <label 
                            key={opt} 
                            className={cn(
                              "flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 group",
                              isSelected 
                                ? "border-primary bg-primary/5 shadow-sm" 
                                : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50"
                            )}
                          >
                            <div className={cn(
                              "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mr-4 transition-colors",
                              isSelected ? "border-primary" : "border-slate-300 group-hover:border-primary/40"
                            )}>
                              {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary animate-in zoom-in duration-200" />}
                            </div>
                            <input 
                              type="radio" 
                              name={q.id} 
                              value={opt} 
                              checked={isSelected}
                              onChange={() => handleSelect(q.id, opt)}
                              className="sr-only"
                            />
                            <span className={cn(
                              "font-medium transition-colors", 
                              isSelected ? "text-gray-900" : "text-gray-600 group-hover:text-gray-900"
                            )}>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex justify-end">
          <button 
            onClick={handleSubmit} 
            disabled={answeredCount < questions.length}
            className="bg-primary hover:bg-blue-600 disabled:bg-slate-300 disabled:text-slate-500 text-white font-semibold py-3 px-8 rounded-xl shadow-sm transition-all flex items-center gap-2 group"
          >
            Submit Assessment
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

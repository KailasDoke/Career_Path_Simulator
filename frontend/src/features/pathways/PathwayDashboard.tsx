import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Banknote, 
  GraduationCap, 
  Briefcase, 
  ChevronRight,
  MapPin,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface EducationStage {
  programName: string;
  institutionName: string;
  level: string;
  tuition: number;
  durationYears: number;
}

export interface FitScores {
  academicFit: number;
  interestFit: number;
  financialFit: number;
  locationFit: number;
  admissionFit: number;
}

export interface PathwayExplanation {
  assumptions: string[];
  fundingOpportunities: string[];
  risks: string[];
}

export interface Pathway {
  name: string;
  educationStages: EducationStage[];
  careerDomains: string[];
  durationYears: number;
  estimatedTotalCost: number;
  fitScores: FitScores;
  explanation: PathwayExplanation;
}

export default function PathwayDashboard() {
  const [pathways, setPathways] = useState<Pathway[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);
  
  const { userId: studentId } = useAuth();

  useEffect(() => {
    const fetchPathways = async () => {
      try {
        const response = await fetch('/api/pathways/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ studentId }),
        });
        if (response.ok) {
          const data = await response.json();
          setPathways(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPathways();
  }, [studentId]);

  useEffect(() => {
    if (selectedPathway) {
      // Set up scroll animations for the timeline
      const ctx = gsap.context(() => {
        gsap.utils.toArray('.timeline-item').forEach((item: any, i) => {
          gsap.fromTo(item, 
            { opacity: 0, x: -50 },
            { 
              opacity: 1, 
              x: 0, 
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      });
      return () => ctx.revert();
    }
  }, [selectedPathway]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Generating possibilities...</div>;
  }

  if (selectedPathway) {
    return (
      <div className="relative min-h-screen bg-slate-50 text-gray-900 overflow-hidden pb-32">
        {/* Fixed Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <button 
            onClick={() => setSelectedPathway(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Universe
          </button>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full text-sm font-semibold text-slate-700">
              <Clock className="w-4 h-4 text-slate-500" /> {selectedPathway.durationYears} Years
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-semibold text-emerald-700 border border-emerald-100">
              <Banknote className="w-4 h-4" /> ₹{selectedPathway.estimatedTotalCost.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Hero Title */}
        <div className="max-w-4xl mx-auto mt-20 mb-32 px-6 text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-900 mb-6">
            {selectedPathway.careerDomains[0] || 'YOUR CAREER'}
          </h1>
          <p className="text-xl text-gray-500 font-medium">{selectedPathway.name}</p>
        </div>

        {/* The Timeline Experience */}
        <div className="max-w-3xl mx-auto px-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-[39px] top-0 bottom-0 w-1 bg-gradient-to-b from-primary/50 via-blue-500/50 to-emerald-500/50 rounded-full"></div>

          {/* Timeline Nodes */}
          <div className="space-y-24">
            
            {/* Start Node */}
            <div className="timeline-item flex gap-8 relative z-10">
              <div className="w-20 h-20 bg-gray-900 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-4 border-slate-50">
                <span className="font-black text-xl">10</span>
              </div>
              <div className="pt-2">
                <h3 className="text-2xl font-bold text-gray-900">Class 10</h3>
                <p className="text-gray-500 text-lg">Your starting point.</p>
              </div>
            </div>

            {/* Dynamic Stages from Backend */}
            {selectedPathway.educationStages.map((stage, idx) => (
              <div key={idx} className="timeline-item flex gap-8 relative z-10">
                <div className="w-20 h-20 bg-white border border-gray-200 text-primary rounded-2xl flex items-center justify-center shrink-0 shadow-md">
                  <GraduationCap className="w-10 h-10" />
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex-1 hover:shadow-lg transition-shadow">
                  <div className="inline-block bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                    {stage.level}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stage.programName}</h3>
                  <p className="text-gray-600 text-lg flex items-center gap-2 mb-6">
                    <MapPin className="w-5 h-5 text-gray-400" /> {stage.institutionName}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">{stage.durationYears} Years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-bold uppercase tracking-wider mb-1">Estimated Cost</p>
                      <p className="font-semibold text-gray-900">₹{stage.tuition.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Final Career Node */}
            <div className="timeline-item flex gap-8 relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg border-4 border-slate-50">
                <Briefcase className="w-10 h-10" />
              </div>
              <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex-1">
                <h3 className="text-2xl font-bold text-emerald-900 mb-2">
                  {selectedPathway.careerDomains[0] || 'Career Target'}
                </h3>
                <p className="text-emerald-700 text-lg">You have reached your destination.</p>
              </div>
            </div>

          </div>
        </div>

        {/* Considerations Section (Scrolls in at the end) */}
        <div className="max-w-3xl mx-auto px-6 mt-32 timeline-item">
          <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
            <h3 className="text-2xl font-bold mb-8">Things to Consider</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-4">Assumptions</h4>
                <ul className="space-y-3">
                  {selectedPathway.explanation.assumptions.map((a, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> {a}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-gray-500 uppercase tracking-widest text-xs mb-4">Risks</h4>
                <ul className="space-y-3">
                  {selectedPathway.explanation.risks.map((r, i) => (
                    <li key={i} className="flex gap-3 text-gray-700">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 lg:p-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-4">EXPLORE THE FUTURES<br/> YOU COULD BUILD.</h1>
        <p className="text-xl text-gray-600 mb-16 max-w-2xl">
          Select a career universe branch to see the full timeline, costs, and educational milestones required to get there.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pathways.map((pathway, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedPathway(pathway)}
              className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mt-10 -mr-10 group-hover:bg-primary/20 transition-colors"></div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2 relative z-10">{pathway.careerDomains[0]}</h3>
              <p className="text-gray-500 mb-8 relative z-10">{pathway.name}</p>
              
              <div className="flex gap-4 border-t border-gray-50 pt-6 relative z-10">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Time</p>
                  <p className="font-semibold text-gray-900">{pathway.durationYears} yrs</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Cost</p>
                  <p className="font-semibold text-gray-900">₹{pathway.estimatedTotalCost.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-8 flex items-center text-primary font-bold text-sm relative z-10">
                View Journey <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  BookOpen,
  Map,
  Clock,
  Settings,
  Briefcase,
  GraduationCap,
  Banknote,
  Sparkles,
  Calculator,
  Bot
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Lazy load the 3D element so it doesn't block the initial render
const CareerUniverse = lazy(() => import('../../components/3d/CareerUniverse'));

export default function LandingPage() {
  const pathways = [
    { name: 'B.Tech Computer Science', careerDomains: ['Software Engineering'], durationYears: 4, estimatedTotalCost: 800000 },
    { name: 'B.Sc Data Science', careerDomains: ['Data'], durationYears: 3, estimatedTotalCost: 600000 }
  ];
  const scholarships = [
    { name: 'Global Excellence Tech Scholarship', eligibilityCriteria: ['Merit Based'], estimatedBenefit: 200000 }
  ];
  const loadingPathways = false;
  const loadingScholarships = false;

  // No backend data fetching for the unauthenticated landing page

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center px-6 md:px-12 lg:px-24 bg-slate-50 overflow-hidden">
        
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[52%_48%] gap-12 items-center relative z-10">
          
          {/* LEFT CONTENT */}
          <div className="pt-12 lg:pt-0 pb-12 z-20 pointer-events-auto">
            <p className="text-sm md:text-base font-bold tracking-widest text-indigo-600 uppercase mb-4">
              CAREER PATH SIMULATOR
            </p>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-[1.05] mb-6 max-w-[700px]">
              YOUR FUTURE IS <br className="hidden lg:block"/>MORE THAN ONE <br className="hidden lg:block"/>PATH.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium max-w-[600px] mb-10 leading-relaxed">
              Choosing a career after Class 10 can feel confusing. Explore possible pathways, understand the education and skills they require, estimate the cost, and discover opportunities that can help you move forward.
            </p>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
              <Link to="/login" className="group bg-gray-900 hover:bg-black text-white font-semibold py-4 px-8 rounded-full shadow-lg shadow-gray-900/20 transition-all flex items-center justify-center gap-3 text-lg">
                Explore My Future <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 font-bold py-4 px-6 transition-colors">
                See How It Works
              </a>
            </div>
            
            <p className="text-sm text-gray-500 font-medium">
              Explore possibilities. Understand your options. Plan your next step.
            </p>
          </div>

          {/* RIGHT VISUAL */}
          <div className="relative w-full h-[400px] lg:h-[600px] flex items-center justify-center lg:justify-end rounded-[3rem] overflow-hidden bg-[radial-gradient(circle_at_75%_45%,rgba(224,231,255,0.8),transparent_60%)] pointer-events-none">
             {/* The 3D canvas container */}
             <div className="absolute inset-0 z-10 pointer-events-auto">
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
                  </div>
                }>
                   <CareerUniverse />
                </Suspense>
             </div>
          </div>

        </div>
      </section>

      {/* 10. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-6 md:px-12 lg:px-24 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
              SEE WHERE YOUR CHOICES CAN TAKE YOU.
            </h2>
            <p className="text-xl text-gray-600">
              Start with your interests and circumstances. We turn them into possible career pathways that you can explore, compare and question.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { num: '01', title: 'Understand Yourself', desc: 'Tell us about your interests, strengths and current situation.', icon: BookOpen },
              { num: '02', title: 'Explore Possibilities', desc: 'Discover career paths that connect with your interests and goals.', icon: Map },
              { num: '03', title: 'Understand the Journey', desc: 'See the education, skills, time and estimated costs involved.', icon: Clock },
              { num: '04', title: 'Test What If?', desc: 'Change your circumstances and see how your available pathways can change.', icon: Settings },
            ].map((step, i) => (
              <div key={i} className="flex flex-col">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
                  <step.icon className="w-6 h-6" />
                </div>
                <div className="text-sm font-bold text-gray-400 mb-2">{step.num}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CAREER EXPLORER */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
              DON'T CHOOSE A CAREER. EXPLORE IT.
            </h2>
            <p className="text-xl text-gray-600">
              Every career has a journey. Explore what you would need to study, which skills matter, how long the journey may take, and what opportunities can follow.
            </p>
          </div>

          {loadingPathways ? (
            <div className="space-y-4">
              {[1,2,3].map((skeleton) => (
                <div key={skeleton} className="w-full h-32 bg-gray-200 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : pathways.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {pathways.slice(0, 4).map((p, i) => (
                <Link to="/pathways" key={i} className="group bg-white border border-gray-100 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 block relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-2xl -mt-10 -mr-10 transition-colors group-hover:bg-indigo-100/50"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{p.careerDomains?.[0] || 'Technology'}</h3>
                    <p className="text-gray-500 mb-6 text-sm">{p.name}</p>
                    
                    <div className="space-y-3 mb-8">
                      <div className="flex gap-3 text-sm">
                        <GraduationCap className="w-5 h-5 text-indigo-500 shrink-0" />
                        <span className="font-medium text-gray-700">Degree / Diploma pathways</span>
                      </div>
                      <div className="flex gap-3 text-sm">
                        <Briefcase className="w-5 h-5 text-indigo-500 shrink-0" />
                        <span className="font-medium text-gray-700">Explore skills & internships</span>
                      </div>
                    </div>
                    
                    <span className="inline-flex items-center text-indigo-600 font-bold text-sm">
                      Explore Path <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
             <div className="text-center p-12 bg-white rounded-3xl border border-gray-100">
               <p className="text-gray-500 font-medium">We couldn't load your career pathways. Please try again.</p>
               <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors">Try Again</button>
             </div>
          )}
        </div>
      </section>

      {/* REMOVED 3D STUDENT MOMENT AS IT IS NOW IN THE HERO SECTION */}

      {/* 14. COST SECTION */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
              WHAT WILL THIS PATH REQUIRE?
            </h2>
            <p className="text-xl text-gray-600">
              A career decision is not only about the destination. Understanding the time, education and financial commitment can help you plan realistically.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 p-10 rounded-3xl border border-gray-100 flex flex-col justify-center relative overflow-hidden">
              <Banknote className="absolute right-0 bottom-0 w-64 h-64 text-indigo-50/50 -mb-10 -mr-10" />
              <div className="relative z-10">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Estimated Education Cost</p>
                <div className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter mb-8">
                  ₹{pathways[0]?.estimatedTotalCost ? (pathways[0].estimatedTotalCost / 100000).toFixed(1) : '8.0'}L
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Approximate duration</p>
                <div className="text-2xl font-bold text-gray-900">
                  {pathways[0]?.durationYears || '4–5'} years
                </div>
              </div>
            </div>
            
            {/* 12. CAREER PATH VISUALIZATION */}
            <div className="bg-white border border-gray-100 p-8 rounded-3xl shadow-sm">
              <h3 className="font-bold text-gray-900 mb-6 text-lg">Example Educational Timeline</h3>
              <div className="flex flex-col gap-0 relative">
                {/* Visual SVG line */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100"></div>
                
                {['Class 10', 'Choose Stream', 'Higher Secondary', 'Degree / Diploma', 'Build Skills', 'Internship', 'Career'].map((step, i) => (
                  <div key={i} className="flex gap-6 relative group py-2">
                    <div className="w-12 h-12 bg-white border-2 border-gray-100 rounded-full flex items-center justify-center shrink-0 z-10 group-hover:border-indigo-500 transition-colors">
                      <div className="w-3 h-3 bg-gray-200 rounded-full group-hover:bg-indigo-500 transition-colors"></div>
                    </div>
                    <div className="pt-3 font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">
                      {step}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15. SCHOLARSHIP SECTION */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-indigo-50/50 border-y border-indigo-100/50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
              FUNDING CAN CHANGE THE PATH.
            </h2>
            <p className="text-xl text-gray-600">
              Financial constraints should not automatically close a career option. Explore scholarships and funding opportunities that may reduce the cost of education.
            </p>
          </div>
          
          {loadingScholarships ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1,2,3].map((s) => <div key={s} className="w-full h-40 bg-white rounded-2xl animate-pulse"></div>)}
            </div>
          ) : scholarships.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.slice(0, 3).map((s, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col h-full">
                  <div className="mb-4">
                    <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-3">
                      {s.eligibilityCriteria?.[0] || 'Merit Based'}
                    </span>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2">{s.name}</h3>
                  </div>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Amount</p>
                      <p className="font-black text-gray-900 text-lg">₹{s.estimatedBenefit?.toLocaleString()}</p>
                    </div>
                    <Link to="/scholarships" className="text-indigo-600 font-bold text-sm flex items-center group">
                      Check Eligibility <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 font-medium">No scholarships found. Try updating your profile.</p>
          )}
        </div>
      </section>

      {/* 16. WHAT-IF SIMULATOR PREVIEW & 17. COMPARISON */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-6">
                WHAT IF YOUR CIRCUMSTANCES CHANGE?
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Your current situation does not have to define your entire journey. Adjust a few factors and explore how your possible pathways respond.
              </p>
              
              <div className="space-y-6 mb-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">Your Current Path</h4>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900">Software Engineering</span>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="w-full h-full bg-gray-400"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50">
                  <h4 className="font-bold text-indigo-400 text-xs uppercase tracking-widest mb-3">After Your Change</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">Software Engineering</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-3/4 h-full bg-indigo-500"></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900">Alternative Path</span>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-blue-400"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Link to="/simulate" className="inline-flex bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 rounded-full shadow-md transition-all items-center gap-3 text-lg">
                <Calculator className="w-5 h-5" /> Open Simulator
              </Link>
            </div>
            
            <div className="bg-slate-50 rounded-[3rem] p-10 md:p-14 border border-gray-100 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 mb-4">
                EXPLORE MORE THAN ONE POSSIBILITY.
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                There may be several ways to reach a similar destination. Compare pathways based on what matters to you.
              </p>
              
              <ul className="space-y-4">
                {['Education requirements', 'Duration', 'Estimated cost', 'Skills', 'Funding opportunities', 'Possible outcomes'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </section>

      {/* 18. AI CAREER COPILOT */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-gray-900 text-white rounded-t-[3rem]">
        <div className="max-w-6xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Bot className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
            HAVE A QUESTION? ASK YOUR CAREER COPILOT.
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-16 leading-relaxed">
            Career decisions often come with questions. Ask about your pathways, education requirements, budget, scholarships or the changes you can make to reach a goal.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {[
              "What can I do if my budget is low?",
              "What skills should I start learning?",
              "What are the education options for this career?",
              "Can I reach this career through another pathway?"
            ].map((q, i) => (
              <div key={i} className="bg-white/5 border border-white/10 text-gray-300 font-medium py-3 px-6 rounded-full text-sm">
                "{q}"
              </div>
            ))}
          </div>
          
          <Link to="/copilot" className="inline-flex bg-white hover:bg-gray-100 text-gray-900 font-bold py-4 px-10 rounded-full shadow-lg transition-all items-center gap-3 text-lg">
            Ask Career Copilot <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* 20. FINAL SECTION */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-gray-900 text-white border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
            YOU DON'T NEED TO KNOW YOUR ENTIRE FUTURE TODAY.
          </h2>
          <p className="text-2xl text-gray-400 mb-12">
            You only need enough information to understand your next step.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
            <Link to="/pathways" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center gap-2">
              Explore Another Path <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/copilot" className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-full transition-colors flex items-center justify-center">
              Ask Career Copilot
            </Link>
          </div>
          
          <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">
            Explore. Compare. Question. Decide.
          </p>
        </div>
      </section>

    </div>
  );
}

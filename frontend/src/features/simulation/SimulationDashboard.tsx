import { useState } from 'react';
import { 
  Calculator, 
  ArrowRight, 
  ChevronRight,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  IndianRupee,
  GraduationCap,
  Sparkles,
  User,
  Briefcase
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type SimulationPathwayComparisonDto = {
  pathwayName: string;
  programName: string;
  beforeStatus: string;
  afterStatus: string;
  explanation: string;
  beforePathway: any;
  afterPathway: any;
};

type SimulationResultDto = {
  scenarioDescription: string;
  pathwayComparisons: SimulationPathwayComparisonDto[];
};

export default function SimulationDashboard() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResultDto | null>(null);
  const [scenarioType, setScenarioType] = useState('BUDGET_CHANGE');
  const [newValue, setNewValue] = useState<number>(500000); 
  
  const { userId: studentId } = useAuth();

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const payload: any = { type: scenarioType };
      if (scenarioType === 'BUDGET_CHANGE') {
        payload.newBudget = newValue;
      } else if (scenarioType === 'SCHOLARSHIP_RECEIVED') {
        payload.newScholarshipAmount = newValue;
      } else if (scenarioType === 'NO_LOAN') {
        // no extra payload needed
      } else if (scenarioType === 'PROGRAM_UNAVAILABLE') {
        payload.excludedProgramId = newValue; 
      }
      
      const res = await fetch(`/api/simulation/${studentId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Simulation failed');
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      alert('Failed to run simulation. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 pb-32 font-sans">
      
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 mb-6 uppercase">
          WHAT IF YOUR SITUATION CHANGED?
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto">
          Adjust the parameters of your life—like budget or scholarships—and watch how your possible futures shift instantly.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column - Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mt-10 -mr-10"></div>
            
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Scenario Simulator</h3>
            
            <div className="space-y-6 relative z-10">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  What changes?
                </label>
                <div className="relative">
                  <select 
                    value={scenarioType}
                    onChange={(e) => setScenarioType(e.target.value)}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 text-gray-900 font-medium rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-4 pr-10 shadow-sm transition-all outline-none"
                  >
                    <option value="BUDGET_CHANGE">My family budget changes</option>
                    <option value="SCHOLARSHIP_RECEIVED">I receive a scholarship</option>
                    <option value="NO_LOAN">I cannot take an education loan</option>
                    <option value="PROGRAM_UNAVAILABLE">My preferred program is unavailable</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </div>
                </div>
              </div>
              
              {(scenarioType === 'BUDGET_CHANGE' || scenarioType === 'SCHOLARSHIP_RECEIVED' || scenarioType === 'PROGRAM_UNAVAILABLE') && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    {scenarioType === 'PROGRAM_UNAVAILABLE' ? 'Program ID to Exclude' : 'New Amount (₹)'}
                  </label>
                  <div className="relative group">
                    {scenarioType !== 'PROGRAM_UNAVAILABLE' && (
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <IndianRupee className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                      </div>
                    )}
                    <input 
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(Number(e.target.value))}
                      className={cn(
                        "w-full bg-slate-50 border border-slate-200 text-gray-900 font-bold text-lg rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary block p-4 shadow-sm transition-all outline-none",
                        scenarioType !== 'PROGRAM_UNAVAILABLE' ? 'pl-11' : ''
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={handleSimulate}
              disabled={loading}
              className="mt-10 w-full bg-gray-900 hover:bg-black text-white p-4 rounded-2xl shadow-xl shadow-gray-900/20 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  SIMULATING...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-primary group-hover:animate-pulse" />
                  SIMULATE FUTURE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-8">
          {loading ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm">
              <div className="relative w-20 h-20 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                <Calculator className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
              </div>
              <p className="text-gray-900 font-bold text-xl tracking-tight">Calculating new timelines...</p>
            </div>
          ) : result ? (
            <div className="space-y-12 animate-in slide-in-from-right-8 duration-700 fade-in">
              
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center">
                <h3 className="font-black text-2xl text-gray-900 mb-2">SIMULATION RESULT</h3>
                <p className="text-gray-500 font-medium text-lg">{result.scenarioDescription}</p>
              </div>

              <div className="space-y-16">
                {result.pathwayComparisons.map((comp, i) => {
                  const remainedFeasible = comp.beforeStatus === 'Feasible' && comp.afterStatus === 'Feasible';
                  const becameFeasible = comp.beforeStatus !== 'Feasible' && comp.afterStatus === 'Feasible';
                  const becameUnfeasible = comp.beforeStatus === 'Feasible' && comp.afterStatus !== 'Feasible';
                  
                  return (
                    <div key={i} className="relative">
                      {/* Pathway Header */}
                      <div className="mb-8 text-center">
                        <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm text-sm font-bold text-gray-900 mb-2">
                          <Briefcase className="w-4 h-4 text-primary" /> {comp.pathwayName}
                        </div>
                        {becameFeasible && <p className="text-emerald-600 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-1"><TrendingUp className="w-4 h-4"/> New Feasible Path</p>}
                        {becameUnfeasible && <p className="text-red-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-1"><TrendingDown className="w-4 h-4"/> Path Blocked</p>}
                        {remainedFeasible && <p className="text-blue-500 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-1">Path Unchanged</p>}
                      </div>

                      {/* Visual Tree Comparison */}
                      <div className="flex flex-col md:flex-row gap-8 items-stretch justify-center relative">
                        
                        {/* Before Tree */}
                        <div className={cn("flex-1 bg-white p-6 rounded-3xl border-2 shadow-sm flex flex-col items-center text-center", comp.beforeStatus === 'Feasible' ? 'border-gray-100' : 'border-red-100 bg-red-50/30 opacity-70')}>
                          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Original Future</h4>
                          
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white mb-2 z-10"><User className="w-5 h-5"/></div>
                            <div className="w-0.5 h-6 bg-gray-200"></div>
                            <div className="bg-gray-100 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 z-10">{comp.programName}</div>
                            <div className="w-0.5 h-6 bg-gray-200"></div>
                            
                            <div className={cn("w-full py-4 rounded-xl border z-10", comp.beforeStatus === 'Feasible' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700')}>
                              <p className="font-black text-lg mb-1">{comp.beforeStatus}</p>
                              <p className="text-xs font-bold uppercase">Cost: ₹{comp.beforePathway.estimatedTotalCost?.toLocaleString() || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                        {/* VS arrow on desktop */}
                        <div className="hidden md:flex flex-col justify-center items-center">
                          <div className="w-12 h-12 bg-white rounded-full border border-gray-100 shadow-sm flex items-center justify-center text-gray-400 font-bold">
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        </div>

                        {/* After Tree */}
                        <div className={cn("flex-1 bg-white p-6 rounded-3xl border-2 shadow-xl flex flex-col items-center text-center transform md:scale-105", comp.afterStatus === 'Feasible' ? 'border-emerald-200 bg-emerald-50/10' : 'border-red-200 bg-red-50/10')}>
                          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-6">Simulated Future</h4>
                          
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white mb-2 z-10"><User className="w-5 h-5"/></div>
                            <div className={cn("w-0.5 h-6", comp.afterStatus === 'Feasible' ? 'bg-primary/50' : 'bg-gray-200')}></div>
                            <div className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-xl text-sm font-bold text-gray-900 z-10">{comp.programName}</div>
                            <div className={cn("w-0.5 h-6", comp.afterStatus === 'Feasible' ? 'bg-primary/50' : 'bg-gray-200')}></div>
                            
                            {/* Branch indicating new condition if applicable */}
                            {scenarioType === 'SCHOLARSHIP_RECEIVED' && comp.afterStatus === 'Feasible' && (
                              <div className="relative w-full flex justify-center mb-2">
                                <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-emerald-200"></div>
                                <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold z-10 relative left-1/4 border border-emerald-200 flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> + Scholarship
                                </div>
                              </div>
                            )}
                            
                            <div className={cn("w-full py-4 rounded-xl border-2 z-10", comp.afterStatus === 'Feasible' ? 'bg-emerald-500 border-emerald-600 text-white shadow-lg shadow-emerald-500/30' : 'bg-red-50 border-red-200 text-red-700')}>
                              <p className="font-black text-xl mb-1">{comp.afterStatus}</p>
                              <p className="text-xs font-bold uppercase tracking-wider opacity-90">Cost: ₹{comp.afterPathway.estimatedTotalCost?.toLocaleString() || "N/A"}</p>
                            </div>
                          </div>
                        </div>

                      </div>

                      {/* AI Explanation */}
                      <div className="mt-6 max-w-2xl mx-auto bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-center">
                        <AlertCircle className="w-6 h-6 text-blue-500 mx-auto mb-3" />
                        <p className="text-gray-700 font-medium leading-relaxed">{comp.explanation}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 border-dashed">
              <Calculator className="w-16 h-16 text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">Ready to explore</h3>
              <p className="text-gray-500 max-w-sm text-center font-medium">Set your parameters on the left and simulate to see how your futures divide.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

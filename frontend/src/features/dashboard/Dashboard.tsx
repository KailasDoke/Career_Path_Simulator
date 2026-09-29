import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight,
  Map,
  Settings,
  GraduationCap,
  Banknote,
  Calculator,
  Bot,
  LogOut,
  CheckCircle,
  Clock
} from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LandingPage from './LandingPage';

export default function Dashboard() {
  const { isAuthenticated, profile, userId, logout } = useAuth();
  const [pathways, setPathways] = useState<any[]>([]);
  const [scholarships, setScholarships] = useState<any[]>([]);
  const [loadingPathways, setLoadingPathways] = useState(true);

  useEffect(() => {
    if (isAuthenticated && userId) {
      // Fetch pathways
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/pathways/generate`, { studentId: userId })
        .then(res => {
          setPathways(res.data);
          setLoadingPathways(false);
        })
        .catch(e => {
          console.error("Failed to fetch pathways", e);
          setLoadingPathways(false);
        });

      // Fetch scholarships
      axios.get(`${import.meta.env.VITE_API_BASE_URL}/finance/scholarships/${userId}`)
        .then(res => {
          setScholarships(res.data);
        })
        .catch(e => {
          console.error("Failed to fetch scholarships", e);
        });
    }
  }, [isAuthenticated, userId]);

  if (!isAuthenticated) {
    return <LandingPage />;
  }

  const hasAssessment = !!profile?.aptitudeResult;

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-24">
      {/* Dashboard Header */}
      <section className="bg-white border-b border-gray-100 pt-8 pb-12 px-6 md:px-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 mb-2">
              Welcome back, {profile?.firstName}.
            </h1>
            <p className="text-lg text-gray-600">
              Continue exploring your career journey and personalized pathways.
            </p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 md:px-12 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Quick Actions & Status */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* Assessment Status */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Your Profile Status</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-full ${hasAssessment ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                  {hasAssessment ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                </div>
                <div>
                  <p className="font-bold text-gray-900">Career Assessment</p>
                  <p className="text-sm text-gray-500">{hasAssessment ? 'Completed' : 'Pending'}</p>
                </div>
              </div>
            </div>

            {!hasAssessment && (
              <Link to="/assessment" className="mt-6 flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors">
                Take Assessment <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/simulate" className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group">
              <Calculator className="w-8 h-8 text-indigo-500 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-1">Simulator</h4>
              <p className="text-xs text-gray-500">Test what-if scenarios</p>
            </Link>
            <Link to="/copilot" className="bg-white p-6 rounded-3xl border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all group">
              <Bot className="w-8 h-8 text-blue-500 mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-bold text-gray-900 mb-1">AI Copilot</h4>
              <p className="text-xs text-gray-500">Ask career questions</p>
            </Link>
          </div>

        </div>

        {/* Right Column: Pathways & Finance */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Generated Pathways */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Recommended Pathways</h2>
              <Link to="/pathways" className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {loadingPathways ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="w-full h-24 bg-white rounded-3xl border border-gray-100 animate-pulse"></div>
                ))}
              </div>
            ) : pathways.length > 0 ? (
              <div className="space-y-4">
                {pathways.slice(0, 3).map((p, i) => (
                  <Link to="/pathways" key={i} className="block bg-white p-6 rounded-3xl border border-gray-100 hover:shadow-md transition-all group">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-full mb-2">
                          {p.careerDomains?.[0] || 'Domain'}
                        </span>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-primary transition-colors">{p.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{p.durationYears} Years • Est. Cost: ₹{(p.estimatedTotalCost / 100000).toFixed(1)}L</p>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center">
                <Map className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">No Pathways Yet</h3>
                <p className="text-gray-500 mb-6">Take the assessment to get personalized career pathways.</p>
                <Link to="/assessment" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors">
                  Start Assessment
                </Link>
              </div>
            )}
          </div>

          {/* Funding Summary */}
          {scholarships.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Funding Opportunities</h2>
                <Link to="/finance" className="text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                  Explore <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {scholarships.slice(0, 2).map((s, i) => (
                  <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100">
                    <Banknote className="w-8 h-8 text-green-500 mb-4" />
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{s.name}</h3>
                    <p className="text-sm text-gray-500 mb-4 line-clamp-1">{s.eligibilityCriteria}</p>
                    <p className="font-black text-gray-900">₹{s.estimatedBenefit?.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

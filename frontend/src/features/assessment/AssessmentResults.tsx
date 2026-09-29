import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from 'recharts';
import { CheckCircle2, ChevronRight, Brain, Heart, ArrowRight } from 'lucide-react';

export default function AssessmentResults() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state;

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
        <div className="bg-slate-100 p-6 rounded-full">
          <Brain className="w-12 h-12 text-slate-400" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">No results found</h2>
          <p className="text-gray-500 mt-2 max-w-sm">Please take the exploratory assessment to view your personalized results.</p>
        </div>
        <Link to="/assessment" className="bg-primary hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-sm transition-all inline-flex items-center gap-2">
          Take Assessment <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const aptitudeData = Object.keys(data.aptitudeScores).map(key => ({
    subject: key.replace('_', ' '),
    A: data.aptitudeScores[key],
    fullMark: 100,
  }));

  const interestData = Object.keys(data.interestScores).map(key => ({
    name: key,
    score: data.interestScores[key],
  })).sort((a, b) => b.score - a.score);

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex bg-emerald-100 p-4 rounded-full text-emerald-600 mb-6 shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Assessment Complete</h1>
        <p className="text-lg text-gray-600">
          We've analyzed your responses. Here is an exploratory overview of your reasoning strengths and career interests.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Aptitude Profile */}
        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-2.5 rounded-xl text-blue-600">
              <Brain className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Aptitude Profile</h2>
          </div>
          
          <div className="flex-1 min-h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={aptitudeData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13, fontWeight: 500 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="A" stroke="#3b82f6" strokeWidth={3} fill="#3b82f6" fillOpacity={0.3} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Top Alignment</span>
            <p className="text-gray-900 font-semibold">{data.structuredProfile?.aptitudeStrengths?.join(', ') || 'Various reasoning types'}</p>
          </div>
        </div>

        {/* Interest Profile */}
        <div className="bg-white p-8 rounded-2xl border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Interest Profile</h2>
          </div>
          
          <div className="flex-1 min-h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interestData} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" tick={{ fill: '#475569', fontSize: 13, fontWeight: 500 }} width={100} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -2px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 600 }}
                />
                <Bar dataKey="score" fill="#10b981" radius={[0, 8, 8, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Strongest Interests</span>
            <p className="text-gray-900 font-semibold">{data.structuredProfile?.interests?.join(', ') || 'Mixed interests'}</p>
          </div>
        </div>

      </div>

      <div className="mt-12 bg-primary/5 rounded-2xl border border-primary/20 p-8 text-center flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h3 className="text-xl font-bold text-gray-900">Ready to see your future?</h3>
          <p className="text-gray-600 mt-1">We'll use these insights to generate custom career pathways.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto shrink-0">
          <Link to="/profile" className="inline-flex justify-center items-center bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium py-3 px-6 rounded-xl shadow-sm transition-all">
              Update Profile First
          </Link>
          <button 
            onClick={() => navigate('/pathways')}
            className="inline-flex justify-center items-center bg-primary hover:bg-blue-600 text-white font-medium py-3 px-8 rounded-xl shadow-sm transition-all group"
          >
              Generate Pathways <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
      
    </div>
  );
}

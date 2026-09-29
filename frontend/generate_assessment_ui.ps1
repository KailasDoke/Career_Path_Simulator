$baseDir = "C:\Users\kaila\Downloads\Career\career-path-simulator\frontend\src\features\assessment"

New-Item -ItemType Directory -Force -Path $baseDir

$engineCode = @"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/assessments/questions`)
      .then(res => {
        setQuestions(res.data);
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
    if (Object.keys(answers).length < questions.length) {
      alert('Please answer all questions before submitting.');
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/assessments/submit/1`, { answers });
      // Passing results via state navigation
      navigate('/assessment/results', { state: res.data });
    } catch (err) {
      console.error(err);
      alert('Failed to submit assessment.');
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-20">Loading assessment...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Exploratory Assessment</h1>
        <p className="text-gray-500 mb-6">
          This is an exploratory educational assessment designed to estimate your reasoning strengths and interests. 
          <strong> It is NOT a psychological diagnosis.</strong> There are no wrong answers for the interest section.
        </p>

        <div className="space-y-8">
          {questions.map((q, i) => (
            <div key={q.id} className="p-6 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 text-lg">{i + 1}. {q.question}</h3>
              <div className="space-y-3">
                {q.options.map(opt => (
                  <label key={opt} className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${answers[q.id] === opt ? 'bg-blue-50 border-primary' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>
                    <input 
                      type="radio" 
                      name={q.id} 
                      value={opt} 
                      checked={answers[q.id] === opt}
                      onChange={() => handleSelect(q.id, opt)}
                      className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                    />
                    <span className="ml-3 text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
          <button onClick={handleSubmit} className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow transition-all">
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  );
}
"@
Set-Content -Path "$baseDir\AssessmentEngine.tsx" -Value $engineCode

$resultsCode = @"
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, RadarChart } from 'recharts';

export default function AssessmentResults() {
  const location = useLocation();
  const data = location.state;

  if (!data) {
    return <div className="text-center py-20">No results found. Please take the assessment. <br/><Link to="/assessment" className="text-primary hover:underline mt-4 inline-block">Go to Assessment</Link></div>;
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
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Assessment Results</h1>
        <p className="text-gray-500 mb-8">
          Based on your responses, here is an exploratory overview of your reasoning strengths and career interests.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Aptitude Profile</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={aptitudeData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#4b5563', fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Score" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 font-medium">Your responses show stronger alignment with: <span className="text-gray-900 font-bold">{data.structuredProfile?.aptitudeStrengths?.join(', ') || 'Various reasoning types'}</span></p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Interest Profile</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={interestData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#4b5563', fontSize: 12 }} width={80} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#10b981" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600 font-medium">Your strongest interests are: <span className="text-gray-900 font-bold">{data.structuredProfile?.interests?.join(', ') || 'Mixed interests'}</span></p>
            </div>
          </div>

        </div>

        <div className="mt-10 text-center">
            <Link to="/profile" className="inline-block bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-lg shadow transition-all mr-4">
                Update Profile
            </Link>
            <button className="bg-primary hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg shadow transition-all">
                Generate My Pathways
            </button>
        </div>
      </div>
    </div>
  );
}
"@
Set-Content -Path "$baseDir\AssessmentResults.tsx" -Value $resultsCode

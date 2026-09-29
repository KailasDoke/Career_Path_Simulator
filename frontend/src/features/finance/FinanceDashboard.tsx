import React, { useState, useEffect } from 'react';
import { 
  BadgeIndianRupee, 
  Landmark, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Clock,
  Briefcase,
  TrendingUp,
  FileText
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Scholarship {
  name: string;
  provider: string;
  matchStatus: string;
  matchExplanation: string;
  estimatedBenefit: number;
  eligibilityCriteria: string;
  requiredDocuments: string;
  applicationInformation: string;
  source: string;
}

interface Loan {
  lenderName: string;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  estimatedEmi: number;
  estimatedTotalInterest: number;
  estimatedTotalRepayment: number;
  collateralRequired: boolean;
  assumptions: string;
}

const FinanceDashboard: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { userId: studentId } = useAuth();
  const targetAmount = 1500000; // Hardcoded demo target amount for loan comparison

  useEffect(() => {
    const fetchFinanceData = async () => {
      setLoading(true);
      try {
        const [scholarshipsRes, loansRes] = await Promise.all([
          fetch(`/api/finance/scholarships/${studentId}`),
          fetch(`/api/finance/loans/compare?amount=${targetAmount}`)
        ]);
        
        if (scholarshipsRes.ok) setScholarships(await scholarshipsRes.json());
        if (loansRes.ok) setLoans(await loansRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFinanceData();
  }, [studentId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Loading financial data & matches...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
          <BadgeIndianRupee className="w-8 h-8 text-primary" />
          Budget & Funding
        </h2>
        <p className="text-lg text-gray-500 mt-2">
          Explore scholarships, grants, and compare education loans to finance your chosen pathways.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-1 rounded-full">Matches</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{scholarships.length}</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">Eligible Scholarships Found</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col justify-between group hover:border-primary/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Landmark className="w-6 h-6" />
            </div>
            <span className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">Comparison</span>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-900">{loans.length}</h3>
            <p className="text-sm font-medium text-gray-500 mt-1">Loan Options Available</p>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 shadow-sm flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white opacity-10 rounded-full translate-x-8 translate-y-8" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="relative z-10">
            <p className="text-blue-100 text-sm font-medium mb-1">Target Funding Needed</p>
            <h3 className="text-3xl font-bold flex items-baseline gap-1">
              ₹{(targetAmount / 100000).toFixed(1)} <span className="text-lg text-blue-100">Lakhs</span>
            </h3>
          </div>
        </div>
      </div>

      {/* Scholarships Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-6 h-6 text-emerald-500" />
            Scholarships & Grants
          </h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {scholarships.length === 0 ? (
            <div className="col-span-2 text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">No scholarships found matching your profile yet.</p>
            </div>
          ) : (
            scholarships.map((s, idx) => {
              const isEligible = s.matchStatus.toLowerCase().includes('eligible') && !s.matchStatus.toLowerCase().includes('potentially');
              const isPotentially = s.matchStatus.toLowerCase().includes('potentially');
              
              const badgeClass = isEligible 
                ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                : isPotentially
                  ? 'bg-amber-50 text-amber-700 ring-amber-600/20'
                  : 'bg-slate-100 text-slate-700 ring-slate-600/20';
                  
              const Icon = isEligible ? CheckCircle2 : (isPotentially ? AlertCircle : Info);

              return (
                <div key={idx} className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col group overflow-hidden relative">
                  {isEligible && <div className="absolute top-0 right-0 w-1.5 h-full bg-emerald-500" />}
                  
                  <div className="p-6 flex-grow border-b border-gray-50">
                    <div className="flex justify-between items-start gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight">{s.name}</h3>
                        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" /> {s.provider}
                        </p>
                      </div>
                      <span className={cn("inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset whitespace-nowrap shrink-0", badgeClass)}>
                        <Icon className="w-3.5 h-3.5" />
                        {s.matchStatus}
                      </span>
                    </div>
                    
                    <div className="bg-slate-50/50 rounded-xl p-4 text-sm text-gray-700 border border-slate-100 relative">
                      <span className="font-semibold block mb-1 text-gray-900 text-xs uppercase tracking-wider">AI Analysis</span>
                      <p className="leading-relaxed">{s.matchExplanation}</p>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider mb-1">Est. Benefit</span>
                        <span className="font-bold text-gray-900 text-lg">
                          {s.estimatedBenefit ? `₹${s.estimatedBenefit.toLocaleString()}` : 'Variable'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px] font-bold uppercase tracking-wider mb-1">Requirements</span>
                        <div className="flex items-center gap-1 text-gray-700 font-medium">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="truncate" title={s.requiredDocuments}>{s.requiredDocuments || 'Basic details'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 px-6 py-3 flex justify-between items-center text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Source: {s.source}</span>
                    <button className="text-primary font-medium hover:underline flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details &rarr;
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Education Loans Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Landmark className="w-6 h-6 text-blue-500" />
              Education Loan Comparison
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Comparing options for your estimated requirement of <strong>₹{targetAmount.toLocaleString()}</strong>.
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-slate-50/80 text-gray-500 text-xs uppercase font-semibold border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 tracking-wider">Lender</th>
                  <th className="px-6 py-4 tracking-wider">Interest Rate</th>
                  <th className="px-6 py-4 tracking-wider">Tenure</th>
                  <th className="px-6 py-4 tracking-wider">Est. EMI</th>
                  <th className="px-6 py-4 tracking-wider">Total Repayment</th>
                  <th className="px-6 py-4 tracking-wider">Collateral</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loans.length === 0 ? (
                   <tr>
                     <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                       No loan comparisons available currently.
                     </td>
                   </tr>
                ) : (
                  loans.map((loan, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-bold text-gray-900 group-hover:text-primary transition-colors">
                        {loan.lenderName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-semibold border border-blue-100">
                          {loan.interestRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {loan.tenureMonths} mos
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-gray-900">
                        ₹{loan.estimatedEmi?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 font-semibold block">₹{loan.estimatedTotalRepayment?.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 font-medium mt-0.5 block">Interest: ₹{loan.estimatedTotalInterest?.toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        {loan.collateralRequired ? (
                          <span className="text-amber-700 font-semibold text-[11px] uppercase tracking-wider bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">Required</span>
                        ) : (
                          <span className="text-emerald-700 font-semibold text-[11px] uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center inline-flex gap-1">
                            <CheckCircle2 className="w-3 h-3"/> Not Required
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 bg-slate-50 border-t border-gray-100 flex items-start gap-2 text-xs text-gray-500">
            <Info className="w-4 h-4 text-gray-400 shrink-0" />
            <p>
              <strong className="text-gray-700 font-semibold">Assumptions:</strong> EMI and total interest are rough estimates calculated using standard reducing balance methods. This does not guarantee actual loan approval or final terms from the lender.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default FinanceDashboard;

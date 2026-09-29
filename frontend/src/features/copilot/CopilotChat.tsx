import { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User,
  Info,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ArrowRightCircle,
  MoreHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  details?: any; 
};

const SUGGESTED_PROMPTS = [
  "What careers match my interests?",
  "How much would this pathway cost?",
  "What scholarships could help me?",
  "What happens if my budget changes?",
  "What skills should I start learning?"
];

const CollapsibleSection = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white/50 border border-gray-100 rounded-2xl overflow-hidden mt-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-white/80 transition-colors"
      >
        <span className="font-semibold text-gray-700 flex items-center gap-2">
          <Icon className="w-4 h-4 text-primary" /> {title}
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};

export default function CopilotChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'init',
    sender: 'ai',
    text: 'Hi! I am your AI Career Copilot. I understand your specific generated pathways, costs, and options. Ask me anything about how to achieve your goals.'
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { userId: studentId } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend.trim()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`/api/copilot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg.text, studentId })
      });
      
      if (!res.ok) throw new Error('Failed to ask Copilot');
      
      const data = await res.json();
      
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.answer,
        details: data
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: 'Sorry, I am currently unable to connect to the Copilot Engine.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen pt-20 flex flex-col bg-slate-50 font-sans">
      
      {/* Immersive Header */}
      <div className="bg-gradient-to-b from-gray-900 to-slate-900 text-white p-8 md:p-12 text-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mt-20 -mr-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] -mb-20 -ml-20"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center mb-6 shadow-lg border border-white/20">
            <Sparkles className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">AI CAREER COPILOT</h1>
          <p className="text-lg text-gray-300 font-medium">Your personal guide to navigating your future possibilities.</p>
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-0">
        <div className="max-w-4xl mx-auto space-y-8">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            
            return (
              <div key={msg.id} className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
                
                {!isUser && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white shrink-0 mr-4 shadow-xl border border-gray-700">
                    <Bot className="w-5 h-5" />
                  </div>
                )}
                
                <div className={cn(
                  "max-w-[85%] md:max-w-[75%]", 
                  isUser ? "flex flex-col items-end" : "flex flex-col items-start"
                )}>
                  {/* Main Bubble */}
                  <div className={cn(
                    "p-6 rounded-3xl text-lg shadow-sm font-medium leading-relaxed",
                    isUser 
                      ? "bg-gray-900 text-white rounded-tr-sm" 
                      : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-xl shadow-gray-200/50"
                  )}>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  
                  {/* Structured Details (AI Only) */}
                  {!isUser && msg.details && (
                    <div className="w-full mt-2">
                      
                      {(msg.details.why || msg.details.evidence || msg.details.assumptions) && (
                        <CollapsibleSection title="Why this answer?" icon={Info}>
                          {msg.details.why && (
                            <div className="mb-4">
                              <span className="font-bold text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Reasoning</span>
                              <p className="text-gray-700 text-sm font-medium">{msg.details.why}</p>
                            </div>
                          )}
                          
                          {msg.details.evidence && (
                            <div className="mb-4">
                              <span className="font-bold text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Evidence / Source</span>
                              <p className="text-gray-600 text-sm flex items-start gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                <BookOpen className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                                <span className="italic">{msg.details.evidence}</span>
                              </p>
                            </div>
                          )}
                          
                          {msg.details.assumptions && (
                            <div>
                              <span className="font-bold text-[10px] uppercase tracking-widest text-gray-400 block mb-1">Assumptions Made</span>
                              <p className="text-gray-700 text-sm flex items-start gap-2 bg-amber-50 p-3 rounded-xl border border-amber-100/50">
                                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                                {msg.details.assumptions}
                              </p>
                            </div>
                          )}
                        </CollapsibleSection>
                      )}

                      {msg.details.uncertainty && (
                        <div className="bg-amber-50 border border-amber-100/50 rounded-2xl p-4 flex items-start gap-3 mt-4">
                          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-xs uppercase tracking-widest text-amber-800 block mb-1">Uncertainty Notice</span>
                            <p className="text-amber-700 text-sm font-medium">{msg.details.uncertainty}</p>
                          </div>
                        </div>
                      )}

                      {/* Actionable Next Step Button */}
                      {msg.details.nextStep && (
                        <button 
                          onClick={() => handleSend(msg.details.nextStep)}
                          className="mt-4 w-full bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-100 p-4 rounded-2xl flex items-center justify-between group transition-all text-left"
                        >
                          <div>
                            <span className="font-bold text-[10px] uppercase tracking-widest text-blue-500 block mb-1">Suggested Next Step</span>
                            <p className="text-blue-900 font-bold">{msg.details.nextStep}</p>
                          </div>
                          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-blue-100 group-hover:scale-110 transition-transform">
                            <ArrowRightCircle className="w-5 h-5 text-primary" />
                          </div>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {isUser && (
                  <div className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500 shrink-0 ml-4 shadow-sm border border-gray-300">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}
          
          {loading && (
            <div className="flex justify-start">
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-white shrink-0 mr-4 shadow-xl border border-gray-700">
                  <Bot className="w-5 h-5" />
                </div>
              <div className="bg-white border border-gray-100 text-gray-500 rounded-3xl rounded-tl-sm shadow-xl shadow-gray-200/50 px-6 py-5 flex items-center gap-3 font-medium">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                </div>
                Analyzing possibilities...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] shrink-0 z-20">
        <div className="max-w-4xl mx-auto">
          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <button 
                  key={i}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-sm font-medium bg-slate-100 hover:bg-gray-900 hover:text-white border border-slate-200 text-gray-700 py-2.5 px-5 rounded-full transition-colors whitespace-nowrap"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your career paths, costs, or how to get started..."
              className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-full shadow-inner p-5 pr-16 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-lg font-medium text-gray-900 placeholder:text-gray-400 outline-none"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading || !input.trim()}
              className="absolute right-3 bg-gray-900 hover:bg-black disabled:bg-slate-300 disabled:text-slate-500 text-white p-3 rounded-full shadow-lg transition-all flex items-center justify-center hover:scale-105 active:scale-95"
            >
              <Send className="w-5 h-5 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

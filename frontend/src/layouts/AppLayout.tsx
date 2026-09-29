import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Map, 
  Calculator, 
  BadgeIndianRupee, 
  Bot, 
  User, 
  Menu,
  X,
  Bell,
  Search,
  Settings,
  GraduationCap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '../context/AuthContext';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'My Pathways', href: '/pathways', icon: Map },
  { name: 'Simulator', href: '/simulate', icon: Calculator },
  { name: 'Assessment', href: '/assessment', icon: GraduationCap },
  { name: 'Budget & Funding', href: '/finance', icon: BadgeIndianRupee },
  { name: 'AI Copilot', href: '/copilot', icon: Bot },
];

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname === '/';
  const { isAuthenticated, profile } = useAuth();
  
  const firstName = profile?.firstName || 'Student';
  const lastName = profile?.lastName || '';
  const initial = firstName.charAt(0) || 'S';

  if (isDashboard) {
    return (
      <div className="min-h-screen bg-background font-sans flex flex-col">
        <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary text-white p-2.5 rounded-xl shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">CareerPath</span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              {isAuthenticated ? (
                <>
                  <Link to="/pathways" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Pathways</Link>
                  <Link to="/simulate" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Simulator</Link>
                  <Link to="/finance" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Funding</Link>
                  <Link to="/copilot" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Copilot</Link>
                  <Link to="/profile" className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white font-semibold flex items-center justify-center shadow-md uppercase">
                    {initial}
                  </Link>
                </>
              ) : (
                <>
                  <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">How It Works</a>
                  <Link to="/login" className="text-sm font-medium text-white bg-gray-900 hover:bg-black px-5 py-2.5 rounded-full transition-colors">Login</Link>
                </>
              )}
            </nav>
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-600">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Mobile menu for dashboard */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-[60] flex md:hidden">
            <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
              <div className="absolute top-0 right-0 -mr-12 pt-4">
                <button className="ml-1 h-10 w-10 rounded-full flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" onClick={() => setSidebarOpen(false)}>
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto pt-5 pb-4">
                <div className="flex items-center px-4 gap-2 mb-8">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <span className="text-xl font-bold text-gray-900 tracking-tight">CareerPath</span>
                </div>
                <nav className="px-2 space-y-1">
                  {navigation.map((item) => (
                    <Link key={item.name} to={item.href} onClick={() => setSidebarOpen(false)} className="group flex items-center px-3 py-3 text-base rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900">
                      <item.icon className="mr-4 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 w-full pt-20">
          <Outlet />
        </main>
      </div>
    );
  }

  // Original Admin-like Layout for internal pages
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b border-border sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-900">CareerPath</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary rounded-md"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm transition-opacity" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transition duration-300 ease-in-out">
            <div className="absolute top-0 right-0 -mr-12 pt-4">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 gap-2">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-gray-900 tracking-tight">CareerPath</span>
              </div>
              <nav className="mt-8 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        isActive ? 'bg-primary/10 text-primary font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                        'group flex items-center px-3 py-3 text-base rounded-md transition-colors'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-4 flex-shrink-0 h-6 w-6'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link to="/profile" className="flex-shrink-0 group block" onClick={() => setSidebarOpen(false)}>
                <div className="flex items-center">
                  <div>
                    <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-primary text-white font-bold uppercase">
                      {initial}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-base font-medium text-gray-700 group-hover:text-gray-900">{firstName} {lastName}</p>
                    <p className="text-sm font-medium text-gray-500 group-hover:text-gray-700">View settings</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20 border-r border-border bg-white">
        <div className="flex-1 flex flex-col min-h-0 bg-white">
          <div className="flex-1 flex flex-col pt-6 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 gap-3 mb-8">
              <div className="bg-primary/10 p-2.5 rounded-xl text-primary shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">CareerPath</span>
            </div>
            
            <div className="px-4 mb-4">
              <div className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Main Menu
              </div>
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href || (item.href !== '/' && location.pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        isActive ? 'bg-primary/5 text-primary font-medium border-l-2 border-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-2 border-transparent',
                        'group flex items-center px-3 py-2.5 text-sm rounded-r-md transition-all duration-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500',
                          'mr-3 flex-shrink-0 h-5 w-5'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
          
          <div className="flex-shrink-0 flex border-t border-gray-100 p-4">
            <Link to="/profile" className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div>
                  <div className="inline-flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white font-semibold shadow-sm uppercase">
                    {initial}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">{firstName} {lastName}</p>
                  <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">Settings</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="md:pl-72 flex flex-col flex-1 w-full min-h-screen">
        {/* Desktop Header */}
        <div className="hidden md:flex sticky top-0 z-10 flex-shrink-0 h-16 bg-white border-b border-border shadow-sm items-center justify-between px-8">
          <div className="flex-1 flex justify-start">
            <div className="max-w-md w-full relative text-gray-400 focus-within:text-gray-600">
              <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
                <Search className="h-4 w-4" aria-hidden="true" />
              </div>
              <input
                id="search-field"
                className="block w-full h-full pl-10 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm bg-gray-50/50 rounded-full border"
                placeholder="Search pathways, scholarships..."
                type="search"
                name="search"
              />
            </div>
          </div>
          <div className="ml-4 flex items-center gap-4 md:ml-6">
            <button className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative transition-colors">
              <span className="sr-only">View notifications</span>
              <Bell className="h-5 w-5" aria-hidden="true" />
              <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
            <Link to="/profile" className="bg-white p-2 rounded-full text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors">
              <span className="sr-only">Settings</span>
              <Settings className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto focus:outline-none bg-slate-50">
          <div className="py-6 px-4 sm:px-6 md:px-8 mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

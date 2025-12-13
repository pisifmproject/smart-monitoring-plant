

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { login as authLogin } from '../services/auth';
import { Lock, User as UserIcon, ArrowRight, ShieldCheck } from 'lucide-react';

// FIX: Moved AlertTriangleIcon before usage to prevent ReferenceError.
// Helper Icon for error
const AlertTriangleIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <path d="M12 9v4"/>
        <path d="M12 17h.01"/>
    </svg>
);

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        if (!username || !password) {
            setError("Please enter your credentials.");
            setIsLoading(false);
            return;
        }

        // Simulate network delay for better UX feel
        setTimeout(() => {
            const authenticatedUser = authLogin(username, password);

            if (authenticatedUser) {
                onLogin(authenticatedUser);
                navigate('/app');
            } else {
                setError('Invalid credentials provided. Please contact your system administrator.');
                setIsLoading(false);
            }
        }, 800);
    };

    return (
        <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans selection:bg-blue-500/30">
            {/* Left Side - Visual / Branding (Visible on Large Screens) */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 bg-slate-900 border-r border-slate-800 overflow-hidden">
                 {/* Background Effects */}
                 <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
                 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
                 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none"></div>

                 <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="text-xl font-bold text-white tracking-tight">PT Indofood Fortuna Makmur</span>
                    </div>
                    
                    <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-6">
                        Operational Excellence <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            Through Real-time Data.
                        </span>
                    </h1>
                    <p className="text-slate-300 text-lg max-w-lg leading-relaxed border-l-2 border-blue-500/50 pl-6">
                        Enterprise-grade monitoring solution for multi-plant industrial operations. 
                        Track performance, utilities, and machine health in one unified platform.
                    </p>
                 </div>

                 <div className="relative z-10 flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider animate-in fade-in duration-1000 delay-300">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <span>Secure Enterprise Environment</span>
                 </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 bg-slate-950 relative">
                {/* Mobile Header (Visible on Small Screens) */}
                <div className="absolute top-8 left-8 lg:hidden flex items-center gap-3">
                    <span className="text-sm font-bold text-white tracking-tight">PT IFM</span>
                </div>

                <div className="w-full max-w-[400px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                    
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-slate-300 mt-2 text-sm">Sign in to access the Smart Monitoring System.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in zoom-in-95">
                            <AlertTriangleIcon size={18} className="shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Corporate ID / Username</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <UserIcon className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="text" 
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-lg leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-900 transition-all shadow-sm text-sm font-medium"
                                        placeholder="Enter your username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input 
                                        type="password" 
                                        className="block w-full pl-10 pr-3 py-3 border border-slate-800 rounded-lg leading-5 bg-slate-900/50 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-slate-900 transition-all shadow-sm text-sm font-medium"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-700 bg-slate-800 rounded cursor-pointer" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-300 cursor-pointer hover:text-slate-200">Remember me</label>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/40 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Authenticating...
                                    </span>
                                ) : (
                                    <>
                                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                                            <ArrowRight className="h-5 w-5 text-blue-400 group-hover:text-blue-200 transition-colors" />
                                        </span>
                                        Sign In to Dashboard
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                    
                    <div className="pt-8 mt-8 border-t border-slate-900 text-center">
                        <button onClick={() => navigate('/')} className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors uppercase tracking-widest">
                            ← Return to Landing Page
                        </button>
                        <p className="text-[10px] text-slate-300 mt-4 leading-relaxed max-w-xs mx-auto">
                            By signing in, you agree to comply with the company's IT security policies and procedures.
                        </p>
                    </div>
                </div>

                <div className="absolute bottom-6 text-[10px] text-slate-300 font-medium">
                    © 2025 PT Indofood Fortuna Makmur. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { login as authLogin } from '../services/auth'; // Import the actual login service

interface LoginProps {
    onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!username || !password) {
            setError("Please enter username and password.");
            return;
        }

        // Use the actual authentication service
        const authenticatedUser = authLogin(username, password);

        if (authenticatedUser) {
            onLogin(authenticatedUser);
            // The main App component will handle the redirect after login
            navigate('/app');
        } else {
            setError('Invalid username or password. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-950 px-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md shadow-xl">
                
                <div className="text-center mb-6">
                    <div className="mx-auto mb-4 w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-blue-400 text-2xl font-bold">S</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Smart Monitoring</h1>
                    <p className="text-slate-400 text-sm">Multi-Plant Industrial System</p>
                </div>

                {error && (
                    <p className="bg-rose-900/50 border border-rose-500/30 text-rose-400 text-sm mb-4 text-center p-3 rounded-lg">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-slate-400 text-sm font-semibold">USERNAME</label>
                        <input
                            type="text"
                            className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-0 outline-none"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-slate-400 text-sm font-semibold">PASSWORD</label>
                        <input
                            type="password"
                            className="w-full mt-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:ring-0 outline-none"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition-all"
                    >
                        Sign In
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-lg transition-all"
                    >
                        Cancel
                    </button>
                </form>

                <p className="text-center text-slate-500 text-xs mt-6">
                    Protected System. Authorized Access Only.
                </p>
            </div>
        </div>
    );
};

export default Login;
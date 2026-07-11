import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './main';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [view, setView] = useState('login'); // 'login', 'register', 'forgot'
    const navigate = useNavigate();
    const auth = useAuth();

    const handleLogin = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // CRITICAL: Ensure this is here
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Login failed');
            }

            auth?.setAuthenticated(true);
            navigate('/');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleRegister = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            setView('login');
            setError('');
            setMessage('Registration successful! Please log in.');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleForgotPassword = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Request failed');
            }
            
            const data = await response.json();
            setMessage(data.message);
            setError('');
            setView('login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        if (view === 'login') {
            handleLogin();
        } else if (view === 'register') {
            handleRegister();
        } else {
            handleForgotPassword();
        }
    };

    const renderForm = () => {
        if (view === 'forgot') {
            return (
                <>
                    <div className="login-header">
                        <h2>Forgot Password</h2>
                        <p>Enter your email to receive a reset link.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="fields">
                        <label>
                            <span>EMAIL</span>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </label>
                        <button className="primary-action" type="submit">Send Reset Link</button>
                    </form>
                    <div className="register-link">
                        <a href="#" onClick={() => setView('login')}>Back to Login</a>
                    </div>
                </>
            );
        }

        return (
            <>
                <div className="login-header">
                    <h2>{view === 'register' ? 'Create an account' : 'Welcome back!'}</h2>
                    <p>{view === 'register' ? 'Let\'s get you started!' : 'We\'re so excited to see you again!'}</p>
                </div>
                <form onSubmit={handleSubmit} className="fields">
                    <label>
                        <span>USERNAME</span>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label>
                        <span>PASSWORD</span>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    {view === 'login' && <a href="#" onClick={() => setView('forgot')} className="forgot-password">Forgot your password?</a>}
                    <button className="primary-action" type="submit">
                        {view === 'register' ? 'Register' : 'Log In'}
                    </button>
                </form>
                <div className="register-link">
                    {view === 'register' ? (
                        <>
                            Already have an account? <a href="#" onClick={() => setView('login')}>Log In</a>
                        </>
                    ) : (
                        <>
                            Need an account? <a href="#" onClick={() => setView('register')}>Register</a>
                        </>
                    )}
                </div>
            </>
        );
    };

    return (
        <div className="login-page">
            <div className="login-box">
                {message && <p className="message" style={{color: 'green'}}>{message}</p>}
                {error && <p className="error" style={{color: 'red'}}>{error}</p>}
                {renderForm()}
            </div>
        </div>
    );
}

export default LoginPage;
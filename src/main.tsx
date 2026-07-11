import React, { createContext, useContext, useEffect, useState, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import LoginPage from "./LoginPage";
import "./styles.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DashboardPage = React.lazy(() => import("./DashboardPage"));
const ProfilePage = React.lazy(() => import("./ProfilePage"));

type AuthContextType = {
    authenticated: boolean;
    setAuthenticated: (authenticated: boolean) => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
    return useContext(AuthContext);
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/auth/status`);
                if (response.ok) {
                    const data = await response.json();
                    setAuthenticated(data.authenticated);
                }
            } catch (error) {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, []);

    return (
        <AuthContext.Provider value={{ authenticated, setAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const auth = useAuth();
    const location = useLocation();

    if (auth?.loading) {
        return <div className="loading-spinner"></div>;
    }

    return auth?.authenticated ? children : <Navigate to="/login" state={{ from: location }} replace />;
};

const AppWrapper = () => {
    return (
        <Router>
            <AuthProvider>
                <Suspense fallback={<div className="loading-spinner"></div>}>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
                        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
};

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
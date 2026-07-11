import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./main";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ProfilePage() {
  const navigate = useNavigate();
  const auth = useAuth();

  async function logout() {
    await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST' });
    auth?.setAuthenticated(false);
    navigate('/login');
  }

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="label">Creator Studio</p>
          <h1>Profile</h1>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/')} className="dashboard-button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
            </svg>
          </button>
          <button onClick={logout} className="logout-button">Logout</button>
        </div>
      </header>
      <section className="layout">
        <div className="panel">
          <div className="profile-details">
            <Field label="Name">
              <input type="text" defaultValue="Sushil" />
            </Field>
            <Field label="Email">
              <input type="email" defaultValue="sushil@example.com" />
            </Field>
            <Field label="Password">
              <input type="password" placeholder="New password" />
            </Field>
            <button className="primary-action" type="button">Update Profile</button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label>
      <span>{label}</span>
      {children}
    </label>
  );
}
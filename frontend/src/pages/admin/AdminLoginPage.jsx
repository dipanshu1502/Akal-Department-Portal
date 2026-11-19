import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, Shield, KeyRound, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser } from '../../services/api';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('super@akal.ac.in');
  const [password, setPassword] = useState('Akal@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser({ email: email.trim(), password });
      const user = res.user;

      if (user?.role === 'super_admin') {
        navigate('/admin/super');
      } else {
        navigate('/admin/department');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'super') {
      setEmail('super@akal.ac.in');
      setPassword('Akal@123');
    } else {
      setEmail('deptadmin@akal.ac.in');
      setPassword('Akal@123');
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">
            <BookOpen size={24} />
          </div>
          <div className="login-brand-text">
            <h2>Akal University</h2>
            <span>Department Management CMS Portal</span>
          </div>
        </div>

        {error && (
          <div className="login-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="login-email">Administrative Email Address</label>
            <div className="login-input-wrapper">
              <Mail size={16} className="login-input-icon" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@akal.ac.in"
                required
              />
            </div>
          </div>

          <div className="login-form-group">
            <label htmlFor="login-password">Password</label>
            <div className="login-input-wrapper">
              <KeyRound size={16} className="login-input-icon" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary login-submit-btn"
            disabled={loading}
          >
            <Shield size={16} />
            <span>{loading ? 'Authenticating...' : 'Sign in to Dashboard'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Quick Demo Credentials Bar */}
        <div className="login-demo">
          <span className="login-demo-label">Quick Demo Logins:</span>
          <div className="login-demo-buttons">
            <button
              type="button"
              className="btn-secondary login-demo-btn"
              onClick={() => setDemoCredentials('super')}
            >
              Super Admin
            </button>
            <button
              type="button"
              className="btn-secondary login-demo-btn"
              onClick={() => setDemoCredentials('dept')}
            >
              Dept Admin (CSE/Physics)
            </button>
          </div>
        </div>

        <div className="login-footer">
          <Link to="/departments" className="login-return-link">
            ← Return to Public University Portal
          </Link>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle } from 'lucide-react';
import { getSystemSettings, updateSystemSettings } from '../../services/api';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getSystemSettings()
      .then((data) => setSettings(Array.isArray(data) ? data : data?.data ?? []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, val) => {
    setSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, value: val } : s))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      await updateSystemSettings(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Portal Configuration
        </span>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
          Central University Settings
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
          Manage global institution identifiers, helpline contact numbers, and portal publishing policies.
        </p>
      </div>

      <div className="admin-card-panel" style={{ maxWidth: 840 }}>
        <div className="panel-header-bar">
          <h2>Global Portal Parameters</h2>
          {success && (
            <span style={{ color: '#15803D', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              <CheckCircle size={16} /> Settings saved successfully!
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          {loading ? (
            <p style={{ color: '#64748B' }}>Loading settings...</p>
          ) : (
            settings.map((item) => (
              <div key={item.key} className="form-group-admin">
                <label>
                  {item.description || item.key.replace(/_/g, ' ').toUpperCase()}
                  <small style={{ color: '#94A3B8', marginLeft: 8 }}>({item.key})</small>
                </label>
                <input
                  type="text"
                  value={item.value || ''}
                  onChange={(e) => handleChange(item.key, e.target.value)}
                />
              </div>
            ))
          )}

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn-primary" disabled={saving || loading}>
              <Save size={16} />
              <span>{saving ? 'Saving...' : 'Save System Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

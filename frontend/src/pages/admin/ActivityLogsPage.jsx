import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, Building2 } from 'lucide-react';
import { getActivityLogs } from '../../services/api';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLogs()
      .then((data) => setLogs(Array.isArray(data) ? data : data?.data ?? []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Security & Traceability
        </span>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
          System Audit Activity Logs
        </h1>
        <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
          Historical record of administrative actions, content updates, section builder submissions, and reviews.
        </p>
      </div>

      <div className="admin-card-panel">
        <div className="panel-header-bar">
          <h2>Recorded Events ({logs.length})</h2>
          <span style={{ fontSize: 13, color: '#64748B' }}>Showing last 50 entries</span>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Action Type</th>
                <th>Description</th>
                <th>Department</th>
                <th>Administrator</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    Loading system logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id}>
                    <td style={{ fontSize: 12, color: '#64748B', whiteSpace: 'nowrap' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                    <td>
                      <span className="status-pill approved" style={{ fontSize: 11 }}>
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td><strong>{log.description}</strong></td>
                    <td>{log.department?.name || '—'}</td>
                    <td>{log.user?.name || log.user?.email || 'System'}</td>
                    <td style={{ fontFamily: 'monospace', fontSize: 12, color: '#64748B' }}>
                      {log.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

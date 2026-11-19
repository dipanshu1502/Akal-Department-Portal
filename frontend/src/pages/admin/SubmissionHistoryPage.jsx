import React, { useState, useEffect } from 'react';
import { History, Clock, CheckCircle, XCircle, Globe, MessageSquare } from 'lucide-react';
import { getRevisions, getAdminDepartments } from '../../services/api';

export default function SubmissionHistoryPage() {
  const [revisions, setRevisions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDepartments()
      .then((depts) => {
        const list = Array.isArray(depts) ? depts : depts?.departments ?? [];
        setDepartments(list);
        if (list.length > 0) {
          setSelectedDeptId(String(list[0].id));
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const refreshRevisions = () => {
    if (!selectedDeptId) return;
    setLoading(true);
    getRevisions({ department_id: selectedDeptId })
      .then((data) => {
        setRevisions(Array.isArray(data) ? data : data?.data ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refreshRevisions();
  }, [selectedDeptId]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#087BB5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Workflow Audit
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#172333', margin: '4px 0 0' }}>
            Submission & Approval History
          </h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
            Track your submitted section drafts, approval decisions, and reviewer comments from Super Admin.
          </p>
        </div>

        {departments.length > 1 && (
          <select
            value={selectedDeptId}
            onChange={(e) => setSelectedDeptId(e.target.value)}
            className="faculty-filter-select"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="admin-card-panel">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Submission Title</th>
                <th>Content Type</th>
                <th>Submitted On</th>
                <th>Current Status</th>
                <th>Reviewer Feedback</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    Loading submission history...
                  </td>
                </tr>
              ) : revisions.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 36, color: '#64748B' }}>
                    <History size={36} color="#94A3B8" style={{ marginBottom: 12 }} />
                    <p style={{ margin: 0, fontWeight: 600 }}>No submissions made for this department yet.</p>
                  </td>
                </tr>
              ) : (
                revisions.map((rev) => (
                  <tr key={rev.id}>
                    <td>
                      <strong>{rev.title}</strong>
                      <div style={{ fontSize: 11.5, color: '#64748B' }}>
                        ID: #{rev.id}
                      </div>
                    </td>
                    <td>
                      <span className="status-pill draft" style={{ fontSize: 11 }}>
                        {rev.model_type}
                      </span>
                    </td>
                    <td style={{ fontSize: 12.5, color: '#64748B' }}>
                      <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {new Date(rev.created_at).toLocaleString()}
                    </td>
                    <td>
                      <span className={`status-pill ${rev.status}`}>
                        {rev.status}
                      </span>
                    </td>
                    <td>
                      {rev.review_comments ? (
                        <div style={{
                          fontSize: 13,
                          color: rev.status === 'rejected' ? '#B91C1C' : '#15803D',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                        }}>
                          <MessageSquare size={13} />
                          <span>{rev.review_comments}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: 12, fontStyle: 'italic' }}>
                          Awaiting review
                        </span>
                      )}
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

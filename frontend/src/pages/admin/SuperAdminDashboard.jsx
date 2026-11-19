import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckSquare,
  Users,
  GraduationCap,
  Layers,
  Activity,
  Plus,
  ArrowRight,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { getAdminStats } from "../../services/api";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pending = loading ? 0 : (stats?.pending_approvals ?? 0);

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <span className="kicker">Akal University - System Overview</span>
          <h1>Super Admin Control Center</h1>
          <p>Central management of departments, users, approvals and portal settings.</p>
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/super/approvals" className="btn-secondary">
            <CheckSquare size={16} />
            <span>Review Approvals</span>
            {pending > 0 && <span className="sidebar-nav-badge" style={{ marginLeft: 6 }}>{pending}</span>}
          </Link>
          <Link to="/admin/super/departments" className="btn-primary">
            <Plus size={16} />
            <span>Manage Departments</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Total Departments</span>
            <h3>{loading ? "..." : stats?.total_departments ?? 0}</h3>
          </div>
          <div className="stat-card-icon blue">
            <Building2 size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Published on Portal</span>
            <h3>{loading ? "..." : stats?.published_departments ?? 0}</h3>
          </div>
          <div className="stat-card-icon green">
            <ShieldCheck size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Pending Approvals</span>
            <h3 style={{ color: pending > 0 ? "#D97706" : "#172333" }}>
              {loading ? "..." : pending}
            </h3>
          </div>
          <div className="stat-card-icon yellow">
            <Clock size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Faculty Members</span>
            <h3>{loading ? "..." : stats?.total_faculty ?? 0}</h3>
          </div>
          <div className="stat-card-icon purple">
            <Users size={24} />
          </div>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="admin-nav-grid">
        <div className="admin-nav-card">
          <div className="nav-card-icon blue">
            <Building2 size={20} />
          </div>
          <div className="nav-card-body">
            <h3 className="nav-card-title">Department Management</h3>
            <p className="nav-card-desc">
              Create, edit, activate or archive departments and assign department administrators.
            </p>
            <div className="nav-card-actions">
              <Link to="/admin/super/departments" className="btn-primary">
                <Layers size={13} />
                <span>Manage Departments</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-nav-card">
          <div className="nav-card-icon yellow">
            <CheckSquare size={20} />
          </div>
          <div className="nav-card-body">
            <h3 className="nav-card-title">Content Approvals</h3>
            <p className="nav-card-desc">
              Review and publish pending department content revisions submitted by faculty admins.
            </p>
            <div className="nav-card-actions">
              <Link to="/admin/super/approvals" className="btn-secondary">
                <span>Review Pending</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>

        <div className="admin-nav-card">
          <div className="nav-card-icon purple">
            <Users size={20} />
          </div>
          <div className="nav-card-body">
            <h3 className="nav-card-title">User & Admin Roles</h3>
            <p className="nav-card-desc">
              Manage administrator accounts, roles and department assignments across the university.
            </p>
            <div className="nav-card-actions">
              <Link to="/admin/super/users" className="btn-secondary">
                <span>Manage Users</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Audit Logs Panel */}
      <div className="admin-card-panel" style={{ padding: 0 }}>
        <div className="panel-header-bar">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="nav-card-icon green" style={{ marginBottom: 0 }}>
              <Activity size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>System Audit Logs</h3>
              <small style={{ color: "#64748B" }}>Action traceability</small>
            </div>
          </div>
        </div>
        <div style={{ padding: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <p style={{ color: "#475569", margin: 0, flex: 1 }}>
            Track every department creation, admin assignment, section edit, approval decision, and
            publication timestamp across university department pages.
          </p>
          <Link to="/admin/super/activity-logs" className="btn-secondary">
            <span>View Full Audit Trail</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* Recent Activity Logs Feed */}
      <div className="admin-card-panel">
        <div className="panel-header-bar">
          <div>
            <h2>Recent Administrative Activities</h2>
            <p>Live audit trail of changes made across university department pages.</p>
          </div>
          <Link to="/admin/super/activity-logs" className="btn-secondary" style={{ fontSize: 12 }}>
            View All Logs
          </Link>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Description</th>
                <th>Department</th>
                <th>Performed By</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#64748B" }}>
                    Loading recent activity...
                  </td>
                </tr>
              ) : stats?.recent_activities?.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: 24, color: "#64748B" }}>
                    No recent administrative activities recorded.
                  </td>
                </tr>
              ) : (
                stats?.recent_activities?.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <span className="status-pill approved" style={{ fontSize: 11 }}>
                        {log.action.replace("_", " ")}
                      </span>
                    </td>
                    <td><strong>{log.description}</strong></td>
                    <td>{log.department?.name || "-"}</td>
                    <td>{log.user?.name || "System"}</td>
                    <td style={{ color: "#64748B", fontSize: 12 }}>
                      {new Date(log.created_at).toLocaleString()}
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


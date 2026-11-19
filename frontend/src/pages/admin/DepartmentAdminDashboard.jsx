import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Layers,
  Users,
  GraduationCap,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldAlert,
} from "lucide-react";
import { getAdminStats, getAdminDepartments } from "../../services/api";

export default function DepartmentAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAdminStats(), getAdminDepartments()])
      .then(([sData, dData]) => {
        setStats(sData);
        setDepartments(Array.isArray(dData) ? dData : dData?.departments ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const pending = loading ? 0 : (stats?.pending_revisions ?? 0);

  return (
    <div className="admin-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <span className="kicker">Department Admin • Academic Workspace</span>
          <h1>Department Content Dashboard</h1>
          <p>Manage your assigned department information, faculty profiles, curricula, page builder layouts, and review submissions.</p>
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/department/profile" className="btn-primary">
            <Users size={16} />
            <span>Manage Department Profile</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Assigned Departments</span>
            <h3>{loading ? "-" : departments.length}</h3>
          </div>
          <div className="stat-card-icon blue">
            <Building2 size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Faculty Members</span>
            <h3>{loading ? "-" : stats?.total_faculty ?? 0}</h3>
          </div>
          <div className="stat-card-icon green">
            <Users size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Programmes Offered</span>
            <h3>{loading ? "-" : stats?.total_programmes ?? 0}</h3>
          </div>
          <div className="stat-card-icon purple">
            <GraduationCap size={24} />
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-text">
            <span>Pending Approvals</span>
            <h3 style={{ color: pending > 0 ? "#D97706" : "#172333" }}>
              {loading ? "-" : pending}
            </h3>
          </div>
          <div className="stat-card-icon yellow">
            <Clock size={24} />
          </div>
        </div>
      </div>

      {/* Assigned Departments */}
      <div className="admin-card-panel">
        <div className="panel-header-bar">
          <div>
            <h2>Your Assigned Departments ({departments.length})</h2>
            <p>Authorized for content management</p>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: 32, textAlign: "center", color: "#64748B" }}>
            Loading department assignments...
          </div>
        ) : departments.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#64748B" }}>
            <ShieldAlert size={40} color="#D97706" style={{ marginBottom: 12 }} />
            <p style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
              No departments currently assigned to your account.
            </p>
            <small>Please contact the Super Administrator to assign departments.</small>
          </div>
        ) : (
          <div className="admin-dept-grid">
            {departments.map((dept) => (
              <div key={dept.id} className="dept-card">
                <div className="dept-card-head">
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#087BB5", textTransform: "uppercase" }}>
                    {dept.faculty?.name || "Academic Faculty"}
                  </span>
                  <span className={`status-pill ${dept.is_published ? "published" : "pending"}`}>
                    {dept.is_published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="dept-card-body">
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: "#172333", margin: "0 0 8px 0" }}>
                    {dept.name}
                  </h3>
                  <p style={{ fontSize: 13.5, color: "#475569", lineHeight: 1.5, margin: 0 }}>
                    {dept.short_description || dept.description}
                  </p>
                </div>
                <div className="dept-card-actions">
                  <Link to="/admin/department/sections" className="btn-primary">
                    <Layers size={13} />
                    <span>Page Builder</span>
                  </Link>
                  <Link to="/admin/department/modules?tab=faculty" className="btn-secondary">
                    <Users size={13} />
                    <span>Faculty & Staff</span>
                  </Link>
                </div>
                <div className="dept-explore-row">
                  <Link
                    to={`/departments/${dept.slug}`}
                    target="_blank"
                    className="dept-explore-btn"
                  >
                    <span>View Public Page</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


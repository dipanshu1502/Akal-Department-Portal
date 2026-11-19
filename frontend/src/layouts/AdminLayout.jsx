import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  CheckSquare,
  Users,
  Activity,
  Settings,
  LogOut,
  ExternalLink,
  BookOpen,
  Layers,
  GraduationCap,
  Award,
  Calendar,
  FlaskConical,
  FileText,
  Camera,
  Image,
  History,
  Bell,
  Menu,
  X,
} from 'lucide-react';
import { getCurrentUser, logoutUser, getRevisions, getPendingMedia } from '../services/api';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('akal_portal_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    getCurrentUser()
      .then((u) => {
        setUser(u);
        if (u.role === 'super_admin') {
          Promise.all([getRevisions({ status: 'pending' }), getPendingMedia()])
            .then(([revisions, media]) => {
              const revisionList = Array.isArray(revisions) ? revisions : revisions?.data ?? [];
              const mediaList = Array.isArray(media) ? media : media?.data ?? [];
              setPendingCount(revisionList.length + mediaList.length);
            })
            .catch(() => {});
        }
      })
      .catch(() => {
        localStorage.removeItem('akal_portal_token');
        navigate('/admin/login');
      });
  }, [navigate]);

  const handleLogout = async () => {
    await logoutUser();
    navigate('/admin/login');
  };

  const isSuper = user?.role === 'super_admin';

  return (
    <div className={`admin-shell ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar */}
      <aside className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <BookOpen size={20} />
          </div>
          <div className="sidebar-brand-text">
            <h2>Akal Portal CMS</h2>
            <span>{isSuper ? 'Super Admin Mode' : 'Dept Admin Panel'}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {isSuper ? (
            <>
              <NavLink to="/admin/super" end className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Dashboard Overview</span>
              </NavLink>

              <NavLink to="/admin/super/departments" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Building2 size={18} />
                <span>Department Catalog</span>
              </NavLink>

              <NavLink to="/admin/super/approvals" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <CheckSquare size={18} />
                <span>Content Approvals</span>
                {pendingCount > 0 && <span className="sidebar-nav-badge">{pendingCount}</span>}
              </NavLink>

              <NavLink to="/admin/super/users" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Users size={18} />
                <span>User & Admin Roles</span>
              </NavLink>

              <NavLink to="/admin/super/activity-logs" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Activity size={18} />
                <span>Audit Activity Logs</span>
              </NavLink>

              <NavLink to="/admin/media" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Image size={18} />
                <span>Media Library</span>
              </NavLink>

              <NavLink to="/admin/super/settings" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Settings size={18} />
                <span>Portal Settings</span>
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/admin/department" end className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <LayoutDashboard size={18} />
                <span>Department Dashboard</span>
              </NavLink>

              <NavLink to="/admin/department/profile" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Building2 size={18} />
                <span>Department Profile</span>
              </NavLink>

              <NavLink to="/admin/department/sections" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Layers size={18} />
                <span>Custom Page Builder</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=faculty" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Users size={18} />
                <span>Faculty Members</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=programmes" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <GraduationCap size={18} />
                <span>Courses & Programmes</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=laboratories" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <FlaskConical size={18} />
                <span>Laboratories & Labs</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=events" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Calendar size={18} />
                <span>Events & Seminars</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=achievements" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Award size={18} />
                <span>Achievements</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=publications" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <FileText size={18} />
                <span>Research Publications</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=notices" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Bell size={18} />
                <span>Notices & Circulars</span>
              </NavLink>

              <NavLink to="/admin/department/modules?tab=galleries" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Camera size={18} />
                <span>Photo Gallery</span>
              </NavLink>

              <NavLink to="/admin/department/submissions" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <History size={18} />
                <span>Submission History</span>
              </NavLink>

              <NavLink to="/admin/media" className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}>
                <Image size={18} />
                <span>Media Library</span>
              </NavLink>
            </>
          )}

          <div style={{ marginTop: 'auto', paddingTop: 20 }}>
            <Link to="/departments" target="_blank" className="sidebar-nav-link">
              <ExternalLink size={17} />
              <span>View Public Portal</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="sidebar-nav-link"
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
            >
              <LogOut size={17} />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div>Akal University Portal v1.0</div>
          <small style={{ color: '#64748B' }}>Talwandi Sabo, Bathinda</small>
        </div>
      </aside>

      {/* Main Container */}
      <div className="admin-main-canvas">
        <header className="admin-top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="btn-icon d-lg-none"
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#64748B' }}>
              {isSuper ? 'Central University Administration' : 'Department Administrative Workspace'}
            </span>
          </div>

          <div className="admin-header-user">
            <div className="admin-avatar">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="user-meta d-none d-sm-block">
              <strong>{user?.name || 'Administrator'}</strong>
              <span>{user?.email}</span>
            </div>
            <button
              type="button"
              className="btn-secondary"
              onClick={handleLogout}
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              <LogOut size={13} />
              <span>Log out</span>
            </button>
          </div>
        </header>

        <main className="admin-content-body">
          {children}
        </main>
      </div>
    </div>
  );
}

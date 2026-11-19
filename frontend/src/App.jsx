import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import DepartmentsPage from './pages/public/DepartmentsPage';
import DepartmentDetailPage from './pages/public/DepartmentDetailPage';

// Admin Auth
import AdminLoginPage from './pages/admin/AdminLoginPage';

// Super Admin Pages
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import DepartmentsManagePage from './pages/admin/DepartmentsManagePage';
import ContentApprovalCenter from './pages/admin/ContentApprovalCenter';
import UserManagementPage from './pages/admin/UserManagementPage';
import ActivityLogsPage from './pages/admin/ActivityLogsPage';
import SystemSettingsPage from './pages/admin/SystemSettingsPage';

// Department Admin Pages
import DepartmentAdminDashboard from './pages/admin/DepartmentAdminDashboard';
import DepartmentProfilePage from './pages/admin/DepartmentProfilePage';
import DepartmentSectionsManager from './pages/admin/DepartmentSectionsManager';
import DepartmentModuleManagePage from './pages/admin/DepartmentModuleManagePage';
import SubmissionHistoryPage from './pages/admin/SubmissionHistoryPage';
import MediaLibraryPage from './pages/admin/MediaLibraryPage';

/**
 * Admin root redirect handler
 */
function AdminRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('akal_portal_token');
    const userStr = localStorage.getItem('akal_portal_user');

    if (!token) {
      navigate('/admin/login', { replace: true });
      return;
    }

    try {
      const user = userStr ? JSON.parse(userStr) : null;
      if (user?.role === 'super_admin') {
        navigate('/admin/super', { replace: true });
      } else {
        navigate('/admin/department', { replace: true });
      }
    } catch {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '60vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public University Department Routes */}
      <Route
        path="/"
        element={
          <PublicLayout>
            <DepartmentsPage />
          </PublicLayout>
        }
      />
      <Route
        path="/departments"
        element={
          <PublicLayout>
            <DepartmentsPage />
          </PublicLayout>
        }
      />
      <Route
        path="/departments/:slug"
        element={
          <PublicLayout>
            <DepartmentDetailPage />
          </PublicLayout>
        }
      />

      {/* Admin Authentication */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin" element={<AdminRedirect />} />

      {/* Super Admin Dashboard Routes */}
      <Route
        path="/admin/super"
        element={
          <AdminLayout>
            <SuperAdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/super/departments"
        element={
          <AdminLayout>
            <DepartmentsManagePage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/super/approvals"
        element={
          <AdminLayout>
            <ContentApprovalCenter />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/super/users"
        element={
          <AdminLayout>
            <UserManagementPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/super/activity-logs"
        element={
          <AdminLayout>
            <ActivityLogsPage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/super/settings"
        element={
          <AdminLayout>
            <SystemSettingsPage />
          </AdminLayout>
        }
      />

      <Route
        path="/admin/media"
        element={
          <AdminLayout>
            <MediaLibraryPage />
          </AdminLayout>
        }
      />

      {/* Department Admin Dashboard Routes */}
      <Route
        path="/admin/department"
        element={
          <AdminLayout>
            <DepartmentAdminDashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/department/profile"
        element={
          <AdminLayout>
            <DepartmentProfilePage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/department/sections"
        element={
          <AdminLayout>
            <DepartmentSectionsManager />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/department/modules"
        element={
          <AdminLayout>
            <DepartmentModuleManagePage />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/department/submissions"
        element={
          <AdminLayout>
            <SubmissionHistoryPage />
          </AdminLayout>
        }
      />
      {/* Route for editing specific department sections (useful for super admin or direct link) */}
      <Route
        path="/admin/department/:departmentId/editor"
        element={
          <AdminLayout>
            <DepartmentSectionsManager />
          </AdminLayout>
        }
      />

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/departments" replace />} />
    </Routes>
  );
}

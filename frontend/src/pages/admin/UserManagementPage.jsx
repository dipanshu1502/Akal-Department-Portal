import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Shield, Building2, Search, X, Plus, Save, AlertTriangle, Trash2 } from 'lucide-react';
import { getAllUsers, getAdminDepartments, assignDepartmentAdmin, removeDepartmentAdmin, registerUser } from '../../services/api';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [assignModal, setAssignModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deptId, setDeptId] = useState('');

  const [createUserModal, setCreateUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'department_admin',
    department_id: '',
  });

  // Remove Department Confirmation Modal
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [targetToRemove, setTargetToRemove] = useState(null);
  const [removing, setRemoving] = useState(false);

  const [saving, setSaving] = useState(false);

  const refresh = () => {
    setLoading(true);
    Promise.all([getAllUsers(), getAdminDepartments()])
      .then(([uData, dData]) => {
        setUsers(Array.isArray(uData) ? uData : uData?.data ?? []);
        setDepartments(Array.isArray(dData) ? dData : dData?.departments ?? []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!deptId || !selectedUser) return;

    setSaving(true);
    try {
      await assignDepartmentAdmin(deptId, selectedUser.email);
      setAssignModal(false);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning department');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email || !newUser.password) return;

    setSaving(true);
    try {
      await registerUser(newUser);
      if (newUser.role === 'department_admin' && newUser.department_id) {
        await assignDepartmentAdmin(newUser.department_id, newUser.email);
      }
      setCreateUserModal(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'department_admin',
        department_id: '',
      });
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error registering new user account');
    } finally {
      setSaving(false);
    }
  };

  // Trigger Remove Confirmation Mini-Window Card
  const promptRemoveDepartment = (user, dept) => {
    setTargetToRemove({
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      departmentId: dept.id,
      departmentName: dept.name,
    });
    setRemoveModalOpen(true);
  };

  const executeRemoveDepartment = async () => {
    if (!targetToRemove) return;
    setRemoving(true);
    try {
      await removeDepartmentAdmin(targetToRemove.departmentId, targetToRemove.userId);
      setRemoveModalOpen(false);
      setTargetToRemove(null);
      refresh();
    } catch (err) {
      alert(err.response?.data?.message || 'Error removing department assignment');
    } finally {
      setRemoving(false);
    }
  };

  const filtered = users.filter((u) =>
    !search ||
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--akal-blue)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Access Control & Governance
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--akal-petrol)', margin: '4px 0 0' }}>
            User & Administrator Accounts ({users.length})
          </h1>
          <p style={{ color: '#64748B', fontSize: 14, margin: '4px 0 0' }}>
            Manage Super Administrators and Department Admins. Assign or remove departmental management privileges.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={() => {
            setNewUser({
              name: '',
              email: '',
              password: '',
              role: 'department_admin',
              department_id: departments[0]?.id || '',
            });
            setCreateUserModal(true);
          }}
        >
          <Plus size={16} />
          <span>Add New User Account</span>
        </button>
      </div>

      <div className="admin-card-panel">
        <div className="panel-header-bar">
          <div className="search-box-wrap" style={{ maxWidth: 360 }}>
            <Search size={16} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search user by name or email..."
            />
          </div>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User Account</th>
                <th>System Role</th>
                <th>Assigned Departments</th>
                <th>Joined On</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    Loading users list...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: 28, color: '#64748B' }}>
                    No users match search. Click "+ Add New User Account" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <strong>{u.name}</strong>
                      <div style={{ fontSize: 12, color: '#64748B' }}>{u.email}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${u.role === 'super_admin' ? 'published' : 'approved'}`}>
                        {u.role === 'super_admin' ? 'Super Admin' : 'Department Admin'}
                      </span>
                    </td>
                    <td>
                      {u.role === 'super_admin' ? (
                        <span style={{ color: '#15803D', fontWeight: 600, fontSize: 12 }}>
                          ★ Global University Access (All Departments)
                        </span>
                      ) : u.departments && u.departments.length > 0 ? (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {u.departments.map((d) => (
                            <span key={d.id} className="dept-assign-pill">
                              <span>{d.name}</span>
                              <button
                                type="button"
                                className="dept-remove-tag-btn"
                                onClick={() => promptRemoveDepartment(u, d)}
                                title={`Remove ${d.name} assignment`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span style={{ color: '#D97706', fontSize: 12, fontStyle: 'italic' }}>
                          No departments assigned yet
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 12.5, color: '#64748B' }}>
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      {u.role !== 'super_admin' && (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ padding: '6px 12px', fontSize: 12 }}
                          onClick={() => {
                            setSelectedUser(u);
                            setDeptId(departments[0]?.id || '');
                            setAssignModal(true);
                          }}
                        >
                          <Building2 size={13} />
                          <span>Assign Department</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mini-Window Card: Add New User Account */}
      {createUserModal && (
        <div className="modal-overlay">
          <div className="modal-dialog-box">
            <div className="modal-head">
              <div>
                <h3>Create New User Account</h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Register a Super Administrator or Department Admin
                </span>
              </div>
              <button className="btn-icon" onClick={() => setCreateUserModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleCreateUser}>
              <div className="modal-body">
                <div className="form-group-admin">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="e.g. Dr. Gurpreet Singh"
                  />
                </div>

                <div className="form-group-admin">
                  <label>Institutional Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="name@akal.ac.in or name@auts.ac.in"
                  />
                </div>

                <div className="form-group-admin">
                  <label>Initial Login Password * (Min 8 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>

                <div className="form-row-2col">
                  <div className="form-group-admin">
                    <label>System Role *</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="department_admin">Department Admin</option>
                      <option value="super_admin">Super Administrator</option>
                    </select>
                  </div>

                  {newUser.role === 'department_admin' && (
                    <div className="form-group-admin">
                      <label>Assigned Department</label>
                      <select
                        value={newUser.department_id}
                        onChange={(e) => setNewUser({ ...newUser, department_id: e.target.value })}
                      >
                        <option value="">Select Department (Optional)</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setCreateUserModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  <Save size={15} />
                  <span>{saving ? 'Creating Account...' : 'Create Account'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mini-Window Card: Assign Department */}
      {assignModal && selectedUser && (
        <div className="modal-overlay">
          <div className="modal-dialog-box">
            <div className="modal-head">
              <div>
                <h3>Assign Department</h3>
                <span style={{ fontSize: 12, color: '#64748B' }}>
                  Assigning to {selectedUser.name} ({selectedUser.email})
                </span>
              </div>
              <button className="btn-icon" onClick={() => setAssignModal(false)}><X size={20} /></button>
            </div>

            <form onSubmit={handleAssignSubmit}>
              <div className="modal-body">
                <p style={{ fontSize: 13.5, color: '#475569', margin: '0 0 16px' }}>
                  Select an academic department that <strong>{selectedUser.name}</strong> will manage.
                </p>

                <div className="form-group-admin">
                  <label>Academic Department *</label>
                  <select
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    required
                  >
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setAssignModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  <Save size={15} />
                  <span>{saving ? 'Assigning...' : 'Confirm Assignment'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mini-Window Card: Remove Assigned Department Confirmation */}
      {removeModalOpen && targetToRemove && (
        <div className="modal-overlay">
          <div className="modal-dialog-box" style={{ maxWidth: 460 }}>
            <div className="modal-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 style={{ color: '#DC2626', fontSize: 17 }}>Remove Department Access</h3>
                  <span style={{ fontSize: 12, color: '#64748B' }}>Confirm removal of assignment</span>
                </div>
              </div>
              <button className="btn-icon" onClick={() => setRemoveModalOpen(false)}><X size={20} /></button>
            </div>

            <div className="modal-body">
              <p style={{ margin: '0 0 12px', fontSize: 14, color: '#1E293B', lineHeight: 1.6 }}>
                Are you sure you want to remove <strong>{targetToRemove.departmentName}</strong> from administrator <strong>{targetToRemove.userName}</strong>?
              </p>
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 6, padding: '12px 14px', fontSize: 12.5, color: '#991B1B', lineHeight: 1.5 }}>
                <strong>Note:</strong> User ({targetToRemove.userEmail}) will immediately lose editing and content management privileges for this department.
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setRemoveModalOpen(false)}
                disabled={removing}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-admin-danger"
                onClick={executeRemoveDepartment}
                disabled={removing}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Trash2 size={15} />
                <span>{removing ? 'Removing...' : 'Confirm Remove'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

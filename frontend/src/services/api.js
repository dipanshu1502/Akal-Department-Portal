import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1',
  headers: { Accept: 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('akal_portal_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Public Endpoints ---
export async function getPublicDepartments(params = {}) {
  const { data } = await api.get('/public/departments', { params });
  return data.data ?? data;
}

export async function getPublicFaculties() {
  const { data } = await api.get('/public/faculties');
  return data.data ?? data;
}

export async function getPublicDepartment(slug) {
  const { data } = await api.get(`/public/departments/${encodeURIComponent(slug)}`);
  return data.data ?? data;
}

// --- Media Library ---
export async function getMedia(params = {}) {
  const { data } = await api.get('/admin/media', { params });
  return data.data ?? data;
}

export async function getMediaCategories() {
  const { data } = await api.get('/admin/media/categories');
  return data.data ?? data;
}

export async function uploadMedia(departmentId, file, metadata, onUploadProgress) {
  const payload = new FormData();
  payload.append('file', file);
  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      payload.append(key, value);
    }
  });
  const { data } = await api.post(`/admin/departments/${departmentId}/media`, payload, {
    onUploadProgress: (event) => {
      if (event.total) onUploadProgress?.(Math.round((event.loaded * 100) / event.total));
    },
  });
  return data.data ?? data;
}

export async function submitMedia(id) {
  const { data } = await api.post(`/admin/media/${id}/submit`);
  return data.data ?? data;
}

export async function updateMedia(id, payload) {
  const { data } = await api.put(`/admin/media/${id}`, payload);
  return data.data ?? data;
}

export async function replaceMedia(id, file, metadata = {}, onUploadProgress) {
  const payload = new FormData();
  payload.append('file', file);
  Object.entries(metadata).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') payload.append(key, value);
  });
  const { data } = await api.post(`/admin/media/${id}/replace`, payload, {
    onUploadProgress: (event) => {
      if (event.total) onUploadProgress?.(Math.round((event.loaded * 100) / event.total));
    },
  });
  return data.data ?? data;
}

export async function createMediaCategory(payload) {
  const { data } = await api.post('/admin/media/categories', payload);
  return data.data ?? data;
}

export async function updateMediaCategory(id, payload) {
  const { data } = await api.put(`/admin/media/categories/${id}`, payload);
  return data.data ?? data;
}

export async function deleteMediaCategory(id) {
  const { data } = await api.delete(`/admin/media/categories/${id}`);
  return data;
}

export async function deleteMedia(id) {
  const { data } = await api.delete(`/admin/media/${id}`);
  return data;
}

export async function getPendingMedia() {
  const { data } = await api.get('/admin/media/pending');
  return data.data ?? data;
}

export async function approveMedia(id, comments = '') {
  const { data } = await api.post(`/admin/media/${id}/approve`, { comments });
  return data.data ?? data;
}

export async function rejectMedia(id, comments) {
  const { data } = await api.post(`/admin/media/${id}/reject`, { comments });
  return data.data ?? data;
}

export async function publishMedia(id) {
  const { data } = await api.post(`/admin/media/${id}/publish`);
  return data.data ?? data;
}

export async function downloadMedia(id) {
  const { data } = await api.get(`/admin/media/${id}/download`, { responseType: 'blob' });
  return data;
}

// --- Auth Endpoints ---
export async function loginUser(payload) {
  const { data } = await api.post('/auth/login', payload);
  const token = data?.data?.token;
  const user = data?.data?.user;
  if (token) {
    localStorage.setItem('akal_portal_token', token);
    localStorage.setItem('akal_portal_user', JSON.stringify(user));
  }
  return data.data ?? data;
}

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', payload);
  return data.data ?? data;
}

export async function logoutUser() {
  try {
    await api.post('/auth/logout');
  } catch (e) {
    // ignore
  }
  localStorage.removeItem('akal_portal_token');
  localStorage.removeItem('akal_portal_user');
}

export async function getCurrentUser() {
  const { data } = await api.get('/admin/me');
  return data.data?.user ?? data.user ?? data;
}

// --- Admin Dashboard & Departments ---
export async function getAdminStats() {
  const { data } = await api.get('/admin/stats');
  return data.data ?? data;
}

export async function getAdminDepartments() {
  const { data } = await api.get('/admin/departments');
  return data.data ?? data;
}

export async function getAdminDepartment(id) {
  const { data } = await api.get(`/admin/departments/${id}`);
  return data.data ?? data;
}

export async function createDepartment(payload) {
  const { data } = await api.post('/admin/departments', payload);
  return data.data ?? data;
}

export async function updateDepartment(id, payload) {
  const { data } = await api.put(`/admin/departments/${id}`, payload);
  return data.data ?? data;
}

export async function deleteDepartment(id) {
  const { data } = await api.delete(`/admin/departments/${id}`);
  return data.data ?? data;
}

export async function assignDepartmentAdmin(departmentId, email) {
  const { data } = await api.post(`/admin/departments/${departmentId}/assign-admin`, { email });
  return data.data ?? data;
}

export async function removeDepartmentAdmin(departmentId, userId) {
  const { data } = await api.delete(`/admin/departments/${departmentId}/admins/${userId}`);
  return data.data ?? data;
}

export async function getAllUsers() {
  const { data } = await api.get('/admin/users');
  return data.data ?? data;
}

// --- Department Settings ---
export async function getDepartmentSettings(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/settings`);
  return data.data ?? data;
}

export async function updateDepartmentSettings(departmentId, payload) {
  const { data } = await api.put(`/admin/departments/${departmentId}/settings`, payload);
  return data.data ?? data;
}

// --- Section Layout Builder ---
export async function getSectionLayouts() {
  const { data } = await api.get('/admin/section-layouts');
  return data.data ?? data;
}

export async function getDepartmentSections(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/sections`);
  return data.data ?? data;
}

export async function createDepartmentSection(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/sections`, payload);
  return data.data ?? data;
}

export async function updateDepartmentSection(sectionId, payload) {
  const { data } = await api.put(`/admin/sections/${sectionId}`, payload);
  return data.data ?? data;
}

export async function deleteDepartmentSection(sectionId) {
  const { data } = await api.delete(`/admin/sections/${sectionId}`);
  return data.data ?? data;
}

export async function reorderDepartmentSections(departmentId, sections) {
  const { data } = await api.post(`/admin/departments/${departmentId}/sections/reorder`, { sections });
  return data.data ?? data;
}

export async function submitSectionForApproval(sectionId) {
  const { data } = await api.post(`/admin/sections/${sectionId}/submit`);
  return data.data ?? data;
}

// --- Modules CRUD ---
// Faculty
export async function getDepartmentFaculty(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/faculty`);
  return data.data ?? data;
}
export async function createFaculty(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/faculty`, payload);
  return data.data ?? data;
}
export async function updateFaculty(id, payload) {
  const { data } = await api.put(`/admin/faculty/${id}`, payload);
  return data.data ?? data;
}
export async function deleteFaculty(id) {
  const { data } = await api.delete(`/admin/faculty/${id}`);
  return data.data ?? data;
}

// Programmes
export async function getDepartmentProgrammes(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/programmes`);
  return data.data ?? data;
}
export async function createProgramme(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/programmes`, payload);
  return data.data ?? data;
}
export async function updateProgramme(id, payload) {
  const { data } = await api.put(`/admin/programmes/${id}`, payload);
  return data.data ?? data;
}
export async function deleteProgramme(id) {
  const { data } = await api.delete(`/admin/programmes/${id}`);
  return data.data ?? data;
}

// Laboratories
export async function getDepartmentLaboratories(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/laboratories`);
  return data.data ?? data;
}
export async function createLaboratory(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/laboratories`, payload);
  return data.data ?? data;
}
export async function updateLaboratory(id, payload) {
  const { data } = await api.put(`/admin/laboratories/${id}`, payload);
  return data.data ?? data;
}
export async function deleteLaboratory(id) {
  const { data } = await api.delete(`/admin/laboratories/${id}`);
  return data.data ?? data;
}

// Events
export async function getDepartmentEvents(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/events`);
  return data.data ?? data;
}
export async function createEvent(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/events`, payload);
  return data.data ?? data;
}
export async function updateEvent(id, payload) {
  const { data } = await api.put(`/admin/events/${id}`, payload);
  return data.data ?? data;
}
export async function deleteEvent(id) {
  const { data } = await api.delete(`/admin/events/${id}`);
  return data.data ?? data;
}

// Achievements
export async function getDepartmentAchievements(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/achievements`);
  return data.data ?? data;
}
export async function createAchievement(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/achievements`, payload);
  return data.data ?? data;
}
export async function updateAchievement(id, payload) {
  const { data } = await api.put(`/admin/achievements/${id}`, payload);
  return data.data ?? data;
}
export async function deleteAchievement(id) {
  const { data } = await api.delete(`/admin/achievements/${id}`);
  return data.data ?? data;
}

// Publications
export async function getDepartmentPublications(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/publications`);
  return data.data ?? data;
}
export async function createPublication(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/publications`, payload);
  return data.data ?? data;
}
export async function updatePublication(id, payload) {
  const { data } = await api.put(`/admin/publications/${id}`, payload);
  return data.data ?? data;
}
export async function deletePublication(id) {
  const { data } = await api.delete(`/admin/publications/${id}`);
  return data.data ?? data;
}

// Notices
export async function getDepartmentNotices(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/notices`);
  return data.data ?? data;
}
export async function createNotice(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/notices`, payload);
  return data.data ?? data;
}
export async function updateNotice(id, payload) {
  const { data } = await api.put(`/admin/notices/${id}`, payload);
  return data.data ?? data;
}
export async function deleteNotice(id) {
  const { data } = await api.delete(`/admin/notices/${id}`);
  return data.data ?? data;
}

// Galleries
export async function getDepartmentGalleries(departmentId) {
  const { data } = await api.get(`/admin/departments/${departmentId}/galleries`);
  return data.data ?? data;
}
export async function createGallery(departmentId, payload) {
  const { data } = await api.post(`/admin/departments/${departmentId}/galleries`, payload);
  return data.data ?? data;
}
export async function updateGallery(id, payload) {
  const { data } = await api.put(`/admin/galleries/${id}`, payload);
  return data.data ?? data;
}
export async function deleteGallery(id) {
  const { data } = await api.delete(`/admin/galleries/${id}`);
  return data.data ?? data;
}

// --- Content Revisions & Approval Center ---
export async function getRevisions(params = {}) {
  const { data } = await api.get('/admin/revisions', { params });
  return data.data ?? data;
}

export async function getRevision(id) {
  const { data } = await api.get(`/admin/revisions/${id}`);
  return data.data ?? data;
}

export async function createRevision(payload) {
  const { data } = await api.post('/admin/revisions', payload);
  return data.data ?? data;
}

export async function approveRevision(id, comments = '') {
  const { data } = await api.post(`/admin/revisions/${id}/approve`, { comments });
  return data.data ?? data;
}

export async function rejectRevision(id, comments) {
  const { data } = await api.post(`/admin/revisions/${id}/reject`, { comments });
  return data.data ?? data;
}

export async function publishRevision(id) {
  const { data } = await api.post(`/admin/revisions/${id}/publish`);
  return data.data ?? data;
}

// --- Activity Logs & Settings ---
export async function getActivityLogs() {
  const { data } = await api.get('/admin/activity-logs');
  return data.data ?? data;
}

export async function getSystemSettings() {
  const { data } = await api.get('/admin/settings');
  return data.data ?? data;
}

export async function updateSystemSettings(settings) {
  const { data } = await api.put('/admin/settings', { settings });
  return data.data ?? data;
}

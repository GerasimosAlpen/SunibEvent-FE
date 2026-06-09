import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  FileText,
  Users,
  Building,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  UserX,
  Trash2,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  Calendar,
  Building2,
  CheckCircle
} from 'lucide-react';
import {
  getAdminUsers,
  deleteAdminUser,
  getAdminOrgs,
  verifyAdminOrg,
  deleteAdminOrg,
  createAdminOrg,
  getAdminEvents,
  deleteAdminEvent,
  type AdminUser,
  type AdminOrg,
  type AdminEvent
} from '../../API/AdminAPI';

// ── Toast notification ──
const Toast = ({ message, type }: { message: string; type: 'success' | 'error' }) => (
  <div
    className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl text-sm font-medium
      animate-in slide-in-from-bottom-4 duration-300
      ${type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}
  >
    {type === 'success'
      ? <CheckCircle2 className="w-4 h-4 shrink-0" />
      : <AlertCircle className="w-4 h-4 shrink-0" />}
    {message}
  </div>
);

// ── Confirm Delete Modal ──
const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  loading
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-100">
      <div className="flex items-center gap-3 text-red-600">
        <AlertCircle className="w-6 h-6" />
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-2.5 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 disabled:opacity-60 rounded-xl transition-colors border border-gray-200"
        >
          Batal
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-60 rounded-xl transition-colors shadow-lg shadow-red-100"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
          Hapus
        </button>
      </div>
    </div>
  </div>
);

function Admin() {
  const navigate = useNavigate();

  // Tab State: 'posts' | 'users' | 'orgs'
  const [activeTab, setActiveTab] = useState<'posts' | 'users' | 'orgs'>('posts');

  // Search & Pagination States
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Data lists
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [orgs, setOrgs] = useState<AdminOrg[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);

  // UI States
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'org' | 'event'; id: number; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  // New Org Form State
  const [orgForm, setOrgForm] = useState({
    name: '',
    email: '',
    password: '',
    orgName: '',
    orgDescription: '',
    logoUrl: ''
  });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch Data Function
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const res = await getAdminUsers(currentPage, search);
        if (res.success && res.data) {
          setUsers(res.data.users);
          setTotalCount(res.data.total);
          setTotalPages(Math.max(1, Math.ceil(res.data.total / 10)));
        }
      } else if (activeTab === 'orgs') {
        const res = await getAdminOrgs(currentPage, search);
        if (res.success && res.data) {
          setOrgs(res.data.orgs);
          setTotalCount(res.data.total);
          setTotalPages(Math.max(1, Math.ceil(res.data.total / 10)));
        }
      } else if (activeTab === 'posts') {
        const res = await getAdminEvents(currentPage, search);
        if (res.success && res.data) {
          setEvents(res.data.events);
          setTotalCount(res.data.total);
          setTotalPages(Math.max(1, Math.ceil(res.data.total / 10)));
        }
      }
    } catch (err: any) {
      showToast(err?.message || 'Gagal memuat data dari server', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeTab, currentPage, search]);

  // Fetch on mount and filter changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page on tab change
  const handleTabChange = (tab: 'posts' | 'users' | 'orgs') => {
    setActiveTab(tab);
    setSearch('');
    setCurrentPage(1);
  };

  // Perform delete operation
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    try {
      if (deleteTarget.type === 'user') {
        await deleteAdminUser(deleteTarget.id);
        showToast('Pengguna berhasil dihapus', 'success');
      } else if (deleteTarget.type === 'org') {
        await deleteAdminOrg(deleteTarget.id);
        showToast('Organisasi berhasil dihapus', 'success');
      } else if (deleteTarget.type === 'event') {
        await deleteAdminEvent(deleteTarget.id);
        showToast('Event berhasil dihapus', 'success');
      }
      setDeleteTarget(null);
      fetchData();
    } catch (err: any) {
      showToast(err?.message || 'Gagal menghapus item', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Toggle Organization Verification
  const handleToggleVerify = async (orgId: number, currentVerifyStatus: boolean) => {
    try {
      const nextStatus = !currentVerifyStatus;
      await verifyAdminOrg(orgId, nextStatus);
      showToast(`Status verifikasi organisasi diperbarui`, 'success');
      fetchData();
    } catch (err: any) {
      showToast(err?.message || 'Gagal mengubah status verifikasi', 'error');
    }
  };

  // Handle create org user submit
  const handleCreateOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgForm.name.trim() || !orgForm.email.trim() || !orgForm.password.trim() || !orgForm.orgName.trim()) {
      showToast('Mohon lengkapi semua field wajib', 'error');
      return;
    }
    setCreateLoading(true);
    try {
      const payload = {
        name: orgForm.name.trim(),
        email: orgForm.email.trim(),
        password: orgForm.password.trim(),
        orgName: orgForm.orgName.trim(),
        orgDescription: orgForm.orgDescription.trim() || undefined,
        logoUrl: orgForm.logoUrl.trim() || undefined
      };
      await createAdminOrg(payload);
      showToast('Akun organisasi berhasil dibuat! 🎉', 'success');
      setCreateOrgOpen(false);
      setOrgForm({
        name: '',
        email: '',
        password: '',
        orgName: '',
        orgDescription: '',
        logoUrl: ''
      });
      fetchData();
    } catch (err: any) {
      showToast(err?.message || 'Gagal membuat akun organisasi', 'error');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Get dynamic stats counts
  const getStats = () => {
    if (activeTab === 'users') {
      return {
        card1: { title: 'Total Users', count: totalCount, change: '+12%' },
        card2: { title: 'Verified Accounts', count: users.filter(u => u.role === 'ORGANIZATION').length, change: '+5%' },
        card3: { title: 'Admin Accounts', count: users.filter(u => u.role === 'ADMIN').length, change: 'Active' },
      };
    } else if (activeTab === 'orgs') {
      return {
        card1: { title: 'Total Registered', count: totalCount, change: 'Active' },
        card2: { title: 'Verified Orgs', count: orgs.filter(o => o.isVerified).length, change: 'Verified' },
        card3: { title: 'Pending Orgs', count: orgs.filter(o => !o.isVerified).length, change: 'Pending' },
      };
    } else {
      return {
        card1: { title: 'Total Posts', count: totalCount, change: 'Active' },
        card2: { title: 'Online Events', count: events.filter(e => e.status === 'ONLINE').length, change: 'Online' },
        card3: { title: 'Closed Events', count: events.filter(e => e.status === 'CLOSED').length, change: 'Closed' },
      };
    }
  };

  const stats = getStats();

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      
      {/* ─── LEFT SIDEBAR ─── */}
      <aside className="w-64 bg-[#1e1b24] text-white flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-white/5">
            <h1 className="text-xl font-bold tracking-tight">
              <span className="text-orange-500">Sunib</span> <span className="text-white">Event</span>
            </h1>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Sunib Event Admin Panel</p>
          </div>
          <nav className="p-4 space-y-1">
            <button
              onClick={() => handleTabChange('posts')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${activeTab === 'posts'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <FileText className="w-4.5 h-4.5" />
              Posts
            </button>
            <button
              onClick={() => handleTabChange('users')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${activeTab === 'users'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Users className="w-4.5 h-4.5" />
              Users
            </button>
            <button
              onClick={() => handleTabChange('orgs')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                ${activeTab === 'orgs'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <Building className="w-4.5 h-4.5" />
              Organizations
            </button>
          </nav>
        </div>
        
        <div className="p-4 border-t border-white/5">
          <button
            onClick={() => setCreateOrgOpen(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-bold rounded-xl transition-all shadow-md active:scale-95 mb-4"
          >
            <Plus className="w-4 h-4" /> Create New Org
          </button>
          <div className="space-y-1">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT ─── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP NAV */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={
                activeTab === 'users' ? 'Cari nama atau email user...' :
                activeTab === 'orgs' ? 'Cari nama organisasi atau email...' :
                'Cari judul event...'
              } 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 focus:bg-white transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-gray-800 leading-tight">Admin User</p>
              <p className="text-[10px] text-gray-400">Super Admin</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center font-bold text-sm text-orange-600 border border-orange-200">
              AD
            </div>
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-8 max-w-5xl mx-auto w-full space-y-6">
          
          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="text-left">
              <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                {activeTab === 'users' ? 'User Management' :
                 activeTab === 'orgs' ? 'Organizations' :
                 'Manage Posts'}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {activeTab === 'users' ? 'Directory of all active event portal users, curators, and administrators.' :
                 activeTab === 'orgs' ? 'Manage and verify student-led groups across campus.' :
                 'Oversee and moderate all event submissions across the portal.'}
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Stat 1 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 text-left">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                  {activeTab === 'users' ? <Users className="w-4 h-4" /> :
                   activeTab === 'orgs' ? <Building className="w-4 h-4" /> :
                   <FileText className="w-4 h-4" />}
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                  {stats.card1.change}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stats.card1.title}</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{stats.card1.count}</h3>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 text-left">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
                  {stats.card2.change}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stats.card2.title}</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{stats.card2.count}</h3>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between h-28 text-left">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <UserX className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-50 text-orange-600">
                  {stats.card3.change}
                </span>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{stats.card3.title}</p>
                <h3 className="text-xl font-extrabold text-gray-900 mt-0.5">{stats.card3.count}</h3>
              </div>
            </div>

          </div>

          {/* Data Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="text-sm font-medium">Memuat data dari server...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  
                  {/* Users Table Layout */}
                  {activeTab === 'users' && (
                    <>
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Name</th>
                          <th className="px-6 py-3.5">Email</th>
                          <th className="px-6 py-3.5">Role</th>
                          <th className="px-6 py-3.5">Joined Date</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {users.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                              Tidak ada pengguna ditemukan.
                            </td>
                          </tr>
                        ) : (
                          users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-100">
                                    {user.name.substring(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-800 text-left">{user.name}</p>
                                    <p className="text-[10px] text-gray-400">ID: #{user.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500">
                                {user.email}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider rounded-md ${
                                  user.role === 'ADMIN' ? 'bg-orange-500 text-white' :
                                  user.role === 'ORGANIZATION' ? 'bg-cyan-100 text-cyan-800 border border-cyan-200' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-gray-500 text-xs">
                                {new Date(user.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {user.role !== 'ADMIN' && (
                                    <button
                                      onClick={() => setDeleteTarget({ type: 'user', id: user.id, name: user.name })}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                      title="Delete User"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}

                  {/* Organizations Table Layout */}
                  {activeTab === 'orgs' && (
                    <>
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Org Name</th>
                          <th className="px-6 py-3.5">Lead / Pic</th>
                          <th className="px-6 py-3.5">Joined Date</th>
                          <th className="px-6 py-3.5">Verification Status</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orgs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                              Tidak ada organisasi ditemukan.
                            </td>
                          </tr>
                        ) : (
                          orgs.map((org) => (
                            <tr key={org.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {org.logoUrl ? (
                                    <img src={org.logoUrl} alt={org.name} className="w-9 h-9 rounded-xl object-cover border border-gray-100" />
                                  ) : (
                                    <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-sm border border-orange-100">
                                      {org.name.substring(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div className="text-left">
                                    <p className="font-semibold text-gray-800 leading-tight">{org.name}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-1 max-w-[200px]">{org.description || 'Tidak ada deskripsi'}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-left">
                                  <p className="font-medium text-gray-800">{org.user?.name}</p>
                                  <p className="text-xs text-gray-400">{org.user?.email}</p>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-500 text-xs">
                                {new Date(org.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                  org.isVerified
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-orange-50 border-orange-200 text-orange-700'
                                }`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${org.isVerified ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                                  {org.isVerified ? 'Verified' : 'Pending'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleToggleVerify(org.id, org.isVerified)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                      org.isVerified 
                                        ? 'text-orange-500 hover:bg-orange-50' 
                                        : 'text-emerald-600 hover:bg-emerald-50'
                                    }`}
                                    title={org.isVerified ? "Unverify Org" : "Verify Org"}
                                  >
                                    {org.isVerified ? <UserX className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ type: 'org', id: org.id, name: org.name })}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete Organization"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}

                  {/* Posts Table Layout */}
                  {activeTab === 'posts' && (
                    <>
                      <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 font-semibold">
                        <tr>
                          <th className="px-6 py-3.5">Title</th>
                          <th className="px-6 py-3.5">Organizer</th>
                          <th className="px-6 py-3.5">Date Created</th>
                          <th className="px-6 py-3.5">Status</th>
                          <th className="px-6 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {events.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">
                              Tidak ada event ditemukan.
                            </td>
                          </tr>
                        ) : (
                          events.map((event) => (
                            <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {event.imageUrl ? (
                                    <img src={event.imageUrl} alt={event.title} className="w-12 h-9 rounded-lg object-cover border border-gray-100 shrink-0" />
                                  ) : (
                                    <div className="w-12 h-9 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center font-bold text-xs border border-orange-100 shrink-0">
                                      EV
                                    </div>
                                  )}
                                  <div className="text-left">
                                    <p className="font-semibold text-gray-800 leading-tight">{event.title}</p>
                                    <p className="text-[10px] text-gray-400 mt-0.5">ID: #{event.id}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-700 font-medium">
                                {event.organization?.name}
                              </td>
                              <td className="px-6 py-4 text-gray-500 text-xs">
                                {new Date(event.datetime).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 text-[9px] font-bold tracking-wider rounded-md uppercase ${
                                  event.status === 'ONLINE' 
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {event.status === 'ONLINE' ? 'Published' : 'Closed'}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => navigate(`/events/${event.id}`)}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                                    title="View Event Details"
                                  >
                                    <Calendar className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeleteTarget({ type: 'event', id: event.id, name: event.title })}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                    title="Delete Event"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </>
                  )}

                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalCount > 0 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <p>Showing {(currentPage - 1) * 10 + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} items</p>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg font-bold text-xs transition-all ${
                        currentPage === i + 1
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                          : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button 
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* ─── MODAL: CREATE ORG USER ─── */}
      {createOrgOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="bg-gray-900 px-6 py-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-base">Buat Akun Organisasi Baru</h3>
              </div>
              <button 
                onClick={() => setCreateOrgOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateOrgSubmit} className="p-6 space-y-4 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nama Penanggung Jawab *</label>
                  <input
                    type="text"
                    required
                    value={orgForm.name}
                    onChange={e => setOrgForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Aditya Saputra"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Email Akun *</label>
                  <input
                    type="email"
                    required
                    value={orgForm.email}
                    onChange={e => setOrgForm(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="organisasi@sunib.edu"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Password Akun *</label>
                  <input
                    type="password"
                    required
                    value={orgForm.password}
                    onChange={e => setOrgForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Minimal 8 karakter"
                    minLength={8}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 focus:bg-white transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase">Nama Organisasi *</label>
                  <input
                    type="text"
                    required
                    value={orgForm.orgName}
                    onChange={e => setOrgForm(prev => ({ ...prev, orgName: e.target.value }))}
                    placeholder="Contoh: Computer Science Society"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">Deskripsi Organisasi <span className="text-gray-300 font-normal normal-case">(opsional)</span></label>
                <textarea
                  value={orgForm.orgDescription}
                  onChange={e => setOrgForm(prev => ({ ...prev, orgDescription: e.target.value }))}
                  placeholder="Ceritakan singkat tentang perkumpulan/organisasi ini..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 focus:bg-white transition-all resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase">URL Logo Organisasi <span className="text-gray-300 font-normal normal-case">(opsional)</span></label>
                <input
                  type="url"
                  value={orgForm.logoUrl}
                  onChange={e => setOrgForm(prev => ({ ...prev, logoUrl: e.target.value }))}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/30 focus:border-orange-300 focus:bg-white transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCreateOrgOpen(false)}
                  disabled={createLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-60 text-white text-sm font-bold rounded-xl shadow-lg shadow-orange-200 transition-all duration-200"
                >
                  {createLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><CheckCircle className="w-4 h-4" /> Buat Organisasi</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL: CONFIRM DELETE ─── */}
      {deleteTarget && (
        <ConfirmModal
          title={`Hapus ${deleteTarget.type === 'user' ? 'Pengguna' : deleteTarget.type === 'org' ? 'Organisasi' : 'Event'}`}
          message={`Apakah Anda yakin ingin menghapus ${deleteTarget.type === 'user' ? 'pengguna' : deleteTarget.type === 'org' ? 'organisasi' : 'event'} "${deleteTarget.name}"? Tindakan ini tidak dapat dibatalkan.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}

      {/* ─── Toast Alerts ─── */}
      {toast && <Toast message={toast.message} type={toast.type} />}

    </div>
  );
}

export default Admin;

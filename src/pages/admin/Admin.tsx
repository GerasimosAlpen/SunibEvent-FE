import React from 'react';
import { 
  Search, Bell, CircleHelp, FileText, Users, Building, 
  Settings, LogOut, ChevronLeft, ChevronRight, 
  ShieldCheck, UserX, TrendingUp, Filter, Download,
  Ban, Trash2, Lock, ShieldAlert, Mail, Activity
} from 'lucide-react';

const MOCK_USERS = [
  {
    id: 1,
    initials: 'AS',
    avatarColor: 'bg-teal-300 text-teal-800',
    name: 'Aditya Saputra',
    joined: 'Joined Oct 12, 2023',
    email: 'aditya.saputra@sunib.edu',
    role: 'STUDENT',
    status: 'Active',
    banned: false,
  },
  {
    id: 2,
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    name: 'Siti Aminah',
    joined: 'Joined Jan 05, 2024',
    email: 'siti.aminah@global.org',
    role: 'ORGANIZER',
    status: 'Active',
    banned: false,
  },
  {
    id: 3,
    initials: 'RK',
    avatarColor: 'bg-rose-400 text-white',
    name: 'Rian Kusuma',
    joined: 'Joined Nov 20, 2023',
    email: 'rian.k@tech.com',
    role: 'ADMIN',
    status: 'Offline',
    banned: false,
  },
  {
    id: 4,
    initials: 'JL',
    avatarColor: 'bg-gray-200 text-gray-500',
    name: 'Joko Laksmono',
    joined: 'Banned Dec 30, 2023',
    email: 'joko.l@spam.net',
    role: 'USER',
    status: 'Banned',
    banned: true,
  }
];

function Admin() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col justify-between shrink-0">
        <div>
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-xl font-bold">
              <span className="text-orange-500">Sunib</span> <span className="text-gray-800">Admin</span>
            </h1>
            <p className="text-xs text-gray-400 mt-1">Event Portal Management</p>
          </div>
          <nav className="p-4 space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-4 h-4 text-gray-400" />
              Posts
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-black bg-orange-400 rounded-lg shadow-sm">
              <Users className="w-4 h-4" />
              Users
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">
              <Building className="w-4 h-4 text-gray-400" />
              Organizations
            </a>
          </nav>
        </div>
        
        <div className="p-4 border-t border-gray-100">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-sm font-medium rounded-lg mb-6 transition-colors">
            + Create New
          </button>
          <div className="space-y-1">
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <Settings className="w-4 h-4 text-gray-400" />
              Settings
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
              <LogOut className="w-4 h-4 text-gray-400" />
              Logout
            </a>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* TOP NAV */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search specific users..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-400/50 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
              <CircleHelp className="w-5 h-5" />
            </button>
            <img 
              src="https://i.pravatar.cc/150?u=admin" 
              alt="Admin Profile" 
              className="w-8 h-8 rounded-full border border-gray-200"
            />
          </div>
        </header>

        {/* CONTENT AREA */}
        <div className="p-8 max-w-6xl mx-auto w-full space-y-8">
          
          {/* Header */}
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
              <p className="text-sm text-gray-500 mt-1">Directory of all active event portal users, curators, and administrators.</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                <Download className="w-4 h-4" />
                Export List
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            {/* Stat 1 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-500">
                  <Users className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-orange-500">+12%</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">12,482</h3>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-500">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-blue-500">+5%</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Verified Accounts</p>
                <h3 className="text-2xl font-bold text-gray-900">11,920</h3>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-500">
                  <UserX className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-red-500">-2%</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Banned Users</p>
                <h3 className="text-2xl font-bold text-gray-900">142</h3>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between h-32">
              <div className="flex items-start justify-between">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-orange-500">+1.2k</span>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">New This Month</p>
                <h3 className="text-2xl font-bold text-gray-900">1,245</h3>
              </div>
            </div>

          </div>

          {/* Users Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_USERS.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-lg object-cover" />
                          ) : (
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${user.avatarColor}`}>
                              {user.initials}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400">{user.joined}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] font-bold tracking-wider rounded-md ${
                          user.role === 'STUDENT' ? 'bg-gray-200 text-gray-600' :
                          user.role === 'ORGANIZER' ? 'bg-cyan-200 text-cyan-800' :
                          user.role === 'ADMIN' ? 'bg-orange-400 text-white' :
                          'bg-gray-100 text-gray-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            user.status === 'Active' ? 'bg-amber-500' :
                            user.status === 'Offline' ? 'bg-gray-400' :
                            'bg-red-500'
                          }`}></span>
                          <span className={`text-xs font-medium ${
                            user.status === 'Banned' ? 'text-red-500' : 'text-gray-600'
                          }`}>
                            {user.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3 text-gray-400">
                          {user.banned ? (
                            <button className="hover:text-blue-500 transition-colors" title="Unban User">
                              <Lock className="w-4 h-4" />
                            </button>
                          ) : (
                            <button className="hover:text-red-500 transition-colors" title="Ban User">
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          <button className="hover:text-red-500 transition-colors" title="Delete User">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <p>Showing 1 to 10 of 12,482 users</p>
              <div className="flex items-center gap-1">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded bg-amber-700 text-white font-medium">
                  1
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50 transition-colors">
                  2
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-50 transition-colors">
                  3
                </button>
                <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">
            
            {/* Integrity Monitoring */}
            <div className="lg:col-span-2 bg-teal-800 rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[220px] shadow-md">
              {/* decorative faded box behind */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/10 rounded-xl rounded-tr-3xl rotate-12"></div>
              
              <div className="relative z-10 max-w-md">
                <h3 className="text-2xl font-bold mb-3">Integrity Monitoring Active</h3>
                <p className="text-teal-100 text-sm leading-relaxed mb-6">
                  Our automated system has flagged 12 unusual login attempts today. Maintain platform security by reviewing flagged accounts in the security dashboard.
                </p>
                <button className="px-5 py-2.5 bg-white text-teal-800 font-semibold text-sm rounded-lg hover:bg-teal-50 transition-colors shadow-sm">
                  Launch Security Scan
                </button>
              </div>
            </div>

            {/* Quick Insights */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-center">
              <h3 className="font-bold text-gray-900 mb-5 text-lg">Quick Insights</h3>
              <div className="space-y-5">
                
                <div className="flex gap-3">
                  <div className="text-amber-600 shrink-0 mt-0.5">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">User Engagement Up</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">Active sessions increased by 22% compared to last week.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="text-teal-600 shrink-0 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Unread Reports</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">You have 5 new user reports pending manual review.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="text-rose-500 shrink-0 mt-0.5">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">System Health</h4>
                    <p className="text-[11px] text-gray-400 mt-0.5 leading-tight">All access control nodes are operating within normal parameters.</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

    </div>
  );
}

export default Admin;

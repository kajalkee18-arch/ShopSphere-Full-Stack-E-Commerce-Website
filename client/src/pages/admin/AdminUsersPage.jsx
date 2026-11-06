import React, { useState, useEffect } from 'react';
import { Users, Search, Shield, ShieldAlert, CheckCircle, Ban } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';

const AdminUsersPage = () => {
  const { addToast } = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await adminService.getAllUsers({ search });
      if (res.success) setUsers(res.data.users);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleToggleStatus = async (userId, currentActive) => {
    try {
      const res = await adminService.toggleUserStatus(userId);
      if (res.success) {
        addToast(res.message);
        fetchUsers();
      }
    } catch (err) {
      addToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            User Accounts Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Oversee registered customer accounts and moderate store access
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-xs text-white placeholder:text-slate-500 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        </div>
      </div>

      {isLoading ? (
        <Spinner label="Loading user directory..." className="min-h-[40vh]" />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/60 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-4">Role</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Account Status</th>
                <th className="py-4 px-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((usr) => (
                <tr key={usr._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={usr.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                        alt={usr.name}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-700 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white">{usr.name}</p>
                        <p className="text-[10px] text-slate-500">{usr.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        usr.role === 'admin'
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {usr.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-400">{usr.phone || '—'}</td>
                  <td className="py-4 px-4 text-slate-400">{formatDate(usr.createdAt)}</td>
                  <td className="py-4 px-4">
                    {usr.isActive ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-[11px]">
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-semibold text-[11px]">
                        <Ban className="w-3.5 h-3.5" /> Deactivated
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {usr.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleStatus(usr._id, usr.isActive)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-[11px] transition-colors ${
                          usr.isActive
                            ? 'bg-rose-950/40 text-rose-300 hover:bg-rose-900/60'
                            : 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                      >
                        {usr.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;


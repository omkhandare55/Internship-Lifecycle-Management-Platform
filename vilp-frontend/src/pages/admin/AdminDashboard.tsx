import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  UserCheck,
  UserX,
  Plus,
  Trash2,
  Loader2,
  X,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import { adminApi } from '@/services/vilpApi';
import type { AdminUserSummary } from '@/types/vilp.types';

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [newRole, setNewRole] = useState('MENTOR');
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['adminUsers', page],
    queryFn: () => adminApi.listUsers(page, 30),
  });

  const users = data?.data?.content || [];
  const totalPages = data?.data?.totalPages || 1;

  const toggleStatusMutation = useMutation({
    mutationFn: ({ userId, enabled }: { userId: string; enabled: boolean }) =>
      adminApi.toggleUserStatus(userId, enabled),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      setMsg({
        type: 'success',
        text: `User ${res.data?.email} status updated to ${res.data?.enabled ? 'Active' : 'Disabled'}!`,
      });
      setTimeout(() => setMsg(null), 3500);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to update user status',
      });
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({
      userId,
      roleName,
      action,
    }: {
      userId: string;
      roleName: string;
      action: 'ADD' | 'REMOVE';
    }) => adminApi.updateUserRole(userId, roleName, action),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      if (selectedUser && res.data) {
        setSelectedUser(res.data);
      }
      setMsg({ type: 'success', text: 'User role updated successfully!' });
      setTimeout(() => setMsg(null), 3500);
    },
    onError: (err: any) => {
      setMsg({
        type: 'error',
        text: err.response?.data?.error?.message || 'Failed to update user role',
      });
    },
  });

  return (
    <div className="container-fluid p-0 space-y-4 space-y-md-5 pb-5 animate-fade-in font-mono">
      {/* ── Admin Masthead (#0A2540) ────────────────────────────────────────── */}
      <div className="bg-[#0A2540] border border-[#1E3A5F] p-4 p-sm-5 p-md-6 rounded-xs text-white shadow-xs space-y-4">
        <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-4">
          <div className="space-y-1.5">
            <div className="d-inline-flex align-items-center gap-2 px-2.5 py-1 bg-[#2563EB] text-white text-[11px] font-bold uppercase rounded-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
              <span>SUPER ADMIN CONSOLE // RBAC GOVERNANCE</span>
            </div>
            <h1 className="text-xl sm:text-3xl font-black uppercase tracking-tight font-sans m-0">
              Platform Administration &amp; Access Control
            </h1>
            <p className="text-xs text-slate-300 font-mono max-w-2xl leading-relaxed m-0">
              Manage system users, grant and revoke role-based access control (RBAC), and monitor real-time node health.
            </p>
          </div>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3 rounded-xs border text-xs font-mono font-bold d-flex align-items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
              : 'bg-red-50 text-red-800 border-red-300'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* ── System Telemetry Bar (Bootstrap row g-0) ────────────────────────── */}
      <div className="row g-0 border border-[#E2E8F0] bg-white rounded-xs overflow-hidden">
        <div className="col-12 col-md-4 p-4 border-end-md border-bottom border-bottom-md-0 d-flex align-items-center gap-3">
          <div className="w-10 h-10 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xs d-flex align-items-center justify-content-center shrink-0">
            <Server className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">API GATEWAY</span>
            <p className="text-xs font-bold text-[#0A2540] d-flex align-items-center gap-1.5 mt-0.5 m-0 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Healthy (Spring Boot 3.3.5)
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4 p-4 border-end-md border-bottom border-bottom-md-0 d-flex align-items-center gap-3">
          <div className="w-10 h-10 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xs d-flex align-items-center justify-content-center shrink-0">
            <Activity className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">DATABASE CLUSTER</span>
            <p className="text-xs font-bold text-[#0A2540] d-flex align-items-center gap-1.5 mt-0.5 m-0 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]"></span>
              PostgreSQL 16 (Flyway V12)
            </p>
          </div>
        </div>

        <div className="col-12 col-md-4 p-4 d-flex align-items-center gap-3">
          <div className="w-10 h-10 bg-[#F1F5F9] border border-[#CBD5E1] rounded-xs d-flex align-items-center justify-content-center shrink-0">
            <Users className="w-5 h-5 text-[#0A2540]" />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase block">REGISTERED USERS</span>
            <p className="text-lg font-bold text-[#0A2540] font-mono mt-0.5 m-0">
              {data?.data?.totalElements || 0} Accounts
            </p>
          </div>
        </div>
      </div>

      {/* ── Users Table ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-xs border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 p-sm-5 border-bottom border-[#E2E8F0] d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-between gap-2">
          <div>
            <h3 className="font-bold text-[#0A2540] text-base uppercase font-sans m-0">User Directory &amp; Roles</h3>
            <p className="text-xs text-slate-500 font-mono m-0">Click Manage to modify assigned roles</p>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 d-flex justify-content-center">
            <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-100 text-start text-xs font-mono">
              <thead className="bg-[#F8FAFC] border-bottom border-[#E2E8F0] text-slate-600 font-bold uppercase">
                <tr>
                  <th className="px-4 py-3">User Email</th>
                  <th className="px-4 py-3">Assigned Roles</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3 text-end">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-bold text-[#0A2540] m-0">{u.email}</p>
                      <p className="text-[10px] text-slate-400 font-mono m-0">ID: {u.id}</p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="d-flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="px-2 py-0.5 bg-blue-50 text-[#2563EB] border border-blue-200 rounded-xs font-mono text-[10px] font-bold"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`d-inline-flex align-items-center gap-1 px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase ${
                          u.enabled
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                            : 'bg-red-50 text-red-800 border border-red-300'
                        }`}
                      >
                        {u.enabled ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-end space-x-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="btn-secondary text-xs px-2.5 py-1 cursor-pointer"
                      >
                        Manage Roles
                      </button>

                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({ userId: u.id, enabled: !u.enabled })
                        }
                        disabled={toggleStatusMutation.isPending}
                        className={`text-xs px-2.5 py-1 rounded-xs border font-bold transition-colors cursor-pointer ${
                          u.enabled
                            ? 'border-red-300 text-red-600 hover:bg-red-50'
                            : 'border-emerald-300 text-emerald-700 hover:bg-emerald-50'
                        }`}
                      >
                        {u.enabled ? 'Disable' : 'Enable'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400 text-xs">No users found.</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-3 p-sm-4 border-top border-[#E2E8F0] d-flex align-items-center justify-content-between text-xs text-slate-500">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="d-flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary text-xs px-3 py-1 cursor-pointer"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary text-xs px-3 py-1 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 d-flex align-items-center justify-content-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-xs max-w-md w-100 p-4 p-sm-5 shadow-2xl position-relative border border-[#CBD5E1]">
            <button
              onClick={() => setSelectedUser(null)}
              className="position-absolute top-4 right-4 text-slate-400 hover:text-slate-600 rounded-xs p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-[#0A2540] uppercase font-sans mb-1">Manage Roles</h3>
            <p className="text-xs text-slate-500 mb-4 font-mono">{selectedUser.email}</p>

            <div className="space-y-4">
              <div>
                <label className="label">Current Roles</label>
                <div className="d-flex flex-wrap gap-2 pt-1">
                  {selectedUser.roles.map((r) => (
                    <span
                      key={r}
                      className="d-inline-flex align-items-center gap-1 px-2.5 py-1 bg-blue-50 text-[#2563EB] rounded-xs text-xs font-mono font-bold border border-blue-200"
                    >
                      {r}
                      {selectedUser.roles.length > 1 && (
                        <button
                          onClick={() =>
                            updateRoleMutation.mutate({
                              userId: selectedUser.id,
                              roleName: r,
                              action: 'REMOVE',
                            })
                          }
                          className="text-slate-400 hover:text-red-600 ms-1 cursor-pointer"
                          title="Remove role"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-top border-[#E2E8F0]">
                <label className="label">Grant Additional Role</label>
                <div className="d-flex gap-2 mt-1">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input-field flex-grow-1"
                  >
                    {['STUDENT', 'COMPANY', 'MENTOR', 'TNP_OFFICER', 'TNP_HEAD', 'SUPER_ADMIN'].map(
                      (role) => (
                        <option key={role} value={role} disabled={selectedUser.roles.includes(role)}>
                          {role} {selectedUser.roles.includes(role) ? '(Already assigned)' : ''}
                        </option>
                      )
                    )}
                  </select>
                  <button
                    onClick={() =>
                      updateRoleMutation.mutate({
                        userId: selectedUser.id,
                        roleName: newRole,
                        action: 'ADD',
                      })
                    }
                    disabled={updateRoleMutation.isPending || selectedUser.roles.includes(newRole)}
                    className="btn-primary text-xs d-flex align-items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> ASSIGN
                  </button>
                </div>
              </div>

              <div className="pt-3 border-top border-[#E2E8F0] d-flex justify-content-end">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="btn-secondary text-xs"
                >
                  DONE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

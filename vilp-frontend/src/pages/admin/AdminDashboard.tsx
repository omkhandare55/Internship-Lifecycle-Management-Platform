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
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Administration & Users</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage system users, assign role-based access control (RBAC), and monitor system health.
        </p>
      </div>

      {msg && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {/* System Telemetry Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-xl">
            <Server className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase">API Gateway</span>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Healthy (Spring Boot 3.3.5)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase">Database Cluster</span>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              PostgreSQL 16 (Flyway V12)
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 rounded-xl">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <span className="text-xs text-gray-400 font-semibold uppercase">Total Users</span>
            <p className="text-lg font-bold text-gray-900 font-mono mt-0.5">
              {data?.data?.totalElements || 0} Registered Accounts
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base">User Directory & Roles</h3>
          <span className="text-xs text-gray-400">Click Manage to modify assigned roles</span>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b text-gray-500 font-semibold uppercase">
                <tr>
                  <th className="px-6 py-4">User Email</th>
                  <th className="px-6 py-4">Assigned Roles</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{u.email}</p>
                      <p className="text-[10px] text-gray-400 font-mono">ID: {u.id}</p>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {u.roles.map((r) => (
                          <span
                            key={r}
                            className="px-2 py-0.5 bg-primary-50 text-primary-800 border border-primary-100 rounded-md font-mono text-[10px] font-bold"
                          >
                            {r}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          u.enabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {u.enabled ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                        {u.enabled ? 'Active' : 'Disabled'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => setSelectedUser(u)}
                        className="btn-secondary text-xs px-2.5 py-1"
                      >
                        Manage Roles
                      </button>

                      <button
                        onClick={() =>
                          toggleStatusMutation.mutate({ userId: u.id, enabled: !u.enabled })
                        }
                        disabled={toggleStatusMutation.isPending}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition-colors ${
                          u.enabled
                            ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                            : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
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
          <div className="p-12 text-center text-gray-400 text-xs">No users found.</div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t flex items-center justify-between text-xs text-gray-500">
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="btn-secondary text-xs px-3 py-1"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="btn-secondary text-xs px-3 py-1"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Role Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-lg p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-gray-900 mb-1">Manage Roles</h3>
            <p className="text-xs text-gray-500 mb-4 font-mono">{selectedUser.email}</p>

            <div className="space-y-4">
              <div>
                <label className="label">Current Roles</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {selectedUser.roles.map((r) => (
                    <span
                      key={r}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-50 text-primary-900 rounded-lg text-xs font-mono font-bold border border-primary-100"
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
                          className="text-gray-400 hover:text-rose-600 ml-1"
                          title="Remove role"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t">
                <label className="label">Grant Additional Role</label>
                <div className="flex gap-2 mt-1">
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="input-field flex-1"
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
                    className="btn-primary text-xs flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Assign
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedUser(null)}
                  className="btn-secondary text-xs"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

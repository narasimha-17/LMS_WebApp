"use client";

import { useEffect, useState } from "react";
import ModuleCard from "@/components/admin/ModuleCard";
import { apiGet, apiPost } from "@/lib/api";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [roles, setRoles] = useState([]);
  const [modules, setModules] = useState([]);

  const [selectedRole, setSelectedRole] = useState("");
  const [selectedModules, setSelectedModules] = useState<number[]>([]);

  const [showDropdown, setShowDropdown] = useState(false);

  // Load roles + modules
  useEffect(() => {
    (async () => {
      const r = await apiGet("/api/admin/roles");
      const m = await apiGet("/api/admin/modules");
      if (r.success) setRoles(r.roles);
      if (m.success) setModules(m.modules);
    })();
  }, []);

  // Search users
  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const res = await apiGet(`/api/admin/users/search?term=${searchTerm}`);
    if (res.success) setUsers(res.users);
  };

  // Load user modules + role
  const loadUserData = async (user: any) => {
    setSelectedUser(user);
    const res = await apiGet(`/api/admin/users/${user.user_id}/role-modules`);

    if (res.success) {
      setSelectedRole(res.role ? String(res.role.role_id) : "");
      setSelectedModules(res.modules.map((m: any) => m.module_id));
    }
  };

  // Toggle module
  const toggleModule = (id: number) => {
    setSelectedModules((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Save role
  const saveRole = async () => {
    if (!selectedUser || !selectedRole) return;

    const roleObj = roles.find((r: any) => r.role_id === Number(selectedRole));
    const isCustom = roleObj?.role_name === "custom_role";

    let res;

    if (isCustom) {
      res = await apiPost("/api/admin/assign-custom-modules", {
        user_id: selectedUser.user_id,
        role_id: Number(selectedRole),
        module_ids: selectedModules,
      });
    } else {
      res = await apiPost("/api/admin/assign-role", {
        user_id: selectedUser.user_id,
        role_id: Number(selectedRole),
      });
    }

    if (res.success) alert("Role updated successfully!");
  };

  // Reset default modules
  const resetDefault = async () => {
    if (!selectedUser || !selectedRole) return;

    const res = await apiPost("/api/admin/reset-default", {
      user_id: selectedUser.user_id,
      role_id: Number(selectedRole),
    });

    if (res.success) {
      alert("Default role modules restored.");
      loadUserData(selectedUser);
    }
  };

  return (
    <div className="space-y-6">

      {/* Search Users */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-3">Search Users</h2>

        <div className="flex gap-3">
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Results */}
      {users.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold text-lg mb-3">Results</h2>

          <table className="w-full border text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u: any) => (
                <tr key={u.user_id} className="border-b">
                  <td className="p-3">{u.user_id}</td>
                  <td className="p-3">{u.first_name} {u.last_name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => loadUserData(u)}
                      className="px-4 py-1 bg-blue-600 text-white rounded"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* User Details + Role Panel */}
      {selectedUser && (
        <div className="bg-white p-6 rounded-lg shadow space-y-6">
          <h2 className="font-semibold text-lg">User Details</h2>

          <div className="grid grid-cols-3 gap-4">
            <div><strong>ID:</strong> {selectedUser.user_id}</div>
            <div><strong>Name:</strong> {selectedUser.first_name} {selectedUser.last_name}</div>
            <div><strong>Email:</strong> {selectedUser.email}</div>
          </div>

          {/* Role Dropdown */}
          <div>
            <p className="font-semibold mb-2">Select Role</p>

            <div className="relative w-72">
              <div
                className="border bg-white rounded px-3 py-2 cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {roles.find((r: any) => r.role_id === Number(selectedRole))?.role_name ||
                  "Choose role..."}
              </div>

              {showDropdown && (
                <div className="absolute mt-1 w-full border bg-white rounded shadow z-50">
                  {roles.map((role: any) => (
                    <div
                      key={role.role_id}
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setSelectedRole(String(role.role_id));
                        setShowDropdown(false);
                        setSelectedModules([]);
                      }}
                    >
                      {role.role_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Module Cards */}
          {selectedRole && (
            <div>
              <p className="font-semibold mb-2">Module Access</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod: any) => {
                  const disabled =
                    mod.is_protected &&
                    !["admin", "super_admin"].includes(
                      roles.find((r: any) => r.role_id === Number(selectedRole))?.role_name
                    );

                  return (
                    <ModuleCard
                      key={mod.module_id}
                      module={mod}
                      checked={selectedModules.includes(mod.module_id)}
                      disabled={disabled}
                      onToggle={toggleModule}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Save / Reset Buttons */}
          <div className="flex gap-3">
            <button
              onClick={saveRole}
              className="px-5 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>

            <button
              onClick={resetDefault}
              className="px-5 py-2 bg-gray-300 text-black rounded"
            >
              Reset Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

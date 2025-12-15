"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingEmp, setEditingEmp] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    department: "",
  });

  // Load all employees
  const loadEmployees = async () => {
    try {
      const res = await apiGet("/api/employees");
      setEmployees(res.data || []);
    } catch (err) {
      console.error("Error loading employees:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Save (Add or Edit)
  const saveEmployee = async () => {
    try {
      const endpoint = editingEmp
        ? `/api/employees/update/${editingEmp.id}`
        : `/api/employees/add`;

      const res = await apiPost(endpoint, form);

      if (res.success) {
        alert("Employee saved successfully!");
        setShowForm(false);
        setEditingEmp(null);
        loadEmployees();
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save employee.");
    }
  };

  // Delete
  const deleteEmployee = async (id: number) => {
    if (!confirm("Delete this employee?")) return;

    try {
      const res = await apiPost(`/api/employees/delete/${id}`, {});
      if (res.success) {
        alert("Employee deleted!");
        loadEmployees();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p>Loading employees...</p>;

  return (
    <div className="space-y-6">

      {/* header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Employees</h1>

        <button
          onClick={() => {
            setForm({
              name: "",
              role: "",
              email: "",
              phone: "",
              department: "",
            });
            setEditingEmp(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Employee
        </button>
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {employees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold text-blue-600">{emp.name}</h2>

            <p className="text-gray-600 mt-2">{emp.role}</p>

            <p className="text-gray-500 mt-1 text-sm">{emp.email}</p>
            <p className="text-gray-500 text-sm">{emp.phone}</p>

            <p className="mt-2 text-sm">
              Department:{" "}
              <span className="font-semibold">{emp.department || "N/A"}</span>
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingEmp(emp);
                  setForm({
                    name: emp.name,
                    role: emp.role,
                    email: emp.email,
                    phone: emp.phone,
                    department: emp.department || "",
                  });
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteEmployee(emp.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

      </div>

      {/* Add / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingEmp ? "Edit Employee" : "Add Employee"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Phone Number"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Department"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowForm(false);
                  setEditingEmp(null);
                }}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={saveEmployee}
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

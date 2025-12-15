"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function AdminCertificatesPage() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCert, setEditingCert] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    badge: "",
  });

  // Load all certs
  const loadCertificates = async () => {
    try {
      const res = await apiGet("/api/certifications");
      setCerts(res.data || []);
    } catch (err) {
      console.error("Error loading certifications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, []);

  // Handle add/edit form submit
  const saveCertificate = async () => {
    try {
      const endpoint = editingCert
        ? `/api/certifications/update/${editingCert.id}`
        : "/api/certifications/add";

      const res = await apiPost(endpoint, form);

      if (res.success) {
        alert("Saved successfully!");
        setShowForm(false);
        setEditingCert(null);
        loadCertificates();
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Failed to save certificate.");
    }
  };

  // Delete certificate
  const deleteCert = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;

    try {
      const res = await apiPost(`/api/certifications/delete/${id}`, {});
      if (res.success) {
        alert("Deleted!");
        loadCertificates();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p>Loading certifications...</p>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Certification Management</h1>
        <button
          onClick={() => {
            setForm({ title: "", description: "", badge: "" });
            setEditingCert(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Certificate
        </button>
      </div>

      {/* Certificate Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certs.map((cert) => (
          <div
            key={cert.id}
            className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold text-blue-600">{cert.title}</h2>

            <p className="text-gray-600 mt-2">{cert.description ?? "No description"}</p>

            <p className="text-gray-500 mt-2 text-sm">
              Tests Available: <b>{cert.testsCount ?? 0}</b>
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingCert(cert);
                  setForm({
                    title: cert.title,
                    description: cert.description || "",
                    badge: cert.badge || "",
                  });
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteCert(cert.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingCert ? "Edit Certificate" : "Add Certificate"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Certificate Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                className="w-full border px-3 py-2 rounded"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Badge URL"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingCert(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveCertificate}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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

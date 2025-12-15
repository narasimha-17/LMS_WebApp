"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function AdminPromotionPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);

  const [form, setForm] = useState({
    message: "",
    link: "",
    is_active: false,
  });

  // Load promotion bars
  const loadPromotions = async () => {
    try {
      const res = await apiGet("/api/promotion");
      setPromotions(res.data || []);
    } catch (err) {
      console.error("Error loading promotions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  // ADD / EDIT promotion bar
  const savePromotion = async () => {
    try {
      const endpoint = editingPromo
        ? `/api/promotion/update/${editingPromo.id}`
        : "/api/promotion/add";

      const res = await apiPost(endpoint, form);

      if (res.success) {
        alert("Promotion saved!");
        setShowForm(false);
        setEditingPromo(null);
        loadPromotions();
      }
    } catch (err) {
      console.error("Save promotion error:", err);
      alert("Could not save promotion.");
    }
  };

  // DELETE promotion bar
  const deletePromo = async (id: number) => {
    if (!confirm("Delete this promotion bar?")) return;

    try {
      const res = await apiPost(`/api/promotion/delete/${id}`, {});
      if (res.success) {
        alert("Promotion deleted!");
        loadPromotions();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p>Loading promotion bars...</p>;

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Promotion Bars</h1>

        <button
          onClick={() => {
            setForm({ message: "", link: "", is_active: false });
            setEditingPromo(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Promotion
        </button>
      </div>

      {/* Promotion Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="text-lg font-bold text-blue-600">
              {promo.message}
            </h2>

            <p className="text-gray-500 mt-2">
              Link:{" "}
              <a className="text-blue-600 underline" href={promo.link}>
                {promo.link || "No Link"}
              </a>
            </p>

            <p className="mt-2">
              Status:{" "}
              <span
                className={`px-2 py-1 text-sm rounded ${
                  promo.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {promo.is_active ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingPromo(promo);
                  setForm({
                    message: promo.message,
                    link: promo.link,
                    is_active: promo.is_active,
                  });
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deletePromo(promo.id)}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {editingPromo ? "Edit Promotion" : "Add Promotion"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Promotion Message"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Promotion Link"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                Active Promotion?
              </label>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingPromo(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={savePromotion}
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

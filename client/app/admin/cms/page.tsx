"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function CMSMenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [form, setForm] = useState({
    menu_name: "",
    menu_slug: "",
    display_order: 0,
    is_active: true
  });

  const loadMenus = async () => {
    try {
      const res = await apiGet("/api/menus");
      setMenus(res.data || []);
    } catch (err) {
      console.error("Failed to load menus:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const saveMenu = async () => {
    try {
      const endpoint = editing
        ? `/api/menus/${editing.menu_id}`
        : `/api/menus`;

      const method = apiPost;

      const res = await method(endpoint, form);

      if (res.success) {
        alert("Menu saved!");
        setShowForm(false);
        setEditing(null);
        loadMenus();
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const deleteMenu = async (id: number) => {
    if (!confirm("Delete this menu?")) return;

    try {
      const res = await apiPost(`/api/menus/${id}`, {}, "DELETE");

      if (res.success) {
        loadMenus();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p>Loading Menus...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage CMS Menus</h1>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setForm({
              menu_name: "",
              menu_slug: "",
              display_order: 0,
              is_active: true
            });
            setEditing(null);
            setShowForm(true);
          }}
        >
          + Add Menu
        </button>
      </div>

      {/* Menu List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((m) => (
          <div key={m.menu_id} className="bg-white p-5 border rounded shadow-sm">
            <h2 className="font-bold text-lg">{m.menu_name}</h2>
            <p className="text-gray-500 text-sm">/{m.menu_slug}</p>
            <p className="mt-1">Order: {m.display_order}</p>
            <p className="mt-1">
              Status:
              <span
                className={`ml-2 px-2 py-1 rounded text-sm ${
                  m.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {m.is_active ? "Active" : "Inactive"}
              </span>
            </p>

            {/* Buttons */}
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 bg-yellow-500 text-white rounded"
                onClick={() => {
                  setEditing(m);
                  setForm({
                    menu_name: m.menu_name,
                    menu_slug: m.menu_slug,
                    display_order: m.display_order,
                    is_active: m.is_active
                  });
                  setShowForm(true);
                }}
              >
                Edit
              </button>

              <button
                className="px-4 py-2 bg-red-600 text-white rounded"
                onClick={() => deleteMenu(m.menu_id)}
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
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit Menu" : "Add Menu"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full p-2 border rounded"
                placeholder="Menu Name"
                value={form.menu_name}
                onChange={(e) =>
                  setForm({ ...form, menu_name: e.target.value })
                }
              />

              <input
                className="w-full p-2 border rounded"
                placeholder="Menu Slug"
                value={form.menu_slug}
                onChange={(e) =>
                  setForm({ ...form, menu_slug: e.target.value })
                }
              />

              <input
                type="number"
                className="w-full p-2 border rounded"
                placeholder="Display Order"
                value={form.display_order}
                onChange={(e) =>
                  setForm({ ...form, display_order: Number(e.target.value) })
                }
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) =>
                    setForm({ ...form, is_active: e.target.checked })
                  }
                />
                Active?
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={saveMenu}
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

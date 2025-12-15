"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const [form, setForm] = useState({
    title: "",
    content: "",
    cover_image: "",
  });

  // Load all blogs
  const loadBlogs = async () => {
    try {
      const res = await apiGet("/api/blogs");
      setBlogs(res.data || []);
    } catch (err) {
      console.error("Failed to load blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // SAVE BLOG (add or update)
  const saveBlog = async () => {
    try {
      const endpoint = editingBlog
        ? `/api/blogs/update/${editingBlog.id}`
        : `/api/blogs/add`;

      const res = await apiPost(endpoint, form);

      if (res.success) {
        alert("Blog saved successfully!");
        setShowForm(false);
        setEditingBlog(null);
        loadBlogs();
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("Unable to save blog.");
    }
  };

  // DELETE BLOG
  const deleteBlog = async (id: number) => {
    if (!confirm("Do you really want to delete this blog?")) return;

    try {
      const res = await apiPost(`/api/blogs/delete/${id}`, {});
      if (res.success) {
        alert("Deleted!");
        loadBlogs();
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <p>Loading blogs...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Blogs</h1>

        <button
          onClick={() => {
            setForm({ title: "", content: "", cover_image: "" });
            setEditingBlog(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Add Blog
        </button>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className="bg-white border rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            {/* Cover Image */}
            {blog.cover_image && (
              <img
                src={blog.cover_image}
                alt="Blog Cover"
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}

            <h2 className="text-xl font-bold text-blue-600">{blog.title}</h2>

            <p className="text-gray-600 mt-2 line-clamp-3">
              {blog.content}
            </p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingBlog(blog);
                  setForm({
                    title: blog.title,
                    content: blog.content,
                    cover_image: blog.cover_image,
                  });
                  setShowForm(true);
                }}
                className="px-4 py-2 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteBlog(blog.id)}
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
              {editingBlog ? "Edit Blog" : "Add Blog"}
            </h2>

            <div className="space-y-3">
              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Blog Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <textarea
                className="w-full border px-3 py-2 rounded h-28"
                placeholder="Blog Content"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />

              <input
                className="w-full border px-3 py-2 rounded"
                placeholder="Cover Image URL"
                value={form.cover_image}
                onChange={(e) =>
                  setForm({ ...form, cover_image: e.target.value })
                }
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingBlog(null);
                }}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={saveBlog}
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

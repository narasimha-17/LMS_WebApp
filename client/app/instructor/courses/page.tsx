"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function InstructorCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    provider_id: "",
    certification_id: "",
    price: "",
    language: "",
    videos: "",
    sheets: "",
    extra: "",
  });

  const loadCourses = async () => {
    const res = await apiGet("/api/courses");
    if (res.success) setCourses(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const saveCourse = async () => {
    const res = await apiPost("/api/courses/add", form);
    if (res.success) {
      alert("Course Added!");
      setShowForm(false);
      loadCourses();
    }
  };

  return (
    <div className="p-10 space-y-6">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">Instructor — Manage Courses</h1>

        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-2 bg-blue-600 text-white rounded-lg"
        >
          + Add Course
        </button>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((c) => (
          <div
            key={c.course_id}
            className="bg-white shadow p-5 rounded-xl border"
          >
            <h2 className="font-bold text-lg">{c.certification_name}</h2>
            <p className="text-gray-600">{c.language}</p>
            <p className="font-semibold mt-2">₹ {c.price}</p>

            <div className="mt-4 flex gap-2">
              <button className="px-4 py-2 bg-yellow-500 text-white rounded">
                Edit
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Course Add Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold mb-4">Add Course</h2>

            {Object.keys(form).map((key) => (
              <input
                key={key}
                placeholder={key.replace("_", " ")}
                className="w-full border px-3 py-2 rounded mb-3"
                onChange={(e) =>
                  setForm({ ...form, [key]: e.target.value })
                }
              />
            ))}

            <button
              className="w-full bg-blue-600 text-white py-2 rounded"
              onClick={saveCourse}
            >
              Save Course
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

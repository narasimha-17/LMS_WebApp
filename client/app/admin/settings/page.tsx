"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    site_name: "",
    contact_email: "",
    contact_phone: "",
    homepage_banner: "",
    enable_registration: true,
  });

  // Load settings from backend
  const loadSettings = async () => {
    try {
      const res = await apiGet("/api/settings");
      setSettings(res.data || {});
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // Save settings
  const saveSettings = async () => {
    try {
      const res = await apiPost("/api/settings/update", settings);
      if (res.success) {
        alert("Settings saved successfully!");
      }
    } catch (err) {
      console.error("Save failed:", err);
      alert("Could not save settings.");
    }
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="space-y-6">

      {/* Page Heading */}
      <h1 className="text-2xl font-bold">Site Settings</h1>

      {/* Settings Form */}
      <div className="bg-white border rounded-xl shadow-sm p-6">

        <div className="space-y-4">

          {/* Site Name */}
          <div>
            <label className="block font-medium mb-1">Site Name</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={settings.site_name}
              onChange={(e) =>
                setSettings({ ...settings, site_name: e.target.value })
              }
              placeholder="Ex: GenoSpark Mock Tests"
            />
          </div>

          {/* Contact Email */}
          <div>
            <label className="block font-medium mb-1">Contact Email</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={settings.contact_email}
              onChange={(e) =>
                setSettings({ ...settings, contact_email: e.target.value })
              }
              placeholder="example@gmail.com"
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label className="block font-medium mb-1">Contact Phone</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={settings.contact_phone}
              onChange={(e) =>
                setSettings({ ...settings, contact_phone: e.target.value })
              }
              placeholder="+91 9876543210"
            />
          </div>

          {/* Homepage Banner */}
          <div>
            <label className="block font-medium mb-1">Homepage Banner Text</label>
            <input
              className="w-full border px-3 py-2 rounded"
              value={settings.homepage_banner}
              onChange={(e) =>
                setSettings({ ...settings, homepage_banner: e.target.value })
              }
              placeholder="Welcome to GenoSpark!"
            />
          </div>

          {/* Registration Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={settings.enable_registration}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  enable_registration: e.target.checked,
                })
              }
            />
            <label className="font-medium">Enable User Registration</label>
          </div>

        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={saveSettings}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save Settings
          </button>
        </div>

      </div>
    </div>
  );
}

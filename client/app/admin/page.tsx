"use client";

import Link from "next/link";

const dashboardItems = [
  {
    title: "Manage CMS",
    desc: "Edit pages, menus, and dynamic site content.",
    icon: "🧩",
    link: "/admin/cms",
  },
  {
    title: "Manage Blogs",
    desc: "Create, update, remove and publish blog posts.",
    icon: "📄",
    link: "/admin/blogs",
  },
  {
    title: "Manage Promotion Bar",
    desc: "Create, update, and set active and inactive promotion bars.",
    icon: "🏷️",
    link: "/admin/promotion",
  },
  {
    title: "Manage Employees Info",
    desc: "Add, update, and remove employee details.",
    icon: "👤",
    link: "/admin/employees",
  },
  {
    title: "Manage Certificates",
    desc: "Add, update, and remove certificate details.",
    icon: "🛡️",
    link: "/admin/certifications",
  },
  {
    title: "Manage Site Settings",
    desc: "Configure site-wide preferences.",
    icon: "⚙️",
    link: "/admin/settings",
  },
  {
    title: "Dashboard",
    desc: "This is the Admin Dashboard.",
    icon: "🔲",
    link: "/admin",
  },
  {
    title: "Question Management",
    desc: "Upload and review exam questions.",
    icon: "📘",
    link: "/admin/questions",
  },
];

export default function AdminHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item) => (
          <Link
            key={item.title}
            href={item.link}
            className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md 
            transition cursor-pointer text-center flex flex-col items-center"
          >
            <div className="text-blue-600 text-5xl mb-4">{item.icon}</div>

            <h2 className="font-semibold text-lg mb-1">{item.title}</h2>

            <p className="text-gray-500 text-sm">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

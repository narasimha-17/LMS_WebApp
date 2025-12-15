"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const dashboardItems = [
  { title: "Manage CMS", desc: "Edit pages & menus.", icon: "🧩", link: "/admin/cms" },
  { title: "Manage Blogs", desc: "Publish blog posts.", icon: "📄", link: "/admin/blogs" },
  { title: "Promotion Bar", desc: "Manage promotions.", icon: "🏷️", link: "/admin/promotion" },
  { title: "Employees", desc: "Manage employee info.", icon: "👤", link: "/admin/employees" },
  { title: "Certificates", desc: "Manage certificates.", icon: "🛡️", link: "/admin/certifications" },
  { title: "Site Settings", desc: "Configure settings.", icon: "⚙️", link: "/admin/settings" },
 
  { title: "Question Bank", desc: "Upload exam questions.", icon: "📘", link: "/admin/questions" },
];

export default function AdminNav({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname === "/admin";

  return (
    <div className="max-w-7xl mx-auto">

      {/* Horizontal Nav Menu */}
      

      {/* Dashboard Cards (ONLY on /admin) */}
      {isDashboard ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardItems.map((item) => (
            <Link
              key={item.title}
              href={item.link}
              className="border rounded-xl bg-white p-6 shadow-sm hover:shadow-md transition cursor-pointer text-center flex flex-col items-center"
            >
              <div className="text-blue-600 text-5xl mb-4">{item.icon}</div>
              <h2 className="font-semibold text-lg mb-1">{item.title}</h2>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </Link>
          ))}
        </div>
      ) : (
        <div>{children}</div>
      )}

    </div>
  );
}

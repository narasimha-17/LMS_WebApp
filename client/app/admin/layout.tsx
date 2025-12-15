import Link from "next/link"; 
import AdminNav from "./AdminNav";

export const metadata = {
  title: "Admin Panel - GenoSpark",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* 🔵 BLUE BAR WITH TITLE + LINKS */}
      <header className="w-full bg-blue-600 text-white px-6 py-4 shadow rounded-md mb-4">
        <div className="max-w-7xl mx-auto flex items-center gap-8">

          {/* Title */}
          <div className="text-xl font-semibold whitespace-nowrap">
            Admin Panel — Manage Your Website
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-6 text-sm text-white">
              <Link href="/admin" className="hover:underline text-white">Dashboard</Link>
  <Link href="/admin/cms" className="hover:underline text-white">CMS</Link>
  <Link href="/admin/blogs" className="hover:underline text-white">Blogs</Link>
  <Link href="/admin/promotion" className="hover:underline text-white">Promotion</Link>
  <Link href="/admin/employees" className="hover:underline text-white">Employees</Link>
  <Link href="/admin/certifications" className="hover:underline text-white">Certificates</Link>
  <Link href="/admin/settings" className="hover:underline text-white">Settings</Link>
  <Link href="/admin/questions" className="hover:underline text-white">Questions</Link>
</nav>


        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {children}
      </div>

    </div>
  );
}

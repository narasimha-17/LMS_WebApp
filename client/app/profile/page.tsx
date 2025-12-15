// client/app/profile/page.tsx
import { apiGet } from "@/lib/api";

export default async function ProfilePage() {
  interface Profile {
    name: string;
    email: string;
    stats?: {
      testsTaken: number;
      bestScore: number;
    };
  }

  let profile: Profile | null = null;

  try {
    profile = await apiGet("/api/auth/profile");
  } catch {
    profile = {
      name: "Guest",
      email: "guest@example.com",
      stats: { testsTaken: 2, bestScore: 87 },
    };
  }

  return (
    <section className="py-10">
      <h2 className="text-2xl font-bold">Profile</h2>
      <div className="mt-4 p-4 border rounded-lg">
        <div className="font-medium">{profile?.name}</div>
        <div className="text-sm text-gray-500">{profile?.email}</div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Tests Taken</div>
            <div className="text-xl font-bold">
              {profile?.stats?.testsTaken ?? 0}
            </div>
          </div>

          <div className="p-4 border rounded">
            <div className="text-sm text-gray-500">Best Score</div>
            <div className="text-xl font-bold">
              {profile?.stats?.bestScore ?? 0}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

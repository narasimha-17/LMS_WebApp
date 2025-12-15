export default function PricingPage() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      
      {/* HEADER */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">
          Choose Your Learning Plan
        </h1>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
          Unlock full access to certification mock tests, AI analytics, and personalized study tools.
        </p>
      </div>

      {/* PRICING PLANS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* FREE PLAN */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold text-blue-600">Free</h2>
          <p className="text-gray-600 mt-2">Perfect to try GenoSpark</p>

          <p className="text-4xl font-bold mt-6">₹0</p>
          <p className="text-gray-500 text-sm mb-6">Forever free</p>

          <ul className="space-y-3 text-gray-700">
            <li>✔ Access to limited mock tests</li>
            <li>✔ View explanations</li>
            <li>✔ Basic performance dashboard</li>
            <li>✖ AI Weak Area Analysis</li>
            <li>✖ Unlimited practice exams</li>
          </ul>

          <button className="w-full mt-8 bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-black">
            Get Started
          </button>
        </div>

        {/* PRO PLAN */}
        <div className="rounded-2xl border-2 border-blue-600 bg-white p-8 shadow-xl scale-105">
          <h2 className="text-2xl font-bold text-blue-700">Pro</h2>
          <p className="text-gray-600 mt-2">Best for serious learners</p>

          <p className="text-4xl font-bold mt-6">₹999</p>
          <p className="text-gray-500 text-sm mb-6">per year</p>

          <ul className="space-y-3 text-gray-700">
            <li>✔ Unlimited mock tests</li>
            <li>✔ Full-length practice exams</li>
            <li>✔ Performance analytics</li>
            <li>✔ AI Weak Areas Report</li>
            <li>✔ Resume-ready Certificate</li>
            <li>✖ Job Assistance</li>
          </ul>

          <button className="w-full mt-8 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Upgrade to Pro
          </button>
        </div>

        {/* PREMIUM PLAN */}
        <div className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition">
          <h2 className="text-2xl font-bold text-indigo-600">Premium</h2>
          <p className="text-gray-600 mt-2">For career-focused learners</p>

          <p className="text-4xl font-bold mt-6">₹1999</p>
          <p className="text-gray-500 text-sm mb-6">per year</p>

          <ul className="space-y-3 text-gray-700">
            <li>✔ Everything in Pro</li>
            <li>✔ AI Adaptive Test Engine</li>
            <li>✔ Job Assistance</li>
            <li>✔ Interview Preparation</li>
            <li>✔ Live Doubt Support</li>
            <li>✔ Masterclass Access</li>
          </ul>

          <button className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
            Go Premium
          </button>
        </div>

      </div>

      {/* Feature Comparison Table */}
      <div className="mt-20">
        <h2 className="text-3xl font-bold text-center mb-6">Compare Features</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-4">Features</th>
                <th className="p-4 text-center">Free</th>
                <th className="p-4 text-center">Pro</th>
                <th className="p-4 text-center">Premium</th>
              </tr>
            </thead>

            <tbody>
              {[
                ["Mock Tests", "Limited", "Unlimited", "Unlimited"],
                ["Full Practice Exams", "✖", "✔", "✔"],
                ["AI Weak Area Analysis", "✖", "✔", "✔"],
                ["Interview Prep", "✖", "✖", "✔"],
                ["Resume Certificate", "✖", "✔", "✔"],
                ["Job Assistance", "✖", "✖", "✔"],
              ].map(([feature, free, pro, premium]) => (
                <tr key={feature} className="border-b">
                  <td className="p-4 font-medium">{feature}</td>
                  <td className="p-4 text-center">{free}</td>
                  <td className="p-4 text-center">{pro}</td>
                  <td className="p-4 text-center">{premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}

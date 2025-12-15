export default function PublicLandingPage() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16">

      {/* HERO SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
          Crack Global Certifications with Confidence 🚀
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Prepare for top international exams like <b>Azure, AWS, Google Cloud, PMP, DevOps, Cybersecurity</b> 
          using AI-powered practice tests, smart analytics, and personalized learning strategies.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a href="/login" className="px-8 py-3 bg-blue-600 text-white text-lg rounded-lg shadow hover:bg-blue-700">
            Login to Get Started →
          </a>
          <a href="/register" className="px-8 py-3 bg-gray-200 text-gray-800 text-lg rounded-lg hover:bg-gray-300">
            Create Free Account
          </a>
        </div>
      </div>

      {/* WHY THIS PLATFORM MATTERS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-14">

        <FeatureCard 
          title="💡 Smart Exam Preparation"
          desc="Our platform simulates real exam environments, helps students build confidence, and identify knowledge gaps effortlessly."
        />
        
        <FeatureCard 
          title="📚 100% Exam-Oriented Questions"
          desc="Get access to curated, up-to-date questions designed to match the pattern & difficulty of real global certification exams."
        />

        <FeatureCard 
          title="📈 Performance Analytics"
          desc="AI analyzes your answers, tracks accuracy, speed, strengths, and weaknesses to optimize your preparation."
        />

        <FeatureCard 
          title="⏱ Timed Mock Tests"
          desc="Experience real pressure with timed practice sessions — including auto-submit and question review features."
        />

        <FeatureCard 
          title="🌍 Learn Anytime, Anywhere"
          desc="Fully online, mobile-friendly platform accessible 24/7 — perfect for students & working professionals."
        />

        <FeatureCard 
          title="🎯 Guaranteed Improvement"
          desc="Focused question sets and progress tracking help students improve at least 30–50% faster than traditional studying."
        />

      </div>

      {/* FINAL CTA */}
      <div className="text-center mt-20">
        <h2 className="text-3xl font-bold text-gray-800">
          Your Journey to Certification Success Starts Here 🚀
        </h2>
        <p className="mt-4 text-gray-600 text-lg">
          Join thousands of learners who cracked global exams using our platform.
        </p>

        <a
          href="/register"
          className="mt-6 inline-block px-10 py-3 bg-blue-700 text-white text-lg font-semibold rounded-lg shadow hover:bg-blue-800"
        >
          Create Your Free Account →
        </a>
      </div>
    </section>
  );
}

/* Small Feature Card Component */
function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow border hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}

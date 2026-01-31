export default function AboutPage() {
  return (
    <div className="py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          About Relvanta
        </h1>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
            Empowering Medium-Sized Businesses with AI
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Founded in 2023, Relvanta is on a mission to democratize access to cutting-edge
            artificial intelligence for medium-sized businesses. We believe AI shouldn't be
            exclusive to tech giants.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
            Our Approach
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            We combine deep technical expertise with business acumen to deliver AI solutions
            that generate measurable ROI. Our team has deployed AI systems for over 100
            organizations across retail, manufacturing, finance, and healthcare.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
            Our Values
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300 mb-4">
            <li className="ml-4">
              <strong>Pragmatism</strong>: We focus on solutions that work in the real world
            </li>
            <li className="ml-4">
              <strong>Transparency</strong>: No black boxes—we explain how our AI systems work
            </li>
            <li className="ml-4">
              <strong>Partnership</strong>: Your success is our success
            </li>
            <li className="ml-4">
              <strong>Innovation</strong>: We stay at the forefront of AI research
            </li>
          </ul>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
            The Team
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Our team includes former researchers from MIT and Stanford, AI engineers from top
            tech companies, and business consultants with deep industry expertise.
          </p>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 mt-8">
            Contact Us
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
            Ready to explore how AI can transform your business?
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            <strong>Email:</strong>{' '}
            <a
              href="mailto:hello@relvanta.com"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              hello@relvanta.com
            </a>
            <br />
            <strong>Location:</strong> Stockholm, Sweden
          </p>
        </div>
      </div>
    </div>
  );
}

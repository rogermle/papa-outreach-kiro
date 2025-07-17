import Link from "next/link";

export default function MissionSection() {
  return (
    <section id="mission" className="py-16 sm:py-20 px-4 bg-base-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg sm:text-xl max-w-4xl mx-auto leading-relaxed text-base-content/80">
            PAPA volunteers table at FAPA (Future and Active Pilots Alliance)
            events to build brand awareness, recruit new members, and distribute
            merchandise while supporting the future of aviation and connecting
            with aspiring pilots from diverse backgrounds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body text-center p-6 sm:p-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-primary-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-primary">
                Brand Awareness
              </h3>
              <p className="text-base-content/70 text-sm sm:text-base">
                Promote PAPA&apos;s mission and values at aviation events,
                showcasing our commitment to diversity and excellence in
                aviation.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body text-center p-6 sm:p-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-secondary-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-secondary">
                Member Recruitment
              </h3>
              <p className="text-base-content/70 text-sm sm:text-base">
                Connect with aspiring pilots and grow our community by sharing
                opportunities and building lasting professional relationships.
              </p>
            </div>
          </div>

          <div className="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="card-body text-center p-6 sm:p-8">
              <div className="w-12 h-12 mx-auto mb-4 bg-accent rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-accent-content"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-3 text-accent">
                Community Support
              </h3>
              <p className="text-base-content/70 text-sm sm:text-base">
                Distribute merchandise and support aviation education while
                fostering a welcoming environment for all future aviators.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-6 sm:p-8 rounded-2xl text-primary-content">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Make a Difference?
            </h3>
            <p className="text-base sm:text-lg mb-6 opacity-90">
              Join our community of dedicated volunteers and help shape the
              future of aviation.
            </p>
            <Link href="/login" className="btn btn-accent btn-lg">
              Get Started Today
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

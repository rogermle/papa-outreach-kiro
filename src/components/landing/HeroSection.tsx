import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary pt-16">
      <div className="hero-content text-center text-primary-content">
        <div className="max-w-5xl container mx-auto px-4">
          <h1 className="mb-8 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Join PAPA&apos;s Mission to
            <span className="block text-accent">Support Future Aviators</span>
          </h1>
          <p className="mb-8 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            The Professional Asian Pilot Association volunteers at FAPA events
            to build brand awareness, recruit new members, and distribute
            merchandise while supporting the future of aviation.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link
              href="/login"
              className="btn btn-accent btn-lg px-8 w-full sm:w-auto"
            >
              Start Volunteering
            </Link>
            <a
              href="#mission"
              className="btn btn-outline btn-lg px-8 text-primary-content border-primary-content hover:bg-primary-content hover:text-primary w-full sm:w-auto"
            >
              Learn More
            </a>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mt-12 pt-8 border-t border-primary-content/20">
            <div className="stat place-items-center">
              <div className="stat-value text-accent text-3xl sm:text-4xl">
                50+
              </div>
              <div className="stat-desc text-primary-content/80 text-sm sm:text-base">
                Events Supported
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-value text-accent text-3xl sm:text-4xl">
                200+
              </div>
              <div className="stat-desc text-primary-content/80 text-sm sm:text-base">
                Volunteers
              </div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-value text-accent text-3xl sm:text-4xl">
                1000+
              </div>
              <div className="stat-desc text-primary-content/80 text-sm sm:text-base">
                Future Pilots Reached
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content text-center text-primary-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">PAPA Volunteer Events</h1>
            <p className="mb-5">
              Join the Professional Asian Pilot Association in supporting future
              aviators and building our community through volunteer
              opportunities.
            </p>
            <button className="btn btn-accent btn-lg">Get Started</button>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg max-w-3xl mx-auto">
              PAPA volunteers table at FAPA events to build brand awareness,
              recruit new members, and distribute merchandise while supporting
              the future of aviation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Brand Awareness</h3>
                <p>Promote PAPA&apos;s mission and values at aviation events</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">
                  Member Recruitment
                </h3>
                <p>Connect with aspiring pilots and grow our community</p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Community Support</h3>
                <p>Distribute merchandise and support aviation education</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

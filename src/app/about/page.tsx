import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            PAPA Volunteers
          </Link>
        </div>
        <div className="navbar-end">
          <Link href="/login" className="btn btn-primary">
            Join Us
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero py-20 bg-gradient-to-br from-primary/10 to-secondary/10">
        <div className="hero-content text-center">
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-6">About PAPA Volunteers</h1>
            <p className="text-xl leading-relaxed text-base-content/80">
              Learn more about our mission, impact, and the incredible
              volunteers who make our community outreach possible.
            </p>
          </div>
        </div>
      </div>

      {/* About Content */}
      <div className="container mx-auto px-4 py-16">
        {/* Mission Statement */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Our Story</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg leading-relaxed mb-6 text-base-content/80">
                The Professional Asian Pilot Association (PAPA) was founded with
                a vision to increase representation and support for Asian pilots
                in the aviation industry. Our volunteer program extends this
                mission by actively engaging with future aviators at FAPA
                (Future and Active Pilots Alliance) events across the country.
              </p>
              <p className="text-lg leading-relaxed mb-6 text-base-content/80">
                Through our volunteer efforts, we&apos;ve connected with
                thousands of aspiring pilots, distributed educational materials,
                and built lasting relationships that strengthen our aviation
                community. Every volunteer event is an opportunity to inspire,
                mentor, and support the next generation of diverse aviation
                professionals.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-4">Our Impact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="stat">
                  <div className="stat-value text-primary">50+</div>
                  <div className="stat-desc">Events</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-secondary">200+</div>
                  <div className="stat-desc">Volunteers</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-accent">1000+</div>
                  <div className="stat-desc">Pilots Reached</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-primary">25+</div>
                  <div className="stat-desc">Cities</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Volunteer Stories */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Volunteer Impact Stories
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="avatar mb-4">
                  <div className="w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-xl font-bold text-primary-content">
                      MK
                    </span>
                  </div>
                </div>
                <h3 className="card-title">Michael Kim</h3>
                <p className="text-sm text-base-content/60 mb-3">
                  ATP, Lead Volunteer
                </p>
                <p className="text-base-content/80">
                  &quot;Leading volunteer efforts has allowed me to give back to
                  the community that supported me throughout my career. Seeing
                  young pilots discover PAPA for the first time is incredibly
                  rewarding.&quot;
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="avatar mb-4">
                  <div className="w-16 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <span className="text-xl font-bold text-secondary-content">
                      SP
                    </span>
                  </div>
                </div>
                <h3 className="card-title">Sarah Park</h3>
                <p className="text-sm text-base-content/60 mb-3">
                  CFI, Regular Volunteer
                </p>
                <p className="text-base-content/80">
                  &quot;Volunteering with PAPA has connected me with amazing
                  pilots and opened doors I never expected. The networking
                  opportunities alone have been invaluable for my career
                  growth.&quot;
                </p>
              </div>
            </div>

            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <div className="avatar mb-4">
                  <div className="w-16 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center">
                    <span className="text-xl font-bold text-accent-content">
                      DL
                    </span>
                  </div>
                </div>
                <h3 className="card-title">David Liu</h3>
                <p className="text-sm text-base-content/60 mb-3">
                  Commercial Pilot, New Volunteer
                </p>
                <p className="text-base-content/80">
                  &quot;As a new volunteer, I was amazed by how welcoming and
                  organized the PAPA team is. Every event is well-coordinated,
                  and I always leave feeling like I&apos;ve made a real
                  difference.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" defaultChecked />
              <div className="collapse-title text-xl font-medium">
                What types of volunteer opportunities are available?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/80">
                  We offer various volunteer roles including event setup, booth
                  staffing, information distribution, and lead coordination.
                  Opportunities range from single-day events to multi-day
                  conferences, with flexible time commitments to fit your
                  schedule.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                Do I need to be a pilot to volunteer?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/80">
                  While many of our volunteers are pilots at various stages of
                  their careers, we welcome anyone passionate about aviation and
                  supporting diversity in the industry. Your enthusiasm and
                  commitment matter more than your flight hours.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                How much time commitment is required?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/80">
                  Volunteer commitments are flexible and based on your
                  availability. Most events run during typical hours (8am-5pm)
                  and can range from half-day to multi-day commitments. You can
                  choose events that fit your schedule.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                Are travel expenses covered for volunteers?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/80">
                  For traveling volunteers, we offer travel voucher support on a
                  case-by-case basis. Local volunteers often provide airport and
                  hotel pickup services to help coordinate logistics. Details
                  are provided during event signup.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                How do I get started as a volunteer?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/80">
                  Simply click the &quot;Join Us&quot; button to create your
                  account using Google or Discord. Once registered, you&apos;ll
                  have access to available volunteer opportunities and can sign
                  up for events that interest you. We&apos;ll provide all
                  necessary training and materials.
                </p>
              </div>
            </div>

            <div className="collapse collapse-plus bg-base-200 mb-4">
              <input type="radio" name="faq-accordion" />
              <div className="collapse-title text-xl font-medium">
                What should I expect at my first volunteer event?
              </div>
              <div className="collapse-content">
                <p className="text-base-content/80">
                  First-time volunteers are paired with experienced team members
                  who provide guidance and support. You&apos;ll receive
                  event-specific materials, clear instructions, and ongoing
                  support throughout the event. Most volunteers find their first
                  experience both rewarding and enjoyable.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary to-secondary p-8 rounded-2xl text-primary-content">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Join Our Mission?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Become part of a community that&apos;s shaping the future of
              aviation diversity.
            </p>
            <Link href="/login" className="btn btn-accent btn-lg">
              Start Volunteering Today
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import HeroSection from "@/components/landing/HeroSection";
import MissionSection from "@/components/landing/MissionSection";
import PhotoGallery from "@/components/landing/PhotoGallery";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation */}
      <div className="navbar bg-base-100 shadow-lg fixed top-0 z-50">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a href="#mission">Mission</a>
              </li>
              <li>
                <a href="#gallery">Gallery</a>
              </li>
              <li>
                <a href="#about">About</a>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl font-bold">
            PAPA Volunteers
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a href="#mission">Mission</a>
            </li>
            <li>
              <a href="#gallery">Gallery</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <Link href="/login" className="btn btn-primary">
            Join Us
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection />

      {/* Mission Section */}
      <MissionSection />

      {/* Photo Gallery */}
      <PhotoGallery />

      {/* About Preview Section */}
      <section id="about" className="py-20 px-4 bg-base-100">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8">About PAPA Volunteers</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed text-base-content/80 mb-12">
            Our volunteer program is built on the foundation of community,
            mentorship, and professional growth. Join a network of dedicated
            aviation professionals who are committed to increasing diversity and
            representation in the industry.
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto mb-12">
            <div className="text-left">
              <h3 className="text-3xl font-bold mb-6">
                Why Volunteer with PAPA?
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-base-content/80">
                    Make a meaningful impact on future aviators
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-base-content/80">
                    Network with aviation professionals nationwide
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-base-content/80">
                    Flexible scheduling that fits your lifestyle
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-6 h-6 text-primary mt-1 mr-3 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-base-content/80">
                    Professional development and leadership opportunities
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-2xl">
              <h4 className="text-2xl font-bold mb-4">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-base-content/60">
                    Volunteer Satisfaction
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-secondary">4.8/5</div>
                  <div className="text-sm text-base-content/60">
                    Event Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">85%</div>
                  <div className="text-sm text-base-content/60">
                    Return Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">12</div>
                  <div className="text-sm text-base-content/60">
                    Avg Events/Year
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Link href="/about" className="btn btn-outline btn-lg">
            Learn More About Us
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer footer-center p-10 bg-base-200 text-base-content">
        <nav className="grid grid-flow-col gap-4">
          <Link href="/about" className="link link-hover">
            About
          </Link>
          <a href="#mission" className="link link-hover">
            Mission
          </a>
          <a href="#gallery" className="link link-hover">
            Gallery
          </a>
          <Link href="/login" className="link link-hover">
            Join
          </Link>
        </nav>
        <nav>
          <div className="grid grid-flow-col gap-4">
            <a
              href="https://www.asianpilots.org"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover"
            >
              Visit www.asianpilots.org
            </a>
          </div>
        </nav>
        <aside>
          <p className="font-bold">Professional Asian Pilot Association</p>
          <p>Building diversity in aviation since 1997</p>
          <p className="text-sm text-base-content/60 mt-2">
            © 2025 PAPA. All rights reserved.
          </p>
        </aside>
      </footer>
    </div>
  );
}

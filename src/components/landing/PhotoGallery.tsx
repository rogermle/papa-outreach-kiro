"use client";

import { useState } from "react";

// Sample gallery data - in a real app, this would come from a CMS or database
const galleryImages = [
  {
    id: 1,
    src: "/api/placeholder/400/300",
    alt: "PAPA volunteers at FAPA career fair booth",
    title: "Career Fair Outreach",
    description:
      "Our volunteers engaging with aspiring pilots at a major aviation career fair",
  },
  {
    id: 2,
    src: "/api/placeholder/400/300",
    alt: "Volunteer team setting up PAPA merchandise display",
    title: "Event Setup",
    description:
      "Team collaboration in setting up our professional display booth",
  },
  {
    id: 3,
    src: "/api/placeholder/400/300",
    alt: "PAPA members distributing informational materials",
    title: "Information Distribution",
    description:
      "Sharing PAPA resources and membership information with interested pilots",
  },
  {
    id: 4,
    src: "/api/placeholder/400/300",
    alt: "Group photo of PAPA volunteers at aviation event",
    title: "Volunteer Team",
    description:
      "Our dedicated volunteer team after a successful day of outreach",
  },
  {
    id: 5,
    src: "/api/placeholder/400/300",
    alt: "PAPA booth at professional aviation conference",
    title: "Professional Conference",
    description: "Representing PAPA at a major aviation industry conference",
  },
  {
    id: 6,
    src: "/api/placeholder/400/300",
    alt: "Volunteers interacting with student pilots",
    title: "Student Engagement",
    description: "Mentoring and inspiring the next generation of Asian pilots",
  },
];

export default function PhotoGallery() {
  const [selectedImage, setSelectedImage] = useState<
    (typeof galleryImages)[0] | null
  >(null);

  return (
    <section id="gallery" className="py-16 sm:py-20 px-4 bg-base-200">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Our Impact in Action
          </h2>
          <p className="text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed text-base-content/80">
            See how PAPA volunteers are making a difference at events across the
            country, connecting with future aviators and building our aviation
            community.
          </p>
        </div>

        {/* Photo Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {galleryImages.map((image) => (
            <div
              key={image.id}
              className="card bg-base-100 shadow-xl hover:shadow-2xl cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={() => setSelectedImage(image)}
            >
              <figure className="px-4 pt-4">
                <div className="w-full h-40 sm:h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg
                      className="w-8 sm:w-10 h-8 sm:h-10 mx-auto mb-2 text-primary/60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-xs sm:text-sm text-primary/60">
                      Event Photo
                    </p>
                  </div>
                </div>
              </figure>
              <div className="card-body p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-primary">
                  {image.title}
                </h3>
                <p className="text-sm text-base-content/70">
                  {image.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="card bg-base-100 shadow-xl p-6 sm:p-8">
          <div className="text-center">
            <div className="avatar mb-4">
              <div className="w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-content">
                  JL
                </span>
              </div>
            </div>
            <blockquote className="text-lg sm:text-xl italic mb-4 text-base-content/80">
              &quot;Volunteering with PAPA has been incredibly rewarding. Seeing
              the excitement in young pilots&apos; eyes when they learn about
              our organization and the opportunities available to them makes
              every event worthwhile.&quot;
            </blockquote>
            <cite className="font-semibold text-primary">
              - Jennifer Liu, Lead Volunteer
            </cite>
            <p className="text-sm text-base-content/60 mt-1">
              Commercial Pilot, 5+ years volunteering
            </p>
          </div>
        </div>
      </div>

      {/* Modal for image viewing */}
      {selectedImage && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-bold text-lg text-primary">
                {selectedImage.title}
              </h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={() => setSelectedImage(null)}
              >
                ✕
              </button>
            </div>
            <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <svg
                  className="w-12 sm:w-16 h-12 sm:h-16 mx-auto mb-4 text-primary/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-primary/60">Full Size Event Photo</p>
              </div>
            </div>
            <p className="text-base-content/80">{selectedImage.description}</p>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setSelectedImage(null)}
          >
            <button>close</button>
          </div>
        </div>
      )}
    </section>
  );
}

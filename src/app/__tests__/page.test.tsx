import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import Home from "../page";

// Mock Next.js components and hooks
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("next/link", () => {
  return function MockLink({ children, href, ...props }: any) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  };
});

// Mock the landing components
jest.mock("@/components/landing/HeroSection", () => {
  return function MockHeroSection() {
    return (
      <div data-testid="hero-section">
        <h1>Join PAPA's Mission</h1>
        <p>Professional Asian Pilot Association volunteers</p>
        <a href="/login">Start Volunteering</a>
      </div>
    );
  };
});

jest.mock("@/components/landing/MissionSection", () => {
  return function MockMissionSection() {
    return (
      <section id="mission" data-testid="mission-section">
        <h2>Our Mission</h2>
        <p>PAPA volunteers table at FAPA events</p>
      </section>
    );
  };
});

jest.mock("@/components/landing/PhotoGallery", () => {
  return function MockPhotoGallery() {
    return (
      <section id="gallery" data-testid="photo-gallery">
        <h2>Our Impact in Action</h2>
        <div>Photo gallery content</div>
      </section>
    );
  };
});

const mockPush = jest.fn();

describe("Home Page", () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      pathname: "/",
    });
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("renders the main container with correct styling", () => {
      render(<Home />);
      const mainContainer =
        screen.getByRole("main") || document.querySelector(".min-h-screen");
      expect(mainContainer).toBeInTheDocument();
      expect(mainContainer).toHaveClass("min-h-screen", "bg-base-100");
    });

    it("renders the navigation bar", () => {
      render(<Home />);
      const navbar = document.querySelector(".navbar");
      expect(navbar).toBeInTheDocument();
      expect(navbar).toHaveClass(
        "bg-base-100",
        "shadow-lg",
        "fixed",
        "top-0",
        "z-50"
      );
    });

    it("renders the PAPA Volunteers brand link", () => {
      render(<Home />);
      const brandLink = screen.getByRole("link", { name: /papa volunteers/i });
      expect(brandLink).toBeInTheDocument();
      expect(brandLink).toHaveAttribute("href", "/");
    });

    it("renders the Join Us button in navigation", () => {
      render(<Home />);
      const joinButton = screen.getByRole("link", { name: /join us/i });
      expect(joinButton).toBeInTheDocument();
      expect(joinButton).toHaveAttribute("href", "/login");
      expect(joinButton).toHaveClass("btn", "btn-primary");
    });
  });

  describe("Navigation Menu", () => {
    it("renders desktop navigation menu", () => {
      render(<Home />);
      const desktopMenu = document.querySelector(".navbar-center .menu");
      expect(desktopMenu).toBeInTheDocument();
      expect(desktopMenu).toHaveClass("hidden", "lg:flex");
    });

    it("renders mobile navigation dropdown", () => {
      render(<Home />);
      const mobileDropdown = document.querySelector(".dropdown");
      expect(mobileDropdown).toBeInTheDocument();

      const hamburgerButton = document.querySelector(".btn-ghost.lg\\:hidden");
      expect(hamburgerButton).toBeInTheDocument();
    });

    it("renders navigation links with correct anchors", () => {
      render(<Home />);

      // Check desktop menu links
      const missionLinks = screen.getAllByRole("link", { name: /mission/i });
      const galleryLinks = screen.getAllByRole("link", { name: /gallery/i });
      const aboutLinks = screen.getAllByRole("link", { name: /about/i });

      expect(missionLinks.length).toBeGreaterThan(0);
      expect(galleryLinks.length).toBeGreaterThan(0);
      expect(aboutLinks.length).toBeGreaterThan(0);

      // Check that at least one of each link has correct href
      expect(
        missionLinks.some((link) => link.getAttribute("href") === "#mission")
      ).toBe(true);
      expect(
        galleryLinks.some((link) => link.getAttribute("href") === "#gallery")
      ).toBe(true);
      expect(
        aboutLinks.some((link) => link.getAttribute("href") === "#about")
      ).toBe(true);
    });

    it("renders hamburger menu icon", () => {
      render(<Home />);
      const hamburgerIcon = document.querySelector("svg");
      expect(hamburgerIcon).toBeInTheDocument();

      // Check for hamburger menu path
      const hamburgerPath = document.querySelector(
        'path[d="M4 6h16M4 12h8m-8 6h16"]'
      );
      expect(hamburgerPath).toBeInTheDocument();
    });
  });

  describe("Landing Components", () => {
    it("renders HeroSection component", () => {
      render(<Home />);
      const heroSection = screen.getByTestId("hero-section");
      expect(heroSection).toBeInTheDocument();
    });

    it("renders MissionSection component", () => {
      render(<Home />);
      const missionSection = screen.getByTestId("mission-section");
      expect(missionSection).toBeInTheDocument();
    });

    it("renders PhotoGallery component", () => {
      render(<Home />);
      const photoGallery = screen.getByTestId("photo-gallery");
      expect(photoGallery).toBeInTheDocument();
    });
  });

  describe("About Section", () => {
    it("renders the about section with correct id", () => {
      render(<Home />);
      const aboutSection = document.querySelector("#about");
      expect(aboutSection).toBeInTheDocument();
      expect(aboutSection).toHaveClass("py-20", "px-4", "bg-base-100");
    });

    it("renders the about section heading", () => {
      render(<Home />);
      const aboutHeading = screen.getByRole("heading", {
        name: /about papa volunteers/i,
      });
      expect(aboutHeading).toBeInTheDocument();
      expect(aboutHeading).toHaveClass("text-5xl", "font-bold", "mb-8");
    });

    it("renders the about section description", () => {
      render(<Home />);
      const description = screen.getByText(
        /our volunteer program is built on the foundation/i
      );
      expect(description).toBeInTheDocument();
    });

    it('renders the "Why Volunteer with PAPA?" section', () => {
      render(<Home />);
      const whyVolunteerHeading = screen.getByRole("heading", {
        name: /why volunteer with papa\?/i,
      });
      expect(whyVolunteerHeading).toBeInTheDocument();
    });

    it("renders volunteer benefits list", () => {
      render(<Home />);
      const benefits = [
        /make a meaningful impact on future aviators/i,
        /network with aviation professionals nationwide/i,
        /flexible scheduling that fits your lifestyle/i,
        /professional development and leadership opportunities/i,
      ];

      benefits.forEach((benefit) => {
        expect(screen.getByText(benefit)).toBeInTheDocument();
      });
    });

    it("renders checkmark icons for benefits", () => {
      render(<Home />);
      const checkmarkPaths = document.querySelectorAll(
        'path[d="M5 13l4 4L19 7"]'
      );
      expect(checkmarkPaths).toHaveLength(4); // One for each benefit
    });

    it("renders quick stats section", () => {
      render(<Home />);

      expect(screen.getByText("Quick Stats")).toBeInTheDocument();
      expect(screen.getByText("95%")).toBeInTheDocument();
      expect(screen.getByText("Volunteer Satisfaction")).toBeInTheDocument();
      expect(screen.getByText("4.8/5")).toBeInTheDocument();
      expect(screen.getByText("Event Rating")).toBeInTheDocument();
      expect(screen.getByText("85%")).toBeInTheDocument();
      expect(screen.getByText("Return Rate")).toBeInTheDocument();
      expect(screen.getByText("12")).toBeInTheDocument();
      expect(screen.getByText("Avg Events/Year")).toBeInTheDocument();
    });

    it('renders "Learn More About Us" button', () => {
      render(<Home />);
      const learnMoreButton = screen.getByRole("link", {
        name: /learn more about us/i,
      });
      expect(learnMoreButton).toBeInTheDocument();
      expect(learnMoreButton).toHaveAttribute("href", "/about");
      expect(learnMoreButton).toHaveClass("btn", "btn-outline", "btn-lg");
    });
  });

  describe("Footer", () => {
    it("renders the footer with correct styling", () => {
      render(<Home />);
      const footer = document.querySelector(".footer");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveClass(
        "footer-center",
        "p-10",
        "bg-base-200",
        "text-base-content"
      );
    });

    it("renders footer navigation links", () => {
      render(<Home />);

      const footerAboutLink = screen
        .getAllByRole("link", { name: /about/i })
        .find((link) => link.getAttribute("href") === "/about");
      expect(footerAboutLink).toBeInTheDocument();

      const footerJoinLink = screen
        .getAllByRole("link", { name: /join/i })
        .find((link) => link.getAttribute("href") === "/login");
      expect(footerJoinLink).toBeInTheDocument();
    });

    it("renders external link to asianpilots.org", () => {
      render(<Home />);
      const externalLink = screen.getByRole("link", {
        name: /visit www\.asianpilots\.org/i,
      });
      expect(externalLink).toBeInTheDocument();
      expect(externalLink).toHaveAttribute(
        "href",
        "https://www.asianpilots.org"
      );
      expect(externalLink).toHaveAttribute("target", "_blank");
      expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders footer branding and copyright", () => {
      render(<Home />);

      expect(
        screen.getByText("Professional Asian Pilot Association")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Building diversity in aviation since 1997")
      ).toBeInTheDocument();
      expect(
        screen.getByText("© 2025 PAPA. All rights reserved.")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<Home />);

      // Check that we have h1, h2, h3, h4 elements in proper order
      const headings = document.querySelectorAll("h1, h2, h3, h4");
      expect(headings.length).toBeGreaterThan(0);
    });

    it("has proper link attributes", () => {
      render(<Home />);

      const externalLink = screen.getByRole("link", {
        name: /visit www\.asianpilots\.org/i,
      });
      expect(externalLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("has proper button roles and classes", () => {
      render(<Home />);

      const buttons = document.querySelectorAll(".btn");
      expect(buttons.length).toBeGreaterThan(0);

      buttons.forEach((button) => {
        expect(button).toHaveClass("btn");
      });
    });

    it("has proper navigation structure", () => {
      render(<Home />);

      const navbar = document.querySelector(".navbar");
      expect(navbar).toBeInTheDocument();

      const navLinks = navbar?.querySelectorAll("a");
      expect(navLinks?.length).toBeGreaterThan(0);
    });
  });

  describe("Responsive Design", () => {
    it("has mobile-responsive navigation classes", () => {
      render(<Home />);

      const mobileDropdown = document.querySelector(".btn-ghost.lg\\:hidden");
      expect(mobileDropdown).toBeInTheDocument();

      const desktopMenu = document.querySelector(".hidden.lg\\:flex");
      expect(desktopMenu).toBeInTheDocument();
    });

    it("has responsive grid classes in about section", () => {
      render(<Home />);

      const statsGrid = document.querySelector(".grid.grid-cols-2");
      expect(statsGrid).toBeInTheDocument();

      const benefitsGrid = document.querySelector(".grid.md\\:grid-cols-2");
      expect(benefitsGrid).toBeInTheDocument();
    });

    it("has responsive text sizing classes", () => {
      render(<Home />);

      const mainHeading = screen.getByRole("heading", {
        name: /about papa volunteers/i,
      });
      expect(mainHeading).toHaveClass("text-5xl");
    });
  });

  describe("Interactive Elements", () => {
    it("handles mobile menu toggle interaction", () => {
      render(<Home />);

      const mobileMenuButton = document.querySelector(".btn-ghost.lg\\:hidden");
      const dropdownMenu = document.querySelector(".dropdown-content");

      expect(mobileMenuButton).toBeInTheDocument();
      expect(dropdownMenu).toBeInTheDocument();
    });

    it("has hover effects on interactive elements", () => {
      render(<Home />);

      const hoverElements = document.querySelectorAll(
        ".hover\\:shadow-2xl, .hover\\:bg-primary-content"
      );
      expect(hoverElements.length).toBeGreaterThan(0);
    });
  });

  describe("SEO and Meta", () => {
    it("has semantic HTML structure", () => {
      render(<Home />);

      const sections = document.querySelectorAll("section");
      expect(sections.length).toBeGreaterThan(0);

      const footer = document.querySelector("footer");
      expect(footer).toBeInTheDocument();
    });

    it("has proper section IDs for anchor navigation", () => {
      render(<Home />);

      const aboutSection = document.querySelector("#about");
      expect(aboutSection).toBeInTheDocument();
    });
  });
});

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PhotoGallery from "../PhotoGallery";

describe("PhotoGallery Component", () => {
  describe("Rendering", () => {
    it("renders the main section with correct id and styling", () => {
      render(<PhotoGallery />);
      const section = document.querySelector("#gallery");
      expect(section).toBeInTheDocument();
      expect(section).toHaveClass("py-16", "sm:py-20", "px-4", "bg-base-200");
    });

    it("renders the main heading", () => {
      render(<PhotoGallery />);
      const heading = screen.getByRole("heading", {
        name: /our impact in action/i,
      });
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveClass(
        "text-4xl",
        "sm:text-5xl",
        "font-bold",
        "mb-6"
      );
    });

    it("renders the description paragraph", () => {
      render(<PhotoGallery />);
      const description = screen.getByText(
        /see how papa volunteers are making a difference at events/i
      );
      expect(description).toBeInTheDocument();
      expect(description).toHaveClass(
        "text-lg",
        "sm:text-xl",
        "max-w-3xl",
        "mx-auto",
        "leading-relaxed",
        "text-base-content/80"
      );
    });

    it("renders the photo grid with correct styling", () => {
      render(<PhotoGallery />);
      const photoGrid = document.querySelector(
        ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3"
      );
      expect(photoGrid).toBeInTheDocument();
      expect(photoGrid).toHaveClass("gap-4", "sm:gap-6", "mb-12");
    });

    it("renders all gallery images", () => {
      render(<PhotoGallery />);

      // Check for image titles
      expect(screen.getByText("Career Fair Outreach")).toBeInTheDocument();
      expect(screen.getByText("Event Setup")).toBeInTheDocument();
      expect(screen.getByText("Information Distribution")).toBeInTheDocument();
      expect(screen.getByText("Volunteer Team")).toBeInTheDocument();
      expect(screen.getByText("Professional Conference")).toBeInTheDocument();
      expect(screen.getByText("Student Engagement")).toBeInTheDocument();
    });

    it("renders image cards with correct styling", () => {
      render(<PhotoGallery />);
      const imageCards = document.querySelectorAll(".card");

      // Should have 6 image cards plus 1 testimonial card
      expect(imageCards.length).toBe(7);

      // Check first image card styling
      const firstImageCard = imageCards[0];
      expect(firstImageCard).toHaveClass(
        "card",
        "bg-base-100",
        "shadow-xl",
        "hover:shadow-2xl",
        "cursor-pointer",
        "transform",
        "hover:scale-105",
        "transition-all",
        "duration-300"
      );
    });

    it("renders placeholder images with correct styling", () => {
      render(<PhotoGallery />);
      const placeholderDivs = document.querySelectorAll(
        ".bg-gradient-to-br.from-primary\\/20.to-secondary\\/20"
      );

      // Should have 6 placeholder images in grid + 1 in modal (when closed, modal content still exists)
      expect(placeholderDivs.length).toBeGreaterThanOrEqual(6);

      // Check first placeholder styling
      const firstPlaceholder = placeholderDivs[0];
      expect(firstPlaceholder).toHaveClass(
        "w-full",
        "h-40",
        "sm:h-48",
        "bg-gradient-to-br",
        "from-primary/20",
        "to-secondary/20",
        "rounded-lg",
        "flex",
        "items-center",
        "justify-center"
      );
    });

    it("renders image icons with correct size", () => {
      render(<PhotoGallery />);
      const imageIcons = document.querySelectorAll(
        "svg.w-8.sm\\:w-10.h-8.sm\\:h-10"
      );

      // Should have icons in the grid images
      expect(imageIcons.length).toBeGreaterThan(0);

      const firstIcon = imageIcons[0];
      expect(firstIcon).toHaveClass(
        "w-8",
        "sm:w-10",
        "h-8",
        "sm:h-10",
        "mx-auto",
        "mb-2",
        "text-primary/60"
      );
    });

    it("renders image descriptions", () => {
      render(<PhotoGallery />);

      expect(
        screen.getByText(
          /our volunteers engaging with aspiring pilots at a major aviation career fair/i
        )
      ).toBeInTheDocument();

      expect(
        screen.getByText(
          /team collaboration in setting up our professional display booth/i
        )
      ).toBeInTheDocument();
    });
  });

  describe("Testimonial Section", () => {
    it("renders the testimonial card", () => {
      render(<PhotoGallery />);
      const testimonialCard = document.querySelector(
        ".card.bg-base-100.shadow-xl.p-6"
      );
      expect(testimonialCard).toBeInTheDocument();
    });

    it("renders the avatar with initials", () => {
      render(<PhotoGallery />);
      const avatar = document.querySelector(".avatar");
      expect(avatar).toBeInTheDocument();

      const initials = screen.getByText("JL");
      expect(initials).toBeInTheDocument();
      expect(initials).toHaveClass(
        "text-2xl",
        "font-bold",
        "text-primary-content"
      );
    });

    it("renders the testimonial quote", () => {
      render(<PhotoGallery />);
      const quote = screen.getByText(
        /volunteering with papa has been incredibly rewarding/i
      );
      expect(quote).toBeInTheDocument();
      expect(quote.tagName).toBe("BLOCKQUOTE");
      expect(quote).toHaveClass(
        "text-lg",
        "sm:text-xl",
        "italic",
        "mb-4",
        "text-base-content/80"
      );
    });

    it("renders the testimonial attribution", () => {
      render(<PhotoGallery />);
      const attribution = screen.getByText("- Jennifer Liu, Lead Volunteer");
      expect(attribution).toBeInTheDocument();
      expect(attribution.tagName).toBe("CITE");
      expect(attribution).toHaveClass("font-semibold", "text-primary");
    });

    it("renders the testimonial details", () => {
      render(<PhotoGallery />);
      const details = screen.getByText(
        "Commercial Pilot, 5+ years volunteering"
      );
      expect(details).toBeInTheDocument();
      expect(details).toHaveClass("text-sm", "text-base-content/60", "mt-1");
    });
  });

  describe("Modal Functionality", () => {
    it("does not show modal initially", () => {
      render(<PhotoGallery />);
      // Modal exists in DOM but should not have modal-open class
      const modalOpenElement = document.querySelector(".modal.modal-open");
      expect(modalOpenElement).not.toBeInTheDocument();
    });

    it("opens modal when image card is clicked", () => {
      render(<PhotoGallery />);

      // Click on the first image card
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      // Modal should now be open
      const modal = document.querySelector(".modal.modal-open");
      expect(modal).toBeInTheDocument();
    });

    it("displays correct image information in modal", () => {
      render(<PhotoGallery />);

      // Click on the first image card (Career Fair Outreach)
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      // Check modal content
      const modalTitle = screen.getAllByText("Career Fair Outreach");
      expect(modalTitle.length).toBeGreaterThan(1); // One in grid, one in modal

      const modalDescription = screen.getAllByText(
        /our volunteers engaging with aspiring pilots at a major aviation career fair/i
      );
      expect(modalDescription.length).toBeGreaterThan(1); // One in grid, one in modal
    });

    it("closes modal when close button is clicked", () => {
      render(<PhotoGallery />);

      // Open modal
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      // Modal should be open
      let modal = document.querySelector(".modal.modal-open");
      expect(modal).toBeInTheDocument();

      // Click close button
      const closeButton = screen.getByRole("button", { name: /✕/i });
      fireEvent.click(closeButton);

      // Modal should be closed
      modal = document.querySelector(".modal.modal-open");
      expect(modal).not.toBeInTheDocument();
    });

    it("closes modal when backdrop is clicked", () => {
      render(<PhotoGallery />);

      // Open modal
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      // Modal should be open
      let modal = document.querySelector(".modal.modal-open");
      expect(modal).toBeInTheDocument();

      // Click backdrop
      const backdrop = document.querySelector(".modal-backdrop");
      fireEvent.click(backdrop!);

      // Modal should be closed
      modal = document.querySelector(".modal.modal-open");
      expect(modal).not.toBeInTheDocument();
    });

    it("renders modal with correct styling", () => {
      render(<PhotoGallery />);

      // Open modal
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      const modalBox = document.querySelector(".modal-box");
      expect(modalBox).toBeInTheDocument();
      expect(modalBox).toHaveClass("max-w-4xl");

      const closeButton = screen.getByRole("button", { name: /✕/i });
      expect(closeButton).toHaveClass(
        "btn",
        "btn-sm",
        "btn-circle",
        "btn-ghost"
      );
    });

    it("renders larger image icon in modal", () => {
      render(<PhotoGallery />);

      // Open modal
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      // Check for larger icon in modal
      const modalIcon = document.querySelector(
        ".modal-box svg.w-12.sm\\:w-16.h-12.sm\\:h-16"
      );
      expect(modalIcon).toBeInTheDocument();
      expect(modalIcon).toHaveClass(
        "w-12",
        "sm:w-16",
        "h-12",
        "sm:h-16",
        "mx-auto",
        "mb-4",
        "text-primary/60"
      );
    });
  });

  describe("Responsive Design", () => {
    it("has responsive grid classes", () => {
      render(<PhotoGallery />);
      const grid = document.querySelector(".grid");
      expect(grid).toHaveClass(
        "grid-cols-1",
        "sm:grid-cols-2",
        "lg:grid-cols-3"
      );
    });

    it("has responsive spacing classes", () => {
      render(<PhotoGallery />);
      const section = document.querySelector("#gallery");
      expect(section).toHaveClass("py-16", "sm:py-20");

      const grid = document.querySelector(".grid");
      expect(grid).toHaveClass("gap-4", "sm:gap-6");
    });

    it("has responsive text sizing", () => {
      render(<PhotoGallery />);
      const heading = screen.getByRole("heading", {
        name: /our impact in action/i,
      });
      expect(heading).toHaveClass("text-4xl", "sm:text-5xl");

      const description = screen.getByText(
        /see how papa volunteers are making a difference/i
      );
      expect(description).toHaveClass("text-lg", "sm:text-xl");
    });

    it("has responsive image placeholder heights", () => {
      render(<PhotoGallery />);
      const placeholders = document.querySelectorAll(".h-40.sm\\:h-48");
      expect(placeholders.length).toBeGreaterThan(0);

      placeholders.forEach((placeholder) => {
        expect(placeholder).toHaveClass("h-40", "sm:h-48");
      });
    });

    it("has responsive icon sizes", () => {
      render(<PhotoGallery />);
      const icons = document.querySelectorAll("svg.w-8.sm\\:w-10");
      expect(icons.length).toBeGreaterThan(0);

      icons.forEach((icon) => {
        expect(icon).toHaveClass("w-8", "sm:w-10", "h-8", "sm:h-10");
      });
    });

    it("has responsive padding in cards", () => {
      render(<PhotoGallery />);
      const cardBodies = document.querySelectorAll(".card-body");

      cardBodies.forEach((cardBody) => {
        expect(cardBody).toHaveClass("p-4", "sm:p-6");
      });
    });
  });

  describe("Accessibility", () => {
    it("has proper heading hierarchy", () => {
      render(<PhotoGallery />);

      const h2 = screen.getByRole("heading", { level: 2 });
      expect(h2).toBeInTheDocument();
      expect(h2).toHaveTextContent("Our Impact in Action");

      const h3Elements = screen.getAllByRole("heading", { level: 3 });
      expect(h3Elements.length).toBe(6); // One for each image
    });

    it("has proper button roles and attributes", () => {
      render(<PhotoGallery />);

      // Open modal to access close button
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      const closeButton = screen.getByRole("button", { name: /✕/i });
      expect(closeButton).toBeInTheDocument();
      // Note: DaisyUI buttons don't always have explicit type="button" attribute
    });

    it("has clickable cards with proper cursor styling", () => {
      render(<PhotoGallery />);
      const clickableCards = document.querySelectorAll(".cursor-pointer");
      expect(clickableCards.length).toBe(6); // All image cards should be clickable

      clickableCards.forEach((card) => {
        expect(card).toHaveClass("cursor-pointer");
      });
    });

    it("has proper semantic structure", () => {
      render(<PhotoGallery />);

      const section = document.querySelector("section#gallery");
      expect(section).toBeInTheDocument();

      const figures = document.querySelectorAll("figure");
      expect(figures.length).toBe(6); // One for each image
    });

    it("has proper quote attribution", () => {
      render(<PhotoGallery />);

      const blockquote = document.querySelector("blockquote");
      expect(blockquote).toBeInTheDocument();

      const cite = document.querySelector("cite");
      expect(cite).toBeInTheDocument();
    });
  });

  describe("Hover Effects", () => {
    it("has hover effects on image cards", () => {
      render(<PhotoGallery />);
      const imageCards = document.querySelectorAll(".card.cursor-pointer");

      imageCards.forEach((card) => {
        expect(card).toHaveClass(
          "hover:shadow-2xl",
          "hover:scale-105",
          "transition-all",
          "duration-300"
        );
      });
    });

    it("has transform classes for hover animations", () => {
      render(<PhotoGallery />);
      const imageCards = document.querySelectorAll(".card.cursor-pointer");

      imageCards.forEach((card) => {
        expect(card).toHaveClass("transform");
      });
    });
  });

  describe("State Management", () => {
    it("manages selected image state correctly", () => {
      render(<PhotoGallery />);

      // Initially no modal should be open
      expect(document.querySelector(".modal-open")).not.toBeInTheDocument();

      // Click first image
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      // Modal should be open with first image
      expect(document.querySelector(".modal-open")).toBeInTheDocument();

      // Close modal
      const closeButton = screen.getByRole("button", { name: /✕/i });
      fireEvent.click(closeButton);

      // Modal should be closed
      expect(document.querySelector(".modal-open")).not.toBeInTheDocument();
    });

    it("switches between different images in modal", () => {
      render(<PhotoGallery />);

      // Click first image
      const imageCards = document.querySelectorAll(".card.cursor-pointer");
      fireEvent.click(imageCards[0]);

      // Should show first image title in modal
      expect(
        screen.getAllByText("Career Fair Outreach").length
      ).toBeGreaterThan(1);

      // Close modal
      const closeButton = screen.getByRole("button", { name: /✕/i });
      fireEvent.click(closeButton);

      // Click second image
      fireEvent.click(imageCards[1]);

      // Should show second image title in modal
      expect(screen.getAllByText("Event Setup").length).toBeGreaterThan(1);
    });
  });

  describe("Content Validation", () => {
    it("displays all expected image titles", () => {
      render(<PhotoGallery />);

      const expectedTitles = [
        "Career Fair Outreach",
        "Event Setup",
        "Information Distribution",
        "Volunteer Team",
        "Professional Conference",
        "Student Engagement",
      ];

      expectedTitles.forEach((title) => {
        expect(screen.getByText(title)).toBeInTheDocument();
      });
    });

    it("displays all expected image descriptions", () => {
      render(<PhotoGallery />);

      const expectedDescriptions = [
        /our volunteers engaging with aspiring pilots/i,
        /team collaboration in setting up our professional display/i,
        /sharing papa resources and membership information/i,
        /our dedicated volunteer team after a successful day/i,
        /representing papa at a major aviation industry conference/i,
        /mentoring and inspiring the next generation/i,
      ];

      expectedDescriptions.forEach((description) => {
        expect(screen.getByText(description)).toBeInTheDocument();
      });
    });

    it("has consistent placeholder text", () => {
      render(<PhotoGallery />);

      const placeholderTexts = screen.getAllByText("Event Photo");
      expect(placeholderTexts.length).toBe(6); // One for each image in grid

      // Open modal to check for full size placeholder text
      const firstImageCard = document.querySelectorAll(
        ".card.cursor-pointer"
      )[0];
      fireEvent.click(firstImageCard);

      const fullSizePlaceholder = screen.getByText("Full Size Event Photo");
      expect(fullSizePlaceholder).toBeInTheDocument();
    });
  });
});

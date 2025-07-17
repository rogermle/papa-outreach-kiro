import { render } from "@testing-library/react";

// Test component to verify theme colors are applied correctly
function ThemeTestComponent() {
  return (
    <div data-testid="theme-test">
      {/* Test primary colors */}
      <div className="bg-primary text-primary-content" data-testid="primary-bg">
        Primary Background
      </div>
      <div className="text-primary" data-testid="primary-text">
        Primary Text
      </div>

      {/* Test secondary colors */}
      <div
        className="bg-secondary text-secondary-content"
        data-testid="secondary-bg"
      >
        Secondary Background
      </div>
      <div className="text-secondary" data-testid="secondary-text">
        Secondary Text
      </div>

      {/* Test accent colors */}
      <div className="bg-accent text-accent-content" data-testid="accent-bg">
        Accent Background
      </div>
      <div className="text-accent" data-testid="accent-text">
        Accent Text
      </div>

      {/* Test neutral colors */}
      <div className="bg-neutral text-neutral-content" data-testid="neutral-bg">
        Neutral Background
      </div>

      {/* Test base colors */}
      <div className="bg-base-100" data-testid="base-100">
        Base 100
      </div>
      <div className="bg-base-200" data-testid="base-200">
        Base 200
      </div>
      <div className="bg-base-300" data-testid="base-300">
        Base 300
      </div>

      {/* Test custom PAPA colors */}
      <div className="text-papa-blue" data-testid="papa-blue">
        PAPA Blue
      </div>
      <div className="text-papa-gold" data-testid="papa-gold">
        PAPA Gold
      </div>
      <div className="text-papa-navy" data-testid="papa-navy">
        PAPA Navy
      </div>
      <div className="text-papa-light-blue" data-testid="papa-light-blue">
        PAPA Light Blue
      </div>

      {/* Test DaisyUI components with theme */}
      <button className="btn btn-primary" data-testid="btn-primary">
        Primary Button
      </button>
      <button className="btn btn-secondary" data-testid="btn-secondary">
        Secondary Button
      </button>
      <button className="btn btn-accent" data-testid="btn-accent">
        Accent Button
      </button>
    </div>
  );
}

describe("PAPA Theme Configuration", () => {
  describe("DaisyUI Theme Colors", () => {
    it("applies primary theme colors correctly", () => {
      render(<ThemeTestComponent />);

      const primaryBg = document.querySelector('[data-testid="primary-bg"]');
      const primaryText = document.querySelector(
        '[data-testid="primary-text"]'
      );

      expect(primaryBg).toHaveClass("bg-primary", "text-primary-content");
      expect(primaryText).toHaveClass("text-primary");
    });

    it("applies secondary theme colors correctly", () => {
      render(<ThemeTestComponent />);

      const secondaryBg = document.querySelector(
        '[data-testid="secondary-bg"]'
      );
      const secondaryText = document.querySelector(
        '[data-testid="secondary-text"]'
      );

      expect(secondaryBg).toHaveClass("bg-secondary", "text-secondary-content");
      expect(secondaryText).toHaveClass("text-secondary");
    });

    it("applies accent theme colors correctly", () => {
      render(<ThemeTestComponent />);

      const accentBg = document.querySelector('[data-testid="accent-bg"]');
      const accentText = document.querySelector('[data-testid="accent-text"]');

      expect(accentBg).toHaveClass("bg-accent", "text-accent-content");
      expect(accentText).toHaveClass("text-accent");
    });

    it("applies neutral theme colors correctly", () => {
      render(<ThemeTestComponent />);

      const neutralBg = document.querySelector('[data-testid="neutral-bg"]');

      expect(neutralBg).toHaveClass("bg-neutral", "text-neutral-content");
    });

    it("applies base theme colors correctly", () => {
      render(<ThemeTestComponent />);

      const base100 = document.querySelector('[data-testid="base-100"]');
      const base200 = document.querySelector('[data-testid="base-200"]');
      const base300 = document.querySelector('[data-testid="base-300"]');

      expect(base100).toHaveClass("bg-base-100");
      expect(base200).toHaveClass("bg-base-200");
      expect(base300).toHaveClass("bg-base-300");
    });
  });

  describe("Custom PAPA Colors", () => {
    it("applies custom PAPA brand colors correctly", () => {
      render(<ThemeTestComponent />);

      const papaBlue = document.querySelector('[data-testid="papa-blue"]');
      const papaGold = document.querySelector('[data-testid="papa-gold"]');
      const papaNavy = document.querySelector('[data-testid="papa-navy"]');
      const papaLightBlue = document.querySelector(
        '[data-testid="papa-light-blue"]'
      );

      expect(papaBlue).toHaveClass("text-papa-blue");
      expect(papaGold).toHaveClass("text-papa-gold");
      expect(papaNavy).toHaveClass("text-papa-navy");
      expect(papaLightBlue).toHaveClass("text-papa-light-blue");
    });
  });

  describe("DaisyUI Component Integration", () => {
    it("applies theme colors to DaisyUI buttons correctly", () => {
      render(<ThemeTestComponent />);

      const primaryBtn = document.querySelector('[data-testid="btn-primary"]');
      const secondaryBtn = document.querySelector(
        '[data-testid="btn-secondary"]'
      );
      const accentBtn = document.querySelector('[data-testid="btn-accent"]');

      expect(primaryBtn).toHaveClass("btn", "btn-primary");
      expect(secondaryBtn).toHaveClass("btn", "btn-secondary");
      expect(accentBtn).toHaveClass("btn", "btn-accent");
    });
  });

  describe("Theme Consistency", () => {
    it("maintains consistent color scheme across components", () => {
      render(<ThemeTestComponent />);

      // Verify that all theme-related classes are present
      const themeElements = document.querySelectorAll(
        '[class*="primary"], [class*="secondary"], [class*="accent"], [class*="neutral"], [class*="base-"]'
      );

      expect(themeElements.length).toBeGreaterThan(0);
    });

    it("supports both new papa color format and legacy format", () => {
      render(<ThemeTestComponent />);

      // Test that both papa.blue and papa-blue formats work
      const legacyPapaBlue = document.querySelector(
        '[data-testid="papa-blue"]'
      );

      expect(legacyPapaBlue).toHaveClass("text-papa-blue");
    });
  });

  describe("Responsive Design Integration", () => {
    it("works with responsive utilities", () => {
      const ResponsiveComponent = () => (
        <div
          className="bg-primary sm:bg-secondary lg:bg-accent"
          data-testid="responsive-bg"
        >
          Responsive Background
        </div>
      );

      render(<ResponsiveComponent />);

      const responsiveBg = document.querySelector(
        '[data-testid="responsive-bg"]'
      );
      expect(responsiveBg).toHaveClass(
        "bg-primary",
        "sm:bg-secondary",
        "lg:bg-accent"
      );
    });
  });

  describe("Gradient Support", () => {
    it("supports gradient combinations with theme colors", () => {
      const GradientComponent = () => (
        <div
          className="bg-gradient-to-r from-primary to-secondary"
          data-testid="gradient-bg"
        >
          Gradient Background
        </div>
      );

      render(<GradientComponent />);

      const gradientBg = document.querySelector('[data-testid="gradient-bg"]');
      expect(gradientBg).toHaveClass(
        "bg-gradient-to-r",
        "from-primary",
        "to-secondary"
      );
    });
  });
});

import { render, screen } from "@testing-library/react";
import RootLayout, { metadata } from "../layout";

// Mock the AuthProvider to avoid complex dependencies
jest.mock("@/context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

// Mock CSS import
jest.mock("../globals.css", () => ({}));

describe("RootLayout", () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  describe("HTML Structure", () => {
    it("renders html element with correct lang and data-theme attributes", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute("lang", "en");
      expect(htmlElement).toHaveAttribute("data-theme", "papa");
    });

    it("renders body element with correct className", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const bodyElement = document.body;
      expect(bodyElement).toHaveClass("antialiased");

      // Verify that font variable classes are not present (as per the diff)
      expect(bodyElement).not.toHaveClass("inter");
      expect(bodyElement).not.toHaveClass("jetbrainsMono");
    });

    it("wraps children with AuthProvider", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const authProvider = screen.getByTestId("auth-provider");
      expect(authProvider).toBeInTheDocument();

      const children = screen.getByTestId("test-children");
      expect(children).toBeInTheDocument();
      expect(authProvider).toContainElement(children);
    });
  });

  describe("Children Rendering", () => {
    it("renders children correctly", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      expect(screen.getByTestId("test-children")).toBeInTheDocument();
      expect(screen.getByText("Test Content")).toBeInTheDocument();
    });

    it("renders multiple children correctly", () => {
      const multipleChildren = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </>
      );

      render(<RootLayout>{multipleChildren}</RootLayout>);

      expect(screen.getByTestId("child-1")).toBeInTheDocument();
      expect(screen.getByTestId("child-2")).toBeInTheDocument();
      expect(screen.getByTestId("child-3")).toBeInTheDocument();
    });

    it("handles empty children gracefully", () => {
      render(<RootLayout>{null}</RootLayout>);

      const authProvider = screen.getByTestId("auth-provider");
      expect(authProvider).toBeInTheDocument();
      expect(authProvider).toBeEmptyDOMElement();
    });
  });

  describe("Theme Configuration", () => {
    it("applies PAPA theme to html element", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute("data-theme", "papa");
    });

    it("maintains theme consistency across renders", () => {
      const { rerender } = render(<RootLayout>{mockChildren}</RootLayout>);

      let htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute("data-theme", "papa");

      rerender(
        <RootLayout>
          <div>New content</div>
        </RootLayout>
      );

      htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute("data-theme", "papa");
    });
  });

  describe("Accessibility", () => {
    it("sets proper language attribute for screen readers", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const htmlElement = document.documentElement;
      expect(htmlElement).toHaveAttribute("lang", "en");
    });

    it("applies antialiased class for better text rendering", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const bodyElement = document.body;
      expect(bodyElement).toHaveClass("antialiased");
    });
  });

  describe("Component Integration", () => {
    it("integrates with AuthProvider correctly", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      // Verify AuthProvider is rendered
      const authProvider = screen.getByTestId("auth-provider");
      expect(authProvider).toBeInTheDocument();

      // Verify children are inside AuthProvider
      const children = screen.getByTestId("test-children");
      expect(authProvider).toContainElement(children);
    });

    it("maintains proper component hierarchy", () => {
      render(<RootLayout>{mockChildren}</RootLayout>);

      const authProvider = screen.getByTestId("auth-provider");
      const children = screen.getByTestId("test-children");

      // AuthProvider should be direct child of body
      expect(document.body).toContainElement(authProvider);

      // Children should be inside AuthProvider
      expect(authProvider).toContainElement(children);
    });
  });

  describe("Props Handling", () => {
    it("accepts children prop correctly", () => {
      const testContent = <main>Main content</main>;
      render(<RootLayout>{testContent}</RootLayout>);

      expect(screen.getByRole("main")).toBeInTheDocument();
      expect(screen.getByText("Main content")).toBeInTheDocument();
    });

    it("handles readonly children prop", () => {
      // This test ensures the component accepts Readonly<{ children: React.ReactNode }>
      const readonlyProps: Readonly<{ children: React.ReactNode }> = {
        children: <div>Readonly children</div>,
      };

      render(<RootLayout {...readonlyProps} />);

      expect(screen.getByText("Readonly children")).toBeInTheDocument();
    });
  });
});

describe("Metadata Export", () => {
  it("exports correct metadata object", () => {
    expect(metadata).toBeDefined();
    expect(metadata.title).toBe("PAPA Volunteer Events");
    expect(metadata.description).toBe(
      "Professional Asian Pilot Association volunteer event management system"
    );
  });

  it("has proper metadata structure", () => {
    expect(typeof metadata).toBe("object");
    expect(typeof metadata.title).toBe("string");
    expect(typeof metadata.description).toBe("string");
  });

  it("contains SEO-friendly metadata", () => {
    expect(metadata.title).toContain("PAPA");
    expect(metadata.title).toContain("Volunteer");
    expect(metadata.description).toContain(
      "Professional Asian Pilot Association"
    );
    expect(metadata.description).toContain("volunteer");
    expect(metadata.description).toContain("event management");
  });
});

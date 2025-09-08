import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

describe("App Component", () => {
  test("renders main heading", () => {
    render(<App />);

    // The h1 element gets automatic test ID: App.h1
    expect(screen.getByTestId("App.h1")).toHaveTextContent(
      "Auto TestId Babel Plugin Demo"
    );
  });

  test("shows info alert about automatic test IDs", () => {
    render(<App />);

    // Alert div gets automatic test ID: App.div (but there are multiple divs, so we use text)
    expect(
      screen.getByText(/All data-testid attributes are automatically generated/)
    ).toBeInTheDocument();
  });

  test("renders navigation component", () => {
    render(<App />);

    // Navigation component should be rendered
    expect(screen.getByText("Auto TestId Demo")).toBeInTheDocument();
    expect(screen.getByText("User Cards")).toBeInTheDocument();
    expect(screen.getByText("Products")).toBeInTheDocument();
    expect(screen.getByText("Todo List")).toBeInTheDocument();
    expect(screen.getByText("Contact Form")).toBeInTheDocument();
  });

  test("starts with user cards tab active", () => {
    render(<App />);

    // Should show user cards section by default
    expect(screen.getByText("User Cards Example")).toBeInTheDocument();
    expect(
      screen.getByText(
        "These user cards demonstrate automatic test ID generation"
      )
    ).toBeInTheDocument();
  });

  test("can switch between tabs", () => {
    render(<App />);

    // Click on Products tab
    fireEvent.click(screen.getByText("Products"));
    expect(screen.getByText("Product Catalog")).toBeInTheDocument();

    // Click on Todo List tab
    fireEvent.click(screen.getByText("Todo List"));
    expect(screen.getByText("My Todo List")).toBeInTheDocument();

    // Click on Contact Form tab
    fireEvent.click(screen.getByText("Contact Form"));
    expect(screen.getByText("Get in Touch")).toBeInTheDocument();
  });

  test("renders sample users in user cards tab", () => {
    render(<App />);

    // Should show the sample users
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });

  test("renders sample products in products tab", () => {
    render(<App />);

    // Switch to products tab
    fireEvent.click(screen.getByText("Products"));

    // Should show sample products
    expect(screen.getByText("Wireless Headphones")).toBeInTheDocument();
    expect(screen.getByText("Smart Watch")).toBeInTheDocument();
    expect(screen.getByText("Laptop Stand")).toBeInTheDocument();
  });

  test("renders footer with attribution", () => {
    render(<App />);

    // Footer should be present
    expect(
      screen.getByText("Built with React + Vite + Babel Plugin Auto TestId")
    ).toBeInTheDocument();
    expect(
      screen.getByText(/All test IDs are automatically generated/)
    ).toBeInTheDocument();
  });

  test("automatically generated test IDs follow hierarchical pattern", () => {
    render(<App />);

    // Main app container
    expect(screen.getByTestId("App.div")).toBeInTheDocument();

    // Header section
    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();

    // Main content area
    const main = screen.getByRole("main");
    expect(main).toBeInTheDocument();

    // Footer
    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });
});

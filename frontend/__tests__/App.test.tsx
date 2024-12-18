import React from "react";
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import { App } from "../src/App";

vi.mock("../src/components/FileUploadInterface", () => ({
  FileUploadInterface: () => <div data-testid="file-upload-interface">File Upload Interface</div>
}));

vi.mock("../src/components/ui/HeaderMenu", () => ({
  HeaderMenu: () => <header data-testid="header-menu">Header Menu</header>
}));

describe("App Component Routing", () => {
  it("renders home page by default", () => {
    render(
      <App />
    );

    expect(screen.getByTestId("header-menu")).toBeInTheDocument();
    expect(screen.getByTestId("file-upload-interface")).toBeInTheDocument();
  });
});
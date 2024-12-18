import React from "react";
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Home, NotFound } from "../src/App";
import { History } from "../src/components/History";
import { Search } from "../src/components/Search";

const renderWithRouter = (initialRoutes = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialRoutes}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MemoryRouter>
  )
}

describe("App Component Routing", () => {
  it("renders Home component for root path", () => {
    renderWithRouter(['/']);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("AI Audio Transcription")).toBeInTheDocument();
  });

  it("renders History component for history path", () => {
    renderWithRouter(["/history"]);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Transcription History")).toBeInTheDocument();
  });

  it("renders Search component for search path", () => {
    renderWithRouter(["/search"]);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Search Results")).toBeInTheDocument();
  });

  it("renders NotFound component for invalid paths", () => {
    renderWithRouter(["/invalid-route"]);

    expect(screen.getByText("Page Not Found!")).toBeInTheDocument();
  });
});
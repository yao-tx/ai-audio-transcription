import React from "react";
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { App } from "../src/App";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MemoryRouter } from "react-router-dom";

jest.mock("../src/components/FileUploadInterface", () => ({
  FileUploadInterface: () => <div data-testid="file-upload-interface">File Upload Interface</div>
}));

jest.mock("../src/components/ui/HeaderMenu", () => ({
  HeaderMenu: () => <header data-testid="header-menu">Header Menu</header>
}));

describe("App Component Routing", () => {
  test("renders home page by default", () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
  });

  expect(screen.getByTestId("header-menu")).toBeInTheDocument();
  expect(screen.getByTestId("file-upload-interface")).toBeInTheDocument();
})
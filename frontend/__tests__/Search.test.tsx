import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, MockedFunction } from "vitest";
import axios from "axios";
import { Search } from "../src/components/Search";

// Mock axios
vi.mock("axios");

describe("Search Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders the search input and button", () => {
    render(<Search />);

    expect(screen.getByPlaceholderText("Search by file name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("displays an error message when no search term is entered", async () => {
    render(<Search />);

    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("Please enter a search term.")).toBeInTheDocument();
  });

  it("displays loading indicator when searching", async () => {
    render(<Search />);

    fireEvent.change(screen.getByPlaceholderText("Search by file name"), { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("displays search results when search is successful", async () => {
    const mockTranscriptionData = [
      {
        id: 1,
        filename: "test-file-1.mp3",
        transcribed_text: "This is the first transcription",
        created_at: "2023-06-15T10:30:00",
      },
      {
        id: 2,
        filename: "test-file-2.mp3",
        transcribed_text: "This is the second transcription",
        created_at: "2023-06-16T11:45:00",
      },
    ];

    (axios.get as MockedFunction<typeof axios.get>).mockResolvedValue({
      data: mockTranscriptionData
    });

    render(<Search />);

    fireEvent.change(screen.getByPlaceholderText("Search by file name"), { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText("test-file-1.mp3")).toBeInTheDocument();
      expect(screen.getByText("test-file-2.mp3")).toBeInTheDocument();
      expect(screen.getByText("This is the first transcription")).toBeInTheDocument();
      expect(screen.getByText("This is the second transcription")).toBeInTheDocument();
    });
  });

  it("displays an error message when the search fails", async () => {
    (axios.get as MockedFunction<typeof axios.get>).mockRejectedValueOnce(
      new Error("Network Error")
    );

    render(<Search />);

    fireEvent.change(screen.getByPlaceholderText("Search by file name"), { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("An unexpected error occurred while fetching search results.")).toBeInTheDocument();
  });

  it("displays no results found when no data is returned", async () => {
    (axios.get as MockedFunction<typeof axios.get>).mockResolvedValueOnce({ data: [] });

    render(<Search />);

    fireEvent.change(screen.getByPlaceholderText("Search by file name"), { target: { value: "test" } });
    fireEvent.click(screen.getByRole("button", { name: /search/i }));

    expect(await screen.findByText("No results found.")).toBeInTheDocument();
  });
});
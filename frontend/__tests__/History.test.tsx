import React from "react";
import { describe, it, expect, vi, MockedFunction } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import { History } from "../src/components/History";

vi.mock("axios");

// Sample mock data
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

describe("History Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("renders loading skeleton while fetching data", async () => {
    (axios.get as MockedFunction<typeof axios.get>).mockImplementation(() =>
      new Promise(() => {}) // Never resolves to keep loading state
    );

    render(<History />);

    const skeletonCards = screen.getAllByTestId("skeleton-card");

    expect(skeletonCards.length).toBe(3);
  });

  it("renders transcription data successfully", async () => {
    (axios.get as MockedFunction<typeof axios.get>).mockResolvedValue({
      data: mockTranscriptionData
    });

    render(<History />);

    await waitFor(() => {
      expect(screen.getByText("test-file-1.mp3")).toBeInTheDocument();
      expect(screen.getByText("test-file-2.mp3")).toBeInTheDocument();
      expect(screen.getByText("This is the first transcription")).toBeInTheDocument();
      expect(screen.getByText("This is the second transcription")).toBeInTheDocument();
    });
  });

  it("displays an error message when API call fails", async () => {
    (axios.get as MockedFunction<typeof axios.get>).mockRejectedValue(
      new Error("Failed to fetch transcriptions")
    );

    render(<History />);

    await waitFor(() => {
      expect(screen.getByText("An unexpected error occurred while fetching transcription history.")).toBeInTheDocument();
    });
  });

  it("displays no transcriptions found when data is empty", async () => {
    (axios.get as MockedFunction<typeof axios.get>).mockResolvedValue({ data: [] });

    render(<History />);

    await waitFor(() => {
      expect(screen.getByText("No transcriptions found.")).toBeInTheDocument();
    });
  });
});
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileUploadInterface } from "../src/components/FileUploadInterface";

describe("FileUploadInterface Component", () => {
  it("displays error message on upload failure", async () => {
    render(<FileUploadInterface />);
    const fileInput = screen.getByTestId("input-file-upload");
    const file = new File(["audio"], "audio.mp3", { type: "audio/mpeg" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    screen.debug();
    expect(await screen.findByText(/error uploading file/i)).toBeInTheDocument();
  });

  it("displays error message on upload invalid file type", async () => {
    render(<FileUploadInterface />);
    const fileInput = screen.getByTestId("input-file-upload");
    const file = new File(["This is a test text file."], "test.txt", { type: "text/plain" });

    fireEvent.change(fileInput, { target: { files: [file] } });
    expect(await screen.findByText(/invalid file type/i)).toBeInTheDocument();
  });
});
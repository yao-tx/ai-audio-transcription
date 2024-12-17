import { useCallback, useState } from "react";
import axios from "axios";
import { clsx } from "clsx";
import { FileRejection } from "react-dropzone";

import { Card } from "./ui/Card";
import { ErrorAlert } from "./ui/ErrorAlert";
import { FileDropzone } from "./FileDropzone";

import type { TranscriptionData } from "../types/transcription";

type FileUploadInterface = {
  className?: string;
}

export function FileUploadInterface({ className }: FileUploadInterface) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [data, setData] = useState<TranscriptionData[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setErrors([]);
    setData([]);
    setIsLoading(true);

    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/transcribe`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const transformedData = response.data.map((item: any) => ({
        id: item.id,
        fileName: item.filename,
        transcribedText: item.transcribed_text,
        createdAt: item.created_at,
      }));

      setData(transformedData);
      setIsLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setErrors([`Error uploading file(s): ${error.message}`]);
      } else {
        setErrors([`Error uploading file(s): ${error}.`]);
      }

      setIsLoading(false);
    }
  }, []);

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const newErrors = fileRejections.map(({ file, errors }) => {
      return errors.map((error) => {
        if (error.code === "file-too-large") {
          return `${file.name} is too large. Max size is 10MB.`;
        }

        if (error.code === "file-invalid-type") {
          return `${file.name} is an invalid file type. Only MP3s are allowed.`;
        }

        return `Error with ${file.name}: ${error.message}`;
      })
    }).flat();

    setErrors(newErrors);
  }, []);

  return (
    <div className={clsx(
      "h-full w-full max-w-3xl mb-8",
      className,
    )}>
      <h1 className="text-4xl font-bold">AI Audio Transcription</h1>
      <p>This is an AI audio transcriber that transcribes MP3 audio files that you upload.</p>
      <FileDropzone
        className="w-full"
        isLoading={isLoading}
        onDrop={onDrop}
        onDropRejected={onDropRejected}
      />
      {errors.length > 0 &&
        <ErrorAlert>
          <ul>
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </ErrorAlert>
      }
      {errors.length === 0 && data.length !== 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold">Results:</h2>
          {data.map((item) => (
            <Card key={item.id}>
              <p className="font-bold text-lg">{item.fileName}</p>
              <p>{item.transcribedText}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
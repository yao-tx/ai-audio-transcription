import { useCallback, useState } from "react";
import axios from "axios";
import { clsx } from "clsx";
import { FileRejection } from "react-dropzone";

import { FileDropzone } from "./FileDropzone";

type FileUploadInterface = {
  className?: string;
}

export function FileUploadInterface({ className }: FileUploadInterface) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setErrors([]);
    setIsLoading(true);

    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("http://localhost:8000/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
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
      "h-full w-full max-w-3xl",
      className,
    )}>
      <h1 className="text-3xl font-bold">AI Audio Transcription</h1>
      <p>This is an AI audio transcriber that transcribes MP3 audio files that you upload.</p>
      <FileDropzone
        className="w-full"
        isLoading={isLoading}
        onDrop={onDrop}
        onDropRejected={onDropRejected}
      />
      {errors.length > 0 &&
        <div className="p-3 bg-red-200 border border-red-400 rounded-md text-red-900 w-full">
          <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
          </ul>
        </div>
      }
    </div>
  );
}
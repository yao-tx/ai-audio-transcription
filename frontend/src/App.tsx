import { useCallback } from "react";
import axios from "axios";
import { FileDropzone } from './components/FileDropzone'

export function App() {
  const handleOnUpload = useCallback(async (acceptedFiles: File[]) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append("files", file));

    try {
      const response = await axios.post("http://localhost:8000/transcribe", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response);
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }, []);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-5">
      <h1 className="text-3xl font-bold">AI Audio Transcription</h1>
      <FileDropzone onDrop={handleOnUpload}/>
    </div>
  )
}
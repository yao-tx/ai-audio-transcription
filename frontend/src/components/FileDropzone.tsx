import { useDropzone } from "react-dropzone";
import { FileUp } from "lucide-react";

type FileDropzoneProps = {
  className?: string;
  onDrop: (files: File[]) => void;
}

export function FileDropzone({ className, onDrop }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'audio/mpeg': ['.mp3'] },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-lg p-16 w-full max-w-md text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-300'
        }`}
      >
        <FileUp className="w-12 h-12 text-gray-600" />
        <input {...getInputProps()} />
        {
          isDragActive ? (
            <p className="text-blue-500">Drop your MP3 files here</p>
          ): (
            <p className="text-gray-600">Drag and drop your MP3 files here, or click to upload.</p>
          )
        }
      </div>
    </div>
  )
}
import { useDropzone, FileRejection } from "react-dropzone";
import { FileUp, Loader2 } from "lucide-react";

type FileDropzoneProps = {
  className?: string;
  isLoading?: boolean;
  onDrop: (files: File[]) => void;
  onDropRejected: (fileRejections: FileRejection[]) => void;
}

export function FileDropzone({ className, isLoading, onDrop, onDropRejected }: FileDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropAccepted: onDrop,
    onDropRejected,
    accept: {
      "audio/mpeg": [".mp3"],
    },
    multiple: true,
    maxSize: 10 * 1024 * 1024,
  });

  return (
    <div className={className}>
      <div
        {...getRootProps()}
        className={`flex flex-col items-center gap-3 border-2 border-dashed rounded-lg p-16 w-full h-full text-center cursor-pointer transition-colors duration-300 ${
          isDragActive ? 'bg-blue-100 border-blue-400' : 'bg-gray-50 border-gray-300'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-20 h-20 animate-spin text-gray-400" />
        ): (
          <>
            <FileUp className={`w-12 h-12 ${isDragActive ? "text-blue-600" : "text-gray-400"}`} />
            <input {...getInputProps()} />
            <p className={`${isDragActive ? "text-blue-600" : "text-gray-400"}`}>
              Drag and drop your MP3 file(s) here, or click to upload.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
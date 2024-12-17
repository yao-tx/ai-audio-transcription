import { useState, useEffect } from "react";
import axios from "axios";

import { Card } from "./ui/Card";
import { ErrorAlert } from "./ui/ErrorAlert";
import { HeaderMenu } from "./ui/HeaderMenu";
import { SkeletonCard } from "./ui/Skeleton";

import type { TranscriptionData } from "../types/transcription";

export function History() {
  const [data, setData] = useState<TranscriptionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/transcriptions`);
      const transformedData: TranscriptionData[] = response.data.map((item: any) => ({
        id: item.id,
        fileName: item.filename,
        transcribedText: item.transcribed_text,
        createdAt: item.created_at,
      }));

      setData(transformedData);
    } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message ?? error.message;
          setError(`Error retrieving transcription history: ${errorMessage}`);
        } else {
          setError("An unexpected error occurred while fetching transcription history.");
        }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <HeaderMenu />
      <div className="h-full flex flex-col gap-8 justify-start items-center px-4 mb-8">
        <h1 className="text-4xl font-bold">Transcriptions History</h1>
        <div className="flex flex-col gap-4 w-full">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={index} className="w-full" />
            ))
          ): error ? (
            <ErrorAlert>{error}</ErrorAlert>
          ): (
            <>
              {data.length > 0 ? (
                data.map((item) => (
                  <Card key={item.id}>
                    <p className="font-bold text-lg">{item.fileName}</p>
                    <p>{item.transcribedText}</p>
                  </Card>
                ))
              ): (
                <p className="text-center">No transcriptions found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
import { useState, useEffect } from "react";
import axios from "axios";

import { useDebounce } from "../hooks/use-debounce";
import { Card } from "../components/ui/Card";
import { SkeletonCard } from "../components/ui/Skeleton";

type TranscriptionData = {
  id: number;
  fileName: string;
  transcribedText: string;
  createdAt: string;
}

export function SearchHistory() {
  const [data, setData] = useState<TranscriptionData[]>([]);
  const [filteredData, setFilteredData] = useState<TranscriptionData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/transcriptions`);
      const transformedData = response.data.map((item: any) => ({
        id: item.id,
        fileName: item.filename,
        transcribedText: item.transcribed_text,
        createdAt: item.created_at,
      }));

      setData(transformedData);
      setFilteredData(transformedData);
    } catch (error) {
      console.log(error);
     // setError(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const results = data.filter(
      (item) => item.fileName.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredData(results);
  }, [debouncedSearchTerm, data]);

  return (
    <div className="min-h-screen flex flex-col gap-8 justify-start items-center px-4">
      <h1 className="text-4xl font-bold mt-5">Search History</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by file name"
        className="w-full border border-gray-300 rounded-md py-3 px-4"
      />
      <div className="flex flex-col gap-4 w-full">
        {isLoading ? (
          <>
            <SkeletonCard className="w-full" />
            <SkeletonCard className="w-full" />
          </>
        ): (
          <>
            {filteredData.map((item) => (
              <Card key={item.id}>
                <p className="font-bold text-lg">{item.fileName}</p>
                <p>{item.transcribedText}</p>
              </Card>
            ))}
          </>
        )}
        {!isLoading && !error && filteredData.length === 0 && (
          <p className="text-center">No results found.</p>
        )}
      </div>
      <a
        href="/"
        aria-label="Return to home papge"
        className="absolute m-3 top-0 right-0 bg-neutral-900 text-white hover:bg-neutral-800 rounded-md py-2 px-4"
      >
        Home
      </a>
    </div>
  );
}
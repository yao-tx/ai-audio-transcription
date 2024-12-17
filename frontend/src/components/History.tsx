import { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Card } from "./ui/Card";
import { HeaderMenu } from "./ui/HeaderMenu";
import { SkeletonCard } from "./ui/Skeleton";

import type { TranscriptionData } from "../types/transcription";

export function History() {
  const [data, setData] = useState<TranscriptionData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?term=${encodeURIComponent(searchTerm)}`)
    }
  }

  return (
    <>
      <HeaderMenu />
      <div className="min-h-screen flex flex-col gap-8 justify-start items-center px-4 mt-32">
        <h1 className="text-4xl font-bold mt-5">Transcriptions History</h1>
        <div className="w-full">
          <form
            onSubmit={handleSubmit}
            className="flex flex-row"
          >
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by file name"
              className="w-full border border-gray-300 border-r-0 rounded-md rounded-r-none py-3 px-4"
            />
            <button
              type="submit"
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 h-full py-3 border border-black rounded-md rounded-l-none"
            >
              <Search className="w-6 h-6" />
              <span className="sr-only">Search</span>
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-4 w-full mb-8">
          {isLoading ? (
            <>
              <SkeletonCard className="w-full" />
              <SkeletonCard className="w-full" />
            </>
          ): (
            <>
              {data.map((item) => (
                <Card key={item.id}>
                  <p className="font-bold text-lg">{item.fileName}</p>
                  <p>{item.transcribedText}</p>
                </Card>
              ))}
            </>
          )}
          {!isLoading && !error && data.length === 0 && (
            <p className="text-center">No transcriptions found.</p>
          )}
        </div>
      </div>
    </>
  );
}
import React, { useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import { Search as SearchIcon, Loader2 } from "lucide-react";

import { Card } from "./ui/Card";
import { ErrorAlert } from "./ui/ErrorAlert";
import { HeaderMenu } from "./ui/HeaderMenu";

import type { TranscriptionData } from "../types/transcription";

export function Search() {
  const [data, setData] = useState<TranscriptionData[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();

    if (term) {
      setIsLoading(true);
      setHasSearched(true);
      setError(null);

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search?term=${term}`);
        const formattedData: TranscriptionData[] = response.data.map((item: any) => ({
          id: item.id,
          fileName: item.filename,
          transcribedText: item.transcribed_text,
          createdAt: format(
            toZonedTime(
              new Date(Date.parse(item.created_at + 'Z')),
              "Asia/Singapore",
            ),
            "yyyy-MM-dd HH:mm:ss",
          ),
        }));

        setData(formattedData);
      } catch(error) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data?.message ?? error.message;
          setError(`Error retrieving search results: ${errorMessage}`);
        } else {
          setError("An unexpected error occurred while fetching search results.");
        }
      } finally {
        setIsLoading(false);
      }

    } else {
      setError("Please enter a search term.");
    }
  }

  return (
    <>
      <HeaderMenu />
      <div className="h-full flex flex-col gap-8 justify-start items-center px-4 mb-8">
        <h1 className="text-4xl font-bold">Search Results</h1>
        <div className="w-full max-w-4xl flex flex-col gap-8 items-center">
          <form
            onSubmit={handleSubmit}
            className="flex flex-row w-full"
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
              aria-label="Search"
              className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 h-full py-3 border border-black rounded-md rounded-l-none"
            >
              <SearchIcon className="w-6 h-6" />
              <span className="sr-only">Search</span>
            </button>
          </form>
          {isLoading ? (
            <Loader2 className="animate-spin h-12 w-12" />
          ): (
            <>
              {data.map((item) => (
                <Card key={item.id} className="w-full">
                  <p className="font-bold text-lg">{item.fileName}</p>
                  <p>{item.transcribedText}</p>
                  <p className="text-sm mt-6 text-gray-400">{item.createdAt}</p>
                </Card>
              ))}
            </>
          )}
          {error && <ErrorAlert>{error}</ErrorAlert>}
          {!isLoading && !error && data.length === 0 && hasSearched && (
            <p className="text-center">No results found.</p>
          )}
        </div>
      </div>
    </>
  )
}
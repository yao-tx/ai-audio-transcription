import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search as SearchIcon, Loader2 } from "lucide-react";

import { ErrorAlert } from "./ui/ErrorAlert";
import { HeaderMenu } from "./ui/HeaderMenu";
import { useDebounce } from "../hooks/use-debounce";

import type { TranscriptionData } from "../types/transcription";

export function Search() {
  const [data, setData] = useState<TranscriptionData>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const term = searchTerm.trim();

    if (term) {
      setIsLoading(true);

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search?term=${term}`);
        console.log(response);
      } catch(error) {
        if (axios.isAxiosError(error)) {
          setError(`Error retrieving search results: ${error.message}`);
        } else {
          setError(`Error retrieving search results: ${error}.`);
        }
      } finally {
        setIsLoading(false);
      }

    } else {
      setError("Enter a search term.");
    }
  }

  return (
    <>
      <HeaderMenu />
      <div className="h-full flex flex-col gap-8 justify-start items-center px-4">
        <h1 className="text-4xl font-bold">Search Results</h1>
        <div className="w-full max-w-4xl flex flex-col gap-8">
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
              <SearchIcon className="w-6 h-6" />
              <span className="sr-only">Search</span>
            </button>
          </form>
          {isLoading && !error && (
            <Loader2 className="animate-spin h-12 w-12" />
          )}
          {error && <ErrorAlert>{error}</ErrorAlert>}
        </div>
      </div>
    </>
  )
}
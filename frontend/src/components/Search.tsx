import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

import { HeaderMenu } from "./ui/HeaderMenu";

import type { TranscriptionData } from "../types/transcription";

export function Search() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("term");

  const [data, setData] = useState<TranscriptionData>();

  useEffect(() => {

  }, []);

  return (
    <>
      <HeaderMenu />
      <div className="min-h-screen flex flex-col gap-8 justify-start items-center px-4 mt-32">
        <h1 className="text-4xl font-bold mt-5">Search Results</h1>
        <div className="w-full"></div>
      </div>
    </>
  )
}
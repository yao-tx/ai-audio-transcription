import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Search as SearchIcon } from "lucide-react";

import { FileUploadInterface } from "./components/FileUploadInterface";
import { HeaderMenu } from "./components/ui/HeaderMenu";
import { History } from "./components/History";
import { Search } from "./components/Search";

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/history" element={<History />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

function Home() {
  return (
    <>
      <HeaderMenu />
      <div className="h-full px-4 flex flex-col items-center justify-center mt-12">
        <FileUploadInterface className="flex flex-col gap-5 items-center justify-center" />
      </div>
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen px-4 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-bold">Page Not Found!</h1>
        <p>The URL you have requested is not available.</p>
      </div>
      <a
        href="/"
        className="px-8 py-4 bg-neutral-900 rounded-lg hover:bg-neutral-800 text-white"
        aria-label="Go back to homepage"
      >
        Go Back Home
      </a>
    </div>
  )
}
import { Search as SearchIcon } from "lucide-react"

export function HeaderMenu() {
  return (
    <div className="absolute top-0 w-full bg-white flex flex-row justify-between items-center p-4">
      <a
        href="/search"
        className="bg-neutral-900 text-white hover:bg-neutral-700 rounded-md py-2 px-4"
        aria-label="Search transcriptions by audio file name"
      >
        <SearchIcon className="w-5 h-5" />
        <span className="sr-only">Search</span>
      </a>
      <a
        href="/"
        aria-label="Go to Homepage"
        className="uppercase font-bold text-md text-neutral-900 hover:text-neutral-700"
      >
          Home
      </a>
      <a
        href="/history"
        className="bg-neutral-900 text-white hover:bg-neutral-700 rounded-md py-2 px-4"
        aria-label="View all transcriptions history"
      >
        History
      </a>
    </div>
  )
}
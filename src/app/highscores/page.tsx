"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import startBanner from "../assets/start-banner.png";
import { usePagination } from "../hooks/usePagination";

interface Highscore {
  username: string;
  score: number;
  date: number;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const fetchHighscores = async (): Promise<Highscore[]> => {
  const response = await axios.get("/api/highscores");
  return response.data.items;
};

function Highscores() {
  const itemsPerPage = 20;

  const {
    data: highscores = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["highscores"],
    queryFn: fetchHighscores,
  });

  const {
    currentItems,
    currentPage,
    totalPages,
    pageNumbers,
    indexOfFirstItem,
    indexOfLastItem,
    paginate,
    goToPreviousPage,
    goToNextPage,
  } = usePagination<Highscore>({
    items: highscores,
    itemsPerPage,
    maxPageButtons: 5,
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-2xl font-bold mb-2 text-center">
          <Link
            href="/"
            className="hover:text-violet-400 transition-colors cursor-pointer"
          >
            Typo Terminator&apos;s
          </Link>
        </h1>
        <div className="relative w-fit overflow-hidden rounded-lg">
          <Image
            src={startBanner}
            alt="Typo Terminator Banner"
            priority
            className="max-w-full rounded-lg"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-8xl text-black drop-shadow-lg px-4 text-center">
              top 100 highscores
            </p>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">Failed to load highscores</span>
        </div>
      )}

      {!isLoading && !error && highscores.length === 0 && (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">
            No highscores yet. Be the first to play!
          </p>
        </div>
      )}

      {!isLoading && !error && highscores.length > 0 && (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-gray-800 text-gray-200">
              <thead className="bg-gray-900 text-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left w-16">#</th>
                  <th className="py-3 px-4 text-left">Username</th>
                  <th className="py-3 px-4 text-right">Score</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {currentItems.map((highscore, index) => {
                  const globalRank = indexOfFirstItem + index;
                  return (
                    <tr
                      key={index}
                      className={`hover:bg-gray-700 ${globalRank < 3 ? "bg-gray-700" : ""}`}
                    >
                      <td className="py-3 px-4 font-medium">
                        {globalRank === 0 && (
                          <span className="text-yellow-500 text-xl">🥇</span>
                        )}
                        {globalRank === 1 && (
                          <span className="text-gray-300 text-xl">🥈</span>
                        )}
                        {globalRank === 2 && (
                          <span className="text-amber-600 text-xl">🥉</span>
                        )}
                        {globalRank > 2 && <span>{globalRank + 1}</span>}
                      </td>
                      <td className="py-3 px-4 font-medium">
                        {highscore.username}
                      </td>
                      <td className="py-3 px-4 text-right">
                        {highscore.score.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400">
                        {formatDate(highscore.date)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-6">
            <nav className="flex items-center">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-l-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous page"
              >
                &laquo;
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-3 py-1 ${
                    currentPage === number
                      ? "bg-violet-600 text-white"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-r-md bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next page"
              >
                &raquo;
              </button>
            </nav>
          </div>

          <div className="text-center mt-2 text-sm text-gray-400">
            Showing {indexOfFirstItem + 1}-
            {Math.min(indexOfLastItem, highscores.length)} of{" "}
            {highscores.length} entries
          </div>
        </>
      )}

      {/* Back to Game Button */}
      <div className="mt-10 flex justify-center">
        <Link
          href="/"
          className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-medium rounded-lg transition-colors"
        >
          Back to Game
        </Link>
      </div>
    </div>
  );
}

export default Highscores;

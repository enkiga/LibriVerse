import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { books } from "@/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";

const BooksPage = () => {
  const [searchParams] = useSearchParams();
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Reset states when search query changes
  useEffect(() => {
    setBooksData([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [searchParams]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const query = searchParams.get("q") || "";
        const limit = 12;

        const data = await books.getBooks(currentPage, limit, query);

        if (currentPage === 1) {
          setBooksData(data);
        } else {
          setBooksData((prev) => [...prev, ...data]);
        }

        setHasMore(data.length >= limit);
        setError("");
      } catch (err) {
        setError("Failed to fetch books. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchBooks();
  }, [searchParams, currentPage]);

  const handleLoadMore = () => {
    setLoadingMore(true);
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <section className="pt-20 w-full">
      <div className="w-11/12 mx-auto">
        <div>
          {loading && <LoadingSpinner />}
          {error && <p className="text-red-500">{error}</p>}

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Search Results for "{searchParams.get("q")}"
          </h1>

          <div className="flex flex-wrap justify-start mt-4">
            {booksData.map((book) => (
              <BookCard
                key={book.id}
                id={book.id}
                title={book.volumeInfo.title}
                imageLink={book.volumeInfo.imageLinks?.thumbnail}
              />
            ))}
          </div>

          {!loading && hasMore && (
            <div className="flex justify-center mt-8">
              <Button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="my-2"
              >
                {loadingMore ? <LoadingSpinner size="sm" /> : "Load More"}
              </Button>
            </div>
          )}

          {!hasMore && booksData.length > 0 && (
            <p className="text-center mt-4 text-gray-500">
              No more books to load
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default BooksPage;

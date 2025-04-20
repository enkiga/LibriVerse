import React, { use, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { books } from "@/api";
import LoadingSpinner from "@/components/LoadingSpinner";

const BooksPage = () => {
  const [searchParams] = useSearchParams();
  const [booksData, setBooksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const query = searchParams.get("q") || "";
        const data = await books.getBooks(1, 10, query);
        setBooksData(data);
        setError("");
      } catch (err) {
        setError("Failed to fetch books. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [searchParams]);
  return (
    <section className="pt-20 w-full">
      <div className=" w-11/12 mx-auto">
        <div>
          {loading && <LoadingSpinner />}
          {error && <p className="text-red-500">{error}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {booksData.map((book) => (
              <div key={book.id} className="border p-4 rounded-lg">
                <h3 className="font-bold">{book.volumeInfo.title}</h3>
                <p>{book.volumeInfo.authors?.join(", ")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BooksPage;

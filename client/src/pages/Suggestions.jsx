import React, { useState, useEffect } from "react";
import { auth } from "@/api";
import BookCard from "@/components/BookCard";

const SuggestionsPage = () => {
  // get suggestions from api
  const [suggestions, setSuggestions] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const response = await auth.suggestBooks();
      setSuggestions(response?.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!suggestions.length) return <div>No suggestions available</div>;
  return (
    <section className="pt-20 w-full">
      <div className="w-11/12 mx-auto">
        <h1 className="text-2xl font-bold mb-4">Suggestions</h1>
        <div className="flex flex-wrap justify-start mt-4">
          {suggestions.map((book) => (
            <BookCard
              key={book.googleBooksId}
              title={book.title}
              id={book.googleBooksId}
              imageLink={book.coverImage}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SuggestionsPage;

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { auth } from "@/api";
import BookCard from "@/components/BookCard";

const SuggestionsPage = () => {
  // useQuery handles loading, error, and data states for you
  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["suggestions"], // A unique key for caching this data
    queryFn: auth.suggestBooks, // The function that fetches the data
  });

  // Extract the actual suggestions array from the response
  const suggestions = response?.data || [];

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!Array.isArray(suggestions) || suggestions.length === 0) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center text-gray-500 text-center px-4">
        No suggestions available! <br /> Favorite a book first to tailor your
        suggestions.
      </div>
    );
  }

  return (
    <section className="pt-20 w-full">
      <div className="w-11/12 mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Your Personalized Suggestions
        </h1>
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

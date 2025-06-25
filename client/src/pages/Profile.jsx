import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import RecommendationsCard from "@/components/RecommendationsCard";
import BookCard from "@/components/BookCard";

const ProfilePage = () => {
  const { user, loading } = useUser();

  // Early return if user data is not ready
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <p className="text-center text-red-500 pt-20 font-semibold">
        You need to be logged in to view your profile.
      </p>
    );
  }

  // Extract user info from context
  const userData = user;

  return (
    <section className="w-11/12 mx-auto pt-20 flex flex-col">
      {/* User info card */}
      <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-white/60 shadow-md rounded-lg px-6 py-2 mb-6 border-l-6 border-primary">
        <p className="text-gray-700 text-3xl font-semibold tracking-wider">
          {userData.username}
        </p>
        <div className="flex items-center gap-8 mt-2 w-full justify-between md:w-fit">
          <Stat label="Books" count={userData.recommendations?.length} />
          <Stat label="Following" count={userData.following?.length} />
          <Stat label="Followers" count={userData.followers?.length} />
        </div>
      </div>

      {/* Tabs section */}
      <Tabs
        defaultValue="books"
        className="w-full bg-white/60 shadow-md rounded-lg px-6 py-2 border-l-6 border-primary mb-5"
      >
        <TabsList className="w-full flex justify-between items-center">
          <TabsTrigger
            value="books"
            className="w-full text-center font-semibold text-lg"
          >
            Books
          </TabsTrigger>
          <TabsTrigger
            value="favorites"
            className="w-full text-center font-semibold text-lg"
          >
            Favorites
          </TabsTrigger>
        </TabsList>

        {/* Books Tab */}
        <TabsContent value="books" className="pt-4">
          {Array.isArray(userData?.recommendations) &&
          userData.recommendations.length > 0 ? (
            <div className="flex flex-wrap justify-start mt-4">
              {userData.recommendations.map((book) => (
                <RecommendationsCard
                  key={book.book.googleBooksId}
                  title={book.book.title}
                  imageLink={book.book.coverImage}
                  id={book.book.googleBooksId}
                  text={book.recommendationText}
                  likes={book.likes.length}
                  comments={book.comments.length}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No recommendations yet.</p>
          )}
        </TabsContent>

        {/* Favorites Tab */}
        <TabsContent value="favorites" className="pt-4">
          {Array.isArray(userData?.profile?.favoriteBooks) &&
          userData.profile.favoriteBooks.length > 0 ? (
            <div className="flex flex-wrap justify-start mt-4">
              {userData.profile.favoriteBooks.map((book) => (
                <BookCard
                  key={book.googleBooksId}
                  title={book.title}
                  imageLink={book.coverImage}
                  id={book.googleBooksId}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No favorites yet.</p>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};

// Reusable stat component
const Stat = ({ label, count }) => (
  <div className="flex flex-col items-center gap-0.5">
    <p className="font-semibold text-2xl">{count ?? 0}</p>
    <p className="text-sm">{label}</p>
  </div>
);

export default ProfilePage;

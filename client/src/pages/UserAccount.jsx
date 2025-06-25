import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { auth } from "@/api";
import { useUser } from "@/context/UserContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import RecommendationsCard from "@/components/RecommendationsCard";
import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";

const UserAccountPage = () => {
  const [userData, setUserData] = useState(null);
  const [currentUserData, setCurrentUserData] = useState(null);
  // get user id from url params
  const { id: userId } = useParams();
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  // get user id from context
  const currentUserId = user?.user._id || null;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, currentUserRes] = await Promise.all([
          auth.getUserById(userId),
          auth.getUserById(currentUserId),
        ]);
        setUserData(userRes.data);
        setCurrentUserData(currentUserRes.data);
      } finally {
        setLoading(false);
      }
    };

    if (userId && currentUserId) fetchData();
  }, [userId, currentUserId]);

  // handle follow and unfollow
  const followUser = async () => {
    setLoading(true);
    try {
      await auth.followUser(userId);

      // optimistically update the current user data in the state
      setCurrentUserData((prev) => ({
        ...prev,
        following: [...prev.following, userId],
      }));

      setUserData((prev) => ({
        ...prev,
        followers: [...prev.followers, currentUserId],
      }));
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setLoading(false);
    }
  };

  const unfollowUser = async () => {
    setLoading(true);
    try {
      await auth.unfollowUser(userId);

      // optimistically update the current user data in the state
      setCurrentUserData((prev) => ({
        ...prev,
        following: prev.following.filter((id) => id !== userId),
      }));

      setUserData((prev) => ({
        ...prev,
        followers: prev.followers.filter((id) => id !== currentUserId),
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Convert both IDs to strings for comparison
  const isFollowing = currentUserData?.following.some(
    (id) => id.toString() === userId.toString()
  );
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <section className="w-11/12 mx-auto pt-20 flex flex-col">
          {/* User information */}
          <div className="w-full flex flex-col md:flex-row items-start md:items-center justify-between bg-white/60 shadow-md rounded-lg px-6 py-2 mb-6 border-l-6 border-primary">
            <p className="text-gray-700  w-full text-3xl  font-semibold tracking-wider">
              {userData?.username}
            </p>
            <div className="flex items-center gap-8 mt-2 w-full justify-between md:w-fit">
              <div className="flex flex-col items-center gap-0.5">
                {/* Get length of recommendation data */}

                <p className="font-semibold text-2xl">
                  {userData?.recommendations.length}
                </p>
                <p className="text-sm">Books</p>
              </div>
              {/* Following */}
              <div className="flex flex-col items-center gap-0.5">
                <p className="font-semibold text-2xl">
                  {userData?.following.length}
                </p>
                <p className="text-sm">Following</p>
              </div>
              {/* Followers */}
              <div className="flex flex-col items-center gap-0.5">
                <p className="font-semibold text-2xl">
                  {userData?.followers.length}
                </p>
                <p className="text-sm">Followers</p>
              </div>
            </div>
          </div>
          {/* Follow unfollow buttons */}
          {/* check if current user is following the following userID */}
          {isFollowing ? (
            <Button
              className="my-3 bg-red-800"
              variant="destructive"
              onClick={unfollowUser}
              disabled={loading}
            >
              {loading ? "Processing..." : "Unfollow"}
            </Button>
          ) : (
            <Button className="my-3" onClick={followUser} disabled={loading}>
              {loading ? "Processing..." : "Follow"}
            </Button>
          )}
          {/* User recommendations */}
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
            <TabsContent value="books" className="pt-4">
              {/* Check if recommendation is empty else map through it  */}
              {userData?.recommendations.length === 0 ? (
                <p className="text-center text-gray-500">
                  No recommendations yet.
                </p>
              ) : (
                <div className="flex flex-wrap justify-start mt-4">
                  {userData?.recommendations.map((book) => (
                    <>
                      <RecommendationsCard
                        key={book.book.googleBooksId}
                        title={book.book.title}
                        imageLink={book.book.coverImage}
                        id={book.book.googleBooksId}
                        text={book.recommendationText}
                        likes={book.likes.length}
                        comments={book.comments.length}
                      />
                    </>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="favorites" className="pt-4">
              {userData?.profile?.favoriteBooks?.length === 0 ? (
                <p className="text-center text-gray-500">No favorites yet.</p>
              ) : (
                <div className="flex flex-wrap justify-start mt-4">
                  {userData?.profile?.favoriteBooks?.map((book) => (
                    <>
                      <BookCard
                        key={book.googleBooksId}
                        title={book.title}
                        imageLink={book.coverImage}
                        id={book.googleBooksId}
                      />
                    </>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </section>
      )}
    </>
  );
};

export default UserAccountPage;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "@/api/books";
import { auth, recommendation } from "@/api";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  recommendationText: z.string().min(2, {
    message: "Recommendation must be at least 2 characters",
  }),
});

const BookDetail = () => {
  const { id: googleBookId } = useParams();
  const [book, setBook] = useState(null);
  const [mongoBookId, setMongoBookId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recommendationText: "",
    },
  });

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const response = await getBookById(googleBookId);

        if (response?.success) {
          // Store both MongoDB ID and book data
          setMongoBookId(response.book._id);
          setBook(response.book.volumeInfo || response.book);
        } else {
          setError(response?.message || "Book data format invalid");
        }
      } catch (err) {
        setError(err.message || "Failed to fetch book details");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [googleBookId]);

  // function to convert published date to a readable format
  const formatPublishedDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-red-500 text-center mt-8 pt-20">{error}</div>;
  if (!book) return <div className="text-center mt-8">Book not found</div>;

  // Destructure with proper fallbacks and nested structure handling
  const {
    title = "Unknown Title",
    subtitle,
    author = [],
    publisher = "Unknown Publisher",
    publishedDate = "Unknown Date",
    rating,
    description = "No description available",
    coverImage,
  } = book;

  // add to favorite function
  const addToFavourites = async () => {
    try {
      const response = await auth.addToFavourites(mongoBookId);
      if (response?.success) {
        toast("Added to favorites", {
          description: "Book added to favourites successfully!",
        });
      } else {
        toast("Failed to add to favorites", {
          description: `${
            response?.message || "Failed to add book to favourites"
          } `,
        });
      }
    } catch (err) {
      toast("Failed to add to favorites", {
        description: `${err || "Failed to add book to favourites"} `,
      });
    }
  };

  // Add to recommendation logic
  // Defining form
  // Add to recommendation logic

  const submitRecommendation = async (values) => {
    const { recommendationText } = values;
    console.log(values);
    // Add your submission logic here
    if (!mongoBookId) {
      toast("Error", {
        description: "Book information is not available.",
      });
      return;
    }

    try {
      const response = await recommendation.createRecommendation({
        bookId: mongoBookId,
        recommendationText,
      });

      if (response?.success) {
        toast("Recommendation submitted", {
          description: "Your recommendation has been added successfully!",
        });
        form.reset();
      } else {
        toast("Failed to submit recommendation", {
          description: response?.message || "Please try again later.",
        });
      }
    } catch (error) {
      toast("Failed to submit recommendation", {
        description: error.message || "An unexpected error occurred.",
      });
    }
  };

  return (
    <section className="pt-20 w-full">
      <div className="flex flex-wrap w-11/12 mx-auto mb-4">
        {/* Left Column */}
        <div className="md:w-1/3 w-full flex flex-col items-center justify-start">
          <div className="w-full">
            <img
              src={
                coverImage ||
                "https://images.unsplash.com/photo-1586096926620-acc7544cf50d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              }
              alt={title}
              className="shadow-md rounded-sm md:w-7/12 w-9/12 mx-auto md:mx-0"
            />
          </div>
          <div className="flex flex-col w-full my-4 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="md:w-7/12 w-9/12 mx-auto md:mx-0">
                  Add to Recommendation
                </Button>
              </DialogTrigger>

              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Recommendations</DialogTitle>
                  <DialogDescription>
                    Add {title} to your recommendation List
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(submitRecommendation)}
                    className="flex flex-col space-y-3"
                  >
                    <FormField
                      control={form.control}
                      name="recommendationText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Recommendation Text</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Type your message here."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Button
              variant="outline"
              className="md:w-7/12 w-9/12 mx-auto md:mx-0"
              onClick={addToFavourites}
            >
              Add to Favourites
            </Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:w-2/3 w-full flex flex-col">
          <h1 className="text-4xl font-bold text-gray-800 font-heading tracking-wide">
            {title}
          </h1>

          {subtitle && (
            <h2 className="text-xl font-semibold text-gray-600 tracking-wide">
              {subtitle}
            </h2>
          )}

          <div className="mt-4 space-y-2">
            <p className="text-gray-600">
              <strong>By:</strong> {author.join(", ") || "Unknown Author"}
            </p>
            <p className="text-gray-600">
              <strong>Publisher:</strong> {publisher}
            </p>
            <p className="text-gray-600">
              <strong>Published:</strong> {formatPublishedDate(publishedDate)}
            </p>
            <p className="text-gray-600">
              <strong>Rating:</strong> {rating ? `${rating}/5` : "N/A"}
            </p>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookDetail;

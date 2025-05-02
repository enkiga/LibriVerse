import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById } from "@/api/books";
import { auth, recommendation, review } from "@/api";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";
import { z } from "zod";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusIcon, StarHalfIcon, StarIcon } from "lucide-react";

const formSchema = z.object({
  recommendationText: z.string().min(2, {
    message: "Recommendation must be at least 2 characters",
  }),
});

const reviewFormSchema = z.object({
  rating: z.coerce
    .number()
    .int({ message: "Rating must be an integer" })
    .min(1, { message: "Minimum rating is 1" })
    .max(5, { message: "Maximum rating is 5" }),
  reviewText: z.string().min(10, {
    message: "Review must be at least 10 characters",
  }),
});

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
};

const BookDetail = () => {
  const { id: googleBookId } = useParams();
  const [book, setBook] = useState(null);
  const [mongoBookId, setMongoBookId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingsDistribution, setRatingsDistribution] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recommendationText: "",
    },
  });

  const reviewForm = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      rating: undefined,
      reviewText: "",
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

  // Use effect for ratings & reviews
  useEffect(() => {
    const fetchReviewsData = async () => {
      if (!mongoBookId) return;
      try {
        setReviewsLoading(true);
        const response = await review.getReviewsForBook(mongoBookId);
        if (response?.success) {
          setReviews(response.data.reviews);
          calculateRatingsMetrics(response.data.reviews);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviewsData();
  }, [mongoBookId]);

  console.log(mongoBookId);

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

  const calculateRatingsMetrics = (reviews) => {
    if (!reviews.length) {
      setAverageRating(0);
      setRatingsDistribution([]);
      return;
    }

    // Calculate average rating
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    setAverageRating((total / reviews.length).toFixed(1));

    // Calculate ratings distribution
    const distribution = Array(5).fill(0);
    reviews.forEach((review) => {
      const rating = Math.floor(Number(review.rating));
      if (rating >= 1 && rating <= 5) distribution[rating - 1]++;
    });

    const distributionData = distribution.map((count, index) => ({
      ratingRange: `${index + 1} Star${index !== 0 ? "s" : ""}`,
      users: count,
    }));
    setRatingsDistribution(distributionData);
  };

  const submitReview = async (values) => {
    try {
      if (!mongoBookId) {
        toast.error("Book information not available");
        return;
      }

      const response = await review.createReview({
        bookId: mongoBookId,
        rating: values.rating,
        reviewText: values.reviewText,
      });

      if (response?.success) {
        toast.success("Review submitted successfully");
        // Refresh reviews
        const newReviews = await review.getReviewsForBook(mongoBookId);
        setReviews(newReviews.data.reviews);
        calculateRatingsMetrics(newReviews.data.reviews);
        reviewForm.reset();
        setIsDialogOpen(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    }
  };

  return (
    <section className="pt-20 w-full">
      {/* Book Detail Section */}
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
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {description || "No description provided"}
            </p>
          </div>
        </div>
      </div>
      {/* Reviews & Rating Section */}
      <div className="flex flex-col w-11/12 mx-auto mb-4 border-t pt-2">
        <div className="w-full">
          <div className="flex flex-row w-full items-center justify-between mt-2 mb-4">
            <h1 className="font-semibold text-2xl">Ratings</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon />
                  Add Review
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Review</DialogTitle>
                  <DialogDescription>Add Review for {title}</DialogDescription>
                </DialogHeader>
                <Form {...reviewForm}>
                  <form
                    onSubmit={reviewForm.handleSubmit(submitReview)}
                    className="flex flex-col space-y-3"
                  >
                    <FormField
                      control={reviewForm.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ratings</FormLabel>
                          <FormControl>
                            {/* use select of range 1-5 */}
                            <Select
                              onValueChange={(value) =>
                                field.onChange(Number(value))
                              }
                              value={field.value?.toString()}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Rating" />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <SelectItem
                                    key={rating}
                                    value={rating.toString()}
                                  >
                                    <div className="flex items-center gap-1">
                                      <span>{rating}</span>
                                      {[...Array(rating)].map((_, i) => (
                                        <StarIcon
                                          key={i}
                                          className="w-4 h-4 text-yellow-500"
                                        />
                                      ))}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={reviewForm.control}
                      name="reviewText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Review Text</FormLabel>
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
                    <Button type="submit">Submit Review</Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          {reviewsLoading ? (
            <LoadingSpinner />
          ) : reviews.length === 0 ? (
            <p className="text-gray-500 text-center my-5">No reviews yet! Be the first to leave a review and ratings</p>
          ) : (
            <div className="w-full">
              <div className="flex flex-wrap">
                <div className="md:w-1/3 w-full flex flex-col md:items-center justify-center space-y-4 py-3 md:py-0">
                  <p className="font-semibold text-xl">Average Ratings</p>
                  <h1 className="text-6xl font-bold">
                    <span className="text-primary">{averageRating}</span>/5
                  </h1>
                </div>
                <div className="md:w-2/3 w-full py-3 md:py-0">
                  <ChartContainer config={chartConfig} className="w-full h-40 ">
                    <BarChart
                      accessibilityLayer
                      data={ratingsDistribution}
                      layout="vertical"
                      margin={{
                        left: -20,
                      }}
                    >
                      <XAxis type="number" dataKey="users" hide />
                      <YAxis
                        dataKey="ratingRange"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar
                        dataKey="users"
                        fill="var(--color-desktop)"
                        radius={5}
                      />
                    </BarChart>
                  </ChartContainer>
                </div>
              </div>
              <h1 className="font-semibold text-2xl my-2">Reviews</h1>
              <div className="">
                <ScrollArea className="w-full h-96 p-4">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="mb-4 p-4 border-b last:border-b-0"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex flex-row items-center justify-between w-full">
                          <p className="font-semibold">
                            {review.user?.username}{" "}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(Math.floor(review.rating))].map(
                              (_, i) => (
                                <StarIcon
                                  key={i}
                                  className="w-4 h-4 text-yellow-500"
                                />
                              )
                            )}
                            {review.rating % 1 !== 0 && (
                              <StarHalfIcon className="w-4 h-4 text-yellow-500" />
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-600 text-justify tracking-wide">
                        {review.reviewText}
                      </p>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BookDetail;

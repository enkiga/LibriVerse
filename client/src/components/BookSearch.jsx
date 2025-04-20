import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

const FormSchema = z.object({
  query: z.string().min(1, {
    message: "Search cannot be empty",
  }),
  category: z.enum(["all", "author", "genre", "publisher"]),
});

const BookSearch = () => {
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      query: "",
      category: "all",
    },
  });

  const onSubmit = (values) => {
    const searchQuery = values.query.trim();
    const category = values.category;

    let finalQuery = searchQuery;

    if (category !== "all") {
      const prefixes = {
        author: "inauthor:",
        genre: "subject:",
        publisher: "inpublisher:",
      };
      finalQuery = `${prefixes[category]}${encodeURIComponent(searchQuery)}`;
    }

    navigate(`/books?q=${encodeURIComponent(finalQuery)}`);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full max-w-sm items-center space-x-2 mt-10"
      >
        <FormField
          control={form.control}
          name="query"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Search for books..."
                  {...field}
                  className="bg-background/80 border border-primary rounded-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-fit bg-background/80 border border-primary rounded-full">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Search By</SelectLabel>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="author">Author</SelectItem>
                    <SelectItem value="genre">Genre</SelectItem>
                    <SelectItem value="publisher">Publisher</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" size="icon" className="rounded-full">
          <SearchIcon className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
};

export default BookSearch;

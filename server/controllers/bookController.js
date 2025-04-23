const axios = require("axios");
const Book = require("../models/bookModel");

// Function to fetch book data from Google Books API using the book ID
async function fetchBookData(googleBooksId) {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes/${googleBooksId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching book data:", error.message);
    return null;
  }
}

// api top get book by googleBooksId and save it to the database if not already saved
exports.getBook = async (req, res) => {
  const { googleBooksId } = req.query;

  if (!googleBooksId) {
    return res
      .status(400)
      .json({ success: false, message: "Google Books ID is required" });
  }

  try {
    // Check if the book already exists in the database
    let book = await Book.findOne({ googleBooksId });

    if (book) {
      return res.status(200).json({
        success: true,
        message: "Book already exists",
        book,
      });
    }

    if (!book) {
      // Fetch book data from Google Books API
      const bookData = await fetchBookData(googleBooksId);

      if (!bookData) {
        return res
          .status(404)
          .json({ success: false, message: "Book not found" });
      }

      // Create a new book instance and save it to the database
      book = new Book({
        googleBooksId: bookData.id,
        title: bookData.volumeInfo.title,
        author: bookData.volumeInfo.authors || [],
        description: bookData.volumeInfo.description || "",
        coverImage: bookData.volumeInfo.imageLinks
          ? bookData.volumeInfo.imageLinks.thumbnail
          : "",
        publisher: bookData.volumeInfo.publisher || "",
        publishedDate: bookData.volumeInfo.publishedDate || null,
      });
      await book.save();
    }

    return res.status(200).json({
      success: true,
      message: "Book fetched successfully",
      book,
    });
  } catch (error) {
    console.error("Error fetching book data:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

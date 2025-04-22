import React from "react";
import { useNavigate } from "react-router-dom";

const BookCard = ({ title, imageLink, id }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/books/${id}`);
  };
  return (
    <div
      className="p-4 cursor-pointer w-1/2 md:w-1/6 flex flex-col items-start"
      onClick={handleClick}
    >
      {/* Image */}
      <img
        src={
          imageLink ||
          "https://images.unsplash.com/photo-1586096926620-acc7544cf50d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt="Book Cover"
        className="w-full h-[250px] object-cover rounded-sm shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105"
        loading="lazy"
      />

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mt-2 cursor-pointer line-clamp-2 ">
        {title}
      </h3>
    </div>
  );
};

export default BookCard;

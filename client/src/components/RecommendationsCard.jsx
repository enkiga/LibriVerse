import { HeartIcon, MessageCircleIcon } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const RecommendationsCard = ({
  title,
  imageLink,
  id,
  text,
  likes,
  comments,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/books/${id}`);
  };
  return (
    <div
      className="p-4 w-1/2 md:w-1/5 flex flex-col items-start"
      
    >
      {/* Image */}
      <img
        src={
          imageLink ||
          "https://images.unsplash.com/photo-1586096926620-acc7544cf50d?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
        alt="Book Cover"
        className="w-full h-[250px] object-cover rounded-sm shadow-md transition-transform duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        loading="lazy"
        onClick={handleClick}
      />

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 mt-2 cursor-pointer line-clamp-2 ">
        {title}
      </h3>

      {/* Likes and comments with icons */}
      <div className="flex flex-row justify-end items-center w-full">
        <div className="flex items-center ml-2 gap-1">
          <span className="text-sm text-gray-500">{likes}</span>
          <HeartIcon className="h-4 w-4 text-red-500 mr-1" />
        </div>
        <div className="flex items-center ml-2 gap-1">
          <span className="text-sm text-gray-500">{comments}</span>
          <MessageCircleIcon className="h-4 w-4 text-gray-500 mr-1" />
        </div>
      </div>

      {/* Text */}
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{text}</p>
    </div>
  );
};

export default RecommendationsCard;

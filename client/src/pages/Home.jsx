import React from "react";
import BookSearch from "@/components/BookSearch";


const HomePage = () => {
  return (
    // bg with graadient
    <section className="w-full bg-gradient-to-b from-primary/0 to-primary/20">
      <div className="md:w-11/12 w-5/6 mx-auto flex flex-col items-center justify-center h-screen">
        {/* badge */}
        <div className="bg-background px-2 py-1 border border-primary rounded-full shadow-sm">
          <p className=" text-xs text-text/70">Explore Infinite Book Worlds.</p>
        </div>
        {/* Hero Quote */}
        <div className="mt-8">
          <h1 className="md:text-5xl text-3xl text-center font-medium font-heading">
            Community of Readers
          </h1>
        </div>
        {/* slogan */}
        <div className="mt-6">
          <p className="text-sm tracking-wide text-gray-500 text-center">
            Dive into a universe where every page turns into an adventure,{" "}
            <br className="hidden md:block" /> and every story connects us all.
          </p>
        </div>

        {/* Book Search */}
        <BookSearch />
        
      </div>
    </section>
  );
};

export default HomePage;

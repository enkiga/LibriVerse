import React from "react";

const Footer = () => {
  // Get current year
  const date = new Date();
  const year = date.getFullYear();

  return (
    <footer className="bg-background border-t-2 border-primary">
      <div className="mx-auto w-full px-4 py-3 ">
        <p className="my-1 w-full text-center text-sm text-text">
          Copyright &copy; {year}. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

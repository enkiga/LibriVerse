import { publicNavLinks } from "@/lib/contants";
import React from "react";
import LIBRIVERSE from "@/assets/LIBRIVERSE.png";
import { NavLink } from "react-router";
import { LogOutIcon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { auth } from "@/api";

const Navbar = () => {
  const glassBg =
    "rounded-full px-2 py-1 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 shadow-sm";

  const { user, loading } = useUser();


  // condition to check if user is loading or not
  if (loading) {
    return (
      <nav className="fixed top-2 right-2 left-2 z-10 ">
        <div className="w-full mx-auto flex items-center justify-between px-4">
          <div className={`flex items-center gap-1 ${glassBg}`}>
            <img
              src={LIBRIVERSE}
              alt="Logo"
              className="w-10 h-10 object-contain"
            />
            <p className="font-semibold text-gray-700">LibriVerse</p>
          </div>
        </div>
      </nav>
    );
  }

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signout();
      // reload the page after logout
      window.location.reload();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="fixed top-2 right-2 left-2 z-10 ">
      <div className="w-full mx-auto flex items-center justify-between px-4">
        {/* Logo */}
        <div className={`flex items-center gap-1 ${glassBg}`}>
          <img
            src={LIBRIVERSE}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <p className="font-semibold text-gray-700">LibriVerse</p>
        </div>
        {/* Main Routes */}
        <div className={`flex items-center gap-4 font-semibold ${glassBg}`}>
          {publicNavLinks.map((link, index) => {
            return (
              <NavLink
                key={index}
                to={link.route}
                className={({ isActive }) =>
                  isActive
                    ? "rounded-xl bg-primary/20 px-2 py-1 my-0.5 "
                    : "rounded-xl text-gray-700 hover:text-[#ec8718] transition duration-500 ease-in-out px-2 py-1 my-0.5"
                }
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Auth Routes */}
        <div className={`flex items-center gap-1 ${glassBg}`}>
          {user ? (
            <div
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-[#ec8718] transition duration-500 ease-in-out px-2 py-1 my-0.5"
            >
              <LogOutIcon />
              <p>Logout</p>
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className="flex items-center text-gray-700 hover:text-[#ec8718] transition duration-500 ease-in-out px-2 py-1 my-0.5"
              >
                <p>Login</p>
              </NavLink>

              <NavLink
                to="/register"
                className="flex items-center text-gray-700 hover:text-[#ec8718] transition duration-500 ease-in-out px-2 py-1 my-0.5"
              >
                <p>Register</p>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

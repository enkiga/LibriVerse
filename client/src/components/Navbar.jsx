import { publicNavLinks } from "@/lib/contants";
import React from "react";
import LIBRIVERSE from "@/assets/LIBRIVERSE.png";
import { NavLink } from "react-router";
import { AlignRightIcon, LogOutIcon, User2Icon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { auth } from "@/api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const glassBg =
    "rounded-full  px-2 py-1 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 shadow-sm";

  const { user, loading } = useUser();

  // condition to check if user is loading or not
  if (loading) {
    return <></>;
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
    <nav className="fixed top-2 right-2 left-2 z-10 shadow-md md:shadow-none max-md:bg-background/80 backdrop-blur-sm rounded-md md:rounded-none">
      <div
        className={`w-full mx-auto flex items-center justify-between px-4 py-2`}
      >
        {/* Logo */}
        <div className={`md:flex hidden items-center gap-1 ${glassBg}`}>
          <img
            src={LIBRIVERSE}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <p className="hidden md:block font-semibold text-gray-700">
            LibriVerse
          </p>
        </div>
        {/* Mobile Logo */}
        <div className="flex md:hidden items-center gap-1">
          <img
            src={LIBRIVERSE}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <p className="font-semibold text-gray-700">LibriVerse</p>
        </div>
        {/* Main Routes */}
        <div
          className={`md:flex items-center hidden gap-4 font-semibold ${glassBg}`}
        >
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
        <div className={`hidden md:flex items-center gap-1 ${glassBg}`}>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <User2Icon className="h-6 w-6 mx-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-50 shadow-md rounded-md">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center text-gray-700 hover:text-[#ec8718] transition duration-500 ease-in-out px-2 py-1 my-0.5">
                  <NavLink to={`/profile`} className="flex items-center">
                    <User2Icon className="h-4 w-4 mr-2" />
                    Profile
                  </NavLink>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-[#ec8718] transition duration-500 ease-in-out px-2 py-1 my-0.5"
                  >
                    <LogOutIcon className="h-4 w-4 mr-2" />
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <AlignRightIcon />
              </Button>
            </SheetTrigger>
            <SheetContent
              className="bg-background/80 backdrop-blur-sm shadow-md w-4/5 h-screen"
              aria-describedby="mobile-nav-description"
            >
              <SheetHeader>
                <SheetTitle className="pr-5 pt-20 flex items-center justify-end gap-2">
                  <img
                    src={LIBRIVERSE}
                    alt="Logo"
                    className="w-10 h-10 object-contain"
                  />
                  <p className="font-semibold text-gray-700">LibriVerse</p>
                </SheetTitle>
                <SheetDescription />

                <div className="flex flex-col gap-4 w-5/6 mx-auto mt-4 text-end text-lg">
                  {publicNavLinks.map((link, index) => {
                    return (
                      <NavLink
                        key={index}
                        to={link.route}
                        className={({ isActive }) =>
                          isActive
                            ? "text-primary font-semibold py-1 my-0.5 "
                            : "text-text"
                        }
                      >
                        {link.name}
                      </NavLink>
                    );
                  })}
                </div>
                {/* If user */}
                {user ? (
                  <div
                    onClick={handleLogout}
                    className="flex items-center justify-end text-text pt-5 pr-5 text-lg gap-2"
                  >
                    <LogOutIcon />
                    Logout
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 w-5/6 mx-auto mt-4 text-end text-lg">
                    <NavLink to="/login" className="text-text">
                      Login
                    </NavLink>
                    <NavLink to="/register" className="text-text">
                      Register
                    </NavLink>
                  </div>
                )}
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

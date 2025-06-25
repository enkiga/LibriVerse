import { publicNavLinks } from "@/lib/contants";
import React from "react";
import LIBRIVERSE from "@/assets/LIBRIVERSE.png";
import { NavLink, useNavigate } from "react-router-dom"; // Import useNavigate
import { AlignRightIcon, LogOutIcon, User2Icon, Loader2 } from "lucide-react"; // Import a loader icon
import { useUser } from "@/context/UserContext"; // Your hook
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
    "rounded-full px-2 py-1 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 shadow-sm";

  // 1. Get the centralized logout function from the context
  const { user, loading, logout } = useUser();
  const navigate = useNavigate(); // Hook for programmatic navigation

  // 2. The new handleLogout is much simpler
  const handleLogout = async () => {
    await logout(); // This handles API call and clears user state
    navigate("/"); // Redirect to homepage for a smooth transition
  };

  // 3. Define the content for auth routes to avoid repetition
  const authContent = () => {
    if (loading) {
      // Show a loader instead of nothing for a better UX
      return <Loader2 className="h-6 w-6 animate-spin" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <User2Icon className="h-6 w-6 mx-1 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-50 shadow-md rounded-md">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink
                to="/profile"
                className="flex items-center w-full cursor-pointer"
              >
                <User2Icon className="h-4 w-4 mr-2" />
                Profile
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              {/* No need for a div, the item itself is clickable */}
              <LogOutIcon className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
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
    );
  };

  return (
    <nav className="fixed top-2 right-2 left-2 z-10 shadow-md md:shadow-none max-md:bg-background/80 backdrop-blur-sm rounded-md md:rounded-none">
      <div className="w-full mx-auto flex items-center justify-between px-4 py-2">
        {/* Logo and Main Routes ... no changes here */}
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
        <div className="flex md:hidden items-center gap-1">
          <img
            src={LIBRIVERSE}
            alt="Logo"
            className="w-10 h-10 object-contain"
          />
          <p className="font-semibold text-gray-700">LibriVerse</p>
        </div>
        <div
          className={`md:flex items-center hidden gap-4 font-semibold ${glassBg}`}
        >
          {publicNavLinks.map((link, index) => (
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
          ))}
        </div>

        {/* Auth Routes */}
        <div className={`hidden md:flex items-center gap-1 ${glassBg}`}>
          {authContent()}
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
                  {publicNavLinks.map((link, index) => (
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
                  ))}
                </div>
                {/* Mobile Auth Actions */}
                <div className="w-5/6 mx-auto mt-4 text-end text-lg">
                  {loading ? (
                    <Loader2 className="h-6 w-6 animate-spin ml-auto" />
                  ) : user ? (
                    <div
                      onClick={handleLogout}
                      className="flex items-center justify-end text-text pt-5 text-lg gap-2 cursor-pointer"
                    >
                      <LogOutIcon /> Logout
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <NavLink to="/login" className="text-text">
                        Login
                      </NavLink>
                      <NavLink to="/register" className="text-text">
                        Register
                      </NavLink>
                    </div>
                  )}
                </div>
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import { RootLayout, PublicLayout, AuthLayout } from "./layout";
import {
  HomePage,
  AboutPage,
  LoginPage,
  RegisterPage,
  BooksPage,
  ProfilePage,
} from "./pages";
import { Toaster } from "./components/ui/sonner";
import { UserProvider } from "./context/UserContext";

function App() {
  // Add RootLayout Routers
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="books" element={<BooksPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>
    )
  );

  return (
    <UserProvider>
      <RouterProvider router={router} />
      <Toaster />
    </UserProvider>
  );
}

export default App;

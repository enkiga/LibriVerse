import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import {
  RootLayout,
  PublicLayout,
  AuthLayout,
  ProtectedLayout,
  AuthRedirectLayout,
} from "./layout";
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
      // Public Routes
      <Route path="/" element={<RootLayout />}>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="books" element={<BooksPage />} />

          {/* Proteected Routes */}
          <Route element={<ProtectedLayout />}>
            <Route path="profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthRedirectLayout />}>
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
        </Route>

        {/* Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
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

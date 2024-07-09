import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from "./components/login/Login.js";
import ConditionalRender from "./components/ConditionalRender.js";
import { UserContextProvider } from "./context/userContext.js";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <ConditionalRender />,
    errorElement: <h1>Not Found!</h1>,
    children: [],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <h1>Not Found!</h1>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <RouterProvider router={router} />
      </UserContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

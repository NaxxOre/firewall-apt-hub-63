
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import SideNav from "./components/SideNav";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/Admin/AdminPanel";
import ManagePosts from "./pages/Admin/ManagePosts";
import UserPanel from "./pages/UserPanel";
import CTF from "./pages/CTF";
import YoutubeChannels from "./pages/YoutubeChannels";
import Category from "./pages/Category";
import Forum from "./pages/Forum";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";

// Create a new QueryClient instance outside the component
const queryClient = new QueryClient();

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="flex flex-col h-screen">
              <NavBar />
              <div className="flex flex-1 overflow-hidden">
                <SideNav />
                <main className="flex-1 overflow-auto">
                  <div className="container mx-auto px-4 py-8">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/admin/manage-posts" element={<ManagePosts />} />
                      <Route path="/dashboard" element={<UserPanel />} />
                      <Route path="/user" element={<UserPanel />} />
                      <Route path="/ctf" element={<CTF />} />
                      <Route path="/youtube-channels" element={<YoutubeChannels />} />
                      <Route path="/category/:categoryId" element={<Category />} />
                      <Route path="/category/:categoryId/:sectionId" element={<Category />} />
                      <Route path="/forum" element={<Forum />} />
                      <Route path="/forum/create" element={<CreatePost />} />
                      <Route path="/forum/post/:postId" element={<PostDetail />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </div>
                </main>
              </div>
              <footer className="bg-hacker-darkgray border-t border-hacker-lightgray py-4">
                <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
                  &copy; {new Date().getFullYear()} Welcome to f!R3wA11Apt. All rights reserved.
                </div>
              </footer>
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";
import AdminPanel from "./pages/Admin/AdminPanel";
import UserPanel from "./pages/UserPanel";
import CTF from "./pages/CTF";
import YoutubeChannels from "./pages/YoutubeChannels";
import Category from "./pages/Category";
import Forum from "./pages/Forum";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/dashboard" element={<UserPanel />} />
              <Route path="/ctf" element={<CTF />} />
              <Route path="/youtube-channels" element={<YoutubeChannels />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/create" element={<CreatePost />} />
              <Route path="/forum/post/:postId" element={<PostDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <footer className="bg-hacker-darkgray border-t border-hacker-lightgray py-4">
            <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} f!R3wA11Apt. All rights reserved.
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

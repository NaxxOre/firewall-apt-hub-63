import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/constants';
import { ChevronRight, Lock, Code, FileText, Wrench, Youtube } from 'lucide-react';

const Home = () => {
  const { isAuthenticated, currentUser } = useStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to <span className="text-hacker-red">f!R3wA11Apt</span>
            </h1>
            <p className="text-xl mb-6 text-muted-foreground">
              Your ultimate resource hub for cybersecurity and penetration testing.
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md inline-flex items-center"
                >
                  Join Community
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                <Link
                  to="/login"
                  className="bg-secondary hover:bg-secondary/80 py-3 px-6 rounded-md inline-flex items-center"
                >
                  Login
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/forum"
                  className="bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md inline-flex items-center"
                >
                  Browse Forum
                  <ChevronRight size={18} className="ml-1" />
                </Link>
                {currentUser?.isAdmin && (
                  <Link
                    to="/admin"
                    className="bg-secondary hover:bg-secondary/80 py-3 px-6 rounded-md inline-flex items-center"
                  >
                    Admin Panel
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="md:w-1/2 bg-hacker-darkgray border border-hacker-lightgray p-6 rounded-lg">
            <div className="text-xs text-muted-foreground mb-2">// Terminal</div>
            <div className="font-mono text-sm">
              <p className="text-green-400 mb-1">$ ./welcome.sh</p>
              <p className="mb-2">
                <span className="text-hacker-green">{'>'}</span> Initializing f!R3wA11Apt resources...
              </p>
              <p className="text-yellow-400 mb-1">[+] Categories loaded</p>
              <p className="text-yellow-400 mb-1">[+] CTF resources available</p>
              <p className="text-yellow-400 mb-1">[+] Code database connected</p>
              <p className="text-hacker-green mt-2">
                {'>'} Access granted to public resources
              </p>
              {!isAuthenticated && (
                <p className="flex items-center text-hacker-red mt-2">
                  <Lock size={14} className="mr-2" />
                  Login required for full access
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border">
          Security Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              to={`/category/${category.slug}`}
              className="bg-card hover:bg-card/80 border border-border rounded-lg p-5 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="flex space-x-3 mt-4">
                  <div className="flex items-center">
                    <Code size={16} className="mr-1" />
                    <span>Codes</span>
                  </div>
                  <div className="flex items-center">
                    <FileText size={16} className="mr-1" />
                    <span>Write-ups</span>
                  </div>
                  <div className="flex items-center">
                    <Wrench size={16} className="mr-1" />
                    <span>Tools</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">CTF Resources</h2>
          <p className="text-muted-foreground mb-4">
            Access Capture The Flag challenges, team information, and tools to
            enhance your CTF performance.
          </p>
          <Link
            to="/ctf"
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            Access CTF Resources 
            <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">YouTube Channels</h2>
          <p className="text-muted-foreground mb-4">
            Discover curated cybersecurity and hacking channels to expand your
            knowledge.
          </p>
          <div className="flex items-center mb-4">
            <Youtube size={20} className="text-red-500 mr-2" />
            <span className="text-sm">Educational content selected by experts</span>
          </div>
          <Link
            to="/youtube-channels"
            className="inline-flex items-center text-primary hover:text-primary/80"
          >
            Browse Channels
            <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 pb-2 border-b border-border">
          Community Forum
        </h2>
        <div className="bg-card border border-border rounded-lg p-6">
          <p className="text-muted-foreground mb-4">
            Join discussions, share knowledge, and connect with other security
            enthusiasts in our community forum.
          </p>
          <Link
            to="/forum"
            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-md inline-flex items-center"
          >
            Go to Forum
            <ChevronRight size={18} className="ml-1" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

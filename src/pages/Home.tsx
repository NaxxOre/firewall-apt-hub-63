
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/lib/constants';
import { useStore } from '@/lib/store';
import { Shield, LockKeyhole, FileCode, BookOpen, Wrench } from 'lucide-react';
import Terminal from '@/components/Terminal';

const Home = () => {
  const { isAuthenticated } = useStore();
  
  return (
    <div className="min-h-[calc(100vh-12rem)]">
      {/* Hero Section */}
      <div className="bg-hacker-darkgray rounded-lg border border-hacker-lightgray p-6 mb-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to <span className="text-hacker-green">f!<span className="highlight-r">R</span>3w<span className="highlight-a">A</span>11<span className="highlight-a">A</span>pt</span>
          </h1>
          <p className="text-lg mb-6">
            We are burmese ctf team from University of Information Technology and we are learning and sharing and seeking knowledges to improve our and your cybersecurity skills to the next level.
          </p>
          
          <div className="my-8">
            <Terminal />
          </div>
          
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="bg-primary hover:bg-primary/80 py-2 px-6 rounded-md transition-colors w-full sm:w-auto"
              >
                Register Now
              </Link>
              <Link
                to="/login"
                className="bg-secondary hover:bg-secondary/80 py-2 px-6 rounded-md transition-colors w-full sm:w-auto"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Categories Section */}
      <h2 className="text-2xl font-bold mb-6">Security Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {CATEGORIES.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="bg-card hover:bg-card/80 border border-border rounded-lg p-6 transition-colors"
          >
            <div className="flex flex-col h-full">
              <div className="mb-4">
                <CategoryIcon slug={category.slug} />
              </div>
              <h3 className="text-xl font-bold mb-2">{category.name}</h3>
              <p className="text-muted-foreground text-sm flex-grow">
                {category.description}
              </p>
              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="text-primary hover:underline">Explore resources</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Resources Section */}
      <h2 className="text-2xl font-bold mb-6">Additional Resources</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/ctf"
          className="bg-card hover:bg-card/80 border border-border rounded-lg p-6 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">CTF Resources</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Capture The Flag competitions, team credentials, and useful links.
          </p>
          <span className="text-primary hover:underline text-sm">View CTF resources</span>
        </Link>

        <Link
          to="/forum"
          className="bg-card hover:bg-card/80 border border-border rounded-lg p-6 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">Community Forum</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Discuss cybersecurity topics, share knowledge, and ask questions.
          </p>
          <span className="text-primary hover:underline text-sm">Join the conversation</span>
        </Link>

        <Link
          to="/youtube-channels"
          className="bg-card hover:bg-card/80 border border-border rounded-lg p-6 transition-colors"
        >
          <h3 className="text-xl font-bold mb-2">YouTube Channels</h3>
          <p className="text-muted-foreground text-sm mb-4">
            Curated list of cybersecurity YouTube channels and educational content.
          </p>
          <span className="text-primary hover:underline text-sm">Discover channels</span>
        </Link>
      </div>
    </div>
  );
};

// Helper component for category icons
const CategoryIcon = ({ slug }: { slug: string }) => {
  switch (slug) {
    case 'cryptography':
      return <LockKeyhole size={24} className="text-primary" />;
    case 'web':
      return <FileCode size={24} className="text-primary" />;
    case 'reverse':
      return <BookOpen size={24} className="text-primary" />;
    case 'forensics':
      return <Shield size={24} className="text-primary" />;
    case 'binary-exploit':
    case 'pwn':
      return <Wrench size={24} className="text-primary" />;
    default:
      return <Shield size={24} className="text-primary" />;
  }
};

export default Home;

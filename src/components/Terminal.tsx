
import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Link } from 'react-router-dom';

const Terminal = () => {
  const { isAuthenticated, currentUser, posts } = useStore();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  
  const initialTerminalLine = "// Terminal";
  
  // Get recent posts (last 3)
  const recentPosts = posts
    .filter(post => post.isPublic || (currentUser && (currentUser.isAdmin || post.authorId === currentUser.id)))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  const defaultLines = [
    "$ ./welcome.sh",
    "> Initializing f!R3wA11Apt resources...",
    "[+] Categories loaded",
    "[+] CTF resources available",
    "[+] Code database connected",
    "> Access granted to public resources"
  ];
  
  const loggedInLines = [
    "$ ./auth_status.sh",
    `> Welcome back, ${currentUser?.username || 'User'}!`,
    "[+] Full access granted to all resources",
    "[+] User privileges initialized",
    "> Secure connection established",
    "$ ./notification.sh",
    "> New registrations from other devices pending approval",
    "[+] Admin panel updated with new requests",
    "[+] Team repository synchronized",
    "> Supabase connection stable"
  ];

  // Links to recent forum posts for logged-in users
  const recentPostsLines = recentPosts.length > 0 && isAuthenticated ? [
    "$ ./recent_posts.sh",
    "> Recent forum activity detected:",
    ...recentPosts.map(post => `[+] ${post.title}: http://localhost:3000/forum/post/${post.id}`)
  ] : [];
  
  const finalLine = isAuthenticated 
    ? "🔒 Secure session active with full administrative access" 
    : "🔒 Login required for full access";
  
  const terminalLines = [
    initialTerminalLine,
    ...defaultLines,
    ...(isAuthenticated ? loggedInLines : []),
    ...(recentPostsLines),
    finalLine
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (displayedLines.length < terminalLines.length) {
        setDisplayedLines(prev => [
          ...prev, 
          terminalLines[displayedLines.length]
        ]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [displayedLines, terminalLines]);

  useEffect(() => {
    setDisplayedLines([initialTerminalLine]);
  }, [isAuthenticated, posts.length]); // Reset and restart animation when auth status changes or new posts

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] shadow-lg text-left font-mono text-sm overflow-hidden mx-auto max-w-2xl">
      <div className="bg-[#333] p-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-300 text-xs ml-2">f!R3wA11Apt terminal</span>
      </div>
      <div className="p-4 overflow-auto max-h-60">
        {displayedLines.map((line, index) => {
          const linkMatch = line.match(/\bhttps?:\/\/\S+/gi);
          
          if (linkMatch && isAuthenticated) {
            const beforeLink = line.substring(0, line.indexOf(linkMatch[0]));
            const postId = linkMatch[0].split('/').pop();
            
            return (
              <div key={index} className={`mb-1 line-animation ${getLineClass(line)}`}>
                {beforeLink}
                <Link to={`/forum/post/${postId}`} className="text-blue-400 hover:underline">
                  {linkMatch[0]}
                </Link>
              </div>
            );
          } else {
            return (
              <div key={index} className={`mb-1 line-animation ${getLineClass(line)}`}>
                {line}
              </div>
            );
          }
        })}
        {displayedLines.length === terminalLines.length && (
          <div className="blink-cursor mt-1">_</div>
        )}
      </div>
    </div>
  );
};

// Helper function to determine the class based on the line content
const getLineClass = (line: string): string => {
  if (line.includes("//")) return "text-gray-500";
  if (line.includes("$")) return "text-cyan-400";
  if (line.includes(">")) return "text-green-400";
  if (line.includes("[+]")) return "text-yellow-400";
  if (line.includes("🔒")) return "text-red-400";
  if (line.includes("http")) return "text-blue-400";
  return "text-gray-300";
};

export default Terminal;

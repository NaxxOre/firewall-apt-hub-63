
import React, { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';

const Terminal = () => {
  const { isAuthenticated, currentUser } = useStore();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  
  const initialTerminalLine = "// Terminal";
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
  
  const finalLine = isAuthenticated 
    ? "🔒 Secure session active with full administrative access" 
    : "🔒 Login required for full access";
  
  const terminalLines = [
    initialTerminalLine,
    ...defaultLines,
    ...(isAuthenticated ? loggedInLines : []),
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
  }, [isAuthenticated]); // Reset and restart animation when auth status changes

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] shadow-lg text-left font-mono text-sm overflow-hidden mx-auto max-w-2xl">
      <div className="bg-[#333] p-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-300 text-xs ml-2">f!R3wA11Apt terminal</span>
      </div>
      <div className="p-4 overflow-auto max-h-60">
        {displayedLines.map((line, index) => (
          <div key={index} className={`mb-1 line-animation ${getLineClass(line)}`}>
            {line}
          </div>
        ))}
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
  return "text-gray-300";
};

export default Terminal;

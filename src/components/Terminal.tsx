
import React, { useState, useEffect } from 'react';

const Terminal = () => {
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const terminalLines = [
    "// Terminal",
    "$ ./welcome.sh",
    "> Initializing f!R3wA11Apt resources...",
    "[+] Categories loaded",
    "[+] CTF resources available",
    "[+] Code database connected",
    "> Access granted to public resources",
    "🔒 Login required for full access"
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
  }, [displayedLines]);

  useEffect(() => {
    setDisplayedLines([terminalLines[0]]);
  }, []);

  return (
    <div className="bg-[#1a1a1a] rounded-lg border border-[#333] shadow-lg text-left font-mono text-sm overflow-hidden mx-auto max-w-2xl">
      <div className="bg-[#333] p-2 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-gray-300 text-xs ml-2">f!R3wA11Apt terminal</span>
      </div>
      <div className="p-4 overflow-auto">
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

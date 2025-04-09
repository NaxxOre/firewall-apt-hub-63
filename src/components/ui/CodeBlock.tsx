
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  title?: string;
  language?: string;
  className?: string;
}

const CodeBlock = ({ code, title = "Code", language = "text", className }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("code-block mb-4", className)}>
      <div className="code-block-header">
        <span className="text-xs text-gray-300">{title} {language && <span className="text-gray-500 ml-2">({language})</span>}</span>
        <button
          onClick={copyToClipboard}
          className="text-gray-300 hover:text-white flex items-center focus:outline-none"
          aria-label="Copy code"
        >
          {copied ? (
            <Check size={16} className="text-hacker-green" />
          ) : (
            <Copy size={16} />
          )}
        </button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
};

export default CodeBlock;

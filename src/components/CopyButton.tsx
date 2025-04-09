
import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CopyButtonProps {
  content: string;
  className?: string;
}

const CopyButton: React.FC<CopyButtonProps> = ({ content, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success('Content copied to clipboard');
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
      toast.error('Failed to copy content');
    }
  };

  return (
    <Button
      onClick={handleCopy}
      size="sm"
      variant="ghost"
      className={className}
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
      <span className="sr-only">Copy to clipboard</span>
    </Button>
  );
};

export default CopyButton;

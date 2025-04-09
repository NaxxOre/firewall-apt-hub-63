
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CopyButton from './CopyButton';

interface CodeDisplayBoxProps {
  content: string;
  maxHeight?: string;
}

const CodeDisplayBox: React.FC<CodeDisplayBoxProps> = ({ content, maxHeight = '300px' }) => {
  return (
    <div className="relative">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton content={content} />
      </div>
      <div className="code-block">
        <div className="code-block-header">
          <span>Code</span>
        </div>
        <ScrollArea className={`w-full`} style={{ maxHeight }}>
          <pre className="font-mono text-sm whitespace-pre-wrap p-1">
            {content}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodeDisplayBox;

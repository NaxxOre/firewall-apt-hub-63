
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import CopyButton from './CopyButton';

interface CodeDisplayBoxProps {
  content: string;
  maxHeight?: string;
}

const CodeDisplayBox: React.FC<CodeDisplayBoxProps> = ({ content, maxHeight = '300px' }) => {
  return (
    <div className="relative border rounded-md overflow-hidden">
      <div className="absolute top-2 right-2 z-10">
        <CopyButton content={content} />
      </div>
      <div className="bg-card">
        <div className="bg-muted py-2 px-4 border-b flex items-center justify-between">
          <span className="font-medium text-sm">Code</span>
        </div>
        <ScrollArea className="w-full overflow-auto rounded-b-md" style={{ maxHeight }}>
          <pre className="font-mono text-sm p-4 overflow-x-auto whitespace-pre-wrap">
            {content}
          </pre>
        </ScrollArea>
      </div>
    </div>
  );
};

export default CodeDisplayBox;

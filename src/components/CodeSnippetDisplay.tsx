
import React from 'react';
import { CodeSnippet } from '@/types';
import ContentActions from './ContentActions';
import ContentCard from './ContentCard';
import CodeDisplayBox from './CodeDisplayBox';

interface CodeSnippetDisplayProps {
  snippet: CodeSnippet;
}

const CodeSnippetDisplay: React.FC<CodeSnippetDisplayProps> = ({ snippet }) => {
  return (
    <ContentCard title={snippet.title} isPublic={snippet.isPublic}>
      <div className="mb-3">
        <CodeDisplayBox content={snippet.content} maxHeight="300px" />
      </div>
      {snippet.description && (
        <p className="text-sm text-muted-foreground mt-2 mb-3">{snippet.description}</p>
      )}
      <div className="flex justify-end">
        <ContentActions
          id={snippet.id}
          title={snippet.title}
          type="code"
          isPublic={snippet.isPublic}
        />
      </div>
    </ContentCard>
  );
};

export default CodeSnippetDisplay;

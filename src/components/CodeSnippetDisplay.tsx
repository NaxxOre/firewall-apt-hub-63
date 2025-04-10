
import React from 'react';
import { CodeSnippet } from '@/types';
import ContentActions from './ContentActions';
import ContentCard from './ContentCard';
import CodeDisplayBox from './CodeDisplayBox';

interface CodeSnippetDisplayProps {
  snippet: CodeSnippet;
}

const CodeSnippetDisplay: React.FC<CodeSnippetDisplayProps> = ({ snippet }) => {
  // Use isPublic property from local types and handle database property is_public
  const isPublic = snippet.isPublic !== undefined ? snippet.isPublic : snippet.is_public;
  
  return (
    <ContentCard title={snippet.title} isPublic={isPublic}>
      <div className="mb-3">
        <CodeDisplayBox content={snippet.content || snippet.code} maxHeight="300px" />
      </div>
      {snippet.description && (
        <p className="text-sm text-muted-foreground mt-2 mb-3">{snippet.description}</p>
      )}
      <div className="flex justify-end">
        <ContentActions
          id={snippet.id}
          title={snippet.title}
          type="code"
          isPublic={isPublic}
        />
      </div>
    </ContentCard>
  );
};

export default CodeSnippetDisplay;

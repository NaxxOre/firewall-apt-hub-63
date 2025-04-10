
import React from 'react';
import { CodeSnippet } from '@/types';
import ContentActions from './ContentActions';
import ContentCard from './ContentCard';
import CodeDisplayBox from './CodeDisplayBox';

interface CodeSnippetDisplayProps {
  snippet: CodeSnippet;
}

const CodeSnippetDisplay: React.FC<CodeSnippetDisplayProps> = ({ snippet }) => {
  const isPublic = snippet.is_public !== undefined ? snippet.is_public : snippet.isPublic;
  
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

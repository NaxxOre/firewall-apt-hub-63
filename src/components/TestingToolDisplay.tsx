
import React from 'react';
import { TestingTool } from '@/types';
import ContentActions from './ContentActions';
import ContentCard from './ContentCard';
import CodeDisplayBox from './CodeDisplayBox';

interface TestingToolDisplayProps {
  tool: TestingTool;
}

const TestingToolDisplay: React.FC<TestingToolDisplayProps> = ({ tool }) => {
  return (
    <ContentCard title={tool.title} isPublic={tool.isPublic}>
      <div className="mb-3">
        <CodeDisplayBox content={tool.content} maxHeight="300px" />
      </div>
      {tool.description && (
        <p className="text-sm text-muted-foreground mt-2 mb-3">{tool.description}</p>
      )}
      <div className="flex justify-end">
        <ContentActions
          id={tool.id}
          title={tool.title}
          type="tool"
          isPublic={tool.isPublic}
        />
      </div>
    </ContentCard>
  );
};

export default TestingToolDisplay;

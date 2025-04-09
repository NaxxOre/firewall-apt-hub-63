
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { CATEGORIES } from '@/lib/constants';
import { Copy, Code, FileText, Wrench, Lock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const Category = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated, currentUser, codeSnippets, writeUps, testingTools } = useStore();
  
  const [activeTab, setActiveTab] = useState<'codes' | 'writeups' | 'tools'>('codes');
  
  // Find the current category
  const category = CATEGORIES.find((cat) => cat.slug === slug);

  if (!category) {
    return <div className="container mx-auto px-4 py-8">Category not found</div>;
  }

  // Filter content based on user authorization and category
  const getVisibleContent = <T extends { categoryId: string; isPublic: boolean }>(items: T[]) => {
    return items.filter(item => {
      if (item.categoryId !== category.id) return false;
      if (!isAuthenticated) return item.isPublic;
      if (currentUser?.isAdmin) return true;
      return item.isPublic;
    });
  };

  const visibleCodeSnippets = getVisibleContent(codeSnippets);
  const visibleWriteUps = getVisibleContent(writeUps);
  const visibleTestingTools = getVisibleContent(testingTools);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">{category.description}</p>
      </div>

      {!isAuthenticated && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8 flex items-center">
          <Lock className="mr-3 text-primary" />
          <div>
            <h3 className="font-medium mb-1">Limited Access</h3>
            <p className="text-sm text-muted-foreground">
              Some content may be hidden. <Link to="/login" className="text-primary hover:underline">Log in</Link> to view more resources.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 border-b border-border">
        <ul className="flex flex-wrap -mb-px">
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('codes')}
              className={`inline-flex items-center px-4 py-2 border-b-2 ${
                activeTab === 'codes'
                  ? 'border-primary text-primary'
                  : 'border-transparent hover:border-border hover:text-muted-foreground'
              }`}
            >
              <Code size={16} className="mr-2" />
              Code Snippets
            </button>
          </li>
          <li className="mr-2">
            <button
              onClick={() => setActiveTab('writeups')}
              className={`inline-flex items-center px-4 py-2 border-b-2 ${
                activeTab === 'writeups'
                  ? 'border-primary text-primary'
                  : 'border-transparent hover:border-border hover:text-muted-foreground'
              }`}
            >
              <FileText size={16} className="mr-2" />
              Write-ups
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('tools')}
              className={`inline-flex items-center px-4 py-2 border-b-2 ${
                activeTab === 'tools'
                  ? 'border-primary text-primary'
                  : 'border-transparent hover:border-border hover:text-muted-foreground'
              }`}
            >
              <Wrench size={16} className="mr-2" />
              Testing Tools
            </button>
          </li>
        </ul>
      </div>

      {activeTab === 'codes' && (
        <div className="space-y-6">
          {visibleCodeSnippets.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Code className="mx-auto mb-3" size={32} />
              <h3 className="font-medium mb-1">No Code Snippets Available</h3>
              <p className="text-sm text-muted-foreground">
                No code snippets have been added to this category yet.
              </p>
            </div>
          ) : (
            visibleCodeSnippets.map((snippet) => (
              <div key={snippet.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="border-b border-border p-4">
                  <h3 className="font-medium">{snippet.title}</h3>
                </div>
                <div className="p-4">
                  <div className="bg-hacker-darkgray border border-hacker-lightgray rounded-md p-3 mb-3 font-mono text-sm whitespace-pre-wrap">
                    {snippet.content}
                  </div>
                  <button
                    onClick={() => handleCopy(snippet.content)}
                    className="flex items-center text-xs bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-md"
                  >
                    <Copy size={14} className="mr-1.5" />
                    Copy code
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'writeups' && (
        <div className="space-y-6">
          {visibleWriteUps.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <FileText className="mx-auto mb-3" size={32} />
              <h3 className="font-medium mb-1">No Write-ups Available</h3>
              <p className="text-sm text-muted-foreground">
                No write-ups have been added to this category yet.
              </p>
            </div>
          ) : (
            visibleWriteUps.map((writeup) => (
              <div key={writeup.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="border-b border-border p-4">
                  <h3 className="font-medium">{writeup.title}</h3>
                </div>
                <div className="p-4">
                  {writeup.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {writeup.description}
                    </p>
                  )}
                  <a
                    href={writeup.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary hover:underline"
                  >
                    Read Write-up
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tools' && (
        <div className="space-y-6">
          {visibleTestingTools.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <Wrench className="mx-auto mb-3" size={32} />
              <h3 className="font-medium mb-1">No Testing Tools Available</h3>
              <p className="text-sm text-muted-foreground">
                No testing tools have been added to this category yet.
              </p>
            </div>
          ) : (
            visibleTestingTools.map((tool) => (
              <div key={tool.id} className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="border-b border-border p-4">
                  <h3 className="font-medium">{tool.title}</h3>
                </div>
                <div className="p-4">
                  {tool.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {tool.description}
                    </p>
                  )}
                  <div className="bg-hacker-darkgray border border-hacker-lightgray rounded-md p-3 mb-3 font-mono text-sm whitespace-pre-wrap">
                    {tool.content}
                  </div>
                  <button
                    onClick={() => handleCopy(tool.content)}
                    className="flex items-center text-xs bg-secondary/30 hover:bg-secondary/50 text-secondary-foreground px-3 py-1.5 rounded-md"
                  >
                    <Copy size={14} className="mr-1.5" />
                    Copy tool code
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Category;

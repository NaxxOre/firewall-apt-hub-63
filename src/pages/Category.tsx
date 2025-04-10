import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CodeSnippetDisplay from '@/components/CodeSnippetDisplay';
import TestingToolDisplay from '@/components/TestingToolDisplay';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AddContentModal from '@/components/AddContentModal';
import CategoryNav from '@/components/CategoryNav';
import { supabase } from '@/integrations/supabase/client';

const Category = () => {
  const { categoryId = '', sectionId = 'codes' } = useParams<{ categoryId: string; sectionId: string }>();
  const { currentUser } = useStore();
  const [codeSnippets, setCodeSnippets] = useState<any[]>([]);
  const [testingTools, setTestingTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const sectionTitle = sectionId === 'codes' ? 'Code Snippet' : 'Testing Tool';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch code snippets
        const { data: codeData, error: codeError } = await supabase
          .from('code_snippets')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });

        if (codeError) {
          console.error("Error fetching code snippets:", codeError);
        }

        // Fetch testing tools
        const { data: toolData, error: toolError } = await supabase
          .from('testing_tools')
          .select('*')
          .eq('category_id', categoryId)
          .order('created_at', { ascending: false });

        if (toolError) {
          console.error("Error fetching testing tools:", toolError);
        }

        setCodeSnippets(codeData || []);
        setTestingTools(toolData || []);
      } catch (error) {
        console.error("Unexpected error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId, sectionId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">{categoryId}</h1>
          <p className="text-muted-foreground">
            Explore curated code snippets and testing tools for {categoryId}.
          </p>
        </div>
        {currentUser && (
          <Button onClick={() => setShowAddModal(true)}>
            <Plus size={16} className="mr-2" />
            Add {sectionTitle}
          </Button>
        )}
      </div>

      <CategoryNav />

      {sectionId === 'codes' && (
        codeSnippets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {codeSnippets.map((snippet) => (
              <CodeSnippetDisplay key={snippet.id} snippet={snippet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">No code snippets found.</div>
        )
      )}

      {sectionId === 'tools' && (
        testingTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testingTools.map((tool) => (
              <TestingToolDisplay key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">No testing tools found.</div>
        )
      )}

      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Add {sectionTitle}</DialogTitle>
            <DialogDescription>
              Add a new {sectionTitle.toLowerCase()} to this category.
            </DialogDescription>
          </DialogHeader>
          <AddContentModal 
            type="writeup" 
            onComplete={() => setShowAddModal(false)} 
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Category;

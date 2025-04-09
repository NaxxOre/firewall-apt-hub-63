
import React from 'react';
import { cn } from '@/lib/utils';
import { Lock } from 'lucide-react';

interface ContentCardProps {
  title: string;
  isPublic: boolean;
  children: React.ReactNode;
  className?: string;
}

const ContentCard = ({ title, isPublic, children, className }: ContentCardProps) => {
  return (
    <div 
      className={cn(
        "bg-card rounded-lg border border-border p-4 transition-all",
        isPublic ? "opacity-100" : "opacity-70 hover:opacity-90",
        className
      )}
    >
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{title}</h3>
        {!isPublic && (
          <div className="flex items-center text-xs text-muted-foreground">
            <Lock size={14} className="mr-1" />
            <span>Private</span>
          </div>
        )}
      </div>
      {children}
    </div>
  );
};

export default ContentCard;

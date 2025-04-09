
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CATEGORY_SECTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

const CategoryNav = () => {
  const { categoryId = '', sectionId = 'codes' } = useParams<{ categoryId: string; sectionId: string }>();
  
  return (
    <div className="bg-hacker-darkgray rounded-lg border border-hacker-lightgray mb-6">
      <div className="flex flex-wrap">
        {CATEGORY_SECTIONS.map((section) => (
          <Link
            key={section.slug}
            to={`/category/${categoryId}/${section.slug}`}
            className={cn(
              "px-4 py-2 transition-colors hover:bg-hacker-lightgray",
              section.slug === sectionId || (sectionId === "" && section.slug === "codes")
                ? "bg-hacker-lightgray text-hacker-red border-b-2 border-hacker-red" 
                : "text-foreground border-b-2 border-transparent"
            )}
          >
            {section.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

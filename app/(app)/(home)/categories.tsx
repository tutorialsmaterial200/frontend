'use client'
import { useApi } from '@/hooks/use-api';
import { Badge } from "@/components/ui/badge";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {ListFilterIcon, Search} from "lucide-react";
import { cn } from '@/lib/utils';
import {Button} from "@/components/ui/button";
import { useEffect, useState } from "react";
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  depth: number;
  isActive: boolean;
  children: Category[];
}

interface ApiResponse {
  categories: Category[];
}
// const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const Categories = () => {
  const { data, loading, error } = useApi<ApiResponse>('/categories');
  const rootCategories = data?.categories?.filter(cat => cat.parentId === null) || [];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="px-2 lg:px-12 py-3  text-3xl border-b flex flex-col gap-4 w-full">
  
      
      <div className="flex flex-wrap   gap-2">
        <Badge variant="secondary" className="px-4 py-2   font-bold  text-sm ">
          All
        </Badge>
        {rootCategories.map((category) => (
          <HoverCard key={category.id}>
            <HoverCardTrigger asChild>
              <Badge 
                variant="outline" 
                className={cn("h-11 px-4  bg-transparent font-bold  text-sm  border-transparent rounded-full hover:bg-white hover:border-primary text-black")}
              >
                {category.name}
              </Badge>
            </HoverCardTrigger>
            {category.children && category.children.length > 0 && (
              <HoverCardContent className="w-48 p-2">
                <div className="space-y-1">
                  {category.children.map((sub) => (
                    <div 
                      key={sub.id} 
                      className="p-2 font-bold  text-sm  rounded hover:bg-orange-100 cursor-pointer transition-colors"
                    >
                      {sub.name}
                    </div>
                  ))}
                </div>
              </HoverCardContent>
            )}
          </HoverCard>
        ))}
          <Button
              variant="outline"
              className="size-12 shrink-0 flex lg:hidden"
              // onClick={() => setIsSidebarOpen(true)}
          >
              <ListFilterIcon />
          </Button>

      </div>

    </div>
  );
};

export default Categories;
'use client'
import { useApi } from '@/hooks/use-api';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

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
  pagination: {
    total: number;
    limit: number;
    offset: number;
    pages: number;
  };
}

const Page = () => {
  const { data, loading, error } = useApi<ApiResponse>('/categories');
  const categories = data?.categories || [];

  if (loading) return <div className="container mx-auto p-4">Loading categories...</div>;
  if (error) return <div className="container mx-auto p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
     
    </div>
  );
};

export default Page;
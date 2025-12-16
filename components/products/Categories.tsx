'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface CategoriesProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

export function Categories({ categories, selectedCategory, onSelectCategory }: CategoriesProps) {
    return (
        <div className="w-full border-b bg-background">
            <div className="container mx-auto px-4 py-3">
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-2">
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                size="sm"
                                onClick={() => onSelectCategory(category)}
                                className="capitalize shrink-0"
                            >
                                {category}
                            </Button>
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
}

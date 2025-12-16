'use client';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
    return (
        <div className="w-full px-4 py-4 bg-background">
            <div className="container mx-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                        placeholder="Search for products, categories..."
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="pl-10 h-12 text-base"
                    />
                </div>
            </div>
        </div>
    );
}

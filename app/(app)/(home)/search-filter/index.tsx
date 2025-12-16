"use client"
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
    disabled?: boolean;
    defaultValue?: string | undefined;
    onChange?: (value: string) => void;
};

export const SearchInput = ({
                                disabled,
                                defaultValue,
                                onChange,
                            }: Props) => {
    const [searchValue, setSearchValue] = useState(defaultValue || "");


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onChange?.(searchValue)
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchValue, onChange]);

    return (
        <div className="hidden lg:flex px-4 lg:px-12 py-5 border-b flex-col gap-4 w-full">
            <div className="px-4 lg:px-8 py-2 flex flex-col lg:flex-row lg:items-center lg:gap-4 w-full">
                <div className="relative w-full lg:flex-1">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
                    <Input
                        className="pl-8 w-full h-14"
                        placeholder="Search products"
                        disabled={disabled}
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>



                <Button asChild variant="outline" className="mt-2 lg:mt-0 lg:ml-2">
                    <Link prefetch href="/library" className="flex items-center gap-2 font-bold">
                        <BookmarkCheckIcon />
                        <span>Library</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
};

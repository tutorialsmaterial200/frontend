import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import {ScrollArea} from "@/components/ui/scroll-area";
import  Link from "next/link";
import React from "react";
import Image from "next/image";

interface NavbarItem{
    href:string;
    children:React.ReactNode;
}
interface Props{
    items:NavbarItem[];
     open:boolean;
     onOpenChnage:(open:boolean) => void;
}
export const NavbarSidebar=({
    items,
    open,
    onOpenChnage,
   }:Props)=>{
    return(
        <Sheet open={open} onOpenChange={onOpenChnage}>
            <SheetContent
            side="left"
            className="p-0 transition-none"
            >
                <SheetHeader className="p-4 border-b">
                    <div className="flex items-center">
                        <SheetTitle>
                            <Link href="/" className="flex items-center flex-shrink-0">
                                <Image src="/Dunzo_Logo.svg" alt="SuperApp Logo" width={120} height={40} priority />
                            </Link>
                        </SheetTitle>

                    </div>

                </SheetHeader>
                <ScrollArea className="flex flex-col overflow-y-auto pb-2">
                    {
                        items.map((item)=>(
                            <Link
                            key={item.href}
                            href={item.href}
                            className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                            onClick={()=>onOpenChnage(false)}
                            >
                                {item.children}

                            </Link>
                        ))
                    }
                    <div className="border-t">
                        <Link
                            onClick={()=>onOpenChnage(false)}
                            href="/sign-in"
                              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
                        >
                            Log In

                        </Link>
                        <Link
                            onClick={()=>onOpenChnage(false)}
                            href="/sign-up"
                              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"

                        >
                            Start Selling

                        </Link>

                    </div>

                </ScrollArea>

            </SheetContent>

        </Sheet>
    )


}
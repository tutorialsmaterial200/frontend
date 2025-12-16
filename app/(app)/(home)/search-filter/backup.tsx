



"use client"
import {Poppins} from "next/font/google"
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import  {useState} from "react";
import {usePathname} from "next/navigation";
import {NavbarSidebar} from "../navbar-sidebar";
import {MenuIcon, ShoppingCart} from "lucide-react";
import Image from "next/image";
const poppins=Poppins({
    subsets:["latin"],
    weight:["700"]
})
interface  NavbaritemProps{
    href:string;
    children:React.ReactNode;
    isActive?:boolean;
}
const NavbarItem=({
                      href,
                      children,
                      isActive,
                  }:NavbaritemProps)=>{
    return(
        <Button
            asChild
            variant={"outline"}
            className={cn(
                "bg-transparent hover:bg-transparent rounded-full hover:border-primary border-transparent px-3.5 text-lg",
                isActive && "bg-black text-white hover:bg-black hover:text-white",
            )}
        >
            <Link href={href}>
                {children}
            </Link>

        </Button>
    )
};
const navbarItems=[
    {href:"/",children:"Home"},
    {href:"/about",children:"About"},
    {href:"/features",children:"Features"},
    {href:"/pricing",children:"Pricing"},
    {href:"/contact",children:"Contact"},
]
export const Navbar=()=>{
    const pathname=usePathname();
    const [isSidebarOpen,setIsSidebarOpen]=useState(false);
    return (
        <nav className="sticky top-0 z-50 h-20 flex border-b justify-between font-medium bg-white">
            <Link href="/" className="pl-6 flex items-center">
                <Image src="/Dunzo_Logo.svg" alt={"logo"} width={150} height={50} />

            </Link>
            <NavbarSidebar
                items={navbarItems}
                open={isSidebarOpen}
                onOpenChnage={setIsSidebarOpen}
            />
            <div className="items-center   gap-4 hidden lg:flex">
                { navbarItems.map((item)=>(
                    <NavbarItem
                        key={item.href}
                        href={item.href}
                        isActive={pathname===item.href}

                    >
                        {item.children}
                    </NavbarItem>
                ))}

            </div>
            <div className="hidden lg:flex">
                <button className="flex items-center gap-2 text-neutral-700 hover:text-black">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-sm">Cart</span>
                </button>
                <Button
                    asChild
                    variant={"secondary"}
                    className="border-l border-t-0 border-r-0 px-12 h-full rounded-none bg-white hover:bg-pink-400 transition-colors text-lg"
                >
                    <Link href="/sign-in">
                        Login In
                    </Link>
                </Button>
                <Button
                    asChild
                    className="border-l border-t-0 border-r-0 px-12 h-full rounded-none bg-black text-white hover:bg-pink-400 hover:text-black transition-colors text-lg"

                >
                    <Link href="/sign-up">
                        Start Selling
                    </Link>

                </Button>

            </div>
            <div className="flex lg:hidden items-center pr-4">
                {/* Mobile menu button */}
                <Button
                    variant={"ghost"}
                    className="size-12 border-transparent bg-white"
                    onClick={()=>setIsSidebarOpen(true)}
                >
                    <MenuIcon/>
                </Button>

            </div>

        </nav>
    )
}
"use client"
import Link from "next/link";
import {cn} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {useState, useEffect} from "react";
import {usePathname, useRouter} from "next/navigation";
import {NavbarSidebar} from "./navbar-sidebar";
import {CartSidebar} from "@/components/cart/CartSidebar";
import {MenuIcon, MapPin, Search, ShoppingCart, User, LogOut, LayoutDashboard} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { LoginDialog } from "@/components/auth/LoginDialog";
import { checkAuth, logout as logoutUser, getUser } from "@/lib/auth";
import { redirectToRoleDashboard, hasAnyRole } from "@/lib/role-redirect";

interface NavbaritemProps{
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
            variant={"ghost"}
            className={cn(
                "bg-transparent hover:bg-transparent text-neutral-700 font-medium",
                isActive && "text-black",
            )}
        >
            <Link href={href}>
                {children}
            </Link>
        </Button>
    )
};

const navbarItems=[
    {href:"/partners",children:"Driver for Partners"},
    {href:"/business",children:"Business with Dunzo"},
    {href:"/products",children:"Products"},
]

export const Navbar=()=>{
    const pathname=usePathname();
    const router=useRouter();
    const [isSidebarOpen,setIsSidebarOpen]=useState(false);
    const [isCartOpen,setIsCartOpen]=useState(false);
    const [showLoginDialog,setShowLoginDialog]=useState(false);
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    const [userName,setUserName]=useState("");
    const [mounted, setMounted] = useState(false);
    const { totalItems } = useCart();

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        // Check if user is logged in with backend verification
        const verifyAuth = async () => {
            console.log('Navbar: Starting auth verification...');
            
            // Check localStorage directly first
            const token = localStorage.getItem('authToken');
            const userStr = localStorage.getItem('user');
            console.log('Navbar: Direct localStorage check - token exists:', !!token);
            console.log('Navbar: Direct localStorage check - user exists:', !!userStr);
            if (userStr) {
                console.log('Navbar: User data in localStorage:', JSON.parse(userStr));
            }
            
            const isAuthenticated = await checkAuth();
            console.log('Navbar: Auth result:', isAuthenticated);
            setIsLoggedIn(isAuthenticated);
            
            if (isAuthenticated) {
                const user = getUser();
                console.log('Navbar: User data from getUser():', user);
                const displayName = user?.name || user?.fullName || user?.email?.split('@')[0] || 'User';
                console.log('Navbar: Setting display name to:', displayName);
                setUserName(displayName);
            } else {
                console.log('Navbar: Not authenticated, showing login button');
                setUserName('');
            }
            
            console.log('Navbar: Final state - isLoggedIn will be:', isAuthenticated);
        };
        
        verifyAuth();
        
        // Listen for storage changes (login/logout in other tabs)
        const handleStorageChange = () => {
            console.log('Navbar: Storage changed, re-verifying auth');
            verifyAuth();
        };
        
        // Listen for auth changes (login/logout)
        const handleAuthChange = () => {
            console.log('Navbar: Auth changed event received, re-verifying auth');
            verifyAuth();
        };
        
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('auth-change', handleAuthChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('auth-change', handleAuthChange);
        };
    }, []);

    const handleLogout = () => {
        logoutUser();
        setIsLoggedIn(false);
        router.push('/');
    };

    const handleLoginSuccess = () => {
        setShowLoginDialog(false);
        const user = getUser();
        setUserName(user?.name || user?.email?.split('@')[0] || 'User');
        setIsLoggedIn(true);
    };

    return (
        <nav className="sticky top-0 z-50 h-16 flex border-b border-neutral-200 justify-between items-center font-medium bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6 gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
                <Image src="/Dunzo_Logo.svg" alt="SuperApp Logo" width={120} height={40} priority />
            </Link>

            {/* Location */}
            <div className="hidden lg:flex items-center gap-2 text-neutral-700">
                <MapPin className="w-5 h-5 text-teal-500" />
                <span className="text-sm font-medium">Set Location</span>
            </div>

            {/* Center Navigation */}
            <div className="hidden lg:flex items-center gap-8">
                {navbarItems.map((item)=>(
                    <NavbarItem
                        key={item.href}
                        href={item.href}
                        isActive={pathname===item.href}
                    >
                        {item.children}
                    </NavbarItem>
                ))}
            </div>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-6 ml-auto">
                <button className="flex items-center gap-2 text-neutral-700 hover:text-black">
                    <Search className="w-5 h-5" />
                    <span className="text-sm">Search</span>
                </button>
                <button 
                    className="flex items-center gap-2 text-neutral-700 hover:text-black relative"
                    onClick={() => setIsCartOpen(true)}
                >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="text-sm">Cart</span>
                    {mounted && totalItems > 0 && (
                        <Badge className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center p-0 border-0">
                            {totalItems}
                        </Badge>
                    )}
                </button>
                
                {isLoggedIn ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 rounded-full">
                                <User className="w-5 h-5" />
                                <span>{userName}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            {hasAnyRole(['ADMIN', 'MERCHANT', 'RIDER', 'SUPPORT']) && (
                                <>
                                    <DropdownMenuItem onClick={() => router.push(redirectToRoleDashboard())}>
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                </>
                            )}
                            <DropdownMenuItem onClick={() => router.push('/profile')}>
                                <User className="w-4 h-4 mr-2" />
                                Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => router.push('/orders')}>
                                Orders
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button 
                        className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-6 py-2 h-auto"
                        onClick={() => setShowLoginDialog(true)}
                    >
                        Sign in
                    </Button>
                )}
            </div>

            {/* Mobile Menu */}
            <div className="flex lg:hidden items-center gap-4 ml-auto">
                <Search className="w-5 h-5" />
                <button className="relative" onClick={() => setIsCartOpen(true)}>
                    <ShoppingCart className="w-5 h-5" />
                    {mounted && totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {totalItems}
                        </span>
                    )}
                </button>
                <Button
                    variant={"ghost"}
                    className="size-10 border-transparent"
                    onClick={()=>setIsSidebarOpen(true)}
                >
                    <MenuIcon className="w-5 h-5" />
                </Button>
            </div>

            <NavbarSidebar
                items={navbarItems}
                open={isSidebarOpen}
                onOpenChnage={setIsSidebarOpen}
            />
            <CartSidebar
                open={isCartOpen}
                onOpenChange={setIsCartOpen}
            />
            
            <LoginDialog 
                open={showLoginDialog} 
                onOpenChange={setShowLoginDialog}
                onLoginSuccess={handleLoginSuccess}
            />
        </nav>
    )
}

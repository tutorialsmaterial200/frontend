'use client';
import { Menu, ShoppingCart, User, Bell, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { LoginDialog } from '@/components/auth/LoginDialog';
import { checkAuth, logout as logoutUser, getUser } from '@/lib/auth';

export function Navbar() {
    const router = useRouter();
    const { totalItems } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        // Check if user is logged in with backend verification
        const verifyAuth = async () => {
            const isAuthenticated = await checkAuth();
            setIsLoggedIn(isAuthenticated);
            
            if (isAuthenticated) {
                const user = getUser();
                setUserName(user?.name || user?.email?.split('@')[0] || 'User');
            }
        };
        
        verifyAuth();
        
        // Listen for storage changes (login/logout in other tabs)
        const handleStorageChange = () => {
            verifyAuth();
        };
        
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
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
        <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                        <Link href="/" className="flex items-center flex-shrink-0">
                <Image src="/Dunzo_Logo.svg" alt="SuperApp Logo" width={120} height={40} priority />
            </Link>

                    </div>
                    
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                3
                            </Badge>
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="relative"
                            onClick={() => setIsCartOpen(true)}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {totalItems > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                                    {totalItems}
                                </Badge>
                            )}
                        </Button>
                        
                        {isLoggedIn ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <User className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <div className="px-2 py-1.5 text-sm font-semibold">{userName}</div>
                                    <DropdownMenuSeparator />
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
                                variant="ghost" 
                                size="icon"
                                onClick={() => setShowLoginDialog(true)}
                            >
                                <User className="h-5 w-5" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>
            
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
    );
}

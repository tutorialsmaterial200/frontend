'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetFooter,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { ProductImage } from "@/components/ui/product-image";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { LoginDialog } from "@/components/auth/LoginDialog";

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const CartSidebar = ({ open, onOpenChange }: Props) => {
    const { items, updateQuantity, removeFromCart, clearCart, totalItems, totalPrice } = useCart();
    const router = useRouter();
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    // Check if user is logged in
    const isLoggedIn = () => {
        // Check for auth token in localStorage or cookie
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('authToken') || localStorage.getItem('token');
            return !!token;
        }
        return false;
    };

    const handleCheckout = () => {
        if (!isLoggedIn()) {
            // Show login dialog popup
            setShowLoginDialog(true);
        } else {
            // Proceed to checkout
            onOpenChange(false);
            router.push('/checkout');
        }
    };

    const handleLoginSuccess = () => {
        // After successful login, close dialog and proceed to checkout
        setShowLoginDialog(false);
        onOpenChange(false);
        router.push('/checkout');
    };

    return (
        <>
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="right" className="flex flex-col p-0 w-full sm:max-w-md h-full">
                <SheetHeader className="p-4 border-b flex-shrink-0">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Your Cart ({totalItems})
                    </SheetTitle>
                </SheetHeader>

                {items.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 p-6">
                        <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                        <p className="text-muted-foreground text-lg">Your cart is empty</p>
                        <Button onClick={() => onOpenChange(false)}>
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 overflow-hidden">
                            <ScrollArea className="h-full">
                                <div className="space-y-4 p-4">
                                    {items.map((item) => (
                                    <div key={item.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                                        <div className="relative w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                            <ProductImage
                                                src={item.image}
                                                alt={item.name}
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                                            <p className="text-lg font-bold mt-1">रू {item.price.toFixed(2)}</p>
                                            {item.stock <= 5 && (
                                                <p className="text-xs text-orange-600 mt-1">
                                                    Only {item.stock} left in stock
                                                </p>
                                            )}
                                            <div className="flex items-center gap-2 mt-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </Button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-7 w-7"
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 ml-auto text-destructive hover:text-destructive"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </ScrollArea>
                        </div>

                        <SheetFooter className="border-t p-4 flex-col gap-4 flex-shrink-0">
                            <div className="flex items-center justify-between w-full">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span className="text-xl font-bold">रू {totalPrice.toFixed(2)}</span>
                            </div>
                            <Button 
                                className="w-full" 
                                size="lg"
                                onClick={handleCheckout}
                            >
                                {isLoggedIn() ? 'Checkout' : 'Login to Checkout'}
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={clearCart}
                            >
                                Clear Cart
                            </Button>
                        </SheetFooter>
                    </>
                )}
            </SheetContent>
        </Sheet>
        
        <LoginDialog 
            open={showLoginDialog} 
            onOpenChange={setShowLoginDialog}
            onLoginSuccess={handleLoginSuccess}
        />
        </>
    );
};

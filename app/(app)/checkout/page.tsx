'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ProductImage } from '@/components/ui/product-image';
import { ArrowLeft, CreditCard, Truck, ShoppingBag, Wallet, Banknote, X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { LoginDialog } from '@/components/auth/LoginDialog';
import Link from 'next/link';
import { checkAuth } from '@/lib/auth';
import { getUser } from '@/lib/auth';
import { Navbar } from '../(home)/navbar';

const nepalProvinces = [
    { value: 'koshi', label: 'Koshi Province' },
    { value: 'madhesh', label: 'Madhesh Province' },
    { value: 'bagmati', label: 'Bagmati Province' },
    { value: 'gandaki', label: 'Gandaki Province' },
    { value: 'lumbini', label: 'Lumbini Province' },
    { value: 'karnali', label: 'Karnali Province' },
    { value: 'sudurpashchim', label: 'Sudurpashchim Province' },
];

const nepalDistricts: Record<string, string[]> = {
    koshi: ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Solukhumbu', 'Sunsari', 'Taplejung', 'Terhathum', 'Udayapur'],
    madhesh: ['Bara', 'Dhanusha', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi', 'Siraha'],
    bagmati: ['Bhaktapur', 'Chitwan', 'Dhading', 'Dolakha', 'Kathmandu', 'Kavrepalanchok', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchok'],
    gandaki: ['Baglung', 'Gorkha', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Nawalpur', 'Parbat', 'Syangja', 'Tanahun'],
    lumbini: ['Arghakhanchi', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu', 'Palpa', 'Parasi', 'Pyuthan', 'Rolpa', 'Rukum East', 'Rupandehi'],
    karnali: ['Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Rukum West', 'Salyan', 'Surkhet'],
    sudurpashchim: ['Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Darchula', 'Doti', 'Kailali', 'Kanchanpur'],
};

type PaymentMethod = 'esewa' | 'khalti' | 'cash';

export default function CheckoutPage() {
    const router = useRouter();
    const { items, totalItems, totalPrice, clearCart, removeFromCart } = useCart();
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginDialog, setShowLoginDialog] = useState(false);

    useEffect(() => {
        // Check if user is logged in with backend verification
        const verifyAuth = async () => {
            if (typeof window !== 'undefined') {
                const isAuthenticated = await checkAuth();
                if (!isAuthenticated) {
                    // Show login dialog instead of redirecting
                    setShowLoginDialog(true);
                    setIsLoggedIn(false);
                } else {
                    setIsLoggedIn(true);
                    
                    // Auto-fill user information
                    const user = getUser();
                    if (user) {
                        setFormData(prev => ({
                            ...prev,
                            fullName: user.name || '',
                            email: user.email || '',
                            phone: user.phone || '',
                        }));
                    }
                }
                setIsLoading(false);
            }
        };

        verifyAuth();
    }, []);

    const handleLoginSuccess = () => {
        // After successful login, close dialog and set logged in state
        setShowLoginDialog(false);
        setIsLoggedIn(true);
        
        // Auto-fill user information after login
        const user = getUser();
        if (user) {
            setFormData(prev => ({
                ...prev,
                fullName: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
            }));
        }
    };

    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        phone: '',
        province: '',
        district: '',
        municipality: '',
        wardNo: '',
        tole: '',
        nearbyLandmark: '',
        esewaId: '',
        khaltiId: '',
        promoCode: '',
    });
    
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [promoApplied, setPromoApplied] = useState(false);

    const applyPromoCode = () => {
        const code = formData.promoCode.toUpperCase();
        setPromoError('');
        
        // Sample promo codes - replace with API call in production
        const promoCodes: Record<string, number> = {
            'SAVE10': 10,
            'SAVE20': 20,
            'FIRSTORDER': 15,
            'WELCOME': 5,
        };
        
        if (promoCodes[code]) {
            setPromoDiscount(promoCodes[code]);
            setPromoApplied(true);
        } else {
            setPromoError('Invalid promo code');
            setPromoDiscount(0);
            setPromoApplied(false);
        }
    };

    const removePromoCode = () => {
        setFormData(prev => ({ ...prev, promoCode: '' }));
        setPromoDiscount(0);
        setPromoError('');
        setPromoApplied(false);
    };

    const discountAmount = (totalPrice * promoDiscount) / 100;
    const finalTotal = (totalPrice - discountAmount) * 1.13;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            ...(name === 'province' ? { district: '' } : {})
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        clearCart();
        router.push('/checkout/success');
    };

    const availableDistricts = formData.province ? nepalDistricts[formData.province] || [] : [];

    if (items.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <ShoppingBag className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-6">Add some products to checkout</p>
                    <Link href="/">
                        <Button>Continue Shopping</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Spinner className="w-12 h-12" />
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <>
        <Navbar />
        <div className={`min-h-screen bg-muted/30 ${!isLoggedIn ? 'pointer-events-none blur-sm' : ''}`}>
            <div className="container mx-auto px-4 py-8">
                <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Shopping
                </Link>

                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="w-5 h-5" />
                                        Shipping Information
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="fullName">Full Name</Label>
                                            <Input
                                                id="fullName"
                                                name="fullName"
                                                placeholder="Ram Bahadur Shrestha"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="phone">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                placeholder="+977 98XXXXXXXX"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="your@email.com"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="province">Province</Label>
                                            <Select
                                                value={formData.province}
                                                onValueChange={(value) => handleSelectChange('province', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Province" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {nepalProvinces.map((province) => (
                                                        <SelectItem key={province.value} value={province.value}>
                                                            {province.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label htmlFor="district">District</Label>
                                            <Select
                                                value={formData.district}
                                                onValueChange={(value) => handleSelectChange('district', value)}
                                                disabled={!formData.province}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select District" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {availableDistricts.map((district) => (
                                                        <SelectItem key={district} value={district.toLowerCase()}>
                                                            {district}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="municipality">Municipality / Rural Municipality</Label>
                                            <Input
                                                id="municipality"
                                                name="municipality"
                                                placeholder="e.g., Kathmandu Metropolitan City"
                                                value={formData.municipality}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="wardNo">Ward No.</Label>
                                            <Input
                                                id="wardNo"
                                                name="wardNo"
                                                placeholder="e.g., 10"
                                                value={formData.wardNo}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="tole">Tole / Street Address</Label>
                                        <Input
                                            id="tole"
                                            name="tole"
                                            placeholder="e.g., New Baneshwor, Madan Bhandari Path"
                                            value={formData.tole}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="nearbyLandmark">Nearby Landmark (Optional)</Label>
                                        <Input
                                            id="nearbyLandmark"
                                            name="nearbyLandmark"
                                            placeholder="e.g., Near Bhatbhateni Supermarket"
                                            value={formData.nearbyLandmark}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Wallet className="w-5 h-5" />
                                        Payment Method
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <RadioGroup
                                        value={paymentMethod}
                                        onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}
                                        className="space-y-3"
                                    >
                                        <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'esewa' ? 'border-green-500 bg-green-50' : 'hover:bg-muted/50'}`}>
                                            <RadioGroupItem value="esewa" id="esewa" />
                                            <Label htmlFor="esewa" className="flex items-center gap-3 cursor-pointer flex-1">
                                                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                    eSewa
                                                </div>
                                                <div>
                                                    <p className="font-medium">eSewa</p>
                                                    <p className="text-sm text-muted-foreground">Pay with eSewa mobile wallet</p>
                                                </div>
                                            </Label>
                                        </div>

                                        <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'khalti' ? 'border-purple-500 bg-purple-50' : 'hover:bg-muted/50'}`}>
                                            <RadioGroupItem value="khalti" id="khalti" />
                                            <Label htmlFor="khalti" className="flex items-center gap-3 cursor-pointer flex-1">
                                                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                                                    K
                                                </div>
                                                <div>
                                                    <p className="font-medium">Khalti</p>
                                                    <p className="text-sm text-muted-foreground">Pay with Khalti digital wallet</p>
                                                </div>
                                            </Label>
                                        </div>

                                        <div className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'hover:bg-muted/50'}`}>
                                            <RadioGroupItem value="cash" id="cash" />
                                            <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                                                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                                                    <Banknote className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Cash on Delivery</p>
                                                    <p className="text-sm text-muted-foreground">Pay when you receive your order</p>
                                                </div>
                                            </Label>
                                        </div>
                                    </RadioGroup>

                                    {paymentMethod === 'esewa' && (
                                        <div className="pt-4 border-t">
                                            <Label htmlFor="esewaId">eSewa ID (Mobile Number)</Label>
                                            <Input
                                                id="esewaId"
                                                name="esewaId"
                                                type="tel"
                                                placeholder="98XXXXXXXX"
                                                value={formData.esewaId}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                You will receive a payment request on your eSewa app
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === 'khalti' && (
                                        <div className="pt-4 border-t">
                                            <Label htmlFor="khaltiId">Khalti ID (Mobile Number)</Label>
                                            <Input
                                                id="khaltiId"
                                                name="khaltiId"
                                                type="tel"
                                                placeholder="98XXXXXXXX"
                                                value={formData.khaltiId}
                                                onChange={handleInputChange}
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                You will receive a payment request on your Khalti app
                                            </p>
                                        </div>
                                    )}

                                    {paymentMethod === 'cash' && (
                                        <div className="pt-4 border-t">
                                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                                <p className="text-sm text-orange-800">
                                                    Please keep the exact amount ready. Our delivery partner will collect रू {finalTotal.toFixed(2)} upon delivery.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-3 group">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                                    <ProductImage
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                                                            title="Remove item"
                                                        >
                                                            <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                    <p className="text-sm font-bold">रू {(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    <div className="space-y-3">
                                        <Label htmlFor="promoCode">Promo Code</Label>
                                        <div className="flex gap-2">
                                            <Input
                                                id="promoCode"
                                                name="promoCode"
                                                placeholder="Enter promo code"
                                                value={formData.promoCode}
                                                onChange={handleInputChange}
                                                disabled={promoApplied}
                                                className={promoApplied ? 'bg-green-50' : ''}
                                            />
                                            {!promoApplied ? (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={applyPromoCode}
                                                    disabled={!formData.promoCode}
                                                >
                                                    Apply
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={removePromoCode}
                                                    className="text-red-600"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>
                                        {promoError && (
                                            <p className="text-sm text-red-600">{promoError}</p>
                                        )}
                                        {promoApplied && (
                                            <p className="text-sm text-green-600">
                                                ✓ Promo code applied! {promoDiscount}% discount
                                            </p>
                                        )}
                                    </div>

                                    <Separator />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal ({totalItems} items)</span>
                                            <span>रू {totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Shipping</span>
                                            <span>Free</span>
                                        </div>
                                        {promoDiscount > 0 && (
                                            <div className="flex justify-between text-sm text-green-600">
                                                <span>Discount ({promoDiscount}%)</span>
                                                <span>- रू {discountAmount.toFixed(2)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">VAT (13%)</span>
                                            <span>रू {((totalPrice - discountAmount) * 0.13).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className={promoDiscount > 0 ? 'text-green-600' : ''}>
                                            रू {finalTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    {promoDiscount > 0 && (
                                        <div className="text-sm text-muted-foreground text-center">
                                            You saved रू {(discountAmount * 1.13).toFixed(2)}!
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <CreditCard className="w-4 h-4" />
                                        <span>
                                            {paymentMethod === 'esewa' && 'Pay via eSewa'}
                                            {paymentMethod === 'khalti' && 'Pay via Khalti'}
                                            {paymentMethod === 'cash' && 'Cash on Delivery'}
                                        </span>
                                    </div>

                                    <Button 
                                        type="submit" 
                                        className="w-full" 
                                        size="lg"
                                        disabled={isProcessing}
                                    >
                                        {isProcessing ? 'Processing...' : paymentMethod === 'cash' ? 'Place Order' : 'Pay Now'}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
        <LoginDialog 
            open={showLoginDialog} 
            onOpenChange={setShowLoginDialog}
            onLoginSuccess={handleLoginSuccess}
        />
        </>
    );
}

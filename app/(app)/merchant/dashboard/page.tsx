'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '../../(home)/navbar';
import { checkAuth, getUser } from '@/lib/auth';
import { hasRole } from '@/lib/role-redirect';
import { 
    Store, 
    Package, 
    ShoppingBag, 
    DollarSign, 
    TrendingUp, 
    BarChart3,
    Clock,
    FileText,
    AlertCircle
} from 'lucide-react';

interface User {
    name?: string;
    email?: string;
    role?: string;
    isMerchantVerified?: boolean;
    isVerified?: boolean;
}

export default function MerchantDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const verifyAccess = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                router.push('/');
                return;
            }

            const userData = getUser();
            if (!userData || !hasRole('MERCHANT')) {
                router.push('/');
                return;
            }

            // Check if user is verified
            if (!userData.isVerified) {
                alert('⚠️ Your account must be verified to access the merchant dashboard. Please verify your account in your profile.');
                router.push('/profile');
                return;
            }

            // Check if merchant is verified - allow access but show pending message
            setUser(userData);
            setIsLoading(false);
        };

        verifyAccess();
    }, [router]);

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </>
        );
    }

    const stats = [
        { label: 'Total Products', value: '45', icon: Package, color: 'text-blue-500' },
        { label: 'Active Orders', value: '23', icon: ShoppingBag, color: 'text-green-500' },
        { label: 'This Month Sales', value: 'रू 45,678', icon: DollarSign, color: 'text-yellow-500' },
        { label: 'Growth', value: '+12.5%', icon: TrendingUp, color: 'text-purple-500' },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Store className="w-8 h-8 text-primary" />
                                <h1 className="text-3xl font-bold">Merchant Dashboard</h1>
                            </div>
                            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                        </div>
                        <Badge variant="default" className="bg-purple-500">MERCHANT</Badge>
                    </div>

                    {/* Merchant Verification Pending Alert */}
                    {!user?.isMerchantVerified && (
                        <Card className="mb-8 border-yellow-200 bg-yellow-50/50">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0">
                                        <Clock className="w-8 h-8 text-yellow-600" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5" />
                                            Merchant Verification Pending
                                        </h3>
                                        <p className="text-yellow-800 mb-4">
                                            Your merchant application is currently under review. You&apos;ll have full access to all merchant features once your account is verified.
                                        </p>
                                        <div className="bg-white rounded-lg p-4 space-y-2">
                                            <h4 className="font-semibold text-sm text-yellow-900">What&apos;s happening:</h4>
                                            <ul className="space-y-2 text-sm text-yellow-800">
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-600 mt-0.5">✓</span>
                                                    <span>Your KYC information has been submitted</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <span className="text-green-600 mt-0.5">✓</span>
                                                    <span>Business documents are under review</span>
                                                </li>
                                                <li className="flex items-start gap-2">
                                                    <Clock className="w-4 h-4 text-yellow-600 mt-0.5" />
                                                    <span>Awaiting admin approval (usually within 24-48 hours)</span>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            <Button 
                                                variant="outline" 
                                                onClick={() => router.push('/merchant/verification')}
                                                className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
                                            >
                                                <FileText className="w-4 h-4 mr-2" />
                                                View Application Status
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <Card key={stat.label}>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                                            <p className="text-2xl font-bold">{stat.value}</p>
                                        </div>
                                        <stat.icon className={`w-8 h-8 ${stat.color}`} />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="w-5 h-5" />
                                    My Products
                                </CardTitle>
                                <CardDescription>Manage your product inventory</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Products</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5" />
                                    Orders
                                </CardTitle>
                                <CardDescription>View and process orders</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Orders</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" />
                                    Sales Analytics
                                </CardTitle>
                                <CardDescription>Track your sales performance</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Analytics</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Payments
                                </CardTitle>
                                <CardDescription>Manage payments and payouts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Payments</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="w-5 h-5" />
                                    Store Settings
                                </CardTitle>
                                <CardDescription>Configure your store details</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Settings</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5" />
                                    Promotions
                                </CardTitle>
                                <CardDescription>Create and manage promotions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Manage Promos</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

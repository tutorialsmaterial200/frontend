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
    Bike, 
    MapPin, 
    Package, 
    DollarSign, 
    Clock, 
    CheckCircle
} from 'lucide-react';

interface User {
    name?: string;
    email?: string;
    role?: string;
}

export default function RiderDashboard() {
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
            if (!userData || !hasRole('RIDER')) {
                router.push('/');
                return;
            }

            // Check if user is verified
            if (!userData.isVerified) {
                alert('⚠️ Your account must be verified to access the rider dashboard. Please verify your account in your profile.');
                router.push('/profile');
                return;
            }

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
        { label: 'Active Deliveries', value: '3', icon: Package, color: 'text-blue-500' },
        { label: 'Completed Today', value: '12', icon: CheckCircle, color: 'text-green-500' },
        { label: "Today's Earnings", value: 'रू 2,345', icon: DollarSign, color: 'text-yellow-500' },
        { label: 'Avg. Time', value: '25 min', icon: Clock, color: 'text-purple-500' },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Bike className="w-8 h-8 text-primary" />
                                <h1 className="text-3xl font-bold">Rider Dashboard</h1>
                            </div>
                            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                        </div>
                        <Badge variant="default" className="bg-orange-500">RIDER</Badge>
                    </div>

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
                                    Active Deliveries
                                </CardTitle>
                                <CardDescription>View your current delivery tasks</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Deliveries</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5" />
                                    Available Orders
                                </CardTitle>
                                <CardDescription>Accept new delivery orders</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Browse Orders</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Delivery History
                                </CardTitle>
                                <CardDescription>View completed deliveries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View History</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="w-5 h-5" />
                                    Earnings
                                </CardTitle>
                                <CardDescription>Track your earnings and payouts</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Earnings</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Schedule
                                </CardTitle>
                                <CardDescription>Manage your availability</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Set Schedule</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bike className="w-5 h-5" />
                                    Profile
                                </CardTitle>
                                <CardDescription>Update your rider profile</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Edit Profile</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

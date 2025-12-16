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
    Headphones, 
    MessageSquare, 
    Users, 
    AlertCircle, 
    CheckCircle, 
    Clock
} from 'lucide-react';

export default function SupportDashboard() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const verifyAccess = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                router.push('/');
                return;
            }

            const userData = getUser();
            if (!userData || !hasRole('SUPPORT')) {
                router.push('/');
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
        { label: 'Open Tickets', value: '15', icon: AlertCircle, color: 'text-red-500' },
        { label: 'In Progress', value: '8', icon: Clock, color: 'text-yellow-500' },
        { label: 'Resolved Today', value: '32', icon: CheckCircle, color: 'text-green-500' },
        { label: 'Active Chats', value: '5', icon: MessageSquare, color: 'text-blue-500' },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-muted/30">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Headphones className="w-8 h-8 text-primary" />
                                <h1 className="text-3xl font-bold">Support Dashboard</h1>
                            </div>
                            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
                        </div>
                        <Badge variant="default" className="bg-cyan-500">SUPPORT</Badge>
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
                                    <AlertCircle className="w-5 h-5" />
                                    Open Tickets
                                </CardTitle>
                                <CardDescription>View and respond to open tickets</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Tickets</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Live Chat
                                </CardTitle>
                                <CardDescription>Handle live customer chats</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Open Chat</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Customer Info
                                </CardTitle>
                                <CardDescription>Search customer information</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Search Users</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    Resolved Tickets
                                </CardTitle>
                                <CardDescription>View resolved ticket history</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View History</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Pending Review
                                </CardTitle>
                                <CardDescription>Tickets awaiting review</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">Review Queue</Button>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Headphones className="w-5 h-5" />
                                    Knowledge Base
                                </CardTitle>
                                <CardDescription>Access support resources</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button className="w-full">View Resources</Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

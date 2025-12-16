'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Navbar } from '../../(home)/navbar';
import { checkAuth, getUser } from '@/lib/auth';
import { hasRole } from '@/lib/role-redirect';
import { 
    Bike,
    Search,
    Filter,
    Download,
    UserPlus,
    Mail,
    Phone,
    MoreVertical,
    Edit,
    Trash2,
    Ban,
    CheckCircle,
    Clock,
    DollarSign,
    Star
} from 'lucide-react';

interface Rider {
    id: string;
    name: string;
    email: string;
    phone: string;
    vehicleType: string;
    vehicleNumber: string;
    status: 'active' | 'inactive' | 'pending' | 'suspended';
    rating: number;
    totalRides: number;
    earnings: string;
    city: string;
    joinedDate: string;
}

export default function RidersManagement() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [riders, setRiders] = useState<Rider[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const verifyAccess = async () => {
            const isAuthenticated = await checkAuth();
            if (!isAuthenticated) {
                router.push('/');
                return;
            }

            const userData = getUser();
            if (!userData || !hasRole('ADMIN')) {
                router.push('/');
                return;
            }

            // Mock data
            setRiders([
                { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '+977 9812345678', vehicleType: 'Motorcycle', vehicleNumber: 'BA 12 PA 1234', status: 'active', rating: 4.8, totalRides: 234, earnings: 'रू 45,678', city: 'Kathmandu', joinedDate: '2024-01-15' },
                { id: '2', name: 'Suresh Thapa', email: 'suresh@example.com', phone: '+977 9823456789', vehicleType: 'Scooter', vehicleNumber: 'BA 13 PA 5678', status: 'active', rating: 4.5, totalRides: 189, earnings: 'रू 38,945', city: 'Lalitpur', joinedDate: '2024-02-20' },
                { id: '3', name: 'Amit Shrestha', email: 'amit@example.com', phone: '+977 9834567890', vehicleType: 'Car', vehicleNumber: 'BA 14 PA 9012', status: 'pending', rating: 0, totalRides: 0, earnings: 'रू 0', city: 'Bhaktapur', joinedDate: '2024-12-10' },
                { id: '4', name: 'Bikram Rai', email: 'bikram@example.com', phone: '+977 9845678901', vehicleType: 'Motorcycle', vehicleNumber: 'BA 15 PA 3456', status: 'suspended', rating: 3.2, totalRides: 45, earnings: 'रू 12,345', city: 'Pokhara', joinedDate: '2024-10-05' },
            ]);
            setIsLoading(false);
        };

        verifyAccess();
    }, [router]);

    const filteredRiders = riders.filter(rider => {
        const matchesSearch = rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            rider.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            rider.vehicleNumber.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || rider.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-700',
            pending: 'bg-yellow-100 text-yellow-700',
            suspended: 'bg-red-100 text-red-700'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
    };

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

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                                <Bike className="w-8 h-8 text-orange-600" />
                                Rider Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage all riders and their activities</p>
                        </div>
                        <Button className="bg-orange-600 hover:bg-orange-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add New Rider
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Riders</p>
                                        <p className="text-2xl font-bold text-gray-900">{riders.length}</p>
                                    </div>
                                    <Bike className="w-6 h-6 text-orange-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Active</p>
                                        <p className="text-2xl font-bold text-green-600">{riders.filter(r => r.status === 'active').length}</p>
                                    </div>
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Pending</p>
                                        <p className="text-2xl font-bold text-yellow-600">{riders.filter(r => r.status === 'pending').length}</p>
                                    </div>
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Earnings</p>
                                        <p className="text-2xl font-bold text-purple-600">रू 96K</p>
                                    </div>
                                    <DollarSign className="w-6 h-6 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <Input
                                        placeholder="Search by name, email, or vehicle number..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="pending">Pending</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                                <Button variant="outline">
                                    <Filter className="w-4 h-4 mr-2" />
                                    More Filters
                                </Button>
                                <Button variant="outline">
                                    <Download className="w-4 h-4 mr-2" />
                                    Export
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Riders Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Riders ({filteredRiders.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-semibold text-gray-700">Rider</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Vehicle</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Rating</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Rides</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Earnings</th>
                                            <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRiders.map((rider) => (
                                            <tr key={rider.id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {rider.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{rider.name}</p>
                                                            <p className="text-sm text-gray-600">{rider.city}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                            <span>{rider.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span>{rider.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{rider.vehicleType}</p>
                                                        <p className="text-sm text-gray-600">{rider.vehicleNumber}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={getStatusBadge(rider.status)}>
                                                        {rider.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="font-semibold">{rider.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-semibold text-gray-900">{rider.totalRides}</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className="font-semibold text-green-600">{rider.earnings}</span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Button size="sm" variant="ghost">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="text-orange-600">
                                                            <Ban className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost" className="text-red-600">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                        <Button size="sm" variant="ghost">
                                                            <MoreVertical className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

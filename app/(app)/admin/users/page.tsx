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
    Users, 
    Search,
    Filter,
    Download,
    UserPlus,
    Mail,
    Phone,
    MapPin,
    MoreVertical,
    Edit,
    Trash2,
    Ban,
    CheckCircle
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
    status: 'active' | 'inactive' | 'banned';
    city: string;
    createdAt: string;
}

export default function UsersManagement() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterRole, setFilterRole] = useState('all');

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

            // Fetch users from API
            // Temporary mock data
            setUsers([
                { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+977 9812345678', role: 'CUSTOMER', status: 'active', city: 'Kathmandu', createdAt: '2024-01-15' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+977 9823456789', role: 'MERCHANT', status: 'active', city: 'Pokhara', createdAt: '2024-02-20' },
                { id: '3', name: 'Bob Wilson', email: 'bob@example.com', phone: '+977 9834567890', role: 'RIDER', status: 'active', city: 'Lalitpur', createdAt: '2024-03-10' },
                { id: '4', name: 'Alice Brown', email: 'alice@example.com', phone: '+977 9845678901', role: 'CUSTOMER', status: 'inactive', city: 'Bhaktapur', createdAt: '2024-04-05' },
            ]);
            setIsLoading(false);
        };

        verifyAccess();
    }, [router]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = filterRole === 'all' || user.role === filterRole;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: string) => {
        const colors = {
            CUSTOMER: 'bg-blue-100 text-blue-700',
            MERCHANT: 'bg-purple-100 text-purple-700',
            RIDER: 'bg-orange-100 text-orange-700',
            ADMIN: 'bg-red-100 text-red-700'
        };
        return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-700';
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-yellow-100 text-yellow-700',
            banned: 'bg-red-100 text-red-700'
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
                                <Users className="w-8 h-8 text-blue-600" />
                                User Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage all users in the system</p>
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add New User
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Users</p>
                                        <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Active</p>
                                        <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
                                    </div>
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Merchants</p>
                                        <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.role === 'MERCHANT').length}</p>
                                    </div>
                                    <div className="w-6 h-6 text-purple-600">🏪</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Riders</p>
                                        <p className="text-2xl font-bold text-orange-600">{users.filter(u => u.role === 'RIDER').length}</p>
                                    </div>
                                    <div className="w-6 h-6 text-orange-600">🏍️</div>
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
                                        placeholder="Search by name or email..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <select
                                    value={filterRole}
                                    onChange={(e) => setFilterRole(e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white"
                                >
                                    <option value="all">All Roles</option>
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="MERCHANT">Merchant</option>
                                    <option value="RIDER">Rider</option>
                                    <option value="ADMIN">Admin</option>
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

                    {/* Users Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-semibold text-gray-700">User</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Role</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Location</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Joined</th>
                                            <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{user.name}</p>
                                                            <p className="text-sm text-gray-600">{user.id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                            <span>{user.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span>{user.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={getRoleBadge(user.role)}>
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={getStatusBadge(user.status)}>
                                                        {user.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <MapPin className="w-4 h-4 text-gray-400" />
                                                        <span>{user.city}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-sm text-gray-600">
                                                    {new Date(user.createdAt).toLocaleDateString()}
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

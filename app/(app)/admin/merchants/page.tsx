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
    Store,
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
    Package,
    ShoppingBag,
    FileCheck
} from 'lucide-react';

interface Merchant {
    id: string;
    name: string;
    email: string;
    phone: string;
    businessName: string;
    businessType: string;
    sellerType: string;
    verificationStatus: 'verified' | 'pending' | 'rejected';
    status: 'active' | 'inactive' | 'suspended';
    productsCount: number;
    ordersCount: number;
    city: string;
    joinedDate: string;
}

export default function MerchantsManagement() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [merchants, setMerchants] = useState<Merchant[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterVerification, setFilterVerification] = useState('all');

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
            setMerchants([
                { id: '1', name: 'Ram Prasad', email: 'ram@example.com', phone: '+977 9812345678', businessName: 'Ram Electronics', businessType: 'Electronics', sellerType: 'Corporate', verificationStatus: 'verified', status: 'active', productsCount: 45, ordersCount: 234, city: 'Kathmandu', joinedDate: '2024-01-15' },
                { id: '2', name: 'Sita Devi', email: 'sita@example.com', phone: '+977 9823456789', businessName: 'Sita Fashion Store', businessType: 'Fashion', sellerType: 'Individual', verificationStatus: 'verified', status: 'active', productsCount: 78, ordersCount: 456, city: 'Lalitpur', joinedDate: '2024-02-20' },
                { id: '3', name: 'Hari Sharma', email: 'hari@example.com', phone: '+977 9834567890', businessName: 'Hari Books & Stationery', businessType: 'Books', sellerType: 'Individual', verificationStatus: 'pending', status: 'inactive', productsCount: 0, ordersCount: 0, city: 'Bhaktapur', joinedDate: '2024-12-10' },
                { id: '4', name: 'Krishna Bhattarai', email: 'krishna@example.com', phone: '+977 9845678901', businessName: 'Krishna Handicrafts', businessType: 'Handicrafts', sellerType: 'Corporate', verificationStatus: 'rejected', status: 'suspended', productsCount: 12, ordersCount: 23, city: 'Pokhara', joinedDate: '2024-10-05' },
            ]);
            setIsLoading(false);
        };

        verifyAccess();
    }, [router]);

    const filteredMerchants = merchants.filter(merchant => {
        const matchesSearch = merchant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            merchant.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            merchant.businessName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesVerification = filterVerification === 'all' || merchant.verificationStatus === filterVerification;
        return matchesSearch && matchesVerification;
    });

    const getVerificationBadge = (status: string) => {
        const colors = {
            verified: 'bg-green-100 text-green-700',
            pending: 'bg-yellow-100 text-yellow-700',
            rejected: 'bg-red-100 text-red-700'
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-700';
    };

    const getStatusBadge = (status: string) => {
        const colors = {
            active: 'bg-green-100 text-green-700',
            inactive: 'bg-gray-100 text-gray-700',
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
                                <Store className="w-8 h-8 text-purple-600" />
                                Merchant Management
                            </h1>
                            <p className="text-gray-600 mt-1">Manage all merchants and their businesses</p>
                        </div>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add New Merchant
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Merchants</p>
                                        <p className="text-2xl font-bold text-gray-900">{merchants.length}</p>
                                    </div>
                                    <Store className="w-6 h-6 text-purple-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Verified</p>
                                        <p className="text-2xl font-bold text-green-600">{merchants.filter(m => m.verificationStatus === 'verified').length}</p>
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
                                        <p className="text-2xl font-bold text-yellow-600">{merchants.filter(m => m.verificationStatus === 'pending').length}</p>
                                    </div>
                                    <Clock className="w-6 h-6 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Total Products</p>
                                        <p className="text-2xl font-bold text-blue-600">{merchants.reduce((sum, m) => sum + m.productsCount, 0)}</p>
                                    </div>
                                    <Package className="w-6 h-6 text-blue-600" />
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
                                        placeholder="Search by name, email, or business name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <select
                                    value={filterVerification}
                                    onChange={(e) => setFilterVerification(e.target.value)}
                                    className="px-4 py-2 border rounded-lg bg-white"
                                >
                                    <option value="all">All Verification Status</option>
                                    <option value="verified">Verified</option>
                                    <option value="pending">Pending</option>
                                    <option value="rejected">Rejected</option>
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

                    {/* Merchants Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>All Merchants ({filteredMerchants.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-4 font-semibold text-gray-700">Merchant</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Contact</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Business</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Type</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Verification</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Products</th>
                                            <th className="text-left p-4 font-semibold text-gray-700">Orders</th>
                                            <th className="text-right p-4 font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredMerchants.map((merchant) => (
                                            <tr key={merchant.id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                            {merchant.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">{merchant.name}</p>
                                                            <p className="text-sm text-gray-600">{merchant.city}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Mail className="w-4 h-4 text-gray-400" />
                                                            <span>{merchant.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Phone className="w-4 h-4 text-gray-400" />
                                                            <span>{merchant.phone}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div>
                                                        <p className="font-medium text-gray-900">{merchant.businessName}</p>
                                                        <p className="text-sm text-gray-600">{merchant.businessType}</p>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <Badge variant="outline">{merchant.sellerType}</Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={getVerificationBadge(merchant.verificationStatus)}>
                                                        {merchant.verificationStatus}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <Badge className={getStatusBadge(merchant.status)}>
                                                        {merchant.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                        <span className="font-semibold">{merchant.productsCount}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-1">
                                                        <ShoppingBag className="w-4 h-4 text-gray-400" />
                                                        <span className="font-semibold">{merchant.ordersCount}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {merchant.verificationStatus === 'pending' && (
                                                            <Button size="sm" variant="ghost" className="text-green-600">
                                                                <FileCheck className="w-4 h-4" />
                                                            </Button>
                                                        )}
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
